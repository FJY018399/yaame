<template>
    <div
        class="main"
        :style="{ backgroundImage: `url(${logoImg[language]})` }"
    >
        <CustomHeader color="white">{{ $t('constellation_story') }}</CustomHeader>
        <!-- 活动时间 -->
        <p
            class="time-title"
            :style="getStyle('time-title')"
        >
            {{ new Date(timeOpen).getUTCMonth() + 1 }}/{{ new Date(timeOpen).getUTCDate() }} 00:00 -
            {{ new Date(timeEnd).getUTCMonth() + 1 }}/{{ new Date(timeEnd).getUTCDate() }}
            23:59(UTC+0)
        </p>
        <!-- 规则奖励 -->
        <div
            class="rule"
            @click="openRule('rule')"
            :style="[backImg('rule'), getStyle('rule-style')]"
        >
            {{ $t('rules_rewards') }}
        </div>

        <!-- 水晶球 -->
        <div
            class="crystal-ball"
            :style="backImg('crystal-ball')"
            @click="openRule('crystal_ball')"
        >
            <span :style="getStyle('crystal-ball-style')">{{
                $t('constellation_crystal_ball')
            }}</span>
        </div>

        <!-- 当期星座代言人&守护神展示 -->
        <div class="advocacy">
            <div
                class="bg"
                :style="getStyle('advocacy-bg')"
            ></div>
            <div class="avatar">
                <img
                    v-if="userImg"
                    :src="userImg.avatar"
                    alt=""
                    @click="toDetails(userImg)"
                />
                <img
                    v-else
                    :src="getSrcImg('advocacy')"
                    alt=""
                />
            </div>
            <div
                v-if="userImg"
                class="name"
                :style="getStyle('advocacy-style')"
            >
                {{ $t('xx_guardian', { msg: name }) }}
            </div>
            <div
                v-else
                class="name"
                :style="getStyle('advocacy-style')"
            >
                {{ $t('position_available') }}
            </div>
        </div>
        <div class="guard">
            <div
                class="bg"
                @click="toDetails(anchorImg)"
            ></div>
            <div class="avatar">
                <img
                    v-if="anchorImg"
                    :src="anchorImg.avatar"
                    alt=""
                />
                <img
                    v-else
                    :src="getSrcImg('advocacy')"
                    alt=""
                />
            </div>
            <div
                v-if="anchorImg"
                class="name"
                :style="[backImg('guard-name'), getStyle('guard-name-style')]"
            >
                {{ $t('xx_ambassador', { msg: name }) }}
            </div>
            <div
                v-else
                class="name"
                :style="[backImg('guard-name'), getStyle('guard-name-style')]"
            >
                {{ $t('position_available') }}
            </div>
        </div>

        <!--时间倒计时-->
        <div
            class="time"
            :style="[backImg('time'), getStyle('times-style')]"
        >
            <div class="times">{{ days }}</div>
            <div class="times">D</div>
            <div class="times">{{ hours < 10 ? '0' + hours : hours }}</div>
            <div class="times">{{ minutes < 10 ? '0' + minutes : minutes }}</div>
            <div class="times">{{ seconds < 10 ? '0' + seconds : seconds }}</div>
        </div>

        <!-- 选择星座和展示星座部分 -->
        <div
            v-if="!userKey && constellationKey"
            class="select-constellation"
            :style="backImg('select-constellation')"
        >
            <div class="head-title">{{ $t('constellation_selection') }}</div>
            <p>{{ $t('select_constellation_first') }}</p>
            <!-- 选择框 -->
            <div
                class="choice-box"
                :class="{ 'choice-box-yes': selectShow }"
                :style="getStyle('choice-box-style')"
                @click="selectShow = true"
            >
                {{ constellationName }}
            </div>
            <div
                class="button"
                :style="backImg('bottom')"
                @click="setConstellation"
            >
                {{ $t('confirm') }}
            </div>
        </div>
        <!-- 未到达选择星座情况 -->
        <div
            v-else-if="!rewardStatus && constellationKey"
            class="not-reach"
            :style="backImg('not-reach')"
        >
            <i18n path="constellation_selected_reward">
                <template v-slot:msg>
                    <img
                        :src="constellationListTwo[language][userKey]"
                        alt=""
                    />
                </template>
            </i18n>
        </div>
        <!-- 已到达选择星座日期 -->
        <div
            v-else-if="rewardStatus === 1 || (rewardStatus && key === userKey)"
            class="reach-constellation"
            :style="backImg('reach-constellation')"
        >
            <div class="head">{{ $t('constellation_selection') }}</div>
            <i18n path="current_constellation">
                <template v-slot:msg>
                    <img
                        :src="constellationListTwo[language][userKey]"
                        alt=""
                    />
                </template>
            </i18n>
            <!--      <div>{{ $t('constellation_month_arrived', {msg: constellationName}) }}</div>-->
            <div class="award-frame">
                <div
                    class="award-item"
                    v-for="(item, index) in present"
                    :key="index"
                >
                    <div
                        class="icon"
                        :style="getStyle('icon-style')"
                    >
                        <div
                            v-if="item.subscript"
                            class="day"
                            :style="getStyle('day-style')"
                        >
                            {{ item.subscript }}
                        </div>
                        <img
                            :style="{ height: item.object_type === 'INCOME_RIBBON' ? 'auto' : '' }"
                            :src="item.reward_icon"
                            alt=""
                        />
                    </div>
                    <div class="name">{{ item.reward_name }}</div>
                </div>
            </div>
            <div class="frame">
                <div
                    class="get-button"
                    :style="rewardStatus === 2 ? getStyle('get-button-yes') : backImg('bottom')"
                    :class="{ 'get-button-yes': rewardStatus === 2 }"
                    @click="getZodiacReward"
                >
                    {{ rewardStatus === 2 ? $t('already_claimed') : $t('claim') }}
                </div>
            </div>
        </div>

        <!-- 奖励礼物 -->
        <div
            class="award"
            :style="backImg('award')"
        >
            <div class="head">{{ $t('constellation_gift') }}</div>
            <div
                class="gift"
                v-for="(item, index) in awardList"
                :key="index"
            >
                <div
                    class="icon"
                    :style="backImg('award-icon')"
                >
                    <img
                        :src="item.reward_icon"
                        alt=""
                    />
                </div>
                <div class="name">{{ item.reward_name }}</div>
                <div class="diamond">
                    <img
                        src="https://yaame-static.yaame.io/admin/dcb74f5d4781c8550ed3440f698cbe32.png"
                        alt=""
                    />{{ item.reward_diamond_worth }}
                </div>
            </div>
        </div>

        <!-- tab -->
        <div class="tab">
            <div
                v-for="(item, index) in tabList"
                :key="index"
                :class="[active === item.key && 'active']"
                @click="activeClick(item.key)"
                :style="active === item.key ? getStyle('active') : backImg('tab')"
            >
                {{ item.name }}
            </div>
        </div>

        <!--二级tab-->
        <div
            class="secondary-tab"
            :style="getStyle('secondary-tab-style')"
        >
            <div
                class="slide"
                :style="[{ left: group === 'ANCHOR' ? '0.02rem' : '2.5rem' }, getStyle('slide')]"
            ></div>
            <div
                class="secondary-tabs"
                v-for="(item, index) in active === 'one' ? groupSever : groupSeverRanking"
                :key="index"
                @click="cutGroup(item.type)"
            >
                {{ item.name }}
            </div>
        </div>

        <!-- 任务排行页面 -->
        <KeepAlive>
            <RouterView
                :group-type="group"
                :value-key="key"
                ref="reward"
                @awardShow="awardShow"
            ></RouterView>
        </KeepAlive>

        <!-- 选择星座 -->
        <VanPopup
            class="select-show"
            v-model="selectShow"
            position="bottom"
            :style="[{ height: '7.13rem' }, getStyle('select-show-style')]"
        >
            <div
                class="choose-lift"
                :style="backImg('choose-lift')"
                @click="selectShow = false"
            ></div>
            <div
                class="choose-right"
                :style="backImg('choose-right')"
                @click="selectConstellation(constellationTran)"
            ></div>
            <div
                class="head-title"
                :style="getStyle('head-title-style')"
            >
                {{ $t('constellation_selection') }}
            </div>
            <!-- 星座 -->
            <div
                class="constellation"
                :class="{ 'constellation-border': constellationTran === item.type }"
                v-for="(item, index) in constellationList"
                :key="index"
                @click="cutConstellationTran(item)"
            >
                <img
                    :src="item.icon"
                    alt=""
                />
                <span :style="getStyle('constellation-span-style')">{{ item.name }}</span>
            </div>
        </VanPopup>

        <!-- 获奖成功 -->
        <Popup
            class="popup"
            v-show="awardWin"
            @cancel="awardWin = false"
            :visible="awardWin"
        >
            <div
                class="award-win"
                :style="backImg('award-win')"
            >
                <!--标题-->
                <div class="header"><span :style="backImg('span')"></span>{{ $t('congratulations_obtained') }}<span :style="backImg('span')"></span></div>
                <!-- 奖励 -->
                <div
                    class="award-list"
                    v-for="(item, index) in awardListShow"
                    :key="index"
                >
                    <div
                        class="icon"
                        :style="getStyle('icon-style')"
                    >
                        <div
                            v-if="item.subscript"
                            class="day"
                            :style="getStyle('day-style')"
                        >
                            {{ item.subscript }}
                        </div>
                        <img
                            :style="{ height: item.object_type === 'INCOME_RIBBON' ? 'auto' : '' }"
                            :src="item.reward_icon"
                            alt=""
                        />
                    </div>
                    <div class="name">{{ item.reward_name }}</div>
                </div>
                <div
                    class="button"
                    :style="backImg('bottom-two')"
                    @click="awardWin = false"
                >
                    ok
                </div>
            </div>
            <div
                class="rule-page-close"
                @click="awardWin = false"
            ></div>
        </Popup>
    </div>
