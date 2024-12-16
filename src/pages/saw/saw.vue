<!--
 * @Author: 许凯鑫
 * @Date: 2021-10-02 13:56:58
 * @LastEditTime: 2024-05-28 17:13:09
 * @FilePath: /yaame-h5/src/pages/saw/saw.vue
 * @Description: 我的访客页面
-->
<template>
    <div :class="['withdraw-record', is_TuTu && 'tutu']">
        <!-- <custom-header title="谁看过我" /> -->
        <!-- <page-loading v-if="page_loading"></page-loading> -->
        
        <!-- 下拉刷新列表 -->
        <refresh ref="wlRefresh" @onRefresh="handleRefresh">
            <ul v-infinite-scroll="loadMore" :infinite-scroll-immediate-check="true" infinite-scroll-disabled="loading"
            infinite-scroll-distance="10" class="saw-list">
                <li v-for="(item, index) in list" :key="item.uid" class="saw-item">
                    <div :class="{ 'avatar-container': true, 'in_room': item.voice_room_id }">
                        <img v-lazy="item.avatar" class="avatar" alt="" @click="toDetail(item.uid)">
                        <!-- <div v-if="item.voice_room_id" class="in_room_box">
                            <img src="http://imgcom.static.suishenyun.net/4944aba7126852f7b9f6e5263e8aaa64cb74face57696-uKnOYo_fw658-13%EF%BC%88%E6%8B%96%E7%A7%BB%E9%A1%B9%E7%9B%AE%EF%BC%89%E5%A4%87%E4%BB%BD%202@2x-5abadd.png" alt="">
                            <span>房间中</span>
                        </div> -->
                        <div v-show="item.voice_room_id" :class="['tag-live top-tag-live', 'tag-live-' + language]">
                            <span class="voice">
                                <i class="first"></i>
                                <i class="three"></i>
                                <i class="four"></i>
                            </span>
                        </div>
                    </div>
                    <div style="flex: 1;">
                        <p class="nick-line">
                            <span v-if="item.nick" class="nick-name" :style="computedTextColor(item)">
                                {{ item.nick }}
                                <img v-if="item && item.noble && item.noble.noble_level_badge && item.noble.noble_level_badge.level_badge_icon" :src="item.noble.noble_level_badge.level_badge_icon" alt="">
                                <img v-if="item && item.vip && item.vip.level_badge_icon" :src="item.vip.level_badge_icon" alt=""> 
                            </span>
                            <!-- <img v-if="item.wealth" :src="item.wealth.icon" class="wealth-icon" alt=""> -->
                        </p>
                        <!-- <p class="adress">
                            {{ item.content }} 
                        </p> -->
                        <p v-if="item.wealth && item.wealth.name" class="adress">
                            {{ item.wealth.name }} 
                        </p>
                        <p v-if="item.visit_time" class="online-time">
                            {{ formatDate(item.visit_time) }}
                        </p>
                    </div>
                    <!-- <img v-if="item.voice_room_id" class="room-icon" src="../../assets/img/common/fs_but_gs.png" alt="" @click="enterRoom(item)"> -->

                    <!-- <div v-if="item.voice_room_id" class="btn room-div" @click="enterRoom(item)">
                        <img src="http://imgcom.static.suishenyun.net/home_icon_create@2x-1cdc87.png" alt="">
                        <span>{{ $t('Follow') }}</span>
                    </div> -->
                    <div v-if="item.attention" class="btn has-attention" @click="cancelAttention(item, index)">{{ $t('Followed') }}</div>
                    <div v-else :class="{'btn': true, 'no-attention': true, 'so-no-attention': appType === 'sweet' || appType === 'cu' }" @click="payAttention(item, index)">  
                        <img src="../../assets/img/common/room_icon_gz_b.png" alt="" />
                        <span>{{ $t('Focus') }}</span>
                    </div>
                </li>
            </ul>
            <blank-page v-if="!list || !list.length" :title="noVisitors" ></blank-page>
            <!-- 取消关注弹框 -->
            <confirm-modal
                v-show="show_confirm"
                :title="confirmTitle"
                :content="confirmContent"
                :cancle_text="confirmCancel"
                :confirm_text="confirmTitle"
                @cancleCallback="show_confirm=false"
                @confirmCallback="submitCancelAttention"
            />
        </refresh>
    </div>
