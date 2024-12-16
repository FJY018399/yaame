<template>
    <refresh class="refresh" ref="wlRefresh" @onRefresh="rankingList">
        <div class="main">
            <!--标题-->
            <custom-header class="header" color="harvest">{{ $t('title') }}</custom-header>
            <!--顶部-->
            <div class="top" :style="{ backgroundImage: `url(${headImg[locale]})` }">
                <!--规则-->
                <div class="rule-button" @click="openRule">{{ $t('rule') }}</div>
                <!--奖励-->
                <div class="award-button" @click="$router.push('award')">{{ $t('reward') }}</div>
                <!-- 时间计时 -->
                <div class="time-span">
                    <div class="time">{{ days }}</div>
                    <div class="time">D</div>
                    <div class="time">{{ hours < 10 ? `0${hours}` : hours }}</div>
                    <div class="time">{{ minutes < 10 ? `0${minutes}` : minutes }}</div>
                    <div class="time">{{ seconds < 10 ? `0${seconds}` : seconds }}</div>
                </div>
            </div>
            <!--奖励-->
            <div class="award" @click="$router.push('award')"></div>
            <!--排行-->
            <div class="rank">
                <div class="ranking">
                    <!--前三-->
                    <div class="front" v-for="(item, index) in 3" :key="index">
                        <div class="head">
                            <img v-if="rankingThree[index] && rankingThree[index].subject_icon" :src="rankingThree[index] && rankingThree[index].subject_icon" alt="" @click="toDetails(rankingThree[index])">
                            <img v-else :style="{ backgroundColor: '#ccc' }" src="https://yaame-static.yaame.io/admin/7480f5b6dbf21647a3fb37c0b078afbc.png" alt="">
                        </div>
                        <div class="name no-wrap">{{ rankingThree[index] && rankingThree[index].subject_name }}</div>
                        <div v-if="rankingThree[index] && rankingThree[index].is_mystery === 1" class="id no-wrap">ID: ******</div>
                        <div v-else class="id no-wrap">ID:{{ rankingThree[index] && rankingThree[index].peanut_id }}</div>
                        <div class="number">
                            <div class="tree"></div>
                            {{ rankingThree[index] && score(rankingThree[index].subject_score) }}
                        </div>
                    </div>
                    <!--剩余排行-->
                    <div v-show="rankingLast && rankingLast.length" class="item-scroll">
                        <div class="back" v-for="(item, index) in rankingLast" :key="item.peanut_id">
                            <div class="rank-back">{{ item.subject_rank }}</div>
                            <div class="head-back" :style="{ backgroundImage: `url(${item.subject_icon})` }" @click="toDetails(item)">
                                <img src="https://yaame-static.yaame.io/admin/25e76abf0bd95a86a5aa32f84f5c0352.png" alt="">
                            </div>
                            <div class="name-back">
                                <div class="name no-wrap">{{ item.subject_name }}</div>
                                <div v-if="item.is_mystery === 1" class="id">ID: ******</div>
                                <div v-else class="id">ID:{{ item.peanut_id }}</div>
                            </div>
                            <div class="number-back">
                                <div class="tree"></div>
                                {{ score(item.subject_score) }}
                            </div>
                        </div>
                    </div>
                    <!--无人上榜样式-->
                    <div v-if="rankingThree.length === 0" class="lack">
                        <p>{{ $t('no_one_on_the_list') }}</p>
                    </div>
                </div>
            </div>
            <!--用户排行-->
            <div class="my-rank">
                <div class="rank-back">{{ userList.subject_rank && userList.subject_rank <= 99 ?  userList.subject_rank : '99+' }}</div>
                <div class="head-back" :style="{ backgroundImage: `url(${userList.subject_icon})` }" @click="toDetails(userList)">
                    <img src="https://yaame-static.yaame.io/admin/25e76abf0bd95a86a5aa32f84f5c0352.png" alt="">
                </div>
                <div class="name-back">
                    <div class="name no-wrap">{{ userList.subject_name }}</div>
                    <div class="id">ID:{{ userList.peanut_id }}</div>
                </div>
                <div class="number-back">
                    <div class="tree"></div>
                    {{ score(userList.subject_score) }}
                </div>
            </div>
            <rule ref="rule"></rule>
        </div>
    </refresh>
</template>

<script setup>
import {onMounted, ref} from "vue";
import customHeader from "@/components/common/header.vue";
import Rule from "../components/rule.vue";
import {getRankingApi, getRankingWardApi} from "../api";
import { getLanguage } from "@/lib/device"
import refresh from "@/components/common/refresh.vue";
// 规则弹窗
const rule = ref(null);
const openRule = () => {
    rule.value.popupShow();
}

