<!--
 * @Author: Elk
 * @Date: 2024-07-04 15:15:32
 * @FilePath: /yaame-h5/src/pages/islamicNewYear/views/rule.vue
 * @Description: 
-->
<template>
	<div class="reward" :style="{ paddingTop: safe_height + 1.08 + 'rem' }">
		<Header color="white">{{ $t("islamicNewYear") }}</Header>

		<div class="rule-container">
			<div class="popup-header">{{ $t("rule") }}</div>

			<div class="rule-content">
				<p style="margin-bottom: 0.14rem">{{ $t("rule1") }}</p>
				<p style="margin-bottom: 0.14rem">{{ $t("rule2") }}</p>
				<p>{{ $t("rule3") }}</p>
				<p>{{ $t("rule3_1") }}</p>
				<p>{{ $t("rule3_2") }}</p>
				<p style="margin-bottom: 0.14rem">{{ $t("rule3_3") }}</p>
				<p>{{ $t("rule4") }}</p>
                <p v-if="regionId === 'SOUTHEAST_ASIA' || regionId === 'PHILIPPINES'">{{ $t("rule4_1_1") }}</p>
				<p v-else>{{ $t("rule4_1") }}</p>
				
				<p style="margin-bottom: 0.14rem">{{ $t("rule4_2") }}</p>
				<div v-if="regionId === 'MIDDLE_EAST'" class="rule-table-four">
					<div class="rule-table-item">
						<div class="item">{{ $t("level") }}</div>
						<div class="item">{{ $t("group1") }}</div>
						<div class="item">{{ $t("group2") }}</div>
						<div class="item">{{ $t("group3") }}</div>
					</div>
					<div
						v-for="(item, index) in IndonesiaList"
						:key="index"
						class="rule-table-item"
					>
						<div class="item">{{ item.level }}</div>
						<div class="item">{{ item.group1 }}</div>
						<div class="item">{{ item.group2 }}</div>
						<div class="item">{{ item.group3 }}</div>
					</div>
				</div>
				<div v-else-if="regionId === 'SOUTHEAST_ASIA'" class="rule-table-three">
					<div class="rule-table-item">
						<div class="item">{{ $t("level") }}</div>
						<div class="item">{{ $t("group1") }}</div>
						<div class="item">{{ $t("group2") }}</div>
					</div>
					<div
						v-for="(item, index) in PhilippinesList"
						:key="index"
						class="rule-table-item"
					>
						<div class="item">{{ item.level }}</div>
						<div class="item">{{ item.group1 }}</div>
						<div class="item">{{ item.group2 }}</div>
					</div>
				</div>
				<div v-else-if="regionId === 'PHILIPPINES'" class="rule-table-three">
					<div class="rule-table-item">
						<div class="item">{{ $t("level") }}</div>
						<div class="item">{{ $t("group1") }}</div>
						<div class="item">{{ $t("group2") }}</div>
					</div>
					<div
						v-for="(item, index) in PhilippinesList"
						:key="index"
						class="rule-table-item"
					>
						<div class="item">{{ item.level }}</div>
						<div class="item">{{ item.group1 }}</div>
						<div class="item">{{ item.group2 }}</div>
					</div>
				</div>
				<div v-else class="rule-table-four">
					<div class="rule-table-item">
						<div class="item">{{ $t("level") }}</div>
						<div class="item">{{ $t("group1") }}</div>
						<div class="item">{{ $t("group2") }}</div>
						<div class="item">{{ $t("group3") }}</div>
					</div>
					<div
						v-for="(item, index) in IndonesiaList"
						:key="index"
						class="rule-table-item"
					>
						<div class="item">{{ item.level }}</div>
						<div class="item">{{ item.group1 }}</div>
						<div class="item">{{ item.group2 }}</div>
						<div class="item">{{ item.group3 }}</div>
					</div>
				</div>

				<p style="margin-bottom: 0.14rem">{{ $t("rule5") }}</p>
				<p style="margin-bottom: 0.14rem">{{ $t("rule6") }}</p>
				<p style="margin-bottom: 0.14rem">{{ $t("rule7") }}</p>
			</div>
		</div>

		<div style="margin-top: 0.9rem" class="rule-container">
			<div class="popup-header">{{ $t("reward") }}</div>

			<div class="rule-content">
				<div class="reward-title">
					<span>{{ $t("sendGiftReward") }}</span>
				</div>
				<p>{{ $t("sendGiftUsers") }}</p>

				<div v-if="regionId === 'MIDDLE_EAST'" class="rule-table-four">
					<div class="rule-table-item">
						<div class="item">{{ $t("rank") }}</div>
						<div class="item">lv.0-5</div>
						<div class="item">lv.6-15</div>
						<div class="item">lv.15+</div>
					</div>
					<div
						v-for="(item, index) in rewardSendFourList"
						:key="index"
						class="rule-table-item"
					>
						<div class="item">
                            {{ item.level }}</div>
						<div class="item"><img style="width: 0.22rem;" src="https://yaame-static.yaame.io/admin/4a16e3aa5f0e3641f905111a34765de0.png" alt="">{{ item.group1 }}</div>
						<div class="item"><img style="width: 0.22rem;" src="https://yaame-static.yaame.io/admin/4a16e3aa5f0e3641f905111a34765de0.png" alt="">{{ item.group2 }}</div>
						<div class="item"><img style="width: 0.22rem;" src="https://yaame-static.yaame.io/admin/4a16e3aa5f0e3641f905111a34765de0.png" alt="">{{ item.group3 }}</div>
					</div>
				</div>
				<div v-else-if="regionId === 'SOUTHEAST_ASIA'" class="rule-table-three">
					<div class="rule-table-item">
						<div class="item">{{ $t("rank") }}</div>
						<div class="item">lv.0-5</div>
						<div class="item">lv.5+</div>
					</div>
					<div
						v-for="(item, index) in rewardSendThreeList"
						:key="index"
						class="rule-table-item"
					>
						<div class="item">{{ item.level }}</div>
						<div class="item"><img style="width: 0.22rem;" src="https://yaame-static.yaame.io/admin/4a16e3aa5f0e3641f905111a34765de0.png" alt="">{{ item.group1 }}</div>
						<div class="item"><img style="width: 0.22rem;" src="https://yaame-static.yaame.io/admin/4a16e3aa5f0e3641f905111a34765de0.png" alt="">{{ item.group2 }}</div>
					</div>
				</div>
				<div v-else-if="regionId === 'PHILIPPINES'" class="rule-table-three">
					<div class="rule-table-item">
						<div class="item">{{ $t("rank") }}</div>
						<div class="item">lv.0-5</div>
						<div class="item">lv.5+</div>
					</div>
					<div
						v-for="(item, index) in rewardSendThreeList"
						:key="index"
						class="rule-table-item"
					>
						<div class="item">{{ item.level }}</div>
						<div class="item"><img style="width: 0.22rem;" src="https://yaame-static.yaame.io/admin/4a16e3aa5f0e3641f905111a34765de0.png" alt="">{{ item.group1 }}</div>
						<div class="item"><img style="width: 0.22rem;" src="https://yaame-static.yaame.io/admin/4a16e3aa5f0e3641f905111a34765de0.png" alt="">{{ item.group2 }}</div>
					</div>
				</div>
				<div v-else class="rule-table-four">
					<div class="rule-table-item">
						<div class="item">{{ $t("rank") }}</div>
						<div class="item">lv.0-5</div>
						<div class="item">lv.6-15</div>
						<div class="item">lv.15+</div>
					</div>
					<div
						v-for="(item, index) in rewardSendFourList"
						:key="index"
						class="rule-table-item"
					>
						<div class="item">{{ item.level }}</div>
						<div class="item"><img style="width: 0.22rem;" src="https://yaame-static.yaame.io/admin/4a16e3aa5f0e3641f905111a34765de0.png" alt="">{{ item.group1 }}</div>
						<div class="item"><img style="width: 0.22rem;" src="https://yaame-static.yaame.io/admin/4a16e3aa5f0e3641f905111a34765de0.png" alt="">{{ item.group2 }}</div>
						<div class="item"><img style="width: 0.22rem;" src="https://yaame-static.yaame.io/admin/4a16e3aa5f0e3641f905111a34765de0.png" alt="">{{ item.group3 }}</div>
					</div>
				</div>

				<p>{{ $t("top1Users") }}</p>

                <div v-if="regionId === 'MIDDLE_EAST'" class="rule-table-four">
					<div class="rule-table-item">
						<div class="item">{{ $t("rank") }}</div>
						<div class="item">lv.0-5</div>
						<div class="item">lv.6-15</div>
						<div class="item">lv.15+</div>
					</div>
					<div
						v-for="(item, index) in topSendGiftFour"
						:key="index"
                        style="height: 1.34rem;"
						class="rule-table-item"
					>
						<div class="item">{{ item.level }}</div>
						<div class="item"><img style="width: 0.89rem;" :src="item.group1" alt=""></div>
						<div class="item"><img style="width: 0.89rem;" :src="item.group2" alt=""></div>
						<div class="item"><img style="width: 0.89rem;" :src="item.group3" alt=""></div>
					</div>
				</div>
				<div v-else-if="regionId === 'SOUTHEAST_ASIA'" class="rule-table-three">
					<div class="rule-table-item">
						<div class="item">{{ $t("rank") }}</div>
						<div class="item">lv.0-5</div>
						<div class="item">lv.5+</div>
					</div>
					<div
						v-for="(item, index) in topSendGiftThree"
						:key="index"
						class="rule-table-item"
                        style="height: 1.34rem;"
					>
						<div class="item">{{ item.level }}</div>
						<div class="item"><img style="width: 0.89rem;" :src="item.group1" alt=""></div>
						<div class="item"><img style="width: 0.89rem;" :src="item.group2" alt=""></div>
					</div>
				</div>
				<div v-else-if="regionId === 'PHILIPPINES'" class="rule-table-three">
					<div class="rule-table-item">
						<div class="item">{{ $t("rank") }}</div>
						<div class="item">lv.0-5</div>
						<div class="item">lv.5+</div>
					</div>
					<div
						v-for="(item, index) in topSendGiftThree"
						:key="index"
						class="rule-table-item"
                        style="height: 1.34rem;"
					>
						<div class="item">{{ item.level }}</div>
						<div class="item"><img style="width: 0.89rem;" :src="item.group1" alt=""></div>
						<div class="item"><img style="width: 0.89rem;" :src="item.group2" alt=""></div>
					</div>
				</div>
				<div v-else class="rule-table-four">
					<div class="rule-table-item">
						<div class="item">{{ $t("rank") }}</div>
						<div class="item">lv.0-5</div>
						<div class="item">lv.6-15</div>
						<div class="item">lv.15+</div>
					</div>
					<div
						v-for="(item, index) in topSendGiftFour"
						:key="index"
						class="rule-table-item"
                        style="height: 1.34rem;"
					>
						<div class="item">{{ item.level }}</div>
						<div class="item"><img style="width: 0.89rem;" :src="item.group1" alt=""></div>
						<div class="item"><img style="width: 0.89rem;" :src="item.group2" alt=""></div>
						<div class="item"><img style="width: 0.89rem;" :src="item.group3" alt=""></div>
					</div>
				</div>

				<div style="margin-top: 0.5rem" class="reward-title">
					<span>{{ $t("receiveGiftReward") }}</span>
				</div>
				<p>{{ $t("receiveGiftUsers") }}</p>

				<div v-if="regionId === 'MIDDLE_EAST'" class="rule-table-four">
					<div class="rule-table-item">
						<div class="item">{{ $t("rank") }}</div>
						<div class="item">lv.0-10</div>
						<div class="item">lv.11-20</div>
						<div class="item">lv.20+</div>
					</div>
					<div
						v-for="(item, index) in rewardReceiveFourList"
						:key="index"
						class="rule-table-item"
					>
						<div class="item">{{ item.level }}</div>
						<div class="item"><img style="width: 0.22rem;" src="https://yaame-static.yaame.io/admin/4a16e3aa5f0e3641f905111a34765de0.png" alt="">{{ item.group1 }}</div>
						<div class="item"><img style="width: 0.22rem;" src="https://yaame-static.yaame.io/admin/4a16e3aa5f0e3641f905111a34765de0.png" alt="">{{ item.group2 }}</div>
						<div class="item"><img style="width: 0.22rem;" src="https://yaame-static.yaame.io/admin/4a16e3aa5f0e3641f905111a34765de0.png" alt="">{{ item.group3 }}</div>
					</div>
				</div>
				<div v-else-if="regionId === 'SOUTHEAST_ASIA'" class="rule-table-three">
					<div class="rule-table-item">
						<div class="item">{{ $t("rank") }}</div>
						<div class="item">lv.0-5</div>
						<div class="item">lv.5+</div>
					</div>
					<div
						v-for="(item, index) in rewardReceiveThreeList"
						:key="index"
						class="rule-table-item"
					>
						<div class="item">{{ item.level }}</div>
						<div class="item"><img style="width: 0.22rem;" src="https://yaame-static.yaame.io/admin/4a16e3aa5f0e3641f905111a34765de0.png" alt="">{{ item.group1 }}</div>
						<div class="item"><img style="width: 0.22rem;" src="https://yaame-static.yaame.io/admin/4a16e3aa5f0e3641f905111a34765de0.png" alt="">{{ item.group2 }}</div>
					</div>
				</div>
				<div v-else-if="regionId === 'PHILIPPINES'" class="rule-table-three">
					<div class="rule-table-item">
						<div class="item">{{ $t("rank") }}</div>
						<div class="item">lv.0-5</div>
						<div class="item">lv.5+</div>
					</div>
					<div
						v-for="(item, index) in rewardReceiveThreeList"
						:key="index"
						class="rule-table-item"
					>
						<div class="item">{{ item.level }}</div>
						<div class="item"><img style="width: 0.22rem;" src="https://yaame-static.yaame.io/admin/4a16e3aa5f0e3641f905111a34765de0.png" alt="">{{ item.group1 }}</div>
						<div class="item"><img style="width: 0.22rem;" src="https://yaame-static.yaame.io/admin/4a16e3aa5f0e3641f905111a34765de0.png" alt="">{{ item.group2 }}</div>
					</div>
				</div>
				<div v-else class="rule-table-four">
					<div class="rule-table-item">
						<div class="item">{{ $t("rank") }}</div>
						<div class="item">lv.0-10</div>
						<div class="item">lv.11-20</div>
						<div class="item">lv.20+</div>
					</div>
					<div
						v-for="(item, index) in rewardReceiveFourList"
						:key="index"
						class="rule-table-item"
					>
						<div class="item">{{ item.level }}</div>
						<div class="item"><img style="width: 0.22rem;" src="https://yaame-static.yaame.io/admin/4a16e3aa5f0e3641f905111a34765de0.png" alt="">{{ item.group1 }}</div>
						<div class="item"><img style="width: 0.22rem;" src="https://yaame-static.yaame.io/admin/4a16e3aa5f0e3641f905111a34765de0.png" alt="">{{ item.group2 }}</div>
						<div class="item"><img style="width: 0.22rem;" src="https://yaame-static.yaame.io/admin/4a16e3aa5f0e3641f905111a34765de0.png" alt="">{{ item.group3 }}</div>
					</div>
				</div>

				<p>{{ $t("top1Users") }}</p>

                <div v-if="regionId === 'MIDDLE_EAST'" class="rule-table-four">
					<div class="rule-table-item">
						<div class="item">{{ $t("rank") }}</div>
						<div class="item">lv.0-10</div>
						<div class="item">lv.11-20</div>
						<div class="item">lv.20+</div>
					</div>
					<div
						v-for="(item, index) in topReceiveGiftFour"
						:key="index"
						class="rule-table-item"
                        style="height: 1.34rem;"
					>
						<div class="item">{{ item.level }}</div>
						<div class="item"><img style="width: 0.89rem;" :src="item.group1" alt=""></div>
						<div class="item"><img style="width: 0.89rem;" :src="item.group2" alt=""></div>
						<div class="item"><img style="width: 0.89rem;" :src="item.group3" alt=""></div>
					</div>
				</div>
				<div v-else-if="regionId === 'SOUTHEAST_ASIA'" class="rule-table-three">
					<div class="rule-table-item">
						<div class="item">{{ $t("rank") }}</div>
						<div class="item">lv.0-5</div>
						<div class="item">lv.5+</div>
					</div>
					<div
						v-for="(item, index) in topReceiveGiftThree"
						:key="index"
						class="rule-table-item"
                        style="height: 1.34rem;"
					>
						<div class="item">{{ item.level }}</div>
						<div class="item"><img style="width: 0.89rem;" :src="item.group1" alt=""></div>
						<div class="item"><img style="width: 0.89rem;" :src="item.group2" alt=""></div>
					</div>
				</div>
				<div v-else-if="regionId === 'PHILIPPINES'" class="rule-table-three">
					<div class="rule-table-item">
						<div class="item">{{ $t("rank") }}</div>
						<div class="item">lv.0-5</div>
						<div class="item">lv.5+</div>
					</div>
					<div
						v-for="(item, index) in topReceiveGiftThree"
						:key="index"
						class="rule-table-item"
                        style="height: 1.34rem;"
					>
						<div class="item">{{ item.level }}</div>
						<div class="item"><img style="width: 0.89rem;" :src="item.group1" alt=""></div>
						<div class="item"><img style="width: 0.89rem;" :src="item.group2" alt=""></div>
					</div>
				</div>
				<div v-else class="rule-table-four">
					<div class="rule-table-item">
						<div class="item">{{ $t("rank") }}</div>
						<div class="item">lv.0-10</div>
						<div class="item">lv.11-20</div>
						<div class="item">lv.20+</div>
					</div>
					<div
						v-for="(item, index) in topReceiveGiftFour"
						:key="index"
						class="rule-table-item"
                        style="height: 1.34rem;"
					>
						<div class="item">{{ item.level }}</div>
						<div class="item"><img style="width: 0.89rem;" :src="item.group1" alt=""></div>
						<div class="item"><img style="width: 0.89rem;" :src="item.group2" alt=""></div>
						<div class="item"><img style="width: 0.89rem;" :src="item.group3" alt=""></div>
					</div>
				</div>
			</div>
		</div>

        <pageLoading v-if="loading"></pageLoading>
	</div>
