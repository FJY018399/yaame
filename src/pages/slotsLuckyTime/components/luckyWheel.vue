<template>
	<div class="lucky-wheel">
		<!--外框-->
		<div class="frame"></div>
		<!--底座-->
		<div class="foundation">
			<!--转盘-->
			<div class="corona">
				<div
					v-for="(item, index) in giftList"
					:class="['corona-item', 'item' + index]"
				>
					<img class="item-icon" :src="item.reward_icon" alt="" />
					<div class="item-name">{{ item.worth_diamonds }}</div>
				</div>
			</div>
			<!--中心-->
			<div
				class="centre"
				:style="{ transform: `rotate(${rotation}deg)` }"
			></div>
			<!--开启抽奖-->
			<div :class="['open', isRotating && 'disabled']" @click="postPolLottery">
				<span>{{ $t("startLottery") }}</span>
				<p>
					<img
						v-show="!isRotating"
						src="https://yaame-static.yaame.io/admin/2da18d269832b0f7d4da64da34a14082.png"
						alt=""
					/>
					<img
						v-show="isRotating"
						src="https://yaame-static.yaame.io/admin/346765dbe5ad304254728f1a323821c7.png"
						alt=""
					/>
					*{{ userDiamonds }}
				</p>
			</div>
			<!--开启自动抽奖-->
			<div class="open-voluntarily" @click="openAward">
				<span>{{ circle ? "ON" : "" }}</span>
				<span>{{ circle ? "" : "OFF" }}</span>
				<div
					class="circle"
					:style="{ left: circle ? '.66rem' : '.12rem' }"
				></div>
				<div class="autoUntilNoLotteryTickets" :class="locale === 'id' || locale === 'ar' || locale === 'en' ? 'autoUntilNoLotteryTickets-width' : ''">
					{{ $t("autoUntilNoLotteryTickets") }}
				</div>
			</div>
			<!--说明-->
			<div class="explain">
				<span>{{ $t("howToGetLotteryTickets") }}</span>
				<p>{{ $t("howToGetLotteryTickets1") }}</p>
				<p>{{ $t("howToGetLotteryTickets2") }}</p>
			</div>
		</div>
		<!--左右闪烁-->

		<div v-show="gameToggle" class="flicker flicker-left"></div>
		<div v-show="!gameToggle" class="flicker flicker-left-an"></div>
		<div v-show="gameToggle" class="flicker flicker-right"></div>
		<div v-show="!gameToggle" class="flicker flicker-right-an"></div>

		<img
			v-show="!gameToggle"
			class="light-icon"
			src="https://yaame-static.yaame.io/admin/11acd22fb10a281d80ff0e8e2ba01e26.png"
			alt=""
		/>
		<img
			v-show="gameToggle"
			class="light-icon"
			src="https://yaame-static.yaame.io/admin/33d69faddf1450e24d2b97721d22c26d.png"
			alt=""
		/>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getLotteryDataApi, getTicketDataApi, postPolLotteryApi } from "../api";
import { getLanguage } from "@/lib/device"
import { Toast } from "vant";
// 获取国家
let locale = ref(getLanguage() || "en");
const emits = defineEmits(["result", "close"]);
// 控制自动抽奖动画
const circle = ref(false);
let numRotations = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5];
// 开启自动抽奖
const openAward = () => {
	circle.value = !circle.value;
};

let giftList = ref([]);
let userDiamonds = ref(0);
const getLotteryData = async () => {
	try {
		let res = await getLotteryDataApi();
		if (res.status === 1000) {
			console.log(res.data);
			giftList.value =
				res.data.lottery_strategy_config.lucktime.lottery_rewards;
		}
	} catch (error) {
		console.log(error);
	}
};
const getTicket = async () => {
	try {
		const res = await getTicketDataApi();
		if (res.status !== 1000) return;
		userDiamonds.value = res.data.ticket_amount;
	} catch (err) {
		console.log(err);
	}
};

