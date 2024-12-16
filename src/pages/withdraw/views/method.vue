<!--
 * @Author: Elk
 * @Date: 2024-06-21 15:08:57
 * @FilePath: /yaame-h5/src/pages/withdraw/views/method.vue
 * @Description: 
-->
<template>
	<div :style="{ paddingTop: safeHeight + 0.88 + 0.3 + 'rem' }" class="method">
		<Header
			keep
			:keepColor="false"
			:right_text="rightText"
			@rightCall="openEdit"
            :custom_back="true" @onCustomBack="back"
            :show_back="!!(editCount % 2)"
			>{{ $t("withdrawal_method") }}</Header
		>

		<pageLoading v-if="loading"></pageLoading>

		<template v-if="withdraw_accounts && withdraw_accounts.length">
			<p class="title-info">{{ $t("select_method") }}</p>
			<div class="content">
				<van-swipe-cell
					v-for="(item, index) in withdraw_accounts"
					ref="itemRefs"
					:key="index"
					class="method-item"
                    disabled
                    :stop-propagation="true"
                    :before-close="beforeClose"
				>
					<div class="item-info" @click="confirmMethod(item)">
                        <div class="item-content">
                            <img :src="item.method_icon" class="item-icon" alt="" />
                            <div class="item-message">
                                <p class="item-head">{{ item.method_name }}</p>
                                <div class="item-body">
                                    <p v-if="item.account_tip" class="text no-wrap">
                                        {{ item.account_tip || "-" }}
                                    </p>
                                    <p v-show="item.method_tip" class="default-p no-wrap" @click.stop="showMore(item)">{{ item.method_tip }}</p>
                                </div>
                            </div>
                            <img class="to-icon" src="https://yaame-static.yaame.io/admin/87a6ef1589ea61034580a9c1a1ba1766.png" alt="" />
                        </div>
                        <div class="item-rate">
                            {{ $t('withdrawal_gold_range', [item.min_coin_amount, item.max_coin_amount]) }}
                        </div>
					</div>
					<template #right>
						<div class="right-div">
							<img
								style="margin-bottom: 0.14rem"
								src="https://yaame-static.yaame.io/admin/7354ddd1a5636c9c7b8c135d5cb43320.png"
								alt=""
								@click="editMethod(item)"
							/>
							<img
								src="https://yaame-static.yaame.io/admin/1861a2229555eb7ff166e42120729d48.png"
								alt=""
								@click="deleteMethod(item)"
							/>
						</div>
					</template>
				</van-swipe-cell>
			</div>
		</template>

		<template>
			<p class="title-info">{{ $t("create_new_method") }}</p>
			<div style="padding-top: 0.2rem;" class="content">
				<div
					v-for="(item, index) in method_configs"
					:key="index"
					class="method-item"
					@click="toCreateMethod(item)"
				>
					<div class="item-info">
						<div class="item-content">
                            <img :src="item.method_icon" class="item-icon" alt="" />
                            <div class="item-message">
                                <p class="item-head">{{ item.method_name }}</p>
                                <div class="item-body">
                                    <p v-if="item.account_tip" class="text no-wrap">
                                        {{ item.account_tip || "-" }}
                                    </p>
                                    <p v-show="item.method_tip" class="default-p no-wrap" @click.stop="showMore(item)">{{ item.method_tip }}</p>
                                </div>
                            </div>
                            <img class="to-icon" src="https://yaame-static.yaame.io/admin/87a6ef1589ea61034580a9c1a1ba1766.png" alt="" />
                        </div>
                        <div class="item-rate">
                            {{ item.method_type === 'BANK_TRANSFER' || item.method_type === 'CARD' ? $t('different_banks_have_different_amount_limits') : $t('withdrawal_gold_range', [item.min_coin_amount, item.max_coin_amount]) }}
                        </div>
					</div>
				</div>
			</div>
		</template>

        <PopupRef v-if="detailVisible" class="flex-container">
            <div class="detail-container">
                <p class="title">{{ $t("tips") }}</p>
                <div class="content">
                    <p>{{ detailInfo.method_tip }}</p>
                </div>
                <div class="btn" @click="detailVisible = false">{{ $t("confirm") }}</div>
            </div>
        </PopupRef>

        <PopupRef v-if="deleteVisible" class="flex-container">
            <div class="delete-container">
                <p class="title">{{ $t("tips") }}</p>
                <div class="content">
                    <p>{{ $t("confirm_delete_withdrawal_method") }}</p>
                </div>
                <div class="btn-list" >
                    <div class="btn cancel" @click="deleteVisible = false">{{ $t('cancel') }}</div>
                    <div class="btn confirm" @click="confirmDelete">{{ $t('confirm') }}</div>
                </div>
            </div>
        </PopupRef>
	</div>
