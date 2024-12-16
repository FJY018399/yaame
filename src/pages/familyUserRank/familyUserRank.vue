<template>
	<div
		:style="{
			backgroundColor: bgColor,
		}"
		:class="['main', tab]"
	>
		<page-loading v-if="page_loading"></page-loading>

		<div
			:style="{
				paddingTop: safe_height + 'rem',
				height: safe_height + 0.6 + 0.6 + 0.4 + 'rem',
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
			</div>

			<div class="switch-container">
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
			</div>
		</div>
		<div class="top-container">
			<div class="top2">
				<div class="avatar">
					<img :src="top2.avatar" alt="" @click="toDetails(top2)" />
				</div>
				<p class="no-wrap">{{ top2.nick_name }}</p>
				<img
					v-if="top2.img_tags && top2.img_tags[0]"
					:src="top2.img_tags[0].image_url"
					class="top-lv"
					alt=""
				/>
				<p class="no-wrap">
					<img
						:src="top2.integral_icon"
						alt=""
					/>
					{{ top2.integral }}
				</p>
			</div>
			<div class="top1">
				<div class="avatar">
					<img :src="top1.avatar" alt="" @click="toDetails(top1)" />
				</div>
				<p class="no-wrap">
					{{ top1.nick_name }}
				</p>
				<img
					v-if="top1.img_tags && top1.img_tags[0]"
					:src="top1.img_tags[0].image_url"
					class="top-lv"
					alt=""
				/>
				<p class="no-wrap">
					<img
                    :src="top1.integral_icon"
						alt=""
					/>
					{{ top1.integral }}
				</p>
			</div>
			<div class="top3">
				<div class="avatar">
					<img :src="top3.avatar" alt="" @click="toDetails(top3)" />
				</div>
				<p class="no-wrap">
					{{ top3.nick_name }}
				</p>
				<img
					v-if="top3.img_tags && top3.img_tags[0]"
					:src="top3.img_tags[0].image_url"
					class="top-lv"
					alt=""
				/>
				<p class="no-wrap">
					<img
                    :src="top3.integral_icon"
						alt=""
					/>
					{{ top3.integral }}
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
						<div class="sort">{{ item.family_member_rank }}</div>
						<img
							:src="item.avatar"
							class="avatar"
							alt=""
							@click="toDetails(item)"
						/>
						<div class="info">
							<p class="no-wrap">
								{{ item.nick_name }}
							</p>
                            <div class="tag-box">
                                <div
                                    v-for="(tag_item, tag_index) in item.img_tags"
                                    :key="tag_index"
                                    :class="['tag', 'tag-default']"
                                >
                                    <img :src="tag_item.image_url" alt="" />
                                </div>
                            </div>
						</div>
						<div class="num">
							<img
								src="https://yaame-static.yaame.io/admin/9e84f6b8139723ae692ba383af818ede.png"
								alt=""
							/>
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
            <div class="sort">{{ my_rank.family_member_rank >= 1 ? my_rank.family_member_rank : "99+" }}</div>
			<img
				:src="my_rank.avatar"
				class="avatar"
				alt=""
				@click="toDetails(my_rank)"
			/>
			<div class="info">
				<p class="no-wrap">
					{{ my_rank.nick_name }}
				</p>
				<div class="tag-box">
					<div
						v-for="(tag_item, tag_index) in my_rank.img_tags"
						:key="tag_index"
						:class="['tag', 'tag-default']"
					>
						<img :src="tag_item.image_url" alt="" />
					</div>
				</div>
			</div>
			<div class="num">
				<img :src="my_rank.integral_icon" alt="" />
				{{ my_rank.integral }}
			</div>
		</div>
	</div>
</template>
<script>
import pageLoading from "../../components/common/page_loading.vue";
import request from "../../lib/request/family.js";
import { getLanguage, getSafeHeight } from "../../lib/device.js";
import { getScrollTop, getQueryString } from "../../lib/utils";
import refresh from "../../components/common/refresh.vue";
const getDefaultItem = () => {
	return {
		avatar:
			"https://yaame-static.yaame.io/admin/6b4037f1d2f32fc134f2892b68058cae.png",
		uid: null,
		nick_name: "-",
		family_member_rank: -1,
		integral: 0,
		integral_icon: "",
		member_cnt: "-",
		img_tags: [],
	};
};
export default {
	components: {
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
		};
	},
	mounted() {
		const safe_area = getSafeHeight() || 40;
		this.safe_height = (safe_area * 2) / 100;

		this.page_loading = false;

		window.addEventListener("scroll", this.pageChange, false);

		if (this.tab === "NEW") {
			this.tab = "WEALTH";
		}
		let self = this;
		self.getData();
		window.getData = function () {
			self.getData();
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
			this.page = 1;
			this.getData();
		},
		changeTimeType(val) {
			this.time_type = val;
			this.getData();
		},
		async getData() {
			try {
				let res = await request.getFamilyMemberRank({
					familyRankTimeCycleType: this.time_type,
					familyRankType: this.tab,
					page: this.page,
					size: 30,
					familyId: getQueryString("family_id"),
				});
				console.log(res);
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
		toDetails(item) {
			if (item.uid) {
				location.href = `wlyaame://trend/user?uid=${item.uid}`;
			}
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
	padding-top: 7rem;
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
			.tab1 {
				text-align: right;
				padding-right: 0.15rem;
			}
			.tab2 {
				padding-left: 0.35rem;
				padding-right: 0.15rem;
			}
			.tab3 {
				padding-left: 0.35rem;
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
				width: 2.2rem;
				margin-left: -0.3rem;
				height: 2.2rem;
				background-size: contain;
				background-repeat: no-repeat;
				display: flex;
				justify-content: center;
				align-items: center;
				margin-bottom: -0.2rem;
				img {
					width: 1.3rem;
					height: 1.3rem;
					display: block;
					border-radius: 50%;
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
				background-image: url(https://yaame-static.yaame.io/admin/ade60d8e08610590c731bcc3356bb374.png);
				width: 2.4rem;
				height: 2.4rem;
				display: flex;
				justify-content: center;
				align-items: center;
				margin-left: -0.1rem;
				margin-bottom: -0.15rem;
				img {
					width: 1.5rem;
					height: 1.5rem;
					display: block;
					border-radius: 50%;
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
				background-image: url(https://yaame-static.yaame.io/admin/49a6a111c212177377c9f40e9a87d194.png);
			}
		}
		.top3 {
			.avatar {
				background-image: url(https://yaame-static.yaame.io/admin/e24013cbbc12b448f24c0a03461a7990.png);
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
				border-radius: 50%;
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
					width: 0.86rem;
					height: 0.3rem;
					border-radius: 0.15rem;
					background-color: rgba(255, 255, 255, 0.2);
					display: flex;
					justify-content: space-evenly;
					align-items: baseline;
					img {
						width: 0.2rem;
						height: 0.15rem;
					}
					p {
						display: inline-block;
						transform: scale(0.83333);
						color: #fff;
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
			border-radius: 50%;
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
				width: 0.86rem;
				height: 0.3rem;
				border-radius: 0.15rem;
				background-color: rgba(255, 255, 255, 0.2);
				display: flex;
				justify-content: space-evenly;
				align-items: baseline;
				img {
					width: 0.2rem;
					height: 0.15rem;
				}
				p {
					display: inline-block;
					transform: scale(0.83333);
					color: #fff;
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
.top-lv {
	display: block;
	height: 0.3rem;
	margin: 0.1rem auto 0.1rem;
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
</style>
