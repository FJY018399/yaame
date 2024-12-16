<template>
    <div class="main" :style="{ backgroundImage: `url(${logoImg[locale]})` }">
        <!--标题-->
        <custom-header class="header" color="white">{{ $t('luckyTime') }}</custom-header>
        <!--规则-->
        <div class="rule" @click="show">{{ $t('activityRules') }}</div>
        <div :style="{ top: ['ar', 'en', 'id'].indexOf(locale) > -1 ? '3.84rem' : '3.96rem' }" class="time">
            {{ days < 7 ? (hours < 24 && days < 1 ? (minutes < 60 && hours < 1 ? (seconds === 0 && minutes < 1 ? $t('activityEnd') : $t('leftMinutes',{0: minutes})) : $t('leftHours', { 0: hours })) : $t('leftDays', { 0: days })) : $t('activityWillStart') }}
        </div>
        <!--tab-->
        <div class="tab" ref="tabTop">
            <div class="cut-tab" :class="{ 'disparity-tab': saveTab === item.type }" v-for="(item, index) in tab" :key="index" @click="cutTab(item.type)">{{ item.name }}</div>
        </div>
        <!--内容区域-->
        <Task v-show="saveTab === 'Task'" :openTicket="openTicket" ref="task"></Task>
        <Ranking v-show="saveTab === 'Ranking'" :openTicket="openTicket" ref="ranking"></Ranking>
        <LuckyWheel ref="LuckyWheelRef" v-show="saveTab === 'LuckyWheel'" @result="handleResult" @close="handleClose"></LuckyWheel>
        <!--用户进度栏-->
        <div v-show="saveTab !== 'LuckyWheel'" class="my-rank">
            <div class="top">{{ userInfoData.rank && userInfoData.rank < 100 ? userInfoData.rank : '99+' }}</div>
            <div class="last-img">
                <div class="img" :style="{ backgroundImage: `url(${ Object.keys(userInfoData).length === 0 ? '' : userInfoData.avatar })` }">
                    <img src="https://yaame-static.yaame.io/admin/bb16b974fd1a2f747acafefc9a15f504.png" alt="">
                </div>
            </div>
            <!--进度-->
            <div class="loading">
                <div class="fill" :style="{ width: fill + 'rem' }">
                    <img src="https://yaame-static.yaame.io/admin/f2c73b0733ac4b1da23cc685e71fd223.png" alt="">
                </div>
                <div class="dot" v-for="(item, index) in 10" :key="index + 3"></div>
            </div>
            <span class="ongoing">{{ days < 7 ? ( days < 1 && hours < 1 && minutes < 1 ? $t('ended') : $t('inProgress') ) : $t('notStarted') }}</span>
            <div class="diamond">
              <span class="win">{{ $t('win') }}</span>
                <img src="https://yaame-static.yaame.io/admin/f2c73b0733ac4b1da23cc685e71fd223.png" alt="">
                {{ userInfoData.score ? userInfoData.score : 0 }}
            </div>
        </div>
        <!--规则页-->
        <popup class="popup" v-show="showRule" @cancel="popupShow">
            <div class="rule-page">
                <div class="rule-page-header">{{ $t('activityRules') }}</div>
                <p>
                    {{ $t('activityRule1') }}<br /><br />
                    {{ $t('activityRule2') }}<br /><br />
                    {{ $t('activityRule3') }}<br /><br />
                    {{ $t('activityRule4') }}<br /><br />
                    {{ $t('activityRule4_1') }}<br /><br />
                    {{ $t('activityRule4_2') }}<br /><br />
                    {{ $t('activityRule4_3') }}<br />
                </p>
            </div>
            <div class="rule-page-close" @click="popupShow"></div>
        </popup>


        <popup v-show="rewardVisible" class="flex-box">
            <div class="gift-details">
                <img class="gift-icon" :src="giftDetails.reward_icon" alt="">
                <p class="gift-num">{{ giftDetails.reward_name }} <span v-if="giftDetails.worth_diamonds">* {{ giftDetails.worth_diamonds }}</span></p>

                <img class="close-icon" src="https://yaame-static.yaame.io/admin/54d524b4dc1e73c910bd24ec4aaadd30.png" alt="" @click="handleRewardClose">
            </div>
        </popup>
        <pageLoading v-show="loading"></pageLoading>
        <!--点击奖券弹窗-->
        <Transition>
            <div class="up-ticket" v-show="ticketShow">
                <span>{{ $t('luckyTurntableDesc', {msg: ''}) }}</span>
                <p @click="closeTicket">{{ $t('OK') }}</p>
            </div>
        </Transition>
    </div>
