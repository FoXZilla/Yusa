<template>
    <div class="starry-breadcrumb">
        <div class="sb-background">
            <div class="sbb-content container">
                <label class="sbbc-label" v-text="labelText" v-show="labelText"></label>
                <ol class="breadcrumb">
                    <slot>
                        <template
                            v-for="item of itemList"
                        >
                            <li class="breadcrumb-item" v-if="item.link" >
                                <router-link :to="item.link" v-text="item.text"></router-link>
                            </li>
                            <li class="breadcrumb-item" v-else v-text="item.text"></li>
                        </template>
                    </slot>
                </ol>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue"
import {mapGetters} from "vuex"
import Component from 'nuxt-class-component';
import {countCategoryTrack} from '~/modules/lib.ts';


export interface CrumbItem{
    text :string;
    link?:string;
};
@Component({
    name :'starry-breadcrumb',
    props:[
        'labelText',
        'itemList',//CrumbItem[]
    ],
    async fetch({store}){
        await store.dispatch('fetch/fetchCategory');
    },
    computed :{
        ...mapGetters({categoryMap:'fetch/categoryMap'}),
        categoryCrumbs(){},
    },
    methods :{countCategoryTrack},
})
export default class extends Vue {}
</script>

<style lang="scss">
.starry-breadcrumb{
    .sb-background{
        min-height :36px;
        width  :100%;
        background-color : #0a0d11;
        padding :1px;
        color :#999;
        display: flex;
        align-items: center;
        .sbb-content{
            height :100%;
            display: flex;
            .sbbc-label{
                color : #f3f3f3;
                font-weight: bold;
                font-size: 0.9em;
                margin :1px .5em 0 0;
                flex-shrink: 0;
            }
            .breadcrumb{
                margin :0;
                padding:0;
                height :100%;
                border-radius :0;
                background: none;
                display: flex;
                align-items: center;
            }
        }
    }
}
</style>