<!--
 * @Author: Se7enElk
 * @Date: 2022-11-09 11:13:38
 * @FilePath: /yaame-h5/src/pages/rebateRecharge/rebateRecharge.vue
 * @Description: 
-->
<template>
	<div :class="['main', 'main-' + language]">
		<custom-header :title="title" />
		<!-- <page-loading v-if="page_loading"></page-loading> -->
        <img src="https://static.yaame.io/admin/9c9e5bf397cce4aee0d2c8f15b548ae4.png" class="rule" @click="openModal('ruleVisible')">
        <img v-if="language === 'ar'" src="https://yaame-static.yaame.io/admin/26a6907d0672ead4af7f09e9d324ddf6.png" class="time" alt="">
        <img v-else src="https://yaame-static.yaame.io/admin/acae2eea54f958b12f203587e1fc745b.png" class="time" alt="">
		<div v-for="(item, index) in list" :key="index" class="rewards-container">
			<header>
				<i18n path="totalRechargeAmount">
					<template #count>
						<span class="totalRechargeAmount">{{
							item.reward_group_title_price
						}}</span>
					</template>
				</i18n>
			</header>
			<nav>
				<div
					v-for="(ele, inx) in item.charge_reward_items"
					:key="inx"
					class="reward-item"
				>
					<div class="reward-img-container">
						<div v-if="ele.object_type !== 'VIEW'" class="reward-price">
							<p>{{ ele.reward_diamond_worth }} <img v-if="ele.object_type === 'GIFT' || ele.object_type === 'DIAMOND'" src="https://static.yaame.io/admin/59300f79243445499d77fde5ffd50ddd.png" alt=""> </p>
						</div>
						<img :src="ele.reward_icon" alt="" />
					</div>
					<div class="reward-name">{{ ele.reward_name }}</div>
				</div>
			</nav>
			<div class="get-reward" @click="getReward(item)">
				<img :src="computeImg(item.receive_status)" alt="" />
			</div>
		</div>

        <div v-if="language === 'ar'" class="user-info">
			<div class="recharge-info">
                <div class="recharge-btn" @click="toRecharge">{{ $t('recharge') }}</div>

				<p>
					{{ $t('myChargeTotal') }}: <span>${{ total_charge_amount }}</span>
				</p>
				
			</div>

			<div class="progress-bar-container">
				<div class="progress-bar ar">
					<div
						:style="{ width: calculatePercentage(total_charge_amount) + '%' }"
						class="progress-bar-content"
					>
						<img
							src="https://static.yaame.io/admin/62747738ff144ffac66aaca83bd27159.png"
							alt=""
						/>
						<div
                            v-if="next_reward_tip"
							:class="[
								'progress-info',
								calculatePercentage(total_charge_amount) >= 90 && 'small',
								calculatePercentage(total_charge_amount) <= 10 && 'large',
							]"
						>
							<p>{{ next_reward_tip }}</p>
							<img
								src="https://static.yaame.io/admin/e48c2fd4042744f508eb6480a847e506.png"
								alt=""
							/>
						</div>
					</div>
				</div>
				<p class="progress-value">
                    <span>$1000</span>
					<span>$0</span>
				</p>
			</div>
		</div>

		<div v-else class="user-info">
			<div class="recharge-info">
				<p>
					{{ $t('myChargeTotal') }}: <span>${{ total_charge_amount }}</span>
				</p>
				<div class="recharge-btn" @click="toRecharge">{{ $t('recharge') }}</div>
			</div>

			<div class="progress-bar-container">
				<div class="progress-bar">
					<div
						:style="{ width: calculatePercentage(total_charge_amount) + '%' }"
						class="progress-bar-content"
					>
						<img
							src="https://static.yaame.io/admin/62747738ff144ffac66aaca83bd27159.png"
							alt=""
						/>
						<div
                            v-if="next_reward_tip"
							:class="[
								'progress-info',
								calculatePercentage(total_charge_amount) >= 90 && 'large',
								calculatePercentage(total_charge_amount) <= 10 && 'small',
							]"
						>
							<p>{{ next_reward_tip }}</p>
							<img
								src="https://static.yaame.io/admin/e48c2fd4042744f508eb6480a847e506.png"
								alt=""
							/>
						</div>
					</div>
				</div>
				<p class="progress-value">
					<span>$0</span>
					<span>$1000</span>
				</p>
			</div>
		</div>

        <popup v-if="ruleVisible" class="flex-box">
            <div class="rule-container">
                <header>{{ $t('rule') }}</header>
                <p>{{ $t('rule-1') }}</p>
                <p>{{ $t('rule-2') }}</p>
                <p>{{ $t('rule-3') }}</p>
                <p>{{ $t('rule-4') }}</p>

                <img class="close" src="https://static.yaame.io/admin/5d9490f844973685c29424bbe76d56a2.png" @click="closeModal('ruleVisible')">
            </div>
        </popup>
	</div>
