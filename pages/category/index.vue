<template>
    <blog-main class="all-categories">
        <starry-breadcrumb :labelText="$t('category')+'：'" :itemList="[{text :$t('entire_categories')}]"></starry-breadcrumb>
        <div class="container at-show">
            <h1>{{$t('all_categories')}}<small>({{categoryList.length}})</small></h1>
            <hr />
            <div class="container">
                <div v-html="categoryHtml" @click.prevent="categoryUlHandler"></div>
            </div>
        </div>
    </blog-main>
</template>



<script lang="ts">
import Vue from "vue"
import {default as Component,State,Getter} from 'nuxt-class-component';
import {ArticleInfo ,CategoryInfo ,IndexMap} from "@foxzilla/fireblog";
import {default as Breadcrumb,CrumbItem} from '~/components/starry-breadcrumb.vue';
import {fetchDeep} from '~/modules/jslib';
import {getAllChidenCategory} from "~/modules/lib.ts";
import {countCategoryTrack} from "~/modules/lib";
import Main from '~/components/blog-main.vue';


@Component(fetchDeep({
    name :'all-categories',
    async asyncData({store}){
        await Promise.all([
            store.dispatch('fetch/fetchArticle'),
            store.dispatch('fetch/fetchCategory'),
        ]);
    },
    head(){
        return {
            title: this.$t('entire_categories'),
        };
    },
    components :{
        'blog-main' :Main,
        'starry-breadcrumb' :Breadcrumb,
    },
}))
export default class extends Vue {
    @Getter('fetch/articleList') articleList !:ArticleInfo[];
    @Getter('fetch/categoryMap') categoryMap !:IndexMap<CategoryInfo['alias'],CategoryInfo>;
    @Getter('fetch/categoryList') categoryList !:CategoryInfo[];

    get rootCategoryList():CategoryInfo[]{
        return this.categoryList.filter(c=>!c.parent_alias);
    }
    get categoryCountMap():IndexMap<CategoryInfo['alias'],number>{
        var map ={};
        Object.keys(this.categoryMap).forEach(key=>map[key]=0);

        for(let articleInfo of this.articleList){
            for(let categoryAlias of articleInfo.category_list){
                while(categoryAlias){
                    map[categoryAlias]++;
                    categoryAlias =this.categoryMap[categoryAlias].parent_alias!;
                };
            };
        };


        return map;
    };
    get categoryHtml(){
        return function _self(categories:CategoryInfo[]){
            var html ='<ul>\n';
            for(let category of categories){
                html +=`<li title="${category.description || category.alias}"><a href="/category/${category.alias}" target="_blank">${category.name}`;

                html +=`<small>(${this.categoryCountMap[category.alias]})</small>`
                let children =this.categoryList.filter(c=>c.parent_alias===category.alias);
                if(children.length){
                    html +=_self.call(this,children);
                };

                html +='</a></li>';

            };
            html +='</ul>';
            return html;
        }.call(this, this.rootCategoryList);
    };
    categoryUlHandler(event:MouseEvent){
        var elt =event.target as HTMLElement;
        while(elt && elt.tagName.toLowerCase() !=='a') elt =elt.parentElement!;
        if(elt ===null)return;
        this.$router.push(elt.getAttribute('href')!);
    }
}
</script>

<style lang="scss">
@import "~@pea3nut/styles/scss/variable";

.all-categories{
    .starry-breadcrumb{
        margin-bottom: 25px;
    }
    .at-show{
        padding-top:20px;
        padding-bottom:70px;
        background: $peaCoolWhite;
        font-size :20px;
    }
}
</style>