<template>
    <div class="daily">
        <div class="daily-style"></div>
        <!--文案-->
        <p class="prompt-copy">{{ $t('auto_reward') }}</p>
        <!--倒计时-->
        <div class="daily-time">
            <span>{{ $t('today') }}</span>
            <div class="time">
                <div class="times">{{ hours < 10 ? '0' + hours : hours }}</div>:
                <div class="times">{{ minutes < 10 ? '0' + minutes : minutes }}</div>:
                <div class="times">{{ seconds < 10 ? '0' + seconds : seconds }}</div>
            </div>
        </div>
        <!--档位-->
        <div class="gears">
            <div class="bet">{{ $t('bet') }}:<img src="https://yaame-static.yaame.io/admin/4492982b4976bd984a52e2db65e7dcf8.png" alt="">{{ props.dailyData.bet }}</div>
            <div class="recharge">{{ $t('recharge') }}<img src="https://yaame-static.yaame.io/admin/4492982b4976bd984a52e2db65e7dcf8.png" alt="">{{ props.dailyData.recharge }}</div>
        </div>
        <!--档位奖励-->
        <div class="gears-award">
            <div class="award" :class="[ item.type === 2 ? 'award-grant' : item.type === 1 ? 'award-reach' : '' ]" v-for="(item, index) in props.dailyData.task_levels" :key="index">
                <img class="award-img" :src="item.daily_reward.reward_icon" alt="">
                <div class="get">{{ $t('get') }}<img src="https://yaame-static.yaame.io/admin/4492982b4976bd984a52e2db65e7dcf8.png" alt="">{{ item.daily_reward.reward_info }}</div>
                <div class="bet">{{ $t('bet') }}:<img src="https://yaame-static.yaame.io/admin/4492982b4976bd984a52e2db65e7dcf8.png" alt="">{{ item.daily_bet }}</div>
                <div class="recharge">{{ $t('recharge') }}<img src="https://yaame-static.yaame.io/admin/4492982b4976bd984a52e2db65e7dcf8.png" alt="">{{ item.daily_recharge }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref } from "vue";

    const props = defineProps(['timeEnd', 'dailyData']);

    // // 页面计时时间
    let days = ref(0);
    let hours = ref(0);
    let minutes = ref(0);
    let seconds = ref(0);
    const updateTime = () => {
        const now = new Date().getTime();
        const timeDifference = props.timeEnd - now;
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
    const clearTime = () => {
        if (timeOut) {
            clearTimeout(timeOut);
        }
    };

    // 打开定时器和清除
    defineExpose({
        openTime,
        clearTime,
    })

</script>

<style lang="less" scoped>
.daily {
    position: relative;
    width: 7.12rem;
    margin: 0 auto;
    overflow: hidden;

    .daily-style {
        position: absolute;
        width: 7.12rem;
        height: 100%;
        background: #2F02B9;
        box-shadow: inset 0 .02rem .04rem 0 rgba(255,255,255,0.7);
        border-radius: .2rem;
        opacity: 0.7;
        z-index: -1;
    }

    .prompt-copy {
        width: 6.24rem;
        margin: .44rem auto;
        color: #fff;
        font-size: .26rem;
    }

    .daily-time {
        display: flex;
        justify-content: center;
        align-items: center;
        height: .44rem;
        span {
            margin-right: .05rem;
            font-size: .3rem;
            color: #FFE491;
        }
        .time {
            display: flex;
            align-items: center;
            font-size: .24rem;
            color: #FFFFFF;
            font-weight: 600;
            .times {
                display: flex;
                justify-content: center;
                align-items: center;
                width: .44rem;
                height: .44rem;
                margin: 0 .05rem;
                font-weight: 100;
                background: url("https://yaame-static.yaame.io/admin/276143b2d0c7c5cdd00e91567d3982a6.png") no-repeat;
                background-size: contain;
            }
        }
    }

    .gears {
        display: flex;
        margin: .36rem 0 .4rem;
        justify-content: space-evenly;
        align-items: center;
        .bet,
        .recharge {
            display: flex;
            width: 3.2rem;
            height: .74rem;
            justify-content: center;
            align-items: center;
            font-size: .24rem;
            color: #FFFFFF;
            background: #1F007C;
            border-radius: .39rem;
            img {
                width: .26rem;
                height: .24rem;
            }
        }
    }

    .gears-award {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        .award {
            position: relative;
            width: 3.2rem;
            height: 3.2rem;
            margin-bottom: .2rem;
            background-image: url("https://yaame-static.yaame.io/admin/09246c4e819a25282de526fed31545dc.png");
            background-repeat: no-repeat;
            background-size: contain;
            .award-img {
                position: absolute;
                top: .12rem;
                left: 50%;
                width: 1.8rem;
                transform: translateX(-50%);
            }
            .get {
                position: absolute;
                top: 1.81rem;
                left: 50%;
                display: flex;
                height: .28rem;
                line-height: .28rem;
                justify-content: center;
                align-items: center;
                transform: translateX(-50%);
                font-size: .28rem;
                color: #2B049D;
                white-space: nowrap;
                img {
                    width: .3rem;
                    height: .28rem;
                }
            }
            .bet,
            .recharge {
                position: absolute;
                bottom: .54rem;
                left: 50%;
                display: flex;
                height: .24rem;
                justify-content: center;
                align-items: center;
                transform: translateX(-50%);
                line-height: .24rem;
                font-size: .24rem;
                color: #FFFFFF;
                white-space: nowrap;
                img {
                    width: .24rem;
                    height: .26rem;
                }
            }
            .recharge {
                bottom: .2rem;
            }
        }
        .award-reach {
            background-image: url("https://yaame-static.yaame.io/admin/924fcc3509a98fbd87e6fcffbc4baf5f.png");
        }
        .award-grant {
            background-image: url("https://yaame-static.yaame.io/admin/2d0c4e426ef40f55b6faa9e8373fa78f.png");
        }
    }
}
</style>