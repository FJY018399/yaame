<template>
	<div
		:style="{ paddingTop: safeHeight + 1.08 + 'rem' }"
		:class="['main', key]"
	>
		<Header style="position: fixed;" color="white">{{ $t(key) }}</Header>
        <page-loading v-if="pageLoading"></page-loading>

        <div :style="{ paddingTop: safeHeight + 'rem' }" :class="['cp-header', key]">

            <img v-if="key === 'Lover'" class="cp-header-title" :src="LoverImgList[language]" alt="">
            <img v-else class="cp-header-title" :src="BestieImgList[language]" alt="">
            <div class="cp-top-list">
                    <div v-for="(item, index) in CPTopList" :class="['top-' + index]">


                        <div v-if="item.relation_user_info_item_vo" :style="{'background-image': `url(${item.relation_user_info_item_vo.avatar})`}" class="cp-avatar left-avatar" @click="toRoom(item.relation_user_info_item_vo)">
                            <img v-if="index === 0" src="https://yaame-static.yaame.io/admin/eef138c7f78bb71b7af44f82adacd998.png" alt="">
                            <img v-if="index === 1" src="https://yaame-static.yaame.io/admin/776334465f2c7d8adc0e5f8fad5b60d9.png" alt="">
                            <img v-if="index === 2" src="https://yaame-static.yaame.io/admin/9e12bfc2c39bd55b399095df1d8234a6.png" alt="">


                        </div>
                        <div v-if="item.user_info_item_vo" :style="{'background-image': `url(${item.user_info_item_vo.avatar})`}" class="cp-avatar right-avatar" @click="toRoom(item.user_info_item_vo)">
                            <img v-if="index === 0" src="https://yaame-static.yaame.io/admin/eef138c7f78bb71b7af44f82adacd998.png" alt="">
                            <img v-if="index === 1" src="https://yaame-static.yaame.io/admin/776334465f2c7d8adc0e5f8fad5b60d9.png" alt="">
                            <img v-if="index === 2" src="https://yaame-static.yaame.io/admin/9e12bfc2c39bd55b399095df1d8234a6.png" alt="">
                        </div>


                        <img v-if="key === 'Lover'" class="hear-img" src="https://yaame-static.yaame.io/admin/9397502bda326340379d39e1f2a3c08b.png" alt="">
                        <img v-else class="hear-img" src="https://yaame-static.yaame.io/admin/70ee5e6b94ad33e1c16964f8b7de4dc5.png" alt="">
                        <div :class="['cp-top-name', key]">
                            <div v-if="item.relation_user_info_item_vo" class="no-wrap">{{ item.relation_user_info_item_vo.nick_name }}</div>
                            <div v-if="item.user_info_item_vo" class="no-wrap">{{ item.user_info_item_vo.nick_name }}</div>
                        </div>
                        <div :class="['cp-top-value', key]">
                            <img v-if="key === 'Lover'" src="https://yaame-static.yaame.io/admin/6651549f064d2067f68bd03e41c9c589.png" alt="">
                            <img v-else src="https://yaame-static.yaame.io/admin/3707c09bca12f72930e188becf46a823.png" alt="">
                            {{ item.exp_value }}</div>
                    </div>
                </div>
        </div>

        <div :style="{ top: safeHeight + 7.3 + 'rem' }" :class="['cp-container', key]">
            <div v-for="(item,index) in CPRewardList" :key="index" class="gift-container">
                <header>{{ $t(`top${index + 1}`) }}</header>
                <div class="reward-container">
                    <div v-for="(ele, inx) in item.reward_item_vo_list" :key="inx">
                        <div class="reward-div">
                            <img :src="ele.icon" alt="">
                            <div v-if="ele.object_type !== 'DIAMOND'" class="reward-time">{{ ele.diamond_worth }}</div>
                        </div>
                        <p class="reward-name no-wrap">{{ ele.gift_name }}</p>
                        <p v-if="ele.object_type === 'DIAMOND'" class="reward-value no-wrap">
                            <img src="https://yaame-static.yaame.io/admin/9ebec8ae9facb2f66be718b747d16ea4.png" alt="">
                            {{ ele.diamond_worth }}</p>
                    </div>
                </div>
            </div>

            <p class="reward-text">
                {{ $t('footer') }}
            </p>
        </div>


	</div>
</template>

