<template>
	<div
		:style="{ paddingTop: safe_height + 1.08 + 'rem' }"
		:class="['main', language]"
	>
		<Header style="position: fixed" color="white" :keep="true" :keepColor="false"
			><span>{{ $t("title") }}</span></Header
		>

		<div class="tab-container">
			<div
				v-for="(item, index) in tabList"
				:key="index"
				class="tab"
				@click="tabActive = item.key"
			>
				<img :src="computedTabImg(item)" alt="" />
			</div>
		</div>

		<div v-if="tabActive === 'send' && send_reward_items.length" class="send">
			<div class="one">
				<div
					v-for="item in send_reward_items[0].reward_item_vo_list"
					:key="item.icon"
					class="item"
				>
					<img :src="item.icon" class="item-img" alt="" />
					<div class="item-name">
						<p class="no-wrap">{{ item.gift_name }}</p>
					</div>
					<div class="day">
						<p>{{ item.validity_date }}</p>
					</div>
				</div>
			</div>

			<div class="two">
				<div
					v-for="item in send_reward_items[1].reward_item_vo_list"
					:key="item.icon"
					class="item"
				>
					<img :src="item.icon" class="item-img" alt="" />
					<div class="item-name">
						<p class="no-wrap">{{ item.gift_name }}</p>
					</div>
					<div class="day">
						<p>{{ item.validity_date }}</p>
					</div>
				</div>
			</div>

			<div class="three">
				<div
					v-for="item in send_reward_items[2].reward_item_vo_list"
					:key="item.icon"
					class="item"
				>
					<img :src="item.icon" class="item-img" alt="" />
					<div class="item-name">
						<p class="no-wrap">{{ item.gift_name }}</p>
					</div>
					<div class="day">
						<p>{{ item.validity_date }}</p>
					</div>
				</div>
			</div>
		</div>
		<div v-if="tabActive === 'receive'" class="send">
			<template v-if="star_reward_items.length">
				<div class="one">
					<div
						v-for="item in star_reward_items[0].reward_item_vo_list"
						:key="item.icon"
						class="item"
					>
						<img :src="item.icon" class="item-img" alt="" />
						<div class="item-name">
							<p class="no-wrap">{{ item.gift_name }}</p>
						</div>
						<div class="day">
							<p>{{ item.validity_date }}</p>
						</div>
					</div>
				</div>

				<div class="two">
					<div
						v-for="item in star_reward_items[1].reward_item_vo_list"
						:key="item.icon"
						class="item"
					>
						<img :src="item.icon" class="item-img" alt="" />
						<div class="item-name">
							<p class="no-wrap">{{ item.gift_name }}</p>
						</div>
						<div class="day">
							<p>{{ item.validity_date }}</p>
						</div>
					</div>
				</div>

				<div class="three">
					<div
						v-for="item in star_reward_items[2].reward_item_vo_list"
						:key="item.icon"
						class="item"
					>
						<img :src="item.icon" class="item-img" alt="" />
						<div class="item-name">
							<p class="no-wrap">{{ item.gift_name }}</p>
						</div>
						<div class="day">
							<p>{{ item.validity_date }}</p>
						</div>
					</div>
				</div>
			</template>
		</div>
	</div>
</template>

