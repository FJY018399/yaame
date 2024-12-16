<!--
 * @Author: Elk
 * @Date: 2024-06-20 16:34:48
 * @FilePath: /yaame-h5/src/pages/islamicNewYear/views/index.vue
 * @Description: 
-->
<template>
	<div class="draw">
        <canvas v-show="resultFireShow" id="firework" class="firework" ref="firework"></canvas>
		<vue-danmaku
			class="scrolling"
			ref="danmaku"
			v-model="screen_list"
			randomChannel
			use-slot
			loop
			:speeds="50"
			:channels="3"
		>
			<template slot="dm" slot-scope="{ index, danmu }">
				<div class="screen-item">
					<div class="user-avatar">
						<img
							class="user-img-avatar"
							src="https://yaame-static.yaame.io/admin/a8b18c3a015a98875826760d264f8d05.png"
						/>

						<img class="user-img" :src="danmu.avatar" alt="" />
					</div>

					<i18n path="successfullyLitTheFireworks">
						<template v-slot:0>
							{{ danmu.nick_name }}
						</template>
						<template v-slot:1>
							{{ danmu.light_num }}
						</template>
						<template v-slot:2>
							<img
								v-for="(item, index) in danmu.item_icons"
								:key="index"
								:src="item"
								alt=""
							/>
						</template>
					</i18n>

					<img
						class="gift-icon"
						src="https://yaame-static.yaame.io/admin/70a8ab7564e6f232bbf9631f73f6168e.png"
						alt=""
					/>
				</div>
			</template>
		</vue-danmaku>
		<div :class="['info', language === 'id' && 'more']">
			{{ $t("rollingInfo") }}
		</div>
		<div class="progress">
			<div class="progress-item">
				<div class="progress-icon">
					<div v-if="language === 'zh-cn' || language === 'zh-tw'" class="icon-info no-wrap" style="font-size: 0.20rem;font-weight: 600;">{{ $t("receiveGift") }}</div>
					<div v-else class="icon-info no-wrap">{{ $t("receiveGift") }}</div>
				</div>
				<div class="progress-info">
					<div class="progress-info-header">{{ $t("receiveGiftGold") }}</div>
					<div class="progress-content">
						<div
							:style="{
								width: computedWidth(
									receive_gift_coin,
									receive_gift_coin_target
								),
							}"
							class="progress-bar"
						></div>
					</div>
					<div class="progress-info-footer">
						<span>0</span>
						<span style="color: #ffdcff; margin-left: 0.16rem"
							>{{ receive_gift_coin }}/{{ receive_gift_coin_target }}</span
						>
						<span>{{ receive_gift_coin_target }}</span>
					</div>
				</div>
			</div>

			<div style="margin-top: 0.22rem" class="progress-item two">
				<div class="progress-icon">
					<!-- <div class="icon-info no-wrap">{{ $t("sendGift") }}</div> -->

                    <div v-if="language === 'zh-cn' || language === 'zh-tw'" class="icon-info no-wrap" style="font-size: 0.20rem;font-weight: 600;">{{ $t("sendGift") }}</div>
					<div v-else class="icon-info no-wrap">{{ $t("sendGift") }}</div>
				</div>
				<div class="progress-info">
					<div class="progress-info-header">{{ $t("sendGiftDiamond") }}</div>
					<div class="progress-content">
						<div
							:style="{
								width: computedWidth(send_gift_coin, send_gift_coin_target),
							}"
							class="progress-bar orange"
						></div>
					</div>
					<div class="progress-info-footer">
						<span>0</span>
						<span style="color: #ffefe3;  margin-left: 0.16rem"
							>{{ send_gift_coin }}/{{ send_gift_coin_target }}</span
						>
						<span>{{ send_gift_coin_target }}</span>
					</div>
				</div>
			</div>
		</div>
		<div class="btn-list">
			<div class="btn-item" @click="lightFireworks('ONCE')">
				{{ $t("lightOneTime") }}
			</div>
			<div class="btn-item ten" @click="lightFireworks('TEN')">
				{{ $t("lightTenTimes") }}
			</div>
		</div>
		<div v-if="language === 'id'" class="click-count" style="font-size: 0.18rem;">
			{{ $t("currentLightFireworks", [light_num]) }}
		</div>
        <div v-else class="click-count">
			{{ $t("currentLightFireworks", [light_num]) }}
		</div>
		<div class="reward-title">
			<span>{{ $t("prizePool") }}</span>
		</div>
		<div class="reward-content">
			<div
				v-for="(item, index) in reward_pool_list"
				:key="index"
				class="reward-item"
			>
				<div class="img-div">
					<img :src="item.icon" alt="" />
					<!-- <div class="img-info">7days</div> -->
				</div>
				<p style="margin-top: 0.04rem" class="reward-item-name">{{ item.reward_name }}</p>
				<p style="margin-top: 0.02rem" class="reward-item-name">
					<img
						src="https://yaame-static.yaame.io/admin/e79a29be51fa5c36921980d4272aa493.png"
						alt=""
					/>
					{{ item.reward_diamond_worth }}
				</p>
			</div>
		</div>

		<popup v-if="resultShow" class="flex-box">
			<div :class="['result-container', reward_item_vo_list.length > 1 && 'big']">
				<template v-if="reward_item_vo_list && reward_item_vo_list.length">

                    <div
                        v-if="['ar', 'en', 'id'].includes(language)"
                        class="result-title-id"
                    >
                        <span>{{ $t("congratulationsTo") }}</span>
                    </div>
                    <div
                        v-else
                        class="result-title"
                    >
                        <span>{{ $t("congratulationsTo") }}</span>
                    </div>

                    
                </template>

				<div
					v-if="reward_item_vo_list && reward_item_vo_list.length === 1"
					class="content-one"
				>
					<div class="content-one-item">
						<div class="img-div">
							<img :src="reward_item_vo_list[0].icon" alt="" />
							<!-- <div class="img-info"></div> -->
						</div>
						<p class="item-name no-wrap">
							{{ reward_item_vo_list[0].reward_name }}
						</p>
					</div>
				</div>
				<div
					v-if="reward_item_vo_list && reward_item_vo_list.length > 1"
					class="content-ten"
				>
					<div
						v-for="(item, index) in reward_item_vo_list"
						:key="index"
						class="content-ten-item"
					>
						<div class="img-div">
							<img :src="item.icon" alt="" />
							<!-- <div class="img-info"></div> -->
						</div>
						<p class="item-name no-wrap">
							{{ item.reward_name }}
						</p>
					</div>
				</div>

				<div
					v-if="reward_item_vo_list && reward_item_vo_list.length === 0"
					class="empty"
				>
					<img
						class="empty-img"
						src="https://yaame-static.yaame.io/admin/3fc6f686fb5fcfa21ba7eab569845a72.png"
						alt=""
					/>
					<p class="empty-p">{{ $t("ohYouGotNothingTryAgain") }}</p>
				</div>

				<div class="again" @click="handleAgain">{{ $t("lightAgain") }}</div>

				<img
					class="close-icon"
					src="https://yaame-static.yaame.io/admin/4bcf095d20500fff632ff75f099e6bf6.png"
					alt=""
					@click="closeResult"
				/>
			</div>
		</popup>
	</div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, computed } from "vue";
