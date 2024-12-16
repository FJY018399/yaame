<template>
	<div class="main">
		<Header color="white"></Header>

		<img :src="titleImgList[language]" class="title-img" alt="title" />

		<div class="time-info time-1">{{ timeInfo.dayLeft }}</div>
		<div class="time-info time-2">{{ timeInfo.dayRight }}</div>
		<div class="time-info time-3">{{ timeInfo.hours }}</div>
		<div class="time-info time-4">{{ timeInfo.minutes }}</div>
		<div class="time-info time-5">{{ timeInfo.seconds }}</div>

		<div class="fix-btn reward" @click="toReward">{{ $t("reward") }}</div>
		<div class="fix-btn rule" @click="ruleVisible = true">{{ $t("rule") }}</div>

		<div class="tab-container">
			<div
				v-for="tab in tabList"
				:key="tab"
				class="tab-item"
				@click="handleTabClick(tab)"
			>
				<div v-show="tabActive === tab" class="active-tab">
					<img src="" alt="" />
					<span>{{ $t(tab) }}</span>
				</div>
				<span v-show="tabActive !== tab">{{ $t(tab) }}</span>
			</div>
		</div>

		<div v-show="tabActive === 'task'" class="task-container">
			<div class="task-progress">
				<div class="reward-icon">
					<img :src="activity_gift.reward_icon" alt="" />
				</div>

				<div class="progress-div">
					<span class="progress-title">{{ $t('gift') }}</span>
					<div class="progress-bar">
						<div
							:style="{
								width: (current_gift_amount / last_gift_amount) * 100 + '%',
                                border: current_gift_amount > 0 ? '0.01rem solid #fdd377' : 'none',
                                paddingRight: current_gift_amount > 0 ? '0.08rem' : '0',
                                paddingTop: current_gift_amount <= 0 ? '0.02rem' : '0',
							}"
							class="progress-inner"
						>
							<span
								:class="[
									current_gift_amount / last_gift_amount < 0.4 && 'right-info',
								]"
								:style="{
									left: (current_gift_amount / last_gift_amount) * 100 + '%',
								}"
								>{{ current_gift_amount }}/{{ last_gift_amount }}</span
							>
						</div>
					</div>
				</div>

				<div style="top: 1.73rem" class="progress-div">
					<span class="progress-title">{{ $t('recharge') }}</span>
					<div class="progress-bar">
						<div
							:style="{
								width:
									(current_recharge_amount / last_recharge_amount) * 100 + '%',
                                border: current_gift_amount > 0 ? '0.01rem solid #fdd377' : 'none',
                                paddingRight: current_gift_amount > 0 ? '0.08rem' : '0',
                                paddingTop: current_gift_amount <= 0 ? '0.02rem' : '0',
							}"
							class="progress-inner orange"
						>
							<span
								:class="[
									current_recharge_amount / last_recharge_amount < 0.4 &&
										'right-info',
								]"
								:style="{
									left:
										(current_recharge_amount / last_recharge_amount) * 100 +
										'%',
								}"
								>{{ current_recharge_amount }}/{{ last_recharge_amount }}</span
							>
						</div>
					</div>
				</div>

				<div class="progress-info">
					{{ activity_gift.reward_info }}
				</div>
			</div>

			<div class="task-nav">
				<div class="task-nav-header"></div>

				<div class="task-th">
					<div class="task-th-item">{{ $t("task") }}</div>
					<div class="task-th-item">{{ $t("reward") }}</div>
				</div>

				<ul ref="taskListWrapper" class="task-list">
					<li v-for="(item, index) in taskList" :key="index" class="task-item">
						<div class="task-item-left">
							<div class="task-content">
								<div class="task-content-icon">
									<img :src="item.task_require_gift.reward_icon" alt="" />
								</div>
								<div class="task-content-info">
									{{ item.task_require_gift.reward_info }}
								</div>
							</div>
							<div class="task-content">
								<div class="task-content-icon">
									<img :src="item.task_require_recharge.reward_icon" alt="" />
								</div>
								<div class="task-content-info">
									{{ item.task_require_recharge.reward_info }}
								</div>
							</div>
						</div>
						<div class="task-item-right">
							<div class="task-right-icon">
								<img :src="item.task_reward.reward_icon" alt="" />
							</div>
							<div class="task-right-info">
								<p>
									<img
										src="https://yaame-static.yaame.io/admin/9e59da36e886d4bcb0b76df39c84b142.png"
										alt=""
									/>
									{{ item.task_reward.reward_diamonds }}
								</p>
								<div :class="['right-btn', `status-${item.reward_status}`]" @click="receiveReward(index, item.reward_status)">
									{{ $t(statusEnum[item.reward_status]) }}
								</div>
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
		<div v-show="tabActive === 'rank'" class="rank-container">
			<img
				class="top-bg-img"
				src="https://yaame-static.yaame.io/admin/511b463266a11a094ab0a4c322a5386e.png"
				alt=""
			/>
			<div class="top-list">
				<div v-for="(item, index) in topList" :class="['top-item', 'top-' + index]">
					<div class="top-avatar"  @click="toDetails(item.scheme_url)">
						<img
							v-show="index === 0"
							class="top-avatar-address"
							src="https://yaame-static.yaame.io/admin/797b85f6b4f430c9f51c89e3539f81a9.png"
							alt=""
						/>
						<img
							v-show="index === 1"
							class="top-avatar-address"
							src="https://yaame-static.yaame.io/admin/55aa715b4d69e9578c46d7c2f5ebe59e.png"
							alt=""
						/>
						<img
							v-show="index === 2"
							class="top-avatar-address"
							src="https://yaame-static.yaame.io/admin/e85dc54365459cf154882f30ba73361f.png"
							alt=""
						/>
						<img class="top-user-avatar" :src="item.subject_icon" alt="" />
					</div>
					<div class="top-name no-wrap">{{ item.subject_name }}</div>
					<div class="top-value">
						<p class="no-wrap">ID: {{ item.peanut_id }}</p>
						<p class="no-wrap">
							<img
								src="https://yaame-static.yaame.io/admin/cc66349fbc67a70d5051302fb05b9ecb.png"
								alt=""
							/>
							{{ Number(item.subject_score) }}
						</p>
					</div>
				</div>
			</div>
			<div v-show="rankList.length !== 0" class="rank-list">
                <div v-for="(item, index) in rankList" :key="index" class="rank-item">
                    <div class="item-rank">{{ item.subject_rank }}</div>
                    <div class="rank-item-avatar" @click="toDetails(item.scheme_url)">
                        <img class="rank-item-avatar-address" src="https://yaame-static.yaame.io/admin/2c36ba079b7e9849b1313791a284bebb.png" alt="">
                        <img class="rank-item-avatar-img" :src="item.subject_icon" alt="">
                    </div>
                    <div class="rank-item-info">
                        <p class="no-wrap">{{ item.subject_name }}</p>
                        <p class="no-wrap">ID: {{ item.peanut_id }}</p>

                    </div>
                    <div class="rank-item-value">
                        <img src="https://yaame-static.yaame.io/admin/cc66349fbc67a70d5051302fb05b9ecb.png" alt="">
                        {{ Number(item.subject_score) }}
                    </div>
                </div>
            </div>

			<div v-show="rankList.length === 0" class="empty-div">
				<img
					class="empty-img"
					src="https://yaame-static.yaame.io/admin/6f6eeabfa5a44678e80ce6775f010ebe.png"
					alt=""
				/>
				<p class="empty-p">{{ $t("noRank") }}</p>
			</div>

            <div class="user-info">
                <div v-if="userInfo.subject_rank" class="item-rank">{{ userInfo.subject_rank > 99 ? '99+' : userInfo.subject_rank }}</div>
                <div v-else class="item-rank">99+</div>
                <div class="rank-item-avatar" @click="toDetails(userInfo.scheme_url)">
                    <img class="rank-item-avatar-address" src="https://yaame-static.yaame.io/admin/2c36ba079b7e9849b1313791a284bebb.png" alt="">
                    <img class="rank-item-avatar-img" :src="userInfo.subject_icon" alt="">
                </div>
                <div class="rank-item-info">
                    <p class="no-wrap">{{ userInfo.subject_name }}</p>
                    <p class="no-wrap">ID: {{ userInfo.peanut_id }}</p>

                </div>
                <div class="rank-item-value">
                    <img src="https://yaame-static.yaame.io/admin/cc66349fbc67a70d5051302fb05b9ecb.png" alt="">
                    {{ Number(userInfo.subject_score) }}
                </div>
            </div>
		</div>

		<pop_up v-show="ruleVisible" class="flex-box">
			<div class="rule-container">
				<div class="close-btn" @click="ruleVisible = false"></div>
				<div class="rule-header">{{ $t("ruleTitle") }}</div>

				<div class="rule-content">
					<p>{{ $t("rule1") }}</p>
					<p>{{ $t("rule2") }}</p>
					<p>{{ $t("rule3") }}</p>
					<p>{{ $t("rule4") }}</p>
					<p>{{ $t("rule5") }}</p>
				</div>
			</div>
		</pop_up>

		<loading v-show="pageLoading"></loading>
	</div>