</template>

<script setup>
import CustomHeader from '@/components/common/header.vue';
import { computed, getCurrentInstance, nextTick, onMounted, ref } from 'vue';
import {
    getWelfareInfoAPI,
    selectZodiacAPI,
    selectZodiacRewardAPI,
} from '@/pages/constellation/api';
import { Toast } from 'vant';
import { getLanguage } from '@/lib/device';
import Popup from '@/components/common/pop_up.vue';
import { burialPointFun } from '@/lib/utils';

// 获取当前查看星座
const key = ref(new URLSearchParams(window.location.search).get('type'));

// 获取国际化多语言
const root = getCurrentInstance();
const t = (val, msg) => {
    return root.proxy.$i18n.t(val, msg);
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

// 选择星座图片链接返回
const srcImg = (key) => {
    return root.proxy.$list.index.constellationList[key];
};

// 返回img链接
const getSrcImg = (key) => {
    return root.proxy.$list.index[key];
};

// 头部国际化
const logoImg = ref(root.proxy.$list.index.logoImg);

// 控制显示两个表格
const tabList = ref([
    {
        name: t('constellation_boost'),
        key: 'one',
    },
    {
        name: t('constellation_ranking'),
        key: 'two',
    },
]);
// tab切换
const active = ref('one');
// tab切换获取那天数据
const activeClick = (key) => {
    active.value = key;
    group.value = 'ANCHOR';
    if (key === 'one') {
        nextTick(() => {
            reward.value.getRewardData();
        });
        root.proxy.$router.replace('reward');
    } else {
        burialPointFun({
            event_name: 'page_btn_click',
            cid: -1000,
            md: 2,
            args_name: '',
            args: {
                type: 'rank_tab_click',
                page_name: 'Virgo_event',
            },
        });
        root.proxy.$router.replace('rank');
    }
};

// 任务页dom
const reward = ref(null);
// 组别tab
const group = ref('ANCHOR');
// 控制在不同一级tab下显示二级tab
const groupSever = ref([
    {
        name: t('ambassador_package'),
        type: 'ANCHOR',
    },
    {
        name: t('guardian_package'),
        type: 'AUDIENCE',
    },
]);
const groupSeverRanking = ref([
    {
        name: t('ambassador_ranking'),
        type: 'ANCHOR',
    },
    {
        name: t('guardian_ranking'),
        type: 'AUDIENCE',
    },
]);
const cutGroup = (value) => {
    group.value = value;
    if (active.value === 'one') {
        nextTick(() => {
            reward.value.getRewardData();
        });
        if (value === 'ANCHOR') {
            burialPointFun({
                event_name: 'page_btn_click',
                cid: -1000,
                md: 2,
                args_name: '',
                args: {
                    type: 'Endorsers_task_click',
                    page_name: 'Virgo_event',
                },
            });
        } else {
            burialPointFun({
                event_name: 'page_btn_click',
                cid: -1000,
                md: 2,
                args_name: '',
                args: {
                    type: 'Patronus_task_click',
                    page_name: 'Virgo_event',
                },
            });
        }
    }
};

// 活动结束时间戳
const timeEnd = ref(0);
// 活动开始时间戳
const timeOpen = ref(0);
// 页面计时时间
const days = ref(0);
const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);
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
    }, 1000);
};

