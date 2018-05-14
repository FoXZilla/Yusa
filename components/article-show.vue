<template>
    <div class="article-show container">
        <div class="as-header">
            <h1 v-text="articleInfo.title"></h1>
        </div>
        <div class="card as-body">
            <div class="card-header text-muted">
                <div class="asb-label-group">
                    <label class="text-muted">{{$t('created_at')}}</label>
                    <span class="text-muted" v-text="tryShotTime(articleInfo.update_time) ||formatDate(articleInfo.update_time)"></span>
                </div>
                <div class="asb-label-group">
                    <label class="text-muted">{{$t('last_updated')}}</label>
                    <span class="text-muted">{{tryShotTime(articleInfo.update_time) ||`${formatDate(articleInfo.update_time)} ${formatTime(articleInfo.update_time)}`}}</span>
                </div>
            </div>
            <div class="card-body">
                <div class="text-body" v-html="md(articleInfo.md_content)"></div>
            </div>
            <div class="card-footer text-muted">
                <div class="asb-label-group" v-if="articleInfo.no_comment">
                    <label class="fa fa-comment text-muted"></label>
                    <i class="fa fa-ban text-muted"></i>
                </div>
                <div class="asb-label-group" v-show="articleInfo.comment_count !==0">
                    <label class="fa fa-comment text-muted"></label>
                    <span class="text-muted" v-text="articleInfo.comment_count"></span>
                </div>
                <div class="asb-label-group" v-if="articleInfo.tag_list.length" v-for="tagAlias of articleInfo.tag_list">
                    <label class="fa fa-tag text-muted aclg-tag"></label>
                    <router-link
                            :to="`/tag/${tagAlias}`"
                            v-text="tagMap[tagAlias]?tagMap[tagAlias].name:'@@'+tagAlias"
                    ></router-link>
                </div>
            </div>
        </div>

        <div class="as-comments" v-if="hasCommentFeature || articleInfo.comment_count !==0">
            <template v-if="hasCommentFeature">
                <h2 class="container">{{$t('comment')}}</h2>
                <hr />
                <div class="container asc-needMail">
                    <div class="alert alert-warning alert-dismissible fade show" v-if="userInfo && !userInfo.mail">
                        {{$t('not_have_mail.before_link')}}
                        <a @click.prevent="$store.commit('openUserInfoModal')" href="?openUserInfoModal=1">{{$t('not_have_mail.link')}}</a>
                        {{$t('not_have_mail.after_link')}}
                        <button type="button" class="close" data-dismiss="alert">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                </div>
                <div class="asc-comment asc-publish" v-if="userInfo && !articleInfo.no_comment">
                    <div class="ascc-avatar d-none d-sm-block">
                        <img :src="`${fireApiUrl}/user/avatar/${userInfo.id}`" :alt="userInfo.nickname" width="40" height="40" />
                    </div>
                    <div class="ascc-body card">
                        <div class="card-header text-muted">
                            {{$t('publish_comment')}}
                        </div>
                        <div class="alert alert-warning card-body" v-if="replyTo">
                            <div class="ascp-header">
                                {{$t('publish')}}
                                <span class="ascph-to" v-text="replyTo.author_nickname"></span>
                                :
                            </div>
                            <div class="ascp-reply-content" v-text="replyTo.md_content"></div>

                            <button type="button" class="close" @click="replyTo=null">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <textarea
                            class="card-body"
                            :placeholder="$t('markdown_syntax_enable')"
                            rows="3"
                            v-model="commentContent"
                            ref="commentInput"
                            v-show="!inPreview"
                            :disabled="publishing"
                        ></textarea>
                        <div class="card-body" v-show="inPreview">
                            <div v-html="md(commentContent)"></div>
                        </div>


                        <div class="card-footer">
                            <button class="btn btn-outline-secondary btn-sm" @click="inPreview=true" v-show="!inPreview && !publishing">{{$t('preview')}}</button>
                            <button class="btn btn-outline-secondary btn-sm" @click="inPreview=false" v-show="inPreview && !publishing">{{$t('edit')}}</button>
                            <button class="btn btn-outline-success btn-sm" @click="publishComment" v-show="!publishing">{{$t('publish')}}</button>
                            <button class="btn btn-outline-success btn-sm disabled" v-show="publishing" disabled>{{$t('publishing')}}</button>
                        </div>
                    </div>
                </div>
                <div class="container" v-if="!userInfo && !articleInfo.no_comment">
                    {{$t('please_before')}}
                    <login-show />
                </div>
                <div class="container" v-if="articleInfo.no_comment">
                    <p>{{$t('comment_has_closed')}}</p>
                </div>

                <hr />
            </template>

            <h3 class="container">
                {{articleInfo.comment_list.length}}
                {{$t('comments')}}
            </h3>
            <div
                    class="asc-comment"
                    v-if="articleInfo.comment_count"
                    v-for="commentInfo of articleInfo.comment_list"
                    :id="'comment-'+articleInfo.id"
            >
                <div class="ascc-avatar d-none d-md-block">
                    <img
                        width="40"
                        height="40"
                        :src="`${fireApiUrl}/user/avatar/${commentInfo.author_id}?size=40`"
                        :alt="commentInfo.author_nickname"
                    />
                </div>
                <div class="ascc-body card">
                    <div class="card-header text-muted">
                        <span>
                            {{commentInfo.author_nickname}}
                            /
                            {{tryShotTime(commentInfo.date) ||formatDate(commentInfo.date)}}
                        </span>
                        <span
                                class="asccb-action"
                                v-if="userInfo"
                                @click="atUser({id:commentInfo.author_id,nickname:commentInfo.author_nickname})"
                        >@</span>
                        <span class="asccb-action" v-if="userInfo" @click="replyComment(commentInfo)">{{$t('reply')}}</span>
                        <span
                                class="asccb-action"
                                @click="removeComment(commentInfo)"
                                v-if="userInfo && commentInfo.author_id===userInfo.id"
                        >{{$t('remove')}}</span>
                        <span class="pull-right">#{{commentInfo.id}}</span><!--todo: click to create a firebean URL-->
                    </div>
                    <div class="card-body">
                        <div v-html="md(commentInfo.md_content)"></div>
                        <div class="card asccb-sub-comment text-muted" v-if="commentInfo.comment_list.length">
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item" v-for="subCommentInfo of commentInfo.comment_list">
                                    {{subCommentInfo.author_nickname}}
                                    /
                                    {{tryShotTime(subCommentInfo.date) ||formatDate(subCommentInfo.date)}}
                                    :
                                    <span
                                            class="asccb-action"
                                            v-if="userInfo"
                                            @click="replyComment(commentInfo),atUser({id:subCommentInfo.author_id,nickname:subCommentInfo.author_nickname})"
                                    >@</span>
                                    <span
                                            class="asccb-action"
                                            @click="removeComment(subCommentInfo)"
                                            v-if="userInfo && subCommentInfo.author_id===userInfo.id"
                                    >{{$t('remove')}}</span>
                                    <div class="asccbs-content" v-html="md(subCommentInfo.md_content)"></div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <hr />
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue"
import {default as Component,State,Getter} from 'nuxt-class-component';
import {countCategoryTrack,md} from '~/modules/lib.ts';
import {tryShotTime} from "~/modules/lib.ts";
import Tinytime from 'tinytime';
import {Comment} from '@foxzilla/fireblog/types/article.d.ts';
import {ArticleInfo ,BlogInfo ,CommentInfo ,FireBean ,Post ,UserInfo} from "@foxzilla/fireblog";
import {unwarpResponse} from "../modules/lib";
import {Assert} from '@pea3nut/scripts/ts/function.both.ts';
import LoginShow from '~/components/login-show.vue';


