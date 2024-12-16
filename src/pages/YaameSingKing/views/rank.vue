<template>
	<div
		:style="{ 'background-image': `url(${titleImgList[language]})` }"
		class="rank"
	>
		<Header color="song">{{ $t("title") }}</Header>

		<div class="rule-icon" @click="showVisible('rule')">{{ t("rule") }}</div>
		<div class="rule-icon reward" @click="showVisible('reward')">
			{{ t("reward") }}
		</div>

		<div
			:style="{ 'background-image': `url(${eventImgList[language]})` }"
			class="event-gift"
		>
			<p class="title-p">{{ $t("eventTitle") }}</p>

			<div class="gift-list">
				<div
					v-for="(item, index) in eventGiftList"
					:key="index"
					class="gift-item"
				>
					<div class="gift-item-img">
						<img :src="item.icon" alt="" />
					</div>

					<p class="gift-item-name no-wrap">{{ item.gift_name }}</p>
					<p class="gift-item-value no-wrap">
						<img
							src="https://yaame-static.yaame.io/admin/88a503fd1f0e1ccfea864e7eeb54936a.png"
							alt=""
						/>
						{{ item.diamond_worth }}
					</p>
				</div>
			</div>
		</div>

		<div class="tab-container">
			<div
				v-for="(item, index) in tabList"
				:key="item.key"
				:class="['tab-' + index, tabActive === item.key && 'active']"
				@click="handleClickTab(item.key)"
			>
				{{ $t(item.i18nKey) }}
				<p class="tab-time">{{ item.time }}</p>
			</div>
		</div>

		<div v-if="currentIsEnd" class="end-container">
			{{ currentIsEndText }}
		</div>

		<div v-else class="time-container">
			<div class="day-left">{{ timeInfo.dayLeft }}</div>
			<div class="day-right">{{ timeInfo.dayRight }}</div>
			<div class="hour">{{ timeInfo.hours }}</div>
			<div class="minute">{{ timeInfo.minutes }}</div>
			<div class="second">{{ timeInfo.seconds }}</div>
		</div>

		<div class="rank-container">
			<div class="top-rank">
				<div
					v-for="(item, index) in topList"
					:key="index"
					:class="['top-item', 'top-' + index]"
				>
					<img class="top-avatar" :src="item.avatar" alt="" />
					<div class="top-avatar-dress" @click="toDetails(item)"></div>
					<p class="top-user-rank no-wrap">{{ $t(`top${index + 1}`) }}</p>
					<p v-show="item.nick_name" class="top-user-name no-wrap">
						{{ item.nick_name }}
					</p>
					<p v-show="item.peanut_id" class="top-user-id no-wrap">
						ID: {{ item.is_mystery === 1 ? '****' : item.peanut_id}}
					</p>
					<p v-show="item.subject_score" class="top-user-value no-wrap">
						<img
							src="https://yaame-static.yaame.io/admin/c4b82a8b5e6c5c3254987a9ec218c088.png"
							alt=""
						/>
						{{ item.subject_score }}
					</p>
				</div>
			</div>
			<div v-show="list && list.length > 0" class="rank-list">
				<div v-for="(item, index) in list" :key="index" class="rank-item">
					<div v-if="item.subject_rank" class="user-rank">
						{{ item.subject_rank === -1 ? '--' : item.subject_rank > 200 ? '200+' : item.subject_rank}}
					</div>
                    <div v-else-if="item.show_text === 1" class="user-rank">
                        --
					</div>
                    <div v-else class="user-rank">
                        200+
					</div>
					<div class="user-avatar" @click="toDetails(item)">
						<img :src="item.avatar" alt="" />
					</div>
					<div class="rank-user-info">
						<p class="no-wrap">{{ item.nick_name }}</p>
						<p class="no-wrap">ID: {{ item.peanut_id }}</p>
					</div>
					<div class="user-value">
						<img
							src="https://yaame-static.yaame.io/admin/c4b82a8b5e6c5c3254987a9ec218c088.png"
							alt=""
						/>
						{{ item.subject_score }}
					</div>
				</div>
			</div>

			<div v-show="list.length === 0" class="empty">
				<img
					class="empty-img"
					src="https://yaame-static.yaame.io/admin/28bc12fcd92fd13919f1554a02f761d6.png"
					alt=""
				/>
				<p class="empty-p">{{ $t("noOneOnTheList") }}</p>
			</div>

			<div class="user-info">
				<div v-if="myRank.subject_rank" class="user-rank">
					{{ myRank.subject_rank === -1 ? '--' : myRank.subject_rank > 200 ? '200+' : myRank.subject_rank}}
				</div>
                <div v-else-if="myRank.show_text === 1" class="user-rank">
                        --
					</div>
                <div v-else class="user-rank">
						200+
					</div>
				<div class="user-avatar" @click="toDetails(myRank)">
					<img :src="myRank.avatar" alt="" />
				</div>
				<div class="rank-user-info">
					<p class="no-wrap">{{ myRank.nick_name }}</p>
					<p class="no-wrap">ID: {{ myRank.peanut_id }}</p>
				</div>
				<div class="user-value">
					<img
						v-if="myRank.show_text === 0"
						src="https://yaame-static.yaame.io/admin/c4b82a8b5e6c5c3254987a9ec218c088.png"
						alt=""
					/>
					{{ myRank.subject_score }}
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
					<p class="content-p">{{ $t("preliminaryTime") }}</p>
					<p class="content-p">{{ $t("rematchTime") }}</p>
					<p class="content-p">{{ $t("semiFinalsTime") }}</p>
					<p class="content-p">{{ $t("finalTime") }}</p>

					<p class="desc-p">{{ $t("activityDescription") }}</p>
					<p class="content-p">{{ $t("activityDescription1") }}</p>
					<p class="content-p">{{ $t("activityDescription2") }}</p>
					<p class="content-p">{{ $t("activityDescription3") }}</p>
					<p class="content-p">{{ $t("activityDescription4") }}</p>

                    <p class="desc-p">{{ $t("promotionRules") }}</p>
					<p class="content-p">{{ $t("promotionRules1") }}</p>
					<p class="content-p">{{ $t("promotionRules2") }}</p>
					<p class="content-p">{{ $t("promotionRules3") }}</p>
					<p class="content-p">{{ $t("promotionRules4") }}</p>
					<p class="content-p">{{ $t("promotionRules5") }}</p>
					<p class="content-p">
						{{ $t("theFinalInterpretationBelongsToYaame") }}
					</p>
				</div>
			</div>
		</popup>

        <Loading v-show="pageLoading"></Loading>
	</div>
