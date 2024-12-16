<template>
	<refresh class="refresh" ref="wlRefresh" @onRefresh="getGift">
		<div
			:style="{ 'background-image': `url(${bgImg[language]})` }"
			class="send"
		>
			<Header color="harvest">{{ $t("title") }}</Header>

			<div class="rule-icon" @click="showRule = true">{{ $t("rule") }}</div>

			<div class="time-container">
				<div class="day-left">{{ timeInfo.dayLeft }}</div>
				<div class="day-right">{{ timeInfo.dayRight }}</div>
				<div class="hour">{{ timeInfo.hours }}</div>
				<div class="minute">{{ timeInfo.minutes }}</div>
				<div class="second">{{ timeInfo.seconds }}</div>
			</div>

			<div
				:style="{ 'background-image': `url(${eventImgList[language]})` }"
				class="event-gift-container"
			>
				<p class="title-p">{{ $t("giftTip") }}</p>

				<div class="gift-list">
					<div
						v-for="(item, index) in eventGiftList"
						:key="index"
						class="gift-item"
					>
						<div class="gift-item-img">
							<img :src="item.gift_icon" alt="" />
						</div>

						<p class="gift-item-value no-wrap">
							<img
								src="https://yaame-static.yaame.io/admin/88a503fd1f0e1ccfea864e7eeb54936a.png"
								alt=""
							/>
							{{ item.diamond_price }}
						</p>
						<p class="gift-item-value no-wrap">+{{ item.exp_amount }}EXP</p>
					</div>
				</div>
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
						<span
							>{{ treeInfo.current_level_exp }} /
							{{ treeInfo.next_level_exp }}</span
						>
						<div
							:style="{ width: treeProgress }"
							class="progress-content"
						></div>
					</div>
					<div class="progress-text">
						<div>Lv.{{ treeInfo.current_level }}</div>
						<div>Lv.{{ treeInfo.current_level + 1 }}</div>
					</div>
				</div>

				<img class="current-img" :src="currentLevelImg" alt="" />
			</div>
			<div class="lucky-table">
				<img class="title-img" :src="luckyImgList[language]" alt="" />

				<div class="table-title">{{ $t("sendTip") }}</div>

				<div class="table-header">
					<div
						v-for="(item, index) in eventGiftList"
						:key="index"
						class="table-header-item"
					>
						<img :src="item.gift_icon" alt="" />
						<div>
							<p style="padding-top: 0.1rem" class="item-name">
								{{ item.gift_name }}
							</p>
							<p class="item-value">
								<img
									src="https://yaame-static.yaame.io/admin/88a503fd1f0e1ccfea864e7eeb54936a.png"
									alt=""
								/>
								{{ item.diamond_price }}
							</p>
						</div>
					</div>
				</div>

				<div class="table-content">
					<div
						v-for="(item, index) in eventGiftList"
						:key="index"
						class="table-content-item"
					>
						<p v-for="(ele, inx) in item.reward_amounts" :key="inx">
							<img
								src="https://yaame-static.yaame.io/admin/88a503fd1f0e1ccfea864e7eeb54936a.png"
								alt=""
							/>{{ ele }}
						</p>
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
import { getGiftApi, getHistoryApi } from "../api";
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

let bgImg = ref({
	"zh-cn":
		"https://yaame-static.yaame.io/admin/7b927c00fd461995dd556183357642bf.png",
	"zh-tw":
		"https://yaame-static.yaame.io/admin/b46bd12439ecfba9ed4af1eecefed418.png",
	en: "https://yaame-static.yaame.io/admin/2593845c3eec5a17c098d9030ea78b2e.png",
	id: "https://yaame-static.yaame.io/admin/904561600d1a228f8d93b9ae3d7d2633.png",
	ar: "https://yaame-static.yaame.io/admin/d3446c554a072507453d2d28fbed7c8e.png",
});

let eventImgList = ref({
	"zh-cn":
		"https://yaame-static.yaame.io/admin/877f6d7b58e2cc828c0bdec2795fce58.png",
	"zh-tw":
		"https://yaame-static.yaame.io/admin/fb2108e8877670287d7d787797a899f5.png",
	en: "https://yaame-static.yaame.io/admin/34c2d3a3f8f9e3695fe82ac74d89ff30.png",
	id: "https://yaame-static.yaame.io/admin/6888fb4e35bbde69713d782938381a13.png",
	ar: "https://yaame-static.yaame.io/admin/0ace75e964f7fb4e99c3da8f42bef2bc.png",
});

