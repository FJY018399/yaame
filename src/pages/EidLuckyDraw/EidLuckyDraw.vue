<template>
	<div class="main">
		<custom-header color="white">{{ $t("eid.lucky.draw") }}</custom-header>

        <img class="header-img" src="https://yaame-static.yaame.io/admin/86e137595481d72e2d2d48e0c1e42c39.png" alt="">

		<img :src="titleImgList[language]" class="title-img" alt="title" />

		<img
			:style="{ left: language === 'ar' ? '0.22rem' : '6.68rem' }"
			class="rule-icon"
			src="https://yaame-static.yaame.io/admin/892f28583d811069ffe46b54bc2f4e3b.png"
			alt=""
			@click="ruleVisible = true"
		/>
		<img
			:style="{ left: language === 'ar' ? '0.22rem' : '6.68rem' }"
			class="record-icon"
			src="https://yaame-static.yaame.io/admin/c844efe630fd3b371f525501bf325c1c.png"
			alt=""
			@click="recordVisible = true; recordTabActive = 'silver'"
		/>

		<!-- <img
			class="time-tab-bg"
			src="https://yaame-static.yaame.io/admin/121426f51b6e1e72538180e2fa69795d.png"
			alt=""
		/> -->

		<div class="time-container">
			<div class="dayL">{{ timeInfo.dayLeft }}</div>
			<div class="dayR">{{ timeInfo.dayRight }}</div>
			<span class="spanL">:</span>
			<span class="spanM">:</span>
			<span class="spanR">:</span>
			<div class="hour">{{ timeInfo.hours }}</div>
			<div class="minute">{{ timeInfo.minutes }}</div>
			<div class="second">{{ timeInfo.seconds }}</div>
		</div>

		<div class="tab-container">
			<div
				v-for="tab in tabList"
				:key="tab.key"
				:class="['tab-item', tabActive === tab.key && 'active']"
				@click="handleTabChange(tab)"
			>
				{{ $t(tab.i18nKey) }}
			</div>
		</div>

		<div class="draw-container">
			<div class="my-diamond">
				<div class="title no-wrap">{{ $t("my.diamond") }}</div>
				<div class="value">{{ myDiamond }}</div>
			</div>
			<div class="my-key">
				<div class="title no-wrap">{{ $t("my.key") }}</div>
				<div class="value">{{ myKey }}</div>
			</div>
			<div v-show="tabActive === 'silver'" class="silver">
				<img
					class="silver-img"
					src="https://yaame-static.yaame.io/admin/87b1b8283ec6696057f1b830125d3df5.png"
					alt=""
				/>
				<div class="point"></div>
				<div :style="{ transform: `rotate(${rotation}deg)` }" class="reward">
					<div
						v-for="(item, index) in silverGiftList"
						:key="index"
						:class="['reward-item', 'reward-item-' + index]"
					>
						<p class="value">
							<img
								src="https://yaame-static.yaame.io/admin/68c29281caa7b1d5543a71276fdd3402.png"
								alt=""
							/>
							{{ item.worth_diamonds }}
						</p>

						<img class="reward-img" :src="item.reward_icon" alt="" />
					</div>
				</div>
				<img
					v-show="pointVisible"
					class="to-height-light"
					src="https://yaame-static.yaame.io/admin/4d887b8b3e4aef1a9c59c1e47d627ec3.png"
					alt=""
				/>
			</div>

			<div v-show="tabActive === 'gold'" class="silver">
				<img
					class="silver-img"
					src="https://yaame-static.yaame.io/admin/27dfe5c2c24b9a94ab286888d843a14c.png"
					alt=""
				/>
				<div class="point gold"></div>
				<div
					:style="{ transform: `rotate(${goldRotation}deg)` }"
					class="reward gold"
				>
					<div
						v-for="(item, index) in goldGiftList"
						:key="index"
						:class="['reward-item', 'reward-item-' + index]"
					>
						<p class="value">
							<img
								src="https://yaame-static.yaame.io/admin/68c29281caa7b1d5543a71276fdd3402.png"
								alt=""
							/>
							{{ item.worth_diamonds }}
						</p>

						<img class="reward-img" :src="item.reward_icon" alt="" />
					</div>
				</div>
				<img
					v-show="pointVisible"
					class="to-height-light"
					src="https://yaame-static.yaame.io/admin/471586b4a90d3bb6a7ee4ec0052c53f4.png"
					alt=""
				/>
			</div>

			<div class="get-diamond">
				<p class="title">{{ $t("get.diamond") }}</p>
				<p class="value">
					<img
						src="https://yaame-static.yaame.io/admin/68c29281caa7b1d5543a71276fdd3402.png"
						alt=""
					/>
					{{ reward_diamonds }}
				</p>
			</div>

			<div :class="['draw-btn', isRotating && 'disabled', tabActive]" @click="postReward">
				<div class="title">{{ $t("open.once") }}</div>
				<div class="value">
					<img
						src="https://yaame-static.yaame.io/admin/53e87f198c97de9bb8bf59c2aaa26812.png"
						alt=""
					/>{{ tabActive === "gold" ? 10 : 1 }}
					+
					<img
						src="https://yaame-static.yaame.io/admin/c4b82a8b5e6c5c3254987a9ec218c088.png"
						alt=""
					/>{{ tabActive === "gold" ? 2000 : 200 }}
				</div>
			</div>

			<div class="progress-container">
				<div class="progress">
					<!-- <div class="progress-mask"></div> -->
					<div
						:style="{ width: (ticket_diamonds / 200) * 100 + '%' }"
						class="progress-content"
					></div>
				</div>

				<div class="progress-num">{{ ticket_diamonds }}/200</div>

				<div class="to-recharge-text">
					<i18n path="recharge.diamond.get.key">
						<template v-slot:diamond>
							<img
								src="https://yaame-static.yaame.io/admin/c4b82a8b5e6c5c3254987a9ec218c088.png"
								alt=""
							/>
						</template>

						<template v-slot:key>
							<img
								place="key"
								src="https://yaame-static.yaame.io/admin/53e87f198c97de9bb8bf59c2aaa26812.png"
								alt=""
							/>
						</template>
					</i18n>
				</div>
				<div class="to-recharge" @click="toRecharge">{{ $t("recharge") }}</div>
			</div>
		</div>

		<popup v-show="ruleVisible" class="flex-box">
			<div class="container">
				<div class="title">{{ $t("activity.rule") }}</div>

				<div class="rule-container">
					<p>{{ $t("activity.time") }}</p>
					<p>{{ $t("activity.rule2") }}</p>
					<p>{{ $t("activity.rule3") }}</p>
					<p>{{ $t("activity.rule4") }}</p>
					<p>{{ $t("activity.rule5") }}</p>
				</div>

				<img
					class="close"
					src="https://yaame-static.yaame.io/admin/17ba2140384ccdb620838154a410e80a.png"
					@click="ruleVisible = false"
				/>
			</div>
		</popup>
		<popup v-show="recordVisible" class="flex-box">
			<div class="container">
				<div class="title">{{ $t("draw.history") }}</div>

				<div class="record-container">
					<div class="record-tab">
						<div
							v-for="(item, index) in tabList"
							:key="item.key"
							:class="[
								'record-tab-item',
								recordTabActive === item.key && 'active',
							]"
							@click="handleRecordTabChange(item)"
						>
							{{ $t(item.i18nKey) }}
						</div>
					</div>

					<div v-show="records && records.length" class="record-list">
						<div
							v-for="(record, index) in records"
							:key="index"
							class="record-item"
						>
							<div class="record-time">
								{{ formatDate(record.lottery_time, "yyyy.MM.dd hh:mm:ss") }}
							</div>
							<div
								v-for="(ele, inx) in record.lottery_rewards"
								:key="inx"
								class="record-info"
							>
								<div class="record-avatar">
									<img :src="ele.reward_icon" alt="" />
								</div>
								<div class="record-name">
									<img
										src="https://yaame-static.yaame.io/admin/68c29281caa7b1d5543a71276fdd3402.png"
										alt=""
									/>
									{{ $t("get", [ele.worth_diamonds]) }}
								</div>
							</div>
						</div>
					</div>
					<div v-show="records && records.length === 0" class="empty-div">
						<div class="empty-content">
							<img
								src="https://yaame-static.yaame.io/admin/b88c76c26ea2bbbfc830bd580f9e0854.png"
								alt=""
							/>
							<p>
								{{
									recordTabActive === "silver"
										? $t("no.silver.turntable")
										: $t("no.gold.turntable")
								}}
							</p>
						</div>
					</div>
				</div>

				<img
					class="close"
					src="https://yaame-static.yaame.io/admin/17ba2140384ccdb620838154a410e80a.png"
					@click="recordVisible = false"
				/>
			</div>
		</popup>

		<popup v-if="rewardVisible" class="flex-box">
			<div class="container">
				<div class="title">{{ $t("reward") }}</div>

				<div class="reward-container">
					<div v-if="rewardList.length === 1" class="reward-one">
						<img
							class="reward-one-img"
							:src="rewardList[0].reward_icon"
							alt=""
						/>
						<p class="reward-one-name">
							<img
								src="https://yaame-static.yaame.io/admin/68c29281caa7b1d5543a71276fdd3402.png"
								alt=""
							/>
							{{ rewardList[0].worth_diamonds }}
						</p>
					</div>

					<div v-if="rewardList.length > 1" class="three-container">
						<div
							v-for="(item, index) in rewardList"
							:key="index"
							:style="{
								'margin-left':
									rewardList.length === 3 && index === 0 ? '1.22rem' : '0',
							}"
							class="three-reward-item"
						>
							<img
								class="three-reward-item-img"
								:src="item.reward_icon"
								alt=""
							/>
							<p class="three-reward-item-name">
								<img
									src="https://yaame-static.yaame.io/admin/68c29281caa7b1d5543a71276fdd3402.png"
									alt=""
								/>
								{{ item.worth_diamonds }}
							</p>
						</div>
					</div>

					<div class="reward-btn" @click="postReward">
						{{ $t("open.once") }}
					</div>
				</div>

				<img
					class="close"
					src="https://yaame-static.yaame.io/admin/17ba2140384ccdb620838154a410e80a.png"
					@click="rewardVisible = false"
				/>
			</div>
		</popup>

		<page-loading v-show="loading" />
	</div>
