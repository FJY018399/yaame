<!--
 * @Author: Elk
 * @Date: 2024-06-04 17:57:45
 * @FilePath: /yaame-h5/src/pages/EidAlAdha/views/index.vue
 * @Description: 
-->
<template>
	<div
		:style="{
			backgroundImage: `url(${bgImgList[language]})`,
		}"
		class="main"
	>
		<Header color="white" :custom_back="true" @onCustomBack="back">{{ $t("EidAlAdha") }}</Header>

        <div v-show="tabActive === 'ranking'" class="award-page" @click="$router.push('/award')">{{ $t('reward') }}</div>
		<div v-show="tabActive === 'mainHall'" class="rule-btn" @click="ruleVisible = true;">{{ $t("rule") }}</div>

		<div class="time-container">
			<div class="day-left">{{ timeInfo.dayLeft }}</div>
			<div class="day-right">{{ timeInfo.dayRight }}</div>
			<div class="hour">{{ timeInfo.hours }}</div>
			<div class="minute">{{ timeInfo.minutes }}</div>
			<div class="second">{{ timeInfo.seconds }}</div>
		</div>
        <div class="tab-container">
            
            <div v-for="(item, index) in tabList" :key="index" :class="['tab-item', tabActive === item && 'active']" @click="handleTabClick(item)">

                <img :src="tabActive === item ? tabImgList[language][tabActive].active : tabImgList[language][item].default" alt="">
            </div>
        </div>

        <keep-alive>
            <router-view />
        </keep-alive>

        <rule
          v-show="ruleVisible && tabActive === 'mainHall'"
          class="rule-style"
          :title="t('rules')"
          :buttonContent="t('gotIt')"
          background-image="https://yaame-static.yaame.io/admin/ce0e1ac92a405d65318d0a8555b45393.png"
          height="6.98rem"
          width="5.9rem"
          :cutRule="closeRule"
      >
          <template v-slot:default>
              <div class="content">
                  <span>{{ $t('task_event_time') }}</span>
                  <p>{{ $t('task_event_start_time') }}</p>
                  <p>{{ $t('task_event_end_time') }}</p>
                  <span>{{ $t('task_event_description') }}</span>
                  <p>{{ $t('index_rule_1') }}</p>

                  <div class="rule-table">
                    <div v-for="(item, index) in ruleTable" :key="index" class="table-item">
                        <div v-for="(ele) in item">
                            {{ $t(ele) }}
                        </div>
                    </div>
                  </div>

                  <p>{{ $t('index_rule_2') }}</p>
                  <p>{{ $t('index_rule_3') }}</p>
                  <p>{{ $t('index_rule_4') }}</p>
              </div>
          </template>
      </rule>

        <rule
            v-show="ruleVisible && tabActive === 'ranking'"
            class="rule-style"
            :title="t('rules')"
            :buttonContent="t('gotIt')"
            background-image="https://yaame-static.yaame.io/admin/ce0e1ac92a405d65318d0a8555b45393.png"
            height="6.98rem"
            width="5.9rem"
            :cutRule="closeRule"
        >
            <template v-slot:default>
                <div class="content">
                    <span>{{ $t('task_event_time') }}</span>
                    <p>{{ $t('task_event_start_time') }}</p>
                    <p>{{ $t('task_event_end_time') }}</p>
                    <span>{{ $t('task_event_description') }}</span>
                    <p>{{ $t('user_on_leaderboard') }}</p>
                    <p>{{ $t('ranking_based_on_dishes') }}</p>
                    <p>{{ $t('dish_score_explanation') }}</p>

                    <div class="rule-table">
                        <div v-for="(item, index) in ruleTableTwo" :key="index" class="table-item">
                            <div v-for="(ele) in item">
                                {{ ele > 0 ? ele : $t(ele) }}
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </rule>
	</div>
</template>

<script setup>
import Header from "@/components/common/header";
import Popup from "@/components/common/pop_up";
import { ref, onMounted, getCurrentInstance, computed } from "vue";
import { getLanguage } from "@/lib/device";
import { Toast } from "vant";
import rule from "./ruleCommon.vue";
const root = getCurrentInstance();

const t = (val) => {
	return root.proxy.$i18n.t(val);
};
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

