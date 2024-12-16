<template>
	<div class="main" ref="main">
		<div
			class="index"
			:style="{
				backgroundImage: `url(${bgImgList[language]})`,
			}"
		>
			<!--返回栏-->
			<custom-header color="white">{{
				$t("independence_day_celebration")
			}}</custom-header>

			<img
				class="rule-icon"
				:src="ruleImgList[language]"
				alt=""
				@click="toRule()"
			/>
			<img
				class="submit-icon"
				:src="submitImgList[language]"
				alt=""
				@click="openSubmit()"
			/>

            <p v-if="region_id === 'INDONESIA'" class="time-p">8/14 00:00 - 8/21 23:59(UTC+0)</p>
            <p v-else class="time-p">8/27 00:00 - 9/3 23:59(UTC+0)</p>

			<div class="barrage-container"></div>

			<vue-danmaku
        v-if="screenList.length"
				class="barrage-container"
				ref="danmaku"
				v-model="screenList"
				randomChannel
				use-slot
				loop
                :top="10"
                :right="4"
				:speeds="60"
				:channels="3"
			>
				<template slot="dm" slot-scope="{ index, danmu }">
					<div :class="['screen-item', danmu.pay_status && 'screen-item--vip']">
						<div v-if="danmu.pay_status === 0" class="avatar">
							<img v-show="imageLoadedStatus[index]" :src="danmu.avatar" @load="handleImageLoad(index, danmu)" alt="" />
              <img v-show="!imageLoadedStatus[index]" src="../../../assets/img/deficiency.png" alt="">
						</div>
						<div v-else class="avatar--vip">
							<div
								class="avatar-address"
							/>
							<img v-show="imageLoadedStatus[index]" class="avatar-img" :src="danmu.avatar" @load="handleImageLoad(index, danmu)" alt="" />
              <img v-show="!imageLoadedStatus[index]" class="avatar-img" src="../../../assets/img/deficiency.png" alt="">
						</div>
						<p>
							{{
								danmu.blessing_content.replace(/\n/g, "") ||
								"-"
							}}
						</p>
					</div>
				</template>
			</vue-danmaku>

      <!--烟花图片-->
      <div class="fireworks"></div>
      <div class="fireworks"></div>
			<!--时间倒计时-->
			<div class="time">
				<div class="times">{{ days }}</div>
				<div class="times">D</div>
				<div class="times">{{ hours < 10 ? "0" + hours : hours }}</div>
				<div class="times">{{ minutes < 10 ? "0" + minutes : minutes }}</div>
				<div class="times">{{ seconds < 10 ? "0" + seconds : seconds }}</div>
			</div>

			<!--奖励展示-->
			<div class="event-gifts" :style="{ backgroundImage: `url(${ eventGifts[language] })` }">
				<div class="gift" v-for="(item, index) in gift" :key="index">
					<div class="icon">
						<img :src="item.icon" alt="" />
					</div>
					<div style="margin-top: 0.14rem" class="name">
						{{ item.gift_name }}
					</div>
					<div class="diamond">
						<img
							src="https://yaame-static.yaame.io/admin/dcb74f5d4781c8550ed3440f698cbe32.png"
							alt=""
						/>
						{{ item.diamond_worth }}
					</div>
				</div>
			</div>

			<!--tab-->
			<div class="tab" ref="tabTop">
				<div
					class="tabs"
					v-show="tabStyle === 0"
					:class="{ 'tabs-one': tabStyle === index }"
					v-for="(item, index) in tabImg[language]"
					:key="index"
					:style="{ backgroundImage: `url(${item.one})` }"
					@click="selectTab(index)"
				></div>
				<div
					class="tabs"
					v-show="tabStyle === 1"
					:class="{ 'tabs-one': tabStyle === index }"
					v-for="(item, index) in tabImg[language]"
					:key="index + 2"
					:style="{ backgroundImage: `url(${item.two})` }"
					@click="selectTab(index)"
				></div>
			</div>

			<!--任务榜单组件-->
			<keep-alive>
				<router-view :main="main" :gameData="gameData"></router-view>
			</keep-alive>
		</div>
		<pop_up v-show="submitShow" :visible="submitShow" class="flex-container">
			<div class="submit-container" :style="{ backgroundImage: `url(${submitContainer[language]})` }">
				<!-- <div class="submit-info">{{ $t('submit_info') }}</div> -->
				<div class="submit-info">
					{{ $t('write_blessings') }}
				</div>

				<div class="submit-textarea">
					<textarea
						:placeholder="t('write_your_blessings')"
						v-model="submitText"
						:maxlength="dealCurrentMaxLen(submitText, 100)"
					></textarea>

					<div class="refresh-btn" @click="refreshText">
						<img
							src="https://yaame-static.yaame.io/admin/52f9a937413de664e486aa444afb7d45.png"
							alt=""
						/>
						{{ $t('random') }}
					</div>

					<div class="text-length">
						<span>{{ submitText.length }}</span
						>/100
					</div>
				</div>

				<div class="submit-footer-info">
          {{ $t('choose_blessing_style') }}
				</div>

				<div class="btn-list">
					<div class="btn" @click="submitWish(0)">
						<img
							class="btn-img"
							:src="btnImg.one.btn[language]"
							alt=""
						/>
						<img
							class="btn-info-img"
							:src="btnImg.one.info[language]"
							alt=""
						/>
					</div>
					<div class="btn" @click="submitWish(1)">
						<img
							class="btn-img"
              :src="btnImg.two.btn[language]"
							alt=""
						/>
						<img
							class="btn-info-img"
              :src="btnImg.two.info[language]"
							alt=""
						/>
					</div>
				</div>

				<img
					class="close-icon"
					src="https://yaame-static.yaame.io/admin/8bb8a71cdeb8d963c0094bdb4c11fc03.png"
					@click="closeSubmit"
					alt=""
				/>
			</div>
		</pop_up>
	</div>
