<template>
    <blog-main class="all-tags">
        <starry-breadcrumb :labelText="$t('tag')+'：'" :itemList="[{text :$t('entire_tags')}]"></starry-breadcrumb>
        <div class="container at-show">
            <h1>{{$t('all_tags')}}<small>({{tagList.length}})</small></h1>
            <hr />
            <div class="container">
                <router-link
                    class="ats-tag"
                    v-for="tag of tagList"
                    :key="tag.alias"
                    :to="`/tag/${tag.alias}`"
                    :title="tag.description || tag.alias"
                ><h2 :class="`lv-${lvMap[tag.alias]}`">
                    {{tag.name}}<small>({{tagCountMap[tag.alias]}})</small>
                </h2></router-link>
            </div>
        </div>
    </blog-main>
</template>



<script lang="ts">
import Vue from "vue"
import {default as Component,State,Getter} from 'nuxt-class-component';
import {ArticleInfo ,CategoryInfo ,IndexMap ,TagInfo} from "@foxzilla/fireblog";
import {default as Breadcrumb,CrumbItem} from '~/components/starry-breadcrumb.vue';
import {fetchDeep} from '~/modules/jslib';
import {getAllChidenCategory} from "~/modules/lib.ts";
import {countCategoryTrack} from "~/modules/lib";
import Main from '~/components/blog-main.vue';


@Component(fetchDeep({
    name :'all-tags',
    async asyncData({store}){
        await Promise.all([
            store.dispatch('fetch/fetchArticle'),
            store.dispatch('fetch/fetchTag'),
        ]);
    },
    head(){
        return {
            title: this.$t('entire_tags'),
        };
    },
    components :{
        'blog-main' :Main,
        'starry-breadcrumb' :Breadcrumb,
    },
}))
export default class extends Vue {
    @Getter('fetch/articleList') articleList !:ArticleInfo[];
    @Getter('fetch/tagMap') tagMap !:IndexMap<TagInfo['alias'],TagInfo>;
    @Getter('fetch/tagList') tagList !:TagInfo[];

    get tagCountMap():IndexMap<TagInfo['alias'],number>{
        var map ={};
        Object.keys(this.tagMap).forEach(key=>map[key]=0);

        for(let articleInfo of this.articleList){
            articleInfo.tag_list.forEach(tagAlias=>map[tagAlias]++);
        };


        return map;
    };
    get lvMap():IndexMap<TagInfo['alias'],number>{
        var values =Object.values(this.tagCountMap).sort((i1,i2)=>i1-i2);
        const scopeNum =Math.min(3,values.length);
        var map =function(countMap:IndexMap<TagInfo['alias'],number>,defaultLv:number){
            var map =Object.create(countMap);
            Object.keys(countMap).forEach(alias=>map[alias]=defaultLv);
            return map;
        }(this.tagCountMap,Math.round((scopeNum-1)/2));

        if(values.length<3)return map;

        for(let lv=0 ;lv<scopeNum ;lv++){
            let min =Math.floor(values[0]+lv/scopeNum*(values[0]+values[values.length-1]));
            let max =Math.ceil(min+(values[0]+values[values.length-1])/scopeNum);
            for(let alias of Object.keys(this.tagCountMap)){
                if(this.tagCountMap[alias] <=max &&this.tagCountMap[alias] >=min){
                    map[alias] =scopeNum-1-lv;
                }
            }
        };


        return map;
    };
}
</script>

<style lang="scss">
@import "~@pea3nut/styles/scss/variable";

.all-tags{
    .starry-breadcrumb{
        margin-bottom: 25px;
    }
    .at-show{
        padding-top:20px;
        padding-bottom:70px;
        background: $peaCoolWhite;
        &,*{
            /*word-wrap:break-word;*/
            /*word-break: break-all;*/
            word-wrap: break-word;
            word-break: break-all;
        }


        .ats-tag{
            margin-right: 10px;
            .lv-0{
                font-size: 2.5rem;
            }
            .lv-1{
                font-size: 2.5rem * 0.6;
            }
            .lv-2{
                font-size: 2.5rem * 0.6 * 0.7;
                font-weight: normal;
            }
            h2{
                display: inline;
            }
        }
    }
}
</style>