let luckyImgList = ref({
	"zh-cn":
		"https://yaame-static.yaame.io/admin/1c3803d72c1e428afeedec984fa004fd.png",
	"zh-tw":
		"https://yaame-static.yaame.io/admin/2101c4fd969318004b69fcd13db1d3c5.png",
	en: "https://yaame-static.yaame.io/admin/7faf946db7d07e466a26f0351c01a96c.png",
	id: "https://yaame-static.yaame.io/admin/c5fbef6949fa8a12950b32331e890624.png",
	ar: "https://yaame-static.yaame.io/admin/8f93e55df26c15bb15276a8142cb54ff.png",
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

let eventGiftList = ref([]);
let treeInfo = ref({
	current_level: 0,
	current_level_exp: 0,
	next_level_exp: 5000,
	plant_status: 0,
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

const pageInterval = ref(null);
const wlRefresh = ref(null);
const getGift = async () => {
	const res = await getGiftApi();
	if (res.status === 1000) {
		eventGiftList.value = res.data.gift_list;
		treeInfo.value = res.data.plant;

		if (pageInterval.value) {
			clearInterval(pageInterval.value);
		}
		getCountdown(res.data.end_time);
		pageInterval.value = setInterval(() => {
			getCountdown(res.data.end_time);
		}, 1000);

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
const openRecord = async () => {
	await getHistory();
	nextTick(() => {
		showRecord.value = true;
	});
};

onMounted(() => {
	getGift();
	getHistory();
});
</script>

<style lang="less" scoped>
.send {
	width: 7.5rem;
	min-height: 100vh;
	background-size: contain;
	background-repeat: no-repeat;
	background-image: url(https://yaame-static.yaame.io/admin/7b927c00fd461995dd556183357642bf.png);
	padding-top: 5.84rem;
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
	.event-gift-container {
		width: 7rem;
		height: 5.1rem;
		background-size: contain;
		background-repeat: no-repeat;
		padding-top: 1.51rem;
		margin-left: 0.25rem;
		.title-p {
			padding: 0 0.3rem;
			width: 7rem;
			height: 0.3rem;
			text-align: center;
			display: flex;
			align-items: center;
			justify-content: center;
			font-weight: 600;
			font-size: 0.22rem;
			color: #b46223;
		}
		.gift-list {
			width: 6.58rem;
			height: 3rem;
			display: flex;
			justify-content: space-between;
			margin-top: 0.32rem;
			margin-left: 0.21rem;
			.gift-item {
				width: 2.08rem;
				height: 3rem;
				.gift-item-img {
					width: 2.08rem;
					height: 1.93rem;
					display: flex;
					justify-content: center;
					align-items: center;
					img {
						width: 2.08rem;
						height: 1.93rem;
					}
				}
				.gift-item-value {
					width: 2.08rem;
					text-align: center;
					font-weight: 600;
					font-size: 0.26rem;
					color: #b46223;
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
	.tree-container {
		width: 7rem;
		height: 9.42rem;
		background-size: contain;
		background-repeat: no-repeat;
		margin-top: 0.3rem;
		margin-left: 0.25rem;
		background-image: url(https://yaame-static.yaame.io/admin/867b38b58d8a8700e37c115b36d61f84.png);
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
			color: #844e19;
			top: 2.3rem;
			text-align: center;
			z-index: 18;
			padding-right: 0.1rem;
		}
		.current-img {
			width: 5.4rem;
			height: auto;
			position: absolute;
			left: 0.8rem;
			top: 2.37rem;
		}
		.progress {
			width: 4.4rem;
			height: 0.7rem;
			position: absolute;
			left: 1.3rem;
			bottom: 0.6rem;
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
			height: 1.6rem;
			display: flex;
			justify-content: space-between;
			border-bottom: 0.04rem solid #d69949;
			.table-header-item {
				flex: 1;
				border-right: 0.04rem solid #d69949;
				padding-top: 0.3rem;
				display: flex;
				justify-content: center;
				img {
					width: 1.08rem;
					height: 1.01rem;

					margin-right: 0.06rem;
				}
				.item-name {
					font-weight: 400;
					font-size: 0.28rem;
					color: #b46223;
				}
				.item-value {
					font-weight: 400;
					font-size: 0.22rem;
					color: #b46223;
					img {
						width: 0.26rem;
						height: auto;
						vertical-align: middle;
						position: relative;
						bottom: 0.04rem;
					}
				}
				&:last-child {
					border-right: none;
				}
			}
		}
		.table-content {
			width: 7.02rem;
			height: 3.66rem;
			display: flex;
			justify-content: space-between;
			.table-content-item {
				flex: 1;
				padding-top: 0.2rem;
				border-right: 0.04rem solid #d69949;
				font-weight: 600;
				text-align: center;
				font-size: 0.26rem;
				color: #b46223;
				p {
					margin-bottom: 0.08rem;
					img {
						width: 0.26rem;
						height: auto;
						vertical-align: middle;
						position: relative;
						bottom: 0.04rem;
					}
				}
				&:last-child {
					border-right: none;
				}
			}
		}
	}
}
</style>
