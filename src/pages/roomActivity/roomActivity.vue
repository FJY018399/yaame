<template>
	<div class="contribution">
		<page-loading v-if="page_loading"></page-loading>
		<canvas class="reward-icon" id="canvas" @click="toReward"></canvas>
		<div
			:style="{
				paddingTop: safe_height + 'rem',
				backgroundColor: '#FC9F43',
			}"
			:class="['page-header', language === 'ar' && 'arabia-header']"
		>
			<div class="back" @click="back">
				<img
					:style="{ top: safe_height + 0.24 + 'rem' }"
					src="../../assets/img/common/icon_back_white.png"
					alt=""
				/>
			</div>
			<div class="tab3">
				<span class="active">{{ $t("title") }}</span>
			</div>
		</div>
		<div
			class="switch-div"
			:style="{
				backgroundColor: '#FC9F43',
				top: 1.68 + 'rem',
			}"
		>
			<div class="switch-box">
				<div
					v-for="(item, index) in tabList"
					:key="index"
					:class="['colorYellow', rank_type === item.value && 'active']"
					@click="changeRankType(item)"
				>
					{{ item.label }}
				</div>
			</div>
		</div>

		<div class="header">
			<img
				class="bg-img"
				src="https://static.yaame.io/admin/cf5df31a8f7b95e78059bba5631f670a.png"
				alt=""
			/>
			<!-- 前三名 -->
			<div class="top-container">
				<!-- 第一名 -->
				<div class="top-item top1">
					<div class="top-avatar">
						<div class="avatar-in" @click.stop="toRoom(top1)">
							<div class="avatar-in-in">
								<img
									v-show="top1.cover_img"
									:src="top1.cover_img"
									class="top-avatar-img"
									alt=""
								/>
							</div>

							<div
								v-show="top1.live_status"
								:class="['top1-tag-live', 'top-tag-live-' + language]"
							>
								<span class="voice">
									<img
										src="https://static.yaame.io/admin/92e4f23382c2f1c6ab0af6ba510c18bc.gif"
										alt=""
									/>
								</span>
							</div>
						</div>
						<img
							class="top-icon"
							src="https://static.yaame.io/admin/606e8a11ebcbddf69cd1dc3d258ed89e.png"
							alt=""
						/>
					</div>
					<div class="top-nick" style="margin-top: 1.65rem">
						{{ top1.room_name }}
					</div>
                    <div class="top-count" style="margin-top: 0.04rem">
						<p>{{ $t('activeNum') }}</p>
					</div>
					<div class="top-count" >
						<!-- <img
							src="https://static.yaame.io/admin/8f1cc268a594f46a953a906169e1a50f.png"
							alt=""
						/> -->
						{{ top1.room_score }}
					</div>
					<img
						class="sort-img"
						src="https://static.yaame.io/admin/1bd4915afc51cca7e3bc4e057301e6d7.png"
						alt=""
					/>
				</div>
				<!-- 第二名 -->
				<div class="top-item top2">
					<div class="top-avatar">
						<div class="avatar-in" @click.stop="toRoom(top2)">
							<div class="avatar-in-in">
								<img
									v-show="top2.cover_img"
									:src="top2.cover_img"
									class="top-avatar-img"
									alt=""
								/>
							</div>
							<div
								v-show="top2.live_status"
								:class="[
									'top1-tag-live top2-tag-live',
									'top-tag-live-' + language,
								]"
							>
								<span class="voice">
									<img
										src="https://static.yaame.io/admin/92e4f23382c2f1c6ab0af6ba510c18bc.gif"
										alt=""
									/>
								</span>
							</div>
						</div>
						<img
							class="top-icon"
							src="https://static.yaame.io/admin/7ce8c85779b5509c87aae232ce1770cd.png"
							alt=""
						/>
					</div>
					<div class="top-nick" style="margin-top: 1.65rem">
						{{ top2.room_name }}
					</div>
                    <div class="top-count" style="margin-top: 0.04rem">
						<p>{{ $t('activeNum') }}</p>
					</div>
					<div class="top-count">
						<!-- <img
							src="https://static.yaame.io/admin/8f1cc268a594f46a953a906169e1a50f.png"
							alt=""
						/> -->
						{{ top2.room_score }}
					</div>
					<img
						class="sort-img"
						src="https://static.yaame.io/admin/67eb7421eac729f68c8c3970802a1733.png"
						alt=""
					/>
				</div>
				<!-- 第三名 -->
				<div class="top-item top3">
					<div class="top-avatar">
						<div class="avatar-in" @click.stop="toRoom(top3)">
							<div class="avatar-in-in">
								<img
									v-show="top3.cover_img"
									:src="top3.cover_img"
									class="top-avatar-img"
									alt=""
								/>
							</div>
							<div
								v-show="top3.live_status"
								:class="[
									'top1-tag-live top2-tag-live',
									'top-tag-live-' + language,
								]"
							>
								<span class="voice">
									<img
										src="https://static.yaame.io/admin/92e4f23382c2f1c6ab0af6ba510c18bc.gif"
										alt=""
									/>
								</span>
							</div>
						</div>
						<img
							class="top-icon"
							src="https://static.yaame.io/admin/1451f0dd383d2594cd9d49e41f737cfb.png"
							alt=""
						/>
					</div>
					<div class="top-nick" style="margin-top: 1.7rem">
						{{ top3.room_name }}
					</div>
                    <div class="top-count" style="margin-top: 0.04rem">
						<p>{{ $t('activeNum') }}</p>
					</div>
					<div class="top-count">
						<!-- <img
							src="https://static.yaame.io/admin/8f1cc268a594f46a953a906169e1a50f.png"
							alt=""
						/> -->
						{{ top3.room_score }}
					</div>
					<img
						class="sort-img"
						src="https://static.yaame.io/admin/1ab4f2d1ed58e0a41cc6fb2362b0b4e7.png"
						alt=""
					/>
				</div>
			</div>
		</div>
		<div :style="{ marginTop: 0.3 + 'rem' }" :class="{ container: true }">
			<div :class="{ 'list-container': true, 'no-list': list && !list.length }">
				<div v-if="list && list.length">
					<div
						v-for="(item, index) in list"
						:key="index"
						class="list-item"
						@click.stop="toRoom(item)"
					>
						<div class="rank">{{ item.active_rank }}</div>
						<div class="avatar-box">
							<img
								:src="item.cover_img || default_avatar"
								class="avatar-img"
								alt=""
							/>
						</div>
						<div class="info">
							<p class="nick-name">{{ item.room_name }}</p>
							<div class="tag-box">
								<div
									v-for="(tag_item, tag_index) in item.img_tags"
									:key="tag_index"
									:class="['tag', 'tag-default']"
								>
									<img :src="tag_item.image_url" alt="" />
								</div>
								<div
									v-if="item.live_status"
									:class="['tag-live user-voice', 'tag-live-' + language]"
								>
									<span class="voice">
										<!-- <i class="first"></i>
                                            <i class="three"></i>
                                            <i class="four"></i> -->
										<img
											src="https://static.yaame.io/admin/92e4f23382c2f1c6ab0af6ba510c18bc.gif"
											alt=""
										/>
									</span>
								</div>
							</div>
						</div>
						<div class="count">
							<p>{{ $t('activeNum') }}</p>
							<p v-if="item.room_score" style="color: #666">
								<!-- <img
									style="
										width: 0.18rem;
										height: 0.18rem;
										vertical-align: middle;
									"
									src="https://static.yaame.io/admin/8f1cc268a594f46a953a906169e1a50f.png"
									alt=""
								/> -->
								{{ item.room_score }}
							</p>
						</div>
					</div>
				</div>
				<div v-if="no_person" class="empty">
					<img
						v-if="appType === 'sweet'"
						:src="define.sweet_empty_img_url"
						alt=""
					/>
					<img
						v-else-if="appType === 'cu'"
						:src="define.sweet_empty_img_url"
						alt=""
					/>
					<img v-else :src="define.empty_img_url" alt="" />
				</div>
			</div>
		</div>

		<div v-if="userInfo" class="user-info">
			<div v-if="userInfo.active_rank" class="rank">
				{{ userInfo.active_rank }}
			</div>
			<div v-else class="rank-null">99+</div>
			<div class="avatar-box" @click="toRoom(userInfo)">
				<img
					:src="userInfo.cover_img || default_avatar"
					class="avatar-img"
					alt=""
				/>
			</div>
			<div class="info">
				<p class="nick-name">{{ userInfo.room_name }}</p>
				<div class="tag-box">
					<div
						v-for="(tag_item, tag_index) in userInfo.img_tags"
						:key="tag_index"
						:class="['tag', 'tag-default']"
					>
						<img :src="tag_item.image_url" alt="" />
					</div>

					<div
						v-if="userInfo.live_status"
						:class="['tag-live user-voice', 'tag-live-' + language]"
					>
						<span class="voice">
							<!-- <i class="first"></i>
                                            <i class="three"></i>
                                            <i class="four"></i> -->
							<img
								src="https://static.yaame.io/admin/92e4f23382c2f1c6ab0af6ba510c18bc.gif"
								alt=""
							/>
						</span>
					</div>
				</div>
			</div>
			<div class="user-count">
				<div
					v-if="userInfo.active_rank === -1"
					:style="{ right: userInfo.active_rank > 1 ? '-1.5rem' : '0' }"
					class="user-btn"
					@click="showGift"
				>
					我要冲榜
				</div>
				<span v-if="userInfo.active_rank >= 1" style="color: #666">
                    <p>{{ $t('activeNum') }}</p>
					<p v-if="userInfo.room_score" style="color: #666">
						<!-- <img
							style="width: 0.18rem; height: 0.18rem; vertical-align: middle"
							src="https://static.yaame.io/admin/8f1cc268a594f46a953a906169e1a50f.png"
							alt=""
						/> -->
						{{ userInfo.room_score }}
					</p>
				</span>
			</div>
		</div>

        <div v-else class="create-room">
            <div class="btn" @click="createRoom">{{ $t('createRoom') }}</div>
            <p>{{ $t('createRoomInfo') }}</p>
        </div>
	</div>