</template>
<script setup>
import { ref, getCurrentInstance, computed, onMounted } from "vue";
import Header from "../../../components/common/header.vue";
import pop_up from "../../../components/common/pop_up.vue";
import { getLanguage } from "../../../lib/device";
import { getTaskInfoAPI, receiveRewardAPI, getRankListAPI } from "../api";
import loading from "../../../components/common/page_loading.vue";
import Toast from "../../../components/third/toast/toast";

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
		"https://yaame-static.yaame.io/admin/3b26abefbd466eee9cdc9112708302fc.png",
	"zh-tw":
		"https://yaame-static.yaame.io/admin/69650272f26b9770743e9b55dac51935.png",
	en: "https://yaame-static.yaame.io/admin/e1c6b4cf61ddec157616fc7588742ef4.png",
	id: "https://yaame-static.yaame.io/admin/8d772eae8959f54db90851ae3dd94db5.png",
	ar: "https://yaame-static.yaame.io/admin/98530a9ddfe7bb6ad1147910cb48f845.png",
});
let statusEnum = ref({
	0: "receive",
	1: "received",
	2: "receive",
});
let timeInfo = ref({
	dayLeft: 0,
	dayRight: "D",
	hours: "00",
	minutes: "00",
	seconds: "00",
});

let tabList = ref(["task", "rank"]);
let tabActive = ref("task");

