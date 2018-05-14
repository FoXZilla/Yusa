<template>
    <div class="login-show" v-if="oauthOptions.length">
        <a
            href="###"
            @click.prevent
            class="ls-login"
            ref="loginButton"
        >{{$t('login')}}</a>
        <div v-show="false">
            <div ref="loginOptions" class="ls-loginOptions">
                <div v-for="item of oauthOptions">
                    <a
                        :href="`${blogInfo.api_url}/oauth/login/${item.id}`"
                        @mousedown="openLoginPage"
                        target="_blank"
                    >
                        {{item.text||item.id}}
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {default as Component,State,Getter} from 'nuxt-class-component';
import {BlogInfo ,OAuthOption ,Omit ,UserInfo ,FireBean} from '@foxzilla/fireblog';

@Component({
    name :'login-show',
    mounted(){
        $(this.$refs.loginButton).popover({
            trigger :'focus',//lose focus when mousedown other element
            content :this.$refs.loginOptions,
            placement:'bottom',
            html :true,
        });
    },
})
export default class extends Vue{
    @Getter('fetch/blogInfo') blogInfo!:BlogInfo;
    @State fireApiUrl;
    openLoginPage(event:MouseEvent){
        var href =(<HTMLAnchorElement>event.currentTarget).href;
        var query =new URLSearchParams(href.split('?')[1]||'');
        query.append('firebean',JSON.stringify({
            _close: FireBean.CloseType.onlyBlank,
            _redirect: location.href,
        }));
        window.open(href.split('?')![0]+'?'+query.toString() ,'_blank');
        $(this.$refs.loginButton as any).popover('hide');
    };
    get oauthOptions():Omit<OAuthOption,'client_secret'>[]{
        var options ='oauth' in this.blogInfo ?Object.values(this.blogInfo.oauth!) :[];

        if(typeof window !=='undefined')
            options.forEach(item=>new Image().src=item.icon||'');

        return options;
    };
}
</script>

<style lang="scss">
@import "~@pea3nut/styles/scss/variable.scss";

.login-show{
    display: inline;
    .dropdown-toggle{
        color :$peaCoolWhite;
        border-left: 1px solid #333;
        border-right: 1px solid #333;
    }
    .dropdown-menu{
        background-color: $peaCoolWhite;
        font-size:14px;
        border-top:none;
        margin-top:0;
        border-radius: 0 0 .5em .5em;
        .dropdown-item{
            padding :5px 10px;
            min-width: 8rem;
            cursor: pointer;
            margin-top:0;
            &:hover{
                background: none;
            }
        }
    }
}
.ls-loginOptions{
    &>a{
        &::after{
            content: '/';
            margin:0 .3em;
        }
        &:last-child::after{
            display: none;
        }
    }
}
</style>