</template>

<script setup>
import customHeader from "@/components/common/header";
import {computed, getCurrentInstance, nextTick, onMounted, ref, set, watch} from "vue";
import { Toast } from "vant";
import {getLanguage, isIOS} from "@/lib/device";
import {
	getPearlCollectorHomeApi,
	taskReceiveApi,
} from "@/pages/independence/api";
import pop_up from "@/components/common/pop_up.vue";
import vueDanmaku from "vue-danmaku";
import {useRoute} from "vue-router/composables";
import { burialPointFun } from "@/lib/utils";
// 获取国际化函数
const root = getCurrentInstance();
const t = (val, msg) => {
	return root.proxy.$i18n.t(val, msg);
};
// 获取语言
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

// 外层dom
const main = ref(null);

// 活动结束时间戳
const timeEnd = ref(0);
// 页面计时时间
let days = ref(0);
let hours = ref(0);
let minutes = ref(0);
let seconds = ref(0);
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

const bgImgList = ref({
	"zh-cn":
		"https://yaame-static.yaame.io/admin/ed2d1e5c5283f3b09a99c83bd8abeb06.png",
	"zh-tw":
		"https://yaame-static.yaame.io/admin/ed2d1e5c5283f3b09a99c83bd8abeb06.png",
	en: "https://yaame-static.yaame.io/admin/a23231eff03ad867e140cde6e405779a.png",
	id: "https://yaame-static.yaame.io/admin/a23231eff03ad867e140cde6e405779a.png",
	ar: "https://yaame-static.yaame.io/admin/a23231eff03ad867e140cde6e405779a.png",
});

const ruleImgList = ref({
	"zh-cn":
		"https://yaame-static.yaame.io/admin/53cf366b4b8424cf702cd6f36c823f24.png",
	"zh-tw":
		"https://yaame-static.yaame.io/admin/53cf366b4b8424cf702cd6f36c823f24.png",
	en: "https://yaame-static.yaame.io/admin/f5e27213a2146426edb309f4dcebc622.png",
	id: "https://yaame-static.yaame.io/admin/aa0a9aa82ce45d9394f4f0a7618f7184.png",
	ar: "https://yaame-static.yaame.io/admin/f5e27213a2146426edb309f4dcebc622.png",
});

