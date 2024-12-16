<!--
 * @Author: Elk
 * @Date: 2024-06-10 17:35:20
 * @FilePath: /yaame-h5/src/pages/EidAlAdha/views/myConsignment.vue
 * @Description: 
-->
<template>
	<div class="myConsignment">
		<img
			class="back-icon"
			src="https://yaame-static.yaame.io/admin/f31555c45259c27b0de360fc5c27bac6.png"
			alt=""
			@click="back"
		/>

		<p class="header-title">{{ $t("myConsignment") }}</p>

		<div class="consignment-container">
			<div class="tab-container">
				<div
					v-for="(item, index) in tabList"
					:key="index"
					:class="['tab-item no-wrap', tabActive === item && 'active']"
					@click="handleTabClick(item)"
				>
					{{ $t(item) }}
				</div>
			</div>
			<refresh class="refresh" ref="wlRefresh" @onRefresh="refreshList">
				<div
					v-show="tabActive === 'can_sell' && sellList.length"
					class="rank-container"
				>
					<div
						v-for="(item, index) in sellList"
						:key="index"
						:class="['rank-item', 'rank-item' + item.rarity]"
					>
						<div class="img-div">
							<img :src="item.icon" alt="" />
						</div>
						<div class="item-info">
							<p class="item-name">{{ item.name }}</p>
							<p class="item-num">
								{{ $t("hold_quantity") }}: {{ item.count }}
							</p>
							<p class="item-price">
								<img
									v-show="language === 'ar'"
									src="https://yaame-static.yaame.io/admin/f8a2d6dd3c7c1516135e1d2e6d3bc6fc.png"
									alt=""
								/>
								{{ $t("recommended_price") }}: {{ item.price }}
								<img
									v-show="language !== 'ar'"
									src="https://yaame-static.yaame.io/admin/f8a2d6dd3c7c1516135e1d2e6d3bc6fc.png"
									alt=""
								/>
							</p>
						</div>
						<div class="item-btn no-wrap" @click="handleConsignment(item)">
							{{ $t("consignment_now") }}
						</div>
					</div>
				</div>

				<div
					v-show="tabActive === 'already_sell' && soldList.length"
					v-infinite-scroll="loadMore"
					:infinite-scroll-immediate-check="true"
					infinite-scroll-disabled="loading"
					infinite-scroll-distance="10"
					class="rank-container"
				>
					<div
						v-for="(item, index) in soldList"
						:key="index"
						:class="['rank-item', 'rank-item' + item.rarity]"
					>
						<div class="img-div">
							<img :src="item.icon" alt="" />
						</div>
						<div class="item-info">
							<p class="item-name">{{ item.name }}</p>
							<p class="item-num">
								{{ $t("listed_quantity") }}: {{ item.count }}
							</p>
							<p class="item-price">
								<img
									v-show="language === 'ar'"
									src="https://yaame-static.yaame.io/admin/f8a2d6dd3c7c1516135e1d2e6d3bc6fc.png"
									alt=""
								/>
								{{ $t("total_price") }}: {{ item.total_diamond }}
								<img
									v-show="language !== 'ar'"
									src="https://yaame-static.yaame.io/admin/f8a2d6dd3c7c1516135e1d2e6d3bc6fc.png"
									alt=""
								/>
							</p>
						</div>
						<div class="item-btn no-wrap" @click="postCancelSell(item)">
							{{ $t("cancel_consignment") }}
						</div>
					</div>
				</div>

				<div
					v-show="
						(tabActive === 'already_sell' && soldList.length === 0) ||
						(tabActive === 'can_sell' && sellList.length === 0)
					"
					class="reward-empty"
				>
					<div class="empty-core">
						<img
							src="https://yaame-static.yaame.io/admin/edc13e211a180dda554c8d6c4b64c502.png"
							alt=""
						/>
						<p>{{ $t("NotOnTheListYet") }}</p>
					</div>
				</div>
			</refresh>
		</div>

		<Popup v-show="consignmentVisible" class="flex-box">
			<div class="consignment-popup">
				<div class="popup-header">
					<div class="header-content">{{ $t("consignment_tips") }}</div>
				</div>

				<p class="price">{{ $t("consignment_price") }}</p>
				<div class="confirm-content">
					<!-- <div class="min" @click="handleMin('price')">MIN</div>
					<div class="min max" @click="handleMax('price')">MAX</div> -->

					<img
						class="reduction"
						src="https://yaame-static.yaame.io/admin/4f70c7de55f19d4f6cd2a622985d27dc.png"
						alt=""
						@click="handleReduction('price')"
					/>
					<img
						class="reduction add"
						src="https://yaame-static.yaame.io/admin/493e8f1adaa4102c9c97e3d1a5fd056a.png"
						alt=""
						@click="handleAdd('price')"
					/>

					<div class="num-input">{{ selectPrice }}</div>
				</div>
				<p class="num">{{ $t("consignment_quantity") }}</p>
				<div class="confirm-content">
					<div class="min" @click="handleMin('num')">MIN</div>
					<div class="min max" @click="handleMax('num')">MAX</div>

					<img
						class="reduction"
						src="https://yaame-static.yaame.io/admin/4f70c7de55f19d4f6cd2a622985d27dc.png"
						alt=""
						@click="handleReduction('num')"
					/>
					<img
						class="reduction add"
						src="https://yaame-static.yaame.io/admin/493e8f1adaa4102c9c97e3d1a5fd056a.png"
						alt=""
						@click="handleAdd('num')"
					/>

					<div class="num-input">{{ selectNum }}</div>
				</div>

				<p class="buy-info">{{ $t("transaction_fee") }}</p>
				<p class="all-price">
					<img
						v-show="language === 'ar'"
						src="https://yaame-static.yaame.io/admin/f8a2d6dd3c7c1516135e1d2e6d3bc6fc.png"
						alt=""
					/>
					{{ $t("total_price") }} {{ selectPrice * selectNum }}
					<img
						v-show="language !== 'ar'"
						src="https://yaame-static.yaame.io/admin/f8a2d6dd3c7c1516135e1d2e6d3bc6fc.png"
						alt=""
					/>
				</p>
				<p v-show="canSell" class="all-income">
					<img
						v-show="language === 'ar'"
						src="https://yaame-static.yaame.io/admin/f8a2d6dd3c7c1516135e1d2e6d3bc6fc.png"
						alt=""
					/>
					{{ $t("income") }} {{ Math.floor(selectPrice * selectNum * 0.8) }}
					<img
						v-show="language !== 'ar'"
						src="https://yaame-static.yaame.io/admin/f8a2d6dd3c7c1516135e1d2e6d3bc6fc.png"
						alt=""
					/>
				</p>
				<p v-show="!canSell" class="red-info">
					{{ $t("consignment_price_error") }}
				</p>
				<div :class="['close-btn', !canSell && 'disabled']" @click="submit">
					{{ $t("consignment_now") }}
				</div>
				<div class="close-icon" @click="consignmentVisible = false"></div>
			</div>
		</Popup>

		<Info v-show="cancelVisible" @confirm="cancelVisible = false">
			<template v-slot:header>{{ $t("removalFailure") }}</template>
			<template v-slot:default>
				<p class="content-p">{{ $t("goodsSold") }}</p>
			</template>
			<template v-slot:btn>{{ $t("confirm") }}</template>
		</Info>
	</div>
