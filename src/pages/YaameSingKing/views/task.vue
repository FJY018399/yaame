<!--
 * @Author: Elk
 * @Date: 2024-05-10 11:11:11
 * @FilePath: /yaame-h5/src/pages/YaameSingKing/views/game.vue
 * @Description: 
-->
<template>
	<refresh class="refresh" ref="wlRefresh" @onRefresh="getTaskInfo">
		<div
			:style="{ 'background-image': `url(${titleImgList[language]})` }"
			class="task"
		>
			<Header color="song">{{ $t("title") }}</Header>

			<div class="rule-icon" @click="showVisible('rule')">{{ $t("rule") }}</div>

			<div v-if="activity_status === 1" class="time-container">
				<div class="hour">{{ timeInfo.hours }}</div>
				<div class="minute">{{ timeInfo.minutes }}</div>
				<div class="second">{{ timeInfo.seconds }}</div>

				<p class="time-p">{{ $t("refreshTaskStateAfterCountdown") }}</p>
			</div>

			<div v-else class="end-container">
				{{ $t("activityOver") }}
			</div>

			<div class="task-content">
				<div v-for="(item, index) in taskList" :key="index" class="task-item">
					<div :style="{ 'opacity': item.task_status === 0 ? '0.8' : '1' }" class="task-info">
						<div class="task-title">
							{{ item.task_name }}
						</div>
						<div class="task-reward">
							{{ $t("reward") }}: {{ item.task_rewards }}
						</div>
					</div>
					<div class="task-btn" @click="getTaskReward(item)">
						<div :class="['btn-div', 'status-' + item.task_status]">
							{{ statusEnum[item.task_status] }}
						</div>
						<p class="btn-info">({{ item.task_progress }})</p>
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
						<p class="content-p">{{ $t("taskRule1") }}</p>
						<p class="content-p">{{ $t("taskRule2") }}</p>
						<p class="content-p">{{ $t("taskRule3") }}</p>
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
import { ref, getCurrentInstance, computed, onMounted } from "vue";
import { getLanguage } from "@/lib/device.js";
import popup from "@/components/common/pop_up.vue";
import { getTaskInfoApi, getTaskRewardApi } from "../api";
import { Toast } from "vant";
const root = getCurrentInstance();
import refresh from "@/components/common/refresh.vue";
const t = (val) => {
	return root.proxy.$t(val);
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
		"https://yaame-static.yaame.io/admin/4931a3816fca42c7cd1cef781f3c9e82.png",
	"zh-tw":
		"https://yaame-static.yaame.io/admin/c5c6da1944142497d0e6df5bf2106312.png",
	en: "https://yaame-static.yaame.io/admin/8e53267a0a335f5bd48e37db79515924.png",
	id: "https://yaame-static.yaame.io/admin/e3f7dc0b228d1480bd76154d6d939c3d.png",
	ar: "https://yaame-static.yaame.io/admin/c0cd204b6ee8e28dcc9b49c59e46ae8b.png",
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

	// 目标时间为明天的utc0点
	const target = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

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

		getTaskInfo();
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

let activity_status = ref(1);
let taskList = ref([]);

let statusEnum = {
	0: t("receive"),
	1: t("receive"),
	2: t("received"),
};
let time_cycle_flag = ref("");
const wlRefresh = ref(null);
const getTaskInfo = async () => {
	let res = await getTaskInfoApi();
	if (res.status === 1000) {
		activity_status.value = res.data.activity_status;

		taskList.value = res.data.tasks;
		time_cycle_flag.value = res.data.time_cycle_flag;

        setTimeout(() => {
            wlRefresh.value.isLoading = false;
        }, 500);
	}
};


const getTaskReward = async (item) => {
	if (item.task_status === 1) {
		let res = await getTaskRewardApi({
			task_type: item.task_type,
			time_cycle_flag: time_cycle_flag.value,
		});
		if (res.status === 1000) {
			getTaskInfo();

			Toast(root.proxy.$t("receiveSuccess"));
		} else {
			Toast(root.proxy.$t(res.desc));
		}
	}
};

let ruleVisible = ref(false);

const showVisible = (type) => {
	if (type === "rule") {
		ruleVisible.value = true;
	}
};

onMounted(() => {
	getTaskInfo();
	getCountdown();
	setInterval(() => {
		getCountdown();
	}, 1000);
});
</script>

<style scoped lang="less">
.task {
	width: 7.5rem;
	min-height: 100vh;
	background-size: contain;
	background-repeat: no-repeat;
	position: relative;
	padding-top: 5.35rem;
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
		width: 4.71rem;
		height: 1.43rem;
		background-size: contain;
		background-repeat: no-repeat;
		background-image: url(https://yaame-static.yaame.io/admin/aaa1ff70cded0839b416ff83615eecae.png);
		margin-left: 1.4rem;
		position: relative;
		padding-top: 0.88rem;
		.time-p {
			width: 4.71rem;
			height: 0.5rem;
			padding: 0 0.3rem;
			text-align: center;
			font-size: 0.22rem;
			color: #ffffff;
			// line-height: 0.18rem;

			display: flex;
			justify-content: center;
			align-items: center;
		}
		.hour {
			width: 0.7rem;
			height: 0.58rem;
			position: absolute;
			left: 1.1rem;
			top: 0.22rem;

			text-align: center;
			line-height: 0.58rem;
			font-size: 0.24rem;
			color: #fffd99;
		}
		.minute {
			width: 0.7rem;
			height: 0.58rem;
			position: absolute;
			left: 2.02rem;
			top: 0.22rem;
			font-size: 0.24rem;
			color: #fffd99;
			text-align: center;
			line-height: 0.58rem;
		}
		.second {
			width: 0.7rem;
			height: 0.58rem;
			position: absolute;
			left: 2.92rem;
			top: 0.22rem;
			font-size: 0.24rem;
			color: #fffd99;
			text-align: center;
			line-height: 0.58rem;
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
	.task-content {
		width: 7.34rem;
		height: 14.34rem;
		background-size: 7.34rem auto;
		background-repeat: no-repeat;
		background-image: url(https://yaame-static.yaame.io/admin/b85840ea5891e13510e25cd2631bcedf.png);
		margin-top: 0.4rem;
		margin-left: 0.08rem;
		padding-top: 1.12rem;
		// padding-bottom: 0.26rem;
		.task-item {
			width: 7.34rem;
			display: flex;
			// align-items: center;
			justify-content: space-between;
			padding-left: 0.26rem;
			padding-right: 0.22rem;
			margin-bottom: 0.35rem;
			&:last-child {
				margin-bottom: 0;
			}
			.task-info {
				width: 4.71rem;
				.task-title {
					font-size: 0.24rem;
					color: #ffe399;
				}
				.task-reward {
					font-size: 0.18rem;
					color: #ffffff;
				}
			}
			.task-btn {
				width: 1.66rem;
				.btn-div {
					width: 1.66rem;
					height: 0.7rem;
					background-size: contain;
					background-repeat: no-repeat;
					text-align: center;
					line-height: 0.7rem;
					font-size: 0.24rem;
					&.status-0 {
						// 未完成
						color: rgba(255, 255, 255, 0.7);
						background-image: url(https://yaame-static.yaame.io/admin/2b850270b98b530623c0ed9d984731b7.png);
					}
					&.status-1 {
						// 待领取
						color: #9b5300;
						background-image: url(https://yaame-static.yaame.io/admin/c89a913292856b7f8d7c8b5899c8f614.png);
					}
					&.status-2 {
						// 已完成
						color: #fff;
						background-image: url(https://yaame-static.yaame.io/admin/d4bb26807c3a6603b38d2af4642e058b.png);
					}
				}

				.btn-info {
					width: 1.66rem;
					text-align: center;
					font-size: 0.18rem;
					color: #ffffff;
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
