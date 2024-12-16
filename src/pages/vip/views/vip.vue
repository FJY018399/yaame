<template>
	<div
		:style="{ paddingTop: isFullScreen ? safeHeight + 0.88 + 'rem' : '0.88rem' }"
		:class="['main', language]"
	>
		<header
			:style="{
				background: headerWhite ? '#fff' : '',
				height: isFullScreen ? safeHeight + 0.88 + 'rem' : '0.88rem',
			}"
			class="page-header"
		>
			<div class="back-img" @click="back">
				<img
					src="https://yaame-static.yaame.io/admin/59b5c791f28d312301d9a2d0751ec516.png"
					@click="back"
				/>
			</div>
			<div class="header-content">{{ $t("yaame_vip") }}</div>
			<img
				src="https://yaame-static.yaame.io/admin/3bcf26932e2b9a72c39c9baee166f590.png"
				class="info-img"
				@click="toDesc"
			/>
		</header>

		<div class="user-info">
			<div class="user-avatar">
				<img :src="userInfo.avatar" />
			</div>

			<div class="user-value">
				<p class="user-name no-wrap">{{ userInfo.nick_name }}</p>
				<p v-if="userInfo.expire_time" class="user-time">
					Expiration: {{ formatDate(userInfo.expire_time, "yyyy.MM.dd") }}
				</p>
			</div>
			<img
				v-if="userInfo.level_badge_icon"
				class="user-icon"
				:src="userInfo.level_badge_icon"
				alt=""
			/>
		</div>

		<div class="shop-list">
			<div
				v-for="(item, index) in subscriptionVos"
				:key="index"
				:class="['shop-item', index === shopTabActive && 'active']"
				@click="handleShopping(index, item.worth_diamonds)"
			>
				<div class="shop-name">
                    <img src="../../../assets/img/cp/diamond.png" alt="">
                    {{ item.worth_diamonds }}</div>
				<div class="shop-time">{{ item.days }}</div>
				<div v-if="item.selected === 1" class="shop-footer">
					{{ $t("subscribed") }}
				</div>
				<div v-else class="shop-footer">{{ $t("subscribe") }}</div>

                <div v-if="item.discount" class="discount">
                    {{ item.discount * 100 }}% OFF
                </div>
			</div>
		</div>

		<div class="content">
			<img
				src="https://yaame-static.yaame.io/admin/6646661e248c121b6eb482a6597d6926.png"
				class="top-img"
				alt=""
			/>

			<div class="auto-pay">
				<p class="pay-info">
					{{ $t("auto_subscribe_tips") }}
				</p>
				<img
					v-show="toggle"
					class="toggle"
					src="https://yaame-static.yaame.io/admin/d7a1de9a34ff61ad233982576740c409.png"
					alt=""
					@click="checkToggle"
				/>
				<img
					v-show="!toggle"
					class="toggle"
					src="https://yaame-static.yaame.io/admin/e2c07773fc5c9a857c825885381ee46e.png"
					alt=""
					@click="checkToggle"
				/>
			</div>

			<div class="privilege-title">{{ $t("vip_privilege") }}</div>
			<div class="privilege-list">
				<div
					v-for="(item, index) in privilegeConfigs"
					:key="index"
					class="privilege-item"
					@click="toDetails(index)"
				>
					<img class="privilege-img" :src="item.icon" alt="" />
					<p class="privilege-name">{{ item.desc }}</p>

					<img
						v-if="item.level_badge_icon"
						class="privilege-icon"
						:src="item.level_badge_icon"
						alt=""
					/>
				</div>
			</div>
		</div>

		<pageLoading v-if="pageLoading"></pageLoading>

		<Modal
			v-if="buyVisible"
            :info="buyInfo"
			content="buyInfo"
			@cancel="cancelBuy"
			@confirm="confirmBuy"
		></Modal>
		<Modal
			v-if="rechargeVisible"
			:type="true"
            :info="rechargeInfo"
			content="rechargeInfo"
			@cancel="cancelRecharge"
			@confirm="confirmRecharge"
		></Modal>
	</div>
