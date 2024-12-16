<template>
    <refresh class="refresh" ref="wlRefresh" @onRefresh="getLottery">
        <div :style="{ 'background-image': `url(${bgImg[language]})` }" class="send">
            <Header color="harvest">{{ $t("title") }}</Header>

            <div class="rule-icon" @click="showRule = true">{{ $t("rule") }}</div>

            <div class="time-container">
                <div class="day-left">{{ timeInfo.dayLeft }}</div>
                <div class="day-right">{{ timeInfo.dayRight }}</div>
                <div class="hour">{{ timeInfo.hours }}</div>
                <div class="minute">{{ timeInfo.minutes }}</div>
                <div class="second">{{ timeInfo.seconds }}</div>
            </div>

            <div class="tree-container">
                <div
                    v-for="(item, index) in levelList"
                    :key="index"
                    :style="{ left: item.left }"
                    class="level-img"
                >
                    <img :src="item.img" alt="" />
                </div>

                <img
                    class="arrow"
                    src="https://yaame-static.yaame.io/admin/4c10017cb308ecf43da48688a31d20ae.png"
                    alt=""
                />
                <img
                    class="arrow right"
                    src="https://yaame-static.yaame.io/admin/4c10017cb308ecf43da48688a31d20ae.png"
                    alt=""
                />

                <div class="history" @click="openRecord">{{ $t("history") }}</div>

                <div class="progress">
                    <div class="progress-container">
                        <div :style="{ width: treeProgress }" class="progress-content">
                            
                        </div>
                        <span
                                >{{ treeInfo.current_level_exp }} /
                                {{ treeInfo.next_level_exp }}</span
                            >
                    </div>
                    <div class="progress-text">
                        <div>Lv.{{ treeInfo.current_level }}</div>
                        <div>Lv.{{ treeInfo.current_level + 1 }}</div>
                    </div>
                </div>

                <img
                    v-show="!showAni"
                    class="current-img"
                    :src="currentLevelImg"
                    alt=""
                />

                <canvas
                    v-show="showAni"
                    id="monster_canvas"
                    class="monster_canvas"
                ></canvas>

                <div v-if="showBubble" class="bubble-list">
                    <div v-for="(item ,index) in rewardList" :key="index" class="bubble">
                        <div v-if="item.reward_name === 'EXP'" class="exp">
                            +{{ item.worth_diamonds }} EXP
                        </div>
                        <div v-else class="gift">
                            <img :src="item.reward_icon" alt="">
                            <span class="img-count">+{{ item.reward_amount }}</span>
                        </div>
                    </div>
                </div>

                <div class="btn-list">
                    <div
                        v-for="(item, index) in btnImgList"
                        :key="index"
                        class="btn-item"
                        @click="btnActive = item.type"
                    >
                        <img v-show="btnActive !== item.type" :src="item.img" alt="" />
                        <img v-show="btnActive === item.type" :src="item.active" alt="" />
                    </div>
                </div>
            </div>

            <div class="draw-btn-list">
                <div
                    v-for="(item, index) in [1, 10, 50]"
                    :key="index"
                    :class="['draw-btn', showBubble && lotteryNum === item ? 'disabled' : '']"
                    @click="postLottery(item)"
                >
                    <span v-if="language === 'en' && item === 1" style="padding: 0 0.4rem">{{ $t("cultivate1", [item]) }}</span>
                    <!-- <span v-else-if="language === 'en'">{{ $t("cultivate", [item]) }}</span> -->
                    <span v-else>{{ $t("cultivate", [item]) }}</span>
                </div>
            </div>

            <div class="lucky-table">
                <img class="title-img" :src="luckyImgList[language]" alt="" />

                <div class="table-title">{{ $t("cultivateTip") }}</div>
                <div class="table-header">
                    <div
                        v-for="(item, index) in eventGiftList"
                        :key="index"
                        class="table-header-item"
                    >
                        <img :src="item.icon" alt="" />
                        <div>
                            <p class="item-name">{{ item.diamond_worth }}
                                <img
                                src="https://yaame-static.yaame.io/admin/88a503fd1f0e1ccfea864e7eeb54936a.png"
                                alt=""
                            />
                            </p>
                        </div>
                    </div>
                </div>

                <div class="table-content">
                    <div
                        v-for="(item, index) in drawInfoList"
                        :key="index"
                        class="table-content-item"
                    >
                        <div
                            v-for="(ele, inx) in item.lottery_rewards"
                            :key="inx"
                            class="content-ele"
                        >
                            <template v-if="ele.reward_icon">
                                <p class="gift-name">{{ ele.reward_name }}</p>
                                <div class="gift-icon-div">
                                    <img :src="ele.reward_icon" class="gift-icon" alt="" />
                                </div>
                                <p class="gift-value">
                                    {{ $t('day', [ele.valid_days]) }}
                                </p>
                            </template>
                            <template v-else>
                                <p class="gift-value">{{ ele.reward_name }}</p>
                            </template>
                        </div>
                    </div>
                </div>
            </div>

            <record v-if="showRecord" :list="recordList" @close="popupShow"></record>

            <rule v-show="showRule" @close="popupShow">
                <template v-slot:default>
                    <p>{{ $t("rule1") }}</p>
                    <p>{{ $t("rule2") }}</p>
                    <p style="padding-left: 0.2rem">{{ $t("rule2_1") }}</p>
                    <p style="padding-left: 0.2rem">{{ $t("rule2_2") }}</p>
                    <p style="padding-left: 0.2rem">{{ $t("rule2_3") }}</p>
                    <p>{{ $t("rule3") }}</p>
                    <p style="padding-left: 0.2rem">{{ $t("rule3_1") }}</p>
                    <p style="padding-left: 0.2rem">{{ $t("rule3_2") }}</p>
                    <p style="padding-left: 0.2rem">{{ $t("rule3_3") }}</p>
                    <p>{{ $t("rule4") }}</p>
                    <p>{{ $t("rule5") }}</p>
                </template>
            </rule>

            <Loading v-show="pageLoading" ></Loading>
        </div>
    </refresh>
