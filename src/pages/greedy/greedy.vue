<template>
    <div class="main">
        <page-loading v-if="page_loading"></page-loading>
        <!-- 各种音效 -->
        <audio ref="audio-bg" loop :autoplay="true" :src="audio.bg" @error="handleAudioError"></audio>
        <audio ref="audio-modal" :autoplay="false" :src="audio.modal" @error="handleAudioError"></audio>
        <audio ref="audio-result" :autoplay="false" :src="audio.result" @error="handleAudioError"></audio>
        <audio ref="audio-timeActive" loop :autoplay="false" :src="audio.timeActive" @error="handleAudioError"></audio>
        <audio ref="audio-switch" :autoplay="false" :src="audio.switch" @error="handleAudioError"></audio>
        <audio ref="audio-bet" :autoplay="false" :src="audio.bet" @error="handleAudioError"></audio>
        <!-- 首页 -->
        <div class="container" :class="{ bingo: bingoActive }">
            <template v-for="item in diamondsList">
                <img v-if="item.bettingActive" class="diamonds" :class="{ active: item.bettingActive }" :style="{ left: item.diamondsLeft + 'rem', top: item.diamondsTop + 'rem' }" :src="imgs.diamonds" />
            </template>

            <!-- 等待上一轮 -->
            <div v-if="waiting" class="waiting">
                <img :src="imgs.waiting" />
            </div>

            <!-- title -->
            <img class="title" :src="imgs['title']" />

            <!-- machine -->
            <img class="machine" :src="imgs['machine']" />

            <div class="content">
                <img class="back" :src="imgs.back" @click="back" />
                <img class="rules" :src="imgs.rules" @click="showRule" />
                <img class="history" :src="imgs.history" @click="showRecord" />
                <img v-if="audioPlaying" class="bgm" :class="{ stop: !audioPlaying }" :src="imgs.bgm" @click="playBGM" />
                <img v-else class="bgm" :class="{ stop: !audioPlaying }" :src="imgs['bgm-stop']" @click="playBGM" />
                <div class="cur-round">{{ $t("Round") }}: {{ cur_round }}</div>
                <div class="my-diamond" @click="showRecharge">
                    <div class="my-diamond-title">{{ $t("My Diamonds") }}</div>
                    <div v-if="firstLoad" class="my-diamond-value">
                        <img class="my-diamond-icon" :src="imgs.diamond" />
                        <span>{{ my_diamonds }}</span>
                    </div>
                    <div v-else class="my-diamond-value">
                        <img class="my-diamond-icon" :src="imgs.diamond2" />
                        <span>-</span>
                    </div>
                </div>
                <!-- turntable -->
                <div class="turntable">
                    <div class="turntable-box">
                        <!-- group -->
                        <div class="group group1" :class="{ active: cursorIndex === 9 }" :style="{ backgroundImage: `url(${imgs['prize9']})` }"></div>
                        <div class="group group2" :class="{ active: cursorIndex === 10 }" :style="{ backgroundImage: `url(${imgs['prize10']})` }"></div>

                        <!-- 奖品1 西红柿 -->
                        <div class="prize prize1" :class="['active_' + turnTableStatusObj.prize1.status, timerActive ? 'disabled' : '', (timerActive && cursorIndex === 1) || cursorIndex === 9 ? 'cursor' : '']" @click="selectPrize(1)">
                            <div v-if="turnTableStatusObj.prize1.status !== 0" class="betting-value">
                                <span>You:</span>
                                <img :src="imgs.diamond" />
                                <span>{{ turnTableStatusObj.prize1.value || '' }}</span>
                            </div>
                            <!-- <img v-show="winnerIndex === 1" class="winner-border" :src="imgs['winner-border']" /> -->
                            <img class="prize-icon" :src="imgs.prize1" />
                            <div class="times">5{{ $t("times") }}</div>
                            <img v-show="cursorIndex === 1 && !hasBetting && !timerActive" class="hand" :src="imgs.hand" />
                        </div>
                        <!-- 奖品2 萝卜 -->
                        <div class="prize prize2" :class="['active_' + turnTableStatusObj.prize2.status, timerActive ? 'disabled' : '', (timerActive && cursorIndex === 2) || cursorIndex === 9 ? 'cursor' : '']" @click="selectPrize(2)">
                            <div v-if="turnTableStatusObj.prize2.status !== 0" class="betting-value">
                                <span>You:</span>
                                <img :src="imgs.diamond" />
                                <span>{{ turnTableStatusObj.prize2.value || '' }}</span>
                            </div>
                            <!-- <img v-show="winnerIndex === 2" class="winner-border" :src="imgs['winner-borde r']" /> -->
                            <img class="prize-icon" :src="imgs.prize2" />
                            <div class="times">5{{ $t("times") }}</div>
                            <img v-show="cursorIndex === 2 && !hasBetting && !timerActive" class="hand" :src="imgs.hand" />
                        </div>
                        <!-- 奖品3 玉米 -->
                        <div class="prize prize3" :class="['active_' + turnTableStatusObj.prize3.status, timerActive ? 'disabled' : '', (timerActive && cursorIndex === 3) || cursorIndex === 9 ? 'cursor' : '']" @click="selectPrize(3)">
                            <div v-if="turnTableStatusObj.prize3.status !== 0" class="betting-value">
                                <span>You:</span>
                                <img :src="imgs.diamond" />
                                <span>{{ turnTableStatusObj.prize3.value || '' }}</span>
                            </div>
                            <!-- <img v-show="winnerIndex === 3" class="winner-border" :src="imgs['winner-border']" /> -->
                            <img class="prize-icon" :src="imgs.prize3" />
                            <div class="times">5{{ $t("times") }}</div>
                            <img v-show="cursorIndex === 3 && !hasBetting && !timerActive" class="hand" :src="imgs.hand" />
                        </div>
                        <!-- 奖品4 卷心菜 -->
                        <div class="prize prize4" :class="['active_' + turnTableStatusObj.prize4.status, timerActive ? 'disabled' : '', (timerActive && cursorIndex === 4) || cursorIndex === 9 ? 'cursor' : '']" @click="selectPrize(4)">
                            <div v-if="turnTableStatusObj.prize4.status !== 0" class="betting-value">
                                <span>You:</span>
                                <img :src="imgs.diamond" />
                                <span>{{ turnTableStatusObj.prize4.value || '' }}</span>
                            </div>
                            <!-- <img v-show="winnerIndex === 4" class="winner-border" :src="imgs['winner-border']" /> -->
                            <img class="prize-icon" :src="imgs.prize4" />
                            <div class="times">5{{ $t("times") }}</div>
                            <img v-show="cursorIndex === 4 && !hasBetting && !timerActive" class="hand" :src="imgs.hand" />
                        </div>
                        <!-- 计时器 -->
                        <div class="timer">
                            <div v-if="!timerActive" class="time-start">{{ $t("Select Food") }}</div>
                            <div class="time">{{ time }}s</div>
                            <img class="cat" :src="imgs['cat']" />
                            <!-- <div v-if="timerActive" class="timer-mask"></div> -->
                            <!-- <div class="tens" :class="[timerActive ? 'active' : '', 'num' + getTens(time)]"></div> -->
                            <!-- <div class="single-digit" :class="[timerActive ? 'active' : '', 'num' + getSingleDigit(time)]"></div> -->

                            <!-- 爆灯动画 -->
                            <template v-if="timerActive || bingoActive">
                                <img class="light" :src="imgs['bingo-light1']" />
                                <img class="light bingo-light" :src="imgs['bingo-light2']" />
                                <img class="light bingo-light" :src="imgs['bingo-light-top']" />
                            </template>
                            <!-- 常规闪烁 -->
                            <template v-else>
                                <img v-show="light" class="light" :src="imgs.light" />
                                <img v-show="!light" class="light" :src="imgs.light2" />
                            </template>
                        </div>
                        <!-- 奖品5 鸡腿 -->
                        <div class="prize prize5" :class="['active_' + turnTableStatusObj.prize5.status, timerActive ? 'disabled' : '', (timerActive && cursorIndex === 5) || cursorIndex === 10 ? 'cursor' : '']" @click="selectPrize(5)">
                            <div v-if="turnTableStatusObj.prize5.status !== 0" class="betting-value">
                                <span>You:</span>
                                <img :src="imgs.diamond" />
                                <span>{{ turnTableStatusObj.prize5.value || '' }}</span>
                            </div>
                            <!-- <img v-show="winnerIndex === 5" class="winner-border" :src="imgs['winner-border']" /> -->
                            <img class="prize-icon" :src="imgs.prize5" />
                            <div class="times">10{{ $t("times") }}</div>
                            <img v-show="cursorIndex === 5 && !hasBetting && !timerActive" class="hand" :src="imgs.hand" />
                        </div>
                        <!-- 奖品6 培根 -->
                        <div class="prize prize6" :class="['active_' + turnTableStatusObj.prize6.status, timerActive ? 'disabled' : '', (timerActive && cursorIndex === 6) || cursorIndex === 10 ? 'cursor' : '']" @click="selectPrize(6)">
                            <div v-if="turnTableStatusObj.prize6.status !== 0" class="betting-value">
                                <span>You:</span>
                                <img :src="imgs.diamond" />
                                <span>{{ turnTableStatusObj.prize6.value || '' }}</span>
                            </div>
                            <!-- <img v-show="winnerIndex === 6" class="winner-border" :src="imgs['winner-border']" /> -->
                            <img class="prize-icon" :src="imgs.prize6" />
                            <div class="times">15{{ $t("times") }}</div>
                            <img v-show="cursorIndex === 6 && !hasBetting && !timerActive" class="hand" :src="imgs.hand" />
                        </div>
                        <!-- 奖品7 鱼 -->
                        <div class="prize prize7" :class="['active_' + turnTableStatusObj.prize7.status, timerActive ? 'disabled' : '', (timerActive && cursorIndex === 7) || cursorIndex === 10 ? 'cursor' : '']" @click="selectPrize(7)">
                            <div v-if="turnTableStatusObj.prize7.status !== 0" class="betting-value">
                                <span>You:</span>
                                <img :src="imgs.diamond" />
                                <span>{{ turnTableStatusObj.prize7.value || '' }}</span>
                            </div>
                            <!-- <img v-show="winnerIndex === 7" class="winner-border" :src="imgs['winner-border']" /> -->
                            <img class="prize-icon" :src="imgs.prize7" />
                            <div class="times">25{{ $t("times") }}</div>
                            <img v-show="cursorIndex === 7 && !hasBetting && !timerActive" class="hand" :src="imgs.hand" />
                        </div>
                        <!-- 奖品8 肉 -->
                        <div class="prize prize8" :class="['active_' + turnTableStatusObj.prize8.status, timerActive ? 'disabled' : '', (timerActive && cursorIndex === 8) || cursorIndex === 10 ? 'cursor' : '']" @click="selectPrize(8)">
                            <div v-if="turnTableStatusObj.prize8.status !== 0" class="betting-value">
                                <span>You:</span>
                                <img :src="imgs.diamond" />
                                <span>{{ turnTableStatusObj.prize8.value || '' }}</span>
                            </div>
                            <!-- <img v-show="winnerIndex === 8" class="winner-border" :src="imgs['winner-border']" /> -->
                            <img class="prize-icon" :src="imgs.prize8" />
                            <div class="times">45{{ $t("times") }}</div>
                            <img v-show="cursorIndex === 8 && !hasBetting && !timerActive" class="hand" :src="imgs.hand" />
                        </div>
                    </div>
                </div>
                <!-- history-bar -->
                <div class="history-bar">
                    <div class="history-label">
                        {{ $t("Result") }}:
                        <img :src="imgs['new']" />
                    </div>
                    <img class="history-item" v-for="item in match_records" :src="item.result_icon" />
                </div>
                <!-- btns -->
                <div class="btns">
                    <div class="btn" :class="{ active: diamondIndex === 1 }" @click="selectWager(1)">
                        <img :src="imgs['diamond']" />
                        <span>10</span>
                    </div>
                    <div class="btn" :class="{ active: diamondIndex === 2 }" @click="selectWager(2)">
                        <img :src="imgs['diamond']" />
                        <span>50</span>
                    </div>
                    <div class="btn" :class="{ active: diamondIndex === 3 }" @click="selectWager(3)">
                        <img :src="imgs['diamond']" />
                        <span>100</span>
                    </div>
                    <div class="btn" :class="{ active: diamondIndex === 4 }" @click="selectWager(4)">
                        <img :src="imgs['diamond']" />
                        <span>1000</span>
                    </div>
                    <div class="btn" :class="{ active: diamondIndex === 5 }" @click="selectWager(5)">
                        <img :src="imgs['diamond']" />
                        <span>2000</span>
                    </div>
                </div>
                <!-- showcase -->
                <div class="showcase">
                    <div class="today" @click="showRecord">
                        <div class="showcase-title">{{ $t("Today's Earning") }}</div>
                        <div class="showcase-value">
                            <img :src="imgs.diamond" />
                            <span>{{ earn_diamonds }}</span>
                        </div>
                    </div>
                    <span class="divider"></span>
                    <div class="champion-avatar" :style="{ backgroundImage: `url(${todayWinner.avatar})` }" @click="showRank"></div>
                    <div class="champion" @click="showRank">
                        <div class="showcase-title">{{ $t("Best Player") }}</div>
                        <div class="showcase-value">
                            <span style="margin-right: 0.05rem">{{ $t("WIN") }}:</span>
                            <img :src="imgs.diamond" />
                            <span>{{ todayWinner.win_diamonds }}</span>
                        </div>
                    </div>
                    <img class="video" :src="imgs.video" @click="showRank" />
                </div>
            </div>
            <!-- 中奖弹窗 -->
            <van-popup style="overflow: visible" v-model="resultVisible" round position="bottom" :close-on-click-overlay="false" :style="{ height: '5.93rem' }">
                <div class="mask-card" style="height: 5.93rem">
                    <div class="result-time">{{ closeResultTime }}s</div>
                    <div class="result-round">{{ $t("Round") }}: {{ lastedRecord.match_record_flag }}</div>
                    <div class="mask-content result-content">
                        <div class="result-img">
                            <img class="result-prize" :src="imgs[`prize${realWinnerIndex}`]" />
                        </div>
                        <van-loading v-if="resultLoading" />
                        <template v-else>
                            <!-- 中奖 -->
                            <img v-if="inMacth && lastedRecord.reward_diamonds" class="result-winner" :src="imgs['winner']" />
                            <!-- 参与 -->
                            <template v-if="lastedRecord.betting_records && lastedRecord.betting_records.length">
                                <div class="result-list">{{ $t("Your") }}<img :src="item.option_icon" v-for="item in lastedRecord.betting_records" :key="item.option_flag" /></div>
                                <div class="result-win">
                                    {{ $t("WIN") }}<span>{{ lastedRecord.reward_diamonds || 0 }}</span
                                    ><img :src="imgs['diamond']" />
                                </div>
                            </template>
                            <div v-else class="result-nothing">{{ $t("You don't play this round.") }}</div>
                        </template>

                        <div class="result-divider">—— {{ $t("Top Winners") }} ——</div>
                        <div v-if="winnerList.length" class="result-rank">
                            <div class="result-rank-item" v-for="(item, index) in winnerList" :key="index">
                                <div class="result-rank-avatar" :style="{ backgroundImage: 'linear-gradient(to bottom, #FECF3F, #F8AD29)' }">
                                    <div class="result-rank-avatar-img" :style="{ backgroundImage: `url(${item.winner_user_avatar})` }"></div>
                                    <img class="medal" :src="imgs['medal' + (index + 1)]" />
                                </div>
                                <div class="result-rank-diamond">
                                    <img :src="imgs['diamond']" />
                                    {{ item.reward_amount }}
                                </div>
                            </div>
                        </div>
                        <div v-else class="result-rank result-rank-nothing">{{ $t("No players on the list") }}</div>
                    </div>
                </div>
            </van-popup>
            <!-- 记录弹窗 -->
            <van-popup style="overflow: visible" v-model="recordVisible" round position="bottom" :style="{ height: '8.81rem' }">
                <div class="mask-card">
                    <div class="mask-title">{{ $t("Game Record") }}</div>
                    <img class="mask-close" :src="imgs.close" @click="recordVisible = false" />
                    <div class="mask-content record-content">
                        <div v-if="betting_records.length" class="record-list">
                            <div class="record-item" v-for="item in betting_records">
                                <div class="record-top">
                                    <div class="record-left">
                                        <div class="record-time">{{ moment(item.match_start_time_ms).utc().format("YYYY/MM/DD HH:mm:ss") }}</div>
                                        <div class="record-round">{{ $t("Round") }}: {{ item.match_record_flag }}</div>
                                    </div>
                                    <div class="record-gain">
                                        <span style="color: #96fb3e; margin-right: 0.03rem">{{ $t("WIN") }}:</span>
                                        <img :src="imgs.diamond" />
                                        <span>{{ item.reward_diamonds || 0 }}</span>
                                    </div>
                                </div>
                                <div class="record-card">
                                    <div class="record-result">
                                        <span class="record-label">{{ $t("Result") }}</span>
                                        <img :src="item.result_icon" />
                                    </div>
                                    <div class="record-your">
                                        <span class="record-label">{{ $t("Your") }}</span>
                                        <img :src="imgs['prize' + fruitMap[itm.option_flag]]" v-for="itm in item.betting_records" :key="itm.option_flag" />
                                    </div>
                                    <div class="record-bet">
                                        <span class="record-label">{{ $t("Bet") }}</span>
                                        <img :src="imgs['diamond']" />
                                        {{ getRecordBet(item.betting_records) }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else class="record-empty">{{ $t("You haven't played this game yet.") }}</div>
                    </div>
                </div>
            </van-popup>
            <!-- 规则弹窗 -->
            <van-popup style="overflow: visible" v-model="ruleVisible" round position="bottom" :style="{ height: '8.81rem' }">
                <div class="mask-card" @click.stop="">
                    <div class="mask-title">{{ $t("Rules") }}</div>
                    <img class="mask-close" :src="imgs.close" @click="ruleVisible = false" />
                    <div class="mask-content rule-content">
                        <div><span>1.</span>{{ $t("rule1") }}</div>
                        <div><span>2.</span>{{ $t("rule2") }}</div>
                        <div><span>3.</span>{{ $t("rule3") }}</div>
                        <div><span>4.</span>{{ $t("rule4") }}</div>
                        <div><span>5.</span>{{ $t("rule5") }}</div>
                        <div><span>6.</span>{{ $t("rule6") }}</div>
                    </div>
                </div>
            </van-popup>

            <!-- 充值弹窗 -->
            <!-- <div v-if="rechargeVisible" class="mask" style="align-items: center; justify-content: center" @click="rechargeVisible = false">
                <div class="mask-dialog" @click.stop="">
                    <div class="mask-dialog-content">
                        {{ $t("Your balance is insufficient, please recharge.") }}
                    </div>
                    <div class="mask-dialog-footer">
                        <div @click="rechargeVisible = false">{{ $t("Cancel") }}</div>
                        <div @click="recharge">{{ $t("Recharge") }}</div>
                    </div>
                </div>
            </div> -->
        </div>
    </div>
</template>
<script>
import axios from "axios";
import imgs from "./imgs";
import moment from "moment";
import Toast from "../../components/third/toast/toast";
import { sleep, isEmpty } from "../../lib/utils";
import { getGameInfoAPI, joinGameAPI, bettingAPI, getRecordsAPI, getCurrentTimeAPI, getResultAPI } from "./api";
import { isIOS, getLanguage } from "../../lib/device";
import { getQueryString } from "../../lib/utils";
import pageLoading from "../../components/common/page_loading.vue";
import SDK from "@yxim/nim-web-sdk";

let locale = getLanguage() || "zh";

if (getQueryString("language")) {
    locale = getQueryString("language");
}
if (["zh-hk", "zh-tw", "zh-mo", "zh-cn"].indexOf(locale) > -1) {
    let localEnum = {
        "zh-hk": "tw",
        "zh-tw": "tw",
        "zh-mo": "tw",
        "zh-cn": "zh",
    };

    locale = localEnum[locale];
}

const fruitMap = {
    xhs: 1,
    hlb: 2,
    ym: 3,
    bc: 4,
    jt: 5,
    np: 6,
    hx: 7,
    hb: 8,
    A1: 9,
    A2: 10,
};

const languageMap = {
    en: "ENGLISH",
    id: "INDONESIAN",
    zh: "ZH_CN",
    tw: "ZH_FT",
    ar: "ARABIC",
};

const fruitEnum = {
    1: "xhs",
    2: "hlb",
    3: "ym",
    4: "bc",
    5: "jt",
    6: "np",
    7: "hx",
    8: "hb",
    9: "A1",
    10: "A2",
};

export default {
    components: {
        pageLoading,
    },
    data() {
        return {
            isIOS: isIOS(),
            fruitMap,
            fruitEnum,

            audio: {
                bg: "https://yaame-static.yaame.io/admin/7e6f999c9fb337fb3fcf086f8a311c64.mp3", // BGM
                modal: "https://yaame-static.yaame.io/admin/f1a6a079542a8ca680f304073914bb51.mp3", // 出现结果弹窗音效
                result: "https://yaame-static.yaame.io/admin/1cd0d030975fa7d92c8fad90f9e43eda.mp3", // 出现结果
                timeActive: "https://yaame-static.yaame.io/admin/9bfc2aabe3176dd36f2aa7fc7d747a13.mp3", // 开奖倒计时
                switch: "https://yaame-static.yaame.io/admin/af85834f5f43e5e2c36ce0f4f052c98b.mp3", // 切换金额
                bet: "https://yaame-static.yaame.io/admin/6e40d8f0e219e061e474ef9d2b091e7a.mp3", // 押注
            },
            audioRef: {
                bg: null,
                modal: null,
                result: null,
                timeActive: null,
                switch: null,
                bet: null,
            },

            moment,
            nim: null,
            imgs,
            locale,
            hasLoadedImgs: false,
            waiting: false,

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

            cur_round: "",
            my_diamonds: 0, // 我的钻石
            earn_diamonds: 0, // 今天赚取钻石
            match_id: 0, // 比赛id
            match_records: [], // 比赛记录
            betting_records: [], // 下注记录
            hasBetting: false, // 本轮押注过
            diamondsList: [],

            time: 40,
            timerActive: false, // 是否开始转盘
            light: true, // 灯带闪烁控制
            diamondIndex: 1,
            diamondArr: [10, 50, 100, 1000, 2000],
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
            prizeClockwise: [1, 2, 3, 4, 5, 6, 7, 8], // 顺时针奖品号
            cursorIndex: 1, // 光标索引
            winnerIndex: 0, // 中奖水果索引
            realWinnerIndex: 1, // 真实中奖索引

            // 结果页
            resultVisible: false,
            closeResultTime: 0,
            closeResultTimer: null,
            winnerList: [], // 中奖人前三
            lastedRecord: {}, // 最新的中奖记录 判断本人该轮是否中奖
            inMacth: false, // 是否在本场下注
            resultLoading: false,
            isBetting: false,

            // 记录页
            recordVisible: false,

            // 规则页
            ruleVisible: false,

            // 爆灯
            bingoActive: false,

            // 部分计时器
            countdownTimeout: null, // 倒计时计时器
            countdownInterval: null, // 倒计时循环计时器
            waitingTimeout: null, // 等待上一轮计时器
            bingoTimeout: null, // 爆灯计时器
            normalCountdownInterval: null, // 下注阶段循环计时器
            turnTableInterval: null, // 开始转盘循环计时器

            audioPlaying: false,
            clickInit: false,
            page_loading: false,
            rechargeVisible: false,

            // 首次加载标识
            firstLoad: false,
        };
    },
    created() {
        this.page_loading = this.isIOS ? false : true; // IOS不loading
        document.addEventListener("visibilitychange", () => {
            // 用户离开了当前页面
            if (document.visibilityState === "hidden") {
                console.log("hidden");
                this.audioPlaying = false;
                this.audioRef.bg && this.audioRef.bg.pause();
                this.audioRef.modal && this.audioRef.modal.pause();
                this.audioRef.result && this.audioRef.result.pause();
                this.audioRef.timeActive && this.audioRef.timeActive.pause();
                this.audioRef.switch && this.audioRef.switch.pause();
                this.audioRef.bet && this.audioRef.bet.pause();
                if (this.nim) {
                    this.nim.disconnect();
                    this.nim.destroy();
                }
            }

            // 用户打开或回到页面
            if (document.visibilityState === "visible") {
                console.log("visible");
                // 重新加载页面
                location.reload();
            }
        });

        console.log("locale", locale);
        let diamondIndex = localStorage.getItem("diamondIndex");
        this.diamondIndex = diamondIndex ? diamondIndex / 1 : 1;

        // 灯带闪烁
        setInterval(() => {
            this.light = !this.light;
        }, 500);

        this.joinGame();
    },
    mounted() {
        // 充值后回调
        window.onPaySuccess = () => {
            console.log('调用接口，更新钻石');
            setTimeout(() => {
                getGameInfoAPI({ languageType: languageMap[this.locale] }).then((res) => {
                    if (res.status === 1000) {
                        let data = res.data;

                        // 更新 我的钻石 今日赚的钻石 今日赢家 开奖记录
                        this.cur_round = data.match_record_flag;
                        this.my_diamonds = data.diamond_balance;
                        this.earn_diamonds = data.today_reward_diamonds;
                        this.todayWinner = data.today_champion || {};
                        let match_records = [];
                        for (let i = 0; i < 8; i++) {
                            data.history_results && data.history_results[i] && match_records.push(data.history_results[i]);
                        }
                        this.match_records = match_records;
                    }
                });
            }, 1000);
        };

        this.audioRef.bg = this.$refs["audio-bg"];
        this.audioRef.modal = this.$refs["audio-modal"];
        this.audioRef.result = this.$refs["audio-result"];
        this.audioRef.timeActive = this.$refs["audio-timeActive"];
        this.audioRef.switch = this.$refs["audio-switch"];
        this.audioRef.bet = this.$refs["audio-bet"];

        if (this.isIOS) {
            console.log("isIOS");
            document.addEventListener("click", () => {
                if (!this.clickInit) {
                    this.clickInit = true;
                    this.audioPlaying = true;
                    this.audioRef.bg.play();

                    // 通过click播放后暂停 规避IOS NotAllowedError报错
                    this.audioRef.modal.play();
                    this.audioRef.result.play();
                    this.audioRef.timeActive.play();
                    this.audioRef.switch.play();
                    this.audioRef.bet.play();
                    this.audioRef.modal.pause();
                    this.audioRef.result.pause();
                    this.audioRef.timeActive.pause();
                    this.audioRef.switch.pause();
                    this.audioRef.bet.pause();
                }
            });
        } else {
            console.log("not IOS");
            this.clickInit = true;
            this.audioPlaying = true;
            this.audioRef.bg.play();
        }
    },
    destroyed() {
        if (this.nim) {
            this.nim.disconnect();
            this.nim.destroy();
        }
    },
    methods: {
        playBGM() {
            try {
                if (this.audioPlaying) {
                    this.audioPlaying = false;
                    this.audioRef.bg.pause();
                    this.audioRef.modal.pause();
                    this.audioRef.result.pause();
                    this.audioRef.timeActive.pause();
                    this.audioRef.switch.pause();
                    this.audioRef.bet.pause();
                } else {
                    this.audioPlaying = true;
                    this.clickInit = true;
                    this.audioRef.bg.play();
                }
            } catch (error) {
                console.log("error", error);
            }
        },
        showRecharge() {
            location.href = "wlyaame://mine/shop/diamond?popup=1&source=play_game";
        },
        getRecordBet(list) {
            let n = 0;
            list.forEach((item) => {
                n += item.betting_amount || 0;
            });
            return n;
        },
        // 加入游戏
        joinGame() {
            joinGameAPI({ activity_type: "GREEDY_BABY" }).then((res) => {
                this.page_loading = false;
                let { status, data, desc } = res;

                if (status !== 1000 && status !== 4004) return;
                // 未到开启时间
                if (status === 4004) return;
                // 非活动时间
                if (data.active !== 1) return;
                Object.assign(this.base_info, data);

                // 初始化逻辑
                this.initGame();

                // 登录云信
                this.initNim();
            });
        },
        // 初始化游戏
        initGame() {
            // 获取游戏信息
            getGameInfoAPI({ languageType: languageMap[this.locale] }).then((res) => {
                if (res.status === 1000) {
                    let data = res.data;

                    // 更新 我的钻石 今日赚的钻石 今日赢家 开奖记录
                    this.cur_round = data.match_record_flag;
                    this.my_diamonds = data.diamond_balance;
                    this.earn_diamonds = data.today_reward_diamonds;
                    this.todayWinner = data.today_champion || {};
                    let match_records = [];
                    for (let i = 0; i < 8; i++) {
                        data.history_results && data.history_results[i] && match_records.push(data.history_results[i]);
                    }
                    this.match_records = match_records;

                    // 处理下注后退出页面,重新回到页面的情况
                    this.resetGame();
                    if (data.stake_options && data.stake_options.length) {
                        this.diamondsList = []; // 新一轮清空钻石动画列表，减少内存占用
                        data.stake_options.forEach((item) => {
                            if (item.betting_amount) {
                                this.hasBetting = true;
                                this.inMacth = true;
                                let f = fruitMap[item.option_flag];
                                this.turnTableStatusObj["prize" + f].status = 1;
                                this.turnTableStatusObj["prize" + f].value = item.betting_amount;
                            }
                        });
                    }

                    // 创建新一轮游戏
                    this.createGame(res.data);

                    this.firstLoad = true;
                }
            });
        },
        // 创建游戏场次
        async createGame(data) {
            this.match_id = data.match_record_id;
            let betting_end_time = data.betting_end_time_ms;
            let match_end_time = data.match_end_time_ms;

            let res = await getCurrentTimeAPI();
            let now_time = res.data + 150; // 请求时间补偿

            // 下注阶段倒计时算法
            if (now_time < betting_end_time) {
                let last_time = betting_end_time - now_time;
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
                    } else {
                        this.startTurn();
                    }
                }, t);
            } else {
                // 等待上一轮游戏结束
                this.waiting = true;
            }
        },
        /**
         * @description: 开始转盘 通过开始减速的时间点控制结果
         * @return {*}
         */
        startTurn() {
            this.audioPlaying && this.audioRef.timeActive && this.audioRef.timeActive.play();

            for (let key in this.turnTableStatusObj) {
                if (this.turnTableStatusObj[key].status === 2) this.turnTableStatusObj[key].status = 1;
            }

            // 倒计时逻辑
            this.timerActive = true;
            this.time = 10;
            if (this.normalCountdownInterval) clearInterval(this.normalCountdownInterval);
            this.normalCountdownInterval = setInterval(() => {
                this.time--;
                if (this.time <= 0) clearInterval(this.normalCountdownInterval);
            }, 1000);

            // 转盘逻辑
            let past_time = 0; // 积累时间 上限10s
            if (this.turnTableInterval) clearInterval(this.turnTableInterval);
            this.turnTableInterval = setInterval(() => {
                past_time += 50;
                if (past_time >= 10000) {
                    this.audioRef.timeActive && this.audioRef.timeActive.pause();
                    this.audioPlaying && this.audioRef.result && this.audioRef.result.play();
                    clearInterval(this.turnTableInterval);
                    this.winnerIndex = this.realWinnerIndex;
                    this.cursorIndex = this.realWinnerIndex;
                    this.bingo();
                } else {
                    if (this.cursorIndex >= 8) {
                        this.cursorIndex = 1;
                    } else {
                        this.cursorIndex++;
                    }
                }
            }, 50);
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
            }, 1500);
        },
        // 游戏结束
        async gameOver(data, match_record_id) {
            if (this.match_id === match_record_id) {
                let res = await getCurrentTimeAPI();
                let now_time = res.data + 150; // 请求时间补偿
                console.log("游戏结束", data, moment(now_time).format("HH:mm:ss"), match_record_id);
                let { rf, mr = [] } = data;
                this.match_id = match_record_id; // 校对场次id
                this.realWinnerIndex = this.fruitMap[rf];
                // 处理中奖人
                this.winnerList = mr;

                // 判断自己是否中奖
                this.resultLoading = true;
                getResultAPI({ match_record_id, languageType: languageMap[this.locale] }).then((res) => {
                    if (res.status === 1000) {
                        this.lastedRecord = res.data || {};
                    }
                    this.resultLoading = false;
                });
            }
        },
        /**
         * @description: 飞钻动画
         * @param {number} bettingIndex 下注索引 1-4
         * @param {number} prizeIndex 奖品索引 1-8
         * @return {*}
         */
        bettingAnimation(diamondIndex, prizeIndex) {
            let startLeft = [1.2, 2.35, 3.5, 4.65, 5.8];
            let startTop = 9.7;
            let endLeft = [3.5, 5.2, 6, 5.2, 3.5, 1.7, 1, 1.7];
            let endTop = [1.8, 2.6, 4.3, 6.1, 6.8, 6.1, 4.3, 2.6];
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
            this.audioPlaying && this.audioRef.switch && this.audioRef.switch.play();
            // if (this.bettingActive || t  his.timerActive) return false;
            if (this.timerActive) return false;
            // 钻石的余额总和也不足本次下注，弹出充值提示弹窗，引导充值
            if (this.diamondArr[diamondIndex - 1] > this.my_diamonds) {
                this.showRecharge();
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
            // 未选择按钮|飘钻动画中|开始转盘中|下注接口请求中 不可下注
            if (this.diamondIndex === -1 || this.isBetting || this.timerActive) return false;

            // 钻石的余额总和也不足本次下注，弹出充值提示弹窗，引导充值
            if (this.diamondArr[this.diamondIndex - 1] > this.my_diamonds) {
                this.showRecharge();
                return false;
            }

            this.isBetting = true;
            this.audioPlaying && this.audioRef.bet && this.audioRef.bet.play();
            localStorage.setItem("diamondIndex", this.diamondIndex);
            bettingAPI({
                activity_type: "GREEDY_BABY",
                betting_amount: this.diamondArr[this.diamondIndex - 1],
                match_record_id: this.match_id,
                stake_option_flag: fruitEnum[prizeIndex],
            })
                .then((res) => {
                    if (res.status === 1000) {
                        this.inMacth = true;
                        this.hasBetting = true;
                        this.turnTableStatusObj["prize" + prizeIndex].value = res.data.betting_amount; // 更改该水果下注钻石
                        this.my_diamonds = res.data.diamond_balance; // 下注阶段 前端计算扣除钻石数
                    } else if (res.status === 7019) {
                        Toast(res.desc);
                        setTimeout(() => {
                            location.reload();
                        }, 1500);
                    } else if (res.status === 6602) {
                        Toast(this.$t("Not bet time, bet failed"));
                    } else {
                        Toast(res.desc);
                    }
                    this.isBetting = false;
                })
                .catch((err) => {
                    this.isBetting = false;
                });

            this.bettingAnimation(this.diamondIndex, prizeIndex);
            for (let key in this.turnTableStatusObj) {
                if (this.turnTableStatusObj[key].status === 2) this.turnTableStatusObj[key].status = 1;
            }
            this.turnTableStatusObj["prize" + prizeIndex].status = 2; // 更改下注水果的选中状态
        },
        // 重置游戏
        resetGame() {
            this.resultVisible = false;
            this.resultLoading = true;
            this.bingoActive = false;
            this.timerActive = false;
            this.winnerIndex = 0; // 中奖索引重置
            this.realWinnerIndex = -1; // 中奖索引重置
            this.cursorIndex = 1; // 光标重置
            this.hasBetting = false;
            this.isBetting = false;
            this.winnerList = [];
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
            location.href = "./diamondRank.html?activityRankType=GREEDY_BABY";
        },
        // 展示记录弹窗
        showRecord() {
            this.recordVisible = true;
            getRecordsAPI({ languageType: languageMap[this.locale] }).then((res) => {
                if (res.status === 1000) {
                    this.betting_records = res.data.content || [];
                }
            });
        },
        // 展示规则弹窗
        showRule() {
            this.ruleVisible = true;
        },
        // 展示结果弹窗
        showResult() {
            this.resultVisible = true;
            this.audioPlaying && this.audioRef.modal && this.audioRef.modal.play();
            this.closeResultTime = 5;
            this.closeResultTimer = setInterval(() => {
                if (this.closeResultTime < 1) {
                    clearInterval(this.closeResultTimer);
                    this.closeResult();
                    this.initGame();
                } else {
                    this.closeResultTime--;
                }
            }, 1000);
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
                console.log("==========");
                console.log("error", error);
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
            console.log(1);
            let { msg_data } = JSON.parse(msg.content);
            let { match_record_id, command_type, command_args } = msg_data;
            switch (command_type) {
                case "MATCH_START":
                    // 投注阶段开始
                    if (this.waiting) {
                        this.waiting = false;
                        this.initGame();
                    }
                    break;
                case "MATCH_SETTLE":
                    // 投注阶段结束
                    console.log(2);
                    this.gameOver(JSON.parse(command_args), match_record_id);
                    break;
                default:
                    break;
            }
        },
        getChatroomAddressDone(error, obj) {
            console.log("获取聊天室地址" + (!error ? "成功" : "失败"), error, obj);
        },
        onChatroomConnect(obj) {
            console.log("进入聊天室", obj);
        },
        onChatroomError(error, obj) {
            console.log("发生错误", error, obj);
        },
        onChatroomWillReconnect(obj) {
            // 此时说明 `SDK` 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
            console.log("即将重连", obj);
        },
        onChatroomDisconnect(error) {
            // 此时说明 `SDK` 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
            console.log("连接断开", error);
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
        },
        handleAudioError(e) {
            console.log("Audio Error: ", e);
        },
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
.container {
    position: relative;
    width: 7.5rem;
    height: 11.69rem;
    background-color: rgb(254 222 47);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: top center;
    background-image: url(@bg);
    display: flex;
    flex-direction: column;
    align-items: center;
    .title {
        width: 4.68rem;
        height: 1.09rem;
        margin-top: 0.28rem;
        margin-bottom: 0.84rem;
    }
    .waiting {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 100%;
        z-index: 100;
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
    // &.bingo {
    //     .bingo-light {
    //         animation: bingo linear 0.34s infinite;
    //     }
    // }
    .diamonds {
        position: absolute;
        width: 0.5rem;
        left: 0rem;
        top: 0rem;
        z-index: 20;
        &.active {
            transition-duration: 1s;
            animation: betting linear 1.3s 1;
        }
    }
    .machine {
        // position: absolute;
        // top: 0;
        // left: 0;
        width: 100%;
        // height: 100%;
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
</style>