</template>
<script>
import request from "../../lib/request/contribution.js";
import Toast from "../../components/third/toast/toast";
import { getQueryString, getScrollTop } from "../../lib/utils";
import { getSafeHeight, getAppType, getLanguage } from "../../lib/device";
import commonButton from "../../components/common/button.vue";
import pageLoading from "../../components/common/page_loading.vue";
import refresh from "../../components/common/refresh.vue";
import customHeader from "../../components/common/header.vue";
import icon_girl from "../../assets/img/common/icon_girl.png";
import icon_boy from "../../assets/img/common/icon_boy.png";
import define from "../../lib/define.js";
import { Downloader, Parser, Player } from "svga.lite";
const getDefaultUser = () => {
	return {
		avatar: "",
		room_name: "-",
		room_score: 0,
	};
};

export default {
	components: {
		pageLoading,
		refresh,
		customHeader,
		commonButton,
	},
	filters: {
		count_filter(val) {
			if (val && val > 9999) {
				return (val / 10000).toFixed(2) + "w";
			}
			return val;
		},
	},
	data() {
		return {
			rank_type: "voice_room_active_current_info_item",
			top1: getDefaultUser(),
			top2: getDefaultUser(),
			top3: getDefaultUser(),
			list: [],
			page_loading: true,
			safe_height: 0,
			no_person: false,
			images: {
				sex_0: icon_girl,
				sex_1: icon_boy,
			},
			define,
			default_avatar:
				"https://static.yaame.io/admin/e4a419c9d7d94db41ea41e3f810a3759.png",
			userInfo: false,
			appType: getAppType(),

			downloader: null,
			parser: null,
			player: null,
			svgaData: null,

			tabList: [],
		};
	},
	computed: {
		language() {
			return getLanguage() || "en";
		},
		dateRanges() {
			const today = new Date();
			const currentDate = today.getDate();
			const currentMonth = today.getMonth();
			const currentYear = today.getFullYear();

			const lastHalfStartDate = new Date(currentYear, currentMonth, 1);
			const lastHalfEndDate = new Date(currentYear, currentMonth, 15);

			const currentMonthDays = new Date(
				currentYear,
				currentMonth + 1,
				0
			).getDate();
			const currentHalfStartDate = new Date(currentYear, currentMonth, 16);
			const currentHalfEndDate = new Date(
				currentYear,
				currentMonth,
				Math.min(31, currentMonthDays)
			);

			const formattedLastHalfStartDate = this.formatDate(lastHalfStartDate);
			const formattedLastHalfEndDate = this.formatDate(lastHalfEndDate);
			const formattedCurrentHalfStartDate =
				this.formatDate(currentHalfStartDate);
			const formattedCurrentHalfEndDate = this.formatDate(currentHalfEndDate);

			const formatMonthAndDate = (dateStr) => {
				const parts = dateStr.split("-");
				return `${parts[1]}.${parts[2]}`;
			};

			if (this.language === "ar") {
				return currentDate >= 16
					? [
							{
								time:
									formatMonthAndDate(formattedCurrentHalfStartDate) +
									"-" +
									formatMonthAndDate(formattedCurrentHalfEndDate),
								key: "current",
							},
							{
								time:
									formatMonthAndDate(formattedLastHalfStartDate) +
									"-" +
									formatMonthAndDate(formattedLastHalfEndDate),
								key: "prev",
							},
					  ]
					: [
							{
								time:
									formatMonthAndDate(formattedLastHalfStartDate) +
									"-" +
									formatMonthAndDate(formattedLastHalfEndDate),
								key: "prev",
							},
							{
								time:
									formatMonthAndDate(formattedLastHalfStartDate) +
									"-" +
									formatMonthAndDate(formattedCurrentHalfEndDate),
								key: "current",
							},
					  ];
			} else {
				return currentDate >= 16
					? [
							{
								time:
									formatMonthAndDate(formattedLastHalfStartDate) +
									"-" +
									formatMonthAndDate(formattedLastHalfEndDate),
								key: "prev",
							},
							{
								time:
									formatMonthAndDate(formattedCurrentHalfStartDate) +
									"-" +
									formatMonthAndDate(formattedCurrentHalfEndDate),
								key: "current",
							},
					  ]
					: [
							{
								time:
									formatMonthAndDate(formattedLastHalfStartDate) +
									"-" +
									formatMonthAndDate(formattedLastHalfEndDate),
								key: "prev",
							},
							{
								time:
									formatMonthAndDate(formattedCurrentHalfStartDate) +
									"-" +
									formatMonthAndDate(formattedLastHalfEndDate),
								key: "current",
							},
					  ];
			}
		},
	},
	mounted() {
		const safe_area = getSafeHeight() || 40;
		this.safe_height = (safe_area * 2) / 100;
		this.getData();

		this.initSVGAData();
	},
	methods: {
		showGift() {
			// 我要冲榜
			location.href = "wlyaame://voice/room/gift";
		},
		toReward() {
			location.href = "./roomActivityRules.html";
		},
		changeRankType(item) {
			this.rank_type = item.value;
			this.getData();
		},
		async getData() {
			let res = await request.getRoomActiveRank();
			this.page_loading = false;
			if (res.status !== 1000) return;
			this.tabList = [
				{
					label: res.data.voice_room_active_last_info_item.last_cycle,
					value: "voice_room_active_last_info_item",
				},
				{
					label: res.data.voice_room_active_current_info_item.current_cycle,
					value: "voice_room_active_current_info_item",
				},
			];

			if (
				res.data[this.rank_type] &&
				res.data[this.rank_type].voice_room_active_ranking_by_cycle_list
					.length >= 3
			) {
				this.top1 =
					res.data[this.rank_type].voice_room_active_ranking_by_cycle_list[0];
				this.top2 =
					res.data[this.rank_type].voice_room_active_ranking_by_cycle_list[1];
				this.top3 =
					res.data[this.rank_type].voice_room_active_ranking_by_cycle_list[2];
			} else {
                this.list = [];
                this.top1 = getDefaultUser();
                this.top2 = getDefaultUser();
                this.top3 = getDefaultUser();
            }

			if (
				res.data[this.rank_type] &&
				res.data[this.rank_type].voice_room_active_ranking_by_cycle_list
					.length >= 3
			) {
				this.list = res.data[
					this.rank_type
				].voice_room_active_ranking_by_cycle_list.slice(
					3,
					res.data[this.rank_type].voice_room_active_ranking_by_cycle_list
						.length
				);
			} else {
                this.list = [];
                this.top1 = getDefaultUser();
                this.top2 = getDefaultUser();
                this.top3 = getDefaultUser();
            }
			if (this.rank_type === "voice_room_active_last_info_item") {
				if (
					res.data.voice_room_active_last_info_item
						.my_last_voice_room_active_info_item
				) {
					this.userInfo =
						res.data.voice_room_active_last_info_item.my_last_voice_room_active_info_item;
				} else {
					this.userInfo = false;
				}
			} else {
				if (
					res.data.voice_room_active_current_info_item
						.my_voice_room_active_info_item
				) {
					this.userInfo =
						res.data.voice_room_active_current_info_item.my_voice_room_active_info_item;
				} else {
					this.userInfo = false;
				}
			}

			console.log(this.userInfo, "this.userInfo");
		},
		back() {
			location.href = "wlyaame://webview/back";
		},
		toRoom(item) {
			window.location.href = `wlyaame://voice/room/live?room_id=${item.room_id}&jump_from=visitor`;
		},
		changeTab(tab) {
			this.tab = tab;
			this.getData();
			this.sendPageView();
		},
		getMonday(date) {
			let day = date.getDay();
			let deltaDay;
			if (day === 0) {
				deltaDay = 6;
			} else {
				deltaDay = day - 1;
			}
			let monday = new Date(date.getTime() - deltaDay * 24 * 60 * 60 * 1000);
			monday.setHours(0);
			monday.setMinutes(0);
			monday.setSeconds(0);
			return new Date(monday).getTime();
		},
		getPrevMonday(date) {
			let prevDayNum = date.getTime();
			let prevDay = new Date(prevDayNum - 1000 * 60 * 60 * 24 * 7);
			let day = new Date(prevDayNum - 1000 * 60 * 60 * 24 * 7).getDay();
			let deltaDay;
			if (day === 0) {
				deltaDay = 6;
			} else {
				deltaDay = day - 1;
			}
			let monday = new Date(prevDay.getTime() - deltaDay * 24 * 60 * 60 * 1000);
			monday.setHours(0);
			monday.setMinutes(0);
			monday.setSeconds(0);
			return new Date(monday).getTime();
		},
		getToday() {
			return new Date().getTime();
		},
		getYesterday() {
			return new Date().getTime() - 1000 * 60 * 60 * 24;
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
				"https://static.yaame.io/admin/975053ec1867d72cc4910180a799665d.svga"
			);
			this.svgaData = await this.parser.do(fileData);

			this.player.set({ loop: 0 });

			await this.player.mount(this.svgaData);
			this.player.start();
		},

		formatDate(date) {
			const year = date.getFullYear();
			const month = (date.getMonth() + 1).toString().padStart(2, "0");
			const day = date.getDate().toString().padStart(2, "0");
			return `${year}-${month}-${day}`;
		},
        createRoom() {
            location.href = "wlyaame://voice/room/create";
        },
	},
};
</script>
<style scoped>
#canvas {
	width: 0.92rem;
	height: 0.92rem;
	position: fixed;
	right: 0.2rem;
	top: 6.9rem;
	z-index: 99999;
}
.contribution {
	/* background: #17132B; */
	min-height: 100vh;
}
.bg-img {
	position: absolute;
	width: 100%;
	z-index: -1;
	top: -1px;
}
.container {
	width: 100%;
	padding: 0.2rem 0.3rem 0;
	font-family: PingFangSC-Medium, PingFang SC;
	background-color: #fff;
	border-top-right-radius: 0.3rem;
	border-top-left-radius: 0.3rem;
	position: relative;
	top: -0.5rem;
	/* position: sticky;
    top: 10px; */
	left: 0;
	z-index: 4;
	padding-bottom: 1.19rem;
	padding-top: 0.3rem;
	min-height: 5rem;
}
/* .refresh{
    position: sticky;
    top: 10px;
    z-index: 999;
} */
.no-list {
	height: 50vh;
	display: flex;
	align-items: center;
	justify-content: center;
}
.bottom-box {
	width: 100%;
	position: fixed;
	bottom: 0;
	padding-bottom: 0.4rem;
}

