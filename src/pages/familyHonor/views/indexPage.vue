<!-- 主页面 -->
<template>
    <div class="main">
        <!-- 返回头 -->
        <CustomHeader color="white">
            {{ $t('family_honor_war') }}
        </CustomHeader>

        <!-- 刷新按钮 -->
        <div class="refresh" @click="getActivityData" />

        <!-- 规则奖励 -->
        <div
            class="rule"
            @click="goRule"
        >
            {{ $t('rules_rewards') }}
        </div>
        <!-- 最佳mvp榜 -->
        <div
            class="mvp"
            @click="openMvp"
        >
            {{ $t('best_mvp_board') }}
        </div>

        <!-- 标题 -->
        <div
            class="logo"
            :style="{ backgroundImage: `url(${logo[language]})` }"
        ></div>

        <!--活动时间 -->
        <div class="time">{{ timeList[currentRegion] }}</div>

        <!-- 赛制进度 -->
        <div class="progress">
            <div class="head">
                <img
                    src="https://yaame-static.yaame.io/admin/368312592b2ae8c16132fe8756f9a685.png"
                    alt=""
                />
                <span>{{ $t('competition_schedule') }}</span>
                <img
                    src="https://yaame-static.yaame.io/admin/368312592b2ae8c16132fe8756f9a685.png"
                    alt=""
                />
            </div>
            <div class="body">
                <!-- 进度条 -->
                <div class="progress-bar">
                    <div
                        class="bar"
                        :style="{ width: `${currentProgress / 100}rem` }"
                    ></div>
                    <!-- tab -->
                    <div
                        v-for="(item, index) in 3"
                        :key="index"
                        class="button"
                        :class="[setClass(index), { animation: params.index === (index + 1) }]"
                        @click="setCurrentIndex(currentStageList[index], index)"
                    ></div>
                </div>
                <!-- 赛制tab -->
                <div
                    v-for="(item, index) in tab"
                    :key="index"
                    class="tab"
                >
                    <div class="title">
                        <span>{{ item.name }}</span>
                        <span>{{ item.time }}</span>
                    </div>
                    <p>{{ item.content }}</p>
                </div>
            </div>
        </div>

        <!-- 活动礼物 -->
        <div class="gift">
            <div class="head">{{ $t('event_gift') }}</div>
            <div
                v-for="(item, index) in pageGifts"
                :key="index"
                class="item"
            >
                <div class="icon">
                    <img
                        :src="item.icon"
                        alt=""
                    />
                </div>
                <div class="name">{{ item.name }}</div>
                <div class="number">
                    <img
                        src="https://yaame-static.yaame.io/admin/da4971263b1bf2552c80cad90248e086.png"
                        alt=""
                    />
                    {{ item.amount }}
                </div>
            </div>
        </div>

        <!-- 家族排行榜 -->
        <FamilyRanking
            :params="params"
            :paramsName="paramsName"
            :data="data"
            ref="familiy"
        />
    </div>
</template>

<script setup>
import { computed, getCurrentInstance, onActivated, reactive, ref } from 'vue';
import { getLanguage } from '@/lib/device';
import FamilyRanking from './familyRanking.vue';
import { getHomeApi } from '../api';
import CustomHeader from '@/components/common/header.vue';
import { Toast } from 'vant';
import { burialPointFun } from '@/lib/utils';

// 获取实例
const root = getCurrentInstance();
// 国际化
const t = (key, value) => {
    return root.proxy.$t(key, value);
};

const language = computed(() => {
    let locale = getLanguage() || 'en';
    if (['zh-hk', 'zh-tw', 'zh-mo', 'zh-cn', 'zh_cn'].indexOf(locale) > -1) {
        const localEnum = {
            'zh-hk': 'zh-tw',
            'zh-tw': 'zh-tw',
            'zh-mo': 'zh-tw',
            'zh-cn': 'zh-cn',
        };

        locale = localEnum[locale];
    }
    return locale;
});
const logo = reactive({
    ar: 'https://yaame-static.yaame.io/admin/f076a08694b8aec79294654d3a3b9002.png',
    en: 'https://yaame-static.yaame.io/admin/5740d6f79decb78ab8b0d181985e30a1.png',
    id: 'https://yaame-static.yaame.io/admin/40cb2729372cfc81cfc71043cb14c233.png',
    'zh-cn': 'https://yaame-static.yaame.io/admin/52844eabad55e45a5c1645cf6800fa79.png',
    'zh-tw': 'https://yaame-static.yaame.io/admin/52dba845c8073cc9a678d887d6cce328.png',
});