</template>

<script setup>
import customHeader from "@/components/common/header.vue";
import pageLoading from "@/components/common/page_loading.vue";
import popup from "@/components/common/pop_up.vue";
import { getLanguage } from "@/lib/device";
import { computed, ref, onMounted, watch, getCurrentInstance } from "vue";
import { formatDate } from "@/lib/utils";
import {
	getEidInfo,
	getLotteryDataApi,
	postPolLotteryApi,
	getLotteryLogApi,
} from "./api";
import { Toast } from "vant";

const root = getCurrentInstance();

const t = (val) => {
	return root.proxy.$i18n.t(val);
};
let loading = ref(true);

let ruleVisible = ref(false);
let recordVisible = ref(false);
let recordTabActive = ref("silver");

const handleRecordTabChange = (tab) => {
	recordTabActive.value = tab.key;
};

let silverRecords = ref([]);
let goldRecords = ref([]);

let records = computed(() => {
	return recordTabActive.value === "gold"
		? goldRecords.value
		: silverRecords.value;
});
const getLotteryLog = async (val) => {
	try {
        let type = recordTabActive.value === 'silver' ? 'silwl' : 'goldwl';
		const res = await getLotteryLogApi(type);
		if (res.status === 1000) {
			if (recordTabActive.value === "silver") {
				silverRecords.value = res.data.lottery_logs;
			} else {
				goldRecords.value = res.data.lottery_logs;
			}
		} else if (res.status === 1002) {
			Toast(res.desc);
		}
	} catch (error) {
		console.error(error);
	}
};

