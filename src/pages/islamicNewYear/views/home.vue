<!--
 * @Author: Elk
 * @Date: 2024-06-20 16:34:48
 * @FilePath: /yaame-h5/src/pages/islamicNewYear/views/home.vue
 * @Description: 
-->
<template>
	<div
		:style="{
			backgroundImage: `url(${bgImgList[language]})`,
			paddingBottom: tabActive === 'rank' ? '0' : '0.3rem',
		}"
		class="main"
	>
		<Header :custom_back="true" @onCustomBack="back" color="white">{{
			$t("islamicNewYear")
		}}</Header>
		<pageLoading v-if="loading"></pageLoading>

		<div class="rule-icon" @click="routerToReward">
			{{ $t("ruleAndReward") }}
		</div>
		<!-- <div style="top: 4.38rem" class="rule-icon" @click="rewardShow = true">
			{{ $t("reward") }}
		</div> -->

		<div class="time-container">
			<div class="day-left">{{ timeInfo.dayLeft }}</div>
			<div class="day-right">{{ timeInfo.dayRight }}</div>
			<div class="hour">{{ timeInfo.hours }}</div>
			<div class="minute">{{ timeInfo.minutes }}</div>
			<div class="second">{{ timeInfo.seconds }}</div>
		</div>

		<div class="info-container">
			{{ $t("activityDesc") }}
		</div>

		<div class="event-gifts">
			<div class="header">{{ $t("activityGift") }}</div>
			<div class="content">
				<div
					v-for="(item, index) in evet_gift_list"
					:key="index"
					class="gift-item"
				>
					<img class="gift-icon" :src="item.icon" alt="" />
					<p class="gift-name">{{ item.gift_name }}</p>
					<p class="gift-value">
						<img
							src="https://yaame-static.yaame.io/admin/1e59670e1db05c345c3228e011746511.png"
							alt=""
						/>
						{{ item.diamond_worth }}
					</p>
				</div>
			</div>
		</div>

		<div class="tab-container">
			<div
				v-for="(item, index) in tabList"
				:key="index"
				:class="['tab-item', tabActive === item.key ? 'active' : '']"
				@click="handleTabChange(item.key)"
			>
				<img
					:src="
						tabActive === item.key
							? tabImgList[language][tabActive].active
							: tabImgList[language][item.key].default
					"
					alt=""
				/>
			</div>
		</div>

		<div class="content">
            <router-view></router-view>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, computed } from "vue";
import { getLanguage, getRegionId } from "@/lib/device";
import pageLoading from "@/components/common/page_loading.vue";
import { burialPointFun, getQueryString } from "@/lib/utils";
import Header from "@/components/common/header";
import { Toast } from "vant";
import { getHomeInfoAPI } from "../api";
import popup from "@/components/common/pop_up";
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
const router = root.proxy.$router;
const route = root.proxy.$route;

let bgImgList = ref({
	"zh-cn":
		"https://yaame-static.yaame.io/admin/84c6719426a42f40d0612a7ebb0bb850.png",
	"zh-tw":
		"https://yaame-static.yaame.io/admin/01ca5ae1fbeebc911729e6199c37c238.png",
	en: "https://yaame-static.yaame.io/admin/4e4e29a0110e362f697c848f2e47d438.png",
	id: "https://yaame-static.yaame.io/admin/33dbb4bf5149310eaffe6eedbc01e0a5.png",
	ar: "https://yaame-static.yaame.io/admin/e21d8d36d2beef5739c63404b9a075de.png",
});

let timeInfo = ref({
	dayLeft: 0,
	dayRight: "D",
	hours: "00",
	minutes: "00",
	seconds: "00",
});
let pageInterval = ref(null);
const getCountdown = (time) => {
	// 获取当前时间
	const now = new Date();

	// 设置目标时间
	const target = new Date(time);

	// 计算剩余时间
	const timeDiff = target.getTime() - now.getTime();

	// 确保目标日期在未来
	if (timeDiff <= 0) {
		timeInfo.value = {
			dayLeft: "0",
			dayRight: "D",
			hours: "00",
			minutes: "00",
			seconds: "00",
		};
		clearInterval(pageInterval.value);
		return;
	}

	// 将时间差转换为自然时间单位
	let days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
	let hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	let minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
	let seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

	// 计算倒计时天数的十位数和个位数
	let dayLeft = Math.floor(days / 10);
	let dayRight = days % 10;

	// 天数不足10，设置个位数为"D"
	if (days < 10) {
		dayLeft = dayRight;
		dayRight = "D";
	}

	// 时、分、秒不足10，前面补0
	hours = hours < 10 ? "0" + hours : hours;
	minutes = minutes < 10 ? "0" + minutes : minutes;
	seconds = seconds < 10 ? "0" + seconds : seconds;

	timeInfo.value = { dayLeft, dayRight, hours, minutes, seconds };
};

let loading = ref(true);

let tabList = ref([
	{
		key: "index",
	},
	{
		key: "progress",
	},
	{
		key: "rank",
	},
]);

