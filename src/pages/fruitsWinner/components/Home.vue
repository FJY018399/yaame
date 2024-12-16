<template>
    <!--背景多语言-->
    <div class="main" :style="{ backgroundImage: `url(${logoImg[locale]})` }">
        <!--跳转奖励导航-->
        <div class="award-rule" @click="$router.push('Award')">{{ $t('fruitmachinewinner_reward') }}</div>
        <!--排行榜-->
        <div class="ranking">
            <!--奖台样式-->
            <div class="ranking-top"></div>
            <!--前三名样式-->
            <div v-for="(item, index) in 3" :key="index" class="ranking-top-three" :class="`ranking-top${index}`">
                <div class="avatar-frame">
                    <div class="avatar-frame-img">
                        <img @click="skip(rankingThree[index].scheme_url)" v-if="rankingThree && rankingThree[index]" :src="rankingThree[index].subject_icon" alt="">
                    </div>
                </div>
                <div v-if="rankingThree && rankingThree[index]" class="name" :style="{ marginTop: index !== 0 ? '.6rem' : '.53rem' }" @click="skip(rankingThree[index].scheme_url)">{{ rankingThree[index].subject_name }}</div>
                <div v-if="rankingThree && rankingThree[index]" class="yamme-id">{{ 'ID:' + rankingThree[index].peanut_id }}</div>
                <div v-if="rankingThree && rankingThree[index]" class="diamond">
                    <img src="https://yaame-static.yaame.io/admin/f2c73b0733ac4b1da23cc685e71fd223.png" alt="">
                    {{ rankingThree[index].subject_score }}
                </div>
            </div>
            <!--剩下样式-->
            <div v-if="rankingLast.length" class="ranking-last">
                <div class="last" v-for="(item, index) in rankingLast" :key="index">
                    <div class="top">{{ item.subject_rank }}</div>
                    <div class="last-img">
                        <div class="img">
                            <img v-if="item.subject_icon" @click="skip(item.scheme_url)" :src="item.subject_icon" alt="">
                            <div v-else class="circle"></div>
                        </div>
                        <div class="txt">
                            <div class="name" @click="skip(item.scheme_url)">{{ item.subject_name }}</div>
                            <div class="yaame-id">{{ 'ID:' + item.peanut_id }}</div>
                        </div>
                    </div>
                    <div class="diamond">
                        <img src="https://yaame-static.yaame.io/admin/f2c73b0733ac4b1da23cc685e71fd223.png" alt="">
                        {{ item.subject_score }}
                    </div>
                </div>
            </div>
            <div v-else class="lack">
                {{ $t('nooneon_leaderboard') }}
            </div>
        </div>
        <!--我的排名-->
        <div class="my-rank">
            <div class="top">{{ myList.subject_rank && myList.subject_rank <= 99 ? myList.subject_rank : 99 + '+' }}</div>
            <div class="last-img">
                <div class="img" @click="skip(myList.scheme_url)">
                    <img :src="myList.subject_icon" alt="">
                </div>
                <div class="txt">
                    <div class="name" @click="skip(myList.scheme_url)">{{ myList.subject_name }}</div>
                    <div class="yaame-id">{{ 'ID:' + myList.peanut_id }}</div>
                </div>
            </div>
            <div class="diamond">
                <img src="https://yaame-static.yaame.io/admin/f2c73b0733ac4b1da23cc685e71fd223.png" alt="">
                {{ myList.subject_score - 0 }}
            </div>
        </div>
    </div>
</template>

<script setup>
    import { getLanguage } from "../../../lib/device";
    import { getCurrentInstance, onMounted, ref } from "vue";
    import { getFruitsRank } from "../../../lib/request/activity";

    // 获取父组件传递的方法
    const props = defineProps(['updateCurrent']);
    // 获取国家
    let locale = ref(getLanguage() || "en");
    // 获取国际化函数
    const root = getCurrentInstance();
    const t = (val) => {
        return root.proxy.$i18n.t(val);
    };
    // 背景图片国际化
    const logoImg = ref({
        "ar": "https://yaame-static.yaame.io/admin/4c77853ed5ac71b1b8853ae0a8de3fd3.png",
        "en": "https://yaame-static.yaame.io/admin/305a29aabd268b25482531bf1f54a2a1.png",
        "id": "https://yaame-static.yaame.io/admin/430e79f5eb31a085f3eb1e8cd407a2b1.png",
        "zh-cn": "https://yaame-static.yaame.io/admin/a999696050ec6ac8fcaef11e1cebed78.png",
        "zh-tw": "https://yaame-static.yaame.io/admin/85284c7d59d93e311f1f62808f7dc59f.png",
    });

    // 排名前三的数据
    const rankingThree = ref([]);
    // 剩下排名数据
    const rankingLast = ref([]);
    // 我的数据
    const myList = ref({});

    // 数据处理
    const disposeList = (value) => {
        const a =  value;
        rankingThree.value = a.splice(0,3);
        rankingLast.value = a;
    };
    // 获取排名数据
    const getRankList = async () => {
        try {
            const res = await getFruitsRank({
                page: 1,
                size: 50,
                rankType: 'FRUIT_MACHINE_BIG_WINNER_ACTIVITY',
                rankGroupFlag: 'big_winner'
            });
            if (res.status !== 1000) return;
            if (res.data.content && res.data.content.length > 3) disposeList(res.data.content);
            else rankingThree.value = res.data.content;
            myList.value = res.data.my_rank;
        } catch (err) {
            console.log(err);
        }
    };

    // 点击跳转用户地址
    const skip = (value) => {
        window.location.href = value;
    };

    onMounted(() => {
        getRankList()
    })