let bgImgList = ref({
	"zh-cn":
		"https://yaame-static.yaame.io/admin/e352dd8f088d43b5cc425899838123cd.png",
	"zh-tw":
		"https://yaame-static.yaame.io/admin/5d7313e872dcbdb38a067d4e5e068f5d.png",
	en: "https://yaame-static.yaame.io/admin/1c5424f55a2fc1cb9756a88296ca1126.png",
	id: "https://yaame-static.yaame.io/admin/23ee1ba9cabcc9d45e530f14424a4599.png",
	ar: "https://yaame-static.yaame.io/admin/729e32b35f6ba1a9c67da5332fd55ebb.png",
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

let tabList = ref(['ranking', 'mainHall', 'shop']);
let tabActive = ref('mainHall');
const handleTabClick = (name) => {
    if (tabActive.value === name) return;
    tabActive.value = name;
    root.proxy.$router.push({ name });
}
const tabImgList = ref({
    "zh-cn": {
        ranking: {
            default: 'https://yaame-static.yaame.io/admin/4d14b85f4e661c48e12ad28a78be3757.png',
            active: 'https://yaame-static.yaame.io/admin/59c366bfb5c58c07965ea405db3fb450.png',
        },
        mainHall: {
            default: 'https://yaame-static.yaame.io/admin/5f748d7a2621bec0a67d615f9427c545.png',
            active: 'https://yaame-static.yaame.io/admin/d2c2b67c7b35fe31a79d4949d17c676a.png',
        },
        shop: {
            default: 'https://yaame-static.yaame.io/admin/8026350e230c34eb57213cb95db4999f.png',
            active: 'https://yaame-static.yaame.io/admin/88c9587ae51f1846c6c6856d5154b930.png',
        }
    },
    "zh-tw": {
        ranking: {
            default: 'https://yaame-static.yaame.io/admin/4d14b85f4e661c48e12ad28a78be3757.png',
            active: 'https://yaame-static.yaame.io/admin/59c366bfb5c58c07965ea405db3fb450.png',
        },
        mainHall: {
            default: 'https://yaame-static.yaame.io/admin/09cf6fd5cdfd92d5b0caf5eb28f71534.png',
            active: 'https://yaame-static.yaame.io/admin/c646ef741adb28950da15634e8591a25.png',
        },
        shop: {
            default: 'https://yaame-static.yaame.io/admin/ba98d88056e9b98d0a9197f88e43e76b.png',
            active: 'https://yaame-static.yaame.io/admin/df4ee5b97b8c5fbaff6bfcd5c93e5af7.png',
        }
    },
    en: {
        ranking: {
            default: 'https://yaame-static.yaame.io/admin/9df8f9ef76747bc397252c66103889af.png',
            active: 'https://yaame-static.yaame.io/admin/bb3fa8ddca41b519493803fb6fa48a28.png',
        },
        mainHall: {
            default: 'https://yaame-static.yaame.io/admin/6320c4a0d50205919c2c1e96ecc98f28.png',
            active: 'https://yaame-static.yaame.io/admin/09f8007f11e28687ec926ac6c1a82ba1.png',
        },
        shop: {
            default: 'https://yaame-static.yaame.io/admin/17106917bf4841bd6fbdec768628332d.png',
            active: 'https://yaame-static.yaame.io/admin/966a7cac85ad5411ab53fcc81fd04dd4.png',
        }
    },
    id: {
        ranking: {
            default: 'https://yaame-static.yaame.io/admin/4ed221a01812d6940f91cee6a50d731f.png',
            active: 'https://yaame-static.yaame.io/admin/ed1bf5256499f55b243a3270a7099c66.png',
        },
        mainHall: {
            default: 'https://yaame-static.yaame.io/admin/751cccacf65c10ee3d47814f8db4d7e0.png',
            active: 'https://yaame-static.yaame.io/admin/aef480f333260fb741fabba9aaa5d9c0.png',
        },
        shop: {
            default: 'https://yaame-static.yaame.io/admin/8422e4b3c5b1158e2a2d6a74c3f0b3a6.png',
            active: 'https://yaame-static.yaame.io/admin/97355336c979f58eeb99892dc6ece38c.png',
        }
    },
    ar: {
        ranking: {
            default: 'https://yaame-static.yaame.io/admin/2b73a49d096c1b5f5191d64f67f35e76.png',
            active: 'https://yaame-static.yaame.io/admin/462b25156e1968d31b01f56dbb6de071.png',
        },
        mainHall: {
            default: 'https://yaame-static.yaame.io/admin/8c5239956a1d3e2422d1de9c6afc8f9a.png',
            active: 'https://yaame-static.yaame.io/admin/47a99ecb6aef686b30ec9ebbaeaf28da.png',
        },
        shop: {
            default: 'https://yaame-static.yaame.io/admin/eaa2fe052490bcb38fa58099f55cef03.png',
            active: 'https://yaame-static.yaame.io/admin/e3272a1d0c00f45568e21d9f99c20aa9.png',
        }
    }
})

let ruleVisible = ref(false);
const closeRule = () => {
    ruleVisible.value = false;
}

let ruleTable = ref([
    [
        'food', 'rewards',
    ], [
        'grilled_fish', 'avatar_chair',
    ], [
        'la_wang_beef', 'avatar_frame',
    ], [
        'sha_dia_beef', 'avatar_wing',
    ], [
        'ren_dang_beef', 'bubble',
    ], [
        'grilled_lamb', 'avatar_top',
    ], [
        'coconut_rice', 'avatar_frame',
    ], [
        'badong_dishes', 'bubble'
    ], [
        'fried_rice', 'avatar_bottom'
    ]
]);
let ruleTableTwo = ref([
    [
        'food', 'score_explanation',
    ], [
        'grilled_fish', 100,
    ], [
        'la_wang_beef', 85,
    ], [
        'sha_dia_beef', 75,
    ], [
        'ren_dang_beef', 65,
    ], [
        'grilled_lamb', 60,
    ], [
        'coconut_rice', 50,
    ], [
        'badong_dishes', 35
    ], [
        'fried_rice', 25
    ]
]);

const back = () => {
    location.href = "wlyaame://webview/pop";
}
onMounted(() => {
	document.body.style.backgroundColor = "#0E5F53";

    // 倒计时到utc时间的2024年6月22号凌晨0点
    const time = "2024-06-22T00:00:00Z";
    getCountdown(time);
    pageInterval.value = setInterval(() => {
        getCountdown(time);
    }, 1000);

    // 根据路由修改tabActive
    tabActive.value = root.proxy.$route.name;
});
</script>
<style lang="less" scoped>
.main {
	width: 7.5rem;
	min-height: 100vh;
	background-size: contain;
	background-repeat: no-repeat;
    padding-top: 4.18rem;
	.rule-btn,
    .award-page {
		background-image: url(https://yaame-static.yaame.io/admin/1b0cab4864bcb297afb52fe23cc7f7dd.png);
		width: 1.49rem;
		height: 0.6rem;
		background-size: contain;
		background-repeat: no-repeat;
		text-align: center;
		line-height: 0.6rem;
		font-weight: 600;
		font-size: 0.24rem;
		color: #854304;
		position: fixed;
		right: 0;
		top: 2.7rem;
        z-index: 3;
	}
    .award-page {
        top: 1.78rem;
    }

	.time-container {
		div {
			text-align: center;
			line-height: 0.48rem;
			font-size: 0.24rem;
			color: #fff;
			position: absolute;
			top: 2.77rem;
			height: 0.48rem;
		}
		.day-left {
			width: 0.42rem;
			left: 2.35rem;
		}
		.day-right {
			width: 0.42rem;
			left: 2.84rem;
		}
		.hour {
			width: 0.48rem;
			left: 3.4rem;
		}
		.minute {
			width: 0.48rem;
			left: 4.02rem;
		}
		.second {
			width: 0.48rem;
			left: 4.64rem;
		}
	}
    .tab-container {
        width: 7.5rem;
        height: 0.95rem;
        display: flex;
        justify-content: space-between;
        padding: 0 0.1rem;
        .tab-item {
            width: 2.39rem;
            height: 0.96rem;
            text-align: center;
            position: relative;
            img {
                width: 2.39rem;
                height: auto;
                position: absolute;
                bottom: 0;
                left: 0;
            }
        }
    }
    .rule-style {
        z-index: 99999;
        .content {
            display: flex;
            flex-direction: column;
            width: 5.06rem;
            height: 4.08rem;
            margin: 1.2rem auto 0;
            overflow-y: auto;
            span {
                font-weight: 600;
                font-size: .26rem;
                color: #FFFFFF;
                margin: 0.1rem 0;
            }

            p {
                font-size: .26rem;
                color: #FFFFFF;
                opacity: .6;
            }
            .rule-table {
                width: 5rem;
                border: 0.02rem solid #FFFFFF;
                border-radius: 0.12rem;
                font-size: 0.24rem;
                color: #fff;
                margin-top: 0.3rem;
                margin-bottom: 0.3rem;
                .table-item {
                    width: 5rem;
                    height: 0.6rem;
                    line-height: 0.6rem;
                    display: flex;
                    border-bottom: 0.02rem solid #FFFFFF;
                    &:last-child {
                        border-bottom: none;
                    }
                    div {
                        flex: 1;
                        text-align: center;
                        border-right: 0.02rem solid #FFFFFF;
                        &:nth-child(2n) {
                            border-right: none;
                        }
                    }
                }
            }
        }
    }
}
</style>