</template>
<script setup>
import Header from "@/components/common/header";
import { getSafeHeight } from "@/lib/device.js";
import { ref, getCurrentInstance, computed, onMounted } from "vue";
import { getHomeInfoAPI } from "../api";
import pageLoading from "@/components/common/page_loading.vue";
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

const t = (key) => {
	return root.proxy.$t(key);
};
// 获取手机顶栏高度
let safe_height = ref(0);
let safe_area = getSafeHeight() || 0;
safe_height.value = (safe_area * 2) / 100;

let loading = ref(true);
const regionId = ref("PHILIPPINES");
const getHomeInfo = async () => {
	const res = await getHomeInfoAPI();
	if (res.status === 1000) {
		regionId.value = res.data.region_id;
        loading.value = false;
	}
};

const IndonesiaList = ref([
	{
		level: t("sendGift"),
		group1: "lv.0-5",
		group2: "lv.6-15",
		group3: "lv.15+",
	},
	{
		level: t("receiveGift"),
		group1: "lv.0-10",
		group2: "lv.11-20",
		group3: "lv.20+",
	},
]);

const PhilippinesList = ref([
	{
		level: t("sendGift"),
		group1: "lv.0-5",
		group2: "lv.5+",
	},
	{
		level: t("receiveGift"),
		group1: "lv.0-5",
		group2: "lv.5+",
	},
]);

