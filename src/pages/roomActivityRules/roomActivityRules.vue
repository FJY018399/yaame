<!--
 * @Author: Elk
 * @Date: 2023-08-21 16:19:35
 * @FilePath: /yaame-h5/src/pages/roomActivityRules/roomActivityRules.vue
 * @Description: 
-->
<template>
	<div :style="{ paddingTop: safe_height + 1.08 + 'rem' }" class="main">
		<page-loading v-if="page_loading"></page-loading>
		<Header
			style="position: fixed"
			:keep="true"
			:keepColor="false"
			color="white"
			><span>{{ $t("title") }}</span></Header
		>

		<p class="info">{{ $t("title") }}</p>

		<div
			v-for="(item, index) in reward_item_list"
			:key="index"
			:class="['top-reward', 'top-reward' + index]"
		>
			<p class="head">{{ $t(`${index + 1}st`) }}</p>
			<p style="margin-top: 0.8rem; margin-left: 0.82rem">{{ $t("title") }}</p>
			<p class="num">+{{ item.reward_item.amount }}</p>
			<img :src="item.reward_item.object_icon.default_value" alt="" />
		</div>

		<p class="info">{{ $t("rule") }}</p>

		<p class="rule-p">{{ $t("rule-1") }}</p>
		<p class="rule-p">{{ $t("rule-2") }}</p>
		<p class="rule-p">{{ $t("rule-3") }}</p>
		<p class="rule-p">{{ $t("rule-4") }}</p>
		<p class="rule-p">{{ $t("rule-5") }}</p>
		<p class="rule-p">{{ $t("rule-6") }}</p>
		<p class="rule-p">{{ $t("rule-7") }}</p>
	</div>
</template>
<script>
import request from "../../lib/request/contribution.js";
import { getSafeHeight, getAppType, getLanguage } from "../../lib/device";
import pageLoading from "../../components/common/page_loading.vue";
import Header from "../../components/common/header.vue";

export default {
	components: {
		pageLoading,
		Header,
	},
	data() {
		return {
			safe_height: 0,
			page_loading: true,

			reward_item_list: [],

			active_rule: "",
		};
	},
	computed: {
		language() {
			return getLanguage() || "en";
		},
	},
	mounted() {
		const safe_area = getSafeHeight() || 40;
		this.safe_height = (safe_area * 2) / 100;

		this.getData();
	},
	methods: {
		back() {
			location.href = "wlyaame://webview/back";
		},
		async getData() {
			let res = await request.getRoomActiveRules();
			
			if (res.status !== 1000) return;
			this.reward_item_list = res.data.reward_item_list;

			this.active_rule = res.data.active_rule;

            this.$nextTick(() => {
                this.page_loading = false;
            })
		},
	},
};
</script>
<style lang="less" scoped>
.main {
	width: 7.5rem;
	min-height: 100vh;
	background-color: #fec559;
    padding-bottom: 0.2rem;
	.page-header {
		position: sticky;
		top: 0;
		left: 0;
		z-index: 9;
		font-size: 0.32rem;
		font-weight: bold;
		display: flex;
		align-items: center;
		justify-content: center;
		color: rgba(255, 255, 255, 0.6);
		margin-bottom: 0;
		height: 1.7rem;
		font-size: 0.34rem;
		font-family: SFProDisplay-Semibold, SFProDisplay;
		font-weight: 600;
		color: #ffffff;
		.back {
			position: absolute;
			left: 0.2rem;
			width: 0.4rem;
			height: 0.4rem;
			img {
				width: 0.4rem;
				height: 0.4rem;
			}
		}
	}
	.info {
		padding-left: 0.38rem;
		font-size: 0.32rem;
		font-family: SFProDisplay-Semibold, SFProDisplay;
		font-weight: 600;
		color: #ffffff;
		opacity: 0.7;
		margin-bottom: 0.2rem;
	}
	.top-reward {
		width: 6.74rem;
		height: 3.58rem;
		margin-left: 0.38rem;
		font-size: 0.28rem;
		background-size: contain;
		background-repeat: no-repeat;
		padding-top: 0.33rem;
		margin-bottom: 0.2rem;
		position: relative;
		&.top-reward0 {
			color: #d26d36;
			background-image: url(https://yaame-static.yaame.io/admin/200a9772f2a0513c24b5d364749f4f98.png);
		}
		&.top-reward1 {
			color: #5a79b5;
			background-image: url(https://yaame-static.yaame.io/admin/c3542cad5175df352b3550056745424e.png);
		}
		&.top-reward2 {
			color: #a77933;
			background-image: url(https://yaame-static.yaame.io/admin/ce39dbd27819c2482e714d721c493e08.png);
		}
		.head {
			margin-left: 0.33rem;
		}
		.num {
			margin-left: 0.82rem;
			margin-top: 0.14rem;
			font-size: 0.72rem;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
		}
		img {
			width: 1.51rem;
			height: 1.51rem;
			position: absolute;
			top: 1.25rem;
			right: 0.66rem;
		}
	}
	.rule-p {
		padding: 0 0.33rem;
		font-size: 0.26rem;
		font-family: SFProDisplay-Regular, SFProDisplay;
		font-weight: 400;
		color: #ffffff;
		opacity: 0.7;
	}
}
</style>
