<!--
 * @Author: Elk
 * @Date: 2024-06-20 16:34:48
 * @FilePath: /yaame-h5/src/pages/withdraw/views/index.vue
 * @Description: 
-->
<template>
	<div :style="{ paddingTop: '2.1rem' }" :class="['main', language]">
		<header
			:style="{
				background: headerWhite ? '#fff' : '',
				height: safeHeight + 0.88 + 'rem',
				color: headerWhite ? '#333' : '#fff',
			}"
			class="page-header"
		>
			<div class="back-img" @click="back">
				<img
					v-show="headerWhite"
					src="https://yaame-static.yaame.io/admin/59b5c791f28d312301d9a2d0751ec516.png"
					@click="back"
				/>
				<img
					v-show="!headerWhite"
					src="https://yaame-static.yaame.io/admin/b123234e80c10fff386feb50ae7bc35b.png"
					@click="back"
				/>
			</div>
			<div class="header-content">{{ $t("withdraw") }}</div>

			<img
				v-show="!headerWhite"
				class="record-img"
				src="https://yaame-static.yaame.io/admin/98ededd5b56940a26fd22c4f4d9c3eff.png"
				alt=""
				@click="toRecord"
			/>
			<img
				v-show="headerWhite"
				class="record-img"
				src="https://yaame-static.yaame.io/admin/eb90a03a1a19054d94cb3e9573876c0a.png"
				alt=""
				@click="toRecord"
			/>

			<img
				v-show="!headerWhite"
				src="https://yaame-static.yaame.io/admin/78b58e695f8b6a8d539ac8dcbc156a8e.png"
				class="info-img"
				@click="ruleVisible = true"
			/>
			<img
				v-show="headerWhite"
				src="https://yaame-static.yaame.io/admin/02b4d90e79a8807ac6fecfe308da210b.png"
				class="info-img"
				@click="ruleVisible = true"
			/>
		</header>

		<div class="coin-num">{{ coin_balance }}</div>
		<div class="coin-info">{{ exchange_tip }}</div>

		<div class="withdraw-card">
			<div class="withdraw-card-header">
				<span>{{ $t("withdraw_to") }}</span>

				<div class="right-call" @click="handleClickWithdraw">
					<span v-show="default_withdraw_account">{{ $t("replace") }}</span>
					<img
						src="https://yaame-static.yaame.io/admin/952825edd5f29f2d3210a50ea4e959df.png"
						alt=""
					/>
				</div>
			</div>

			<div
				v-show="!default_withdraw_account"
				class="withdraw-card-content"
				@click="handleClickWithdraw"
			>
				<template>
					<img
						class="add-icon"
						src="https://yaame-static.yaame.io/admin/ec53a81ac0969358f446a7ffd63b4660.png"
						alt=""
					/>
					<p class="add-info">{{ $t("select_withdrawal_method") }}</p>
				</template>
			</div>

			<div v-if="default_withdraw_account" class="default-withdraw">
				<div class="default-withdraw-content">
					<div class="img-div">
						<img :src="default_withdraw_account.method_icon" alt="" />
					</div>
					<div class="default-content">
						<p class="default-title">
							{{ default_withdraw_account.method_name }}
						</p>
						<p
							v-if="default_withdraw_account.account_tip"
							class="account-tip no-wrap"
						>
							{{ default_withdraw_account.account_tip || "-" }}
						</p>
						<p
							v-if="default_withdraw_account.method_tip"
							class="default-p no-wrap"
							@click.stop="showMore(default_withdraw_account)"
						>
							{{ default_withdraw_account.method_tip }}
						</p>
					</div>
				</div>
				<div class="default-withdraw-info">
					{{
						$t("withdrawal_gold_range", [
							default_withdraw_account.min_coin_amount,
							default_withdraw_account.max_coin_amount,
						])
					}}
				</div>
			</div>
		</div>

		<!-- <div v-if="withdraw_products && withdraw_products.length" class="shop-card">
			<div class="shop-card-header">{{ $t("withdraw") }}</div>
			<div v-if="!default_withdraw_account" class="shop-card-info">
				{{ $t("selectWithdrawalAmount") }}
			</div>

			<template v-else>
				<div
					v-if="!canBuyAll && default_withdraw_account"
					class="shop-card-info"
				>
					min {{ default_withdraw_account.min_money_amount / 100 }}{{ default_withdraw_account.currency_type }}
          {{ default_withdraw_account.max_money_amount ? ('max' + default_withdraw_account.max_money_amount / 100 + default_withdraw_account.currency_type) : '' }}
				</div>
				<div v-if="!canBuyAll" class="shop-card-error">
					<img
						src="https://yaame-static.yaame.io/admin/c827b42ff55335d40e1f1f63b67e7a22.png"
						alt=""
					/>
					<p class="info">{{ $t("withdrawalMethodNotSupport") }}</p>
				</div>
			</template>

			<div class="shop-content">
				<div
					v-for="(item, index) in withdraw_products"
					:key="index"
					:class="['shop-item', !computedCanBuyItem(item) && 'disabled']"
					@click="handleClickShop(item)"
				>
					<img
						class="shop-icon"
						src="https://yaame-static.yaame.io/admin/5df2d432eb4c640a37c33aad78ca6fbc.png"
						alt=""
					/>
					<p class="shop-name">{{ item.coin_amount }}</p>
					<p class="shop-rate no-wrap">
						≈ {{ item.money_amount / 100 }}{{ item.currency_type }}
					</p>
				</div>
			</div>
		</div> -->
		<div class="shop-card">
			<div class="shop-card-header">{{ $t("withdraw") }}</div>
			<div class="shop-card-info">
				{{ $t("select_withdrawal_method_before_enter_gold") }}
			</div>

			<div class="shop-input-container">
				<img
					class="shop-input-coin"
					src="https://yaame-static.yaame.io/admin/5df2d432eb4c640a37c33aad78ca6fbc.png"
					alt=""
				/>
				<input
					v-model="withDrawNum"
					class="shop-input"
					type="text"
					:placeholder="t('enter_withdrawal_gold')"
					@input="handleNumberInput"
				/>
				<div class="shop-input-right-info">{{ inputRightInfo }}</div>
			</div>

			<div v-if="withDrawNum" class="shop-input-error">
				{{ inputErrorInfo }}
			</div>
		</div>

		<div
			:class="['submit-btn', inputErrorInfo && 'disabled']"
			@click="handleClickShop()"
		>
			{{ $t("withdraw") }}
		</div>

		<pageLoading v-if="loading"></pageLoading>
		<PopupRef v-show="ruleVisible" class="flex-container">
			<div class="rule-container">
				<div class="title">{{ $t("rule") }}</div>
				<div class="rule-content">
					<p>{{ $t("rule_2") }}</p>
					<p>{{ $t("rule_3") }}</p>
					<p>{{ $t("rule_4") }}</p>
					<p>{{ $t("rule_6") }}</p>
				</div>
				<div class="rule-btn" @click="ruleVisible = false">OK</div>
			</div>
		</PopupRef>

		<Popup
			v-model="buyVisible"
			position="bottom"
			round
			:style="{ height: '7.5rem' }"
		>
			<div v-if="default_withdraw_account" class="buy-container">
				<div class="buy-header">
					<img
						class="img-div"
						:src="default_withdraw_account.method_icon"
						alt=""
					/>
					<div class="buy-header-info">
						<div class="buy-header-title">
							{{ default_withdraw_account.method_name }}
						</div>
						<p>{{ default_withdraw_account.account_tip || "-" }}</p>
					</div>
				</div>
				<div class="buy-content">
					<div class="content-item">
						<div class="label">{{ $t("gold_coin") }}</div>
						<div>
							<img
								class="buy-icon"
								src="https://yaame-static.yaame.io/admin/5df2d432eb4c640a37c33aad78ca6fbc.png"
								alt=""
							/>
							{{ rateObj.coin_amount }}
						</div>
					</div>
					<div class="content-item">
						<div class="label">
							{{ $t("rate") }} ({{ rateObj.commission_tip }})
						</div>
						<div v-if="buyVisible">
							≈ {{ rateObj.currency_type }}
							{{ rateObj.commission_amount / 100 }}
						</div>
					</div>
					<div class="content-item">
						<div class="label">{{ $t("can_get") }}</div>
						<div>
							≈ {{ rateObj.currency_type }}
							{{ rateObj.money_received / 100 }}
						</div>
					</div>
				</div>
				<div class="info-div">{{ $t("expect_time") }}</div>
				<div style="margin-top: 0" class="info-div">
					{{ $t("rate_fluctuation") }}
				</div>
				<div class="submit" @click="handleBuy">
					{{ $t("submit_application") }}
				</div>
			</div>
		</Popup>

		<PopupRef v-if="detailVisible" class="flex-container">
			<div class="detail-container">
				<p class="title">{{ $t("tips") }}</p>
				<div class="content">
					<p>{{ detailInfo.method_tip }}</p>
				</div>
				<div class="btn" @click="detailVisible = false">
					{{ $t("confirm") }}
				</div>
			</div>
		</PopupRef>

		<PopupRef v-if="timeVisible" class="flex-container">
			<div class="time-container">
				<p class="title">{{ $t("tips") }}</p>
				<div class="content">
					<p>{{ $t("today_withdrawal_times_have_been_used_up") }}</p>
					<p>{{ timeInfoText }}</p>
				</div>
				<div class="time-btn" @click="timeVisible = false">
					{{ $t("confirm") }}
				</div>
			</div>
		</PopupRef>
	</div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, computed, onUnmounted } from "vue";
