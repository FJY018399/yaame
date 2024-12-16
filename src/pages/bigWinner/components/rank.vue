<template>
	<div :class="['rank', tabActive]">
		<header class="header">
			<img
				src="https://yaame-static.yaame.io/admin/db927705e73ca80c8e33c5b06d8160d5.png"
				class="back-icon"
				alt=""
			/>
			{{ $t("title") }}
		</header>

		<div :class="['tab-container', tabActive]">
			<div @click="tabChange('Silver')">{{ $t("silver") }}</div>
			<div @click="tabChange('Gold')">{{ $t("gold") }}</div>
		</div>

		<div :class="['top-list', tabActive]">
			<div
				v-for="(item, index) in topList"
				:key="index"
				:class="['top-item', 'top-' + index]"
			>
				<img
					v-show="index === 0"
					class="avatar-dress"
					src="https://yaame-static.yaame.io/admin/232531a8d1328bfee477f48dbcc76b75.png"
					alt=""
				/>
				<img
					v-show="index === 1"
					class="avatar-dress"
					src="https://yaame-static.yaame.io/admin/9934db98cb5976ef770fbefcc11b1762.png"
					alt=""
				/>
				<img
					v-show="index === 2"
					class="avatar-dress"
					src="https://yaame-static.yaame.io/admin/8b508f33218d28be1e07a9e6455ed60a.png"
					alt=""
				/>

				<img :src="item.subject_icon" class="avatar" alt="" />

				<p class="user-name">{{ item.subject_name }}</p>
				<p class="user-name">
					<img
						src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png"
						alt=""
					/>
					{{ item.income_diamonds }}
				</p>
			</div>
		</div>
	</div>
</template>

<script>
import request from "@/lib/request/draw.js";

const getDefaultUser = () => {
	return {
		income_diamonds: "0",
		subject_name: "-",
		subject_icon:
			"https://yaame-static.yaame.io/admin/3754bb61a4df0fae4e166999c2401876.png",
	};
};
export default {
	data() {
		return {
			tabActive: "Silver",

			list: [],
			topList: [],
			userInfo: false,

			page: 1,
		};
	},
	props: {
		language: {
			type: String,
			required: true,
			default: "en",
		},
	},
	mounted() {
		this.getData();
	},
	methods: {
		tabChange(val) {
			this.tabActive = val;
			this.getData();
		},

		async getData() {
			let res = await request.getPolLotteryTop({
				activity_rank_type:
					this.tabActive === "Silver" ? "BIG_WIN_SILVER" : "BIG_WIN_GOLD",
				page: 1,
				size: 10,
				activity_rank_cycle_type: "DAY",
			});
			if (res.status === 1000) {
				let content = res.data.content;
				if (this.page === 1) {
					this.no_person = content.length < 3;
					this.topList[0] = content[0] || getDefaultUser();
					this.topList[1] = content[1] || getDefaultUser();
					this.topList[2] = content[2] || getDefaultUser();

					this.list = content.slice(3, content.length);
				} else {
					this.list = this.list.concat(content);
				}

				if (res.data.my_rank) {
					this.userInfo = res.data.my_rank;
				} else {
					this.userInfo = false;
				}

				this.$forceUpdate();
			} else {
				Toast(res.desc);
			}
		},
	},
};
</script>
<style scoped lang="less">
.rank {
	width: 7.5rem;
	height: 12.15rem;
	background-size: 7.5rem auto;
	background-repeat: no-repeat;
	position: relative;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 999999;
    padding-top: 2.4rem;
	&.Silver {
		background-color: #908e8f;
		background-image: url(https://yaame-static.yaame.io/admin/352690f494b2f79100d41a9cfafdc560.png);
	}
	&.Gold {
		background-color: #f4c735;
		background-image: url(https://yaame-static.yaame.io/admin/5726ee68df330e0b83b2a1f118b2dac8.png);
	}
	.header {
		width: 7.5rem;
		height: 0.95rem;
		position: relative;
		padding-top: 0.58rem;
		text-align: center;
		font-size: 0.36rem;
		font-weight: normal;
		color: #ffffff;
		font-weight: bolder;
		.back-icon {
			width: 0.2rem;
			height: 0.37rem;
			position: absolute;
			left: 0.3rem;
			top: 0.58rem;
		}
	}
	.tab-container {
		width: 3.11rem;
		height: 0.58rem;
		position: absolute;
		left: 50%;
		top: 1.32rem;
		transform: translateX(-50%);
		display: flex;
		background-size: contain;
		background-repeat: no-repeat;
		color: #fff;
		&.Silver {
			background-image: url(https://yaame-static.yaame.io/admin/8bf055e77c49054a75886673f079bcc5.png);
			div:nth-child(1) {
				width: 1.7rem;
				color: #3160ff;
			}
		}
		&.Gold {
			background-image: url(https://yaame-static.yaame.io/admin/0cd5a58d583c37831e91aa19d23b910d.png);
			div:nth-child(2) {
				width: 1.7rem;
				color: #dd1900;
			}
		}
		div {
			width: 1.31rem;
			text-align: center;
			line-height: 0.58rem;
			font-size: 0.28rem;
			font-weight: bold;
		}
	}
	.top-list {
		width: 7.5rem;
		height: 4rem;
		background-size: contain;
		background-repeat: no-repeat;
        padding-top: 0.5rem;
		.top-item {
			width: 2.2rem;
			height: 2.8rem;
			position: absolute;
			top: 0.64rem;
			padding-top: 2.2rem;
			&.top-0 {
				width: 2.4rem;
				height: 3.5rem;
				position: absolute;
				left: 50%;
                transform: translateX(-50%);

                top: 0;
				padding-top: 2.4rem;
				.avatar-dress {
					width: 2.4rem;
					height: 2.4rem;
					position: absolute;
					left: 0;
					top: 0;
					z-index: 1;
				}
				.avatar {
					width: 1.5rem;
					height: 1.5rem;
					display: block;
					border-radius: 50%;
					position: absolute;
					top: 0.44rem;
					left: 0.44rem;
				}
			}
			&.top-1 {
				left: 0.36rem;
			}
			&.top-2 {
				right: 0.36rem;
			}
			.avatar-dress {
				width: 2.2rem;
				height: 2.2rem;
				position: absolute;
				left: 0;
				top: 0;
			}
			.avatar {
				width: 1.3rem;
				height: 1.3rem;
				display: block;
				border-radius: 50%;
				position: absolute;
				top: 0.44rem;
				left: 0.44rem;
			}
			.user-name {
				width: 2.2rem;
				text-align: center;
				font-size: 0.24rem;
				font-weight: normal;
				color: #ffffff;
				img {
					width: 0.24rem;
					height: auto;
					vertical-align: middle;
				}
			}
		}
	}
}
</style>
