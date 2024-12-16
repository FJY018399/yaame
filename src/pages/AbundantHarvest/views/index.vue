<!--
 * @Author: Elk
 * @Date: 2024-05-09 10:41:08
 * @FilePath: /yaame-h5/src/pages/AbundantHarvest/views/index.vue
 * @Description: 
-->
<template>
	<div
		:style="{ 'background-image': `url(${imgEnum[language].bgImg})` }"
		class="main"
	>
		<Header color="harvest">{{ $t("title") }}</Header>

		<div class="time-container">
			<div class="day-left">{{ timeInfo.dayLeft }}</div>
			<div class="day-right">{{ timeInfo.dayRight }}</div>
			<div class="hour">{{ timeInfo.hours }}</div>
			<div class="minute">{{ timeInfo.minutes }}</div>
			<div class="second">{{ timeInfo.seconds }}</div>
		</div>

		<img :src="imgEnum[language].sendImg" @click="routerPush('send')" />
		<img :src="imgEnum[language].diamondImg" @click="routerPush('diamonds')" />
		<img :src="imgEnum[language].exchangeImg" @click="routerPush('exchange')" />
		<img :src="imgEnum[language].rankImg" @click="routerPush('rank')" />
	</div>
</template>

<script setup>
import { ref, getCurrentInstance, computed, onMounted } from "vue";
import { getLanguage } from "@/lib/device.js";
import Header from "@/components/common/header.vue";
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

let imgEnum = ref({
	"zh-cn": {
		bgImg:
			"https://yaame-static.yaame.io/admin/7ed6d19470147efeb66d4a57c7b4a9cf.png",
		sendImg:
			"https://yaame-static.yaame.io/admin/4fa02c71d6c345acdaca61c2b3f77fc2.png",
		diamondImg:
			"https://yaame-static.yaame.io/admin/5696a2f876102bee59da903121712a3d.png",
		exchangeImg:
			"https://yaame-static.yaame.io/admin/beec1f9f21b33ad5e9cc81ee50d65424.png",
		rankImg:
			"https://yaame-static.yaame.io/admin/f5a6bae928f67a1790c7067be5d853c5.png",
	},
	"zh-tw": {
		bgImg:
			"https://yaame-static.yaame.io/admin/f89c34905faf25f16122b384a0c94756.png",
		sendImg:
			"https://yaame-static.yaame.io/admin/d80f834f58a2b538631314eca7cedf9f.png",
		diamondImg:
			"https://yaame-static.yaame.io/admin/03753dce1f38adc831f536497f691667.png",
		exchangeImg:
			"https://yaame-static.yaame.io/admin/bc07d5ff4720c8b37a699109725653fd.png",
		rankImg:
			"https://yaame-static.yaame.io/admin/3ecbd4861410eda6cf9c0e12d41027fe.png",
	},
	en: {
		bgImg:
			"https://yaame-static.yaame.io/admin/7594277e87154c0aaac78217943c71f8.png",
		sendImg:
			"https://yaame-static.yaame.io/admin/485c6358ec8a78f5b9bcb14169960a29.png",
		diamondImg:
			"https://yaame-static.yaame.io/admin/9c9ac622441bf11fb94fb4398d111790.png",
		exchangeImg:
			"https://yaame-static.yaame.io/admin/6b70f1670085c9cafb7baac0f897298c.png",
		rankImg:
			"https://yaame-static.yaame.io/admin/52ecfee99da5a2c393a2cd3e62f52f84.png",
	},
	id: {
		bgImg:
			"https://yaame-static.yaame.io/admin/02553fb2abb95e1353203335952c7273.png",
		sendImg:
			"https://yaame-static.yaame.io/admin/6663983956c842a64a6e03dc2b09cd80.png",
		diamondImg:
			"https://yaame-static.yaame.io/admin/a71ee20ab1a9d017582b2ba02f37a5bf.png",
		exchangeImg:
			"https://yaame-static.yaame.io/admin/033954b84cb050d7de071d7cf149ddf8.png",
		rankImg:
			"https://yaame-static.yaame.io/admin/527634b4611039c08af0db4bb27b8aed.png",
	},
	ar: {
		bgImg:
			"https://yaame-static.yaame.io/admin/9dd44c52818cffe1979002ea45333998.png",
		sendImg:
			"https://yaame-static.yaame.io/admin/e893153d0d203afa7569d4cd5813216e.png",
		diamondImg:
			"https://yaame-static.yaame.io/admin/cbe6d63bac150c0a36998650cd4b7620.png",
		exchangeImg:
			"https://yaame-static.yaame.io/admin/35f33be2645b5f9a3630cb0cc6c3b455.png",
		rankImg:
			"https://yaame-static.yaame.io/admin/84010f07269eed45a7f0910b9bf59d2f.png",
	},
});

const routerPush = (path) => {
	root.proxy.$router.push({ path: `/${path}` });
};

let timeInfo = ref({
	dayLeft: 0,
	dayRight: "D",
	hours: "00",
	minutes: "00",
	seconds: "00",
});
let activity_end_time = ref(new Date(Date.UTC(2024, 5, 3, 0, 0, 0)));
const getCountdown = () => {
	// 获取当前时间
	const now = new Date();

	// 设置目标时间
	const target = new Date(activity_end_time.value);

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

onMounted(() => {
	getCountdown();
	setInterval(() => {
		getCountdown();
	}, 1000);
});
</script>

<style lang="less" scoped>
.main {
	width: 7.5rem;
	min-height: 16.82rem;
	background-size: contain;
	background-repeat: no-repeat;
	padding-top: 5.26rem;
	position: relative;
	img {
		width: 7.15rem;
		height: auto;
        margin-left: 0.1rem;
	}
	.time-container {
		div {
			text-align: center;
			line-height: 0.58rem;
			font-size: 0.24rem;
			color: #fff;
			position: absolute;
			top: 4.52rem;
			height: 0.62rem;
            // background-color: rgba(255, 255, 255, 0.5);
		}
		.day-left {
			width: 0.64rem;
			left: 1.66rem;
		}
		.day-right {
			width: 0.64rem;
			left: 2.4rem;
		}
		.hour {
			width: 0.74rem;
			left: 3.24rem;
		}
		.minute {
			width: 0.74rem;
			left: 4.16rem;
		}
		.second {
			width: 0.74rem;
			left: 5.06rem;
		}
	}
}
</style>