// 获取国家
let locale = getLanguage() || "en";
// 页面头图
const headImg = ref({
    "ar": "https://yaame-static.yaame.io/admin/8888f64e531454cc15a1983eb84d36ba.png",
    "en": "https://yaame-static.yaame.io/admin/657f4ff8e0d0e9ac1ecb6e75c1b6c985.png",
    "id": "https://yaame-static.yaame.io/admin/62852cbcb5e2469908b5660b2291ed8f.png",
    "zh-cn": 'https://yaame-static.yaame.io/admin/69d9ddb9a953653d6ae526a392c16431.png',
    "zh-tw": "https://yaame-static.yaame.io/admin/7e67c9648b90d9853e3949f97d61b822.png",
})

// 页面计时时间
let days = ref(0);
let hours = ref(0);
let minutes = ref(0);
let seconds = ref(0);
// 活动结束时间
const timeEnd = ref(0);
const updateTime = () => {
    const now = new Date().getTime();
    const timeDifference = timeEnd.value - now;
    if (timeDifference > 0) {
        days.value = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        hours.value = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        minutes.value = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        seconds.value = Math.floor((timeDifference % (1000 * 60)) / 1000);
    } else {
        days.value = 0;
        hours.value = 0;
        minutes.value = 0;
        seconds.value = 0;
    }
};

// 定时器倒计时
let timeOut = null;
const openTiming = () => {
    timeOut = setInterval(() => {
        updateTime();
    }, 1000)
}

// 用户数据
const userList = ref({});
// 排名前三的数据
const rankingThree = ref([]);
// 剩下排名数据
const rankingLast = ref([]);
const wlRefresh = ref(null);
const rankingList = async () => {
    try {
        const res = await getRankingApi({
            page: 1,
            size: 50,
            rankType: 'HARVEST_ACTIVITY',
            rankGroupFlag: 'harvest',
        });
        if (res.status !== 1000) return;
        userList.value = res.data.my_rank;
        if (res.data.content) {
            processRanking(res.data.content);
        }
        setTimeout(() => {
			wlRefresh.value.isLoading = false;
		}, 500);
    } catch (err) {
        console.log(err);
    }
}

// 处理排名数据
const processRanking = (data) => {
    if (data && data.length >= 3) {
        rankingThree.value = data.splice(0,3);
        rankingLast.value = data;
    } else if (data) {
        if (data.length === 3) {
            rankingThree.value = data;
            rankingLast.value = [];
            return;
        } else {
            rankingThree.value = data;

            while (rankingThree.value.length < 3) {
                rankingThree.value.push({
                    subject_icon: '',
                    subject_name: '',
                    subject_score: 0,
                    peanut_id: '',
                });
            }
            rankingLast.value = [];
            return;
        }    
    }
}

