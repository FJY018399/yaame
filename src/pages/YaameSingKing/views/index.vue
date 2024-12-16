<!--
 * @Author: Elk
 * @Date: 2024-05-09 10:41:08
 * @FilePath: /yaame-h5/src/pages/YaameSingKing/views/index.vue
 * @Description: 
-->
<template>
	<div
		:style="{ 'background-image': `url(${imgEnum[language].bgImg})` }"
		class="main"
	>
        <Header color="song">{{ $t("title") }}</Header>

		<div class="time-container">
			<div class="day-left">{{ timeInfo.dayLeft }}</div>
			<div class="day-right">{{ timeInfo.dayRight }}</div>
			<div class="hour">{{ timeInfo.hours }}</div>
			<div class="minute">{{ timeInfo.minutes }}</div>
			<div class="second">{{ timeInfo.seconds }}</div>
		</div>

		<img :src="imgEnum[language].rankImg" @click="routerPush('rank')" />
		<img :src="imgEnum[language].taskImg" @click="routerPush('task')" />
		<img :src="imgEnum[language].exchangeImg" @click="routerPush('exchange')" />
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
			"https://yaame-static.yaame.io/admin/d177fc685c059b388d449517e713b1e2.png",
		rankImg:
			"https://yaame-static.yaame.io/admin/6fe7c1e19ef8861924c86b55b2611c33.png",
		taskImg:
			"https://yaame-static.yaame.io/admin/8a4e8a0c0865d908f96e1e24c6993bf0.png",
		exchangeImg:
			"https://yaame-static.yaame.io/admin/781627bc6541951b096259c01b8f99ec.png",
	},
	"zh-tw": {
		bgImg:
			"https://yaame-static.yaame.io/admin/d177fc685c059b388d449517e713b1e2.png",
		rankImg:
			"https://yaame-static.yaame.io/admin/1e9e5e251fa61064c1a72ef996263481.png",
		taskImg:
			"https://yaame-static.yaame.io/admin/2569b145f35822794f5184bb1c26eea1.png",
		exchangeImg:
			"https://yaame-static.yaame.io/admin/1581000fd23c0c6e9bb250af6b50ade8.png",
	},
	en: {
		bgImg:
			"https://yaame-static.yaame.io/admin/fb60cfb8d962f0ee0de0c6e3ba3fae72.png",
		rankImg:
			"https://yaame-static.yaame.io/admin/e750836be5240125929c801744d5518b.png",
		taskImg:
			"https://yaame-static.yaame.io/admin/fee077b96a9270952c8e45219871e9aa.png",
		exchangeImg:
			"https://yaame-static.yaame.io/admin/9d4a47d56b88e89ebabf34804b0dd41f.png",
	},
	id: {
		bgImg:
			"https://yaame-static.yaame.io/admin/5712fd69b99bf93a8d6ecf00d3f5629d.png",
		rankImg:
			"https://yaame-static.yaame.io/admin/38de8dd1e47d52187e47121255239546.png",
		taskImg:
			"https://yaame-static.yaame.io/admin/c48941c03ba30b436ae3b3b86baa3654.png",
		exchangeImg:
			"https://yaame-static.yaame.io/admin/20a9aecdfe67c6efdc2047911804fb3b.png",
	},
	ar: {
		bgImg:
			"https://yaame-static.yaame.io/admin/5712fd69b99bf93a8d6ecf00d3f5629d.png",
		rankImg: "https://yaame-static.yaame.io/admin/4f89c1f4387470834912710a4279f932.png",
		taskImg: "https://yaame-static.yaame.io/admin/1f9187ed6f75a5c3f7bb6c996405f740.png",
		exchangeImg: "https://yaame-static.yaame.io/admin/5f70e2c70e05c25c3e54e6a75a3e3cad.png",
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
let activity_end_time = ref(new Date(Date.UTC(2024, 4, 27, 0, 0, 0)));
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
	min-height: 16.24rem;
	background-size: contain;
	background-repeat: no-repeat;
	padding-top: 6.85rem;
	position: relative;
	img {
		width: 7.5rem;
		height: auto;
	}
	.time-container {
		div {
			text-align: center;
			line-height: 0.58rem;
			font-size: 0.24rem;
			color: #fff;
			position: absolute;
			top: 5.29rem;
			height: 0.58rem;
		}
		.day-left {
			width: 0.59rem;
			left: 1.75rem;
		}
		.day-right {
			width: 0.59rem;
			left: 2.42rem;
		}
		.hour {
			width: 0.7rem;
			left: 3.21rem;
		}
		.minute {
			width: 0.7rem;
			left: 4.13rem;
		}
		.second {
			width: 0.7rem;
			left: 5.03rem;
		}
	}
}
</style>