</script>

<style lang="less" scoped>
.main {
    min-height: 100vh;
    padding-bottom: 2.11rem;
    background-repeat: no-repeat;
    background-size: contain;
    overflow: hidden;
    // 奖励按钮样式
    .award-rule {
        position: fixed;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 2.06rem;
        right: 0;
        min-width: 1.09rem;
        height: .52rem;
        padding: 0 .1rem;
        border-radius: .1rem 0 0 .1rem;
        background: #A83AF8;
        border: .02px solid #FFC623;
        font-size: .32rem;
        color: #fff;
        z-index: 2;
    }
    //排行榜样式
    .ranking {
        position: relative;
        width: 7.5rem;
        min-height: 5.06rem;
        margin-top: 8.21rem;
        background: url("https://yaame-static.yaame.io/admin/7a987f962f5c3e15074aa3e4a8de0da8.png") no-repeat;
        background-size: contain;
        overflow: hidden;
        // 奖台样式
        .ranking-top {
            position: relative;
            width: 6.73rem;
            height: 2.82rem;
            margin: 2.24rem auto 0;
            background: url("https://yaame-static.yaame.io/admin/bb7f4c70f07def30b7d9fa554145474a.png") no-repeat;
            background-size: contain;
        }
        // 前三样式
        .ranking-top-three {
            position: absolute;
            overflow: hidden;
            font-size: .2rem;
            font-weight: 600;
            color: #FFFFFF;
            background-repeat: no-repeat;
            background-size: contain;
            .avatar-frame {
                width: 2.19rem;
                height: 1.99rem;
                overflow: hidden;
                .avatar-frame-img {
                    width: 1.28rem;
                    height: 1.28rem;
                    margin: .48rem auto 0;
                    background: url("https://yaame-static.yaame.io/admin/0524f6ce1917d98778d8905da0416b8b.png") no-repeat;
                    background-size: contain;
                    border-radius: 50%;
                    overflow: hidden;
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
            }
            .name {
                width: 1.9rem;
                height: .33rem;
                line-height: .33rem;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                font-size: .24rem;
                text-align: center;
                margin: .53rem auto 0;
            }
            .yamme-id {
                text-align: center;
            }
            .diamond {
                display: flex;
                justify-content: center;
                align-items: center;
                img {
                    width: .22rem;
                    height: .19rem;
                }
            }
        }

        .ranking-top0 {
            top: .55rem;
            left: 50%;
            transform: translateX(-50%);
            background-image: url("https://yaame-static.yaame.io/admin/e169a67ff44412c992dd0d123af4a3e3.png");
        }
        .ranking-top1 {
            top: .94rem;
            left: .33rem;
            background-image: url("https://yaame-static.yaame.io/admin/21ae3605df6e3359d5fb8b6763c73cca.png");
        }
        .ranking-top2 {
            top: .94rem;
            right: .33rem;
            background-image: url("https://yaame-static.yaame.io/admin/c1bf8139c7dd85961848f99707ee4e3d.png");
        }

        //剩下的排名样式
        .ranking-last {
            margin-top: .08rem;
            .last {
                position: relative;
                display: flex;
                align-items: center;
                width: 6.85rem;
                height: 1.35rem;
                margin: .14rem auto 0;
                background: url("https://yaame-static.yaame.io/admin/ec5bfadf14ebb771a733ead689b5cb88.png") no-repeat;
                background-size: contain;
                font-size: .24rem;
                color: #FFFFFF;
                .top {
                    font-size: .3rem;
                    margin-left: .52rem;
                }
                .last-img {
                    display: flex;
                    align-items: center;
                    margin-left: .45rem;
                    .img {
                        display: flex;
                        width: .98rem;
                        height: .98rem;
                        justify-content: center;
                        align-items: center;
                        background: url("https://yaame-static.yaame.io/admin/596e44018725280a61a89083ef488a31.png") no-repeat;
                        background-size: contain;
                        img {
                            width: .92rem;
                            height: .92rem;
                            border-radius: 50%;
                        }
                        .circle {
                            width: .92rem;
                            height: .92rem;
                            border-radius: 50%;
                            background: url("https://yaame-static.yaame.io/admin/0524f6ce1917d98778d8905da0416b8b.png") no-repeat;
                            background-size: contain;
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
    //我的排名样式
    .my-rank {
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 2.11rem;
        background: url("https://yaame-static.yaame.io/admin/f8f72e741ad772178f80ab0ea7ffca59.png") no-repeat;
        background-size: contain;
        font-size: .24rem;
        color: #fff;
        .top {
            position: absolute;
            top: 1.08rem;
            left: .39rem;
            font-size: .3rem;
        }
        .last-img {
            position: absolute;
            display: flex;
            align-items: center;
            top: .71rem;
            left: 1.16rem;
            .img {
                display: flex;
                width: 1.08rem;
                height: 1.08rem;
                justify-content: center;
                align-items: center;
                margin-right: .33rem;
                background: url("https://yaame-static.yaame.io/admin/596e44018725280a61a89083ef488a31.png") no-repeat;
                background-size: contain;
                img {
                    width: 1rem;
                    height: 1rem;
                    border-radius: 50%;
                }
            }
        }
        .txt {
            .name {
                width: 1.93rem;
                white-space: normal;
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }
        .diamond {
            position: absolute;
            top: 1.16rem;
            left: 5.7rem;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: .26rem;
            img {
                width: .26rem;
                height: .22rem;
                margin-right: .04rem;
            }
        }
    }
}
</style>