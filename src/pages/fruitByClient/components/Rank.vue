<template>
    <div class="rank-container" :class="{ weekly: isWeekly }">
        <div class="rank-title">{{ $t("Fruit King") }}</div>
        <div class="rank-tabs-box">
            <div class="rank-tabs">
                <div class="rank-tab" :class="{ active: tabIndex === 0 }" @click="tabIndex = 0">{{ $t("Daily") }}</div>
                <div class="rank-tab" :class="{ active: tabIndex === 1 }" @click="tabIndex = 1">{{ $t("Weekly") }}</div>
            </div>
        </div>
        <div class="rank-back" @click="back">
            <img src="../../../assets/img/fruit_turntable/rank-back.png" alt="" />
        </div>
        <div class="rank-content">
            <div class="rank-hearder">
                <img v-if="isWeekly" class="rank-bg" src="../../../assets/img/fruit_turntable/rank-bg-weekly.png" />
                <img v-else class="rank-bg" src="../../../assets/img/fruit_turntable/rank-bg.png" />
                <div class="rank-avatar-box">
                    <!-- 第二 -->
                    <div class="rank-avatar rank-avatar-2">
                        <div class="rank-avatar-top">
                            <img v-if="isWeekly" class="rank-avatar-border" :src="imgs['rank-avatar-weekly-2']" />
                            <img v-else class="rank-avatar-border" :src="imgs['rank-avatar-2']" />
                            <img class="rank-avatar-img" :src="list[1] ? list[1].avatar : isWeekly ? imgs['nobody-weekly'] : imgs.nobody" />
                        </div>
                        <div class="rank-avatar-bottom">
                            <div class="rank-name">{{ list[1] ? list[1].nick_name : "" }}</div>
                            <div v-if="list[1]" class="rank-value">
                                <img :src="imgs.diamond2" />
                                <span>{{ list[1] ? list[1].reward : "-" }}</span>
                            </div>
                        </div>
                    </div>
                    <!-- 第一 -->
                    <div class="rank-avatar rank-avatar-1">
                        <div class="rank-avatar-top">
                            <img v-if="isWeekly" class="rank-avatar-border" :src="imgs['rank-avatar-weekly-1']" />
                            <img v-else class="rank-avatar-border" :src="imgs['rank-avatar-1']" />
                            <img class="rank-avatar-img" :src="list[0] ? list[0].avatar : isWeekly ? imgs['nobody-weekly'] : imgs.nobody" />
                        </div>
                        <div class="rank-avatar-bottom">
                            <div class="rank-name">{{ list[0] ? list[0].nick_name : "" }}</div>
                            <div v-if="list[0]" class="rank-value">
                                <img :src="imgs.diamond2" />
                                <span>{{ list[0] ? list[0].reward : "-" }}</span>
                            </div>
                        </div>
                    </div>
                    <!-- 第三 -->
                    <div class="rank-avatar rank-avatar-3">
                        <div class="rank-avatar-top">
                            <img v-if="isWeekly" class="rank-avatar-border" :src="imgs['rank-avatar-weekly-3']" />
                            <img v-else class="rank-avatar-border" :src="imgs['rank-avatar-3']" />
                            <img class="rank-avatar-img" :src="list[2] ? list[2].avatar : isWeekly ? imgs['nobody-weekly'] : imgs.nobody" />
                        </div>
                        <div class="rank-avatar-bottom">
                            <div class="rank-name">{{ list[2] ? list[2].nick_name : "" }}</div>
                            <div v-if="list[2]" class="rank-value">
                                <img :src="imgs.diamond2" />
                                <span>{{ list[2] ? list[2].reward : "-" }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 领奖台 -->
                <img v-if="isWeekly" class="rank-podium" :src="imgs['podium-weekly']" />
                <img v-else class="rank-podium" :src="imgs['podium']" />
            </div>
        </div>
        <!-- 排名列表 -->
        <div v-if="list.length && list.length > 3" class="rank-list">
            <template v-for="(item, index) in list">
                <div v-if="index > 2" class="rank-item">
                    <div class="rank-num">{{ index + 1 }}</div>
                    <div class="rank-avatar" :style="{ backgroundImage: `url(${item.avatar})` }"></div>
                    <div class="rank-name">{{ item.nick_name }}</div>
                    <div class="rank-diamond">
                        <img :src="imgs.diamond2" />
                        <span>{{ item.reward }}</span>
                    </div>
                </div>
            </template>
        </div>
        <div v-else class="rank-list empty">{{ $t("Nobody on the list") }}</div>
        <!-- 我的排名 -->
        <div class="my-rank">
            <div class="my-rank-num">{{ self.rank || "99+" }}</div>
            <div class="my-avatar" :style="{ backgroundImage: `url(${self.avatar})` }"></div>
            <div class="my-name">{{ self.nick_name }}</div>
            <div class="my-diamond">
                <img :src="imgs.diamond2" />
                <span>{{ self.reward }}</span>
            </div>
        </div>
    </div>
</template>
<script>
import { getRankAPI } from "../api";
import moment from "moment";
import imgs from "../imgs";

export default {
    props: {
        uid: {
            type: Number | String,
        },
        visible: {
            type: Boolean,
        },
    },
    data() {
        return {
            imgs,
            tabIndex: 0,
            list: [],
            self: {},
        };
    },
    watch: {
        tabIndex(newValue) {
            if (newValue === 0) {
                this.query(1);
            } else if (newValue === 1) {
                this.query(2);
            }
        },
        visible(newValue) {
            if (newValue) {
                this.query(this.tabIndex + 1);
            }
        },
    },
    computed: {
        isWeekly() {
            return this.tabIndex === 1;
        },
    },
    methods: {
        /**
         * @description: 获取排行榜数据
         * @param {number} type 1日榜 2周榜
         * @return {*}
         */
        query(type = 1) {
            let now = moment();
            let params = null;
            if (type === 1) {
                params = {
                    uid: this.uid,
                    startTime: now.startOf("day").valueOf(),
                    endTime: now.endOf("day").valueOf(),
                };
            } else {
                params = {
                    uid: this.uid,
                    startTime: now.startOf("week").valueOf(),
                    endTime: now.endOf("week").valueOf(),
                };
            }
            getRankAPI(params).then((res) => {
                if (res.status === 1000) {
                    let rank_list = res.data.rank_list;
                    this.self = res.data.self || {};
                    this.list = rank_list.sort((a, b) => b.reward - a.reward);
                    this.list &&
                        this.list.forEach((item, index) => {
                            if (item.id === this.self.id) {
                                this.self.rank = index + 1;
                            }
                        });
                }
            });
        },
        back() {
            this.$emit("updateVisible", false);
        },
    },
};
</script>
<style scoped lang="less">
.rank-container {
    position: relative;
    background-color: #5800a0;
    display: flex;
    flex-direction: column;
    min-height: 100%;
    .rank-back {
        position: absolute;
        top: 0.15rem;
        left: 0;
        width: 0.8rem;
        height: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 5;
        img {
            width: 0.16rem;
            height: 0.32rem;
        }
    }
    .rank-title {
        width: 100%;
        font-size: 0.36rem;
        line-height: 1;
        font-weight: bold;
        color: #fff;
        text-align: center;
        position: absolute;
        top: 0.5rem;
        z-index: 2;
    }
    .rank-tabs-box {
        width: 100%;
        position: absolute;
        top: 1.4rem;
        display: flex;
        justify-content: center;
        .rank-tabs {
            display: flex;
            align-items: center;
            background-color: rgba(0, 0, 0, 0.35);
            padding: 0.05rem;
            border-radius: 0.34rem;
            z-index: 2;
            .rank-tab {
                width: 2rem;
                height: 0.6rem;
                font-size: 0.28rem;
                line-height: 1;
                font-weight: bold;
                color: #fff;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                border-radius: 0.3rem;
                &.active {
                    background-image: linear-gradient(to bottom, #76abff, #4648ff);
                }
            }
        }
    }

    .rank-content {
        .rank-hearder {
            position: relative;
            .rank-bg {
                width: 100%;
            }
            .rank-avatar-box {
                width: 100%;
                position: absolute;
                bottom: 1.8rem;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2;
                .rank-avatar {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    background-repeat: no-repeat;
                    background-size: cover;
                    background-position: center;
                    &.rank-avatar-1 {
                        margin-top: -1rem;
                        .rank-avatar-top {
                            width: 2.4rem;
                            height: 2.4rem;
                        }
                    }
                    .rank-avatar-top {
                        position: relative;
                        width: 2.2rem;
                        height: 2.2rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        .rank-avatar-border {
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                        }
                        .rank-avatar-img {
                            width: 1.4rem;
                            height: 1.4rem;
                            border-radius: 50%;
                        }
                    }
                    .rank-avatar-bottom {
                        font-size: 0.24rem;
                        line-height: 1;
                        font-weight: bold;
                        color: #fff;
                        text-align: center;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        .rank-name {
                            width: 2.2rem;
                            margin-bottom: 0.05rem;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                        .rank-value {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            img {
                                width: 0.24rem;
                                height: 0.21rem;
                                margin-right: 0.03rem;
                            }
                        }
                    }
                }
            }
            .rank-podium {
                width: 100%;
                position: absolute;
                left: 0;
                bottom: 0;
            }
        }
    }

    .rank-list {
        flex: auto;
        width: cal(100% - 0.7rem);
        box-sizing: border-box;
        margin: 0 0.35rem;
        padding-bottom: 1.7rem;
        display: flex;
        flex-direction: column;
        font-size: 0.24rem;
        font-weight: bold;
        color: #fff;
        background-color: #9410ff;
        border-top-left-radius: 0.2rem;
        border-top-right-radius: 0.2rem;
        box-shadow: inset 0px 1px 5px 0px rgba(255, 255, 255, 0.5);
        &.empty {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .rank-item {
            display: flex;
            align-items: center;
            margin-top: 0.36rem;
            .rank-num {
                width: 0.81rem;
                flex: none;
                text-align: center;
            }
            .rank-avatar {
                flex: none;
                width: 0.86rem;
                height: 0.86rem;
                box-sizing: border-box;
                border-radius: 50%;
                border: 0.02rem solid #af4bff;
                margin-right: 0.165rem;
                background-repeat: no-repeat;
                background-size: cover;
                background-position: center;
            }
            .rank-name {
                flex: auto;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .rank-diamond {
                flex: none;
                width: 1rem;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                margin-right: 0.24rem;
                img {
                    width: 0.24rem;
                    height: 0.21rem;
                    margin-right: 0.03rem;
                }
            }
        }
    }

    .my-rank {
        position: fixed;
        bottom: 0;
        left: 0.15rem;
        right: 0.15rem;
        height: 1.4rem;
        z-index: 5;
        box-sizing: border-box;
        background-color: #8d00ff;
        border-radius: 0.1rem;
        padding-left: 0.375rem;
        padding-right: 0.445rem;
        display: flex;
        align-items: center;
        font-size: 0.24rem;
        font-weight: bold;
        color: #fff;
        box-shadow: inset 0px 1px 5px 0px rgba(255, 255, 255, 1);
        .my-rank-num {
            flex: none;
            width: 0.625rem;
        }
        .my-avatar {
            flex: none;
            width: 0.86rem;
            height: 0.86rem;
            box-sizing: border-box;
            border-radius: 50%;
            border: 0.02rem solid #af4bff;
            margin-right: 0.165rem;
            background-repeat: no-repeat;
            background-size: cover;
            background-position: center;
        }
        .my-name {
            flex: auto;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .my-diamond {
            flex: none;
            width: 1rem;
            display: flex;
            align-items: center;
            img {
                width: 0.24rem;
                height: 0.21rem;
                margin-right: 0.03rem;
            }
        }
    }

    // 周榜样式
    &.weekly {
        background-color: #9f00a0;
        .rank-tabs-box {
            .rank-tabs {
                .rank-tab.active {
                    background-image: linear-gradient(to bottom, #ffd899, #ff8900);
                }
            }
        }
        .rank-list {
            background-color: #f920ff;
            .rank-item {
                .rank-avatar {
                    border: 0.02rem solid #ed26ff;
                }
            }
        }
        .my-rank {
            background-color: #e300ff;
            .my-avatar {
                border: 0.02rem solid #ed26ff;
            }
        }
    }
}
</style>