import { Toast } from "vant";
import { getHomeInfoAPI, lightFireworksAPI } from "../api";
import vueDanmaku from "vue-danmaku";
import popup from "@/components/common/pop_up";
import { getLanguage } from "@/lib/device";
import { Downloader, Parser, Player } from "svga.lite";
import DB from 'svga.lite/db';
import { burialPointFun } from "@/lib/utils";

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

let reward_pool_list = ref([]);
let light_num = ref(0);
let screen_list = ref([]);
let receive_gift_coin = ref(0);
let receive_gift_coin_target = ref(0);
let send_gift_coin = ref(0);
let send_gift_coin_target = ref(0);
const getHomeInfo = async () => {
	const res = await getHomeInfoAPI();
	if (res.status === 1000) {
		reward_pool_list.value = res.data.reward_pool_list;
		light_num.value = res.data.light_num;
		screen_list.value = res.data.screen_list;

		receive_gift_coin.value = res.data.receive_gift_coin;
		receive_gift_coin_target.value = res.data.receive_gift_coin_target;
		send_gift_coin.value = res.data.send_gift_coin;
		send_gift_coin_target.value = res.data.send_gift_coin_target;
	}
};

const computedWidth = (num, target) => {
	return (num / target) * 100 + "%";
};

let resultShow = ref(false);
let reward_item_vo_list = ref([]);
let selectType = ref("ONCE");
let resultFireShow = ref(false);
const lightFireworks = async (light_type) => {
	selectType.value = light_type;

	reward_item_vo_list.value = [];
	const res = await lightFireworksAPI({
		light_type,
	});
	if (res.status === 1000) {
		if (res.data.reward_item_vo_list) {
			reward_item_vo_list.value = res.data.reward_item_vo_list;
		}
        resultFireShow.value = true;
        monster.player.start();
        setTimeout(() => {
            resultShow.value = true;
            // 页面禁止滑动
            disableScroll();

            resultFireShow.value = false;
            monster.player.stop();

        }, 1800);

        burialPointFun({
            event_name: "firework_btn_click",
            cid: -1000,
            md: 4,
            args_name: "firework_btn_click",
            args: {
                which: light_type === "ONCE" ? 'light_once' : 'light_times',
            },
        });

		getHomeInfo();
	} else {
		Toast(res.desc);
	}
};

