<template>
  <h1>Hello {{fullName}}</h1>
</template>

<script lang="ts">
import Vue from "vue"
import Component from 'vue-class-component';

@Component({
    computed:{
        fullName(){
            return `FoXZilla/FireFront/${this.name}`
        },
    },
})
export default class extends Vue {
  name ='Tomori'
}
</script>
