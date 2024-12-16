<!--
 * @Author: Elk
 * @Date: 2024-06-10 15:25:47
 * @FilePath: /yaame-h5/src/pages/EidAlAdha/views/yaameShop.vue
 * @Description: 
-->
<template>
    <refresh class="refresh" ref="wlRefresh" @onRefresh="refreshList">
	<div class="yaame-shop">
		<img
			class="header-img"
			src="https://yaame-static.yaame.io/admin/5c114159b14812fd178dbc787e69baef.png"
			alt=""
		/>
		<img
			class="back-icon"
			src="https://yaame-static.yaame.io/admin/f31555c45259c27b0de360fc5c27bac6.png"
			alt=""
			@click="back"
		/>

		<p class="header-title">{{ $t("YaameShop") }}</p>

		<div class="shop-list">
			<div class="shop-content">
				<div
					v-for="(item, index) in shop_list"
					:key="index"
					:class="['shop-item', 'shop-item' + item.rarity]"
				>
					<div class="img-div">
						<img :src="item.icon" alt="" />
						<div v-if="item.num" class="img-num">x{{ item.num }}</div>
						<div v-else style="color: #ff7272" class="img-num">
							x{{ item.num }}
						</div>

						<div class="shop-item-name">{{ item.name }}</div>
					</div>
					<div
						:class="['item-btn', item.num === 0 && 'disabled']"
						@click="confirmClick(item, index)"
					>
						{{ item.price }}
						<img
							src="https://yaame-static.yaame.io/admin/f8a2d6dd3c7c1516135e1d2e6d3bc6fc.png"
							alt=""
						/>
					</div>
				</div>
			</div>
		</div>

		<!-- <div class="page-footer"></div> -->

		<RuleCommon
			v-show="confirmVisible"
			class="confirm-container"
			:title="t('buyTips')"
			:closeButton="false"
			background-image="https://yaame-static.yaame.io/admin/01ae04b86d4a39d2a912f2166bdbb71b.png"
			height="4.94rem"
			width="5.9rem"
			:cutRule="closePopup"
			:closeIconShow="true"
		>
			<template v-slot:default>
				<p class="confirm-title">{{ $t("pleaseSelect", [activeItem.name]) }}</p>
				<div class="confirm-content">
					<div class="min" @click="handleMin">MIN</div>
					<div class="min max" @click="handleMax">MAX</div>

					<img
						class="reduction"
						src="https://yaame-static.yaame.io/admin/4f70c7de55f19d4f6cd2a622985d27dc.png"
						alt=""
						@click="handleReduction"
					/>
					<img
						class="reduction add"
						src="https://yaame-static.yaame.io/admin/493e8f1adaa4102c9c97e3d1a5fd056a.png"
						alt=""
						@click="handleAdd"
					/>

					<div class="num-input">{{ selectNum }}</div>
				</div>

				<div class="confirm-btn" @click="submit">
					{{ selectNum * activeItem.price }}
					<img
						src="https://yaame-static.yaame.io/admin/f8a2d6dd3c7c1516135e1d2e6d3bc6fc.png"
						alt=""
					/>
				</div>
			</template>
		</RuleCommon>

		<Popup v-show="resultVisible" class="result-container">
			<div class="reward-container">
				<div class="popup-header">
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

				<div class="result-btn" @click="resultVisible = false">
					{{ $t("confirm") }}
				</div>

				<div class="close-btn" @click="resultVisible = false"></div>
			</div>
		</Popup>

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
	</div>
</refresh>
</template>

<script setup>
import { ref, onMounted, computed, getCurrentInstance } from "vue";
import RuleCommon from "./ruleCommon";
import Popup from "@/components/common/pop_up";
import { getShopListApi, postShopBuyApi } from "../api.js";
import { Toast } from "vant";
import refresh from "@/components/common/refresh.vue";
const root = getCurrentInstance();

const t = (val) => {
	return root.proxy.$i18n.t(val);
};

let shop_list = ref([]);
let time_cycle_flag = ref("");
const getShopList = async () => {
	let res = await getShopListApi();
	if (res.status === 1000) {
		shop_list.value = res.data.shop_list;
		time_cycle_flag.value = res.data.time_cycle_flag;

		if (activeIndex.value !== undefined) {
			activeItem.value = shop_list.value[activeIndex.value];
		}
	}
};

let confirmVisible = ref(false);
let selectNum = ref(1);
const handleReduction = () => {
	if (selectNum.value > 1) {
		selectNum.value--;
	}
};
const handleAdd = () => {
	if (selectNum.value >= activeItem.value.num) {
		return;
	}
	selectNum.value++;
};
const closePopup = () => {
	confirmVisible.value = false;
};

