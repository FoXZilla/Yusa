import {
    ApiResponse ,ArticleInfo ,CategoryInfo ,Get ,IndexMap ,Omit ,TagInfo ,TokenInfo ,ToString ,
    UserInfo
} from "@foxzilla/fireblog";


import Vuex from 'vuex';
import {FetchThat ,unwarpResponse} from '~/modules/lib.ts';


var watchedLogin =false;
var tokenTimer:any =null;

export interface FetchState{
    tokenInfo     :Get.oauth.callback.$oauth_id.StorageValue|null;
    fetchArticle  :FetchThat<Get.article.all.response>|null;
    fetchCategory :FetchThat<Get.category.all.response>|null;
    fetchTag      :FetchThat<Get.tag.all.response>|null;
    fetchBlogInfo :FetchThat<Get.tag.all.response>|null;
    fetchArticleDetail :{
        [p:string] :FetchThat<Get.article.detail.$article_id.response>,
    },
    userInfoUpdated:number,
    articleDetailUpdated:number,
    fetchUserInfo :{
        [p:string] :FetchThat<Get.user.info.$user_id.response>,
    },
}

export const getters:{
    articleList   :(state:FetchState,payload?:any)=>Omit<ArticleInfo,'md_content'|'comment_list'>[],
    articleMap    :(state:FetchState,payload?:any)=>IndexMap<ToString<ArticleInfo['id']>,Omit<ArticleInfo,'md_content'|'comment_list'>>,
    categoryList  :(state:FetchState,payload?:any)=>CategoryInfo[],
    categoryMap   :(state:FetchState,payload?:any)=>IndexMap<CategoryInfo['alias'],CategoryInfo>|null,
    tagList       :(state:FetchState,payload?:any)=>TagInfo[],
    tagMap        :(state:FetchState,payload?:any)=>IndexMap<TagInfo['alias'],TagInfo>|null,
    articleDetail :(state:FetchState,payload?:any)=>((articleId:ArticleInfo['id'])=>ArticleInfo|null),
    userInfo      :(state:FetchState,payload?:any)=>((userId:UserInfo['id'])=>UserInfo|null),
    blogInfo      :(state:FetchState,payload?:any)=>Omit<Get.blog.info.response,'errmsg'|'errcode'>|null,
}={
    articleList(state:FetchState){
        if(!state.fetchArticle || !state.fetchArticle.fetchData)return [];
        else return Object.values(
            state.fetchArticle.fetchData.article_map
        ).sort(function(article1,article2){
            return new Date(article2.update_time).getTime() -new Date(article1.update_time).getTime()
        });
    },
    articleMap(state:FetchState){
        if(!state.fetchArticle || !state.fetchArticle.fetchData)return {};
        else return state.fetchArticle.fetchData.article_map;
    },
    categoryList(state:FetchState){
        if(!state.fetchCategory || !state.fetchCategory.fetchData)return [];
        else return Object.values(
            state.fetchCategory.fetchData.category_map
        );
    },
    categoryMap(state:FetchState){
        if(!state.fetchCategory || !state.fetchCategory.fetchData)return null;
        else return state.fetchCategory.fetchData.category_map;
    },
    tagList(state:FetchState){
        if(!state.fetchTag || !state.fetchTag.fetchData)return [];
        else return Object.values(
            state.fetchTag.fetchData.tag_map
        );
    },
    tagMap(state:FetchState){
        if(!state.fetchTag || !state.fetchTag.fetchData)return null;
        else return state.fetchTag.fetchData.tag_map;
    },
    articleDetail(state:FetchState){
        state.articleDetailUpdated;//magic
        return function(articleId:ArticleInfo['id']){
            if(state.fetchArticleDetail[articleId])
                return state.fetchArticleDetail[articleId].fetchData || null;
            else return null;
        };
    },
    userInfo(state:FetchState){
        state.userInfoUpdated;//magic
        return function(userId?:UserInfo['id']){
            if(!userId &&state.tokenInfo) userId=state.tokenInfo.user_id;
            if(state.fetchUserInfo[userId!])
                return state.fetchUserInfo[userId!].fetchData || null;
            else return null;
        };
    },
    blogInfo(state:FetchState){
        if(!state.fetchBlogInfo || !state.fetchBlogInfo.fetchData)return null;
        else return unwarpResponse(state.fetchBlogInfo.fetchData);
    },
};
export const actions ={
    async fetchCategory({state,commit},refresh=false){
        if(state.fetchCategory && !refresh)return;
        commit('set',{
            key  :'fetchCategory',
            value:await new FetchThat({
                method:'get',
                path:'/category/all',
                axios :this.$axios,
            }).wait(),
        });
    },
    async fetchTag({state,commit},refresh=false){
        if(state.fetchTag && !refresh)return;
        commit('set',{
            key  :'fetchTag',
            value:await new FetchThat({
                method:'get',
                path:'/tag/all',
                axios :this.$axios,
            }).wait(),
        });
    },
    async fetchBlogInfo({state,commit},refresh=false){
        if(state.fetchBlogInfo && !refresh)return;
        commit('set',{
            key  :'fetchBlogInfo',
            value:await new FetchThat({
                method:'get',
                path:'/blog/info',
                axios :this.$axios,
            }).wait(),
        });
    },
    async fetchArticle({state,commit,getters},{refresh=false}={}){
        if(state.fetchArticle && !refresh)return getters;
        commit('set',{
            key  :'fetchArticle',
            value:await new FetchThat({
                method:'get',
                path:'/article/all',
                axios :this.$axios,
            }).wait(),
        });
    },
    async fetchArticleDetail(
        {commit,state}:{commit:any,state:FetchState},
        {articleId,refresh=false,query={}}
            :{articleId:ArticleInfo['id'],refresh:boolean,query:Get.article.detail.$article_id.query}
        ,
    ){
        if(articleId in state.fetchArticleDetail && !refresh)return;
        commit('set' ,{
            key   :`fetchArticleDetail.${articleId}`,
            value :await new FetchThat({
                method:'get',
                path:`/article/detail/${articleId}?${new URLSearchParams(<any>query)}`,
                axios :this.$axios,
            }).wait(),
        });
        commit('set',{
            key   :'articleDetailUpdated',
            value :state.articleDetailUpdated+1,
        });
    },
    async fetchUserInfo({state,commit} ,userId?:UserInfo['id']){
        if(!userId && !state.tokenInfo)return;
        if(!userId) userId=state.tokenInfo.user_id;
        commit('set' ,{
            key   :`fetchUserInfo.${userId}`,
            value :await new FetchThat({
                method:'get',
                path:`/user/info/${userId}`,
                axios :this.$axios,
            }).wait(),
        });
        commit('set',{
            key   :'userInfoUpdated',
            value :state.userInfoUpdated+1,
        });
    },
    watchLogin({state,commit,dispatch}){
        if(watchedLogin)return;
        watchedLogin =true;
        window.addEventListener('storage',function _self(event:StorageEvent){
            if(event.key !== Get.oauth.callback.$oauth_id.Storage.Key)return;
            if(!event.newValue) dispatch('clearToken');
            else dispatch('setToken',JSON.parse(event.newValue));
        });
        dispatch('refreshToken');
    },
    setToken({commit,dispatch},token:TokenInfo){
        clearTimeout(tokenTimer);
        commit('set',{
            key :'tokenInfo',
            value :token,
        });
        dispatch('fetchUserInfo');
        tokenTimer=setTimeout(
            ()=>dispatch('clearToken'),
            new Date(token.age).getTime() -new Date().getTime(),
        );
    },
    async refreshToken({dispatch}){
        var response:ApiResponse =(await this.$axios.get(`/oauth/ping`)).data;
        if(response.errcode){
            dispatch('clearToken');
        }else{
            let tokenInfo =unwarpResponse(response);
            dispatch('setToken',tokenInfo);
            window.localStorage.setItem(
                Get.oauth.callback.$oauth_id.Storage.Key,
                JSON.stringify(tokenInfo)
            );
        };
    },
    clearToken({commit,state}){
        window.localStorage.removeItem(Get.oauth.callback.$oauth_id.Storage.Key);
        commit('set',{
            key :'tokenInfo',
            value :null ,
        });
        commit('set',{
            key   :'userInfoUpdated',
            value :state.userInfoUpdated+1,
        });
    },
};
export const state:()=>FetchState =function(){return{
    tokenInfo :null,
    fetchArticle :null,
    fetchCategory :null,
    fetchTag :null,
    fetchBlogInfo :null,
    fetchArticleDetail :{},
    fetchUserInfo :{},
    userInfoUpdated:0,
    articleDetailUpdated:0,
}};
export const mutations ={
    set(state,{key,value}){
        if(key.indexOf('.') ===-1){
            state[key]=value;
            return;
        };
        let that =state;
        let keys =key.split('.');
        for(let subKey of keys.slice(0,-1)){
            if(!(subKey in that)) that[subKey]={};
            that =that[subKey];
        };
        that[keys[keys.length-1]] =value;
    },
};

