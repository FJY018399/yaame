<!--
 * @Author: Elk
 * @Date: 2024-06-04 18:02:01
 * @FilePath: /yaame-h5/src/pages/EidAlAdha/views/preheat.vue
 * @Description: 预热
-->
<template>
	<div class="preheat">
		<Header color="white">{{ $t("EidAlAdha") }}</Header>

		<div class="title-img-container">
			<img :src="titleImgList[language]" alt="" />
		</div>

		<canvas id="floatingScreen"></canvas>
		<Popup v-show="photoSphereVisible">
			<canvas id="photoSphere"></canvas>
		</Popup>

		<div class="fix-btn rule" @click="ruleVisible = true">{{ $t("rule") }}</div>
		<div class="fix-btn reward" @click="rewardVisible = true">
			{{ $t("reward") }}
		</div>

		<div v-if="showTimeFlag" class="title-info">{{ $t("activityWillStart") }}</div>
		<div v-else class="title-info">{{ $t("dailyBlessingRefreshTime") }}</div>

		<div v-if="showTimeFlag" class="time-container">
			<div class="day-left">{{ timeInfo.dayLeft }}</div>
			<div class="day-right">{{ timeInfo.dayRight }}</div>
			<div class="hour">{{ timeInfo.hours }}</div>
			<div class="minute">{{ timeInfo.minutes }}</div>
			<div class="second">{{ timeInfo.seconds }}</div>
			<span class="span-1">:</span>
			<span class="span-2">:</span>
			<span class="span-3">:</span>
		</div>

		<div v-else class="start-container">
            <div>8.00-10.00</div>
            <div>12.00-14.00</div>
            <div>19.00-21.00</div>
        </div>

		<div v-if="blessingIntervalVisible" class="blessing-interval">
			{{ $t("nextBlessing") }}{{ blessingIntervalTimeInfo.hours }}:{{
				blessingIntervalTimeInfo.minutes
			}}:{{ blessingIntervalTimeInfo.seconds }}
		</div>

		<div
			:style="{
				backgroundImage:
					button_status === 1
						? `url(${blessingImgList[language].disabled})`
						: `url(${blessingImgList[language].default})`,
			}"
			:class="['blessing']"
			@click="blessing()"
		></div>

		<div class="progress-bar">
			<div :style="{ width: computedWidth }" class="progress-bar-content">
				<div class="progress-value">{{ blessing_progress }}</div>
			</div>

			<div
				v-for="(item, index) in blessing_reward_box_list"
				:key="index"
				:style="{
					left: computedLeft(item.blessing_num),
				}"
				:class="['progress-point', computedStyle(item)]"
				@click="receiveBox(item.blessing_box_reward_type)"
			>
				<img :src="computedImg(item, index)" alt="" />
				<span>{{ item.blessing_num }}</span>
			</div>
		</div>

		<p class="progress-title">{{ $t("worldBlessing") }}</p>

		<Popup v-show="ruleVisible" class="flex-box">
			<div class="rule-container">
				<div class="popup-header">
					<span class="header-content">{{ $t("activityPlay") }}</span>
				</div>
				<div class="rule-content">
					<p class="rule-item-title">{{ $t("play1") }}</p>
					<p class="rule-item-content">{{ $t("play1_1") }}</p>

					<p style="margin-top: 0.15rem" class="rule-item-title">
						{{ $t("play2") }}
					</p>
					<p class="rule-item-content">{{ $t("play2_1") }}</p>
					<p class="rule-item-content">{{ $t("play2_2") }}</p>
					<p class="rule-item-content">{{ $t("play2_3") }}</p>
					<p class="rule-item-content">{{ $t("play2_4") }}</p>

					<p style="margin-top: 0.15rem" class="rule-item-title">
						{{ $t("play3") }}
					</p>
				</div>
				<div class="close-btn" @click="ruleVisible = false">
					{{ $t("gotIt") }}
				</div>
			</div>
		</Popup>
		<Popup v-show="rewardVisible" class="flex-box">
			<div class="reward-container">
				<div class="popup-header">
					<span class="header-content">{{ $t("historyReward") }}</span>
				</div>

				<div
					v-show="hblessing_reward_list && hblessing_reward_list.length"
					class="reward-content"
				>
					<div
						v-for="(item, index) in hblessing_reward_list"
						:key="index"
						class="reward-item"
					>
						<div class="img-div">
							<img :src="item.icon" alt="" />
							<div class="img-num">{{ item.reward_num }}</div>
						</div>
						<div class="item-name">{{ item.reward_name }}</div>
					</div>
				</div>

				<div v-show="hblessing_reward_list.length === 0" class="reward-empty">
					{{ $t("noData") }}
				</div>

				<div class="close-btn" @click="rewardVisible = false">
					{{ $t("gotIt") }}
				</div>
			</div>
		</Popup>
		<Popup v-show="resultVisible" class="flex-box">
			<div class="result-container">
				<img
					class="result-header"
					:src="resultHeaderImgList[language]"
					alt=""
				/>

				<img class="result-reward-icon" :src="resultContent.icon" alt="" />
				<img
					:class="['result-img bg']"
					src="https://yaame-static.yaame.io/admin/85d2b437379318818eb2a081a01c47ad.png"
					alt=""
				/>
				<p class="result-num">
					{{ resultContent.reward_name }}x{{ resultContent.reward_num }}
				</p>

				<img
					class="close-icon"
					src="https://yaame-static.yaame.io/admin/9fdf039b8172513f17b2ee3742f053bc.png"
					alt=""
					@click="closePopup('result')"
				/>

				<div class="result-btn" @click="closePopup('result')">
					{{ $t("confirm") }}
				</div>
			</div>
		</Popup>
	</div>
