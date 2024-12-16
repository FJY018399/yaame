<template>
	<div class="container">
		<custom-header
			style="position: fixed"
			:title_show="false"
			title=""
			color="white"
			>{{ $t("constellation_story") }}</custom-header
		>
		<!-- 头图背景 -->
		<div class="header">
			<div class="avatar1">
				<div
					v-if="
						constellationList[realCurIndex] &&
						constellationList[realCurIndex].anchor
					"
					class="avatar1-img"
					:style="{
						backgroundImage: `url(${constellationList[realCurIndex].anchor.avatar})`,
					}"
				></div>
				<div v-else class="avatar1-img"></div>
				<img
					class="avatar1-border"
					src="../../../assets/img/constellation/avatar1.png"
                    @click="toDetails(constellationList[realCurIndex].anchor)"
				/>
			</div>
			<div class="avatar2">
				<img
					class="avatar2-border"
					src="../../../assets/img/constellation/avatar2.png"
				/>
				<div
					v-if="
						constellationList[realCurIndex] &&
						constellationList[realCurIndex].audience
					"
					class="avatar2-img"
					:style="{
						backgroundImage: `url(${constellationList[realCurIndex].audience.avatar})`,
					}"
                    @click="toDetails(constellationList[realCurIndex].audience)"
				></div>
				<div v-else class="avatar2-img"></div>
			</div>
			<div class="name1 no-wrap">
				<div class="name1-text1">
					{{
						constellationList[realCurIndex] &&
						constellationList[realCurIndex].anchor
							? $t('xx_ambassador', {msg: computedConstellationName(constellationList[realCurIndex])})
							: $t('position_available')
					}}
				</div>
			</div>
			<div class="name2">
				<div class="name2-text1 ellipsis">
					{{
						constellationList[realCurIndex] &&
						constellationList[realCurIndex].audience
							? $t('xx_guardian', {msg: computedConstellationName(constellationList[realCurIndex])})
							: $t('position_available')
					}}
				</div>
			</div>
			<!-- 轮播 -->
			<div class="card-swiper-container" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
				<div
					class="card-swiper-wrapper"
					:class="{ 'no-duration': noDuration }"
					:style="{ transform: `translateX(${2.9 - (curIndex + 2) * 1.7}rem)` }"
				>
					<!-- 放在最前的卡片 -->
					<div
						class="card-swiper"
						:class="{
							'no-duration': noDuration,
							'card-swiper-cur': curIndex === 12,
							'card-swiper-prev': curIndex === -1,
							'card-swiper-prev-prev': curIndex === 0,
						}"
					>
						<img src="../../../assets/img/constellation/slide11.png" />
					</div>
					<div
						class="card-swiper"
						:class="{
							'no-duration': noDuration,
							'card-swiper-cur': curIndex === -1,
							'card-swiper-prev': curIndex === 0,
							'card-swiper-prev-prev': curIndex === 1,
						}"
					>
						<img src="../../../assets/img/constellation/slide12.png" />
					</div>

					<!-- 真实卡片 -->
					<div
						class="card-swiper"
						:class="{
							'no-duration': noDuration,
							'card-swiper-prev-prev': index === curIndex - 1,
							'card-swiper-prev': index === curIndex,
							'card-swiper-cur': index === curIndex + 1,
							'card-swiper-next': index === curIndex + 2,
							'card-swiper-next-next': index === curIndex + 3,
						}"
						v-for="index in 12"
						:key="index"
					>
						<img
							v-if="index === 1"
							src="../../../assets/img/constellation/slide1.png"
						/>
						<img
							v-else-if="index === 2"
							src="../../../assets/img/constellation/slide2.png"
						/>
						<img
							v-else-if="index === 3"
							src="../../../assets/img/constellation/slide3.png"
						/>
						<img
							v-else-if="index === 4"
							src="../../../assets/img/constellation/slide4.png"
						/>
						<img
							v-else-if="index === 5"
							src="../../../assets/img/constellation/slide5.png"
						/>
						<img
							v-else-if="index === 6"
							src="../../../assets/img/constellation/slide6.png"
						/>
						<img
							v-else-if="index === 7"
							src="../../../assets/img/constellation/slide7.png"
						/>
						<img
							v-else-if="index === 8"
							src="../../../assets/img/constellation/slide8.png"
						/>
						<img
							v-else-if="index === 9"
							src="../../../assets/img/constellation/slide9.png"
						/>
						<img
							v-else-if="index === 10"
							src="../../../assets/img/constellation/slide10.png"
						/>
						<img
							v-else-if="index === 11"
							src="../../../assets/img/constellation/slide11.png"
						/>
						<img
							v-else-if="index === 12"
							src="../../../assets/img/constellation/slide12.png"
						/>
					</div>

					<!-- 放在最后的卡片 -->
					<div
						class="card-swiper"
						:class="{
							'no-duration': noDuration,
							'card-swiper-cur': curIndex === 12,
							'card-swiper-next': curIndex === 11,
							'card-swiper-next-next': curIndex === 10,
						}"
					>
						<img src="../../../assets/img/constellation/slide1.png" />
					</div>
					<div
						class="card-swiper"
						:class="{
							'no-duration': noDuration,
							'card-swiper-cur': curIndex === -1,
							'card-swiper-next': curIndex === 12,
							'card-swiper-next-next': curIndex === 11,
						}"
					>
						<img src="../../../assets/img/constellation/slide2.png" />
					</div>
				</div>
				<div class="swiper-arrow-left" @click="move('prev')"></div>
				<div class="swiper-arrow-right" @click="move('next')"></div>
			</div>

			<!-- 标题 -->
			<img
				class="title-img"
				:src="titleImg[key]"
				alt=""
			/>
		</div>

		<div class="tab-container">
			<div
				v-for="(item, index) in tabList"
				:key="index"
				:class="['tab-item', tabActive === item.value && 'active']"
				@click="handleTabClick(item)"
			>
				{{ $t(item.i18nKey) }}
			</div>
		</div>

		<div class="user-info">
			<div class="user-avatar">
				<img class="avatar-img" :src="my_info.avatar" alt="" />
				<img
					class="dress-img"
					src="https://yaame-static.yaame.io/admin/c36249a319bd0c8343998136f5d92d14.png"
					alt=""
				/>
			</div>
			<div class="user-text">
				<div class="user-name">{{ my_info.nick_name }}</div>
				<div class="user-has">
					{{ $t("current_crystal_balls", [crystal_count]) }}
				</div>
			</div>
			<div class="user-footer">
				{{ $t("next_reward_unlock", [next_crystal_count]) }}
			</div>
		</div>

		<div class="crystal-container">
			<div v-for="(item, index) in icons" :key="index" class="crystal-item">
				<img :src="item.icon_url" alt="" />
				<p>{{ item.name }}</p>
			</div>
		</div>

		<div
			v-for="(item, index) in reward_levels"
			:key="index"
			class="reward-item"
		>
			<p class="reward-header">
				{{ $t("reward_for_lighting_crystal_balls", [item.required_num]) }}
			</p>
			<div class="reward-item-list">
				<div
					v-for="(ele, inx) in item.rewards"
					:key="inx"
					class="reward-item-item"
				>
					<div class="img-div">
						<img :src="ele.reward_icon" alt="" />
						<div class="reward-text">{{ ele.subscript }}</div>
					</div>
					<div class="reward-name">{{ ele.reward_name }}</div>
				</div>
			</div>
			<div v-if="item.reward_status === 0" style=" opacity: 0.6;" class="btn">
				{{ $t("claim") }}
			</div>
			<div
				v-else-if="item.reward_status === 1"
				class="btn"
				@click="submit(index)"
			>
				{{ $t("claim") }}
			</div>
			<div v-else class="btn disabled">{{ $t("already_claimed") }}</div>
		</div>
		<popup v-if="successVisible" class="flex-container">
			<div class="success-popup">
				<div class="popup-header">
					<div class="header-content">{{ $t('congratulations_obtained') }}</div>
				</div>
				<div class="reward-item-list">
					<div
						v-for="ele in resultList"
						:key="ele.reward_icon"
						class="reward-item-item"
					>
						<div class="img-div">
							<img :src="ele.reward_icon" alt="" />
							<div class="reward-text">{{ ele.subscript }}</div>
						</div>
						<div class="reward-name">{{ ele.reward_name }}</div>
					</div>
				</div>
                
                <div class="close-icon" @click="successVisible = false;">ok</div>
			</div>
		</popup>
	</div>