</template>

<script setup>
import { computed, onMounted, ref, getCurrentInstance } from "vue";
import { getLanguage, getSafeHeight } from "@/lib/device";
import pageLoading from "@/components/common/page_loading.vue";
import { Toast } from "vant";
import Header from "@/components/common/header.vue";
import { getWithdrawalMethodAPI, deleteWithdrawalAccountAPI } from "../api.js";
import PopupRef from "@/components/common/pop_up.vue"

const root = getCurrentInstance();
const router = root.proxy.$router;
const t = (key) => {
	return root.proxy.$t(key);
};
let loading = ref(true);

let safeHeight = ref(0);
let safeArea = getSafeHeight() || 0;
safeHeight.value = (safeArea * 2) / 100;

const itemRefs = ref([]);
let editCount = ref(1);
const openEdit = () => {
	itemRefs.value.forEach((itemRef) => {
		if (itemRef) {
            if (editCount.value % 2 === 0) {
                itemRef.close();
            } else {
                itemRef.open();
            }
			
		}
	});
    editCount.value++;
};

const beforeClose = ({ position, instance }) => {
    if (position === 'outside') {
        return
    }
};

let withdraw_accounts = ref([]);
let method_configs = ref([]);
const getWithdrawalMethod = async () => {
	const res = await getWithdrawalMethodAPI();
	if (res.status === 1000) {
		method_configs.value = res.data.method_configs;
		withdraw_accounts.value = res.data.withdraw_accounts || [];
		loading.value = false;
	} else {
		Toast.fail(res.desc);
	}
};

let rightText = computed(() => {
	if (withdraw_accounts.value.length > 0) {
        if (editCount.value % 2 === 0) {
            return t("complete");
        }
		return t("edit");
	} else {
		return "";
	}
});

let detailVisible = ref(false);
let detailInfo = ref({});
const showMore = (item) => {
    detailInfo.value = item;
    detailVisible.value = true;
};

let deleteVisible = ref(false);
let deleteInfo = ref({});
const deleteMethod = async (item) => {
    deleteInfo.value = item;
    deleteVisible.value = true;
};

const confirmDelete = async () => {
    const res = await deleteWithdrawalAccountAPI({
        withdraw_account_id: deleteInfo.value.withdraw_account_id,
    });
    if (res.status === 1000) {
        await getWithdrawalMethod();
        Toast.success(t("deleteSuccess"));

        if (withdraw_accounts.value.length === 0) {
            editCount.value = 1;
        }
    } else {
        Toast.fail(res.desc);
    }
    deleteVisible.value = false;
};

const editMethod = (item) => {
	router.push({
		name: "create",
		query: {
			channel_type: item.channel_type,
			method_type: item.method_type,
			withdraw_account_id: item.withdraw_account_id,
		},
	});
};

const confirmMethod = (item) => {
	router.replace({
		name: "index",
		query: {
			...item,
		},
	});
};

const toCreateMethod = (item) => {
    // 关闭编辑状态
    if (editCount.value % 2 === 0) {
        openEdit();
    }
	router.push({
		name: "create",
		query: {
			channel_type: item.channel_type,
			method_type: item.method_type,
		},
	});
};