const rewardSendFourList = ref([
    {
		level: "Top 1",
		group1: "1000",
		group2: "1500",
		group3: "3000",
	},
	{
		level: "Top 2",
		group1: "200",
		group2: "500",
		group3: "2000",
	},
	{
		level: "Top 3",
		group1: "100",
		group2: "300",
		group3: "1000",
	},
]);
const rewardReceiveFourList = ref([
{
		level: "Top 1",
		group1: "500",
		group2: "1000",
		group3: "2000",
	},
	{
		level: "Top 2",
		group1: "200",
		group2: "500",
		group3: "1000",
	},
	{
		level: "Top 3",
		group1: "100",
		group2: "300",
		group3: "500",
	},
]);

const rewardSendThreeList = ref([
    {
		level: "Top 1",
		group1: "1000",
		group2: "1500",
	},
	{
		level: "Top 2",
		group1: "200",
		group2: "500",
	},
	{
		level: "Top 3",
		group1: "100",
		group2: "300",
	},
]);

const rewardReceiveThreeList = ref([
    {
		level: "Top 1",
		group1: "500",
		group2: "1000",
	},
	{
		level: "Top 2",
		group1: "200",
		group2: "500",
	},
	{
		level: "Top 3",
		group1: "100",
		group2: "300",
	},
]);


