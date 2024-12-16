<template>
	<div
		:style="{
			backgroundColor: bgColor,
			paddingTop: tab === 'NEW' ? safe_height + 0.6 + 0.2 + 'rem' : '7rem',
		}"
		:class="['main', tab]"
	>
		<page-loading v-if="page_loading"></page-loading>

		<div
			:style="{
				paddingTop: safe_height + 'rem',
				height:
					tab === 'NEW'
						? safe_height + 0.6 + 0.2 + 'rem'
						: safe_height + 0.6 + 0.6 + 0.4 + 'rem',
				backgroundColor: headerBgVisible ? headerBgColor : '',
			}"
			class="page-header"
		>
			<div class="header-container">
				<div class="back" @click="back">
					<img
						:style="{ top: safe_height + 0.24 + 'rem' }"
						src="../../assets/img/common/icon_back_white.png"
						alt=""
					/>
				</div>
				<div class="tab-div">
					<div class="tab1">
						<span
							:class="{ active: tab === 'WEALTH' }"
							@click="changeTab('WEALTH')"
							>{{ $t("WEALTH") }}</span
						>
					</div>
					<div class="tab2">
						<span
							:class="{ active: tab === 'STAR' }"
							@click="changeTab('STAR')"
							>{{ $t("STAR") }}</span
						>
					</div>
					<div class="tab3">
						<span
							:class="{ active: tab === 'ACTIVE' }"
							@click="changeTab('ACTIVE')"
							>{{ $t("ACTIVE") }}</span
						>
					</div>
					<div class="tab4">
						<span
							:class="{ active: tab === 'NEW' }"
							@click="changeTab('NEW')"
							>{{ $t("NEW") }}</span
						>
					</div>
				</div>

				<div class="search" @click="search">
					<img
						:style="{ top: safe_height + 0.24 + 'rem' }"
						src="https://yaame-static.yaame.io/admin/763a6e5dc33a5dd494ece4116a79b7ca.png"
						alt=""
					/>
				</div>
			</div>

			<div v-if="tab !== 'NEW'" class="switch-container">
				<div class="switch-box">
					<div
						:class="[
							time_type === 'DAY' ? 'active' : '',
							time_type === 'DAY' ? switchClass : '',
							'switch-item',
						]"
						@click="changeTimeType('DAY')"
					>
						{{ $t("dayList") }}
					</div>
					<div
						:class="[
							time_type === 'WEEK' ? 'active' : '',
							time_type === 'WEEK' ? switchClass : '',
							'switch-item',
						]"
						@click="changeTimeType('WEEK')"
					>
						{{ $t("weeklyList") }}
					</div>
					<div
						:class="[
							'switch-item',
							time_type === 'MONTH' ? 'active' : '',
							time_type === 'MONTH' ? switchClass : '',
						]"
						@click="changeTimeType('MONTH')"
					>
						{{ $t("monthlyList") }}
					</div>
				</div>

				<img
					v-if="tab === 'WEALTH'"
					src="https://yaame-static.yaame.io/admin/b2a0abaaf7cf012c470d2ce5fd84d529.png"
					class="info-img"
					@click="toRule"
				/>
				<img
					v-if="tab === 'STAR'"
					src="https://yaame-static.yaame.io/admin/b8f80b984283bb28534a85cc3b84e2e6.png"
					class="info-img"
					@click="toRule"
				/>
				<img
					v-if="tab === 'ACTIVE'"
					src="https://yaame-static.yaame.io/admin/35bc06bbd9e96ddccd419b0efc671413.png"
					class="info-img"
					@click="toRule"
				/>
			</div>
		</div>
		<div v-if="tab === 'NEW'" class="new-container">
			<refresh
				ref="newRefresh"
				style="min-height: 80vh"
				@onRefresh="handleNewRefresh"
			>
				<ul
					v-infinite-scroll="loadNewMore"
					:infinite-scroll-immediate-check="true"
					infinite-scroll-disabled="loading"
					infinite-scroll-distance="10"
				>
					<li
						v-for="(item, index) in newList"
						:key="index"
						class="new-item"
						@click="toDetails(item)"
					>
						<img :src="item.avatar" class="avatar" alt="" />
						<div class="info no-wrap">
							<div class="name no-wrap">{{ item.name }}</div>
							<div class="family-id">ID: {{ item.family_flag }}</div>
							<div class="member-cnt">
								<img
									src="https://yaame-static.yaame.io/admin/f3282d97dbb04e690a036b2e1558839d.png"
									alt=""
								/>
								<p>{{ item.member_cnt }}</p>
							</div>
						</div>
					</li>
				</ul>
				<div v-if="newList.length === 0" class="empty-div">
					<img
						src="http://imgcom.static.suishenyun.net/quesheng_img_wuxiaoxi_black@2x-c8ddb9.png"
						alt=""
					/>
					<p>{{ $t("empty") }}</p>
				</div>
			</refresh>
		</div>
		<template v-else>
			<div class="top-container">
				<div class="top2">
					<div class="avatar" @click="toDetails(top2)">
						<img :src="top2.avatar" alt="" />
					</div>
					<p class="no-wrap">
						<img :src="top2.level_badge" alt="" /> {{ top2.name }}
					</p>
					<p class="no-wrap">
						<img :src="top2.integral_icon" alt="" /> {{ top2.integral }}
					</p>
				</div>
				<div class="top1">
					<div class="avatar" @click="toDetails(top1)">
						<img :src="top1.avatar" alt="" />
					</div>
					<p class="no-wrap">
						<img :src="top1.level_badge" alt="" /> {{ top1.name }}
					</p>
					<p class="no-wrap">
						<img :src="top1.integral_icon" alt="" /> {{ top1.integral }}
					</p>
				</div>
				<div class="top3">
					<div class="avatar" @click="toDetails(top3)">
						<img :src="top3.avatar" alt="" />
					</div>
					<p class="no-wrap">
						<img :src="top3.level_badge" alt="" /> {{ top3.name }}
					</p>
					<p class="no-wrap">
						<img :src="top3.integral_icon" alt="" /> {{ top3.integral }}
					</p>
				</div>
			</div>

			<div :class="['list-container', tab]">
				<refresh
					style="min-height: 4.1rem"
					class="refresh"
					ref="wlRefresh"
					@onRefresh="handleRefresh"
				>
					<div
						v-infinite-scroll="loadMore"
						v-if="list && list.length"
						:infinite-scroll-immediate-check="true"
						infinite-scroll-disabled="loading"
						infinite-scroll-distance="10"
					>
						<div v-for="(item, index) in list" :key="index" class="list-item">
							<div class="sort">{{ item.family_rank }}</div>
							<img
								:src="item.avatar"
								class="avatar"
								alt=""
								@click="toDetails(item)"
							/>
							<div class="info">
								<p class="no-wrap">
									<img :src="item.level_badge" alt="" />
									{{ item.name }}
								</p>
								<div class="member-cnt">
									<img
										src="https://yaame-static.yaame.io/admin/f3282d97dbb04e690a036b2e1558839d.png"
										alt=""
									/>
									<p>{{ item.member_cnt }}</p>
								</div>
							</div>
							<div class="num">
								<img :src="item.integral_icon" alt="" />
								{{ item.integral }}
							</div>
						</div>
					</div>
					<div v-else class="empty">
						<p>{{ $t("NotOnTheListYet") }}</p>
					</div>
				</refresh>
			</div>

			<div v-if="my_rank" :class="['user-info', tab]">
				<div class="sort">
					{{ my_rank.family_rank >= 1 ? my_rank.family_rank : "99+" }}
				</div>
				<img
					:src="my_rank.avatar"
					class="avatar"
					alt=""
					@click="toDetails(my_rank)"
				/>
				<div class="info">
					<p>
						<img :src="my_rank.level_badge" alt="" />
						{{ my_rank.name }}
					</p>
					<div class="member-cnt">
						<img
							src="https://yaame-static.yaame.io/admin/f3282d97dbb04e690a036b2e1558839d.png"
							alt=""
						/>
						<p>{{ my_rank.member_cnt }}</p>
					</div>
				</div>
				<div class="num">
					<img :src="my_rank.integral_icon" alt="" />
					{{ my_rank.integral }}
				</div>
			</div>
		</template>

		<div v-if="!createBtn" class="create-btn" @click="createFamily">
			{{ $t("createFamily") }}
		</div>
	</div>