import { getLanguage, getSafeHeight } from "@/lib/device";
import { getScrollTop } from "@/lib/utils";
import PopupRef from "@/components/common/pop_up.vue";
import {
	getHomeInfoAPI,
	createWithdrawalOrderAPI,
	calculateFeeAPI,
	getWithdrawalMethodAPI,
} from "../api.js";
import pageLoading from "@/components/common/page_loading.vue";
import { Toast, Popup } from "vant";
const root = getCurrentInstance();
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

const t = (val, params) => {
	return root.proxy.$i18n.t(val, params);
};
const router = root.proxy.$router;
const route = root.proxy.$route;

let safeHeight = ref(0);
let safeArea = getSafeHeight() || 0;
safeHeight.value = (safeArea * 2) / 100;

let headerWhite = ref(false);

let loading = ref(true);
const pageChange = () => {
	const scroll_top = getScrollTop();
	headerWhite.value = scroll_top > 10;
};

const back = () => {
	// location.href = `wlyaame://webview/back`;
	location.href = `wlyaame://webview/pop`;
};

let ruleVisible = ref(false);

let coin_balance = ref(0);
let exchange_tip = ref("");
let withdraw_products = ref([]);
let default_withdraw_account = ref(null);
const getHomeInfo = async () => {
	// let options = {
	//     method_type: route.query.method_type,
	//     channel_type: route.query.channel_type,
	// };
	// const res = await getHomeInfoAPI();
	let res;
	if (route.query.method_type) {
		let options = {
			method_type: route.query.method_type,
			channel_type: route.query.channel_type,
		};
		res = await getHomeInfoAPI(options);
	} else {
		res = await getHomeInfoAPI();
	}
	if (res.status === 1000) {
		coin_balance.value = res.data.coin_balance;
		exchange_tip.value = res.data.exchange_tip;
		withdraw_products.value = res.data.withdraw_products;

		if (route.query.method_type) {
			await getWithdrawalMethod();

			if (withdraw_accounts.value.length === 0) {
				default_withdraw_account.value = null;
			} else {
				let item = withdraw_accounts.value.find(
					(item) =>
						item.withdraw_account_id === Number(route.query.withdraw_account_id)
				);

				if (item) {
					default_withdraw_account.value = item;
				} else {
					default_withdraw_account.value = withdraw_accounts.value[0];
				}
			}

			// default_withdraw_account.value = {
			// 	...route.query,

			// 	min_commission_amount: route.query.min_commission_amount
			// 		? Number(route.query.min_commission_amount)
			// 		: null,
			// 	commission_rate: route.query.commission_rate
			// 		? Number(route.query.commission_rate)
			// 		: null,
			// };
		} else {
			default_withdraw_account.value =
				res.data.default_withdraw_account || null;
		}
		// 没有返回最大值  赋值一个无穷大
		if (
			default_withdraw_account.value &&
			!default_withdraw_account.value.max_money_amount
		)
			default_withdraw_account.value.max_money_amount = Infinity;
	} else {
		Toast.fail(res.desc);
	}
	loading.value = false;
};