// 星座弹窗
const selectShow = ref(false);
// 星座icon
const constellationList = ref([
    {
        type: 'CONSTELLATION0',
        icon: srcImg('virgo'),
        name: t('virgo'), // 处女座
    },
    {
        type: 'CONSTELLATION1',
        icon: srcImg('libra'),
        name: t('libra'), // 天秤座
    },
    {
        type: 'CONSTELLATION2',
        icon: srcImg('scorpio'),
        name: t('scorpio'), // 天蝎座
    },
    {
        type: 'CONSTELLATION3',
        icon: srcImg('sagittarius'),
        name: t('sagittarius'), // 射手座
    },
    {
        type: 'CONSTELLATION4',
        icon: srcImg('capricorn'),
        name: t('capricorn'), // 魔羯座
    },
    {
        type: 'CONSTELLATION5',
        icon: srcImg('aquarius'),
        name: t('aquarius'), // 水瓶座
    },
    {
        type: 'CONSTELLATION6',
        icon: srcImg('pisces'),
        name: t('pisces'), // 双鱼座
    },
    {
        type: 'CONSTELLATION7',
        icon: srcImg('aries'),
        name: t('aries'), // 白羊座
    },
    {
        type: 'CONSTELLATION8',
        icon: srcImg('taurus'),
        name: t('taurus'), // 金牛座
    },
    {
        type: 'CONSTELLATION9',
        icon: srcImg('gemini'),
        name: t('gemini'), // 双子座
    },
    {
        type: 'CONSTELLATION10',
        icon: srcImg('cancer'),
        name: t('cancer'), // 巨蟹座
    },
    {
        type: 'CONSTELLATION11',
        icon: srcImg('leo'),
        name: t('leo'), // 狮子座
    },
]);
// 星座展示icon
const constellationListTwo = ref({
    ar: {
        CONSTELLATION0: 'https://yaame-static.yaame.io/admin/20fd1784ac2a531cd47ab916e4e77af2.png',
        CONSTELLATION1: 'https://yaame-static.yaame.io/admin/7e2bdce7c4416706dac8daa822452d20.png',
        CONSTELLATION2: 'https://yaame-static.yaame.io/admin/ced8f90844191336518084a0b08d1c5d.png',
        CONSTELLATION3: 'https://yaame-static.yaame.io/admin/7185cdf067f63e8afd3412497a727f02.png',
        CONSTELLATION4: 'https://yaame-static.yaame.io/admin/0650790f297d77d687708aa198c76ebf.png',
        CONSTELLATION5: 'https://yaame-static.yaame.io/admin/27aa59770ec66b367231db722f56ea0d.png',
        CONSTELLATION6: 'https://yaame-static.yaame.io/admin/ad52fad482f2c926f6763422a32dd7ea.png',
        CONSTELLATION7: 'https://yaame-static.yaame.io/admin/960f18cd3b9395d9978b7570bab9228d.png',
        CONSTELLATION8: 'https://yaame-static.yaame.io/admin/fbbb573cda0bea75feb5ecfb09a5bdeb.png',
        CONSTELLATION9: 'https://yaame-static.yaame.io/admin/b48e51560332138ec45901ca7b452601.png',
        CONSTELLATION10: 'https://yaame-static.yaame.io/admin/7cde6974ef9fb3d5980a7c0ae9ded4af.png',
        CONSTELLATION11: 'https://yaame-static.yaame.io/admin/28d06d5231aaa0beb18706949f5baab5.png',
    },
    en: {
        CONSTELLATION0: 'https://yaame-static.yaame.io/admin/14c0607b81c561e7ec60b28cfecfdab5.png',
        CONSTELLATION1: 'https://yaame-static.yaame.io/admin/e5ef8096fb7af3c8c61bcb9d311016a2.png',
        CONSTELLATION2: 'https://yaame-static.yaame.io/admin/e8bafe1102d0fa1e23d240a9489a3ab3.png',
        CONSTELLATION3: 'https://yaame-static.yaame.io/admin/48aa334453d293f3e63022d4f00c0359.png',
        CONSTELLATION4: 'https://yaame-static.yaame.io/admin/1dffa8981c3afb789b0775ab23fe78d9.png',
        CONSTELLATION5: 'https://yaame-static.yaame.io/admin/c3102b3ae0d633c78a61daecda2ac2c3.png',
        CONSTELLATION6: 'https://yaame-static.yaame.io/admin/441f4e2c05513a0b6140ac140476ccde.png',
        CONSTELLATION7: 'https://yaame-static.yaame.io/admin/f4adc14bb3ba0892e591f7cbed7fa615.png',
        CONSTELLATION8: 'https://yaame-static.yaame.io/admin/352b3380bbf9946337823f0eba80faff.png',
        CONSTELLATION9: 'https://yaame-static.yaame.io/admin/822f511b84256cc4513bf92a4683d958.png',
        CONSTELLATION10: 'https://yaame-static.yaame.io/admin/eb9df6be532bd4b1bdc0711b6300167a.png',
        CONSTELLATION11: 'https://yaame-static.yaame.io/admin/2f5deb844acbe957fc8f22c949f53a52.png',
    },
    id: {
        CONSTELLATION0: 'https://yaame-static.yaame.io/admin/14c0607b81c561e7ec60b28cfecfdab5.png',
        CONSTELLATION1: 'https://yaame-static.yaame.io/admin/e5ef8096fb7af3c8c61bcb9d311016a2.png',
        CONSTELLATION2: 'https://yaame-static.yaame.io/admin/e8bafe1102d0fa1e23d240a9489a3ab3.png',
        CONSTELLATION3: 'https://yaame-static.yaame.io/admin/48aa334453d293f3e63022d4f00c0359.png',
        CONSTELLATION4: 'https://yaame-static.yaame.io/admin/1dffa8981c3afb789b0775ab23fe78d9.png',
        CONSTELLATION5: 'https://yaame-static.yaame.io/admin/c3102b3ae0d633c78a61daecda2ac2c3.png',
        CONSTELLATION6: 'https://yaame-static.yaame.io/admin/441f4e2c05513a0b6140ac140476ccde.png',
        CONSTELLATION7: 'https://yaame-static.yaame.io/admin/f4adc14bb3ba0892e591f7cbed7fa615.png',
        CONSTELLATION8: 'https://yaame-static.yaame.io/admin/352b3380bbf9946337823f0eba80faff.png',
        CONSTELLATION9: 'https://yaame-static.yaame.io/admin/822f511b84256cc4513bf92a4683d958.png',
        CONSTELLATION10: 'https://yaame-static.yaame.io/admin/eb9df6be532bd4b1bdc0711b6300167a.png',
        CONSTELLATION11: 'https://yaame-static.yaame.io/admin/2f5deb844acbe957fc8f22c949f53a52.png',
    },
    'zh-cn': {
        CONSTELLATION0: 'https://yaame-static.yaame.io/admin/0142cb9c6277151fb952ee8a5a6a73e2.png',
        CONSTELLATION1: 'https://yaame-static.yaame.io/admin/6f53fb4fdbb21dcdadb197da18a3720e.png',
        CONSTELLATION2: 'https://yaame-static.yaame.io/admin/c9b2ad54fd9bc5ae8ddba0eb212e0f9d.png',
        CONSTELLATION3: 'https://yaame-static.yaame.io/admin/91018ed5f8c52ebab4f632d62e1fa11e.png',
        CONSTELLATION4: 'https://yaame-static.yaame.io/admin/adba99fa1549aae6ec583d908de7005b.png',
        CONSTELLATION5: 'https://yaame-static.yaame.io/admin/bf0f30f9a8d29bd562d542097f59eb93.png',
        CONSTELLATION6: 'https://yaame-static.yaame.io/admin/4a4a100e76297d61c23984fdb3c8ce35.png',
        CONSTELLATION7: 'https://yaame-static.yaame.io/admin/fead84510af8e03d4b59b02a1991dc19.png',
        CONSTELLATION8: 'https://yaame-static.yaame.io/admin/3aea5b82684334049fd43eaa45544ed2.png',
        CONSTELLATION9: 'https://yaame-static.yaame.io/admin/cb8adcf5db6268de6f7a8230c7e26aae.png',
        CONSTELLATION10: 'https://yaame-static.yaame.io/admin/a5ddc88857b81edee06e1d5d9330e51c.png',
        CONSTELLATION11: 'https://yaame-static.yaame.io/admin/c0296ac21ba267bcd58ab13cac427527.png',
    },
    'zh-tw': {
        CONSTELLATION0: 'https://yaame-static.yaame.io/admin/f28719ae4a332cdab1b917407d9cc4f6.png',
        CONSTELLATION1: 'https://yaame-static.yaame.io/admin/6f53fb4fdbb21dcdadb197da18a3720e.png',
        CONSTELLATION2: 'https://yaame-static.yaame.io/admin/c9b2ad54fd9bc5ae8ddba0eb212e0f9d.png',
        CONSTELLATION3: 'https://yaame-static.yaame.io/admin/91018ed5f8c52ebab4f632d62e1fa11e.png',
        CONSTELLATION4: 'https://yaame-static.yaame.io/admin/adba99fa1549aae6ec583d908de7005b.png',
        CONSTELLATION5: 'https://yaame-static.yaame.io/admin/bf0f30f9a8d29bd562d542097f59eb93.png',
        CONSTELLATION6: 'https://yaame-static.yaame.io/admin/1960a0c32ab444515aae485ccc39b8eb.png',
        CONSTELLATION7: 'https://yaame-static.yaame.io/admin/d9a8a6ea927ec9add496a0b85d58af42.png',
        CONSTELLATION8: 'https://yaame-static.yaame.io/admin/3aea5b82684334049fd43eaa45544ed2.png',
        CONSTELLATION9: 'https://yaame-static.yaame.io/admin/ecfc8fb043b7241c4a038ad5146dbc22.png',
        CONSTELLATION10: 'https://yaame-static.yaame.io/admin/a5ddc88857b81edee06e1d5d9330e51c.png',
        CONSTELLATION11: 'https://yaame-static.yaame.io/admin/01722e4287b67c4f913b0623adba7127.png',
    },
});

