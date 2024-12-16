<template>
    <div class="main">
        <!--标题-->
        <custom-header class="header" color="white">{{ $t('fruits_eater') }}</custom-header>
        <!--规则-->
        <div class="rule" @click="show">{{ $t('Rules') }}</div>
        <!--logo-->
        <div class="logo" :style="{ backgroundImage: `url(${logoImg[locale]})` }"></div>
        <!--文案活动时间-->
        <div class="text-time">{{ $t('activity_time') }}</div>
        <!--时间-->
        <div class="time">
            <div class="times">{{ days }}</div>
            <div class="times">D</div>
            :
            <div class="times">{{ hours < 10 ? '0' + hours : hours }}</div>
            :
            <div class="times">{{ minutes < 10 ? '0' + minutes : minutes }}</div>
            :
            <div class="times">{{ seconds < 10 ? '0' + seconds : seconds }}</div>
        </div>
        <!--tab-->
        <div class="tab">
            <div class="tabs"
                 :class="[ Tab.length === 3 && item.type === upFor ? 'bgi' : '', Tab.length === 2 ? 'lang-tabs' : '',  Tab.length === 2 && item.type === upFor ? 'lang-bgi' : '',]"
                 v-for="(item, index) in Tab" :key="index" @click="cutTab(item.type)"
            >{{ item.name }}
            </div>
        </div>
        <!--tab内容-->
        <task v-show="upFor === 'task'" :taskList="taskList" :myList="myList" :getTaskList="getTaskList"
              :taskPlanValue="taskPlanValue" :t="t" ref="task"
        ></task>
        <daily v-show="upFor === 'daily'" :timeEnd="timeEnd" :dailyData="dailyData" ref="daily"></daily>
        <ranking v-show="upFor === 'ranking'" :setRankMyList="setRankMyList" ref="ranking"></ranking>
        <!--底部用户进度-->
        <div class="my-list">
            <div class="my-task">
                <span>{{ $t('mission_bet') }}<img
                    src="https://yaame-static.yaame.io/admin/4492982b4976bd984a52e2db65e7dcf8.png" alt=""
                >{{ myList.next_task }}</span>
                <span>{{ $t('cost') }}<img
                    src="https://yaame-static.yaame.io/admin/4492982b4976bd984a52e2db65e7dcf8.png" alt=""
                >{{ myList.score }}</span>
            </div>
            <div class="my-ranking">
                <div class="top">{{ !myList.rank || myList.rank > 99 ? '99+' : myList.rank }}</div>
                <div class="my-head" @click="skip(myList.scheme_user_url)">
                    <div class="top-img"
                         :class="[ myList.rank === 1 ? 'top-img-1' : myList.rank === 2 ? 'top-img-2' : myList.rank === 3 ? 'top-img-3' : '' ]"
                    ></div>
                    <img :src="myList.avatar" alt="">
                </div>
                <!--进度条-->
                <div class="my-schedule">
                    <div class="value" :style="{ width: scheduleValue + 'rem' }">
                        <div class="dot"></div>
                    </div>
                    <div class="last">
                        <img src="https://yaame-static.yaame.io/admin/4492982b4976bd984a52e2db65e7dcf8.png" alt="">
                        {{ myList.last_task }}
                    </div>
                    <div class="next">
                        <img src="https://yaame-static.yaame.io/admin/4492982b4976bd984a52e2db65e7dcf8.png" alt="">
                        {{ myList.next_task }}
                    </div>
                </div>
            </div>
        </div>
        <!--规则页-->
        <popup class="popup" v-show="showRule" @cancel="popupShow">
            <div :style="{ 'text-align': locale === 'ar' ? 'right' :'' }" class="rule-page">
                <div class="setting"></div>
                <div class="rule-page-header">{{ $t('Rules') }}</div>
                <p>
                    <i18n path="activity_duration">
                        <template v-slot:0>
                            <h4>1.</h4>
                        </template>
                    </i18n>

                    <br/><br/>
                    <i18n path="three_modes">
                        <template v-slot:0>
                            <h4>2.</h4>
                        </template>
                    </i18n>
                    <br/>
                    <i18n path="activity_tasks">
                        <template v-slot:0>
                            <h4>2.1</h4>
                        </template>
                    </i18n>
                    <br/>
                    <i18n path="ranking_pk">
                        <template v-slot:0>
                            <h4>2.2</h4>
                        </template>
                    </i18n>
                    <br/>
                    <br/>
                    
                    <i18n path="daily_tasks">
                        <template v-slot:0>
                            <h4>4</h4>
                        </template>
                    </i18n>
                    <br/>
                </p>
                <div class="rule-page-close" @click="popupShow"></div>
            </div>
        </popup>
        <pageLoading v-show="loading"></pageLoading>
    </div>