let buyVisible = ref(false);
let buyItem = ref({
	coin_amount: 0,
	money_amount: 0,
	currency_type: "",
});
const handleClickShop = async () => {
	if (default_withdraw_account.value === null) {
		Toast.fail(t("select_withdrawal_amount"));
	}
	if (inputErrorInfo.value) {
		return;
	}
	if (!default_withdraw_account.value) {
		return;
	}
	// if (item.coin_amount > coin_balance.value) {
	// 	Toast.fail(t("insufficient_gold_balance"));
	// 	return;
	// }

	// buyItem.value = item;
	await calculateFee();
};

const handleClickWithdraw = () => {
	router.push({ name: "method" });
};

const toRecord = () => {
	router.push({ name: "record" });
};

// const canBuyAll = computed(() => {
// 	// 遍历所有的商品和default_withdraw_account.value.max_money_amount和default_withdraw_account.value.min_money_amount比较，如果所有的商品都符合条件则返回true

// 	if (!default_withdraw_account.value) {
// 		return false;
// 	}
// 	if (!withdraw_products.value.length) {
// 		return false;
// 	}
// 	return withdraw_products.value.every((item) => {
// 		return (
// 			item.money_amount >= default_withdraw_account.value.min_money_amount &&
// 			item.money_amount <= default_withdraw_account.value.max_money_amount
// 		);
// 	});
// });

