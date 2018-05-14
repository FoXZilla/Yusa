<template>
    <blog-main class="blog-home">
        <div class="bh-banner">
            <div class="bhb-avatar" v-if="blogInfo.author.avatar">
                <img
                    :src="blogInfo.author.avatar"
                    :alt="blogInfo.author.names[0]"
                    width="150"
                    height="150"
                    class="bhba-img"
                />
            </div>
            <h1 v-text="blogInfo.author.names[0]"></h1>
            <p v-if="blogInfo.description" v-text="blogInfo.description" class="d-none d-md-block"></p>
        </div>
        <article-list :articleList="articleList"></article-list>
    </blog-main>
</template>

<script lang="ts">
import Vue from "vue"
import {default as Component,State,Getter} from 'nuxt-class-component';
import Main from '~/components/blog-main.vue';
import {fetchDeep} from '~/modules/jslib';
import ArticleList from '~/components/article-list.vue';


@Component(fetchDeep({
    name :'blog-home',
    scrollToTop :true,
    async asyncData({store,params}){
        await Promise.all([
            store.dispatch('fetch/fetchArticle'),
        ]);
    },
    components :{
        'blog-main' :Main,
        'article-list' :ArticleList,
    },
}))
export default class extends Vue {
    @Getter('fetch/articleList') articleList;
    @Getter('fetch/blogInfo') blogInfo;
}
</script>

<style lang="scss">
.blog-home{
    .bh-banner{
        background: #000;
        padding: 40px 0 20px;
        text-align: center;
        .bhb-avatar{
            border-radius: 50% 70% 0 110% / 50% 110% 0 70%;
            display: inline-block;
            overflow: hidden;
            transform: rotate(45deg);
            background-color: #fff;
            padding:5px;
            position: relative;
            img{
                width: 150px;
                height: 150px;
                transform: rotate(-45deg);
                background-color: #fff;
                position: relative;
                top:-10px;
                left:-10px;
            }
            margin-bottom: 1em;
        }
        h1{
            color:#fff;
            margin:20px 0 10px;
        }
        p{
            color: #999;
        }
    }
}
</style>
