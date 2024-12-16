<template>
    <div class="main">
        <!--奖励头部-->
        <div class="header"><span>{{ $t('fruitmachinetop3_reward') }}</span></div>
        <!--三个档位奖励-->
        <div class="award-top" v-for="(item, index) in awardList" :key="index" :style="{ backgroundImage: `url(${awardImg[index]})` }">
            <div class="award-header" :style="{ top: index === 0 ? '.46rem' : index === 1? '.4rem' : '.33rem' }">{{ index === 0 ? $t('firstplacereward') : index === 1 ? $t('secondplacereward') : $t('thirdplacereward') }}</div>
            <div class="award-fence" v-for="(value, number) in item.activity_rewards" :key="number">
                <div v-if="number !== 1" class="day">{{ value.valid_days }}</div>
                <div class="award-fence-img">
                    <img :src="value.reward_icon" alt="">
                </div>
                <div v-if="number !== 1">{{ value.reward_name }}</div>
                <div v-if="number === 1" class="diamonds">
                    <img src="https://yaame-static.yaame.io/admin/5a2a786415c4f187530764edd420f69c.png" alt="">
                    {{ value.valid_days }}
                </div>
            </div>
        </div>
        <!--奖励规则-->
        <div class="award-rule">
            <div class="award-rule-header">{{ $t('prize_rules') }}</div>
            <p :style="{ textAlign: locale === 'ar' ? 'right' : '' }">
                {{ $t('activity_period') }}<br>
                {{ $t('topthreerewards') }}<br>
                {{ $t('prize_delivery') }}<br>
                {{ $t('interpretation_rights') }}
            </p>
        </div>
    </div>
</template>

<script setup>
    import { getLanguage } from "../../../lib/device";
    import { onMounted, ref } from "vue";
    import { getFruitsAward } from "../../../lib/request/activity";

    // 获取国家
    let locale = ref(getLanguage() || "en");
    // top1-3背景图片
    const awardImg = ref([
    'https://yaame-static.yaame.io/admin/1991c248637c74a3b7d7febfe8eabd24.png',
    'https://yaame-static.yaame.io/admin/71bd37ba1d8e28ebae69bee1261f8ea4.png',
    'https://yaame-static.yaame.io/admin/ac048f54a601cc7bf034a81114a16be1.png',
])
    // 获取奖励数据
    const awardList = ref([]);
    const getAward = async () => {
        try {
            const res = await getFruitsAward();
            if (res.status !== 1000) return;
            awardList.value = res.data.reward_levels;
        } catch (err) {
            console.log(err);
        }
    }

onMounted(() => {
    getAward();
})
</script>

<style lang="less" scoped>
.main {
    min-height: 100vh;
    background: url("https://yaame-static.yaame.io/admin/3ce3b87379cc41242b1e6f1d88d82d78.png") no-repeat;
    background-size: contain;
    overflow: hidden;
    // 头部标题样式
    .header {
        position: relative;
        width: 5.83rem;
        height: 1.53rem;
        margin: .69rem auto 0;
        background: url("https://yaame-static.yaame.io/admin/938cbbd2de81b3196d1de453e3b52784.png") no-repeat;
        background-size: contain;
        font-size: .32rem;
        color: #FFFFFF;
        line-height: .48rem;
        span {
            position: absolute;
            width: 100%;
            top: .8rem;
            left: 50%;
            height: .32rem;
            line-height: .32rem;
            transform: translateX(-50%);
            text-align: center;
        }
    }

    // 三个档位样式
    .award-top {
        position: relative;
        display: flex;
        width: 7.22rem;
        height: 4.46rem;
        margin: 0 auto .34rem;
        padding-bottom: .4rem;
        align-items: flex-end;
        justify-content: space-evenly;
        background-repeat: no-repeat;
        background-size: contain;
        font-size: .24rem;
        color: #fff;
        .award-header {
            position: absolute;
            left: 50%;
            height: .44rem;
            line-height: .44rem;
            transform: translateX(-50%);
            font-size: .32rem;
        }
        .award-fence {
            display: flex;
            position: relative;
            flex-direction: column;
            align-items: center;
            .day {
                right: 0;
                position: absolute;
                width: .97rem;
                height: .35rem;
                line-height: .35rem;
                background: #D328FB;
                border-radius: 0 .15rem 0 .13rem;
                text-align: center;
            }
            .award-fence-img {
                display: flex;
                width: 2.04rem;
                height: 2.04rem;
                margin-bottom: .15rem;
                justify-content: center;
                align-items: center;
                background: #7D06D5;
                border-radius: .16rem;
                border: .01rem solid #E98CFF;
                img {
                    width: 1.61rem;
                }
            }
            .diamonds {
                display: flex;
                justify-content: center;
                align-items: center;
                img {
                    width: .26rem;
                    height: .22rem;
                }
            }
        }
    }

    // 奖励规则样式
    .award-rule {
        width: 7.22rem;
        height: 4.5rem;
        margin: 0 auto .67rem;
        background: url("https://yaame-static.yaame.io/admin/340017a0995027b5c76b3b6ca79e0fc8.png") no-repeat;
        background-size: contain;
        font-size: .26rem;
        color: #FFFFFF;
        overflow: hidden;
        .award-rule-header {
            height: .32rem;
            margin: .56rem auto 0;
            font-size: .32rem;
            text-align: center;
            line-height: .32rem;
        }
        p {
            width: 6.48rem;
            height: 2.76rem;
            margin: .5rem auto 0;
            overflow-x: auto;
        }
    }
}
</style>