const handleTabClick = (item) => {
	tabActive.value = item;
	if (tabActive.value === "rank") {
		getRank();
	} else {
		getTask();
	}
};

let activity_end_time = ref(new Date("2024-01-01 00:00:00"));
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

let ruleVisible = ref(false);

let pageLoading = ref(true);
let taskList = ref([]);

let current_gift_amount = ref(0);
let last_gift_amount = ref(0);
let current_recharge_amount = ref(0);
let last_recharge_amount = ref(0);
let activity_gift = ref({
	reward_icon: "",
	reward_info: "",
	reward_diamonds: 0,
});
let current_level = ref(0);
const getTask = async (cb) => {
	const res = await getTaskInfoAPI();
	console.log(res);
	if (res.status === 1000) {
		activity_end_time.value = res.data.activity_end_time;
		taskList.value = res.data.lucky_recharge_reward_levels;

		current_gift_amount.value = res.data.current_gift_amount;
		last_gift_amount.value = res.data.last_gift_amount;
		current_recharge_amount.value = res.data.current_recharge_amount;
		last_recharge_amount.value = res.data.last_recharge_amount;

		activity_gift.value = res.data.activity_gift;
        current_level.value = res.data.current_level;

        if (cb && typeof cb === "function") cb();
	}
	pageLoading.value = false;
};

let topList = ref([]);
let rankList = ref([]);
const getDefaultUser = () => {
    return {
        subject_icon: "https://yaame-static.yaame.io/admin/6b1f457723ce8c61a48ff0b8a51ed077.png",
        subject_name: "-",
        subject_score: "-",
        peanut_id: "-",
        subject_rank: '-',
        scheme_url: '-',
    };
};
let userInfo = ref(getDefaultUser());
const getRank = async () => {
	const res = await getRankListAPI({
		page: 1,
		size: 50,
		rank_type: "LUCKY_RECHARGE_ACTIVITY",
		rank_group_flag: "activity_lucky_recharge",
	});
	if (res.status === 1000) {
        if (res.data.content.length > 3) {
            topList.value = res.data.content.slice(0, 3);
            rankList.value = res.data.content.slice(3);
        } else {
            topList.value = res.data.content || [];
            while (topList.value.length < 3) {
                topList.value.push(getDefaultUser());
            }
            rankList.value = [];
        }

        userInfo.value = res.data.my_rank;
	}
};