</template>
<script>
import customHeader from "@/components/common/header";
import { getSafeHeight } from "@/lib/device.js";
import { getDetailAPI, getRewardAPI } from "@/pages/constellation/api.js";
import popup from "@/components/common/pop_up.vue";
import { Toast } from "vant";
import {computed, watch} from "vue";
export default {
	components: {
		customHeader,
		popup,
	},
	data() {
		return {
			safe_height: 0,
      key: (new URLSearchParams(window.location.search)).get("type"),
      titleImg: {
        "CONSTELLATION0": "https://yaame-static.yaame.io/admin/2daad94a1cf4d82aa1301c188d78cda1.png",
        "CONSTELLATION1": "https://yaame-static.yaame.io/admin/a10c241d171bbd7b506e5a3697dae902.png",
        "CONSTELLATION2": "https://yaame-static.yaame.io/admin/c78365af9f558b66885852f1009b8e84.png",
        "CONSTELLATION3": "https://yaame-static.yaame.io/admin/e481ba9cdd81d0649be1e0c7894578f8.png",
        "CONSTELLATION4": "https://yaame-static.yaame.io/admin/936e9b3e5283e3c681fc7f672b10b92f.png",
        "CONSTELLATION5": "https://yaame-static.yaame.io/admin/e624601c6c0b51f26064acf55d7664ba.png",
        "CONSTELLATION6": "https://yaame-static.yaame.io/admin/a36d8e1b10f6a032717698ceeb865f42.png",
        "CONSTELLATION7": "https://yaame-static.yaame.io/admin/ea77d9e1a7ce2cd6979943ff8bb34304.png",
        "CONSTELLATION8": "https://yaame-static.yaame.io/admin/77db783d06aa20997ab76f9c96c886b4.png",
        "CONSTELLATION9": "https://yaame-static.yaame.io/admin/dd913d7da275fa8805c5203fbc00abc9.png",
        "CONSTELLATION10": "https://yaame-static.yaame.io/admin/148154315ad3b36aa65f409dcf4ba628.png",
        "CONSTELLATION11": "https://yaame-static.yaame.io/admin/c20a964d407dc1d244fd9cbf5bd61ab7.png"
      },
			constellationList: [
                {
                    cycle_type: 'CONSTELLATION7',
                }, {
                    cycle_type: 'CONSTELLATION8',
                }, {
                    cycle_type: 'CONSTELLATION9',
                }, {
                    cycle_type: 'CONSTELLATION10',
                }, {
                    cycle_type: 'CONSTELLATION11',
                }, {
                    cycle_type: 'CONSTELLATION0',
                }, {
                    cycle_type: 'CONSTELLATION1',
                }, {
                    cycle_type: 'CONSTELLATION2',
                }, {
                    cycle_type: 'CONSTELLATION3',
                }, {
                    cycle_type: 'CONSTELLATION4',
                }, {
                    cycle_type: 'CONSTELLATION5',
                }, {
                    cycle_type: 'CONSTELLATION6',
                }
            ],
			duration: null,

			noDuration: false,
			scrollInterval: null,
			curIndex: 5,

			// tab列表
			tabList: [
				{
					i18nKey: "constellation_ambassador",
					value: "ANCHOR",
				},
				{
					i18nKey: "constellation_guardian",
					value: "AUDIENCE",
				},
			],
			tabActive: "ANCHOR",

			icons: [],
			my_info: {
				avatar: "",
				nick_name: "",
			},
			crystal_count: 0,
			next_crystal_count: 0,
			reward_levels: [],

			successVisible: false,
            resultList: [],

            touchStartX: 0,

            constellationNameMap: {
                'CONSTELLATION0': 'virgo',
                'CONSTELLATION1': 'libra',
                'CONSTELLATION2': 'scorpio',
                'CONSTELLATION3': 'sagittarius',
                'CONSTELLATION4': 'capricorn',
                'CONSTELLATION5': 'aquarius',
                'CONSTELLATION6': 'pisces',
                'CONSTELLATION7': 'aries',
                'CONSTELLATION8': 'taurus',
                'CONSTELLATION9': 'gemini',
                'CONSTELLATION10': 'cancer',
                'CONSTELLATION11': 'leo',
            },
		};
	},
	mounted() {
		const safe_area = getSafeHeight() || 40;
		this.safe_height = (safe_area * 2) / 100;

		document.body.style.backgroundColor = "#4D017B";

		this.getDetail();
	},
	computed: {
		realCurIndex() {
			if (this.curIndex === -1) {
				return 0;
			} else if (this.curIndex === 12) {
				return 11;
			} else {
				return this.curIndex;
			}
		},
	},
	methods: {
		// 获取星座活动详情
		async getDetail() {
			const res = await getDetailAPI({
				constellation_type: this.tabActive,
				group_id: 2024,
        cycle_type: this.key,
			});
			if (res.status === 1000) {
				this.icons = res.data.icons;
				this.my_info = res.data.my_info;
				this.crystal_count = res.data.crystal_count;

				if (res.data.next_crystal_count) {
					this.next_crystal_count = res.data.next_crystal_count;
				}

				this.reward_levels = res.data.reward_levels;

                // 遍历this.constellationList和res.data.top_users, cycle_type一致的话，将res.data.top_users的数据赋值给this.constellationList
                this.constellationList.forEach((item, index) => {
                    res.data.top_users.forEach((ele) => {
                        if (item.cycle_type === ele.cycle_type) {
                            this.$set(this.constellationList, index, ele);
                        }
                    });
                });
                
			}
		},

		// 轮播图自动播放
		setScrollInterval() {
			if (this.scrollInterval) {
				clearInterval(this.scrollInterval);
			}
			this.scrollInterval = setInterval(() => {
				this.next();
			}, 3000);
		},
		move(forward) {
			this[forward]();
		},
		prev() {
			if (this.curIndex === 0) {
				this.noDuration = true;
				this.curIndex = 12;
				setTimeout(() => {
					this.noDuration = false;
					this.curIndex--;
				}, 0);
			} else {
				this.curIndex--;
			}
		},
		next() {
			if (this.curIndex === 11) {
				this.noDuration = true;
				this.curIndex = -1;
				setTimeout(() => {
					this.noDuration = false;
					this.curIndex++;
				}, 0);
			} else {
				this.curIndex++;
			}
		},

		handleTabClick(item) {
			this.tabActive = item.value;
			this.getDetail();
		},
		async submit(reward_index) {
			let res = await getRewardAPI({
				constellation_type: this.tabActive,
				reward_index,
				group_id: 2024
			});
			if (res.status === 1000) {
				this.getDetail();
                this.resultList = this.reward_levels[reward_index].rewards;
				this.successVisible = true;

			}
		},
        handleTouchMove($event) {
            // 减少触发次数
            if ($event.changedTouches[0].pageX - this.touchStartX > 80) {
                this.move('prev');
                this.touchStartX = $event.changedTouches[0].pageX;
            } else if ($event.changedTouches[0].pageX - this.touchStartX < -80) {
                this.move('next');
                this.touchStartX = $event.changedTouches[0].pageX;
            }
        },
        handleTouchStart($event) {
            this.touchStartX = $event.changedTouches[0].pageX;

            // 在滑动的时候，禁止上下滑动
            document.body.style.overflow = 'hidden';
        },
        handleTouchEnd() {
            this.touchStartX = 0;
            document.body.style.overflow = 'auto';
        },

        toDetails(item) {
            if (item.mystery === 1) {
                Toast(this.$t("mystery_user"));
                return;
            }
            if (item) {
                location.href = item.scheme_user_url;
            }
        },
        computedConstellationName(item) {
            return this.$t(this.constellationNameMap[item.cycle_type]);
        },
	},
  beforeDestroy () {
    window.document.body.style.backgroundColor = this.$list.backgroundColor;
  }
};
</script>
<style scoped lang="less">
.ellipsis {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.container {
	position: relative;
	background-color: #4d017b;
	overflow-x: hidden;
	padding-bottom: 0.02rem;
	.header {
		position: relative;
		width: 7.5rem;
		height: 9.08rem;
		background-repeat: no-repeat;
		background-position: center;
		background-size: contain;
		background-image: url("https://yaame-static.yaame.io/admin/efb8dbbb34edfedfd74e81af29b56b74.png");
		.avatar1 {
			position: absolute;
			top: 1.98rem;
			left: 2.1rem;
			width: 2.35rem;
			height: 2.41rem;
			.avatar1-img {
				position: absolute;
				top: 0.3rem;
				left: 0.37rem;
				width: 1.6rem;
				height: 1.6rem;
				background-color: #4413bf;
				border-radius: 50%;
				background-repeat: no-repeat;
				background-position: center;
				background-size: contain;
				background-image: url("https://yaame-static.yaame.io/admin/c04f9eb23583088840df37ea24f20a7c.png");
			}
			.avatar1-border {
				position: absolute;
				width: 100%;
				height: 100%;
				top: 0;
			}
		}
		.avatar2 {
			position: absolute;
			top: 1.71rem;
			right: 1.42rem;
			width: 1.8rem;
			height: 1.77rem;
			.avatar2-img {
				position: absolute;
				top: 0.24rem;
				left: 0.24rem;
				width: 1.14rem;
				height: 1.14rem;
				background-color: #4413bf;
				border-radius: 50%;
				background-repeat: no-repeat;
				background-position: center;
				background-size: contain;
				background-image: url("https://yaame-static.yaame.io/admin/c04f9eb23583088840df37ea24f20a7c.png");
			}
			.avatar2-border {
				position: absolute;
				width: 100%;
				height: 100%;
				top: 0;
			}
		}
		.name1 {
			width: 2.73rem;
			height: 0.88rem;
			position: absolute;
			top: 3.7rem;
			left: 1.88rem;
			background-repeat: no-repeat;
			background-position: center;
			background-size: contain;
			background-image: url("../../../assets/img/constellation/name.png");
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			.name1-text1 {
				font-size: 0.22rem;
				color: #ffd759;
				margin-bottom: 0.02rem;
                width: 2.73rem;
                padding: 0 0.4rem;
                line-height: 1.1;
                text-align: center;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2; /* 限制显示两行 */
                overflow: hidden;
                text-overflow: ellipsis;
                word-break: break-all; /* 强制在长单词或链接处换行 */
                white-space: normal; /* 允许折行 */
			}
			.name1-text2 {
				font-size: 0.24rem;
				line-height: 1.1;
				color: #ffd759;
				font-weight: bold;
			}
		}
		.name2 {
			width: 1.19rem;
			height: 0.5rem;
			position: absolute;
			top: 3.2rem;
			left: 4.59rem;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
      background: url("https://yaame-static.yaame.io/admin/c5160d953f2bf884a5e51fb3ade6eef5.png") no-repeat;
      background-size: contain;
      .name2-text1 {
				font-size: 0.22rem;
				line-height: 1.1;
				color: #A9FFFA;
				margin-bottom: 0.02rem;
                width: 1.8rem;
                line-height: 1.1;
                text-align: center;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2; /* 限制显示两行 */
                overflow: hidden;
                text-overflow: ellipsis;
                word-break: break-all; /* 强制在长单词或链接处换行 */
                white-space: normal; /* 允许折行 */
			}
			.name2-text2 {
				font-size: 0.22rem;
				line-height: 1.1;
				color: #a9fffa;
				font-weight: bold;
			}
		}
		.title-img {
			width: 5.89rem;
			height: 1.37rem;
			position: absolute;
			bottom: 0.3rem;
			left: 0.81rem;
		}
	}
	.card-swiper-container {
		position: absolute;
		width: 100%;
		top: 4.2rem;
		.swiper-arrow-left {
			position: absolute;
			top: 0.3rem;
			left: 0;
			width: 2.6rem;
			height: 2rem;
		}
		.swiper-arrow-right {
			position: absolute;
			top: 0.3rem;
			right: 0;
			width: 2.6rem;
			height: 2rem;
		}
		.card-swiper-wrapper {
			display: flex;
			transition-duration: 0.4s;
			&.no-duration {
				transition-duration: 0s;
				* {
					transition-duration: 0s !important;
				}
			}
			.card-swiper {
				flex: none;
				width: 1.7rem;
				height: 3rem;
				display: flex;
				justify-content: center;
				transform: translateZ(1px); // 解决模糊问题
				transition-duration: 0.4s;
				&.no-duration {
					transition-duration: 0s;
				}
				img {
					transition-duration: 0.4s;
					position: absolute;
					top: 0;
					left: 0;
					width: 1.7rem;
					height: 1.7rem;
				}
			}
			.card-swiper-cur {
				img {
					width: 2.2rem;
					height: 2.2rem;
					left: -0.25rem;
					top: 1.1rem;
				}
			}
			.card-swiper-prev {
				img {
					width: 1.84rem;
					height: 1.84rem;
					left: -0.2rem;
					top: 0.72rem;
				}
			}
			.card-swiper-next {
				img {
					width: 1.84rem;
					height: 1.84rem;
					left: 0.06rem;
					top: 0.72rem;
				}
			}
			// .card-swiper-prev-prev {
			// }
			// .card-swiper-next-next {
			// }
		}
		.swiper-mask {
			position: absolute;
			top: calc((4.5rem - 5.49rem) / 2);
			left: calc((7.5rem - 9.53rem) / 2);
			width: 9.53rem;
			height: 5.49rem;
			z-index: 1;
		}
		.arrow-left {
			position: absolute;
			width: 0.76rem;
			height: 0.98rem;
			top: 1.8rem;
			left: 0.2rem;
			z-index: 2;
		}
		.arrow-right {
			position: absolute;
			width: 0.76rem;
			height: 0.98rem;
			top: 1.8rem;
			right: 0.2rem;
			z-index: 2;
		}
	}
	.tab-container {
		width: 7.5rem;
		height: 0.93rem;
		padding: 0 0.45rem;
		display: flex;
		justify-content: space-between;
		align-items: end;
		.tab-item {
			width: 3.14rem;
			height: 0.82rem;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/1b63c68a8ffa3e9a46f31891dd789767.png);
			display: flex;
			justify-content: center;
			align-items: center;
			font-weight: 500;
			font-size: 0.24rem;
			color: #ffffff;
			padding: 0 0.68rem;
			text-align: center;
			line-height: 0.9;
			padding-top: 0.06rem;
			&.active {
				height: 0.93rem;
				background-image: url(https://yaame-static.yaame.io/admin/168a3b8f3b3d265e4834eaf574abb850.png);
				font-weight: 500;
				font-size: 0.24rem;
				color: #ffde8e;
				padding-top: 0.2rem;
			}
		}
	}
	.user-info {
		margin-top: 0.48rem;
		width: 6.96rem;
		height: 2.66rem;
		margin-left: 0.27rem;
		background-size: contain;
		background-repeat: no-repeat;
		background-image: url(https://yaame-static.yaame.io/admin/c47b6fe4d946452e8bc041701ab48eef.png);
		position: relative;
		.user-avatar {
			position: absolute;
			left: 0.55rem;
			top: 0.13rem;
			width: 1.94rem;
			height: 1.95rem;
			.avatar-img {
				width: 1.04rem;
				height: 1.04rem;
				border-radius: 50%;
				overflow: hidden;
				display: block;
				left: 0.46rem;
				position: absolute;
				top: 0.46rem;
				z-index: 2;
			}
			.dress-img {
				width: 1.94rem;
				height: 1.95rem;
				position: absolute;
				left: 0;
				top: 0;
				z-index: 1;
			}
		}
		.user-text {
			width: 4.57rem;
			height: 0.98rem;
			position: absolute;
			left: 1.84rem;
			top: 0.62rem;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/afd29610f04335cfba08d35dda7f5b70.png);
			padding: 0.07rem 0.2rem 0 0.61rem;
			.user-name {
				font-weight: 500;
				font-size: 0.24rem;
				color: #ffffff;
			}
			.user-has {
				font-weight: 500;
				font-size: 0.22rem;
				color: #ffffff;
				line-height: 1;
			}
		}
		.user-footer {
			width: 6.96rem;
			text-align: center;
			font-weight: normal;
			font-size: 0.22rem;
			color: #ffffff;
			position: absolute;
			left: 0;
			top: 2.06rem;
		}
	}
	.crystal-container {
		width: 6.96rem;
		height: 9.4rem;
		margin-top: 0.15rem;
		margin-left: 0.27rem;
		background-size: contain;
		background-repeat: no-repeat;
		background-image: url(https://yaame-static.yaame.io/admin/605c89a10f87ce7bc444efa8f782e9f7.png);
		display: flex;
		flex-wrap: wrap;
		padding: 1.17rem 0.16rem 0.2rem;
		margin-bottom: 0.2rem;
		.crystal-item {
			width: 1.6rem;
			height: 2.66rem;
			margin-right: 0.08rem;

			&:nth-of-type(4n) {
				margin-right: 0;
			}

			img {
				width: 1.6rem;
				height: 2rem;
			}
			p {
				width: 1.6rem;
				text-align: center;
				font-weight: 500;
				font-size: 0.22rem;
				color: #ffffff;
				margin-top: 0.1rem;
			}
		}
	}
	.reward-item {
		width: 7.06rem;
		height: 3.72rem;
		margin-bottom: 0.13rem;
		margin-left: 0.17rem;
		background-size: contain;
		background-repeat: no-repeat;
		background-image: url(https://yaame-static.yaame.io/admin/b454cbe924b9237e56148426d4278b18.png);
		padding-top: 0.38rem;
		position: relative;
		.reward-header {
			text-align: center;
			font-weight: normal;
			font-size: 0.22rem;
			color: #ffffff;
		}
		.reward-item-list {
			width: 6.96rem;
			height: 2rem;
			margin-top: 0.27rem;
			display: flex;
			justify-content: space-evenly;
			padding: 0 0.3rem;
			.reward-item-item {
				width: 1.3rem;
				height: 2rem;
				.img-div {
					width: 1.3rem;
					height: 1.3rem;
					background: #610599;
					border-radius: 0.16rem;
					border: 0.02rem solid #f2ddff;
					position: relative;
					display: flex;
					justify-content: center;
					align-items: center;
					img {
						width: 1rem;
						height: 1rem;
					}
					.reward-text {
						position: absolute;
						right: 0;
						top: 0;
						height: 0.26rem;
						line-height: 0.26rem;
						text-align: center;
						min-width: 0.7rem;
						padding: 0 0.1rem;
						background: #ee42ff;
						border-radius: 0 0.13rem 0 0.13rem;
						font-weight: 400;
						font-size: 0.16rem;
						color: #ffffff;
					}
				}
				.reward-name {
					width: 1.3rem;
          line-height: .22rem;
					font-size: 0.22rem;
					color: #ffffff;
					text-align: center;
					margin-top: 0.1rem;
				}
			}
		}
		.btn {
			width: 1.43rem;
			height: 0.59rem;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/19735af09915d1d0d01cfb1a74d831fd.png);
			text-align: center;
			position: absolute;
			top: 2.97rem;
			left: 50%;
			transform: translateX(-50%);
			font-weight: 500;
			font-size: 0.22rem;
			color: #ffffff;
			padding-top: 0.1rem;
			&.disabled {
				width: 1.7rem;
				height: 0.53rem;
				line-height: 0.53rem;
				color: #c46cff;
				padding-top: 0;
				background-image: url(https://yaame-static.yaame.io/admin/65c935476aca94a02292c7627037e660.png);
			}
		}
	}
	.flex-container {
		display: flex;
		justify-content: center;
		align-items: center;
		.success-popup {
			width: 7.06rem;
			height: 5.72rem;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/4c00b4a736859264b101e1391e3cee24.png);
			padding-top: 0.36rem;
            position: relative;
			.popup-header {
				text-align: center;
				.header-content {
					display: inline-block;
					font-weight: 500;
					font-size: 0.36rem;
					color: #ffffff;
					position: relative;
					text-align: center;
					&::before {
						content: "";
						display: block;
						width: 0.7rem;
						height: 0.26rem;
						background-size: contain;
						background-repeat: no-repeat;
						background-image: url(https://yaame-static.yaame.io/admin/3bd636cff58515250b5f04509a9994ac.png);
						position: absolute;
						left: -0.88rem;
						top: 0.16rem;
					}
					&::after {
						content: "";
						display: block;
						width: 0.7rem;
						height: 0.26rem;
						background-size: contain;
						background-repeat: no-repeat;
						background-image: url(https://yaame-static.yaame.io/admin/3bd636cff58515250b5f04509a9994ac.png);
						position: absolute;
						right: -0.88rem;
						top: 0.16rem;
						transform: rotate(180deg);
					}
				}
			}
			.reward-item-list {
				width: 7.06rem;
				height: 2.5rem;
				margin-top: 0.25rem;
				display: flex;
				justify-content: space-evenly;
				padding: 0 0.3rem;
				.reward-item-item {
					width: 1.5rem;
					height: 2.5rem;
					.img-div {
						width: 1.5rem;
						height: 1.5rem;
						background: #610599;
						border-radius: 0.16rem;
						border: 0.02rem solid #f2ddff;
						position: relative;
						display: flex;
						justify-content: center;
						align-items: center;
						img {
							width: 1.2rem;
							height: 1.2rem;
						}
						.reward-text {
							position: absolute;
							right: 0;
							top: 0;
							height: 0.26rem;
							line-height: 0.26rem;
							text-align: center;
							min-width: 0.7rem;
							padding: 0 0.1rem;
							background: #ee42ff;
							border-radius: 0 0.13rem 0 0.13rem;
							font-weight: 400;
							font-size: 0.16rem;
							color: #ffffff;
						}
					}
					.reward-name {
						width: 1.5rem;
						font-size: 0.22rem;
						color: #ffffff;
						text-align: center;
						margin-top: 0.1rem;
					}
				}
			}
            .close-icon {
                position: absolute;
                left: 2.53rem;
                top: 4.26rem;
                width: 2rem;
                height: 0.83rem;
                background-size: contain;
                background-repeat: no-repeat;
                background-image: url(https://yaame-static.yaame.io/admin/04e49572b627e01d7d5504b432cec4c6.png);
                text-align: center;
                line-height: 0.83rem;
                font-weight: 600;
                font-size: 0.32rem;
                color: #FFFFFF;
            }
		}
	}
}
</style>
