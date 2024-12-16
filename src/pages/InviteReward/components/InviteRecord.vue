<!--
 * @Author: wujiang@weli.cn
 * @Date: 2023-12-08 14:22:19
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-08-07 17:24:36
 * @Description: 邀请记录
-->
<template>
	<div class="tab-box">
		<div class="desc">
			<div class="title">{{ $t("reward-desc") }}</div>
			<div class="tips">
                <template v-if="specialRegionList.includes(region_id)">
                    <p>
                        {{ $t("ph-reward-desc-0") }}
                    </p>
                    <p>
                        {{ $t("ph-reward-desc-1") }}
                    </p>
                    <p>
                        {{ $t("ph-reward-desc-2") }}
                    </p>
                </template>
				<template v-else>
                    <p>
                        {{ $t("reward-desc-0") }}
                    </p>
                    <p>
                        {{ $t("reward-desc-1") }}
                    </p>
                    <p>
                        {{ $t("reward-desc-2") }}
                    </p>
                    <p>
                        {{ $t("reward-desc-3") }}
                    </p>
                </template>
				<div class="game-container" @click="openGame">
					<div class="game-header">
						<img
							src="https://yaame-static.yaame.io/admin/cfaa01e483054b262cd9171bd03d2bf8.png"
							alt=""
						/>
						<!-- {{ $t("game-header") }} -->
                        <span v-if="region_id !== 'SOUTHEAST_ASIA'">{{ $t("game-header") }}</span>
                        <span v-else>{{ $t("game-header-other") }}</span>
					</div>
					<div class="to-details">
						{{ $t("game-details") }}
						<img
							src="https://yaame-static.yaame.io/admin/fdb44adba1296c4923e8850b4bba4a59.png"
							alt=""
						/>
					</div>
					<div class="game-info">{{ $t("game-info") }}</div>
					<div class="game-gift">
						<div v-for="(item, index) in gameGiftList" :key="index">
							<img :src="item" alt="" />
						</div>
					</div>
					<div class="game-btn">
						{{ $t("game-btn") }}({{ can_lottery_times }})
					</div>
				</div>
			</div>
		</div>
		<div class="record">
			<div class="diamond-box">
				<div class="tip">{{ $t("had-reward") }}</div>
				<div class="num-box">
					<div class="num">{{ diamond_amount ? diamond_amount : 0 }}</div>
					<img
						class="icon"
						src="https://imgcom.static.suishenyun.net/im_icon_zs-e6a435.png"
						alt=""
					/>
				</div>
			</div>
			<!-- tab切换 -->
			<div class="record-tab">
				<div
					v-for="(item, index) in listTab"
					:key="index"
					:class="[listTabActive === index && 'by']"
					@click="tabChange(index)"
				>
					{{ item }}
				</div>
			</div>
			<div
				class="record-list"
				v-infinite-scroll="loadMore"
				:infinite-scroll-immediate-check="true"
				infinite-scroll-disabled="loading"
				infinite-scroll-distance="10"
			>
				<div v-for="(it, k) in list" :key="'record' + k" class="item">
					<template v-if="listTabActive === 0">
						<div class="day-box">
							<div class="day-dot">
								<img class="day-dot" :src="day_dot" alt="" />
								<img class="line-icon" :src="line_icon" alt="" />
							</div>
							<div class="day">{{ it.date }}</div>

                            <div class="day-reward">
                                +{{ it.diamond_amount ? it.diamond_amount : 0 }}
                                <img
                                    class="icon"
                                    src="https://imgcom.static.suishenyun.net/im_icon_zs-e6a435.png"
                                    alt=""
                                />
                            </div>
						</div>
						

						<div class="record-detail">
							<div
								v-for="(child, key) in it.invite_reward_records"
								:key="'detail' + key"
								class="item-detail"
							>
								<div class="detail-box">
									<div class="box-left">
										<img class="detail-dot" :src="item_dot_icon" alt="" />
										<img
											class="line-icon"
											:src="line_icon"
											alt=""
											v-show="
												!(
													k === list.length - 1 &&
													key === it.invite_reward_records.length - 1
												)
											"
										/>
									</div>
									<div class="box-right">
										<div class="role-info">
											<div style="width: 2rem" class="role-name no-wrap">{{ child.nick_name }}</div>
											<div class="role-id">ID: {{ child.yaame_id }}</div>
										</div>
										<div style="text-align: center;" class="desc">{{ $t(child.invite_reward_type) }}</div>
										<div class="reward">
											<span v-show="child.invite_reward_type !== 'INVITE'">
												+{{ child.diamond_amount ? child.diamond_amount : 0 }}
												<img
													class="icon"
													src="https://imgcom.static.suishenyun.net/im_icon_zs-e6a435.png"
													alt=""
												/>
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</template>
					<template v-else>
						<div class="user-item">
							<div class="user-details">
								<img :src="it.avatar" class="user-avatar" alt="" />
								<div class="user-info">
									<p class="user-name no-wrap">{{ it.nick_name }}</p>
									<p class="user-id">ID: {{ it.yaame_id }}</p>
								</div>
							</div>

							<div class="user-list">
								<div
									v-for="(ele, inx) in it.invite_reward_records"
									:key="inx"
									class="user-list-item"
								>
									<div>{{ ele.create_date }}</div>
									<div>{{ $t(ele.invite_reward_type) }}</div>
									<div>
										<span v-show="ele.invite_reward_type !== 'INVITE'">
											+{{ ele.diamond_amount ? ele.diamond_amount : 0 }}
											<img
												class="icon"
												src="https://imgcom.static.suishenyun.net/im_icon_zs-e6a435.png"
												alt=""
											/>
										</span>
									</div>
								</div>
							</div>
						</div>
					</template>
				</div>
				<div class="empty-record" v-show="list.length === 0">
					{{ $t("empty-invite") }}
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import request from "@/lib/request/activity";
import Toast from "@/components/third/toast/toast.js";
import moment from "moment";

