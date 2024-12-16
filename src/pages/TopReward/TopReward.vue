<!--
 * @Author: Elk
 * @Date: 2023-08-03 10:52:20
 * @FilePath: /yaame-h5/src/pages/TopReward/TopReward.vue
 * @Description: 排行榜奖励页
-->
<template>
	<div
		:style="{ paddingTop: safe_height + 1.08 + 'rem' }"
		:class="['TopReward', tab]"
	>
		<Header style="position: fixed;" color="white">{{ title }}</Header>
        <page-loading v-if="page_loading"></page-loading>
		<p :style="{ top: safe_height + 1.08 + 'rem' }" class="info">
            {{ tab === 'CHARM' ? $t('lastTopStar') : $t('lastGiverStar') }}
		</p>

		<div class="top-div">
			<img
				v-if="tab === 'WEALTH'"
				class="bg-img"
				src="https://static.yaame.io/admin/cfb8ae85247987a54ac8f2b834cf9479.png"
				alt=""
			/>
			<img
				v-else-if="tab === 'CHARM'"
				class="bg-img"
				src="https://static.yaame.io/admin/cdaf9478a2393dc0ac079daf0b747e43.png"
				alt=""
			/>
			<!-- 前三名 -->
			<div class="top-container">
				<!-- 第一名 -->
				<div class="top-item top1">
					<div class="top-avatar">
						<div class="avatar-in">
							<div class="avatar-in-in">
								<img
									v-show="top1.subject_icon"
									:src="top1.subject_icon"
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
					<div class="top-nick" style="margin-top: 1.5rem">
						{{ top1.subject_name }}
					</div>
					<img
						v-if="top1.img_tags && top1.img_tags[0]"
						:src="top1.img_tags[0].image_url"
						class="top-lv"
						alt=""
					/>
					<img
						v-else-if="tab !== 'VOICE_ROOM'"
						style="opacity: 0"
						class="top-lv"
						alt=""
					/>
					<div class="top-count" style="margin-top: 0.16rem">
						<img
							src="https://static.yaame.io/admin/8f1cc268a594f46a953a906169e1a50f.png"
							alt=""
						/>
						{{ top1.score_value }}
					</div>
					<img
						v-if="tab === 'CHARM'"
						class="sort-img"
						src="https://static.yaame.io/admin/3828a1afddf99d4563dc834ab21d60e0.png"
						alt=""
					/>
					<img
						v-else-if="tab === 'WEALTH'"
						class="sort-img"
						src="https://static.yaame.io/admin/d916ff082aff48ce298d441d84a68cd0.png"
						alt=""
					/>
				</div>
				<!-- 第二名 -->
				<div class="top-item top2">
					<div class="top-avatar">
						<div class="avatar-in" @click.stop="toRoom(top2)">
							<div class="avatar-in-in">
								<img
									v-show="top2.subject_icon"
									:src="top2.subject_icon"
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
					<div class="top-nick" style="margin-top: 1.5rem">
						{{ top2.subject_name }}
					</div>
					<img
						v-if="top2.img_tags && top2.img_tags[0]"
						:src="top2.img_tags[0].image_url"
						class="top-lv"
						alt=""
					/>
					<img
						v-else-if="tab !== 'VOICE_ROOM'"
						style="opacity: 0"
						class="top-lv"
						alt=""
					/>
					<div class="top-count" style="margin-top: 0.16rem">
						<img
							src="https://static.yaame.io/admin/8f1cc268a594f46a953a906169e1a50f.png"
							alt=""
						/>
						{{ top2.score_value }}
					</div>
					<img
						v-if="tab === 'CHARM'"
						class="sort-img"
						src="https://static.yaame.io/admin/6b351d3ef2cf4c1f060ea2e929393dd5.png"
						alt=""
					/>
					<img
						v-else-if="tab === 'WEALTH'"
						class="sort-img"
						src="https://static.yaame.io/admin/b0b5f13a75f3242f3da583bfb9a17491.png"
						alt=""
					/>
				</div>
				<!-- 第三名 -->
				<div class="top-item top3">
					<div class="top-avatar">
						<div class="avatar-in" @click.stop="toRoom(top3)">
							<div class="avatar-in-in">
								<img
									v-show="top3.subject_icon"
									:src="top3.subject_icon"
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
					<div class="top-nick" style="margin-top: 1.5rem">
						{{ top3.subject_name }}
					</div>
					<img
						v-if="top3.img_tags && top3.img_tags[0]"
						:src="top3.img_tags[0].image_url"
						class="top-lv"
						alt=""
					/>
					<img
						v-else-if="tab !== 'VOICE_ROOM'"
						style="opacity: 0"
						class="top-lv"
						alt=""
					/>
					<div class="top-count" style="margin-top: 0.16rem">
						<img
							src="https://static.yaame.io/admin/8f1cc268a594f46a953a906169e1a50f.png"
							alt=""
						/>
						{{ top3.score_value }}
					</div>
					<img
						v-if="tab === 'CHARM'"
						class="sort-img"
						src="https://static.yaame.io/admin/b5af927cecf0effa4de01911111fffaa.png"
						alt=""
					/>
					<img
						v-else-if="tab === 'WEALTH'"
						class="sort-img"
						src="https://static.yaame.io/admin/7043f5911585f15ddddf8b75bf11f3d0.png"
						alt=""
					/>
				</div>
			</div>
		</div>
		<div :class="['reward-list', tab]">
			<p style="position: relative" class="info">Rewards</p>

			<div v-for="(item,index) in list" :key="index" class="reward-item">
				<header>{{ $t(`top${index + 1}`) }}</header>
				<div class="reward-container">
					<div v-for="(ele, inx) in item.reward_item_vo_list" :key="inx">
						<div class="reward-div">
                            <img :src="ele.icon" alt="">
                        </div>
						<p class="reward-name no-wrap">{{ ele.reward_name }}</p>
					</div>
				</div>
			</div>

			<p class="reward-text">
				{{ $t('footer') }}
			</p>
		</div>
	</div>