// const computedCanBuyItem = (item) => {
// 	if (!default_withdraw_account.value) {
// 		return true;
// 	}
// 	return (
// 		item.money_amount >= default_withdraw_account.value.min_money_amount &&
// 		item.money_amount <= default_withdraw_account.value.max_money_amount
// 	);
// };
let timeVisible = ref(false);
let timeNum = ref(0);
const handleBuy = async () => {
	let res = await createWithdrawalOrderAPI({
		coin_amount: withDrawNum.value,
		withdraw_account_id: default_withdraw_account.value.withdraw_account_id,
	});
	if (res.status === 1000) {
		Toast.success(t("buySuccess"));
		buyVisible.value = false;
		getHomeInfo();

		setTimeout(() => {
			router.push({ name: "record" });
		}, 2000);
	} else if (res.status === 301) {
		timeVisible.value = true;
		timeNum.value = Number(res.desc);
		buyVisible.value = false;
		return;
	} else {
		Toast.fail(res.desc);
	}
};

let timeInfoText = computed(() => {
	// timeNum为时间差值
	let time = Math.abs(timeNum.value);

	let day = Math.floor(time / 86400);
	let hour = Math.floor((time % 86400) / 3600);
	let minute = Math.floor((time % 3600) / 60);
	let second = time % 60;
	return t("can_withdraw_again_after", [hour, minute, second]);
});

let rateObj = ref({
	coin_amount: 0,
	commission_amount: 0,
	money_received: 0,
	commission_tip: "",
});
const calculateFee = async () => {
	let res = await calculateFeeAPI({
		coin_amount: withDrawNum.value,
		withdraw_account_id: default_withdraw_account.value.withdraw_account_id,
	});
	if (res.status === 1000) {
		rateObj.value = res.data;

		buyVisible.value = true;
	} else {
		Toast.fail(res.desc);
	}
};

let detailVisible = ref(false);
let detailInfo = ref({});
const showMore = (item) => {
	detailInfo.value = item;
	detailVisible.value = true;
};

