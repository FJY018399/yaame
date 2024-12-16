<template>
    <div class="main" ref="mainElement">
        <!--返回标题-->
        <custom-header class="header" color="white">{{ $t('golden_spin') }}</custom-header>
        <!--logo-->
        <div class="logo" :style="{ backgroundImage: `url(${logoImg[locale]})` }"></div>
        <!--我的金币-->
        <div class="my-gold">
            <span>{{ $t('my_gold') }}</span>
            <div class="gold-number">
                <img src="https://yaame-static.yaame.io/admin/6542df1db44c5729263db97dc83ad021.png" alt="">
                {{ myGold }}
            </div>
        </div>
        <!--规则-->
        <div class="rule" @click="popupShow"></div>
        <!--记录-->
        <div class="record" @click="popupRecordShow"></div>
        <!--活动倒计时-->
        <div class="time">
            <div class="times">{{ days }}</div>
            <div class="times">D</div>
            :
            <div class="times">{{ hours < 10 ? `0${hours}` : hours }}</div>
            :
            <div class="times">{{ minutes < 10 ? `0${minutes}` : minutes }}</div>
            :
            <div class="times">{{ seconds < 10 ? `0${seconds}` : seconds }}</div>
        </div>
        <!--tab-->
        <div class="tab">
            <div class="cut-tab" :class="{ 'disparity-tab': saveTab === item.type, 'base-btn': saveTab === item.type && item.type === 'primary' }" v-for="(item, index) in tab"
                 :key="index" @click="cutTab(item.type)">{{ item.name }}
            </div>
        </div>
        <!--普通转盘-->
        <div class="dial" ref="baseDom">
            <!--转盘顶部-->
            <!-- <div class="dial-top"></div> -->
            <!--转盘外框-->
            <div class="dial-frame"></div>
            <!--礼物转盘-->
            <div ref="baseDial" class="gift-dial">
                <div class="gift" v-for="(item, index) in baseList" :key="item.reward_flag"
                     :style="{ transform: `rotate(${index * 45}deg)` }">
                    <div class="diamond">
                        <span v-if="baseList[index].reward_name === 'Diamonds'"></span>
                        {{ item.worth_diamonds }}{{ baseList[index].reward_name !== 'Diamonds' ? $t('day') : '' }}
                    </div>
                    <div class="girt-list" :style="{ backgroundImage: `url(${baseList[index].reward_icon})` }"></div>
                </div>
            </div>
            <div class="light-container">
                <img v-show="baseLightValue" src="https://yaame-static.yaame.io/admin/03a372be5d0a89a4ac1eca50d7531134.png" alt="">
                <img v-show="!baseLightValue" src="https://yaame-static.yaame.io/admin/311576a647bac66c38efa2780e80f5a5.png" alt="">
            </div>
            <!--礼物指针-->
            <div class="dial-pointer">
                <div class="pointer"></div>
                <!-- <div class="highlight" v-for="(item, index) in highlight" :key="index" :style="{ backgroundImage: `url(${item})`, opacity: 0 }" ref="basePointer"></div> -->
                <img v-show="baseRes" class="highlight-coin" src="https://yaame-static.yaame.io/admin/78f0c45c5e1a828861241f8728cc7ee0.png" ref="basePointer" alt="">
            </div>
            <!-- 转盘底座 -->
             <img class="dial-footer" src="https://yaame-static.yaame.io/admin/542fa84213d6a99f169c618b34cf84f6.png" alt="">
        </div>
        <!--超级转盘-->
        <div class="dial dial-super" ref="superDom">
            <!--转盘顶部-->
            <!-- <div class="dial-top"></div> -->
            <!--转盘外框-->
            <div class="dial-frame"></div>
            <!--礼物转盘-->
            <div ref="superDial" class="gift-dial">
                <div class="gift" v-for="(item, index) in superList" :key="item.reward_flag"
                     :style="{ transform: `rotate(${index * 45}deg)` }">
                    <div class="diamond">
                        <span v-if="superList[index].reward_name === 'Diamonds'"></span>
                        {{ item.worth_diamonds }}{{ superList[index].reward_name !== 'Diamonds' ? $t('day') : '' }}
                    </div>
                    <div class="girt-list" :style="{ backgroundImage: `url(${superList[index].reward_icon})` }"></div>
                </div>
            </div>
            <img style="position: absolute;top: 0;
            left: 0;z-index: 1;width: 7.3rem" src="https://yaame-static.yaame.io/admin/b3bfa9637154f391b874b3c8220f3273.png" alt="">
            <!--礼物指针-->
            <div class="dial-pointer">
                <div class="pointer"></div>
                <!-- <div class="highlight" v-for="(item, index) in highlight" :key="index" :style="{ backgroundImage: `url(${item})`, opacity: 0 }" ref="superPointer"></div> -->
                <img v-show="superRes" class="highlight-coin" src="https://yaame-static.yaame.io/admin/a3cf9e4e7e1609c8cec43762aeea673c.png" alt="">
            </div>

            <div class="light-container">
                <img v-show="!superLightValue" src="https://yaame-static.yaame.io/admin/03a372be5d0a89a4ac1eca50d7531134.png" alt="">
                <img v-show="superLightValue" src="https://yaame-static.yaame.io/admin/311576a647bac66c38efa2780e80f5a5.png" alt="">
            </div>

            <div style="z-index: 2;" class="light-container">
                <img v-show="!superLightValue" src="https://yaame-static.yaame.io/admin/197137c1b8477fd8ade98a99b2fb41d3.png" alt="">
                <img v-show="superLightValue" src="https://yaame-static.yaame.io/admin/52d1e4c3bfeae4417c3a39744ec6a7ef.png" alt="">
            </div>
            <!-- 转盘底座 -->
            <img class="dial-footer" src="https://yaame-static.yaame.io/admin/ac5ad3d6ccad31eeb1e7a4f3139e7e26.png" alt="">
        </div>
        <!--普通获得奖励-->
        <div class="acquire" v-show="saveTab === 'primary'">
            <!--钻石奖励-->
            <div class="get" v-if="baseLog.length && baseLog[0].lottery_rewards[0].reward_name === 'Diamonds'">{{ $t('get_reward') }}</div>
            <div class="diamonds" v-if="baseLog.length && baseLog[0].lottery_rewards[0].reward_name === 'Diamonds'">
                <img src="https://yaame-static.yaame.io/admin/764130cede775285db690053fdfcabd0.png" alt="">
                {{ baseLog.length && baseLog[0].lottery_rewards[0].worth_diamonds }}
            </div>
            <!--获得座驾图片显示-->
            <div class="car-img" v-if="baseLog.length && baseLog[0].lottery_rewards[0].reward_name !== 'Diamonds'">
                <span>Reward</span>
                <img class="icon" :src="baseLog.length && baseLog[0].lottery_rewards[0].reward_icon" alt="">
                <div class="diamond">
                    <div class="name">{{ baseLog.length && baseLog[0].lottery_rewards[0].reward_name }}</div>
                    <div class="diamond-img">
                        {{ baseLog.length && baseLog[0].lottery_rewards[0].worth_diamonds }}{{ $t('day') }}
                    </div>
                </div>
            </div>

            <div v-if="!baseLog.length" class="empty-info">
                Good luck to you
            </div>
        </div>
        <!--超级获得奖励-->
        <div class="acquire super" v-show="saveTab === 'super'">
            <div class="get" v-if="superLog.length && superLog[0].lottery_rewards[0].reward_name === 'Diamonds'">{{ $t('get_reward') }}</div>
            <div class="diamonds" v-if="superLog.length && superLog[0].lottery_rewards[0].reward_name === 'Diamonds'">
                <img src="https://yaame-static.yaame.io/admin/764130cede775285db690053fdfcabd0.png" alt="">
                {{ superLog.length && superLog[0].lottery_rewards[0].worth_diamonds }}
            </div>
            <!--获得座驾图片显示-->
            <div class="car-img" v-if="superLog.length && superLog[0].lottery_rewards[0].reward_name !== 'Diamonds'">
                <span>Reward</span>
                <img class="icon" :src="superLog.length && superLog[0].lottery_rewards[0].reward_icon" alt="">
                <div class="diamond">
                    <div class="name">{{ superLog.length && superLog[0].lottery_rewards[0].reward_name }}</div>
                    <div class="diamond-img">
                        {{ superLog.length && superLog[0].lottery_rewards[0].worth_diamonds }}{{ $t('day') }}
                    </div>
                </div>
            </div>

            <div v-if="!superLog.length" class="empty-info">
                Good luck to you
            </div>
        </div>
        <!--开始抽奖-->
        <div class="start-dial" :class="{ 'start-dial-img': saveTab === 'primary' ? throttleBase : throttleSuper }" @click="onStartPlay">
            <div class="open">{{ $t('draw') }}</div>
            <div class="gold-open">
                <img src="https://yaame-static.yaame.io/admin/6542df1db44c5729263db97dc83ad021.png" alt="">
                {{ saveTab === 'primary' ? 100 : 1000 }}
            </div>
        </div>
        <!--开始普通自动抽奖-->
        <div v-show="saveTab === 'primary'" class="voluntarily" @click="openBaseVoluntarily">
            <span v-show="!baseVoluntarily"></span>
            <span v-show="baseVoluntarily"></span>
            {{ $t('auto_ten_times') }}
        </div>
        <!--开始超级自动抽奖-->
        <div v-show="saveTab === 'super'" class="voluntarily super" @click="openSuperVoluntarily">
            <span v-show="!superVoluntarily"></span>
            <span v-show="superVoluntarily"></span>
            {{ $t('auto_ten_times') }}
        </div>
        <!--底部-->
        <div class="footer"></div>
        <!--规则页-->
        <popup class="popup" v-show="showRule" @cancel="popupShow">
            <div class="rule-page">
                <div class="rule-page-header">{{ $t('rules_description') }}</div>
                <p>
                    {{ $t('rule_1') }}<br/><br/>
                    {{ $t('rule_2') }}<br/><br/>
                    {{ $t('rule_3') }}<br/>
                </p>
            </div>
            <div class="rule-page-close" @click="popupShow"></div>
        </popup>
        <!--记录-->
        <popup class="popup" v-show="recordShow" @cancel="popupRecordShow">
            <div class="record-page">
                <div class="rule-page-header">{{ $t('winning_record') }}</div>
                <!--tab-->
                <div class="record-tab">
                    <div class="tab-double" :class="{ 'record-tab-color': recordTab === item.type }"
                         v-for="(item, index) in recordTabList" :key="index" @click="recordTabCut(item.type)">
                        {{ item.name }}
                    </div>
                    <div class="tab-chunk" :style="{ left: recordTab === 'base' ? '.1rem' : '1.76rem' }"></div>
                </div>
                <!--内容-->
                <div class="content">
                    <div class="slip" :style="{ left: recordTab === 'base' ? 0 : '-6rem' }">
                        <div class="base-content">
                            <div class="record-base" v-if="baseLog.length" v-for="(item, index) in baseLog" :key="index">
                                <p>{{ formatDate(item.lottery_time, 'yyyy.MM.dd hh:mm') }}(UTC+0)</p>
                                <div class="win">
                                    <div class="name">
                                        <img :src="item.lottery_rewards[0].reward_icon" alt="">
                                        {{ item.lottery_rewards[0].reward_name }}
                                    </div>
                                    <div class="diamond">
                                        <img v-if="item.lottery_rewards[0].reward_name === 'Diamonds'" src="https://yaame-static.yaame.io/admin/764130cede775285db690053fdfcabd0.png" alt="">
                                        {{ item.lottery_rewards[0].worth_diamonds }}{{ item.lottery_rewards[0].reward_name !== 'Diamonds' ? $t('day') : '' }}
                                    </div>
                                </div>
                            </div>
                            <div v-if="!baseLog.length" class="lack">
                                <p>{{ $t('no_draw_record') }}</p>
                            </div>
                        </div>
                        <div class="super-content">
                            <div class="record-super" v-if="superLog.length" v-for="(item, index) in superLog" :key="index">
                                <p>{{ formatDate(item.lottery_time, 'yyyy.MM.dd hh:mm') }}(UTC+0)</p>
                                <div class="win">
                                    <div class="name">
                                        <img :src="item.lottery_rewards[0].reward_icon" alt="">
                                        {{ item.lottery_rewards[0].reward_name }}
                                    </div>
                                    <div class="diamond">
                                        <img v-if="item.lottery_rewards[0].reward_name === 'Diamonds'" src="https://yaame-static.yaame.io/admin/764130cede775285db690053fdfcabd0.png" alt="">
                                        {{ item.lottery_rewards[0].worth_diamonds }}{{ item.lottery_rewards[0].reward_name !== 'Diamonds' ? $t('day') : '' }}
                                    </div>
                                </div>
                            </div>
                            <div v-if="!superLog.length" class="lack">
                                <p>{{ $t('no_draw_record') }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="rule-page-close" @click="popupRecordShow"></div>
        </popup>
        <pageLoading v-show="loading"></pageLoading>
    </div>
</template>

<script setup>
import {getCurrentInstance, onMounted, ref} from "vue";
import {getHomeInfoApi, getLotteryHomeApi, getLotteryLogApi, postLotteryApi} from "./api";
import { getLanguage } from "@/lib/device"
import { Toast } from "vant";
import {Downloader, Parser, Player} from 'svga.lite'
import { formatDate } from '@/lib/utils';
import customHeader from "@/components/common/header.vue";
import popup from "@/components/common/pop_up.vue";
import pageLoading from '../../components/common/page_loading.vue'


const root = getCurrentInstance()
const t = (value) => {
    return root.proxy.$i18n.t(value);
}

// 获取国家
let locale = ref(getLanguage() || "en");
// logo
const logoImg = ref({
    "ar": "https://yaame-static.yaame.io/admin/9a8df0602565de1485c39ad7b6afd36f.png",
    "en": "https://yaame-static.yaame.io/admin/3bf0a5da6dcdaadeddb2631f0aaf5500.png",
    "id": "https://yaame-static.yaame.io/admin/6381f30e854799f087eb297c9503e922.png",
    "zh-cn": "https://yaame-static.yaame.io/admin/628d3cfe6d0255678a19f6bacb1f0d08.png",
    "zh-tw": "https://yaame-static.yaame.io/admin/636defe6aa63b5982bcb97c9b543b819.png",
})

// tab
const tab = ref([
    {
        name: t('basic'),
        type: 'primary'
    },
    {
        name: t('super'),
        type: 'super'
    }
]);
// 选定tab样式
const saveTab = ref('primary');
// 切换tab
const cutTab = (value) => {
    saveTab.value = value;
    if (value === 'primary') {
        superDom.value.style.opacity = 0;
        baseDom.value.style.opacity = 1;
    } else {
        superDom.value.style.opacity = 1;
        baseDom.value.style.opacity = 0;
    }
};

// 整个转盘dom
const baseDom = ref(null);
const superDom = ref(null);
// 初始化转盘显示
const initialDial = () => {
    superDom.value.style.opacity = 0;
}


// 中奖高亮
const highlight = ref([
    'https://yaame-static.yaame.io/admin/93627caaa6a6571c9a0499c05e5cbfee.png',
    'https://yaame-static.yaame.io/admin/c89f5af39187c6b1ef165977e5922d49.png',
    'https://yaame-static.yaame.io/admin/fd3418b804560bdfa5477c9fcf804013.png',
    'https://yaame-static.yaame.io/admin/df95d0a5e12dd0dfe4d375e5c60dbb25.png',
    'https://yaame-static.yaame.io/admin/67e03cbbb0984e71f8aff14d6630d134.png',
    'https://yaame-static.yaame.io/admin/f9ca66ef5936f47ff7686a1dbb9b178b.png',
    'https://yaame-static.yaame.io/admin/93627caaa6a6571c9a0499c05e5cbfee.png',
    'https://yaame-static.yaame.io/admin/c89f5af39187c6b1ef165977e5922d49.png'
]);

// 普通自动抽奖
const baseVoluntarily = ref(false);
let baseVoluntarilyIndex = 0;
const openBaseVoluntarily = () => {
    baseVoluntarily.value = !baseVoluntarily.value;
};
// 超级自动抽奖
const superVoluntarily = ref(false);
let superVoluntarilyIndex = 0;
const openSuperVoluntarily = () => {
    superVoluntarily.value = !superVoluntarily.value;
};


// 转盘dom
const baseDial = ref(null);
const superDial = ref(null);
// 指针中奖dom
const basePointer = ref(null);
const superPointer = ref(null);
// 抽奖结果
const indexBase = ref(0);
const indexSuper = ref(0);
// 动画配置
const config = ref({
    duration: 5000, // 总旋转时间 ms级
    circle: 7, // 旋转圈数
    mode: 'ease-in-out', // 由快到慢
});
// 旋转角度
const baseRotateAngle = ref(0);
const superRotateAngle = ref(0);

// 获取抽奖结果
const open = async (value, tab) => {
    try {
        const res = await postLotteryApi({
            activity_type: 'COIN_LOTTERY',
            lottery_strategy_type: value,
            lottery_times: 1
        });
        if (res.status !== 1000) {
            Toast(res.desc);
            throttleBase.value = false;
            throttleSuper.value = false;
            return true;
        }
        if (tab === 'primary') myGold.value -= 100;
        if (tab === 'super') myGold.value -= 1000;
        subscript(res.data.lottery_rewards[0].reward_flag, tab);
        // w3BEYadW gQ3xMgWm    Goddess
    } catch (err) {
        console.log(err);
    }
};

// 闪烁定时器
let baseTime = ref(null);
let superTime = ref(null);
let currentBase = 0;
let currentSuper = 0;
// 扫光控制
const baseSweep = ref(false);
const superSweep = ref(false);
// 不可多次点击
const throttleBase = ref(false);
const throttleSuper = ref(false);
// 调用动画函数
const onStartPlay = () => {
    saveTab.value === 'primary' ? startPlay('base', 'primary') : startPlay('super', 'super')
}
// 动画效果

let baseRes = ref(false);
let superRes = ref(false);

let baseLightValue = ref(false);
let superLightValue = ref(false);
const startPlay = async (value, tab) => {
    if (tab === 'primary' && myGold.value < 100) {
        baseVoluntarily.value = false;
        Toast(t('not_enough_gold'));
        baseVoluntarilyIndex = 0;
        return;
    }
    if (tab === 'super' && myGold.value < 1000) {
        superVoluntarily.value = false;
        Toast(t('not_enough_gold'));
        superVoluntarilyIndex = 0;
        return;
    }
    if (tab === 'primary') {
        if (throttleBase.value) return;
        throttleBase.value = true;
        if (await open(value, tab)) return;
        // 初始化状态
        baseDial.value.style.removeProperty('transition');
        baseDial.value.style.removeProperty('transform');
        // 强制重绘
        baseDial.value.offsetHeight;
        clearInterval(baseTime);
        currentBase = 0;
        //初始化结束

        // 开始动画
        baseRotateAngle.value = config.value.circle * 360 - (indexBase.value * 45);
        baseDial.value.style.transition = `transform ${config.value.duration}ms ${config.value.mode}`;
        baseDial.value.style.transform = `rotate(${baseRotateAngle.value}deg)`;
        // 中奖显示高亮
        setTimeout(() => {
            // 修改为动画结束进行扣款操作
            homeList();
            throttleBase.value = false;
            // 调用最新日志并展示扫光
            lotteryLog('base');
            baseRes.value = true;
            // baseSweep.value = true;
            // // 开启闪烁
            // baseTime = setInterval(() => {
            //     if (!basePointer) return;
            //     basePointer.value[currentBase].style.opacity = 1;
            //     ((index) => {
            //         setTimeout(() => {
            //             basePointer.value[index].style.opacity = 0;
            //         }, 500);
            //     })(currentBase);
            //     currentBase = (currentBase + 1) % highlight.value.length
            // },500);
            // // 停止扫光
            setTimeout(() => {
                baseRes.value = false;
                // baseSweep.value = false;
                // // 清空定时器关闭高亮
                // clearInterval(baseTime);
                // closeBase();

            }, 3500);
        }, 5000)
    } else {
        if (throttleSuper.value) return;
        throttleSuper.value = true;
        if (await open(value, tab)) return;
        superDial.value.style.removeProperty('transition');
        superDial.value.style.removeProperty('transform');

        superDial.value.offsetHeight;
        clearInterval(superTime);
        currentSuper = 0;

        superRotateAngle.value = config.value.circle * 360 - (indexSuper.value * 45);
        superDial.value.style.transition = `transform ${config.value.duration}ms ${config.value.mode}`;
        superDial.value.style.transform = `rotate(${superRotateAngle.value}deg)`;


        setTimeout(() => {
            homeList();
            throttleSuper.value = false;

            lotteryLog('super');
            superRes.value = true;
        //     superSweep.value = true;
        //     superTime = setInterval(() => {
        //         superPointer.value[currentSuper].style.opacity = 1;
        //         ((index) => {
        //             setTimeout(() => {
        //                 superPointer.value[index].style.opacity = 0;
        //             }, 500);
        //         })(currentSuper);
        //         currentSuper = (currentSuper + 1) % highlight.value.length
        //     },500);
            setTimeout(() => {
                superRes.value = false;
                // superSweep.value = false;
                // clearInterval(superTime);
                // closeSuper();
            }, 3500);
        }, 5000)
    }
    // 放置异步队列等待动画结束
    setTimeout(() => {
        // 判断是否开启自动抽奖
        if (baseVoluntarily.value && baseVoluntarilyIndex < 10) {
            startPlay('base', 'primary');
            baseVoluntarilyIndex++
        }
        if (superVoluntarily.value && superVoluntarilyIndex < 10) {
            startPlay('super', 'super');
            superVoluntarilyIndex++
        }
        // 判断是否已经自动抽奖十次
        if (baseVoluntarilyIndex === 9) {
            baseVoluntarilyIndex = 0;
            baseVoluntarily.value = false;
        }
        if (superVoluntarilyIndex === 9) {
            superVoluntarilyIndex = 0;
            superVoluntarily.value = false;
        }
    }, 8500)
};

// 首页信息
const myGold = ref(0);
const homeList = async () => {
    try {
        const res = await getHomeInfoApi();
        if (res.status !== 1000) return;
        myGold.value = res.data.coin_balance;
        timeEnd.value = res.data.activity_end_time;
        
    } catch (err) {
        console.log(err);
    }
}

// 抽奖奖励信息
const baseList = ref([]);
const superList = ref([]);
const giftList = async () => {
    try {
        const res = await getLotteryHomeApi({
            activityType: 'COIN_LOTTERY',
        })
        if (res.status !== 1000) return;
        baseList.value = res.data.lottery_strategy_config.base.lottery_rewards;
        superList.value = res.data.lottery_strategy_config.super.lottery_rewards;
    } catch (err) {
        console.log(err);
    }
}

// 处理抽到结果下标
const subscript = (item, tab) => {
    if (tab === 'primary') {
        indexBase.value = baseList.value.findIndex(ite => {
            return ite.reward_flag === item;
        })
    } else {
        indexSuper.value = superList.value.findIndex(ite => {
            return ite.reward_flag === item;
        })
    }
}

// 开启扫光
const openSvga = async (id) => {
    const downloader = new Downloader()
    // 默认调用 WebWorker 线程解析
    // 可配置 new Parser({ disableWorker: true }) 禁止
    const parser = new Parser()
    // #canvas 是 HTMLCanvasElement
    const player = new Player(id);

    // 加载静态动画
    const fileData = await downloader.get('https://yaame-static.yaame.io/admin/4448ce72066d47362cdf7b2813333860.svga');
    let svgaData = await parser.do(fileData);

    player.set({ loop: 0 });

    await player.mount(svgaData);
    player.start();
}

// 规则
const showRule = ref(false);
const popupShow = () => {
    showRule.value = !showRule.value;
}

// 记录窗口
const recordShow = ref(false);
const popupRecordShow = () => {
    recordShow.value = !recordShow.value;
}

// 记录页tab
const recordTabList = ref([
    {
        name: t('basic'),
        type: 'base'
    },
    {
        name: t('super'),
        type: 'super'
    }
])
const recordTab = ref('base');

const recordTabCut = (value) => {
    recordTab.value = value;
}

// 获取抽奖日志
const baseLog = ref([]);
const superLog = ref([]);
const lotteryLog = async (value) => {
    try {
        const res = await getLotteryLogApi({
            activityType: 'COIN_LOTTERY',
            lotteryStrategyType: value
        });
        if (res.status !== 1000) return;
        if (value === 'base') baseLog.value = res.data.lottery_logs;
        else superLog.value = res.data.lottery_logs;

        setTimeout(() => {
            loading.value = false;
        }, 0);
    } catch (err) {
        console.log(err);
    }
}

// 页面活动倒计时
const timeEnd = ref(0);
const days = ref(0);
const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);
// 时间倒计时
const updateTime = () => {
    const now = new Date().getTime();
    // const utcNow = new Date(now.getTime() + now.getTimezoneOffset() * 60000); // 转换为 UTC 时间
    const timeDifference = timeEnd.value - now;
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
}

