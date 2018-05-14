<template>
    <blog-main>
        <starry-breadcrumb :labelText="`${$t('tag')}: `" :itemList="crumbList"></starry-breadcrumb>
        <article-list :articleList="articleList"></article-list>
    </blog-main>
</template>



<script lang="ts">
import Vue from "vue"
import {default as Component,State,Getter} from 'nuxt-class-component';
import {ArticleInfo ,CategoryInfo ,TagInfo} from "@foxzilla/fireblog";
import {default as Breadcrumb,CrumbItem} from '~/components/starry-breadcrumb.vue';
import {fetchDeep} from '~/modules/jslib';
import {getAllChidenCategory} from "~/modules/lib.ts";
import {countCategoryTrack} from "~/modules/lib";
import Main from '~/components/blog-main.vue';
import ArticleList from '~/components/article-list.vue';


@Component(fetchDeep({
    name :'filter-by-tag',
    async asyncData({store,params}){
        await Promise.all([
            store.dispatch('fetch/fetchArticle'),
            store.dispatch('fetch/fetchTag'),
        ]);
        return {
            tagAlias :params.alias,
        };
    },
    head(){
        return {
            title: this.tagInfo?this.tagInfo.name:'',
        };
    },
    components :{
        'blog-main' :Main,
        'article-list' :ArticleList,
        'starry-breadcrumb' :Breadcrumb,
    },
}))
export default class extends Vue {
    tagAlias!:TagInfo['alias'];
    @Getter('fetch/articleMap') articleMap;
    @Getter('fetch/tagMap') tagMap;
    get tagInfo(){
        return this.tagMap[this.tagAlias];
    };
    get articleList(){
        return this.$store.getters['fetch/articleList']
            ?
            (<ArticleInfo[]>this.$store.getters['fetch/articleList'])
                .filter(a=>a.tag_list.includes(this.tagAlias))
            :[]
        ;
    };
    get crumbList():CrumbItem[]{
        return [{
            text :this.$t('entire_tags') as string,
            link :'/tag'
        },{
            text :this.tagInfo.name,
        }];
    };
}
</script>

<style lang="scss">
.starry-breadcrumb{
    margin-bottom: 25px;
}
.article-card{
    margin-bottom: 25px;
}
</style>