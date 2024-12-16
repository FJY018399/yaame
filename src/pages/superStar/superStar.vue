<template>
	<div
		:style="{ backgroundImage: `url(${backgroundImgEnum[language]})` }"
		class="main"
	>
		<custom-header>{{ $t("title") }}</custom-header>

		<img
			class="rule-icon"
			src="https://yaame-static.yaame.io/admin/e535e473b0ff7c4f471bf240b2b1887d.png"
			alt=""
			@click="handleRuleClick"
		/>

		<div class="timeout-container">
			<div>{{ timeInfo.dayLeft }}</div>
			<div>{{ timeInfo.dayRight }}</div>
			<div>{{ timeInfo.hours }}</div>
			<div>{{ timeInfo.minutes }}</div>
			<div>{{ timeInfo.seconds }}</div>
		</div>

		<div :class="['tab-container', tabActive === 'send' && 'send']">
			<div
				v-for="(item, index) in tabList"
				:key="index"
				:class="['tab-item', tabActive === item.key && 'active']"
				@click="handleTabChange(item.key)"
			>
				{{ $t(item.label) }}
			</div>
		</div>

		<div v-show="tabActive === 'receive'" class="receive-container">
			<div v-if="todayInfo" class="today-container">
				<div class="today-info">
					<p style="margin-bottom: 0.1rem">
						{{ $t("todayRecharge", [todayInfo.diamond_score]) }}
					</p>
					<p v-if="diffNum" style="line-height: 0.9">
						{{
							$t("rechargeTime", [
								todayTimeInfo.hours,
								todayTimeInfo.minutes,
								todayTimeInfo.seconds,
								diffNum,
							])
						}}
					</p>
					<p v-else>{{ diffInfo }}</p>
				</div>

				<div class="today-gift">
					<div class="gift-info">{{ $t("today") }}</div>
					<div class="gift-list">
						<div
							v-for="(item, index) in hotGifts"
							:key="index"
							class="gift-item"
						>
							<div class="gift-item-img">
								<img :src="item.gift_icon" class="gift-img" alt="" />

								<div class="gift-value">
									{{ item.hot_value }}
									<img
										src="https://yaame-static.yaame.io/admin/16deb4170b00933917ff9ceec3997f64.png"
										alt=""
									/>
								</div>


								<span v-if="todayInfo.gift_rewards[index]" class="gift-num"
									>x{{ todayInfo.gift_rewards[index].gift_count }}</span
								>
							</div>

							<div class="gift-item-name">{{ item.gift_name }}</div>
						</div>
					</div>
				</div>

				<div class="progress-container">
					<div class="progress-bar">
						<div
							v-for="(item, index) in todayInfo.gift_rewards"
							:key="index"
							class="node-item"
						>
							<div
								v-if="todayInfo.diamond_score < item.recharge_diamonds"
								class="node"
							></div>
							<div v-else class="node result">
								<img
									src="https://yaame-static.yaame.io/admin/9e395a60cabe53116047ac39d55c76ca.png"
									alt=""
								/>
							</div>

							<div class="node-buy">
								<p style="margin-bottom: 0" class="node-buy-p">
									{{ $t("buy") }}
								</p>
                                <p class="node-buy-p">
									{{ item.recharge_diamonds }}
									<img :src="diamondIcon" alt="" />
								</p>
								<div
									v-if="todayInfo.diamond_score < item.recharge_diamonds"
									class="node-buy-btn recharge"
									@click="toRecharge"
								>
									{{ $t("recharge") }}
								</div>
								<div v-else>
									<div v-if="item.received" class="node-buy-btn disabled">
										{{ $t("received") }}
									</div>
									<div
										v-else
										class="node-buy-btn normal"
										@click="receiveGift(todayInfo.day, index)"
									>
										{{ $t("receive") }}
									</div>
								</div>
							</div>
						</div>

						<div
							:style="{
								width: getProgressWidth(
									todayInfo.diamond_score,
									todayInfo.gift_rewards
								),
							}"
							class="progress-div"
						></div>
					</div>
				</div>
			</div>

			<div
				v-for="(item, index) in hotDayList"
				:key="index"
				class="next-day-container"
			>
				<div class="today-gift">
					<div class="gift-info">{{ $t(`day${item.day}`) }}</div>
					<div class="gift-list">
						<div v-for="(it, i) in hotGifts" :key="i" class="gift-item">
							<div class="gift-item-img">
								<img :src="it.gift_icon" class="gift-img" alt="" />

								<div class="gift-value">
									{{ it.hot_value }}
									<img
										src="https://yaame-static.yaame.io/admin/16deb4170b00933917ff9ceec3997f64.png"
										alt=""
									/>
								</div>
								<span v-if="item.gift_rewards[i]" class="gift-num"
									>x{{ item.gift_rewards[i].gift_count }}</span
								>
							</div>

							<div class="gift-item-name">{{ item.gift_name }}</div>
						</div>
					</div>
				</div>

				<div class="progress-container">
					<div class="progress-bar">
						<div
							v-for="(ele, inx) in item.gift_rewards"
							:key="inx"
							class="node-item"
						>
							<div
								v-if="item.diamond_score < ele.recharge_diamonds"
								class="node"
							></div>
							<div v-else class="node result">
								<img
									src="https://yaame-static.yaame.io/admin/9e395a60cabe53116047ac39d55c76ca.png"
									alt=""
								/>
							</div>

							<div class="node-buy">
                                <p style="margin-bottom: 0" class="node-buy-p">
									{{ $t("buy") }}
								</p>
                                <p class="node-buy-p">
									{{ ele.recharge_diamonds }}
									<img :src="diamondIcon" alt="" />
								</p>
								<div
									v-if="item.diamond_score < ele.recharge_diamonds"
									class="node-buy-btn disabled"
								>
									{{ $t("recharge") }}
								</div>
								<div v-else>
									<div v-if="ele.received" class="node-buy-btn disabled">
										{{ $t("received") }}
									</div>
									<div
										v-else
										class="node-buy-btn normal"
										@click="receiveGift(item.day, inx)"
									>
										{{ $t("receive") }}
									</div>
								</div>
							</div>
						</div>

						<div
							:style="{
								width: getProgressWidth(item.diamond_score, item.gift_rewards),
							}"
							class="progress-div"
						></div>
					</div>
				</div>
			</div>
		</div>
		<div v-show="tabActive === 'send'" class="send-container">
			<div class="activity-gift">
				<p class="title">{{ $t("activityGift") }}</p>

				<div class="activity-list">
					<div
						v-for="(item, index) in hotGifts"
						:key="index"
						class="activity-list-item"
					>
						<div class="item-img">
							<img :src="item.gift_icon" alt="" />
						</div>
						<div class="item-name">{{ item.gift_name }}</div>
						<div class="item-name">
							{{ item.hot_value
							}}<img
								src="https://yaame-static.yaame.io/admin/16deb4170b00933917ff9ceec3997f64.png"
								alt=""
							/>
						</div>
					</div>
				</div>
				<div class="activity-info">{{ $t("activityDesc") }}</div>
			</div>

			<div class="search-container">
				<input
					v-model="yaame_id"
					class="search-input"
					:placeholder="$t('inputYaameId')"
					type="text"
					@input="handleInput($event)"
				/>
				<img
					v-show="yaame_id"
					class="delete-icon"
					src="https://yaame-static.yaame.io/admin/0dd281df3bd73c6072ca54d1f41f2d66.png"
					@click="handleDelete"
				/>
				<div class="search-btn" @click="searchUser">{{ $t("query") }}</div>
			</div>
			<div v-show="listShowStatus === 0">
				<div class="rank-list">
					<div
						v-for="(item, index) in rankList"
						:key="index"
						:class="[
							'list-item',
							'list-item-' + index,
							item.dummy_icon && 'has-dummy',
						]"
					>
						<div class="list-item-avatar" @click="toDetails(item)">
							<img
								v-if="index === 0"
								class="dress"
								src="https://yaame-static.yaame.io/admin/721a81c9d7533388ff0b2a40b90f5357.png"
								alt=""
							/>
							<img
								v-else-if="index === 1"
								class="dress"
								src="https://yaame-static.yaame.io/admin/32517084f8100af798fbbf6ec045fbf7.png"
								alt=""
							/>
							<img
								v-else-if="index === 2"
								class="dress"
								src="https://yaame-static.yaame.io/admin/c62fdedc9a165f1109d4214719b02f46.png"
								alt=""
							/>
							<img
								v-else
								class="dress"
								src="https://yaame-static.yaame.io/admin/6fe533504a0e1667e74dea37b0d2f98c.png"
								alt=""
							/>

							<img class="avatar" :src="item.avatar" alt="" />

							<p class="value">
								{{ item.score }}
								<img
									src="https://yaame-static.yaame.io/admin/16deb4170b00933917ff9ceec3997f64.png"
									alt=""
								/>
							</p>
						</div>
						<div v-if="item.dummy_icon" class="item-dummy">
							<img :src="item.dummy_icon" alt="" />
						</div>

						<p v-else class="item-empty no-wrap">
							{{ $t("noVirtual", [item.nick_name]) }}
						</p>
						<div class="item-btn" @click="handleSendClick(item)">
							{{ $t("sendHot") }}
						</div>

						<div v-if="index > 2" class="item-rank">
							{{ item.rank_num + 1 }}
						</div>
						<div class="item-name no-wrap">{{ item.nick_name }}</div>
					</div>
				</div>
			</div>

			<div v-show="listShowStatus === 1" class="no-user">
				<img
					src="https://yaame-static.yaame.io/admin/683296d92127ea1c70401acf2259cc4d.png"
					alt=""
				/>
				<p>{{ $t("noReceived") }}</p>
			</div>
			<div v-show="listShowStatus === 2" class="no-user">
				<img
					src="https://yaame-static.yaame.io/admin/7426c2fa8b1dda6db4d0aa769547ed97.png"
					alt=""
				/>
				<p>{{ $t("inputYaameIdError") }}</p>
			</div>

			<div v-show="listShowStatus === 3">
				<div class="rank-list">
					<div
						v-for="(item, index) in searchList"
						:key="index"
						:class="[
							'list-item',
							'list-item-' + item.rank_num,
							item.dummy_icon && 'has-dummy',
						]"
					>
						<div class="list-item-avatar" @click="toDetails(item)">
							<img
								v-if="item.rank_num === 0"
								class="dress"
								src="https://yaame-static.yaame.io/admin/721a81c9d7533388ff0b2a40b90f5357.png"
								alt=""
							/>
							<img
								v-else-if="item.rank_num === 1"
								class="dress"
								src="https://yaame-static.yaame.io/admin/32517084f8100af798fbbf6ec045fbf7.png"
								alt=""
							/>
							<img
								v-else-if="item.rank_num === 2"
								class="dress"
								src="https://yaame-static.yaame.io/admin/c62fdedc9a165f1109d4214719b02f46.png"
								alt=""
							/>
							<img
								v-else
								class="dress"
								src="https://yaame-static.yaame.io/admin/6fe533504a0e1667e74dea37b0d2f98c.png"
								alt=""
							/>

							<img class="avatar" :src="item.avatar" alt="" />

							<p class="value">
								{{ item.score }}
								<img
									src="https://yaame-static.yaame.io/admin/16deb4170b00933917ff9ceec3997f64.png"
									alt=""
								/>
							</p>
						</div>
						<div v-if="item.dummy_icon" class="item-dummy">
							<img :src="item.dummy_icon" alt="" />
						</div>

						<p v-else class="item-empty">
							{{ $t("noVirtual", [item.nick_name]) }}
						</p>
						<div class="item-btn" @click="handleSendClick(item)">
							{{ $t("sendHot") }}
						</div>

						<div v-if="item.rank_num > 2" class="item-rank">
							{{ item.rank_num + 1 }}
						</div>
						<div v-else-if="item.rank_num === 0" class="item-rank"></div>
						<div v-else-if="!item.rank_num" class="item-rank">99+</div>
						<div class="item-name no-wrap">{{ item.nick_name }}</div>
					</div>
				</div>
			</div>

			<div
				v-if="userInfoShow"
				v-show="listShowStatus < 2"
				:class="['user-info', toggle && 'toggle']"
				@click="toggle = !toggle"
			>
				<div class="user-content">
                    <div v-if="userRank.rank_num >= 99" class="user-rank">
						99+
					</div>
					<div v-else-if="userRank.rank_num > 4" class="user-rank">
						{{ userRank.rank_num + 1 }}
					</div>
					<div
						v-else-if="userRank.rank_num && userRank.rank_num < 5 && userRank.rank_num >= 0"
						class="user-rank"
					>
						{{ `No.${userRank.rank_num + 1}` }}
					</div>
					<div v-else class="user-rank">
						{{ userRank.rank_num === 0 ? "No.1" : "99+" }}
					</div>
					<div class="user-avatar" @click.stop="toDetails(userRank)">
						<img
							v-if="userRank.rank_num === 0"
							class="dress"
							src="https://yaame-static.yaame.io/admin/721a81c9d7533388ff0b2a40b90f5357.png"
							alt=""
						/>
						<img
							v-else-if="userRank.rank_num === 1"
							class="dress"
							src="https://yaame-static.yaame.io/admin/32517084f8100af798fbbf6ec045fbf7.png"
							alt=""
						/>
						<img
							v-else-if="userRank.rank_num === 2"
							class="dress"
							src="https://yaame-static.yaame.io/admin/c62fdedc9a165f1109d4214719b02f46.png"
							alt=""
						/>
						<img
							v-else
							class="dress"
							src="https://yaame-static.yaame.io/admin/6fe533504a0e1667e74dea37b0d2f98c.png"
							alt=""
						/>

						<img class="avatar" :src="userRank.avatar" alt="" />
					</div>
					<div class="user-name no-wrap">{{ userRank.nick_name }}</div>
					<div class="user-value">
						{{ userRank.score || 0 }}
						<img
							src="https://yaame-static.yaame.io/admin/16deb4170b00933917ff9ceec3997f64.png"
                            style="margin-bottom: 0.04rem"
							alt=""
						/>
					</div>
				</div>
				<img
					v-if="toggle"
					class="top-icon"
					src="https://yaame-static.yaame.io/admin/d7871efbce8281c5bb55a7f9d1d53ecc.png"
					alt=""
				/>
				<img
					v-else
					class="top-icon"
					src="https://yaame-static.yaame.io/admin/8167d288d6938cc84548a5dc53b0e102.png"
					alt=""
				/>

				<div v-show="toggle" class="user-gift">
					<div
						v-for="(item, index) in hotGifts"
						:key="index"
						class="user-gift-item"
					>
						<div class="user-gift-img">
							<img :src="item.gift_icon" alt="" />

							<div class="user-gift-num">x{{ gift_amounts[index] }}</div>
						</div>
						<div class="user-gift-name">{{ item.gift_name }}</div>
					</div>
				</div>
			</div>
		</div>

		<popup v-show="ruleVisible" class="flex-box">
			<div class="rule-container">
				<p class="header-p">{{ $t("rule") }}</p>
				<p class="rule-p">{{ $t("activityTime") }}</p>
				<p>{{ $t("activityTimeDetail") }}</p>
				<p class="rule-p">{{ $t("activityDescTitle") }}</p>
				<p>{{ $t("activityDesc1") }}</p>
				<p>{{ $t("activityDesc2") }}</p>
				<p>{{ $t("activityDesc3") }}</p>
				<p>{{ $t("activityDesc4") }}</p>
				<p>{{ $t("activityDesc5") }}</p>

				<img
					class="close-icon"
					src="https://yaame-static.yaame.io/admin/7114c89135966d510984b7fca399a474.png"
					alt=""
					@click="closeRule"
				/>
			</div>
		</popup>

		<popup v-show="sendVisible" class="flex-box">
			<div class="send-content">
				<p class="title">{{ $t("send") }}</p>

				<div class="user-details">
					<div class="user-details-avatar">
						<img :src="selectItem.avatar" alt="" />
					</div>
					<div class="user-details-name">{{ selectItem.nick_name }}</div>
				</div>

				<div class="send-div">
					<div class="my-hot">{{ $t("myHotNum") }}</div>
					<div class="gift-list">
						<div
							v-for="(item, index) in hotGifts"
							:key="index"
							:class="['gift-item', sendGiftActive === index && 'active']"
							@click="handleSendGiftClick(index)"
						>
							<div class="item-num">X{{ gift_amounts[index] }}</div>
							<img class="item-img" :src="item.gift_icon" alt="" />

							<div class="item-name">{{ item.gift_name }}</div>
							<div class="item-value">
								{{ item.hot_value }}
								<img
									src="https://yaame-static.yaame.io/admin/16deb4170b00933917ff9ceec3997f64.png"
									alt=""
								/>
							</div>
						</div>
					</div>
				</div>

				<div class="send-code">
					<div class="send-info">{{ $t("sendNum") }}</div>
					<input
						v-model="sendNum"
						class="send-input"
						type="number"
						:placeholder="$t('inputSendNum')"
						@input="handleNumberInput($event)"
					/>
				</div>

				<div class="btn-list">
					<div class="cancel" @click="closeSend">{{ $t("cancel") }}</div>
					<div class="confirm" @click="submit">{{ $t("send") }}</div>
				</div>
			</div>
		</popup>

		<pageLoading v-if="loading"></pageLoading>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, watch, getCurrentInstance } from "vue";
