<template>
	<div class="reward">
		<Header color="song">{{ $t("title") }}</Header>

		<div class="reward-list">
			<div v-for="(item, index) in rewardList" :key="index" class="reward-item">
				<div class="title">{{ $t(`top${index + 1}`) }}</div>

				<div class="list">
					<div
						v-for="(ele, inx) in item.reward_items"
						:key="inx"
						class="list-item"
					>
						<div class="img-div">
							<img :src="ele.icon" alt="" />
							<div v-if="ele.validity_date" class="img-time">
								{{ ele.validity_date }}
							</div>
						</div>
						<p v-if="ele.diamond_worth" class="gift-value no-wrap">
							<img
								src="https://yaame-static.yaame.io/admin/c4b82a8b5e6c5c3254987a9ec218c088.png"
								alt=""
							/>
							{{ ele.diamond_worth }}
						</p>
                        <p v-else-if="ele.amount" class="gift-value no-wrap">
							<img
								src="https://yaame-static.yaame.io/admin/c4b82a8b5e6c5c3254987a9ec218c088.png"
								alt=""
							/>
							{{ ele.amount }}
						</p>
                        <p v-else class="gift-value no-wrap">
							{{ ele.gift_name }}
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import Header from "@/components/common/header.vue";
import { getPrizeListApi } from "../api";
import { ref, onMounted, getCurrentInstance } from "vue";
const root = getCurrentInstance();

const t = (val) => {
	return root.proxy.$i18n.t(val);
};
let rewardList = ref([]);

let giftList = [
    'https://yaame-static.yaame.io/admin/10c3a5b76ec35ad97fe6318f46b0e479.png',
    'https://yaame-static.yaame.io/admin/57824690c18b87c2ecd2c7551c42c111.png',
    'https://yaame-static.yaame.io/admin/ddec872e6094d32491fda828b0460905.png'
]
const getPrizeList = async () => {
	const res = await getPrizeListApi();
	if (res.status === 1000) {
        // 删除res.data.reward_gift_items中每一项目的前三个元素，并替换另一个元素进去
        res.data.reward_gift_items.forEach((item, index) => {
            item.reward_items.splice(0, 3, {
                icon: giftList[index],
                validity_date: root.proxy.$t('{n}days', { n: 30 }),
            });
        });

		rewardList.value = res.data.reward_gift_items;
	}
};

onMounted(() => {
	getPrizeList();
});
</script>

<style scoped lang="less">
.reward {
	width: 7.5rem;
	min-height: 100vh;
	padding-top: 0.88rem;
	.reward-list {
		width: 7.34rem;
		height: 23.31rem;
		background-repeat: no-repeat;
		background-size: contain;
		margin-left: 0.08rem;
		background-image: url(https://yaame-static.yaame.io/admin/3ee508adfacbd295aba70c61399182b3.png);
		padding-top: 0.99rem;
		padding-left: 0.23rem;
		.reward-item {
			width: 6.88rem;
			height: 7.18rem;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/c2e2da62179997bd35f2a445b4f4cd22.png);
			margin-bottom: 0.23rem;
			padding-top: 0.45rem;
			.title {
				width: 6.88rem;
				font-size: 0.32rem;
				color: #ffe7ae;
				text-align: center;
			}
			.list {
				width: 6.88rem;
				height: 6.28rem;
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
				padding: 0.5rem 0.8rem 0.1rem;
				.list-item {
					width: 2.2rem;
					height: 2.84rem;
					.img-div {
						width: 2.2rem;
						height: 2.2rem;
						background: #5a14c4;
						border-radius: 0.16rem;
						border: 0.01rem solid #fbe391;
						display: flex;
						justify-content: center;
						align-items: center;
						position: relative;
						img {
							width: 1.58rem;
							height: 1.58rem;
						}
						.img-time {
							display: inline-block;
							padding: 0 0.15rem;
							min-width: 0.95rem;
							text-align: center;
							line-height: 0.34rem;
							height: 0.34rem;
							background: #d328fb;
							border-radius: 0 0.15rem 0 0.13rem;
							position: absolute;
							top: 0;
							right: 0;
							font-size: 0.24rem;
							color: #ffffff;
						}
					}
					.gift-value {
						width: 2.2rem;
						font-size: 0.26rem;
						color: #ffffff;
                        text-align: center;
                        margin-top: 0.12rem;
						img {
							width: 0.22rem;
							height: 0.22rem;
							vertical-align: middle;
						}
					}
				}
			}
		}
	}
}
</style>
