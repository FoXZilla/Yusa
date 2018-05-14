<template>
    <div id="main" class="blog-error">
        <div class="be-404 container" v-if="error.statusCode ===404">
            <nuxt-link to="/">&lt; {{$t('error.back_home')}}</nuxt-link>
            <h1>404</h1>
            <h2>{{$t('error.page_not_found')}}</h2>
        </div>
        <div class="be-common container" v-else>
            <h1>{{$t('error.occur_error')}}</h1>
            <p v-text="error.message"></p>
            <nuxt-link to="/">&lt; {{$t('error.back_home')}}</nuxt-link>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue"
import Component from 'nuxt-class-component';


@Component({
    props: ['error'],
    name :'blog-error',
})
export default class extends Vue {
    error !:Error;

    created(){
        console.error(this.error);
    };
}
</script>

<style lang="scss">
@import "~@pea3nut/styles/scss/variable";


.blog-error{
    .be-common, .be-404{
        margin-top: 100px;
        padding-top: 5px;
        padding-bottom: 30px;
        background: $peaCoolWhite;
    }
    .be-404{
        h1{
            font-size:150px;
            text-align: center;
        }
        h2{
            text-align: center;
        }
    }
}
</style>