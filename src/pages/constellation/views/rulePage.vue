<!--
 * @Author: Elk
 * @Date: 2024-08-28 18:34:48
 * @FilePath: /yaame-h5/src/pages/constellation/views/rule.vue
 * @Description: 
-->
<template>
    <div class="main">
        <CustomHeader
            color="white"
            :custom_back="true"
            @onCustomBack="back"
        >
            {{ $t('constellation_story') }}
        </CustomHeader>

        <!-- tab -->
        <div
            class="secondary-tab"
            :style="getStyle('secondary-tab')"
        >
            <div
                class="slide"
                :style="[
                    { left: group === 'one' ? '0' : group === 'two' ? '2rem' : '4rem' },
                    getStyle('slide'),
                ]"
            ></div>
            <div
                class="secondary-tabs"
                :style="group === item.type && getStyle('secondary-tab-in')"
                v-for="(item, index) in tab"
                :key="index"
                @click="cutGroup(item.type)"
            >
                {{ item.name }}
            </div>
        </div>

        <div
            v-show="group === 'one'"
            class="rule-container"
            :style="getStyle('rule-container')"
        >
            <div
                class="title-img"
                :style="backImg('title-img')"
            >
                {{ $t('constellation_activity_rules') }}
            </div>
            <p>{{ $t('constellation_activity_desc_1') }}</p>
            <p>{{ $t('constellation_activity_desc_2') }}</p>
            <p>{{ $t('constellation_activity_desc_3') }}</p>
            <p>{{ $t('constellation_activity_desc_4', { msg: constellationName, 0: time }) }}</p>
            <p>
                {{ $t('constellation_activity_desc_5') }}
            </p>
            <p>{{ $t('constellation_activity_desc_6') }}</p>
            <p>{{ $t('constellation_activity_desc_7') }}</p>
            <p>{{ $t('constellation_activity_desc_8') }}</p>
            <p>{{ $t('constellation_activity_desc_9') }}</p>
        </div>

        <div
            v-show="group === 'two'"
            class="reward-info"
        >
            {{ $t('top_10_rewards') }}
        </div>

        <div
            v-show="group === 'two'"
            v-for="(item, index) in anchorList"
            :key="index"
            class="reward-item-container"
            :style="backImg('reward-item-container')"
        >
            <div class="item-header">
                Rank {{ index === 3 ? '4~5' : index === 4 ? '6~10' : index + 1 }}
            </div>
            <div class="reward-item-list">
                <div
                    v-for="(ele, inx) in item.rank_rewards"
                    :key="inx"
                    class="reward-item-item"
                >
                    <div
                        class="img-div"
                        :style="getStyle('icon-style')"
                    >
                        <img
                            :src="ele.reward_icon"
                            alt=""
                        />
                        <div
                            v-if="ele.object_type !== 'DIAMOND'"
                            class="reward-text"
                            :style="getStyle('day-style')"
                        >
                            {{ ele.subscript }}
                        </div>
                    </div>
                    <div
                        v-if="ele.object_type !== 'DIAMOND'"
                        class="reward-name"
                    >
                        {{ ele.reward_name }}
                    </div>
                    <div
                        v-else
                        class="diamond"
                    >
                        <img
                            src="https://static.yaame.io/imgs/b2be9d366045439b87f8e08f9341af71.png"
                            alt=""
                        />{{ ele.reward_diamond_worth }}
                    </div>
                </div>
            </div>
        </div>

        <div
            v-show="group === 'three'"
            class="reward-info"
        >
            {{ $t('top_10_rewards') }}
        </div>

        <div
            v-show="group === 'three'"
            v-for="(item, index) in audienceList"
            :key="'audience' + index"
            class="reward-item-container"
            :style="backImg('reward-item-container')"
        >
            <div class="item-header">
                Rank {{ index === 3 ? '4~5' : index === 4 ? '6~10' : index + 1 }}
            </div>
            <div class="reward-item-list">
                <div
                    v-for="(ele, inx) in item.rank_rewards"
                    :key="inx"
                    class="reward-item-item"
                >
                    <div
                        class="img-div"
                        :style="getStyle('icon-style')"
                    >
                        <img
                            :style="{ height: ele.object_type === 'INCOME_RIBBON' ? 'auto' : '' }"
                            :src="ele.reward_icon"
                            alt=""
                        />
                        <div
                            v-if="ele.object_type !== 'DIAMOND'"
                            class="reward-text"
                            :style="getStyle('day-style')"
                        >
                            {{ ele.subscript }}
                        </div>
                    </div>
                    <div
                        v-if="ele.object_type !== 'DIAMOND'"
                        class="reward-name"
                    >
                        {{ ele.reward_name }}
                    </div>
                    <div
                        v-else
                        class="diamond"
                    >
                        <img
                            src="https://static.yaame.io/imgs/b2be9d366045439b87f8e08f9341af71.png"
                            alt=""
                        />{{ ele.reward_diamond_worth }}
                    </div>
                </div>
            </div>
        </div>

        <div
            v-show="group !== 'one'"
            class="rule-footer"
        >
            {{ $t('top_1_guardian_title') }}
        </div>
    </div>