const submitImgList = ref({
	"zh-cn":
		"https://yaame-static.yaame.io/admin/42b8c7d47c28399c6fb16d7cfb964094.png",
	"zh-tw":
		"https://yaame-static.yaame.io/admin/42b8c7d47c28399c6fb16d7cfb964094.png",
	en: "https://yaame-static.yaame.io/admin/0727f8a4b24f362fe04521241dbf89c3.png",
	id: "https://yaame-static.yaame.io/admin/91f03d387d1ae68d70d84f749f200ddb.png",
	ar: "https://yaame-static.yaame.io/admin/0727f8a4b24f362fe04521241dbf89c3.png",
});

const submitContainer = ref({
  "zh-cn":
      "https://yaame-static.yaame.io/admin/0b5e62832da042ca1fd353568125ae5b.png",
  "zh-tw":
      "https://yaame-static.yaame.io/admin/0b5e62832da042ca1fd353568125ae5b.png",
  en: "https://yaame-static.yaame.io/admin/9087871c2e6380cf64c4100105020220.png",
  id: "https://yaame-static.yaame.io/admin/9087871c2e6380cf64c4100105020220.png",
  ar: "https://yaame-static.yaame.io/admin/9087871c2e6380cf64c4100105020220.png",
});

const eventGifts = ref({
  "zh-cn":
      "https://yaame-static.yaame.io/admin/9726af28eacae0aa4b9cf76a37bb0728.png",
  "zh-tw":
      "https://yaame-static.yaame.io/admin/9726af28eacae0aa4b9cf76a37bb0728.png",
  en: "https://yaame-static.yaame.io/admin/105051047929bb05f570a87fc1d68c06.png",
  id: "https://yaame-static.yaame.io/admin/105051047929bb05f570a87fc1d68c06.png",
  ar: "https://yaame-static.yaame.io/admin/105051047929bb05f570a87fc1d68c06.png",
})

const btnImg = ref({
  one: {
    btn: {
      "zh-cn":
          "https://yaame-static.yaame.io/admin/1cb382fe8e46c4991f59053a0147ab12.png",
      "zh-tw":
          "https://yaame-static.yaame.io/admin/1cb382fe8e46c4991f59053a0147ab12.png",
      en: "https://yaame-static.yaame.io/admin/fc95840b23c98dafb11f5497e0452d7a.png",
      id: "https://yaame-static.yaame.io/admin/fc95840b23c98dafb11f5497e0452d7a.png",
      ar: "https://yaame-static.yaame.io/admin/fc95840b23c98dafb11f5497e0452d7a.png",
    },
    info: {
      "zh-cn":
          "https://yaame-static.yaame.io/admin/758f9f2778fc17d996f6c561923d1750.png",
      "zh-tw":
          "https://yaame-static.yaame.io/admin/758f9f2778fc17d996f6c561923d1750.png",
      en: "https://yaame-static.yaame.io/admin/f7957cecac4acb3d26e6699fed64fe11.png",
      id: "https://yaame-static.yaame.io/admin/f7957cecac4acb3d26e6699fed64fe11.png",
      ar: "https://yaame-static.yaame.io/admin/f7957cecac4acb3d26e6699fed64fe11.png",
    }
  },
  two: {
    btn: {
      "zh-cn":
          "https://yaame-static.yaame.io/admin/6b27e3bdaed867d5d5ad5f800c5fc507.png",
      "zh-tw":
          "https://yaame-static.yaame.io/admin/6b27e3bdaed867d5d5ad5f800c5fc507.png",
      en: "https://yaame-static.yaame.io/admin/58ed63e48d057e8e8400abe311f1c2df.png",
      id: "https://yaame-static.yaame.io/admin/cde62fe2ac94ef4fc05a08131581c84e.png",
      ar: "https://yaame-static.yaame.io/admin/58ed63e48d057e8e8400abe311f1c2df.png",
    },
    info: {
      "zh-cn":
          "https://yaame-static.yaame.io/admin/54c19d9b3fc266af9cca9839b6767466.png",
      "zh-tw":
          "https://yaame-static.yaame.io/admin/54c19d9b3fc266af9cca9839b6767466.png",
      en: "https://yaame-static.yaame.io/admin/72f3a87a52ea5ab2b6649dfc71dfa4d4.png",
      id: "https://yaame-static.yaame.io/admin/910d1ebf21041240081d305d60544d05.png",
      ar: "https://yaame-static.yaame.io/admin/72f3a87a52ea5ab2b6649dfc71dfa4d4.png",
    }
  }
})