<script>
import Header from "../../components/common/header.vue";
import { getSafeHeight, getLanguage } from "@/lib/device";
import { getQueryString } from "@/lib/utils";
import request from "../../lib/request/contribution.js";
import pageLoading from "../../components/common/page_loading.vue";
import { onMounted, ref, computed } from "vue";
const getDefaultCPUser = () => {
    return {
        relation_user_info_item_vo: {
            avatar: "https://yaame-static.yaame.io/admin/72dc36eb39c5535e8bd1c407f13cdffb.png",
            nick_name: "None"
        },
        user_info_item_vo: {
            avatar: "https://yaame-static.yaame.io/admin/72dc36eb39c5535e8bd1c407f13cdffb.png",
            nick_name: "None"
        },
        exp_value: 0,
        cp_rank: '-'
    };
};
export default {
	components: {
		Header,
        pageLoading
	},
	setup() {
        let safeHeight = ref(0);
        const key = getQueryString('key');

        let pageLoading = ref(false);

        let CPTopList = ref([getDefaultCPUser(), getDefaultCPUser(), getDefaultCPUser()]);
        let CPRewardList = ref([]);

        let language = computed(() => {
            let locale = getLanguage() || "en";
            if (['zh-hk', 'zh-tw', 'zh-mo', 'zh-cn', 'zh_cn'].indexOf(locale) > -1) {
                let localEnum = {
                    'zh-hk': 'zh-tw',
                    'zh-tw': 'zh-tw',
                    'zh-mo': 'zh-tw',
                    'zh-cn': 'zh-cn',
                    'zh_cn': 'zh-cn',
                };

                locale = localEnum[locale];
            }
            return locale;
        });

        let LoverImgList = ref({
            'zh-cn': 'https://yaame-static.yaame.io/admin/80554aaf3ffee53cbdd885b329d4dca3.png',
            'zh-tw': 'https://yaame-static.yaame.io/admin/c735f262e148c55c698cec1d3525221e.png',
            'en': 'https://yaame-static.yaame.io/admin/7e8521bcd24428af78dacb46fb8b03af.png',
            'id': 'https://yaame-static.yaame.io/admin/61da859bed45acc53dcaa06158441133.png',
            'ar': 'https://yaame-static.yaame.io/admin/d603a96e4f44dcb89a6eb6ce9ad91038.png',
        });

        let BestieImgList = ref({
            'zh-cn': 'https://yaame-static.yaame.io/admin/aa6a4d28e63cb6753373204be9436eea.png',
            'zh-tw': 'https://yaame-static.yaame.io/admin/3b07778b6bd3216e8ac9d8db393c70b0.png',
            'en': 'https://yaame-static.yaame.io/admin/d439011019072c1115addd5574c1faa5.png',
            'id': 'https://yaame-static.yaame.io/admin/44c9b69093cfd78c416008f416bde580.png',
            'ar': 'https://yaame-static.yaame.io/admin/500bf1a9aaffec3ff414dfc4af712f4e.png',
        });

        const getData = async () => {
            try {
                let res = await request.getCPRewards();
                if (res.status !== 1000) return;

                if (key === 'Lover') {
                    CPRewardList.value = res.data.top_lover_rewards_list;
                    if (res.data.last_weeks_lover_top_list) {
                        if (res.data.last_weeks_lover_top_list.length > 0) {
                            if (res.data.last_weeks_lover_top_list.length < 3) {
                                CPTopList.value = res.data.last_weeks_lover_top_list.concat([getDefaultCPUser(), getDefaultCPUser()]);
                            } else {
                                CPTopList.value = res.data.last_weeks_lover_top_list;
                            }
                        } else {
                            CPTopList.value = [getDefaultCPUser(), getDefaultCPUser(), getDefaultCPUser()];
                        }
                    }
                } else {

                    if (res.data.last_weeks_bestie_top_list) {
                        if (res.data.last_weeks_bestie_top_list.length > 0) {
                            if (res.data.last_weeks_bestie_top_list.length < 3) {
                                CPTopList.value = res.data.last_weeks_bestie_top_list.concat([getDefaultCPUser(), getDefaultCPUser()]);
                            } else {
                                CPTopList.value = res.data.last_weeks_bestie_top_list;
                            }
                        } else {
                            CPTopList.value = [getDefaultCPUser(), getDefaultCPUser(), getDefaultCPUser()];
                        }
                    }
                    CPRewardList.value = res.data.top_bestie_rewards_list;
                }

            } catch (error) {
                console.log(error);
            }
        }

        onMounted(() => {
            let safeArea = getSafeHeight() || 0;
            safeHeight.value = (safeArea * 2) / 100;

            getData();
        });
        return {
            safeHeight,
            key,
            pageLoading,

            CPTopList,
            CPRewardList,

            language,
            LoverImgList,
            BestieImgList,
        };
    },
};
</script>
<style lang="less">
.main {
	width: 7.5rem;
	min-height: 100vh;
	overflow-x: hidden;
    .cp-header {
        width: 7.5rem;
        height: 8.2rem;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        background-size: 7.5rem auto;
        background-repeat: no-repeat;
        &.Lover {
            background-image: url(https://yaame-static.yaame.io/admin/44141e4d1be39a2a76d859b16020383b.png);
        }
        &.Bestie {
            background-image: url(https://yaame-static.yaame.io/admin/418edff863c7a727a9f658c3d2f0a24d.png);
        }
        .cp-header-title {
            width: 3.95rem;
            height: auto;
            margin-top: 1.24rem;
            margin-left: 1.78rem;
        }
        .cp-top-list {
        width: 7.5rem;
        height: 5.2rem;
        position: absolute;
        top: 2.5rem;
        left: 0;
        .top-0 {
            width: 5.2rem;
            height: 2.2rem;
            background-size: 5.2rem auto;
            background-repeat: no-repeat;
            background-position: center center;
            position: absolute;
            top: 0;
            left: 1.15rem;
            background-image: url(https://yaame-static.yaame.io/admin/560a6093da7146eba004e1a34c58c307.png);
            .cp-avatar {
                width: 1.32rem;
                height: 1.32rem;
                background-size: 1.32rem 1.32rem;
                background-repeat: no-repeat;
                background-position: center center;
                position: absolute;
                background-image: url(https://yaame-static.yaame.io/admin/eef138c7f78bb71b7af44f82adacd998.png);
                display: flex;
                justify-content: center;
                align-items: center;
                display: block;
                border-radius: 50%;
                img {
                    width: 1.36rem;
                    height: auto;
                    display: block;
                    border-radius: 50%;
                    position: absolute;
                    top: -0.02rem;
                    left: -0.02rem;
                }
            }
            .left-avatar {
                top: 0.58rem;
                left: 1.41rem;
            }
            .right-avatar {
                top: 0.58rem;
                right: 1.41rem;
                z-index: 1;
            }
            .hear-img {
                width: 0.68rem;
                height: 0.68rem;
                position: absolute;
                top: 0.94rem;
                left: 49%;
                transform: translateX(-50%);
                z-index: 2;
            }
        }
        .top-1 {
            width: 3.66rem;
            height: 1.54rem;
            background-size: 3.66rem auto;
            background-repeat: no-repeat;
            background-position: center center;
            position: absolute;
            top: 2.95rem;
            left: 0.09rem;
            background-image: url(https://yaame-static.yaame.io/admin/9a129308d957e83d9fbca61adc45261d.png);
            .cp-avatar {
                width: 0.92rem;
                height: 0.92rem;
                background-size: 0.92rem 0.92rem;
                background-repeat: no-repeat;
                background-position: center center;
                position: absolute;
                background-image: url(https://yaame-static.yaame.io/admin/776334465f2c7d8adc0e5f8fad5b60d9.png);
                display: flex;
                justify-content: center;
                align-items: center;
                display: block;
                border-radius: 50%;
                img {
                    width: 0.96rem;
                    height: auto;
                    display: block;
                    border-radius: 50%;
                    position: absolute;
                    top: -0.02rem;
                    left: -0.02rem;
                }
            }
            .left-avatar {
                top: 0.41rem;
                left: 0.99rem;
            }
            .right-avatar {
                top: 0.41rem;
                right: 0.98rem;
                z-index: 1;
            }
            .hear-img {
                width: 0.48rem;
                height: 0.48rem;
                position: absolute;
                top: 0.64rem;
                left: 49%;
                transform: translateX(-50%);
                z-index: 2;
            }
        }
        .top-2 {
            width: 3.66rem;
            height: 1.54rem;
            background-size: 3.66rem auto;
            background-repeat: no-repeat;
            background-position: center center;
            position: absolute;
            top: 2.95rem;
            right: 0.09rem;
            background-image: url(https://yaame-static.yaame.io/admin/7cb674565f6d846584593b639a7c8d65.png);
            .cp-avatar {
                width: 0.92rem;
                height: 0.92rem;
                background-size: 0.92rem 0.92rem;
                background-repeat: no-repeat;
                background-position: center center;
                position: absolute;
                background-image: url(https://yaame-static.yaame.io/admin/9e12bfc2c39bd55b399095df1d8234a6.png);
                display: flex;
                justify-content: center;
                align-items: center;
                display: block;
                border-radius: 50%;
                img {
                    width: 0.96rem;
                    height: auto;
                    display: block;
                    border-radius: 50%;
                    position: absolute;
                    top: -0.02rem;
                    left: -0.02rem;
                }
            }
            .left-avatar {
                top: 0.41rem;
                left: 0.99rem;
            }
            .right-avatar {
                top: 0.41rem;
                right: 0.98rem;
                z-index: 1;
            }
            .hear-img {
                width: 0.48rem;
                height: 0.48rem;
                position: absolute;
                top: 0.64rem;
                left: 49%;
                transform: translateX(-50%);
                z-index: 2;
            }
        }
        .cp-top-name {
            width: 2.7rem;
            height: 0.36rem;
            background-size: 2.7rem auto;
            background-repeat: no-repeat;

            position: absolute;
            left: 50%;
            bottom: -0.36rem;
            transform: translateX(-50%);
            display: flex;
            font-size: 0.24rem;
            color: #fff;
            &.Lover {
                background-image: url(https://yaame-static.yaame.io/admin/f58fd8213860dcbf8a547590e53a0c5d.png);
            }
            &.Bestie {
                background-image: url(https://yaame-static.yaame.io/admin/ce669bb22a133a06efdd33030736efe6.png);
            }
            div {
                flex: 1;
                &:nth-child(1) {
                    padding-right: 0.1rem;
                    text-align: right;
                }
                &:nth-child(2) {
                    padding-left: 0.1rem;
                    text-align: left;
                }
            }
        }
        .cp-top-value {
            width: 2.7rem;
            height: 0.36rem;
            position: absolute;
            left: 50%;
            bottom: -0.76rem;
            transform: translateX(-50%);
            font-size: 0.22rem;
            color: #fff;
            text-align: center;
            &.Lover {
                color: #F75A88;
            }
            &.Bestie {
                color: #C4CCFF;
            }
            img {
                width: 0.28rem;
                height: 0.28rem;
                vertical-align: middle;
            }
        }
    }
    }
    .cp-container {
        width: 7.5rem;
        position: absolute;
        top: 7.32rem;
        z-index: 2;
        height: 14.02rem;
        background: #FFFFFF;
        border-radius: 0.3rem 0.3rem 0 0;
        padding: 0.3rem;
        &.Lover {
            color: #F2518E;
            .gift-container {
                background: #FFF6F3;
                header {
                    display: inline-block;
                    padding: 0 0.44rem;
                    height: 0.3rem;
                    line-height: 0.3rem;
                    font-size: 0.3rem;
                    font-weight: 600;
                    position: absolute;
                    top: 0.3rem;
                    left: 50%;
                    transform: translateX(-50%);
                    font-weight: bold;
                    &::after {
                        content: "";
                        position: absolute;
                        left: 0;
                        top: 0.01rem;
                        width: 0.36rem;
                        height: 0.28rem;
                        background-image: url("https://yaame-static.yaame.io/admin/41db3a7af20728f80d78a9764a71eb65.png");
                        background-size: contain;
                    }
                    &::before {
                        content: "";
                        position: absolute;
                        right: 0;
                        top: 0.01rem;
                        width: 0.36rem;
                        height: 0.28rem;
                        background-image: url("https://yaame-static.yaame.io/admin/64d7460379362f1f4c849e690b282c5b.png");
                        background-size: contain;
                    }
                }
                .reward-container {
                    div {
                        .reward-div {
                            background: rgba(255,119,170,0.3);
                            border-radius: 0.24rem;
                            border: 0.02rem solid #FCA0D5;
                        }
                    }
                }

            }
        }
        &.Bestie {
            color: #6278FE;
            .gift-container {
                background: #F3F8FF;
                header {
                    display: inline-block;
                    padding: 0 0.44rem;
                    height: 0.3rem;
                    line-height: 0.3rem;
                    font-size: 0.3rem;
                    font-weight: 600;
                    position: absolute;
                    top: 0.3rem;
                    left: 50%;
                    transform: translateX(-50%);
                    &::after {
                        content: "";
                        position: absolute;
                        left: 0;
                        top: 0.01rem;
                        width: 0.36rem;
                        height: 0.28rem;
                        background-image: url("https://yaame-static.yaame.io/admin/e88cd49b2176531e1c50b5fb36b00857.png");
                        background-size: contain;
                    }
                    &::before {
                        content: "";
                        position: absolute;
                        right: 0;
                        top: 0.01rem;
                        width: 0.36rem;
                        height: 0.28rem;
                        background-image: url("https://yaame-static.yaame.io/admin/b4bd4acd74dea68e42a7a82be23749b0.png");
                        background-size: contain;
                    }
                }
                .reward-container {
                    div {
                        .reward-div {
                            background: rgba(119,159,255,0.3);
                            border-radius: 0.24rem;
                            border: 0.02rem solid #A0A8FC;

                            .reward-time {
                                width: auto;
                                display: inline;
                                padding: 0 0.14rem;
                                height: 0.3rem;
                                border-radius: 0.15rem;
                                border: 0.02rem solid #8357FF;
                                background: linear-gradient(314deg, #6A6AFF 0%, #B6EAFF 100%);
                                position: absolute;
                                right: -0.08rem;
                                top: -0.12rem;
                                font-size: 0.22rem;
                                text-align: center;
                                line-height: 0.3rem;
                                color: #5629D3;
                            }
                        }
                    }
                }
            }
        }

        .gift-container {
            width: 6.9rem;
            height: 3.98rem;
            border-radius: 0.24rem;
            border: 0.01rem solid #FFFFFF;
            margin-bottom: 0.2rem;
            position: relative;
            padding: 0.8rem 0.3rem 0.3rem;

            header {
                display: inline-block;
                padding: 0 0.44rem;
                height: 0.3rem;
                line-height: 0.3rem;
                font-size: 0.3rem;
                font-weight: 600;
                position: absolute;
                top: 0.3rem;
                left: 50%;
                transform: translateX(-50%);
                &::after {
                    content: "";
                    position: absolute;
                    left: 0;
                    top: 0.01rem;
                    width: 0.36rem;
                    height: 0.28rem;
                    background-image: url("https://yaame-static.yaame.io/admin/41db3a7af20728f80d78a9764a71eb65.png");
                    background-size: contain;
                }
                &::before {
                    content: "";
                    position: absolute;
                    right: 0;
                    top: 0.01rem;
                    width: 0.36rem;
                    height: 0.28rem;
                    background-image: url("https://yaame-static.yaame.io/admin/64d7460379362f1f4c849e690b282c5b.png");
                    background-size: contain;
                }
            }
            .reward-container {
                margin-top: 0.25rem;
                width: 6.1rem;
                height: 2.36rem;
                display: flex;
                justify-content: space-between;
                div {
                    width: 1.88rem;
                    height: 2.36rem;
                    .reward-div {
                        width: 1.88rem;
                        height: 1.88rem;
                        background: #edeefe;
                        border-radius: 0.24rem;
                        border: 0.02rem solid #d5d5ff;
                        margin-bottom: 0.15rem;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        position: relative;
                        img {
                            width: 1.6rem;
                            height: 1.6rem;
                        }
                        .reward-time {
                            width: auto;
                            display: inline;
                            padding: 0 0.14rem;
                            height: 0.3rem;
                            border-radius: 0.15rem;
                            border: 0.02rem solid #F75D97;
                            background: linear-gradient(314deg, #FF6AA8 0%, #FFCBB6 100%);
                            position: absolute;
                            right: -0.08rem;
                            top: -0.12rem;
                            font-size: 0.22rem;
                            text-align: center;
                            line-height: 0.3rem;
                            color: #A31849;
                        }
                    }
                    .reward-name {
                        font-size: 0.24rem;
                        font-weight: 400;
                        text-align: center;
                    }
                    .reward-value {
                        font-size: 0.24rem;
                        font-weight: 400;
                        text-align: center;
                        line-height: 0.24rem;
                        img {
                            width: 0.24rem;
                            height: 0.24rem;
                            //vertical-align: middle;
                        }
                    }
                }
            }
        }

        .reward-text {
            width: 6.9rem;
            font-size: 0.24rem;
            font-weight: 400;
            color: #999999;
            margin-top: 0.4rem;
            opacity: 0.6;
        }
    }
}
</style>