</template>
<script>
    import refresh from '../../components/common/refresh.vue';
    import customHeader from '../../components/common/header.vue';
    import blankPage from '../../components/common/blank_page.vue';
    import commonButton from '../../components/common/button.vue';
    import confirmModal from '../../components/common/confirm.vue';
    import request from '../../lib/request/saw';
    import { getAppType, getChannel, getLanguage, isIOS } from '@/lib/device';
    import {
        formatDate
    } from '../../lib/utils';
    export default {
        components: {
            customHeader,
            // pageLoading,
            refresh,
            blankPage,
            commonButton,
            confirmModal
        },
        data() {
            return {

                // 取消关注弹框toggle
                show_confirm: false, 
                // page_loading: true,

                // 列表数据
                list: [],

                // 是否加载数据switch
                has_next: false,

                // 页码
                page: 1, 
                size: 20,

                // 当前用户性别
                my_sex: 0,
                cancel_target: {
                    info: {},
                    index: 0,
                },
                appType: getAppType()
            };
        },
        computed: {
            is_TuTu() {
                return getAppType() === 'planet' && getChannel() === 'appstore';
            },

            noVisitors() {
                return this.$t('noVisitors');
            },
            title() {
                return this.$t('title');
            },
            language() {
                return getLanguage() || 'en';
            },

            confirmTitle() {
                return this.$t('confirmTitle');
            },
            confirmCancel() {
                return this.$t('confirmCancel');
            },
            confirmContent() {
                return this.$t('confirmContent');
            },

        },
        created() {
            document.title = this.title;
            this.getList();
        },
        mounted() {

            // if (isIOS()) {
            //     window.webkit.messageHandlers.onLogEvent.postMessage(JSON.stringify({
            //         event_name: 'click_top_contribute_ranking',
            //         cid: -1009,
            //         md: 112,
            //         args_name: 'click_contribute_ranking',
            //         args: {
            //             ranking_type: 'ip_login',
            //         }
            //     }));
            // } else {
            //     window.peanut_client.onLogEvent(JSON.stringify({
            //         event_name: 'click_top_contribute_ranking',
            //         cid: -1009,
            //         md: 112,
            //         args_name: 'click_contribute_ranking',
            //         args: {
            //             ranking_type: 'ip_login',
            //         }
            //     }));
            // }
        },
        methods: {
            /**
             * @description: 获取访客list数据
             */            
            async getList() {
                let res = await request.getSawList(this.page, this.size);
                // this.page_loading = false;
                if (res.status === 1000) {
                    if (this.page === 1) {
                        this.list = res.data.content;
                    } else {
                        this.list = this.list.concat(res.data.content);
                    }

                    this.has_next = res.data.has_next;
                    this.my_sex = res.data.my_sex;
                }
            },


            /**
             * @description: 格式化时间fun 
             * @param {Date ｜ String} time Date格式对象或字符串
             */            
            formatDate(time) {
                return formatDate(time, 'MM-dd');
            },


            /**
             * @description: 下拉加载钩子fun
             */            
            loadMore() {
                if (this.has_next) {
                    this.page++;
                    this.getList();
                }
            },

            /**
             * @description: 上拉刷新fun
             */            
            async handleRefresh() {
                this.page = 1;
                await this.getList();
                setTimeout(() => {
                    this.$refs.wlRefresh.isLoading = false;
                }, 500);
            },

            /**
             * @description: 进入房间clickFun
             * @param {Object} item 列表list中的某一项
             */            
            enterRoom(item) {
                window.location.href = `wlyaame://voice/room/live?room_id=${item.voice_room_id}&jump_from=visitor&follow_uid=${item.uid}&follow_name=${encodeURIComponent(item.nick)}`;
            },

            /**
             * @description: 头像clickFun，跳转用户详情
             * @param {String} uid 用户uid
             */  
            toDetail(uid) {
                location.href = `wlyaame://trend/user?uid=${uid}`;
            },

            /**
             * @description: 关注clickFun
             * @param {Object} info 访客list中的项
             * @param {Number} index 访客list中项对应的index
             */            
            async payAttention(info, index) {
                let res = await request.payAttention({
                  target_uid: info.uid
                });
                if (res.status !== 1000) return;
                // 更新状态
                this.list.splice(index, 1, Object.assign(info, { attention: 1 }));
            },

            /**
             * @description: 取消关注clickFun
             * @param {Object} info 访客list中的项
             * @param {Number} index 访客list中项对应的index
             */            
            cancelAttention(info, index) {
                Object.assign(this.cancel_target, { info, index });
                this.show_confirm = true;
            },

            /**
             * @description: 取消关注弹框确认clickFun
             */            
            async submitCancelAttention() {
                let res = await request.cancelAttention({
                  target_uid: this.cancel_target.info.uid
                });
                if (res.status !== 1000) return;
                // 更新状态
                this.show_confirm = false;
                this.list.splice(this.cancel_target.index, 1, Object.assign(this.cancel_target.info, { attention: 0 }));
            },
            computedTextColor(item) {
                if (item && item.colorful_nick_name && item.colorful_nick_name.colorful_list) {
                    const colorful_list = item.colorful_nick_name.colorful_list;
                    if (colorful_list) {
                        const gradient = `linear-gradient(to right, ${colorful_list.join(', ')})`;
                        // 返回Vue期望的样式对象
                        return {
                            background: gradient,
                            color: 'transparent', // 将文本颜色设置为透明以便显示渐变背景
                            backgroundClip: 'text', // 只在文本区域显示背景
                            WebkitBackgroundClip: 'text', // 针对webkit浏览器的前缀版本
                            WebkitTextFillColor: 'transparent', // 对于webkit浏览器，对文本填充颜色也设置透明
                        };
                    } else {
                        return {};
                    }
                } else {
                    return {}
                }
            },
        },
    };
