<template>
    <refresh class="refresh" ref="wlRefresh" @onRefresh="exchangeList">
        <div class="main">
            <!--标题-->
            <custom-header class="header" color="harvest">{{
                $t("title")
            }}</custom-header>
            <!--顶部-->
            <div class="top" :style="{ backgroundImage: `url(${headImg[locale]})` }">
                <!--规则-->
                <div class="rule-button" @click="openRule">{{ $t("rule") }}</div>
                <!-- 时间计时 -->
                <div class="time-span">
                    <div class="time">{{ days }}</div>
                    <div class="time">D</div>
                    <div class="time">{{ hours < 10 ? `0${hours}` : hours }}</div>
                    <div class="time">{{ minutes < 10 ? `0${minutes}` : minutes }}</div>
                    <div class="time">{{ seconds < 10 ? `0${seconds}` : seconds }}</div>
                </div>
            </div>
            <!--兑换-->
            <div class="exchange">
                <div class="exchange-list">
                    <!--我的苹果树-->
                    <div class="my-apple-number">
                        <img
                            src="https://yaame-static.yaame.io/admin/fbd08d3c2e19b035526fa50ad28272c9.png"
                            alt=""
                        />
                        <div class="number">X{{ myApple }}</div>
                        <div class="my-apple">{{ $t("my_current_apples") }}</div>
                        <p>{{ $t("enterRoomEffectTip") }}</p>
                    </div>
                    <!--兑换-->
                    <div
                        class="my-exchange"
                        v-for="(item, index) in awardList"
                        :key="item.id"
                    >
                        <span v-if="item.valid_days" class="award-time">{{ item.valid_days }}</span>
                        <div class="award">
                            <img :src="item.reward_icon" alt="" />

                            <p v-if="item.diamond_worth" class="award-diamonds">
                                <img
                                        src="https://yaame-static.yaame.io/admin/88a503fd1f0e1ccfea864e7eeb54936a.png"
                                        alt=""
                                    />
                                {{ item.diamond_worth }}
                            </p>
                        </div>
                        <div class="award-number">
                            <img
                                src="https://yaame-static.yaame.io/admin/5f61ba204712fb78c075f59e4321077d.png"
                                alt=""
                            />
                            {{ score(item.fruit_price) }}
                        </div>
                        <!--兑换按钮-->
                        <div
                            class="exchange-button"
                            @click="startExchange(item.reward_id, item.fruit_price)"
                        >
                            {{ $t("exchangeOpen") }}
                        </div>
                    </div>
                </div>
            </div>
            <popup class="popup" v-show="showRule" @cancel="openRule('showRule')">
                <div class="rule">
                    <div class="head">{{ $t("rule") }}</div>
                    <p>
                        <span>{{ $t("activity_time") }}</span
                        ><br />
                        {{ $t("activity_period") }}<br />
                        <span>{{ $t("activity_description") }}</span
                        ><br />
                        {{ $t("exchangeRule2") }}<br />
                        {{ $t("exchangeRule3") }}<br />
                        {{ $t("exchangeRule4") }}<br />
                        {{ $t("exchangeRule5") }}<br />
                    </p>
                </div>
                <div class="close" @click="openRule"></div>
            </popup>
        </div>
    </refresh>
</template>

<script setup>
import { getExchangeApi, postExchangeApi } from "../api";
import { getCurrentInstance, onMounted, ref } from "vue";
import popup from "@/components/common/pop_up.vue";
import customHeader from "@/components/common/header.vue";
import { Toast } from "vant";
import { getLanguage } from "@/lib/device";
import refresh from "@/components/common/refresh.vue";
const root = getCurrentInstance();
const t = (value) => {
	return root.proxy.$i18n.t(value);
};

// 获取国家
let locale = getLanguage() || "en";
// 页面头图
const headImg = ref({
	ar: "https://yaame-static.yaame.io/admin/39757a05b1b65107bf90ac7f4decfe2f.png",
	en: "https://yaame-static.yaame.io/admin/f623ad37bdc3b65912875066efb86f15.png",
	id: "https://yaame-static.yaame.io/admin/68118466a909427ab64acbe7ef17d1f7.png",
	"zh-cn":
		"https://yaame-static.yaame.io/admin/11ee2f2c14c821ca436f3b09819e06c3.png",
	"zh-tw":
		"https://yaame-static.yaame.io/admin/081e73057e0278707c422c82ffcf4848.png",
});