</template>

<script setup>
    import { getLanguage } from "../../lib/device";
    import { getCurrentInstance, onMounted, ref, nextTick } from "vue";
    import Task from "./components/task.vue";
    import Daily from "./components/daily.vue";
    import { getDailyApi, getTaskInfoApi } from "./api";
    import customHeader from "@/components/common/header.vue";
    import popup from "@/components/common/pop_up.vue";
    import Ranking from "./components/ranking.vue";
    import pageLoading from '../../components/common/page_loading.vue'

    // 获取国际化函数
    const root = getCurrentInstance();
    const t = (val) => {
        return root.proxy.$i18n.t(val);
    };

    // 获取国家
    let locale = getLanguage() || "en";
    // 头图国际化
    const logoImg = ref({
        "ar": "https://yaame-static.yaame.io/admin/cc7ba53197fd96d890f1e9249d82dd3c.png",
        "en": "https://yaame-static.yaame.io/admin/e2b84c756d8d2b2c4b2d4679492b8feb.png",
        "id": "https://yaame-static.yaame.io/admin/cec4fb0c32598b9c1d17bcf98e5a11e7.png",
        "zh-cn": "https://yaame-static.yaame.io/admin/1da9512a7505fd062ba304e44fc1f422.png",
        "zh-tw": "https://yaame-static.yaame.io/admin/dacf50843e7803ce50dade1eed6ddb9e.png",
    });

    // 组件
    const daily = ref(null);

    // tab
    const Tab = ref([
        {
            name: t('task'),
            type: 'task'
        },
        {
            name: t('daily'),
            type: 'daily'
        },
        {
            name: t('ranking'),
            type: 'ranking'
        },
    ]);
    // 选中
    const upFor = ref('task');
    // 切换tab
    const ranking = ref(null);
    const cutTab = (tab) => {
        upFor.value = tab;
        if (tab === 'task') {
            getTaskList();
        } else if (tab === 'daily') {
            getDailyList();
        } else if (tab === 'ranking') {
            ranking.value.getRank();
        }
    };

    // 排行榜更新用户进度
    const setRankMyList = (value) => {
        myList.value = value;
        setRankingList();
    };

    // 页面计时时间
    let days = ref(0);
    let hours = ref(0);
    let minutes = ref(0);
    let seconds = ref(0);
    // 页面结束时间
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
    let timeOut = null;
    const openTime = () => {
        timeOut = setInterval(() => {
            updateTime();
        }, 1000);
    };


    // 获取Task页面数据
    const taskList = ref([]);
    // 用户数据
    const myList = ref({});
    const getTaskList = async () => {
        try {
            const res = await getTaskInfoApi();
            if (res.status !== 1000) return;
            // 充值进度
            taskPlanValue.value = 0;
            // 活动结束时间戳
            timeEnd.value = res.data.activity_end_time;
            // task数据
            taskList.value = res.data.task_levels;
            console.log(taskList.value);

            // 底部进度数据
            myList.value = res.data.my_rank_info;
            setTimeout(() => {
                setRankingList(); 
            }, 500);

            loading.value = false;
        } catch (err) {
            console.log(err);
        }
    };
    // 进度
    const scheduleValue = ref(0);
    let taskPlanValue = ref(0);
    const setRankingList = () => {
        // 重置状态
        taskPlanValue.value = 0;
        // 底部进度
        scheduleValue.value = (myList.value.score - myList.value.last_task) / (myList.value.next_task - myList.value.last_task);
        scheduleValue.value = Math.round(scheduleValue.value * 4.72 * 10) / 10; // 保留一位小数
        scheduleValue.value = scheduleValue.value > 4.72 ? 4.72 : scheduleValue.value; // 最大显示
        // task进度
        for (let [index, item] of taskList.value.entries()) {
            if (myList.value.score >= item.task_require) {
                taskPlanValue.value += 3.18;
            } else if (index === 0) {
                let progressPercentage = (3.18 / taskList.value[index].task_require) * myList.value.score;
                taskPlanValue.value += Math.round(progressPercentage * 10) / 10; // 保留一位小数
            } else if (myList.value.score > taskList.value[index - 1].task_require) {
                let progressPercentage = (myList.value.score - taskList.value[index - 1].task_require) / (item.task_require - taskList.value[index - 1].task_require);
                taskPlanValue.value += Math.round(progressPercentage * 3.18 * 10) / 10; // 保留一位小数
            }
        }
    };

    // 获取daily数据
    const dailyData = ref([]);
    const getDailyList = async () => {
        try {
            const res = await getDailyApi();
            if (res.status !== 1000) return;
            dailyData.value = res.data;
            // 底部进度数据
            myList.value = res.data.my_rank_info;
            // 处理当前档位
            disposeData();
            // 更新进度条
            setRankingList();
        } catch (err) {
            console.log(err);
        }
    };
    const disposeData = () => {
        /*
            type: 1, 2
            1： 到达奖励位置
            2： 发放当前档位
         */
        for (let [index, item] of dailyData.value.task_levels.entries()) {
            // 用户当前档位
            const bet = dailyData.value.bet;
            const recharge = dailyData.value.recharge;
            if (bet >= item.daily_bet && recharge >= item.daily_recharge) {
                item.type = 1;
            } else {
                if (index === 0) break;
                if (bet >= dailyData.value.task_levels[index - 1].daily_bet && recharge >= dailyData.value.task_levels[index - 1].daily_recharge) dailyData.value.task_levels[index - 1].type = 2;
                break;
            }
            // 判断是否到达最后一个档位
            if (index + 1 === dailyData.value.task_levels.length && dailyData.value.task_levels[index].type === 1) {
                dailyData.value.task_levels[index].type = 2;
            }
        }
    };

    // 控制页面弹窗显示
    let showRule = ref(false);
    const show = () => {
        showRule.value = !showRule.value;
    };

    // 点击空白进行隐藏
    const popupShow = () => {
        showRule.value = !showRule.value;
    };
    // 跳转个人主页
    const skip = (value) => {
        window.location.href = value;
    };


    // 添加loading
    let loading = ref(true);

    onMounted(async () => {
        window.onpageshow = function(e) {
            if (
            e.persisted ||
            (window.performance && window.performance.navigation.type == 2)
            ) {
            window.location.reload();
            }
        };
        // 获取task主页数据
        await getTaskList();
        // 获取daily数据
        // getDailyList();
        // 开启活动倒计时
        openTime();
        daily.value.openTime();
    });