// 跳转规则页
const goRule = () => {
    root.proxy.$router.push({
        path: '/rule',
        query: {
            region: currentRegion.value,
        },
    });
};
// 缓存当前大区
const currentRegion = ref('');
// 时间展示
const timeList = ref({
    INDONESIA: '12/12 00:00 - 12/19 23:59 (GMT+7)',
    MIDDLE_EAST: '12/12 00:00 - 12/19 23:59 (GMT+3)',
    SOUTHEAST_ASIA: '12/12 00:00 - 12/19 23:59 (GMT+8)',
})
// 赛制tab
const tab = computed(() => [
    {
        name: t('preliminary_round'),
        time: '12/12-12/14',
        content: t('all_families_compete', {
            xx: currentRegion.value === 'INDONESIA' ? '32' : '16',
        }),
    },
    {
        name: t('advancement_round'),
        time: '12/15-12/17',
        content: t('preliminary_top', {
            msg: currentRegion.value === 'INDONESIA' ? '32' : '16',
            xx: currentRegion.value === 'INDONESIA' ? '16' : '8',
        }),
    },
    {
        name: t('final_round'),
        time: '12/18-12/19',
        content: t('advancement_top', {
            xx: currentRegion.value === 'INDONESIA' ? '16' : '8',
            x: 3,
        }),
    },
]);
// 当前赛段名称
const paramsName = ref('');
// 切换当前日程
const setCurrentIndex = (item, index) => {
    nowTime.value = Date.now()
    // 判断当前赛程是否开启
    if (item.time[0] > nowTime.value) {
        Toast(t('battle_not_started'));
        return;
    }
    // 传递当前排名晋级数据
    getRankingNumber(currentRegion.value, index);
    // 设置当前赛程
    params.index = item.index;
    // 设置活动结束时间
    params.endTime = item.time[1];
    // 传递当前赛段名称
    paramsName.value = tab.value[index].name;
    // 获取家族排行
    familiy.value.getFamilyRanking(1);
};

// 当前赛程列表
const currentStageList = ref([]);
// 礼物信息
const gifts = ref([]);
// 传递给子组件
const params = reactive({
    id: 0,
    index: 0,
    endTime: 0,
});
// 家族排行dom
const familiy = ref(null);
// 获取当前赛段时间
const currentTime = ref([]);
// 当前进度
const currentProgress = ref(0);
// 记录当前赛程下标
const currentIndex = ref(0);
// 页面礼物信息
const pageGifts = ref([]);
// 大区名次判断&当前赛段
const data = reactive({
    ranking: 0,
    litre: true,
    currentIndex: 0,
});
// 获取活动数据
const getActivityData = async () => {
    try {
        const res = await getHomeApi();
        if (res.status !== 1000) {
            Toast(res.desc);
            return;
        }
        // 当前大区
        currentRegion.value = res.data.region_id;
        data.statusNumber = res.data.region_id === 'INDONESIA' ? 32 : 16;
        // 赛程列表
        currentStageList.value = res.data.courses;
        // 礼物信息
        gifts.value = res.data.gifts;
        // 活动id
        params.id = res.data.id;
        // 当前赛程
        params.index = res.data.courses.find((item) => item.current === 1)?.index || 3;
        // 活动结束时间
        params.endTime = res.data.courses.find((item) => item.current === 1)?.time[1] || res.data.courses[2].time[1];
        // 当前赛段时间
        currentTime.value = res.data.courses.find((item) => item.current === 1)?.time || res.data.courses[2].time;
        // 当前赛程下标
        currentIndex.value = res.data.courses.findIndex((item) => item.current === 1) < 0 ? 2 : res.data.courses.findIndex((item) => item.current === 1);
        data.currentIndex = currentIndex.value + 1;
        // 传递当前赛段名称
        paramsName.value = tab.value[currentIndex.value].name;
        // 判断当前时间是否在当前活动时间内
        data.litre =
            res.data.courses[currentIndex.value].time[0] <= nowTime.value &&
            res.data.courses[currentIndex.value].time[1] >= nowTime.value;
        getRankingNumber(currentRegion.value, currentIndex.value);
        // 页面礼物信息
        pageGifts.value = res.data.gifts;
        // 存储当前奖励信息
        window.localStorage.setItem('rewards', JSON.stringify(res.data.rewards));
        // 获取家族排行
        familiy.value.getFamilyRanking(1);
        // 计算当前进度
        setInterval(() => {
            setCurrentProgress();
        }, 1000);
    } catch (error) {
        console.log(error);
    }
};

