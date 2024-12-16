<!-- 规则 -->
<template>
    <div class="rules">
        <!--返回栏-->
        <custom-header color="white" :custom_back="true" @onCustomBack="back">{{ $t('rule') }}</custom-header>

        <!--礼物展示-->
        <div class="gifts">
            <div class="head">{{ $t('event_gift') }}</div>
            <div class="award" v-for="(item, index) in award" :key="index">
                <div class="icon">
                    <img :src="item.icon" alt="">
                </div>
                <div class="name">{{ item.item_name }}</div>
                <div class="number">
                    <img src="https://yaame-static.yaame.io/admin/a1767e481fe00de56ee866a8af0dde18.png" alt="">
                    {{ item.price }}
                </div>
            </div>
        </div>

        <!-- 具体规则 -->
        <div class="rule">
            <div class="head">{{ $t('rule') }}</div>
            <p>
                {{ $t('event_rule_1') }}<br /><br />
                {{ $t('event_rule_2') }}<br /><br />
                {{ $t('event_rule_3') }}<br /><br />
                {{ $t('event_rule_4') }}<br /><br />
                {{ $t('event_rule_5') }}<br /><br />
                {{ $t('event_rule_6') }}<br /><br />
                {{ $t('event_rule_7') }}
            </p>
        </div>

        <!-- 奖励 -->
        <div class="award-rule">
            <div class="head">{{ $t('rewards') }}</div>
            <p style="margin-top: .7rem">{{ $t('daily_ranking_pool_rewards') }}</p>
            <!-- 表格展示 -->
            <div class="list"></div>
            <p>{{ $t('daily_top_30_rewards') }}</p>
            <div class="award-rule-list">
                <div class="icon-list" v-for="(item, index) in rankAward" :key="index">
                    <div class="icon">
                        <div class="day">{{ item.valid_days }}</div>
                        <img :src="item.icon" alt="">
                    </div>
                    <div class="name">{{ item.item_name }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
    import customHeader from "@/components/common/header";
    import { onBeforeUnmount, ref } from "vue";

    // 页面数据
    const props = defineProps({
        reward: {
            type: Object,
            default: () => ({}),
        },
        ruleStatus: {
            type: Function,
            default: () => () => {}
        }
    });
    // 礼物数据
    const award = ref(props.reward.send_gifts);
    // 获取当前大区
    const region = ref(props.reward.region);
    // 三个奖励礼物
    const rankAward = ref(props.reward.rank_reward);
    // 关闭规则
    const back = () => {
        props.ruleStatus();
    };
    // 添加一个新的历史状态
    history.pushState({ page: 1 }, "title 1", "?page=1");
    // 监听历史记录回退 执行关闭规则页
    window.addEventListener("popstate", () => {
        props.ruleStatus();
    });
    // 卸载组件删除监听
    onBeforeUnmount(() => {
        window.removeEventListener("popstate", () => {});
    })
</script>
<style scoped lang="less">
.rules {
    padding-top: 1rem;
    padding-bottom: .62rem;
    .gifts {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        justify-content: space-between;
        width: 7.17rem;
        height: 7.86rem;
        margin: 0 auto;
        padding: 1.86rem .6rem 0;
        background: url("https://yaame-static.yaame.io/admin/d7aedef16ddfd07575713eab9749ed90.png") no-repeat;
        background-size: contain;
        .head {
            position: absolute;
            top: 1rem;
            left: 50%;
            transform: translateX(-50%);
            height: .34rem;
            font-weight: 600;
            font-size: .34rem;
            color: #770402;
            line-height: .34rem;
        }
        .award {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 1.58rem;
            margin-bottom: .28rem;
            .icon {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 1.58rem;
                height: 1.58rem;
                background:  url("https://yaame-static.yaame.io/admin/7b053e79b1e8de16d8291cab6e4142a9.png") no-repeat;
                background-size: contain;
                img {
                    width: 1.38rem;
                    height: 1.38rem;
                }
            }
            .name {
                width: 1.25rem;
                margin: .08rem 0;
                font-weight: 400;
                font-size: .2rem;
                color: #770402;
                line-height: .18rem;
                text-align: center;
            }
            .number {
                display: flex;
                justify-content: center;
                align-items: center;
                font-weight: 600;
                font-size: .22rem;
                color: #770402;
                img {
                    width: .22rem;
                    height: .19rem;
                }
            }
        }
    }
    .rule {
        position: relative;
        width: 7.1rem;
        min-height: 11.76rem;
        margin: 1.47rem auto .2rem;
        padding: 1rem 0;
        background: #FF9314;
        border-radius: .08rem;
        border: .04rem solid #FFE062;
        .head {
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: -1.35rem;
            left: 50%;
            transform: translateX(-50%);
            width: 7.12rem;
            height: 2.21rem;
            padding-top: .45rem;
            background: url("https://yaame-static.yaame.io/admin/e764e34d45bf06b4ebfaa63016492951.png") no-repeat;
            background-size: contain;
            font-weight: 600;
            font-size: .34rem;
            color: #770402;
        }
        p {
            width: 6.49rem;
            margin: 0 auto;
            font-weight: 400;
            font-size: .28rem;
            color: #770402;
        }
    }

    .award-rule {
        position: relative;
        width: 7.1rem;
        left: 50%;
        transform: translateX(-50%);
        margin: 1.56rem auto 0;
        padding-bottom: .46rem;
        min-height: 11.76rem;
        background: #FF9314;
        box-shadow: inset .04rem 0 .08rem 0 #FFEF6D, inset -0.04rem 0 .08rem 0 #FFEF6D;
        border-radius: .08rem;
        font-size: .28rem;
        color: #770402;
        display: inline-block;

        .head {
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            top: -1.28rem;
            width: 7.12rem;
            height: 1.74rem;
            padding-top: .6rem;
            background: url("https://yaame-static.yaame.io/admin/47d3b6fee361e6b7cafd9e2a63352467.png") no-repeat;
            background-size: contain;
            font-weight: 600;
            font-size: .34rem;
            color: #770402;
        }
        p {
            padding: 0 .3rem;
        }
        .list {
            display: flex;
            flex-direction: column;
            width: 4rem;
            height: 4rem;
            margin: .5rem auto;
            background: url("https://yaame-static.yaame.io/admin/bd9e5787be5bc2a78a26a1fe6fdfdfa4.png") no-repeat;
            background-size: contain;
            border-radius: .08rem;
        }

        &-list {
            display: flex;
            justify-content: space-around;
            align-items: center;
            width: 6.48rem;
            height: 3.1rem;
            margin: .27rem auto 0;
            background: url("https://yaame-static.yaame.io/admin/d02995e41ef463f3884ffde8e33c5622.png") no-repeat;
            background-size: contain;
            .icon-list {
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 1.88rem;
                .icon {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: relative;
                    width: 1.88rem;
                    height: 1.88rem;
                    background: #FFC071;
                    border-radius: .15rem;
                    border: .01rem solid #FBE391;
                    .day {
                        position: absolute;
                        top: 0;
                        right: 0;
                        min-width: .89rem;
                        height: .32rem;
                        line-height: .32rem;
                        padding: 0 .1rem;
                        background: #C570F7;
                        border-radius: 0 .14rem 0 .12rem;
                        font-size: .23rem;
                        color: #FFFFFF;
                        text-align: center;
                    }
                    img {
                        width: 1.6rem;
                        height: 1.6rem;
                    }
                }
                .name {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-top: .06rem;
                    font-weight: 600;
                    font-size: .23rem;
                    color: #FFFFFF;
                    line-height: .23rem;
                    text-align: center;
                }
            }
        }
    }
}
</style>