// 处理分数间隔
const score = (value) => {
    value += '';
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const getActivityTime = async () => {
    try {
        const res = await getRankingWardApi();
        if (res.status !== 1000) return;
        timeEnd.value = res.data.activity_end_time;
    } catch (err) {
        console.log(err);
    }
}

const toDetails = (item) => {
    if (item.is_mystery === 1) {
        return
    }
	if (item.scheme_url) {
		location.href = item.scheme_url;
	}
};

onMounted(() => {
    // 获取活动结束时间戳
    getActivityTime()
    // 获取页面数据
    rankingList();
    // 开启倒计时
    openTiming();
})
</script>

<style lang="less" scoped>
.main {
    min-height: 100vh;

    .top {
        width: 100%;
        height: 5.84rem;
        background-repeat: no-repeat;
        background-size: contain;

        .rule-button,
        .award-button {
            position: absolute;
            top: 3.09rem;
            right: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-width: 1.48rem;
            height: .66rem;
            background: url("https://yaame-static.yaame.io/admin/646a5c4322de5ca91710b350076b7db6.png") no-repeat;
            background-size: 100% 100%;
            font-size: .28rem;
            color: #B46223;
            z-index: 1;
        }

        .award-button {
            top: 4.14rem;
        }

        .time-span {
            position: absolute;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            top: 4.47rem;
            width: 100%;

            .time {
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: .24rem;
                color: #FFFFFF;
            }

            .time:nth-child(n) {
                width: .67rem;
                height: .67rem;
                margin-right: .11rem;
            }

            .time:nth-child(n+3) {
                width: .76rem;
                height: .67rem;
                margin-right: .17rem;
            }

            .time:nth-child(1) {
                margin-left: 1.65rem;
            }

            .time:nth-child(2) {
                margin-right: .12rem;
            }
        }
    }

    .award {
        position: absolute;
        width: 1rem;
        height: 1rem;
    }

    .rank {
        overflow: hidden;

        .ranking {
            position: relative;
            width: 7.18rem;
            min-height: 13.48rem;
            margin: .25rem auto 0;
            padding-top: 5.38rem;
            background: url("https://yaame-static.yaame.io/admin/9802e9a49a95a2c52c8cf03e82dd400f.png") no-repeat;
            background-size: contain;

            .front {
                position: absolute;
                top: 1.32rem;
                width: 2.03rem;
                height: 3.71rem;
                background-repeat: no-repeat;
                background-size: contain;
                color: #FFF;

                .head {
                    position: absolute;
                    display: flex;
                    top: .71rem;
                    left: 50%;
                    width: 1.22rem;
                    height: 1.22rem;
                    border-radius: 50%;
                    transform: translateX(-50%);
                    justify-content: center;
                    align-items: center;
                    background-repeat: no-repeat;
                    background-size: contain;

                    img {
                        width: 1.1rem;
                        height: 1.1rem;
                        border-radius: 50%;
                    }
                }

                .name {
                    position: absolute;
                    top: 2.12rem;
                    left: 50%;
                    width: 1.72rem;
                    height: .26rem;
                    transform: translateX(-50%);
                    line-height: .26rem;
                    font-size: .26rem;
                    text-align: center;
                    font-weight: 400;
                }

                .id {
                    position: absolute;
                    top: 2.43rem;
                    left: 50%;
                    width: 1.72rem;
                    height: .24rem;
                    line-height: .24rem;
                    transform: translateX(-50%);
                    font-size: .24rem;
                    text-align: center;
                }

                .number {
                    display: flex;
                    justify-content: center;
                    position: absolute;
                    top: 2.76rem;
                    left: .42rem;
                    min-width: 1.32rem;
                    height: .27rem;
                    line-height: .27rem;
                    padding: 0 .04rem 0 0.15rem;
                    font-size: .22rem;
                    background-repeat: no-repeat;
                    background-size: 100% 100%;
                    text-align: left;

                    .tree {
                        position: absolute;
                        top: -.07rem;
                        left: -.16rem;
                        width: .32rem;
                        height: .36rem;
                        background: url("https://yaame-static.yaame.io/admin/47b84c5c5569f1dde9301ba5ea3f4494.png") no-repeat;
                        background-size: contain;
                    }
                }
            }

            .front:nth-child(1) {
                top: .42rem;
                left: 2.42rem;
                width: 2.37rem;
                height: 4.29rem;
                background-image: url("https://yaame-static.yaame.io/admin/c568971025ec0009f453d70bb7f54df1.png");

                .head {
                    top: .83rem;
                    width: 1.38rem;
                    height: 1.38rem;
                    background-image: url("https://yaame-static.yaame.io/admin/507b73c04861d0e8c1dc052a2308eb55.png");

                    img {
                        width: 1.26rem;
                        height: 1.26rem;
                    }
                }

                .name {
                    top: 2.43rem;
                    width: 1.78rem;
                    height: .28rem;
                    line-height: .28rem;
                    font-size: .28rem;
                    font-weight: 400;
                }

                .id {
                    top: 2.78rem;
                    width: 1.76rem;
                    height: .26rem;
                    line-height: .26rem;
                    font-size: .26rem;
                }

                .number {
                    top: 3.25rem;
                    left: .54rem;
                    background-image: url("https://yaame-static.yaame.io/admin/5cb335b410f8d150668d9f7347ee60bf.png");
                }
            }

            .front:nth-child(2) {
                left: .3rem;
                background-image: url("https://yaame-static.yaame.io/admin/60bc6e0d4849706fe0038b9b2dbbe6c9.png");

                .head {
                    background-image: url("https://yaame-static.yaame.io/admin/dd310c0e4ffdda1ccf92d92ca6f0d750.png");
                }

                .number {
                    background-image: url("https://yaame-static.yaame.io/admin/435ed16c1a63a083ed17d70a8248a965.png");
                }
            }

            .front:nth-child(3) {
                right: .27rem;
                background-image: url("https://yaame-static.yaame.io/admin/9d448fa058986556b0136d9cac0af8e8.png");

                .head {
                    background-image: url("https://yaame-static.yaame.io/admin/efa7e851d7c4bf6a93daa636f545bc4e.png");
                }

                .number {
                    background-image: url("https://yaame-static.yaame.io/admin/c09c31c897e4ff4b3fdd243da0685e7b.png");
                }
            }
            .item-scroll {
                width: 7.18rem;
                height: 6.5rem;
                overflow-x: hidden;
                overflow-y: auto;
            }

            .back {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                width: 6.60rem;
                height: 1.30rem;
                margin: 0 auto .1rem;
                background: linear-gradient(180deg, #F8D69F 0%, #F6C78A 100%);
                box-shadow: inset 0 0 .12rem 0 rgba(255, 255, 255, 0.5);
                border-radius: .26rem;
                border: .02rem solid #FFC678;
                color: #B46223;

                .rank-back {
                    width: .3rem;
                    height: .28rem;
                    line-height: .28rem;
                    margin-left: .32rem;
                    font-size: .28rem;
                    text-align: center;
                    color: #B46223;
                }

                .head-back {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: .84rem;
                    height: .84rem;
                    margin: 0 .23rem 0 .13rem;
                    background-repeat: no-repeat;
                    background-size: contain;
                    border-radius: .38rem;
                    img {
                        width: .86rem;
                        height: .89rem;
                    }
                }

                .name-back {
                    .name {
                        width: 2.42rem;
                        height: .35rem;
                        margin-bottom: .07rem;
                        line-height: .3rem;
                        font-size: .3rem;
                        font-weight: 400;
                    }

                    .id {
                        height: .26rem;
                        line-height: .26rem;
                        font-size: .26rem;
                    }
                }

                .number-back {
                    display: flex;
                    justify-content: center;
                    position: relative;
                    min-width: 1.60rem;
                    height: .34rem;
                    line-height: .34rem;
                    margin-left: .5rem;
                    padding: 0 .12rem 0 .2rem;
                    font-size: .22rem;
                    background: url("https://yaame-static.yaame.io/admin/5be41281f6eef441934c9465a1942dee.png") no-repeat;
                    background-size: 100% 100%;
                    color: #275F51;

                    .tree {
                        position: absolute;
                        top: -.1rem;
                        left: -.19rem;
                        width: .36rem;
                        height: .44rem;
                        background: url("https://yaame-static.yaame.io/admin/47b84c5c5569f1dde9301ba5ea3f4494.png") no-repeat;
                        background-size: contain;
                    }
                }
            }

            .lack {
                position: relative;
                top: 1.09rem;
                left: 50%;
                width: .84rem;
                height: 1rem;
                transform: translateX(-50%);
                background: url("https://yaame-static.yaame.io/admin/1fcb363383c5b2c4be4860960fece079.png") no-repeat;
                background-size: contain;
                p {
                    position: absolute;
                    top: 1.37rem;
                    left: 50%;
                    height: .2rem;
                    transform: translateX(-50%);
                    line-height: .2rem;
                    font-size: .20rem;
                    color: #FFFFFF;
                    white-space: nowrap;
                }
            }
        }
    }

    .my-rank {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 1.66rem;
        padding-top: 0.3rem;
        background: url("https://yaame-static.yaame.io/admin/41a06ff4c502e3e60d1f3fe48e82a009.png") no-repeat;
        background-size: contain;
        color: #275F51;

        .rank-back {
            height: .28rem;
            line-height: .28rem;
            margin-left: .57rem;
            font-size: .28rem;
            text-align: center;
            color: #016956;
        }

        .head-back {
            display: flex;
            justify-content: center;
            align-items: center;
            width: .84rem;
            height: .84rem;
            margin: 0 .23rem 0 .13rem;
            background-repeat: no-repeat;
            background-size: contain;
            border-radius: .38rem;
            img {
                width: .86rem;
                height: .9rem;
            }
        }

        .name-back {
            .name {
                width: 2.42rem;
                height: .35rem;
                margin-bottom: .07rem;
                line-height: .3rem;
                font-size: .3rem;
                font-weight: 600;
            }

            .id {
                height: .26rem;
                line-height: .26rem;
                font-size: .26rem;
            }
        }

        .number-back {
            display: flex;
            justify-content: center;
            position: relative;
            min-width: 1.60rem;
            height: .34rem;
            line-height: .34rem;
            margin-left: .64rem;
            padding: 0 .12rem 0 .2rem;
            font-size: .22rem;
            background: #E5C1A0;
            box-shadow: inset 0 .02rem 0 0 #C6977E, inset 0 -.02rem 0 0 #FFF6E5;
            border-radius: .08rem;

            .tree {
                position: absolute;
                top: -.1rem;
                left: -.19rem;
                width: .36rem;
                height: .44rem;
                background: url("https://yaame-static.yaame.io/admin/47b84c5c5569f1dde9301ba5ea3f4494.png") no-repeat;
                background-size: contain;
            }
        }
    }
}
</style>
