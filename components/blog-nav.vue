<template>
    <nav class="blog-nav">
        <div class="bn-background">
            <div class="container bnb-content">
                <nav class="navbar navbar-expand-md navbar-dark">
                    <button class="navbar-toggler" type="button" data-toggle="collapse" :data-target="`#${collapseMenuId}`" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>


                    <div v-if="userInfo" class="nav-item dropdown d-md-none">
                        <span
                            class="nav-link dropdown-toggle bnbc-link clickable"
                            id="navbarDropdown2"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                        >
                            {{userInfo.nickname}}
                        </span>
                        <div class="dropdown-menu" aria-labelledby="navbarDropdown2">
                            <a class="dropdown-item" @click.prevent="$store.commit('openUserInfoModal')" href="?openUserInfoModal=1">{{$t('change_info')}}</a>
                            <!--<div class="dropdown-divider"></div>-->
                            <a class="dropdown-item" target="_blank" :href="`${fireApiUrl}/oauth/logout`">{{$t('logout')}}</a>
                        </div>
                    </div>
                    <login-show v-else class="d-md-none" />

                    <div class="collapse navbar-collapse"  :id="collapseMenuId">
                        <ul class="navbar-nav mr-auto" v-if="blogInfo.nav">
                            <li class="nav-item"
                                v-for="navItem of blogInfo.nav"
                            >
                                <router-link
                                    class="nav-link bnbc-link"
                                    v-if="navItem.type ==='category'"
                                    :to="`/category/${navItem.alias}`"
                                    v-text="navItem.text ||categoryMap[navItem.alias].name"
                                ></router-link>
                                <router-link
                                    class="nav-link bnbc-link"
                                    v-if="navItem.type ==='tag'"
                                    :to="`/tag/${navItem.alias}`"
                                    v-text="navItem.text ||tagMap[navItem.alias].name"
                                ></router-link>
                                <template v-if="navItem.type ==='link'">
                                    <router-link
                                        v-if="/^\/(?!\/)/.test(navItem.href)"
                                        class="nav-link bnbc-link"
                                        :to="navItem.href"
                                        v-text="navItem.text"
                                    ></router-link>
                                    <a
                                        v-else
                                        class="nav-link bnbc-link"
                                        :href="navItem.href"
                                        v-text="navItem.text"
                                        target="_blank"
                                    ></a>
                                </template>
                                <router-link
                                    class="nav-link bnbc-link"
                                    v-if="navItem.type ==='article'"
                                    :to="`/article/${navItem.id}`"
                                    v-text="navItem.text"
                                ></router-link>
                            </li>
                        </ul>

                        <div v-if="userInfo" class="nav-item dropdown">
                            <span
                                class="nav-link dropdown-toggle bnbc-link clickable d-none d-md-block"
                                id="navbarDropdown"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                            >
                                {{userInfo.nickname}}
                            </span>
                            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <a class="dropdown-item" @click.prevent="$store.commit('openUserInfoModal')" href="?openUserInfoModal=1">{{$t('change_info')}}</a>
                                <!--<div class="dropdown-divider"></div>-->
                                <a class="dropdown-item" target="_blank" :href="`${fireApiUrl}/oauth/logout`">{{$t('logout')}}</a>
                            </div>
                        </div>
                        <login-show v-else class="d-none d-md-block" />
                    </div>
                </nav>
            </div>
        </div>
    </nav>

</template>

<script lang="ts">
import Vue from "vue"
import {default as Component,Getter,State} from 'nuxt-class-component';
import LoginShow from '~/components/login-show.vue';
import {getRandomChar} from '@pea3nut/scripts/ts/function.both';
import {UserInfo} from "@foxzilla/fireblog";

@Component({
    name :'blog-nav',
    mounted(){
        this.$store.dispatch('fetch/watchLogin');
        this.$store.dispatch('fetch/fetchUserInfo');
    },
    async fetch({store}){
        await Promise.all([
            store.dispatch('fetch/fetchCategory'),
            store.dispatch('fetch/fetchTag'),
        ]);
    },
    components :{
        'login-show' :LoginShow
    },
})
export default class extends Vue {
    @Getter('fetch/tagMap') tagMap;
    @Getter('fetch/categoryMap') categoryMap;
    @Getter('fetch/blogInfo') blogInfo;
    @State fireApiUrl;
    showCategory =['technology','works','think'];
    collapseMenuId =`blogNav_${getRandomChar(5)}`;
    get userInfo():null|UserInfo{
        return this.$store.getters['fetch/userInfo']();
    }
}
</script>

<style lang="scss">
@import "~@pea3nut/styles/scss/variable.scss";
@import "~bootstrap/scss/_functions.scss";
@import "~bootstrap/scss/_variables.scss";

.blog-nav{
    font-size: 14px;
    .bn-background{
        min-height :52px;
        width  :100%;
        background-color :#26292e;
        padding :1px;
        .bnb-content{
            height :100%;
            .navbar{
                padding: 0;
            }
            .bnbc-link{
                color :#999;
                padding :15px;
                display: inline-block;
                border-right: 1px solid #333;
                width:100%;
                &:first-child{
                    border-left: 1px solid #333;
                }
                &.bnbcl-left-border{
                    border-left: 1px solid #333;
                }
            }
            @media (max-width: map_get($container-max-widths, md)) {
                .navbar{
                    padding-left: 0;
                    padding-right: 0;
                    .navbar-toggler{
                        height: 50px;
                    }
                    .nav-item{
                        border-bottom: 1px solid #333;
                        .bnbc-link{
                            border:none;
                        }
                    }
                }
            }
        }
    }
}
</style>