// 当前星座key
const constellationKey = ref(null);
const userKey = ref('');
// 当前星座名称
const constellationName = ref('');
// 选择星座
const selectConstellation = (value) => {
    selectShow.value = false;
    constellationTran.value = value;
    constellationName.value = cutConstellationName.value;
};
// 控制名称变动
const cutConstellationName = ref('');
// 控制弹窗选择变动
const constellationTran = ref('CONSTELLATION0');
// 选择星座动画
const cutConstellationTran = (value) => {
    constellationTran.value = value.type;
    cutConstellationName.value = value.name;
};

// 确认选择当前星座
const setConstellation = async () => {
    try {
        const res = await selectZodiacAPI({
            cycle_type: constellationTran.value,
            group_id: 2024,
        });
        if (res.status !== 1000) {
            Toast(res.desc);
            return;
        }
        userKey.value = constellationTran.value;
        Toast(t('constellation_selection_success', { msg: constellationName.value }));
        await getHomeData();
    } catch (err) {
        console.log(err);
    }
};
// 领取当月专属奖励
const getZodiacReward = async () => {
    try {
        awardListShow.value = present.value;
        if (rewardStatus.value === 2) {
            Toast(t('reward_already_claimed'));
            return;
        }
        const res = await selectZodiacRewardAPI({
            cycleType: key.value,
            group_id: 2024,
        });
        if (res.status !== 1000) {
            Toast(res.desc);
            return;
        }
        rewardStatus.value = 2;
        Toast(t('reward_claimed_success'));
        awardWin.value = true;
    } catch (err) {
        console.log(err);
    }
};