</template>

<script setup>
import Header from "@/components/common/header.vue";
import { ref, getCurrentInstance, computed, onMounted, nextTick } from "vue";
import { getLanguage } from "@/lib/device.js";
import record from "../components/record";
import { Toast } from "vant";
import rule from "../components/treeRule";
import {
	getLotteryApi,
	getHistoryApi,
	postLotteryApi,
	getLotteryInfoApi,
} from "../api";
import { Downloader, Parser, Player } from "svga.lite";
import DB from "svga.lite/db";
import Loading from '@/components/common/page_loading.vue'
import refresh from "@/components/common/refresh.vue";
const root = getCurrentInstance();

let language = computed(() => {
	let locale = getLanguage() || "en";
	if (["zh-hk", "zh-tw", "zh-mo", "zh-cn", "zh_cn"].indexOf(locale) > -1) {
		let localEnum = {
			"zh-hk": "zh-tw",
			"zh-tw": "zh-tw",
			"zh-mo": "zh-tw",
			"zh-cn": "zh-cn",
			zh_cn: "zh-cn",
		};

		locale = localEnum[locale];
	}
	return locale;
});

let timeInfo = ref({
	dayLeft: 0,
	dayRight: "D",
	hours: "00",
	minutes: "00",
	seconds: "00",
});

const getCountdown = (time) => {
	// 获取当前时间
	const now = new Date();

	// 设置目标时间
	const target = new Date(time);

	// 计算剩余时间
	const timeDiff = target.getTime() - now.getTime();

	// 确保目标日期在未来
	if (timeDiff <= 0) {
		timeInfo.value = {
			dayLeft: "0",
			dayRight: "D",
			hours: "00",
			minutes: "00",
			seconds: "00",
		};
		clearInterval(pageInterval.value);
		return;
	}

	// 将时间差转换为自然时间单位
	let days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
	let hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	let minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
	let seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

	// 计算倒计时天数的十位数和个位数
	let dayLeft = Math.floor(days / 10);
	let dayRight = days % 10;

	// 天数不足10，设置个位数为"D"
	if (days < 10) {
		dayLeft = dayRight;
		dayRight = "D";
	}

	// 时、分、秒不足10，前面补0
	hours = hours < 10 ? "0" + hours : hours;
	minutes = minutes < 10 ? "0" + minutes : minutes;
	seconds = seconds < 10 ? "0" + seconds : seconds;

	timeInfo.value = { dayLeft, dayRight, hours, minutes, seconds };
};

