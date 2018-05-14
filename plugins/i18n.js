import Vue from 'vue';
import VueI18n from 'vue-i18n';

const Cookie =require('cookie');


Vue.use(VueI18n);

export const cookieKey ='lang';
export const messages ={
    en: require('~/locales/en'),
    'zh-CN': require('~/locales/zh-CN'),
};
export const options =[{
    text:'简体中文',
    id  :'zh-CN',
},{
    text:'English',
    id  :'en',
}];
export const i18n =new VueI18n({
    fallbackLocale: 'en',
    messages,
});


export default function(context){
    context.app.i18n =i18n;

    var cookie = Cookie.parse(process.server ? context.req.headers.cookie||'' : document.cookie);

    if(cookieKey in cookie){
        context.app.i18n.locale =cookie[cookieKey];
        return;
    }

    var perferLang = process.server ? function(){
        let langOption =context.req.headers['accept-language']
            .split(',')
            .map(str=>str.split(';'))
        ;
        langOption.forEach(item=> item[1] =typeof item[1]==='undefined' ?1 :parseFloat(item[1].split('=')[1]));
        langOption.sort((item1,item2)=>item2[1]-item1[1]);
        langOption =langOption.map(item=>item[0]);

        return langOption;
    }() : navigator.languages;

    for(let lang of perferLang){
        if(lang in messages){
            context.app.i18n.locale =lang;
            break;
        }
    }

}