</template>

<script>
import { getLanguage } from "../../lib/device";
import {
	getChargeRebateInfo,
	chargeRebateReceive,
} from "../../lib/request/recharge";
import Toast from "../../components/third/toast/toast";
import customHeader from "../../components/common/header.vue";
import pageLoading from "../../components/common/page_loading.vue";
import popup from "../../components/common/pop_up.vue";
export default {
	name: "rebateRecharge",
	components: {
		customHeader,
		pageLoading,
        popup
	},
	data() {
		return {
			list: [],
			total_charge_amount: 0,
			next_reward_tip: "",

			imgEnum: {
				"zh-cn": {
					1: "https://static.yaame.io/admin/af7500350e34b1274d4f9ea930a12104.png",
					0: "https://static.yaame.io/admin/dad6287c1269342563b43cfcd5bc4034.png",
					2: "https://static.yaame.io/admin/0023c065c79c540e4708f2162a9b990c.png",
				},
				"zh-tw": {
					1: "https://static.yaame.io/admin/1066a336e6ff8a9853939f26f3dae7a7.png",
					0: "https://static.yaame.io/admin/cc82469a7e61eff338da70a12f8df5dc.png",
					2: "https://static.yaame.io/admin/6bbcebd767c57db32c58a9f2b74d7bef.png",
				},
				en: {
					1: "https://static.yaame.io/admin/cca3bfbb995cad84981a1c1ce1c0c60b.png",
					0: "https://static.yaame.io/admin/8c8f83d4be723c272b345870d1d6f2a2.png",
					2: "https://static.yaame.io/admin/681cc784a4e72737397ffe792e262877.png",
				},
				id: {
					1: "https://static.yaame.io/admin/6afd112825d0ba744cc52e47e1d448a0.png",
					0: "https://static.yaame.io/admin/b0fc90204f19bff19b65bd7198a999b9.png",
					2: "https://static.yaame.io/admin/cb18a49719e46b58f13c5abcf8ef8ccf.png",
				},
				ar: {
					1: "https://static.yaame.io/admin/1b2125df60cb34b084b57b9475a07f0b.png",
					0: "https://static.yaame.io/admin/ca38ee65b8ebfe60365d5f06681d28ac.png",
					2: "https://static.yaame.io/admin/9a88db12e6126ce8c077b621b462d067.png",
				},
			},
            page_loading: true,

            ruleVisible: false,
		};
	},
	computed: {
		language() {
			let locale =  getLanguage() || "en";
            if (['zh-hk', 'zh-tw', 'zh-mo', 'zh-cn', 'zh_cn'].indexOf(locale) > -1) {
                let localEnum = {
                    'zh-hk': 'zh-tw',
                    'zh-tw': 'zh-tw',
                    'zh-mo': 'zh-tw',
                    'zh-cn': 'zh-cn',
                    'zh_cn': 'zh-cn',
                };

                locale = localEnum[locale];
            }
            return locale;
		},
        title() {
            return this.$t('rebateRecharge')
        },
	},
	mounted() {
        let self = this;
		this.getData();
        setInterval(() => {
            self.getData();
        }, 3000);
	},
	methods: {
		computeImg(num = "0") {
			return this.imgEnum[this.language][num];
		},

		getData() {
			getChargeRebateInfo()
				.then((res) => {
					if (res.status === 1000) {
						this.list = res.data.charge_reward_groups;
						this.next_reward_tip = res.data.next_reward_tip;
						this.total_charge_amount = res.data.total_charge_amount;

                        this.page_loading = false;
					}
				})
				.catch((msg) => {
					console.log(msg);
				});
		},
		calculatePercentage(value) {
			if (typeof value !== "number") {
				return "Error: 参数必须是数字类型";
			}

			if (value < 0) {
				return "Error: 参数必须在0-1000之间";
			}
            if (value >= 1000) value = 1000;
			const percentage = (value / 1000) * 100;
			return percentage.toFixed(2);
		},
		getReward(item) {
			if (item.receive_status === 1) {
				chargeRebateReceive({
					group_flag: item.group_flag,
				})
					.then((res) => {
						console.log(res);
						if (res.status === 1000) {
							this.getData();
							Toast(this.$t('receiveSuccess'));
						}
					})
					.catch((msg) => {
						console.log(msg);
					});
			}
		},
		toRecharge() {
			window.location.href = "wlyaame://mine/shop/diamond";
		},
        openModal(key) {
            this[key] = true;
            document.body.addEventListener('touchmove', this.preventScroll, { passive: false });
        },
        closeModal(key) {
            this[key] = false;
            document.body.removeEventListener('touchmove', this.preventScroll);
        },
        preventScroll(event) {
            event.preventDefault();
        }
	},
};
</script>