let eventGiftList = ref([
	{
		icon: "https://yaame-static.yaame.io/admin/03d8ffb8c8241bce193f4eae0a2aae93.png",
		exp: "+10EXP",
		diamond_worth: "10",
	},
	{
		icon: "https://yaame-static.yaame.io/admin/f5a68af53d0be348e6cbc91cbe1fe111.png",
		exp: "+50EXP",
		diamond_worth: "50",
	},
	{
		icon: "https://yaame-static.yaame.io/admin/597fe269d7d0a36c079a14a8758b33e7.png",
		exp: "+100EXP",
		diamond_worth: "100",
	},
]);
let bgImg = ref({
	"zh-cn":
		"https://yaame-static.yaame.io/admin/917b0c8e899954d11eb265f8ce42528f.png",
	"zh-tw":
		"https://yaame-static.yaame.io/admin/f9b7000e03bd4c8a6ed4595106626f5b.png",
	en: "https://yaame-static.yaame.io/admin/6e39fea80969e37fb143baefd9b70e5d.png",
	id: "https://yaame-static.yaame.io/admin/2b1040fa86239643fb1eb106a9d32942.png",
	ar: "https://yaame-static.yaame.io/admin/8b99079c72876239e9dae766ecb3bef1.png",
});
let luckyImgList = ref({
	"zh-cn":
		"https://yaame-static.yaame.io/admin/e527e7d98b7087bfb85976efc7a27ab7.png",
	"zh-tw":
		"https://yaame-static.yaame.io/admin/e527e7d98b7087bfb85976efc7a27ab7.png",
	en: "https://yaame-static.yaame.io/admin/e527e7d98b7087bfb85976efc7a27ab7.png",
	id: "https://yaame-static.yaame.io/admin/e527e7d98b7087bfb85976efc7a27ab7.png",
	ar: "https://yaame-static.yaame.io/admin/e527e7d98b7087bfb85976efc7a27ab7.png",
});

let levelList = ref([
	{
		img: "https://yaame-static.yaame.io/admin/7c715883bfea3a5ae0f14126671a6be4.png",
		left: "0.48rem",
	},
	{
		img: "https://yaame-static.yaame.io/admin/22a2237006b6c70fa58fc060c9eeae3d.png",
		left: "2.83rem",
	},
	{
		img: "https://yaame-static.yaame.io/admin/4907c0fe555607bfc5132f3e655d8e72.png",
		left: "5.17rem",
	},
]);

let btnImgList = ref([
	{
		img: "https://yaame-static.yaame.io/admin/9394bdffbbfdeb0ad07c84b984e24d37.png",
		type: "js",
		active:
			"https://yaame-static.yaame.io/admin/d1e9fab7da2c734048e9b8183308e497.png",
	},
	{
		img: "https://yaame-static.yaame.io/admin/560f634abea4b2dc31aa80d7a33b9d3c.png",
		type: "xj",
		active:
			"https://yaame-static.yaame.io/admin/92e99c434532b176277053302d5cac48.png",
	},
	{
		img: "https://yaame-static.yaame.io/admin/f62971e4277690a75a7bf8d548ca1822.png",
		type: "sf",
		active:
			"https://yaame-static.yaame.io/admin/5765e84430c72652f62d65d1c0a56015.png",
	},
]);
let btnActive = ref("js");

let recordList = ref([]);
let showRecord = ref(false);
let showRule = ref(false);
const getHistory = async () => {
	const res = await getHistoryApi();
	if (res.status === 1000) {
		recordList.value = res.data.history_records;
	}
};

