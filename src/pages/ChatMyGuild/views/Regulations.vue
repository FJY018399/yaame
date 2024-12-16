<!--
 * @Author: Elk
 * @Date: 2023-07-27 11:45:59
 * @FilePath: /yaame-h5/src/pages/ChatMyGuild/views/Regulations.vue
 * @Description: Regulations
-->
<template>
	<div :style="{ paddingTop: safe_height + 1.08 + 'rem' }" class="Regulations">
		<Header :keep="true" color="blank">{{ $t('Rules') }}</Header>

        <p v-if="is_guild_owner" class="title-p">{{ $t('ruleTitle1') }}</p>
        <p v-else class="title-p">{{ $t('ruleTitle12') }}</p>
        <!-- <img :src="regulations_img_time_limit" class="info-img" alt=""> -->
        <img :src="regulations_img" class="info-img" alt="">
        <p v-if="is_guild_owner" class="title-p">{{ $t('ruleTitle2') }}</p>
        <p v-else class="title-p">{{ $t('ruleTitle13') }}</p>
        <!-- <img :src="regulations_img" class="info-img" alt=""> -->
        <img :src="regulations_img_time_limit" class="info-img" alt="">

        <div v-if="is_guild_owner">
            <p class="info-p">{{ $t('ruleTitle3') }}</p>
            <p class="info-p">{{ $t('ruleTitle10') }}</p>
            <p class="info-p">{{ $t('ruleTitle11') }}</p>
        </div>
        <div v-else>
            <p class="info-p">{{ $t('ruleTitle3') }}</p>
            <p class="info-p">{{ $t('ruleTitle4') }}</p>
            <p class="info-p">{{ $t('ruleTitle5') }}</p>
            <p class="info-p">{{ $t('ruleTitle6') }}</p>
            <p class="info-p">{{ $t('ruleTitle7') }}</p>
            <p class="info-p">{{ $t('ruleTitle8') }}</p>
            <p class="info-p">{{ $t('ruleTitle9') }}</p>
        </div>
		<!-- <div v-show="false">
            <div class="table">
                <header>
                    <div class="header-title">
                        <p>Valid days and hours 15 days and 30 hours</p>
                    </div>
                    <div class="header-list">
                        <div>Length of live broadcast</div>
                        <div>Anchor's salary(USD)</div>
                        <div>Agency share(USD)</div>
                        <div>Total</div>
                    </div>
                </header>
                <nav>
                    <div class="list-item">
                        <div>5000</div>
                        <div>$2.4</div>
                        <div>$0.4</div>
                        <div>$3</div>
                    </div>
                    <div class="list-item">
                        <div>5000</div>
                        <div>$2.4</div>
                        <div>$0.4</div>
                        <div>$3</div>
                    </div>
                    <div class="list-item">
                        <div>5000</div>
                        <div>$2.4</div>
                        <div>$0.4</div>
                        <div>$3</div>
                    </div>
                    <div class="list-item">
                        <div>5000</div>
                        <div>$2.4</div>
                        <div>$0.4</div>
                        <div>$3</div>
                    </div>
                    <div class="list-item">
                        <div>5000</div>
                        <div>$2.4</div>
                        <div>$0.4</div>
                        <div>$3</div>
                    </div>
                </nav>
            </div>

            <div class="table next">
                <header>
                    <div class="header-title">
                        <p>Valid days and hours 15 days and 30 hours</p>
                    </div>
                    <div class="header-list">
                        <div>Length of live broadcast</div>
                        <div>Anchor's salary(USD)</div>
                        <div>Agency share(USD)</div>
                        <div>Total</div>
                    </div>
                </header>
                <nav>
                    <div class="list-item">
                        <div>5000</div>
                        <div>$2.4</div>
                        <div>$0.4</div>
                        <div>$3</div>
                    </div>
                    <div class="list-item">
                        <div>5000</div>
                        <div>$2.4</div>
                        <div>$0.4</div>
                        <div>$3</div>
                    </div>
                    <div class="list-item">
                        <div>5000</div>
                        <div>$2.4</div>
                        <div>$0.4</div>
                        <div>$3</div>
                    </div>
                    <div class="list-item">
                        <div>5000</div>
                        <div>$2.4</div>
                        <div>$0.4</div>
                        <div>$3</div>
                    </div>
                    <div class="list-order">
                        <div>5000</div>
                        <div>1 USD=1666 Diamonds</div>
                    </div>
                </nav>
            </div>
        </div> -->
	</div>
</template>