.bottom-btn {
	margin: 0 auto;
}

.tag-box {
	display: flex;
}

.tag-box .tag {
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	margin-right: 0.1rem;
}

.tag-age {
	width: 0.74rem;
	height: 0.3rem;
	border-radius: 0.25rem;
	font-size: 0.2rem;
}
.tag-live {
	width: 1.02rem;
	height: 0.3rem;
	background-image: url("https://static.yaame.io/admin/37711911a9134b174bfd80e3f188f7d4.png");
	background-size: 1.02rem 0.3rem;
	padding-left: 0.1rem;
	padding-bottom: 0.03rem;
}
.tag-live-en {
	background-image: url("https://static.yaame.io/admin/f5e6c46f6680f76ff3c129ec971f49c6.png");
}
.tag-live-id {
	background-image: url("https://static.yaame.io/admin/db70422aeafc7f150eea4065e2c49df6.png");
}
.tag-live-ar {
	background-image: url("https://static.yaame.io/admin/bca202e76b0a727346fe6037ac50d09e.png");
}
.user-voice.tag-live {
	transform: scale(1.1);
}
.user-voice > .voice > img {
	margin-top: 0;
	top: 0.02rem;
}
.top-tag-live {
	position: absolute;
	left: 0.2rem;
	bottom: -0.04rem;
	z-index: 10;
}