const back = () => {
    router.go(-1);
};
onMounted(async () => {
	await getWithdrawalMethod();
    setTimeout(() => {
        let flag = 0;
        flag = sessionStorage.getItem('edit');
        if (Number(flag) === 1) {
            editCount.value++;
            itemRefs.value.forEach((itemRef) => {
                if (itemRef) {
                    itemRef.open();
                }
            });
        }

        sessionStorage.removeItem('edit');
        
    }, 0);
    setTimeout(() => {
        window.scrollTo(0, 1);
        window.scrollTo(0, 0);
    }, 200);
});
</script>
<style lang="less" scoped>
.method {
	width: 7.5rem;
	min-height: 100vh;
	padding-top: 0.88rem;
	font-size: 0.24rem;
	color: #333;
	.title-info {
		font-weight: 500;
		font-size: 0.28rem;
		padding-left: 0.3rem;
	}
	.content {
		width: 7.5rem;
		padding: 0.3rem;
        padding-bottom: 0.5rem;
		.method-item {
			width: 6.9rem;
			// height: 1.42rem;
			border-radius: 0.2rem;
			margin-bottom: 0.3rem;
			&:nth-last-of-type(1) {
				margin-bottom: 0;
			}
			.item-info {
				width: 6.9rem;
				// height: 1.42rem;
				background: #ffffff;
				border-radius: 0.2rem;
				// margin-bottom: 0.3rem;
				padding: 0.3rem;
                position: relative;
                .item-content {
                    width: 6.3rem;
                    display: flex;
                    align-items: center;
                    position: relative;
                    align-items: center;
                    border-bottom: 0.01rem solid #ECECEC;
                    padding-bottom: 0.3rem;
                    .item-icon {
                        width: auto;
                        height: 0.8rem;
                    }
                    .item-message {
                        width: 4.22rem;
                        margin-left: 0.2rem;
                        .item-head {
                            font-weight: 600;
                            font-size: 0.26rem;
                            color: #333333;
                        }
                        .item-body {
                            width: 4.22rem;
                            .text {
                                width: 4.22rem;
                                font-weight: 600;
                                font-size: 0.22rem;
                                color: #666666;
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
                        }
                    }
                    .to-icon {
                        position: absolute;
                        right: 0.3rem;
                        top: 0.57rem;
                        width: 0.11rem;
                        height: 0.24rem;
                    }
                }
                .item-rate {
                    width: 6.3rem;
                    height: auto;
                    padding-top: 0.3rem;
                    font-weight: 400;
                    font-size: 0.18rem;
                    color: #999999;
                }
				
			}
			.right-div {
				width: 0.74rem;
				padding-left: 0.2rem;
				padding-top: 0.1rem;
				img {
					width: 0.54rem;
					height: 0.54rem;
				}
			}
		}
	}
    .flex-container {
        display: flex;
        justify-content: center;
        align-items: center;
        .detail-container {
            width: 5.9rem;
            // height: 5.58rem;
            background: #FFFFFF;
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
        .delete-container {
            width: 5.9rem;
            height: 3.74rem;
            background: #FFFFFF;
            border-radius: 0.24rem;
            padding: 0.6rem 0.5rem;
            position: relative;
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
                font-weight: 400;
                font-size: 0.26rem;
                color: #666666;
                padding: 0;
                text-align: center;
            }
            .btn-list {
                width: 4.9rem;
                display: flex;
                justify-content: space-between;
                padding: 0 0.3rem;
                position: absolute;
                top: 2.35rem;
                .btn {
                    width: 1.8rem;
                    height: 0.88rem;
                    text-align: center;
                    line-height: 0.88rem;
                    font-weight: 500;
                    font-size: 0.3rem;
                    color: #ffffff;
                    border-radius: 0.5rem;
                    &.cancel {
                        background: #EDEDED;
                        color: #666666;
                    }
                    &.confirm {
                        background: linear-gradient( 135deg, #ABF78E 0%, #00E59E 100%);
                    }
                }
            }
        }
    }
}
</style>
