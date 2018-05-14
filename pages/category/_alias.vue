<template>
    <blog-main>
        <starry-breadcrumb :labelText="`${$t('category')}: `" :itemList="crumbList"></starry-breadcrumb>
        <article-list :articleList="filteredArticleList"></article-list>
    </blog-main>
</template>

<script lang="ts">
import Vue from "vue"
import {default as Component,State,Getter} from 'nuxt-class-component';
import {ArticleInfo ,CategoryInfo} from "@foxzilla/fireblog";
import {default as Breadcrumb,CrumbItem} from '~/components/starry-breadcrumb.vue';
import {fetchDeep} from '~/modules/jslib';
import {getAllChidenCategory} from "~/modules/lib.ts";
import {countCategoryTrack} from "~/modules/lib";
import Main from '~/components/blog-main.vue';
import ArticleList from '~/components/article-list.vue';


@Component(fetchDeep({
    name :'filter-by-category',
    async asyncData({store,params}){
        await Promise.all([
            store.dispatch('fetch/fetchArticle'),
            store.dispatch('fetch/fetchCategory')
        ]);
        return {
            categoryAlias :params.alias,
        };
    },
    head(){
        return {
            title: this.categoryInfo?this.categoryInfo.name:'',
        };
    },
    components :{
        'blog-main' :Main,
        'article-list' :ArticleList,
        'starry-breadcrumb' :Breadcrumb,
    },
}))
export default class extends Vue {
    @Getter('fetch/articleMap') articleMap;
    @Getter('fetch/articleList') articleList;
    @Getter('fetch/categoryMap') categoryMap;
    categoryAlias !:CategoryInfo['alias'];

    inCategory(articleInfo:ArticleInfo):boolean{
        var categoryList =getAllChidenCategory(this.categoryAlias,this.categoryMap).map(c=>c.alias);
        return articleInfo.category_list.some(c=>categoryList.includes(c));
    };
    get categoryInfo(){
        return this.articleMap[this.categoryAlias];
    };
    get filteredArticleList(){
        return this.articleList
            ?this.articleList.filter(this.inCategory)
            :[]
        ;
    };
    get crumbList():CrumbItem[]{
        var result =countCategoryTrack(this.categoryAlias,this.categoryMap).map(c=>({
            text :c.name,
            link :`/category/${c.alias}`,
        }));
        result.unshift({
            text :this.$t('entire_categories') as string,
            link :'/category',
        });
        delete result[result.length-1].link;
        return result;
    };
}
</script>

<style lang="scss">
.starry-breadcrumb{
    margin-bottom: 25px;
}
</style>