.tag-default {
	/* width: .88rem; */
	margin: 0 0.06rem;
	height: 0.3rem;
	border-radius: 0.21rem;
}

.tag-default img {
	display: block;
	width: auto;
	height: 0.3rem;
}

.tag-age img {
	display: block;
	width: 0.26rem;
	height: 0.26rem;
	height: auto;
	margin-right: 0.02rem;
}

.top-container {
	width: 6.9rem;
	height: 5.25rem;
	position: relative;
	margin: 0 auto;
}

.top-item {
	width: 2.1rem;
	position: absolute;
	/* bottom: 0; */
	border-radius: 0.2rem;
	color: #fff;
	text-align: center;
}
.top-avatar {
	width: 1.6rem;
	height: 1.6rem;
	border-radius: 50%;
	/* background: #17132B; */
	position: absolute;
	left: 0.3rem;
	top: -0.5rem;
	padding: 0.04rem;
	z-index: 3;
}
.top-icon {
	position: absolute;
	display: block;
	width: 2.16rem;
	top: -0.366rem;
	left: -0.276rem;
}
.avatar-in {
	width: 100%;
	height: 100%;
	border-radius: 50%;
	padding: 0.04rem;
	border: 1px solid;
}

.avatar-in-in {
	width: 100%;
	height: 100%;
	border: 1px solid;
	border-radius: 50%;
	position: relative;
	z-index: 2;
	background-image: url("https://static.yaame.io/admin/e4a419c9d7d94db41ea41e3f810a3759.png");
	background-size: 1.3rem 1.3rem;
	background-position: center center;
	background-repeat: no-repeat;
}
.top-avatar-img {
	display: block;
	width: 100%;
	height: 100%;
	border-radius: 50%;
	object-fit: cover;
}