const popupShow = (val) => {
	showRecord.value = false;
	showRule.value = false;
};

let treeInfo = ref({
	current_level: 0,
	current_level_exp: 0,
	next_level_exp: 5000,
	plant_status: 0,
});
let pageLoading = ref(true);

const pageInterval = ref(null);
const wlRefresh = ref(null);
const getLottery = async () => {
	const res = await getLotteryApi();
	if (res.status === 1000) {
		treeInfo.value = res.data.plant;

        if (pageInterval.value) {
            clearInterval(pageInterval.value);
        }
		getCountdown(res.data.activity_end_time);
		pageInterval.value = setInterval(() => {
			getCountdown(res.data.activity_end_time);
		}, 1000);

        setTimeout(() => {
            pageLoading.value = false;
        }, 0);

        setTimeout(() => {
			wlRefresh.value.isLoading = false;
		}, 500);
	}
};
let treeProgress = computed(() => {
	return `${
		(treeInfo.value.current_level_exp / treeInfo.value.next_level_exp) * 100
	}%`;
});

const currentLevelImgList = ref([
	{
		img: "https://yaame-static.yaame.io/admin/6e3b3f7d2d58d0a50ba1716ceaeaacff.png",
	},
	{
		img: "https://yaame-static.yaame.io/admin/cf0da2bdb245d9eaf989e2fb84c9a038.png",
	},
	{
		img: "https://yaame-static.yaame.io/admin/dd9818b052657a1df20af58fe0946197.png",
	},
	{
		img: "https://yaame-static.yaame.io/admin/14b17b6435d8679eeb90a5c74c59c771.png",
	},
	{
		img: "https://yaame-static.yaame.io/admin/88b07430a8d200ce9a9ea2b9f778c23a.png",
	},
]);

const currentLevelImg = computed(() => {
	return currentLevelImgList.value[treeInfo.value.plant_status].img;
});
let showAni = ref(false);
let isAnimation = ref(false);

let rewardList = ref([]);
let showBubble = ref(false);
let lotteryNum = ref(1);
const postLottery = async (lottery_times) => {
	if (isAnimation.value) {
		return;
	}
    if (showBubble.value) {
        return;
    }

    localStorage.setItem("btnActive", btnActive.value);

    lotteryNum.value = lottery_times;
	const res = await postLotteryApi({
		lottery_strategy_type: btnActive.value,
		lottery_times,
		activity_type: "HARVEST",
	});
	if (res.status === 1000) {
		if (
			res.data.plant.receive_apple
		) {
			monster.player.start();
			showAni.value = true;
			isAnimation.value = true;

			setTimeout(() => {
				showAni.value = false;
				monster.player.stop();
				isAnimation.value = false;
			}, 3320);
		}
		treeInfo.value = res.data.plant;
		// Toast.success(res.data.lottery_rewards);

        rewardList.value = res.data.lottery_rewards;

        setTimeout(() => {
            showBubble.value = true;

            setTimeout(() => {
                showBubble.value = false;
            }, 3000);
        }, 100);
	} else if (res.status === 6600) {
		Toast.fail(res.desc);
        setTimeout(() => {
            window.location.href = "wlyaame://mine/shop/diamond?popup=1";
        }, 2000);
	} else {
		Toast.fail(res.desc);
	}
};

let drawInfoList = ref([]);
const getLotteryInfo = async () => {
	const res = await getLotteryInfoApi({ activity_type: "HARVEST" });
	if (res.status === 1000) {

        let rewardList = [res.data.lottery_strategy_config.js, res.data.lottery_strategy_config.xj, res.data.lottery_strategy_config.sf];


		for (let index = 0; index < rewardList.length; index++) {
            let element = rewardList[index];
            for (let index = 0; index < element.lottery_rewards.length; index++) {
                let item = element.lottery_rewards[index];
                let reg = /\d+/g;
                let reward_num = String(item.reward_name).match(reg);
                if (reward_num) {
                    item.reward_num = Number(reward_num[0]);
                } else {
                    item.reward_num = 0;
                }
            }
        }

        rewardList.forEach((item) => {
            item.lottery_rewards.sort((a, b) => {
                if (a.object_type === "INCOME_ANIMATION") {
                    return 1;
                }
                if (a.object_type === "AVATAR_DRESS") {
                    return 1;
                }
                return a.reward_num - b.reward_num;
            });
        });

        drawInfoList.value = rewardList;

        console.log(rewardList);
	}
};