export default {
	name: "InviteRecord",
	props: {
		loadingRefresh: {
			type: Function,
			default: () => {},
		},
		can_lottery_times: {
			type: Number,
			default: 0,
		},
		gameGiftList: {
			type: Array,
		},
        region_id: {
            type: String,
            default: '',
        },
	},
	filters: {
		formatDate(time) {
			return moment(time).format("yyyy.MM.DD");
		},
	},
	data() {
		return {
			diamond_amount: 0,
			has_next: null,
			page_cursor: "",
			list: [],
			page: 1,
			size: 10,
			date: "",
			day_dot:
				"https://yaame-static.yaame.io/admin/3ad838fad2f9a32ebd306a5a9acb954e.png",
			line_icon:
				"https://yaame-static.yaame.io/admin/8d938f52bf4e3159fe80a4f97dad40e6.png",
			item_dot_icon:
				"https://yaame-static.yaame.io/admin/43dd931b3a4b78c495e20ef059c15446.png",

			listTab: ["By Time", "By User"],
			listTabActive: 0,

            specialRegionList: ['PHILIPPINES', 'MIDDLE_EAST', 'SOUTHEAST_ASIA'],
		};
	},
	async created() {
		await this.getInviteRecord();
	},
	methods: {
		async getInviteRecord() {
			const { status, data, desc } = await request.getInviteRecord(
				this.page,
				this.size,
				this.page_cursor,
				this.listTabActive === 0 ? "TIME" : "USER"
			);
			this.$emit("loadingRefresh");
			if (status !== 1000) {
				Toast(desc);
				return;
			}
			const {
				has_next,
				diamond_amount,
				invite_reward_record_dates,
				invite_reward_record_users,
			} = data;
			this.has_next = has_next;
			if (diamond_amount) {
				this.diamond_amount = diamond_amount;
			}

            if (this.page === 1) {
                this.list = [];
            }
			if (invite_reward_record_dates && invite_reward_record_dates.length) {
				this.list = !this.list.length
					? invite_reward_record_dates
					: this.list.concat(invite_reward_record_dates);
				const obj_ = {};
				this.list.forEach((it) => {
					if (obj_[it.date]) {
						obj_[it.date].invite_reward_records = obj_[
							it.date
						].invite_reward_records.concat(it.invite_reward_records);
					} else {
						obj_[it.date] = it;
					}
				});
				this.list = Object.values(obj_);
				this.page_cursor = data.page_cursor;
			} else if (
				invite_reward_record_users &&
				invite_reward_record_users.length
			) {
				this.list = !this.list.length
					? invite_reward_record_users
					: this.list.concat(invite_reward_record_users);
				this.page_cursor = data.page_cursor;
			} else {
				this.has_next = false;
			}
		},
		loadMore() {
			if (this.has_next) {
				this.page = this.page + 1;
				this.getInviteRecord();
			}
		},
		openGame() {
			this.$emit("openGame");
		},
		tabChange(index) {
			this.listTabActive = index;
			this.page_cursor = "";
			this.page = 1;
			
			this.getInviteRecord();
		},
	},
};
</script>
<style scoped lang="less">
.tab-box {
	width: 100%;
	font-weight: 400;
	padding: 0 0.4rem;
	overflow-x: hidden;

	.desc {
		margin-top: 0.5rem;

		.title {
			height: 0.33rem;
			width: 5rem;
			font-size: 0.28rem;
			color: #000000;
			line-height: 0.4rem;
			font-weight: 700;
			background-image: url("../../../assets/img/invite/lingBg.png");
			background-repeat: no-repeat;
			background-size: 26% 100%;
		}

		.tips {
			font-size: 0.24rem;
			font-weight: 400;
			color: #7e8b85;
			line-height: 0.33rem;
			margin-top: 0.2rem;

			p {
				margin-bottom: 0.15rem;
			}
		}
	}

	.record {
		width: 6.1rem;
		height: 7.85rem;
		background: url("https://yaame-static.yaame.io/admin/7f135bf9a12fb3067394b74c18c5a0ee.png")
			no-repeat;
		background-size: 100% 100%;
		margin-top: 0.3rem;

		.diamond-box {
			display: flex;
			flex-direction: column;
			align-items: center;
			color: #000000;

			.tip {
				height: 0.33rem;
				font-size: 0.24rem;
				font-weight: 400;
				line-height: 0.33rem;
				margin-top: 0.33rem;
			}

			.num-box {
				display: flex;
				align-items: center;
				justify-content: center;

				.num {
					height: 0.81rem;
					font-size: 0.58rem;
					font-weight: 600;
					line-height: 0.81rem;
					margin-left: 0.5rem;
				}

				.icon {
					width: 0.5rem;
					height: 0.5rem;
					margin-left: 0.11rem;
				}
			}
		}

		.record-tab {
			position: relative;
			left: 50%;
			width: 3.56rem;
			height: 0.92rem;
			background: url("https://yaame-static.yaame.io/admin/20c0089da3df4b773d8b7f6072bba4c2.png");
			background-repeat: no-repeat;
			background-size: contain;
			transform: translateX(-50%);
			display: flex;
			justify-content: space-between;
			padding: 0.15rem 0.2rem 0.25rem;
			div {
				width: 1.52rem;
				height: 0.52rem;
				border-radius: 0.43rem;
				color: #ffffff;
				text-align: center;
				line-height: 0.52rem;
				font-size: 0.24rem;
			}

			.by {
				background: #ffffff;
				color: #e4596d;
			}
		}

		.record-list {
			height: 5rem;
			overflow-y: auto;
			margin: 0.2rem 0.1rem;

			.empty-record {
				display: flex;
				align-items: center;
				justify-content: center;
				// margin-top: 3.3rem;
				margin-top: 2rem;
				font-size: 0.24rem;
				color: #999999;
			}

			.item {
				display: flex;
				flex-direction: column;
				font-family: PingFangSC, PingFang SC;

				.day-box {
					display: flex;
					align-items: center;
					height: 0.37rem;
					margin: 0 0.14rem;

					.day-dot {
						position: relative;
						width: 0.28rem;
						height: 0.28rem;

						.line-icon {
							height: 0.74rem;
							position: absolute;
							top: 50%;
							left: 50%;
							transform: translateX(-50%);
						}
					}

					.day {
						font-size: 0.26rem;
						font-weight: 500;
						color: #000000;
						line-height: 0.37rem;
						margin-left: 0.18rem;
					}
				}

				.day-reward {
					display: flex;
					align-items: center;
					font-size: 0.2rem;
					font-weight: 500;
					color: #000000;
					line-height: 0.28rem;
					margin-left: 0.59rem;

					img {
						width: 0.2rem;
						height: 0.2rem;
						margin-left: 0.11rem;
					}
				}

				.record-detail {
					.item-detail {
						.detail-box {
							display: flex;
							margin: 0.2rem 0.22rem;
							line-height: 0.33rem;

							.box-left {
								margin-top: 0.11rem;
								position: relative;
								width: 0.12rem;
								height: 0.12rem;

								.detail-dot {
									width: 0.12rem;
									height: 0.12rem;
								}

								.line-icon {
									height: 0.9rem;
									position: absolute;
									top: 50%;
									left: 50%;
									transform: translateX(-100%);
								}
							}

							.box-right {
								width: 100%;
								display: flex;
								margin: 0;
								padding: 0;
								font-size: 0.24rem;
								justify-content: space-between;
								padding-left: 0.26rem;
								font-weight: 500;
								color: #000000;

								.role-info {
									.role-id {
										font-size: 0.18rem;
										font-weight: 500;
										color: #999999;
									}
								}

								.desc {
									margin-top: 0;
									color: #999999;
									font-size: 0.18rem;
									font-weight: 400;
								}

								.reward {
									width: 1.5rem;
									text-align: right;

									img {
										width: 0.2rem;
										height: 0.2rem;
										margin-top: 0.08rem;
									}
								}
							}
						}
					}
				}
			}
		}
	}
}