let tabActive = ref("index");
const handleTabChange = (key) => {
	if (key === tabActive.value) {
		return;
	}

	tabActive.value = key;

    burialPointFun({
        event_name: "page_btn_click",
        cid: -1000,
        md: 3,
        args_name: "page_btn_click",
        args: {
            type: 'tab_click'
        },
    });

	router.push({ name: key });
};
const tabImgList = ref({
	"zh-cn": {
		index: {
			default:
				"https://yaame-static.yaame.io/admin/4cba760d7d50c796a2ff4baa763a03f8.png",
			active:
				"https://yaame-static.yaame.io/admin/79aadfa7b4de185d1e88df54cb4b7cfe.png",
		},
		progress: {
			default:
				"https://yaame-static.yaame.io/admin/5aec2b054fa6dc1cc06aa30cdd61c181.png",
			active:
				"https://yaame-static.yaame.io/admin/86eca480fd4f0864f047aa905a5bc638.png",
		},
		rank: {
			default:
				"https://yaame-static.yaame.io/admin/d335b7f320df700f8ea52270274db91e.png",
			active:
				"https://yaame-static.yaame.io/admin/a29f2babf225773c5de26d7ced0c594e.png",
		},
	},
	"zh-tw": {
		index: {
			default:
				"https://yaame-static.yaame.io/admin/0a780a6cc5a2ed43c5e8055d8301d71f.png",
			active:
				"https://yaame-static.yaame.io/admin/b75307d644c2ed4d429d0ad4b9bb16c0.png",
		},
		progress: {
			default:
				"https://yaame-static.yaame.io/admin/5e42ca15c74a46d02f976feff78fd814.png",
			active:
				"https://yaame-static.yaame.io/admin/421358f43dd8bc8320b1d3db7d601478.png",
		},
		rank: {
			default:
				"https://yaame-static.yaame.io/admin/8d10129c1a67b4611706b1f60884cf7d.png",
			active:
				"https://yaame-static.yaame.io/admin/013eb19797b26e916be9839edfa87a43.png",
		},
	},
	en: {
		index: {
			default:
				"https://yaame-static.yaame.io/admin/bb9e087d39b8ac1d39195f5a4c54c850.png",
			active:
				"https://yaame-static.yaame.io/admin/620f85d2d005859a143ea05defd3474f.png",
		},
		progress: {
			default:
				"https://yaame-static.yaame.io/admin/28c56c81244bc842793485f1bbb93c17.png",
			active:
				"https://yaame-static.yaame.io/admin/6024cef1309dfd3ad9d345fefff8f465.png",
		},
		rank: {
			default:
				"https://yaame-static.yaame.io/admin/fd44b6135d64f93c371aafc2aa3da799.png",
			active:
				"https://yaame-static.yaame.io/admin/4f200b7b19e03e34080bbbe02193bade.png",
		},
	},
	id: {
		index: {
			default:
				"https://yaame-static.yaame.io/admin/85f5a449761e3f15050f86b97e8373a7.png",
			active:
				"https://yaame-static.yaame.io/admin/50c0cb3a02897447955996b23bfbf887.png",
		},
		progress: {
			default:
				"https://yaame-static.yaame.io/admin/4807d6a680de0b1eb3f0cc607128c8cb.png",
			active:
				"https://yaame-static.yaame.io/admin/1ddeebfcd3dedfad8c540eb2b8075ab2.png",
		},
		rank: {
			default:
				"https://yaame-static.yaame.io/admin/90c5fb2b263064acded07d7c7d9febbd.png",
			active:
				"https://yaame-static.yaame.io/admin/0c506921324973b4cda0490768227931.png",
		},
	},
	ar: {
		index: {
			default:
				"https://yaame-static.yaame.io/admin/74dca7f20b25c582b7080fbe146775c1.png",
			active:
				"https://yaame-static.yaame.io/admin/82c68a52ee120c516d2a3d6fad50e65c.png",
		},
		progress: {
			default:
				"https://yaame-static.yaame.io/admin/afda3749c18afb163149186b74fcf557.png",
			active:
				"https://yaame-static.yaame.io/admin/3c7a4a50e2474009a21862a01011a3c1.png",
		},
		rank: {
			default:
				"https://yaame-static.yaame.io/admin/1d9ae56b9ab62d7921a779d08563caba.png",
			active:
				"https://yaame-static.yaame.io/admin/0dd8cef24df5c2495c8382357bd6a488.png",
		},
	},
});

const regionId = ref("SOUTHEAST_ASIA");
let evet_gift_list = ref([]);
let reward_pool_list = ref([]);
const getHomeInfo = async () => {
	const res = await getHomeInfoAPI();
	loading.value = false;
	if (res.status === 1000) {
		evet_gift_list.value = res.data.evet_gift_list;
		reward_pool_list.value = res.data.reward_pool_list;
		regionId.value = res.data.region_id;
	} else {
		Toast(res.desc);
	}
};