let giftDetails = ref({});
let rewardTimeOut = ref(null);
let postPolLottery = async () => {
	if (isRotating.value) {
		return;
	}
	try {
		let res = await postPolLotteryApi({
			activity_type: "SLOTS_LUCK",
			lottery_strategy_type: "lucktime",
			lottery_times: 1,
		});
		if (res.status === 1000) {
			if (res.data.lottery_rewards.length > 0) {
				giftDetails.value = res.data.lottery_rewards[0];
			}

			let targetIndex = giftList.value.findIndex(
				(item) => item.reward_flag === res.data.lottery_rewards[0].reward_flag
			);

            getTicket();

			startRotation(targetIndex);

			
		} else {
			Toast(res.desc);
		}
	} catch (error) {
		console.log(error);
	}
};

const handleRewardClose = () => {
	clearTimeout(rewardTimeOut.value);
	if (circle.value) {
		selectedGiftIndex.value = -1;
		postPolLottery();
	}
};

let gameToggle = ref(false);

let rotation = ref(0);
let isRotating = ref(false);
let selectedGiftIndex = ref(-1);
let totalRotation = 2090; // 总旋转角度（6圈）
const startRotation = (targetIndex) => {
    console.log(targetIndex, );
	if (isRotating.value) return;
	if (rotation.value !== 0) {
		rotation.value = rotation.value % 360;
		let num = Math.round(rotation.value * 10) / 10;
		let inx = numRotations.findIndex((item) => item === num);
        let diff = targetIndex - inx
        if (diff === 0) {
            totalRotation = 2080;
        } else  {
            totalRotation = 2080 + (diff * 20)
        }
	} else {
		totalRotation = 2090 + 20 * targetIndex;
	}
	isRotating.value = true;
	selectedGiftIndex.value = -1;
	rotateToGift().then(() => {
        emits("result", giftDetails.value);

        rewardTimeOut.value = setTimeout(() => {
            emits("close");
            if (circle.value) {
                if (rotation.value !== 0) {
                    rotation.value = rotation.value % 360;
                    let num = Math.round(rotation.value * 10) / 10;
                    let inx = numRotations.findIndex((item) => item === num);
                    let diff = targetIndex - inx
                    if (diff === 0) {
                        totalRotation = 2080;
                    } else  {
                        totalRotation = 2080 + (diff * 20)
                    }
                } else {
                    totalRotation = 2090 + 20 * targetIndex;
                }
                selectedGiftIndex.value = -1;
                postPolLottery();
            }
        }, 4000);
    });
	// 总计6s 每0.3s切换一次gameToggle的值
	let count = 0;
	let timer = setInterval(() => {
		count++;
		gameToggle.value = !gameToggle.value;
		if (count >= 20) {
			clearInterval(timer);
			gameToggle.value = false;
		}
	}, 300);
};
const rotateToGift = () => {
    return new Promise((resolve, reject) => {
        const accelerationDuration = 1500; // 加速时间 1.5 秒
        const constantSpeedDuration = 3000; // 匀速时间 3 秒
        const decelerationDuration = 1500; // 减速时间 1.5 秒

        const totalDuration =
            accelerationDuration + constantSpeedDuration + decelerationDuration;

        let currentSpeed = 0;
        let currentDuration = 0;
        const interval = 20; // 每隔 20ms 更新一次角度

        const rotateInterval = setInterval(() => {
            if (currentDuration < accelerationDuration) {
                // 加速阶段
                currentSpeed =
                    (currentDuration / accelerationDuration) * (totalRotation / 2);
            } else if (currentDuration < accelerationDuration + constantSpeedDuration) {
                // 匀速阶段
                currentSpeed = totalRotation / 2;
            } else if (currentDuration < totalDuration) {
                // 减速阶段
                const remainingDuration =
                    totalDuration - (accelerationDuration + constantSpeedDuration);
                currentSpeed =
                    ((remainingDuration -
                        (currentDuration - accelerationDuration - constantSpeedDuration)) /
                        remainingDuration) *
                    (totalRotation / 2);
            }

            rotation.value += currentSpeed * (interval / 1000);
            currentDuration += interval;

            if (currentDuration >= totalDuration) {
                // 结束动画
                clearInterval(rotateInterval);
                isRotating.value = false;
                // 完成 Promise
                resolve();
            }
        }, interval);
    });
};

