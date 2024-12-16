<!--
 * @Author: Elk
 * @Date: 2024-05-10 11:11:11
 * @FilePath: /yaame-h5/src/pages/YaameSingKing/views/exchange.vue
 * @Description: 
-->
<template>
	<refresh class="refresh" ref="wlRefresh" @onRefresh="getSendGiftInfo">
		<div
			:style="{ 'background-image': `url(${titleImgList[language]})` }"
			class="task"
		>
			<Header color="song">{{ $t("title") }}</Header>

			<div class="rule-icon" @click="showVisible('rule')">{{ $t("rule") }}</div>

			<div v-if="activityIsEnd" class="end-container">
				{{ $t("activityOver") }}
			</div>

			<div v-else class="time-container">
				<div class="day-left">{{ timeInfo.dayLeft }}</div>
				<div class="day-right">{{ timeInfo.dayRight }}</div>
				<div class="hour">{{ timeInfo.hours }}</div>
				<div class="minute">{{ timeInfo.minutes }}</div>
				<div class="second">{{ timeInfo.seconds }}</div>
			</div>

			<div class="gift-container">
				<div
					v-for="(item, index) in song_king_send_gift_exchanges"
					:key="index"
					class="gift-item"
				>
					<div class="gift-img">
						<img :src="item.reward_icon" alt="" />
					</div>
					<p class="gift-value">
						<img
							src="https://yaame-static.yaame.io/admin/c4b82a8b5e6c5c3254987a9ec218c088.png"
							alt=""
						/>{{ item.diamond_worth }}
					</p>
					<p class="gift-info">{{ item.exchange_text }}</p>
					<div class="gift-btn" @click="exchange(item)">
						{{ $t("immediatelyExchange") }}
					</div>

					<div class="have-more">
						<img :src="item.reward_card_img_url" alt="" />
						<span>{{ item.received_card_text }}</span>
					</div>
				</div>
			</div>

			<div class="exchange-list">
				<div
					v-for="(item, index) in song_king_send_gift_cards"
					:key="index"
					class="exchange-item"
				>
					<div class="exchange-img">
						<img :src="item.card_img_url" alt="" />
					</div>
					<div class="exchange-info">
						<div class="title">{{ $t("iHave", [item.received_card_num]) }}</div>
						<div class="info">{{ item.received_card_way_text }}</div>
					</div>
				</div>
			</div>

			<popup v-if="ruleVisible" class="flex-box">
				<div class="rule-container">
					<img
						class="close-btn"
						src="https://yaame-static.yaame.io/admin/9f4d29a6e5833ae45e1f25cb8f481382.png"
						alt=""
						@click="ruleVisible = false"
					/>

					<p class="title">{{ $t("rule") }}</p>

					<div class="content">
						<p class="desc-p">{{ $t("activityTime") }}</p>
						<p class="content-p">{{ $t("taskRuleTime") }}</p>

						<p class="desc-p">{{ $t("activityDescription") }}</p>
						<p class="content-p">{{ $t("cardRule1") }}</p>
						<p class="content-p">{{ $t("cardRule2") }}</p>
						<p class="content-p">{{ $t("cardRule3") }}</p>
						<p class="content-p">{{ $t("cardRule4") }}</p>
						<p class="content-p">{{ $t("cardRule5") }}</p>
						<p class="content-p">
							{{ $t("theFinalInterpretationBelongsToYaame") }}
						</p>
					</div>
				</div>
			</popup>
		</div>
	</refresh>
</template>

<script setup>
import Header from "@/components/common/header.vue";
import { ref, getCurrentInstance, computed, onMounted, onUnmounted } from "vue";
import { getLanguage } from "@/lib/device.js";
import popup from "@/components/common/pop_up.vue";
const root = getCurrentInstance();
import { getSendGiftInfoApi, exchangeApi } from "../api";
import refresh from "@/components/common/refresh.vue";
import { Toast } from "vant";
const t = (val) => {
	return root.proxy.$i18n.t(val);
};

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

