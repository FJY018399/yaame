<!--
 * @Author: Elk
 * @Date: 2024-06-10 17:35:20
 * @FilePath: /yaame-h5/src/pages/EidAlAdha/views/freeMarket.vue
 * @Description: 
-->
<template>
	<refresh class="refresh" ref="wlRefresh" @onRefresh="refreshList">
		<div class="freeMarket" @click.stop="closePopup">
			<img
				class="back-icon"
				src="https://yaame-static.yaame.io/admin/f31555c45259c27b0de360fc5c27bac6.png"
				alt=""
				@click="back"
			/>

			<p class="header-title">{{ $t("freeMarket") }}</p>

			<div
				v-infinite-scroll="loadMore"
				:infinite-scroll-immediate-check="true"
				infinite-scroll-disabled="loading"
				infinite-scroll-distance="10"
				class="market-container"
			>
				<div class="market-header">
					<div class="search-content">
						<div
							class="food-item"
							@click="
								foodVisible = !foodVisible;
								searchVisible = false;
							"
						>
							<span v-if="foodList.length" class="no-wrap">{{
								foodList[foodActive].name
							}}</span>
							<img
								v-if="foodVisible"
								src="https://yaame-static.yaame.io/admin/0068422b884c75692106cac12c9afae5.png"
								alt=""
							/>
							<img
								v-else
								src="https://yaame-static.yaame.io/admin/0768afb4f249042232a36caf2d677810.png"
								alt=""
							/>
						</div>
						<div
							class="search-item no-wrap"
							@click="
								searchVisible = !searchVisible;
								foodVisible = false;
							"
						>
							{{ $t(searchList[searchActive]) }}

							<img
								v-if="searchVisible"
								src="https://yaame-static.yaame.io/admin/0068422b884c75692106cac12c9afae5.png"
								alt=""
							/>
							<img
								v-else
								src="https://yaame-static.yaame.io/admin/0768afb4f249042232a36caf2d677810.png"
								alt=""
							/>
						</div>

						<div class="search-br"></div>
					</div>
					<div class="my-consignment no-wrap" @click="toConsignment">
						{{ $t("myConsignment") }}
					</div>
				</div>

				<div
					v-for="(item, index) in marketList"
					:key="index"
					:class="['market-item', 'market-item' + item.rarity]"
				>
					<div class="img-div">
						<img :src="item.icon" alt="" />
					</div>
					<div class="item-info">
						<p class="item-name">{{ item.name }}</p>
						<p class="item-num">{{ $t("quantity") }}: {{ item.num }}</p>
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
					<div class="item-btn" @click="buyShop(item)">{{ $t("buy") }}</div>
				</div>

				<div v-show="marketList.length === 0" class="reward-empty">
					<div class="empty-core">
						<img
							src="https://yaame-static.yaame.io/admin/edc13e211a180dda554c8d6c4b64c502.png"
							alt=""
						/>
						<p>{{ $t("NotOnTheListYet") }}</p>
					</div>
				</div>
			</div>

			<div v-show="foodVisible" class="food-list">
				<img class="point-img" src="https://yaame-static.yaame.io/admin/c149dd11298b025c7a0e6e856f0edc1f.png" alt="" />
				<div
					v-for="(item, index) in foodList"
					:key="index"
					:class="['food-list-item nowrap', foodActive === index && 'active']"
					@click="handleSelectFood(item, index)"
				>
					{{ item.name }}
				</div>
			</div>

			<div v-show="searchVisible" class="search-list">
				<img class="point-img" src="https://yaame-static.yaame.io/admin/c149dd11298b025c7a0e6e856f0edc1f.png" alt="" />
				<div
					v-for="(item, index) in searchList"
					:key="index"
					:class="[
						'search-list-item nowrap',
						searchActive === index && 'active',
					]"
					@click="handleSelectSearch(item, index)"
				>
					{{ $t(item) }}
				</div>
			</div>

			<Info
				v-show="buyVisible"
				@confirm="submitFun"
				@close="buyVisible = false"
			>
				<template v-slot:header>{{ $t("buyTips") }}</template>
				<template v-slot:default>
					<p class="content-p">
						{{ $t("buyTipsContent", [buyItem.name, buyItem.num]) }}
					</p>
				</template>
				<template v-slot:btn
					>{{ buyItem.total_diamond }}
					<img
						class="diamond-icon"
						src="https://yaame-static.yaame.io/admin/f8a2d6dd3c7c1516135e1d2e6d3bc6fc.png"
						alt=""
					/>
				</template>
			</Info>

			<Popup v-show="lessResultVisible" class="less-result-container">
				<div class="reward-container">
					<div style="width: 6.4rem" class="popup-header">
						<span class="header-content">{{ $t("congratulations") }}</span>
					</div>

					<div v-show="resultList && resultList.length" class="reward-content">
						<div
							v-for="(item, index) in resultList"
							:key="index"
							class="reward-item"
						>
							<div class="img-div">
								<img :src="item.icon" alt="" />
								<div class="img-num">{{ item.num }}</div>
							</div>
							<div class="item-name">{{ item.name }}</div>
						</div>
					</div>

					<div class="result-btn" @click="lessResultVisible = false">
						{{ $t("confirm") }}
					</div>

					<div class="close-btn" @click="lessResultVisible = false"></div>
				</div>
			</Popup>

			<Info
				v-show="failVisible"
				@confirm="failVisible = false"
				@close="failVisible = false"
			>
				<template v-slot:header>{{ $t("purchaseFailed") }}</template>
				<template v-slot:default>
					<p class="content-p">
						{{ $t("goodsSold") }}
					</p>
				</template>
				<template v-slot:btn>{{ $t("confirm") }} </template>
			</Info>
		</div>
	</refresh>