</script>
<style scoped>
    .withdraw-record{
        min-height: 100vh;
    }
    .withdraw-record.tutu{
        background: #121212;
    }
    .saw-list {
        margin: 0.3rem;
    }

    .btn{
        width: 1.3rem;
        height: 0.66rem;
        font-size: .24rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: .33rem;
    }
    .tutu .btn{
        border-radius: .16rem;
        font-weight: bold;
    }

    .has-attention{
        color: #999;
        background: #EDEDED;
    }

    .tutu .btn.has-attention{
        color: rgba(255,255,255,0.4);
        background: rgba(255,255,255,0.15);
    }

    .no-attention{
        background: linear-gradient(90deg, #FE3E7F 0%, #FE47BC 100%);
        box-shadow: 0px 0px 12px 0px rgba(255, 48, 146, 0.3);
        opacity: 0.9;
        color: #fff;
    }
    .tutu .btn.no-attention{
        background: #FFFFFF;
        color: #121212;
    }
    .so-no-attention{
        background: linear-gradient(90deg, #07CEF4 0%, #1DD4D6 100%);
        box-shadow: none;
    }
    .no-attention img{
        display: block;
        width: .32rem;
        height: .32rem;
        margin-right: .08rem;
    }


    .room-icon{
        display: block;
        width: .9rem;
        height: .9rem;
    }
    
    .saw-item {
        font-size: 0.3rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.22rem;
        padding: 0.3rem;
        position: relative;
        background: #fff;
        border-radius: .24rem;
    }

    .tutu .saw-item{
        background: #121212;
        padding: 0.3rem 0;
        margin-bottom: 0;
        position: relative;
    }

    .tutu .saw-item::after{
        position: absolute;
        content: '';
        width: 100%;
        height: 1px;
        background: rgba(255,255,255,0.1);
        left: 0;
        bottom: 0;
        transform: scaleY(0.5);
    }

    .tutu .saw-item .nick-name{
        color: #FFFFFF;
    }
    .tutu .saw-item .adress{
        color: rgba(255,255,255,0.6);
    }
    .tutu .saw-item .online-time{
        color: rgba(255,255,255,0.4);
    }
    
    
    .saw-item .left {
        flex: 1;
        display: flex;
        align-items: center;
    }

    .saw-item .right{
        display: flex;
        align-items: center;
        width: 2.3rem;
    }
    
    .avatar-container {
        position: relative;
        width: 1.26rem;
        height: 1.26rem;
        padding: .08rem;
        border-radius: 50%;
        margin-right: 0.3rem;
        background-image: url('https://imgcom-static.suishenyun.net/maybe/ce979780-c08d-41fd-b9ef-6e8656fa0e36.png');
        background-size: 1.1rem auto;
        background-repeat: no-repeat;
        background-position: center center;
        text-align: center;
        line-height: 1.26rem;
    }
    .tutu .avatar-container{
        background-image: none;
    }
    .in_room{
        border: 1px solid #FF65A7;
    }

    .in_room_box{
        transform: scale(.75);
        width: 1.3333rem;
        height: .4rem;
        background-color: #FF65A7;
        border-radius: .17rem;
        position: absolute;
        bottom: -.1rem;
        left: calc(.63rem - .666rem);
        text-align: center;
        line-height: .4rem;
        color: #fff;
        font-size: .24rem;
    }
    .in_room_box > img{
        width: .24rem;
        height: .24rem;
        vertical-align: sub;
    }
    .wealth-icon{
        position: relative;
        display: block;
        height: .3rem;
        width: auto;
        left: .2rem;
        /* z-index: 3; */
    }
    
    .saw-item .avatar {
        display: block;
        width: 1.1rem;
        height: 1.1rem;
        border-radius: 50%;
        object-fit: cover;
    }
    
    .saw-item .nick-name {
        font-weight: bold;
        font-size: .3rem;
        line-height: .42rem;
        /* max-width: 2.5rem; */
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .saw-item .nick-name img {
        height: 0.3rem;
        width: auto;
        vertical-align: middle;
    }
    
    .saw-item .online {
        font-size: 0.28rem;
        color: #14C95E;
        margin-left: 0.2rem;
        line-height: 0.28rem;
    }
    
    .saw-item .online-icon {
        width: 0.28rem;
        height: 0.28rem;
        vertical-align: middle;
        margin-left: 0.1rem;
    }
    
    .nick-line {
        display: flex;
        align-items: center;
        position: relative;
        max-width: 3rem;
    }
    
    .saw-item .adress {
        font-size: 0.26rem;
        color: #666666;
        line-height: 0.38rem;
        margin-top: 0.08rem;
    }

    .online-time{
        font-size: 0.24rem;
        color: #999999;
        line-height: 0.34rem;
        margin-top: 0.1rem;
    }

    .room-div{
        width: 1.3rem;
        height: .66rem;
        background-color: #FFF1F5;
        border-radius: .33rem;
        box-shadow: 0px 0px 12px 0px rgba(242, 245, 251, 0.7);
        opacity: 0.9;
        color: #FD437A;
        font-size: .24rem;
        margin-right: .2rem;
    }
    .so-room-div{
        color:#00C6E7;
        background-color: #E2FCFF;
    }
    .room-div img{
        display: block;
        width: .32rem;
        height: .32rem;
        margin-right: .08rem;
    }

    .tag-live{
        width: 1.02rem;
        height: 0.3rem;
        background-image: url('http://imgcom.static.suishenyun.net/h5/65e8f74c-4e75-47b7-b32d-111b497aaa3b.png');
        background-size: 1.02rem 0.3rem;
        padding-left: 0.1rem;
        padding-bottom: 0.03rem;
    }
    .tag-live-en{
        background-image: url('https://static.yaame.io/admin/f93b0b1c65cedf417aee389b62160ce1.png');
    }
    .tag-live-id{
        background-image: url('https://static.yaame.io/admin/f93b0b1c65cedf417aee389b62160ce1.png');
        /* background-image: url('https://static.yaame.io/admin/db70422aeafc7f150eea4065e2c49df6.png'); */
    }
    .top-tag-live{
        position: absolute;
        left: .1rem;
        bottom: -0.04rem;
        z-index: 10;
    }

    /* 跳动的音符 */
    .voice {
        display: flex;
        align-items: flex-end;
        justify-content: center;
        height: 100%;
        width: 0.24rem;
    }
    .voice i {
        display: inline-block;
        border-left: 2px solid #fff;
        margin: 0 1px;
        position: relative;
    }
    .voice i.first{
        height: 0.12rem;
        animation: first 0.5s linear 0s infinite alternate;
    }
    .voice i.second {
        height: 0.08rem;
        animation: second 1s linear 0s infinite alternate;
    }
    .voice i.three {
        height: 0.1rem;
        animation: three 0.8s linear 0s infinite alternate;
    }
    .voice i.four {
        height: 0.16rem;
        animation: four 0.6s linear 0s infinite alternate;
    }

    @keyframes first {
        0% {
            height: 0.08rem;
        }

        50% {
            height: 0.12rem;
        }

        100% {
            height: 0.14rem;
        }
    }

    @keyframes second {
        0% {
            height: 0.16rem;
        }

        50% {
            height: 0.13rem;
        }

        100% {
            height: 0.11rem;
        }
    }

    @keyframes three {
        0% {
            height: 0.18rem;
        }

        50% {
            height: 0.16rem;
        }

        100% {
            height: 0.14rem;
        }
    }

    @keyframes four {
        0% {
            height: 0.14rem;
        }

        50% {
            height: 0.12rem;
        }

        100% {
            height: 0.09rem;
        }
    }
</style>