</template>

<script setup>
    import { getCurrentInstance, onMounted, ref } from "vue";
    import Task from './components/task.vue';
    import LuckyWheel from './components/luckyWheel.vue';
    import Ranking from './components/ranking.vue';
    import { getTaskDataApi } from "./api";
    import customHeader from "@/components/common/header.vue";
    import popup from "@/components/common/pop_up.vue";
    import { getLanguage, getSafeHeight } from "@/lib/device"
    import pageLoading from '../../components/common/page_loading.vue'

    // 获取国家
    let locale = getLanguage() || "en";

    let safe_area = getSafeHeight() || 0;
    // 获取国际化函数
    const root = getCurrentInstance();
    const t = (val) => {
        return root.proxy.$i18n.t(val);
    };

    const tab = ref([
        {
            name: t('task'),
            type: 'Task'
        },
        {
            name: t('rank'),
            type: 'Ranking'
        },
        {
            name: t('luckyTurntable'),
            type: 'LuckyWheel'
        }
    ]);
    // 控制规则弹窗
    let showRule = ref(false);

    // 切换tab
    const saveTab = ref('Task');
    const task = ref(null);
    const ranking = ref(null);
    const cutTab = (value) => {
        saveTab.value = value;
        if (value === 'Task') {
            task.value.getData();
            getUserData();
        } else if (value === 'Ranking') {
            ranking.value.getRankData();
            getUserData();
        }
    };

    // 头图国际化
    const logoImg = ref({
        "ar": "https://yaame-static.yaame.io/admin/0df6972ae73eb46f478a188a15003c0b.png",
        "en": "https://yaame-static.yaame.io/admin/0df6972ae73eb46f478a188a15003c0b.png",
        "id": "https://yaame-static.yaame.io/admin/0df6972ae73eb46f478a188a15003c0b.png",
        "zh-cn": "https://yaame-static.yaame.io/admin/0cc4a9d11de9a559c1f000d6eb4d01a0.png",
        "zh-tw": "https://yaame-static.yaame.io/admin/17e60f6096b23febd66c0009c7c744fc.png",
    });

    // tab吸顶
    let tabTop = ref();
    // 页面卷去高度
    const bodyTop = () => {
        if (!tabTop.value) return;
        // 获取动态的字体大小
        const htmlSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        // 算出屏幕到达的固定位置
        const targetPixeValue = window.pageYOffset / htmlSize;
        if (targetPixeValue >= 4.59) {
            tabTop.value.style.position = 'fixed';
            tabTop.value.style.marginTop = '1.2rem';

            let safe_height = (safe_area * 2) / 100;
            tabTop.value.style.marginTop = (1.2 + safe_height) +'rem' ;
        } else if (targetPixeValue < 4.59) {
            tabTop.value.style.position = 'relative';
            tabTop.value.style.marginTop = '5.77rem';
        }
    };
    // 用户信息
    const userInfoData = ref({});


    // 页面计时时间
    const days = ref(0);
    const hours = ref(0);
    const minutes = ref(0);
    const seconds = ref(0);
    // 时间倒计时
    const updateTime = (time) => {
        const now = new Date();
        const targetDate = new Date(time).getTime();
        const utcNow = new Date(now.getTime() + now.getTimezoneOffset() * 60000); // 转换为 UTC 时间
        const timeDifference = targetDate - utcNow.getTime();
        if (timeDifference > 0) {
            days.value = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            hours.value = Math.floor(
                (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            minutes.value = Math.floor(
                (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
            );
            seconds.value = Math.floor((timeDifference % (1000 * 60)) / 1000);
        } else {
            days.value = 0;
            hours.value = 0;
            minutes.value = 0;
            seconds.value = 0;
        }
    };

    // 获取用户进度
    const fill = ref(0);
    const getUserData = async () => {
        try {
            const res = await getTaskDataApi();
            userInfoData.value = res.data.my_slots_luck_info;
            userInfoData.value.rank += 1;
            const num = userInfoData.value.score;
            // 控制进度条
            if (num >= 0 && num <= 5000) {
                fill.value = (num / 5000) * 0.56
            } else if (num >= 5000 && num <= 10000) {
                fill.value = (((num - 5000) / (10000 - 5000)) * 0.56) + 0.56
            } else if (num >= 10000 && num <= 50000) {
                fill.value = (((num - 10000) / (50000 - 10000)) * 0.56) + 0.56 * 2
            } else if (num >= 50000 && num <= 100000) {
                fill.value = (((num - 50000) / (100000 - 50000)) * 0.56) + 0.56 * 3
            } else if (num >= 100000 && num <= 200000) {
                fill.value = (((num - 100000) / (200000 - 100000)) * 0.56) + 0.56 * 4
            } else if (num >= 200000 && num <= 400000) {
                fill.value = (((num - 200000) / (400000 - 200000)) * 0.56) + 0.56 * 5
            } else if (num >= 400000 && num <= 600000) {
                fill.value = (((num - 400000) / (600000 - 400000)) * 0.56) + 0.56 * 6
            } else if (num >= 600000 && num <= 1000000) {
                fill.value = (((num - 600000) / (1000000 - 600000)) * 0.56) + 0.56 * 7
            } else if (num >= 1000000 && num <= 2000000) {
                fill.value = (((num - 1000000) / (2000000 - 1000000)) * 0.56) + 0.56 * 8
            } else if (num >= 2000000 && num <= 3000000) {
                fill.value = (((num - 2000000) / (3000000 - 2000000)) * 0.52) + 0.56 * 9
            } else if (num > 3000000) {
                fill.value = 5.56
            }
        } catch (err) {
            console.log(err);
        }
    }
    // 控制页面弹窗显示
    const show = () => {
        showRule.value = !showRule.value
    }
    // 点击空白进行隐藏
    const popupShow = () => {
        showRule.value = !showRule.value
    }
    // 创建事件处理函数
    const preventScroll = (e) => {
        e.preventDefault();
    }

    // 禁止页面滚动
    const disableScroll = () => {
        // 记录页面滚动位置
        document.body.addEventListener('touchmove', preventScroll, { passive: false });
    }

    // 启用页面滚动
    const enableScroll = () => {
        // 恢复页面滚动位置
        document.body.removeEventListener('touchmove', preventScroll, { passive: false });
    }

    const LuckyWheelRef = ref(null);
    let giftDetails = ref({
        reward_icon: '',
        reward_name: '',
        worth_diamonds: 0
    });
    let rewardVisible = ref(false);
    const handleResult = (data) => {
        rewardVisible.value = true;
        giftDetails.value.reward_icon = data.reward_icon;
        giftDetails.value.reward_name = data.reward_name;
        giftDetails.value.worth_diamonds = data.worth_diamonds;
    }
    const handleClose = () => {
        rewardVisible.value = false;
    }
    const handleRewardClose = () => {
        rewardVisible.value = false;
        LuckyWheelRef.value.handleRewardClose();
    }

    let ticketShow = ref(false);
    // 打开奖券弹窗
    const openTicket = () => {
        ticketShow.value = true;
        disableScroll();
    }
    // 关闭奖券弹窗
    const closeTicket = () => {
        ticketShow.value = false;
        enableScroll();
    }

    let loading = ref(true);
    onMounted(() => {
        // 监听页面滚动事件
        document.addEventListener('scroll', bodyTop);
        // 获取用户进度
        getUserData();
        updateTime("2024/3/25 00:00:00");

        window.onload = () => {
            loading.value = false;
        }
    });
</script>

<style lang="less" scoped>
.main {
    //min-height: 100vh;
    background-repeat: no-repeat;
    background-size: contain;
    transition-duration: .3s;
    overflow: hidden;
    .time {
        position: absolute;
        top: 3.84rem;
        left: 50%;
        width: 2.62rem;
        height: .24rem;
        line-height: .24rem;
        text-align: center;
        transform: translateX(-50%);
        font-size: .22rem;
        color: #FFFFFF;
        font-weight: 700;
    }
    // 规则样式
    .rule {
        position: fixed;
        right: 0;
        top: 3.36rem;
        display: flex;
        min-width: 1.32rem;
        height: .56rem;
        justify-content: center;
        align-items: center;
        padding: 0 0.1rem 0 0.2rem;
        background: url("https://yaame-static.yaame.io/admin/1cbb34f9e908ef1d26f80ef78e229f8f.png") no-repeat;
        background-size: 100% 100%;
        font-size: .26rem;
        color: #fff;
        z-index: 5;
    }
    //tab样式
    .tab {
        position: relative;
        display: flex;
        width: 100%;
        margin-top: 5.77rem;
        justify-content: center;
        align-items: center;
        z-index: 4;
        .cut-tab {
            width: 2.41rem;
            height: 1.17rem;
            padding-top: .46rem;
            background: url("https://yaame-static.yaame.io/admin/e7f8ff010fb0169e0ca20cf89447c427.png") no-repeat;
            background-size: contain;
            font-size: .24rem;
            color: #FFFFFF;
            text-align: center;
            font-style: normal;
            transition-duration: .3s;
        }

        .disparity-tab {
            background: url("https://yaame-static.yaame.io/admin/08c5600760f19fd0a8174597c2ab4154.png") no-repeat;
            background-size: contain;
            transition-duration: .3s;
            color: #B05B09;
        }
    }
    .user {
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 2.03rem;
        background: url("https://yaame-static.yaame.io/admin/72cec82d6287852f88a60589fc2863bf.png") no-repeat;
        background-size: contain;
    }
    //我的排名样式
    .my-rank {
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 2.03rem;
        background: url("https://yaame-static.yaame.io/admin/72cec82d6287852f88a60589fc2863bf.png") no-repeat;
        background-size: contain;
        font-size: .24rem;
        color: #fff;
        z-index: 9;
        .top {
            position: absolute;
            bottom: .08rem;
            left: .54rem;
            width: .47rem;
            height: .22rem;
            line-height: .22rem;
            text-align: center;
            font-size: .22rem;
        }
        .last-img {
            position: absolute;
            display: flex;
            align-items: center;
            top: .72rem;
            left: .35rem;
            .img {
                display: flex;
                width: .88rem;
                height: .88rem;
                justify-content: center;
                align-items: center;
                margin-right: .33rem;
                border-radius: 50%;
                background: url("https://yaame-static.yaame.io/admin/0524f6ce1917d98778d8905da0416b8b.png") no-repeat;
                background-size: .88rem .88rem;
                background-position: center center;
                img {
                    width: .95rem;
                    height: 1.05rem;
                }
            }
        }
        //进度
        .loading {
            position: absolute;
            top: .98rem;
            left: 1.55rem;
            width: 5.6rem;
            height: .14rem;
            background: #521079;
            border-radius: .07rem;
            border: .01rem solid #B742FF;
            .fill {
                position: absolute;
                top: -.02rem;
                width: .8rem;
                height: .14rem;
                background: #FADF7B;
                border-radius: .07rem;
                border: .01rem solid #FCF2D9;
                img {
                    position: absolute;
                    top: .25rem;
                    right: -0.085rem;
                    width: .2rem;
                    height: .17rem;
                }
            }
            .dot {
                position: relative;
                float: left;
                width: .18rem;
                height: .18rem;
                margin: -0.03rem 0 0 0.376rem;
                //background-color: #FFBF2E;
                //border: .01rem solid #FFFE4C;
                //box-shadow: inset .03rem .03rem .03rem 0 #FCD229;
                //border-radius: 50%;
                background: url("https://yaame-static.yaame.io/admin/8f93fe53d12ac547aced0cefe0510e13.png") no-repeat;
                background-size: contain;
            }
            .dot:last-of-type {
                float: right;
            }
        }
        .diamond {
            position: absolute;
            bottom: .2rem;
            left: 6.23rem;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: .20rem;
            .win {
                position: absolute;
                top: -0.3rem;
                right: 0;
                height: .2rem;
                line-height: .2rem;
                font-size: .2rem;
                color: #FFC02E;
            }
            img {
                width: .22rem;
                height: .18rem;
                margin-right: .04rem;
            }
        }
        //两个文案样式
        .ongoing {
            position: absolute;
            bottom: .23rem;
            left: 1.56rem;
            height: .22rem;
            font-size: .22rem;
            color: #FFFEFC;
        }
    }

    .popup {
        z-index: 10;
        .rule-page {
            position: relative;
            top: 2.24rem;
            left: 50%;
            width: 5.43rem;
            height: 7.30rem;
            transform: translateX(-50%);
            background: url("https://yaame-static.yaame.io/admin/933d646631b2a5cc6faed37453f5fc69.png") no-repeat;
            background-size: contain;
            .rule-page-header {
                position: absolute;
                top: 0.5rem;
                left: 49%;
                height: .22rem;
                line-height: .22rem;
                transform: translateX(-50%);
                font-size: .22rem;
                color: #A9660E;
                font-weight: 600;
            }
            p {
                position: absolute;
                top: 1.25rem;
                left: 50%;
                width: 4.5rem;
                height: 5.08rem;
                transform: translateX(-50%);
                font-size: .22rem;
                color: #FFFFFF;
                overflow: auto;
            }
        }
        .rule-page-close {
            position: absolute;
            top: 10.09rem;
            left: 50%;
            width: .5rem;
            height: .5rem;
            transform: translateX(-50%);
            background: url("https://yaame-static.yaame.io/admin/465dd958554aec269df66b3be55059a2.png") no-repeat;
            background-size: contain;
        }
    }
    .flex-box {
        display: flex;
        justify-content: center;
        align-items: center;
        .gift-details {
            width: 4.96rem;
            height: 4.96rem;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            margin-bottom: 2rem;
            .gift-icon {
                width: 3.5rem;
                height: 3.5rem;
            }
            .gift-num {
                position: absolute;
                bottom: 0.43rem;
                width: 4.96rem;
                height: 0.5rem;
                text-align: center;
                font-weight: normal;
                font-size: 0.5rem;
                color: #FFE537;
            }
            .close-icon {
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                bottom: -1.92rem;
                width: 0.5rem;
                height: 0.5rem;
            }
        }
    }

    //奖券点击弹窗
    .v-enter-active,
    .v-leave-active {
        transition: opacity 0.5s ease;
    }

    .v-enter-from,
    .v-leave-to {
        opacity: 0;
    }
    .up-ticket {
        position: fixed;
        display: flex;
        top: 40%;
        left: 50%;
        width: 5rem;
        height: 2.8rem;
        flex-direction: column;
        align-items: center;
        transform: translate(-50%, 50%);
        background: #FFFFFF;
        border-radius: .2rem;
        font-size: .26rem;
        color: #260240;
        z-index: 9;
        transition-duration: .2s;
        span {
            display: flex;
            width: 4.58rem;
            height: 2.21rem;
            justify-content: center;
            align-items: center;
            text-align: center;
        }
        p {
            display: flex;
            width: 4.58rem;
            height: .79rem;
            justify-content: center;
            align-items: center;
            border-top: .01rem solid #D0D0D0;
        }
    }
}
</style>