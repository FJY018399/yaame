<template>
    <div class="main">
        <custom-header color="white">{{ $t('greedyKing') }}</custom-header>
        <!-- 标题 -->
        <div class="herder-title">{{ $t('gameRules') }}</div>
        <!-- 活动奖励规则 -->
        <div class="rule">
            <p>{{ $t('eventStartDate') }}</p>
            <p>{{ $t('rankingDeadline') }}</p>
            <p>{{ $t('RankingRewards') }}</p>
        </div>
        <!-- 上部分奖励 -->
        <div class="top-ranking">
            <div class="reward-title">—— {{ $t('gameRankingRewards') }} ——</div>
            <!-- 奖励 -->
            <div class="top-reward">
                <!-- 循环四条数据 -->
                <div v-for="(item, index) in 4" :key="index" :class="[`reward-list${index}`, 'reward-list']">
                    <!-- Top -->
                    <div v-show="item === 4" class="top-several">
                        TOP {{ item + "~10" }}
                    </div>
                    <div v-show="item !== 4" class="top-several">TOP {{ item }}</div>
                    <!-- TOP1 -->
                    <div v-show="item === 1" class="top-award">
                        <div v-for="(item, index) in awardImg1" :key="index" class="award">
                            <div class="award-img">
                                <img :src="item.img" alt=""/>
                            </div>
                            <span v-show="index === 3">20000</span>
                            <span v-show="index !== 3">{{ $t("totalDays") }}</span>
                        </div>
                    </div>
                    <!-- TOP2 -->
                    <div v-show="item === 2" class="top-award">
                        <div v-for="(item, index) in awardImg2" :key="index" class="award">
                            <div class="award-img">
                                <img :src="item.img" alt=""/>
                            </div>
                            <span v-show="index === 2">15000</span>
                            <span v-show="index !== 2">{{ $t("totalDays") }}</span>
                        </div>
                    </div>
                    <!-- TOP3 -->
                    <div v-show="item === 3" class="top-award">
                        <div v-for="(item, index) in awardImg3" :key="index" class="award">
                            <div class="award-img">
                                <img :src="item.img" alt=""/>
                            </div>
                            <span v-show="index === 1">12000</span>
                            <span v-show="index !== 1">{{ $t("totalDays") }}</span>
                        </div>
                    </div>
                    <!-- TOP4-10 -->
                    <div v-if="item === 4" class="top-award">
                        <div v-for="(item, index) in awardImg4" :key="index" class="award">
                            <div class="award-img">
                                <img :src="item.img" alt=""/>
                            </div>
                            <span v-if="index === 0">2000</span>
                            <span v-else>{{ $t("totalDays") }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 下部分奖励 -->
        <div class="Bottom-ranking">
            <div class="reward-title">—— {{ $t('hitRankingRewards') }} ——</div>
            <!-- 奖励 -->
            <div class="bottom-reward">
                <div class="top-reward-food">
                    <div v-for="(item, index) in vegetable" :key="index" class="list-reward">
                        <div class="min-food">
                            <img :src="item.vegetableImg" alt=""/>
                        </div>
                        <span class="list-reward-span">Top1</span>
                        <div class="reward-tow">
                            <div v-for="(item, index) in item.img" :key="index" class="reward">
                                <div class="reward-img">
                                    <img :src="item" alt=""/>
                                </div>
                                <span v-show="index === 'award'">{{
                                        $t("totalDays")
                                    }}</span>
                                <span v-show="index === 'diamond'">{{ $t('GiftKey') }}
                                    <img src="https://yaame-static.yaame.io/admin/a6365534fe80ca135be857d52b29408c.png"
                                         alt=""
                                    />888</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bottom-reward-food">
                    <div v-for="(item, index) in meat" :key="index" class="list-reward">
                        <div class="min-food">
                            <img :src="item.meatImg" alt=""/>
                        </div>
                        <span class="list-reward-span">Top1</span>
                        <div class="reward-tow">
                            <div v-for="(item, index) in item.img" :key="index" class="reward">
                                <img :src="item" alt=""/>
                                <span v-show="index === 'award'">{{
                                        $t("totalDays")
                                    }}</span>
                                <span v-show="index === 'diamond'">{{ $t('GiftKey') }}
                                    <img src="https://yaame-static.yaame.io/admin/a6365534fe80ca135be857d52b29408c.png"
                                         alt=""
                                    />888</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import customHeader from "@/components/common/header.vue";
export default {
    components: {
        customHeader,
    },
    setup() {
        // 页面四种奖励图片存放
        const awardImg1 = ref([
            {
                // 座驾
                id: 3,
                img: 'https://yaame-static.yaame.io/admin/37aafd602e3265bd3ecfc082d8cece1c.png'
            },
            {
                // 气泡
                id: 2,
                img: 'https://yaame-static.yaame.io/admin/502f253810bdde4cee7c426f3ffed801.png',
            },
            {
                // 头像
                id: 1,
                img: 'https://yaame-static.yaame.io/admin/aa6f4ea547e780f716b06ee7a7283b2d.png',
            },
            {
                // 铃铛
                id: 4,
                img: 'https://yaame-static.yaame.io/admin/b68a3c52bf8d99da9d618718e36b9966.png'
            }
        ]);
        const awardImg2 = ref([
            {
                // 气泡
                id: 2,
                img: 'https://yaame-static.yaame.io/admin/502f253810bdde4cee7c426f3ffed801.png',
            },
            {
                // 头像
                id: 1,
                img: 'https://yaame-static.yaame.io/admin/aa6f4ea547e780f716b06ee7a7283b2d.png',
            },
            {
                // 铃铛
                id: 4,
                img: 'https://yaame-static.yaame.io/admin/b68a3c52bf8d99da9d618718e36b9966.png'
            }
        ]);
        const awardImg3 = ref([
            {
                // 头像
                id: 1,
                img: 'https://yaame-static.yaame.io/admin/aa6f4ea547e780f716b06ee7a7283b2d.png',
            },
            {
                // 铃铛
                id: 4,
                img: 'https://yaame-static.yaame.io/admin/b68a3c52bf8d99da9d618718e36b9966.png'
            }
        ]);
        const awardImg4 = ref([
            {
                // 铃铛
                id: 4,
                img: 'https://yaame-static.yaame.io/admin/b68a3c52bf8d99da9d618718e36b9966.png'
            }
        ]);
        // 蔬菜数据
        const vegetable = ref([
            {
                // 蔬菜
                id: 1,
                vegetableImg: "https://yaame-static.yaame.io/admin/3bf1e62fa9ea3cb0f5f5d43b33aa3f03.png",
                img: {
                    award: "https://yaame-static.yaame.io/admin/357d1afed18df4b46ad2aa618293037e.png",
                    diamond: "https://yaame-static.yaame.io/admin/f21505daf5289ad62cae4747cfa90a9a.png",
                },
            },
            {
                // 蔬菜
                id: 2,
                vegetableImg:
                    "https://yaame-static.yaame.io/admin/9fe63b0cd71a17954d5ba45bc3e4e7c2.png",
                img: {
                    award: "https://yaame-static.yaame.io/admin/22475a8a38fe77baa26acc8d495efaa6.png",
                    diamond: "https://yaame-static.yaame.io/admin/f21505daf5289ad62cae4747cfa90a9a.png",
                },
            },
            {
                // 蔬菜
                id: 3,
                vegetableImg:
                    "https://yaame-static.yaame.io/admin/d2a6d18cfc761493772be06753335665.png",
                img: {
                    award: "https://yaame-static.yaame.io/admin/03bb95ea7e5553415de5ab38f03cae69.png",
                    diamond: "https://yaame-static.yaame.io/admin/f21505daf5289ad62cae4747cfa90a9a.png",
                },
            },
            {
                // 蔬菜
                id: 4,
                vegetableImg:
                    "https://yaame-static.yaame.io/admin/7741c2930010e140668f1039c3d561a6.png",
                img: {
                    award: "https://yaame-static.yaame.io/admin/56424d1b81c4ecf42dd1688061174e4a.png",
                    diamond: "https://yaame-static.yaame.io/admin/f21505daf5289ad62cae4747cfa90a9a.png",
                },
            },
        ]);
        // 肉类数据
        const meat = ref([
            {
                id: 1,
                meatImg:
                    "https://yaame-static.yaame.io/admin/053abc7e6d604a800b9e375cbc2f378b.png",
                img: {
                    award: "https://yaame-static.yaame.io/admin/e409711278938334d9d435d550f59c2a.png",
                    diamond: "https://yaame-static.yaame.io/admin/a82990f5c35935cd74eaa9b7c79bd564.png",
                },
            },
            {
                id: 2,
                meatImg:
                    "https://yaame-static.yaame.io/admin/0607e147677db61ca4b8bcc4af43e274.png",
                img: {
                    award: "https://yaame-static.yaame.io/admin/354d91a0ec764137ad8c44ceedb6d7be.png",
                    diamond: "https://yaame-static.yaame.io/admin/a82990f5c35935cd74eaa9b7c79bd564.png",
                },
            },
            {
                id: 3,
                meatImg:
                    "https://yaame-static.yaame.io/admin/43cb2137bc7f31b42685bc0bd55b2098.png",
                img: {
                    award: "https://yaame-static.yaame.io/admin/24deab429111dda7fe180ed71c1f76d6.png",
                    diamond: "https://yaame-static.yaame.io/admin/a82990f5c35935cd74eaa9b7c79bd564.png",
                },
            },
            {
                id: 4,
                meatImg:
                    "https://yaame-static.yaame.io/admin/bf96658644614a2b7b6493ce86dc18eb.png",
                img: {
                    award: "https://yaame-static.yaame.io/admin/50dc40b0c9628e26e2cbc71ff1446122.png",
                    diamond: "https://yaame-static.yaame.io/admin/a82990f5c35935cd74eaa9b7c79bd564.png",
                },
            },
        ]);


        onMounted(() => {
            // 让屏幕滚回顶部
            document.body.style.backgroundColor = '#FDDC80';
        })
        return {
            awardImg1,
            awardImg2,
            awardImg3,
            awardImg4,
            vegetable,
            meat,
        }
    }
}
</script>

<style lang="less" scoped>
.main {
    min-height: 100vw;
    background: url('https://yaame-static.yaame.io/admin/4604510d69e8735127590b07b2ba6f5e.png') no-repeat;
    background-size: contain;
    overflow: hidden;

    // 标题
    .herder-title {
        width: 4.73rem;
        height: 1.21rem;
        line-height: .95rem;
        margin: .71rem auto 0;
        font-size: .46rem;
        font-weight: 600;
        color: #770402;
        text-align: center;
        background: url('https://yaame-static.yaame.io/admin/662f99f7f6052ee76f0a85a744441664.png') no-repeat;
        background-size: contain;
    }

    // 活动规则
    .rule {
        width: 7rem;
        margin: .47rem 0 .74rem .43rem;
        color: #770402;
        font-size: .28rem;
        overflow: hidden;

        p {
            margin-bottom: .22rem;
        }
    }

    .reward-title {
        width: 5.03rem;
        height: .5702rem;
        font-size: .32rem;
        color: #770402;
        margin: .21rem auto 0;
        text-align: center;
    }

    // 上半部分排名样式
    .top-ranking {
        position: relative;

        .top-reward {
            padding: 0 .29rem;

            .reward-list {
                position: relative;
                width: 6.4rem;
                height: 2.9rem;
                margin: .3rem 0;
                background: url('https://yaame-static.yaame.io/admin/68a163c848ae504a83b49806c6e0c041.png') no-repeat;
                background-size: contain;
                overflow: hidden;

                .top-several {
                    position: absolute;
                    top: 0;
                    left: 2.29rem;
                    width: 1.82rem;
                    height: .52rem;
                    text-align: center;
                    font-weight: 600;
                    color: #760E0C;
                    font-size: .3rem;
                    background: url('https://yaame-static.yaame.io/admin/e3e69aed4568151fb1e10d4ab49e893c.png') no-repeat;
                    background-size: contain;
                }

                .top-award {
                    display: flex;
                    margin-top: .7rem;
                    justify-content: space-around;
                    align-items: center;

                    .award {
                        display: flex;
                        width: 1.35rem;
                        height: 1.94rem;
                        color: #fff;
                        font-size: .24rem;
                        box-shadow: 0 .02rem .04rem 0 rgba(238, 179, 61, 0.53);
                        background: url('https://yaame-static.yaame.io/admin/244f8ae62dadd2a12e9b3ac4b4d1e696.png') no-repeat;
                        background-size: contain;
                        align-items: center;
                        flex-wrap: wrap;
                        justify-content: center;
                        border-radius: 0 0 0.2rem 0.2rem;

                        .award-img {
                            display: flex;
                            align-items: center;
                            width: 1.31rem;
                            height: 1.31rem;

                            img {
                                width: 1.31rem;
                                height: auto;
                                border-radius: .2rem .2rem 0 0;
                            }
                        }

                        span {
                            width: 1.31rem;
                            height: .63rem;
                            line-height: .63rem;
                            border-radius: 0 0 .2rem .2rem;
                            text-align: center;
                        }
                    }
                }
            }
        }
    }

    .top-ranking,
    .Bottom-ranking {
        // 上下公用tab样式
        width: 7rem;
        height: 14.1rem;
        margin: 0 .25rem;
        margin-bottom: .34rem;
        box-shadow: 0 .04rem .04rem 0 #F9E2A0;
        border-radius: .2rem;
        border: .02rem solid #770402;
        background: url('https://yaame-static.yaame.io/admin/085e299f4fbaed1d761990d1d2ebe139.png') no-repeat #FDDC80;
        background-size: contain;
    }

    // 下半部分排名样式
    .Bottom-ranking {
        width: 7rem;
        height: 7.71rem;
        box-shadow: 0 .03rem .04rem 0 #FEEAB2;
        border-radius: .2rem;
        border: .02rem solid #770402;

        .hit {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;

            .food-hit {
                position: relative;
                float: left;
                width: 1.54rem;
                height: 2.2rem;
                margin-top: 0.92rem;
                color: #fff;
                font-size: .24rem;
                background: url('https://yaame-static.yaame.io/admin/530fd0537206cedd52aff046b111e466.png') no-repeat;
                background-size: contain;

                .min-food {
                    position: absolute;
                    display: flex;
                    top: -0.32rem;
                    left: 0.45rem;
                    width: .64rem;
                    height: .64rem;
                    background: url('https://yaame-static.yaame.io/admin/8e8354dfd57dbc23c6f112c89ff9f6af.png') no-repeat;
                    background-size: contain;
                    justify-content: center;
                    align-items: center;

                    img {
                        width: .5rem;
                        height: .5rem;
                    }
                }

                .food-user {
                    position: absolute;
                    display: flex;
                    left: 0.39rem;
                    top: 0.4rem;
                    width: .78rem;
                    height: .78rem;
                    background: url('https://yaame-static.yaame.io/admin/608ae6275339a404324ca35ec782b086.png') no-repeat;
                    background-size: contain;
                    justify-content: center;
                    align-content: center;
                    border-radius: 50%;
                    overflow: hidden;
                    align-content: center;

                    .food-user-img {
                        width: 100%;
                        height: 100%;
                    }

                    .food-user-no {
                        width: .42rem;
                        height: .42rem;
                    }
                }

                .food-user-name {
                    position: absolute;
                    top: 1.3rem;
                    left: 50%;
                    transform: translateX(-50%);
                }

                .food-user-diamond {
                    position: absolute;
                    bottom: .2rem;
                    left: 50%;
                    height: .24rem;
                    line-height: .24rem;
                    transform: translateX(-50%);

                    img {
                        width: .22rem;
                        height: .2rem;
                    }
                }
            }

            .food-no {
                position: relative;
                float: left;
                width: 1.54rem;
                height: 2.2rem;
                margin-top: 0.92rem;
                color: #fff;
                font-size: .24rem;
                background: url('https://yaame-static.yaame.io/admin/530fd0537206cedd52aff046b111e466.png') no-repeat;
                background-size: contain;

                .min-food {
                    position: absolute;
                    display: flex;
                    top: -0.32rem;
                    left: 0.45rem;
                    width: .64rem;
                    height: .64rem;
                    background: url('https://yaame-static.yaame.io/admin/8e8354dfd57dbc23c6f112c89ff9f6af.png') no-repeat;
                    background-size: contain;
                    justify-content: center;
                    align-items: center;

                    img {
                        width: .5rem;
                        height: .5rem;
                    }
                }

                .food-user {
                    position: absolute;
                    display: flex;
                    left: 0.39rem;
                    top: 0.59rem;
                    width: .78rem;
                    height: .78rem;
                    background: url('https://yaame-static.yaame.io/admin/608ae6275339a404324ca35ec782b086.png') no-repeat;
                    background-size: contain;
                    justify-content: center;
                    align-content: center;
                    border-radius: 50%;
                    overflow: hidden;
                    align-content: center;
                    align-items: center;

                    .food-user-img {
                        width: 100%;
                        height: 100%;
                    }

                    .food-user-no {
                        width: .42rem;
                        height: .42rem;
                    }
                }

                .food-user-name {
                    position: absolute;
                    top: 1.3rem;
                    left: 50%;
                    transform: translateX(-50%);
                }

                .food-user-diamond {
                    position: absolute;
                    bottom: .32rem;
                    left: 50%;
                    height: .24rem;
                    line-height: .24rem;
                    transform: translateX(-50%);

                    img {
                        width: .22rem;
                        height: .2rem;
                    }
                }
            }
        }

        .bottom-reward {
            width: 99%;
            margin: auto;
            overflow-x: auto;

            .top-reward-food,
            .bottom-reward-food {
                position: relative;
                width: 16.56rem;

                .min-food {
                    display: flex;
                    position: absolute;
                    top: -0.34rem;
                    left: 1.56rem;
                    width: .64rem;
                    height: .64rem;
                    background: #FFE779;
                    border-radius: .16rem;
                    border: .01rem solid #FFFFFF;
                    justify-content: center;
                    align-items: center;

                    img {
                        width: .52rem;
                        height: .50rem;
                    }
                }
            }

            .list-reward {
                position: relative;
                float: left;
                width: 3.84rem;
                height: 2.67rem;
                margin-left: .3rem;
                margin-top: 0.52rem;
                font-size: .24rem;
                color: #fff;
                background: url('https://yaame-static.yaame.io/admin/99d2e5cbe58bc935698a97ca7fe685a7.png') no-repeat;
                background-size: contain;

                .list-reward-span {
                    position: absolute;
                    top: .42rem;
                    left: 50%;
                    height: .27rem;
                    color: #760E0C;
                    transform: translateX(-50%);
                }

                .reward-tow {
                    display: flex;
                    height: 2.37rem;
                    align-items: flex-end;
                    justify-content: space-around;

                    .reward {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        width: 1.43rem;
                        height: 1.68rem;
                        background: url('https://yaame-static.yaame.io/admin/69cc452b58283eb08dcfef654d2dc52c.png') no-repeat;
                        background-size: contain;

                        .reward-img {
                            width: 1.40rem;
                            height: 1.4rem;
                        }

                        img {
                            width: 1.40rem;
                            height: auto;
                        }

                      span {
                        height: .24rem;
                        line-height: .24rem;
                        white-space: nowrap;

                        img {
                          width: .24rem;
                          height: .2rem;
                        }
                      }
                    }
                }
            }
        }
    }
}
</style>