.top-nick {
	width: 1.8rem;
	font-size: 0.24rem;
	line-height: 0.37rem;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	margin: 0 auto;
	font-weight: normal;
	color: rgba(255, 255, 255, 0.8);
}

.top-lv {
	display: block;
	height: 0.3rem;
	margin: 0.1rem auto 0;
}
.top-count {
	position: relative;
	z-index: 2;
	font-size: 0.22rem;
	line-height: 0.3rem;
	font-weight: normal;
	color: rgba(255, 255, 255, 0.8);
}
.top-count > img {
	width: 0.18rem;
	height: 0.18rem;
	vertical-align: middle;
}
.top1 {
	height: 4.84rem;
	/* background: linear-gradient(180deg, #FF72F3 0%, #FF3EE4 100%); */
	left: 2.4rem;
	top: 1.3rem;
}
.top1 > .sort-img {
	position: absolute;
	bottom: 0.2rem;
	width: 3.5rem;
	left: -0.7rem;
	z-index: 2;
	top: -0.365rem;
}
.top2 {
	height: 4.34rem;
	/* background: linear-gradient(180deg, #2980FF 0%, #2980FF 100%); */
	left: 0;
	top: 1.6rem;
}
.top2 > .sort-img {
	position: relative;
	bottom: 0;
	width: 2.4rem;
	left: 0;
	z-index: 1;
	top: -0.07rem;
}
.top3 {
	height: 4.34rem;
	/* background: linear-gradient(180deg, #8B3EFF 0%, #8B3EFF 100%); */
	right: 0;
	top: 1.6rem;
}
.top3 > .sort-img {
	position: relative;
	bottom: 0;
	width: 2.4rem;
	left: -0.5rem;
	z-index: 1;
	top: -0.07rem;
}
.list-item {
	display: flex;
	align-items: center;
	font-size: 0.28rem;
	color: #fff;
	height: 1rem;
	margin-bottom: 0.5rem;
}

