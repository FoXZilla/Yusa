import {ApiResponse ,CategoryInfo ,IndexMap} from "@foxzilla/fireblog";
import {i18n} from '~/plugins/i18n';

export function unwarpResponse<T>(res:ApiResponse):T{
    if(res.errcode) throw new Error(`API Response ${res.errcode}: ${res.errmsg}`);
    delete res.errcode;
    delete res.errmsg;
    return res as any;
};

export class FetchThat<T extends ApiResponse>{
    public method :'get'|'post'|'head';
    public path   :string;
    public axios  :any;
    constructor({method,path,axios}){
        this.method =method.toUpperCase();
        this.path   =path;
        this.axios  =axios;
    };
    get key():string{
        return `${this.method.toUpperCase()} ${this.path}`;
    };
    async wait(){
        await this.fetch();
        return this;
    }
    fetch():Promise<T>{
        return this.axios[`$${this.method.toLowerCase()}`](this.path).then(data=>this.fetchData=data);
    };
    fetchData?:T;
};

export function countCategoryTrack(
    categoryAlias :CategoryInfo['alias'],
    categoryMap   :IndexMap<CategoryInfo['alias'],CategoryInfo>,
):CategoryInfo[]{
    var categoryList:CategoryInfo[] =[];

    let alias =categoryAlias;
    while(alias){
        categoryList.unshift(categoryMap[alias]);
        alias =categoryMap[alias].parent_alias!;
    };

    return categoryList;
};
export function getAllChidenCategory(
    categoryAlias :CategoryInfo['alias'],
    categoryMap   :IndexMap<CategoryInfo['alias'],CategoryInfo>,
):CategoryInfo[]{
    var result:CategoryInfo[] =[];

    var stack:CategoryInfo[] =[categoryMap[categoryAlias]];

    let category:CategoryInfo|undefined;
    while(category =stack.pop()){
        for(let alias in categoryMap){
            if(categoryMap[alias].parent_alias ===category.alias) stack.push(categoryMap[alias]);
        }
        result.push(category);
    };

    return Array.from(new Set(result));

};

export function tryShotTime(time:Date|string):string|false{
    if(typeof time==='string') time=new Date(time);
    var diffTime =(new Date().getTime()-time.getTime())/1000;
    if(diffTime <60*60) return `${Math.ceil(diffTime/60)} ${i18n.t('minute_ago')}`;
    if(diffTime <60*60*24) return `${Math.ceil(diffTime/60/60)} ${i18n.t('hour_ago')}`;
    if(diffTime <60*60*24*10) return `${Math.ceil(diffTime/60/60/24)} ${i18n.t('day_ago')}`;
    return false;
};

import Marked from 'marked';

export function md(mdContent):string{
    var htmlString:string =Marked(mdContent);

    /*
        <blockquote>
          Hello, my name is pea3nut.
          &nbsp;
          Hey, pea3nut~
          &nbsp;
          Let's go~!
        </blockquote>

         |
         V

        <blockquote>
          Hello, my name is pea3nut.
          <br /><br />
          Hey, pea3nut~
          <br /><br />
          Let's go~!
        </blockquote>

    */
    htmlString =htmlString.replace(/<blockquote>([\w\W]*?)<\/blockquote>/g,function(metched ,p1){
        return metched.replace(p1,p1.replace(/^\s*&nbsp;\s*$/img,'<br /><br />'));
    });

    return htmlString;
};