const topSendGiftFour = ref([
    {
        level: "Top 1",
        group1: "https://yaame-static.yaame.io/admin/e3361ac3cecb4a5baa3cad0716f1f972.png",
        group2: "https://yaame-static.yaame.io/admin/c656d5848845a8d4f5fb0e9fc6db3161.png",
        group3: "https://yaame-static.yaame.io/admin/59770f7bd6679368a0908ac869de4055.png",
    },
]);

const topReceiveGiftFour = ref([
    {
        level: "Top 1",
        group1: "https://yaame-static.yaame.io/admin/4fe9cf27848700f167c9de22ec085fd8.png",
        group2: "https://yaame-static.yaame.io/admin/80965002a16edab03ae5b927ac10e92e.png",
        group3: "https://yaame-static.yaame.io/admin/e63614d66e69fdae0263147e76f04fcf.png",
    },
]);

const topSendGiftThree = ref([
    {
        level: "Top 1",
        group1: "https://yaame-static.yaame.io/admin/c656d5848845a8d4f5fb0e9fc6db3161.png",
        group2: "https://yaame-static.yaame.io/admin/59770f7bd6679368a0908ac869de4055.png",
    },
]);

const topReceiveGiftThree = ref([
    {
        level: "Top 1",
        group1: "https://yaame-static.yaame.io/admin/80965002a16edab03ae5b927ac10e92e.png",
        group2: "https://yaame-static.yaame.io/admin/e63614d66e69fdae0263147e76f04fcf.png",
    },
]);