const toRule = () => {
  screenList.value = [];
	// 跳转规则页面
	root.proxy.$router.push("/rule");

    burialPointFun({
        event_name: "page_btn_click",
        cid: -1000,
        md: 2,
        args_name: "page_btn_click",
        args: {
            type: 'rules_rewards',
        },
    });
};
const openSubmit = () => {
	submitShow.value = true;
    burialPointFun({
        event_name: "page_btn_click",
        cid: -1000,
        md: 2,
        args_name: "page_btn_click",
        args: {
            type: 'wishingwall_click',
        },
    });
};

let tabStyle = ref(0);
// tab国际化
const tabImg = ref({
	"zh-cn": [
		{
			one: "https://yaame-static.yaame.io/admin/7d390225e5eab72d2929e9f13e823b04.png", // 选中
			two: "https://yaame-static.yaame.io/admin/21d0f9e0d5fa1a37201595b7c24b6f74.png",
		},
		{
			two: "https://yaame-static.yaame.io/admin/158f516acfe5524e8bcd79c2ddc32d0c.png",
			one: "https://yaame-static.yaame.io/admin/175780694888eedfe904342f12933cbc.png",
		},
	],
	"zh-tw": [
    {
      one: "https://yaame-static.yaame.io/admin/7d390225e5eab72d2929e9f13e823b04.png", // 选中
      two: "https://yaame-static.yaame.io/admin/21d0f9e0d5fa1a37201595b7c24b6f74.png",
    },
    {
      two: "https://yaame-static.yaame.io/admin/158f516acfe5524e8bcd79c2ddc32d0c.png",
      one: "https://yaame-static.yaame.io/admin/175780694888eedfe904342f12933cbc.png",
    },
	],
	en: [
		{
			one: "https://yaame-static.yaame.io/admin/29ce1a37cfd954ac9a2ed322542599f1.png", // 选中
			two: "https://yaame-static.yaame.io/admin/e5b957ab4a3dd0ad0ce9bcb77758c885.png",
		},
		{
			two: "https://yaame-static.yaame.io/admin/79c29fbea705c93afc620fe9178480d7.png",
			one: "https://yaame-static.yaame.io/admin/a9932b5843a7489c707216d0d7564905.png",
		},
	],
	id: [
    {
      one: "https://yaame-static.yaame.io/admin/29ce1a37cfd954ac9a2ed322542599f1.png", // 选中
      two: "https://yaame-static.yaame.io/admin/e5b957ab4a3dd0ad0ce9bcb77758c885.png",
    },
    {
      two: "https://yaame-static.yaame.io/admin/79c29fbea705c93afc620fe9178480d7.png",
      one: "https://yaame-static.yaame.io/admin/a9932b5843a7489c707216d0d7564905.png",
    },
	],
	ar: [
    {
      one: "https://yaame-static.yaame.io/admin/29ce1a37cfd954ac9a2ed322542599f1.png", // 选中
      two: "https://yaame-static.yaame.io/admin/e5b957ab4a3dd0ad0ce9bcb77758c885.png",
    },
    {
      two: "https://yaame-static.yaame.io/admin/79c29fbea705c93afc620fe9178480d7.png",
      one: "https://yaame-static.yaame.io/admin/a9932b5843a7489c707216d0d7564905.png",
    },
	],
});
// 切换tab
const selectTab = (index) => {
	tabStyle.value = index;
	if (index) {
		root.proxy.$router.replace("ranking");

        burialPointFun({
            event_name: "page_btn_click",
            cid: -1000,
            md: 2,
            args_name: "page_btn_click",
            args: {
                type: 'rank_tab_click',
            },
        });
	} else {
    getHomeData();
		root.proxy.$router.replace("task");

        burialPointFun({
            event_name: "page_btn_click",
            cid: -1000,
            md: 2,
            args_name: "page_btn_click",
            args: {
                type: 'flag_tab_click',
            },
        });
	}
};

