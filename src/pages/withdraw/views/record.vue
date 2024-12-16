<!--
 * @Author: Elk
 * @Date: 2024-06-21 15:08:29
 * @FilePath: /yaame-h5/src/pages/withdraw/views/record.vue
 * @Description: 
-->
<template>
	<div :style="{ paddingTop: safeHeight + 0.88 + 0.3 + 'rem' }" class="record">
		<Header keep :keepColor="false">{{ $t('withdrawRecord') }}</Header>

		<pageLoading v-if="loading"></pageLoading>
		<refresh class="refresh" ref="wlRefresh" @onRefresh="refreshList">
			<div
				v-infinite-scroll="loadMore"
				:infinite-scroll-immediate-check="true"
				infinite-scroll-disabled="loading"
				infinite-scroll-distance="10"
				class="order-container"
			>
				<div v-for="(item, index) in list" :key="index" class="order-item">
					<div class="order-header">
						<div class="order-info">
							<p class="title">Record ID：{{ item.order_id }}</p>
							<p>{{ formatDate(item.create_time, 'yyyy/MM/dd hh:mm:ss' ) }}</p>
						</div>
						<div :class="['order-status', item.order_status]">{{ item.order_status_tip }}</div>
					</div>
					<p v-if="item.withdraw_account" class="withdraw-to">{{ $t('withdraw_to') }}</p>
					<div v-if="item.withdraw_account" class="pay-info">
						<img class="img-div" :src="item.withdraw_account.method_icon" alt="" />
						<div class="info-div">
							<p class="title">{{ item.withdraw_account.method_name }}</p>
							<p v-if="item.withdraw_account.account_tip">{{ item.withdraw_account.account_tip }}</p>
						</div>
					</div>

					<div class="buy-content">
						<div class="content-item">
							<div class="label">{{ $t('gold_coin') }}</div>
							<div>
								<img
									class="buy-icon"
									src="https://yaame-static.yaame.io/admin/5df2d432eb4c640a37c33aad78ca6fbc.png"
									alt=""
								/>
								{{ item.coin_amount }}
							</div>
						</div>
						<div v-if="item.commission_info" class="content-item">
							<div class="label">{{ $t('rate') }} ({{ item.commission_info.commission_tip }})</div>
							<div>
                                ≈ {{ item.currency_type + ' ' + (item.commission_info.commission_amount / 100) }}
							</div>
						</div>
						<div class="content-item">
							<div class="label">{{ $t('can_get') }}</div>
							<div>
								≈ {{ item.currency_type }} {{ item.money_received / 100 }}
							</div>
						</div>
					</div>

					<div v-show="item.failed_reason" class="card-error">
						<img
							src="https://yaame-static.yaame.io/admin/c827b42ff55335d40e1f1f63b67e7a22.png"
							alt=""
						/>
						<p class="info">
							{{ item.failed_reason }}
						</p>
					</div>
				</div>

                <blank-page v-if="!list || !list.length" :title="t('no_withdrawal')" ></blank-page>
			</div>
		</refresh>
	</div>
</template>
<script setup>
import { computed, onMounted, ref, getCurrentInstance } from "vue";
import { getLanguage, getSafeHeight } from "@/lib/device";
import pageLoading from "@/components/common/page_loading.vue";
import { Toast } from "vant";
import { getWithdrawalOrderListAPI } from "../api";
import Header from "@/components/common/header.vue";
import refresh from "@/components/common/refresh.vue";
import { formatDate } from "@/lib/utils";
const root = getCurrentInstance();
import blankPage from '@/components/common/blank_page.vue';
const t = (key) => {
	return root.proxy.$t(key);
};
let safeHeight = ref(0);
let safeArea = getSafeHeight() || 0;
safeHeight.value = (safeArea * 2) / 100;