let withdraw_accounts = ref([]);
const getWithdrawalMethod = async () => {
	const res = await getWithdrawalMethodAPI();
	if (res.status === 1000) {
		withdraw_accounts.value = res.data.withdraw_accounts || [];
	}
};

const toFixedWithoutRounding = (num) => {
	return Math.floor(num * 100) / 100;
};
let withDrawNum = ref(null);

const inputRightInfo = computed(() => {
	// 1. 输入框右侧展示金币换算成本地币的金额，例：1000IDR
	// a. 计算方式：金币数/4000*后台配置的提现汇率
	// 2. 用户选择提现方式=paypal的话则直接展示USD
	// a. 计算方式：金币数/4000

	if (!withDrawNum.value) {
		return "";
	}
	let value = withDrawNum.value;
	let rate = default_withdraw_account.value.exchange_rate / 100;
	let currency_type = default_withdraw_account.value.currency_type;
	if (currency_type === "USD") {
		return `≈${toFixedWithoutRounding(value / 4000)}${currency_type}`;
	}
	return `≈${toFixedWithoutRounding((value / 4000) * rate)}${currency_type}`;
});

const inputErrorInfo = computed(() => {
	// a. 金币数只可提现整千的金额，非整千时，在输入框下方展示红色提示：提现金币数必须是1k的整数倍
	// a. 提现金币数不足最小金额/超出了最大金额限制后，在输入框下方展示红色提示：最小提取***金币，最大提取***金币
	if (!withDrawNum.value) {
		return t("enter_withdrawal_gold");
	}

	let value = withDrawNum.value;
	if (value % 1000 !== 0) {
		return t("withdrawal_gold_must_be_multiple_of_1k");
	}
	let min = default_withdraw_account.value.min_coin_amount;
	let max = default_withdraw_account.value.max_coin_amount;

	// withdrawal_gold_range: '最小提取{0}金币，最大提取{1}金币',
	if (value < min || value > max) {
		return t("withdrawal_gold_range", [min, max]);
	}
});

// 正则只能输入正整数
const handleNumberInput = (event) => {
	let value = event.target.value;
	// 清除非数字字符
	value = value.replace(/\D/g, "");
	// 移除前导零
	value = value.replace(/^0+/, "");
	// 更新输入框的值
	event.target.value = value;
	withDrawNum.value = value;
};

onMounted(() => {
	getHomeInfo();
	window.addEventListener("scroll", pageChange);
});
onUnmounted(() => {
	window.removeEventListener("scroll", pageChange);
});
</script>