</template>

<script>
import Header from "../../components/common/header.vue";
import { getSafeHeight, getLanguage } from "../../lib/device";
import { getQueryString } from "../../lib/utils";
import request from "../../lib/request/contribution.js";
import pageLoading from "../../components/common/page_loading.vue";
const getDefaultUser = () => {
	return {
		subject_icon: "",
		subject_name: "-",
		score_value: 0,
	};
};
export default {
	components: {
		Header,
        pageLoading
	},
	data() {
		return {
			safe_height: 0,

			page_loading: true,
			tab: getQueryString("tab") || "WEALTH",
			top1: getDefaultUser(),
			top2: getDefaultUser(),
			top3: getDefaultUser(),

            list: [],
		};
	},
	computed: {
		language() {
			return getLanguage() || "en";
		},
		title() {
			return this.tab === "WEALTH"
				? this.$t("topGiver")
				: this.$t("topStar");
		},
	},
	mounted() {
		let safe_area = getSafeHeight() || 0;
		this.safe_height = (safe_area * 2) / 100;
		this.getData();
	},
	methods: {
		async getData() {
			try {
				let res = await request.getContributeRewards({
					rankType: this.tab,
				});
				if (res.status === 1000) {
					if (res.data.rank_reward_info_list) {
						this.top1 = res.data.rank_reward_info_list[0] || getDefaultUser();
						this.top2 = res.data.rank_reward_info_list[1] || getDefaultUser();
						this.top3 = res.data.rank_reward_info_list[2] || getDefaultUser();
					}
                    if (res.data.rank_reward_item_group_list) {
                        this.list = res.data.rank_reward_item_group_list;
                    }

                    this.$nextTick(() => {
                        this.page_loading = false;
                    });
				}
			} catch (error) {
				console.log(error);
			}
		},
	},
};
</script>
<style lang="less">
.TopReward {
	width: 7.5rem;
	min-height: 100vh;
	overflow-x: hidden;
	.info {
		position: absolute;
		left: 0.4rem;
		font-size: 0.32rem;
		font-weight: 600;
		color: #ffffff;
		opacity: 0.6;
		z-index: 3;
	}
	.top-div {
		.bg-img {
			position: absolute;
			width: 100%;
			z-index: 1;
			top: -1px;
		}
		.top-container {
			width: 6.9rem;
			height: 5.25rem;
			position: relative;
			margin: 0 auto;
			z-index: 2;
			// top: 0.5rem;
			margin-top: 0.5rem;
			.top-item {
				width: 2.1rem;
				position: absolute;
				/* bottom: 0; */
				border-radius: 0.2rem;
				color: #fff;
				text-align: center;
				&.top1 {
					height: 4.84rem;
					left: 2.4rem;
					top: 1.3rem;
					.sort-img {
						position: absolute;
						bottom: 0.2rem;
						width: 3.5rem;
						left: -0.7rem;
						z-index: 2;
						top: -0.365rem;
					}
				}
				&.top2 {
					height: 4.34rem;
					left: 0;
					top: 1.6rem;
					.sort-img {
						position: relative;
						bottom: 0;
						width: 2.4rem;
						left: 0;
						z-index: 1;
						top: -0.07rem;
					}
				}
				&.top3 {
					height: 4.34rem;
					right: 0;
					top: 1.6rem;
					.sort-img {
						position: relative;
						bottom: 0;
						width: 2.4rem;
						left: -0.5rem;
						z-index: 1;
						top: -0.07rem;
					}
				}
				.top-avatar {
					width: 1.6rem;
					height: 1.6rem;
					border-radius: 50%;
					position: absolute;
					left: 0.3rem;
					top: -0.5rem;
					padding: 0.04rem;
					z-index: 3;
					.avatar-in {
						width: 100%;
						height: 100%;
						border-radius: 50%;
						padding: 0.04rem;
						border: 1px solid;
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
							.top-avatar-img {
								display: block;
								width: 100%;
								height: 100%;
								border-radius: 50%;
								object-fit: cover;
							}
						}
					}
					.top-icon {
						position: absolute;
						display: block;
						width: 2.16rem;
						top: -0.366rem;
						left: -0.276rem;
					}
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
					margin-top: 0.13rem;
					font-weight: normal;
					color: rgba(255, 255, 255, 0.8);
					img {
						width: 0.26rem;
						height: 0.26rem;
						vertical-align: middle;
					}
				}
			}
		}
	}
	.reward-list {
		width: 7.5rem;
		// min-height: 14.36rem;
		position: relative;
		z-index: 5;
		// top: 0.5rem;
		margin-top: 0.5rem;
		background: linear-gradient(
			180deg,
			rgba(135, 138, 252, 0) 0%,
			#8889fb 2%,
			#9f80f0 100%
		);
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
		&.CHARM {
			background: linear-gradient(
				180deg,
				rgba(253, 141, 163, 0) 0%,
				#fd94a8 2%,
				#fd8ea4 100%
			);
			.reward-div {
				background: #fff1f5 !important;
				border: 0.02rem solid #ffdae1 !important;
			}
		}
		.reward-item {
			width: 6.7rem;
			height: 3.54rem;
			background: #ffffff;
			border-radius: 0.24rem;
			margin-top: 0.3rem;
			margin-left: 0.4rem;
			padding: 0.3rem;
			header {
				font-size: 0.28rem;
				font-weight: 400;
				color: #333333;
			}
			.reward-container {
				margin-top: 0.25rem;
				width: 6.1rem;
				height: 2.36rem;
				display: flex;
				justify-content: space-between;
				div {
					width: 1.88rem;
					height: 2.36rem;
					.reward-div {
						width: 1.88rem;
						height: 1.88rem;
						background: #edeefe;
						border-radius: 0.24rem;
						border: 0.02rem solid #d5d5ff;
						margin-bottom: 0.15rem;
						display: flex;
						justify-content: center;
						align-items: center;
						img {
							width: 1.6rem;
							height: 1.6rem;
						}
					}
					.reward-name {
						font-size: 0.24rem;
						font-weight: 400;
						color: #666666;
						text-align: center;
					}
				}
			}
		}
		.reward-text {
			width: 7.5rem;
			padding: 0 0.4rem;
			font-size: 0.28rem;
			font-weight: 400;
			color: #ffffff;
			margin-top: 0.4rem;
            opacity: 0.6;
		}
	}
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
</style>