<script>
import Header from "../../components/common/header.vue";
import { getSafeHeight, getLanguage } from "../../lib/device";
import request from "../../lib/request/halloween.js";
import pageLoading from "../../components/common/page_loading.vue";
export default {
	components: {
		Header,
		pageLoading,
	},
	data() {
		return {
			safe_height: 0,

			page_loading: true,

			tabList: [
				{
					key: "send",
				},
				{
					key: "receive",
				},
			],
			tabActive: "send",
			tabImgList: {
				"zh-cn": {
					send: {
						default:
							"https://yaame-static.yaame.io/admin/d38635053773bc04fbd7ec2c6393a7a5.png",
						active:
							"https://yaame-static.yaame.io/admin/13d3f3aa140e165f08c8a4ff571dbf54.png",
					},
					receive: {
						default:
							"https://yaame-static.yaame.io/admin/dbf6e172441d7d31ff278569a98b6beb.png",
						active:
							"https://yaame-static.yaame.io/admin/222c0ce68334541f7ac83794fcd44516.png",
					},
				},
				"zh-tw": {
					send: {
						default:
							"https://yaame-static.yaame.io/admin/45c22ada5b3724ce47cf974c0be0b341.png",
						active:
							"https://yaame-static.yaame.io/admin/266a2f234311b10b2aeaa835a9166e21.png",
					},
					receive: {
						default:
							"https://yaame-static.yaame.io/admin/b33b7632dbbc47c2c1880eb630b2b40c.png",

						active:
							"https://yaame-static.yaame.io/admin/ddd0593259658d3cd5db112f9e7363ff.png",
					},
				},
				en: {
					send: {
						default:
							"https://yaame-static.yaame.io/admin/aeb88402e3d28135d767ef652841d75e.png",
						active:
							"https://yaame-static.yaame.io/admin/063b573b9efc43f31a85747edce0ea78.png",
					},
					receive: {
						default:
							"https://yaame-static.yaame.io/admin/d4ab60d228f05e57dd7208d6fe83b99f.png",

						active:
							"https://yaame-static.yaame.io/admin/f03ed9cd0878f2f87294d79259d79eb4.png",
					},
				},
				id: {
					send: {
						default:
							"https://yaame-static.yaame.io/admin/b800770a18dc3d268e88635bda096ba2.png",
						active:
							"https://yaame-static.yaame.io/admin/638d9ffc1f7f96e16637a9dc03aedb8f.png",
					},
					receive: {
						default:
							"https://yaame-static.yaame.io/admin/07bba6e67434bbdf7e772c20ad4e6a52.png",

						active:
							"https://yaame-static.yaame.io/admin/6ed8e53a3a25f34e407b56583b3ac3ff.png",
					},
				},
				ar: {
					send: {
						default:
							"https://yaame-static.yaame.io/admin/a0636ffca97c0a417816dda809e1f363.png",
						active:
							"https://yaame-static.yaame.io/admin/fe59bfcf9836e534ebe999eb34de05fb.png",
					},
					receive: {
						default:
							"https://yaame-static.yaame.io/admin/772679f7ff0c234042921f0e522590eb.png",

						active:
							"https://yaame-static.yaame.io/admin/d8c5273055604f427158d6eb309d43a7.png",
					},
				},
			},

			send_reward_items: [],
			star_reward_items: [],
		};
	},
	computed: {
		language() {
			let locale = getLanguage() || "en";
			if (["zh-hk", "zh-tw", "zh-mo", "zh-cn", 'zh_cn'].indexOf(locale) > -1) {
				let localEnum = {
					"zh-hk": "zh-tw",
					"zh-tw": "zh-tw",
					"zh-mo": "zh-tw",
					"zh-cn": "zh-cn",
					"zh_cn": "zh-cn",
				};

				locale = localEnum[locale];
			}
			return locale;
		},
	},
	mounted() {
		let safe_area = getSafeHeight() || 0;
		this.safe_height = (safe_area * 2) / 100;
		this.getData();
	},
	methods: {
		async getData() {
			let res = await request.getHalloweenRankList({
				page: 1,
				size: 30,
				halloweenRankType: "SEND_GIFT",
			});
			if (res.status === 1000) {
				this.send_reward_items = res.data.send_reward_items;
				this.star_reward_items = res.data.star_reward_items;
			}
		},
		computedTabImg(item) {
			if (this.tabActive === item.key) {
				return this.tabImgList[this.language][item.key].active;
			} else {
				let key = this.tabActive === "send" ? "receive" : "send";

				return this.tabImgList[this.language][key].default;
			}
		},
	},
};
</script>
<style lang="less">
.main {
	width: 7.5rem;
	min-height: 100vh;
	background-image: url(https://yaame-static.yaame.io/admin/fbe098299acce89c9036261a60aabc6e.png);
	background-size: contain;
	background-repeat: no-repeat;
	position: relative;
	background-color: #220d5b;
	font-size: 0.24rem;
	color: #fff;
	.tab-container {
		width: 7.5rem;
		height: 0.88rem;
		padding: 0 0.9rem;
		display: flex;
		justify-content: space-between;
		.tab {
			width: 2.7rem;
			height: 0.88rem;
			img {
				width: 100%;
				height: 100%;
			}
		}
	}
	.send {
		margin-top: 0.3rem;
		padding-left: 0.16rem;
		padding-bottom: 0.5rem;
		.one {
			width: 7.18rem;
			height: 5.46rem;
			background-size: 7.18rem auto;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/f8e0662e0951316e6bd08708528ec5f5.png);
			display: flex;
			flex-wrap: wrap;
			padding-top: 1.16rem;
			padding-left: 0.6rem;
			padding-right: 0.35rem;
		}
		.two {
			width: 7.18rem;
			height: 5.46rem;
			background-size: 7.18rem auto;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/fdb9a4a1564d28f0b8df3e60d5e7a627.png);
			display: flex;
			flex-wrap: wrap;
			padding-top: 1.16rem;
			padding-left: 0.6rem;
			padding-right: 0.35rem;
			margin-top: 0.3rem;
		}
		.three {
			width: 7.18rem;
			height: 3.3rem;
			background-size: 7.18rem auto;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/2e8c3c451989ec06ba60f6f79cc9861a.png);
			display: flex;
			flex-wrap: wrap;
			padding-top: 1.16rem;
			padding-left: 0.6rem;
			padding-right: 0.35rem;
			margin-top: 0.3rem;
		}
	}

	.item {
		width: 1.8rem;
		height: 1.8rem;
		background: linear-gradient(180deg, #6d68ba 0%, #6b66ba 100%);
		border-radius: 0.08rem;
		position: relative;
		margin-right: 0.25rem;
		display: flex;
		justify-content: center;
		align-items: center;
		.item-img {
			width: 1.5rem;
			height: auto;
		}
		.item-name {
			width: 1.2rem;
			height: 0.4rem;
			text-align: center;
			line-height: 0.4rem;
			background: rgba(0, 0, 0, 0.3);
			border-radius: 0.2rem;
			border: 0.01rem solid rgba(255, 255, 255, 0.3);
			font-size: 0.24rem;
			font-weight: 600;
			color: #ffffff;
			position: absolute;
			left: 0.3rem;
			top: 1.32rem;

			p {
				transform: scale(0.75);
				width: 1.4rem;
				margin-left: -0.1rem;
			}
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
			p {
				text-align: center;
				font-size: 0.24rem;
				color: #fff;
				font-weight: 600;
				transform: scale(0.75);
			}
		}
	}
}
</style>