import customHeader from "@/components/common/header.vue";
import popup from "@/components/common/pop_up.vue";
import { getLanguage, isIOS } from "@/lib/device";
import pageLoading from "@/components/common/page_loading.vue";
import {
	getGiftInfoApi,
	getRechargeInfoApi,
	receiveGiftApi,
	getRankListApi,
	searchUserApi,
	sendGiftApi,
	getGiftUserBagApi,
} from "./api";
import { Toast } from "vant";
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
const root = getCurrentInstance();
const t = (val) => {
	return root.proxy.$i18n.t(val);
};

let toggle = ref(false);

let ruleVisible = ref(false);
let handleRuleClick = () => {
	ruleVisible.value = true;
};
let closeRule = () => {
	ruleVisible.value = false;
};

let selectItem = ref({});
let sendVisible = ref(false);
let handleSendClick = (item) => {
	sendVisible.value = true;
	selectItem.value = item;
};
let closeSend = () => {
	sendVisible.value = false;
	sendNum.value = "";
	sendGiftActive.value = 0;
};
let diamondIcon =
	"https://yaame-static.yaame.io/admin/1310b0ba44c62b3c92445b72341f7806.png";
let timeInfo = ref({
	dayLeft: 0,
	dayRight: "D",
	hours: "00",
	minutes: "00",
	seconds: "00",
});
const getCountdown = (target) => {
	// 获取当前时间的UTC时间戳（毫秒）
	const now = Date.now();

	// 获取目标时间的UTC时间戳（毫秒）
	const targetTime = target.getTime() - target.getTimezoneOffset() * 60000;

	// 计算剩余时间
	const timeDiff = targetTime - now;

	// 确保目标日期在未来
  const timeoutVisible = ref(true);
	if (timeDiff <= 0) {
		timeInfo.value = {
			dayLeft: "0",
			dayRight: "D",
			hours: "00",
			minutes: "00",
			seconds: "00",
		};
		timeoutVisible.value = false;
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

	timeInfo.value = {
		dayLeft,
		dayRight,
		hours,
		minutes,
		seconds,
	};
};

// 今日倒计时
let todayTimeInfo = ref({
	hours: "00",
	minutes: "00",
	seconds: "00",
});
// 计算到今日结束的函数 不需要参数 utc时区
const getTodayCountdown = () => {
	// 获取当前UTC时间
	let now = new Date();
	let end = new Date(
		Date.UTC(
			now.getUTCFullYear(),
			now.getUTCMonth(),
			now.getUTCDate(),
			23,
			59,
			59
		)
	);

	// 计算剩余时间
	let timeDiff = end.getTime() - now.getTime();

	// 将时间差转换为时、分、秒
	let hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	let minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
	let seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

	// 补零操作
	hours = hours < 10 ? "0" + hours : hours;
	minutes = minutes < 10 ? "0" + minutes : minutes;
	seconds = seconds < 10 ? "0" + seconds : seconds;

	//  倒计时为0的时候重新调用接口
	// console.log(timeDiff);
	if (timeDiff <= 0) {
		getRechargeInfo();
		getGiftInfo();
		getGiftUserBag();
		getRankList();
	}

	// 输出剩余时间
	todayTimeInfo.value = {
		hours,
		minutes,
		seconds,
	};
};

let backgroundImgEnum = ref({
	"zh-cn":
		"https://yaame-static.yaame.io/admin/b493d2fdc4e774d79378416a9bb56e61.png",
	"zh-tw":
		"https://yaame-static.yaame.io/admin/4fd05937f16e89b394a7193d7ed6abf3.png",
	en: "https://yaame-static.yaame.io/admin/330b421d65907e83d61628e02a04e758.png",
	ar: "https://yaame-static.yaame.io/admin/5917f8ece5a64a04228994abac2ca1bd.png",
	id: "https://yaame-static.yaame.io/admin/330b421d65907e83d61628e02a04e758.png",
});

let tabList = ref([
	{
		key: "receive",
		label: "Receive",
	},
	{
		key: "send",
		label: "Send",
	},
]);
let tabActive = ref("receive");
let handleTabChange = (key) => {
	tabActive.value = key;
	if (key === "send") {

        yaame_id.value = "";
		getGiftUserBag();
		getRankList();
	} else {
		getRechargeInfo();
	}
};

let hotGifts = ref([]);
let getGiftInfo = async () => {
	try {
		let res = await getGiftInfoApi();
		if (res.status === 1000) {
			hotGifts.value = res.data.hot_gifts;
		}
	} catch (error) {
		throw new Error(JSON.stringify(error));
	}
};

let hotDay = ref(0);
let hotDayList = ref([]);
let todayInfo = ref({
	gift_rewards: [],
});

let loading = ref(true);
let getRechargeInfo = async () => {
	try {
		let res = await getRechargeInfoApi();
		if (res.status === 1000) {
			// 如果res.data.day为0-6的区间，返回true，否则返回false
			if (res.data.day >= 0 && res.data.day <= 6) {
				hotDay.value =
					[0, 1, 2, 3, 4, 5, 6].find((item) => item === res.data.day) || 0;

				hotDayList.value = res.data.hot_days.filter(
					(item) => item.day !== hotDay.value
				);
				todayInfo.value = res.data.hot_days.find(
					(item) => item.day === hotDay.value
				);
			} else {
				res.data.day = 0;
				hotDay.value = 0;
				hotDayList.value = res.data.hot_days;
				todayInfo.value = false;
			}
			loading.value = false;
		}
	} catch (error) {
		throw new Error(JSON.stringify(error));
	}
};

let getProgressWidth = (num, list) => {
	if (list && list.length === 0) return "0%";
	let firstly = list[0].recharge_diamonds;
	let secondly = list[1].recharge_diamonds;
	let thirdly = list[2].recharge_diamonds;
	if (num >= thirdly) {
		return "100%";
	} else if (num >= secondly) {
		let width = 54;
		return width + ((num - secondly) / (thirdly - secondly)) * 30 + "%";
	} else if (num >= firstly) {
		let width = 24;
		return width + ((num - firstly) / (secondly - firstly)) * 30 + "%";
	} else {
		return (num / firstly) * 100 * 0.24 + "%";
	}
};

const receiveGift = async (day, gift_activity_id) => {
	try {
		let res = await receiveGiftApi({
			day,
			gift_activity_id,
		});
		if (res.status === 1000) {
			getRechargeInfo();
			// Toast("领取成功，已放入背包");
			Toast.success(t("receiveSuccess"));

			getGiftUserBag();
		} else {
			Toast(res.desc);
		}
	} catch (error) {
		console.log(error);
	}
};
const toRecharge = () => {
	window.location.href = "wlyaame://mine/shop/diamond?popup=1";
};

let rankList = ref([]);
let userRank = ref({});

let listShowStatus = ref(0);
const getRankList = async () => {
	try {
		let res = await getRankListApi();
		if (res.status === 1000) {
			rankList.value = res.data.rank;
			userRank.value = res.data.user_rank;
			if (rankList.value.length === 0) {
				listShowStatus.value = 1;
			} else {
				listShowStatus.value = 0;
			}
		}
	} catch (error) {
		throw new Error(JSON.stringify(error));
	}
};

let gift_amounts = ref([]);
const getGiftUserBag = async () => {
	try {
		let res = await getGiftUserBagApi();
		if (res.status === 1000) {
			gift_amounts.value = res.data.gift_amounts;
		}
	} catch (error) {
		throw new Error(JSON.stringify(error));
	}
};

let yaame_id = ref("");
let searchList = ref([]);
const searchUser = async () => {
    if (!yaame_id.value) {
        return;
    }

	try {
		let res = await searchUserApi({ yaame_id: yaame_id.value });
		if (res.status === 1000) {
			searchList.value = [res.data];
			listShowStatus.value = 3;
		} else {
			listShowStatus.value = 2;
		}
	} catch (error) {
		throw new Error(JSON.stringify(error));
	}
};

let sendGiftActive = ref(0);
const handleSendGiftClick = (index) => {
	sendGiftActive.value = index;
};

let sendNum = ref("");

let submitToggle = ref(false);
let submit = async () => {
	if (sendNum.value === "") {
		Toast(t("inputSendNum"));
		return;
	}
    if (submitToggle.value) return;
    submitToggle.value = true;
	let res = await sendGiftApi({
		yaame_id: selectItem.value.peanut_id,
		gift_activity_id: sendGiftActive.value,
		gift_amount: sendNum.value,
	});

	if (res.status === 1000) {
		Toast.success(t("sendSuccess"));
		sendVisible.value = false;
		sendNum.value = "";
		sendGiftActive.value = 0;

		setTimeout(() => {
			getGiftUserBag();
			getRankList();
			getRechargeInfo();
		}, 2000);
	} else {
		Toast(res.desc);
	}
    submitToggle.value = false;
};

const handleInput = (event) => {
	let value = event.target.value;
	let newValue = "";
	for (let i = 0; i < value.length; i++) {
		let char = value.charAt(i);
		if (
			(char >= "a" && char <= "z") ||
			(char >= "A" && char <= "Z") ||
			(char >= "0" && char <= "9")
		) {
			newValue += char;
		}
	}
	yaame_id.value = newValue;
};
// 正则只能输入正整数
const handleNumberInput = (event) => {
	let value = event.target.value;
	// 清除非数字字符
	value = value.replace(/\D/g, "");
	// 移除前导零
	value = value.replace(/^0+/, "");
	// 更新输入框的值
	event.target.value = value;
	sendNum.value = value;
};

const handleDelete = () => {
	yaame_id.value = "";
	if (rankList.value.length === 0) {
		listShowStatus.value = 1;
	} else {
		listShowStatus.value = 0;
	}
};

const toDetails = (item) => {
	window.location.href = item.scheme_user_url;
};

let userInfoShow = ref(true);

watch(yaame_id, (newVal) => {
	if (newVal === "") {
		if (rankList.value.length === 0) {
			listShowStatus.value = 1;
		} else {
			listShowStatus.value = 0;
		}
	}
});

// 计算当前充值额度和todayInfo中下一个阶段所需额度的差
const diffNum = computed(() => {
	let nowNum = todayInfo.value.diamond_score;
	for (let index = 0; index < todayInfo.value.gift_rewards.length; index++) {
		const element = todayInfo.value.gift_rewards[index];
		if (element.recharge_diamonds > nowNum) {
			return element.recharge_diamonds - nowNum;
		}
	}

	return 0;
});

const diffInfo = computed(() => {
	let flag = true;

	// 判断每一项的received是否都为true 如果有一个为false 则flag为false
	for (let index = 0; index < todayInfo.value.gift_rewards.length; index++) {
		const element = todayInfo.value.gift_rewards[index];
		if (!element.received) {
			flag = false;
			break;
		}
	}

	if (flag) {
		return t("todayReceived");
	} else {
		return t("receiveAll");
	}
});
onMounted(() => {
	let target = new Date("2024/03/18 00:00:00");
	getCountdown(target);
	getTodayCountdown();
	setInterval(() => {
		getCountdown(target);
		getTodayCountdown();
	}, 1000);

	getGiftInfo();
	getRechargeInfo();

	getGiftUserBag();
	getRankList();

    setInterval(() => {
        getRechargeInfo();
    }, 1000 * 60 * 5);

	window.onPaySuccess = function () {
		setTimeout(() => {
            getRechargeInfo();
            getGiftUserBag();
        }, 2000);
	};

	document.addEventListener(
		"focus",
		function (e) {
			if (e.target.tagName === "INPUT") {
				userInfoShow.value = false;
			}
		},
		true
	);
	document.addEventListener(
		"blur",
		function (e) {
			if (e.target.tagName === "INPUT") {
				userInfoShow.value = true;
			}
		},
		true
	);
});
</script>
<style lang="less" scoped>
.main {
	background-color: #161104;
	font-size: 0.24rem;
	color: #fff;
	width: 7.5rem;
	min-height: 100vh;
	background-size: contain;
	background-repeat: no-repeat;
	position: relative;
	padding-top: 8.06rem;
	.timeout-container {
		position: absolute;
		left: 1.72rem;
		top: 6.22rem;
		width: 4.06rem;
		height: 0.6rem;
		font-size: 0.3rem;
		background-size: contain;
		background-repeat: no-repeat;
		background-image: url(https://yaame-static.yaame.io/admin/3033dfee7c48c5eef6c347d506d49a13.png);
		div {
			position: absolute;
			width: 0.56rem;
			height: 0.56rem;
			top: 0.02rem;
			text-align: center;
			line-height: 0.56rem;
			&:nth-child(1) {
				left: 0;
			}
			&:nth-child(2) {
				left: 0.72rem;
			}
			&:nth-child(3) {
				left: 1.78rem;
			}
			&:nth-child(4) {
				left: 2.62rem;
			}
			&:nth-child(5) {
				left: 3.48rem;
			}
		}
	}
	.tab-container {
		width: 6.98rem;
		height: 0.83rem;
		margin-left: 0.26rem;
		background-size: contain;
		background-repeat: no-repeat;
		background-image: url(https://yaame-static.yaame.io/admin/3ed2b69dcec32a65324c1f74fb6457f3.png);
		display: flex;
		justify-content: space-between;
		padding: 0.02rem 0.5rem;
		margin-bottom: 0.36rem;
		&.send {
			background-image: url(https://yaame-static.yaame.io/admin/cefeed0265b23bb406c71d16cfc5cff2.png);
			font-size: 0.32rem;
		}
		.tab-item {
			&.active {
				color: #5e0031;
			}
			width: 3rem;
			height: 0.78rem;
			text-align: center;
			line-height: 0.78rem;
			font-size: 0.32rem;
			color: #f0aa52;
            font-weight: bold;
		}
	}

	.receive-container {
		.today-container {
			width: 7.15rem;
			height: 5.88rem;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/0ac46599be0691958c94080fc6b41e46.png);
			margin-left: 0.18rem;
			padding: 0.48rem 0.44rem;
			.today-info {
				font-size: 0.22rem;
				color: #fff9e4;
				margin-bottom: 0.46rem;
				p {
					img {
						width: 0.23rem;
						height: 0.19rem;
						vertical-align: middle;
					}
				}
			}
			.today-gift {
				display: flex;
				width: 6.2rem;
				height: 2.15rem;
				justify-content: space-between;
				align-items: center;
				.gift-info {
					width: 0.85rem;
					font-size: 0.24rem;
					color: #ffe89a;
				}
				.gift-list {
					width: 5.35rem;
					height: 2.15rem;
					display: flex;
					justify-content: space-between;
					.gift-item {
						width: 1.61rem;
						height: 2.15rem;

						.gift-item-img {
							width: 1.61rem;
							height: 1.6rem;
							background-size: contain;
							background-repeat: no-repeat;
							background-image: url(https://yaame-static.yaame.io/admin/dfa49fe39dae6ef6f249143de9cfb4ce.png);
							position: relative;
							.gift-img {
								width: 1.1rem;
								height: 1.1rem;
								position: absolute;
								left: 0.25rem;
								top: 0.12rem;
							}
							.gift-num {
								position: absolute;
								right: 0.16rem;
								top: 0.07rem;
								min-width: 0.53rem;
								height: 0.22rem;
								padding: 0 0.08rem;
								text-align: center;
								line-height: 0.22rem;

								background: #800c30;
								border-radius: 0.11rem;

								font-size: 0.18rem;
								color: #ffe89a;
							}
							.gift-value {
								width: 1.61rem;
								height: 0.2rem;
								bottom: 0.2rem;
								left: 0;
								position: absolute;
								text-align: center;
								font-size: 0.2rem;
								color: #ffe89a;
								img {
									width: 0.18rem;
									height: 0.2rem;
									vertical-align: middle;
								}
							}
						}
						.gift-item-name {
							width: 1.61rem;
							text-align: center;
							margin-top: 0.13rem;
							font-size: 0.2rem;
							color: #ffe89a;
						}
					}
				}
			}
			.progress-container {
				width: 6.2rem;
				height: 1.06rem;
				padding-top: 0.11rem;
				.progress-bar {
					width: 6.2rem;
					height: 0.12rem;
					background: #672e26;
					border-radius: 0.06rem;
					position: relative;
					.node-item {
						width: 0.34rem;
						height: 0.34rem;
						border-radius: 50%;
						background: #672e26;
						position: absolute;
						top: -0.11rem;
						z-index: 1;
						.node {
							width: 0.16rem;
							height: 0.16rem;
							border-radius: 50%;
							background: #bb402f;
							position: absolute;
							top: 0.09rem;
							left: 0.09rem;
							&.result {
								width: 0.24rem;
								height: 0.24rem;
								background: linear-gradient(180deg, #ffc147 0%, #ff8e22 100%);
								position: absolute;
								top: 0.05rem;
								left: 0.05rem;
								img {
									width: 0.15rem;
									height: 0.12rem;
									position: absolute;
									top: 0.06rem;
									left: 0.04rem;
								}
							}
						}
						&:nth-child(1) {
							left: 1.49rem;
						}
						&:nth-child(2) {
							left: 3.35rem;
						}
						&:nth-child(3) {
							left: 5.21rem;
						}
						.node-buy {
							width: 1.5rem;
							height: 1.3rem;
							position: absolute;
							top: 0.34rem;
							left: 50%;
							transform: translateX(-50%);
							// background-color: rgba(255, 255, 255, 0.3);
							padding-top: 0.16rem;
							.node-buy-p {
								width: 1.5rem;
								text-align: center;
								font-size: 0.2rem;
								color: #ffe89a;
								margin-bottom: 0.12rem;
								white-space: nowrap;
								img {
									width: 0.17rem;
									height: 0.14rem;
									vertical-align: middle;
								}
							}
							.node-buy-btn {
								width: 1.5rem;
								height: 0.62rem;
								background-size: contain;
								background-repeat: no-repeat;
								text-align: center;
								line-height: 0.62rem;
								font-size: 0.24rem;

								&.recharge {
									background-image: url(https://yaame-static.yaame.io/admin/42defcf53ef7b6771f6bd076967a73a1.png);
									color: #ffc46b;
								}
								&.disabled {
									background-image: url(https://yaame-static.yaame.io/admin/57682cdf0c677ec0bac1f5646ebeda4f.png);
									color: #414141;
								}
								&.normal {
									background-image: url(https://yaame-static.yaame.io/admin/104fa970750c6b1f62425e6b38b7e834.png);
									color: #672e26;
								}
							}
						}
					}
					.progress-div {
						position: relative;
						top: 0.03rem;
						left: 0.03rem;
						height: 0.06rem;
						background: linear-gradient(180deg, #ffc248 0%, #ff8e22 100%);
						border-radius: 0.05rem;
					}
				}
			}
		}
		.next-day-container {
			width: 7.15rem;
			height: 4.96rem;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/1152f1af4f21e8939ca87b4ee13c9491.png);
			margin-top: 0.2rem;
			margin-left: 0.18rem;
			padding: 0.68rem 0.44rem;
			.today-gift {
				display: flex;
				width: 6.2rem;
				height: 2.15rem;
				justify-content: space-between;
				align-items: center;
				.gift-info {
					width: 0.85rem;
					font-size: 0.24rem;
					color: #ffe89a;
				}
				.gift-list {
					width: 5.35rem;
					height: 2.15rem;
					display: flex;
					justify-content: space-between;
					.gift-item {
						width: 1.61rem;
						height: 2.15rem;

						.gift-item-img {
							width: 1.61rem;
							height: 1.6rem;
							background-size: contain;
							background-repeat: no-repeat;
							background-image: url(https://yaame-static.yaame.io/admin/dfa49fe39dae6ef6f249143de9cfb4ce.png);
							position: relative;
							.gift-img {
								width: 1.1rem;
								height: 1.1rem;
								position: absolute;
								left: 0.25rem;
								top: 0.12rem;
							}
							.gift-num {
								position: absolute;
								right: 0.16rem;
								top: 0.07rem;
								min-width: 0.53rem;
								height: 0.22rem;
								padding: 0 0.08rem;
								text-align: center;
								line-height: 0.22rem;

								background: #800c30;
								border-radius: 0.11rem;

								font-size: 0.18rem;
								color: #ffe89a;
							}
							.gift-value {
								width: 1.61rem;
								height: 0.2rem;
								bottom: 0.2rem;
								left: 0;
								position: absolute;
								text-align: center;
								font-size: 0.2rem;
								color: #ffe89a;
								img {
									width: 0.18rem;
									height: 0.2rem;
									vertical-align: middle;
								}
							}
						}
						.gift-item-name {
							width: 1.61rem;
							text-align: center;
							margin-top: 0.13rem;
							font-size: 0.2rem;
							color: #ffe89a;
						}
					}
				}
			}
			.progress-container {
				width: 6.2rem;
				height: 1.06rem;
				padding-top: 0.11rem;
				.progress-bar {
					width: 6.2rem;
					height: 0.12rem;
					background: #672e26;
					border-radius: 0.06rem;
					position: relative;
					.node-item {
						width: 0.34rem;
						height: 0.34rem;
						border-radius: 50%;
						background: #672e26;
						position: absolute;
						top: -0.11rem;
						z-index: 1;
						.node {
							width: 0.16rem;
							height: 0.16rem;
							border-radius: 50%;
							background: #bb402f;
							position: absolute;
							top: 0.09rem;
							left: 0.09rem;
							&.result {
								width: 0.24rem;
								height: 0.24rem;
								background: linear-gradient(180deg, #ffc147 0%, #ff8e22 100%);
								position: absolute;
								top: 0.05rem;
								left: 0.05rem;
								img {
									width: 0.15rem;
									height: 0.12rem;
									position: absolute;
									top: 0.06rem;
									left: 0.04rem;
								}
							}
						}
						&:nth-child(1) {
							left: 1.49rem;
						}
						&:nth-child(2) {
							left: 3.35rem;
						}
						&:nth-child(3) {
							left: 5.21rem;
						}
						.node-buy {
							width: 1.5rem;
							height: 1.3rem;
							position: absolute;
							top: 0.34rem;
							left: 50%;
							transform: translateX(-50%);
							// background-color: rgba(255, 255, 255, 0.3);
							padding-top: 0.16rem;
							.node-buy-p {
								width: 1.5rem;
								text-align: center;
								font-size: 0.2rem;
								color: #ffe89a;
								margin-bottom: 0.12rem;
								white-space: nowrap;
								img {
									width: 0.17rem;
									height: 0.14rem;
									vertical-align: middle;
								}
							}
							.node-buy-btn {
								width: 1.5rem;
								height: 0.62rem;
								background-size: contain;
								background-repeat: no-repeat;
								text-align: center;
								line-height: 0.62rem;
								font-size: 0.24rem;

								&.recharge {
									background-image: url(https://yaame-static.yaame.io/admin/42defcf53ef7b6771f6bd076967a73a1.png);
									color: #ffc46b;
								}
								&.disabled {
									background-image: url(https://yaame-static.yaame.io/admin/57682cdf0c677ec0bac1f5646ebeda4f.png);
									color: #414141;
								}
								&.normal {
									background-image: url(https://yaame-static.yaame.io/admin/104fa970750c6b1f62425e6b38b7e834.png);
									color: #672e26;
								}
							}
						}
					}
					.progress-div {
						position: relative;
						top: 0.03rem;
						left: 0.03rem;
						height: 0.06rem;
						background: linear-gradient(180deg, #ffc248 0%, #ff8e22 100%);
						border-radius: 0.05rem;
					}
				}
			}
		}
	}
	.rule-icon {
		width: 0.6rem;
		height: 0.6rem;
		position: absolute;
		top: 2.04rem;
		right: 0.44rem;
		z-index: 98;
	}
	.flex-box {
		display: flex;
		justify-content: center;
		align-items: center;
		.rule-container {
			width: 6.97rem;
			height: 10rem;
			background-image: url(https://yaame-static.yaame.io/admin/d890f76bfcfaa2e5e52510e37da80e39.png);
			background-repeat: no-repeat;
			background-size: contain;
			position: relative;
			padding: 0.6rem 0.38rem 0;
			font-size: 0.28rem;
			color: #fff9e4;
			.header-p {
				text-align: center;
				font-size: 0.32rem;
				color: #fff9e4;
			}
			.rule-p {
				margin-top: 0.3rem;
				font-size: 0.28rem;
				color: #fff9e4;
			}
			.close-icon {
				position: absolute;
				width: 0.6rem;
				height: 0.6rem;
				left: 50%;
				transform: translateX(-50%);
				bottom: -1.14rem;
			}
		}
		.send-content {
			width: 7rem;
			height: 7.2rem;
			background: linear-gradient(180deg, #6f3e02 0%, #3c1d01 100%);
			border-radius: 0.2rem;
			border: 0.02rem solid #ffcb55;
			padding-top: 0.36rem;
			.title {
				width: 7rem;
				font-size: 0.28rem;
				color: #ffe89a;
				text-align: center;
			}
			.user-details {
				margin-top: 0.2rem;
				display: flex;
				width: 7rem;
				height: 0.7rem;
				padding-left: 0.3rem;
				.user-details-avatar {
					width: 0.7rem;
					height: 0.7rem;
					display: flex;
					justify-content: center;
					align-items: center;
					border-radius: 50%;
					background: #ffffff;
					border: 0.02rem solid #ffcb55;
					img {
						display: block;
						width: 0.66rem;
						height: 0.66rem;
						border-radius: 50%;
					}
				}
				.user-details-name {
					width: 5.7rem;
					height: 0.7rem;
					padding-left: 0.2rem;
					font-size: 0.22rem;
					color: #fff9e4;
					line-height: 0.7rem;
					text-align: left;
				}
			}
			.send-div {
				margin-top: 0.2rem;
				width: 7rem;
				height: 2.28rem;
				padding-left: 0.3rem;
				padding-right: 0.3rem;
				display: flex;
				align-items: center;
				.my-hot {
					width: 1.26rem;
					font-size: 0.22rem;
					color: #fff9e4;
					text-align: left;
				}

				.gift-list {
					width: 5.14rem;
					height: 2.28rem;
					display: flex;
					justify-content: space-between;
					.gift-item {
						width: 1.6rem;
						height: 2.2rem;
						background: #3c1901;
						border-radius: 0.1rem;
						border: 0.04rem solid #3c1901;
						position: relative;
						&.active {
							border: 0.04rem solid #ffcb55;
						}
						.item-num {
							position: absolute;
							right: 0.04rem;
							top: 0.07rem;
							min-width: 0.53rem;
							height: 0.22rem;
							padding: 0 0.08rem;
							text-align: center;
							line-height: 0.22rem;
							background: #800c30;
							border-radius: 0.11rem;
							font-size: 0.18rem;
							color: #ffe89a;
						}
						.item-img {
							position: absolute;
							width: 1rem;
							height: 1rem;
							left: 0.3rem;
							top: 0.24rem;
						}
						.item-name {
							width: 1.6rem;
							text-align: center;
							font-size: 0.2rem;
							color: #ffe89a;
							position: absolute;
							top: 1.4rem;
						}
						.item-value {
							width: 1.6rem;
							text-align: center;
							font-size: 0.24rem;
							color: #ffe89a;
							position: absolute;
							top: 1.72rem;
							img {
								width: 0.2rem;
								height: auto;
								vertical-align: middle;
							}
						}
					}
				}
			}
			.send-code {
				margin-top: 0.3rem;
				width: 7rem;
				height: 1rem;
				padding-left: 0.3rem;
				display: flex;
				align-items: center;
				.send-info {
                    width: 1.6rem;
					font-size: 0.22rem;
					color: #fff9e4;
				}
				.send-input {
					width: 4.78rem;
					height: 1rem;
					background: #3c1901;
					border-radius: 0.2rem;
					border: none;
					text-align: center;
					font-size: 0.28rem;
					color: #fff9e4;
					&::placeholder {
						color: #8a735c;
					}
				}
			}
			.btn-list {
				width: 7rem;
				height: 0.8rem;
				margin-top: 0.5rem;
				display: flex;
				justify-content: space-between;
				padding: 0 0.3rem;
				.cancel {
					background-size: contain;
					width: 3rem;
					background-repeat: no-repeat;
					background-image: url(https://yaame-static.yaame.io/admin/fec08f456dbb5b25eaf0100831de3eb3.png);
					text-align: center;
					line-height: 0.8rem;
					font-size: 0.32rem;
					color: #fff9e4;
				}
				.confirm {
					width: 3rem;
					background-size: contain;
					background-repeat: no-repeat;
					background-image: url(https://yaame-static.yaame.io/admin/174990223d49f13d76d850b4222fea9e.png);
					text-align: center;
					line-height: 0.8rem;
					font-size: 0.32rem;
					color: #5e0031;
				}
			}
		}
	}

	.send-container {
		.activity-gift {
			width: 7.15rem;
			height: 5.88rem;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/0ac46599be0691958c94080fc6b41e46.png);
			margin-left: 0.18rem;
			padding: 0.48rem 0.54rem;
			.title {
				width: 6.07rem;
				text-align: center;
				font-size: 0.28rem;
				color: #ffe89a;
			}
			.activity-list {
				width: 6.07rem;
				height: 2.78rem;
				padding-top: 0.36rem;
				display: flex;
				justify-content: space-between;
				.activity-list-item {
					width: 1.74rem;
					.item-img {
						width: 1.74rem;
						height: 1.6rem;
						display: flex;
						justify-content: center;
						align-items: center;
						background-size: contain;
						background-repeat: no-repeat;
						background-image: url(https://yaame-static.yaame.io/admin/ef65e2e876a618fa56f3a3120202c228.png);
						img {
							height: 0.88rem;
							width: auto;
						}
					}
					.item-name {
						width: 1.74rem;
						font-size: 0.24rem;
						color: #ffe89a;
						text-align: center;
						margin-top: 0.06rem;
						img {
							width: 0.24rem;
							height: 0.28rem;
							vertical-align: middle;
						}
					}
				}
			}
			.activity-info {
				font-size: 0.24rem;
				color: #fff9e4;
				margin-top: 0.2rem;
			}
		}
		.search-container {
			width: 7.15rem;
			height: 1rem;
			display: flex;
			justify-content: space-between;
			margin-top: 0.3rem;
			margin-left: 0.18rem;
			position: relative;
			.search-input {
				width: 5.1rem;
				height: 1rem;
				padding-right: 0.7rem;
				padding-left: 0.2rem;
				background: #3c1d01;
				border-radius: 0.2rem;
				border: 0.02rem solid #ffcb55;
				text-align: center;
				color: #fff9e4;
				font-size: 0.28rem;
			}
			input[type="text"]::placeholder {
				color: #8a755c;
			}
			.delete-icon {
				position: absolute;
				width: 0.24rem;
				height: 0.24rem;
				left: 4.52rem;
				top: 0.38rem;
			}
			.search-btn {
				width: 1.84rem;
				height: 1rem;
				background-size: contain;
				background-repeat: no-repeat;
				background-image: url("https://yaame-static.yaame.io/admin/9c16ef673163ac23d1fb0cade2ea3c5b.png");
				text-align: center;
				line-height: 1rem;
				font-size: 0.32rem;
				color: #5e0031;
                font-weight: bold;
			}
		}
		.no-user {
			width: 7.5rem;
			height: 8.95rem;
			padding-top: 1.56rem;
			img {
				width: 3rem;
				height: 3rem;
				display: block;
				margin-left: 2.24rem;
			}
			p {
				margin-top: 0.2rem;
				text-align: center;
				font-size: 0.28rem;
				color: #fff9e4;
			}
		}
		.rank-list {
			width: 7.5rem;
			height: auto;
			display: flex;
			padding-left: 0.2rem;
			margin-top: 0.3rem;
			flex-wrap: wrap;
			padding-bottom: 1.9rem;
			.list-item {
				width: 3.43rem;
				height: 4.5rem;
				background-size: contain;
				background-repeat: no-repeat;
				background-image: url("https://yaame-static.yaame.io/admin/37500ac0074dc6cb9fe71ae803a8d301.png");
				margin-right: 0.28rem;
				margin-bottom: 0.28rem;
				position: relative;
				overflow: hidden;
				&:nth-of-type(2n) {
					margin-right: 0;
				}

				.list-item-avatar {
					width: 2.3rem;
					height: 2.3866rem;
					position: absolute;
					top: 0.7rem;
					left: 0.54rem;

					.dress {
						width: 2.3rem;
						height: 2.3866rem;
						position: absolute;
						left: 0;
						top: 0;
						z-index: 1;
					}
					.avatar {
						width: 1.28rem;
						height: 1.28rem;
						display: block;
						border-radius: 50%;
						position: absolute;
						left: 0.51rem;
						top: 0.55rem;
					}

					.value {
						width: 2.3rem;
						position: absolute;
						left: 0;
						bottom: 0.12rem;
						font-size: 0.24rem;
						color: #fff9e4;
						text-align: center;
						z-index: 2;
						img {
							width: 0.2rem;
							height: 0.2rem;
							vertical-align: middle;
						}
					}
				}

				.item-dummy {
					width: 1.88rem;
					height: 4rem;
					position: absolute;
					left: 0;
					top: 0.1rem;
					display: flex;
					justify-content: center;
					align-items: end;
					img {
						max-width: 1.88rem;
						max-height: 4rem;
						z-index: 1; /* 确保图片位于上层 */
						-webkit-mask-image: linear-gradient(
							to bottom,
							rgba(0, 0, 0, 1) 50%,
							rgba(0, 0, 0, 0) 100%
						); /* 使用渐变作为遮罩 */
						mask-image: linear-gradient(
							to bottom,
							rgba(0, 0, 0, 1) 50%,
							rgba(0, 0, 0, 0) 100%
						); /* 使用渐变作为遮罩 */
					}
				}

				.item-empty {
					position: absolute;
					left: 0;
					top: 3.12rem;
					width: 3.43rem;
					font-size: 0.16rem;
					color: #fff9e4;
					text-align: center;
				}

				.item-btn {
					width: 2.4rem;
					height: 0.68rem;
					background-size: contain;
					background-repeat: no-repeat;
					background-image: url(https://yaame-static.yaame.io/admin/0bbc50152f22a42dbb7f320f7627e869.png);
					text-align: center;
					line-height: 0.68rem;
					font-size: 0.24rem;
					position: absolute;
					left: 0.51rem;
					top: 3.48rem;
					color: #5e0031;
					z-index: 3;
                    font-weight: bold;
				}

				.item-rank {
					width: 1rem;
					font-size: 0.24rem;
					text-align: center;
					color: #5e0031;
					position: absolute;
					left: 0.22rem;
					top: 0.16rem;
                    font-weight: bold;
				}
				.item-name {
					width: 1.64rem;
					font-size: 0.24rem;
					color: #fff9e4;
					position: absolute;
					left: 1.48rem;
					top: 0.14rem;
				}

				&.has-dummy {
					.list-item-avatar {
						left: 1.13rem;
					}
					background-image: url(https://yaame-static.yaame.io/admin/ffe9b253f5f138995f806452053c08ff.png);
				}

				&.list-item-0 {
					background-image: url(https://yaame-static.yaame.io/admin/45f010fdfe20a68aef1455c4622502c5.png);
					&.has-dummy {
						background-image: url(https://yaame-static.yaame.io/admin/4bea38ab5464ecd2aa28646858771014.png);
					}
				}
				&.list-item-1 {
					background-image: url(https://yaame-static.yaame.io/admin/d04bc64024939733f9318e4422b8aea1.png);
					&.has-dummy {
						background-image: url(https://yaame-static.yaame.io/admin/374f9e0a99422da0002c85a2d5238ebd.png);
					}
				}
				&.list-item-2 {
					background-image: url(https://yaame-static.yaame.io/admin/e17d1cecd690e3d0bb4261c7640bede2.png);
					&.has-dummy {
						background-image: url(https://yaame-static.yaame.io/admin/b8e6f0255ba6e8529a7d4ef3223d7972.png);
					}
				}
			}
		}
		.user-info {
			width: 7.5rem;
			height: 1.96rem;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/a30640f6ac6b3f9e929fdae972f82d07.png);
			position: fixed;
			bottom: 0;
			left: 0;
			z-index: 99;
			&.toggle {
				height: 4.19rem;
				background-image: url(https://yaame-static.yaame.io/admin/bbf150517a6bcbc182a60ba52f9050ed.png);
			}
			.user-content {
				width: 7.5rem;
				height: 1.7rem;
				position: absolute;
				left: 0;
				bottom: 0;
				padding: 0.11rem 0 0.16rem;
				display: flex;
				align-items: center;
				font-size: 0.24rem;
				color: #fff9e4;
				.user-rank {
					width: 1rem;
					text-align: center;
				}
				.user-avatar {
					width: 1.38rem;
					height: 1.434rem;
					position: relative;
					.dress {
						position: absolute;
						left: 0;
						top: 0;
						width: 1.38rem;
						height: 1.434rem;
						z-index: 1;
					}
					.avatar {
						width: 0.78rem;
						height: 0.78rem;
						position: absolute;
						border-radius: 50%;
						display: block;
						left: 0.3rem;
						top: 0.32rem;
					}
				}
				.user-name {
					width: 3.58rem;
					padding-right: 0.2rem;
					padding-left: 0.15rem;
				}
				.user-value {
					width: 1.85rem;
                    text-align: right;
                    padding-right: 0.3rem;
					img {
						width: 0.2rem;
						height: auto;
						vertical-align: middle;
					}
				}
			}
			.top-icon {
				width: 0.3rem;
				height: 0.15rem;
				position: absolute;
				top: 0.21rem;
				left: 3.6rem;
			}

			.user-gift {
				width: 7.5rem;
				height: 2.6rem;
				padding: 0.74rem 1.15rem 0;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.user-gift-item {
					width: 1.4rem;
					height: 1.86rem;
					.user-gift-img {
						width: 1.4rem;
						height: 1.4rem;
						position: relative;
						background: #3a0400;
						border-radius: 0.1rem;

						img {
							position: absolute;
							width: 1.2rem;
							height: 1.2rem;
							left: 0.1rem;
							top: 0.1rem;
						}
					}
					.user-gift-name {
						width: 1.4rem;
						text-align: center;
						font-size: 0.24rem;
						color: #ffe89a;
					}
					.user-gift-num {
						position: absolute;
						right: 0.07rem;
						top: 0.07rem;
						min-width: 0.53rem;
						height: 0.22rem;
						padding: 0 0.08rem;
						text-align: center;
						line-height: 0.22rem;

						background: #800c30;
						border-radius: 0.11rem;

						font-size: 0.18rem;
						color: #ffe89a;
					}
				}
			}
		}
	}
}
</style>