</template>

<script>
import { computed, onMounted, onUnmounted, ref, getCurrentInstance } from "vue";
import { getLanguage, getSafeHeight } from "@/lib/device";
import { getScrollTop, burialPointFun } from "@/lib/utils";
import pageLoading from "@/components/common/page_loading.vue";
import { getInfoAPI, subscribeAPI, autoSubscribeAPI } from "../api";
import Modal from "../components/Modal.vue";
import { Toast } from "vant";
import { formatDate } from "../../../lib/utils";
export default {
	components: {
		pageLoading,
		Modal,
	},
	setup() {
		const root = getCurrentInstance();
		const router = root.proxy.$router;
		// 获取国家
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
        const t = (val) => {
            return root.proxy.$i18n.t(val)
        }

		let safeHeight = ref(0);
		let safeArea = getSafeHeight() || 0;
		safeHeight.value = (safeArea * 2) / 100;

		let headerWhite = ref(false);

		let pageLoading = ref(true);
		const pageChange = () => {
			const scroll_top = getScrollTop();
			headerWhite.value = scroll_top > 10;
		};

		const back = () => {
			location.href = `wlyaame://webview/back`;
		};

		const toDesc = () => {
			router.push({ name: "rule" });
		};

		const toDetails = (index) => {
			router.push({
				name: "details",
				query: {
					active: index,
				},
			});
		};

		let shopTabActive = ref(-1);
		let buyVisible = ref(false);

		let buyIndex = ref(-1);
        let diamond_balance = 0;
        let buyInfo = ref({
            diamond: 0,
            day: 0,
        });
        let rechargeInfo = ref({
            diamond: 0,
        });
		const handleShopping = (index) => {
            if (diamond_balance < subscriptionVos.value[index].worth_diamonds) {
                rechargeInfo.value.diamond = diamond_balance;
                rechargeVisible.value = true;
                return;
            } else {
                buyInfo.value.diamond = subscriptionVos.value[index].worth_diamonds;
                buyInfo.value.day = subscriptionVos.value[index].days_num;
                buyVisible.value = true;
                buyIndex.value = index;
            }
		};

		const cancelBuy = () => {
			buyVisible.value = false;
			rechargeVisible.value = false;
		};
		const confirmBuy = async () => {
			let res = await subscribeAPI({
				product_flag:
					subscriptionVos.value[buyIndex.value].vip_subscription_type,
				auto_switch: toggle.value ? "OPEN" : "CLOSE",
			});
			if (res.status === 1000) {
				Toast.success();
				buyVisible.value = false;

				getHomeInfo();
			} else if (res.status === 6600) {
				rechargeVisible.value = true;
			} else {
				Toast.fail(res.desc);
			}
		};

		let rechargeVisible = ref(false);
		const cancelRecharge = () => {
			rechargeVisible.value = false;
		};
		const confirmRecharge = () => {
			window.location.href = "wlyaame://mine/shop/diamond";
		};

		let toggle = ref(false);

		let userInfo = ref({
			uid: "",
			nick_name: "-",
			auto_switch: "CLOSE",
			avatar: "",
		});
		let subscriptionVos = ref([]);
		let privilegeConfigs = ref([]);

		let getHomeInfo = async () => {
			let res = await getInfoAPI();
			pageLoading.value = false;
			if (res.status === 1000) {
				userInfo.value = res.data.user_info;
				subscriptionVos.value = res.data.vip_subscriptions;
				privilegeConfigs.value = res.data.vip_privilege_configs;
                diamond_balance = res.data.diamond_balance;

                shopTabActive.value = -1;
				subscriptionVos.value.find((item, index) => {
					if (item.selected) {
						shopTabActive.value = index;
						return true;
					}
				});
				toggle.value = userInfo.value.auto_switch === "OPEN";
			}
		};

		let checkToggle = async () => {
            if (userInfo.value.last_subscription_type) {
                let res = await autoSubscribeAPI({
                    auto_switch: toggle.value ? "CLOSE" : "OPEN",
                    product_flag: userInfo.value.last_subscription_type,
                });
                if (res.status === 1000) {
                    toggle.value = !toggle.value;
                    Toast.success();
                    getHomeInfo();
                } else {
                    Toast.fail(res.desc);
                }
            } else {
                if (shopTabActive.value === -1) {
                    Toast.fail(t("please_select_vip"));
                    return;
                }
                let res = await autoSubscribeAPI({
                    auto_switch: toggle.value ? "CLOSE" : "OPEN",
                    product_flag: subscriptionVos.value[shopTabActive.value].vip_subscription_type,
                });
                if (res.status === 1000) {
                    toggle.value = !toggle.value;
                    Toast.success();
                    getHomeInfo();
                } else {
                    Toast.fail(res.desc);
                }
            }
		};

        let isFullScreen = computed(() => {
            if (location.href.indexOf('is_full_screen') > -1) {
                return true;
            } else {
                return false;
            }
        });

		onMounted(() => {
			getHomeInfo();
			window.addEventListener("scroll", pageChange);
			document.body.style.backgroundColor = "#1A1409";
			burialPointFun({
				event_name: "page_view_vip",
				cid: -1005,
				md: 108,
				args_name: "page_view_vip",
			});

			window.onPaySuccess = function () {
				rechargeVisible.value = false;
                getHomeInfo();
			};
		});
		onUnmounted(() => {
			window.removeEventListener("scroll", pageChange);
		});
		return {
			language,
			safeHeight,

			headerWhite,
			back,

			toDesc,
			toDetails,

			pageLoading,

			shopTabActive,

			handleShopping,
			toggle,
			checkToggle,

			userInfo,
			subscriptionVos,
			privilegeConfigs,
			rechargeVisible,

			buyVisible,
			cancelBuy,
			confirmBuy,
			rechargeVisible,
			cancelRecharge,
			confirmRecharge,

			formatDate,

            buyInfo,
            rechargeInfo,

            isFullScreen
		};
	},
};
</script>
<style lang="less" scoped>
.main {
	width: 7.5rem;
	padding-top: 0.88rem;
	font-size: 0.24rem;
	color: #c5b191;
	background-size: contain;
	background-repeat: no-repeat;
	background-image: url(https://yaame-static.yaame.io/admin/c00443cfcdac2d1131213f2a93f0e84d.png);
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
	.user-info {
		width: 7.5rem;
		margin-top: 0.4rem;
		height: 1.3rem;
		display: flex;
		padding: 0 0.35rem;
		align-items: center;
        position: relative;
		.user-avatar {
			width: 1.3rem;
			height: 1.3rem;
			border-radius: 50%;
			border: 0.06rem solid #FFF0E1;
			img {
				width: 1.18rem;
				height: 1.18rem;
				border-radius: 50%;
				display: block;
			}
		}
		.user-value {
			width: 3.6rem;
			height: 0.95rem;
			margin-left: 0.35rem;
			.user-name {
				font-size: 0.3rem;
				font-weight: 600;
				color: #663322;
				margin-bottom: 0.12rem;
			}
			.user-time {
				font-size: 0.24rem;
				font-weight: 400;
				color: #845b4d;
			}
		}
		.user-icon {
            position: absolute;
            right: 0.45rem;
			width: auto;
			height: 0.44rem;
		}
	}
	.shop-list {
		margin-top: 0.4rem;
		width: 7.5rem;
		height: 2.3rem;
		display: flex;
		padding: 0 0.3rem;
		justify-content: space-between;
		position: relative;
		z-index: 1;
		.shop-item {
			width: 2.1rem;
			height: 2.3rem;
			background: linear-gradient(180deg, #fefbf8 0%, #eac493 100%);
			border-radius: 0.32rem;
			border: 0.02rem solid #fefbf8;
			position: relative;
			padding-top: 0.4rem;
			&.active {
				// background: linear-gradient(180deg, #f7e39d 0%, #f2a469 100%);
                background-image: url(https://yaame-static.yaame.io/admin/01d45fbeefccc9433de2af05c6883e70.png);
                background-size: contain;
                background-repeat: no-repeat;
			}
			.shop-name {
				font-size: 0.34rem;
				font-weight: 600;
				color: #663222;
				margin-bottom: 0.1rem;
				text-align: center;
                img {
                    width: 0.3rem;
                    height: auto;
                    position: relative;
                    top: 0.08rem;
                    // vertical-align: sub;
                }
			}
			.shop-time {
				font-size: 0.24rem;
				font-weight: 400;
				color: #663222;
				text-align: center;
			}
			.shop-footer {
				position: absolute;
				text-align: center;
				left: 0;
				bottom: 0;
				width: 2.06rem;
				height: 0.6rem;
				background: linear-gradient(90deg, #ffe6ae 0%, #ffcf66 100%);
				box-shadow: inset 0 0 0.12rem 0 rgba(255, 255, 255, 0.5);
				border-radius: 0 0 0.3rem 0.3rem;
				line-height: 0.6rem;
				font-size: 0.26rem;
				font-weight: 600;
				color: #4d2003;
			}
            .discount {
                min-width: 1.42rem;
                height: 0.48rem;
                line-height: 0.48rem;
                text-align: center;
                padding: 0 0.12rem;
                background: linear-gradient(90deg, #EB634C 0%, #F1A742 100%);
                box-shadow: 0.02rem 0.02rem 0.08rem 0 rgba(174,130,68,0.3);
                border-radius: 0.3rem 0.3rem 0.3rem 0;
                position: absolute;
                left: 0;
                top: -0.18rem;

                font-size: 0.24rem;
                font-weight: 600;
                color: #FFFFFF;
            }
		}
	}
	.content {
		width: 7.5rem;
		min-height: 80vh;
		background: linear-gradient(180deg, #211b1c 0%, #2f2311 0%, #1a1409 100%);
		position: relative;
		top: -0.9rem;
		padding-top: 1.3rem;
		.top-img {
			width: 7.5rem;
			height: 1.3rem;
			position: absolute;
			top: -0.76rem;
		}

		.auto-pay {
			width: 6.9rem;
			min-height: 1.2rem;
			margin-left: 0.3rem;
			background: #403423;
			border-radius: 0.3rem;
			display: flex;
			padding: 0.27rem 0.3rem;
			justify-content: space-between;
			align-items: center;
			.pay-info {
				width: 4.76rem;
				font-size: 0.24rem;
				font-weight: 400;
				color: #c5b191;
			}
			.toggle {
				width: 1rem;
				height: 0.58rem;
			}
		}
		.privilege-title {
			width: 6.94rem;
			height: 0.84rem;
			line-height: 0.84rem;
			text-align: center;
			margin-left: 0.28rem;
			margin-top: 0.5rem;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/28e0104721710c180d583f1da00f9c60.png);
			font-size: 0.28rem;
			font-weight: 600;
			color: #ffbd52;
		}
		.privilege-list {
			width: 7.5rem;
			display: flex;
			flex-wrap: wrap;
			padding-top: 0.5rem;
			.privilege-item {
				width: 2.5rem;
				min-height: 2.1rem;
				position: relative;
				.privilege-img {
					width: 1.04rem;
					height: 1.04rem;
					margin-left: 0.73rem;
					margin-bottom: 0.18rem;
				}
				.privilege-name {
					width: 1.8rem;
					margin-left: 0.35rem;
					text-align: center;
					font-size: 0.2rem;
					font-weight: 600;
					color: #c8af9a;
				}
				.privilege-icon {
					position: absolute;
					width: auto;
					height: 0.3rem;
					top: -0.1rem;
					left: 1.3rem;
				}
			}
		}
	}
}
</style>