const monster = ref({
	downloader: null,
	parser: null,
	player: null,
	svgaStaticData: null,
});

const initSVGAData = async (obj, canvas, svga_static) => {
	let options = obj;
	options.downloader = new Downloader();
	// 默认调用 WebWorker 线程解析
	// 可配置 new Parser({ disableWorker: true }) 禁止
	options.parser = new Parser();
	// #canvas 是 HTMLCanvasElement
	options.player = new Player(`#${canvas}`);

	let fileOptions = void 0;
	let db = void 0;
	try {
		db = new DB();
	} catch (error) {
		console.error(error);
	}
	if (db) {
		fileOptions = await db.find(svga_static);
	}

	if (fileOptions) {
		options.svgaStaticData = fileOptions;
	} else {
		const fileStaticData = await options.downloader.get(svga_static);
		options.svgaStaticData = await options.parser.do(fileStaticData);

		db && (await db.insert(svga_static, options.svgaStaticData));
	}

	options.player.set({ loop: 1 });

	await options.player.mount(options.svgaStaticData);
	options.player.start();
};


const openRecord = async () => {
    await getHistory();
    nextTick(() => {
        showRecord.value = true;
    });
};

onMounted(() => {
	getHistory();
	getLottery();
	getLotteryInfo();

	initSVGAData(
		monster,
		"monster_canvas",
		"https://yaame-static.yaame.io/admin/ef4ce6ad50993271072b3a446c888bc1.svga"
	);

    if (localStorage.getItem("btnActive")) {
        btnActive.value = localStorage.getItem("btnActive");
    }
});
</script>