</template>
<script setup>
import { ref, onMounted, getCurrentInstance, computed } from "vue";
import { getMarketListApi, postBuyApi, getHomeInfoApi } from "../api";
import Info from "../components/popupInfo";
import Popup from "@/components/common/pop_up";
import { Toast } from "vant";
import refresh from "@/components/common/refresh.vue";
import { getLanguage } from "@/lib/device";
const root = getCurrentInstance();

const t = (val) => {
	return root.proxy.$i18n.t(val);
};

const back = () => {
	root.proxy.$router.go(-1);
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

let marketList = ref([]);

let page = ref(1);
let has_next = ref(true);
let getMarketList = async () => {
	let options = {
		page: page.value,
		size: 20,
		eid_al_ad_ingredients_type: foodList.value[foodActive.value].ingredients,
	};
	if (searchActive.value === 0) {
		options.priceSort = 1;
	} else if (searchActive.value === 1) {
		options.priceSort = 0;
	} else if (searchActive.value === 2) {
		options.numSort = 1;
	} else if (searchActive.value === 3) {
		options.numSort = 0;
	}
	const res = await getMarketListApi(options);
	if (res.status === 1000) {
		if (res.data.content.length < 20) {
			has_next.value = false;
		}
		if (page.value === 1) {
			marketList.value = res.data.content;
		} else {
			marketList.value = marketList.value.concat(res.data.content);
		}
	}
};

const loadMore = async () => {
	if (!has_next.value) {
		return;
	}
	page.value++;
	await getMarketList();
};

const toConsignment = () => {
	root.proxy.$router.push("/myConsignment");
};

let foodVisible = ref(false);
let foodList = ref([]);
let foodActive = ref(0);
const getHomeInfo = async () => {
	const res = await getHomeInfoApi();
	if (res.status === 1000) {
		foodList.value = res.data.ingredients_list;
	} else {
		Toast(res.desc);
	}
};

const handleSelectFood = (_, index) => {
	has_next.value = true;
	foodActive.value = index;
	foodVisible.value = false;
	page.value = 1;
	// 选择食材后，重新请求列表
	getMarketList();
};

const closePopup = (e) => {
	if (
		e.target.className === "freeMarket" ||
		e.target.className === "market-container" ||
		e.target.className === "reward-empty"
	) {
		foodVisible.value = false;
		searchVisible.value = false;
	}
};

let searchVisible = ref(false);
let searchList = ref([
	"priceLowToHigh",
	"priceHighToLow",
	"quantityLowToHigh",
	"quantityHighToLow",
]);
let searchActive = ref(0);

const handleSelectSearch = (_, index) => {
	searchActive.value = index;
	searchVisible.value = false;
	has_next.value = true;
	page.value = 1;
	// 选择食材后，重新请求列表
	getMarketList();
};

let buyVisible = ref(false);
let buyItem = ref({});
const buyShop = async (item) => {
	buyVisible.value = true;
	buyItem.value = item;
};

const submitFun = async () => {
	const res = await postBuyApi({
		market_id: buyItem.value.market_id,
	});
	if (res.status === 1000) {
		buyVisible.value = false;

		lessResultVisible.value = true;
		resultList.value = [buyItem.value];

		page.value = 1;
		has_next.value = true;
		getMarketList();
	} else if (res.status === 10021) {
		buyVisible.value = false;
		failVisible.value = true;

		page.value = 1;
		has_next.value = true;
		getMarketList();
	} else if (res.status === 6600) {
		Toast(root.proxy.$t("insufficientDiamonds"));
		setTimeout(() => {
			window.location.href = "wlyaame://mine/shop/diamond?popup=1";
		}, 2000);
	} else {
		Toast(res.desc);
	}
};

let lessResultVisible = ref(false);
let resultList = ref([]);

let failVisible = ref(false);

const wlRefresh = ref(null);
const refreshList = async () => {
	page.value = 1;
	has_next.value = true;
	await getMarketList();

	setTimeout(() => {
		wlRefresh.value.isLoading = false;
	}, 500);
};
onMounted(async () => {
	await getHomeInfo();
	getMarketList();
});
</script>
<style scoped lang="less">
.freeMarket {
	width: 7.5rem;
	min-height: 100vh;
	background-size: contain;
	background-repeat: no-repeat;
	background-image: url(https://yaame-static.yaame.io/admin/811e7f8f099edd7afe9f77b8f4ef273e.png);
	padding-top: 1.65rem;
	position: relative;
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
	.market-container {
		width: 6.9rem;
		height: 14.6rem;
		margin-left: 0.3rem;
		background-size: 6.9rem 14.86rem;
		background-repeat: no-repeat;
		background-image: url(https://yaame-static.yaame.io/admin/dc20c3d300e8c452a8bb87d9a77e114b.png);
		padding: 0.3rem;
		overflow-y: scroll;
		overflow-x: visible;
		.market-header {
			width: 6.3rem;
			height: 0.72rem;

			display: flex;
			justify-content: space-between;
			position: relative;
			.my-consignment {
				width: 1.64rem;
				height: 0.72rem;
				background-color: rgba(255, 255, 255, 0.1);
				border-radius: 1rem;
				text-align: center;
				line-height: 0.72rem;
				font-weight: 600;
				font-size: 0.24rem;
				color: #ffffff;
				white-space: nowrap;
				padding: 0 0.3rem;
			}
			.search-content {
				width: 4.46rem;
				height: 0.72rem;
				background-color: rgba(255, 255, 255, 0.1);
				border-radius: 1rem;
				font-weight: 600;
				font-size: 0.24rem;
				color: #ffffff;
				display: flex;
				position: relative;
				justify-content: space-between;
				.food-item {
					width: 2rem;
					height: 0.72rem;
					padding-left: 0.3rem;
					line-height: 0.72rem;
					font-weight: 600;
					font-size: 0.24rem;
					color: #ffffff;
					position: relative;
					span {
						display: inline-block;
						width: 1.04rem;
					}
					img {
						width: 0.2rem;
						height: 0.2rem;
						position: absolute;
						right: 0.3rem;
						top: 0.26rem;
					}
				}
				.search-item {
					width: 2.44rem;
					height: 0.72rem;
					padding-left: 0.3rem;
					padding-right: 0.6rem;
					line-height: 0.72rem;
					font-weight: 600;
					font-size: 0.24rem;
					color: #ffffff;
					img {
						width: 0.2rem;
						height: 0.2rem;
						position: absolute;
						right: 0.3rem;
						top: 0.26rem;
					}
				}
				.search-br {
					width: 0.02rem;
					height: 0.3rem;
					position: absolute;
					left: 2rem;
					top: 0.21rem;
					background-color: rgba(255, 255, 255, 0.2);
				}
			}
		}
		.market-item {
			width: 6.3rem;
			height: 1.73rem;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/8e7e87a7e711b3b0a6567cba8dc8c444.png);
			margin-top: 0.2rem;
			display: flex;
			align-items: center;
			&.market-item1 {
				.img-div {
					background-image: url(https://yaame-static.yaame.io/admin/3fd4abe9f46e05f796c08fb73ac9efae.png);
				}
			}
			&.market-item2 {
				.img-div {
					background-image: url(https://yaame-static.yaame.io/admin/eabfb391292b27e164deed2fce7e84d4.png);
				}
			}
			.img-div {
				width: 1.58rem;
				height: 1.58rem;
				background-size: contain;
				background-repeat: no-repeat;
				background-image: url(https://yaame-static.yaame.io/admin/7c6d57d02730827b1cd47367b83c38a6.png);
				margin-left: 0.06rem;
				display: flex;
				justify-content: center;
				align-items: center;
				img {
					width: 1.1rem;
					height: 1.1rem;
				}
			}
			.item-info {
				width: 2.69rem;
				padding-left: 0.26rem;
				.item-name {
					font-weight: 600;
					font-size: 0.3rem;
					color: #62330c;
				}
				.item-num {
					font-weight: 400;
					font-size: 0.24rem;
					color: #62330c;
					margin-top: 0.06rem;
					margin-bottom: 0.12rem;
				}
				.item-price {
					font-weight: 600;
					font-size: 0.22rem;
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
				height: 0.78rem;
				background-size: contain;
				background-repeat: no-repeat;
				background-image: url(https://yaame-static.yaame.io/admin/04e1ad673fefa0666b2c69d40253f70b.png);
				// background-color: #fff;
				text-align: center;
				line-height: 0.78rem;
				font-weight: 600;
				font-size: 0.28rem;
				color: #6b3e17;
			}
		}
	}
	.page-footer {
		width: 7.5rem;
		height: 1.1rem;

		background: linear-gradient(180deg, #a17b4e 0%, #6b4a2d 100%);
		border-radius: 0.24rem 0.24rem 0px 0px;
		position: fixed;
		bottom: 0;
	}
}

.food-list {
	width: 7.1rem;
	height: 4.2rem;
	background: #fff9eb;
	border-radius: 0.24rem;
	padding: 0.3rem;
	display: flex;
	flex-wrap: wrap;
	position: absolute;
	left: 0.21rem;
	top: 2.87rem;
	z-index: 9;
	overflow-y: scroll;
	.point-img {
		height: 0.1rem;
		width: auto;
		left: 0.8rem;
		position: absolute;
		top: -0.1rem;
	}
	.food-list-item {
		width: 3.13rem;
		height: 0.72rem;
		background: #fcecc8;
		border-radius: 0.14rem;
		margin-right: 0.24rem;
		margin-bottom: 0.24rem;
		text-align: center;
		line-height: 0.72rem;
		font-weight: 600;
		font-size: 0.26rem;
		color: #62330c;
		&:nth-of-type(2n) {
			margin-right: 0;
		}
		&:last-child {
			margin-bottom: 0;
		}
		// 倒数第二个取消margin
		&:nth-last-child(2) {
			margin-bottom: 0;
		}
		&.active {
			color: #e24000;
		}
	}
}
.search-list {
	width: 7.1rem;
	height: 4.2rem;
	background: #fff9eb;
	border-radius: 0.24rem;
	padding: 0.3rem;
	display: flex;
	flex-wrap: wrap;
	position: absolute;
	left: 0.21rem;
	top: 2.87rem;
	z-index: 9;
	overflow-y: scroll;
	.point-img {
		height: 0.1rem;
		width: auto;
		left: 0.8rem;
		position: absolute;
		top: -0.1rem;
	}
	.search-list-item {
		width: 6.5rem;
		height: 0.72rem;
		background: #fcecc8;
		border-radius: 0.14rem;
		margin-right: 0.24rem;
		margin-bottom: 0.24rem;
		text-align: center;
		line-height: 0.72rem;
		font-weight: 600;
		font-size: 0.26rem;
		color: #62330c;
		&:last-child {
			margin-bottom: 0;
		}
		&.active {
			color: #e24000;
		}
	}
}

.diamond-icon {
	width: 0.2rem;
	height: 0.2rem;
	vertical-align: middle;
	position: relative;
	bottom: 0.02rem;
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
.less-result-container {
	display: flex;
	justify-content: center;
	align-items: center;

	.reward-container {
		width: 6.4rem;
		height: 4.69rem;
		background-size: contain;
		background-repeat: no-repeat;
		background-image: url(https://yaame-static.yaame.io/admin/43c4b68d3a407e4aeefa303c9f6880c2.png);
		position: relative;
		padding-top: 0.3rem;

		.reward-content {
			width: 6.4rem;
			height: 2.59rem;
			display: flex;
			justify-content: center;
			align-items: center;
			.reward-item {
				width: 1.5rem;
				height: 2rem;
				margin-right: 0.1rem;
				padding-top: 0.07rem;

				.img-div {
					width: 1.5rem;
					height: 1.5rem;
					background: #804a00;
					border-radius: 0.08rem;
					border: 0.01rem solid #ffca7e;
					display: flex;
					justify-content: center;
					align-items: center;
					position: relative;
					img {
						width: 1.2rem;
						height: 1.2rem;
					}
					.img-num {
						display: inline-block;
						position: absolute;
						right: 0rem;
						top: 0rem;
						min-width: 0.59rem;
						height: 0.29rem;
						background: #38b971;

						border-radius: 0px 0.08rem 0px 0.08rem;
						text-align: center;
						line-height: 0.3rem;
						font-weight: 400;
						font-size: 0.18rem;
						color: #fff1aa;
					}
				}
				.item-name {
					width: 1.5rem;
					text-align: center;
					margin-top: 0.06rem;

					font-weight: 600;
					font-size: 0.22rem;
					color: #fff1aa;
				}
			}
		}
		.close-btn {
			width: 0.5rem;
			height: 0.5rem;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/40b31f437fb27d24313849c57e7a5f4f.png);
			position: absolute;
			left: 2.95rem;
			bottom: -0.9rem;
		}
		.result-btn {
			width: 4.18rem;
			height: 0.9rem;
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			bottom: 0.5rem;
			text-align: center;
			line-height: 0.9rem;
			font-weight: 600;
			font-size: 0.3rem;
			color: #6b3e17;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/179a9b76b10e023f1d6d1817bf2cbbc6.png);
			z-index: 3;
		}
	}
}
.popup-header {
	width: 6.9rem;
	height: 0.5rem;
	text-align: center;
	.header-content {
		font-weight: 600;
		font-size: 0.36rem;
		color: #f1c58b;
		position: relative;
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
