<template>
    <div class="ranking">
        <!--奖励规则-->
        <div :class="['reward-gear', `reward-gear${index}`]" v-for="(item, index) in awardData" :key="index" :style="{ backgroundImage: `url(${Img[index]})` }">
            <div :class="['award-header', `award-header${index}`]">TOP{{ index !== 3 ? index + 1 : '4~10'}}</div>
            <div class="award" v-for="(ite, inx) in item.rank_rewards" :key="inx + 3" @click="inx === 0 ? openShow() : ''">
                <img :src="ite.reward_icon" alt="">
                <div class="award-name">{{ ite.reward_info }}</div>
            </div>
        </div>
        <div class="ranking-show">
            <!--前三名样式-->
            <div v-for="(item, index) in 3" :key="index + 3" class="ranking-top-three" :class="`ranking-top${index}`">
                <img class="user-img" :src="rankingThree.length >= item ? rankingThree[index].avatar : 'https://yaame-static.yaame.io/admin/0524f6ce1917d98778d8905da0416b8b.png'" alt="">
                <!--展示框-->
                <img class="ranking-frame" :src="three[index]" alt="">
                <div class="top">TOP{{ index + 1 }}</div>
                <div class="nickname">{{ rankingThree.length >= item ? rankingThree[index].nick_name : ''}}</div>
                <div class="diamond">
                    <img src="https://yaame-static.yaame.io/admin/f2c73b0733ac4b1da23cc685e71fd223.png" alt="">
                    {{ rankingThree.length >= item ? rankingThree[index].score : 0 }}
                </div>
            </div>
            <!--剩下样式-->
            <div class="ranking-last">
                <div class="last" v-for="(item, index) in 7" :key="index + 7">
                    <div class="top">{{ item + 3 }}</div>
                    <div class="last-img">
                        <div class="img" :style="{ backgroundImage: `url(${rankingLast.length >= item ? rankingLast[index].avatar : 'https://yaame-static.yaame.io/admin/0524f6ce1917d98778d8905da0416b8b.png'})` }">
                            <img src="https://yaame-static.yaame.io/admin/bb16b974fd1a2f747acafefc9a15f504.png" alt="">
                        </div>
                        <div class="txt">
                            <div class="name">{{ rankingLast.length >= item ? rankingLast[index].nick_name : '' }}</div>
                        </div>
                    </div>
                    <div class="diamond">
                        <img src="https://yaame-static.yaame.io/admin/f2c73b0733ac4b1da23cc685e71fd223.png" alt="">
                        {{ rankingLast.length >= item ? rankingLast[index].score : 0 }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { onMounted, ref } from "vue";
    import { getRankDataApi } from "../api";

    // 奖励档位图片
    const Img = ref([
        'https://yaame-static.yaame.io/admin/1fc2fedee46d312619384f499640a7d7.png',
        'https://yaame-static.yaame.io/admin/b5ae66c42b24b8904f92a1830307680c.png',
        'https://yaame-static.yaame.io/admin/e13f5f629ac10477257d18e5905fe49f.png',
        'https://yaame-static.yaame.io/admin/41ef3314b07cbfa31ba9a6f85345cd35.png',
    ])
    // 前三排名图片
    const three = ref([
        'https://yaame-static.yaame.io/admin/d01eb1c5a8e8d2f04ab459062bc03efd.png',
        'https://yaame-static.yaame.io/admin/845765ab9a983b39cb90489fe955f3ea.png',
        'https://yaame-static.yaame.io/admin/596fe65ff121ccaa91f0a06fa1c51cf1.png'
    ])
    // 排名前三的数据
    const rankingThree = ref([]);
    // 剩下排名数据
    const rankingLast = ref([]);
    // 页面奖励数据
    const awardData = ref([]);
    // 获取父组件打开弹窗方法
    const props = defineProps(['openTicket']);

    // 处理排名数据
    const processRanking = (data) => {
        rankingThree.value = data.splice(0,3);
        rankingLast.value = data;
        if (rankingLast.value.length > 7) rankingLast.value = data.splice(0, 7);
    }
    // 获取排行榜奖励数据
    const getRankData = async () => {
        try {
            const res = await getRankDataApi();
            if (res.status !== 1000) return;
            awardData.value = res.data.reward_levels;
            processRanking(res.data.slots_luck_rank);
        } catch (err) {
            console.log(err);
        }
    }
    defineExpose({
        getRankData
    });
    // 打开奖券弹窗
    const openShow = () => {
        props.openTicket();
    }
    onMounted(() => {
        getRankData();
    })
</script>

<style lang="less" scoped>
.ranking {
    position: absolute;
    top: 7.31rem;
    left: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    transform: translateX(-50%);
    padding-bottom: 1.75rem;
    .reward-gear {
        position: relative;
        display: flex;
        width: 7.11rem;
        margin-top: .18rem;
        align-items: center;
        justify-content: space-evenly;
        background-repeat: no-repeat;
        background-size: contain;
        .award {
            position: relative;
            display: flex;
            width: 1.4rem;
            height: 1.52rem;
            justify-content: center;
            align-items: center;
            background: url("https://yaame-static.yaame.io/admin/51fb4b37072191aedf8707b198e97a64.png") no-repeat;
            background-size: contain;
            img {
                width: .81rem;
            }
            .award-name {
                position: absolute;
                top: 1.62rem;
                height: .33rem;
                line-height: .33rem;
                text-align: center;
                font-size: .24rem;
                color: #FFFFFF;
            }
        }
        .award-header {
            position: absolute;
            top: .43rem;
            left: 50%;
            height: .37rem;
            line-height: .37rem;
            transform: translateX(-50%);
            font-size: .26rem;
            font-weight: 600;
        }
        .award-header0 {
            top: .73rem;
            color: #C1700F;
        }
        .award-header1 {
            top: .58rem;
            color: #5A3F9C;
        }
        .award-header2 {
            top: .61rem;
            color: #9B5623;
        }
        .award-header3 {
            color: #7B28A1;
        }
    }
    .reward-gear0 {
        height: 3.76rem;
    }
    .reward-gear1 {
        height: 3.54rem;
    }
    .reward-gear2 {
        height: 3.58rem;
    }
    .reward-gear3 {
        height: 3.45rem;
    }
    // 具体展示排名
    .ranking-show {
        position: relative;
        margin-top: .36rem;
        // 前三样式
        .ranking-top-three {
            position: absolute;
            top: 1.11rem;
            width: 2.27rem;
            height: 3.97rem;
            font-size: .22rem;
            color: #FFFFFF;
            background-image: url("https://yaame-static.yaame.io/admin/0524f6ce1917d98778d8905da0416b8b.png");
            background-repeat: no-repeat;
            background-size: 1.5rem 1.5rem;
            background-position: .39rem .37rem;
            .user-img {
                position: absolute;
                top: .39rem;
                left: 50%;
                width: 1.5rem;
                height: 1.5rem;
                transform: translateX(-50%);
                border-radius: 50%;
            }
            .ranking-frame {
                position: absolute;
                width: 100%;
                height: 100%;
            }
            .top {
                position: absolute;
                bottom: 1.53rem;
                left: 50%;
                height: .22rem;
                line-height: .22rem;
                transform: translateX(-50%);
                text-align: center;
            }
            .nickname {
                position: absolute;
                bottom: 1.22rem;
                left: 50%;
                transform: translateX(-50%);
                width: 1.28rem;
                height: .24rem;
                line-height: .24rem;
                font-size: .24rem;
                text-align: center;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }
            .diamond {
                position: absolute;
                bottom: .87rem;
                left: 50%;
                height: .24rem;
                line-height: .24rem;
                transform: translateX(-50%);
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: .24rem;
                img {
                    width: .22rem;
                    height: .18rem;
                }
            }
        }
        .ranking-top0 {
            top: .36rem;
            left: 50%;
            transform: translateX(-50%);
        }
        .ranking-top1 {
            left: .24rem;
        }
        .ranking-top2 {
            right: .24rem;
        }

        //剩下的排名样式
        .ranking-last {
            margin-top: 5.27rem;
            .last {
                position: relative;
                display: flex;
                align-items: center;
                width: 7.23rem;
                height: 1.92rem;
                margin: .14rem auto 0;
                background: url("https://yaame-static.yaame.io/admin/59ac379d1d85e4ec3a53b3bf5fcc0dae.png") no-repeat;
                background-size: contain;
                font-size: .24rem;
                color: #FFFFFF;
                .top {
                    width: .38rem;
                    font-size: .3rem;
                    margin-left: .52rem;
                    text-align: center;
                }
                .last-img {
                    display: flex;
                    align-items: center;
                    margin-left: .17rem;
                    .img {
                        display: flex;
                        width: .95rem;
                        height: .95rem;
                        border-radius: 50%;
                        justify-content: center;
                        align-items: center;
                        background: url("https://yaame-static.yaame.io/admin/0524f6ce1917d98778d8905da0416b8b.png") no-repeat;
                        background-size: .95rem .95rem;
                        background-position: center center;
                        img {
                            width: .95rem;
                            height: 1.05rem;
                            border-radius: 50%;
                        }
                    }
                }
                .txt {
                    margin-left: .16rem;
                    .name {
                        width: 1.93rem;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                }
                .diamond {
                    display: flex;
                    margin-left: .89rem;
                    font-size: .26rem;
                    justify-content: center;
                    align-items: center;
                    img {
                        width: .26rem;
                        height: .22rem;
                        margin-right: .04rem;
                    }
                }
            }
        }
        .lack {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 7.66rem;
            font-size: .3rem;
            color: #FFFFFF;
        }
    }
}
</style>