</template>
<script>
import pageLoading from "../../components/common/page_loading.vue";
import request from "../../lib/request/family.js";
import { getLanguage, getSafeHeight } from "../../lib/device.js";
import { getScrollTop, getQueryString } from "../../lib/utils";
import define from "../../lib/define.js";
import refresh from "../../components/common/refresh.vue";
import { Toast } from "vant";
import popup from "@/components/common/pop_up.vue";
const getDefaultItem = () => {
	return {
		avatar:
			"https://yaame-static.yaame.io/admin/6b4037f1d2f32fc134f2892b68058cae.png",
		family_id: null,
		name: "-",
		family_rank: -1,
		integral: 0,
		integral_icon: "",
		level_badge: "",
		member_cnt: "-",
	};
};
export default {
	components: {
    popup,
		pageLoading,
		refresh,
	},
	data() {
		return {
			safe_height: 0,
			page_loading: true,

			tab: getQueryString("active") || "WEALTH",
			time_type: getQueryString("time_type") || "WEEK",
			headerBgVisible: false,

			list: [],
			top1: getDefaultItem(),
			top2: getDefaultItem(),
			top3: getDefaultItem(),
			my_rank: false,

			page: 1,
			has_next: true,

			define,

			newPage: 1,
			new_has_next: true,
			newList: [],

            family_my_rank: false,

      hintWin: false,
      txt: '',
      createBtn: false
		};
	},
	async mounted() {
		const safe_area = getSafeHeight() || 40;
		this.safe_height = (safe_area * 2) / 100;

		this.page_loading = false;

		window.addEventListener("scroll", this.pageChange, false);

		await this.getData();
		await this.getNewData();

		let self = this;

		window.getData = async function () {
			console.log("触发getData");
			await self.getData("WEALTH");
			await self.getNewData();
		};
	},
	beforeDestroy() {
		window.removeEventListener("scroll", this.pageChange, false);
		delete window.getData;
	},
	computed: {
		switchClass() {
			const classEnum = {
				WEALTH: "color-wealth bg-white",
				STAR: "color-star bg-white",
				ACTIVE: "color-active bg-white",
			};
			return classEnum[this.tab];
		},
		// 背景颜色
		headerBgColor() {
			switch (this.tab) {
				case "WEALTH":
					return "#904D19";
				case "STAR":
					return "#CA5C81";
				case "ACTIVE":
					return "#7B65BF";
				case "NEW":
					return "#181E33";
				default:
					return "#904D19";
			}
		},
		bgColor() {
			switch (this.tab) {
				case "WEALTH":
					return "#311B0D";
				case "STAR":
					return "#41192B";
				case "ACTIVE":
					return "#2C2752";
				case "NEW":
					return "#181E33";
				default:
					return "#311B0D";
			}
		},

		language() {
			return getLanguage();
		},
	},
	watch: {
		bgColor: {
			handler(val) {
				document.body.style.backgroundColor = val;
			},
			immediate: true,
		},
	},
	methods: {
		back() {
			location.href = "wlyaame://webview/back";
		},
		changeTab(val) {
			this.tab = val;
			if (val === "NEW") {
				this.newPage = 1;
				this.getNewData();
			} else {
				this.page = 1;
				this.getData();
			}
		},
		changeTimeType(val) {
			this.time_type = val;
			this.getData();
		},
		async getData(val) {
			if (val) {
				console.log("进入方法内部");
			}
			try {
                let tabValue = this.tab;
                if (tabValue === 'NEW') {
                    tabValue = 'WEALTH';
                }

				let res = await request.getFamilyRank({
					familyRankTimeCycleType: this.time_type,
					familyRankType: val || tabValue,
					page: this.page,
					size: 30,
				});
				if (res.status !== 1000) return;

				if (res.data.my_rank) {
					this.my_rank = res.data.my_rank;
				} else {
					this.my_rank = false;
				}

				if (this.page === 1) {
					this.top1 = res.data.content[0] || getDefaultItem();
					this.top2 = res.data.content[1] || getDefaultItem();
					this.top3 = res.data.content[2] || getDefaultItem();

					if (res.data.content && res.data.content.length) {
						this.list = res.data.content.slice(3);
					} else {
						this.list = [];
					}
				} else {
					if (res.data.content && res.data.content.length) {
						this.list = this.list.concat(res.data.content);
					}
				}
				this.has_next = res.data.has_next;
			} catch (error) {
				console.log(error);
			}
		},
		loadMore() {
			if (this.has_next) {
				this.page++;
				this.getData();
			}
		},
		loadNewMore() {
			if (this.new_has_next) {
				this.newPage++;
				this.getNewData();
			}
		},
		async handleRefresh() {
			this.page = 1;
			await this.getData();
			setTimeout(() => {
				this.$refs.wlRefresh.isLoading = false;
			}, 500);
		},
		pageChange() {
			const scroll_top = getScrollTop();
			if (scroll_top > 10) {
				this.headerBgVisible = true;
			} else {
				this.headerBgVisible = false;
			}
		},

		async handleNewRefresh() {
			this.newPage = 1;
			await this.getNewData();
			setTimeout(() => {
				this.$refs.newRefresh.isLoading = false;
			}, 500);
		},
		async getNewData() {
			try {
				let res = await request.getFamilyNew({
					page: this.newPage,
					size: 30,
				});
				if (res.status !== 1000) return;
				if (this.newPage === 1) {
					this.newList = res.data.content;
				} else {
					this.newList = this.newList.concat(res.data.content);
				}

                if (res.data.my_family_info) {
                    this.family_my_rank = res.data.my_family_info;
                  this.createBtn = true;
                } else {
                    this.family_my_rank = false;
                }
			} catch (error) {
				console.log(error);
			}
		},
		toRule() {
			location.href = "./familyRule.html";
		},
		async createFamily() {
      try {
        await this.getNewData();

        if (this.family_my_rank) {
          Toast(this.$t('joinedFamily', [this.family_my_rank.name])) // 提示已经加入家族
          return
        }
        location.href = "wlyaame://family/editor?from=from_create";
      } catch (err) {
        console.log(err);
      }
		},
		toDetails(val) {
			if (val.scheme_url) {
				location.href = val.scheme_url;
			}
		},
		search() {
			location.href = "wlyaame://family/search";
		},
	},
};
</script>
<style scoped lang="less">
.main {
	width: 7.5rem;
	min-height: 100vh;
	color: #fff;
	font-size: 0.24rem;
	background-size: contain;
	background-repeat: no-repeat;

	position: relative;
	padding-bottom: 1.4rem;
	&.WEALTH {
		background-image: url(https://yaame-static.yaame.io/admin/0492b16c9eacc18d587c050085af3ae3.png);
	}
	&.STAR {
		background-image: url(https://yaame-static.yaame.io/admin/65c4df8d8abf7a9f7b292912a81fe0ee.png);
	}
	&.ACTIVE {
		background-image: url(https://yaame-static.yaame.io/admin/d239085d335eb4730503d2410623c620.png);
	}
	.page-header {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 9;
		font-size: 0.32rem;
		font-weight: bold;

		color: rgba(255, 255, 255, 0.6);
		margin-bottom: 0;
		height: 1.6rem;
		.header-container {
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;
			height: 0.6rem;
			width: 7.5rem;
			padding: 0 1rem;
			.back {
				position: absolute;
				left: 0.2rem;
				width: 0.4rem;
				height: 0.4rem;
				img {
					width: 0.4rem;
					height: 0.4rem;
				}
			}
			.search {
				position: absolute;
				right: 0.2rem;
				width: 0.4rem;
				height: 0.4rem;
				img {
					width: 0.4rem;
					height: 0.4rem;
				}
			}
			span {
				position: relative;
				&.active {
					font-size: 0.34rem;
					color: #fff;
					position: relative;
					&::after {
						content: "";
						position: absolute;
						right: -0.1rem;
						bottom: -0.05rem;
						width: 0.2rem;
						height: 0.2rem;
						background-image: url("https://static.yaame.io/admin/02de04edd2dd48ea73787a57e6e546c9.png");
						background-size: 0.2rem 0.2rem;
					}
				}
			}
			.tab-div {
				width: 6.5rem;
				height: 0.6rem;
				display: flex;
				flex-wrap: nowrap;
				overflow-y: scroll;
				justify-content: space-between;
				padding: 0 0.2rem;
				scrollbar-width: none;
				&::-webkit-scrollbar {
					display: none;
				}
				.tab1 {
					text-align: right;
					padding-right: 0.15rem;
					white-space: nowrap;
				}
				.tab2 {
					padding-left: 0.15rem;
					padding-right: 0.15rem;
				}
				.tab3 {
					padding-left: 0.15rem;
                    padding-right: 0.15rem;
				}
                .tab4 {
					padding-left: 0.15rem;
				}
			}
		}
		.switch-container {
			width: 7.5rem;
			height: 0.6rem;
			position: relative;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-top: 0.2rem;
			.switch-box {
				width: 4.32rem;
				height: 0.6rem;
				background-color: rgba(0, 0, 0, 0.2);
				border-radius: 0.34rem;
				display: flex;
				.switch-item {
					flex: 1;
					height: 0.6rem;
					line-height: 0.6rem;
					text-align: center;
					font-size: 0.24rem;
					border-radius: 0.34rem;
					font-weight: bold;

					overflow: hidden;
					&.active {
						background-color: #fff;
					}
				}
			}
			.info-img {
				width: 0.4rem;
				height: 0.4rem;
				position: absolute;
				top: 0.1rem;
				right: 0.3rem;
			}
		}
	}
	.top-container {
		position: absolute;
		top: 2.46rem;
		left: 0.68rem;
		width: 6.14rem;
		height: 3.25rem;
		display: flex;
		justify-content: space-between;
		color: #333333;
		.top2,
		.top3 {
			width: 1.6rem;
			height: 3.25rem;
			padding-top: 0.92rem;
			.avatar {
				width: 1.6rem;
				height: 1.6rem;
				background-size: contain;
				background-repeat: no-repeat;
				display: flex;
				justify-content: center;
				align-items: center;
				img {
					width: 1.1rem;
					height: 1.1rem;
					display: block;
					border-radius: 0.1rem;
				}
			}
			p {
				width: 1.6rem;
				text-align: center;
				img {
					width: 0.42rem;
					height: auto;
					vertical-align: middle;
				}
			}
		}
		.top1 {
			width: 2.2rem;
			height: 3.25rem;
			.avatar {
				background-size: contain;
				background-repeat: no-repeat;
				background-image: url(https://yaame-static.yaame.io/admin/4ea05add389a6733a45a7a0885806699.png);
				width: 2.2rem;
				height: 2.2rem;
				display: flex;
				justify-content: center;
				align-items: center;
				img {
					width: 1.5rem;
					height: 1.5rem;
					display: block;
					border-radius: 0.1rem;
				}
			}
			p {
				width: 2.2rem;
				text-align: center;
				img {
					width: 0.42rem;
					height: auto;
					vertical-align: middle;
				}
			}
		}
		.top2 {
			.avatar {
				background-image: url(https://yaame-static.yaame.io/admin/8be1465c987b67abc1b3aa18cf3672c2.png);
			}
		}
		.top3 {
			.avatar {
				background-image: url(https://yaame-static.yaame.io/admin/e84a3f0570e6e66cf895bacf07694d0e.png);
			}
		}
	}
	.list-container {
		width: 6.9rem;
		min-height: 4.1rem;
		margin-left: 0.3rem;
		padding: 0.22rem;
		&.WEALTH {
			color: #e08d45;
			background: #693910;
			border-radius: 0.38rem 0.28rem 0.24rem 0.24rem;
			border: 0.08rem solid #d98725;
			.list-item {
				background: #8f511b;
				border: 0.02rem solid #af6423;
			}
		}
		&.STAR {
			color: #ff84bb;
			background: #69103d;
			border-radius: 0.38rem 0.28rem 0.24rem 0.24rem;
			border: 0.08rem solid #c02676;
			.list-item {
				background: #8f1b4f;
				border: 0.02rem solid #b42d6a;
			}
		}
		&.ACTIVE {
			color: #d174ff;
			background: #471069;
			border-radius: 0.38rem 0.28rem 0.24rem 0.24rem;
			border: 0.08rem solid #8034af;
			.list-item {
				background: #691b8f;
				border: 0.02rem solid #8e2fbc;
			}
		}
		.list-item {
			width: 6.3rem;
			height: 1.3rem;
			background: #8f511b;
			border-radius: 0.18rem;
			border: 0.02rem solid #af6423;
			margin-bottom: 0.1rem;
			display: flex;
			align-items: center;
			flex-wrap: nowrap;
			.sort {
				width: 0.72rem;
				text-align: center;
				font-weight: 600;
				font-size: 0.36rem;
			}
			.avatar {
				display: inline-block;
				width: 0.9rem;
				height: 0.9rem;
				border-radius: 0.2rem;
				margin-right: 0.3rem;
			}
			.info {
				width: 3rem;
				height: 1.3rem;
				padding-top: 0.28rem;
				p {
					font-size: 0.24rem;
					font-weight: 400;
					margin-bottom: 0.12rem;
					img {
						width: 0.36rem;
						height: auto;
						vertical-align: middle;
					}
				}
				.member-cnt {
					display: inline-flex;
					height: 0.3rem;
					border-radius: 0.15rem;
					background-color: rgba(255, 255, 255, 0.2);
					padding: 0.07rem 0.2rem 0.07rem 0.12rem;
					position: relative;
					img {
						display: inline;
						width: 0.2rem;
						height: auto;
					}
					p {
						display: inline;
						color: #fff;
						font-size: 0.2rem;
						text-align: left;
						margin-bottom: 0;
						transform: scale(0.8333);
						position: relative;
						top: -0.06rem;
						left: 0.06rem;
					}
				}
			}

			.num {
				width: 1.34rem;
				text-align: center;
				img {
					width: 0.42rem;
					height: auto;
					vertical-align: middle;
				}
			}
		}
	}
	.user-info {
		position: fixed;
		z-index: 9;
		bottom: -0.04rem;
		left: 0;
		width: 7.5rem;
		height: 1.34rem;
		display: flex;
		align-items: center;
		flex-wrap: nowrap;
		border-radius: 0.24rem 0.24rem 0 0;
		padding-right: 0.4rem;

		&.WEALTH {
			color: #e08d45;
			background: #8f511b;
			border: 0.04rem solid #af6423;
		}
		&.STAR {
			color: #ff84bb;
			background: #8f1b4f;
			border: 0.04rem solid #b42d6a;
		}
		&.ACTIVE {
			color: #d174ff;
			background: #691b8f;
			border: 0.04rem solid #8e2fbc;
		}
		.sort {
			width: 1.34rem;
			text-align: center;
			font-weight: 600;
			font-size: 0.36rem;
		}
		.avatar {
			display: inline-block;
			width: 0.9rem;
			height: 0.9rem;
			border-radius: 0.2rem;
			margin-right: 0.3rem;
		}
		.info {
			width: 3.5rem;
			height: 1.3rem;
			padding-top: 0.28rem;
			p {
				font-size: 0.24rem;
				font-weight: 400;
				margin-bottom: 0.12rem;
				img {
					width: 0.36rem;
					height: auto;
					vertical-align: middle;
				}
			}
			.member-cnt {
				display: inline-flex;
				height: 0.3rem;
				border-radius: 0.15rem;
				background-color: rgba(255, 255, 255, 0.2);
				padding: 0.07rem 0.2rem 0.07rem 0.12rem;
				position: relative;
				img {
					display: inline;
					width: 0.2rem;
					height: auto;
				}
				p {
					display: inline;
					color: #fff;
					font-size: 0.2rem;
					text-align: left;
					margin-bottom: 0;
					transform: scale(0.8333);
					position: relative;
					top: -0.06rem;
					left: 0.06rem;
				}
			}
		}

		.num {
			width: 1.3rem;
			text-align: center;
			img {
				width: 0.42rem;
				height: auto;
				vertical-align: middle;
			}
		}
	}
	.new-container {
		width: 6.9rem;
		height: 80vh;
		margin-left: 0.3rem;
		.new-item {
			width: 6.9rem;
			height: 1.6rem;
			background: #20263c;
			border-radius: 0.18rem;
			padding: 0.2rem;
			display: flex;
			align-items: center;
			margin-bottom: 0.2rem;
			.avatar {
				width: 1.2rem;
				height: 1.2rem;
				display: block;
				border-radius: 0.2rem;
			}
			.info {
				color: #fff;
				margin-left: 0.2rem;
				width: 5rem;
				.name {
					width: 5rem;
					font-size: 0.32rem;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #ffffff;
					img {
						width: 0.36rem;
						height: 0.36rem;
						vertical-align: middle;
					}
				}
				.family-id {
					font-size: 0.26rem;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #797c8a;
				}
				.member-cnt {
					display: inline-flex;
					height: 0.3rem;
					border-radius: 0.15rem;
					background-color: rgba(255, 255, 255, 0.2);
					padding: 0.07rem 0.2rem 0.07rem 0.12rem;
					position: relative;
					img {
						display: inline;
						width: 0.2rem;
						height: auto;
					}
					p {
						display: inline;
						color: #fff;
						font-size: 0.2rem;
						text-align: left;
						margin-bottom: 0;
						transform: scale(0.8333);
						position: relative;
						top: -0.06rem;
						left: 0.06rem;
					}
				}
			}
		}
		.empty-div {
			/* padding: 0 0 .5rem; */
			text-align: center;
			font-size: 0.28rem;
			color: #666;
			font-weight: normal;
			margin-top: 3.5rem;

			img {
				width: 2.8rem;
				height: auto;
				margin-bottom: 0.2rem;
			}
			p {
				color: #fff;
				font-size: 0.28rem;
			}
		}
	}

  .hint {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 5.9rem;
    height: 4.01rem;
    border-radius: .24rem;
    background: #FFFFFF url("https://yaame-static.yaame.io/admin/53bf8aaba73b951a9e97ef9f0270c626.png") no-repeat;
    background-size: contain;
    overflow: hidden;

    .head {
      height: .48rem;
      margin: .6rem 0 .21rem .5rem;
      font-weight: 600;
      font-size: .34rem;
      color: #333333;
      line-height: .48rem;
    }
    p {
      width: 4.9rem;
      margin: 0 auto .5rem;
      font-weight: 400;
      font-size: .26rem;
      color: #666666;
    }
    .button {
      display: flex;
      justify-content: center;
      align-items: center;
      float: left;
      width: 4.3rem;
      height: .88rem;
      margin-left: .8rem;
      border-radius: .50rem;
      font-weight: 600;
      font-size: .3rem;
      color: #FFFFFF;
      background: linear-gradient(90deg, #63DF6D, #4CC9A4);
    }
  }
}
.empty {
	width: 6.34rem;
	height: 3.94rem;
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
	font-size: 0.28rem;
	font-weight: normal;
}
.color-wealth {
	color: #8f4d20;
}
.color-star {
	color: #9e2359;
}
.color-active {
	color: #7418ac;
}
.bg-white {
	background-color: #fff;
}

.create-btn {
	background-image: url(https://yaame-static.yaame.io/admin/67e66f179d463ab8ce5723a7f01b3443.png);
	width: 5.8rem;
	height: 1rem;
	text-align: center;
	line-height: 1rem;
	font-size: 0.32rem;
	font-family: PingFangSC-Semibold, PingFang SC;
	font-weight: 600;
	color: #ffffff;
	position: fixed;
	bottom: 1rem;
	left: 0.85rem;
	background-size: contain;
	background-repeat: no-repeat;
}
</style>