// 处理时间
const alterTime = (time) => {
    const givenDate = new Date(time);

    // 获取年份、月份、日期、小时和分钟
    const year = givenDate.getFullYear();
    const month = String(givenDate.getMonth() + 1).padStart(2, '0');
    const day = String(givenDate.getDate()).padStart(2, '0');
    const hours = String(givenDate.getHours()).padStart(2, '0');
    const minutes = String(givenDate.getMinutes()).padStart(2, '0');

    // 格式化日期和时间
    const formattedDate = `${year}.${month}.${day}`;
    const formattedTime = `${hours}:${minutes}`;

    return `${formattedDate} ${formattedTime}`;
}

// 计算页面高度
const mainElement = ref(null);
const updateHeight = () => {
    const remInPixels = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const targetHeightInPixels = 16.24 * remInPixels;
    if (window.innerHeight > targetHeightInPixels) {
        mainElement.value.style.height = '100vh';
    } else {
        mainElement.value.style.height = '16.24rem';
    }
}

// 关闭中奖高亮
const closeBase = () => {
    basePointer.value.forEach((item, index) => {
        item.style.opacity = 0;
    })
}
const closeSuper = () => {
    superPointer.value.forEach((item, index) => {
        item.style.opacity = 0;
    })
}

let loading = ref(true);
onMounted(async () => {
    // // 加载按钮资源
    // throttleBase.value = true;
    // // 加载十次抽奖按钮图片资源
    // baseVoluntarily.value = true;
    // 更改根元素高度
    updateHeight();
    // 获取首页信息
    await homeList();
    // 获取抽奖奖励信息
    await giftList();
    // 初始化转盘
    initialDial();
    // 获取日志信息
    await lotteryLog('base');
    lotteryLog('super');
    // 开启扫光
    // openSvga('#canvas');
    // openSvga('#canvas1')
    // 页面倒计时显示
    updateTime();
    setInterval(updateTime, 1000);

    // window.onload = () => {
    //     // 恢复图片默认
    //     baseVoluntarily.value = false;
    //     throttleBase.value = false;
    // }

    setInterval(() => {
        baseLightValue.value = !baseLightValue.value;
        superLightValue.value = !superLightValue.value;
    }, 500);
})
</script>

