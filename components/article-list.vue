<template>
    <div class="article-list container">
        <template v-if="articleList">
            <article-card
                    v-for="articleInfo of articleList"
                    :key="articleInfo.id"
                    :articleInfo="articleInfo"
            ></article-card>
        </template><template v-else>
            <p>Loading...</p>
        </template>
    </div>
</template>

<script lang="ts">
import Vue from "vue"
import Component from 'nuxt-class-component';
import {tryShotTime} from "~/modules/lib.ts";
import Card from '~/components/article-card.vue';


@Component({
    name :'article-list',
    props:['articleList'],
    components:{
        'article-card' :Card,
    },
})
export default class extends Vue {
}
</script>

<style lang="scss">
.article-list{
    margin-top: 25px;
    .article-card{
        margin-bottom: 25px;
    }
}
</style>