<template>
    <div id="main">
        <blog-nav></blog-nav>
        <slot class="blog-main" />
        <blog-footer></blog-footer>
    </div>
</template>

<script>
import Nav from '~/components/blog-nav.vue';
import Footer from '~/components/blog-footer.vue';


export default {
    name :'blog-main',
    components :{
        'blog-nav' :Nav,
        'blog-footer' :Footer,
    },
};
</script>