</template>

<script setup>
import Header from "@/components/common/header";
import Popup from "@/components/common/pop_up";
import { ref, onMounted, getCurrentInstance, computed } from "vue";
import { getLanguage } from "@/lib/device";
import {
	getBlessingInfoApi,
	getHomeInfoApi,
	blessingApi,
	receiveBoxApi,
} from "../api";
import { Toast } from "vant";
import { Downloader, Parser, Player } from "svga.lite";
import DB from "svga.lite/db";
const root = getCurrentInstance();

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
		"https://yaame-static.yaame.io/admin/93de16982cea31310fd18fc2f607e7a1.png",
	"zh-tw":
		"https://yaame-static.yaame.io/admin/912f26e1c036886d160f731268f6ff75.png",
	en: "https://yaame-static.yaame.io/admin/f762aacaf6bf61237fff36df1ad48e34.png",
	id: "https://yaame-static.yaame.io/admin/735daf31705145957acb4c1728f36479.png",
	ar: "https://yaame-static.yaame.io/admin/5750907755249489de0dc14e22acb2c4.png",
});
let blessingImgList = ref({
	"zh-cn": {
		default:
			"https://yaame-static.yaame.io/admin/5fcbec06129bec51dd8937a0004bd409.png",
		disabled:
			"https://yaame-static.yaame.io/admin/6b2065a0876f772f6b3761df2651bc0e.png",
	},
	"zh-tw": {
		default:
			"https://yaame-static.yaame.io/admin/5fcbec06129bec51dd8937a0004bd409.png",
		disabled:
			"https://yaame-static.yaame.io/admin/6b2065a0876f772f6b3761df2651bc0e.png",
	},
	en: {
		default:
			"https://yaame-static.yaame.io/admin/35ceecac35e051c56e6aa41dbc281a8c.png",
		disabled:
			"https://yaame-static.yaame.io/admin/f30ef1b34e60790e98df49200c37b8ab.png",
	},
	id: {
		default:
			"https://yaame-static.yaame.io/admin/af49618b3d56981e361e7a6fddc238fc.png",
		disabled:
			"https://yaame-static.yaame.io/admin/92df48cb9c704e9408aa926bf8b8ac40.png",
	},
	ar: {
		default:
			"https://yaame-static.yaame.io/admin/7324fc6ef4ad21a8930070988cd21ce7.png",
		disabled:
			"https://yaame-static.yaame.io/admin/0eb79b659e721f540a77e4bd6c3e8375.png",
	},
});
let resultHeaderImgList = ref({
	"zh-cn":
		"https://yaame-static.yaame.io/admin/0aae3331981e7f406ad1bb632ae3eb0e.png",
	"zh-tw":
		"https://yaame-static.yaame.io/admin/9f12b7638fe090590b7239aebe05cd3e.png",
	en: "https://yaame-static.yaame.io/admin/da5274a3cf2fc39060a9637ea5d41fa8.png",
	id: "https://yaame-static.yaame.io/admin/ebe1ee5b49bc6eb39773ada92c3eafa4.png",
	ar: "https://yaame-static.yaame.io/admin/2eb03f0a9d21844a789ee7c45bd06a8f.png",
});