</template>
<script setup>
import Header from "@/components/common/header.vue";
import { ref, getCurrentInstance, computed, onMounted } from "vue";
import { getLanguage } from "@/lib/device.js";
import popup from "@/components/common/pop_up.vue";
import { getGiftListApi, getRankListApi, getPrizeListApi } from "../api";
import { Toast } from "vant";
import Loading from "@/components/common/page_loading.vue";


const root = getCurrentInstance();

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
		"https://yaame-static.yaame.io/admin/a3b6fdef4073b3e4afd526183a4fe290.png",
	"zh-tw":
		"https://yaame-static.yaame.io/admin/23d6ba6498aba5d090524edf2407cfdc.png",
	en: "https://yaame-static.yaame.io/admin/4a0603d9a7ad8cefc08cccba4ef9a97d.png",
	id: "https://yaame-static.yaame.io/admin/3c069a97f132662ed7f55ca1a0debb29.png",
	ar: "https://yaame-static.yaame.io/admin/daf84f2ee42d16c8e40384e5712078a3.png",
});

let eventImgList = ref({
	"zh-cn":
		"https://yaame-static.yaame.io/admin/66be6c8744e2f89481e3d524d2158030.png",
	"zh-tw":
		"https://yaame-static.yaame.io/admin/4c6de0673cd468f4733c68016a3eba26.png",
	en: "https://yaame-static.yaame.io/admin/74787620c7e36116b55bdcbbd0225c5b.png",
	id: "https://yaame-static.yaame.io/admin/5f1e1b694268e0fda669ef327e654cbd.png",
	ar: "https://yaame-static.yaame.io/admin/ac56e9fe4f1265ce8e8c52c3b8bf516a.png",
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
		clearInterval(rankTimeOut.value);

		currentIsEnd.value = true;
		currentIsEndText.value = t(
			tabList.value.find((item) => item.key === tabActive.value).i18nKey +
				"Over"
		);
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

let tabActive = ref("FINAL");
let tabList = ref([
	{
		i18nKey: "preliminary",
		time: "5.18-5.21",
		key: "PRELIMINARY",
	},
	{
		i18nKey: "rematch",
		time: "5.21-5.23",
		key: "QUARTERFINAL",
	},
	{
		i18nKey: "semiFinals",
		time: "5.23-5.25",
		key: "SEMIFINAL",
	},
	{
		i18nKey: "final",
		time: "5.25-5.27",
		key: "FINAL",
	},
]);
const handleClickTab = (tab) => {
	getRankList(tab);
};

let eventGiftList = ref([]);
const getGiftList = async () => {
	const res = await getGiftListApi();
	if (res.status === 1000) {
		eventGiftList.value = res.data.gift_config_items;
	}
};
let ruleVisible = ref(false);
const showVisible = (type) => {
	if (type === "reward") {
		root.proxy.$router.push({ path: "/reward" });
	} else {
		ruleVisible.value = true;
	}
};

const getPrizeList = async () => {
	const res = await getPrizeListApi();
	if (res.status === 1000) {
		if (res.data.current_pk_type) {
			tabActive.value = res.data.current_pk_type;
		}
	}
};

const getDefaultUser = () => {
	return {
		avatar:
			"https://yaame-static.yaame.io/admin/1eb64b5bdc5bfcf00799226314fb969e.png",
		nick_name: "",
		subject_rank: null,
		subject_score: "",
		peanut_id: "",
	};
};

let topList = ref([]);
let list = ref([]);
let myRank = ref(getDefaultUser());

let rankTimeOut = ref(0);

let currentEndTime = ref(0);

let currentIsEnd = ref(false);
let currentIsEndText = ref("");
let pageLoading = ref(true);
const getRankList = async (tab, isCheck) => {
	const res = await getRankListApi({
		ktv_song_king_match_type: tab || tabActive.value,
	});
	if (res.status === 1000) {
		if (res.data.remain_start_time) {
			let now = new Date();
			let diff = res.data.remain_start_time;
			let hours = Math.floor(diff / (1000 * 60 * 60));
			let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
			let seconds = Math.floor((diff % (1000 * 60)) / 1000);
			Toast.fail(root.proxy.$t("startOfTheRace", [hours, minutes, seconds]));
			return;
		} else {
            tabActive.value = tab || tabActive.value;
			if (
				res.data.rank_list_info_items &&
				res.data.rank_list_info_items.length >= 3
			) {
				topList.value = res.data.rank_list_info_items.slice(0, 3);
				list.value = res.data.rank_list_info_items.slice(3);
			} else {
				topList.value = res.data.rank_list_info_items || [];
				list.value = [];
				while (topList.value.length < 3) {
					topList.value.push(getDefaultUser());
				}
			}
			myRank.value = res.data.my_rank || getDefaultUser();

			clearInterval(rankTimeOut.value);

            if (isCheck) {
                tabActive.value = res.data.current_pk_type;
            }

			if (res.data.status === 2) {
				currentIsEnd.value = false;
				currentEndTime.value = res.data.end_time;

				getCountdown(res.data.end_time);
				rankTimeOut.value = setInterval(() => {
					getCountdown(res.data.end_time);
				}, 1000);
			} else if (res.data.status === 1) {
				currentIsEnd.value = true;
				// 选中tab的i18nKey
				currentIsEndText.value = t(
					tabList.value.find((item) => item.key === tabActive.value).i18nKey +
						"Over"
				);
				timeInfo.value = {
					dayLeft: 0,
					dayRight: "D",
					hours: "00",
					minutes: "00",
					seconds: "00",
				};
			} else if (res.data.status === 0) {
                tabActive.value = "PRELIMINARY";
            }
		}

        setTimeout(() => {
            pageLoading.value = false;
        }, 100);
	}
};

const toDetails = (item) => {
    if (item.is_mystery === 1) {
        return
    }
	if (item.uid) {
		location.href = `wlyaame://trend/user?uid=${item.uid}`;
	}
};

onMounted(async () => {
	getGiftList();
	await getPrizeList();
	await getRankList();
});
</script>

<style scoped lang="less">
.rank {
	width: 7.5rem;
	min-height: 100vh;
	background-size: contain;
	background-repeat: no-repeat;
	position: relative;
	padding-top: 4.89rem;
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
		&.reward {
			top: 3.11rem;
		}
	}
	.event-gift {
		width: 6.92rem;
		height: 4.68rem;
		background-size: contain;
		background-repeat: no-repeat;
		padding-top: 1.29rem;
		margin-left: 0.29rem;
		.title-p {
            padding: 0 0.3rem;
			width: 6.92rem;
            height: 0.66rem;
			text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
			font-weight: 600;
			font-size: 0.24rem;
			color: #ffffff;
		}
		.gift-list {
			width: 6.2rem;
			height: 2.4rem;
			display: flex;
			justify-content: space-between;
			margin-top: 0.28rem;
			margin-left: 0.36rem;
			.gift-item {
				width: 1.4rem;
				height: 2.4rem;
				.gift-item-img {
					width: 1.4rem;
					height: 1.41rem;
					background-size: contain;
					background-repeat: no-repeat;
					background-image: url(https://yaame-static.yaame.io/admin/46d25621e3b8602eeead7f77f7701c93.png);
					display: flex;
					justify-content: center;
					align-items: center;

					img {
						width: 1rem;
						height: 1rem;
					}
				}
				.gift-item-name {
					margin-top: 0.1rem;
					width: 1.4rem;
					text-align: center;
					font-weight: 600;
					font-size: 0.24rem;
					color: #fffd99;
				}
				.gift-item-value {
					width: 1.4rem;
					text-align: center;
					font-weight: 600;
					font-size: 0.26rem;
					color: #fffd99;
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
	.tab-container {
		width: 7.5rem;
		height: 1.2rem;
		display: flex;
		margin-top: 0.15rem;
		overflow-y: hidden;

		div {
			width: 2.04rem;
			padding-top: 0.44rem;
			flex-basis: 2.04rem;
			flex-shrink: 0;

			font-size: 0.24rem;
			text-align: center;
			color: #b2a3e0;
			position: relative;
			&.active {
				color: #fffd89;
			}
			.tab-time {
				position: absolute;
				width: 2.04rem;
				text-align: center;
				font-size: 0.16rem;
				bottom: 0.12rem;
			}
		}
		.tab-0 {
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/d4e0a0bec21619b2c024727ba9fa23dd.png);
			background-position-y: bottom;

			&.active {
				background-image: url(https://yaame-static.yaame.io/admin/bad65103d84a4d29d093a7e568754d90.png);
			}
		}

		.tab-1 {
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/70d0eae5074c354d2f9594e96e5de2a0.png);
			background-position-y: bottom;
			margin-left: -1em;
			&.active {
				background-image: url(https://yaame-static.yaame.io/admin/977caf5debada5140e4f1f5dc953958a.png);
			}
		}

		.tab-2 {
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/70d0eae5074c354d2f9594e96e5de2a0.png);
			background-position-y: bottom;
			margin-left: -0.22rem;
			&.active {
				background-image: url(https://yaame-static.yaame.io/admin/977caf5debada5140e4f1f5dc953958a.png);
			}
		}

		.tab-3 {
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/e00bb4af5a6223c4b7d001816a2a7877.png);
			background-position-y: bottom;
			margin-left: -0.22rem;
			&.active {
				background-image: url(https://yaame-static.yaame.io/admin/9eca97588a5836432afaf03799bdcff3.png);
			}
		}
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
	.rank-container {
		width: 7.34rem;
		min-height: calc(9.61rem + 5rem);
		margin-left: 0.08rem;
		margin-top: 0.26rem;
		.top-rank {
			width: 7.34rem;
			height: 9.61rem;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/c9ea23c105e120e28710edc883062b77.png);
			position: relative;
			.top-item {
				&.top-0 {
					width: 5.95rem;
					height: 4.44rem;
					background-size: contain;
					background-repeat: no-repeat;
					background-image: url(https://yaame-static.yaame.io/admin/a856894dcf5c6389431000ea74111a7a.png);
					position: absolute;
					left: 0.68rem;
					top: 1.07rem;
					.top-avatar {
						width: 1.51rem;
						height: 1.51rem;
						position: absolute;
						left: 2.23rem;
						top: 0.48rem;
                        border-radius: 50%;
					}
					.top-avatar-dress {
						width: 3.21rem;
						height: 3.21rem;
						position: absolute;
						left: 1.37rem;
						top: -0.38rem;
						background-size: contain;
						background-repeat: no-repeat;
						background-image: url(https://yaame-static.yaame.io/admin/4c96c97cf4b40190a948e689514faa26.png);
						z-index: 1;
					}
					.top-user-rank {
						width: 1.9rem;
						text-align: center;
						position: absolute;
						left: 2.02rem;
						top: 2.42rem;
						font-size: 0.28rem;
						color: #fffd99;
					}
					.top-user-name {
						width: 1.9rem;
						text-align: center;
						position: absolute;
						left: 2.02rem;
						top: 2.77rem;
						font-size: 0.24rem;
						color: #fffd99;
					}
					.top-user-id {
						width: 1.9rem;
						text-align: center;
						position: absolute;
						left: 2.02rem;
						top: 3.11rem;
						font-size: 0.2rem;
						color: #fffd99;
					}
					.top-user-value {
						width: 1.9rem;
						text-align: center;
						position: absolute;
						left: 2.02rem;
						top: 3.42rem;
						font-size: 0.2rem;
						color: #fffd99;
						img {
							width: 0.22rem;
							height: auto;
							vertical-align: middle;
							position: relative;
							top: 0.02rem;
						}
					}
				}
				&.top-1 {
					width: 3.57rem;
					height: 3.86rem;
					background-size: contain;
					background-repeat: no-repeat;
					background-image: url(https://yaame-static.yaame.io/admin/3b68fd10d3b2881f509b0ebdd1012485.png);
					position: absolute;
					left: 0.12rem;
					top: 5.62rem;
					.top-avatar {
						width: 1.43rem;
						height: 1.43rem;
						position: absolute;
						left: 1.08rem;
						top: 0.22rem;
                        border-radius: 50%;
					}
					.top-avatar-dress {
						width: 2.9rem;
						height: 2.9rem;
						position: absolute;
						left: 0.33rem;
						top: -0.5rem;
						background-size: contain;
						background-repeat: no-repeat;
						background-image: url(https://yaame-static.yaame.io/admin/9d3aaa286cafbab33dffe433e56c2afd.png);
						z-index: 1;
					}
					.top-user-rank {
						width: 1.9rem;
						text-align: center;
						position: absolute;
						left: 0.83rem;
						top: 2.09rem;
						font-size: 0.28rem;
						color: #fffd99;
					}
					.top-user-name {
						width: 1.9rem;
						text-align: center;
						position: absolute;
						left: 0.83rem;
						top: 2.42rem;
						font-size: 0.24rem;
						color: #fffd99;
					}
					.top-user-id {
						width: 1.9rem;
						text-align: center;
						position: absolute;
						left: 0.83rem;
						top: 2.76rem;
						font-size: 0.2rem;
						color: #fffd99;
					}
					.top-user-value {
						width: 1.9rem;
						text-align: center;
						position: absolute;
						left: 0.83rem;
						top: 3.02rem;
						font-size: 0.2rem;
						color: #fffd99;
						img {
							width: 0.22rem;
							height: auto;
							vertical-align: middle;
							position: relative;
							top: 0.02rem;
						}
					}
				}
				&.top-2 {
					width: 3.57rem;
					height: 3.86rem;
					background-size: contain;
					background-repeat: no-repeat;
					background-image: url(https://yaame-static.yaame.io/admin/8bf30dfe3bedc86ce9910e57eec8f284.png);
					position: absolute;
					left: 3.65rem;
					top: 5.62rem;
					.top-avatar {
						width: 1.43rem;
						height: 1.43rem;
						position: absolute;
						left: 1.08rem;
						top: 0.22rem;
                        border-radius: 50%;
					}
					.top-avatar-dress {
						width: 2.9rem;
						height: 2.9rem;
						position: absolute;
						left: 0.33rem;
						top: -0.5rem;
						background-size: contain;
						background-repeat: no-repeat;
						background-image: url(https://yaame-static.yaame.io/admin/6c411f08240d23f0b3599f205675cd16.png);
						z-index: 1;
					}
					.top-user-rank {
						width: 1.9rem;
						text-align: center;
						position: absolute;
						left: 0.83rem;
						top: 2.09rem;
						font-size: 0.28rem;
						color: #fffd99;
					}
					.top-user-name {
						width: 1.9rem;
						text-align: center;
						position: absolute;
						left: 0.83rem;
						top: 2.42rem;
						font-size: 0.24rem;
						color: #fffd99;
					}
					.top-user-id {
						width: 1.9rem;
						text-align: center;
						position: absolute;
						left: 0.83rem;
						top: 2.76rem;
						font-size: 0.2rem;
						color: #fffd99;
					}
					.top-user-value {
						width: 1.9rem;
						text-align: center;
						position: absolute;
						left: 0.83rem;
						top: 3.02rem;
						font-size: 0.2rem;
						color: #fffd99;
						img {
							width: 0.22rem;
							height: auto;
							vertical-align: middle;
							position: relative;
							top: 0.02rem;
						}
					}
				}
			}
		}
		.rank-list {
			width: 7.34rem;
			min-height: 5rem;
			background-size: contain;
			background-repeat: repeat;
			background-image: url(https://yaame-static.yaame.io/admin/f1be8411cb087d48c885543c71c09c88.png);
			padding-top: 0.1rem;
			padding-bottom: 1.7rem;
            margin-top: -1px;
			.rank-item {
				width: 7.14rem;
				margin-left: 0.1rem;
				height: 1.5rem;
				background-size: contain;
				background-repeat: no-repeat;
				background-image: url(https://yaame-static.yaame.io/admin/087e97ad44a872e90c9231522846cafa.png);
				display: flex;
				align-items: center;
				font-size: 0.24rem;
				color: #ffe399;
				margin-bottom: 0.12rem;
				.user-rank {
					width: 0.8rem;
					text-align: center;
				}
				.user-avatar {
					width: 1.09rem;
					height: 1.09rem;
					background-size: contain;
					background-repeat: no-repeat;
					background-image: url(https://yaame-static.yaame.io/admin/3e383d0fef060f7702d9c983e8df533e.png);
					display: flex;
					justify-content: center;
					align-items: center;
					img {
						width: 1rem;
						height: 1rem;
						border-radius: 50%;
					}
				}
				.rank-user-info {
					width: 3.55rem;
					padding-left: 0.2rem;
				}
				.user-value {
					img {
						width: 0.26rem;
						height: auto;
						vertical-align: middle;
						position: relative;
						top: 0.02rem;
					}
				}
			}
		}
		.empty {
            margin-top: -1px;
			width: 7.34rem;
			min-height: 7rem;
			background-size: contain;
			background-repeat: repeat;
			background-image: url(https://yaame-static.yaame.io/admin/f1be8411cb087d48c885543c71c09c88.png);
			padding-top: 1rem;
			.empty-img {
				width: 1rem;
				height: 1.2rem;
				margin-left: 3.17rem;
			}
			.empty-p {
				width: 7.34rem;
				text-align: center;
				font-size: 0.24rem;
				color: #ffffff;
				margin-top: 0.1rem;
			}
		}
		.user-info {
			width: 7.48rem;
			height: 1.5rem;
			background-size: contain;
			background-repeat: repeat;
			background-image: url(https://yaame-static.yaame.io/admin/cc7bec9306b04c47495954e05b7dc3a8.png);
			position: fixed;
			bottom: 0;
			left: 0.01rem;
			display: flex;
			font-size: 0.24rem;
			color: #ffe399;
			align-items: center;
			z-index: 10;
			.user-rank {
				width: 1.15rem;
				text-align: center;
			}
			.user-avatar {
				width: 1.09rem;
				height: 1.09rem;
				background-size: contain;
				background-repeat: no-repeat;
				background-image: url(https://yaame-static.yaame.io/admin/3e383d0fef060f7702d9c983e8df533e.png);
				display: flex;
				justify-content: center;
				align-items: center;
				img {
					width: 1rem;
					height: 1rem;
					border-radius: 50%;
				}
			}
			.rank-user-info {
				width: 3.27rem;
				padding-left: 0.2rem;
			}
			.user-value {
				img {
					width: 0.26rem;
					height: auto;
					vertical-align: middle;
					position: relative;
					top: 0.02rem;
				}
			}
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
		margin-top: 0.3rem;
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