onMounted(() => {
    getHomeInfo();
});
</script>

<style scoped lang="less">
.reward {
	padding-left: 0.25rem;
    padding-bottom: 0.4rem;
}
.rule-container {
	width: 7rem;
	background: #491a8b;
	border-radius: 0.2rem;
	border: 0.04rem solid #e6c789;
	position: relative;
	font-weight: 400;
	font-size: 0.24rem;
	color: #ffffff;
	padding: 0.65rem 0.4rem 0;
	.rule-content {
		width: 6.2rem;
	}
	.rule-table-four {
		width: 6.05rem;
		background: #3f127d;
		border-radius: 0.08rem;
		border: 0.01rem solid #a57ae3;
		font-weight: 400;
		font-size: 0.24rem;
		color: #ffffff;
		margin: 0.3rem 0;
		.rule-table-item {
			width: 6.05rem;
			display: flex;
			height: 0.6rem;
			border-bottom: 0.01rem solid #a57ae3;
			&:last-child {
				border-bottom: none;
			}
			.item {
				border-right: 0.01rem solid #a57ae3;
				width: 1.43rem;
				white-space: pre-wrap;
				text-align: center;
				line-height: 0.24rem;
				display: flex;
				align-items: center;
				justify-content: center;

				// 第一个item和最后一个item去掉右边框
				&:first-child {
					width: 1.8rem;
				}

				&:nth-last-of-type(1) {
					border-right: none;
				}

                img {
                    width: 0.89rem;
                }
			}
		}
	}
	.rule-table-three {
		width: 4.66rem;
		background: #3f127d;
		border-radius: 0.08rem;
		border: 0.01rem solid #a57ae3;
		font-weight: 400;
		font-size: 0.24rem;
		color: #ffffff;
		margin: 0.3rem auto;
		.rule-table-item {
			width: 4.66rem;
			display: flex;
			height: 0.6rem;
			border-bottom: 0.01rem solid #a57ae3;
			&:last-child {
				border-bottom: none;
			}
			.item {
				border-right: 0.01rem solid #a57ae3;
				width: 1.43rem;
				white-space: pre-wrap;
				text-align: center;
				line-height: 0.24rem;
				display: flex;
				align-items: center;
				justify-content: center;

				// 第一个item和最后一个item去掉右边框
				&:first-child {
					width: 1.8rem;
				}

				&:nth-last-of-type(1) {
					border-right: none;
				}
			}
		}
	}
}
.popup-header {
	width: 3.4rem;
	height: 0.62rem;
	text-align: center;
	line-height: 0.62rem;
	font-weight: 600;
	font-size: 0.32rem;
	color: #ffea83;
	position: absolute;
	top: -0.32rem;
	left: 50%;
	transform: translateX(-50%);
	background-size: contain;
	background-repeat: no-repeat;
	background-image: url(https://yaame-static.yaame.io/admin/d0be9b5bccf97da9f19ea331ea66018c.png);
}
.reward-title {
	width: 6.02rem;
	height: 0.34rem;
	text-align: center;
	margin-bottom: 0.4rem;
	span {
		position: relative;
		font-weight: 600;
		font-size: 0.28rem;
		color: #ffea83;
		&::before {
			content: "";
			position: absolute;
			top: 0.03rem;
			left: -1.9rem;
			width: 1.74rem;
			height: 0.34rem;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/36849c33166e8ac92bdac10fd7acffda.png);
		}
		&::after {
			content: "";
			position: absolute;
			top: 0.03rem;
			right: -1.9rem;
			width: 1.74rem;
			height: 0.34rem;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/87b1070490f734476b2b30f776c26948.png);
		}
	}
}
</style>
