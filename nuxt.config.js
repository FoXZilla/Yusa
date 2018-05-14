const webpack=require('webpack');

const parseArgs=require("minimist");
const argv=parseArgs(process.argv.slice(2),{
    alias:{
        H:"hostname",
        p:"port"
    },
    string:["H"],
    unknown:parameter=>false
});

const port=
    argv.port
    || process.env.PORT
    || process.env.npm_package_config_nuxt_port
    || "3003"
;
var fireFrontUrl=
    process.env.FireFront
    || process.env.firefront
    || process.env.FIREFRONT
    || `http://localhost:${port}`
;
var fireApiUrl=
    process.env.FIREAPI
    || process.env.fireapi
    || process.env.FireApi
    || 'https://localhost:3002'
;
if(fireFrontUrl.includes(':')){
    process.env.PORT =fireFrontUrl.split(':').pop();
};
if(!fireFrontUrl.startsWith('http')) fireFrontUrl ='http://'+ fireFrontUrl;
if(!fireApiUrl.startsWith('http')) fireApiUrl ='http://'+ fireApiUrl;

console.log(`FireFront(itself): ${fireFrontUrl}, FireApi: ${fireApiUrl}`);
module.exports={
    env:{
        fireFrontUrl,
        fireApiUrl,
    },
    head:{
        meta:[
            {charset:"utf-8"},
            {
                name:"viewport",
                content:
                    "width=device-width, initial-scale=1"
            },
            {
                hid:"description",
                name:"fireblog",
                content:require('@foxzilla/fireblog/package').version,
            }
        ]
    },
    plugins:[
        {src:'~/plugins/csr',ssr:false},
        {src:'~/plugins/both'},
        {src:'~/plugins/i18n'},
    ],
    loading:{
        color:'#ff9b35',
        height:'3px'
    },
    css:[
        'bootstrap/scss/bootstrap.scss',
        'font-awesome/css/font-awesome.css',
        '@pea3nut/styles/scss/text-body.scss',
        '~assets/global.scss',
    ],
    build:{
        plugins: [
            new webpack.ProvidePlugin({
                '$': 'jquery',
                'jQuery': 'jquery',
            })
        ],
        vendor:[
            'tinytime',
            'marked',
            'axios',
            'vue-notification',
            'vue-i18n',
        ],
    },
    modules:[
        "@nuxtjs/axios",
        "~/modules/typescript.js",
    ],

    axios:{
        baseURL:fireApiUrl,
        credentials:true,
    },
}
