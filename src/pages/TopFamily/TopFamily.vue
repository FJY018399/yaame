<template>
	<refresh ref="wlRefresh" @onRefresh="handleRefresh">
		<div :class="['main', language]">
			<img
				class="rule-icon"
				:src="ruleImgList[language]"
				@click="ruleVisible = true"
			/>

			<customHeader
				:language="language"
				color="white"
				style="position: fixed"
				>{{ $t("title") }}</customHeader
			>
			<div class="time-container">
				<div
					v-for="(item, k, index) in timeInfo"
					:key="k"
					:class="['time-' + index]"
				>
					{{ item }}
				</div>
			</div>

			<div
				:style="{
					'background-image': `url(${tabImgList[language][tabActive]})`,
				}"
				class="tab-container"
			>
				<div @click="tabChange('family')"></div>
				<div @click="tabChange('rank')"></div>
			</div>

			<div v-show="tabActive === 'family'" class="family-container">
				<img
					class="top-img"
					src="https://yaame-static.yaame.io/admin/04b0d636a253c9cc34f03d72d3577029.png"
					alt=""
				/>
				<!-- <img class="bottom-img" src="" alt=""> -->
				<div class="list-tab">
					<div
						v-for="(item, index) in familyTabList"
						:key="index"
						:class="[familyTabActive === item.key && 'active']"
						@click="familyTabActive = item.key"
					>
						{{ $t(item.key) }}
					</div>
				</div>

				<div v-if="familyTabActive === 'rank'" class="top-list">
					<div
						v-for="(item, index) in topList"
						:key="index"
						:class="['top-' + index]"
					>
						<div class="avatar" @click="toDetails(item.scheme_url)">
							<img class="user-avatar" :src="item.avatar" alt="" />
							<img
								v-if="index === 0"
								class="dress"
								src="https://yaame-static.yaame.io/admin/6651a68275401efe2135c280a3507a57.png"
								alt=""
							/>
							<img
								v-if="index === 1"
								class="dress"
								src="https://yaame-static.yaame.io/admin/7b15f606f1258b58aafb946c6aa4d902.png"
								alt=""
							/>
							<img
								v-if="index === 2"
								class="dress"
								src="https://yaame-static.yaame.io/admin/a7bffa104d30a4556cadfcd8709b637b.png"
								alt=""
							/>
						</div>
						<p class="user-name no-wrap">{{ item.name }}</p>
						<span class="top-lv">
							<img
								src="https://yaame-static.yaame.io/admin/f3282d97dbb04e690a036b2e1558839d.png"
								alt=""
							/>
							<p>{{ item.member_cnt }}</p>
						</span>

						<p
							:style="{
								width: index === 0 ? '2.8rem' : '2.2rem',
								'margin-left': '-0.3rem',
							}"
							class="user-name no-wrap"
						>
							<img
								src="https://yaame-static.yaame.io/admin/14b21f01b994640ff51e594597b4a866.png"
								alt=""
							/>

							{{ item.integral }}
						</p>
					</div>
				</div>

				<div v-if="familyTabActive === 'rank'" class="user-list">
					<div v-for="(item, index) in list" :key="index" class="user-item">
						<div class="sort">{{ item.family_rank }}</div>

						<img
							class="user-avatar"
							:src="item.avatar"
							@click="toDetails(item.scheme_url)"
						/>

						<div class="user-item-info">
							<p class="no-wrap">
								{{ item.name }}
							</p>
							<span class="user-lv">
								<img
									src="https://yaame-static.yaame.io/admin/f3282d97dbb04e690a036b2e1558839d.png"
									alt=""
								/>
								<p>{{ item.member_cnt }}</p>
							</span>
						</div>

						<div class="value">
							<img
								src="https://yaame-static.yaame.io/admin/14b21f01b994640ff51e594597b4a866.png"
								alt=""
							/>

							{{ item.integral }}
						</div>
					</div>
				</div>

				<p v-if="topList.length === 0 && list.length === 0" class="empty-p">
					{{ $t("emptyText") }}
				</p>

				<div v-if="hasFamily" class="user-info">
					<div v-if="my_family_rank.family_rank > 0" class="sort">
						{{
							my_family_rank.family_rank >= 100
								? "99+"
								: my_family_rank.family_rank
						}}
					</div>
					<div v-else class="sort">99+</div>
					<img
						class="user-avatar"
						:src="my_family_rank.avatar"
						@click="toDetails(my_family_rank.scheme_url)"
					/>

					<div class="user-item-info">
						<p class="no-wrap">
							{{ my_family_rank.name }}
						</p>
						<span class="user-lv">
							<img
								src="https://yaame-static.yaame.io/admin/f3282d97dbb04e690a036b2e1558839d.png"
								alt=""
							/>
							<p>{{ my_family_rank.member_cnt }}</p>
						</span>
					</div>

					<div class="value">
						<img
							src="https://yaame-static.yaame.io/admin/14b21f01b994640ff51e594597b4a866.png"
							alt=""
						/>

						{{ my_family_rank.integral }}
					</div>
				</div>

				<div v-else class="join-btn">
					<div class="join" @click="joinFamily">{{ $t("joinFamily") }}</div>
					<div class="create" @click="createFamily">
						{{ $t("createFamily") }}
					</div>
				</div>

				<div v-if="familyTabActive === 'reward'" class="list-reward">
					<div
						v-for="(item, index) in reward_item_groups"
						:key="index"
						class="list-reward-item"
					>
						<div class="title-img">{{ $t(`top_${index + 1}`) }}</div>

						<div class="item-list">
							<div
								v-for="(ele, inx) in item.reward_item_vo_list"
								:key="inx"
								class="reward-item"
							>
								<div class="avatar">
									<img :src="ele.icon" alt="" />
									<span v-if="ele.object_type !== 'GIFT'" class="num">{{
										ele.validity_date
									}}</span>
								</div>
								<p class="reward-name no-wrap">{{ ele.gift_name }}</p>
								<p class="reward-name">
									<img
										src="https://yaame-static.yaame.io/admin/9ebec8ae9facb2f66be718b747d16ea4.png"
										alt=""
									/>
									{{ ele.diamond_worth }}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div v-show="tabActive === 'rank'" class="rank-container">

                <img
					class="top-img"
					src="https://yaame-static.yaame.io/admin/04b0d636a253c9cc34f03d72d3577029.png"
					alt=""
				/>
				<div
					v-for="(item, index) in reward_item_group_list"
					:key="index"
					:class="[
						'reward-content',
						item.reward_item_vo_list.length >= 4 && 'big',
						item.reward_item_vo_list.length === 4 && 'big-4',
					]"
				>
					<p class="title-p">{{ $t("ContributionReach", [item.point]) }}</p>

					<div class="reward-nav">
						<div
							v-for="(ele, inx) in item.reward_item_vo_list"
							:key="inx"
							class="reward-item"
						>
							<div class="avatar">
								<img :src="ele.icon" alt="" />
								<span v-if="ele.object_type !== 'GIFT'" class="num">{{
									ele.isCustom
										? $t("day", [ele.diamond_worth])
										: ele.diamond_worth
								}}</span>
							</div>
							<p class="reward-name no-wrap">
								{{ ele.isCustom ? $t(ele.gift_name) : ele.gift_name }}
							</p>
							<p v-if="ele.reward_diamond_worth" class="reward-name">
								<img
									src="https://yaame-static.yaame.io/admin/9ebec8ae9facb2f66be718b747d16ea4.png"
									alt=""
								/>
								{{ ele.reward_diamond_worth }}
							</p>
						</div>
					</div>

					<div
						:class="['reward-btn', item.receive_status !== 1 && 'disabled']"
						@click="claimReward(item)"
					>
						{{ item.receive_status === 2 ? $t("received") : $t("receive") }}
					</div>
				</div>

				<div v-if="hasFamily" class="process">
					<div class="title-p">
						{{ $t("myContributions") }}:{{ user_point }}
					</div>
					<div class="process-bar">
						<div
							:style="{ width: calculatePercentage(user_point) }"
							class="process-content"
						></div>
						<p class="process-text">{{ user_point }}/10000000</p>
					</div>
				</div>
				<div v-else class="join-btn">
					<div class="join" @click="joinFamily">{{ $t("joinFamily") }}</div>
					<div class="create" @click="createFamily">
						{{ $t("createFamily") }}
					</div>
				</div>
			</div>

			<popup v-if="ruleVisible" class="flex-container">
				<div :style="{ 'text-align': language === 'ar' && 'right !important' }" class="rule-modal">
					<div class="title-img">{{ $t("rule") }}</div>

					<div class="rule-container">
						<p class="title">{{ $t("activityTime") }}</p>
						<p>{{ $t("rule1") }}</p>
						<p style="margin-bottom: 0.2rem">{{ $t("rule2") }}</p>
						<p class="title">{{ $t("ruleIntro") }}</p>

						<div class="table-content">
							<div>
								<p class="title">{{ $t("ruleTask") }}</p>
								<p class="title">{{ $t("rulePoint") }}</p>
							</div>
							<div>
								<p class="empty">{{ $t("ruleLogin") }}</p>
								<p class="empty">{{ $t("ruleDailyPlus10") }}</p>
							</div>
							<div>
								<p class="empty">{{ $t("ruleMicTime") }}</p>
								<p class="empty">{{ $t("ruleDailyPlus50") }}</p>
							</div>
							<div>
								<p class="empty">{{ $t("ruleRoomTime") }}</p>
								<p class="empty">{{ $t("ruleDailyPlus50") }}</p>
							</div>
							<div>
								<p class="empty">{{ $t("ruleSendGift") }}</p>
								<p class="empty">{{ $t("ruleDiamondConvert") }}</p>
							</div>
							<div>
								<p class="empty">{{ $t("ruleReceiveGift") }}</p>
								<p class="empty">{{ $t("ruleDiamondConvert") }}</p>
							</div>
						</div>

						<p>{{ $t("ruleEndTimeNotice") }}</p>
						<p class="title">{{ $t("ruleAwards") }}</p>
						<p class="title">{{ $t("ruleAward1") }}</p>
						<p style="margin-bottom: 0.2rem">{{ $t("ruleFamilyReward") }}</p>

						<p class="title">{{ $t("ruleAward2") }}</p>
						<p>{{ $t("ruleContributionReward") }}</p>

						<div class="rule-footer">{{ $t("ruleFinalExplaination") }}</div>
					</div>

					<img
						class="close-icon"
						src="https://yaame-static.yaame.io/admin/79222af11106043ee723f15883d20810.png"
						alt=""
						@click="ruleVisible = false"
					/>
				</div>
			</popup>
		</div>
	</refresh>