// 兑换列表
const awardList = ref([]);
// 我的苹果数
const myApple = ref(0);
const wlRefresh = ref(null);
const exchangeList = async () => {
	try {
		const res = await getExchangeApi();
		if (res.status !== 1000) return;
		awardList.value = res.data.exchange_rewards
			? res.data.exchange_rewards
			: [];
		myApple.value = res.data.fruit_balance;
		timeEnd.value = res.data.activity_end_time;
        setTimeout(() => {
			wlRefresh.value.isLoading = false;
		}, 500);
	} catch (err) {
		console.log(err);
	}
};

const startExchange = async (id, val) => {
	try {
		if (myApple < val) {
			Toast(t("appleNotEnough"));
			return;
		}
		const res = await postExchangeApi({ reward_id: id });
		if (res.status === 1000) {
            Toast(t("exchangeSuccess"));
            myApple.value = res.data.fruit_balance;
        } else [
            Toast(res.desc)
        ]
		
	} catch (err) {
		console.log(err);
	}
};

// 规则弹窗
const showRule = ref(false);
const openRule = () => {
	showRule.value = !showRule.value;
};

// 页面计时时间
let days = ref(0);
let hours = ref(0);
let minutes = ref(0);
let seconds = ref(0);
// 活动结束时间
const timeEnd = ref(0);
const updateTime = () => {
	const now = new Date().getTime();
	const timeDifference = timeEnd.value - now;
	if (timeDifference > 0) {
		days.value = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
		hours.value = Math.floor(
			(timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
		);
		minutes.value = Math.floor(
			(timeDifference % (1000 * 60 * 60)) / (1000 * 60)
		);
		seconds.value = Math.floor((timeDifference % (1000 * 60)) / 1000);
	} else {
		days.value = 0;
		hours.value = 0;
		minutes.value = 0;
		seconds.value = 0;
	}
};

// 定时器倒计时
let timeOut = null;
const openTiming = () => {
	timeOut = setInterval(() => {
		updateTime();
	}, 1000);
};

// 处理分数间隔
const score = (value) => {
	value += "";
	return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

onMounted(() => {
	// 获取页面数据
	exchangeList();
	// 开启倒计时
	openTiming();
});
</script>

<style lang="less" scoped>
.main {
	min-height: 100vh;
	padding-bottom: 0.7rem;
	.top {
		width: 100%;
		height: 5.84rem;
		background-repeat: no-repeat;
		background-size: contain;

		.rule-button {
			position: absolute;
			top: 3.09rem;
			right: 0;
			display: flex;
			justify-content: center;
			align-items: center;
			min-width: 1.48rem;
			height: 0.66rem;
			background: url("https://yaame-static.yaame.io/admin/646a5c4322de5ca91710b350076b7db6.png")
				no-repeat;
			background-size: 100% 100%;
			font-size: 0.28rem;
			color: #b46223;
		}
		.time-span {
			position: absolute;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			top: 4.47rem;
			width: 100%;
			.time {
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 0.24rem;
				color: #ffffff;
			}
			.time:nth-child(n) {
				width: 0.67rem;
				height: 0.67rem;
				margin-right: 0.11rem;
			}
			.time:nth-child(n + 3) {
				width: 0.76rem;
				height: 0.67rem;
				margin-right: 0.17rem;
			}
			.time:nth-child(1) {
				margin-left: 1.65rem;
			}
			.time:nth-child(2) {
				margin-right: 0.12rem;
			}
		}
	}

	.exchange {
		.exchange-list {
			position: relative;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			align-content: center;
			width: 7.18rem;
			min-height: 14.26rem;
			margin: 0.25rem auto 0;
			padding: 3.02rem 0.39rem 0.4rem 0.37rem;
			background: url("https://yaame-static.yaame.io/admin/339acfc88104d8ed7265710f592ae6d7.png")
				no-repeat;
			background-size: 100% 100%;
		}
		.my-apple-number {
			position: absolute;
			top: 0.44rem;
			left: 50%;
			width: 6.44rem;
			height: 2.43rem;
			transform: translateX(-50%);
			background: url("https://yaame-static.yaame.io/admin/837f1f949e5c6b4b4008701cc9ece249.png")
				no-repeat;
			background-size: contain;
			img {
				position: absolute;
				top: 0.33rem;
				left: 0.93rem;
				width: 1.28rem;
				height: 1.19rem;
			}
			.number {
				position: absolute;
				top: 0.6rem;
				left: 2.36rem;
				height: 0.3rem;
				line-height: 0.3rem;
				font-size: 0.3rem;
				color: #275f51;
				font-weight: 600;
			}
			.my-apple {
				position: absolute;
				top: 1.1rem;
				left: 2.36rem;
				height: 0.26rem;
				line-height: 0.26rem;
				font-size: 0.26rem;
				color: #275f51;
			}
			p {
				position: absolute;
				bottom: 0.12rem;
				left: 50%;
				width: 100%;
				height: 0.48rem;
                display: flex;
                align-items: center;
                justify-content: center;
				line-height: 0.24rem;
				transform: translateX(-50%);
				font-size: 0.24rem;
				color: #ffffff;
				text-align: center;
                padding: 0 0.2rem;
				span {
					font-weight: 600;
				}
			}
		}

		.my-exchange {
			position: relative;
			width: 2rem;
			height: 2.71rem;
			margin-bottom: 1.12rem;
			background: url("https://yaame-static.yaame.io/admin/af72664f7178672cbb8740f2e6aa54e6.png")
				no-repeat;
			background-size: contain;
			.award-time {
				display: inline-block;
				min-width: 0.88rem;
				height: 0.34rem;
				line-height: 0.34rem;
				text-align: center;
				font-weight: normal;
				font-size: 0.2rem;
				color: #ffffff;
				background: #f1b500;
				border-radius: 0.08rem;
                padding: 0 0.08rem;
                position: absolute;
                right: 0;
                top: 0;
			}
			.award {
				position: absolute;
				top: 0.28rem;
				left: 50%;
				display: flex;
				justify-content: center;
				align-items: center;
				width: 1.5rem;
				height: 1.5rem;
				transform: translateX(-50%);
				img {
					width: 1.3rem;
                    position: relative;
                    // bottom: 0.1rem;
				}
				.award-diamonds {
					position: absolute;
					width: 1.5rem;
					bottom: -0.1rem;
					text-align: center;
					font-size: 0.22rem;
					color: #ffffff;
					img {
						width: 0.26rem;
						height: 0.22rem;
						vertical-align: middle;
						position: relative;
						// bottom: -0.04rem;
					}
				}
			}

			.award-number {
				position: absolute;
				bottom: 0.38rem;
				left: 50%;
				display: flex;
				justify-content: center;
				align-items: center;
				height: 0.22rem;
				transform: translateX(-50%);
				font-size: 0.22rem;
				color: #ffffff;
				img {
					width: 0.24rem;
					height: 0.27rem;
					margin-right: 0.04rem;
				}
			}
		}

		.exchange-button {
			position: absolute;
			bottom: -0.84rem;
			left: 50%;
			display: flex;
			justify-content: center;
			align-items: center;
			width: 1.6rem;
			height: 0.6rem;
			transform: translateX(-50%);
			font-size: 0.28rem;
			color: #a35608;
			background: url("https://yaame-static.yaame.io/admin/f7a2887e841b2dfdef7e42782298fdfc.png")
				no-repeat;
			background-size: contain;
		}
	}

	.rule {
		position: relative;
		width: 6.43rem;
		height: 7.72rem;
		margin: 2.4rem auto 0;
		background: url("https://yaame-static.yaame.io/admin/e06f83e05fc62452162c2c766e0ea71e.png")
			no-repeat;
		background-size: contain;

		.head {
			position: absolute;
			top: 0.47rem;
			left: 50%;
			transform: translateX(-50%);
			font-weight: 600;
			font-size: 0.42rem;
			color: #854015;
		}

		p {
			position: absolute;
			top: 1.59rem;
			left: 50%;
			width: 5.9rem;
			height: 4.68rem;
			padding: 0 0.27rem;
			transform: translateX(-50%);
			overflow-y: auto;
			font-size: 0.26rem;
			color: #b46223;
			span {
				font-weight: 600;
			}
		}
		p::-webkit-scrollbar {
			width: 0.1rem; /* 竖直滚动条的宽度 */
			height: 0.96rem; /* 水平滚动条的高度 */
		}

		/* 滚动条的轨道 */
		p::-webkit-scrollbar-track {
			border-radius: 0.05rem; /* 圆角 */
		}

		/* 滚动条滑块 */
		p::-webkit-scrollbar-thumb {
			background: #e69552; /* 滚动条滑块的颜色 */
			border-radius: 0.05rem; /* 圆角 */
		}

		/* 滚动条滑块在悬停时 */
		p::-webkit-scrollbar-thumb:hover {
			background: #e69552; /* 悬停时滑块的颜色 */
		}
	}

	.close {
		width: 0.5rem;
		height: 0.5rem;
		margin: 0.7rem auto 0;
		background: url("https://yaame-static.yaame.io/admin/6a4e031fdcf17cc4c331feb2e67a58eb.png")
			no-repeat;
		background-size: contain;
	}
}
</style>
