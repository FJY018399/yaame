<template>
	<div :class="['main', language]">
		<Header style="position: fixed" color="white"
			><span>{{ $t("title") }}</span></Header
		>

		<div class="time-container">
			<div class="time-day-1">{{ timeInfo.dayRight }}</div>
			<div class="time-day-2">D</div>
			<div class="time-hour-1">{{ timeInfo.hour }}</div>
			<div class="time-hour-2">{{ timeInfo.minute }}</div>
			<div class="time-hour-3">{{ timeInfo.second }}</div>
		</div>

		<img :src="titleList[language]" class="title-icon" alt="" />

        <canvas class="reward-icon" id="canvas" @click="handleReward"></canvas>
		<div class="rule-icon" @click="ruleVisible = true">{{ $t("rule") }}</div>
		<div class="record-icon" @click="handleRecord()">{{ $t("record") }}</div>
		<div class="tab-container">
			<div
				v-for="(item, index) in tabList"
				:key="index"
				class="tab-item"
				@click="tabActive = item.key"
			>
				<img :src="computedTabImg(item)" alt="" />
			</div>
		</div>

		<div v-if="tabActive === 'draw'" class="draw-container">
			<div class="activity-times">
				<van-notice-bar :scrollable="false">
					<van-swipe
						:autoplay="3000"
						:show-indicators="false"
						vertical
						class="notice-swipe"
					>
						<van-swipe-item v-for="(item, index) in record_list" :key="index">
							<p class="swipe-item-p no-wrap">
								{{ $t("recordDesc", [item.nick_name, item.gift_name]) }}
							</p>
						</van-swipe-item>
					</van-swipe>
				</van-notice-bar>
			</div>

			<div class="gift-list">
				<div
					v-for="(item, index) in giftList"
					:key="index"
					:class="['gift-item', index === currIndex && 'active']"
				>
					<div v-if="item.object_type !== 'GIFT'" class="day">
						<p>{{ item.diamond_worth }}</p>
					</div>

					<div v-else :class="['num', item.diamond_worth > 99 && 'big']">
						<img
							src="https://yaame-static.yaame.io/admin/d1d04d105203a1210409b56410506917.png"
							alt=""
						/>
						<p>{{ item.diamond_worth }}</p>
					</div>

					<img class="gift-img" :src="item.icon" alt="" />
					<div class="gift-name">
						<p class="no-wrap">{{ item.gift_name }}</p>
					</div>
				</div>
			</div>

			<div class="draw-btn">
				<div
					v-for="(item, index) in drawBtnList[language]"
					:key="index"
					class="btn-item"
				>
					<img :src="item.img" alt="" @click="handleDraw(index)" />
				</div>
			</div>

			<div class="my-diamonds">{{ $t("myDiamonds") }}：{{ diamond }}</div>
		</div>
		<div v-else class="rank-container">
			<div :class="['activity-gift', language]">
				<div class="gift-list">
					<div
						v-for="(item, index) in rankGiftList"
						:key="index"
						class="gift-item"
					>
						<img class="gift-img" :src="item.icon" alt="" />
						<p class="gift-name no-wrap">{{ item.gift_name }}</p>
						<p class="gift-num">
							<img
								src="https://yaame-static.yaame.io/admin/d1d04d105203a1210409b56410506917.png"
								alt=""
							/>{{ item.diamond_worth }}
						</p>
					</div>
				</div>
				<div class="gift-desc">{{ $t("giftInfo") }}</div>
			</div>
			<div class="activity-rank">
				<div class="rank-title">{{ $t("rank") }}</div>
				<div class="rank-list">
					<div class="rank-tab">
						<div
							v-for="(item, index) in rankTabList"
							:key="index"
							:class="['rank-item', rankTabActive === item.key && 'active']"
							@click="rankTabActive = item.key"
						>
							{{ $t(item.key) }}
						</div>
					</div>
					<div v-if="topList && topList.length" class="top-list">
						<div
							v-for="(item, index) in topList"
							:key="index"
							:class="['top-item', 'top-item-' + index]"
						>
							<div class="top-avatar" @click="toDetails(item)">
								<img
									:src="item.avatar"
									class="top-img"
									alt=""
								/>

								<img
									v-if="index === 1"
									src="https://yaame-static.yaame.io/admin/ff799e7830c55f515a7e0ebeafc23865.png"
									class="avatar-dress"
									alt=""
								/>
								<img
									v-else-if="index === 0"
									src="https://yaame-static.yaame.io/admin/9dcfb3736854afe42fcf37d422a07078.png"
									class="avatar-dress"
									alt=""
								/>
								<img
									v-else-if="index === 2"
									src="https://yaame-static.yaame.io/admin/560e8b49fce6a806590aa40eafab2831.png"
									class="avatar-dress"
									alt=""
								/>
							</div>
							<div class="top-name no-wrap">{{ item.nick_name }}</div>
							<div class="top-id">ID：{{ item.peanut_id }}</div>
							<div class="top-time">
								<img
									src="https://yaame-static.yaame.io/admin/d1d04d105203a1210409b56410506917.png"
								/>
								{{ item.score }}
							</div>
						</div>
					</div>

					<div v-if="list && list.length" class="list-content">
						<div v-for="(item, index) in list" :key="index" class="list-item">
							<div class="sort">{{ item.subject_rank }}</div>
							<div class="avatar" @click="toDetails(item)">
								<img :src="item.avatar" alt="" />
							</div>
							<div class="info">
								<p class="no-wrap">{{ item.nick_name }}</p>
								<p class="info-id">ID：{{ item.peanut_id }}</p>
							</div>
							<div class="num">
								<img
									src="https://yaame-static.yaame.io/admin/d1d04d105203a1210409b56410506917.png"
								/>{{ item.score }}
							</div>
						</div>
					</div>

					<div v-if="topList.length === 0 && list.length === 0">
						<div
							style="margin-left: 0.16rem; margin-top: 3rem"
							class="empty-div"
						>
							<img
								src="https://yaame-static.yaame.io/admin/78af6a91f2cfe404ce2e6d203e689b4e.png"
							/>
							<p>{{ $t("emptyList") }}</p>
						</div>
					</div>
				</div>
			</div>

			<div class="user-info">
				<div v-if="userInfo.subject_rank" class="sort">
					{{ userInfo.subject_rank }}
				</div>
				<div v-else class="sort">99+</div>
				<div class="avatar">
					<img :src="userInfo.avatar" alt="" />
				</div>
				<div class="info">
					<p class="no-wrap">{{ userInfo.nick_name }}</p>
					<!-- <p class="info-id">ID：{{ userInfo.peanut_id }}</p> -->
				</div>
				<div class="num">
					<img
						src="https://yaame-static.yaame.io/admin/d1d04d105203a1210409b56410506917.png"
					/>{{ userInfo.score || "0" }}
				</div>
			</div>
		</div>

		<popup v-if="ruleVisible" class="flex-container">
			<div class="rule-popup">
				<div class="popup-title">{{ $t("rule") }}</div>
				<div class="rule-content">
					<p class="title-p">{{ $t("rule_1") }}</p>
					<p class="content-p">{{ $t("rule_2") }}</p>
					<p class="content-p">{{ $t("rule_3") }}</p>
					<p class="title-p">{{ $t("rule_4") }}</p>
					<p class="content-p">{{ $t("rule_5") }}</p>
					<p class="content-p">
						{{ $t("rule_6") }}
					</p>
					<p class="content-p">
						{{ $t("rule_7") }}
					</p>
					<p class="content-p">
						{{ $t("rule_8") }}
					</p>
					<p class="footer-p">{{ $t("rule_9") }}</p>
				</div>

				<img
					src="https://yaame-static.yaame.io/admin/38755821af56a6a82ed152ee1fddfb80.png"
					class="close-icon"
					alt=""
					@click="ruleVisible = false"
				/>
			</div>
		</popup>

		<popup v-if="rewardVisible" class="flex-container">
			<div class="reward-popup">
				<div style="top: -0.4rem;" class="popup-title">{{ $t("myReward") }}</div>

				<div class="reward-list">
					<div
						v-for="(item, index) in drawList"
						:key="index"
						class="reward-item"
					>
						<div class="reward-img">
							<img :src="item.icon" class="gift" alt="" />
							<div class="num">
								<p>{{ item.reward_num }}</p>
							</div>
						</div>
						<p class="reward-name no-wrap">{{ item.gift_name }}</p>
						<p v-if="item.object_type !== 'GIFT'" class="reward-day">
							{{ item.diamond_worth }}
						</p>
						<p v-else class="reward-day">
							<img
								src="https://yaame-static.yaame.io/admin/d1d04d105203a1210409b56410506917.png"
							/>
							{{ item.diamond_worth }}
						</p>
					</div>
				</div>

				<div class="btn-list">
					<div
						v-for="(item, index) in drawBtnList[language]"
						:key="index"
						class="btn-item"
					>
						<img :src="item.img" alt="" @click="handleDraw(index)" />
					</div>
				</div>
				<img
					src="https://yaame-static.yaame.io/admin/38755821af56a6a82ed152ee1fddfb80.png"
					class="close-icon"
					alt=""
					@click="rewardVisible = false"
				/>
			</div>
		</popup>

		<popup v-if="moreRewardVisible" class="flex-container">
			<div class="more-reward-popup">
				<div style="top: -0.4rem;" class="popup-title">{{ $t("myReward") }}</div>

				<div class="reward-list">
					<div
						v-for="(item, index) in drawList"
						:key="index"
						class="reward-item"
					>
						<div class="reward-img">
							<img :src="item.icon" class="gift" alt="" />
							<div class="num">
								<p>{{ item.reward_num }}</p>
							</div>
						</div>
						<p class="reward-name no-wrap">{{ item.gift_name }}</p>
						<p v-if="item.object_type !== 'GIFT'" class="reward-day">
							{{ item.diamond_worth }}
						</p>
						<p v-else class="reward-day">
							<img
								src="https://yaame-static.yaame.io/admin/d1d04d105203a1210409b56410506917.png"
							/>
							{{ item.diamond_worth }}
						</p>
					</div>
				</div>

				<div class="btn-list">
					<div
						v-for="(item, index) in drawBtnList[language]"
						:key="index"
						class="btn-item"
					>
						<img :src="item.img" alt="" @click="handleDraw(index)" />
					</div>
				</div>
				<img
					src="https://yaame-static.yaame.io/admin/38755821af56a6a82ed152ee1fddfb80.png"
					class="close-icon"
					alt=""
					@click="moreRewardVisible = false"
				/>
			</div>
		</popup>

		<popup v-if="recordVisible" class="flex-container">
			<div class="record-popup">
				<div class="popup-title">{{ $t("record") }}</div>

				<div v-if="recordContent && recordContent.length" class="record-list">
					<div
						v-for="(item, index) in recordContent"
						:key="index"
						class="record-item"
					>
						<p>{{ formatDate(item.win_time, "yyyy.MM.dd hh:mm:ss") }}</p>
						<div class="gift-list">
							<div
								v-for="(ele, inx) in item.reward_items"
								:key="inx"
								class="gift-item"
							>
								<img :src="ele.icon" alt="" />
								<div class="num">
									<p>{{ ele.reward_num }}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div
					v-else
					class="record-list"
					style="display: flex; justify-content: center; align-items: center"
				>
					<div class="empty-div">
						<img
							src="https://yaame-static.yaame.io/admin/78af6a91f2cfe404ce2e6d203e689b4e.png"
						/>
						<p>{{ $t("emptyRecord") }}</p>
					</div>
				</div>
				<img
					src="https://yaame-static.yaame.io/admin/38755821af56a6a82ed152ee1fddfb80.png"
					class="close-icon"
					alt=""
					@click="recordVisible = false"
				/>
			</div>
		</popup>
	</div>