let boxImgList = ref([
	{
		default:
			"https://yaame-static.yaame.io/admin/28e4df59187c2d29496fe4fd9042ece4.png",
		received:
			"https://yaame-static.yaame.io/admin/ad148e074c314b1e75a29fb699c3a712.png",
		disabled:
			"https://yaame-static.yaame.io/admin/ac43a5c4c89f6106a2d1e0913d994fc7.png",
	},
	{
		default:
			"https://yaame-static.yaame.io/admin/33f720f83f57735c7619de4a8f154018.png",
		received:
			"https://yaame-static.yaame.io/admin/3e232833e0119b54ad638d1852a5675a.png",
		disabled:
			"https://yaame-static.yaame.io/admin/ee9911f4fa6dafd05b28581f82888116.png",
	},
	{
		default:
			"https://yaame-static.yaame.io/admin/5e5caeba56670133e7d56342711ecf2d.png",
		received:
			"https://yaame-static.yaame.io/admin/e4be079e63735d218aa85a625f76d020.png",
		disabled:
			"https://yaame-static.yaame.io/admin/07d97914ad1b74ff4028661b44e2f4da.png",
	},
	{
		default:
			"https://yaame-static.yaame.io/admin/4ce97df401c7a2f628e45b00c015c22f.png",
		received:
			"https://yaame-static.yaame.io/admin/e16b6471cce31b842f26356753b5a9dc.png",
		disabled:
			"https://yaame-static.yaame.io/admin/95a637c876ec0ca239ce74de768a543f.png",
	},
]);

const computedImg = (item, index) => {
	let obj = boxImgList.value[index];

	if (item.is_received === 1) {
		return obj.received;
	} else if (item.blessing_num <= blessing_progress.value) {
		return obj.default;
	} else {
		return obj.disabled;
	}
};

