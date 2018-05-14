<template>
    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">{{$t('change_info')}}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="form-group">
                            <label class="col-form-label">
                                {{$t('nickname')}}:
                            </label>
                            <input type="text" class="form-control" v-model="newUserInfo.nickname" :placeholder="originUserInfo.nickname" />
                        </div>
                        <div class="form-group">
                            <label class="col-form-label">
                                {{$t('mail')}}:
                            </label>
                            <input type="text" class="form-control" v-model="newUserInfo.mail" :placeholder="originUserInfo.mail" />
                            <small class="form-text text-muted">{{$t('this_field_will_not_be_exposed')}}</small>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">{{$t('close')}}</button>
                    <button type="button" class="btn btn-primary" @click="freezeButton($event,pushInfo)">{{$t('update')}}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue"
import {default as Component,State} from 'nuxt-class-component';
import {tryShotTime} from "~/modules/lib.ts";
import {Post ,UserInfo} from "@foxzilla/fireblog";
import FormDictator from "@foxzilla/fireblog-sdk/form-dictator";

@Component({
    name :'change-info',
    mounted(){
        this.$store.dispatch('fetch/watchLogin');
    },
    watch:{
        '$store.state.userInfoModalIsOpen'(newValue:boolean){
            if(!newValue){
                $(this.$el).modal('hide');
                return;
            };
            this.newUserInfo ={};
            $(this.$el).modal('show').one('hidden.bs.modal',()=>{
                this.$store.commit('closeUserInfoModal');
            });
        },
    },
})
export default class extends Vue {
    @State fireApiUrl;
    newUserInfo:Post.user.update_info.request ={};
    get originUserInfo():UserInfo|{}{
        return this.$store.getters['fetch/userInfo']() ||{};
    };
    async pushInfo(unfreeze?:()=>void){
        var response =await this.$axios.post(
            `${this.fireApiUrl}/user/update_info`,
            JSON.stringify(new FormDictator(this.newUserInfo).noEmptyStr().noUndefined().data),
        );
        if(typeof unfreeze ==='function') unfreeze();
        if(response.data.errcode){
            this.$notify({
                type :'error',
                title:'资料更新失败',
                text :response.data.errmsg,
            });
            return;
        };
        this.$notify({
            type :'success',
            text :'资料更新成功',
        });
        this.$store.commit('closeUserInfoModal');
        this.$store.dispatch('fetch/fetchUserInfo');
    };

    freezeButton(event:MouseEvent|HTMLButtonElement ,then?:any):()=>void{
        var Elt =event instanceof HTMLButtonElement
            ?event as HTMLButtonElement
            :event.currentTarget as HTMLButtonElement
        ;
        var origin ={
            innerHTML :Elt.innerHTML,
            width     :Elt.style.width,
        };
        Elt.style.width =getComputedStyle(Elt).width;
        Elt.innerHTML ='<i class="fa fa-circle-o-notch fa-spin"></i>';
        Elt.disabled =true;

        var unfreeze =function(){
            Elt.innerHTML =origin.innerHTML;
            if(origin.width) Elt.style.width =origin.width;
            else delete Elt.style.width;
            Elt.disabled =false;
        };
        if(typeof then ==='function')then(unfreeze);
        return unfreeze;
    };
}
</script>

<style lang="scss">
.article-card{
    border-radius :0;
    .card-body{
        padding:0;
        &>*{
            margin-left:15px;
            margin-right:15px;
            &:first-child{
                margin-top:10px;
            }
            &:last-child{
                margin-bottom: 10px;
            }
        }
        .ac-title{
            margin-bottom: 5px;
        }
        .ac-description{
            padding:0 15px;
            min-height: 40px;
        }
        .card-footer{
            margin:0;
            padding:5px 15px;
            overflow: hidden;
            font-size :80%;
            .ac-label-group{
                float:left;
                margin-right: 1em;
                label{
                    margin: 0 .3em 0 0;
                    font-weight: bold;
                }
                .fa{
                    margin-right: .2em;
                }
            }
        }
    }
}
</style>