</template>
<script setup>
import { ref, onMounted, computed, getCurrentInstance } from "vue";
import Popup from "@/components/common/pop_up";
import Info from "../components/popupInfo";
import {
	getSellListApi,
	getSoldListApi,
	postSellApi,
	postCancelSellApi,
} from "../api.js";
import { Toast } from "vant";
import { getLanguage } from "@/lib/device";
import refresh from "@/components/common/refresh.vue";
const root = getCurrentInstance();

const t = (val) => {
	return root.proxy.$i18n.t(val);
};

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
const back = () => {
	root.proxy.$router.go(-1);
};

let tabList = ref(["can_sell", "already_sell"]);

let tabActive = ref("can_sell");

const handleTabClick = (item) => {
	tabActive.value = item;
	if (item === "can_sell") {
		getSellList();
	} else {
		page.value = 1;
		getSoldList();
	}
};

let sellList = ref([]);
const getSellList = async () => {
	let res = await getSellListApi();
	if (res.status === 1000) {
		if (res.data.eid_al_ad_dish_ingredients_list) {
			sellList.value = res.data.eid_al_ad_dish_ingredients_list;
		} else {
			sellList.value = [];
		}
	}
};

// 已寄售列表
let soldList = ref([]);
let page = ref(1);
let has_next = ref(true);
const getSoldList = async () => {
	let res = await getSoldListApi({
		page: page.value,
		size: 20,
	});
	if (res.status === 1000) {
		if (res.data.content.length < 20) {
			has_next.value = false;
		}
		if (page.value === 1) {
			soldList.value = res.data.content;
			return;
		} else {
			soldList.value = soldList.value.concat(res.data.content);
		}
	}
};