const routerToReward = () => {
    burialPointFun({
        event_name: "page_btn_click",
        cid: -1000,
        md: 3,
        args_name: "page_btn_click",
        args: {
            type: 'rules_rewards'
        },
    });

	router.push({ name: "reward" });
};

const back = () => {
	location.href = "wlyaame://webview/pop";
};

onMounted(() => {
	const time = "2024-07-13T00:00:00Z";
	// const time = "2024-07-13 00:08:00";
	getCountdown(time);
	pageInterval.value = setInterval(() => {
		getCountdown(time);
	}, 1000);

	getHomeInfo();

    burialPointFun({
        event_name: "event_page_view",
        cid: -1000,
        md: 1,
        args_name: "event_page_view",
        args: {
            from: getQueryString("fromType") || 'home_banner',
        },
    });

    // 反选tabActive
    if (route.name === "progress") {
        tabActive.value = "progress";
    } else if (route.name === "rank") {
        tabActive.value = "rank";
    } else {
        tabActive.value = "index";
    }
});
</script>

<style lang="less" scoped>
.main {
	width: 7.5rem;
	min-height: 100vh;
	background-size: contain;
	background-repeat: no-repeat;
	padding-top: 4.42rem;
	font-size: 0.24rem;
	color: #333333;
	padding-bottom: 0.3rem;
	.rule-icon {
		width: 1.79rem;
		height: 0.68rem;
		background-size: contain;
		background-repeat: no-repeat;
		background-image: url(https://yaame-static.yaame.io/admin/d73e9045c5feca89ad12b664c3bb2a27.png);
		position: fixed;
		right: 0;
		top: 3.38rem;
		text-align: center;
		line-height: 0.68rem;
		font-weight: 400;
		font-size: 0.22rem;
		color: #ffea83;
		z-index: 3;
	}
	.time-container {
		width: 7.5rem;
		position: relative;
		height: 0.72rem;
		div {
			text-align: center;
			line-height: 0.72rem;
			font-weight: normal;
			font-size: 0.26rem;
			color: #ffea83;
			position: absolute;
			top: 0;
			height: 0.72rem;
			width: 0.72rem;
		}
		.day-left {
			left: 1.57rem;
		}
		.day-right {
			left: 2.48rem;
		}
		.hour {
			left: 3.4rem;
		}
		.minute {
			left: 4.3rem;
		}
		.second {
			left: 5.2rem;
		}
	}
	.info-container {
		width: 7.5rem;
		padding: 0 0.62rem;
		font-weight: 400;
		font-size: 0.24rem;
		color: #ffffff;
		margin-top: 1.22rem;
	}
	.event-gifts {
		width: 7.08rem;
		height: 5.67rem;
		background-size: contain;
		background-repeat: no-repeat;
		background-image: url("https://yaame-static.yaame.io/admin/75db2dd57d57c821dcd50f49d7183161.png");
		margin: 0 auto;
		margin-top: 0.3rem;
		padding-top: 0.2rem;
		.header {
			font-weight: normal;
			font-size: 0.3rem;
			color: #ffea83;
			text-align: center;
            font-weight: 600;
		}
		.content {
			width: 7.08rem;
			padding: 0.4rem 0.48rem 0 0.48rem;
			display: flex;
			flex-wrap: wrap;
			.gift-item {
				width: 1.88rem;
				height: 2.03rem;
				margin-right: 0.23rem;
				margin-bottom: 0.07rem;
				background-size: contain;
				background-repeat: no-repeat;
				background-image: url(https://yaame-static.yaame.io/admin/0411dc753a39a5f9f6f30c4b8a5ba864.png);
				background-position: 0 0.37rem;
				display: flex;
				flex-wrap: wrap;
				justify-content: center;
				&:nth-of-type(3n) {
					margin-right: 0;
				}
				.gift-icon {
					width: 1.2rem;
					height: 1.2rem;
				}
				.gift-name {
					width: 1.88rem;
					font-weight: 600;
					font-size: 0.24rem;
                    line-height: 0.24rem;
					color: #ffffff;
					text-align: center;
					margin-top: 0.18rem;
				}
				.gift-value {
					width: 1.88rem;
					font-weight: 600;
					font-size: 0.26rem;
					color: #ffffff;
					text-align: center;
					margin-top: -0.08rem;
					img {
						position: relative;
						width: 0.26rem;
						height: 0.22rem;
						vertical-align: middle;
						bottom: 0.02rem;
					}
				}
			}
		}
	}
	.tab-container {
		width: 7.5rem;
		height: 1.04rem;
		display: flex;
		margin-top: 0.16rem;
		justify-content: space-between;
		align-items: flex-end;
		padding: 0 0.18rem;
		.tab-item {
			width: 2.26rem;
			height: 0.9rem;
			background-size: contain;
			background-repeat: no-repeat;
            position: relative;
			&.active {
				width: 2.24rem;
				height: 1.04rem;
				img {
					width: 2.24rem;
					height: auto;
				}
			}
			img {
				width: 2.26rem;
				height: auto;
                position: absolute;
                bottom: 0;
                left: 0;
			}
		}
	}
}
</style>
