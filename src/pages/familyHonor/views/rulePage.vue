<template>
    <div class="rule">
        <!-- 返回头 -->
        <CustomHeader color="white">
            {{ $t('rule') }}
        </CustomHeader>

        <!-- 规则tab -->
        <div class="secondary-tab">
            <div
                class="tab"
                v-for="item in ruleTab"
                :key="item.type"
                :class="{ active: currentTab === item.type }"
                @click="changeTab(item.type)"
            >
                {{ item.name }}
            </div>
        </div>

        <!-- 规则 -->
        <div
            v-if="currentTab === 0"
            class="rule-content"
        >
            <div class="head"></div>
            <div class="rule-item">
                <p>{{ $t('rule_1') }}</p>
                <p>{{ $t('rule_2') }}</p>
                <p>{{ $t('rule_3') }}</p>
                <div class="table">
                    <div
                        v-for="(item, index) in ruleTableData"
                        :key="index"
                        class="across"
                    >
                        <div
                            v-for="(item2, index2) in item"
                            :key="index2"
                        >
                            {{ item2 }}
                        </div>
                    </div>
                </div>
                <p>{{ $t('rule_4') }}</p>
                <p>{{ $t('rule_5') }}</p>
                <p>{{ $t('rule_6') }}</p>
                <p>{{ $t('rule_7') }}</p>
            </div>
        </div>

        <!-- 入围奖励 -->
        <div
            v-if="currentTab === 1"
            class="rule-content"
        >
            <div class="head"></div>
            <div class="rule-item">
                <p>
                    {{
                        $t('preliminary_top_rewards', {
                            xx: currentRegion === 'INDONESIA' ? 32 : 16,
                        })
                    }}
                </p>
                <!-- 表格 -->
                <div class="table">
                    <div
                        v-for="(item, index) in preliminaryRewards"
                        :key="index"
                        class="across across-img"
                    >
                        <div
                            v-for="(item2, index2) in item"
                            :key="index2"
                        >
                            <img
                                v-if="index > 0 && index2 === 1"
                                src="https://yaame-static.yaame.io/admin/09a4ec4c65c0e9613122d33eb2ffae2c.png"
                                alt=""
                            />
                            {{ item2 }}
                        </div>
                    </div>
                </div>
                <p style="margin-bottom: 0.23rem">
                    {{
                        $t('preliminary_contributor_rewards', {
                            xx: currentRegion === 'INDONESIA' ? 32 : 16,
                        })
                    }}
                </p>
                <!-- 奖励 -->
                <div class="reward">
                    <div
                        v-for="(item, index) in currentGifts[0]"
                        :key="index"
                        class="reward-item"
                    >
                        <div class="icon">
                            <img
                                :src="item.icon"
                                alt=""
                            />
                            <div
                                v-if="item.amount"
                                class="day"
                            >
                                {{ item.amount }}{{ $t('day') }}
                            </div>
                        </div>
                        <div class="name">{{ item.name }}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 晋级奖励 -->
        <div
            v-if="currentTab === 2"
            class="rule-content"
        >
            <div class="head"></div>
            <div class="rule-item">
                <p>
                    {{
                        $t('advancement_top_rewards', {
                            xx: currentRegion === 'INDONESIA' ? 16 : 8,
                        })
                    }}
                </p>
                <!-- 表格 -->
                <div class="table">
                    <div
                        v-for="(item, index) in advancementRewards"
                        :key="index"
                        class="across across-img"
                    >
                        <div
                            v-for="(item2, index2) in item"
                            :key="index2"
                        >
                            <img
                                v-if="index > 0 && index2 === 1"
                                src="https://yaame-static.yaame.io/admin/09a4ec4c65c0e9613122d33eb2ffae2c.png"
                                alt=""
                            />
                            {{ item2 }}
                        </div>
                    </div>
                </div>
                <p style="margin-bottom: 0.23rem">
                    {{
                        $t('advancement_contributor_rewards', {
                            xx: currentRegion === 'INDONESIA' ? 16 : 8,
                        })
                    }}
                </p>
                <!-- 奖励 -->
                <div class="reward">
                    <div
                        v-for="(item, index) in currentGifts[1]"
                        :key="index"
                        class="reward-item"
                    >
                        <div class="icon">
                            <img
                                :src="item.icon"
                                alt=""
                            />
                            <div
                                v-if="item.amount"
                                class="day"
                            >
                                {{ item.amount }}{{ $t('day') }}
                            </div>
                        </div>
                        <div class="name">{{ item.name }}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 决赛奖励 -->
        <div v-if="currentTab === 3">
            <div class="txt">
                {{ $t('strongest_family_rewards') }}
            </div>
            <!-- 冠亚季军表格 -->
            <div
                v-for="(item, index) in finalRewards"
                :key="item.title"
                class="rule-content"
                :class="{ 'rule-content-top': index > 0 }"
            >
                <div class="head"></div>
                <div class="head-img">{{ item.title }}</div>
                <div class="rule-item final">
                    <!-- 表格 -->
                    <div class="table table-one">
                        <div
                            v-for="(item2, index2) in item.table"
                            :key="index2"
                            class="across"
                        >
                            <div
                                v-for="(item3, index3) in item2"
                                :key="index3"
                            >
                                <img
                                    v-if="index2 > 0 && index3 === 1"
                                    src="https://yaame-static.yaame.io/admin/7d0bfb20e7192e244803b58daf129a58.png"
                                    alt=""
                                />
                                {{ item3 }}
                            </div>
                        </div>
                    </div>
                    <!-- 文案 -->
                    <p>{{ $t('honor_threshold', { xx: item.value, x: index + 1 }) }}</p>
                    <!-- 奖励 -->
                    <div class="reward">
                        <div
                            v-for="(item1, index1) in item.rewards"
                            :key="index1"
                            class="reward-item"
                        >
                            <div class="icon">
                                <img
                                    :src="item1.icon"
                                    alt=""
                                />
                                <div
                                    v-if="item1.amount"
                                    class="day"
                                >
                                    {{ index1 === 2 ? $t('permanent') : item1.amount + $t('day') }}
                                </div>
                            </div>
                            <div class="name">{{ item1.name }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="txt">{{ $t('participation_rewards') }}</div>

            <!-- 最强家族奖励 -->
            <div
                v-for="(item, index) in strongestRewards"
                :key="index"
                class="rule-content top-three"
            >
                <div class="head"></div>
                <div class="head-img">{{ item.title }}</div>
                <div
                    class="item"
                    v-for="(item1, index1) in item.rewards"
                    :key="index1"
                >
                    <div class="icon">
                        <img
                            :src="item1.icon"
                            alt=""
                        />
                        <div
                            v-if="item1.amount"
                            class="day"
                        >
                            {{ item1.amount }}{{ $t('day') }}
                        </div>
                    </div>
                    <div class="name">{{ item1.name }}</div>
                </div>
            </div>

            <!-- mvp -->
            <div
                class="rule-content"
                style="margin: 0.74rem auto 0.27rem"
            >
                <div class="head"></div>
                <div class="head-img">{{ $t('best_mvp_award') }}</div>
                <div
                    class="rule-item"
                    style="padding: 0.67rem 0.24rem 0"
                >
                    <p>{{ $t('mvp_award_description') }}</p>
                    <div class="table">
                        <div
                            v-for="(item, index) in mvpRewards"
                            :key="index"
                            class="across last"
                        >
                            <div
                                v-for="(item2, index2) in item"
                                :key="index2"
                            >
                                <img
                                    v-if="index > 0 && index2 === 1"
                                    src="https://yaame-static.yaame.io/admin/7d0bfb20e7192e244803b58daf129a58.png"
                                    alt=""
                                />
                                <img
                                    v-if="index > 0 && index2 === 2"
                                    src="https://yaame-static.yaame.io/admin/af38739fcbb86f4ad29bdf658ebc5db2.png"
                                    alt=""
                                />
                                <img
                                    v-if="index > 0 && index2 === 3"
                                    src="https://yaame-static.yaame.io/admin/a1ec725745e0af1a9415f9a1795481c8.png"
                                    alt=""
                                />
                                <img
                                    v-if="index > 0 && index2 === 4"
                                    src="https://yaame-static.yaame.io/admin/c95ff858963e748ec771f9c29e61b811.png"
                                    alt=""
                                />
                                {{ item2 }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue';
import CustomHeader from '@/components/common/header.vue';

// 获取实例
const root = getCurrentInstance();
// 多语言
const t = (key) => {
    return root.proxy.$t(key);
};

// 获取当前奖励信息
const currentGifts = ref(JSON.parse(window.localStorage.getItem('rewards')));

// 获取当前大区
const currentRegion = ref(root.proxy.$route.query.region);

// tab选项
const ruleTab = ref([
    {
        name: t('rule'),
        type: 0,
    },
    {
        name: t('preliminary_rewards'),
        type: 1,
    },
    {
        name: t('advancement_rewards'),
        type: 2,
    },
    {
        name: t('final_rewards'),
        type: 3,
    },
]);
// 当前tab
const currentTab = ref(0);
// 切换tab
const changeTab = (index) => {
    currentTab.value = index;
};
// 规则表格数据
const ruleTableData = ref([
    [t('stage'), t('rules'), t('time')],
    [t('preliminary_round'), currentRegion.value === 'INDONESIA' ? `N ${t('enter')} 32` : `N ${t('enter')} 16`, '12/12 00:00 -12/14 23:59'],
    [t('advancement_round'), currentRegion.value === 'INDONESIA' ? `32 ${t('enter')} 16` : `16 ${t('enter')} 8`, '12/15 00:00 -12/17 23:59'],
    [t('final_round'), currentRegion.value === 'INDONESIA' ? `16 ${t('enter')} 3` : `8 ${t('enter')} 3`, '12/18 00:00 -12/19 23:59'],
]);

// 入围赛奖励
const preliminaryRewards = ref([
    [t('rank'), t('reward')],
    [currentRegion.value === 'INDONESIA' ? 'TOP 1-32' : 'TOP 1-16', t('advancement_ticket')],
]);

// 晋级赛奖励
const advancementRewards = ref([
    [t('rank'), t('reward')],
    [currentRegion.value === 'INDONESIA' ? 'TOP 1-16' : 'TOP 1-8', t('final_ticket')],
]);

// 决赛奖励
const finalRewards = ref([
    {
        table: [
            [t('rank'), t('reward')],
            ['TOP 1', '10000'],
            ['TOP 2', '8000'],
            ['TOP 3', '5000'],
            ['TOP 4-5', '3000'],
            [t('family_leader'), '8000'],
        ],
        value: 1000000,
        title: t('champion'),
        rewards: currentGifts.value[2],
    },
    {
        table: [
            [t('rank'), t('reward')],
            ['TOP 1', '8000'],
            ['TOP 2', '5000'],
            ['TOP 3', '3000'],
            ['TOP 4-5', '2000'],
            [t('family_leader'), '5000'],
        ],
        value: 800000,
        title: t('runner_up'),
        rewards: currentGifts.value[3],
    },
    {
        table: [
            [t('rank'), t('reward')],
            ['TOP 1', '5000'],
            ['TOP 2', '3000'],
            ['TOP 3', '2000'],
            ['TOP 4-5', '1000'],
            [t('family_leader'), '3000'],
        ],
        value: 500000,
        title: t('second_runner_up'),
        rewards: currentGifts.value[4],
    },
]);

// 活动最强前三奖励
const strongestRewards = ref([
    {
        title: t('champion'),
        rewards: currentGifts.value[5],
    },
    {
        title: t('runner_up'),
        rewards: currentGifts.value[6],
    },
    {
        title: t('second_runner_up'),
        rewards: currentGifts.value[7],
    },
]);

// mvp奖励
const mvpRewards = ref([
    [t('rank'), t('diamond'), t('avatar_frame'), t('entrance_effect'), t('badge')],
    ['TOP 1', '10000', '30' + t('day'), '30' + t('day'), '30' + t('day')],
    ['TOP 2', '8000', '15' + t('day'), '15' + t('day'), '30' + t('day')],
    ['TOP 3', '5000', '10' + t('day'), '10' + t('day'), '30' + t('day')],
    ['TOP 4-5', '3000', '7' + t('day'), '7' + t('day'), '30' + t('day')],
    ['TOP 6-10', '1000', '3' + t('day'), '3' + t('day'), '30' + t('day')],
]);
</script>

<style lang="less" scoped>
.rule {
    min-height: 100vh;
    overflow: hidden;

    .secondary-tab {
        display: flex;
        width: 6.64rem;
        height: 0.68rem;
        margin: 1.8rem auto 0;
        background: #e29f4a;
        border-radius: 0.55rem;

        .tab {
            display: flex;
            align-items: center;
            justify-content: center;
            flex: 1;
            padding: 0 0.09rem;
            font-weight: 500;
            font-size: 0.19rem;
            line-height: 0.24rem;
            color: #934a00;
            border-radius: 0.45rem;
            transition-duration: 0.3s;
            text-align: center;
        }

        .active {
            background: linear-gradient(0deg, #e78904 0%, #ffda77 100%);
        }
    }

    .rule-content {
        position: relative;
        width: 7.1rem;
        margin: 0.74rem auto 0;
        background: #fbbf5f;
        border-radius: 0.08rem;
        border: 0.08rem solid #ffe569;
        .head {
            position: absolute;
            top: -0.3rem;
            left: 50%;
            transform: translateX(-50%);
            width: 7.1rem;
            height: 0.77rem;
            background-image: url(https://yaame-static.yaame.io/admin/462f5f85ec59adf782afdff748a74918.png);
            background-repeat: no-repeat;
            background-size: contain;
        }

        .head-img {
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: -0.69rem;
            left: 50%;
            transform: translateX(-50%);
            width: 3.8rem;
            height: 1.17rem;
            line-height: 0.24rem;
            padding: 0.3rem 0.6rem 0;
            background-image: url(https://yaame-static.yaame.io/admin/56efb2d356fd25506d462cdf03712463.png);
            background-repeat: no-repeat;
            background-size: contain;
            font-weight: 600;
            font-size: 0.28rem;
            color: #fff3df;
            text-align: center;
        }

        .rule-item {
            width: 100%;
            padding: 0.53rem 0.24rem;
            font-weight: 400;
            font-size: 0.28rem;
            color: #aa4201;
        }

        .final {
            padding: 0.83rem 0.24rem 0.3rem;
        }
    }

    .top-three {
        display: flex;
        justify-content: space-evenly;
        min-height: 3.36rem;
        padding-top: 0.7rem;
        padding-bottom: 0.1rem;

        .item {
            width: 1.88rem;

            .icon {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 1.88rem;
                height: 1.88rem;
                background: #f09f1e;
                border-radius: 0.15rem;
                border: 0.02rem solid #fbe391;

                img {
                    width: 1.5rem;
                    height: 1.5rem;
                }
                .day {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: absolute;
                    top: 0;
                    right: 0;
                    height: 0.32rem;
                    line-height: 0.32rem;
                    padding: 0 0.12rem;
                    background: #709bf7;
                    border-radius: 0 0.14rem 0 0.12rem;
                    font-weight: 400;
                    font-size: 0.23rem;
                    color: #ffffff;
                }
            }
            .name {
                margin-top: 0.06rem;
                font-weight: 600;
                font-size: 0.23rem;
                color: #ffffff;
                line-height: 0.23rem;
                text-align: center;
            }
        }
    }

    .rule-content-top {
        margin-top: 0.83rem;
    }

    // 决赛奖励开始
    .txt {
        width: 6.24rem;
        margin: 0.5rem auto 0.94rem;
        font-weight: 400;
        font-size: 0.28rem;
        color: #aa4201;
        line-height: 0.4rem;
    }
    // 决赛奖励结束

    // 表格样式
    .table {
        position: relative;
        right: 0.08rem;
        width: 6.62rem;
        margin: 0.28rem auto;
        background: #fab13d;
        border-radius: 0.04rem;
        border: 0.02rem solid #ffd28b;

        .across {
            display: flex;
            border-bottom: 0.02rem solid #ffd28b;
            font-weight: 400;
            font-size: 0.24rem;
            color: #934a00;
            div {
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 0.6rem;
                flex: 1;
                text-align: center;
                border-right: 0.02rem solid #ffd28b;
            }
            div:last-child {
                flex: 2;
                border-right: none;
            }
        }

        .across-img {
            img {
                width: 0.44rem;
                height: 0.60rem;
            }
        }

        .last {
            img {
                width: 0.4rem;
                height: 0.4rem;
            }
            div:nth-child(2) {
                img:nth-child(1) {
                    width: 0.24rem;
                    height: 0.19rem;
                }
            }
            div:last-child {
                flex: 1;
                border-right: none;
            }
        }

        .across:nth-child(1) {
            font-weight: 600;
            font-size: 0.24rem;
            color: #934a00;
        }
        .across:last-child {
            border-bottom: none;
        }
    }
    .table-one {
        margin-top: 0;

        img {
            width: 0.24rem;
            height: 0.19rem;
        }
    }

    // 奖励样式
    .reward {
        display: flex;
        align-items: flex-start;
        justify-content: space-evenly;
        width: 6.46rem;
        min-height: 3.1rem;
        padding: 0.37rem 0;
        background-image: url(https://yaame-static.yaame.io/admin/ae205e68b15f9afae82412e4d135837d.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;

        .reward-item {
            width: 1.88rem;

            .icon {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 1.88rem;
                height: 1.88rem;
                background: #f09f1e;
                border-radius: 0.15rem;
                border: 0.02rem solid #fbe391;

                img {
                    width: 1.5rem;
                    height: 1.5rem;
                }
                .day {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: absolute;
                    top: 0;
                    right: 0;
                    height: 0.32rem;
                    line-height: 0.32rem;
                    padding: 0 0.12rem;
                    background: #709bf7;
                    border-radius: 0 0.14rem 0 0.12rem;
                    font-weight: 400;
                    font-size: 0.23rem;
                    color: #ffffff;
                }
            }
            .name {
                margin-top: 0.06rem;
                font-weight: 600;
                font-size: 0.23rem;
                color: #ffffff;
                line-height: 0.23rem;
                text-align: center;
            }
        }
    }
}
</style>
