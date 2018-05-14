<template>
    <h1>FireBean</h1>
</template>

<script lang="ts">
import {FireBean} from '@foxzilla/fireblog';
import {exec,Actions} from '@foxzilla/fireblog-sdk/firebean';


var router;
Actions.go_article =function(data:FireBean.GoArticleData){
    router.push('/article/'+data.id);
} as any;
Actions.go_comment =function(data:FireBean.GoCommentData){
    router.push('/article/'+data.article_id+'#comment-'+data.id);
} as any;

export default {
    mounted(){
        router =this.$router;
        exec();
    },
    name:"firebean",
}
</script>