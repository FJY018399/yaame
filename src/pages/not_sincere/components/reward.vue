<template>
	<div :style="{ paddingTop: safe_height + 0.88 + 'rem' }" class="reward">

        <custom-header :custom_back="true" color="blank" @onCustomBack="back">{{ $t('not_sincere') }}</custom-header>
		<div
			v-if="['en', 'id', 'ar'].indexOf(language) > -1"
			class="reward-header big"
		>
			{{ $t("top_10") }}
		</div>
		<div v-else class="reward-header">{{ $t("top_10") }}</div>
		<div class="rank-item rank-1">
			<div class="rank-header">{{ $t("first_place") }}</div>

			<div class="rank-content">
				<div style="margin-right: 0.44rem" class="item big">
					<div class="item-img">
                        <img src="https://yaame-static.yaame.io/admin/cc6447f85a027ce10550eeceaccadb6a.png" alt="">
						<span class="item-num">3days</span>
					</div>

					<div class="item-name no-wrap">{{ $t("CP_opening_screen") }}</div>
				</div>
				<div class="item big">
					<div class="item-img">
                        <img src="https://yaame-static.yaame.io/admin/0431b67dfee5e1df4a95603663a459a5.png" alt="">
						<span class="item-num">3days</span>
					</div>

					<div class="item-name no-wrap">{{ $t("CP_popup") }}</div>
				</div>
				<div style="margin: 0 1.19rem 0 0.48rem" class="item">
					<div class="item-img">
                        <img src="https://yaame-static.yaame.io/admin/6a70e07578a6953540b4ce3c94946d9e.png" alt="">
						<span class="item-num">7days</span>
					</div>

					<div class="item-name no-wrap">{{ $t("customized_frame") }}</div>
				</div>
				<div class="item">
					<div class="item-img">
						<span class="item-num">7days</span>
                        <img src="https://yaame-static.yaame.io/admin/fa3b2ca07fee08901d3c8e6edb83104a.png" alt="">
					</div>

					<div class="item-name no-wrap">{{ $t("custom_gift") }}</div>
				</div>
			</div>

			<div class="rank-footer">
				<img
					src="https://yaame-static.yaame.io/admin/3fdb31bf230d40491e76343e39a41784.png"
					alt=""
				/>
				<div>{{ $t("experience_value") }}</div>
			</div>
		</div>

		<div class="rank-item rank-2">
			<div class="rank-header">{{ $t("second_place") }}</div>

			<div class="rank-content">
				<div style="margin-right: 0.44rem" class="item big">
					<div class="item-img">
                        <img src="https://yaame-static.yaame.io/admin/35e6a5253e464fbce47b37ca562d0af4.png" alt="">
						<span class="item-num">2days</span>
					</div>

					<div class="item-name no-wrap">{{ $t("CP_opening_screen") }}</div>
				</div>
				<div class="item big">
					<div class="item-img">
                        <img src="https://yaame-static.yaame.io/admin/0431b67dfee5e1df4a95603663a459a5.png" alt="">
						<span class="item-num">2days</span>
					</div>

					<div class="item-name no-wrap">{{ $t("CP_popup") }}</div>
				</div>
				<div style="margin: 0 1.19rem 0 0.48rem" class="item">
					<div class="item-img">
                        <img src="https://yaame-static.yaame.io/admin/4b8597011c3efc6fc623f12ef0956a32.png" alt="">
						<span class="item-num">5days</span>
					</div>

					<div class="item-name no-wrap">{{ $t("customized_frame") }}</div>
				</div>
				<div class="item">
					<div class="item-img">
						<span class="item-num">5days</span>
                        <img src="https://yaame-static.yaame.io/admin/fa3b2ca07fee08901d3c8e6edb83104a.png" alt="">
					</div>

					<div class="item-name no-wrap">{{ $t("custom_gift") }}</div>
				</div>
			</div>

			<div class="rank-footer">
				<img
					src="https://yaame-static.yaame.io/admin/940b121a661c66157b6e05b835c332c5.png"
					alt=""
				/>
				<div>{{ $t("experience_value_4") }}</div>
			</div>
		</div>

		<div class="rank-item rank-3">
			<div class="rank-header">{{ $t("third_place") }}</div>

			<div class="rank-content">
				<div style="margin-right: 1rem" class="item big">
					<div class="item-img">
                        <img src="https://yaame-static.yaame.io/admin/5b82478b6537d2b3c93e96660c25f273.png" alt="">
						<span class="item-num">1days</span>
					</div>

					<div class="item-name no-wrap">{{ $t("CP_opening_screen") }}</div>
				</div>
				<div>
					<div style="margin-bottom: 0.2rem" class="item">
						<div class="item-img">
                            <img src="https://yaame-static.yaame.io/admin/70fe14d3f92987dc1aa38cafc4ea551c.png" alt="">
							<span class="item-num">3days</span>
						</div>

						<div class="item-name no-wrap">{{ $t("customized_frame") }}</div>
					</div>
					<div class="item">
						<div class="item-img">
							<span class="item-num">3days</span>
                            <img src="https://yaame-static.yaame.io/admin/ff4a00994f7c69ec4c6c449414daa67f.png" alt="">
						</div>

						<div class="item-name no-wrap">{{ $t("custom_gift") }}</div>
					</div>
				</div>
			</div>

			<div class="rank-footer">
				<img
					src="https://yaame-static.yaame.io/admin/940b121a661c66157b6e05b835c332c5.png"
					alt=""
				/>
				<div>{{ $t("experience_value_3") }}</div>
			</div>
		</div>
        <div class="rank-item rank-4">
			<div class="rank-header">{{ $t("four_to_six") }}</div>

			<div class="rank-content">
				<div class="item">
					<div class="item-img">
                        <img src="https://yaame-static.yaame.io/admin/c9716d50de1dfb52a3ced313b364b893.png" alt="">
						<span class="item-num">7days</span>
					</div>

					<div class="item-name no-wrap">{{ $t("customized_frame") }}</div>
				</div>
			</div>

			<div class="rank-footer">
				<img
					src="https://yaame-static.yaame.io/admin/940b121a661c66157b6e05b835c332c5.png"
					alt=""
				/>
				<div>{{ $t("experience_value_2") }}</div>
			</div>
		</div>
        <div class="rank-item rank-4">
			<div class="rank-header">{{ $t("seventh_to_tenth") }}</div>

			<div class="rank-content">
				<div class="item">
					<div class="item-img">
						<span class="item-num">5days</span>
                        <img src="https://yaame-static.yaame.io/admin/4701fb79068d9dcaa6ad2fc8c821ea93.png" alt="">
					</div>

					<div class="item-name no-wrap">{{ $t("customized_frame") }}</div>
				</div>
			</div>

			<div class="rank-footer">
				<img
					src="https://yaame-static.yaame.io/admin/940b121a661c66157b6e05b835c332c5.png"
					alt=""
				/>
				<div>{{ $t("experience_value_1") }}</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed, onMounted, ref, getCurrentInstance } from "vue";