</template>

<script setup>
import CustomHeader from '@/components/common/header.vue';
import { ref, onMounted, getCurrentInstance } from 'vue';
import { getRankReward } from '@/pages/constellation/api';

// 获取当前查看星座
const key = new URLSearchParams(window.location.search).get('type');

const root = getCurrentInstance();
const t = (val, msg) => {
    return root.proxy.$i18n.t(val, msg);
};
const anchorList = ref([]);
const audienceList = ref([]);

// 背景图片配置方法
const backImg = (key) => {
    return {
        backgroundImage: `url(${root.proxy.$list.rule[key]})`,
    };
};
// 获取样式
const getStyle = (key) => {
    return root.proxy.$list.rule[key];
};

// 返回img链接
const getSrcImg = (key) => {
    return root.proxy.$list.rule[key];
};

// tab
const group = ref('one');
const tab = ref([
    {
        name: t('rules'),
        type: 'one',
    },
    {
        name: t('ambassador_ranking'),
        type: 'two',
    },
    {
        name: t('guardian_ranking'),
        type: 'three',
    },
]);
const cutGroup = (value) => {
    group.value = value;
};

// 星座icon
const constellationList = ref([
    {
        type: 'CONSTELLATION0',
        icon: 'https://yaame-static.yaame.io/admin/25ab9c66fcdb012d0b89af37222f671e.png',
        name: t('virgo'), // 处女座
    },
    {
        type: 'CONSTELLATION1',
        icon: 'https://yaame-static.yaame.io/admin/ce9431d0d3daa4518fa7d89cfc727eaa.png',
        name: t('libra'), // 天秤座
    },
    {
        type: 'CONSTELLATION2',
        icon: 'https://yaame-static.yaame.io/admin/d87eb8b462c11ff55ca6235a37bbcd41.png',
        name: t('scorpio'), // 天蝎座
    },
    {
        type: 'CONSTELLATION3',
        icon: 'https://yaame-static.yaame.io/admin/ad59ae819aaa2dc5472031004d684092.png',
        name: t('sagittarius'), // 射手座
    },
    {
        type: 'CONSTELLATION4',
        icon: 'https://yaame-static.yaame.io/admin/6ed4b1f16eaeb7d14bf76cbb5e877e7c.png',
        name: t('capricorn'), // 魔羯座
    },
    {
        type: 'CONSTELLATION5',
        icon: 'https://yaame-static.yaame.io/admin/3ed3a486e26e28e87f4653f88ff4b504.png',
        name: t('aquarius'), // 水瓶座
    },
    {
        type: 'CONSTELLATION6',
        icon: 'https://yaame-static.yaame.io/admin/4e0b6fb172c053413ba8a9428f8ab8db.png',
        name: t('pisces'), // 双鱼座
    },
    {
        type: 'CONSTELLATION7',
        icon: 'https://yaame-static.yaame.io/admin/8e644d57c74d8ecd1042a29afca73b96.png',
        name: t('aries'), // 白羊座
    },
    {
        type: 'CONSTELLATION8',
        icon: 'https://yaame-static.yaame.io/admin/13e8a53a3f69b614b47e415b2c0602b3.png',
        name: t('taurus'), // 金牛座
    },
    {
        type: 'CONSTELLATION9',
        icon: 'https://yaame-static.yaame.io/admin/b7a963959059939e047b67d4692847b1.png',
        name: t('gemini'), // 双子座
    },
    {
        type: 'CONSTELLATION10',
        icon: 'https://yaame-static.yaame.io/admin/68124cfc209c0936a842db595e42a423.png',
        name: t('cancer'), // 巨蟹座
    },
    {
        type: 'CONSTELLATION11',
        icon: 'https://yaame-static.yaame.io/admin/25bac3444a36fa2cc8910dcc75abf120.png',
        name: t('leo'), // 狮子座
    },
]);

// 活动截止领取时间
const time = ref('');

const constellationName = ref('');
const getRank = async () => {
    const res = await getRankReward({
        cycleType: key,
        group_id: 2024,
    });
    if (res.status === 1000) {
        anchorList.value = res.data.rank_reward_anchor_levels;
        audienceList.value = res.data.rank_reward_audience_levels;
        time.value = res.data.reward_end_time;
        time.value =
            new Date(time.value).getFullYear() +
            '/' +
            (new Date(time.value).getUTCMonth() + 1) +
            '/' +
            new Date(time.value).getUTCDate();
        constellationName.value = constellationList.value.find(
            (item) => item.type === res.data.cycle_type,
        ).name;
    }
};

