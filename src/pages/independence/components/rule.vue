<template>
	<div class="rule" ref="rule">
		<custom-header color="white" :dom-main="rule" :custom_back="true" @onCustomBack="back">{{
			$t("rules_rewards")
		}}</custom-header>

		<div class="title-img">{{ $t('rules_rewards') }}</div>

		<div class="rule-content">
			<p>
        {{ $t('rule_1') }}
			</p>
			<p>
        {{ $t('rule_2', {msg: 300}) }}
			</p>
			<p>
        {{ $t('rule_3') }}
			</p>
			<p>
        {{ $t('rule_4') }}
			</p>
			<p>
        {{ $t('rule_5') }}
			</p>
			<p>
        {{ $t('rule_6') }}
			</p>
			<p>
        {{ $t('rule_7') }}
			</p>
      <p>
        {{ $t('rule_8') }}
      </p>
		</div>

		<div class="title-img">{{ $t('leaderboard_rewards') }}</div>

		<div v-for="(item, index) in reward_gift_items" :key="index" class="rank-reward">
            <p class="reward-info">{{ index < 3 ? $t('rank') + (index + 1) : index === 3 ? $t('rank') + '4-5' : $t('rank') + '6-10' }}</p>
            <div class="gift" v-for="(ele, inx) in item.reward_items" :key="inx">
					<div class="icon" :style="{ marginBottom: '.14rem' }">
            <div v-if="ele.object_type !== 'DIAMOND'" class="day">{{ ele.validity_date }}</div>
						<img :src="ele.icon" alt="" />
					</div>
					<div v-if="ele.object_type !== 'DIAMOND'" class="name">{{ ele.gift_name }}</div>
          <div v-if="ele.object_type === 'DIAMOND'" class="diamond no-wrap">
            <img
              src="https://yaame-static.yaame.io/admin/dcb74f5d4781c8550ed3440f698cbe32.png"
              alt=""
            />
            {{ ele.diamond_worth }}
          </div>
				</div>
        </div>
	</div>
</template>

<script setup>
import customHeader from "@/components/common/header";
import { computed, getCurrentInstance, onMounted, ref } from "vue";
import { getLanguage } from "@/lib/device";
import { getPearlCollectorRankApi } from "@/pages/independence/api";

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
const rule = ref(null);
const back = () => {
    root.proxy.$router.go(-1);
};

let reward_gift_items = ref([]);
const getData = async () => {
    try {
        const res = await getPearlCollectorRankApi();
        console.log(res);
        if (res.status === 1000) {
            reward_gift_items.value = res.data.reward_gift_items;
        }
    } catch (error) {
        console.log(error);
    }
};

onMounted(async () => {
    await getData();
});
</script>

<style lang="less" scoped>
.rule {
	padding-top: 1.08rem;
	font-size: 0.24rem;
	color: #fff;
    padding-bottom: 0.02rem;
	.title-img {
		width: 4.4rem;
		height: 0.98rem;
    line-height: .56rem;
		margin: 0 auto;
		background-size: contain;
		background-repeat: no-repeat;
		background-image: url(https://yaame-static.yaame.io/admin/eb87228309f37f35c1bca11990a0adcb.png);
		text-align: center;
		font-size: 0.98rem;
		font-weight: 600;
		font-size: 0.38rem;
		color: #ffffff;
        padding-top: 0.16rem;
	}
	.rule-content {
		width: 7.5rem;
		padding: 0.3rem 0.51rem;
		p {
			font-weight: 400;
			font-size: 0.28rem;
			color: #ffffff;
			line-height: 2;
		}
	}
	.rank-reward {
		width: 6.88rem;
		height: 4.56rem;
		background-size: contain;
		background-repeat: no-repeat;
		// background-image: url(https://yaame-static.yaame.io/admin/62214797c62b44a8944414b4b0dacd90.png);
		background-image: url(https://yaame-static.yaame.io/admin/24e8f164bb0b2cff9c6df67523f58560.png);
        margin: 0.3rem auto;
        padding: 1.87rem 0.28rem 0;
        display: flex;
        justify-content: space-between;
        position: relative;
        .reward-info {
            position: absolute;
            top: 0.98rem;
            left: 0;
            width: 6.88rem;
            text-align: center;
            font-weight: 600;
            font-size: 0.32rem;
            color: #FFFFFF;
        }
		.gift {
			width: 1.4rem;
			height: 2.44rem;
			.icon {
        position: relative;
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

        .day {
          position: absolute;
          top: -0.04rem;
          right: -0.04rem;
          min-width: .93rem;
          height: .33rem;
          padding: 0 .19rem;
          line-height: .33rem;
          text-align: center;
          font-size: .2rem;
          color: #FFFFFF;
          background-color: #E99F44;
          border-radius: 0 .16rem 0 .16rem;
        }
				img {
					width: 1rem;
					height: 1rem;
				}
			}
			.name {
				width: 1.4rem;
        line-height: .26rem;
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
}
</style>