const closeResult = () => {
    resultShow.value = false;
    // 页面恢复滑动
    enableScroll();
};

// 创建事件处理函数
const preventScroll = (e) => {
    e.preventDefault();
}

// 禁止页面滚动
const disableScroll = () => {
    // 记录页面滚动位置
    document.body.addEventListener('touchmove', preventScroll, { passive: false });
}

// 启用页面滚动
const enableScroll = () => {
    // 恢复页面滚动位置
    document.body.removeEventListener('touchmove', preventScroll, { passive: false });
}


const handleAgain = () => {
	resultShow.value = false;
	lightFireworks(selectType.value);
};


const monster = ref({
	downloader: null,
	parser: null,
	player: null,
	svgaStaticData: null,
});

const initSVGAData = async (obj, canvas, svga_static) => {
	let options = obj;
	options.downloader = new Downloader();
	// 默认调用 WebWorker 线程解析
	// 可配置 new Parser({ disableWorker: true }) 禁止
	options.parser = new Parser();
	// #canvas 是 HTMLCanvasElement
	options.player = new Player(`#${canvas}`);

	let fileOptions = void 0;
	let db = void 0;
	try {
		db = new DB();
	} catch (error) {
		console.error(error);
	}
	if (db) {
		fileOptions = await db.find(svga_static);
	}

	if (fileOptions) {
		options.svgaStaticData = fileOptions;
	} else {
		const fileStaticData = await options.downloader.get(svga_static);
		options.svgaStaticData = await options.parser.do(fileStaticData);

		db && (await db.insert(svga_static, options.svgaStaticData));
	}

	options.player.set({ loop: 1 });

	await options.player.mount(options.svgaStaticData);
	options.player.start();
};

onMounted(() => {

    initSVGAData(
		monster,
		"firework",
		"https://yaame-static.yaame.io/admin/a6d26f055eca7e28139c597381aee76f.svga"
	);

    setTimeout(() => {
        getHomeInfo();
    }, 100);
});
</script>