<script>
import { ref, onMounted } from "vue";
import Header from "@/components/common/header.vue";
import { getSafeHeight } from "@/lib/device";
import { getIncomeConfig } from "../api";
export default {
	components: {
		Header,
	},
	setup() {
		let safe_height = ref(0);
		let regulations_img = ref('');
		let regulations_img_time_limit = ref('');
        let is_guild_owner = ref(0);
        const getData = async () => {
            try {
                const res = await getIncomeConfig()
                if (res.status === 1000) {
                    regulations_img.value = res.data.today_img_url;
                    regulations_img_time_limit.value = res.data.second_img_url;
                    is_guild_owner.value = res.data.is_guild_owner;
                }
            } catch (error) {
                throw new Error(error)
            }
        }

		onMounted(() => {
			let safe_area = getSafeHeight() || 0;
			safe_height.value = (safe_area * 2) / 100;

            getData();
		});
		return {
			safe_height,

            regulations_img,
            regulations_img_time_limit,

            is_guild_owner,
		};
	},
};
</script>
<style lang="less">
.Regulations {
    padding-bottom: 0.3rem;
}
.info-img {
    width: 6.9rem;
    height: auto;
    margin-bottom: 0.3rem;
    margin-left: 0.3rem;
}
.table {
	width: 6.9rem;
	height: 6.61rem;
	border-radius: 0.24rem;
	background-color: #fff;
	overflow: hidden;
	margin-left: 0.3rem;
	&.next {
		margin-top: 0.3rem;
		header {
			background-image: url(https://static.yaame.io/admin/aafcd5c7342cd7d64104009cc23ea944.png);
		}
	}
	header {
		width: 6.9rem;
		height: 2.97rem;
		border-radius: 0.24rem;

		background: #e9eff4;
		background-image: url(https://static.yaame.io/admin/11b3cc0a0ec3cb6eee9f0fa8a9c29da0.png);
		background-size: contain;
		background-repeat: no-repeat;
		.header-title {
			width: 6.9rem;
			height: 1.76rem;
			text-align: center;
			// line-height: 1.76rem;
			font-size: 0.34rem;
			color: #fff;
			font-weight: 600;
			padding: 0.47rem 1.71rem 0;
			white-space: wrap;
		}
		.header-list {
			width: 6.9rem;
			height: 1.21rem;
			display: flex;
			div {
				text-align: center;
				line-height: 1;
				font-size: 0.24rem;
				font-weight: 500;
				color: #333333;
				background: #e9eff4;
				display: flex;
				align-items: center;
				justify-content: center;
				line-height: 0.32rem;
				border-right: 0.01rem solid #d6dfe7;
				&:nth-child(1) {
					width: 2.09rem;
				}
				&:nth-child(2) {
					width: 1.8rem;
				}
				&:nth-child(3) {
					width: 1.8rem;
				}
				&:nth-child(4) {
					width: 1.18rem;
					border: none;
				}
			}
		}
	}
	.list-item {
		display: flex;

		height: 0.72rem;
		&:nth-child(5) {
			div {
				border-bottom: none;
			}
		}
		div {
			text-align: center;
			line-height: 1;
			font-size: 0.24rem;
			font-weight: 400;
			color: #333333;
			display: flex;
			align-items: center;
			justify-content: center;
			border-right: 0.01rem solid #d6dfe7;
			border-bottom: 0.01rem solid #d6dfe7;
			&:nth-child(1) {
				width: 2.09rem;
			}
			&:nth-child(2) {
				width: 1.8rem;
			}
			&:nth-child(3) {
				width: 1.8rem;
			}
			&:nth-child(4) {
				width: 1.18rem;
				border-right: none;
			}
		}
	}
	.list-order {
		display: flex;

		height: 0.72rem;
		div {
			text-align: center;
			line-height: 1;
			font-size: 0.24rem;
			font-weight: 500;
			color: #333333;
			display: flex;
			align-items: center;
			justify-content: center;
			line-height: 0.32rem;
			border-right: 0.01rem solid #d6dfe7;
			&:nth-child(1) {
				width: 2.09rem;
			}
			&:nth-child(2) {
				width: 4.8rem;
                border-right: none;
			}
		}
	}
}
.title-p {
    width: 6.9rem;
    margin: 0.3rem 0.3rem;
    font-weight: 500;
    font-size: 0.28rem;
    color: #333333;
}

.info-p {
    width: 6.9rem;
    margin: 0.2rem 0.3rem;
    font-weight: 400;
    font-size: 0.26rem;
    color: #666666;
}
</style>