<style lang="less" scoped>
.main {
    position: relative;
    height: 16.24rem;
    padding-bottom: 1.16rem;
    background: url("https://yaame-static.yaame.io/admin/437a11c5d5e8169e230ae5b03ec55b6f.png") no-repeat;
    background-size: contain;
    overflow: hidden;

    // logo样式
    .logo {
        width: 5.58rem;
        height: 3.44rem;
        margin: 1.06rem auto 0;
        margin-top: 0;
        background-repeat: no-repeat;
        background-size: contain;
    }

    // 我的金币
    .my-gold {
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        left: 0;
        top: 3.39rem;
        min-width: 1.77rem;
        height: .84rem;
        padding-left: .17rem;
        background: url("https://yaame-static.yaame.io/admin/a7a9fb034c49130ec68b9757eaac4ac1.png") no-repeat;
        background-size: contain;
        color: #FFF;

        span {
            height: .28rem;
            font-size: .2rem;
        }

        .gold-number {
            display: flex;
            justify-content: center;
            align-items: center;
            height: .33rem;
            font-size: .24rem;

            img {
                width: .3rem;
                height: .3rem;
            }
        }
    }

    // 规则
    .rule,
    .record {
        position: absolute;
        top: 2.51rem;
        right: .2rem;
        width: .6rem;
        height: .6rem;
        background-image: url("https://yaame-static.yaame.io/admin/56a93b9e2652f8d158d77ed54ebc6778.png");
        background-repeat: no-repeat;
        background-size: contain;
    }

    // 记录
    .record {
        top: 3.51rem;
        background-image: url("https://yaame-static.yaame.io/admin/4ebf69b46ebe52d8f72f3fa8879d6869.png");
    }

    // 活动倒计时
    .time {
        display: flex;
        align-items: center;
        width: 3.5rem;
        height: .6rem;
        margin: auto;
        background: url("https://yaame-static.yaame.io/admin/d136f7ab4894e791c9698689025aca38.png") no-repeat;
        background-size: contain;
        font-size: .26rem;
        color: #fff;

        .times {
            height: .36rem;
            padding: 0 .1rem;
            background: #0ABA30;
            border-radius: .08rem;
        }

        .times:nth-child(1) {
            margin: 0 .04rem 0 .33rem;
        }

        .times:nth-child(2) {
            margin-right: .05rem;
        }

        .times:nth-child(3) {
            margin: 0 .05rem;
        }

        .times:nth-child(4) {
            margin: 0 .05rem;
        }

        .times:nth-child(5) {
            margin-left: .05rem;
        }
    }

    //tab样式
    .tab {
        display: flex;
        justify-content: space-around;
        width: 6.56rem;
        height: 0.9rem;
        margin: .3rem auto .2rem;
        margin-top: 0.48rem;
        .cut-tab {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 2.9rem;
            height: 100%;
            background-image: url("https://yaame-static.yaame.io/admin/546d8d71de1e0b9350d10552debb41b8.png");
            background-repeat: no-repeat;
            background-size: contain;
            font-size: .34rem;
            color: #FFFFFF;
            transition-duration: .3s;
        }

        .disparity-tab {
            background-image: url("https://yaame-static.yaame.io/admin/818b9a88350794c467b5653fc2568b0a.png");
        }
        .base-btn {
            background-image: url(https://yaame-static.yaame.io/admin/b90e63b9a0779b86a6241e04b15e4741.png);
        }
    }

    // 转盘样式
    .dial {
        position: absolute;
        top: 5.4rem;
        display: flex;
        justify-content: center;
        align-items: center;
        left: 50%;
        width: 7.3rem;
        height: 7.3rem;
        transform: translateX(-50%);
        z-index: 1;
        transition-duration: .3s;

        .dial-top {
            position: absolute;
            top: .28rem;
            left: 50%;
            width: 1.06rem;
            height: .81rem;
            transform: translateX(-50%);
            background-image: url("https://yaame-static.yaame.io/admin/123b3336c620f87d331de5eb8032606c.png");
            background-repeat: no-repeat;
            background-size: contain;
            z-index: 2;
        }

        .dial-frame {
            position: absolute;
            width: 100%;
            height: 100%;
            background-image: url("https://yaame-static.yaame.io/admin/2bdfd3691940510219915dced96554ff.png");
            background-repeat: no-repeat;
            background-size: contain;
            z-index: 3;
        }

        .gift-dial {
            position: absolute;
            width: 6.3rem;
            height: 6.3rem;
            background-image: url("https://yaame-static.yaame.io/admin/be06ba842405b4131ff97d0d5c2f4b6b.png");
            background-repeat: no-repeat;
            background-size: contain;
            z-index: 2;
            .gift {
                position: absolute;

                .diamond {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: .33rem;
                    font-weight: 600;
                    font-size: .24rem;
                    color: #fff;

                    span {
                        width: .3rem;
                        height: .27rem;
                        background: url("https://yaame-static.yaame.io/admin/764130cede775285db690053fdfcabd0.png") no-repeat;
                        background-size: contain;
                    }
                }

                .girt-list {
                    width: .8rem;
                    height: .8rem;
                    margin-top: .22rem;
                    background-repeat: no-repeat;
                    background-size: contain;
                }
            }

            .gift:nth-child(1) {
                top: .65rem;
                left: 50%;
                transform: translateX(-50%) !important;
            }

            .gift:nth-child(2) {
                top: 1.2rem;
                left: 4.1rem;
            }

            .gift:nth-child(3) {
                top: 2.45rem;
                left: 4.6rem;
            }

            .gift:nth-child(4) {
                top: 3.75rem;
                left: 4.07rem;
            }

            .gift:nth-child(5) {
                top: 4.27rem;
                left: 50%;
                transform: translateX(-50%) rotate(180deg) !important;
            }

            .gift:nth-child(6) {
                top: 3.75rem;
                left: 1.45rem;
            }

            .gift:nth-child(7) {
                top: 2.45rem;
                left: .9rem;
            }

            .gift:nth-child(8) {
                top: 1.2rem;
                left: 1.4rem;
            }
        }
        .light-container {
            width: 7.3rem;
            height: 7.3rem;
            position: absolute;
            // background-color: rgba(255,255, 255, 0.3);
            position: absolute;
            z-index: 3;
            // left: 0.66rem;
            // top: 0.46rem;
            img {
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                z-index: 1;
            }
        }

        .dial-pointer {
            position: absolute;
            top: 0.9rem;
            left: 50%;
            width: 2.26rem;
            height: 3.53rem;
            transform: translateX(-50%);
            z-index: 4;

            .pointer {
                position: absolute;
                width: 100%;
                height: 100%;
                background-image: url("https://yaame-static.yaame.io/admin/133fd296ae369d395b4378f8c819a008.png");
                background-repeat: no-repeat;
                background-size: contain;
                z-index: 2;
            }

            .highlight {
                position: absolute;
                top: .1rem;
                left: 50%;
                width: 2.04rem;
                height: 2.79rem;
                transform: translateX(-50%);
                background-repeat: no-repeat;
                background-size: contain;
                z-index: 1;
                transition-duration: .25s;
            }
            .highlight-coin {
                position: absolute;
                top: .1rem;
                left: 50%;
                width: 2.04rem;
                height: 2.79rem;
                transform: translateX(-50%);
                background-repeat: no-repeat;
                background-size: contain;
                z-index: 1;
                transition-duration: .25s;
                // 闪烁动画
                animation: blink 1s linear infinite;
            }
            @keyframes blink {
                0% {
                    opacity: 0;
                }
                50% {
                    opacity: 0.5;
                }
                100% {
                    opacity: 0;
                }
            }
        }
        .dial-footer {
            width: 6.86rem;
            height: 3.26rem;
            position: absolute;
            bottom: -1.84rem;
        }
    }

    // 超级转盘
    .dial-super {
        z-index: 0;

        .dial-top {
            top: .07rem;
            width: 1.66rem;
            height: 1.12rem;
            background-image: url("https://yaame-static.yaame.io/admin/820aa40b7c91e5777f98d100b391a037.png");
        }

        .dial-frame {
            background-image: url("https://yaame-static.yaame.io/admin/10634d12abd4d0d04dd0feb6e102b453.png");
        }

        .gift-dial {
            background-image: url("https://yaame-static.yaame.io/admin/c3306cee21432c52710490bb914f8183.png");
        }

        .dial-pointer {
            .pointer {
                background-image: url("https://yaame-static.yaame.io/admin/396d863689c56bd4624e5360130d980d.png");
            }
        }
    }

    // 获得奖励
    .acquire {
        position: absolute;
        top: 12.13rem;
        left: 50%;
        width: 3.91rem;
        height: 1.4rem;
        transform: translateX(-50%);
        background: url(https://yaame-static.yaame.io/admin/207a9769a1671dedd51a93f579420d3d.png) no-repeat;
        background-size: contain;
        z-index: 2;
        padding-top: 0.17rem;
        &.super {
            background-image: url(https://yaame-static.yaame.io/admin/3ba7b84b7edf22beb11b0c0eb7c3ab18.png);
        }
        .get,
        .diamonds {
            // height: .4rem;
            // line-height: .4rem;
            font-size: .28rem;
            color: #FFDB72;
            text-align: center;
        }
        .get {
            color: #FF0000;
            margin-top: 0.12rem;
            font-weight: 600;
        }

        .diamonds {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: .22rem;
            color: #FFF;

            img {
                width: .35rem;
                height: .31rem;
                margin-right: .13rem;
            }
        }

        .car-img {
            position: absolute;
            top: 0;
            padding-top: 0.16rem;
            span {
                display: block;
                width: 3.91rem;
                text-align: center;
                font-size: .28rem;
                color: #FF0000;
                font-weight: 600;
            }
            .icon {
                width: .62rem;
                height: .62rem;
                position: absolute;
                left: 0.9rem;
                top: 0.54rem;
            }
            .diamond {
                display: inline;
                font-size: .24rem;
                color: #FFFFFF;
                .name {
                    position: absolute;
                    left: 1.6rem;
                    top: 0.54rem;
                }
                .diamond-img {
                    position: absolute;
                    left: 1.6rem;
                    top: 0.88rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: .21rem;
                    img {
                        width: .24rem;
                        height: .21rem;
                    }
                }
            }
        }

        .empty-info {
            width: 3.91rem;
            height: 1.4rem;
            font-size: 0.24rem;
            color:  #fff;
            padding-top: 0.36rem;
            text-align: center;
        }

        #canvas,
        #canvas1 {
            position: absolute;
            bottom: 0.1rem;
            width: 5rem;
            height: 1.05rem;
        }
    }

    // 开始抽奖
    .start-dial {
        position: absolute;
        display: flex;
        align-content: center;
        flex-wrap: wrap;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        top: 13.78rem;
        left: 50%;
        width: 3.98rem;
        height: 1.34rem;
        padding-bottom: .1rem;
        transform: translateX(-50%);
        background-image: url("https://yaame-static.yaame.io/admin/ffa1665065464d5314e38db02777e5c6.png");
        background-repeat: no-repeat;
        background-size: contain;
        z-index: 3;
        .open {
            height: .42rem;
            font-size: .3rem;
            font-weight: 600;
            color: #fff;
        }

        .gold-open {
            display: flex;
            justify-content: center;
            align-items: center;
            height: .38rem;
            padding-right: .1rem;
            line-height: .38rem;
            font-size: .24rem;
            color: #FFF858;

            img {
                width: .38rem;
                height: .38rem;
            }
        }
    }
    .start-dial-img {
        // background-image: url("https://yaame-static.yaame.io/admin/2e6ef4f0eb29453b10bdabb06b00a74f.png");
        // 灰色滤镜
        filter: grayscale(100%);
    }

    // 自动抽奖
    .voluntarily {
        position: absolute;
        top: 15.22rem;
        left: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        height: .33rem;
        transform: translateX(-50%);
        font-size: .24rem;
        color: #FFDB72;
        z-index: 2;

        span {
            width: .3rem;
            height: .3rem;
            margin-right: .12rem;
            background-repeat: no-repeat;
            background-size: contain;
        }

        span:nth-child(1) {
            background-image: url("https://yaame-static.yaame.io/admin/0f731595ac0208bd8bbb11d558f43470.png");
        }

        span:nth-child(2) {
            background-image: url("https://yaame-static.yaame.io/admin/3d2d4bc4691e40bb5dc253ec7c4e13b8.png");
        }
    }

    // 底部
    .footer {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 2.55rem;
        background: url("https://yaame-static.yaame.io/admin/fd0bb25c061e1fce3f8cd51c7dc126e2.png") no-repeat;
        background-size: contain;
    }

    // 规则页
    .popup {
        .rule-page {
            position: relative;
            width: 6.2rem;
            height: 6.82rem;
            margin: 5rem auto 0;
            background: url("https://yaame-static.yaame.io/admin/7242b42659abf38827d19c3605f5e301.png") no-repeat;
            background-size: contain;

            .rule-page-header {
                position: absolute;
                top: 0.36rem;
                left: 50%;
                width: 2.92rem;
                height: 1.02rem;
                transform: translateX(-50%);
                font-weight: normal;
                font-size: 0.3rem;
                color: #FFE977;
                text-align: center;
            }

            p {
                position: absolute;
                top: 2rem;
                left: 50%;
                width: 5.40rem;
                height: 4.2rem;
                transform: translateX(-50%);
                overflow: auto;
                font-size: .28rem;
                color: #AB5F08;
            }
        }

        .rule-page-close {
            width: .7rem;
            height: .7rem;
            margin: .3rem auto 0;
            background: url("https://yaame-static.yaame.io/admin/64e2dd5d806ead08939203fa6809742a.png") no-repeat;
            background-size: contain;
        }

        .record-page {
            position: relative;
            width: 6.2rem;
            height: 8.24rem;
            margin: 5rem auto 0;
            background: url("https://yaame-static.yaame.io/admin/a221b48a8f3a9e69e76f1260ad4f9980.png") no-repeat;
            background-size: contain;

            .rule-page-header {
                position: absolute;
                top: 0.34rem;
                left: 50%;
                width: 2.92rem;
                height: 1.02rem;
                transform: translateX(-50%);
                font-weight: normal;
                font-size: 0.3rem;
                color: #FFE977;
                text-align: center;
            }

            .record-tab {
                position: absolute;
                display: flex;
                justify-content: space-around;
                align-items: center;
                top: 1.49rem;
                left: 50%;
                width: 3.2rem;
                height: .76rem;
                transform: translateX(-50%);
                background: #FFD8A4;
                border-radius: .38rem;

                .tab-double {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    font-size: 0.28rem;
                    color: #FFFFFF;
                    flex: 1;
                }

                .tab-double:nth-child(1) {
                    padding-right: .1rem;
                }

                .tab-double:nth-child(2) {
                    padding-left: .1rem;
                }

                .tab-chunk {
                    position: absolute;
                    top: 50%;
                    width: 1.34rem;
                    height: .6rem;
                    transform: translateY(-50%);
                    background: linear-gradient( 180deg, #68EC4B 0%, #0EC537 100%);
                    border-radius: .38rem;
                    transition-duration: .3s;
                    z-index: -1;
                }

                .record-tab-color {
                    color: #FFDB72;
                }
            }

            .content {
                position: absolute;
                top: 2.55rem;
                left: 50%;
                width: 5rem;
                height: 5.2rem;
                transform: translateX(-50%);
                overflow: hidden;
                .slip {
                    position: absolute;
                    width: 11rem;
                    height: 100%;
                    transition-duration: .3s;
                    .base-content,
                    .super-content {
                        float: left;
                        width: 5rem;
                        height: 100%;
                        overflow: auto;
                        .record-base,
                        .record-super{
                            display: flex;
                            flex-direction: column;
                            align-items: flex-start;
                            justify-content: space-evenly;
                            width: 5rem;
                            height: 1.34rem;
                            padding-left: .3rem;
                            margin-bottom: .2rem;
                            background: #FFD8A4;
                            border-radius: .12rem;
                            font-size: .26rem;
                            color: #AB5F08;
                            p {
                                font-size: .24rem;
                            }
                            .win {
                                display: flex;
                                .name {
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    margin-right: .54rem;
                                    img {
                                        width: .4rem;
                                        height: .4rem;
                                        margin-right: .12rem;
                                    }
                                }
                                .diamond {
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    img {
                                        width: .25rem;
                                        height: .22rem;
                                        margin-right: .06rem;
                                    }
                                }
                            }
                        }

                        .lack {
                            position: relative;
                            width: 1.73rem;
                            height: 1.14rem;
                            margin: .94rem auto 0;
                            background: url("https://yaame-static.yaame.io/admin/890f20803a4334e016589b79729dc9ff.png") no-repeat;
                            background-size: contain;
                            p {
                                position: absolute;
                                top: 1.37rem;
                                left: 50%;
                                height: .33rem;
                                transform: translateX(-50%);
                                font-size: .24rem;
                                color: #7254C8;
                                line-height: .33rem;
                                text-align: center;
                                white-space: nowrap;
                            }
                        }
                    }

                    .super-content {
                        margin-left: 1rem;
                    }
                }
            }
        }
    }
}
</style>