<style lang="less" scoped>
.send {
	width: 7.5rem;
	min-height: 100vh;
	background-size: contain;
	background-repeat: no-repeat;
	background-image: url(https://yaame-static.yaame.io/admin/917b0c8e899954d11eb265f8ce42528f.png);
	padding-top: 5.3rem;
	padding-bottom: 0.4rem;
	.rule-icon {
		position: fixed;
		right: 0;
		width: 1.48rem;
		height: 0.66rem;
		background-size: contain;
		background-repeat: no-repeat;
		background-image: url("https://yaame-static.yaame.io/admin/0fdcf33d5bf7f3b7292532dda82fad07.png");
		text-align: center;
		padding-left: 0.14rem;
		line-height: 0.66rem;
		font-size: 0.28rem;
		color: #b46223;
		top: 2.59rem;
		z-index: 19;
	}
	.time-container {
		div {
			text-align: center;
			line-height: 0.67rem;
			font-size: 0.24rem;
			color: #fff;
			position: absolute;
			top: 4.47rem;
			height: 0.67rem;
		}
		.day-left {
			width: 0.67rem;
			left: 1.65rem;
		}
		.day-right {
			width: 0.67rem;
			left: 2.43rem;
		}
		.hour {
			width: 0.79rem;
			left: 3.21rem;
		}
		.minute {
			width: 0.79rem;
			left: 4.14rem;
		}
		.second {
			width: 0.79rem;
			left: 5.07rem;
		}
	}
	.tree-container {
		width: 7rem;
		height: 10.82rem;
		background-size: contain;
		background-repeat: no-repeat;
		margin-top: 0.3rem;
		margin-left: 0.25rem;
		background-image: url(https://yaame-static.yaame.io/admin/dee8f2dd025f1dc0a496bf25f1045aa7.png);
		position: relative;
		.level-img {
			width: 1.35rem;
			height: 1.35rem;
			position: absolute;
			top: 0.64rem;
			img {
				width: 1.35rem;
				height: 1.35rem;
			}
		}
		.arrow {
			width: 0.74rem;
			height: 0.52rem;
			top: 1.05rem;
			left: 1.96rem;
			position: absolute;
			&.right {
				left: 4.3rem;
			}
		}
		.history {
			position: absolute;
			right: 0.48rem;
			width: 0.88rem;
			height: 1.2rem;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url("https://yaame-static.yaame.io/admin/55587015a7824ba579e65c0f45ec037e.png");
            padding-top: 0.9rem;
			font-weight: 600;
            font-size: 0.24rem;
            color: #844E19;
			top: 2.3rem;
            text-align: center;
			z-index: 18;
            padding-right: 0.1rem;
		}
		.progress {
			width: 4.4rem;
			height: 0.7rem;
			position: absolute;
			left: 1.3rem;
			top: 8.13rem;
			.progress-container {
				width: 4.4rem;
				height: 0.28rem;
				background: #dea458;
				border-radius: 0.25rem;
				border: 0.03rem solid #f6c78a;
                span {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 4.4rem;
                    height: 0.28rem;
                    font-size: 0.18rem;
					line-height: 0.28rem;
					color: #ffffff;
                    opacity: 0.8;
                    padding-right: 0.1rem;
                    text-align: center;
                }
				.progress-content {
					height: 0.24rem;
					background: linear-gradient(180deg, #fe9943 0%, #e44f0b 100%);
					border-radius: 0.15rem;
					border: 0.02rem solid #fac94f;
				}
			}
			.progress-text {
				width: 4.4rem;
				height: 0.4rem;
				display: flex;
				justify-content: space-between;
				padding-top: 0.1rem;
				font-weight: 600;
				font-size: 0.2rem;
				color: #bb6918;
			}
		}
		.current-img {
			width: 5.4rem;
			height: auto;
			position: absolute;
			left: 0.8rem;
			top: 2.37rem;
		}
		.monster_canvas {
			width: 5.4rem;
			height: auto;
			position: absolute;
			left: 0.8rem;
			top: 2.37rem;
			z-index: 1;
		}
		.btn-list {
			width: 7rem;
			height: 1.03rem;
			display: flex;
			padding: 0 0.91rem;
			justify-content: space-between;
			position: absolute;
			left: 0;
			top: 9.18rem;
			.btn-item {
				width: 0.98rem;
				height: 1.03rem;
				img {
					width: 0.98rem;
					height: 1.03rem;
				}
			}
		}

        .bubble-list {
            width: 7rem;
            height: 0.8rem;
            position: absolute;
            bottom: 1rem;
            left: 0;
            display: flex;
            padding: 0 0.5rem;
            justify-content: space-around;
            z-index: 3;
            .bubble {
                width: 0.8rem;
                height: 0.8rem;
                background-size: contain;
                background-repeat: no-repeat;
                background-image: url(https://yaame-static.yaame.io/admin/c0bf0a94ff63a9b7c07374aa0e870549.png);
                animation: bubbleFloat 3s ease-in-out forwards;
                opacity: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                .exp {
                    font-weight: normal;
                    font-size: 0.18rem;
                    text-align: center;
                    color: #E8F95E;
                    width: 0.64rem;
                    height: 0.36rem
                }
                .gift {
                    width: 0.6rem;
                    height: 0.6rem;
                    position: relative;
                    img {
                        width: 0.6rem;
                        height: 0.6rem;
                    }
                    .img-count {
                        min-width: 0.34rem;
                        height: 0.15rem;
                        text-align: center;
                        line-height: 0.15rem;
                        background: #E8F95E;
                        border-radius: 0.08rem;
                        padding: 0 0.08rem;
                        font-size: 0.12rem;
                        color: #637204;
                        position: absolute;
                        left: 0.36rem;
                        top: 0.02rem;
                    }
                }
            }
        }
	}
	.draw-btn-list {
		width: 7.5rem;
		display: flex;
		margin-top: 0.24rem;
		margin-bottom: 0.26rem;
		padding: 0 0.31rem;
		display: flex;
		justify-content: space-between;
		.draw-btn {
			width: 2.2rem;
			height: 0.88rem;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/65e0ce1ac7a24e800184ad915accf720.png);
			text-align: center;
			// line-height: 0.88rem;
			font-weight: 600;
			font-size: 0.28rem;
			color: #b46223;
            display: flex;
            justify-content: center;
            align-items: center;
            line-height: 1;
            &.disabled {
                background-image: url('https://yaame-static.yaame.io/admin/bf6436dd6fab03e458646ea854c165c8.png');
                color: #7F6851;
            }
		}
	}
	.lucky-table {
		width: 7.1rem;
		min-height: 6.18rem;
		position: relative;
		left: 0.2rem;
		margin-top: 0.9rem;
		background: #f5c88d;
		box-shadow: inset 0 -0.11rem 0.1rem 0 #f5c88d,
			inset 0 0.05rem 0.16rem 0 #f5c88d;
		border-radius: 0.2rem;
		border: 0.04rem solid #d69949;
		.title-img {
			width: 7.49rem;
			height: 1.58rem;
			position: absolute;
			left: -0.2rem;
			top: -0.67rem;
		}
        .table-title {
			width: 7.02rem;
			height: 1.6rem;
			border-bottom: 0.04rem solid #d69949;
			text-align: center;
			line-height: 2.48rem;
			font-weight: 500;
			font-size: 0.26rem;
			color: #b46223;
		}
		.table-header {
			width: 7.02rem;
			height: 2rem;
			display: flex;
			justify-content: space-between;
			border-bottom: 0.04rem solid #d69949;
			.table-header-item {
				flex: 1;
				border-right: 0.04rem solid #d69949;
				padding-top: 0.3rem;
				display: flex;
				flex-wrap: wrap;
				justify-content: center;
				img {
					width: 1.08rem;
					height: 1.01rem;

					margin-right: 0.06rem;
				}
				.item-name {
					width: 2.3rem;
					text-align: center;
					font-weight: 500;
					font-size: 0.24rem;
					color: #b46223;
                    img {
                        width: 0.26rem;
                        height: auto;
                        vertical-align: middle;
                        position: relative;
                        bottom: 0.02rem;
                    }
				}
				&:last-child {
					border-right: none;
				}
			}
		}
		.table-content {
			width: 7.02rem;
			min-height: 3.66rem;
			display: flex;
			justify-content: space-between;
			.table-content-item {
				flex: 1;
				border-right: 0.04rem solid #d69949;

				&:last-child {
					border-right: none;
				}

				.content-ele {
					display: flex;
					flex-wrap: wrap;
					justify-content: center;
					padding-top: 0.18rem;
					padding-bottom: 0.18rem;
					border-bottom: 0.04rem solid #d69949;
					&:last-child {
						border-bottom: none;
					}
					.gift-icon-div {
						width: 1.5rem;
						height: 1.48rem;
						background: #eaa554;
						border-radius: 0.2rem;
						border: 0.01rem solid #d0882a;
						display: flex;
						justify-content: center;
						align-items: center;
						margin: 0.16rem 0;
						img {
							width: 1.2rem;
							height: 1.2rem;
						}
					}
					.gift-name {
						font-weight: 400;
						font-size: 0.2rem;
						color: #b46223;
						width: 2.3rem;
						text-align: center;
					}
					.gift-value {
						width: 2.3rem;
						display: inline-block;
						font-weight: 400;
						font-size: 0.26rem;
						color: #b46223;
						text-align: center;
						img {
							width: 0.26rem;
							height: auto;
							vertical-align: middle;
							position: relative;
							bottom: 0.04rem;
						}
					}
				}
			}
		}
	}
}
@keyframes bubbleFloat {
    0% {
        transform: translateY(0) scale(1) translateX(0);
        opacity: 0;
    }
    40% {
        transform: translateY(-200px) scale(1.1) translateX(10px);
        opacity: 1;
    }
    80% {
        transform: translateY(-200px) scale(1.1) translateX(10px);
        opacity: 1;
    }
    85% {
        opacity: 0.7;
    }
    100% {
        transform: translateY(-400px) scale(1) translateX(-10px);
        opacity: 0;
    }
}

</style>