watch(recordTabActive, () => {
	getLotteryLog();
});
watch(recordVisible, (val) => {
	if (val) {
		getLotteryLog();
	}
});

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
		"https://yaame-static.yaame.io/admin/60047ae0e229fbe333b12b24258bde86.png",
	"zh-tw":
		"https://yaame-static.yaame.io/admin/aa56f70024c32c716544662a122bfe4a.png",
	en: "https://yaame-static.yaame.io/admin/b8344d27a908e7b5a08c0b2435655b67.png",
	id: "https://yaame-static.yaame.io/admin/63a9133891110ff65c320f229ec7a983.png",
	ar: "https://yaame-static.yaame.io/admin/644955eac793b7cc8e6d385202d553d5.png",
});

let timeInfo = ref({
	dayLeft: 0,
	dayRight: "D",
	hours: "00",
	minutes: "00",
	seconds: "00",
});
const getCountdown = () => {
	// 获取当前时间
	const now = new Date();

	// 设置目标时间
	const target = new Date(Date.UTC(now.getUTCFullYear(), 4, 20));

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

let tabList = ref([
	{
		key: "silver",
		i18nKey: "silver.turntable",
	},
	{
		key: "gold",
		i18nKey: "gold.turntable",
	},
]);
let tabActive = ref("silver");
const handleTabChange = (tab) => {
	if (isRotating.value) {
		Toast(t("draw.process"));
		return;
	}
	tabActive.value = tab.key;

	pointVisible.value = false;
};

let myDiamond = ref(0);
let myKey = ref(0);

const toRecharge = () => {
	window.location.href = "wlyaame://mine/shop/diamond?popup=1";
};

let ticket_diamonds = ref(0);
let gold_reward_diamonds = ref(0);
let silver_reward_diamonds = ref(0);
const getData = async () => {
	try {
		const res = await getEidInfo();
		if (res.status === 1000) {
			myDiamond.value = res.data.diamond_balance;
			myKey.value = res.data.lottery_tickets;

			ticket_diamonds.value = res.data.ticket_diamonds;
			gold_reward_diamonds.value = res.data.gold_reward_diamonds;
			silver_reward_diamonds.value = res.data.silver_reward_diamonds;
		} else if (res.status === 1002) {
			Toast(res.desc);
		}
	} catch (error) {
		console.error(error);
	}
};

const reward_diamonds = computed(() => {
	return tabActive.value === "gold"
		? gold_reward_diamonds.value
		: silver_reward_diamonds.value;
});

let goldGiftList = ref([]);
let silverGiftList = ref([]);
const getLotteryData = async () => {
	try {
		let res = await getLotteryDataApi();
		if (res.status === 1000) {
			goldGiftList.value =
				res.data.lottery_strategy_config.goldwl.lottery_rewards;

			silverGiftList.value =
				res.data.lottery_strategy_config.silwl.lottery_rewards;
		} else if (res.status === 1002) {
			Toast(res.desc);
		}
	} catch (error) {
		console.error(error);
	}
};

let rewardVisible = ref(false);
let rewardList = ref([]);
let isRotating = ref(false);

const postReward = async () => {
	if (isRotating.value) {
		return;
	}
    if (tabActive.value === "gold" && myDiamond.value < 2000) {
		Toast(t("diamond.not.enough"));
		setTimeout(() => {
			toRecharge();
		}, 1500);
		return;
	}
	if (tabActive.value === "silver" && myDiamond.value < 200) {
		Toast(t("diamond.not.enough"));
		setTimeout(() => {
			toRecharge();
		}, 1500);
		return;
	}
	if (tabActive.value === "gold" && myKey.value < 10) {
		Toast(t("key.not.enough"));
		setTimeout(() => {
			toRecharge();
		}, 1500);
		return;
	}
	if (tabActive.value === "silver" && myKey.value < 1) {
		Toast(t("key.not.enough"));
		setTimeout(() => {
			toRecharge();
		}, 1500);
		return;
	}

	try {
		rewardVisible.value = false;
		const res = await postPolLotteryApi({
			activity_type: "HAPPY_LOTTERY_WHEEL",
			lottery_strategy_type: tabActive.value === 'silver' ? 'silwl' : 'goldwl',
			lottery_times: 1,
		});
		if (res.status === 1000) {
			rewardList.value = res.data.lottery_rewards;

			let giftList = tabActive.value === "gold" ? goldGiftList : silverGiftList;
			let targetIndex = giftList.value.findIndex(
				(item) => item.reward_flag === res.data.lottery_rewards[0].reward_flag
			);
			if (tabActive.value === "gold") {
				goldStartRotation(targetIndex);
			} else {
				startRotation(targetIndex);
			}

			if (tabActive.value === "gold") {
				myDiamond.value -= 2000;
				myKey.value -= 10;
			} else {
				myDiamond.value -= 200;
				myKey.value -= 1;
			}
		} else if (res.status === 1002) {
			Toast(res.desc);
		} else if (res.status === 6600) {
			Toast(res.desc);

			setTimeout(() => {
				toRecharge();
			}, 1500);
		}
	} catch (error) {
		console.error(error);
	}
};

let rotation = ref(0);

let numRotations = [0, 315, 270, 225, 180, 135, 90, 45];
let totalRotation = 1851.43; // 总旋转角度（6圈）

let pointVisible = ref(false);
const startRotation = (targetIndex) => {
	if (isRotating.value) return;
	pointVisible.value = false;
	if (rotation.value !== 0) {
		rotation.value = Math.round(rotation.value) % 360;
		let num = Math.round(rotation.value);
		let inx = numRotations.findIndex((item) => item === num);
		let diff = targetIndex - inx;
		if (diff === 0) {
			totalRotation = 1851.43;
		} else {
			totalRotation = 1851.43 - diff * 25.718;
		}
	} else {
		totalRotation = 1851.43 - targetIndex * 25.718;
	}
	isRotating.value = true;
	rotateToGift().then(() => {
		pointVisible.value = true;
		setTimeout(() => {
			rewardVisible.value = true;
			isRotating.value = false;
			getData();
		}, 1500);
	});
};
const rotateToGift = () => {
	return new Promise((resolve, reject) => {
		const accelerationDuration = 1500; // 加速时间 1.5 秒
		const constantSpeedDuration = 2000; // 匀速时间 2 秒
		const decelerationDuration = 1500; // 减速时间 1.5 秒

		const totalDuration =
			accelerationDuration + constantSpeedDuration + decelerationDuration;

		let currentSpeed = 0;
		let currentDuration = 0;
		const interval = 20; // 每隔 20ms 更新一次角度

		const rotateInterval = setInterval(() => {
			if (currentDuration < accelerationDuration) {
				// 加速阶段
				currentSpeed =
					(currentDuration / accelerationDuration) * (totalRotation / 2);
			} else if (
				currentDuration <
				accelerationDuration + constantSpeedDuration
			) {
				// 匀速阶段
				currentSpeed = totalRotation / 2;
			} else if (currentDuration < totalDuration) {
				// 减速阶段
				const remainingDuration =
					totalDuration - (accelerationDuration + constantSpeedDuration);
				currentSpeed =
					((remainingDuration -
						(currentDuration - accelerationDuration - constantSpeedDuration)) /
						remainingDuration) *
					(totalRotation / 2);
			}
			if (tabActive.value === "gold") {
				goldRotation.value += currentSpeed * (interval / 1000);
			} else {
				rotation.value += currentSpeed * (interval / 1000);
			}
			currentDuration += interval;

			if (currentDuration >= totalDuration) {
				// 结束动画
				clearInterval(rotateInterval);
				// 完成 Promise
				resolve();
			}
		}, interval);
	});
};

let goldRotation = ref(0);
const goldStartRotation = (targetIndex) => {
	if (isRotating.value) return;
	pointVisible.value = false;
	if (goldRotation.value !== 0) {
		goldRotation.value = Math.round(goldRotation.value) % 360;
		let num = Math.round(goldRotation.value);
		let inx = numRotations.findIndex((item) => item === num);
		let diff = targetIndex - inx;
		if (diff === 0) {
			totalRotation = 1851.43;
		} else {
			totalRotation = 1851.43 - diff * 25.718;
		}
	} else {
		totalRotation = 1851.43 - targetIndex * 25.718;
	}
	isRotating.value = true;
	rotateToGift().then(() => {
		pointVisible.value = true;
		setTimeout(() => {
			rewardVisible.value = true;
			isRotating.value = false;
			getData();
		}, 1500);
	});
};

onMounted(() => {
	getCountdown();
	getData();
	getLotteryData();

	getLotteryLog("silver");
	getLotteryLog("gold");
	setInterval(() => {
		getCountdown();
	}, 1000);

	window.onPaySuccess = function () {
		getData();
	};

	window.onload = function () {
		loading.value = false;
	};
});
</script>

<style scoped lang="less">
.main {
	min-width: 100vw;
	min-height: 17.6rem;
	background-size: 7.5rem auto;
	background-repeat: no-repeat;
	// background-image: url(https://yaame-static.yaame.io/admin/86e137595481d72e2d2d48e0c1e42c39.png);
	background-image: url(https://yaame-static.yaame.io/admin/bf717e1e6757f1f9ad18d72654c08c14.png);
    .header-img {
        width: 7.5rem;
        height: auto;
        position: absolute;
        left: 0;
        top: 0;
    }
	.title-img {
		width: 7.5rem;
		height: 2.8rem;
        position: relative;
        z-index: 1;
	}
	.time-container {
		width: 3.5rem;
		height: 0.6rem;
		margin-left: 2rem;
		box-shadow: inset 0px 0.01rem 0.11rem 0.04rem rgba(255, 171, 93, 0.70),
			inset 0px 0.02rem 0.03rem 0px #FFCF0C;
		border-radius: 0.5rem;
		position: relative;
		z-index: 1;
		.dayL,
		.dayR {
			position: absolute;
			width: 0.36rem;
			height: 0.36rem;
			left: 0.33rem;
			top: 0.12rem;
			text-align: center;
			line-height: 0.36rem;
			background: #663200;
			border-radius: 0.08rem;
			font-size: 0.26rem;
			color: #ffffff;
		}
		.dayR {
			left: 0.73rem;
		}
		.spanL,
		.spanM,
		.spanR {
			position: absolute;
			width: 0.26rem;
			height: 0.36rem;
			left: 1.06rem;
			top: 0.12rem;
			text-align: center;
			line-height: 0.36rem;
			font-size: 0.26rem;
			color: #ffffff;
		}
		.spanM {
			left: 1.74rem;
		}
		.spanR {
			left: 2.42rem;
		}
		.hour,
		.minute,
		.second {
			position: absolute;
			width: 0.52rem;
			height: 0.36rem;
			left: 1.25rem;
			top: 0.12rem;
			text-align: center;
			line-height: 0.36rem;
			background: #663200;
			border-radius: 0.08rem;
			font-size: 0.26rem;
			color: #ffffff;
		}
		.minute {
			left: 1.93rem;
		}
		.second {
			left: 2.61rem;
		}
	}
	.time-tab-bg {
		width: 7.5rem;
		height: 5.8rem;
		position: absolute;
		top: 2.6rem;
		left: 0;
	}
	.tab-container {
		margin-top: 0.35rem;
		width: 7.5rem;
		height: 1.09rem;
		display: flex;
		justify-content: space-between;
		padding: 0 0.57rem;
		position: relative;
		z-index: 1;
		.tab-item {
            padding-top: 0.02rem;
			width: 2.95rem;
			height: 1.09rem;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url("https://yaame-static.yaame.io/admin/ccfe9b386e8208e7bbcaf8cc49ff1a1f.png");
			text-align: center;
			line-height: 1.09rem;
			font-size: 0.28rem;
			color: #cdad8a;
            font-weight: bold;
			&.active {
				color: #f3ff76;
				background-image: url("https://yaame-static.yaame.io/admin/153e6cda78501dfec75d166a9f7bbd36.png");
			}
		}
	}
	.rule-icon {
		width: 0.6rem;
		height: 0.6rem;
		position: absolute;
		top: 0.76rem;
		left: 6.68rem;
		z-index: 98;
	}
	.record-icon {
		width: 0.6rem;
		height: 0.6rem;
		position: absolute;
		top: 1.86rem;
		left: 6.68rem;
		z-index: 98;
	}
	.flex-box {
		display: flex;
		justify-content: center;
		align-items: center;
		.container {
			width: 6.5rem;
			height: 9.39rem;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/e03125246ac4a8fadf576a893d45c32a.png);
			position: relative;
			padding-top: 0.88rem;
			.title {
				width: 6.5rem;
				text-align: center;
				font-weight: 600;
				font-size: 0.35rem;
				color: #f4d170;
				height: 0.5rem;
				line-height: 0.5rem;
			}
			.close {
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
				bottom: -0.8rem;
				widows: 0.57rem;
				height: 0.57rem;
			}

			.record-container {
				width: 5rem;
				height: 7rem;
				margin-left: 0.75rem;
				margin-top: 0.3rem;
				.record-tab {
					width: 5rem;
					height: 0.76rem;
					background: #3A0300;
					border-radius: 0.38rem;
					display: flex;
					padding: 0.08rem 0.1rem;
					.record-tab-item {
						width: 2.34rem;
						height: 0.6rem;
						border-radius: 0.38rem;
						text-align: center;
						line-height: 0.6rem;
						font-weight: 400;
						font-size: 0.28rem;
						color: #A03832;
						&.active {
							color: #ffdb72;
							font-weight: 600;
							background: linear-gradient( 180deg, #A24400 0%, #772A00 100%);
						}
					}
				}
				.record-list {
					width: 5rem;
					height: 6.24rem;
					padding-top: 0.3rem;
					overflow-y: scroll;
					.record-item {
						width: 5rem;
						height: 1rem;

						.record-time {
							width: 5rem;
							font-weight: 400;
							font-size: 0.24rem;
							color: #fff0c6;
						}
						.record-info {
							width: 5rem;
							display: flex;
							.record-avatar {
								width: 0.58rem;
								height: 0.58rem;
								background-size: contain;
								background-repeat: no-repeat;
								margin-right: 0.12rem;
								img {
									width: 0.58rem;
									height: 0.58rem;
								}
							}
							.record-name {
								flex: 1;
								height: 0.58rem;
								line-height: 0.58rem;
								font-weight: 400;
								font-size: 0.24rem;
								color: #fff0c6;
								margin-left: 0.1rem;
								img {
									width: 0.25rem;
									height: auto;
									vertical-align: middle;
								}
							}
						}
					}
				}
				.empty-div {
					width: 5rem;
					height: 6.24rem;
					display: flex;
					justify-content: center;
					align-items: center;
					.empty-content {
						width: 5.3rem;
						img {
							width: 1.73rem;
							height: 1.14rem;
							margin-left: 1.785rem;
							display: block;
							margin-bottom: 0.3rem;
						}
						p {
							width: 5.3rem;
							text-align: center;
							font-size: 0.26rem;
							color: #fff0c6;
						}
					}
				}
			}
			.rule-container {
				width: 5rem;
				height: 7rem;
				margin-left: 0.75rem;
				margin-top: 0.3rem;

				font-weight: 600;
				font-size: 0.26rem;
				color: #fff0c6;
			}
			.reward-container {
				width: 6.5rem;
				height: 7.6rem;
				position: relative;
				border-top: 0.01rem solid transparent;
				.reward-one {
					width: 3.02rem;
					height: 3.64rem;
					background-size: contain;
					background-repeat: no-repeat;
					background-image: url(https://yaame-static.yaame.io/admin/ec5c086f3a0b435062cda9602578d49b.png);
					margin-top: 1.3rem;
					margin-left: 1.74rem;
					position: relative;
					.reward-one-img {
						width: 2rem;
						height: 2rem;
						margin-left: 0.51rem;
						margin-top: 0.41rem;
					}
					.reward-one-name {
						position: absolute;
						width: 3.02rem;
						height: 0.35rem;
						text-align: center;
						font-size: 0.36rem;
						color: #47220c;
						left: 0;
						bottom: 0.48rem;
						font-weight: bold;
						img {
							width: 0.43rem;
							height: 0.38rem;
							vertical-align: middle;
						}
					}
				}
				.three-container {
					height: 5.13rem;
					width: 4.44rem;
					margin-left: 1.03rem;
					margin-top: 0.66rem;
					background-color: #fff;
					display: flex;
					justify-content: space-between;
					flex-wrap: wrap;
					.three-reward-item {
						width: 2rem;
						height: 2.4rem;
						background-size: contain;
						background-repeat: no-repeat;
						background-image: url(https://yaame-static.yaame.io/admin/ec5c086f3a0b435062cda9602578d49b.png);
						background-color: pink;
						position: relative;
						.three-reward-item-img {
							width: 1.4rem;
							height: 1.4rem;
							margin-left: 0.3rem;
							margin-top: 0.2rem;
						}
						.three-reward-item-name {
							position: absolute;
							left: 0;
							bottom: 0.2rem;
							text-align: center;
							width: 2rem;
							height: 0.35rem;
							line-height: 0.35rem;
							font-weight: 600;
							font-size: 0.28rem;
							color: #47220c;
							img {
								width: 0.38rem;
								height: auto;
								vertical-align: middle;
							}
						}
					}
				}
				.reward-btn {
					position: absolute;
					bottom: 0.6rem;
					left: 1.9rem;
					width: 2.82rem;
					height: 0.96rem;
					background-size: contain;
					background-repeat: no-repeat;
					background-image: url(https://yaame-static.yaame.io/admin/38897c2bb46eb44541ca79bfb76be503.png);
					text-align: center;
					line-height: 0.96rem;
					font-weight: 600;
					font-size: 0.3rem;
					color: #47220c;
				}
			}
		}
	}
	.draw-container {
		width: 7.5rem;
		overflow-x: hidden;
		margin-top: 0.24rem;
		position: relative;
		z-index: 1;
		padding-bottom: 0.3rem;
		.my-diamond {
			width: 1.58rem;
			height: 0.9rem;
			background-image: url(https://yaame-static.yaame.io/admin/ee1dd4d50bf214cf0729aa40b55cc252.png);
			background-size: contain;
			background-repeat: no-repeat;
			position: absolute;
			left: 0;
			top: 0.17rem;

			padding-top: 0.15rem;
			.title {
				width: 1.38rem;
				text-align: center;
				font-size: 0.2rem;
				color: #FFDB72;
			}
			.value {
				width: 1rem;
				height: 0.34rem;
				position: absolute;
				left: 0.32rem;
				top: 0.43rem;
				font-size: 0.24rem;
				color: #FFDB72;
			}
		}
		.my-key {
			width: 1.58rem;
			height: 0.9rem;
			background-image: url(https://yaame-static.yaame.io/admin/d77c3bf5351b8bcbaf4a25c50bb45014.png);
			background-size: contain;
			background-repeat: no-repeat;
			position: absolute;
			right: 0;
			top: 0.17rem;

			padding-top: 0.15rem;
			.title {
				width: 1.58rem;
				text-align: center;
				font-size: 0.2rem;
				color: #FFDB72;
				padding-left: 0.2rem;
			}
			.value {
				width: 1rem;
				height: 0.34rem;
				position: absolute;
				left: 0.72rem;
				top: 0.43rem;
				font-size: 0.24rem;
				color: #FFDB72;
			}
		}
		.silver {
			width: 7.5rem;
			height: 8.5rem;
			.silver-img {
				position: absolute;
				left: 0;
				top: 0;
				width: 7.5rem;
				height: 8.5rem;
				z-index: 1;
			}
			.point {
				width: 1.49rem;
				height: 2.05rem;
				position: absolute;
				left: 3.02rem;
				top: 2.68rem;
				background-size: contain;
				background-repeat: no-repeat;
				background-image: url(https://yaame-static.yaame.io/admin/bcd52e56670ac78c7283f22730764473.png);
				z-index: 4;
				&.gold {
					background-image: url(https://yaame-static.yaame.io/admin/6dd43b611771ce64b77e60c279839e96.png);
				}
			}
			.reward {
				width: 6.3rem;
				height: 6.3rem;
				position: absolute;
				left: 0.6rem;
				top: 0.81rem;
				background-size: contain;
				background-repeat: no-repeat;
				background-image: url(https://yaame-static.yaame.io/admin/171d21fd544f8765c6186e1b3d02691c.png);

                &.gold {
                    background-image: url(https://yaame-static.yaame.io/admin/ae98c942ff1785a8861411d903098ee2.png);
                }
                z-index: 1;
				.reward-item {
					width: 1.64rem;
					height: 1.26rem;
					position: absolute;
					// background-color: #fff;
					.value {
						width: 1.64rem;
						text-align: center;
						font-weight: 600;
						font-size: 0.24rem;
						color: #ffdb72;
						padding-right: 0.2rem;
						position: relative;
						top: -0.06rem;
						img {
							width: 0.3rem;
							height: auto;
							vertical-align: middle;
						}
					}
					.reward-img {
						width: 0.8rem;
						height: 0.8rem;
						margin-top: 0.26rem;
						margin-left: 0.42rem;
					}
					&.reward-item-0 {
						left: 2.38rem;
						top: 0.59rem;
						// background-color: #fff;
					}
					&.reward-item-1 {
						left: 3.66rem;
						top: 1.18rem;
						transform: rotate(45deg);
					}
					&.reward-item-2 {
						left: 4.22rem;
						top: 2.5rem;
						transform: rotate(90deg);
					}
					&.reward-item-3 {
						left: 3.66rem;
						top: 3.84rem;
						transform: rotate(135deg);
					}
					&.reward-item-4 {
						left: 2.36rem;
						top: 4.4rem;
						transform: rotate(180deg);
					}
					&.reward-item-5 {
						left: 0.98rem;
						top: 3.84rem;
						transform: rotate(225deg);
					}
					&.reward-item-6 {
						left: 0.46rem;
						top: 2.5rem;
						transform: rotate(270deg);
					}
					&.reward-item-7 {
						left: 1rem;
						top: 1.18rem;
						transform: rotate(315deg);
					}
				}
			}
			.to-height-light {
				width: 2rem;
				height: auto;
				position: absolute;
				left: 2.78rem;
				top: 1.2rem;
				animation: toHeightLight 1s infinite;
                z-index: 1;
			}
			@keyframes toHeightLight {
				0% {
					opacity: 0.5;
				}
				50% {
					opacity: 1;
				}
				100% {
					opacity: 0.5;
				}
			}
		}
		.get-diamond {
			width: 2.5rem;
			position: absolute;
			left: 2.5rem;
			top: 7.4rem;
			z-index: 2;
			.title {
				text-align: center;
				font-size: 0.28rem;
				color: #ffdb72;
			}
			.value {
				text-align: center;
				font-size: 0.28rem;
				color: #ffffff;
				img {
					width: 0.35rem;
					height: 0.31rem;
					margin-right: 0.04rem;
					vertical-align: middle;
				}
			}
		}
		.draw-btn {
			width: 4.07rem;
			height: 1.31rem;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/0c31dfc3ffc4e0a6ae25705297e99def.png);
			// background-color: #fff;
			margin-top: 0.28rem;
			margin-left: 1.73rem;
			position: relative;
            &.gold {
                background-image: url(https://yaame-static.yaame.io/admin/09d85e6c4e987a889ab57961090aa326.png);
            }
			.title {
				position: absolute;
				top: 0.16rem;
				width: 4.07rem;
				font-weight: 600;
				font-size: 0.33rem;
				color: #47220c;
				text-align: center;
			}
			.value {
				position: absolute;
				top: 0.58rem;
				width: 4.07rem;
				font-weight: 400;
				font-size: 0.26rem;
				color: #47220c;
				text-align: center;
				img {
					width: 0.34rem;
					height: auto;
					vertical-align: middle;
					margin: 0 0.06rem;
				}
			}
			&.disabled {
				// 灰色滤镜
				filter: grayscale(0.9);
				// background-image: url(https://yaame-static.yaame.io/admin/0abe08808d1ba582645c63b6ca14e247.png);
			}
		}
		.progress-container {
			width: 7.1rem;
			height: 1.76rem;
			margin-left: 0.2rem;
			background: #290D00;
			border-radius: 0.18rem;
			margin-top: 0.18rem;
			position: relative;
			.progress {
				position: absolute;
				top: 0.3rem;
				left: 1.28rem;
				width: 4rem;
				height: 0.24rem;
                background: linear-gradient( 180deg, #5C270B 0%, #7C2F18 100%);
                border-radius: 0.2rem;
				.progress-mask {
					width: 3.94rem;
					height: 0.19rem;
					background-size: contain;
					background-repeat: no-repeat;
					background-image: url(https://yaame-static.yaame.io/admin/738a2baa8a7591e6415c264ba51439c1.png);
					position: absolute;
					top: 0.02rem;
					left: 0.04rem;
				}
				.progress-content {
					width: 30%;
					height: 0.2rem;
					margin-top: 0.02rem;
					// background: linear-gradient(90deg, #00fff1 0%, #fbfa00 100%);
                    background: linear-gradient(180deg, #FF6800 0%, #FBFA00 100%);
					border-radius: 0.2rem;
				}
			}
			.progress-num {
				width: 1.2rem;
				position: absolute;
				top: 0.25rem;
				left: 5.45rem;
				font-size: 0.24rem;
				color: #ffdb72;
			}
			.to-recharge-text {
				width: 4.34rem;
				position: absolute;
				left: 0.25rem;
				top: 0.96rem;
				text-align: center;
				font-size: 0.28rem;
				color: #ffdb72;
				img {
					height: 0.31rem;
					width: auto;
					vertical-align: middle;
					margin: 0 0.06rem;
				}
			}
			.to-recharge {
				width: 2rem;
				height: 0.64rem;
				background: linear-gradient( 180deg, #FF0000 0%, #FBA700 100%);
				border-radius: 0.32rem;
				position: absolute;
				left: 4.59rem;
				top: 0.88rem;
				font-size: 0.3rem;
				color: #FFDB72;
				text-align: center;
				line-height: 0.64rem;
			}
		}
	}
}
</style>