@Component({
    name :'article-show',
    props:['articleInfo'],
    mounted(){
        this.$store.dispatch('fetch/watchLogin');
        this.$store.dispatch('fetch/fetchUserInfo');
    },
    async fetch({store}){
        await store.dispatch('fetch/fetchTag');
    },
    components :{
        'login-show' :LoginShow
    },
})
export default class extends Vue {
    @Getter('fetch/tagMap') tagMap;
    @State fireApiUrl;
    @Getter('fetch/blogInfo') blogInfo!:BlogInfo;
    articleInfo !:ArticleInfo;

    md =md;
    showCategory =['technology','works','think'];
    tryShotTime =tryShotTime;
    formatDate  =d=>Tinytime('{YYYY}-{Mo}-{DD}',{padMonth:true,padDays:true}).render(new Date(d));
    formatTime  =d=>Tinytime('{H}:{mm}:{ss}').render(new Date(d));
    get userInfo(){
        return this.$store.getters['fetch/userInfo']();
    };
    get hasCommentFeature():boolean{
        return (
            'oauth' in this.blogInfo
            && Object.keys(this.blogInfo.oauth!).length !==0
        );
    };
    commentContent ='';
    replyTo :Comment|null =null;
    publishing=false;
    async publishComment(event,el){
        if(!this.commentContent){
            this.$notify({
                type :'error',
                text :this.$t('comments_cannot_be_empty'),
            });
            return;
        };
        this.publishing =true;
        var response =await this.$axios.post(
            `${this.fireApiUrl}/comment/create`,
            JSON.stringify(Assert<Post.comment.create.request>({
                article_id  :this.articleInfo!.id,
                md_content  :this.commentContent,
                reply_to    :this.replyTo ?this.replyTo.id :undefined,
            }),
        ));
        this.publishing =false;
        if(response.data.errcode){
            this.$notify({
                type :'error',
                title:this.$t('comment_publish_failed'),
                text :response.data.errmsg,
            });
            return;
        };
        this.$emit('refresh-article');
        this.$notify({
            type :'success',
            text :this.$t('comment_publish_succeed'),
        });
        this.commentContent ='';
        this.replyTo =null;
        var commentInfo:CommentInfo =unwarpResponse(response.data);
    };
    async removeComment(comment:Comment){
        var flag =await this.$model({
            title :this.$t('ensure_remove_comment'),
            text  :comment.md_content,
            options :[{
                type :'outline-secondary',
                text :this.$t('cancel'),
                flag :false,
            },{
                type :'danger',
                text :this.$t('remove'),
                flag :true,
            }],
        });

        if(!flag)return;

        var response =await this.$axios.get(
            `${this.fireApiUrl}/comment/remove/${comment.id}`
        );
        if(response.data.errcode){
            this.$notify({
                type :'error',
                title:this.$t('comment_remove_failed'),
                text :response.data.errmsg,
            });
            return;
        };
        this.$store.dispatch(
            'fetch/fetchArticleDetail',
            {articleId:this.articleInfo!.id,refresh:true},
        );
        this.$notify({
            type :'success',
            text :`#${response.data.id} ${this.$t('has_been_removed')}`,
        });
    };