let page = ref(1);
let has_next = ref(true);
let list = ref([]);
let loading = ref(true);
const getWithdrawalOrderList = async () => {
	const res = await getWithdrawalOrderListAPI({
		page: page.value,
		page_size: 10,
	});
	if (res.status === 1000) {
		loading.value = false;
		has_next.value = res.data.has_next;
		if (page.value === 1) {
			list.value = res.data.content;
		} else {
			list.value = list.value.concat(res.data.content);
		}
	}
};
const wlRefresh = ref(null);
const refreshList = async () => {
	page.value = 1;
	has_next.value = true;
	await getWithdrawalOrderList();
	setTimeout(() => {
		wlRefresh.value.isLoading = false;
	}, 500);
};

const loadMore = async () => {
	if (has_next.value) {
		page.value++;
		await getWithdrawalOrderList();
	}
};
onMounted(async () => {
	await getWithdrawalOrderList();
});
</script>
<style scoped lang="less">
.record {
	width: 7.5rem;
	min-height: 100vh;
	font-size: 0.24rem;
	color: #333;
	.order-container {
        min-height: 80vh;
		.order-item {
			width: 6.9rem;
			padding: 0.3rem;
			background: #ffffff;
			border-radius: 0.24rem;
			margin-left: 0.3rem;
            margin-bottom: 0.3rem;
			.order-header {
				width: 6.3rem;
				height: 1.16rem;
				border-bottom: 0.01rem solid #e1e1e1;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.order-info {
					font-weight: 500;
					color: #bbbbbb;
					.title {
						font-weight: bold;
						font-size: 0.28rem;
						color: #333333;
					}
				}
				.order-status {
					height: 0.52rem;
					line-height: 0.52rem;
					padding: 0 0.18rem;
					border-radius: 0.13rem;
					text-align: center;
					font-weight: 500;
					font-size: 0.22rem;
                    color: #907b3e;
                    background: #fff5b3;
                    // 文字不换行
                    white-space: nowrap;

					&.SUCCESS {
						background: #e4ffe2;
						color: #4b8247;
					}
					&.CHARGE_FAILED {
						color: #e42525;
						background: #ffe6e6;
					}
					&.WAIT_CHECK {
						color: #907b3e;
						background: #fff5b3;
					}
					&.REFUND {
						color: #e42525;
						background: #ffe6e6;
					}
                    &.PAY_PENDING {
                        background: #FAEAD9;
                        color: #B6793B;
                    }
				}
			}
			.withdraw-to {
				width: 6.3rem;
				font-weight: 500;
				color: #666666;
				margin: 0.2rem 0;
			}
			.pay-info {
				width: 6.3rem;
				height: 1.22rem;
				background: #f2f5fb;
				border-radius: 0.2rem;
				display: flex;
				align-items: center;
				padding-left: 0.2rem;
				.img-div {
					max-height: 0.8rem;
					margin-right: 0.2rem;
				}
				.info-div {
					font-size: 0.22rem;
					color: #666666;
					.title {
						font-weight: 600;
						font-size: 0.26rem;
						color: #333333;
					}
				}
			}
			.buy-content {
				width: 6.3rem;
				// height: 3rem;
				border-radius: 0.2rem;
				// margin-top: 0.3rem;
				.content-item {
					width: 6.3rem;
					height: 1rem;
					border-bottom: 0.01rem solid #e1e1e1;
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
			.card-error {
				width: 6.3rem;
				height: 0.84rem;
				background: #ffe9e9;
				border-radius: 0.14rem;
				display: flex;
				align-items: center;
				padding-left: 0.2rem;
				// margin-top: 0.22rem;
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
			.submit {
				width: 3.8rem;
				height: 1rem;
				background-size: contain;
				background-repeat: no-repeat;
				background-image: url(https://yaame-static.yaame.io/admin/766ae0bd3f4856e6e74610a52d7effa4.png);
				text-align: center;
				line-height: 0.96rem;
				margin-left: 1.25rem;
				margin-top: 0.4rem;
				font-weight: 500;
				font-size: 0.32rem;
				color: #ffffff;
			}
			.submit-info {
				width: 6.3rem;
				margin-top: 0.1rem;
				text-align: center;
				font-size: 0.2rem;
				color: #c1c1c1;
			}
		}
	}
}
</style>