.count {
	width: 1.2rem;
	text-align: right;
	opacity: 0.9;
}
.count > p {
	white-space: nowrap;
}
.user-btn {
	position: relative;
	right: -1.5rem;
	width: 1.56rem;
	height: 0.6rem;
	line-height: 0.6rem;
	color: #fff;
	background: linear-gradient(90deg, #fe3e7f 0%, #fe47bc 100%);
	box-shadow: 0px 0px 0.12rem 0px rgba(255, 48, 146, 0.3);
	border-radius: 0.33rem;
	text-align: center;
	font-size: 0.24rem;
}
.user-count {
	position: absolute;
	padding-top: 0.1rem;
	right: 0.3rem;
	/* width: 3rem; */
	text-align: right;
	opacity: 0.9;
}
.user-count > p {
	width: 3rem;
	font-size: 0.24rem;
	transform: scale(0.83);
	position: relative;
	right: -0.3rem;
}
.count p:first-child {
	font-size: 0.2rem;
	line-height: 0.32rem;
	color: #999999;
}
.count p:last-child {
	font-size: 0.24rem;
	line-height: 0.34rem;
	color: #333333;
}

.info {
	padding-left: 0.2rem;
	flex: 1;
}

.nick-name {
	width: 3.5rem;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	font-size: 0.26rem;
	line-height: 0.38rem;
	padding: 0.1rem 0 0.1rem;
	opacity: 0.8;
	color: #333;
}

.avatar-box {
	width: 1rem;
}

.avatar-img {
	width: 1rem;
	height: 1rem;
	object-fit: cover;
	border-radius: 0.5rem;
}

.rank {
	width: 0.75rem;
	padding-left: 0.1rem;
	font-size: 0.32rem;
	text-align: left;
	color: #666;
}
.switch-div {
	width: 7.5rem;
	position: sticky;
	z-index: 9;
	padding-bottom: 0.14rem;
	margin-top: -0.02rem;
}
.switch-box {
	width: 3.68rem;
	height: 0.6rem;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(255, 255, 255, 0.2);
	border-radius: 0.34rem;
	margin: 0.3rem auto 0;
	margin-top: 0;
}

.switch-box div {
	flex: 1;
	height: 0.6rem;
	line-height: 0.6rem;
	text-align: center;
	color: #fff;
	font-size: 0.24rem;
	border-radius: 0.34rem;
	font-weight: bold;
}

.switch-box div.active {
	background: #ffffff;
	color: #333;
}

.header {
	position: relative;
	left: 0;
	top: -0.58rem;
	font-family: PingFangSC-Semibold;
	font-size: 0.38rem;
	color: #fff;
	font-weight: bold;
	line-height: 0.88rem;
	z-index: 1;
	background: #17132b;
	padding-bottom: 0.3rem;
	padding-top: 0.2rem;
}
.back {
	position: absolute;
	left: 0.2rem;
	width: 0.4rem;
	height: 0.4rem;
}

.back img {
	width: 0.4rem;
	height: 0.4rem;
}

.page-header {
	position: sticky;
	top: 0;
	left: 0;
	z-index: 9;
	font-size: 0.32rem;
	font-weight: bold;
	display: flex;
	align-items: center;
	justify-content: center;
	color: rgba(255, 255, 255, 0.6);
	margin-bottom: 0;
	height: 1.7rem;
	/* line-height: 1.7rem; */
}
.page-header span.active {
	font-size: 0.34rem;
	color: #fff;
	position: relative;
}

/* .page-header span.active::after {
	content: "";
	position: absolute;
	right: -0.1rem;
	bottom: -0.05rem;
	width: 0.2rem;
	height: 0.2rem;
	background-image: url("https://static.yaame.io/admin/02de04edd2dd48ea73787a57e6e546c9.png");
	background-size: 0.2rem 0.2rem;
} */

.empty {
	/* padding: 0 0 .5rem; */
	text-align: center;
	font-size: 0.28rem;
	color: #666;
	font-weight: normal;
	margin-top: -0.5rem;
}

.empty img {
	width: 2.8rem;
	height: 2.8rem;
	margin-bottom: 0.2rem;
}
.empty p {
	color: #999;
	font-size: 0.28rem;
}
/* 跳动的音符 */
.voice {
	display: flex;
	align-items: flex-end;
	justify-content: center;
	height: 100%;
	width: 0.24rem;
}
.voice > img {
	width: 0.22rem;
	height: 0.22rem;
	margin-top: 0.04rem;
	position: relative;
	top: 0.04rem;
}
.voice i {
	display: inline-block;
	border-left: 2px solid #fff;
	margin: 0 1px;
	position: relative;
}
.voice i.first {
	height: 0.12rem;
	animation: first 0.5s linear 0s infinite alternate;
}
.voice i.second {
	height: 0.08rem;
	animation: second 1s linear 0s infinite alternate;
}
.voice i.three {
	height: 0.1rem;
	animation: three 0.8s linear 0s infinite alternate;
}
.voice i.four {
	height: 0.16rem;
	animation: four 0.6s linear 0s infinite alternate;
}

@keyframes first {
	0% {
		height: 0.08rem;
	}

	50% {
		height: 0.12rem;
	}

	100% {
		height: 0.14rem;
	}
}

@keyframes second {
	0% {
		height: 0.16rem;
	}

	50% {
		height: 0.13rem;
	}

	100% {
		height: 0.11rem;
	}
}

@keyframes three {
	0% {
		height: 0.18rem;
	}

	50% {
		height: 0.16rem;
	}

	100% {
		height: 0.14rem;
	}
}

@keyframes four {
	0% {
		height: 0.14rem;
	}

	50% {
		height: 0.12rem;
	}

	100% {
		height: 0.09rem;
	}
}

.pos_fixed {
	position: fixed;
	bottom: 0;
	left: 0;
	background-color: #fff;
	width: 100vw;
	padding: 0.3rem;
	margin-bottom: 0rem;
	height: 1.2rem;
	border-radius: 0.3rem 0.3rem 0px 0px;
	box-shadow: 0px -0.02rem 0.15rem 0px rgba(0, 0, 0, 0.08);
}
.active.colorBlue {
	color: #696fdd !important;
}
.active.colorPink {
	color: #fe548d !important;
}
.active.colorYellow {
	color: #f4a75c !important;
}
.user-info {
	position: fixed;
	bottom: 0;
	left: 0;
	z-index: 9;
	width: 7.5rem;
	height: 1.19rem;
	background: #ffffff;
	box-shadow: 0px -2px 0.15rem 0px rgba(0, 0, 0, 0.08);
	border-radius: 0.3rem 0.3rem 0px 0px;
	display: flex;
	font-size: 0.28rem;
	align-items: center;
	padding-left: 0.3rem;
}
.rank-null {
	font-size: 0.24rem;
	width: 1.05rem;
	text-align: center;
	color: #666;
}
.top1-tag-live {
	position: absolute;
	width: 1.02rem;
	height: 0.36rem;
	background-image: url("https://static.yaame.io/admin/18d3bdb0cb9d790e967c7fcd3bfb9627.png");
	background-size: 1.02rem 0.36rem;
	background-repeat: no-repeat;
	z-index: 3;
	bottom: 0.36rem;
	left: 0.18rem;
	position: relative;
	padding-bottom: 0.12rem;
	padding-left: 0.12rem;
}
.top-tag-live-zh-cn {
	background-image: url("https://static.yaame.io/admin/18d3bdb0cb9d790e967c7fcd3bfb9627.png");
}
.top-tag-live-en {
	background-image: url("https://static.yaame.io/admin/d7d998347a571048027070380e3ffa44.png");
}
.top-tag-live-id {
	background-image: url("https://static.yaame.io/admin/51592be22fe4416629152e4b6bc23ca8.png");
}
.top-tag-live-ar {
	background-image: url("https://static.yaame.io/admin/09ab354bf939ba6aab9429c191f90d10.png");
}
.top2-tag-live {
	transform: scale(0.75);
	margin-top: 0.06rem;
}
.room-search {
	display: flex;
	justify-content: space-between;
	margin-bottom: 0.3rem;
}
.time-select {
	width: 1.88rem;
	height: 0.54rem;
	background: #f4f4f4;
	border-radius: 0.27rem;
	display: flex;
	color: #777777;
	padding: 0.04rem;
	overflow: hidden;
	font-size: 0.24rem;
}
.time-select > div {
	width: 0.9rem;
	text-align: center;
	height: 0.46rem;
	line-height: 0.46rem;
	/* background-color: black; */
}
.time-select-active {
	background-color: #fff;
	border-radius: 0.25rem;
	color: #000;
	font-weight: 600;
}
.room-select {
	font-size: 0.3rem;
	font-weight: 600;
	color: #333333;
	position: relative;
}
.room-select > img {
	width: 0.3rem;
	vertical-align: middle;
}
.dropdown-menu {
	width: 2.81rem;
	background: #ffffff;
	box-shadow: 0px 0px 14px 0px rgba(0, 0, 0, 0.1);
	border-radius: 0.27rem;
	position: absolute;
	top: calc(100%);
	left: 0;
	z-index: 99;
	padding: 0.1rem 0.3rem;
}
.dropdown-menu > div {
	width: 2.2rem;
	height: 0.82rem;
	text-align: center;
	line-height: 0.82rem;
	font-size: 0.3rem;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 400;
	color: #333333;
	border-bottom: 1px solid #eee;
}
.dropdown-menu > div:last-child {
	border-bottom: none;
}

.create-room {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 7.5rem;
    height: 1.94rem;
    background: #FFFFFF;
    box-shadow: 0px -0.02rem 0.15rem 0px rgba(0,0,0,0.08);
    border-radius: 0.5rem 0.3rem 0px 0px;
    z-index: 19;
}
.create-room  > .btn {
    width: 3.72rem;
    height: 0.9rem;
    background-image: url(https://yaame-static.yaame.io/admin/d6134362699675cc4a6dfd78dc099e20.png);
    background-size: contain;
    background-repeat: no-repeat;
    text-align: center;
    line-height: 0.9rem;
    font-size: 0.32rem;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #FFFFFF;
    text-align: center;
    margin-top: 0.3rem;
    margin-left: 1.89rem;
    margin-bottom: 0.2rem;
}
.create-room  > p {
    text-align: center;
    font-size: 0.24rem;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
}
</style>