</template>

<script>
import Header from "../../components/common/header.vue";
import popup from "../../components/common/pop_up.vue";
import { getSafeHeight, getLanguage } from "../../lib/device";
import request from "../../lib/request/halloween.js";
import pageLoading from "../../components/common/page_loading.vue";
import { formatDate } from "../../lib/utils.js";
import Toast from "../../components/third/toast/toast";
import { getQueryString } from "../../lib/utils";
import { Downloader, Parser, Player } from "svga.lite";
const getDefaultItem = () => {
	return {
		avatar:
			"https://yaame-static.yaame.io/admin/6b4037f1d2f32fc134f2892b68058cae.png",
		nick_name: "-",
		subject_rank: null,
		score: "",
		peanut_id: "-",
	};
};
export default {
	components: {
		Header,
		pageLoading,
		popup,
	},
	data() {
		return {
			safe_height: 0,

			page_loading: true,

			record_list: [],

			timeInfo: {
				dayLeft: 0,
				dayRight: 0,
				hour: 0,
				minute: 0,
				second: 0,
			},
			timeInterval: null,

			titleList: {
				"zh-cn":
					"https://yaame-static.yaame.io/admin/7d62aaf7d0625b719ca19047c6e253bf.png",
				"zh-tw":
					"https://yaame-static.yaame.io/admin/aa5e6f9668a122f87e847ca3cf7a1c85.png",
				en: "https://yaame-static.yaame.io/admin/59bd2357de58ffce156a386edafbc2bc.png",
				id: "https://yaame-static.yaame.io/admin/59bd2357de58ffce156a386edafbc2bc.png",
				ar: "https://yaame-static.yaame.io/admin/54f877f3d6666252b445cac7aa435130.png",
			},

			ruleVisible: false,
			recordVisible: false,
			rewardVisible: false,
			moreRewardVisible: false,

			tabList: [
				{
					key: "draw",
				},
				{
					key: "rank",
				},
			],
			tabActive: "draw",
			tabImgList: {
				"zh-cn": {
					draw: {
						active:
							"https://yaame-static.yaame.io/admin/ed506a220833b4c139b28312e5e57256.png",
						default:
							"https://yaame-static.yaame.io/admin/9b9b07e9e0fc2c898ba1c98254d2c04a.png",
					},
					rank: {
						active:
							"https://yaame-static.yaame.io/admin/84787eda6a42d57ae552996ad8e16191.png",
						default:
							"https://yaame-static.yaame.io/admin/00d7c61bd3cfe1413159047ab9250822.png",
					},
				},
				"zh-tw": {
					draw: {
						active:
							"https://yaame-static.yaame.io/admin/190008fe386a58bcde2fcf93b07abac1.png",
						default:
							"https://yaame-static.yaame.io/admin/ebe66d1f49eb88c980573cf9303e22f1.png",
					},
					rank: {
						active:
							"https://yaame-static.yaame.io/admin/84787eda6a42d57ae552996ad8e16191.png",
						default:
							"https://yaame-static.yaame.io/admin/00d7c61bd3cfe1413159047ab9250822.png",
					},
				},
				en: {
					draw: {
						active:
							"https://yaame-static.yaame.io/admin/a38a9bd4875178c221d3b17e40fea96d.png",
						default:
							"https://yaame-static.yaame.io/admin/7254339c880da38c76a6e9509447522e.png",
					},
					rank: {
						active:
							"https://yaame-static.yaame.io/admin/ed5e4ff13a55470d483ef9b80bfa8876.png",
						default:
							"https://yaame-static.yaame.io/admin/c25dc8c5987fe2eb7521458cfd15f18d.png",
					},
				},
				id: {
					draw: {
						active:
							"https://yaame-static.yaame.io/admin/c670a6e468390e4f59554cdba9d73b14.png",
						default:
							"https://yaame-static.yaame.io/admin/361c88677772acd68c3369dca063fc84.png",
					},
					rank: {
						active:
							"https://yaame-static.yaame.io/admin/3cb2f713195062d34d03baa1981b16fa.png",
						default:
							"https://yaame-static.yaame.io/admin/54f7931084ee3a745f8a0e0a7d02fa2e.png",
					},
				},
				ar: {
					draw: {
						active:
							"https://yaame-static.yaame.io/admin/524dff76575ff3f041ea67c2de369b36.png",
						default:
							"https://yaame-static.yaame.io/admin/1a6ac7ad8094bdba6d8870960f2b6fc3.png",
					},
					rank: {
						active:
							"https://yaame-static.yaame.io/admin/aba6e02f915e602c7f74612d991f9810.png",
						default:
							"https://yaame-static.yaame.io/admin/72b3f0607c89602732eb5f661d5f6ea4.png",
					},
				},
			},

			giftList: [],

			drawBtnList: {
				"zh-cn": [
					{
						key: 1,
						img: "https://yaame-static.yaame.io/admin/6e6c44e7ce124086b8d773be894855c1.png",
					},
					{
						key: 10,
						img: "https://yaame-static.yaame.io/admin/75930372e848739643a207c61015aaa9.png",
					},
					{
						key: 100,
						img: "https://yaame-static.yaame.io/admin/9df17c1b2797e60ab6c43c8820c71179.png",
					},
				],
				"zh-tw": [
					{
						key: 1,
						img: "https://yaame-static.yaame.io/admin/6e6c44e7ce124086b8d773be894855c1.png",
					},
					{
						key: 10,
						img: "https://yaame-static.yaame.io/admin/75930372e848739643a207c61015aaa9.png",
					},
					{
						key: 100,
						img: "https://yaame-static.yaame.io/admin/9df17c1b2797e60ab6c43c8820c71179.png",
					},
				],
				en: [
					{
						key: 1,
						img: "https://yaame-static.yaame.io/admin/7d1b06904bc1c91934b3a9c5c305a170.png",
					},
					{
						key: 10,
						img: "https://yaame-static.yaame.io/admin/775417484403a3ced1f58c3a997dfe19.png",
					},
					{
						key: 100,
						img: "https://yaame-static.yaame.io/admin/77afd81a69ed2b590ed0737dbda970f0.png",
					},
				],
				id: [
					{
						key: 1,
						img: "https://yaame-static.yaame.io/admin/201768041dcd677850c347eddce6c37b.png",
					},
					{
						key: 10,
						img: "https://yaame-static.yaame.io/admin/d3e74d031c6ca518d8bff28364a25d77.png",
					},
					{
						key: 100,
						img: "https://yaame-static.yaame.io/admin/ea26683b4fb346a06c4041a34b8cbe9e.png",
					},
				],
				ar: [
					{
						key: 1,
						img: "https://yaame-static.yaame.io/admin/4b549b1bcbe1f0cc6e9294c8c4ab4baa.png",
					},
					{
						key: 10,
						img: "https://yaame-static.yaame.io/admin/1ab5fa9d015940d4a5326f9675381e23.png",
					},
					{
						key: 100,
						img: "https://yaame-static.yaame.io/admin/10a6a20f017594a31bc2857a498ccfd8.png",
					},
				],
			},

			currIndex: -1, // 当前高亮的奖品索引
			step: 0, // 跑马灯当前处于的步骤
			awardSequence: [0, 1, 2, 5, 4, 3, 6, 7, 8, 7, 6, 3, 4, 5, 2, 1, 0], // 奖品序列
			stopAt: 2, // 指定最终停止的位置

			rankTabList: [
				{
					key: "SEND_GIFT",
				},
				{
					key: "STAR_GIFT",
				},
			],
			rankTabActive: "SEND_GIFT",

			drawList: [],

			diamond: 0,

			rankGiftList: [],

			userInfo: {
				avatar: "",
				nick_name: "",
				peanut_id: "",
				uid: "",
			},

			recordContent: [],

			topList: [],
			list: [],

			gameFlag: false,

            downloader: null,
			parser: null,
			player: null,
			svgaData: null,
		};
	},
	computed: {
		language() {
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
		},
	},
	watch: {
		rankTabActive() {
			this.getRank();
		},
	},
	mounted() {
		let safe_area = getSafeHeight() || 0;
		this.safe_height = (safe_area * 2) / 100;
		this.getData();
		this.getSwiperList();

		setInterval(() => {
			let now = new Date();
			let year = now.getFullYear();
			let halloween = new Date(Date.UTC(year, 9, 31)); // 万圣节的日期

			if (now < halloween) {
				let msPerDay = 24 * 60 * 60 * 1000;
				let totalDaysLeft = Math.floor((halloween - now) / msPerDay);

				let daysLeftTens = Math.floor(totalDaysLeft / 10);
				let daysLeftOnes = totalDaysLeft % 10;

				// 剩余小时、分钟、秒
				let hrsLeft = 23 - now.getUTCHours();
				let minsLeft = 59 - now.getUTCMinutes();
				let secsLeft = 59 - now.getUTCSeconds();

				hrsLeft = hrsLeft.toString().padStart(2, "0");
				minsLeft = minsLeft.toString().padStart(2, "0");
				secsLeft = secsLeft.toString().padStart(2, "0");
				this.timeInfo = {
					dayLeft: daysLeftTens,
					dayRight: daysLeftOnes,
					hour: hrsLeft,
					minute: minsLeft,
					second: secsLeft,
				};
			} else {
				this.timeInfo = {
					dayLeft: 0,
					dayRight: 0,
					hour: '00',
					minute: '00',
					second: '00',
				};
			}
		}, 1000);

		setInterval(() => {
			this.getData();
		}, 3000);
		this.getRank();
		this.getRecord();

        this.initSVGAData();
	},
	methods: {
		formatDate,
		async getData() {
			try {
				let res = await request.getHalloweenInfo();
				if (res.status === 1000) {
					this.giftList = res.data.award_plate_items;
					this.diamond = res.data.diamond;
				}
			} catch (error) {
				console.log(error);
			}
		},
		async getSwiperList() {
			try {
				let res = await request.getHalloweenNotice();
				if (res.status === 1000) {
					this.record_list = res.data.popup_items;
				}
			} catch (error) {
				console.log(error);
			}
		},
		play(stopAt) {
			return new Promise((resolve) => {
				let totalSteps = this.awardSequence.length;

				// 设定速度区间，从快（50ms）到慢（600ms）
				const minSpeed = 50;
				const maxSpeed = 600;

				this.stopAt = stopAt % totalSteps;

				this.step = 0;

				let stepFunc = () => {
					this.currIndex = this.awardSequence[this.step % totalSteps];

					// 计算当前步数相对于总步数的比例
					let ratio = this.step / (totalSteps + this.stopAt);

					// 根据比例计算当前速度
					let speed = minSpeed + (maxSpeed - minSpeed) * ratio;

					this.step++;

					if (this.step > totalSteps + this.stopAt) {
						this.currIndex = this.stopAt;
						resolve();
						return;
					}

					setTimeout(stepFunc, speed);
				};

				stepFunc();
			});
		},
		async handleDraw(index) {
			this.moreRewardVisible = false;
			this.rewardVisible = false;

			if (this.gameFlag === true) {
				return;
			}
			this.gameFlag = true;

			let lottery_type = "ONCE";
			if (index === 0) {
				lottery_type = "ONCE";
			} else if (index === 1) {
				lottery_type = "TEN";
			} else if (index === 2) {
				lottery_type = "ONE_HUNDRED";
			}

			this.currIndex = -1; // 当前高亮的奖品索引
			this.step = 0; // 跑马灯当前处于的步骤
			this.awardSequence = [0, 1, 2, 5, 4, 3, 6, 7, 8, 7, 6, 3, 4, 5, 2, 1, 0]; // 奖品序列
			this.stopAt = 2; // 指定最终停止的位置

			let res = await request.getHalloweenDraw({ lottery_type });

			if (res.status === 1000) {
				this.drawList = res.data.reward_items;

				this.diamond = res.data.diamond;

				// 拿到drawList中reward_id和res.data.last_reward_ids一样的item的索引
				let index = this.giftList.findIndex(
					(item) => item.reward_id === res.data.last_reward_ids
				);

				console.log(index);
				this.stopAt = index;
				await this.play(index);

				setTimeout(() => {
					if (this.drawList.length > 3) {
						this.moreRewardVisible = true;
					} else {
						this.rewardVisible = true;
					}
					this.gameFlag = false;
				}, 1000);
			} else if (res.status === 6600) {
				Toast(this.$t("toCharge"));

				this.gameFlag = false;
				setTimeout(() => {
					window.location.href = "wlyaame://mine/shop/diamond?popup=1";
				}, 2000);
			} else if (res.status === 10003) {
				Toast(res.desc);
				let result = await request.getHalloweenDraw({
					lottery_num: res.data.remain_lottery,
				});

				if (result.status === 1000) {
					this.drawList = result.data.reward_items;

					this.diamond = result.data.diamond;

					// 拿到drawList中reward_id和res.data.last_reward_ids一样的item的索引
					let index = this.giftList.findIndex(
						(item) => item.reward_id === result.data.last_reward_ids
					);

					console.log(index);
					this.stopAt = index;
					await this.play(index);

					setTimeout(() => {
						if (this.drawList.length > 3) {
							this.moreRewardVisible = true;
						} else {
							this.rewardVisible = true;
						}
						this.gameFlag = false;
					}, 1000);
				}
			} else {
				Toast(res.desc);
				this.gameFlag = false;
			}
		},
		async getRank() {
			let res = await request.getHalloweenRankList({
				page: 1,
				size: 30,
				halloweenRankType: this.rankTabActive,
			});
			if (res.status === 1000) {
				this.userInfo = res.data.my_rank;

				if (res.data.content.length > 3) {
					this.topList = res.data.content.slice(0, 3);
					this.list = res.data.content.slice(3);
				} else {
					this.topList = res.data.content;
					this.list = [];
				}

				if (res.data.content.length === 0) {
					this.topList = [];
					this.list = [];
				}

				this.rankGiftList = res.data.gift_config_item_vos;
			}
			console.log(res);
		},
		async getRecord() {
			let res = await request.getHalloweenUserLottery();
			if (res.status === 1000) {
				this.recordContent = res.data.reward_win_infos;
			}
		},
		handleRecord() {
			this.getRecord();

			this.recordVisible = true;
		},
		handleReward() {
			location.href = "./AllSaintsDayReward.html";
		},
		toDetails(item) {
			if (item.uid) {
				location.href = `wlyaame://trend/user?uid=${item.uid}`;
			}
		},
		computedTabImg(item) {
			if (this.tabActive === item.key) {
				return this.tabImgList[this.language][item.key].active;
			} else {
				let key = this.tabActive === "draw" ? "rank" : "draw";

				return this.tabImgList[this.language][key].default;
			}
		},
        async initSVGAData() {
			this.downloader = new Downloader();
			// 默认调用 WebWorker 线程解析
			// 可配置 new Parser({ disableWorker: true }) 禁止
			this.parser = new Parser();
			// #canvas 是 HTMLCanvasElement
			this.player = new Player("#canvas");

			// 加载静态动画
			const fileData = await this.downloader.get(
				"https://yaame-static.yaame.io/admin/883af9c2d47119ffb6c58a77070a7735.svga"
			);
			this.svgaData = await this.parser.do(fileData);

			this.player.set({ loop: 0 });

			await this.player.mount(this.svgaData);
			this.player.start();
		},
	},
};
</script>
<style scoped lang="less">
.main {
	width: 7.5rem;
	min-height: 100vh;
	background-image: url(https://yaame-static.yaame.io/admin/45220fce97228bd43622427b1667dd7a.png);
	background-size: contain;
	background-repeat: no-repeat;
	position: relative;
	background-color: #220d5b;
	padding-top: 7.42rem;
	font-size: 0.24rem;
	color: #fff;
	.title-icon {
		width: 5.33rem;
		height: 3.26rem;
		position: absolute;
		top: 0.4rem;
		left: 1.14rem;
	}
	.reward-icon {
		width: 1.66rem;
		height: 1.66rem;
		position: fixed;
		left: 0.06rem;
		top: 5.44rem;
		z-index: 9;
	}
	.record-icon {
		width: 1.3rem;
		height: 0.78rem;
		position: absolute;
		right: 0;
		top: 5.11rem;
		background-image: url(https://yaame-static.yaame.io/admin/d5c048f2715b783fb7d20345e2417761.png);
		background-size: contain;
		background-repeat: no-repeat;
		padding-top: 0.26rem;
		text-align: center;
		font-size: 0.24rem;
		font-weight: 600;
		color: #743734;
	}
	.rule-icon {
		width: 1.3rem;
		height: 0.78rem;
		position: absolute;
		top: 6.08rem;
		right: 0;
		background-image: url(https://yaame-static.yaame.io/admin/d5c048f2715b783fb7d20345e2417761.png);
		background-size: contain;
		background-repeat: no-repeat;
		padding-top: 0.26rem;
		text-align: center;
		font-size: 0.24rem;
		font-weight: 600;
		color: #743734;
	}
	.time-container {
		width: 4.03rem;
		height: 0.8rem;
		position: absolute;
		top: 2.93rem;
		left: 1.74rem;
		background-image: url(https://yaame-static.yaame.io/admin/be81c4e22427ea6ff0bdd1fa65bf9b01.png);
		background-size: contain;
		background-repeat: no-repeat;
		div {
			height: 0.48rem;
			top: 0.16rem;
			line-height: 0.5rem;
			font-size: 0.32rem;
			font-weight: 400;
			color: #ffffff;
		}
		.time-day-1 {
			width: 0.46rem;
			position: absolute;
			left: 0.16rem;
			text-align: center;
		}
		.time-day-2 {
			width: 0.46rem;
			position: absolute;
			left: 0.7rem;
			text-align: center;
		}
		.time-hour-1 {
			width: 0.66rem;
			position: absolute;
			left: 1.42rem;
			text-align: center;
		}
		.time-hour-2 {
			width: 0.66rem;
			position: absolute;
			left: 2.34rem;
			text-align: center;
		}
		.time-hour-3 {
			width: 0.62rem;
			position: absolute;
			left: 3.26rem;
			text-align: center;
		}
	}
	.tab-container {
		width: 7.5rem;
		height: 1.19rem;
		display: flex;
		justify-content: space-between;
		padding: 0 0.7rem;
		.tab-item {
			width: 2.84rem;
			height: 1.19rem;
			img {
				width: 2.84rem;
				height: 1.19rem;
			}
		}
	}
	.draw-container {
		background-image: url(https://yaame-static.yaame.io/admin/94406a9194622a0fecd8f5ac00a7aab2.png);
		background-size: contain;
		background-repeat: no-repeat;
		width: 7.5rem;
		height: 10.02rem;
		margin-top: 0.12rem;
		position: relative;
		.activity-times {
			width: 5.5rem;
			height: 0.4rem;
			position: absolute;
			top: 0.62rem;
			left: 50%;
			transform: translateX(-50%);
			.van-notice-bar {
				background: transparent;
				line-height: 0.4rem;
				color: #f0cf85;
				height: 100%;
				font-size: 0.24rem;
				padding: none;
			}
			.notice-swipe {
				height: 0.4rem;
				line-height: 0.4rem;
				text-align: center;
			}
		}
		.gift-list {
			width: 5.88rem;
			height: 6.1rem;
			position: absolute;
			top: 1.58rem;
			left: 0.8rem;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			.gift-item {
				width: 1.8rem;
				height: 1.8rem;
				background: linear-gradient(180deg, #6d68ba 0%, #6b66ba 100%);
				border-radius: 0.08rem;
				border: 0.05rem solid #bfc2ee;
				position: relative;
				transition: background-color 0.5s, border 0.5s;
				&.active {
					background: linear-gradient(180deg, #ffc83e 0%, #ef8e59 100%);
					border: 0.05rem solid #ffeecf;
				}
				.day {
					min-width: 0.56rem;
					height: 0.3rem;
					line-height: 0.3rem;
					position: absolute;
					top: 0rem;
					right: 0;
					background: linear-gradient(270deg, #5eccf1 0%, #52b5ef 100%);
					border-radius: 1rem;
					padding: 0 0.04rem;
					z-index: 2;
					p {
						text-align: center;
						font-size: 0.24rem;
						color: #fff;
						font-weight: 600;
						transform: scale(0.75);
					}
				}
				.num {
					min-width: 0.71rem;
					padding-right: 0.14rem;
					height: 0.3rem;
					line-height: 0.3rem;
					position: absolute;
					top: 0rem;
					right: 0;
					background: linear-gradient(270deg, #feb33e 0%, #ff8f4c 100%);
					padding-left: 0.3rem;
					border-radius: 1rem;
					img {
						width: 0.1895rem;
						height: 0.1578rem;
						position: absolute;
						left: 0.17rem;
						top: 0.08rem;
					}
					p {
						text-align: left;
						font-size: 0.24rem;
						color: #fff;
						font-weight: 600;
						transform: scale(0.75);
					}
				}
				.gift-img {
					width: 1.54rem;
					height: 1.54rem;
					position: absolute;
					top: 0.05rem;
					left: 0.12rem;
				}
				.gift-name {
					width: 1.2rem;
					height: 0.4rem;
					text-align: center;
					line-height: 0.4rem;
					background: rgba(0, 0, 0, 0.4);
					border-radius: 0.2rem;
					border: 0.01rem solid rgba(255, 255, 255, 0.3);
					position: absolute;
					top: 1.32rem;
					left: 0.32rem;
					p {
						width: 1.6rem;
						padding: 0 0.1rem;
						margin-left: -0.2rem;
						transform: scale(0.75);
						font-size: 0.24rem;
						font-weight: 600;
						color: #ffffff;
					}
				}
			}
		}
		.draw-btn {
			width: 7.5rem;
			height: 1rem;
			position: absolute;
			top: 8.43rem;
			left: 0;
			padding: 0 0.48rem;
			display: flex;
			justify-content: space-between;
			.btn-item {
				width: 2.05rem;
				height: 1rem;
				img {
					width: 2.05rem;
					height: 1rem;
				}
			}
		}
		.my-diamonds {
			width: 7.5rem;
			font-size: 0.24rem;
			font-weight: 400;
			color: #9295dc;
			position: absolute;
			left: 0;
			bottom: 0.18rem;
			text-align: center;
		}
	}
	.rank-container {
		margin-top: 0.18rem;
		padding-left: 0.16rem;
		padding-bottom: 1.1rem;
		.activity-gift {
			width: 7.18rem;
			height: 6.03rem;
			background-image: url(https://yaame-static.yaame.io/admin/d66fa10fffb77f7a27a0ff77aa33477f.png);
			background-repeat: no-repeat;
			background-size: contain;
			position: relative;
			&.zh-tw {
				background-image: url(https://yaame-static.yaame.io/admin/4d89200f1d3972913831003749860752.png);
			}
			&.en {
				background-image: url(https://yaame-static.yaame.io/admin/7f388172a37e802b9e15c4aacf2725fb.png);
			}
			&.id {
				background-image: url(https://yaame-static.yaame.io/admin/3d76710a447f0ccb29facb1e06a71454.png);
			}
			&.ar {
				background-image: url(https://yaame-static.yaame.io/admin/7cb59981349ec7fa50455a96bfae1e0a.png);
			}
			.gift-list {
				width: 7.18rem;
				height: 4.44rem;
				position: absolute;
				top: 1rem;
				padding: 0 0.62rem;
				padding-left: 0.62rem;
				padding-right: 0.4rem;
				display: flex;
				flex-wrap: wrap;
				.gift-item {
					width: 1.32rem;
					height: 2rem;
					margin-right: 0.22rem;
					background-image: url(https://yaame-static.yaame.io/admin/5c9b5593ff9a66db237ba6787b7f5524.png);
					background-size: contain;
					background-repeat: no-repeat;
					position: relative;
					.gift-img {
						width: 1.12rem;
						height: 1.12rem;
						position: absolute;
						top: 0.09rem;
						left: 0.1rem;
					}
					.gift-name {
						width: 1.32rem;
						// margin-left: -0.22rem;
						text-align: center;
						font-size: 0.18rem;
						font-weight: 600;
						color: #ffffff;
						position: absolute;
						top: 1.35rem;
					}
					.gift-num {
						width: 1.76rem;
						margin-left: -0.22rem;
						text-align: center;
						font-size: 0.18rem;
						font-weight: 600;
						color: #ffffff;
						position: absolute;
						top: 1.68rem;
						img {
							width: 0.19rem;
							height: 0.16rem;
							vertical-align: middle;
						}
					}
				}
			}
			.gift-desc {
				position: absolute;
				left: 0;
				top: 5.43rem;
				width: 7.18rem;
				font-size: 0.22rem;
				font-weight: 400;
				color: #725fae;
				text-align: center;
			}
		}
		.activity-rank {
			width: 7.18rem;
			padding-top: 0.6rem;
			position: relative;
			.rank-title {
				width: 7.18rem;
				height: 0.89rem;
				position: absolute;
				left: -0.06rem;
				top: 0.12rem;
				background-image: url("https://yaame-static.yaame.io/admin/fd337a76fafa28e0b192a8995ca77d38.png");
				background-size: contain;
				background-repeat: no-repeat;
				text-align: center;
				line-height: 0.89rem;
				color: #f2edfc;
				font-size: 0.34rem;
				font-weight: bolder;
			}
			.rank-list {
				width: 6.7rem;
				min-height: 10.27rem;
				background: linear-gradient(180deg, #321543 0%, #382c68 100%);
				border-radius: 0px 0px 0.02rem 0.02rem;
				border: 0.12rem solid #7f6dc5;
				margin-left: 0.12rem;
				padding-top: 0.63rem;
				.rank-tab {
					width: 3.82rem;
					height: 0.66rem;
					margin-bottom: 0.3rem;
					background-color: #fff;
					margin-left: 1.44rem;
					background-image: linear-gradient(277deg, #422759 0%, #423570 100%);
					border-radius: 0.43rem;
					border: 0.03rem solid #7c6ebf;
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 0 0.06rem;
					.rank-item {
						width: 1.74rem;
						height: 0.5rem;
						text-align: center;
						line-height: 0.5rem;
						&.active {
							background: linear-gradient(360deg, #e8bd4b 0%, #ffe89c 100%);
							border-radius: 0.43rem;
							border: 0.02rem solid;
							color: #7a3812;
						}
					}
				}
				.top-list {
					margin-top: 0.3rem;
					width: 6.7rem;
					height: 3.78rem;
					padding: 0 0.4rem;
					border-top: 0.01rem solid transparent;
					display: flex;
					justify-content: space-between;
					.top-item {
						width: 1.8rem;
						height: 3rem;
						margin-top: 0.44rem;
						&.top-item-0 {
							margin-top: 0;
							position: absolute;
							left: 2.7rem;
						}
						.top-avatar {
							width: 1.8rem;
							height: 1.8rem;
							display: flex;
							justify-content: center;
							align-items: center;
							position: relative;
							.avatar-dress {
								width: 1.8rem;
								height: 1.8rem;
								position: absolute;
								top: 0;
								left: 0;
							}
							.top-img {
								width: 1.32rem;
								height: 1.32rem;
								border-radius: 50%;
							}
						}
						.top-name {
							width: 1.8rem;
							font-weight: normal;
							color: #ffffff;
							text-align: center;
						}
						.top-id {
							width: 2.4rem;
							margin-left: -0.3rem;
							text-align: center;
							font-size: 0.18rem;
							font-weight: 600;
							color: rgba(255, 255, 255, 0.5);
							transform: scale(0.75);
						}
						.top-time {
							font-size: 0.22rem;
							font-family: PingFangSC-Semibold, PingFang SC;
							font-weight: 600;
							color: #ffe898;
							text-align: center;
							img {
								width: 0.1895rem;
								height: auto;
								vertical-align: middle;
							}
						}
					}
				}
				.list-content {
					width: 6.7rem;
					min-height: 4.5rem;
					.list-item {
						width: 6.7rem;
						height: 0.8rem;
						display: flex;
						align-items: center;
						margin-bottom: 0.32rem;
						.sort {
							width: 1.08rem;
							text-align: center;
						}
						.avatar {
							width: 0.8rem;
							height: 0.8rem;
							background: #d1c2ff;
							border: 0.02rem solid #ffffff;
							border-radius: 50%;
							img {
								width: 0.76rem;
								height: 0.76rem;
								border-radius: 50%;
							}
						}
						.info {
							width: 3.34rem;
							padding-left: 0.3rem;
							.info-id {
								transform: scale(0.75);
								color: rgba(255, 255, 255, 0.5);
								margin-left: -0.4rem;
							}
						}
						.num {
							color: #ffe898;
							img {
								width: 0.1895rem;
								height: auto;
								vertical-align: middle;
							}
						}
					}
				}
			}
		}
		.user-info {
			width: 7.5rem;
			height: 1.2rem;
			background: linear-gradient(137deg, #8984c9 0%, #5e5aa5 100%);
			border-radius: 0.3rem 0.3rem 0px 0px;
			padding: 0 0.4rem;
			display: flex;
			align-items: center;
			position: fixed;
			bottom: 0;
			left: 0;
			color: #ffe995;
			.sort {
				width: 1.08rem;
				text-align: center;
			}
			.avatar {
				width: 0.8rem;
				height: 0.8rem;
				background: #d1c2ff;
				border: 0.02rem solid #ffffff;
				border-radius: 50%;
				img {
					border-radius: 50%;
					width: 0.76rem;
					height: 0.76rem;
				}
			}
			.info {
				width: 3.34rem;
				padding-left: 0.3rem;
				.info-id {
					transform: scale(0.75);
					color: rgba(255, 255, 255, 0.5);
					margin-left: -0.4rem;
				}
			}
			.num {
				color: #ffe898;
				img {
					width: 0.1895rem;
					height: auto;
					vertical-align: middle;
				}
			}
		}
	}
	.flex-container {
		display: flex;
		justify-content: center;
		align-items: center;
		.rule-popup {
			width: 6.42rem;
			height: 6.98rem;
			background-image: url(https://yaame-static.yaame.io/admin/bca400805b47799f31035fd2e0ddf34d.png);
			background-repeat: no-repeat;
			background-size: contain;
			position: relative;
			padding: 0.77rem 0.56rem 0.92rem 0.56rem;

			.rule-content {
				width: 5.3rem;
				height: 5.2rem;
				overflow-y: scroll;
				.title-p {
					font-size: 0.26rem;
					font-weight: 600;
					color: #ffffff;
					margin-bottom: 0.14rem;
				}
				.content-p {
					font-size: 0.24rem;
					font-weight: 400;
					color: rgba(255, 255, 255, 0.5);
					margin-bottom: 0.1rem;
				}
			}
			.footer-p {
				text-align: center;
				font-size: 0.22rem;
				font-weight: 400;
				color: #725fae;
				margin-top: 0.3rem;
			}
		}
		.reward-popup {
			position: relative;
			width: 6.42rem;
			height: 5.49rem;
			background: linear-gradient(180deg, #321543 0%, #382c68 100%);
			border: 0.12rem solid #7D6CC1;
            border-radius: 0.12rem;
			padding-top: 1rem;
			.reward-list {
				height: 2.5rem;
				width: 6.18rem;
				padding-left: 0.25rem;
				padding-right: 0.25rem;
				display: flex;
				justify-content: space-around;
				.reward-item {
					width: 1.8rem;
					height: 2.5rem;
					.reward-img {
						width: 1.8rem;
						height: 1.8rem;
						background-image: url(https://yaame-static.yaame.io/admin/1eda2e28017feaae8728408f588e5f15.png);
						background-size: contain;
						background-repeat: no-repeat;
						position: relative;
						.gift {
							width: 1.6rem;
							height: 1.6rem;
							position: absolute;
							top: 0.1rem;
							left: 0.1rem;
						}
						.num {
							position: absolute;
							right: 0;
							top: 0;
							width: 0.46rem;
							height: 0.26rem;
							line-height: 0.26rem;
							background-image: url(https://yaame-static.yaame.io/admin/0fe2dd0857a9beaeeb3d5a29ff30ee71.png);
							background-size: contain;
							background-repeat: no-repeat;
							p {
								font-size: 0.24rem;
								font-weight: 600;
								color: #ffffff;
								transform: scale(0.75);
								width: 0.6rem;
								margin-left: -0.07rem;
								text-align: center;
							}
						}
					}
					.reward-name {
						width: 1.8rem;
						font-size: 0.26rem;
						font-weight: 600;
						color: #ffffff;
						text-align: center;
						margin-top: 0.08rem;
					}
					.reward-day {
						width: 1.8rem;
						font-size: 0.26rem;
						font-weight: 600;
						color: #ffffff;
						transform: scale(0.75);
						text-align: center;
						img {
							width: 0.19rem;
							height: auto;
							vertical-align: middle;
						}
					}
				}
			}
			.btn-list {
				width: 6.16rem;
				height: 0.94rem;
				margin-top: 0.6rem;
				display: flex;
				justify-content: space-between;
				padding: 0 0.2rem;
				.btn-item {
					width: 1.91rem;
					height: 0.94rem;
					img {
						width: 1.91rem;
						height: 0.94rem;
					}
				}
			}
		}
		.more-reward-popup {
			position: relative;
			width: 6.42rem;
			height: 8.21rem;
			background: linear-gradient(180deg, #321543 0%, #382c68 100%);
			border: 0.12rem solid #7D6CC1;
			padding-top: 1rem;
            border-radius: 0.12rem;
			.reward-list {
				height: 5.42rem;
				width: 6.44rem;
				padding-left: 0.25rem;
				padding-right: 0.25rem;
				display: flex;
				overflow-y: scroll;
				flex-wrap: wrap;
				.reward-item {
					width: 1.8rem;
					height: 2.7rem;
					margin-right: 0.18rem;
					.reward-img {
						width: 1.8rem;
						height: 1.8rem;
						background-image: url(https://yaame-static.yaame.io/admin/1eda2e28017feaae8728408f588e5f15.png);
						background-size: contain;
						background-repeat: no-repeat;
						position: relative;
						.gift {
							width: 1.6rem;
							height: 1.6rem;
							position: absolute;
							top: 0.1rem;
							left: 0.1rem;
						}
						.num {
							position: absolute;
							right: 0;
							top: 0;
							width: 0.46rem;
							height: 0.26rem;
							line-height: 0.26rem;
							background-image: url(https://yaame-static.yaame.io/admin/0fe2dd0857a9beaeeb3d5a29ff30ee71.png);
							background-size: contain;
							background-repeat: no-repeat;
							p {
								font-size: 0.24rem;
								font-weight: 600;
								color: #ffffff;
								transform: scale(0.75);
								width: 0.6rem;
								margin-left: -0.07rem;
								text-align: center;
							}
						}
					}
					.reward-name {
						width: 1.8rem;
						font-size: 0.26rem;
						font-weight: 600;
						color: #ffffff;
						text-align: center;
						margin-top: 0.08rem;
					}
					.reward-day {
						width: 1.8rem;
						font-size: 0.26rem;
						font-weight: 600;
						color: #ffffff;
						transform: scale(0.75);
						text-align: center;
						img {
							width: 0.19rem;
							height: auto;
							vertical-align: middle;
						}
					}
				}
			}
			.btn-list {
				width: 6.16rem;
				height: 0.94rem;
				display: flex;
				justify-content: space-between;
				padding: 0 0.2rem;
				margin-top: 0.5rem;
				.btn-item {
					width: 1.91rem;
					height: 0.94rem;
					img {
						width: 1.91rem;
						height: 0.94rem;
					}
				}
			}
		}
		.record-popup {
			width: 6.42rem;
			height: 8.21rem;
			background-image: url(https://yaame-static.yaame.io/admin/bbdbf067b4361568a1b64126508c180a.png);
			background-size: contain;
			background-repeat: no-repeat;
			position: relative;
			padding-top: 0.7rem;
			padding-left: 0.12rem;
			padding-right: 0.12rem;
			.record-list {
				width: 6.18rem;
				height: 6.81rem;
				overflow-y: scroll;
				.record-item {
					width: 6.18rem;
					padding-left: 0.18rem;
					padding-right: 0.18rem;
					font-size: 0.24rem;
					font-weight: 400;
					color: rgba(255, 255, 255, 0.5);
				}
				.gift-list {
					width: 5.96rem;
					display: flex;
					flex-wrap: wrap;
					padding-top: 0.2rem;
					.gift-item {
						flex-basis: 0.79rem;
						flex-shrink: 0;
						width: 0.79rem;
						height: 0.82rem;
						margin-right: 0.4rem;
						position: relative;
						display: flex;
						justify-content: center;
						align-items: center;
						margin-bottom: 0.3rem;
						.num {
							position: absolute;
							right: -0.2rem;
							top: -0.14rem;
							width: 0.46rem;
							height: 0.26rem;
							line-height: 0.26rem;
							background-image: url(https://yaame-static.yaame.io/admin/0fe2dd0857a9beaeeb3d5a29ff30ee71.png);
							background-size: contain;
							background-repeat: no-repeat;
							p {
								font-size: 0.24rem;
								font-weight: 600;
								color: #ffffff;
								transform: scale(0.75);
								width: 0.6rem;
								margin-left: -0.07rem;
								text-align: center;
							}
						}
						img {
							width: 0.82rem;
							height: 0.82rem;
						}
					}
				}
			}
		}
		.close-icon {
			position: absolute;
			width: 0.62rem;
			height: 0.62rem;
			bottom: -0.96rem;
			left: 50%;
			transform: translateX(-50%);
		}
		.popup-title {
			width: 4.78rem;
			height: 0.79rem;
			background-image: url(https://yaame-static.yaame.io/admin/318f80f94f47aa73f8244833b0f45276.png);
			background-size: contain;
			background-repeat: no-repeat;
			position: absolute;
			top: -0.32rem;
			left: 0.84rem;
			text-align: center;
			line-height: 0.79rem;
			color: #f2edfc;
			font-size: 0.34rem;
			font-weight: bolder;
		}
	}
}
.empty-div {
	width: 6.18rem;
	height: 2.2rem;
	font-size: 0.24rem;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 400;
	color: #eddab0;
	img {
		width: 1.8rem;
		height: 1.8rem;
		margin-left: 2.19rem;
	}
	p {
		text-align: center;
		margin-top: 0.02rem;
	}
}
</style>