const back = () => {
    root.proxy.$router.go(-1);
};
onMounted(async () => {
    await getRank();
});
</script>

<style lang="less" scoped>
.main {
    padding-top: 1rem;
    padding-bottom: 0.4rem;

    .secondary-tab {
        position: relative;
        display: flex;
        margin: 1.14rem auto 0;
        width: 6rem;
        height: 0.68rem;
        font-weight: 500;
        font-size: 0.22rem;
        border-radius: 0.55rem;
        .slide {
            position: absolute;
            top: 0.02rem;
            width: 2rem;
            height: 0.64rem;
            border-radius: 0.45rem;
            transition-duration: 0.2s;
        }
        .secondary-tabs {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0 0.2rem;
            text-align: center;
            line-height: 0.28rem;
            flex: 1;
        }
    }

    .rule-container {
        width: 7rem;
        // height: 8.59rem;
        border-radius: 0.2rem;
        margin-top: 1.48rem;
        margin-left: 0.25rem;
        position: relative;
        padding: 0.65rem 0.4rem 0.32rem;
        font-weight: 400;
        font-size: 0.24rem;
        color: #ffffff;
        .title-img {
            width: 3.7rem;
            height: 1.38rem;
            background-size: contain;
            background-repeat: no-repeat;
            position: absolute;
            left: 1.65rem;
            top: -1.06rem;
            padding-top: 0.88rem;
            text-align: center;
            font-weight: 600;
            font-size: 0.32rem;
            color: #ffffff;
        }
    }
    .rule-header {
        text-align: center;
        .header-content {
            display: inline-block;
            font-weight: 500;
            font-size: 0.34rem;
            color: #ffffff;
            position: relative;
            text-align: center;
            &::before {
                content: '';
                display: block;
                width: 0.61rem;
                height: 0.12rem;
                background-size: contain;
                background-repeat: no-repeat;
                background-image: url(https://yaame-static.yaame.io/admin/cd55d7c947982752e3330b14db3c5b40.png);
                position: absolute;
                left: -0.88rem;
                top: 0.2rem;
            }
            &::after {
                content: '';
                display: block;
                width: 0.61rem;
                height: 0.12rem;
                background-size: contain;
                background-repeat: no-repeat;
                background-image: url(https://yaame-static.yaame.io/admin/cd55d7c947982752e3330b14db3c5b40.png);
                position: absolute;
                right: -0.88rem;
                top: 0.2rem;
                transform: rotate(180deg);
            }
        }
    }
    .reward-info {
        margin: 0;
        margin-top: 0.67rem;
        width: 7.5rem;
        text-align: center;
        font-weight: 400;
        font-size: 0.24rem;
        color: #ffffff;
        opacity: 0.9;
    }
    .reward-item-container {
        width: 6.88rem;
        height: 3.96rem;
        background-size: contain;
        background-repeat: no-repeat;
        margin-left: 0.31rem;
        padding-top: 0.84rem;
        .item-header {
            text-align: center;
            font-weight: 600;
            font-size: 0.32rem;
            color: #ffffff;
        }
        .reward-item-list {
            width: 6.96rem;
            height: 2rem;
            margin-top: 0.27rem;
            display: flex;
            justify-content: space-evenly;
            padding: 0 0.3rem;
            margin-top: 0.39rem;
            .reward-item-item {
                width: 1.3rem;
                height: 2rem;
                .img-div {
                    width: 1.3rem;
                    height: 1.3rem;
                    background: #610599;
                    border-radius: 0.16rem;
                    border: 0.02rem solid #f2ddff;
                    position: relative;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    img {
                        width: 1rem;
                        height: 1rem;
                    }
                    .reward-text {
                        position: absolute;
                        right: 0;
                        top: 0;
                        height: 0.26rem;
                        line-height: 0.26rem;
                        text-align: center;
                        min-width: 0.7rem;
                        padding: 0 0.1rem;
                        background: #ee42ff;
                        border-radius: 0 0.13rem 0 0.13rem;
                        font-weight: 400;
                        font-size: 0.16rem;
                        color: #ffffff;
                    }
                }
                .reward-name {
                    width: 1.5rem;
                    margin-left: -0.1rem;
                    font-size: 0.22rem;
                    color: #ffffff;
                    text-align: center;
                    margin-top: 0.1rem;
                    line-height: 1.1;
                }
                .diamond {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 0.22rem;
                    margin-top: 0.14rem;
                    line-height: 0.22rem;
                    font-size: 0.22rem;
                    color: #ffffff;
                    img {
                        width: 0.22rem;
                        height: 0.19rem;
                        margin-right: 0.03rem;
                    }
                }
            }
        }
    }
    .rule-footer {
        width: 7.5rem;
        font-weight: 400;
        font-size: 0.24rem;
        color: #ffffff;
        padding: 0 1.28rem;
        text-align: center;
        margin: 0.28rem 0;
    }
}
</style>