<style lang="less" scoped>
.main {
	width: 7.5rem;
	min-height: 100vh;
	background-color: #000;
	background-size: contain;
	background-repeat: no-repeat;
	padding-top: 6.4rem;
    position: relative;
	&.main-zh-cn {
		background-image: url(https://static.yaame.io/admin/a10d56d4c6ed2e6186b0cb423fbbfbb9.jpg);
	}
	&.main-zh-tw {
		background-image: url(https://static.yaame.io/admin/4ddeaa0a071f70467793d7e2ea545efb.jpg);
	}
	&.main-en {
		background-image: url(https://static.yaame.io/admin/345047b41470367510e6da8c27b6ddda.jpg);
	}
	&.main-id {
		background-image: url(https://static.yaame.io/admin/5d5cd94d82767daa5ae805699a0b9586.jpg);
	}
	&.main-ar {
		background-image: url(https://static.yaame.io/admin/c2fa30c2b501c03bfbf6babb5efb0f04.jpg);
	}
    .time{
        width: 4.28rem;
        height: 0.21rem;
        position: absolute;
        left: 1.61rem;
        top: 2.7rem;
    }
    .rule {
        position: absolute;
        top: 1.73rem;
        right: 0.32rem;
        width: 0.6rem;
        height: 0.6rem;
    }
	.rewards-container {
		margin-top: 0.74rem;
		width: 6.8rem;
		height: 4.8rem;
		margin-left: 0.35rem;
		padding-top: 0.9rem;
		background-size: contain;
		background-repeat: no-repeat;
		position: relative;
		background-image: url(https://static.yaame.io/admin/b458fdd323e0ea62fa0d18a6ddaa16f1.png);
		header {
			position: absolute;
			top: -0.37rem;
			left: 0.65rem;
			width: 5.5rem;
			height: 0.74rem;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://static.yaame.io/admin/9a883ea40a3fb5478c8b952f95f66760.png);
			line-height: 0.74rem;
			font-size: 0.26rem;
			color: #421500;
			letter-spacing: -0.5px;
			text-align: center;
		}
		nav {
			width: 6.8rem;
			height: 2.4rem;
			display: flex;
			justify-content: space-evenly;
			.reward-item {
				width: 1.6rem;
				height: 2.4rem;
				.reward-img-container {
					width: 1.6rem;
					height: 1.6rem;
					background: #27160e;
					border: 1px solid rgba(102, 84, 47, 1);
					border-radius: 0.15rem;
					display: flex;
					justify-content: center;
					align-items: center;
					position: relative;
					.reward-price {
						position: absolute;
						top: -0.02rem;
						right: -0.02rem;
						width: 1rem;
						height: 0.36rem;
						background-image: linear-gradient(
							90deg,
							#e7b959 0%,
							#fbe8b0 45%,
							#e4ae47 100%
						);
						border: 0.01rem solid rgba(102, 84, 47, 1);
						border-radius: 0px 0.15rem 0px 0.15rem;
						p {
							font-size: 0.24rem;
							color: #602b12;
							text-align: center;
							font-weight: 600;
							transform: scale(0.8333);
						}
                        img {
                            vertical-align: baseline;
                            width: 0.2rem;
                            height: auto;
                            margin-left: -0.04rem;
                        }
					}
					img {
						width: 1.4rem;
						height: 1.4rem;
					}
				}
				.reward-name {
					margin-top: 0.16rem;
					font-size: 0.24rem;
					color: #c0a055;
					letter-spacing: 0;
					text-align: center;
					font-weight: 300;
				}
			}
		}
		.get-reward {
			margin-top: 0.2rem;
			width: 6.8rem;
			height: 0.84rem;
			display: flex;
			justify-content: center;
			img {
				width: 3.64rem;
				height: 0.84rem;
			}
		}
	}
	.user-info {
		// position: fixed;
		// bottom: 0;
		// left: 0;
		margin-top: 0.4rem;
		width: 7.5rem;
		height: 3.08rem;
		background-image: url(https://static.yaame.io/admin/d98c2cf56dee6bed13cde8edb1619a81.png);
		background-size: contain;
		background-repeat: no-repeat;
		padding-top: 0.36rem;
		.recharge-info {
			width: 7.5rem;
			padding: 0 0.3rem;
			display: flex;
			justify-content: space-between;
			height: 0.5rem;
			align-items: center;
			p {
				font-size: 0.26rem;
				color: #ffce57;
				letter-spacing: -0.5px;
				text-align: right;
				span {
					color: #ff3f0f;
				}
			}
			.recharge-btn {
				width: 1.64rem;
				height: 0.5rem;
                text-align: center;
				background-image: linear-gradient(0deg, #914a00 0%, #ffd82d 100%);
				border: 0.04rem solid rgba(52, 27, 0, 1);
				border-radius: 0.45rem;
                font-size: 0.24rem;
                color: #FFFFFF;
                letter-spacing: -0.46px;
                font-weight: 600;
                padding-top: 0.04rem
			}
		}
		.progress-bar-container {
			margin-top: 0.25rem;
			height: 1.2rem;
			width: 7.5rem;
			display: flex;
			justify-content: center;
			padding-top: 0.52rem;
			flex-wrap: wrap;
			.progress-bar {
				width: 6.4rem;
				height: 0.3rem;
				background: #341300;
				border: 0.04rem solid rgba(126, 71, 9, 1);
				border-radius: 0.15rem;
				display: flex;
				align-items: center;
                position: relative;
                &.ar {
                    .progress-bar-content {
                        position: absolute;
                        right: 0;
                        img{
                            right: auto;
                            left: -0.32rem;
                        }
                    }
                }
				.progress-bar-content {
					width: 50%;
					height: 0.22rem;
					background-image: linear-gradient(
						270deg,
						#ffe13f 2%,
						#d57c00 45%,
						#d57c00 100%
					);
					border-radius: 0.11rem;
					position: relative;
					img {
						width: 0.64rem;
						height: 0.64rem;
						position: absolute;
						right: -0.32rem;
						top: -0.2rem;
					}
					.progress-info {
						transform: translateX(50%) scale(0.94);
						position: absolute;
						right: 0;
						top: -0.64rem;
						display: inline-block;
						width: auto;
						height: 0.42rem;
						line-height: 0.42rem;
						padding: 0 0.17rem;
						font-size: 0.16rem;
						color: #fff0d9;
						letter-spacing: -0.5px;
						font-weight: 500;
						background-color: rgba(255, 255, 255, 0.2);
						border-radius: 0.04rem;
						&.small {
							transform: translateX(70%) scale(0.94);
							img {
								left: 28%;
							}
						}
						&.large {
							transform: translateX(30%) scale(0.94);
							img {
								right: 22%;
								left: auto;
							}
						}
						p {
							white-space: nowrap;
							transform: scale(0.95);
						}
						img {
							position: absolute;
							left: 50%;
							transform: translateX(-50%);
							width: 0.17rem;
							height: auto;
							top: 0.42rem;
						}
					}
				}
			}
			.progress-value {
				width: 6.4rem;
				margin-top: 0.1rem;
				display: flex;
				height: 0.3rem;
				justify-content: space-between;
				height: 0.3rem;
				font-size: 0.24rem;
				color: #ffce57;
				font-weight: 500;
			}
		}
	}
    .flex-box{
        display: flex;
        justify-content: center;
        align-items: center;
        .rule-container{
            width: 6.8rem;
            height: 10.22rem;
            background-image: url(https://static.yaame.io/admin/72aaf6abc8d4ef87a0325ffb50e3a4ba.png);
            background-repeat: no-repeat;
            background-size: contain;
            padding: 1.72rem 0.3rem 0.3rem;
            position: relative;
            header {
                font-size: 0.32rem;
                color: #421500;
                letter-spacing: 0;
                text-align: center;
                font-weight: 600;
            }
            p {
                margin-top: 0.38rem;
                font-size: 0.28rem;
                color: #421500;
                letter-spacing: 0;
                font-weight: 600;
            }
            .close {
                width: 0.5rem;
                height: 0.5rem;
                position: absolute;
                top: 1.38rem;
                right: 0.16rem;
            }
        }
    }
}
.totalRechargeAmount {
	font-size: 0.36rem;
	color: #8c0000;
	letter-spacing: -0.5px;
	text-align: center;
	font-weight: 600;
	margin-left: 0.12rem;
}
</style>