// 计算苹果回车换行多出字符问题
const dealCurrentMaxLen = (str, maxLen) => {
  if (isIOS()) {
    let reg = /\n/g;
    let lineNum = str.match(reg);
    return lineNum ? lineNum.length + maxLen : maxLen
  } else {
    return maxLen
  }
}

// 哥礼物信息在这里
const gift = ref([]);
const gameData = ref({});
let screenList = ref([]);
const myHead = ref('')
let region_id = ref('SOUTHEAST_ASIA');
const getHomeData = async () => {
	try {
		const res = await getPearlCollectorHomeApi();
		if (res.status !== 1000) return;
		// 页面礼物信息
		gift.value = res.data.gifts;
		// 游戏页面数据
		gameData.value = res.data;
		screenList.value = res.data.carousels;
    myHead.value = res.data.avatar;
        // 活动结束时间
        timeEnd.value = res.data.end_time;
        updateTime();
        openTiming();

        region_id.value = res.data.region_id;
	} catch (err) {
		console.log(err);
	}
};

let submitShow = ref(false);
let submitText = ref("");
const closeSubmit = () => {
	submitShow.value = false;
	submitText.value = "";
};

const submitWish = async (val) => {
	if (!submitText.value) {
		Toast(t('blessing_not_compliant'));
		return;
	}
	// 提交
	console.log(submitText.value);
	let res = await taskReceiveApi({
		blessing_content: submitText.value,
		pay_status: val,
	});
  if (res.status === 6600) {
    Toast(res.desc);
    window.location.href = "wlyaame://mine/shop/diamond?popup=1";
    return;
  }
	if (res.status !== 1000) {
		Toast(res.desc);
		return;
	}
  screenList.value = [];
  await getHomeData();
	Toast(t('blessing_sent'));
	closeSubmit();
};

let refreshTextList = [
	"independence_day_message_1",
	"independence_day_message_2",
	"independence_day_message_3",
	"independence_day_message_4",
	"independence_day_message_5",
	"independence_day_message_6",
	"independence_day_message_7",
	"independence_day_message_8",
	"independence_day_message_9",
];
const refreshText = () => {
	let key = refreshTextList[random(0, refreshTextList.length - 1)];
    submitText.value = t(key);
};
// 随机函数
const random = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

const handleImageLoad = (index, danmu) => {
  set(imageLoadedStatus.value, index, true);
}

// 监听路由变化
const router = useRoute();
watch(() => router.fullPath, (newVal, oldVal) => {
  if (newVal === '/index/task') {
    getHomeData();
  }
})

const imageLoadedStatus = ref({});
onMounted(async () => {
	await getHomeData();
  nextTick(() => {
    screenList.value.forEach((_,index) => {
      set(imageLoadedStatus.value, index, false);
    })
  });

  burialPointFun({
        event_name: "event_page_view",
        cid: -1000,
        md: 2,
        args_name: "event_page_view",
    });
});
</script>

