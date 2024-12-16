<template>
	<div class="reward-page">
		<Header color="white" :custom_back="true" @onCustomBack="back"></Header>
		<div class="reward-container">
			<div v-for="(item, index) in list" :key="index" class="reward-item">
				<div class="reward-item-header">{{ $t(`top-${ item.rank }`) }}</div>
				<div class="reward-item-list">
					<div v-for="(ele, inx) in item.lucky_recharge_rewards" :key="inx" class="reward-list-item">
						<div class="item-icon">
							<img :src="ele.reward_icon" alt="" />
							<div v-show="ele.valid_day" class="item-time">
                                {{ ele.valid_day }}{{ $t('day') }}
                            </div>
						</div>

						<p class="item-name">{{ ele.reward_info }}</p>
						<p class="item-name">
                            <img src="https://yaame-static.yaame.io/admin/9e59da36e886d4bcb0b76df39c84b142.png" alt="">
                            {{ ele.reward_diamonds }}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup>
import { ref, getCurrentInstance, computed, onMounted } from "vue";
import Header from "../../../components/common/header.vue";
import { getRankRewardInfoAPI } from '../api';

const root = getCurrentInstance()
const router = root.proxy.$router;
let list = ref([]);
const getReward = async () => {
    const res = await getRankRewardInfoAPI();
    console.log(res);
    if (res.status === 1000) {
        list.value = res.data.lucky_recharge_rank_reward_levels;
    }
};
const back = () => {
    router.go(-1);
}
onMounted(() => {
    getReward();
})
</script>

<style lang="less" scoped>
.reward-page {
	padding-top: 1rem;
    padding-bottom: 0.3rem;
	.reward-container {
		width: 7.16rem;
		margin-left: 0.17rem;
		height: 22.58rem;
		background-size: contain;
		background-repeat: no-repeat;
		background-image: url(https://yaame-static.yaame.io/admin/d7505072c4f599c784c220c8e0675d22.png);
		padding-top: 1.06rem;
		padding-left: 0.14rem;
		.reward-item {
			width: 6.88rem;
			height: 4rem;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/2a09c81a29809777ae19131d6500c199.png);
			padding-top: 0.25rem;
            margin-bottom: 0.25rem;
			.reward-item-header {
				width: 6.88rem;
				height: 0.46rem;
				line-height: 0.46rem;
				text-align: center;
				font-weight: 600;
				font-size: 0.32rem;
				color: #ffffff;
			}
			.reward-item-list {
				width: 6.4rem;
				height: 2.68rem;
				margin-top: 0.4rem;
				margin-left: 0.24rem;
				display: flex;
				justify-content: space-between;
				.reward-list-item {
					width: 2rem;
					height: 2.68rem;
					.item-icon {
						width: 2rem;
						height: 2rem;
						background: #5a14c4;
						border-radius: 0.16rem;
						border: 0.01rem solid #fbe391;
						position: relative;
						display: flex;
						justify-content: center;
						align-items: center;
						img {
							width: 1.58rem;
							height: 1.58rem;
						}
						.item-time {
							display: inline-block;
							min-width: 0.96rem;
							height: 0.34rem;
							line-height: 0.34rem;
							text-align: center;
							background: #d328fb;
							border-radius: 0 0.15rem 0 0.13rem;
							position: absolute;
							top: 0;
							right: 0;
							font-weight: 400;
							font-size: 0.24rem;
							color: #ffffff;
						}
					}
					.item-name {
						width: 2rem;
						text-align: center;
						font-size: 0.24rem;
						color: #ffffff;
						img {
							width: 0.26rem;
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
