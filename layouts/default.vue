<template>
    <div id="nuxt" v-if="blogInfo">
        <nuxt />
        <notifications />
        <bs4-model />
        <change-info />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Model from '~/modules/bs4-model/index.ts';
import ChangeInfo from '~/components/change-info';
import {default as Component,State,Getter} from 'nuxt-class-component';
import {BlogInfo} from "@foxzilla/fireblog";
Vue.use(Model);


@Component({
    name :'layout-default',
    components :{
        'change-info' :ChangeInfo,
    },
    watch :{
        '$i18n.locale': {
            handler(){
                if(!process.server){
                    document.documentElement.lang =this.$i18n.locale;
                }
            },
            immediate: true
        },
    },
})
export default class extends Vue {
    @Getter('fetch/blogInfo') blogInfo!:BlogInfo;
    async mounted(){
        if(new URLSearchParams(location.search).get('openUserInfoModal') ==='1'){
            this.$store.commit('openUserInfoModal');
        };
        //@ts-ignore
        await this.$store.dispatch('nuxtServerInit',NuxtContext);
        this.loadPageMeta();
        document.documentElement.lang =this.$i18n.locale;
    };
    loadPageMeta(){
        if(this.blogInfo.language) document.documentElement.lang =this.blogInfo.language;
        if('favicon' in this.blogInfo) for(let [size,url] of Object.entries(this.blogInfo.favicon!)){
            let elt =document.createElement('link');
            elt.rel ='icon';
            //@ts-ignore
            elt.sizes =`${size}x${size}`;
            elt.href =url;
            document.head.appendChild(elt);
        };
    };
};
</script>

<style>
.notifications{
    top: 5px !important;
}
</style>