const loadMore = async () => {
	if (!has_next.value) {
		return;
	}
	page.value++;
	await getSoldList();
};

let consignmentVisible = ref(false);
let selectPrice = ref(200);
let selectNum = ref(1);
let activeItem = ref({});
const handleReduction = (value) => {
	if (value === "price") {
		if (selectPrice.value > 1) {
			selectPrice.value--;
		}
	} else {
		if (selectNum.value > 1) {
			selectNum.value--;
		}
	}
};
const handleAdd = (value) => {
	if (value === "price") {
		if (selectPrice.value >= 9999) {
			return;
		}
		selectPrice.value++;
	} else {
		if (selectNum.value >= activeItem.value.count) {
			return;
		}
		selectNum.value++;
	}
};
const closePopup = () => {
	consignmentVisible.value = false;
};

const handleMin = (value) => {
	if (value === "price") {
		selectPrice.value = 1;
	} else {
		selectNum.value = 1;
	}
};

const handleMax = (value) => {
	if (value === "price") {
		selectPrice.value = 9999;
	} else {
		selectNum.value = activeItem.value.count;
	}
};

const handleConsignment = (item) => {
	activeItem.value = item;
	selectNum.value = item.count;
	selectPrice.value = item.price;
	consignmentVisible.value = true;
};

const submit = async () => {
	if (!canSell.value) {
		return;
	}
	let res = await postSellApi({
		eid_al_ad_ingredients_type: activeItem.value.ingredients,
		price: selectPrice.value,
		num: selectNum.value,
	});
	if (res.status === 1000) {
		consignmentVisible.value = false;
		getSellList();
		Toast.success(t("consignmentSuccess"));
	} else {
		consignmentVisible.value = false;
		Toast.fail(res.desc);
	}
};
let canSell = computed(() => {
	if (selectNum.value * selectPrice.value >= 10) {
		return true;
	}
	return false;
});