const handleMin = () => {
	selectNum.value = 1;
};

const handleMax = () => {
	selectNum.value = activeItem.value.num;
};

const back = () => {
	root.proxy.$router.go(-1);
};

let activeItem = ref({});
let activeIndex = ref(0);
const confirmClick = (item, index) => {
	if (item.num === 0) {
		return;
	}

	selectNum.value = item.num;

	activeItem.value = item;
	activeIndex.value = index;
	confirmVisible.value = true;
};

let resultList = ref([]);
let resultVisible = ref(false);
let loading = ref(false);

let lessResultVisible = ref(false);
const submit = async () => {
	if (loading.value) {
		return;
	}
	loading.value = true;
	let res = await postShopBuyApi({
		eid_al_ad_ingredients_type: activeItem.value.eid_al_ad_ingredients_type,
		num: selectNum.value,
		time_cycle_flag: time_cycle_flag.value,
	});
	if (res.status === 1000) {
		confirmVisible.value = false;
		// resultVisible.value = true;
		resultList.value = [res.data.ingredients_info];

		lessResultVisible.value = true;
		getShopList();
	} else if (res.status === 6600) {

        Toast(root.proxy.$t('insufficientDiamonds'))
		setTimeout(() => {
			window.location.href = "wlyaame://mine/shop/diamond?popup=1";
		}, 2000);
	} else {
		Toast(res.desc);
	}
	loading.value = false;
};
const getNextMidnightInterval = () => {
	const now = new Date();
	const utcMidnight = new Date(
		Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
	);
	return utcMidnight - now;
};
const setMidnightTimer = () => {
	const interval = getNextMidnightInterval();
	setTimeout(() => {
		getShopList();
		// 设置每日触发的定时器
		setInterval(getShopList, 24 * 60 * 60 * 1000); // 每24小时触发一次
	}, interval);
};

const wlRefresh = ref(null);
const refreshList = async () => {
    await getShopList();
    setTimeout(() => {
        wlRefresh.value.isLoading = false;
    }, 500);
};
onMounted(() => {
	getShopList();

	// 设置一天一次的定时器（utc时间的自然天），如果时间到了，重新获取数据
	setMidnightTimer();
});
</script>

