<template>
    <div class="main">
        <!-- 预加载 -->
        <div v-if="!hasLoadedImgs" class="preload">
            <img v-if="locale === 'en'" src="../../assets/img/fruit_turntable/loading.png" />
            <img v-if="locale === 'id'" src="../../assets/img/fruit_turntable/loading-id.png" />
            <img v-if="locale === 'zh'" src="../../assets/img/fruit_turntable/loading-zh.png" />
            <img v-if="locale === 'tw'" src="../../assets/img/fruit_turntable/loading-tw.png" />
            <img v-if="locale === 'ar'" src="../../assets/img/fruit_turntable/loading-ar.png" />
        </div>
        <!-- 首页 -->
        <div v-show="hasLoadedImgs && !rankVisible" class="container" :class="{ bingo: bingoActive }">
            <!-- 中奖音效 -->
            <audio ref="sound" src="https://yaame-static.yaame.io/admin/a7e7b958b690c93f6ee1e66ebecc916e.mp3" @error="handleAudioError"></audio>
            <template v-for="item in diamondsList">
                <img v-if="item.bettingActive" class="diamonds" :class="{ active: item.bettingActive }" :style="{ left: item.diamondsLeft + 'rem', top: item.diamondsTop + 'rem' }" :src="imgs.diamonds" />
            </template>

            <!-- 等待上一轮 -->
            <div v-if="waiting" class="waiting">
                <img :src="imgs.waiting" />
                <div class="waiting-text">{{ $t("Game in progress") }}</div>
            </div>

            <!-- machine -->
            <img v-if="locale === 'id'" class="machine" :src="imgs['machine-id']" />
            <img v-else-if="locale === 'zh'" class="machine" :src="imgs['machine-zh']" />
            <img v-else-if="locale === 'tw'" class="machine" :src="imgs['machine-tw']" />
            <img v-else-if="locale === 'ar'" class="machine" :src="imgs['machine-ar']" />
            <img v-else class="machine" :src="imgs['machine']" />

            <!-- 爆灯动画 -->
            <template v-if="bingoActive">
                <img class="light" :src="imgs['bingo-light1']" />
                <img class="light bingo-light" :src="imgs['bingo-light2']" />
                <img class="light bingo-light" :src="imgs['bingo-light-top']" />
            </template>
            <!-- 常规闪烁 -->
            <template v-else>
                <img v-show="light" class="light" :src="imgs.light" />
                <img v-show="!light" class="light" :src="imgs.light2" />
            </template>

            <div class="content">
                <img class="back" :src="imgs.back" @click="back" />
                <img class="rules" :src="imgs.rules" @click="showRule" />
                <img class="history" :src="imgs.history" @click="showRecord" />
                <div class="my-diamond">
                    <div class="my-diamond-title">{{ $t("My Diamonds") }}</div>
                    <div v-if="firstLoad" class="my-diamond-value">
                        <img class="my-diamond-icon" :src="imgs.diamond2" />
                        <span>{{ my_diamonds }}</span>
                    </div>
                    <div v-else class="my-diamond-value">
                        <img class="my-diamond-icon" :src="imgs.diamond2" />
                        <span>-</span>
                    </div>
                </div>
                <div v-if="match_id" class="match-id">ID: {{ match_id }}</div>
                <!-- turntable -->
                <div class="turntable">
                    <div class="turntable-box">
                        <!-- 遮罩 -->
                         <div v-if="maskVisible" class="mask-div"></div>

                        <!-- 奖品1 柠檬 -->
                        <div class="prize prize1" :class="['active_' + turnTableStatusObj.prize1.status, cursorIndex === 1 ? 'cursor' : '']" @click="selectPrize(1)">
                            <div v-if="turnTableStatusObj.prize1.status !== 0" class="betting-value">
                                <img :src="imgs.diamond2" />
                                <span>{{ turnTableStatusObj.prize1.value || "" }}</span>
                            </div>
                            <img v-show="winnerIndex === 1" class="winner-border" :src="imgs['winner-border']" />
                            <img :src="imgs.prize1" />
                            <div class="times">5{{ $t("times") }}</div>
                            <img v-if="cursorIndex === 1 && !hasBetting && !timerActive" class="hand" :src="imgs.hand" />
                        </div>
                        <!-- 奖品2 樱桃 -->
                        <div class="prize prize2" :class="['active_' + turnTableStatusObj.prize2.status, cursorIndex === 2 ? 'cursor' : '']" @click="selectPrize(2)">
                            <div v-if="turnTableStatusObj.prize2.status !== 0" class="betting-value">
                                <img :src="imgs.diamond2" />
                                <span>{{ turnTableStatusObj.prize2.value || "" }}</span>
                            </div>
                            <img v-show="winnerIndex === 2" class="winner-border" :src="imgs['winner-border']" />
                            <img :src="imgs.prize2" />
                            <div class="times">5{{ $t("times") }}</div>
                            <img v-if="cursorIndex === 2 && !hasBetting && !timerActive" class="hand" :src="imgs.hand" />
                        </div>
                        <!-- 奖品3 猕猴桃 -->
                        <div class="prize prize3" :class="['active_' + turnTableStatusObj.prize3.status, cursorIndex === 3 ? 'cursor' : '']" @click="selectPrize(3)">
                            <div v-if="turnTableStatusObj.prize3.status !== 0" class="betting-value">
                                <img :src="imgs.diamond2" />
                                <span>{{ turnTableStatusObj.prize3.value || "" }}</span>
                            </div>
                            <img v-show="winnerIndex === 3" class="winner-border" :src="imgs['winner-border']" />
                            <img :src="imgs.prize3" />
                            <div class="times">5{{ $t("times") }}</div>
                            <img v-if="cursorIndex === 3 && !hasBetting && !timerActive" class="hand" :src="imgs.hand" />
                        </div>
                        <!-- 奖品4 草莓 -->
                        <div class="prize prize4" :class="['active_' + turnTableStatusObj.prize4.status, cursorIndex === 4 ? 'cursor' : '']" @click="selectPrize(4)">
                            <div v-if="turnTableStatusObj.prize4.status !== 0" class="betting-value">
                                <img :src="imgs.diamond2" />
                                <span>{{ turnTableStatusObj.prize4.value || "" }}</span>
                            </div>
                            <img v-show="winnerIndex === 4" class="winner-border" :src="imgs['winner-border']" />
                            <img :src="imgs.prize4" />
                            <div class="times">45{{ $t("times") }}</div>
                            <img v-if="cursorIndex === 4 && !hasBetting && !timerActive" class="hand" :src="imgs.hand" />
                        </div>
                        <!-- 计时器 -->
                        <div class="timer">
                            <div class="tens" :class="[timerActive ? 'active' : '', 'num' + getTens(time)]"></div>
                            <div class="single-digit" :class="[timerActive ? 'active' : '', 'num' + getSingleDigit(time)]"></div>
                        </div>
                        <!-- 奖品5 橙子 -->
                        <div class="prize prize5" :class="['active_' + turnTableStatusObj.prize5.status, cursorIndex === 5 ? 'cursor' : '']" @click="selectPrize(5)">
                            <div v-if="turnTableStatusObj.prize5.status !== 0" class="betting-value">
                                <img :src="imgs.diamond2" />
                                <span>{{ turnTableStatusObj.prize5.value || "" }}</span>
                            </div>
                            <img v-show="winnerIndex === 5" class="winner-border" :src="imgs['winner-border']" />
                            <img :src="imgs.prize5" />
                            <div class="times">5{{ $t("times") }}</div>
                            <img v-if="cursorIndex === 5 && !hasBetting && !timerActive" class="hand" :src="imgs.hand" />
                        </div>
                        <!-- 奖品6 西瓜 -->
                        <div class="prize prize6" :class="['active_' + turnTableStatusObj.prize6.status, cursorIndex === 6 ? 'cursor' : '']" @click="selectPrize(6)">
                            <div v-if="turnTableStatusObj.prize6.status !== 0" class="betting-value">
                                <img :src="imgs.diamond2" />
                                <span>{{ turnTableStatusObj.prize6.value || "" }}</span>
                            </div>
                            <img v-show="winnerIndex === 6" class="winner-border" :src="imgs['winner-border']" />
                            <img :src="imgs.prize6" />
                            <div class="times">25{{ $t("times") }}</div>
                            <img v-if="cursorIndex === 6 && !hasBetting && !timerActive" class="hand" :src="imgs.hand" />
                        </div>
                        <!-- 奖品7 葡萄 -->
                        <div class="prize prize7" :class="['active_' + turnTableStatusObj.prize7.status, cursorIndex === 7 ? 'cursor' : '']" @click="selectPrize(7)">
                            <div v-if="turnTableStatusObj.prize7.status !== 0" class="betting-value">
                                <img :src="imgs.diamond2" />
                                <span>{{ turnTableStatusObj.prize7.value || "" }}</span>
                            </div>
                            <img v-show="winnerIndex === 7" class="winner-border" :src="imgs['winner-border']" />
                            <img :src="imgs.prize7" />
                            <div class="times">15{{ $t("times") }}</div>
                            <img v-if="cursorIndex === 7 && !hasBetting && !timerActive" class="hand" :src="imgs.hand" />
                        </div>
                        <!-- 奖品8 香蕉 -->
                        <div class="prize prize8" :class="['active_' + turnTableStatusObj.prize8.status, cursorIndex === 8 ? 'cursor' : '']" @click="selectPrize(8)">
                            <div v-if="turnTableStatusObj.prize8.status !== 0" class="betting-value">
                                <img :src="imgs.diamond2" />
                                <span>{{ turnTableStatusObj.prize8.value || "" }}</span>
                            </div>
                            <img v-show="winnerIndex === 8" class="winner-border" :src="imgs['winner-border']" />
                            <img :src="imgs.prize8" />
                            <div class="times">10{{ $t("times") }}</div>
                            <img v-if="cursorIndex === 8 && !hasBetting && !timerActive" class="hand" :src="imgs.hand" />
                        </div>
                    </div>
                </div>
                <div class="auto-btn" @click="checkAuto">
                    <span>AUTO</span>
                    <img v-if="autoToggle" src="https://yaame-static.yaame.io/admin/a83d290d8963b26e46af6777777fb653.png" alt="">
                    <img v-else src="https://yaame-static.yaame.io/admin/46e4560c0256ea6d395aee496bf78ee8.png" alt="">
                </div>
                <!-- btns -->
                <div class="btns">
                    <div class="btn btn1" :class="{ active: diamondIndex === 1 }" @click="selectWager(1)">
                        <img :src="imgs.price1" />
                    </div>
                    <div class="btn btn2" :class="{ active: diamondIndex === 2 }" @click="selectWager(2)">
                        <img :src="imgs.price2" />
                    </div>
                    <div class="btn btn3" :class="{ active: diamondIndex === 3 }" @click="selectWager(3)">
                        <img :src="imgs.price3" />
                    </div>
                    <div class="btn btn4" :class="{ active: diamondIndex === 4 }" @click="selectWager(4)">
                        <img :src="imgs.price4" />
                    </div>
                </div>
                <!-- showcase -->
                <div class="showcase">
                    <div class="today" style="margin-right: 0.3rem">
                        <div class="showcase-title">{{ $t("Today's Earnings") }}</div>
                        <div class="showcase-value">
                            <img :src="imgs.diamond2" />
                            <span>{{ earn_diamonds }}</span>
                        </div>
                    </div>
                    <div class="champion">
                        <div class="champion-avatar">
                            <img class="champion-avatar-img" :src="todayWinner.avatar || todayWinner.subject_icon" />
                        </div>
                        <img class="video" :src="imgs.video" @click="showRank" />
                        <div class="showcase-title">{{ $t("Today's champion:") }}</div>
                        <div class="showcase-value">
                            <img :src="imgs.diamond2" />
                            <span>{{ todayWinner.reward || todayWinner.income_diamonds }}</span>
                        </div>
                    </div>
                </div>
                <!-- footer -->
                <div class="footer">
                    <div class="footer-label">{{ $t("History:") }}</div>
                    <div v-for="(item, index) in match_records" class="footer-img-div">
                        <img class="footer-item" :src="imgs['prize' + transFruitIndex(item.win_num)]" />
                        <img v-if="index === 0" class="tag-img" src="https://yaame-static.yaame.io/admin/e50c722c1e777dce8299be890222b2f7.png" alt="">
                    </div>
                </div>
            </div>
            <!-- 中奖弹窗 -->
            <div v-if="resultVisible" class="mask">
                <div class="mask-card">
                    <div class="mask-title" :style="{ opacity: lastedRecord.reward ? 0 : 1 }">{{ $t("Winning-fruit") }}</div>
                    <img class="mask-close" :src="imgs.close" @click="closeResult" />
                    <div v-if="lastedRecord.reward" class="cheer">
                        <img :src="imgs['cheer-en']" />
                    </div>

                    <div class="result-time">{{ resultTimeNum }}s</div>

                    <div class="mask-content result-content">
                        <!-- 获胜水果 -->
                        <div class="result-fruit">
                            <div class="result-fruit-animation" :class="{ active: lastedRecord.reward }">
                                <img class="halo" :class="{ active: lastedRecord.reward }" :src="imgs.halo2" />
                                <img class="star" :src="imgs.star" />
                            </div>
                            <img class="result-fruit-img" :src="imgs['prize' + realWinnerIndex]" />
                        </div>
                        <div v-if="!inMacth" class="result-text">{{ $t("You did not participate in this round") }}</div>
                        <div v-else-if="lastedRecord.reward" class="result-text">
                            {{ $t("In this round, you got") }}
                            <span>{{ lastedRecord.reward }}</span>
                            <img :src="imgs.diamond3" />
                            {{ $t("diamonds") }}
                        </div>
                        <div v-else class="result-text">{{ $t("You didn't get diamonds this round") }}</div>
                        <div class="divider">
                            <div class="divider1"></div>
                            <div class="divider2">{{ $t("Biggest winner of the round") }}</div>
                            <div class="divider3"></div>
                        </div>
                        <div class="rank">
                            <div class="user" v-for="(item, index) in winnerList">
                                <div class="user-avatar">
                                    <div class="user-avatar-border first">
                                        <img class="user-avatar-img" :src="item.a" />
                                    </div>
                                    <img class="badge" :src="imgs['badge' + (index + 1)]" />
                                </div>
                                <div class="user-diamond">
                                    <img :src="imgs.diamond2" />
                                    <span>{{ item.r }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 记录弹窗 -->
            <div v-if="recordVisible" class="mask">
                <div class="mask-card">
                    <div class="mask-title">{{ $t("Participation record") }}</div>
                    <img class="mask-close" :src="imgs.close" @click="recordVisible = false" />
                    <div class="mask-content record-content">
                        <div v-if="betting_records.length" class="record-list">
                            <div class="record-item" v-for="item in betting_records">
                                <div class="record-top">
                                    <div class="record-time">{{ moment.utc(item.time).format("YYYY/MM/DD HH:mm:ss") }}(UTC+0) ID: {{ item.match_id }}</div>
                                    <div class="record-gain">
                                        <span style="color: #96fb3e; margin-right: 0.03rem">Get:</span>
                                        <img :src="imgs.diamond2" />
                                        <span>{{ item.reward }}</span>
                                    </div>
                                </div>
                                <div class="record-card">
                                    <div class="record-winner">
                                        <span class="record-label">{{ $t("Winning-fruit") }}</span>
                                        <img :src="imgs['prize' + transFruitIndex(item.win_num)]" />
                                    </div>
                                    <div class="record-choice">
                                        <span class="record-label">{{ $t("Fruit of choice:") }}</span>
                                        <div v-for="item2 in item.records_list" class="record-choice-item">
                                            <img class="choice-fruit" :src="imgs['prize' + transFruitIndex(item2.k)]" />
                                            <img class="choice-diamond" :src="imgs.diamond2" />
                                            <span>{{ item2.v }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else class="record-empty">{{ $t("You haven't played this game yet.") }}</div>
                        <div class="record-footer divider">
                            <div class="divider1"></div>
                            <div class="divider2">{{ $t("Only show the last 10 records") }}</div>
                            <div class="divider3"></div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 规则弹窗 -->
            <div v-if="ruleVisible" class="mask">
                <div class="mask-card">
                    <div class="mask-title">{{ $t("How to Play") }}</div>
                    <img class="mask-close" :src="imgs.close" @click="ruleVisible = false" />
                    <div class="mask-content rule-content">
                        <div><span>1.</span>{{ $t("rule1") }}</div>
                        <div><span>2.</span>{{ $t("rule2") }}</div>
                        <div><span>3.</span>{{ $t("rule3") }}</div>
                        <div><span>4.</span>{{ $t("rule4") }}</div>
                        <div><span>5.</span>{{ $t("rule5") }}</div>
                    </div>
                </div>
            </div>
        </div>
        <!-- <Rank v-show="hasLoadedImgs && rankVisible" :uid="base_info.uid" :visible="rankVisible" @updateVisible="(val) => (rankVisible = val)" /> -->
    </div>
</template>
<script>
import axios from "axios";
import imgs from "./imgs";
import moment from "moment";
import Toast from "../../components/third/toast/toast";
import { sleep, isEmpty } from "../../lib/utils";
import { getGameInfoAPI, joinGameAPI, bettingAPI, getRecordsAPI, getWinnerRecordsAPI, getRobotsAPI, getRankAPI, getCurrentTimeAPI } from "./api";
import { getUid, getDevid, getLanguage } from "../../lib/device";
import { getQueryString } from "../../lib/utils";
import SDK from "@yxim/nim-web-sdk";
import Rank from "./components/Rank.vue";
let locale = getLanguage() || "en"; // en id zh tw ar
import request from "../../lib/request/activity";

if (getQueryString("language")) {
    locale = getQueryString("language");
}

// 前端奖品枚举 按照左上到右下
const fruitMap = {
    LEMON: 1,
    CHERRY: 2,
    KIWIFRUIT: 3,
    STRAWBERRY: 4,
    ORANGE: 5,
    WATERMELON: 6,
    GRAPE: 7,
    BANANA: 8,
};

// 前端奖品枚举
const fruitEnum = {
    1: "LEMON",
    2: "CHERRY",
    3: "KIWIFRUIT",
    4: "STRAWBERRY",
    5: "ORANGE",
    6: "WATERMELON",
    7: "GRAPE",
    8: "BANANA",
};

// 服务端奖品枚举 按照产品文档
const fruitServerEnum = {
    1: "LEMON",
    2: "CHERRY",
    3: "KIWIFRUIT",
    4: "ORANGE",
    5: "BANANA",
    6: "GRAPE",
    7: "WATERMELON",
    8: "STRAWBERRY",
};

export default {
    components: { Rank },
    data() {
        return {
            open_uid: getUid(),
            device_id: getDevid(),

            moment,
            nim: null,
            imgs,
            locale,
            hasLoadedImgs: false,
            waiting: false,
            sound: null,

            // 用户基本信息
            base_info: {
                chat_room_id: "",
                token: "",
                app_key: "",
                chatroom_addresses: [],
                avatar: "",
                nick_name: "",
                uid: "",
            },

            my_diamonds: 0, // 我的钻石
            earn_diamonds: 0, // 今天赚取钻石
            match_id: 0, // 比赛id
            match_records: [], // 比赛记录
            betting_records: [], // 下注记录
            hasBetting: false, // 本轮押注过
            diamondsList: [],

            time: 30,
            timerActive: false, // 是否开始转盘
            light: true, // 灯带闪烁控制
            diamondIndex: 1,
            diamondArr: [10, 100, 1000, 5000],
            todayWinner: {}, // 今日冠军

            // 飞钻动画
            bettingActive: false,
            diamondsLeft: 0,
            diamondsTop: 0,

            // 转盘状态 0未选择 1已选择 2刚选择
            turnTableStatusObj: {
                prize1: {
                    status: 0,
                    value: 0,
                },
                prize2: {
                    status: 0,
                    value: 0,
                },
                prize3: {
                    status: 0,
                    value: 0,
                },
                prize4: {
                    status: 0,
                    value: 0,
                },
                prize5: {
                    status: 0,
                    value: 0,
                },
                prize6: {
                    status: 0,
                    value: 0,
                },
                prize7: {
                    status: 0,
                    value: 0,
                },
                prize8: {
                    status: 0,
                    value: 0,
                },
            },
            prizeClockwise: [1, 2, 3, 5, 8, 7, 6, 4], // 顺时针奖品号
            cursorIndex: 1, // 光标索引
            winnerIndex: 0, // 中奖水果索引
            realWinnerIndex: -1, // 真实中奖索引

            // 结果页
            resultVisible: false,
            closeResultTimer: null,
            winnerList: [], // 中奖人前三
            lastedRecord: {}, // 最新的中奖记录 判断本人该轮是否中奖
            inMacth: false, // 是否在本场下注
            isBetting: false,
            resultTimeNum: 5,

            // 记录页
            recordVisible: false,

            // 规则页
            ruleVisible: false,

            // 排行榜
            rankVisible: false,

            // 爆灯
            bingoActive: false,

            // 部分计时器
            countdownTimeout: null, // 倒计时计时器
            countdownInterval: null, // 倒计时循环计时器
            waitingTimeout: null, // 等待上一轮计时器
            bingoTimeout: null, // 爆灯计时器
            normalCountdownInterval: null, // 下注阶段循环计时器
            turnTableInterval: null, // 开始转盘循环计时器

            // 下注锁
            lockInterval: null,
            lockBet: false,

            // 游戏状态
            gameStatus: 0, // 0押注中 1进行中

            // 聊天室链接状态
            chatroomLinkStatus: 0, // 0未连接 1连接中 2已连接

            // 首次加载标识
            firstLoad: false,

            // 遮罩层
            maskVisible: false,

            autoToggle: false,
            autoList: [],
            autoFlag: false,
        };
    },
    async created() {
        console.log("locale", locale);

        // 图片预加载
        this.preload();

        // 灯带闪烁
        setInterval(() => {
            this.light = !this.light;
        }, 500);

        await this.joinGame();
    },
    mounted() {
        // 充值后回调
        window.onPaySuccess = () => {
            console.log('调用接口，更新钻石');
            setTimeout(() => {
                getGameInfoAPI().then((res) => {
                    if (res.status === 1000) {
                        let data = res.data;
                        this.my_diamonds = data.diamond;
                        this.earn_diamonds = data.reward_diamond;
                    }
                });
            }, 1000);
        }
        this.sound = this.$refs.sound;

        window.onpageshow = function(e) {
            if (
            e.persisted ||
            (window.performance && window.performance.navigation.type == 2)
            ) {
            window.location.reload();
            }
        };
    },
    destroyed() {
        if (this.nim) {
            this.nim.disconnect();
            this.nim.destroy();
        }
    },
    methods: {
        // 加入游戏
        async joinGame() {
            let res = await joinGameAPI();
            let { status, data, desc } = res;

            if (status !== 1000 && status !== 4004) return;
            // 未到开启时间
            if (status === 4004) return;
            // 非活动时间
            if (data.active !== 1) return;
            Object.assign(this.base_info, data);

            // 初始化逻辑
            await this.initGame();

            this.initNim();
        },
        // 初始化游戏
        async initGame() {
            // 获取游戏信息

            let res = await getGameInfoAPI();

            if (res.status === 1000) {
                let data = res.data;

                // 更新 我的钻石 和 今日赚的钻石
                this.my_diamonds = data.diamond;
                this.earn_diamonds = data.reward_diamond;

                // 处理下注后退出页面,重新回到页面的情况
                this.resetGame();
                if (data.betting && data.betting.length) {
                    this.hasBetting = true;
                    this.inMacth = true;
                    this.diamondsList = []; // 新一轮清空钻石动画列表，减少内存占用
                    data.betting.forEach((item) => {
                        let f = fruitMap[item.type];
                        this.turnTableStatusObj["prize" + f].status = 1;
                        this.turnTableStatusObj["prize" + f].value = item.amount;
                    });
                }

                // 创建新一轮游戏
                await this.createGame(res.data);

                this.firstLoad = true;
            }
            // 获取比赛记录
            await this.getWinnerRecords();
            // 获取今日冠军
            this.getRank();
        },
        // 创建游戏场次
        async createGame(data) {
            this.match_id = data.match_id;
            let end_time = data.end_time;

            this.turnTableInterval && clearInterval(this.turnTableInterval);

            // 下注阶段倒计时算法
            if (end_time) {
                let res = await getCurrentTimeAPI();
                let now_time = res.data + 150; // 请求时间补偿
                let last_time = end_time - now_time;
                let t = last_time % 1000; // 不足1s的时间用setTimeout处理一次
                this.time = Math.ceil(last_time / 1000); // 20833
                let n = 0;
                const oneStep = () => {
                    n++;
                    this.cursorIndex = this.prizeClockwise[n % 8];
                    this.time--;
                };
                if (this.countdownTimeout) clearTimeout(this.countdownTimeout);
                this.countdownTimeout = setTimeout(() => {
                    oneStep();
                    if (this.time > 0) {
                        if (this.countdownInterval) clearInterval(this.countdownInterval);
                        this.countdownInterval = setInterval(() => {
                            oneStep();
                            if (this.time <= 0) {
                                clearInterval(this.countdownInterval);
                                this.startTurn();
                            }
                        }, 1000);

                        // 新逻辑 倒计时还有200ms开始转盘时锁住投注,避免接口延迟造成的无法正确拿到下注结果
                        let lastLockTime = this.time * 1000;
                        if (this.lockInterval) clearInterval(this.lockInterval);
                        this.lockInterval = setInterval(() => {
                            lastLockTime -= 10;
                            if (lastLockTime < 2000) {
                                clearInterval(this.lockInterval);
                                this.lockBet = true; // 锁住 为true时不允许下注
                            }
                        }, 10);
                    } else {
                        this.startTurn();
                    }
                }, t);
            } else {
                // 等待上一轮游戏结束
                this.waiting = true;
                let res = await getCurrentTimeAPI();
                let now_time = res.data + 150; // 请求时间补偿
                let n = now_time % 45000;
                console.log("下一轮:", 45000 - n);
                if (this.waitingTimeout) clearTimeout(this.waitingTimeout);
                this.waitingTimeout = setTimeout(() => {
                    this.waiting = false;
                }, 45000 - n);
            }

            if (this.autoToggle && this.autoList.length) {
                // 计算所用钻石和当前余额
                let total = 0;
                this.autoList.forEach((item) => {
                    total += this.diamondArr[item.diamondIndex - 1];
                });
                if (total > this.my_diamonds) {
                    this.autoToggle = false;
                    window.location.href = "wlyaame://mine/shop/diamond?popup=1";
                    await sleep(300);
                    Toast(this.$t("Insufficient diamonds, please recharge"));
                    return false;
                }


                this.autoPrize();
            } else if (!this.autoToggle) {
                this.autoList = [];
            }
            
        },

        async autoPrize() {
            console.log('进入autoPrize');
            
            this.autoFlag = true;
            for (let index = 0; index < this.autoList.length; index++) {
                console.log('进入autoPrize - 1');
                
                const element = this.autoList[index];
                await this.selectWager(element.diamondIndex);
                await this.selectPrize(element.prizeIndex);
            }
            this.autoFlag = false;
        },
        async getRank() {
            let now = moment();
            // getRankAPI({
            //     uid: this.base_info.uid,
            //     startTime: now.startOf("day").valueOf(),
            //     endTime: now.endOf("day").valueOf(),
            // }).then((res) => {
            //     if (res.status === 1000) {
            //         let rank_list = res.data.rank_list || [];
            //         rank_list = rank_list.sort((a, b) => b.reward - a.reward);
            //         this.todayWinner = rank_list.length ? rank_list[0] : {};
            //     }
            // });

            try {
                const res = await request.getActivityRank({
                    page: 1,
                    size: 1,
                    activityRankCycleType: "DAY",
                    activityRankType: "FRUIT_GAME",
                });
                if (res.status === 1000) {
                    this.todayWinner = res.data.content[0] || {};
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 获取中奖记录
        async getWinnerRecords() {
            let res = await getWinnerRecordsAPI();
            if (res.status === 1000) {
                let match_records = [];
                for (let i = 0; i < 10; i++) {
                    res.data.match_records && res.data.match_records[i] && match_records.push(res.data.match_records[i]);
                }
                this.match_records = match_records;
            }
        },
        // 转换服务端水果id
        transFruitIndex(id) {
            return fruitMap[fruitServerEnum[id]];
        },
        /**
         * @description: 图片预加载
         * @return {*}
         */
        preload() {
            let imgList = [];
            for (let key in this.imgs) {
                imgList.push(this.imgs[key]);
            }
            let queryList = [];
            let instance = axios.create();
            imgList.forEach((img) => {
                queryList.push(instance.get(img));
            });
            Promise.all(queryList)
                .then((res) => {
                    this.hasLoadedImgs = true;
                    console.log("全部加载完成");
                })
                .catch((err) => {
                    this.hasLoadedImgs = true;
                    console.log("图片预加载异常");
                });
        },
        /**
         * @description: 开始转盘 通过开始减速的时间点控制结果
         * @return {*}
         */
        startTurn() {
            console.log('进入startTurn');
            // 展示遮罩
            this.maskVisible = true;

            for (let key in this.turnTableStatusObj) {
                if (this.turnTableStatusObj[key].status === 2) this.turnTableStatusObj[key].status = 1;
            }

            let reduceTimes = [4640, 4680, 4720, 4920, 4760, 4880, 4840, 4800];
            let n = 0;
            let past_time = 0; // 积累时间 上限10s
            let x = 0; // 位移
            let a = 0.001; // 加速加速度
            let a2 = 0.001; // 减速加速度
            let v = 0.05; // 速度
            let timer = null;
            this.cursorIndex = this.prizeClockwise[n];
            let flag = true; // 可以加速
            console.log('进入startTurn - 1');

            // 倒计时逻辑
            this.timerActive = true;
            this.time = 10;
            if (this.normalCountdownInterval) clearInterval(this.normalCountdownInterval);
            this.normalCountdownInterval = setInterval(() => {
                this.time--;
                if (this.time <= 0) clearInterval(this.normalCountdownInterval);
            }, 1000);

            let hasShowErrorToast = false;

            // toast只提示一次
            let toastFlag = true;
            // 转盘逻辑
            if (this.turnTableInterval) clearInterval(this.turnTableInterval);
            this.turnTableInterval = setInterval(() => {
                past_time += 10;
                x += v;
                if (x > 1) {
                    x--;
                    n++;
                    this.cursorIndex = this.prizeClockwise[n % 8];
                }
                if (past_time < 10000) {
                    if (v < 0.3 && flag) {
                        v += a;
                    } else {
                        flag = false; //最大速度禁止加速
                        if (v > 0.03 && past_time >= reduceTimes[this.realWinnerIndex > 0 ? this.realWinnerIndex - 1 : 0]) {
                            v -= a2;
                        }
                    }
                } else if (this.realWinnerIndex === -1) {
                    if (!hasShowErrorToast) {
                        // 未获取到开奖结果，弹窗提示并关闭
                        // hasShowErrorToast = true;
                        // Toast(this.$t("Network error, please check the game result from the record"));
                        // setTimeout(() => {
                        //     location.href = "wlyaame://webview/back";
                        // }, 2000);

                        if (toastFlag) {
                            Toast(this.$t("Network error, please check the game result from the record"));
                            toastFlag = false;
                        }
                    }
                } else if (past_time >= 10000) {
                    clearInterval(this.turnTableInterval);
                    this.winnerIndex = this.cursorIndex;
                    this.bingo();
                }
            }, 10);
        },
        /**
         * @description: 爆灯
         * @return {*}
         */
        bingo() {
            this.bingoActive = true;
            if (this.bingoTimeout) clearTimeout(this.bingoTimeout);
            this.bingoTimeout = setTimeout(() => {
                this.showResult();
                this.setResultTime();
                this.lastedRecord.reward && this.sound && this.sound.play();
                this.maskVisible = false;
            }, 1500);
        },

        // 设置result页倒计时
        setResultTime() {
            this.resultTimeNum = 5;
            if (this.closeResultTimer) clearInterval(this.closeResultTimer);
            this.closeResultTimer = setInterval(() => {
                this.resultTimeNum--;
                if (this.resultTimeNum <= 0) {
                    clearInterval(this.closeResultTimer);
                    this.closeResult();
                }
            }, 1000);
        },

        // 游戏结束
        gameOver(data) {
            let { id, n, r = [] } = data;
            this.match_id = id; // 校对场次id
            this.realWinnerIndex = this.transFruitIndex(n);
            // 处理中奖人
            if (r && r.length >= 3) {
                this.winnerList = r;
            } else {
                let type = fruitServerEnum[n];
                let num = r ? 3 - r.length : 3;
                getRobotsAPI({ num, type }).then((res) => {
                    if (res.status === 1000) {
                        let robot_list = res.data.robot_list;
                        robot_list &&
                            robot_list.forEach((item) => {
                                item.a = item.avatar;
                                item.r = item.reward;
                            });
                        if (robot_list) {
                            let list = r.concat(robot_list).sort((a, b) => b.r - a.r);
                            this.winnerList = list;
                        }
                    }
                });
            }

            // 判断自己是否中奖
            getRecordsAPI().then((res) => {
                if (res.status === 1000) {
                    let betting_records = res.data.betting_records;
                    let record = betting_records && betting_records.length ? betting_records[0] : {};
                    this.lastedRecord = record.match_id === this.match_id ? record : {};
                }
            });
        },
        /**
         * @description: 飞钻动画
         * @param {number} bettingIndex 下注索引 1-4
         * @param {number} prizeIndex 奖品索引 1-8
         * @return {*}
         */
        bettingAnimation(diamondIndex, prizeIndex) {
            console.log(diamondIndex, prizeIndex);
            let startLeft = [1.2, 2.8, 4.3, 5.8];
            let startTop = 8.4;
            let endLeft = [1.7, 3.5, 5.3, 1.7, 5.3, 1.7, 3.5, 5.3];
            let endTop = [3.4, 3.4, 3.4, 4.9, 4.9, 6.6, 6.6, 6.6];
            // 钻石到初始位置
            let animationObj = {
                diamondsLeft: startLeft[diamondIndex - 1],
                diamondsTop: startTop,
                bettingActive: true,
            };
            this.diamondsList.push(animationObj);

            // 给钻石设定目标位置
            setTimeout(() => {
                animationObj.diamondsLeft = endLeft[prizeIndex - 1];
                animationObj.diamondsTop = endTop[prizeIndex - 1];
            }, 0);
            // 1.2s后完成动画隐藏钻石
            setTimeout(() => {
                animationObj.bettingActive = false;
            }, 1200);
        },
        /**
         * @description: 选择钻石
         * @param {number} diamondIndex 奖品索引 1-8
         * @return {*}
         */
        async selectWager(diamondIndex) {
            // if (this.bettingActive || this.timerActive) return false;
            // if (this.timerActive) return false;
            if (this.isBetting) return false;
            // 钻石的余额总和也不足本次下注，弹出充值提示弹窗，引导充值
            if (this.diamondArr[diamondIndex - 1] > this.my_diamonds) {
                window.location.href = "wlyaame://mine/shop/diamond?popup=1";
                await sleep(300);
                Toast(this.$t("Insufficient diamonds, please recharge"));
                return false;
            } else {
                this.diamondIndex = diamondIndex;
            }
        },
        /**
         * @description: 下注
         * @param {number} prizeIndex 奖品索引 1-8
         * @return {*}
         */
        async selectPrize(prizeIndex) {
            // 未选择按钮|飘钻动画中|开始转盘中|下注接口请求中|下注锁 不可下注
            console.log(this.diamondIndex, this.isBetting, this.timerActive);
            if (this.diamondIndex === -1 || this.isBetting || this.timerActive) return false;

            // 钻石的余额总和也不足本次下注，弹出充值提示弹窗，引导充值
            if (this.diamondArr[this.diamondIndex - 1] > this.my_diamonds) {
                window.location.href = "wlyaame://mine/shop/diamond?popup=1";
                await sleep(300);
                Toast(this.$t("Insufficient diamonds, please recharge"));
                return false;
            }

            this.isBetting = true;
            let params = {
                uid: this.base_info.uid,
                bean: this.diamondArr[this.diamondIndex - 1],
                match_id: this.match_id,
                type: fruitEnum[prizeIndex],
            };
            console.log("params", params);
            let res = await bettingAPI(params);
            if (res.status === 1000) {
                this.inMacth = true;
                this.hasBetting = true;
                this.isBetting = false;
                console.log("下注成功");

                this.turnTableStatusObj["prize" + prizeIndex].value += this.diamondArr[this.diamondIndex - 1]; // 更改该水果下注钻石
                this.my_diamonds = this.my_diamonds - this.diamondArr[this.diamondIndex - 1]; // 下注阶段 前端计算扣除钻石数
                
                if (!this.autoFlag) {
                    this.autoList.push({
                        diamondIndex: this.diamondIndex,
                        prizeIndex: prizeIndex,
                    });
                }
            } else {
                Toast(this.$t("Not bet time, bet failed"));
            }

            this.bettingAnimation(this.diamondIndex, prizeIndex);
            for (let key in this.turnTableStatusObj) {
                if (this.turnTableStatusObj[key].status === 2) this.turnTableStatusObj[key].status = 1;
            }
            this.turnTableStatusObj["prize" + prizeIndex].status = 2; // 更改下注水果的选中状态
        },
        // 重置游戏
        resetGame() {
            this.resultVisible = false;
            this.bingoActive = false;
            this.timerActive = false;
            this.winnerIndex = 0; // 中奖索引重置
            this.realWinnerIndex = -1; // 中奖索引重置
            this.cursorIndex = 1; // 光标重置
            this.hasBetting = false;
            this.isBetting = false;
            this.lockBet = false;
            this.waiting = false;
            for (let key in this.turnTableStatusObj) {
                this.turnTableStatusObj[key] = {
                    status: 0,
                    value: 0,
                };
            }
        },
        // 获取十位数
        getTens(time) {
            return parseInt((time % 100) / 10);
        },
        // 获取个位数
        getSingleDigit(time) {
            return time % 10;
        },
        // 展示获奖弹窗
        showRank() {
            // console.log(1);
            // return
            // this.rankVisible = true;
            location.href = "./diamondRank.html?activityRankType=FRUIT_GAME";
        },
        // 展示记录弹窗
        showRecord() {
            try {
                this.recordVisible = true;
                getRecordsAPI().then((res) => {
                    if (res.status === 1000) {
                        let betting_records = res.data.betting_records || [];
                        betting_records.forEach((item) => {
                            if (item.records) {
                                item.records_list = [];
                                for (let k in item.records) {
                                    item.records_list.push({
                                        k: k,
                                        v: item.records[k],
                                    });
                                }
                            }
                        });
                        this.betting_records = betting_records;
                    }
                });
            } catch (error) {
                const err = new Error("水果机展示记录弹窗异常");
                window.DATAFLUX_RUM &&
                    DATAFLUX_RUM.addError(err, {
                        yaame_open_uid: this.open_uid,
                        yaame_device_id: this.device_id,
                        yaame_custom_error: error,
                    });
            }
        },
        // 展示规则弹窗
        showRule() {
            this.ruleVisible = true;
        },
        // 展示结果弹窗
        showResult() {
            this.resultVisible = true;
        },
        // 关闭结果弹窗
        closeResult() {
            this.resultVisible = false;
        },
        // 退出
        back() {
            location.href = "wlyaame://webview/back";
        },
        /**
         * @description: 登录云信
         * @return {*}
         */
        initNim() {
            let { app_key, chat_room_id, chatroom_addresses, token, uid } = this.base_info;
            let self = this;
            try {
                self.nim = new SDK.Chatroom({
                    // debug: true,
                    chatroomId: chat_room_id,
                    appKey: app_key,
                    account: uid,
                    token: token,
                    db: false,
                    chatroomAddresses: chatroom_addresses,
                    loginAuthType: 1,
                    done: self.getChatroomAddressDone,
                    onconnect: self.onChatroomConnect,
                    onerror: self.onChatroomError,
                    onmsgs: self.onChatroomMsgs,
                    onwillreconnect: self.onChatroomWillReconnect,
                    ondisconnect: self.onChatroomDisconnect,
                });
            } catch (error) {
                const err = new Error("云信初始化错误");
                window.DATAFLUX_RUM &&
                    DATAFLUX_RUM.addError(err, {
                        yaame_open_uid: this.open_uid,
                        yaame_device_id: this.device_id,
                        yaame_custom_data: this.base_info,
                        yaame_custom_error: error,
                    });

                console.log("==========");
                console.log("云信登录异常", error);
            }
        },
        // 处理收到自定义消息
        onChatroomMsgs(msgs) {
            if (!Array.isArray(msgs)) {
                msgs = [msgs];
            }
            let msg = msgs[0];
            if (msg.type !== "custom") return;
            if (isEmpty(msg.content)) return;
            let { msg_type, msg_data } = JSON.parse(msg.content);
            console.log("收到聊天室消息", msg_type, msg_data);
            switch (msg_type) {
                case "FRUIT_MATCH_CREAT":
                    window.DATAFLUX_RUM &&
                        window.DATAFLUX_RUM.addAction("投注阶段开始", {
                            yaame_open_uid: this.open_uid,
                            yaame_device_id: this.device_id,
                            yaame_custom_data: msgs,
                        });
                    // 投注阶段开始
                    this.initGame();
                    // 修改游戏状态
                    this.gameStatus = 0;
                    break;
                case "FRUIT_MATCH_OVER":
                    window.DATAFLUX_RUM &&
                        window.DATAFLUX_RUM.addAction("投注阶段结束", {
                            yaame_open_uid: this.open_uid,
                            yaame_device_id: this.device_id,
                            yaame_custom_data: msgs,
                        });
                    // 投注阶段结束
                    this.gameOver(msg_data);
                    // 修改游戏状态
                    this.gameStatus = 1;
                    break;
                default:
                    break;
            }
        },
        getChatroomAddressDone(error, obj) {
            console.log("获取聊天室地址" + (!error ? "成功" : "失败"), error, obj);

            if (!error) {
                window.DATAFLUX_RUM &&
                    window.DATAFLUX_RUM.addAction("云信获取聊天室地址成功", {
                        yaame_open_uid: this.open_uid,
                        yaame_device_id: this.device_id,
                        yaame_custom_data: obj,
                    });
            } else {
                const err = new Error("云信获取聊天室地址失败");
                window.DATAFLUX_RUM &&
                    DATAFLUX_RUM.addError(err, {
                        yaame_open_uid: this.open_uid,
                        yaame_device_id: this.device_id,
                        yaame_custom_data: obj,
                        yaame_custom_error: error,
                    });
            }
        },
        onChatroomConnect(obj) {
            console.log("进入聊天室", obj);

            window.DATAFLUX_RUM &&
                window.DATAFLUX_RUM.addAction("云信进入聊天室", {
                    yaame_open_uid: this.open_uid,
                    yaame_device_id: this.device_id,
                    yaame_custom_data: obj,
                });
            this.chatroomLinkStatus = 2;
        },
        onChatroomError(error, obj) {
            console.log("发生错误", error, obj);

            const err = new Error("云信发生错误");
            window.DATAFLUX_RUM &&
                DATAFLUX_RUM.addError(err, {
                    yaame_open_uid: this.open_uid,
                    yaame_device_id: this.device_id,
                    yaame_custom_data: obj,
                    yaame_custom_error: error,
                });
        },
        onChatroomWillReconnect(obj) {
            // 此时说明 `SDK` 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
            console.log("即将重连", obj);

            window.DATAFLUX_RUM &&
                window.DATAFLUX_RUM.addAction("云信即将重连", {
                    yaame_open_uid: this.open_uid,
                    yaame_device_id: this.device_id,
                    yaame_custom_data: obj,
                });

            this.chatroomLinkStatus = 1;
        },
        onChatroomDisconnect(error) {
            // 此时说明 `SDK` 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
            console.log("连接断开", error);

            const err = new Error("云信连接断开");
            window.DATAFLUX_RUM &&
                DATAFLUX_RUM.addError(err, {
                    yaame_open_uid: this.open_uid,
                    yaame_device_id: this.device_id,
                    yaame_custom_error: error,
                });
            if (error) {
                switch (error.code) {
                    // 账号或者密码错误, 请跳转到登录页面并提示错误
                    case 302:
                        break;
                    // 被踢, 请提示错误后跳转到登录页面
                    case "kicked":
                        break;
                    default:
                        break;
                }
            }

            this.chatroomLinkStatus = 0;
        },
        handleAudioError(e) {
            console.log("Audio Error: ", e);
        },
        checkAuto() {
            if (this.autoToggle) {
                this.autoToggle = false;
            } else {
                this.autoToggle = true;
            }
        }
    },
};
</script>
<style scoped lang="less">
@import "./mask.less";
@import "./content.less";

.main {
    position: relative;
    width: 7.5rem;
    height: 11.69rem;
}
.preload {
    width: 100%;
    img {
        width: 100%;
    }
}
.container {
    position: relative;
    width: 7.5rem;
    height: 11.69rem;
    background-color: #1b0036;
    .waiting {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 100%;
        z-index: 10;
        background-color: rgba(0, 0, 0, 0.7);
        .waiting-text {
            color: #c089fe;
            font-weight: bold;
            font-size: 0.32rem;
            text-align: center;
            position: absolute;
            top: 6.3rem;
            width: 100%;
        }
        img {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
        }
    }
    &.bingo {
        .bingo-light {
            animation: bingo linear 0.34s infinite;
        }
    }
    .diamonds {
        position: absolute;
        width: 0.5rem;
        left: 0rem;
        top: 0rem;
        z-index: 10;
        &.active {
            transition-duration: 1s;
            animation: betting linear 1.3s 1;
        }
    }
    .light {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
    }
    .machine {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
}

@keyframes betting {
    0% {
        opacity: 0;
        transform: scale(1);
    }
    15% {
        opacity: 1;
    }
    85% {
        opacity: 1;
        transform: scale(1.4);
    }
    100% {
        opacity: 0;
        transform: scale(1.4);
    }
}

@keyframes bingo {
    0% {
        opacity: 0;
    }
    50% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}
.match-id {
    width: 2rem;
    height: 1rem;
    position: absolute;
    left: 0;
    top: 1.6rem;
    font-size: 0.24rem;
    color: #ccc;
    transform: scale(0.85)
}
</style>