const computedStyle = (item) => {
	if (item.is_received === 0 && item.blessing_num <= blessing_progress.value) {
		return "active";
	} else {
		return "";
	}
};
let timeInfo = ref({
	dayLeft: 0,
	dayRight: "D",
	hours: "00",
	minutes: "00",
	seconds: "00",
});
const getCountdown = (time, flag = true) => {
	// 获取当前时间
	const now = new Date();

	// 设置目标时间
	const target = new Date(time);

	// 计算剩余时间
	const timeDiff = target.getTime() - now.getTime();

	// 确保目标日期在未来
	if (flag) {
		if (timeDiff <= 0) {
			timeInfo.value = {
				dayLeft: "0",
				dayRight: "D",
				hours: "00",
				minutes: "00",
				seconds: "00",
			};
			clearInterval(pageInterval.value);

            showTimeFlag.value = false;
			return;
		}
	} else {
		if (timeDiff <= 0) {
			blessingIntervalTimeInfo.value = {
				dayLeft: "0",
				dayRight: "D",
				hours: "00",
				minutes: "00",
				seconds: "00",
			};
			clearInterval(blessingInterval.value);

			button_status.value = 0;
			blessingIntervalVisible.value = false;
			return;
		}
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

	if (flag) {
		timeInfo.value = {
			dayLeft,
			dayRight,
			hours,
			minutes,
			seconds,
		};
	} else {
		blessingIntervalTimeInfo.value = {
			dayLeft,
			dayRight,
			hours,
			minutes,
			seconds,
		};
	}
};
let pageInterval = ref(null);

let computedWidth = computed(() => {
	if (blessing_progress.value >= max_progress.value) {
		return "100%";
	} else {
		return `${(blessing_progress.value / max_progress.value) * 100}%`;
	}
});

let ruleVisible = ref(false);
let rewardVisible = ref(false);
let resultVisible = ref(false);

const closePopup = (val) => {
	if (val === "rule") {
		ruleVisible.value = false;
	} else if (val === "reward") {
		rewardVisible.value = false;
	} else if (val === "result") {
		resultVisible.value = false;
	}
};

let button_status = ref(0);
let blessing_progress = ref(0);
let max_progress = ref(5000);
let hblessing_reward_list = ref([]);

let blessingInterval = ref(null);
let blessingIntervalVisible = ref(false);
let blessingIntervalTime = ref(0);
let blessingIntervalTimeInfo = ref({
	dayLeft: 0,
	dayRight: "D",
	hours: "00",
	minutes: "00",
	seconds: "00",
});
let blessing_reward_box_list = ref([]);

let showTimeFlag = ref(true);
const getBlessingInfo = async () => {
	const res = await getBlessingInfoApi();
	if (res.status === 1000) {
		button_status.value = res.data.button_status;

		if (!pageInterval.value) {
			getCountdown(res.data.end_time);
			pageInterval.value = setInterval(() => {
				getCountdown(res.data.end_time);
			}, 1000);
		}

		blessing_progress.value = res.data.blessing_progress;
		max_progress.value = res.data.max_progress;
		hblessing_reward_list.value = res.data.hblessing_reward_list;
		blessing_reward_box_list.value = res.data.blessing_reward_box_list;

        showTimeFlag.value = res.data.show_time !== 1;
		if (res.data.button_status === 1) {
			if (!blessingInterval.value) {
				blessingIntervalTime.value =
					new Date().getTime() + res.data.next_blessing_time;
				getCountdown(blessingIntervalTime.value, false);
				blessingIntervalVisible.value = true;
				blessingInterval.value = setInterval(() => {
					getCountdown(blessingIntervalTime.value, false);
				}, 1000);
			}
		}
	}
};

let resultContent = ref({
	icon: "",
	reward_num: "",
	reward_name: "",
});
const blessing = async () => {
	if (button_status.value === 1) {
		return;
	}

	const res = await blessingApi({});
	if (res.status === 1000) {
		if (res.data.reward_items && res.data.reward_items.length > 0) {
			resultContent.value = res.data.reward_items[0];
		}

		// resultVisible.value = true;
		openResultVisible();
		button_status.value = 1;
		clearInterval(blessingInterval.value);

		blessingIntervalTime.value =
			new Date().getTime() + res.data.next_blessing_time;
		getCountdown(blessingIntervalTime.value, false);
		blessingIntervalVisible.value = true;
		blessingInterval.value = setInterval(() => {
			getCountdown(blessingIntervalTime.value, false);
		}, 1000);

		getBlessingInfo();
	} else {
		Toast(res.desc);
	}
};

let computedLeft = (val) => {
	return `calc(${(val / max_progress.value) * 100}% - 0.3rem)`;
};

const receiveBox = async (reward_type) => {
	const res = await receiveBoxApi({
		reward_type,
	});
	if (res.status === 1000) {
		if (res.data.reward_items && res.data.reward_items.length > 0) {
			resultContent.value = res.data.reward_items[0];
		}

		// resultVisible.value = true;
		openResultVisible();
		getBlessingInfo();
	} else {
		Toast(res.desc);
	}
};

let photoSphereVisible = ref(false);

const openResultVisible = () => {
	PhotoSphere.value.player.start();
	photoSphereVisible.value = true;

	setTimeout(() => {
		PhotoSphere.value.player.stop();
		photoSphereVisible.value = false;
		resultVisible.value = true;
	}, 2000);
};

let FloatingScreen = ref({
	downloader: null,
	parser: null,
	player: null,
	svgaStaticData: null,
});

let PhotoSphere = ref({
	downloader: null,
	parser: null,
	player: null,
	svgaStaticData: null,
});

const initSVGAData = async (obj, canvas, svga_static, loop) => {
	let options = obj.value;
	options.downloader = new Downloader();
	options.parser = new Parser();
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

	options.player.set({ loop });

	await options.player.mount(options.svgaStaticData);
	options.player.start();
};


onMounted(async () => {
	await getBlessingInfo();

	initSVGAData(
		FloatingScreen,
		"floatingScreen",
		"https://yaame-static.yaame.io/admin/16af792905beec2d5a3a6565e67d633e.svga",
		0
	);
	initSVGAData(
		PhotoSphere,
		"photoSphere",
		"https://yaame-static.yaame.io/admin/4b5f457c5bd34d1e43da962f7edeba23.svga",
		1
	);

	document.body.style.backgroundColor = "#2E2613";
});
</script>
<style lang="less" scoped>
.preheat {
	width: 7.5rem;
	height: 16.24rem;
	background-size: contain;
	background-repeat: no-repeat;
	background-image: url(https://yaame-static.yaame.io/admin/ffb8e33290343a0ab83a932a15dbd95e.jpg);
	position: relative;
	font-size: 0.24rem;
	.title-img-container {
		width: 7.5rem;
		height: 1.41rem;
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		top: 1.47rem;
		img {
			height: 1.41rem;
			width: auto;
		}
	}
	#floatingScreen {
		width: 7.5rem;
		height: 11.48rem;
		position: absolute;
		top: 0;
		left: 0;
	}
	#photoSphere {
		width: 7.5rem;
		height: 7.5rem;
		position: absolute;
		left: 0;
		top: 4.36rem;
	}
	.fix-btn {
		width: 1.08rem;
		height: 0.49rem;
		text-align: center;
		line-height: 0.49rem;
		background-size: contain;
		background-repeat: no-repeat;
		background-image: url(https://yaame-static.yaame.io/admin/6b0df7ca5fe818c8421dd973ef2a2294.png);
		position: fixed;
		right: -0.04rem;
		font-weight: 600;
		font-size: 0.24rem;
		color: #fff28f;
		text-align: center;
		z-index: 10;
		&.rule {
			top: 1.8rem;
		}
		&.reward {
			top: 2.59rem;
		}
	}
	.title-info {
		width: 7.5rem;
		text-align: center;
		position: absolute;
		top: 3.05rem;
		font-weight: 600;
		font-size: 0.26rem;
		color: #d3ffeb;
	}
	.time-container {
		width: 4.7rem;
		height: 0.72rem;
		position: absolute;
		top: 3.69rem;
		left: 1.4rem;
		display: flex;
		div {
			width: 0.72rem;
			height: 0.72rem;
			text-align: center;
			line-height: 0.72rem;
			background: rgba(0, 82, 41, 0.6);
			border-radius: 0.15rem;
			font-weight: bold;
			font-size: 0.4rem;
			color: #ffffff;
		}
		.day-right {
			margin-left: 0.14rem;
		}
		.hour {
			margin-left: 0.32rem;
		}
		.minute {
			margin-left: 0.32rem;
		}
		.second {
			margin-left: 0.32rem;
		}

		span {
			height: 0.72rem;
			text-align: center;
			line-height: 0.72rem;
			font-weight: bold;
			font-size: 0.4rem;
			color: #ffffff;
			position: absolute;
		}
		.span-1 {
			left: 1.66rem;
		}
		.span-2 {
			left: 2.7rem;
		}
		.span-3 {
			left: 3.74rem;
		}
	}
	.start-container {
		width: 5.83rem;
		height: 0.66rem;
		background-size: contain;
		background-repeat: no-repeat;
		background-image: url(https://yaame-static.yaame.io/admin/483d562b5c8b40d01c2eb5bbbdb57ec4.png);
		position: absolute;
		top: 3.76rem;
		left: 0.87rem;
		display: flex;
		font-weight: bold;
		font-size: 0.26rem;
		color: #ffffff;
        line-height: 1;
        div {
            flex: 1;
            line-height: 0.7rem;
            text-align: center;
        }
	}
	.blessing-interval {
		min-width: 3.55rem;
		padding: 0 0.4rem;
		height: 0.58rem;
		background: linear-gradient(
			270deg,
			rgba(0, 0, 0, 0) 0%,
			rgba(0, 0, 0, 0.5) 12%,
			rgba(0, 0, 0, 0.5) 89%,
			rgba(0, 0, 0, 0) 100%
		);
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		top: 9.97rem;
		text-align: center;
		line-height: 0.58rem;
		white-space: nowrap;
		font-weight: 600;
		font-size: 0.26rem;
		color: #fff28f;
		z-index: 10;
	}
	.blessing {
		width: 4.38rem;
		height: 1.32rem;
		background-size: contain;
		background-repeat: no-repeat;
		position: absolute;
		left: 1.56rem;
		top: 10.95rem;
		z-index: 1;
		&.disabled {
			// 置灰
			filter: grayscale(100%);
		}
	}
	.progress-bar {
		width: 5.94rem;
		height: 0.18rem;
		background-color: rgba(255, 255, 255, 0.2);
		border-radius: 0.09rem;
		position: absolute;
		left: 0.84rem;
		top: 13.57rem;
		.progress-bar-content {
			height: 0.18rem;
			background: linear-gradient(180deg, #fff2a8 0%, #facd4e 100%);
			border-radius: 0.09rem;
			position: relative;
			.progress-value {
				width: 1.1rem;
				height: 0.51rem;
				position: absolute;
				right: -0.55rem;
				bottom: -0.58rem;
				background-size: contain;
				background-repeat: no-repeat;
				background-image: url(https://yaame-static.yaame.io/admin/7dff9b1fac56972e338ededa7d21b9b6.png);
				padding-top: 0.16rem;
				text-align: center;
				font-weight: 600;
				font-size: 0.24rem;
				color: #fff28f;
			}
		}
	}
	.progress-title {
		width: 7.5rem;
		text-align: center;
		font-weight: 600;
		font-size: 0.26rem;
		color: #fff28f;
		position: absolute;
		top: 14.51rem;
	}
	.progress-point {
		width: 0.6rem;
		height: 0.6rem;
		position: absolute;
		top: -0.32rem;
		z-index: 10;
		img {
			width: 0.6rem;
			height: 0.6rem;
		}

		&.active {
			img {
				animation: shake 2.5s infinite;
				animation-timing-function: linear;
				animation-iteration-count: infinite;
			}
		}

		@keyframes shake {
			0% {
				transform: rotate(0deg);
			}
			60% {
				transform: rotate(0deg);
			}
			70% {
				transform: rotate(10deg);
			}
			80% {
				transform: rotate(0deg);
			}
			90% {
				transform: rotate(10deg);
			}
			100% {
				transform: rotate(0deg);
			}
		}

		span {
			position: absolute;
			top: -0.38rem;
			font-weight: 600;
			font-size: 0.24rem;
			color: #ffffff;
			left: 50%;
			transform: translateX(-50%);
		}
	}
	.flex-box {
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 10;
		.result-container {
			height: 6.65rem;
			width: 5.1rem;
			position: relative;
			.result-header {
				width: auto;
				max-width: 5.1rem;
				max-height: 1rem;
				height: auto;
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
				top: 0.4rem;
			}
			.close-icon {
				width: 0.9rem;
				height: 0.9rem;
				position: absolute;
				top: -0.44rem;
				right: -0.6rem;
			}
			.result-reward-icon {
				width: 2.7rem;
				height: 2.7rem;
				position: absolute;
				top: 2.3rem;
				left: 1.2rem;
				z-index: 2;
			}
			.result-img {
				width: 5.1rem;
				height: 5.1rem;
				position: absolute;
				top: 1.1rem;
				left: 0;
				z-index: 2;
				&.bg {
					z-index: 1;
					animation: rotate 30s linear infinite;
				}

				@keyframes rotate {
					0% {
						transform: rotate(0deg);
					}
					100% {
						transform: rotate(360deg);
					}
				}
			}
			.result-num {
				width: 5.1rem;
				position: absolute;
				top: 1.46rem;
				left: 0;
				font-weight: 600;
				font-size: 0.42rem;
				color: #fff28f;
				text-align: center;
			}
			.result-btn {
				width: 4.18rem;
				height: 0.9rem;
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
				bottom: -0.45rem;
				text-align: center;
				line-height: 0.9rem;
				font-weight: 600;
				font-size: 0.3rem;
				color: #6b3e17;
				background-size: contain;
				background-repeat: no-repeat;
				background-image: url(https://yaame-static.yaame.io/admin/179a9b76b10e023f1d6d1817bf2cbbc6.png);
				z-index: 3;
			}
		}
		.rule-container {
			width: 5.9rem;
			height: 6.72rem;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/9d7aaa8c62dd19452ebf981395de244b.png);
			position: relative;
			padding-top: 0.3rem;

			.rule-content {
				width: 5.9rem;
				height: 3.9rem;
				overflow-y: scroll;
				margin-top: 0.4rem;
				padding: 0 0.42rem;
				.rule-item-title {
					font-weight: 600;
					font-size: 0.26rem;
					color: #ffffff;
				}
				.rule-item-content {
					font-weight: 400;
					font-size: 0.26rem;
					color: #ffffff;
					opacity: 0.6;
				}
			}
			.close-btn {
				width: 4.18rem;
				height: 0.86rem;
				background-size: contain;
				background-repeat: no-repeat;
				background-image: url(https://yaame-static.yaame.io/admin/179a9b76b10e023f1d6d1817bf2cbbc6.png);
				position: absolute;
				left: 0.86rem;
				bottom: 0.5rem;
				text-align: center;
				line-height: 0.86rem;
				font-weight: 600;
				font-size: 0.3rem;
				color: #6b3e17;
			}
		}
		.reward-container {
			width: 5.9rem;
			height: 7.64rem;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/de3fbf32c14ece5dd1b9638c520a86ed.png);
			position: relative;
			padding-top: 0.3rem;

			.reward-content {
				width: 5.16rem;
				height: 4.64rem;
				overflow-y: scroll;
				margin-top: 0.4rem;
				margin-left: 0.37rem;
				display: flex;
				flex-wrap: wrap;
				.reward-item {
					width: 1.6rem;
					height: 2.1rem;
					margin-right: 0.12rem;
					&:nth-child(3n) {
						margin-right: 0;
					}

					.img-div {
						width: 1.6rem;
						height: 1.6rem;
						background: #286441;
						border-radius: 0.18rem;
						display: flex;
						justify-content: center;
						align-items: center;
						position: relative;
						img {
							width: 1.2rem;
							height: 1.2rem;
						}
						.img-num {
							position: absolute;
							left: 0.1rem;
							top: 0.1rem;
							width: 0.59rem;
							height: 0.29rem;
							background: linear-gradient(180deg, #ffd87d 0%, #ffb700 100%);
							box-shadow: inset 0px 0px 0.12rem 0px rgba(255, 255, 255, 0.5);
							border-radius: 0.15rem;
							text-align: center;
							line-height: 0.3rem;
							font-weight: 600;
							font-size: 0.18rem;
							color: #62330c;
						}
					}
					.item-name {
						width: 1.6rem;
						color: #ffffff;
						text-align: center;
						font-weight: 400;
						margin-top: 0.1rem;
						font-size: 0.18rem;
					}
				}
			}
			.reward-empty {
				width: 5.16rem;
				height: 4.64rem;
				margin-top: 0.4rem;
				margin-left: 0.37rem;
				display: flex;
				justify-content: center;
				align-items: center;
				font-weight: 400;
				font-size: 0.26rem;
				color: #ffffff;
			}
			.close-btn {
				width: 4.18rem;
				height: 0.86rem;
				background-size: contain;
				background-repeat: no-repeat;
				background-image: url(https://yaame-static.yaame.io/admin/179a9b76b10e023f1d6d1817bf2cbbc6.png);
				position: absolute;
				left: 0.86rem;
				bottom: 0.5rem;
				text-align: center;
				line-height: 0.86rem;
				font-weight: 600;
				font-size: 0.3rem;
				color: #6b3e17;
			}
		}
	}
}

.popup-header {
	width: 5.9rem;
	height: 0.5rem;
	text-align: center;
	.header-content {
		font-weight: 600;
		font-size: 0.36rem;
		color: #f1c58b;
		position: relative;
		&::after {
			content: "";
			display: block;
			width: 0.68rem;
			height: 0.32rem;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/e7a35ce40628ac621713453535c44dd0.png);
			position: absolute;
			left: -0.76rem;
			top: 0.04rem;
		}
		&::before {
			content: "";
			display: block;
			width: 0.68rem;
			height: 0.32rem;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/7bc494f79c70097eed327be7c26478b6.png);
			position: absolute;
			right: -0.76rem;
			top: 0.04rem;
		}
	}
}
</style>