<style lang="less" scoped>
.draw {
	width: 7.08rem;
	height: 20.81rem;
	background-size: contain;
	background-repeat: no-repeat;
	background-image: url(https://yaame-static.yaame.io/admin/0da5d5e7bd7a6367b4bbb0646e859eb3.png);
	margin-left: 0.21rem;
	margin-top: 0.47rem;
	padding-top: 0.4rem;
	position: relative;
	.firework {
		position: absolute;
		top: 0;
		left: 0;
		width: 7.08rem;
		height: 5.6rem;
	}
	.scrolling {
		width: 6.86rem;
        margin-left: 0.11rem;
		height: 4.03rem;
		margin-bottom: 0.4rem;
		.screen-item {
			min-width: 4.7rem;
			height: 0.54rem;
			background: linear-gradient(180deg, #8329e0 0%, #691ae2 100%);
			border-radius: 0.27rem;
			border: 0.02rem solid #ffe17c;
			position: relative;
			margin: 0.4rem;
			padding: 0 0.6rem;
			line-height: 0.54rem;
			font-weight: 400;
			font-size: 0.2rem;
			color: #ffea83;

			img {
				width: 0.4rem;
				height: 0.4rem;
				margin: 0 0.1rem;
				vertical-align: middle;
				position: relative;
				bottom: 0.02rem;
			}
			.user-avatar {
				width: 0.8rem;
				height: 0.77rem;
				background-size: contain;
				background-repeat: no-repeat;
				background-position: 0.12rem 0.13rem;
				position: absolute;
				left: -0.27rem;
				top: -0.15rem;
				.user-img-avatar {
					width: 0.8rem;
					height: 0.77rem;
					position: absolute;
					left: 0;
					top: 0;
					z-index: 1;
				}
				.user-img {
					width: 0.58rem;
					height: 0.58rem;
					position: absolute;
					left: 0.12rem;
					top: 0.13rem;
					border-radius: 50%;
				}
			}
			.gift-icon {
				height: 0.54rem;
				width: 0.54rem;
				position: absolute;
				right: -0.12rem;
				top: 0;
			}
		}
	}
	.info {
		width: 7.08rem;
		// height: 0.94rem;
		text-align: center;
		font-weight: normal;
		font-size: 0.24rem;
		color: #ffea83;
		padding: 0 0.53rem;
		overflow-y: scroll;
		margin-bottom: 0.1rem;

		&.more {
			margin-top: -0.6rem;
		}
	}
	.progress {
		width: 6.31rem;
		height: 3.48rem;
		margin-left: 0.38rem;
		.progress-item {
			width: 6.31rem;
			height: 1.62rem;
			display: flex;
			align-items: center;
			&.two {
				.progress-icon {
					background-image: url(https://yaame-static.yaame.io/admin/9d16204ffe9f1eaaddf465710a074fe4.png);
				}
			}
			.progress-icon {
				width: 1.4rem;
				height: 1.62rem;
				position: relative;
				background-size: 1.07rem 1.32rem;
				background-repeat: no-repeat;
				background-image: url(https://yaame-static.yaame.io/admin/224e5c1c4878531f1041cf45b49ee873.png);
				background-position: 0.16rem 0;
				.icon {
					width: 0.78rem;
					height: 0.78rem;
					position: absolute;
					top: 0.43rem;
					left: 0.3rem;
				}
				.icon-info {
					position: absolute;
					bottom: 0;
					left: -0.1rem;
					width: 1.6rem;
					height: 0.47rem;
					line-height: 0.5rem;
					text-align: center;
					background-size: contain;
					background-repeat: no-repeat;
					background-image: url(https://yaame-static.yaame.io/admin/451e22d6bbb935e02ed81da1d360c574.png);
					font-weight: 600;
					font-size: 0.18rem;
					color: #ffea83;
				}
			}
			.progress-info {
				margin-left: 0.4rem;
				width: 4.53rem;
				.progress-info-header {
					font-weight: 400;
					font-size: 0.24rem;
					color: #ffea83;
				}
				.progress-content {
					margin-top: 0.22rem;
					width: 4.53rem;
					height: 0.3rem;
					background: #5f11ad;
					border-radius: 0.15rem;
					border: 0.02rem solid #c588ff;
					.progress-bar {
						width: 0;
						height: 0.26rem;
						background: linear-gradient(180deg, #ff6cec 0%, #a905c5 100%);
						border-radius: 0.15rem;
						&.orange {
							background: linear-gradient(180deg, #ffb56c 0%, #c55405 100%);
						}
					}
				}
				.progress-info-footer {
					margin-top: 0.12rem;
					display: flex;
					justify-content: space-between;
					width: 4.53rem;
					font-weight: 400;
					font-size: 0.2rem;
					color: #ffea83;
				}
			}
		}
	}
	.btn-list {
		margin-top: 0.48rem;
		width: 7.08rem;
		height: 0.75rem;
		display: flex;
		justify-content: space-between;
		padding: 0 0.81rem;
		.btn-item {
			width: 2.63rem;
			height: 0.75rem;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/4c81b92a72fbb11cf8b7786b651bbc61.png);
			text-align: center;
			line-height: 0.75rem;
			font-weight: 600;
			font-size: 0.24rem;
			color: #ffffff;
			&.ten {
				background-image: url(https://yaame-static.yaame.io/admin/deefb358d4dc17302afd39a70696574b.png);
			}
		}
	}
	.click-count {
		margin-top: 0.2rem;
		width: 5.7rem;
		overflow: hidden;
		height: 0.53rem;
		background-size: contain;
		background-repeat: no-repeat;
		background-image: url(https://yaame-static.yaame.io/admin/3a633beb491f431232c9c5e33e5fd9a6.png);
		margin-left: 0.69rem;
		text-align: center;
		line-height: 0.53rem;
		font-weight: 600;
		font-size: 0.26rem;
		color: #ffea83;
	}
	.reward-title {
		width: 7.08rem;
		height: 0.34rem;
		text-align: center;
		margin-top: 0.44rem;
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
	.reward-content {
		margin-top: 0.24rem;
		width: 7.08rem;
		height: 8.1rem;
		display: flex;
		flex-wrap: wrap;
		// overflow-y: scroll;
		padding: 0 0.38rem;
		.reward-item {
			width: 1.9rem;
			height: 2.54rem;
			// background-color: #fff;
			margin-right: 0.3rem;
			&:nth-of-type(3n) {
				margin-right: 0;
			}
			.img-div {
				width: 1.9rem;
				height: 1.9rem;
				background-size: contain;
				background-repeat: no-repeat;
				background-image: url(https://yaame-static.yaame.io/admin/25725aeede36a11647ec3396188a7df2.png);
				display: flex;
				justify-content: center;
				align-items: center;
				position: relative;
				img {
					width: 1.4rem;
					height: 1.4rem;
				}
				.img-info {
					position: absolute;
					top: 0;
					right: 0;
					min-width: 0.94rem;
					height: 0.34rem;
					line-height: 0.34rem;
					text-align: center;
					font-weight: 400;
					font-size: 0.24rem;
					color: #ffffff;
					background: #9e3add;
					border-radius: 0 0.1rem 0 0.13rem;
				}
			}
			.reward-item-name {
				font-weight: 400;
				font-size: 0.22rem;
                line-height: 0.24rem;
				color: #ffffff;
				text-align: center;
				img {
					width: 0.22rem;
					height: 0.19rem;
					vertical-align: middle;
					position: relative;
					bottom: 0.02rem;
				}
			}
		}
	}
	.flex-box {
		display: flex;
		justify-content: center;
		align-items: center;
		.result-container {
			width: 6.71rem;
			height: 5.66rem;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/17463e6a9dfad394ae5e34169b13cb28.png);
			padding-top: 1.08rem;
			position: relative;
            &.big {
                height: 7.31rem;
                background-image: url(https://yaame-static.yaame.io/admin/4c20a68c647cf88e16eb6ca5c51063ee.png);
            }
			.result-title {
				width: 6.71rem;
				height: 0.36rem;
				text-align: center;
				span {
					position: relative;
					font-weight: 600;
					font-size: 0.36rem;
					color: #fff28f;
					&::before {
						content: "";
						position: absolute;
						top: 0.1rem;
						left: -1.28rem;
						width: 1.1rem;
						height: 0.21rem;
						background-size: contain;
						background-repeat: no-repeat;
						background-image: url(https://yaame-static.yaame.io/admin/6dab24271815f16b9dde396b6f05b776.png);
					}
					&::after {
						content: "";
						position: absolute;
						top: 0.1rem;
						right: -1.26rem;
						width: 1.1rem;
						height: 0.21rem;
						background-size: contain;
						background-repeat: no-repeat;
						
                        background-image: url(https://yaame-static.yaame.io/admin/f1e41f9c62d4e55e9aad2103f71e29f5.png);
					}
				}
			}
            .result-title-id {
                width: 6.71rem;
				height: 0.36rem;
				text-align: center;
				span {
					position: relative;
					font-weight: 600;
					font-size: 0.36rem;
					color: #fff28f;
				}
            }
			.content-one {
				width: 6.71rem;
				padding: 0.4rem 2.6rem 0.44rem;
				.content-one-item {
					width: 1.5rem;
					height: 1.94rem;
					.img-div {
						width: 1.5rem;
						height: 1.5rem;
						background: #8737d3;
						border-radius: 0.08rem;
						border: 0.01rem solid #ffffa9;
						position: relative;
						display: flex;
						justify-content: center;
						align-items: center;
						img {
							width: 1.1rem;
							height: 1.1rem;
						}
						.img-info {
							display: inline;
							min-width: 0.72rem;
							height: 0.26rem;
							text-align: center;
							line-height: 0.26rem;
							background: #e540f6;
							border-radius: 0px 0.08rem 0px 0.08rem;
							position: absolute;
							top: 0.01rem;
							right: 0.01rem;
							font-weight: 400;
							font-size: 0.18rem;
							color: #fff1aa;
							padding: 0 0.06rem;
						}
					}
					.item-name {
						width: 1.5rem;
						font-weight: 400;
						font-size: 0.22rem;
						color: #fff1aa;
						text-align: center;
						margin-top: 0.12rem;
					}
				}
			}
			.content-ten {
				width: 6.71rem;
				height: 3.76rem;
				overflow-y: scroll;
				display: flex;
				flex-wrap: wrap;
				padding: 0 0.4rem;
				margin-top: 0.4rem;
				.content-ten-item {
					width: 1.1rem;
					height: 1.76rem;
					margin-right: 0.1rem;
					margin-bottom: 0.1rem;
					&:nth-of-type(5n) {
						margin-right: 0;
					}
					.img-div {
						width: 1.1rem;
						height: 1.1rem;
						background: #8737d3;
						border-radius: 0.08rem;
						border: 0.01rem solid #ffffa9;
						position: relative;
						display: flex;
						justify-content: center;
						align-items: center;
						img {
							width: 0.8rem;
							height: 0.8rem;
						}
						.img-info {
							display: inline;
							min-width: 0.72rem;
							height: 0.26rem;
							text-align: center;
							line-height: 0.26rem;
							background: #e540f6;
							border-radius: 0px 0.08rem 0px 0.08rem;
							position: absolute;
							top: 0.01rem;
							right: 0.01rem;
							font-weight: 400;
							font-size: 0.18rem;
							color: #fff1aa;
							padding: 0 0.06rem;
						}
					}
					.item-name {
						width: 1.1rem;
						font-weight: 400;
						font-size: 0.22rem;
						color: #fff1aa;
						text-align: center;
						margin-top: 0.12rem;
					}
				}
			}
			.empty {
				padding-top: 0.84rem;
				.empty-img {
					width: 0.77rem;
					height: 0.9rem;
					display: block;
					margin-left: 2.97rem;
				}
				.empty-p {
					text-align: center;
					font-weight: 400;
					font-size: 0.24rem;
					color: #fff1aa;
					margin-top: 0.24rem;
                    padding: 0 0.6rem;
				}
			}
			.again {
				width: 2.63rem;
				height: 0.75rem;
				background-size: contain;
				background-repeat: no-repeat;
				background-image: url(https://yaame-static.yaame.io/admin/990946b7f0c700fd5d0a6b04be7bbe43.png);
				text-align: center;
				line-height: 0.75rem;
				position: absolute;
				bottom: 0.69rem;
				left: 2.04rem;
				font-weight: 600;
				font-size: 0.32rem;
				color: #ffffff;
			}
			.close-icon {
				width: 0.5rem;
				height: 0.5rem;
				position: absolute;
				left: 3.1rem;
				bottom: -0.8rem;
			}
		}
	}
}
</style>