<style lang="less" scoped>
.main {
	min-height: 100vh;
	overflow: auto;
	position: relative;

	.index {
		position: relative;
		min-height: 7rem;
		background-repeat: no-repeat;
		background-size: contain;
		overflow: hidden;
		.barrage-container {
			width: 7.5rem;
			height: 2.47rem;
			position: absolute;
			top: 4.6rem;
		}
		.rule-icon,
		.submit-icon {
			position: fixed;
			z-index: 9;
			width: 1.24rem;
			height: 0.58rem;
			right: 0;
		}
		.rule-icon {
			top: 2.48rem;
		}
		.submit-icon {
			top: 3.36rem;
		}
        .time-p {
            width: 7.5rem;
            text-align: center;
            font-weight: 500;
            font-size: 0.24rem;
            color: #FFFFFF;
            position: absolute;
            top: 3.71rem;
        }
		.screen-item {
            display: inline-block;
			height: 0.54rem;
			background: #5468EE;
			border-radius: 0.27rem;
			border: 0.02rem solid #ffefaa;
			opacity: 0.9;
			line-height: 0.54rem;
			padding: 0 0.17rem 0 0.5rem;
			font-weight: 400;
			font-size: 0.2rem;
			color: #ffffff;
			&--vip {
        background: linear-gradient( 180deg, #FFC488 0%, #F94F50 100%);
				border: 0.02rem solid #FFFEBC;
				font-weight: 400;
				font-size: 0.2rem;
				color: #fff4a3;
			}
			.avatar {
				width: 0.62rem;
				height: 0.62rem;
				border: 0.02rem solid #ffefaa;
				overflow: hidden;
				position: absolute;
				left: -0.16rem;
				top: 0.02rem;
				border-radius: 50%;
				img {
					width: 100%;
					height: 100%;
					border-radius: 50%;
				}
			}
			.avatar--vip {
				width: 0.62rem;
				height: 0.70rem;
				position: absolute;
				left: -0.2rem;
				top: -0.04rem;
				.avatar-address {
					width: 0.62rem;
					height: 0.70rem;
					position: absolute;
					z-index: 2;
					left: 0;
					top: 0;
          background: url("https://yaame-static.yaame.io/admin/e0fc4d5dff21a4136421ee0203d3ab84.png") no-repeat;
          background-size: contain;
				}
				.avatar-img {
					width: 0.58rem;
					height: 0.58rem;
					border-radius: 50%;
					position: absolute;
					top: 0.09rem;
					left: 0.02rem;
				}
			}
		}

    .fireworks {
      position: absolute;
      top: 7.25rem;
      left: .15rem;
      width: 2.12rem;
      height: 1.49rem;
      background-image: url(https://yaame-static.yaame.io/admin/20b9ae1cc3bb1b8c955f19656558b5bc.png);
      background-repeat: no-repeat;
      background-size: contain;
    }
    .fireworks:nth-child(8) {
      left: 5.19rem;
      background-image: url(https://yaame-static.yaame.io/admin/8da0719d703c7e14328306aacb7e55fd.png);
    }
		.time {
			margin: 7.25rem auto 0;
			font-size: 0.26rem;
			color: #fff2b3;
			width: 3.98rem;
			height: 0.58rem;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/1927f584430d1d168a726e953988a36f.png);
			position: relative;
			.times {
				height: 0.58rem;
				line-height: 0.58rem;
				text-align: center;
				position: absolute;
				top: 0;
				&:nth-of-type(1) {
					width: 0.58rem;
					left: 0;
				}
				&:nth-of-type(2) {
					width: 0.58rem;
					left: 0.68rem;
				}
				&:nth-of-type(3) {
					width: 0.7rem;
					left: 1.46rem;
				}
				&:nth-of-type(4) {
					width: 0.7rem;
					left: 2.38rem;
				}
				&:nth-of-type(5) {
					width: 0.7rem;
					left: 3.28rem;
				}
			}
		}

		.bg-icon-left {
			width: 2.12rem;
			height: 1.49rem;
			position: absolute;
			left: 0.16rem;
			top: 8.63rem;
		}
		.bg-icon-right {
			width: 2.12rem;
			height: 1.49rem;
			position: absolute;
			right: 0.16rem;
			top: 8.63rem;
		}

		.event-gifts {
			position: relative;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-around;
			width: 6.92rem;
			height: 6.65rem;
			margin: 0.32rem auto 0;
			padding: 1.73rem 0.3rem 0;
			font-size: 0.22rem;
			color: #fff2b3;
      background-repeat: no-repeat;
			background-size: contain;
			.gift {
				width: 1.4rem;
				height: 2.44rem;
				//margin-right: 0.68rem;
				&:nth-of-type(3n) {
					margin-right: 0;
				}
				.icon {
					width: 1.4rem;
					height: 1.4rem;
					background: radial-gradient(
						0% 53% at 50% 50%,
						#ffffff 0%,
						#ffeeee 45%,
						#ffe4d8 100%
					);
					border-radius: 0.16rem;
					border: 0.04rem solid #ffd879;
					display: flex;
					justify-content: center;
					align-items: center;
					img {
						width: 1rem;
						height: 1rem;
					}
				}
				.name {
					width: 1.4rem;
          line-height: .22rem;
					text-align: center;
					font-size: 0.22rem;
					color: #fff2b3;
				}
				.diamond {
					width: 1.4rem;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 0.22rem;
					color: #fff2b3;
					img {
						width: 0.22rem;
						height: 0.22rem;
					}
				}
			}
		}

		.tab {
			display: flex;
      justify-content: space-between;
			width: 7.04rem;
			height: 1.06rem;
			margin: 0.37rem auto 0.24rem;
			.tabs {
				width: 3.48rem;
				height: 1.06rem;
				background-repeat: no-repeat;
				background-size: contain;
				transition-duration: 0.3s;
			}
		}
	}
	.flex-container {
		display: flex;
		justify-content: center;
		align-items: center;
		.submit-container {
			width: 6.8rem;
			height: 9.54rem;
			background-size: contain;
			background-repeat: no-repeat;
			padding: 1.81rem 0.5rem 0;
			position: relative;
			.submit-info {
				width: 5.85rem;
				height: 1.13rem;
				font-weight: 600;
				font-size: 0.28rem;
				color: #FFF;
				line-height: 1.2;
			}
			.submit-textarea {
        position: relative;
				width: 5.85rem;
				height: 3rem;
				background: #5F75D0;
				border-radius: 0.18rem;
				border: 0.04rem solid #FFE8AC;
				position: relative;
				textarea {
					width: 5.85rem;
					height: 2rem;
					border: none;
					font-weight: 600;
					font-size: 0.28rem;
					background-color: transparent;
					padding: 0.3rem;
					color: #fff;
          &::placeholder {
            color: #C2CFFF;
            white-space: nowrap;
          }
				}
				.refresh-btn {
					height: 0.36rem;
					font-weight: 600;
					font-size: 0.28rem;
					color: #ffffff;
					line-height: 0.36rem;
					position: absolute;
					left: 0.18rem;
					bottom: 0.15rem;
					img {
						width: 0.36rem;
						height: 0.36rem;
						margin-right: 0.08rem;
					}
				}
				.text-length {
					position: absolute;
					right: 0.18rem;
					bottom: 0.15rem;
					font-size: 0.28rem;
					color: rgba(255,255,255,0.6);
					span {
						color: #fff;
					}
				}
			}
			.submit-footer-info {
				margin-top: 0.58rem;
				width: 5.85rem;
				height: 0.8rem;
				font-weight: 500;
				font-size: 0.24rem;
				color: #FFF;
				line-height: 1.2;
			}
			.btn-list {
				display: flex;
				justify-content: space-between;
				.btn {
					width: 2.6rem;
					height: 0.84rem;
					position: relative;
					.btn-img {
						width: 2.6rem;
						height: 0.84rem;
					}
					.btn-info-img {
						width: 1.7rem;
						height: 0.54rem;
						position: absolute;
						left: 0.45rem;
						top: 1rem;
                        scale: 1.3;
					}
				}
			}
			.close-icon {
				position: absolute;
				width: 0.5rem;
				height: 0.5rem;
				left: 3.17rem;
				bottom: -1.1rem;
			}
		}
	}
}
</style>