// 获取当前范围
const getRankingNumber = (value, index) => {
    // 判断当前赛程阶段
    if (index === 0) {
        // 第一赛段
        data.ranking = value === 'INDONESIA' ? 32 : 16;
    } else if (index === 1) {
        // 第二赛段
        data.ranking = value === 'INDONESIA' ? 16 : 8;
    } else if (index === 2) {
        // 第三赛段
        data.ranking = 3;
    }
};

// 计算当前进度
const setCurrentProgress = () => {
    const time = Date.now();
    const startTime = currentTime.value[0];
    const endTime = currentTime.value[1];

    // 根据当前赛段计算进度
    if (currentIndex.value === 0) {
        // 获取当前阶段总进度
        const stageDuration = endTime - startTime;
        const preStartTime = startTime - stageDuration; // 第一阶段前的预热时间
        if (time < startTime) {
            // 预热阶段
            currentProgress.value = ((time - preStartTime) / stageDuration) * 120;
        } else if (time <= endTime) {
            // 第一赛段
            currentProgress.value = 120 + ((time - startTime) / stageDuration) * 220;
        }
    } else if (currentIndex.value === 1) {
        // 第二赛段
        currentProgress.value = 330 + ((time - startTime) / (endTime - startTime)) * 234;
    } else if (currentIndex.value === 2) {
        // 第三赛段
        currentProgress.value = 564 + ((time - startTime) / (endTime - startTime)) * 110;
    } else currentProgress.value = 688;

    // 防止超出进度条
    currentProgress.value = currentProgress.value <= 0 ? 0 : currentProgress.value >= 688 ? 688 : currentProgress.value;
};
// 当前时间戳
const nowTime = ref(Date.now());
// 设置class
const setClass = (index) => {
    return currentStageList.value[index] && currentStageList.value[index].time[0] <= nowTime.value ? 'button-yes' : '';
};

// 跳转mvp榜
const openMvp = () => {
    root.proxy.$router.push({
        path: '/ranking',
        query: {
            id: params.id,
            index: params.index,
        },
    });
};

onActivated(() => {
    getActivityData();
    // 埋点进入页面
    burialPointFun({
        event_name: 'event_page_view',
        cid: -1000,
        md: 1,
        args_name: '',
        args: {
            from: '',
            page_name: 'Family_event',
        },
    });
    // 缓存当前标识
    window.localStorage.setItem('familyHonor', '1');
    if (window.localStorage.getItem('familyHonor') !== '1') {
        getActivityData();
    };
});
</script>