</template>
<script>
import customHeader from "../../components/common/header.vue";
import popup from "../../components/common/pop_up.vue";
import request from "../../lib/request/family.js";
import { getSafeHeight, getLanguage } from "../../lib/device.js";
import { getFamilyRank, claimFamilyReward, getFamilyRewardInfo } from "./api";
import Toast from "../../components/third/toast/toast";
import refresh from "../../components/common/refresh.vue";
export default {
	components: {
		customHeader,
		popup,
		refresh,
	},
	data() {
		return {
			safe_height: 0,
			timeInfo: {
				dayLeft: 0,
				dayRight: 0,
				hours: 0,
				minutes: 0,
				seconds: 0,
			},

			tabImgList: {
				"zh-cn": {
					family:
						"https://yaame-static.yaame.io/admin/dde8db8c386a77ecad4a7f489f21655b.png",
					rank: "https://yaame-static.yaame.io/admin/cb666638d16a8f6c608b0aef9470398e.png",
				},
				"zh-tw": {
					family:
						"https://yaame-static.yaame.io/admin/7e61b2e08bdffd8186b7d06a8020d42a.png",
					rank: "https://yaame-static.yaame.io/admin/7e3a028017bf90cc91af50a44881029e.png",
				},
				en: {
					family:
						"https://yaame-static.yaame.io/admin/8697eb52fb7e00f411acdf4d56681b17.png",
					rank: "https://yaame-static.yaame.io/admin/9d5a0310262056197d83d7ff783c3438.png",
				},
				id: {
					family:
						"https://yaame-static.yaame.io/admin/111ce707f14c8620284a7c2c0ea500e0.png",
					rank: "https://yaame-static.yaame.io/admin/992a74b9b96570f33929ded402ba06f5.png",
				},
				ar: {
					family:
						"https://yaame-static.yaame.io/admin/71f8ac2d1b0d56f34f69476e1c8700ce.png",
					rank: "https://yaame-static.yaame.io/admin/9c636006dc23583e1c43c1e5dbab9a42.png",
				},
			},

			tabActive: "family",

			familyTabList: [{ key: "rank" }, { key: "reward" }],
			familyTabActive: "rank",

			topList: [],

			list: [],

			reward_item_group_list: [],
			user_point: 0,
			reward_item_groups: [],

			hasFamily: false,

			ruleVisible: false,
			ruleImgList: {
				"zh-cn":
					"https://yaame-static.yaame.io/admin/17965d121184fbd7a3c682893c91ba1d.png",
				"zh-tw":
					"https://yaame-static.yaame.io/admin/566ae7d83e8b8742aeb4911d18187e61.png",
				en: "https://yaame-static.yaame.io/admin/e9cba855d81c1f24dcb5520d63b262fc.png",
				id: "https://yaame-static.yaame.io/admin/7744581533edf6a0e82f1cf7962c2165.png",
				ar: "https://yaame-static.yaame.io/admin/bc3a45f7b31a33bdc18408f1baab8aad.png",
			},
			refreshData: null,
			timeInterval: null,


            num: 1
		};
	},
	mounted() {
		const safe_area = getSafeHeight() || 40;
		this.safe_height = (safe_area * 2) / 100;

		this.getData();
		this.getReward();
		this.getCountdown();
		this.timeInterval = setInterval(() => {
			this.getCountdown();
		}, 1000);

		this.refreshData = setInterval(() => {
			this.getData();
		}, 3000);
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
	destroyed() {
		clearInterval(this.refreshData);
		clearInterval(this.timeInterval);
	},
	methods: {
		tabChange(val) {
			this.tabActive = val;
		},
		async getData() {
			try {
				let res = await getFamilyRank();
				if (res.status !== 1000) return;
				console.log(res);

				this.reward_item_groups = res.data.reward_item_groups;

				if (res.data.content.length > 0) {
					this.topList = res.data.content.slice(0, 3);
					this.list = res.data.content.slice(3);
				} else {
					this.topList = [];
					this.list = [];
				}

				if (res.data.my_family_rank) {
					this.hasFamily = true;
					this.my_family_rank = res.data.my_family_rank;
				} else {
					this.hasFamily = false;
				}
			} catch (e) {
				console.log(e);
			}
		},
		async getReward() {
			try {
				let res = await getFamilyRewardInfo();
				if (res.status !== 1000) return;

				let last =
					res.data.reward_item_group_list[
						res.data.reward_item_group_list.length - 1
					].reward_item_vo_list;

				let arr = [
					{
						icon: "https://yaame-static.yaame.io/admin/544cef2d627ad5d527269c4d496c165c.png",
						diamond_worth: "7",
						reward_diamond_worth: "59999",
						object_type: "DRESS",
						gift_name: "topAvatar",
						isCustom: true,
					},
					last[0],
					last[1],
					{
						icon: "https://yaame-static.yaame.io/admin/02bdb6fa4eb989ba8c99312c9550c8b6.png",
						diamond_worth: "7",
						reward_diamond_worth: "99999",
						object_type: "DRESS",
						gift_name: "topCar",
						isCustom: true,
					},
					last[2],
					{
						icon: "https://yaame-static.yaame.io/admin/02bdb6fa4eb989ba8c99312c9550c8b6.png",
						diamond_worth: "7",
						reward_diamond_worth: "",
						object_type: "DRESS",
						gift_name: "topDress",
						isCustom: true,
					},
				];
				res.data.reward_item_group_list[
					res.data.reward_item_group_list.length - 1
				].reward_item_vo_list = arr;
				this.reward_item_group_list = res.data.reward_item_group_list;
				this.user_point = res.data.user_point;
			} catch (e) {
				console.log(e);
			}
		},
		async claimReward(item) {
			if (item.receive_status !== 1) {
				return;
			}
			try {
				let res = await claimFamilyReward({ reward_id: item.reward_id });
				if (res.status === 1000) {
					Toast(this.$t("ruleGiftInBag"));
				}
				this.getData();
				this.getReward();
			} catch (e) {
				console.log(e);
			}
		},
		calculatePercentage(number, denominator = 1000000) {
			if (number <= 0) {
				return "0%";
			} else if (number >= denominator) {
				return "100%";
			} else {
				const percentage = (number / denominator) * 100;
				return percentage.toFixed(2) + "%";
			}
		},
		getCountdown() {
			// 获取当前时间
			const now = new Date();

			// 设置目标时间
			const target = new Date(Date.UTC(now.getUTCFullYear(), 10, 13));

			// 计算剩余时间
			const timeDiff = target.getTime() - now.getTime();

			// 确保目标日期在未来
			if (timeDiff <= 0) {
				this.timeInfo = {
					dayLeft: 0,
					dayRight: "D",
					hours: "00",
					minutes: "00",
					seconds: "00",
				};
				return;
			}

			// 将时间差转换为自然时间单位
			let days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
			let hours = Math.floor(
				(timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
			);
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

			this.timeInfo = { dayLeft, dayRight, hours, minutes, seconds };
		},
		joinFamily() {
			location.href = "./familyRank.html?is_full_screen=1&active=NEW";
		},
		createFamily() {
			location.href = "wlyaame://family/editor?from=from_create";
		},
		toDetails(val) {
			location.href = val;
		},

		deepClone(obj) {
			let copy;

			// 处理日期和正则对象
			if (obj instanceof Date) {
				copy = new Date();
				copy.setTime(obj.getTime());
				return copy;
			}

			if (obj instanceof RegExp) {
				copy = new RegExp(obj);
				return copy;
			}

			if (obj instanceof Array) {
				copy = [];
				for (let i = 0, len = obj.length; i < len; i++) {
					copy[i] = deepClone(obj[i]);
				}
				return copy;
			}

			if (obj instanceof Object) {
				copy = {};
				for (let attr in obj) {
					if (obj.hasOwnProperty(attr)) {
						copy[attr] = deepClone(obj[attr]);
					}
				}
				return copy;
			}

			throw new Error("Unable to copy obj! Its type isn't supported.");
		},
		/**
		 * @description: 上拉刷新fun
		 */
		async handleRefresh() {
			await this.getData();
			setTimeout(() => {
				this.$refs.wlRefresh.isLoading = false;
			}, 500);
		},
	},
};
</script>
<style scoped lang="less">
.main {
	width: 7.5rem;
	background: #201816;
	min-height: 100vh;
	background-size: contain;
	background-repeat: no-repeat;
	font-size: 0.24rem;
	padding-top: 6.68rem;
	&.zh-cn {
		background-image: url(https://yaame-static.yaame.io/admin/b5b0f1884b07ac6188a8ba5120d38574.png);
	}
	&.zh-tw {
		background-image: url(https://yaame-static.yaame.io/admin/d99484ec19d7658c1c98a7c93a063504.png);
	}
	&.en {
		background-image: url(https://yaame-static.yaame.io/admin/a64a629dbefc5fe6312487124700a6d5.png);
	}
	&.id {
		background-image: url(https://yaame-static.yaame.io/admin/6e97855c4e97531129b596215c4f90ea.png);
	}
	&.ar {
		// text-align: right !important;
		background-image: url(https://yaame-static.yaame.io/admin/9adb4282fc0639ba65e9bec19e995551.png);
	}
	.rule-icon {
		width: 1.26rem;
		height: auto;
		position: absolute;
		top: 1.75rem;
		right: 0;
		z-index: 3;
	}
	.time-container {
		width: 4.7rem;
		height: 0.74rem;
		background-image: url(https://yaame-static.yaame.io/admin/2b2fe52c742c34b9c587b0b01e0e755b.png);
		background-size: contain;
		background-repeat: no-repeat;
		margin-left: 1.4rem;
		position: relative;
		div {
			text-align: center;
			line-height: 0.46rem;
			font-size: 0.36rem;
			font-weight: 600;
			color: #654b35;
		}
		.time-0 {
			position: absolute;
			width: 0.36rem;
			height: 0.46rem;
			left: 0.4rem;
			top: 0.14rem;
		}
		.time-1 {
			position: absolute;
			width: 0.36rem;
			height: 0.46rem;
			left: 0.8rem;
			top: 0.14rem;
		}
		.time-2 {
			position: absolute;
			width: 0.58rem;
			height: 0.46rem;
			left: 1.63rem;
			top: 0.14rem;
		}
		.time-3 {
			position: absolute;
			width: 0.58rem;
			height: 0.46rem;
			left: 2.68rem;
			top: 0.14rem;
		}
		.time-4 {
			position: absolute;
			width: 0.58rem;
			height: 0.46rem;
			left: 3.72rem;
			top: 0.14rem;
		}
	}
	.tab-container {
		width: 6.82rem;
		height: 1.21rem;
		background-size: contain;
		background-repeat: no-repeat;
		margin-top: 0.8rem;
		display: flex;
		margin-left: 0.34rem;
        position: relative;
        z-index: 1;
		div {
			flex: 1;
		}
	}
	.family-container {
		width: 6.82rem;
		min-height: 8.5rem;
		margin-left: 0.34rem;

		background: #251f21;

		border: 0.02rem solid #5b371b;
		position: relative;
		top: 0rem;
		padding-top: 0.93rem;
		padding-bottom: 1.7rem;
		.top-img {
			width: 6.82rem;
			height: auto;
			position: absolute;
			top: -0.2rem;
			left: -0.02rem;
		}
		.empty-p {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 6.82rem;
			text-align: center;
			font-weight: 600;
			color: #f8e0aa;
		}
		.list-tab {
			margin-left: 1.15rem;
			width: 4.52rem;
			height: 0.7rem;
			background: rgba(255, 255, 255, 0.1);
			border-radius: 0.51rem;
			padding: 0.06rem;
			display: flex;
			justify-content: center;
			div {
				width: 2.2rem;
				height: 0.58rem;
				border-radius: 0.36rem;
				color: #999999;
				font-size: 0.26rem;
				text-align: center;
				line-height: 0.58rem;
				&.active {
					background: #ffffff;

					color: #8c4e20;
				}
			}
		}
		.top-list {
			margin-top: 0.4rem;
			width: 5.82rem;
			height: 3.7rem;
			margin-left: 0.5rem;
			display: flex;
			justify-content: space-between;
			padding-top: 1.02rem;
			position: relative;
			.top-0 {
				width: 2.2rem;
				height: 3.28rem;
				position: absolute;
				top: 0;
				left: 1.8rem;
				display: flex;
				flex-wrap: wrap;
				justify-content: center;
				.avatar {
					width: 2.2rem;
					height: 2.2rem;
					display: flex;
					justify-content: center;
					align-items: center;
					.dress {
						width: 2.2rem;
						height: 2.2rem;
						position: absolute;
						left: 0;
						top: 0;
					}
					.user-avatar {
						width: 1.6rem;
						height: 1.6rem;
					}
				}
				.user-name {
					width: 2.2rem;
					font-size: 0.26rem;
					font-weight: 400;
					color: #fdb45b;
					text-align: center;

					img {
						width: 0.4rem;
						height: 0.4rem;
						vertical-align: middle;
						margin-right: 0.04rem;
					}
				}
				.top-lv {
					margin: 0.08rem 0;
					// min-width: 0.83rem;
                    height: 0.3rem;
                    background: rgba(255, 255, 255, 0.22);
                    border-radius: 0.15rem;
                    padding: 0 0.12rem;
                    line-height: 0.26rem;
                    margin-top: 0.12rem;
                    img {
                        width: 0.2rem;
                        height: 0.15rem;
                        vertical-align: middle;
                    }
                    p {
                        font-size: 0.2rem;
                        font-weight: 500;
                        color: #eeeeee;
                        display: inline;
                        transform: scale(0.8333);
                        margin-left: 0.1rem;
                    }
				}
				.user-count {
					width: 2.2rem;
					font-size: 0.24rem;
					font-weight: 400;
					color: #fdb45b;
					text-align: center;
					img {
						width: 0.24rem;
						height: 0.24rem;
						vertical-align: middle;
					}
				}
			}
			.top-1,
			.top-2 {
				width: 1.6rem;
				height: 2.68rem;
				position: relative;
				display: flex;
				flex-wrap: wrap;
				justify-content: center;
				.avatar {
					width: 1.6rem;
					height: 1.6rem;
					display: flex;
					justify-content: center;
					align-items: center;
					.dress {
						width: 1.6rem;
						height: 1.6rem;
						position: absolute;
						left: 0;
						top: 0;
					}
					.user-avatar {
						width: 1.2rem;
						height: 1.2rem;
					}
				}
				.user-name {
					width: 1.6rem;
					font-size: 0.26rem;
					font-weight: 400;
					color: #fdb45b;
					text-align: center;
					img {
						width: 0.4rem;
						height: 0.4rem;
						vertical-align: middle;
						margin-right: 0.04rem;
					}
				}
				.top-lv {
					margin: 0.08rem 0;
					// min-width: 0.83rem;
                    height: 0.3rem;
                    background: rgba(255, 255, 255, 0.22);
                    border-radius: 0.15rem;
                    padding: 0 0.12rem;
                    line-height: 0.26rem;
                    margin-top: 0.12rem;
                    img {
                        width: 0.2rem;
                        height: 0.15rem;
                        vertical-align: middle;
                    }
                    p {
                        font-size: 0.2rem;
                        font-weight: 500;
                        color: #eeeeee;
                        display: inline;
                        transform: scale(0.8333);
                        margin-left: 0.1rem;
                    }
				}
				.user-count {
					width: 1.6rem;
					font-size: 0.24rem;
					font-weight: 400;
					color: #fdb45b;
					text-align: center;
					img {
						width: 0.24rem;
						height: 0.24rem;
						vertical-align: middle;
					}
				}
			}
		}
		.user-list {
			padding-top: 0.48rem;
			width: 6.26rem;
			min-height: 0;
			margin-left: 0.28rem;
			.user-item {
				width: 6.26rem;
				height: 1.39rem;
				margin-bottom: 0.22rem;
				background-size: contain;
				background-repeat: no-repeat;
				background-image: url(https://yaame-static.yaame.io/admin/10515d6291d46a684a643c3c01357e3f.png);
				display: flex;
				align-items: center;
				padding-left: 0.28rem;
				.sort {
					widows: 0.7rem;
					font-size: 0.36rem;
					text-align: center;
					font-weight: 600;
					color: #8c4e20;
				}
				.user-avatar {
					width: 0.9rem;
					height: 0.9rem;
					margin-left: 0.18rem;
					border-radius: 0.18rem;
					display: block;
				}
				.user-item-info {
					width: 3rem;
					padding-left: 0.3rem;
					font-size: 0.24rem;
					font-weight: 400;
					color: #8c4e20;
					.user-lv {
						min-width: 0.83rem;
						height: 0.3rem;
						background: rgba(0, 0, 0, 0.22);
						border-radius: 0.15rem;
						padding: 0 0.12rem;
						line-height: 0.26rem;
						margin-top: 0.12rem;
						img {
							width: 0.2rem;
							height: 0.15rem;
							vertical-align: middle;
						}
						p {
							font-size: 0.2rem;
							font-weight: 500;
							color: #eeeeee;
							display: inline;
							transform: scale(0.8333);
							margin-left: 0.1rem;
						}
					}
				}
				.value {
					width: 1.6rem;
					font-size: 0.24rem;
					font-weight: 400;
					color: #8c4e20;
					display: flex;
					flex-wrap: nowrap;
					img {
						width: 0.4rem;
						height: 0.4rem;
						vertical-align: middle;
					}
				}
			}
		}
		.user-info {
			width: 6.7rem;
			height: 1.5rem;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/f7d67f28768f1e738a8365c3e1ebe5a5.png);
			display: flex;
			align-items: center;
			padding-left: 0.22rem;
			position: fixed;
			left: 0.4rem;
			bottom: 0.4rem;
			z-index: 9;
			.sort {
				widows: 0.7rem;
				font-size: 0.36rem;
				text-align: center;
				font-weight: 600;
				color: #8c4e20;
			}
			.user-avatar {
				width: 0.9rem;
				height: 0.9rem;
				margin-left: 0.18rem;
				border-radius: 0.18rem;
				display: block;
			}
			.user-item-info {
				width: 3rem;
				padding-left: 0.3rem;
				font-size: 0.24rem;
				font-weight: 400;
				color: #8c4e20;
				.user-lv {
					min-width: 0.83rem;
					height: 0.3rem;
					background: rgba(0, 0, 0, 0.22);
					border-radius: 0.15rem;
					padding: 0 0.12rem;
					line-height: 0.26rem;
					margin-top: 0.12rem;
					img {
						width: 0.2rem;
						height: 0.15rem;
						vertical-align: middle;
					}
					text-align: right;
					p {
						font-size: 0.2rem;
						font-weight: 500;
						color: #eeeeee;
						display: inline;
						transform: scale(0.8333);
						margin-left: 0.1rem;
					}
				}
			}
			.value {
				width: 1.6rem;
				text-align: left;
				font-size: 0.24rem;
				font-weight: 400;
				color: #8c4e20;

				img {
					width: 0.4rem;
					height: 0.4rem;
					vertical-align: middle;
				}
			}
		}

		.list-reward {
			width: 6.02;
			margin-left: 0.4rem;
			height: auto;
			padding-top: 0.4rem;
			.list-reward-item {
				width: 6.02rem;
				height: 4.16rem;
				background-size: contain;
				background-repeat: no-repeat;
				background-image: url(https://yaame-static.yaame.io/admin/1d6a2c55fcb350c2c80acd6a201c398b.png);
				margin-bottom: 0.3rem;
				padding-top: 1.42rem;
				position: relative;
				.title-img {
					position: absolute;
					top: 0.66rem;
					left: 50%;
					transform: translateX(-50%);
					font-size: 0.3rem;
					font-weight: bolder;
					color: #f8e0aa;
					padding: 0 0.28rem;
					display: inline-block;
					&::after {
						content: "";
						position: absolute;
						left: 0;
						top: 0.15rem;
						width: 0.16rem;
						height: 0.16rem;
						background-image: url(https://yaame-static.yaame.io/admin/2d9c234423606506e7fddffe1a53d24c.png);
						background-size: contain;
						background-repeat: no-repeat;
					}
					&::before {
						content: "";
						position: absolute;
						right: 0;
						top: 0.15rem;
						width: 0.16rem;
						height: 0.16rem;
						background-image: url(https://yaame-static.yaame.io/admin/2c69c15cd90c7d49beeb34f9a32a0a48.png);
						background-size: contain;
						background-repeat: no-repeat;
					}
				}
				.item-list {
					width: 5.42rem;
					height: 2.54rem;
					display: flex;
					justify-content: space-between;
					margin-left: 0.3rem;
					.reward-item {
						width: 1.64rem;
						height: 2.54rem;
						.avatar {
							width: 1.64rem;
							height: 1.64rem;
							background-image: url(https://yaame-static.yaame.io/admin/b85390d196708d0ab07dc98fc963a3d3.png);
							background-size: contain;
							background-repeat: no-repeat;
							display: flex;
							justify-content: center;
							align-items: center;
							margin-bottom: 0.12rem;
							position: relative;
							img {
								width: 1.5rem;
								height: auto;
							}
							.num {
								min-width: 0.6rem;
								height: 0.28rem;
								background: linear-gradient(143deg, #f1a16b 0%, #ebbda8 100%);
								border-radius: 0.15rem;
								border: 0.02rem solid #674931;
								line-height: 0.26rem;

								text-align: center;
								padding: 0 0.12rem;
								font-size: 0.22rem;
								font-weight: 600;
								color: #633314;
								position: absolute;
								top: -0.12rem;
								right: -0.08rem;
							}
						}
						.reward-name {
							width: 1.64rem;
							text-align: center;
							font-size: 0.24rem;
							font-weight: 400;
							color: #fdb45b;
							img {
								width: 0.24rem;
								height: 0.24rem;
								vertical-align: middle;
							}
						}
					}
				}
			}
		}
	}
	.rank-container {
		width: 6.82rem;
		min-height: 5rem;
		margin-left: 0.34rem;

		background: #251f21;

		border: 0.02rem solid #5b371b;
		position: relative;
		top: 0.1rem;
		padding-top: 0.93rem;
		padding-bottom: 1.8rem;
        position: relative;
        .top-img {
			width: 6.82rem;
			height: auto;
			position: absolute;
			top: -0.2rem;
			left: -0.02rem;
		}
		.reward-content {
			width: 6.02rem;
			height: 5.12rem;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/37707a578ee7327cd0c68ddbc22ec56a.png);
			padding-top: 0.6rem;
			margin-left: 0.4rem;
			position: relative;
            margin-bottom: 0.3rem;
			&.big {
				height: 7.84rem;
				background-image: url(https://yaame-static.yaame.io/admin/87af20130edc54b54c582bda2e6a7038.png);
				.reward-nav {
					flex-wrap: wrap;
					height: 4.1rem;
					.reward-item {
						margin-top: 0.3rem;
					}
				}
			}
			&.big-4 {
				.reward-nav {
					padding: 0 0.7rem;
				}
			}
			.title-p {
				width: 6.02rem;
				text-align: center;
				font-size: 0.26rem;
				font-weight: bolder;
				color: #f8e0aa;
			}
			.reward-nav {
				width: 6.02rem;
				height: 2.54rem;
				display: flex;
				justify-content: space-around;
				padding: 0 0.12rem;
				.reward-item {
					width: 1.6rem;
					height: 2.54rem;
					margin-top: 0.4rem;
					.avatar {
						width: 1.6rem;
						height: 1.6rem;
						background-image: url(https://yaame-static.yaame.io/admin/b85390d196708d0ab07dc98fc963a3d3.png);
						background-size: contain;
						background-repeat: no-repeat;
						display: flex;
						justify-content: center;
						align-items: center;
						position: relative;
						margin-bottom: 0.14rem;
						img {
							width: 1.5rem;
							height: auto;
						}
						.num {
							min-width: 0.6rem;
							height: 0.3rem;
							background: linear-gradient(143deg, #f1a16b 0%, #ebbda8 100%);
							border-radius: 0.15rem;
							border: 0.02rem solid #674931;
							line-height: 0.26rem;
							text-align: center;
							padding: 0 0.12rem;
							font-size: 0.22rem;
							font-weight: 600;
							color: #633314;
							position: absolute;
							top: -0.12rem;
							right: -0.08rem;
						}
					}
					.reward-name {
						width: 1.6rem;
						text-align: center;
						font-size: 0.24rem;
						font-weight: 400;
						color: #fdb45b;
						img {
							width: 0.24rem;
							height: 0.24rem;
							vertical-align: middle;
						}
					}
				}
			}
			.reward-btn {
				width: 3.16rem;
				height: 0.72rem;
				background-image: url(https://yaame-static.yaame.io/admin/ae95e404796c3e5e2e5fca7b9ca8e3ce.png);
				background-size: contain;
				background-repeat: no-repeat;
				text-align: center;
				line-height: 0.72rem;
				font-size: 0.28rem;
				font-weight: 600;
				color: #8c4e20;
				position: absolute;
				left: 1.41rem;
				bottom: 0.3rem;
				&.disabled {
					opacity: 0.4;
				}
			}
		}

		.process {
			width: 6.7rem;
			height: 1.5rem;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/f7d67f28768f1e738a8365c3e1ebe5a5.png);
			position: fixed;
			left: 0.4rem;
			bottom: 0.4rem;
			padding-top: 0.3rem;
			z-index: 99;
			.title-p {
				width: 6.7rem;
				padding-left: 0.3rem;
				font-size: 0.26rem;
				font-weight: 600;
				color: #8c4e20;
			}
			.process-bar {
				width: 6.1rem;
				height: 0.28rem;
				background: rgba(49, 31, 20, 0.3);
				border-radius: 0.14rem;
				border: 0.01rem solid #d59766;
				margin-left: 0.3rem;
				text-align: center;
				position: relative;
				margin-top: 0.16rem;
				overflow: hidden;
				.process-content {
					width: 30%;
					height: 0.28rem;
					background: #d59766;
					border-radius: 0.14rem;
					border: 0.01rem solid #d59766;
					position: absolute;
					left: 0;
					top: 0;
				}
				.process-text {
					font-size: 0.2rem;
					font-weight: 600;
					color: #fef4ec;
					position: relative;
					z-index: 1;
				}
			}
		}
	}
	.join-btn {
		width: 6.7rem;
		height: 0.96rem;
		display: flex;
		justify-content: space-between;
		position: fixed;
		left: 0.4rem;
		bottom: 0.4rem;
		z-index: 99;
		div {
			text-align: center;
			line-height: 0.96rem;
			font-size: 0.3rem;
			font-weight: 600;
			color: #8c4e20;
		}
		.join {
			background-image: url(https://yaame-static.yaame.io/admin/06f56b2917fb6ded7d712aaf1b288428.png);
			background-size: contain;
			background-repeat: no-repeat;
			width: 2.4rem;
			height: 0.96rem;
		}
		.create {
			background-image: url(https://yaame-static.yaame.io/admin/4ab7e15f4dec2f8d817c89272648f71d.png);
			background-size: contain;
			background-repeat: no-repeat;
			width: 4.06rem;
			height: 0.96rem;
		}
	}
	.flex-container {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.rule-modal {
		width: 6.72rem;
		height: 11.26rem;
		background-image: url(https://yaame-static.yaame.io/admin/0f0aae5f960a724af7c5a8679c82fe6b.png);
		background-size: contain;
		background-repeat: no-repeat;
		position: relative;
		padding-top: 1.53rem;
		padding-left: 0.71rem;
		padding-right: 0.71rem;
		padding-bottom: 0.61rem;
		font-size: 0.24rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #f8e0aa;
		.title {
			font-size: 0.26rem;
			font-weight: 600;
			color: #f8e0aa;
			margin-bottom: 0.2rem;
		}
		.empty {
			font-size: 0.24rem;
			font-weight: 400;
			color: #988a6a;
		}
		.close-icon {
			width: 0.78rem;
			height: 0.78rem;
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			bottom: -0.85rem;
		}
		.title-img {
			position: absolute;
			top: 0.71rem;
			left: 50%;
			transform: translateX(-50%);
			font-size: 0.3rem;
			font-weight: bolder;
			color: #f8e0aa;
			padding: 0 0.28rem;
			display: inline-block;
			&::after {
				content: "";
				position: absolute;
				left: 0;
				top: 0.15rem;
				width: 0.16rem;
				height: 0.16rem;
				background-image: url(https://yaame-static.yaame.io/admin/2d9c234423606506e7fddffe1a53d24c.png);
				background-size: contain;
				background-repeat: no-repeat;
			}
			&::before {
				content: "";
				position: absolute;
				right: 0;
				top: 0.15rem;
				width: 0.16rem;
				height: 0.16rem;
				background-image: url(https://yaame-static.yaame.io/admin/2c69c15cd90c7d49beeb34f9a32a0a48.png);
				background-size: contain;
				background-repeat: no-repeat;
			}
		}
		.table-content {
			width: 5.3rem;
			height: auto;
			margin-bottom: 0.2rem;
			border: 0.01rem solid #dea25c;
			padding-top: 0.3rem;
			padding-bottom: 0.1rem;
			div {
				width: 5.3rem;
				padding: 0 0.3rem;
				display: flex;
				justify-content: space-between;
				margin-bottom: 0.04rem;
				font-size: 0.22rem;
				font-weight: 400;
				color: #464136;
			}
		}
		.rule-footer {
			width: 5.3rem;
			text-align: center;
			color: #464136;
			margin-top: 0.5rem;
		}
		.rule-container {
			width: 5.3rem;
			height: 9rem;
			overflow-y: scroll;
			overflow-x: hidden;
			padding-bottom: 0.4rem;
		}
	}
}
</style>