.game-container {
	width: 6.1rem;
	height: 2.78rem;
	margin: 0.2rem 0 0.3rem;
	background-size: 100% 100%;
	background-repeat: no-repeat;
	background-image: url(https://yaame-static.yaame.io/admin/b24f65d9594ea02eca58c96fbb7a781c.png);
	position: relative;
	.game-header {
		width: 4rem;
		height: 0.3rem;
		line-height: 0.3rem;
		position: absolute;
		left: 0.31rem;
		top: 0.25rem;
		font-size: 0.26rem;
		font-weight: normal;
		color: #ffffff;
		img {
			width: 0.3rem;
			height: 0.3rem;
			display: inline-block;
			margin-right: 0.12rem;
		}
	}
	.to-details {
		height: 0.3rem;
		width: 1.82rem;
		position: absolute;
		left: 4.36rem;
		top: 0.2rem;
		font-size: 0.22rem;
		font-weight: 600;
		color: #ed6fb2;
		display: flex;
		align-items: center;
		img {
			width: 0.2rem;
			height: 0.2rem;
			margin-left: 0.1rem;
		}
	}
	.game-info {
		width: 5.5rem;
		position: absolute;
		left: 0.3rem;
		top: 0.73rem;
		font-size: 0.2rem;
		font-weight: 400;
		color: #ffffff;
		opacity: 0.8;
	}
	.game-gift {
		width: 3.22rem;
		height: 1.08rem;
		background: linear-gradient(
			180deg,
			#f6ccdf 0%,
			#ffffff 24%,
			#ffffff 52%,
			#fcedf5 86%,
			#fae4f0 100%
		);
		border-radius: 0.2rem;
		border: 0.02rem solid #b5799b;
		position: absolute;
		left: 0.3rem;
		top: 1.41rem;
		display: flex;
		justify-content: space-between;
		flex-wrap: nowrap;
		padding: 0.1rem;
		div {
			width: 0.94rem;
			height: 0.88rem;
			background: #ffcfe8;
			border-radius: 0.2rem;
			display: flex;
			justify-content: center;
			align-items: center;
			img {
				width: 0.88rem;
				height: auto;
			}
		}
	}
	.game-btn {
		width: 2.38rem;
		height: 1.06rem;
		background-size: contain;
		background-repeat: no-repeat;
		background-image: url(https://yaame-static.yaame.io/admin/89874ec0bed650be080f383443f83cb9.png);
		position: absolute;
		left: 3.55rem;
		top: 1.47rem;
		text-align: center;
		line-height: 1.04rem;
		font-size: 0.22rem;
		font-weight: 600;
		color: #3b3924;
	}
}

.user-item {
	width: 5.5rem;
	margin: 0 0.2rem 0.4rem;
	.user-details {
		width: 5.5rem;
		height: 0.66rem;
		margin-bottom: 0.21rem;
		display: flex;
		.user-avatar {
			width: 0.66rem;
			height: 0.66rem;
			border-radius: 50%;
			margin-right: 0.24rem;
		}
		.user-info {
			.user-name {
				font-size: 0.24rem;
				font-weight: 500;
				color: #000000;
                width: 4rem;
			}
			.user-id {
				font-size: 0.18rem;
				font-weight: 500;
				color: #999999;
			}
		}
	}
	.user-list {
		width: 5.5rem;
        padding-top: 0.23rem;
        padding-bottom: 0.23rem;
        background: #FFF0F0;
        border-radius: 0.24rem;
        border: 0.02rem solid #FFFFFF;
		.user-list-item {
			display: flex;
            margin-bottom: 0.2rem;
            &:last-of-type {
                margin-bottom: 0;
            }
			div {
				flex: 1;
				text-align: center;
				&:nth-child(1) {
					font-size: 0.24rem;
					font-weight: 500;
					color: #000000;
				}
				&:nth-child(2) {
					font-size: 0.2rem;
					font-weight: 400;
					color: #999999;
				}
				&:nth-child(3) {
					font-size: 0.18rem;
					font-weight: 400;
					color: #000000;
					img {
						width: 0.19rem;
						height: auto;
						vertical-align: middle;
					}
				}
			}
		}
	}
}
</style>