let titleImgList = ref({
	"zh-cn":
		"https://yaame-static.yaame.io/admin/0387d95d2304d82501b5ccf5fcbac3ac.png",
	"zh-tw":
		"https://yaame-static.yaame.io/admin/b878b7177d994d6a72eb6f617da9ad0a.png",
	en: "https://yaame-static.yaame.io/admin/4fda7111bb0e17c0570fe24c23ebbbd1.png",
	id: "https://yaame-static.yaame.io/admin/dc52a426d2f264255c059ea191e99a9c.png",
	ar: "https://yaame-static.yaame.io/admin/60381b1cea6f08acff59ca8bf2ea1ef5.png",
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

		clearInterval(exchangeTimeOut);

		activityIsEnd.value = true;
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

const song_king_send_gift_exchanges = ref([]);
const song_king_send_gift_cards = ref([]);
let activity_end_time = ref(0);

let exchangeTimeOut = null;

let activityIsEnd = ref(false);
const wlRefresh = ref(null);
const getSendGiftInfo = async () => {
	const res = await getSendGiftInfoApi();
	if (res.status === 1000) {
		song_king_send_gift_exchanges.value =
			res.data.song_king_send_gift_exchanges;
		song_king_send_gift_cards.value = res.data.song_king_send_gift_cards;

		getCountdown(res.data.activity_end_time);

		activity_end_time.value = res.data.activity_end_time;

        clearInterval(exchangeTimeOut);

		exchangeTimeOut = setInterval(() => {
			getCountdown(activity_end_time.value);
		}, 1000);

		setTimeout(() => {
			wlRefresh.value.isLoading = false;
		}, 500);
	}
};

const exchange = async (item) => {
	const res = await exchangeApi({ reward_id: item.reward_id });
	if (res.status === 1000) {
		getSendGiftInfo();

		Toast(root.proxy.$t("exchangeSuccess"));
	} else {
		console.log(res.desc);
		Toast(res.desc);
	}
};

let ruleVisible = ref(false);

const showVisible = (type) => {
	if (type === "rule") {
		ruleVisible.value = true;
	}
};
onMounted(() => {
	getSendGiftInfo();
});

onUnmounted(() => {
	clearInterval(exchangeTimeOut);
});
</script>

<style scoped lang="less">
.task {
	width: 7.5rem;
	min-height: 100vh;
	background-size: contain;
	background-repeat: no-repeat;
	position: relative;
	padding-top: 5.28rem;
	.rule-icon {
		position: fixed;
		right: 0;
		width: 0.99rem;
		height: 0.48rem;
		background-size: contain;
		background-repeat: no-repeat;
		background-image: url("https://yaame-static.yaame.io/admin/6b52480b77d8fa65207695d9057d79dd.png");
		text-align: center;
		padding-left: 0.14rem;
		line-height: 0.48rem;
		font-size: 0.22rem;
		color: #ffda45;
		top: 2.43rem;
		z-index: 19;
	}
	.time-container {
		width: 5.31rem;
		height: 1rem;
		background-size: contain;
		background-repeat: no-repeat;
		background-image: url(https://yaame-static.yaame.io/admin/e37028bb7dd9a1f2b8c6564e4f6f70ba.png);
		margin-left: 1.1rem;
		margin-top: 0.3rem;
		position: relative;
		div {
			text-align: center;
			line-height: 0.58rem;
			font-size: 0.24rem;
			color: #fffd99;
			position: absolute;
			top: 0.22rem;
			height: 0.58rem;
		}
		.day-left {
			width: 0.58rem;
			left: 0.66rem;
		}
		.day-right {
			width: 0.59rem;
			left: 1.33rem;
		}
		.hour {
			width: 0.7rem;
			left: 2.11rem;
		}
		.minute {
			width: 0.7rem;
			left: 3.04rem;
		}
		.second {
			width: 0.7rem;
			left: 3.93rem;
		}
	}
	.end-container {
		width: 5.31rem;
		height: 1rem;
		background-size: contain;
		background-repeat: no-repeat;
		background-image: url(https://yaame-static.yaame.io/admin/ecb06c13f9c20030f5d7515adeb8ded0.png);
		text-align: center;
		line-height: 1rem;
		font-size: 0.24rem;
		color: #fffd99;
		margin-left: 1.1rem;
	}

	.gift-container {
		width: 7.5rem;
		height: 9.97rem;
		margin-top: 0.4rem;
		margin-bottom: 0.26rem;
		padding: 0 0.24rem;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		.gift-item {
			width: 3.4rem;
			height: 4.77rem;
			background: #7655ff;
			box-shadow: inset 0 -0.04rem -0.03rem 0 rgba(100, 46, 245, 0.24),
				inset 0 0.04rem 0.03rem 0 rgba(163, 129, 255, 0.55);
			border-radius: 0.24rem;
			border: 0.01rem solid #f7e7b9;
			padding-top: 0.17rem;
			.gift-img {
				width: 1.4rem;
				height: 1.4rem;
				background: #4914c4;
				border-radius: 0.16rem;
				border: 0.02rem solid #ffe981;
				margin-left: 1rem;
				display: flex;
				justify-content: center;
				align-items: center;
				img {
					width: 0.8rem;
					height: 0.8rem;
				}
			}
			.gift-value {
				width: 3.4rem;
				text-align: center;
				font-size: 0.28rem;
				color: #ffffff;
				margin-top: 0.14rem;
				img {
					width: 0.28rem;
					height: auto;
					vertical-align: middle;
				}
			}
			.gift-info {
				width: 3.4rem;
				text-align: center;
				font-size: 0.2rem;
				color: #ffffff;
				margin-top: 0.06rem;
			}
			.gift-btn {
				width: 2.41rem;
				height: 0.74rem;
				background-size: contain;
				background-repeat: no-repeat;
				background-image: url(https://yaame-static.yaame.io/admin/878cf9942bf6990bf891b46bce94ec5a.png);
				text-align: center;
				line-height: 0.74rem;
				font-weight: 500;
				font-size: 0.24rem;
				color: #9b5300;
				margin-left: 0.5rem;
				margin-top: 0.16rem;
			}
			.have-more {
				width: 3.07rem;
				height: 0.9rem;
				margin-left: 0.18rem;
				margin-top: 0.17rem;
				background-size: contain;
				background-repeat: no-repeat;
				background-image: url(https://yaame-static.yaame.io/admin/50c3548a75d6501472adf7bbe5da4ffa.png);
				display: flex;
				align-items: center;
				padding-left: 0.22rem;
				font-weight: 400;
				font-size: 0.2rem;
				color: #ffffff;
				img {
					width: 0.42rem;
					height: 0.6rem;
					margin-right: 0.1rem;
				}
			}
		}
	}
	.exchange-list {
		width: 7.34rem;
		margin-left: 0.08rem;
		height: 10.59rem;
		background-repeat: no-repeat;
		background-size: 7.34rem auto;
		background-image: url(https://yaame-static.yaame.io/admin/453759d8f2e3bc87c0b2d078ddaaa52a.png);
		padding-top: 0.97rem;
		.exchange-item {
			width: 6.74rem;
			height: 2.1rem;
			margin-left: 0.3rem;
			margin-bottom: 0.3rem;

			background: #6532f6;
			box-shadow: inset 0 -0.04rem 0.03rem 0 rgba(100, 46, 245, 0.24),
				inset 0 0.04rem 0.03rem 0 rgba(163, 129, 255, 0.19);
			border-radius: 0.24rem;
			border: 0.02rem solid #f7e7b9;

			display: flex;
			padding-top: 0.15rem;
			padding-left: 0.39rem;
			.exchange-img {
				width: 1.8rem;
				height: 1.8rem;
				background: #4914c4;
				border-radius: 0.16rem;
				border: 0.02rem solid #ffe981;

				display: flex;
				justify-content: center;
				align-items: center;
				img {
					width: 1.06rem;
					height: auto;
				}
			}
			.exchange-info {
				width: 4.22rem;
				margin-left: 0.25rem;
				padding-top: 0.16rem;
				.title {
					font-weight: 600;
					font-size: 0.28rem;
					color: #ffffff;
				}
				.info {
					margin-top: 0.12rem;
					font-weight: 400;
					font-size: 0.24rem;
					color: #ffffff;
                    word-break: break-all;
				}
			}
		}
	}

	.flex-box {
		display: flex;
		justify-content: center;
		align-items: center;
		.rule-container {
			width: 6.2rem;
			height: 7.15rem;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url("https://yaame-static.yaame.io/admin/fe4f1c6bc54787e99ae770507b675d05.png");
			position: relative;
			padding-top: 0.45rem;
			padding-left: 0.81rem;
			padding-right: 0.76rem;
			.close-btn {
				width: 0.5rem;
				height: 0.5rem;
				position: absolute;
				left: 2.83rem;
				bottom: -1rem;
			}
			.title {
				width: 4.64rem;
				text-align: center;
				font-weight: normal;
				font-size: 0.32rem;
				color: #ffffff;
				margin-bottom: 0.3rem;
			}
			.content {
				width: 4.64rem;
				height: 5rem;
				overflow-y: scroll;
			}
			.desc-p {
				font-size: 0.26rem;
				color: #ffffff;
			}
			.content-p {
				font-size: 0.22rem;
				color: rgba(255, 255, 255, 0.8);
			}
		}
	}
}
</style>
