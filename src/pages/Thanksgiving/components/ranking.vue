<!-- 排行榜 -->
<template>
    <div class="ranking">
        <!-- 头部 -->
        <div class="head-txt">{{ $t('ranking') }}</div>

        <!--前三-->
        <div class="front" v-for="(item, index) in 3" :key="index">
            <div class="bg"></div>
            <div
                v-if="rankingThree[index] && rankingThree[index].avatar"
                class="click-head"
                @click="toDetails(rankingThree[index])"
            ></div>
            <div class="head">
                <img
                    v-if="rankingThree[index] && rankingThree[index].avatar"
                    :src="rankingThree[index] && rankingThree[index].avatar"
                    alt=""
                />
                <img
                    v-else
                    src="https://yaame-static.yaame.io/admin/9cf28c04a72e07566476ac29bf3c6b8f.png"
                    alt=""
                />
            </div>
            <!--状态-->
            <div
                v-if="
                    rankingThree[index] &&
                    rankingThree[index].user_status &&
                    (rankingThree[index].user_status === 2 ||
                        rankingThree[index].user_status === 1)
                "
                class="status"
                :class="{ living: rankingThree[index].user_status === 2 }"
            >
                {{
                    rankingThree[index] && rankingThree[index].user_status === 2
                        ? $t("start_broadcast")
                        : rankingThree[index].user_status === 1
                            ? $t("online")
                            : ""
                }}
            </div>
            <!--名称-->
            <div class="name">
                <span class="name-one no-wrap">{{
                        rankingThree[index] && rankingThree[index].nick_name
                    }}</span>
                <div
                    class="tags"
                    v-if="
                        rankingThree[index] && rankingThree[index].wealth_level
                    "
                    :style="{
                        backgroundImage: `url(${rankingThree[index].wealth_level})`,
                    }"
                ></div>
            </div>
            <div class="id" v-if="rankingThree[index]">
                <img src="https://yaame-static.yaame.io/admin/a1767e481fe00de56ee866a8af0dde18.png" alt="">
                {{ rankingThree[index] && rankingThree[index].score }}
            </div>
            <div
                v-show="rankingThree[index] && userList.uid !== rankingThree[index].uid"
                class="number"
                :class="{
                    'number-one':
                        rankingThree[index] &&
                        rankingThree[index].relation.attention,
                }"
                @click="attentions(rankingThree[index])"
            ></div>
        </div>
        <div class="rank-last">
            <!--剩余排行-->
            <div class="item-scroll">
                <div
                    class="back"
                    v-for="(item, index) in rankingLast"
                    :key="item.peanut_id"
                >
                    <div class="rank-back">{{ index + 4 }}</div>
                    <div class="head-back" @click="toDetails(item)">
                        <div class="head"></div>
                        <img :src="item.avatar" alt=""/>
                        <!--状态-->
                        <div
                            v-if="
                                item.user_status === 1 || item.user_status === 2
                            "
                            class="status"
                            :class="{ living: item.user_status === 2 }"
                        >
                            {{
                                item.user_status === 2
                                    ? $t("start_broadcast")
                                    : item.user_status === 1
                                        ? $t("online")
                                        : ""
                            }}
                        </div>
                    </div>
                    <div class="name-back">
                        <div class="name">
                            <span class="name-one no-wrap">{{
                                    item.nick_name
                                }}</span>
                            <div
                                class="tags"
                                v-if="item.wealth_level"
                                :style="{
                                    backgroundImage: `url(${item.wealth_level})`,
                                }"
                            ></div>
                        </div>
                        <div class="id">
                            <img src="https://yaame-static.yaame.io/admin/a1767e481fe00de56ee866a8af0dde18.png" alt="">
                            {{ item.score }}
                        </div>
                    </div>
                    <div
                        v-show="userList.uid !== item.uid"
                        class="number-back"
                        :class="{ 'number-one': item.relation.attention }"
                        @click="attentions(item)"
                    ></div>
                </div>
            </div>
            <!--无人上榜样式-->
            <div v-if="!rankingThree.length" class="lack">
                <p>{{ $t('noRank') }}</p>
            </div>
        </div>

        <!--我的排名-->
        <div v-if="Object.keys(userList).length" class="my-rank">
            <div class="rank-back">
                {{ userList.rank && userList.rank <= 99 ? userList.rank : '99+' }}
            </div>
            <div class="head-back" @click="toDetails(userList)">
                <div class="head"></div>
                <img :src="userList.avatar && userList.avatar" alt=""/>
            </div>
            <div class="name-back">
                <div class="name">
                    <span class="name-one no-wrap">{{
                            userList.nick_name
                        }}</span>
                    <div
                        class="tags"
                        v-if="userList.wealth_level"
                        :style="{
                            backgroundImage: `url(${userList.wealth_level})`,
                        }"
                    ></div>
                </div>
                <div class="id">
                    <img src="https://yaame-static.yaame.io/admin/a1767e481fe00de56ee866a8af0dde18.png" alt="">
                    {{ userList.score ? userList.score : 0 }}
                </div>
            </div>
            <div
                v-if="
                    userList.rank + 1 <= 99 &&
                    typeof userList.delta_score === 'number'
                "
                class="difference-value"
            >
                {{ $t("distance_to_next") }}
                <span>
                    <img src="https://yaame-static.yaame.io/admin/a1767e481fe00de56ee866a8af0dde18.png" alt="">
                {{ userList.delta_score }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { getCurrentInstance, ref, watch } from "vue";
    import { postAttentionsApi } from "@/pages/Thanksgiving/api";
    import { Toast } from "vant";
    import { burialPointFun } from "@/lib/utils";

    // 获取国际化函数
    const root = getCurrentInstance();
    const t = (val, msg) => {
        return root.proxy.$i18n.t(val, msg);
    };
    const props = defineProps({
        jackpotData: {
            type: Object,
            default: () => ({})
        },
        rankingFun: {
            type: Function,
            default: () => () => {}
        }
    });

    // 获取页面信息
    const userList = ref({});
    // 排名前三的数据
    const rankingThree = ref([]);
    // 剩下排名数据
    const rankingLast = ref([]);

    // 处理排名数据
    const processRanking = (data) => {
        if (!data) return;
        rankingThree.value = data.splice(0, 3);
        rankingLast.value = data;
    };

    // 跳转
    const toDetails = (url) => {
        if (url.mystery === 1) {
            Toast(t("mystery_user"));
            return;
        }
        window.location.href = url.scheme_user_url;
    };

    // 关注
    const attentions = async (value) => {
        try {
            if (value.mystery === 1) {
                // 神秘人
                Toast(t("mystery_user"));
                return;
            }
            if (value.relation.attention) { // 已关注跳转私聊页面
                window.location.href = value.scheme_url;
                return;
            }
            if (value.relation.attention === 0) {
                const res = await postAttentionsApi({
                    target_uid: value.uid,
                });
                if (res.status !== 1000) {
                    Toast(res.desc);
                    return;
                }
                Toast(t("followed"));
                // 重新拉取数据
                props.rankingFun();
            } else {
            }
        } catch (err) {
            console.log(err);
        }
    };

    // 数据处理
    watch(() => props.jackpotData, (value) => {
        if (Object.keys(value).length !== 0) {
            processRanking(value.rank);
            userList.value = value.my_user_info;
        }
    });
</script>

<style lang="less" scoped>
.ranking {
    position: relative;
    width: 6.98rem;
    min-height: 15.9rem;
    margin: 1.48rem auto 0;
    padding-top: 0.6rem;
    padding-bottom: 1.6rem;
    background: #ff9820;
    border-radius: 0.08rem;
    border: 0.04rem solid #ffe265;
    background: url("https://yaame-static.yaame.io/admin/4cf0f486bf23fd5ab064df319085287f.png") no-repeat;
    background-size: contain;

    .head-txt {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: -1.32rem;
        left: 50%;
        transform: translateX(-50%);
        width: 7.12rem;
        height: 2.06rem;
        padding-top: .3rem;
        background: url("https://yaame-static.yaame.io/admin/3c1c054fd34f76c7bb7d1c0db4ae5acf.png") no-repeat;
        background-size: contain;
        font-weight: 600;
        font-size: .34rem;
        color: #770402;
    }

    .front {
        position: absolute;
        top: 1.11rem;
        width: 2.2rem;
        height: 4rem;
        color: #fff;

        .bg {
            position: relative;
            width: 100%;
            height: 100%;
            background-repeat: no-repeat;
            background-size: contain;
            z-index: 1;
        }

        .head {
            position: absolute;
            display: flex;
            top: 0.39rem;
            left: 50%;
            width: 1.62rem;
            height: 1.62rem;
            border-radius: 50%;
            transform: translateX(-50%);
            justify-content: center;
            align-items: center;
            background-repeat: no-repeat;
            background-size: contain;

            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
        }

        .click-head {
            position: absolute;
            top: 0.27rem;
            left: 50%;
            width: 1.72rem;
            height: 1.72rem;
            border-radius: 50%;
            transform: translateX(-50%);
            z-index: 2;
        }

        .status {
            position: absolute;
            top: 2.02rem;
            left: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 0.24rem;
            line-height: 0.24rem;
            padding: 0 0.08rem;
            font-size: 0.18rem;
            color: #ffffff;
            transform: translateX(-50%);
            background: #F6673A;
            border-radius: 0.08rem;
            white-space: nowrap;
            z-index: 1;
        }

        .living {
            background: #ac3af6;
        }

        .name {
            position: absolute;
            display: flex;
            justify-content: center;
            align-items: center;
            top: 2.61rem;
            left: 50%;
            width: 1.79rem;
            height: 0.28rem;
            transform: translateX(-50%);
            font-size: 0.2rem;
            text-align: center;
            z-index: 1;

            .name-one {
                //width: 1.2rem;
                height: 0.28rem;
                display: inline-block;
                font-weight: 600;
            }

            .tags {
                width: 0.55rem;
                height: 0.22rem;
                //margin-left: .04rem;
                background-repeat: no-repeat;
                background-size: contain;
                flex-shrink: 0;
                margin-left: 0.06rem;
            }

            .vip {
                width: 0.6rem;
                height: 0.17rem;
                background-repeat: no-repeat;
                background-size: contain;
                flex-shrink: 0;
                margin-left: 0.06rem;
            }
        }

        .id {
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            top: 2.89rem;
            left: 50%;
            width: 95%;
            height: 0.25rem;
            line-height: 0.25rem;
            transform: translateX(-50%);
            font-size: 0.18rem;
            z-index: 1;
            text-align: center;

            .gold {
                width: 0.24rem;
                height: 0.24rem;
                margin-right: 0.08rem;
            }

            .diamond {
                width: 0.26rem;
                height: 0.22rem;
                margin-right: 0.08rem;
            }

            img {
                width: .22rem;
                height: .19rem;
            }
        }

        .number {
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            top: 3.28rem;
            left: 50%;
            width: 0.54rem;
            height: 0.46rem;
            transform: translateX(-50%);
            background-image: url("https://yaame-static.yaame.io/admin/82141d0d377e6c849fb902d988377915.png");
            background-repeat: no-repeat;
            background-size: contain;
            z-index: 1;
        }

        .number-one {
            background-image: url("https://yaame-static.yaame.io/admin/630c919d1aa37c37a019f5686159fdae.png");
        }
    }

    .front:nth-child(2) {
        top: 0.6rem;
        left: 2.4rem;

        .name {
            top: 2.61rem;
        }

        .head {
            width: 1.74rem;
            height: 1.74rem;
        }

        .id {
            top: 2.89rem;
        }

        .number {
            top: 3.28rem;
        }

        .bg {
            background-image: url("https://yaame-static.yaame.io/admin/2112d39c983a4ccfa6ea03e595bd1669.png");
        }
    }

    .front:nth-child(3) {
        left: 0.11rem;

        .bg {
            background-image: url("https://yaame-static.yaame.io/admin/dbb8161341f6b738cd2c588f8beac865.png");
        }
    }

    .front:nth-child(4) {
        right: 0.12rem;

        .bg {
            background-image: url("https://yaame-static.yaame.io/admin/0a89a726506e4ee95dc74b6c9fbc93c6.png");
        }
    }

    .rank-last {
        position: relative;
        margin-top: 4.83rem;

        .item-scroll {
            position: relative;
            width: 100%;
            min-height: 7rem;

            .back {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: flex-start;
                width: 6.76rem;
                height: 1.42rem;
                margin: 0 auto 0.18rem;
                background: url("https://yaame-static.yaame.io/admin/ec402526c76ee49b7c74ad054adbc342.png") no-repeat;
                background-size: cover;
                color: #AA4201;

                .rank-back {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 0.15rem;
                    margin: 0 0.55rem 0 .5rem;
                    font-size: 0.24rem;
                }

                .head-back {
                    position: relative;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 0.98rem;
                    height: 0.98rem;
                    margin: 0 0.18rem 0 0;

                    .status {
                        position: absolute;
                        top: 0.77rem;
                        left: 50%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 0.24rem;
                        padding: 0 0.05rem;
                        font-size: 0.18rem;
                        color: #ffffff;
                        transform: translateX(-50%);
                        background: #F6673A;
                        border-radius: 0.08rem;
                        white-space: nowrap;
                        z-index: 1;
                    }

                    .living {
                        background: #c71de6;
                    }

                    .head {
                        position: absolute;
                        top: 0;
                        width: 0.98rem;
                        height: 0.98rem;
                        background-image: url("https://yaame-static.yaame.io/admin/1b1f9c4464fd3fb262774c4eaeb1d7bf.png");
                        background-repeat: no-repeat;
                        background-size: contain;
                    }

                    img {
                        width: 0.88rem;
                        height: 0.88rem;
                        border-radius: 50%;
                    }
                }

                .name-back {
                    position: relative;
                    font-weight: 500;

                    .name {
                        display: flex;
                        width: 2.52rem;
                        margin-bottom: 0.09rem;
                        align-items: center;
                        overflow: hidden;

                        .name-one {
                            //width: 1.93rem;
                            height: 0.24rem;
                            line-height: 0.24rem;
                            font-size: 0.24rem;
                            display: inline-block;
                        }

                        .vip {
                            width: 0.82rem;
                            height: 0.22rem;
                            background-repeat: no-repeat;
                            background-size: contain;
                            flex-shrink: 0;
                            margin-left: 0.1rem;
                        }

                        .tags {
                            width: 0.55rem;
                            height: 0.22rem;
                            background-repeat: no-repeat;
                            background-size: contain;
                            flex-shrink: 0;
                            margin-left: 0.1rem;
                        }
                    }

                    .id {
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        height: 0.3rem;
                        line-height: 0.3rem;
                        font-size: 0.22rem;

                        .gold {
                            width: 0.24rem;
                            height: 0.24rem;
                            margin-right: 0.08rem;
                        }

                        .diamond {
                            width: 0.26rem;
                            height: 0.22rem;
                            margin-right: 0.08rem;
                        }

                        img {
                            width: .22rem;
                            height: .19rem;
                        }
                    }
                }

                .number-back {
                    position: absolute;
                    left: 5.95rem;
                    width: 0.54rem;
                    height: 0.46rem;
                    background-image: url("https://yaame-static.yaame.io/admin/82141d0d377e6c849fb902d988377915.png");
                    background-repeat: no-repeat;
                    background-size: contain;
                }

                .number-one {
                    background-image: url("https://yaame-static.yaame.io/admin/630c919d1aa37c37a019f5686159fdae.png");
                }
            }

            .back:last-of-type {
                margin-bottom: 0;
            }
        }

        .lack {
            position: absolute;
            top: 0;
            left: 50%;
            width: 0.84rem;
            height: 1rem;
            transform: translateX(-50%);
            background: url("https://yaame-static.yaame.io/admin/342d71b54c3410e1a8ed458a5eb07533.png") no-repeat;
            background-size: contain;

            p {
                position: absolute;
                top: 1.37rem;
                left: 50%;
                height: 0.2rem;
                transform: translateX(-50%);
                line-height: 0.2rem;
                font-size: 0.24rem;
                color: #aa4201;
                white-space: nowrap;
            }
        }
    }

    .my-rank {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        position: fixed;
        bottom: 0;
        left: 50%;
        width: 100%;
        height: 1.45rem;
        background: url("https://yaame-static.yaame.io/admin/05108004e53f90522dbfaae899f7bf6a.png") no-repeat;
        background-size: contain;
        transform: translateX(-50%);
        z-index: 3;
        color: #AA4201;

        .rank-back {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 0.44rem;
            height: 0.33rem;
            margin-left: 0.5rem;
            font-size: 0.24rem;
        }

        .head-back {
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            width: 0.98rem;
            height: 0.98rem;
            margin: 0 0.18rem 0 0.26rem;

            .head {
                position: absolute;
                top: 0;
                width: 0.98rem;
                height: 0.98rem;
                background-image: url("https://yaame-static.yaame.io/admin/1b1f9c4464fd3fb262774c4eaeb1d7bf.png");
                background-repeat: no-repeat;
                background-size: contain;
            }

            img {
                width: 0.88rem;
                height: 0.88rem;
                border-radius: 50%;
            }
        }

        .name-back {
            position: relative;
            color: #aa4201;
            font-weight: 500;

            .name {
                display: flex;
                width: 2.52rem;
                margin-bottom: 0.09rem;
                align-items: center;
                overflow: hidden;

                .name-one {
                    //width: 1.93rem;
                    height: 0.24rem;
                    line-height: 0.24rem;
                    font-size: 0.24rem;
                    display: inline-block;
                }

                .vip {
                    width: 0.82rem;
                    height: 0.22rem;
                    background-repeat: no-repeat;
                    background-size: contain;
                    flex-shrink: 0;
                    margin-left: 0.1rem;
                }

                .tags {
                    width: 0.55rem;
                    height: 0.22rem;
                    background-repeat: no-repeat;
                    background-size: contain;
                    flex-shrink: 0;
                    margin-left: 0.1rem;
                }
            }

            .id {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                height: 0.3rem;
                line-height: 0.3rem;
                font-size: 0.22rem;

                .gold {
                    width: 0.24rem;
                    height: 0.24rem;
                    margin-right: 0.08rem;
                }

                .diamond {
                    width: 0.26rem;
                    height: 0.22rem;
                    margin-right: 0.08rem;
                }

                img {
                    width: .22rem;
                    height: .19rem;
                }
            }
        }

        .number-back {
            display: flex;
            justify-content: center;
            align-items: baseline;
            position: relative;
            width: 1.3rem;
            height: 0.56rem;
            line-height: 0.35rem;
            margin-left: 0.62rem;
            font-size: 0.2rem;
        }

        .difference-value {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 1.3rem;
            height: 0.56rem;
            margin-left: 0.6rem;
            font-size: 0.2rem;
            color: #aa4201;

            span {
                display: flex;
                justify-content: center;
                align-items: center;

                img {
                    width: .22rem;
                    height: .19rem;
                }
            }
        }
    }
}
</style>
