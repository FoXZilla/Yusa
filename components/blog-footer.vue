<template>
    <div class="blog-footer">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-4 bf-blogInfo">
                    <div class="bfb-author" v-if="blogInfo.author">
                        <img v-if="blogInfo.author.avatar" :src="blogInfo.author.avatar" />
                        <div class="bfa-name" v-if="blogInfo.author.names">
                            <div class="bfan-full">{{blogInfo.author.names[0]}}</div>
                            <div class="bfan-short"><span>{{blogInfo.author.names.slice(1).join(' / ')}}</span></div>
                        </div>
                    </div>
                    <div class="bfb-build">
                        <div>Powered by:</div>
                        <div class="bfb-images">
                            <a href="https://github.com/FoXZilla" target="_blank"><img src="/img/foxzilla.png" alt="foxzilla" /></a>
                            <a href="https://nuxtjs.org/" target="_blank"><img src="/img/nuxt.png" alt="nuxt" /></a>
                        </div>
                    </div>
                    <div class="bfb-copyright" v-if="blogInfo.copyright" v-html="blogInfo.copyright"></div>
                </div>
                <div class="col-md-4 bf-list" v-if="blogInfo.blogroll">
                    <h4>{{$t('blogroll')}}</h4>
                    <ul>
                        <li v-for="item of blogInfo.blogroll">
                            <a target="_blank" :href="item.href" v-text="item.text"></a>
                        </li>
                    </ul>
                </div>
                <div class="col-md-4 bf-list">
                    <div class="fbb-lang">
                        <label>{{$t('languages')}}</label>
                        <select class="custom-select custom-select-sm col-xl-11" v-model="$i18n.locale" @change="setLangCookie">
                            <option v-for="item of i18nOptions" :value="item.id" v-text="item.text"></option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue"
import Component,{Getter} from 'nuxt-class-component';
import {options,cookieKey} from '~/plugins/i18n';


@Component({
    name :'blog-footer',
})
export default class extends Vue {
    @Getter('fetch/blogInfo') blogInfo;
    i18nOptions:{text:string;id:string;}[] =options;
    setLangCookie(event){
        console.log(event ,event.currentTarget.value);
        document.cookie =`${cookieKey}=${event.currentTarget.value}`;
    };
}
</script>

<style lang="scss">
    @import "~@pea3nut/styles/scss/variable.scss";
    .blog-footer{
        margin-top:500px;
        .container-fluid{
            background-color :#fff;
            padding:30px;
            &>.row{
                padding:20px;
            }
            .bf-blogInfo{
                &>*{
                    margin-bottom:50px;
                    &:last-child{
                        margin-bottom:0px;
                    }
                }
                .bfb-author{
                    display: flex;
                    img{
                        height:48px;
                        background-color: #434343;
                        background-image: url("//public.pea3nut.org/img/uchu01.bg.jpg");
                    }
                    .bfa-name{
                        margin-left:2px;
                        color :#fff;
                        &>*{
                        }
                        .bfan-full{
                            display: inline-block;
                            font-size:19px;
                            font-weight: bold;
                            background-color: #434343;
                            background-image: url("//public.pea3nut.org/img/uchu01.bg.jpg");
                            padding:0px 4px;
                            letter-spacing: 2px;
                        }
                        .bfan-short{
                            margin-top:2px;
                            display: flex;
                            span{
                                font-size:12px;
                                background-color: #434343;
                                background-image: url("//public.pea3nut.org/img/uchu01.bg.jpg");
                                padding:0px 4px;
                            }
                        }
                    }
                }
                .bfb-build{
                    font-weight: bold;
                    .bfb-images{
                        &>*{
                            margin: 0 3px 3px 0;
                        }
                        img{
                            border: 1px solid #434343;
                            max-width: 32px;
                            max-height: 32px;
                        }
                    }
                }
                .bfb-copyright{
                    margin-top:50px;
                    p{margin:0}
                }
            }
            .bf-list{
                ul{
                    margin-top:20px;
                    li{
                        list-style: none;
                    }
                }
            }
        }
    }
</style>