<style scoped lang="less">
.yaame-shop {
	width: 7.5rem;
	min-height: 100vh;
	background-size: contain;
	background-repeat: no-repeat;
	background-image: url(https://yaame-static.yaame.io/admin/811e7f8f099edd7afe9f77b8f4ef273e.png);
	padding-top: 1.95rem;
	font-size: 0.24rem;
	.header-img {
		width: 7.5rem;
		height: 1.61rem;
		position: absolute;
		left: 0;
		top: 1.47rem;
	}
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
	.shop-list {
		width: 6.9rem;
		height: 14.29rem;
		background-size: contain;
		background-repeat: no-repeat;
		background-image: url(https://yaame-static.yaame.io/admin/3d18934858ef7c351114ef3664bf33d7.png);
		margin-left: 0.3rem;
		padding-top: 1.17rem;
		.shop-content {
			width: 6.9rem;
			height: 12.3rem;
			overflow-y: scroll;
			display: flex;
			flex-wrap: wrap;
			padding: 0 0.3rem 0.3rem;
			.shop-item {
				width: 1.94rem;
				height: 2.83rem;
				margin-right: 0.24rem;
				background-color: #feeac0;
				border-radius: 0.12rem;
				margin-bottom: 0.24rem;
				padding-top: 0.07rem;
				&:nth-child(3n) {
					margin-right: 0;
				}

				&.shop-item1 {
					.img-div {
						background-image: url(https://yaame-static.yaame.io/admin/3fd4abe9f46e05f796c08fb73ac9efae.png);
					}
				}
				&.shop-item2 {
					.img-div {
						background-image: url(https://yaame-static.yaame.io/admin/eabfb391292b27e164deed2fce7e84d4.png);
					}
				}
				.img-div {
					width: 1.84rem;
					height: 1.84rem;
					margin-left: 0.05rem;
					background-size: contain;
					background-repeat: no-repeat;
					background-image: url(https://yaame-static.yaame.io/admin/0516a1ab286afdf037e38a01c409e56f.png);
					display: flex;
					justify-content: center;
					align-items: center;
					position: relative;
					img {
						width: 1.2rem;
						height: 1.2rem;
					}
					.img-num {
						position: absolute;
						left: 0.1rem;
						top: 0.1rem;
						width: 0.59rem;
						height: 0.29rem;
						background: linear-gradient(180deg, #ffd87d 0%, #ffb700 100%);
						box-shadow: inset 0px 0px 0.12rem 0px rgba(255, 255, 255, 0.5);
						border-radius: 0.15rem;
						text-align: center;
						line-height: 0.3rem;
						font-weight: 600;
						font-size: 0.18rem;
						color: #62330c;
					}
					.shop-item-name {
						position: absolute;
						left: 0.08rem;
						bottom: 0.1rem;
						z-index: 1;
						width: 1.68rem;
						height: 0.34rem;
						text-align: center;
						line-height: 0.34rem;
						background-color: rgba(0, 0, 0, 0.3);
						font-weight: 600;
						font-size: 0.22rem;
						color: #ffffff;
                        border-radius: 0px 0px 0.11rem 0.11rem;
					}
				}
				.item-btn {
					width: 1.64rem;
					height: 0.56rem;
					line-height: 0.56rem;
					text-align: center;
					background-size: contain;
					background-repeat: no-repeat;
					margin-left: 0.16rem;
					background-image: url(https://yaame-static.yaame.io/admin/90c6b5421c3b11fa0e4e8cfc3fe148d6.png);
					margin-top: 0.1rem;

					font-weight: 600;
					font-size: 0.22rem;
					color: #6b3e17;

					img {
						display: inline;
						width: 0.2rem;
						height: auto;
						vertical-align: middle;
						position: relative;
						bottom: 0.02rem;
					}
					&.disabled {
						// 灰色滤镜
						filter: grayscale(100%);
					}
				}
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
	.confirm-container {
		/deep/.rule-content {
			padding-top: 1.2rem;
			.confirm-title {
				width: 5.9rem;
				text-align: center;
				font-weight: 400;
				font-size: 0.24rem;
				color: #fff1aa;
                padding: 0 0.3rem;
			}
			.confirm-content {
				width: 5.1rem;
				height: 0.98rem;
				background-color: rgba(0, 0, 0, 0.2);
				border-radius: 0.5rem;
				margin-top: 0.3rem;
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
			.confirm-btn {
				width: 4.18rem;
				height: 0.86rem;
				line-height: 0.86rem;
				background: url("https://yaame-static.yaame.io/admin/4382358c89ca1d8a60f3f2900116414d.png")
					no-repeat;
				background-size: contain;

				margin-left: 0.86rem;
				margin-top: 0.6rem;
				text-align: center;
				font-weight: 600;
				font-size: 0.32rem;
				color: #6b3e17;
				img {
					display: inline;
					width: 0.27rem;
					height: auto;
					vertical-align: middle;
					position: relative;
					bottom: 0.02rem;
				}
			}
		}
	}
	.result-container {
		display: flex;
		justify-content: center;
		align-items: center;

		.reward-container {
			width: 6.9rem;
			height: 7.94rem;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/eb902f6aa3fc920ee1dd9d68ce79b713.png);
			position: relative;
			padding-top: 0.3rem;

			.reward-content {
				width: 6.9rem;
				height: 6.2rem;
				overflow-y: scroll;
				margin-top: 0.34rem;
				margin-left: 0.44rem;
				display: flex;
				flex-wrap: wrap;
				.reward-item {
					width: 1.94rem;
					height: 2.7rem;
					margin-right: 0.1rem;
					background-color: #feeac0;
					border-radius: 0.12rem;
					margin-bottom: 0.1rem;
					padding-top: 0.07rem;
					&:nth-child(3n) {
						margin-right: 0;
					}

					.img-div {
						width: 1.84rem;
						height: 1.84rem;
						margin-left: 0.05rem;
						background-size: contain;
						background-repeat: no-repeat;
						background-image: url(https://yaame-static.yaame.io/admin/0516a1ab286afdf037e38a01c409e56f.png);
						display: flex;
						justify-content: center;
						align-items: center;
						position: relative;
						img {
							width: 1.2rem;
							height: 1.2rem;
						}
						.img-num {
							position: absolute;
							left: 0.1rem;
							top: 0.1rem;
							width: 0.59rem;
							height: 0.29rem;
							background: linear-gradient(180deg, #ffd87d 0%, #ffb700 100%);
							box-shadow: inset 0px 0px 0.12rem 0px rgba(255, 255, 255, 0.5);
							border-radius: 0.15rem;
							text-align: center;
							line-height: 0.3rem;
							font-weight: 600;
							font-size: 0.18rem;
							color: #62330c;
						}
					}
					.item-name {
						width: 1.94rem;
						text-align: center;
						margin-top: 0.06rem;

						font-weight: 600;
						font-size: 0.18rem;
						color: #62330c;
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
				left: 3.2rem;
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
</style>
