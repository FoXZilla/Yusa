<template>
    <div class="modal" tabindex="-1" role="dialog" :id="id">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" v-show="usedTitle" v-text="usedTitle"></h5>
                    <button type="button" class="close" @click="close" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body" v-show="usedText" v-text="usedText"></div>
                <div class="modal-footer" v-show="usedOptions.length">
                    <button
                            type="button"
                            v-for="option of usedOptions"
                            :class="`btn btn-${option.type}`"
                            v-text="option.text"
                            @click="close(option)"
                    ></button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {vmMap,onclose} from './index.ts';
import {UserOption} from './types';

export default {
    name:"bs4-model",
    props :{
        id :{default:'default'},
        title :{},
        text :{},
        options :[],
    },
    mounted(){
        vmMap[this.id] =this;
    },
    data():{callOption:Partial<UserOption>}{return {
        callOption:{}
    }},
    computed:{
        usedTitle(){
            return this.callOption.title ||this.title;
        },
        usedText(){
            return this.callOption.text ||this.text;
        },
        usedOptions(){
            return [].concat(
                this.callOption.options ||[],
                this.options ||[],
            );
        },
    },
    methods:{
        close(option:UserOption){
            onclose(this,option);
        },
    },
};
</script>
