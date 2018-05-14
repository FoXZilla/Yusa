<template>
    <div class="article-card card">
        <div class="card-body">
            <h5 class="card-title ac-title"><router-link
                :to="`/article/${articleInfo.id}`"
                v-text="articleInfo.title"
            ></router-link></h5>
            <p
                class="card-text text-muted ac-description"
                v-html="articleInfo.description||''"
            ></p>
            <div class="card-footer">
                <div class="ac-label-group" v-if="articleInfo.require_password">
                    <i class="fa fa-lock text-muted"></i>
                </div>
                <div class="ac-label-group" v-if="articleInfo.no_comment">
                    <i class="fa fa-comment text-muted"></i>
                    <i class="fa fa-ban text-muted"></i>
                </div>
                <div class="ac-label-group" v-if="articleInfo.comment_count">
                    <i class="fa fa-comment text-muted"></i>
                    <span class="text-muted" v-text="articleInfo.comment_count"></span>
                </div>
                <div class="ac-label-group" v-if="articleInfo.tag_list.length" v-for="tagAlias of articleInfo.tag_list">
                    <i class="fa fa-tag text-muted aclg-tag"></i>
                    <router-link
                            :to="`/tag/${tagAlias}`"
                            v-text="tagMap[tagAlias]?tagMap[tagAlias].name:'@@'+tagAlias"
                    ></router-link>
                </div>
                <time class="text-muted ac-updateDate">{{$t('last_updated')}} {{
                    tryShotTime(articleInfo.update_time) ||formatDate(articleInfo.update_time)
                }}</time>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue"
import {default as Component,Getter} from 'nuxt-class-component';
import {md,tryShotTime} from "~/modules/lib.ts";
import Tinytime from 'tinytime';


@Component({
    name :'article-card',
    props:['articleInfo'],
    async fetch({store}){
        await store.dispatch('fetch/fetchTag');
    },
})
export default class extends Vue {
    @Getter('fetch/tagMap') tagMap;
    md=md;
    tryShotTime =tryShotTime;
    formatDate  =d=>Tinytime('{YYYY}-{Mo}-{DD}',{padMonth:true,padDays:true}).render(new Date(d));
}
</script>

<style lang="scss">
.article-card{
    border-radius :0;
    .card-body{
        padding:0;
        &>*{
            margin-left:15px;
            margin-right:15px;
            &:first-child{
                margin-top:10px;
            }
            &:last-child{
                margin-bottom: 10px;
            }
        }
        .ac-title{
            margin-bottom: 5px;
        }
        .ac-description{
            padding:0 15px;
            min-height: 40px;
        }
        .card-footer{
            margin:0;
            padding:5px 15px;
            overflow: hidden;
            font-size :80%;
            display: flex;
            flex-wrap: wrap;
            *{
                word-wrap: break-word;
                word-break: break-all;
            }
            .ac-label-group{
                margin-right: 1em;
                label{
                    margin: 0 .3em 0 0;
                    font-weight: bold;
                }
                .fa{
                    margin-right: .2em;
                }
            }
            .ac-updateDate{
                margin-left :auto;
            }
        }
    }
}
</style>