// 奖励弹窗
const awardWin = ref(false);
const awardListShow = ref([]);
const awardShow = (value) => {
    awardListShow.value = value;
    awardWin.value = true;
};
// 主播用户头像
const anchorImg = ref('');
const userImg = ref('');
// 获取当前奖励列表
const awardList = ref([]);
// 获取当前星座奖励
const present = ref([]);
// 当月专属奖励领取状态
const rewardStatus = ref(null);
// 头部展示当前活动星座
const name = ref('');
// 页面数据
const getHomeData = async () => {
    try {
        const res = await getWelfareInfoAPI({
            constellationType: group.value,
            cycleType: key.value,
            group_id: 2024,
        });
        if (res.status !== 1000) return;
        timeEnd.value = res.data.activity_end_time;
        timeOpen.value = res.data.activity_start_time;
        // 记录当前key
        constellationTran.value = res.data.cycle_type;
        constellationKey.value = res.data.cycle_type;
        // 礼物列表
        awardList.value = res.data.gift;
        // 头部头像
        anchorImg.value = res.data.top_user && res.data.top_user.anchor;
        userImg.value = res.data.top_user && res.data.top_user.audience;
        // 获取当前用户星座
        userKey.value = res.data.exclusive.user_exclusive_zodiacs
            ? res.data.exclusive.user_exclusive_zodiacs.cycle_type
            : '';
        // 获取当月星座奖励
        present.value = res.data.exclusive.rewards || [];
        rewardStatus.value = res.data.exclusive.reward_status;
        // 获取当前活动星座名称
        constellationName.value = constellationList.value.find(
            (item) => item.type === key.value,
        ).name;
        // 页面顶部星座名展示
        name.value = constellationName.value;
        cutConstellationName.value = constellationName.value;
    } catch (err) {
        console.log(err);
    }
};