defineExpose({
	handleRewardClose,
});
onMounted(() => {
	// 获取抽奖数据
	getLotteryData();
	// 获取票数
	getTicket();
});
</script>

<style lang="less" scoped>
.lucky-wheel {
	position: absolute;
	width: 100%;
	top: 6.15rem;
	background: url("https://yaame-static.yaame.io/admin/cf142413292d0f44d065555f4b4bb010.png")
		no-repeat;
	background-size: contain;
	// 外框
	.frame {
		position: absolute;
		top: 1.06rem;
		left: 50%;
		width: 6.31rem;
		height: 4.08rem;
		transform: translateX(-50%);
		background: url("https://yaame-static.yaame.io/admin/18d9918bea2ecc13468ea8d9204b455a.png")
			no-repeat;
		background-size: contain;
		z-index: 2;
	}
	//底座
	.foundation {
		position: relative;
		width: 100%;
		height: 12.47rem;
		margin-top: 1.82rem;
		background: url("https://yaame-static.yaame.io/admin/598e1bd044098c3538c63cc79e6d5afa.png")
			no-repeat;
		background-size: contain;
		z-index: 1;
		// 转盘
		.corona {
			position: absolute;
			top: 0.3rem;
			left: 0.93rem;
			width: 5.64rem;
			height: 5.6rem;
			background: url("https://yaame-static.yaame.io/admin/1567dbc438d3ee6e19029a9ac3bea5d0.png")
				no-repeat;
			background-size: contain;
			font-size: 0.22rem;
			color: #fffefc;
			// 转盘上旋转动画

			.corona-item {
				position: absolute;
				width: 0.94rem;
				height: 0.94rem;
				border-radius: 50%;
				background-color: #8007b8;
				border: 0.01rem solid #ffd658;
				.item-icon {
					width: 0.6rem;
					height: 0.6rem;
					position: absolute;
					left: 0.17rem;
					top: 0.14rem;
				}
				.item-name {
					position: absolute;
					left: 0;
					top: 0.8rem;
					width: 0.94rem;
					text-align: center;
				}
				&.item0 {
					top: 0.59rem;
					left: 3.08rem;
				}
				&.item1 {
					top: 1.61rem;
					left: 4.12rem;
				}
				&.item2 {
					top: 2.98rem;
					left: 4.12rem;
				}
				&.item3 {
					top: 3.95rem;
					left: 3.08rem;
				}
				&.item4 {
					top: 3.95rem;
					left: 1.76rem;
				}
				&.item5 {
					top: 2.98rem;
					left: 0.74rem;
				}
				&.item6 {
					top: 1.61rem;
					left: 0.74rem;
				}
				&.item7 {
					top: 0.59rem;
					left: 1.79rem;
				}
			}
		}
		// 中心
		.centre {
			position: absolute;
			top: 2.2rem;
			left: 2.88rem;
			width: 1.75rem;
			height: 1.75rem;
			background: url("https://yaame-static.yaame.io/admin/c0c45217348ef5f6276aff931bda341e.png")
				no-repeat;
			background-size: contain;
			&::after {
				content: "";
				position: absolute;
				background-image: url(https://yaame-static.yaame.io/admin/a6e2baf98d17b6a43262abc83a8232bf.png);
				background-size: contain;
				background-repeat: no-repeat;
				width: 0.47rem;
				height: 0.75rem;
				left: 0.64rem;
				top: -0.32rem;
			}
		}
		//开始抽奖
		.open {
			position: absolute;
			top: 7.8rem;
			left: 2.09rem;
			width: 3.1rem;
			height: 1.32rem;
			background: url("https://yaame-static.yaame.io/admin/92380b30a7cd3f76d05b6dc44f31d2e9.png")
				no-repeat;
			background-size: contain;
			&.disabled {
				background-image: url(https://yaame-static.yaame.io/admin/d71067120470b7c5a941f8115ee5de44.png);
				span {
					color: #ffffff;
				}
			}
			span {
				position: absolute;
				top: 0.36rem;
				left: 50%;
				min-width: 1.1rem;
				height: 0.26rem;
        line-height: .26rem;
				transform: translateX(-50%);
				font-size: 0.26rem;
				color: #5d03bc;
        text-align: center;
				font-weight: normal;
        white-space: normal;
			}
			p {
				position: absolute;
				top: 0.65rem;
				left: 50%;
				display: flex;
				justify-content: center;
				align-items: center;
				transform: translateX(-50%);
				font-size: 0.2rem;
				color: #ffffff;
				img {
					width: 0.51rem;
					height: 0.23rem;
				}
			}
		}
		//开启自动抽奖
		.open-voluntarily {
			position: absolute;
			display: flex;
			top: 7.8rem;
			right: 0.48rem;
			width: 1.2rem;
			height: 0.63rem;
			justify-content: space-around;
			background: url("https://yaame-static.yaame.io/admin/a406f7e0c8a0f12d229f5f83a309d76a.png")
				no-repeat;
			background-size: contain;
			.circle {
				position: absolute;
				top: 0.06rem;
				left: 0.12rem; // 66
				width: 0.43rem;
				height: 0.43rem;
				background: url("https://yaame-static.yaame.io/admin/b5769fd990a8d6ac48788d4954d2602c.png")
					no-repeat;
				background-size: contain;
				transition-duration: 0.3s;
			}
			span {
				font-weight: normal;
				font-size: 0.2rem;
				color: #ffffff;
				line-height: 0.5rem;
				transition-duration: 0.3s;
			}
			.autoUntilNoLotteryTickets {
				position: absolute;
				top: 0.6rem;
        //width: 1.6rem;
        //left: -0.2rem;
				width: 100%;
				//left: 10%;
				font-weight: normal;
				font-size: 0.2rem;
				color: #ffffff;
        text-align: center;
			}
      .autoUntilNoLotteryTickets-width {
        width: 1.6rem;
      }
		}
		//说明
		.explain {
			position: absolute;
			display: flex;
			bottom: 0.32rem;
			left: 50%;
			width: 6.24rem;
			height: 2.36rem;
			padding-left: 0.55rem;
			flex-direction: column;
			justify-content: space-evenly;
			transform: translateX(-50%);
			background: #5b038a;
			border-radius: 0.14rem;
			border: 0.01rem solid #b33bf1;
			span {
				font-size: 0.26rem;
				color: #ffffff;
			}
			p {
				font-size: 0.24rem;
				color: #ffffff;
			}
		}
	}
	//闪烁公共样式
	.flicker {
		position: absolute;
		top: 4.29rem;
		width: 1.32rem;
		height: 1.21rem;
		background-repeat: no-repeat;
		background-size: contain;
	}
	.flicker-left {
		left: 0.08rem;
		background-image: url("https://yaame-static.yaame.io/admin/184d7e064f7737f0277bc548658e016b.png");
	}
	.flicker-right {
		right: 0.08rem;
		background-image: url("https://yaame-static.yaame.io/admin/b781e5b85047bea3af0605aad610a96b.png");
	}
	.flicker-left-an {
		left: 0.08rem;
		background-image: url("https://yaame-static.yaame.io/admin/8f14f51bd470579868d5839fb14369e2.png");
	}
	.flicker-right-an {
		right: 0.08rem;
		background-image: url("https://yaame-static.yaame.io/admin/ec03f72be4c375bf9d00d9ba92634369.png");
	}

	.light-icon {
		width: 4.58rem;
		height: 0.48rem;
		position: absolute;
		left: 1.41rem;
		top: 8.5rem;
		z-index: 1;
	}
}
</style>