<style lang="less" scoped>
.main {
	width: 7.5rem;
	min-height: 100vh;
	background-size: contain;
	background-repeat: no-repeat;
	background-image: url(https://yaame-static.yaame.io/admin/6365fb1897fdbc62db7f3957c5e9fded.png);
	font-size: 0.24rem;
	color: #333333;
	padding-bottom: 0.3rem;
	&.ar {
		.page-header {
			.back-img {
				right: 0.3rem;
				left: auto;
				transform: rotate(180deg);
			}
			.info-img {
				left: 0.3rem;
			}
			.record-img {
				left: 1rem;
			}
		}
	}
	.page-header {
		display: flex;
		height: 0.88rem;
		line-height: 0.88rem;
		width: 100%;
		font-size: 0.34rem;
		color: #333333;
		text-align: center;
		position: fixed;
		top: 0;
		left: 0;
		align-items: center;
		justify-content: center;
		z-index: 99;
		background: transparent;
		.back-img {
			width: 0.4rem;
			height: 0.3rem;
			position: absolute;
			left: 0.3rem;
			bottom: 0.24rem;
			img {
				height: 0.3rem;
				width: auto;
			}
		}
		.record-img {
			width: 0.4rem;
			height: 0.4rem;
			position: absolute;
			right: 1rem;
			bottom: 0.24rem;
		}
		.info-img {
			width: 0.4rem;
			height: 0.4rem;
			position: absolute;
			right: 0.3rem;
			bottom: 0.24rem;
		}
		.header-content {
			position: absolute;
			bottom: 0.24rem;
			height: 0.4rem;
			line-height: 0.4rem;
			left: 50%;
			transform: translate(-50%, -0%);
		}
	}
	.coin-num {
		width: 7.5rem;
		font-weight: bold;
		font-size: 0.7rem;
		color: #ffffff;
		font-style: normal;
		padding-left: 0.42rem;
	}
	.coin-info {
		margin-top: 0.16rem;
		font-weight: 600;
		color: #ffffff;
		text-align: left;
		padding-left: 0.42rem;
	}
	.withdraw-card {
		width: 6.9rem;
		min-height: 2.92rem;
		background: #ffffff;
		border-radius: 0.24rem;
		margin-left: 0.3rem;
		margin-top: 0.55rem;
		padding-bottom: 0.01rem;
		.withdraw-card-header {
			width: 6.9rem;
			padding: 0.3rem 0.3rem 0;
			font-weight: 500;
			font-size: 0.28rem;
			color: #333333;
			display: flex;
			justify-content: space-between;
			.right-call {
				font-weight: 500;
				font-size: 0.22rem;
				color: #666666;
				img {
					width: 0.11rem;
					height: 0.24rem;
					vertical-align: middle;
					position: relative;
					bottom: 0.02rem;
					margin-left: 0.13rem;
				}
			}
		}
		.withdraw-card-content {
			width: 6.3rem;
			height: 1.6rem;
			margin: 0.3rem;
			background: #f2f5fb;
			border-radius: 0.2rem;
			position: relative;
			.add-icon {
				width: 0.36rem;
				height: 0.36rem;
				position: absolute;
				left: 2.96rem;
				top: 0.42rem;
			}
			.add-info {
				position: absolute;
				left: 0;
				top: 0.9rem;
				width: 6.3rem;
				font-weight: 500;
				color: #bbbbbb;
				text-align: center;
			}
		}
		.default-withdraw {
			width: 6.3rem;
			// height: 1.6rem;
			margin: 0.3rem;
			background: #f2f5fb;
			border-radius: 0.2rem;
			position: relative;

			padding: 0.24rem;

			.default-withdraw-content {
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 0.01rem solid #ececec;
				padding-bottom: 0.2rem;
				.img-div {
					width: 1.2rem;
					height: 1.2rem;
					display: flex;
					justify-content: center;
					align-items: center;
					img {
						width: 0.8rem;
					}
				}
				.default-content {
					width: 4.36rem;
					// height: 1.2rem;
					.default-title {
						width: 4.36rem;
						font-weight: 600;
						font-size: 0.26rem;
						color: #333333;
						margin-bottom: 0.06rem;
					}
					.default-p {
						// width: 4.36rem;
						font-size: 0.18rem;
						position: relative;
						padding-right: 0.24rem;
						display: inline;
						&::after {
							content: "";
							display: block;
							clear: both;
							width: 0.24rem;
							height: 0.24rem;
							position: absolute;
							right: -0.02rem;
							top: -0.02rem;
							background-size: contain;
							background-image: url(https://yaame-static.yaame.io/admin/d443c0894dacef5eb8a24e9a386cfb0b.png);
							background-repeat: no-repeat;
						}
					}
					.account-tip {
						width: 4.36rem;
						font-weight: 600;
						font-size: 0.22rem;
						color: #666666;
					}
				}
			}
			.default-withdraw-info {
				// padding: 0.2rem 0;
				padding-top: 0.2rem;
				font-weight: 400;
				font-size: 0.18rem;
				color: #999999;
			}
		}
	}
	.shop-card {
		width: 6.9rem;
		padding: 0.3rem;
		background: #ffffff;
		border-radius: 0.24rem;
		margin-left: 0.3rem;
		margin-top: 0.3rem;
		.shop-card-header {
			width: 6.3rem;
			font-weight: 500;
			font-size: 0.28rem;
			color: #333333;
		}
		.shop-card-info {
			width: 6.3rem;
			font-weight: 500;
			color: #bbbbbb;
		}
		.shop-input-container {
			width: 6.3rem;
			height: 1.1rem;
			background: #f2f5fb;
			border-radius: 0.2rem;
			margin-top: 0.3rem;
			border: none;
			position: relative;
			.shop-input-coin {
				width: 0.45rem;
				height: 0.46rem;
				position: absolute;
				left: 0.27rem;
				top: 0.32rem;
			}
			.shop-input {
				width: 6.3rem;
				height: 1.1rem;
				background: #f2f5fb;
				border-radius: 0.2rem;
				border: none;
				padding-left: 0.9rem;
				padding-right: 1.6rem;
				font-weight: 400;
				font-size: 0.28rem;
				color: #333333;
			}
			.shop-input-right-info {
				position: absolute;
				right: 0.3rem;
				top: 0.37rem;
				font-weight: 400;
				font-size: 0.28rem;
				color: #999;
			}
		}
		.shop-input-error {
			font-weight: 600;
			font-size: 0.18rem;
			color: #e26262;
			margin-top: 0.2rem;
		}
		.shop-card-error {
			width: 6.3rem;
			height: 0.84rem;
			background: #ffe9e9;
			border-radius: 0.14rem;
			display: flex;
			align-items: center;
			padding-left: 0.2rem;
			margin-top: 0.22rem;
			img {
				width: 0.34rem;
				height: 0.34rem;
			}
			.info {
				width: 5.26rem;
				// height: 0.56rem;
				display: -webkit-box;
				-webkit-line-clamp: 2; /* 显示的行数 */
				-webkit-box-orient: vertical;
				overflow: hidden;
				text-overflow: ellipsis;
				line-height: 1.5;
				font-size: 0.2rem;
				margin-left: 0.2rem;
				color: #8d5d5d;
			}
		}
		.shop-content {
			display: flex;
			flex-wrap: wrap;
			.shop-item {
				width: 1.96rem;
				height: 2.25rem;
				background: #fff5e4;
				border-radius: 0.24rem;
				margin-right: 0.2rem;
				margin-top: 0.2rem;
				display: flex;
				flex-wrap: wrap;
				padding-top: 0.32rem;
				&.disabled {
					opacity: 0.5;
				}
				&:nth-of-type(3n) {
					margin-right: 0;
				}
				.shop-icon {
					width: 0.57rem;
					height: 0.56rem;
					margin-left: 0.66rem;
				}
				.shop-name {
					font-weight: 600;
					font-size: 0.3rem;
					color: #393939;
					text-align: center;
					margin: 0.12rem 0 0.1rem;
					width: 1.9rem;
				}
				.shop-rate {
					width: 1.9rem;
					// font-weight: ;
					color: #999999;
					text-align: center;
					position: relative;
					bottom: 0.1rem;
					font-size: 0.2rem;
				}
			}
		}
	}
	.flex-container {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.detail-container {
		width: 5.9rem;
		// height: 5.58rem;
		background: #ffffff;
		border-radius: 0.24rem;
		padding: 0.6rem 0.5rem;
		.title {
			width: 4.9rem;
			font-weight: 600;
			font-size: 0.34rem;
			color: #333333;
			text-align: center;
			margin-bottom: 0.2rem;
		}
		.content {
			width: 4.9rem;
			// height: 2.22rem;
			font-weight: 400;
			font-size: 0.26rem;
			color: #666666;
			overflow-y: scroll;
		}
		.btn {
			width: 3.7rem;
			height: 0.88rem;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/766ae0bd3f4856e6e74610a52d7effa4.png);
			text-align: center;
			line-height: 0.88rem;
			margin-left: 0.6rem;
			margin-top: 0.6rem;
			font-weight: 500;
			font-size: 0.32rem;
			color: #ffffff;
		}
	}
	.rule-container {
		width: 5.9rem;
		height: 7.18rem;
		background: #ffffff;
		border-radius: 0.24rem;
		padding: 0.6rem 0.5rem 0;
		position: relative;
		.title {
			width: 4.9rem;
			text-align: center;
			font-weight: 600;
			font-size: 0.34rem;
			color: #333333;
			margin-bottom: 0.2rem;
		}
		.rule-content {
			width: 4.9rem;
			height: 3.82rem;
			font-weight: 400;
			font-size: 0.26rem;
			color: #666666;
			overflow-y: scroll;
		}
		.rule-btn {
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/766ae0bd3f4856e6e74610a52d7effa4.png);
			width: 3.7rem;
			height: 0.88rem;
			text-align: center;
			line-height: 0.88rem;
			font-weight: 600;
			font-size: 0.3rem;
			color: #ffffff;
			bottom: 0.6rem;
			left: 1.1rem;
			position: absolute;
		}
	}
	.buy-container {
		width: 7.5rem;
		height: 7rem;
		padding: 0.3rem;
		.buy-header {
			width: 6.9rem;
			height: 1.2rem;
			border-bottom: 0.01rem solid #eeeeee;
			align-items: center;
			display: flex;
			padding-bottom: 0.2rem;
			.img-div {
				max-height: 0.8rem;
				margin-right: 0.2rem;
			}
			.buy-header-info {
				font-weight: 600;
				font-size: 0.22rem;
				color: #666666;
				.buy-header-title {
					font-weight: 600;
					font-size: 0.26rem;
					color: #333333;
				}
			}
		}
		.buy-content {
			width: 6.9rem;
			height: 3rem;

			background: #f2f5fb;
			border-radius: 0.2rem;
			margin-top: 0.3rem;
			padding: 0 0.3rem;
			.content-item {
				width: 6.3rem;
				height: 1rem;
				border-bottom: 0.01rem solid #eeeeee;
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-weight: 400;
				font-size: 0.24rem;
				color: #333333;
				&:nth-last-of-type(1) {
					border-bottom: none;
				}
				.buy-icon {
					width: 0.3rem;
					height: 0.3rem;
					vertical-align: middle;
					position: relative;
					bottom: 0.02rem;
				}
				.label {
					font-weight: 600;
					font-size: 0.28rem;
					color: #333333;
				}
			}
		}
		.info-div {
			width: 6.9rem;
			font-weight: 400;
			font-size: 0.24rem;
			color: #666666;
			margin-top: 0.2rem;
		}
		.submit {
			width: 3.8rem;
			height: 1rem;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/766ae0bd3f4856e6e74610a52d7effa4.png);
			text-align: center;
			line-height: 0.96rem;
			margin-left: 1.55rem;
			margin-top: 0.4rem;
			font-weight: 500;
			font-size: 0.32rem;
			color: #ffffff;
		}
	}
	.submit-btn {
		width: 3.8rem;
		height: 1rem;
		background-size: contain;
		background-repeat: no-repeat;
		margin-left: 1.85rem;
		margin-top: 0.6rem;
        margin-bottom: 1.21rem;
		line-height: 1rem;
		text-align: center;
		font-weight: 500;
		font-size: 0.32rem;
		color: #ffffff;
		background-image: url(https://yaame-static.yaame.io/admin/e74085fd0ef8d275ccd328732df33b4a.png);
		&.disabled {
			// 灰色滤镜
			filter: grayscale(100%);
		}
	}
	.time-container {
		width: 5.9rem;
		height: 4rem;
		background: #ffffff;
		border-radius: 0.24rem;
		padding: 0.6rem 0.5rem;
		.title {
			width: 4.9rem;
			text-align: center;
			font-weight: 600;
			font-size: 0.34rem;
			color: #333333;
			margin-bottom: 0.2rem;
		}
		.content {
			width: 4.9rem;
			font-weight: 400;
			font-size: 0.26rem;
			color: #666666;
			text-align: center;
			.time-info {
				color: #ffa200;
			}
		}
		.time-btn {
			width: 3.7rem;
			height: 0.88rem;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/766ae0bd3f4856e6e74610a52d7effa4.png);
			text-align: center;
			line-height: 0.88rem;
			margin-left: 0.6rem;
			margin-top: 0.6rem;
			font-weight: 500;
			font-size: 0.3rem;
			color: #ffffff;
		}
	}
}
</style>