const toDetails = (url) => {
    window.location.href = url;
    console.log(1);
}
const receiveReward = async (id, status) => {
    if (status === 2) {
        const res = await receiveRewardAPI({
            task_index: id,
        });
        if (res.status === 1000) {
            getTask();
            Toast(t('received_success'))
        } else {
            Toast(res.desc)
        }
    }
};

const toReward = () => {
	root.proxy.$router.push({ name: "reward" });
};

let taskListWrapper = ref(null);
const scrollTo = () => {
    let n = current_level.value;
    let timer = setInterval(() => {
        let prizeItem = document.querySelector(".task-item");
        if (prizeItem) {
            let w = prizeItem.offsetHeight;
            if (n === 0) {
                taskListWrapper.value.scrollTop = 0; 
            } else {
                taskListWrapper.value.scrollTop = (w * (n - 1)) - w; 
            }
            clearInterval(timer);
        }
    }, 20);
}
onMounted(() => {
	document.title = t("title");

	getCountdown();
	setInterval(() => {
		getCountdown();
	}, 1000);

	getTask(() => {
        scrollTo();
    });
});
</script>

<style lang="less" scoped>
.main {
	width: 7.5rem;
	min-height: 100vh;
	padding-top: 6.18rem;
	position: relative;
	.title-img {
		width: 7.5rem;
		height: auto;
		position: absolute;
		top: 0;
		left: 0;
	}
	.time-info {
		position: absolute;
		height: 0.68rem;
		width: 0.68rem;
		top: 4.85rem;
		text-align: center;
		line-height: 0.68rem;
		font-weight: 500;
		font-size: 0.36rem;
		color: #ffde45;
		&.time-1 {
			left: 1.67rem;
		}
		&.time-2 {
			left: 2.48rem;
		}
		&.time-3 {
			left: 3.41rem;
		}
		&.time-4 {
			left: 4.28rem;
		}
		&.time-5 {
			left: 5.15rem;
		}
	}
	.fix-btn {
		min-width: 1.2rem;
		height: 0.52rem;
		background: linear-gradient(180deg, #c053ff 0%, #9741ff 100%);
		border: 0.02rem solid #ffe28f;
		border-right: none;
		border-radius: 0.12rem 0 0 0.12rem;
		text-align: center;
		font-size: 0.32rem;
		color: #ffffff;
		padding: 0 0.12rem;
		position: fixed;
		right: 0;
		z-index: 9;
		&.reward {
			top: 2.08rem;
		}
		&.rule {
			top: 3.05rem;
		}
	}
	.tab-container {
		width: 5.54rem;
		height: 0.88rem;
		margin-left: 1.12rem;

		background: #5913bc;
		border-radius: 0.44rem;
		border: 0.02rem solid #ffdb71;
		display: flex;
		.tab-item {
			flex: 1;
			text-align: center;
			line-height: 0.88rem;
			font-weight: 600;
			font-size: 0.28rem;
			color: #ffffff;
			position: relative;
			.active-tab {
				position: absolute;
				width: 3.33rem;
				height: 1.24rem;
				background-size: contain;
				background-repeat: no-repeat;
				background-image: url(https://yaame-static.yaame.io/admin/90223a25322877a419baf5b750225583.png);
				left: -0.3rem;
				top: -0.3rem;
				padding-top: 0.3rem;
			}
		}
	}
	.task-container {
		margin-top: 0.28rem;
		.task-progress {
			width: 7.27rem;
			height: 3.31rem;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/3b64a6999d9a374cd23b63993d58bfab.png);
			margin-left: 0.11rem;
			position: relative;
			.reward-icon {
				width: 2.07rem;
				height: 1.96rem;
				background-size: contain;
				background-repeat: no-repeat;
				background-image: url(https://yaame-static.yaame.io/admin/90bd880ed530ca3b5bb85e1c5889f7ba.png);
				position: absolute;
				top: 1.1rem;
				left: 0.27rem;
                img {
                    width: 1rem;
                    height: 1rem;
                    margin-left: 0.5rem;
                    margin-top: 0.16rem;
                }
			}
			.progress-div {
				width: 4.44rem;
				height: 0.32rem;
				display: flex;
				align-items: center;
				justify-content: space-between;
				position: absolute;
				left: 2.24rem;
				top: 1.12rem;
                padding-left: .9rem;
				.progress-title {
                    width: 2rem;
					font-weight: 600;
					font-size: 0.2rem;
					color: #ffdcff;
                    position: absolute;
                    left: -1.2rem;
                    // background-color: black;
                    text-align: right;
				}
				.progress-bar {
					width: 3.6rem;
					height: 0.2rem;
					background: #5f11ad;
					border-radius: 0.1rem;
					border: 0.01rem solid #c588ff;
					margin-top: 0.04rem;
					position: relative;
					.progress-inner {
						width: 0;
						max-width: 3.5rem !important;
						height: 0.16rem;
						line-height: 0.16rem;
						background: linear-gradient(180deg, #ff6cec 0%, #a905c5 100%);
						border-radius: 0.1rem;
						border: 0.01rem solid #fdd377;
						text-align: right;
						// padding-right: 0.1rem;
						font-size: 0.16rem;
						color: #ffdcff;
						&.orange {
							background: linear-gradient(180deg, #ffd35a 0%, #ca6126 100%);
							border-radius: 0.1rem;
							border: 0.01rem solid #fdd377;
						}
						.right-info {
							position: absolute;
							padding-left: 0.04rem;
						}
					}
				}
			}
			.progress-info {
				width: 4.44rem;
				background: rgba(60, 16, 125, 0.62);
				border-radius: 0.08rem;
				position: absolute;
				left: 2.28rem;
				top: 2.23rem;
				padding: 0.1rem 0.15rem;
				font-size: 0.18rem;
				color: #ffffff;
			}
		}
		.task-nav {
			margin-top: 1.86rem;
			width: 7.16rem;
			height: 10rem;
			position: relative;
			margin-left: 0.17rem;
			background: linear-gradient(180deg, #914afe 0%, #6717db 100%);
			box-shadow: inset 0 -0.1rem 0.1rem 0 rgba(159, 55, 209, 0.68),
				inset 0 0.05rem 0.16rem 0 #6c27d5;
			border-radius: 0.2rem;
			border: 0.04rem solid #c49dff;
			position: relative;
			padding-top: 1.34rem;
			.task-nav-header {
				width: 7.37rem;
				height: 2.12rem;
				background-size: contain;
				background-repeat: no-repeat;
				background-image: url(https://yaame-static.yaame.io/admin/d3055fa9e02cc63ec0b3e9a28627b32b.png);
				position: absolute;
				left: -0.12rem;
				top: -1.55rem;
				z-index: 1;
			}
			.task-th {
				width: 7.16rem;
				height: 1.34rem;
				background: linear-gradient(180deg, #6d24de 0%, #5b10ca 100%);
				box-shadow: 0 0.04rem 0.06rem 0 rgba(89, 51, 147, 0.42),
					inset 0 -0.01rem 0.1rem 0 #fa85fa;
				border-radius: 0.2rem 0px 0px 0px;
				border: 0.04rem solid #c49dff;
				margin-left: -0.04rem;
				display: flex;
				position: absolute;
				top: 0;
				left: 0;
				.task-th-item {
					width: 3.54rem;
					height: 1.3rem;
					border-right: 0.04rem solid #c49dff;
					text-align: center;
					font-size: 0.3rem;
					color: #ffffff;
					padding-top: 0.67rem;
					&:nth-child(2n) {
						border-right: none;
					}
				}
			}
			.task-list {
				width: 7.08rem;
				height: 8.56rem;
				overflow-y: scroll;
				.task-item {
					width: 7.08rem;
					height: 2.3rem;
					border-bottom: 0.04rem solid #c49dff;
					display: flex;
					&:last-child {
						border-bottom: none;
					}

					.task-item-left {
						width: 3.54rem;
						height: 2.3rem;
						border-right: 0.04rem solid #c49dff;
						padding: 0.28rem 0.26rem;

						.task-content {
							width: 2.98rem;
							height: 0.8rem;
							display: flex;
							&:last-child {
								margin-top: 0.14rem;
							}
							.task-content-icon {
								width: 0.8rem;
								height: 0.8rem;
								background: #5a14c4;
								border-radius: 0.12rem;
								border: 0.02rem solid #ffe981;
								display: flex;
								justify-content: center;
								align-items: center;
								img {
									width: 0.6rem;
									height: 0.6rem;
								}
							}
							.task-content-info {
								height: 0.8rem;
								// line-height: 0.8rem;
								margin-left: 0.16rem;
								flex: 1;
								font-weight: 400;
								font-size: 0.22rem;
								color: #ffffff;
                                display: flex;
                                align-items: center
							}
						}
					}
					.task-item-right {
						width: 3.54rem;
						height: 2.3rem;
						display: flex;
						padding: 0.36rem 0 0.36rem 0.2rem;

						.task-right-icon {
							width: 1.6rem;
							height: 1.6rem;
							background: #5a14c4;
							border-radius: 0.16rem;
							border: 0.02rem solid #ffe981;
							display: flex;
							justify-content: center;
							align-items: center;
							img {
								width: 1.2rem;
								height: 1.2rem;
							}
						}
						.task-right-info {
							flex: 1;
							margin-left: 0.14rem;
							padding-top: 0.36rem;
							p {
								font-weight: 600;
								font-size: 0.22rem;
								color: #ffffff;
								text-align: center;
								img {
									width: 0.22rem;
									height: 0.19rem;
									vertical-align: middle;
                                    position: relative;
                                    bottom: 0.02rem
								}
							}
							.right-btn {
								width: 1.48rem;
								height: 0.52rem;
								background-size: contain;
								background-repeat: no-repeat;

								text-align: center;
								line-height: 0.52rem;
								color: #fff;
								font-weight: 500;
								font-size: 0.22rem;
								margin-top: 0.18rem;
								&.status-0 {
									// 未完成
									background-image: url(https://yaame-static.yaame.io/admin/c1fe1695c11bafc3075d05929e4c5895.png);
									opacity: 0.7;
								}
								&.status-1 {
									// 已领取

									background-image: url(https://yaame-static.yaame.io/admin/bbec9167ff121cbbbd4d3038f16e177f.png);
                                    opacity: 0.7;
								}
								&.status-2 {
									// 已完成
									background-image: url(https://yaame-static.yaame.io/admin/18872a64c090e8c919e5edecb3178461.png);
									
								}
							}
						}
					}
				}
			}
		}
	}
	.rank-container {
		width: 7.16rem;
		min-height: auto;
		margin-top: 0.23rem;
		margin-left: 0.17rem;
		padding-top: 6.14rem;
		position: relative;
		// background-color: #5123A9;
		// border: 0.04rem solid #ECCE75;
		.top-bg-img {
			width: 7.16rem;
			height: 7.06rem;
			position: absolute;
			left: 0;
			top: 0;
		}
		.top-list {
			position: absolute;
			left: 0.14rem;
			top: 0.82rem;
			width: 6.9rem;
			height: 5.32rem;
			.top-item {
				width: 2.3rem;
				height: 3.64rem;
				position: absolute;
				.top-avatar {
					width: 2.3rem;
					height: 2.15rem;
					.top-avatar-address {
						width: 2.3rem;
						height: 2.15rem;
						position: relative;
						z-index: 1;
					}
					.top-user-avatar {
						width: 1.6rem;
						height: 1.6rem;
						position: absolute;
						left: 0.36rem;
						top: 0.36rem;
						border-radius: 50%;
					}
				}
				.top-name {
					width: 2.3rem;
					height: 0.42rem;
					line-height: 0.42rem;
					text-align: center;
					margin-top: 0.15rem;
					margin-bottom: 0.14rem;
					font-size: 0.24rem;
					color: #ffffff;
				}
				.top-value {
					width: 2rem;
					margin-left: 0.15rem;
					height: 0.78rem;
					font-size: 0.24rem;
					color: #ffffff;
					// color: #B4A4D9;
					background: rgba(33, 19, 60, 0.5);
					border-radius: 0.45rem;
					text-align: center;
					padding: 0.06rem 0;
					img {
						width: 0.26rem;
						height: 0.22rem;
						vertical-align: middle;
                        position: relative;
                        bottom: 0.02rem
					}
				}
				&.top-0 {
					top: 0;
					left: 2.3rem;
				}
				&.top-1 {
					top: 1.42rem;
					left: 0;
				}
				&.top-2 {
					top: 1.42rem;
					right: 0;
				}
			}
		}
		.rank-list {
			width: 7.16rem;
			height: auto;
			background: #5123A9;
			border: 0.02rem solid #ecce75;
			border-top: none;
            padding-bottom: 1.7rem;
			.rank-item {
				position: relative;
				z-index: 1;
				width: 6.9rem;
				height: 1.5rem;
				left: 0.13rem;
				background-size: contain;
				background-repeat: no-repeat;
				background-image: url(https://yaame-static.yaame.io/admin/1bba4dc80dfa8376aca929e4be8c6ad1.png);
				margin-bottom: 0.14rem;
				display: flex;
				align-items: center;
				font-size: 0.24rem;
				color: #ffffff;
				.item-rank {
					width: 1.16rem;
					text-align: center;
				}
				.rank-item-avatar {
					width: 0.99rem;
					height: 0.99rem;
					position: relative;
					.rank-item-avatar-address {
						width: 0.99rem;
						height: 0.99rem;
						position: relative;
						z-index: 1;
					}
					.rank-item-avatar-img {
						width: 0.99rem;
						height: 0.99rem;
						position: absolute;
						left: 0;
						top: 0;
						border-radius: 50%;
					}
				}
				.rank-item-info {
					width: 2.97rem;
					padding-left: 0.15rem;
				}
				.rank-item-value {
					flex: 1;
					img {
						width: 0.27rem;
						height: auto;
						vertical-align: middle;
                        position: relative;
                        bottom: 0.02rem
					}
				}
			}
		}
		.empty-div {
			width: 7.16rem;
			height: 5.7rem;
			background: #5123a9;
			border: 0.02rem solid #ecce75;
			border-top: none;
			padding-top: 2rem;
			.empty-img {
				padding-top: 0.2rem;
				margin-left: 3.08rem;
				width: 1rem;
				height: 1.2rem;
			}
			.empty-p {
				margin-top: 0.3rem;
				width: 7.16rem;
				text-align: center;
				font-size: 0.24rem;
				color: #ffffff;
			}
		}
        .user-info {
            width: 7.02rem;
            height: 1.5rem;
            background-size: contain;
            background-repeat: no-repeat;
            background-image: url(https://yaame-static.yaame.io/admin/747c94eb837e94bcc7ebda74d8f30a57.png);
            position: fixed;
            z-index: 10;
            left: 0.24rem;
            bottom: 0;
            display: flex;
            align-items: center;
            font-size: 0.24rem;
            color: #ffffff;
            .item-rank {
                width: 1.22rem;
                padding-left: 0.1rem;
                text-align: center;
            }
            .rank-item-avatar {
                width: 0.99rem;
                height: 0.99rem;
                position: relative;
                .rank-item-avatar-address {
                    width: 0.99rem;
                    height: 0.99rem;
                    position: relative;
                    z-index: 1;
                }
                .rank-item-avatar-img {
                    width: 0.99rem;
                    height: 0.99rem;
                    position: absolute;
                    left: 0;
                    top: 0;
                    border-radius: 50%;
                }
            }
            .rank-item-info {
                width: 2.97rem;
                padding-left: 0.15rem;
            }
            .rank-item-value {
                flex: 1;
                img {
                    width: 0.27rem;
                    height: auto;
                    vertical-align: middle;
                    position: relative;
                    bottom: 0.02rem
                }
            }
        }
	}
	.flex-box {
		display: flex;
		justify-content: center;
		align-items: center;
		.rule-container {
			width: 5.87rem;
			height: 6.3rem;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/a2f1780d06c96fc4d168dc0ae6a7d5f6.png);
			position: relative;
			padding-top: 0.2rem;
			.close-btn {
				width: 0.5rem;
				height: 0.5rem;
				position: absolute;
				bottom: -1rem;
				left: 2.58rem;
				background-size: contain;
				background-repeat: no-repeat;
				background-image: url(https://yaame-static.yaame.io/admin/a0b7f86d273879dfa0533c76054908b9.png);
			}
			.rule-header {
				width: 5.87rem;
				text-align: center;
				font-weight: normal;
				font-size: 0.32rem;
				color: #ffffff;
				padding-right: 0.1rem;
			}
			.rule-content {
				width: 4.26rem;
				height: 4.68rem;
				position: absolute;
				left: 0.67rem;
				top: 1.12rem;
				overflow-y: scroll;
				font-size: 0.24rem;
				color: #ffffff;
			}
		}
	}
}
</style>
