<template>
    <blog-main class="article-detail">
        <starry-breadcrumb :labelText="`${$t('current_position')}: `" :itemList="crumbList">
            <template v-if="articleInfo && articleInfo.category_list.length >1">
                <li class="breadcrumb-item ad-multiCategory">
                    <router-link
                        v-for="categoryAlias of articleInfo.category_list"
                        :key="categoryAlias"
                        :to="`/category/${categoryAlias}`"
                        v-text="categoryMap[categoryAlias].name"
                    ></router-link>
                </li>
                <li class="breadcrumb-item" v-text="articleId"></li>
            </template>
        </starry-breadcrumb>
        <div v-show="needPassword" class="ad-password container">
            <i class="fa fa-lock adp-icon"></i>
            <div class="adp-text">
                <h1>{{$t('require_password')}}</h1>
                <p>{{this.passwordHint || $t('default_password_hint')}}</p>

                <div class="input-group mb-3 adpt-form">
                    <input
                            class="form-control"
                            type="password"
                            v-model="inputPassword"
                            @keypress.enter="refreshArticle"
                            :class="{disabled:requesting}" :disabled="requesting"
                    />
                    <div class="input-group-prepend">
                        <button
                                class="btn btn-outline-success"
                                type="button"
                                @click="refreshArticle"
                                :class="{disabled:requesting}" :disabled="requesting"
                        >进入</button>
                    </div>
                </div>
            </div>
        </div>
        <article-show :article-info="articleInfo" v-if="articleInfo" @refresh-article="refreshArticle"></article-show>
    </blog-main>
</template>

<script lang="ts">
import Vue from "vue"
import {default as Component,Getter} from 'nuxt-class-component';
import {
    ApiErrorResponse ,
    ApiResponse ,
    ArticleInfo ,CategoryInfo ,
    Errcode ,
    Get ,
    IndexMap ,
    NeedPasswordResponse
} from "@foxzilla/fireblog";
import {default as Breadcrumb,CrumbItem} from '~/components/starry-breadcrumb.vue';
import Show from '~/components/article-show.vue';
import {fetchDeep} from '~/modules/jslib';
import Main from '~/components/blog-main.vue';
import {unwarpResponse} from "~/modules/lib";
import {Assert} from '@pea3nut/scripts/ts/function.both.ts';
import {countCategoryTrack} from "../../modules/lib";


@Component(fetchDeep({
    name :'article-detail',
    layout: 'default',
    async asyncData({store,params}){
        await Promise.all([
            store.dispatch('fetch/fetchArticleDetail',{
                articleId:params.id,
            }),
            store.dispatch('fetch/fetchCategory'),
        ]);
        return {
            articleId :params.id,
        }
    },
    head(){
        return {
            title: this.articleInfo?this.articleInfo.title:'',
        };
    },
    components :{
        'blog-main' :Main,
        'starry-breadcrumb' :Breadcrumb,
        'article-show' :Show,
    },
}))
export default class extends Vue {
    @Getter('fetch/categoryMap') categoryMap!:IndexMap<CategoryInfo['alias'],CategoryInfo>;

    articleId !:ArticleInfo['id'];

    needPassword =false;
    passwordHint?:string ='';
    get articleInfo():ArticleInfo|null{
        var response
            : Get.article.detail.$article_id.response
            | (NeedPasswordResponse|ApiErrorResponse)
            = this.$store.getters['fetch/articleDetail'](this.articleId)
        ;
        if(response.errcode ===Errcode.IncorrectPassword){
            this.needPassword =true;
            this.passwordHint =(<NeedPasswordResponse>response).password_hint;
            return null;
        };
        if(response.errcode){
            this.$notify({
                type :'error',
                title:'Error '+response.errcode,
                text :response.errmsg,
            });
            return null;
        }
        return unwarpResponse(response);
    };

    requesting =false;
    inputPassword ='';
    async refreshArticle(){
        if(this.requesting)return;
        else this.requesting=true;
        await this.$store.dispatch('fetch/fetchArticleDetail',{
            articleId :this.articleId,
            refresh   :true,
            query     :Assert<Get.article.detail.$article_id.query>({
                password :this.inputPassword,
            }),
        });
        this.requesting=false;
        var response:ApiResponse =this.$store.getters['fetch/articleDetail'](this.articleId);
        if(response.errcode ===Errcode.IncorrectPassword){
            this.$notify({
                type :'error',
                text :this.$t('incorrect_password') as string,
            });
        }else if(response.errcode) this.$notify({
            type :'error',
            title:'Error '+response.errcode,
            text :response.errmsg,
        });else{
           this.needPassword =false;
        };
    };

    get crumbList():CrumbItem[]{
        if(!this.articleInfo) return[];
        var list:CrumbItem[] =countCategoryTrack(this.articleInfo.category_list[0],this.categoryMap)
            .map(function(categoryInfo){
                return {
                    text :categoryInfo.name ,
                    link :`/category/${categoryInfo.alias}` ,
                }
            })
        ;
        list.push({
            text :this.articleInfo.id.toString(),
        });
        return list;
    };
}
</script>

<style lang="scss">
@import "~@pea3nut/styles/scss/variable";

.article-detail{
    .ad-multiCategory{
        a{
            &:last-child::after{
                display: none;
            }
            &::after{
                content:",";
                font-weight :bold;
                margin:0 3px;
                color:#6c757d;
            }
            margin-right: 3px;
        }
    }
    .ad-password{
        background: $peaCoolWhite;
        display: flex;
        padding: 30px 90px;
        margin-top: 80px;
        .adp-icon{
            font-size :200px;
        }
        .adp-text{
            margin:20px 0 0 30px;
            .adpt-form{
                margin-top :1.2em;
            }
        }
    }
    .article-show{
        margin-top: 20px;
    }
}
</style>