// 跳转
const toDetails = (url) => {
    if (url.mystery === 1) {
        Toast(t('mystery_user'));
        return;
    }
    window.location.href = url.scheme_user_url;
};

// 跳转 和埋点
const openRule = (value) => {
    if (value === 'rule') {
        burialPointFun({
            event_name: 'page_btn_click',
            cid: -1000,
            md: 2,
            args_name: '',
            args: {
                type: 'rules_rewards',
                page_name: 'Virgo_event',
            },
        });
        root.proxy.$router.push('/rule');
    } else {
        burialPointFun({
            event_name: 'page_btn_click',
            cid: -1000,
            md: 2,
            args_name: '',
            args: {
                type: 'Crystal_click',
                page_name: 'Virgo_event',
            },
        });
        root.proxy.$router.push('/CrystalBall');
    }
};

// 背景图片配置方法
const backImg = (key) => {
    return {
        backgroundImage: `url(${root.proxy.$list.index[key]})`,
    };
};
// 获取样式
const getStyle = (key) => {
    return root.proxy.$list.index[key];
};

onMounted(async () => {
    await getHomeData();
    openTiming();

    if (new Date().getTime() < timeOpen.value || new Date().getTime() > timeEnd.value) {
        Toast(t('non_event_time'));
    }

    // 页面上报
    burialPointFun({
        event_name: 'event_page_view',
        cid: -1000,
        md: 1,
        args_name: '',
        args: {
            from: '',
            page_name: 'Virgo_event',
        },
    });

    // 根据路由反选中tab
    if (root.proxy.$route.name === 'reward') {
        active.value = 'one';
    } else {
        active.value = 'two';
        reward.value.getRank();
    }
});
</script>