import { getLanguage, getSafeHeight } from "@/lib/device";
import customHeader from "../../../components/common/header.vue";


const root = getCurrentInstance()
const router = root.proxy.$router;
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
const back = () => {
    router.go(-1);
}
let safe_height = ref(0);
onMounted(() => {
    let safe_area = getSafeHeight() || 0;
	safe_height.value = (safe_area * 2) / 100;
});
</script>

<style scoped lang="less">
.reward {
	min-width: 100vw;
	min-height: 100vh;
	top: 0;
	height: 0;
	background: #a3c5ff;
	background-image: url(https://yaame-static.yaame.io/admin/e814762cae504fc5852c908cfdf62d17.png);
	background-size: contain;
	background-repeat: no-repeat;
    padding-bottom: 0.02rem;
    padding-top: 0.57rem;
	.reward-header {
		width: 5.83rem;
		height: 1.97rem;
		background-size: contain;
		background-repeat: no-repeat;
		background-image: url(https://yaame-static.yaame.io/admin/b3ff392286a5aac60f660561394afcfa.png);
		margin-left: 0.83rem;
		padding: 0.78rem 1.2rem 0;
		font-size: 0.26rem;
		color: #ffffff;
		text-align: center;
		&.big {
			padding-top: 0.68rem;
			line-height: 1.2;
			background-image: url(https://yaame-static.yaame.io/admin/1ff91d941d194a7066a34e76642dd6d4.png);
			height: 2.27rem;
		}
	}

	.rank-item {
		width: 7.22rem;
		margin-left: 0.14rem;
		height: auto;
		background-size: contain;
		background-repeat: no-repeat;
		position: relative;
		.rank-header {
			width: 7.22rem;
			text-align: center;
			font-size: 0.32rem;
			color: #2b56b3;
			position: absolute;
		}
		.rank-content {
			width: 7.22rem;
			display: flex;
			flex-wrap: wrap;
			.item {
				width: 2.04rem;
				height: 2.5rem;

				&.big {
					width: 2.97rem;
					height: 5.2rem;
					.item-img {
						width: 2.97rem;
						height: 4.7rem;
						margin-bottom: 0.18rem;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        img {
                            max-width: 2.6rem;
                            max-height: 4.5rem;
                            height: auto;
                        }
					}
				}

				.item-img {
					width: 2.04rem;
					height: 2.04rem;
					background: #709dff;
					border-radius: 0.16rem;
					border: 0.01rem solid #ffffff;
					position: relative;
					margin-bottom: 0.12rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    img {
                        max-width: 1.84rem;
                        max-height: 1.84rem;
                        height: auto;
                    }
					.item-num {
						min-width: 0.96rem;
						height: 0.35rem;
						text-align: center;
						line-height: 0.35rem;
						padding: 0 0.08rem;
						background: #f691ec;
						border-radius: 0 0.15rem 0 0.13rem;
						font-size: 0.24rem;
						position: absolute;
						top: 0;
						right: 0;
						color: #ffffff;
					}
				}

				.item-name {
					width: 100%;
					text-align: center;
					font-size: 0.24rem;
					color: #ffffff;
				}
			}
		}
		.rank-footer {
			width: 7.22rem;
			height: 1rem;
			display: flex;
			justify-content: space-between;
			padding: 0 0.32rem 0 0.43rem;
			align-items: center;
			font-size: 0.24rem;
			color: #ffffff;
			img {
				display: block;
				width: 1rem;
				height: 1rem;
				margin-right: 0.16rem;
			}
		}
		&.rank-1 {
			height: 11.86rem;
			background-image: url(https://yaame-static.yaame.io/admin/c73472cda9fa2776d7740ae01da6c1f0.png);
			padding-top: 1.88rem;
            margin-bottom: 0.33rem;
			.rank-header {
				top: 1.05rem;
			}
			.rank-content {
				height: 8.6rem;
				padding: 0 0.42rem;
			}
		}
		&.rank-2 {
			width: 7.31rem;
			height: 11.79rem;
			margin-left: 0.1rem;
			background-image: url(https://yaame-static.yaame.io/admin/19d9d6c95b2da5a06da2bf43eed492c3.png);
			padding-top: 1.81rem;
            margin-bottom: 0.33rem;
			.rank-header {
				top: 0.88rem;
			}
			.rank-content {
				height: 8.6rem;
				padding: 0 0.42rem;
			}
		}
        &.rank-3 {
			width: 7.31rem;
			height: 8.81rem;
			margin-left: 0.1rem;
			background-image: url(https://yaame-static.yaame.io/admin/cd7854c83a96840f2d870e55fbead3f2.png);
			padding-top: 1.74rem;
            margin-bottom: 0.33rem;
			.rank-header {
				top: 0.8rem;
			}
			.rank-content {
				height: 5.7rem;
				padding: 0 0.6rem;
			}
		}
        &.rank-4 {
            width: 7.31rem;
			height: 5.69rem;
			margin-left: 0.1rem;
			background-image: url(https://yaame-static.yaame.io/admin/f6613789068be277220c46e6f7cd8f4e.png);
			padding-top: 1.57rem;
            margin-bottom: 0.33rem;
			.rank-header {
				top: 0.57rem;
			}
			.rank-content {
				height: 2.65rem;
				padding: 0 0.6rem;
                justify-content: center;
			}
        }
	}
}
</style>