<style lang="less" scoped>
.main {
    position: relative;
    min-height: 100vh;
    background-image: url(https://yaame-static.yaame.io/admin/047678fe5b7a87afd1127280d9c27da5.webp);
    background-repeat: no-repeat;
    background-size: contain;
    overflow: hidden;

    .refresh {
        position: fixed;
        top: 9.11rem;
        right: 0.44rem;
        width: 0.6rem;
        height: 0.6rem;
        background-image: url(https://yaame-static.yaame.io/admin/7af1d68cacbf6e4876922e9fd42cfe9f.png);
        background-repeat: no-repeat;
        background-size: contain;
        z-index: 10;
    }

    .rule {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 5.09rem;
        right: 0;
        width: 2.05rem;
        height: 0.64rem;
        background-image: url(https://yaame-static.yaame.io/admin/546b78d99f528a3d53b3387312ba4c34.png);
        background-repeat: no-repeat;
        background-size: contain;
        font-weight: 600;
        font-size: 0.22rem;
        color: #9e3100;
    }

    .mvp {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 6.36rem;
        right: 0;
        width: 2.03rem;
        height: 0.64rem;
        line-height: 0.24rem;
        padding: 0 0.2rem 0 0.5rem;
        background-image: url(https://yaame-static.yaame.io/admin/45d42071dfd2e0f144049d59a2ab15bb.png);
        background-repeat: no-repeat;
        background-size: contain;
        font-weight: 600;
        font-size: 0.22rem;
        color: #9e3100;
        text-align: center;
    }

    .logo {
        width: 5.5rem;
        height: 1.6rem;
        margin: 2.3rem auto 0;
        background-repeat: no-repeat;
        background-size: contain;
    }

    .time {
        width: 5.66rem;
        height: 0.44rem;
        line-height: 0.44rem;
        margin: 0.69rem auto 0;
        background-image: url(https://yaame-static.yaame.io/admin/6e387e13eef6f20ac7e50e8176b8dc98.png);
        background-repeat: no-repeat;
        background-size: contain;
        font-weight: 500;
        font-size: 0.24rem;
        color: #a14304;
        text-align: center;
    }

    // 赛程进度
    .progress {
        position: relative;
        width: 7.17rem;
        margin: 4.61rem auto 0;
        background: linear-gradient(180deg, #fff1d7 0%, #ffc678 100%);
        border: 0.04rem solid #ffc04e;

        .head {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 0.25rem;
            font-weight: 600;
            font-size: 0.36rem;
            color: #b55f13;
            img {
                width: 1.1rem;
                height: 0.21rem;
            }
            span {
                margin: 0 0.09rem;
            }
            img:last-child {
                transform: rotate(180deg);
            }
        }

        .body {
            display: flex;
            justify-content: space-evenly;
            position: relative;
            margin: 0.23rem auto 0.28rem;
            .progress-bar {
                position: absolute;
                top: 1.15rem;
                width: 6.88rem;
                height: 0.14rem;
                background: #c48440;
                border-radius: 0.07rem;
                .bar {
                    position: absolute;
                    width: 2.4rem;
                    height: 100%;
                    background: linear-gradient(270deg, #bcfafc 0%, #64d7fc 100%);
                    border-radius: 0.07rem;
                    transition-duration: 0.3s;
                }

                .animation {
                    animation: scale 0.5s infinite alternate;
                }
                @keyframes scale {
                    0% {
                        transform: scale(1);
                    }
                    100% {
                        transform: scale(1.2);
                    }
                }

                .button {
                    position: absolute;
                    top: -0.3rem;
                    left: 0.8rem;
                    width: 0.84rem;
                    height: 0.84rem;
                    background-image: url(https://yaame-static.yaame.io/admin/3f68fd9a072775773c146d2321802e81.png);
                    background-repeat: no-repeat;
                    background-size: contain;
                }
                .button-yes {
                    background-image: url(https://yaame-static.yaame.io/admin/a77f90ba346a99572f36083fc9081755.png);
                }
                .button:nth-child(3) {
                    left: 3.02rem;
                }
                .button:nth-child(4) {
                    left: 5.28rem;
                }
            }

            .tab {
                width: 1.83rem;
                display: flex;
                flex-direction: column;
                align-items: center;
                .title {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 0.98rem;
                    span:first-child {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 0.5rem;
                        line-height: 0.22rem;
                        font-weight: 600;
                        font-size: 0.22rem;
                        color: #b85b02;
                        text-align: center;
                    }
                    span:last-child {
                        font-weight: 400;
                        font-size: 0.22rem;
                        color: #b85b02;
                    }
                }

                p {
                    font-weight: 400;
                    font-size: 0.2rem;
                    color: #b85b02;
                    text-align: center;
                }
            }
        }
    }

    .gift {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        width: 7.18rem;
        height: 6.38rem;
        margin: 0.34rem auto 0.66rem;
        padding-top: 1.16rem;
        background-image: url(https://yaame-static.yaame.io/admin/85fd0622c9f8372a535ec3720d720bef.png);
        background-repeat: no-repeat;
        background-size: contain;

        .head {
            position: absolute;
            top: 0.57rem;
            left: 50%;
            transform: translateX(-50%);
            height: 0.28rem;
            line-height: 0.28rem;
            font-weight: 600;
            font-size: 0.32rem;
            color: #fff3df;
        }

        .item {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 1.5rem;
            .icon {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 1.5rem;
                height: 1.6rem;
                padding-top: 0.2rem;
                background-image: url(https://yaame-static.yaame.io/admin/67d1c90a956f07482eb87e382132af2f.png);
                background-repeat: no-repeat;
                background-size: contain;
                img {
                    width: 1.3rem;
                    height: 1.3rem;
                }
            }
            .name {
                margin: 0.08rem 0 0.04rem;
                font-weight: 400;
                font-size: 0.2rem;
                color: #a34905;
                line-height: 0.22rem;
                text-align: center;
            }
            .number {
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.22rem;
                color: #a34905;
                img {
                    width: 0.22rem;
                    height: 0.17rem;
                    margin-right: 0.02rem;
                }
            }
        }
    }
}
</style>