    replyComment(comment:Comment){
        this.replyTo =comment;
        (<any>this.$refs.commentInput).focus();
    };
    informList:{id:UserInfo['id'],nickname:UserInfo['nickname']}[] =[];
    atUser(info:Pick<UserInfo,'id'|'nickname'>){
        var fbData:FireBean.GoUserData ={
            _type :FireBean.Type.goUser,
            _version :'0.0.1',
            id    :info.id,
        };
        this.commentContent =`[@${info.nickname}](/_firebean?${new URLSearchParams(<any>fbData)}) `+this.commentContent;
    };
    inPreview =false;
}
</script>

<style lang="scss">
@import "~@pea3nut/styles/scss/variable";

.article-show{
    .as-header{
        background-color : #ffffff;
        padding:10px 15px;
        text-align: center;
        margin-bottom: 20px;
        border-radius: .5em .5em 0 0;
        h1{
            font-size: 1.25em;
            margin: 0;
        }
    }
    .as-body{
        .card-header,.card-footer{
            padding: .5em;
            text-align: right;
            font-size: 10px;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            .asb-label-group{
                margin:0 .7em;
                label{
                    margin: 0 .3em 0 0;
                }
            }
        }
        border-radius: 0;
        background-color :$peaCoolWhite;
    }
    .as-comments{
        margin-top:20px;
        padding-top :10px;
        background: $peaCoolWhite;
        overflow: hidden;
        border-radius: 0 0 .5em .5em;
        .asc-needMail{
            font-size:12px;
            .alert{
                padding:5px 10px;

                button{
                    font-size:16px;
                    padding-top:5px;
                    padding-bottom:5px;
                }
            }
        }
        .asc-comment{
            display: flex;
            padding: 5px 10px;
            margin-bottom: 15px;
            .ascc-avatar{
                margin-right :10px;
                img{
                    border: 1px solid rgba(0, 0, 0, .125);
                }
            }
            .ascc-body{
                .card-header{
                    padding:5px 8px;
                    font-size :12px;
                    &:hover .asccb-action{
                        visibility: visible;
                    }
                }
                .card-body{
                    padding: 8px 12px;
                }
                flex-grow: 1;
                background: $peaCoolWhite;
                .asccb-sub-comment{
                    font-size: 12px;
                    background: none;
                    .list-group-item{
                        background: none;
                        padding: 5px 8px;
                        .asccbs-content{
                            padding: 0 5px;
                            overflow: hidden;
                        }
                        &:hover .asccb-action{
                            visibility: visible;
                        }
                    }
                    p{margin:0}
                }
                .asccb-action{
                    cursor: pointer;
                    text-decoration:underline;
                    visibility: hidden;
                    margin :0 .3em;
                }
            }
        }
        .asc-comment.asc-publish{
            textarea{
                &::placeholder{
                    color: #bbbbbb;
                }
            }
            .card{
                .alert.card-body{
                    margin:0;
                    display: flex;
                    font-size:12px;
                    padding:5px 8px;
                    .ascp-header{
                        flex-shrink :0;
                        .ascph-to{
                            font-weight: bold;
                        }
                        margin-right: .5em;
                    }
                    button{
                        flex-shrink :0;
                        &.close{
                            font-size:1.5em;
                            margin-top:-3px;
                        }
                    }
                    .ascp-reply-content{
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                        margin-right: auto;
                    }
                }
                .card-footer{
                    text-align: right;
                    padding:7px 10px;
                    .btn{
                        padding-top:1px;
                        padding-bottom:1px;
                        margin-left: 1em;
                    }
                }
            }
        }
    }
}
</style>