<style lang="less" scoped>
.main {
    min-height: 100vh;
    background-repeat: no-repeat;
    background-size: contain;
    overflow: hidden;
    .time-title {
        width: 3.38rem;
        height: 0.28rem;
        margin: 2.35rem auto 0;
        font-weight: 600;
        font-size: 0.2rem;
        color: #ffffff;
        line-height: 0.28rem;
        text-align: center;
        white-space: nowrap;
        letter-spacing: -0.005rem;
    }

    .rule {
        position: absolute;
        right: 0;
        top: 2.96rem;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        width: 1.8rem;
        height: 0.64rem;
        padding: 0 0.18rem 0 0.35rem;
        font-size: 0.22rem;
        color: #ffffff;
        line-height: 0.24rem;
        background-repeat: no-repeat;
        background-size: contain;
        text-align: center;
    }

    .crystal-ball {
        position: fixed;
        top: 50%;
        right: 0;
        width: 1.61rem;
        height: 1.37rem;
        background-repeat: no-repeat;
        background-size: contain;
        z-index: 3;
        span {
            position: absolute;
            bottom: 0.08rem;
            width: 100%;
            height: 0.25rem;
            font-weight: 500;
            font-size: 0.18rem;
            color: #ffde8e;
            line-height: 0.25rem;
            text-align: center;
            white-space: nowrap;
        }
    }

    .advocacy,
    .guard {
        position: absolute;
        top: 5.32rem;
        left: 1.92rem;
        width: 1.32rem;
        height: 1.55rem;
        .bg {
            position: absolute;
            width: 100%;
            height: 100%;
            background-image: url('https://yaame-static.yaame.io/admin/71e4fe326f351b484bf7a8582f7bc581.png');
            background-repeat: no-repeat;
            background-size: contain;
            z-index: 1;
        }
        .avatar {
            position: absolute;
            top: 0.25rem;
            right: 0.15rem;
            width: 0.91rem;
            height: 0.91rem;
            border-radius: 50%;
            overflow: hidden;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .name {
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            top: 1.25rem;
            left: 50%;
            transform: translateX(-50%);
            width: 1.66rem;
            height: 0.5rem;
            line-height: 0.22rem;
            font-weight: 500;
            font-size: 0.2rem;
            color: #fdf6ff;
            text-align: center;
            z-index: 2;
        }
    }
    .advocacy {
        .avatar {
            z-index: 1;
        }
    }
    .guard {
        top: 5.22rem;
        left: 4.07rem;
        width: 1.53rem;
        height: 1.52rem;
        .bg {
            background-image: url(https://yaame-static.yaame.io/admin/01ce854158f8a08935d9e0d8c60dba73.png);
        }
        .avatar {
            top: 0.22rem;
            right: 0.22rem;
            width: 1.08rem;
            height: 1.08rem;
            background: #7f1ec8;
        }
        .name {
            top: 1.3rem;
            width: 1.88rem;
            height: 0.5rem;
            font-weight: 500;
            font-size: 0.22rem;
            background-repeat: no-repeat;
            background-size: contain;
        }
    }

    .time {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 5.1rem;
        height: 1.1rem;
        padding-left: 0.47rem;
        margin: 5.46rem auto 0;
        background-repeat: no-repeat;
        background-size: contain;
        color: #fcf0ff;
        .times {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 0.68rem;
            height: 0.68rem;
            font-size: 0.26rem;
        }
        .times:nth-child(1) {
            margin-right: 0.13rem;
        }
        .times:nth-child(2) {
            margin-right: 0.25rem;
        }
        .times:nth-child(n + 3) {
            margin-right: 0.19rem;
        }
    }

    // 选择星座样式
    .select-constellation {
        width: 6.96rem;
        height: 4.2rem;
        margin: 0.05rem auto 0;
        background-repeat: no-repeat;
        background-size: contain;
        overflow: hidden;
        font-size: 0.22rem;
        color: #ffffff;
        .head-title {
            width: 2.38rem;
            height: 0.3rem;
            margin: 0.87rem auto 0;
            text-align: center;
            white-space: nowrap;
        }

        p {
            width: 6.43rem;
            height: 0.72rem;
            margin: 0.25rem 0 0 0.31rem;
            line-height: 0.24rem;
        }
        .choice-box {
            display: flex;
            align-items: center;
            position: relative;
            width: 2.92rem;
            height: 0.46rem;
            padding-left: 0.22rem;
            margin: 0.22rem auto 0.39rem;
            border-radius: 0.08rem;
        }
        .choice-box::after {
            content: '';
            position: absolute;
            bottom: 0.17rem;
            right: 0.21rem;
            width: 0.11rem;
            height: 0.08rem;
            background: url('https://yaame-static.yaame.io/admin/f838018c9649f5af14c4d62312d7f643.png') no-repeat;
            background-size: contain;
            transition-duration: 0.2s;
        }
        .choice-box-yes::after {
            transform: rotateZ(180deg);
        }
        .button {
            width: 1.71rem;
            height: 0.73rem;
            margin: 0.39rem auto 0;
            padding-top: 0.22rem;
            background-repeat: no-repeat;
            background-size: contain;
            text-align: center;
        }
    }
    .not-reach {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 6.96rem;
        height: 2.66rem;
        margin: 0.49rem auto 0;
        background-repeat: no-repeat;
        background-size: contain;
        font-size: 0.22rem;
        color: #ffffff;
        span {
            display: flex;
            flex-direction: column;
            align-items: center;
            img {
                width: 6rem;
                height: 0.92rem;
                margin: 0.2rem auto 0.17rem;
            }
        }
    }
    .reach-constellation {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        width: 6.96rem;
        height: 5.33rem;
        padding-top: 1.33rem;
        margin: 0.1rem auto 0;
        background-repeat: no-repeat;
        background-size: contain;
        font-size: 0.22rem;
        color: #ffffff;
        .head {
            position: absolute;
            top: 0.8rem;
            left: 50%;
            transform: translateX(-50%);
            height: 0.3rem;
            line-height: 0.3rem;
            font-weight: 500;
        }
        span {
            display: flex;
            flex-direction: column;
            align-items: center;
            img {
                width: 4.8rem;
            }
        }
        .award-frame {
            display: flex;
            justify-content: space-between;
            width: 5.9rem;
            margin-top: 0.18rem;
            .award-item {
                position: relative;
                width: 1.04rem;
                .icon {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: relative;
                    width: 1.04rem;
                    height: 1.04rem;
                    border-radius: 0.13rem;
                    .day {
                        position: absolute;
                        top: 0;
                        right: 0;
                        height: 0.21rem;
                        padding: 0 0.08rem;
                        border-radius: 0 0.1rem 0 0.1rem;
                        font-size: 0.13rem;
                        color: #ffffff;
                    }
                    img {
                        width: 0.9rem;
                        height: 0.9rem;
                    }
                }
                .name {
                    position: relative;
                    left: 50%;
                    transform: translateX(-50%);
                    height: 0.36rem;
                    width: 185%;
                    margin: 0.1rem auto 0;
                    font-size: 0.18rem;
                    color: #ffffff;
                    line-height: 0.18rem;
                    text-align: center;
                }
            }
        }
        .frame {
            .get-button {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 1.71rem;
                height: 0.73rem;
                padding-top: 0.05rem;
                background-repeat: no-repeat;
                background-size: contain;
                font-weight: 500;
                font-size: 0.22rem;
                color: #ffffff;
                text-align: center;
            }
            .get-button-yes {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 2rem;
                height: 0.6rem;
                padding: 0;
                margin-top: 0.15rem;
                font-weight: 500;
                font-size: 0.22rem;
            }
        }
    }

    // 奖励样式
    .award {
        position: relative;
        display: flex;
        justify-content: space-evenly;
        width: 6.98rem;
        height: 3.99rem;
        padding-top: 1.23rem;
        margin: 0.24rem auto 0;
        background-repeat: no-repeat;
        background-size: contain;

        .head {
            position: absolute;
            top: 0.59rem;
            left: 50%;
            transform: translateX(-50%);
            width: 2rem;
            height: 0.24rem;
            font-weight: 500;
            font-size: 0.24rem;
            color: #ffffff;
            line-height: 0.24rem;
            text-align: center;
            white-space: nowrap;
        }
        .gift {
            width: 1.47rem;
            font-weight: 600;
            color: #ffffff;

            .icon {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 1.47rem;
                height: 1.47rem;
                background-repeat: no-repeat;
                background-size: contain;

                img {
                    width: 1.1rem;
                    height: 1.1rem;
                }
            }

            .name {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                margin: 0.11rem 0 0.05rem;
                font-size: 0.22rem;
                line-height: 0.2rem;
                text-align: center;
            }

            .diamond {
                height: 0.33rem;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 0.24rem;

                img {
                    width: 0.22rem;
                    height: 0.19rem;
                }
            }
        }
    }

    .tab {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        width: 6.6rem;
        height: 0.93rem;
        margin: 0.3rem auto 0;
        div {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 3.14rem;
            height: 0.82rem;
            background-repeat: no-repeat;
            background-size: contain;
            font-weight: 500;
            font-size: 0.24rem;
            color: #ffffff;
        }
        .active {
            height: 0.93rem;
            color: #ffde8e;
            padding-top: 0.15rem;
        }
    }

    .secondary-tab {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        width: 5rem;
        height: 0.68rem;
        margin: 0.51rem auto 0;
        border-radius: 0.55rem;
        font-size: 0.2rem;
        color: #ffffff;

        .slide {
            position: absolute;
            top: 0.02rem;
            width: 2.48rem;
            height: 0.64rem;
            border-radius: 0.45rem;
            transition-duration: 0.2s;
        }

        .secondary-tabs {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 2.48rem;
            height: 0.64rem;
        }
    }

    //弹窗样式
    .select-show {
        display: flex;
        flex-wrap: wrap;
        align-content: space-between;
        justify-content: space-between;
        width: 7.5rem;
        padding: 1.05rem 0.19rem 0.18rem 0.2rem;
        border-radius: 0.14rem 0.14rem 0 0;

        .choose-lift {
            position: absolute;
            top: 0.3rem;
            left: 0.3rem;
            width: 0.28rem;
            height: 0.28rem;
            background-repeat: no-repeat;
            background-size: contain;
        }
        .choose-right {
            position: absolute;
            top: 0.33rem;
            right: 0.28rem;
            width: 0.31rem;
            height: 0.23rem;
            background-repeat: no-repeat;
            background-size: contain;
        }

        .head-title {
            position: absolute;
            top: 0.29rem;
            left: 50%;
            transform: translateX(-50%);
            height: 0.32rem;
            line-height: 0.32rem;
            font-size: 0.32rem;
        }
        .constellation {
            position: relative;
            width: 1.7rem;
            height: 1.9rem;
            transition-duration: 0.2s;
            img {
                width: 100%;
                height: 100%;
                border-radius: 0.08rem;
            }
            span {
                position: absolute;
                bottom: 0.06rem;
                left: 50%;
                height: 0.3rem;
                line-height: 0.3rem;
                transform: translateX(-50%);
                font-size: 0.26rem;
                white-space: nowrap;
            }
        }
        .constellation-border {
            border: 0.03rem solid #ffe457;
            border-radius: 0.08rem;
        }
    }

    .award-win {
        display: flex;
        justify-content: space-evenly;
        position: relative;
        width: 7.06rem;
        height: 5.72rem;
        padding-top: 1.77rem;
        margin: 3.97rem auto 0;
        background-repeat: no-repeat;
        background-size: contain;
        .header {
            display: flex;
            align-items: center;
            position: absolute;
            top: 1.02rem;
            left: 50%;
            transform: translateX(-50%);
            height: 0.5rem;
            line-height: 0.5rem;
            font-weight: 600;
            font-size: 0.36rem;
            color: #ffffff;
            white-space: nowrap;
            span {
                display: block;
                width: 0.7rem;
                height: 0.26rem;
                margin-right: 0.1rem;
                background-repeat: no-repeat;
                background-size: contain;
            }
            span:nth-child(1) {
                transform: rotate(180deg);
            }
            span:nth-child(2) {
                margin-left: 0.1rem;
                margin-right: auto;
            }
        }
        .award-list {
            width: 1.5rem;
            .icon {
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
                width: 1.5rem;
                height: 1.5rem;
                background: #610599;
                border-radius: 0.16rem;
                border: 0.02rem solid #f2ddff;
                .day {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: absolute;
                    top: 0;
                    right: 0;
                    min-width: 0.72rem;
                    height: 0.26rem;
                    background: #ee42ff;
                    border-radius: 0 0.13rem 0 0.13rem;
                    font-size: 0.18rem;
                    color: #ffffff;
                }
                img {
                    width: 1.2rem;
                    height: 1.2rem;
                }
            }
            .name {
                margin-top: 0.1rem;
                font-size: 0.22rem;
                line-height: 0.25rem;
                color: #fff;
                text-align: center;
            }
        }
        .button {
            display: flex;
            justify-content: center;
            position: absolute;
            bottom: 0.63rem;
            left: 50%;
            transform: translateX(-50%);
            width: 2rem;
            height: 0.83rem;
            padding-top: 0.15rem;
            background-repeat: no-repeat;
            background-size: contain;
            font-weight: 600;
            font-size: 0.32rem;
            color: #ffffff;
        }
    }
    .rule-page-close {
        width: 0.5rem;
        height: 0.5rem;
        margin: 0.3rem auto 0;
        background: url('https://yaame-static.yaame.io/admin/8669613454f4a034da716205f8ebff7b.png') no-repeat;
        background-size: contain;
    }
}
</style>
