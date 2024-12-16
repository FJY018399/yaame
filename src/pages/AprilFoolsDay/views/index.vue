<template>
    <div class="container" :class="[locale]">
        <custom-header color="white" />

        <div class="rule-icon" @click="ruleVisible = true">{{ $t("Rules") }}</div>
        <div class="prize-icon" @click="toPrize">
            <span style="margin-top: 0.55rem">{{ $t("Rewards") }}</span>
        </div>
        <!-- 倒计时 -->
        <div class="timer">
            <div class="timer-box" style="left: 1.2rem">{{ lastD }}</div>
            <div class="timer-box" style="left: 2.32rem">D</div>
            <div class="timer-box" style="left: 3.42rem">{{ lastH }}</div>
            <div class="timer-box" style="left: 4.6rem">{{ lastM }}</div>
            <div class="timer-box" style="left: 5.75rem">{{ lastS }}</div>
        </div>
        <!-- 事件 -->
        <div class="event-container">
            <div class="event-title">{{ $t("Event Gifts") }}</div>
            <div class="event-prize">
                <div class="event-prize-sub">
                    <img src="../../../assets/img/AprilFoolsDay/lucky.png" alt="" />
                </div>
                <div class="event-prize-img"></div>
                <div class="event-prize-name">{{ $t("Clown Box") }}</div>
                <div class="event-prize-value">
                    <img class="diamond" src="../../../assets/img/AprilFoolsDay/diamond.png" alt="" />
                    20
                </div>
            </div>
            <div class="event-content">{{ $t('During the event, you can receive the event rewards below after giving "Clown Box" lucky gifts to other users') }}</div>
        </div>
        <!-- tabs -->
        <div class="tabs">
            <div class="tab" :class="{ active: tabIndex === 0 }" @click="tabIndex = 0">{{ $t("Task") }}</div>
            <div class="tab" :class="{ active: tabIndex === 1 }" @click="tabIndex = 1">{{ $t("Ranking") }}</div>
        </div>
        <!-- 任务 -->
        <div v-show="tabIndex === 0" class="task-container">
            <div class="task-wrapper">
                <img class="roof" src="../../../assets/img/AprilFoolsDay/roof.png" />
                <div class="prize-table">
                    <div class="prize-table-header">
                        <div class="prize-table-tr" style="height: 2.78rem">{{ $t("Task") }}</div>
                        <div class="prize-table-tr" style="height: 2.54rem">{{ $t("Rewards") }}</div>
                        <div class="prize-table-tr" style="height: 3.35rem">{{ $t("Noble Rewards") }}</div>
                    </div>
                    <div ref="prize-table-wrapper" class="prize-table-wrapper">
                        <div class="prize-table-content">
                            <div class="prize-item" v-for="(item, index) in taskList" :key="item.level">
                                <!-- Task -->
                                <div class="prize-item-td prize-item-td1">
                                    <img v-if="index === 0" class="prize-item-arrow" style="top: 1.5rem" src="../../../assets/img/AprilFoolsDay/scroll-left.png" alt="" />
                                    <div class="prize-item-td1-top">
                                        <img src="../../../assets/img/AprilFoolsDay/clown.png" alt="" />
                                        <span>*{{ item.target_count }}</span>
                                    </div>
                                    <div class="prize-item-td1-text">{{ $t("Send {0} clown boxes", { n: item.target_count }) }}</div>
                                </div>
                                <!-- Reward -->
                                <div class="prize-item-td prize-item-td2">
                                    <img v-if="index === 0" class="prize-item-arrow" style="top: 1.18rem" src="../../../assets/img/AprilFoolsDay/scroll-left.png" alt="" />
                                    <div :class="[getDiamonds(item.normal_reward_count), 'diamonds', 'prize-item-td2-reward']"></div>
                                    <div class="prize-item-td2-value"><img src="../../../assets/img/AprilFoolsDay/diamond.png" alt="" />{{ item.normal_reward_count }}</div>
                                    <!-- 未完成 -->
                                    <div v-if="item.normal_reward_status === 0" class="prize-item-td2-btn disabled">{{ $t("Claim") }}</div>
                                    <!-- 完成未领取 -->
                                    <div v-else-if="item.normal_reward_status === 2" class="prize-item-td2-btn" @click="receive(item.task_index, 1)">{{ $t("Claim") }}</div>
                                    <!-- 完成已领取 -->
                                    <div v-else-if="item.normal_reward_status === 1" class="prize-item-td2-btn disabled">{{ $t("Claimed") }}</div>
                                </div>
                                <!-- Noble Reward -->
                                <div class="prize-item-td prize-item-td3">
                                    <img v-if="index === 0" class="prize-item-arrow" style="top: 1.46rem" src="../../../assets/img/AprilFoolsDay/scroll-left.png" alt="" />
                                    <div class="prize-item-td3-noble">
                                        <div class="prize-item-td3-noble-name">{{ item.min_noble_level }}</div>
                                        <div class="prize-item-td3-noble-reward">
                                            <div :class="[getNobleDiamonds(item.noble_reward_count), 'diamonds', 'prize-item-td3-noble-reward-img']"></div>
                                            <!-- <div class="prize-item-td3-noble-reward-badge"></div> -->
                                        </div>
                                        <div class="prize-item-td3-noble-value">
                                            <img src="../../../assets/img/AprilFoolsDay/diamond.png" alt="" />
                                            {{ item.noble_reward_count }}
                                        </div>
                                        <!-- 未完成 -->
                                        <div v-if="item.noble_reward_status === 0" class="prize-item-td3-noble-btn disabled">{{ $t("Claim") }}</div>
                                        <!-- 完成未领取 -->
                                        <div v-else-if="item.noble_reward_status === 2" class="prize-item-td3-noble-btn" @click="receive(item.task_index, 2)">{{ $t("Claim") }}</div>
                                        <!-- 完成已领取 -->
                                        <div v-else-if="item.noble_reward_status === 1" class="prize-item-td3-noble-btn disabled">{{ $t("Claimed") }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="footer">
                <div class="footer-text1">{{ $t('Send the "Clown Box" to receive rewards') }}</div>
                <div class="progress-bar">
                    <div class="progress" :class="{ right: progress < 12 }" :style="{ width: `${progress}%` }">
                        <img class="progress-img" src="../../../assets/img/AprilFoolsDay/clown.png" />
                        <div class="progress-text">{{ info.current_box_count }}/{{ info.current_index_target_count }}</div>
                    </div>
                </div>
                <div class="footer-text2">{{ $t('Send {0} more "Clown Boxes" to receive more diamonds', { n: info.current_index_target_count ? (info.current_index_target_count - info.current_box_count) > 0 ? info.current_index_target_count - info.current_box_count : 0 : "-" }) }}</div>
            </div>
        </div>
        <!-- 排行 -->
        <div v-show="tabIndex === 1" class="rank-container">
            <div class="rank-top">
                <div class="rank-top-avatar rank-top-avatar2" style="margin-top: 1.08rem" @click="toDetail(rankList[1] ? rankList[1].scheme_url : '')">
                    <img v-if="rankList[1]" class="rank-top-avatar-img" :src="rankList[1].subject_icon" alt="" />
                    <div v-else class="rank-top-avatar-img no-user">
                        <img src="../../../assets/img/AprilFoolsDay/no-user.png" alt="" />
                    </div>
                    <img class="rank-top-avatar-border" src="../../../assets/img/AprilFoolsDay/top2.png" alt="" />
                </div>
                <div class="rank-top-avatar rank-top-avatar1" @click="toDetail(rankList[0] ? rankList[0].scheme_url : '')">
                    <img v-if="rankList[0]" class="rank-top-avatar-img" style="width: 1.6rem; height: 1.6rem; left: 0.34rem" :src="rankList[0].subject_icon" alt="" />
                    <div v-else class="rank-top-avatar-img no-user" style="width: 1.6rem; height: 1.6rem; left: 0.34rem">
                        <img src="../../../assets/img/AprilFoolsDay/no-user.png" alt="" />
                    </div>
                    <img class="rank-top-avatar-border" src="../../../assets/img/AprilFoolsDay/top1.png" alt="" />
                </div>
                <div class="rank-top-avatar rank-top-avatar3" style="margin-top: 1.08rem" @click="toDetail(rankList[2] ? rankList[2].scheme_url : '')">
                    <img v-if="rankList[2]" class="rank-top-avatar-img" :src="rankList[2].subject_icon" alt="" />
                    <div v-else class="rank-top-avatar-img no-user">
                        <img src="../../../assets/img/AprilFoolsDay/no-user.png" alt="" />
                    </div>
                    <img class="rank-top-avatar-border" src="../../../assets/img/AprilFoolsDay/top3.png" alt="" />
                </div>
                <!-- 第二名 -->
                <div class="rank-top-info rank-top-info2">
                    <template v-if="rankList[1]">
                        <div class="rank-top-name ellipsis" @click="toDetail(rankList[1] ? rankList[1].scheme_url : '')">{{ rankList[1] ? rankList[1].subject_name : "-" }}</div>
                        <div class="rank-top-id ellipsis">ID: {{ rankList[1] ? rankList[1].peanut_id : "-" }}</div>
                        <div class="rank-top-value">
                            <img class="diamond" src="../../../assets/img/AprilFoolsDay/clown.png" alt="" />
                            {{ rankList[1] ? rankList[1].subject_score : "-" }}
                        </div>
                    </template>
                </div>
                <!-- 第一名 -->
                <div class="rank-top-info rank-top-info1">
                    <template v-if="rankList[0]">
                        <div class="rank-top-name ellipsis" @click="toDetail(rankList[0] ? rankList[0].scheme_url : '')">{{ rankList[0] ? rankList[0].subject_name : "-" }}</div>
                        <div class="rank-top-id ellipsis">ID: {{ rankList[0] ? rankList[0].peanut_id : "-" }}</div>
                        <div class="rank-top-value">
                            <img class="diamond" src="../../../assets/img/AprilFoolsDay/clown.png" alt="" />
                            {{ rankList[0] ? rankList[0].subject_score : "-" }}
                        </div>
                    </template>
                </div>
                <!-- 第三名 -->
                <div class="rank-top-info rank-top-info3">
                    <template v-if="rankList[2]">
                        <div class="rank-top-name ellipsis" @click="toDetail(rankList[2] ? rankList[2].scheme_url : '')">{{ rankList[2] ? rankList[2].subject_name : "-" }}</div>
                        <div class="rank-top-id ellipsis">ID: {{ rankList[2] ? rankList[2].peanut_id : "-" }}</div>
                        <div class="rank-top-value">
                            <img class="diamond" src="../../../assets/img/AprilFoolsDay/clown.png" alt="" />
                            {{ rankList[2] ? rankList[2].subject_score : "-" }}
                        </div>
                    </template>
                </div>
            </div>
            <div v-if="rankList.length > 3" class="rank-list">
                <template v-for="(item, index) in rankList">
                    <template v-if="index > 2">
                        <div class="rank-item" :key="index">
                            <div class="rank-item-num">{{ item.subject_rank }}</div>
                            <div class="rank-item-avatar" :style="{ backgroundImage: `url(${item.subject_icon})` }" @click="toDetail(item.scheme_url)">
                                <img src="../../../assets/img/AprilFoolsDay/avatar-border.png" alt="" />
                            </div>
                            <div class="rank-item-info">
                                <div class="rank-item-name ellipsis" @click="toDetail(item.scheme_url)">{{ item.subject_name }}</div>
                                <div class="rank-item-id ellipsis">ID:{{ item.peanut_id }}</div>
                            </div>
                            <div class="rank-item-value">
                                <img class="diamond" src="../../../assets/img/AprilFoolsDay/clown.png" alt="" />
                                {{ item.subject_score }}
                            </div>
                        </div>
                    </template>
                </template>
            </div>
            <div v-else-if="rankList.length" style="width: 100%; height: 4rem">
            </div>
            <div v-else class="empty">
                <img src="../../../assets/img/AprilFoolsDay/empty.png" alt="" />
                <span>{{ $t("No users") }}</span>
            </div>
            <div class="my-rank">
                <div class="my-rank-num">{{ !myRank.subject_rank || myRank.subject_rank > 99 ? "99+" : myRank.subject_rank }}</div>
                <div class="my-rank-avatar" :style="{ backgroundImage: `url(${myRank.subject_icon})` }" @click="toDetail(myRank.scheme_url)">
                    <img src="../../../assets/img/AprilFoolsDay/avatar-border.png" alt="" />
                </div>
                <div class="my-rank-info">
                    <div class="ellipsis" @click="toDetail(myRank.scheme_url)">{{ myRank.subject_name || "-" }}</div>
                    <div>ID: {{ myRank.peanut_id }}</div>
                </div>
                <div class="my-rank-value">
                    <img class="diamond" src="../../../assets/img/AprilFoolsDay/clown.png" alt="" />
                    {{ Number(myRank.subject_score) || "0" }}
                </div>
            </div>
        </div>

        <!-- 规则弹窗 -->
        <van-popup v-model="ruleVisible">
            <div class="popup-wrapper">
                <div class="popup-card rule-popup-card">
                    <div class="rule-popup-title">{{ $t("Event rules") }}</div>
                    <div class="rule-popup-content">
                        <div>{{ $t("1. Activity time: April 1, 2024 to April 7, 2024") }}</div>
                        <div>{{ $t('2. During the event, you can receive diamond rewards by sending "clown boxes". Nobles can get more diamond rewards. The more "clown boxes" you send, the richer the rewards you can receive') }}</div>
                        <div>{{ $t("3. After the event, the top 5 users will receive ranking rewards.") }}</div>
                        <div>{{ $t("4. Please claim the task rewards on April 8, 2024. The event page will be offline at 24:00 on April 8, 2024.") }}</div>
                        <div>{{ $t("5. The final interpretation right of the event belongs to Yaame") }}</div>
                    </div>
                </div>
                <img class="popup-close" src="../../../assets/img/AprilFoolsDay/close.png" @click="ruleVisible = false" />
            </div>
        </van-popup>
    </div>
</template>
<script>
import customHeader from "@/components/common/header.vue";
import { receiveAPI, getInfoAPI, getRankListAPI } from "../api";
import moment from "moment";
import { getLanguage } from "../../../lib/device";
import { Toast } from "vant";
const languageMap = {
    en: "ENGLISH",
    id: "INDONESIAN",
    zh: "ZH_CN",
    tw: "ZH_FT",
    ar: "ARABIC",
};
export default {
    components: { customHeader },
    data() {
        return {
            locale: "en",
            tabIndex: 0,
            ruleVisible: false,

            // 倒计时
            beginTime: 0,
            endTime: 0,
            now: 0, // 当前时间 时间戳

            // 任务信息
            info: {},
            taskList: [],
            receiving: false,

            // 排行榜
            rankList: [],
            myRank: {},

            // 钻石图标档位
            diamonds: [70, 90, 150, 250, 700, 900, 1200, 2000, 2500, 3000, 4000, 6000, 8000],
            nobelDiamonds: [
                80, 110, 200, 350, 800, 1600, 1800, 3000, 3500, 4000, 6000, 9000, 12000
            ]
        };
    },
    computed: {
        progress() {
            let per = 0;
            if (this.info.current_index_target_count) {
                per = (this.info.current_box_count / this.info.current_index_target_count) * 100;
                if (this.info.current_box_count / this.info.current_index_target_count > 1) {
                    return 100;
                }
            }
            return per;
        },
        lastD() {
            if (this.now && this.endTime && this.now < this.endTime) {
                let duration = moment.duration(this.endTime - this.now);
                return duration.days();
            } else {
                return "0";
            }
        },
        lastH() {
            if (this.now && this.endTime && this.now < this.endTime) {
                let duration = moment.duration(this.endTime - this.now);
                return duration.hours() < 10 ? "0" + duration.hours() : duration.hours();
            } else {
                return "00";
            }
        },
        lastM() {
            if (this.now && this.endTime && this.now < this.endTime) {
                let duration = moment.duration(this.endTime - this.now);
                return duration.minutes() < 10 ? "0" + duration.minutes() : duration.minutes();
            } else {
                return "00";
            }
        },
        lastS() {
            if (this.now && this.endTime && this.now < this.endTime) {
                let duration = moment.duration(this.endTime - this.now);
                return duration.seconds() < 10 ? "0" + duration.seconds() : duration.seconds();
            } else {
                return "00";
            }
        },
    },
    watch: {
        tabIndex(n) {
            if (n === 0) {
                this.query();
            } else if (n === 1) {
                this.getRank();
            }
        },
    },
    created() {
        document.title = this.$t("April Fool's Day");

        this.locale = this.$route.query.language || getLanguage() || "en";
        if (["zh-hk", "zh-tw", "zh-mo", "zh-cn"].indexOf(this.locale) > -1) {
            let localEnum = {
                "zh-hk": "tw",
                "zh-tw": "tw",
                "zh-mo": "tw",
                "zh-cn": "zh",
            };
            this.locale = localEnum[this.locale];
        }
    },
    mounted() {
        this.query(() => {
            this.scrollTo();
            this.initTime();
        });
    },
    methods: {
        // 跳转用户详情
        toDetail(url) {
            if (url) location.href = url;
        },
        // 领取
        receive(taskIndex, rewardType) {
            if (this.receiving) return false;
            this.receiving = true;
            receiveAPI({ languageType: languageMap[this.locale], taskIndex, rewardType })
                .then((res) => {
                    if (res.status === 1000) {
                        this.query();
                        Toast.success(this.$t("receiveSuccess"));
                    } else {
                        Toast(res.desc);
                    }
                    this.receiving = false;
                })
                .catch((err) => {
                    this.receiving = false;
                });
        },
        // 获取钻石icon样式
        getDiamonds(d) {
            let name = "dismonds_8000";
            for (let i = 0; i < this.diamonds.length; i++) {
                if (d <= this.diamonds[i]) {
                    name = `dismonds_${this.diamonds[i]}`;
                    break;
                }
            }
            return name;
        },
        // 获取贵族钻石icon样式
        getNobleDiamonds(d) {
            let name = "dismonds_12000";
            for (let i = 0; i < this.nobelDiamonds.length; i++) {
                if (d <= this.nobelDiamonds[i]) {
                    name = `dismonds_${this.nobelDiamonds[i]}`;
                    break;
                }
            }
            return name;
        },
        // 请求首页信息
        query(cb) {
            getInfoAPI({ languageType: languageMap[this.locale] }).then((res) => {
                if (res.status === 1000) {
                    this.beginTime = res.data.activity_begin_time;
                    this.endTime = res.data.activity_end_time;
                    this.info = res.data.fools_day_task_info;
                    this.taskList = res.data.fools_day_task_info.fools_day_task_list;
                    if (cb && typeof cb === "function") cb();
                }
            });
        },
        // 请求排行榜数据
        getRank() {
            getRankListAPI({ languageType: languageMap[this.locale], rank_type: 'FOOLS_DAY_ACTIVITY', rank_group_flag: 'activity_fools_day' }).then((res) => {
                if (res.status === 1000) {
                    this.rankList = res.data.content || [];
                    this.myRank = res.data.my_rank;
                }
            });
        },
        toPrize() {
            this.$router.push("prize");
        },
        // 任务位置定位
        scrollTo() {
            let n = this.info.current_index;
            let timer = setInterval(() => {
                let prizeItem = document.querySelector(".prize-item");
                if (prizeItem) {
                    let w = prizeItem.offsetWidth;
                    if (n === 0) {
                        this.$refs["prize-table-wrapper"].scrollLeft = w * (n - 1); 
                    } else {
                        this.$refs["prize-table-wrapper"].scrollLeft = (w * (n - 1)) - w; 
                    }
                    clearInterval(timer);
                }
            }, 20);
        },
        // 初始化倒计时
        initTime() {
            let now = moment().valueOf();
            this.now = now;
            if (now < this.endTime) {
                let timer = setInterval(() => {
                    if (this.now >= this.endTime) {
                        clearInterval(timer);
                    }
                    this.now += 1000;
                }, 1000);
            }
        },
    },
};
</script>
<style scoped lang="less">
.container {
    position: relative;
    min-height: 100vh;
    background-color: #280130;
    background-repeat: no-repeat;
    background-position: top;
    background-size: contain;
    background-image: url("../../../assets/img/AprilFoolsDay/bg-en.png");
    display: flex;
    flex-direction: column;
    align-items: center;
    &.zh {
        background-image: url("../../../assets/img/AprilFoolsDay/bg-zh.png");
    }
    &.tw {
        background-image: url("../../../assets/img/AprilFoolsDay/bg-tw.png");
    }
    &.id {
        background-image: url("../../../assets/img/AprilFoolsDay/bg-id.png");
    }
    &.ar {
        background-image: url("../../../assets/img/AprilFoolsDay/bg-ar.png");
    }
    .diamonds {
        width: 1.2rem;
        height: 1.2rem;
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        &.dismonds_70 {
            background-image: url("../../../assets/img/AprilFoolsDay/diamonds/70.png");
        }
        &.dismonds_80 {
            background-image: url("../../../assets/img/AprilFoolsDay/diamonds/80.png");
        }
        &.dismonds_90 {
            background-image: url("../../../assets/img/AprilFoolsDay/diamonds/90.png");
        }
        &.dismonds_110 {
            background-image: url("../../../assets/img/AprilFoolsDay/diamonds/90.png");
        }
        &.dismonds_150 {
            background-image: url("../../../assets/img/AprilFoolsDay/diamonds/150.png");
        }
        &.dismonds_200 {
            background-image: url("../../../assets/img/AprilFoolsDay/diamonds/200.png");
        }
        &.dismonds_250 {
            background-image: url("../../../assets/img/AprilFoolsDay/diamonds/250.png");
        }
        &.dismonds_350 {
            background-image: url("../../../assets/img/AprilFoolsDay/diamonds/350.png");
        }
        &.dismonds_700 {
            background-image: url("../../../assets/img/AprilFoolsDay/diamonds/700.png");
        }
        &.dismonds_800 {
            background-image: url("../../../assets/img/AprilFoolsDay/diamonds/700.png");
        }
        &.dismonds_900 {
            background-image: url("../../../assets/img/AprilFoolsDay/diamonds/900.png");
        }
        &.dismonds_1200 {
            background-image: url("../../../assets/img/AprilFoolsDay/diamonds/1200.png");
        }
        &.dismonds_1600 {
            background-image: url("../../../assets/img/AprilFoolsDay/diamonds/1600.png");
        }
        &.dismonds_1800 {
            background-image: url("../../../assets/img/AprilFoolsDay/diamonds/1800.png");
        }
        &.dismonds_2000 {
            background-image: url("../../../assets/img/AprilFoolsDay/diamonds/2000.png");
        }
        &.dismonds_2500 {
            background-image: url("../../../assets/img/AprilFoolsDay/diamonds/2500.png");
        }
        &.dismonds_3000 {
            background-image: url("../../../assets/img/AprilFoolsDay/diamonds/3000.png");
        }
        &.dismonds_3500 {
            background-image: url("../../../assets/img/AprilFoolsDay/diamonds/3000.png");
        }
        &.dismonds_4000 {
            background-image: url("../../../assets/img/AprilFoolsDay/diamonds/4000.png");
        }
        &.dismonds_6000 {
            background-image: url("../../../assets/img/AprilFoolsDay/diamonds/6000.png");
        }
        &.dismonds_8000 {
            background-image: url("../../../assets/img/AprilFoolsDay/diamonds/8000.png");
        }
        &.dismonds_9000 {
            background-image: url("../../../assets/img/AprilFoolsDay/diamonds/9000.png");
        }
        &.dismonds_12000 {
            background-image: url("../../../assets/img/AprilFoolsDay/diamonds/12000.png");
        }
    }
    .ellipsis {
        white-space: nowrap; /* 防止文字折行 */
        overflow: hidden; /* 超出部分隐藏 */
        text-overflow: ellipsis; /* 超出部分显示省略号 */
    }
    .diamond {
        width: 0.22rem;
        height: 0.19rem;
        margin-right: 0.04rem;
    }
    .timer {
        position: absolute;
        width: 100%;
        top: 7.12rem;
        left: 0;
        height: 0.5rem;
        .timer-box {
            width: 0.5rem;
            position: absolute;
            top: 0;
            font-size: 0.36rem;
            line-height: 0.5rem;
            color: #ffd07c;
            text-align: center;
        }
    }
    .rule-icon {
        position: fixed;
        top: 3.28rem;
        right: 0;
        width: 1.46rem;
        height: 0.6rem;
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        background-image: url("../../../assets/img/AprilFoolsDay/rule-icon.png");
        font-size: 0.26rem;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9;
    }
    .prize-icon {
        position: fixed;
        z-index: 9;
        top: 4.21rem;
        right: 0;
        width: 1.46rem;
        height: 1.24rem;
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        background-image: url("../../../assets/img/AprilFoolsDay/prize-icon.png");
        font-size: 0.26rem;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .event-container {
        margin-top: 8.12rem;
        position: relative;
        width: 7.15rem;
        height: 3.35rem;
        margin-bottom: 0.37rem;
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        background-image: url("../../../assets/img/AprilFoolsDay/event-bg.png");
        .event-title {
            color: #ffd07c;
            font-size: 0.32rem;
            line-height: 0.45rem;
            position: absolute;
            top: 0.17rem;
            width: 100%;
            text-align: center;
        }
        .event-prize {
            width: 1.77rem;
            height: 2.34rem;
            position: absolute;
            top: 0.79rem;
            left: 0.8rem;
            background-repeat: no-repeat;
            background-position: center;
            background-size: contain;
            background-image: url("../../../assets/img/AprilFoolsDay/event-prize.png");
            font-size: 0.22rem;
            line-height: 0.3rem;
            color: #fff;
            .event-prize-sub {
                position: absolute;
                top: 0.13rem;
                right: 0.35rem;
                background-color: #bb0ad1;
                width: 0.33rem;
                height: 0.27rem;
                display: flex;
                justify-content: center;
                align-items: center;
                border-top-right-radius: 0.08rem;
                border-bottom-left-radius: 0.06rem;
                z-index: 2;
                img {
                    width: 0.2rem;
                    height: 0.2rem;
                }
            }
            .event-prize-img {
                width: 0.87rem;
                height: 0.85rem;
                position: absolute;
                top: 0.28rem;
                left: 0.46rem;
                background-repeat: no-repeat;
                background-position: center;
                background-size: contain;
                background-image: url("../../../assets/img/AprilFoolsDay/clown.png");
            }
            .event-prize-name {
                text-align: center;
                width: 100%;
                position: absolute;
                left: 0;
                bottom: 0.55rem;
            }
            .event-prize-value {
                width: 100%;
                position: absolute;
                left: 0;
                bottom: 0.28rem;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
        .event-content {
            position: absolute;
            top: 0.8rem;
            right: 0.68rem;
            width: 3.84rem;
            height: 2.34rem;
            box-sizing: border-box;
            background-color: rgba(65, 1, 53, 0.7);
            padding: 0.19rem 0.2rem;
            border-radius: 0.08rem;
            font-size: 0.2rem;
            line-height: 0.28rem;
            color: #fff;
        }
    }
    .tabs {
        display: flex;
        justify-content: center;
        align-items: center;
        .tab {
            width: 2.64rem;
            height: 1.22rem;
            box-sizing: border-box;
            padding-top: 0.15rem;
            color: #fff;
            font-size: 0.36rem;
            font-weight: bold;
            background-repeat: no-repeat;
            background-position: center;
            background-size: contain;
            background-image: url("../../../assets/img/AprilFoolsDay/tab.png");
            margin: 0 0.25rem;
            display: flex;
            justify-content: center;
            align-items: center;
            &.active {
                padding-left: 0.1rem;
                background-image: url("../../../assets/img/AprilFoolsDay/tab_active.png");
                transform: scale(1.05);
            }
        }
    }
    .task-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 1.64rem;
        padding-bottom: 1.68rem;
        .task-wrapper {
            width: 7.1rem;
            position: relative;
            margin-bottom: 0.14rem;
            .roof {
                width: 7.36rem;
                height: 1.77rem;
                position: absolute;
                top: -1.25rem;
                left: -0.1rem;
                z-index: 3;
            }
            .prize-table {
                width: 7.1rem;
                display: flex;
                .prize-table-header {
                    flex: none;
                    width: 1.24rem;
                    border: 0.04rem solid #ff79fc;
                    border-top-left-radius: 0.2rem;
                    border-bottom-left-radius: 0.2rem;
                    display: flex;
                    flex-direction: column;
                    background-color: #860e6f;
                    box-shadow: 7px 0px 10px 0px rgba(0, 0, 0, 0.2);
                    position: relative;
                    z-index: 2;
                    .prize-table-tr {
                        border-bottom: 0.04rem solid #ff79fc;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        font-size: 0.3rem;
                        line-height: 0.4rem;
                        color: #fff;
                        text-align: center;
                        &:last-child {
                            border: none;
                        }
                    }
                }
                .prize-table-wrapper {
                    flex: auto;
                    background-color: #5c024a;
                    border: 0.04rem solid #ff79fc;
                    border-left: none;
                    border-top-right-radius: 0.2rem;
                    border-bottom-right-radius: 0.2rem;
                    overflow: auto;
                    .prize-table-content {
                        display: flex;
                        .prize-item {
                            flex: none;
                            width: 2.32rem;
                            display: flex;
                            flex-direction: column;
                            border-right: 0.04rem solid #ff79fc;
                            &:last-child {
                                border: none;
                            }
                            .prize-item-td {
                                position: relative;
                                border-bottom: 0.04rem solid #ff79fc;
                                .prize-item-arrow {
                                    width: 0.12rem;
                                    height: 0.21rem;
                                    position: absolute;
                                    left: 0.05rem;
                                    z-index: 3;
                                }
                                &:last-child {
                                    border: none;
                                }
                            }
                            .prize-item-td1 {
                                height: 2.78rem;
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                font-size: 0.22rem;
                                line-height: 0.26rem;
                                color: #fff;
                                .prize-item-td1-top {
                                    margin-top: 0.77rem;
                                    height: 1rem;
                                    display: flex;
                                    align-items: center;
                                    margin-bottom: 0.25rem;
                                    img {
                                        width: 0.94rem;
                                        height: 0.94rem;
                                        background-repeat: no-repeat;
                                        background-position: center;
                                        background-size: contain;
                                        margin-right: 0.05rem;
                                    }
                                }
                                .prize-item-td1-text {
                                    text-align: center;
                                    margin: 0 0.2rem;
                                }
                            }
                            .prize-item-td2 {
                                height: 2.54rem;
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;
                                .prize-item-td2-reward {
                                    width: 1.2rem;
                                    height: 1.2rem;
                                    margin-bottom: 0.02rem;
                                    background-repeat: no-repeat;
                                    background-position: center;
                                    background-size: contain;
                                }
                                .prize-item-td2-value {
                                    font-size: 0.22rem;
                                    line-height: 0.3rem;
                                    font-weight: bold;
                                    color: #fff;
                                    margin-bottom: 0.12rem;
                                    display: flex;
                                    align-items: center;
                                    img {
                                        width: 0.22rem;
                                        height: 0.19rem;
                                        margin-right: 0.04rem;
                                    }
                                }
                                .prize-item-td2-btn {
                                    width: 1.49rem;
                                    height: 0.5rem;
                                    font-size: 0.22rem;
                                    background-repeat: no-repeat;
                                    background-position: center;
                                    background-size: contain;
                                    background-image: url("../../../assets/img/AprilFoolsDay/btn.png");
                                    color: #fff;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    &.disabled {
                                        background-image: url("../../../assets/img/AprilFoolsDay/btn_disabled.png");
                                    }
                                }
                            }
                            .prize-item-td3 {
                                height: 3.35rem;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                .prize-item-td3-noble {
                                    width: 1.83rem;
                                    height: 2.95rem;
                                    border: 0.02rem solid #fff7be;
                                    border-radius: 0.24rem;
                                    background-color: #e606d0;
                                    display: flex;
                                    flex-direction: column;
                                    align-items: center;
                                    box-sizing: border-box;
                                    .prize-item-td3-noble-name {
                                        font-size: 0.22rem;
                                        line-height: 0.3rem;
                                        color: #ffe981;
                                    }
                                    .prize-item-td3-noble-reward {
                                        position: relative;
                                        width: 1.6rem;
                                        height: 1.6rem;
                                        background-color: #940976;
                                        border: 0.02rem solid #fff7be;
                                        margin-bottom: 0.03rem;
                                        border-radius: 0.16rem;
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        .prize-item-td3-noble-reward-img {
                                            width: 1.2rem;
                                            height: 1.2rem;
                                        }
                                        .prize-item-td3-noble-reward-badge {
                                            position: absolute;
                                            top: 0;
                                            right: 0;
                                            width: 0.5rem;
                                            height: 0.5rem;
                                            background-repeat: no-repeat;
                                            background-position: center;
                                            background-size: contain;
                                            background-color: #fff;
                                        }
                                    }
                                    .prize-item-td3-noble-value {
                                        display: flex;
                                        align-items: center;
                                        font-size: 0.22rem;
                                        line-height: 0.3rem;
                                        color: #fff;
                                        margin-bottom: 0.08rem;
                                        img {
                                            width: 0.22rem;
                                            height: 0.19rem;
                                            margin-right: 0.04rem;
                                        }
                                    }
                                    .prize-item-td3-noble-btn {
                                        width: 1.49rem;
                                        height: 0.5rem;
                                        font-size: 0.22rem;
                                        background-repeat: no-repeat;
                                        background-position: center;
                                        background-size: contain;
                                        background-image: url("../../../assets/img/AprilFoolsDay/btn.png");
                                        color: #fff;
                                        display: flex;
                                        justify-content: center;
                                        align-items: center;
                                        &.disabled {
                                            background-image: url("../../../assets/img/AprilFoolsDay/btn_disabled.png");
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        .footer {
            width: 100vw;
            height: 1.68rem;
            background-repeat: no-repeat;
            background-position: center;
            background-size: contain;
            background-image: url("../../../assets/img/AprilFoolsDay/footer.png");
            display: flex;
            flex-direction: column;
            align-items: center;
            position: fixed;
            bottom: 0;
            left: 0;
            z-index: 10;
            .footer-text1 {
                font-size: 0.26rem;
                line-height: 0.32rem;
                color: #fff;
                margin-top: 0.47rem;
                margin-bottom: 0.21rem;
            }
            .progress-bar {
                width: 6.44rem;
                height: 0.2rem;
                border-radius: 0.1rem;
                border: 0.01rem solid #b5118e;
                background-color: #61044c;
                margin-bottom: 0.08rem;
                .progress {
                    height: 0.2rem;
                    position: relative;
                    background: linear-gradient(180deg, #ffd16c 0%, #e96402 100%);
                    border-radius: 0.1rem;
                    &.right {
                        .progress-img {
                            right: -0.9rem;
                        }
                        .progress-text {
                            right: -0.5rem;
                        }
                    }
                    .progress-img {
                        position: absolute;
                        right: 0;
                        bottom: 0;
                        width: 0.35rem;
                        height: 0.35rem;
                    }
                    .progress-text {
                        position: absolute;
                        font-size: 0.16rem;
                        line-height: 0.2rem;
                        color: #ffdcff;
                        text-align: right;
                        right: 0.4rem;
                    }
                }
            }
            .footer-text2 {
                font-size: 0.18rem;
                line-height: 0.32rem;
                color: #fff;
            }
        }
    }
    .rank-container {
        margin-top: 0.2rem;
        .rank-top {
            position: relative;
            width: 100%;
            width: 7.5rem;
            height: 5.9rem;
            background-repeat: no-repeat;
            background-position: center;
            background-size: contain;
            background-image: url("../../../assets/img/AprilFoolsDay/rostrum.png");
            display: flex;
            justify-content: center;
            .rank-top-avatar {
                width: 100%;
                position: relative;
                width: 2.3rem;
                height: 2.17rem;
                margin-top: 0.16rem;
                .rank-top-avatar-img {
                    position: absolute;
                    top: 0.3rem;
                    left: 0.2rem;
                    width: 1.74rem;
                    height: 1.74rem;
                    border-radius: 50%;
                    &.no-user {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        background-color: #ccc;
                        img {
                            width: 0.68rem;
                            height: 0.68rem;
                        }
                    }
                }
                .rank-top-avatar-border {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 2;
                }
            }
            .rank-top-info {
                position: absolute;
                width: 1.9rem;
                height: 0.93rem;
                display: flex;
                flex-direction: column;
                align-items: center;
                color: #b04807;
                font-size: 0.24rem;
                line-height: 0.33rem;
                .rank-top-name {
                    width: 2rem;
                    text-align: center;
                }
                .rank-top-id {
                    width: 2rem;
                    text-align: center;
                }
                .rank-top-value {
                    width: 2rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                &.rank-top-info2 {
                    bottom: 0.35rem;
                    left: 0.61rem;
                }
                &.rank-top-info1 {
                    bottom: 0.9rem;
                    left: 2.73rem;
                }
                &.rank-top-info3 {
                    bottom: 0.35rem;
                    right: 0.61rem;
                }
            }
        }
        .rank-list {
            position: relative;
            margin-top: -0.3rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            z-index: 2;
            margin-bottom: 1.7rem;
            .rank-item {
                width: 7rem;
                height: 1.92rem;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.24rem;
                line-height: 0.33rem;
                color: #a90590;
                margin-bottom: 0.14rem;
                background-repeat: no-repeat;
                background-position: center;
                background-size: contain;
                background-image: url("../../../assets/img/AprilFoolsDay/rank-bg.png");
                .rank-item-num {
                    flex: none;
                    width: 0.63rem;
                    margin-left: 0.66rem;
                }
                .rank-item-avatar {
                    flex: none;
                    width: 0.98rem;
                    height: 0.98rem;
                    background-repeat: no-repeat;
                    background-position: center;
                    background-size: contain;
                    margin-right: 0.15rem;
                    border-radius: 50%;
                    img {
                        width: 0.98rem;
                        height: 0.98rem;
                    }
                }
                .rank-item-info {
                    flex: auto;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    overflow: hidden;
                }
                .rank-item-value {
                    width: 1.5rem;
                    flex: none;
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    margin-right: 0.51rem;
                }
            }
        }
        .empty {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: 0.24rem;
            line-height: 0.33rem;
            margin-top: 1.28rem;
            margin-bottom: 2.5rem;
            color: #fff;
            img {
                width: 1rem;
                height: 1.2rem;
                margin-bottom: 0.3rem;
            }
        }
        .my-rank {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100vw;
            height: 1.66rem;
            display: flex;
            align-items: center;
            padding-top: 0.3rem;
            box-sizing: border-box;
            color: #fff;
            background-repeat: no-repeat;
            background-position: center;
            background-size: contain;
            background-image: url("../../../assets/img/AprilFoolsDay/rank-footer.png");
            z-index: 2;
            .my-rank-num {
                width: 0.8rem;
                margin-left: 0.74rem;
                font-size: 0.3rem;
                line-height: 0.42rem;
            }
            .my-rank-avatar {
                flex: none;
                width: 0.98rem;
                height: 0.98rem;
                background-repeat: no-repeat;
                background-position: center;
                background-size: contain;
                margin-right: 0.15rem;
                border-radius: 50%;
                img {
                    width: 0.98rem;
                    height: 0.98rem;
                }
            }
            .my-rank-info {
                display: flex;
                flex-direction: column;
                justify-content: center;
                flex: auto;
                font-size: 0.24rem;
                line-height: 0.33rem;
                overflow: hidden;
            }
            .my-rank-value {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                font-size: 0.26rem;
                margin-right: 0.82rem;
            }
        }
    }
    .popup-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        .rule-popup-card {
            width: 5.49rem;
            height: 7.78rem;
            background-repeat: no-repeat;
            background-position: center;
            background-size: contain;
            background-image: url("../../../assets/img/AprilFoolsDay/rule-bg.png");
            display: flex;
            flex-direction: column;
            align-items: center;
            color: #fff;
            margin-bottom: 0.72rem;
            .rule-popup-title {
                font-size: 0.32rem;
                line-height: 0.48rem;
                color: #fff;
                text-align: center;
                margin-top: 1.23rem;
                font-weight: bold;
            }
            .rule-popup-content {
                width: 3.66rem;
                height: 3.6rem;
                margin-top: 0.92rem;
                overflow-y: auto;
                font-size: 0.24rem;
                line-height: 0.3rem;
            }
        }
        .popup-close {
            width: 0.5rem;
            height: 0.5rem;
        }
    }
}
</style>
<style>
.van-popup {
    background-color: transparent;
    overflow: visible;
}
</style>