</script>

<style lang="less" scoped>
.main {
    min-height: 100vh;
    overflow: hidden;
    padding-bottom: 2.9rem;
    background: url("https://yaame-static.yaame.io/admin/20bfc0e3455cbc02a5ad58f3182d8997.jpeg") no-repeat;
    background-size: contain;

    .logo {
        position: absolute;
        top: 2.86rem;
        left: 50%;
        width: 6.9rem;
        height: 2rem;
        transform: translateX(-50%);
        background-repeat: no-repeat;
        background-size: contain;
    }

    .text-time {
        position: absolute;
        top: 4.78rem;
        left: 50%;
        height: .28rem;
        font-size: .28rem;
        color: #FFFFFF;
        font-weight: 800;
        line-height: .28rem;
        transform: translateX(-50%);
        text-shadow: 0 .02rem .1rem rgba(59, 3, 160, 0.7);
        white-space: nowrap;
    }

    // 时间
    .time {
        display: flex;
        margin: 5.83rem 0 0;
        font-size: .32rem;
        color: #FFFFFF;

        .times {
            display: flex;
            width: .6rem;
            height: .6rem;
            justify-content: center;
            align-items: center;
            background: url("https://yaame-static.yaame.io/admin/7f93aad31d620e4a4e33c8ebf83e34c3.png") no-repeat;
            background-size: contain;
        }

        .times:nth-child(1) {
            margin-left: 1.72rem;
        }

        .times:nth-child(2) {
            margin: 0 .16rem 0 .1rem;
        }

        .times:nth-child(3) {
            margin: 0 .06rem 0 .16rem;
        }

        .times:nth-child(4) {
            margin: 0 .06rem;
        }

        .times:nth-child(5) {
            margin-left: .06rem;
        }
    }

    // tab
    .tab {
        display: flex;
        justify-content: space-evenly;
        margin: .37rem 0;
        position: relative;
        font-size: .32rem;
        color: #FFFFFF;

        .tabs {
            display: flex;
            width: 2.21rem;
            height: .98rem;
            justify-content: center;
            align-items: flex-start;
            padding-top: .24rem;
            background-image: url("https://yaame-static.yaame.io/admin/651a5341366ad721da2df45a3a5de853.png");
            background-size: contain;
            background-repeat: no-repeat;
            transition-duration: .3s;
        }

        .lang-tabs {
            width: 3.14rem;
            height: .94rem;
            background-image: url("https://yaame-static.yaame.io/admin/1c3513cfd2e18f0f60e4c738add292c4.png");
        }

        .bgi {
            background-image: url("https://yaame-static.yaame.io/admin/1da9b99643f631986a2bb4b34a06ba21.png");
        }

        .lang-bgi {
            background-image: url("https://yaame-static.yaame.io/admin/78fd5bb7554b79b847560984bb3f8765.png");
        }
    }

    // 底部样式
    .my-list {
        position: fixed;
        bottom: 0;
        width: 7.5rem;
        height: 2.54rem;
        padding-right: .3rem;
        background: url("https://yaame-static.yaame.io/admin/8b92b3043decf3fd8d5d7ca3fcb5d43f.png") no-repeat;
        background-size: contain;
        font-size: .24rem;
        color: #FFFFFF;
        z-index: 4;
        padding-top: 0.16rem;
        .my-task {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            margin-top: .24rem;

            span {
                display: flex;
                justify-content: center;
                align-items: center;

                img {
                    width: .26rem;
                    height: .24rem;
                }
            }
        }

        .my-ranking {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            color: #FFFFFF;

            .top {
                width: .35rem;
                margin-left: .3rem;
                height: .24rem;
                line-height: .24rem;
                font-size: .2rem;
            }

            .my-head {
                position: relative;
                display: flex;
                width: 1.04rem;
                height: 1.04rem;
                justify-content: center;
                align-items: center;
                margin: 0 .45rem 0 .3rem;
                // background-image: linear-gradient(180deg, rgba(190, 202, 255, 1), rgba(248, 165, 255, 1));
                border-radius: 50%;
                background: #A55A2E;
                .top-img {
                    position: absolute;
                    width: 1.6rem;
                    height: 1.6rem;
                    background-repeat: no-repeat;
                    background-size: contain;
                }

                .top-img-1 {
                    background-image: url("https://yaame-static.yaame.io/admin/e7b8419e9a9ebaaeba333c50566f76a9.png");
                }

                .top-img-2 {
                    background-image: url("https://yaame-static.yaame.io/admin/6f0057d73d248503b1434bda72c71435.png");
                }

                .top-img-3 {
                    background-image: url("https://yaame-static.yaame.io/admin/5a103985fe705bda75703d995957d3f1.png");
                }

                img {
                    width: .96rem;
                    height: .96rem;
                    border-radius: 50%;
                }
            }

            .my-schedule {
                position: relative;
                width: 4.8rem;
                height: .3rem;
                background: #6A2A04;
                border-radius: .15rem;
                border: .04rem solid #FDE976;

                .value {
                    position: relative;
                    width: 1.69rem;
                    height: .22rem;
                    background: linear-gradient(270deg, #FFEE93 0%, #FFB414 44%, #FF8314 100%);
                    // background: linear-gradient( 180deg, #FFFFFF 0%, rgba(255,255,255,0) 100%);
                    border-radius: .11rem;
                    transition-duration: .3s;
                    .dot {
                        position: absolute;
                        top: -.21rem;
                        right: -.24rem;
                        width: .64rem;
                        height: .64rem;
                        background: url("https://yaame-static.yaame.io/admin/925704636024718637aa62aae146d3a2.png") no-repeat;
                        background-size: contain;
                    }
                }

                .last,
                .next {
                    position: absolute;
                    top: .4rem;
                    display: flex;
                    height: .2rem;
                    justify-content: center;
                    align-items: center;
                    line-height: .2rem;
                    font-size: .2rem;
                    color: #FFFFFF;

                    img {
                        width: .22rem;
                        height: .2rem;
                    }
                }

                .last {
                    left: 0;
                }

                .next {
                    right: 0;
                }
            }
        }
    }

    .rule {
        position: absolute;
        display: flex;
        top: 5.88rem;
        left: 0;
        min-width: 1.22rem;
        height: .5rem;
        padding-right: 0.1rem;
        justify-content: center;
        align-items: center;
        font-size: .28rem;
        color: #FFFBB3;
        background: url("https://yaame-static.yaame.io/admin/be1211644dfa3ccd124987d3826190fd.png") no-repeat;
        background-size: 100%;
        z-index: 3;
    }

    // 规则
    .popup {
        z-index: 10;

        .rule-page {
            position: relative;
            top: 50%;
            left: 50%;
            width: 7.12rem;
            height: 10rem;
            transform: translate(-50%, -50%);
            background: #834A14;
            border: 0.02rem solid #FDCC1F;
            box-shadow: inset 0 .02rem .04rem 0 rgba(255, 255, 255, 0.7);
            border-radius: .2rem;

            .setting {
                position: absolute;
                width: 100%;
                height: 4.11rem;
                // background: url("https://yaame-static.yaame.io/admin/220110c6a74941f1bd972ca4b749de34.png") no-repeat;
                background: url(https://yaame-static.yaame.io/admin/047df7cb48dab2beca8b693501511ec8.png) no-repeat;
                background-size: contain;
            }

            .rule-page-header {
                position: absolute;
                top: 0.46rem;
                left: 50%;
                height: .32rem;
                line-height: .32rem;
                transform: translateX(-50%);
                font-size: .32rem;
                color: #FFFFFF;
            }

            p {
                position: absolute;
                top: 1.25rem;
                left: 50%;
                width: 6.34rem;
                height: 8.48rem;
                transform: translateX(-50%);
                font-size: .28rem;
                color: #FFFFFF;
                overflow: auto;

                h4 {
                    display: inline-block;
                    margin-right: .1rem;
                    color: #FFE491;
                }
            }

            .rule-page-close {
                position: absolute;
                top: 10.48rem;
                left: 50%;
                width: .5rem;
                height: .5rem;
                transform: translateX(-50%);
                background: url("https://yaame-static.yaame.io/admin/4bcf095d20500fff632ff75f099e6bf6.png") no-repeat;
                background-size: contain;
            }
        }
    }
}
</style>