const postCancelSell = async (item) => {
	let res = await postCancelSellApi({
		market_id: item.market_id,
	});
	if (res.status === 1000) {
		page.value = 1;
		getSellList();
		getSoldList();
		Toast.success(t("cancelSuccess"));
	} else if (res.status === 10021) {
		cancelVisible.value = true;
		page.value = 1;
		getSoldList();
	} else {
		Toast.fail(res.desc);
	}
};
const wlRefresh = ref(null);
const refreshList = async () => {
	if (tabActive.value === "can_sell") {
		await getSellList();
	} else {
		page.value = 1;
		await getSoldList();
	}
	setTimeout(() => {
		wlRefresh.value.isLoading = false;
	}, 500);
};
let cancelVisible = ref(false);
onMounted(async () => {
	await getSellList();
	getSoldList();
});
</script>
<style scoped lang="less">
.myConsignment {
	width: 7.5rem;
	min-height: 100vh;
	background-size: contain;
	background-repeat: no-repeat;
	background-image: url(https://yaame-static.yaame.io/admin/811e7f8f099edd7afe9f77b8f4ef273e.png);
	padding-top: 1.65rem;
	font-size: 0.24rem;
	.back-icon {
		width: 0.54rem;
		height: 0.54rem;
		position: absolute;
		left: 0.3rem;
		top: 0.93rem;
	}
	.header-title {
		width: 4.5rem;
		font-weight: 600;
		font-size: 0.3rem;
		color: #326052;
		left: 1.5rem;
		position: absolute;
		top: 0.98rem;
		text-align: center;
	}
	.consignment-container {
		width: 6.9rem;
		height: 14.6rem;
		margin-left: 0.3rem;
		background-size: 6.9rem 14.86rem;
		background-repeat: no-repeat;
		background-image: url(https://yaame-static.yaame.io/admin/dc20c3d300e8c452a8bb87d9a77e114b.png);
		padding: 0.3rem;

		.tab-container {
			width: 4.46rem;
			height: 0.8rem;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/9c5c45ad82214cc173882ea94d92a87b.png);
			margin-left: 0.9rem;
			display: flex;
			.tab-item {
				flex: 1;
				line-height: 0.8rem;
				background-size: contain;
				background-repeat: no-repeat;
				font-weight: 600;
				font-size: 0.26rem;
				color: #ffffff;
				text-align: center;
				padding: 0 0.3rem;
				&.active {
					background-image: url(https://yaame-static.yaame.io/admin/af89a58b48187ee3f85f99faab0d738f.png);
					color: #fff244;
				}
			}
		}
		.rank-container {
			width: 6.3rem;
			height: 13rem;
			padding-top: 0.3rem;
			overflow-y: scroll;
			.rank-item {
				width: 6.3rem;
				height: 1.7rem;
				background: #ffefcc;
				border-radius: 0.14rem;
				display: flex;
				align-items: center;
				margin-bottom: 0.24rem;
				&.rank-item1 {
					.img-div {
						background-image: url(https://yaame-static.yaame.io/admin/3fd4abe9f46e05f796c08fb73ac9efae.png);
					}
				}
				&.rank-item2 {
					.img-div {
						background-image: url(https://yaame-static.yaame.io/admin/eabfb391292b27e164deed2fce7e84d4.png);
					}
				}
				.img-div {
					width: 1.5rem;
					height: 1.5rem;
					background-size: contain;
					background-repeat: no-repeat;
					background-image: url(https://yaame-static.yaame.io/admin/7c6d57d02730827b1cd47367b83c38a6.png);
					margin-left: 0.1rem;
					display: flex;
					justify-content: center;
					align-items: center;
					transform: scale(0.9);
					img {
						width: 1.1rem;
						height: 1.1rem;
					}
				}
				.item-info {
					width: 2.83rem;
					padding-left: 0.1rem;
					.item-name {
						font-weight: 600;
						font-size: 0.3rem;
						color: #62330c;
					}
					.item-num {
						font-weight: 400;
						font-size: 0.24rem;
						color: #62330c;
						margin-top: 0.04rem;
					}
					.item-price {
						font-weight: 400;
						font-size: 0.2rem;
						color: #62330c;
						margin-top: 0.1rem;
						img {
							display: inline;
							width: 0.2rem;
							height: auto;
							vertical-align: middle;
							position: relative;
							bottom: 0.02rem;
						}
					}
				}
				.item-btn {
					width: 1.67rem;
					height: 0.8rem;
					background-size: contain;
					background-repeat: no-repeat;
					background-image: url(https://yaame-static.yaame.io/admin/d8f004e094d1f46062ac3c8c99d09a40.png);
					text-align: center;
					line-height: 0.8rem;
					font-weight: 600;
					font-size: 0.28rem;
					color: #ffffff;
					padding: 0 0.2rem;
				}
			}
		}
	}
	.flex-box {
		display: flex;
		justify-content: center;
		align-items: center;
		.consignment-popup {
			width: 5.9rem;
			height: 7.64rem;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/165db2da4f244a25142703607e1bbd78.png);
			padding-top: 0.3rem;
			position: relative;
			.price,
			.num {
				margin-top: 0.37rem;
				width: 5.9rem;
				font-weight: 400;
				font-size: 0.24rem;
				color: #fff1aa;
				padding-left: 0.4rem;
				padding-right: 0.4rem;
			}
			.num {
				margin-top: 0.4rem;
			}
			.confirm-content {
				width: 5.1rem;
				height: 0.98rem;
				background-color: rgba(0, 0, 0, 0.2);
				border-radius: 0.5rem;
				margin-top: 0.16rem;
				margin-left: 0.4rem;
				position: relative;
				.min {
					width: 0.6rem;
					height: 0.33rem;
					font-weight: 400;
					font-size: 0.24rem;
					color: #ffffff;
					position: absolute;
					left: 0.32rem;
					top: 0.32rem;
				}
				.max {
					left: 4.25rem;
				}
				.reduction {
					width: 0.4rem;
					height: 0.4rem;
					position: absolute;
					left: 1.15rem;
					top: 0.29rem;
				}
				.add {
					width: 0.4rem;
					height: 0.4rem;
					position: absolute;
					left: 3.55rem;
					top: 0.29rem;
				}
				.num-input {
					width: 1.36rem;
					height: 0.4rem;
					background-color: rgba(0, 0, 0, 0);
					// border: 0.02rem solid #377b5c;
					position: absolute;
					left: 1.85rem;
					top: 0.3rem;
					border-top: none;
					border-bottom: none;
					text-align: center;
					font-weight: 400;
					font-size: 0.36rem;
					color: #ffffff;
					line-height: 0.4rem;
					&::-webkit-input-placeholder {
						color: #ffffff;
					}

					&::-moz-placeholder {
						color: #ffffff;
					}
				}
			}
			.buy-info {
				width: 5.9rem;
				padding-left: 0.4rem;
				position: absolute;
				left: 0;
				top: 4.87rem;
				font-weight: 400;
				font-size: 0.24rem;
				color: #fff1aa;
			}
			.all-price,
			.all-income {
				width: 5.9rem;
				padding-left: 0.4rem;
				position: absolute;
				left: 0;
				top: 4.87rem;
				font-weight: 600;
				font-size: 0.24rem;
				color: #fff1aa;
				text-align: right;
				padding-right: 0.35rem;
				img {
					display: inline;
					width: 0.2rem;
					height: auto;
					vertical-align: middle;
					position: relative;
					bottom: 0.02rem;
				}
			}
			.all-income {
				top: 5.29rem;
			}
			.red-info {
				width: 5.9rem;
				position: absolute;
				left: 0;
				top: 5.52rem;
				font-weight: 400;
				font-size: 0.24rem;
				color: #ff7070;
				text-align: center;
				img {
					display: inline;
					width: 0.2rem;
					height: auto;
					vertical-align: middle;
					position: relative;
					bottom: 0.02rem;
				}
			}
			.close-btn {
				width: 4.18rem;
				height: 0.9rem;
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
				bottom: 0.64rem;
				text-align: center;
				line-height: 0.9rem;
				font-weight: 600;
				font-size: 0.3rem;
				color: #6b3e17;
				background-size: contain;
				background-repeat: no-repeat;
				background-image: url(https://yaame-static.yaame.io/admin/179a9b76b10e023f1d6d1817bf2cbbc6.png);
				z-index: 3;
				&.disabled {
					// 灰色滤镜
					filter: grayscale(100%);
				}
			}
			.close-icon {
				width: 0.5rem;
				height: 0.5rem;
				background-size: contain;
				background-repeat: no-repeat;
				background-image: url(https://yaame-static.yaame.io/admin/40b31f437fb27d24313849c57e7a5f4f.png);
				position: absolute;
				left: 2.7rem;
				bottom: -0.9rem;
			}
		}
	}
	.popup-header {
		width: 5.9rem;
		height: 0.5rem;
		text-align: center;
		.header-content {
			font-weight: 600;
			font-size: 0.36rem;
			color: #f1c58b;
			position: relative;
			display: inline-block;
			&::after {
				content: "";
				display: block;
				width: 0.68rem;
				height: 0.32rem;
				background-size: contain;
				background-repeat: no-repeat;
				background-image: url(https://yaame-static.yaame.io/admin/e7a35ce40628ac621713453535c44dd0.png);
				position: absolute;
				left: -0.76rem;
				top: 0.04rem;
			}
			&::before {
				content: "";
				display: block;
				width: 0.68rem;
				height: 0.32rem;
				background-size: contain;
				background-repeat: no-repeat;
				background-image: url(https://yaame-static.yaame.io/admin/7bc494f79c70097eed327be7c26478b6.png);
				position: absolute;
				right: -0.76rem;
				top: 0.04rem;
			}
		}
	}
}
.content-p {
	width: 5.9rem;
	font-weight: 400;
	font-size: 0.24rem;
	color: #fff1aa;
	position: absolute;
	text-align: center;
	top: 1.2rem;
}
.reward-empty {
	width: 6.3rem;
	height: 10rem;
	// background-color: #fff;
	display: flex;
	justify-content: center;
	align-items: center;
	font-weight: 400;
	font-size: 0.26rem;
	color: #ffffff;
	.empty-core {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		img {
			width: 0.89rem;
			height: 1.06rem;
		}
		p {
			width: 6.9rem;
			margin-top: 0.4rem;
			text-align: center;
			color: #6e6958;
		}
	}
}
</style>
