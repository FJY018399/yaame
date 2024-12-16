<!--
 * @Author: Se7enElk
 * @Date: 2022-11-09 11:13:38
 * @FilePath: /yaame-h5/src/pages/levelPrivileges/levelPrivileges.vue
 * @Description: 
-->
<template>
	<div ref="level" class="level" :style="getBackground()">
		<header
			:style="{
				background: isShow ? '#FFF' : 'transparent',
				height: safeHeight + 1.18 + 'rem',
				paddingTop: safeHeight + 'rem',
			}"
			:class="['page-header', language === 'ar' && 'arabia-header']"
		>
			<img
				v-if="isShow"
				src="../../assets/img/common/icon_back_blank.png"
				alt=""
				class="back"
				@click="back"
			/>
			<img
				v-else
				src="../../assets/img/common/icon_back_white.png"
				alt=""
				class="back"
				@click="back"
			/>
			<div class="header-content">
				<div
          v-if="ver_code < 11800"
					:style="{
						color: isShow ? '#000' : '#fff',
						opacity: active === 0 ? '1' : '0.2',
					}"
					class="header-item"
					@click="swipeTo(0)"
				>
					{{ $t("wealthLevel") }}
				</div>
				<div
					:style="{
						color: isShow ? '#000' : '#fff',
						opacity: active === 1 ? '1' : '0.2',
					}"
					class="header-item"
					@click="swipeTo(1)"
				>
					{{ $t("popularLevel") }}
				</div>
			</div>
            <div class="right" @click="rightClick">
                <img v-if="isShow" src="http://imgcom.static.suishenyun.net/nav_icon_kf_b@2x-de8976.png" class="info-img">
                <img v-else src="http://imgcom.static.suishenyun.net/my_icon_lx@2x-6587ea.png" class="info-img">
            </div>
		</header>

		<div class="user-info">
			<div class="user-avatar">
				<img :src="userInfo.avatar" alt="" />
			</div>

			<div class="progress-container">
				<div class="progress">
					<div
						:style="{
							width: calculateProgressBar(
								userInfo.level_point - userInfo.current_level_start_point,
								userInfo.current_level_end_point -
							    userInfo.current_level_start_point
							),
						}"
						class="progress-width"
					></div>
				</div>

				<div class="progress-info">
					<span>Lv.{{ userInfo.user_level }}</span>
					<em
						v-if="
							(active === 0 && userInfo.user_level < 200) ||
							(active === 1 && userInfo.user_level < 100)
						"
						>{{ userInfo.level_point - userInfo.current_level_start_point }}/{{
							userInfo.current_level_end_point -
							userInfo.current_level_start_point
						}}</em
					>
					<span
						>Lv.{{
							userInfo.user_level + 1 > 200 ? 200 : userInfo.user_level + 1
						}}</span
					>
				</div>
			</div>
		</div>

		<div v-if="userInfo.level_up_multiple_items && userInfo.level_up_multiple_items.length" class="default-container level-up">
			<header>
				<div>{{ $t("expSpeedUp") }}</div>
			</header>
            <p class="level-up-title">
                {{ $t("currentSpeedUp") }}
            </p>
            <div class="level-up-list">
                <div v-for="(item, index) in userInfo.level_up_multiple_items" :key="index" :class="['level-up-item', !item.multiple && 'disabled']">
                    <div class="level-up-item-content">
                        <img src="https://yaame-static.yaame.io/admin/51dc4819ee24e69a3acd7c1fd47752cc.png" alt="">
                        {{ item.source_tip }} <span v-show="item.multiple">{{ item.multiple }}</span>
                    </div>
                </div>
            </div>
            <p class="level-up-info">
                {{ $t("currentExp", [computedMultiple(userInfo.level_up_multiple_items)]) }}
            </p>
		</div>

		<div class="default-container level-ranges">
			<header>
				<div>{{ $t("levelReward") }}</div>
			</header>

			<div class="ranges-list">
				<div v-if="index !== 10" v-for="(item, index) in userInfo.level_ranges" class="ranges-item">
					<img :src="item.level_range_icon" alt="" />
					<p>{{ index !== 9 ? item.level_range_tip : item.level_range_tip.split('-')[0] + '-' +  (parseInt(item.level_range_tip.split('-')[1]) + 1) }}</p>
				</div>
			</div>
		</div>

		<div class="default-container level-rewards">
			<header>
				<div>{{ $t("MoreReward") }}</div>
			</header>

			<div class="rewards-list">
				<div
					v-for="(item, index) in userInfo.level_rewards"
					class="rewards-item"
				>
					<div class="rewards-img" @click="rewardClick(item)">
						<img :src="item.reward_icon" alt="" />
                        <p v-if="item.reward_type === 'FUNCTION_INCOME_ROBBIN'" class="income">
                            <img :src="item.level_icon" alt="">
                            <span class="income-name no-wrap">{{ userInfo.nick_name }}</span>
                            <span class="income-end no-wrap">{{ $t('income') }}</span>
                        </p>
					</div>
					<p class="rewards-name no-wrap">{{ item.level_tip }}</p>
					<p class="rewards-tip">{{ item.reward_tip }}</p>
				</div>
			</div>
		</div>

		<div class="default-container level-methods">
			<header>
				<div>{{ $t("toUpLevel") }}</div>
			</header>

			<div class="methods-list">
				<div
					v-for="(item, index) in userInfo.level_up_methods"
					class="methods-item"
				>
					<img :src="item.method_icon" alt="" />
					<div class="methods-info">
						<div class="methods-name">{{ item.method_title }}</div>
						<div class="methods-tip">{{ item.method_desc }}</div>
					</div>
				</div>
			</div>
		</div>

		<SVGAViewer
			v-show="svgaShow"
			:svgaUrl="svgaUrl"
			@close="svgaShow = false"
		/>
		<popup v-if="imgPreviewShow">
			<div class="image-viewer">
				<img
					src="http://imgcom.static.suishenyun.net/profile_icon_close@2x-9086c0.png"
					alt=""
					class="close"
					@click="imgPreviewShow = false"
				/>
                <div v-if="isAvatar" class="avatar-div">
                    <div class="img-box">
                        <img :src="imgPreview.img" class="avatar-bg" alt="">
                        <img :src="avatar" class="avatar" alt="">
                    </div>
                </div>
				<div v-else class="img-div">
                    <img :src="imgPreview.img" alt="" class="img" />
                    <p v-if="imgPreview.reward_type === 'FUNCTION_INCOME_ROBBIN'" class="income big-income">
                        <img :src="imgPreview.level_icon" alt="">
                        <span class="income-name no-wrap">{{ userInfo.nick_name }}</span>
                        <span class="income-end no-wrap">{{ $t('income') }}</span>
                    </p>
                </div>
				<p class="name">{{ imgPreview.name }}</p>
				<p class="time">{{ imgPreview.time }}</p>
			</div>
		</popup>
	</div>
</template>

<script>
import {getSafeHeight, getXVerCode} from "../../lib/device";
import wealthLevel from "../../lib/request/wealthLevel";
import popup from "../../components/common/pop_up.vue";
import SVGAViewer from "../../components/common/SVGAViewer.vue";
import { getScrollTop, getQueryString } from "../../lib/utils";
import { ImagePreview } from "vant";
import { getLanguage } from '../../lib/device';
const exportDefaultInfo = () => {
	return {
		avatar: "",
		current_level_end_point: null,
		current_level_start_point: null,
		level_point: null,
		level_ranges: [],
		level_rewards: [],
		level_up_methods: [],
        level_up_multiple_items: [],
		main_color: "",
		uid: null,
		user_level: null,
		nick_name: "-",
        contact_customer: {
            icon_url: '',
            scheme_url: ''
        }
	};
};

export default {
	name: "Level",
	components: {
		popup,
		SVGAViewer,
	},
	data() {
		return {
      // 版本号
      ver_code: 0,
      // 安全高度
			safeHeight: 0,

			active: Number(getQueryString("active") || 0),
			isShow: false,

			wealthInfo: exportDefaultInfo(),

			popularInfo: exportDefaultInfo(),

			svgaShow: false,
			svgaUrl: "",

			imgPreview: {
				img: "",
				name: "",
				time: "",
                reward_type: '',
                level_icon: ''
			},
			imgPreviewShow: false,

            isAvatar: false,

            avatar: ''
		};
	},
	mounted() {
    // 获取版本号  新版本用户登录老版本隐藏财富等级
    this.ver_code = this.$root.wealthData.data.new_wealth_flag ? 11800 : getXVerCode();
		// 获取基本数据
		let safeArea = getSafeHeight() || 40;
		this.safeHeight = (safeArea * 2) / 100;

		window.addEventListener("scroll", this.pageChange);
		this.getBaseInfo();
		document.title = "";
	},
	beforeDestroy() {
		window.removeEventListener("scroll", this.pageChange);
	},
	computed: {
		userInfo() {
			if (this.active === 0) {
				return this.wealthInfo;
			} else {
				return this.popularInfo;
			}
		},
        language() {
            return getLanguage() || 'en';
        },
	},
	methods: {
		rewardClick(reward) {
            if (reward.reward_type === 'DRESS_UP_AVATAR_DRESS' || reward.reward_type === 'DRESS_UP_MIKE_HALO') {
                this.imgPreview = {
                    img: reward.reward_icon,
                    name: reward.reward_tip,
                    time: reward.level_tip,
                    reward_type: reward.reward_type,
                    level_icon: reward.level_icon || ''
                };
                this.isAvatar = true;
                this.imgPreviewShow = true;
            } else if (reward.reward_type === 'EXCLUSIVE_GIFT'){
                this.isAvatar = false;
                if (reward.reward_svga_url) {
                    this.svgaUrl = reward.reward_svga_url;
                    this.svgaShow = true;
                } else if (reward.reward_icon) {
                    this.imgPreview = {
                        img: reward.reward_icon,
                        name: reward.reward_tip,
                        time: reward.level_tip,
                        reward_type: reward.reward_type,
                        level_icon: reward.level_icon || ''
                    };
                    this.imgPreviewShow = true;
                }
            } else {
                this.isAvatar = false;
                this.imgPreview = {
                    img: reward.reward_icon,
                    name: reward.reward_tip,
                    time: reward.level_tip,
                    reward_type: reward.reward_type,
                    level_icon: reward.level_icon || ''
                };
                this.imgPreviewShow = true;
            }
			
		},
		calculateProgressBar(currentValue, maxValue) {
			const progressBarWidth = 6.3; // 进度条宽度，单位为 rem

			// 处理边际情况
			if (currentValue <= 0) {
				return "0rem"; // 当前值小于等于0时，进度条宽度为0
			}

			if (currentValue >= maxValue) {
				return progressBarWidth + "rem"; // 当前值大于等于满值时，进度条宽度为满值的宽度
			}

      // 达到200等级
      if (this.userInfo.user_level === 200) return progressBarWidth + "rem";

			const ratio = currentValue / maxValue; // 计算当前值与满值的比例
			const progressWidthRem = progressBarWidth * ratio; // 计算进度条宽度的 rem 单位

			return progressWidthRem + "rem"; // 返回带有适当单位的进度条宽度
		},
		getBackground() {
			return {
				"background-image": `url(${this.userInfo.bg_img})`,
				"padding-top": this.safeHeight + 1.18 + "rem",
			};
		},
		/**
		 * @description: 获取页面基本数据
		 */
		getBaseInfo() {
			let level_type = this.active === 0 ? "wealth" : "popular";
      // 获取全局注入数据使用一次清空
      if (this.$root.wealthData) {
        if (this.$root.wealthData.status === 1000) {
          this.avatar = this.$root.wealthData.data.avatar;
          if (this.$root.wealthData.data.level_up_multiple_items) {
            // 排序res.data.level_up_multiple_items  item.multiple为0的排到后面
            this.$root.wealthData.data.level_up_multiple_items.sort((a, b) => {
              if (a.multiple === 0) {
                return 1;
              } else if (b.multiple === 0) {
                return -1;
              } else {
                return 0;
              }
            });
          }
          if (this.active === 0) {
            this.wealthInfo = this.$root.wealthData.data;
          } else {
            this.popularInfo = this.$root.wealthData.data;
          }
        }
        // 清空首次数据判断
        this.$root.wealthData = null;
      } else {
        // 正常获取数据
        wealthLevel.getWealthLevel({ level_type }).then((res) => {
          if (res.status === 1000) {
            this.avatar = res.data.avatar;
            if (res.data.level_up_multiple_items) {
              // 排序res.data.level_up_multiple_items  item.multiple为0的排到后面
              res.data.level_up_multiple_items.sort((a, b) => {
                if (a.multiple === 0) {
                  return 1;
                } else if (b.multiple === 0) {
                  return -1;
                } else {
                  return 0;
                }
              });
            }
            if (this.active === 0) {
              this.wealthInfo = res.data;
            } else {
              this.popularInfo = res.data;
            }
          }
        });
      }
		},
		swipeTo(val) {
			// this.$refs.swiper.swipeTo(val);
			this.active = val;
			this.getBaseInfo();
		},
		onChange(val) {
			this.active = val;
			this.getBaseInfo();
		},
		pageChange() {
			const scroll_top = getScrollTop();
			if (scroll_top > 10) {
				this.isShow = true;
			} else {
				this.isShow = false;
			}
		},
		/**
		 * @description: 返回上一级
		 */
		back() {
			location.href = "wlyaame://webview/back";
		},
		/**
		 * @description: header组件右侧点击
		 * @param {*}
		 * @return {*}
		 */
		rightClick() {
			location.href = this.userInfo.contact_customer.scheme_url;
		},

        computedMultiple(arr) {
            if (!arr) return '1';
            let str = arr.reduce((pre, cur) => {
                if (!cur.multiple) return pre;
                return pre ? pre + ' + ' + cur.multiple : cur.multiple;
            }, '');
            if (Number(str) === 1) {
                return '1';
            }
            return `(${str})`
        }
	},
};
</script>

<style lang="less" scoped>
.level {
	position: relative;
	min-height: 100vh;
	width: 100vw;
	max-width: 100vh;
	overflow-x: scroll;
	background-size: contain;
	background-repeat: no-repeat;
	padding-bottom: 0.3rem;
	.page-header {
		display: flex;
		height: 1.18rem;
		line-height: 1.18rem;
		width: 100%;
		font-size: 0.34rem;
		color: #fff;
		text-align: center;
		position: fixed;
		z-index: 9999;
		top: 0;
		left: 0;
		align-items: center;
		justify-content: center;
		background-color: transparent;
		.back {
			width: 0.4rem;
			height: 0.4rem;
			position: absolute;
			left: 0.3rem;
			bottom: 0.36rem;
		}
		.right {
			width: 0.6rem;
			height: 1.18rem;
			position: absolute;
			right: 0.3rem;
			display: flex;
			justify-content: right;
			align-items: center;
			img {
				width: 0.36rem;
			}
		}
		.header-content {
			width: 4.6rem;
			height: 1.18rem;
			position: absolute;
			height: 0.4rem;
			line-height: 0.4rem;
			left: 50%;
			transform: translate(-50%, -0%);
			display: flex;
			justify-content: space-between;
			.header-item {
				flex: 1;
				// width: 1.8rem;
				text-align: center;
				color: #fff;
			}
		}
	}
	.user-info {
		width: 7.5rem;
		height: 3rem;
		display: flex;
		justify-content: center;
		padding-top: 0.4rem;
		flex-wrap: wrap;
		.user-avatar {
			width: 1.42rem;
			height: 1.42rem;
			border-radius: 50%;
			border: 0.06rem solid rgba(255, 255, 255, 0.4);
			display: flex;
			align-items: center;
			justify-content: center;
			img {
				width: 1.35rem;
				height: 1.35rem;
				border-radius: 50%;
			}
		}
		.progress-container {
			width: 6.3rem;
			height: 1rem;
			margin-top: 0.48rem;
			.progress {
				width: 6.3rem;
				height: 0.16rem;
				background: rgba(255, 255, 255, 0.2);
				border-radius: 0.1rem;
				.progress-width {
					width: 0rem;
					height: 0.16rem;
					background-color: #fff;
					border-radius: 0.1rem;
				}
			}
			.progress-info {
				margin-top: 0.22rem;
				width: 6.3rem;
				height: 0.6rem;
				display: flex;
				justify-content: space-between;
				font-size: 0.24rem;
				color: #fff;
				font-weight: 500;
				em {
					transform: scale(0.833333);
					font-weight: normal;
					opacity: 0.6;
					font-style: normal;
				}
			}
		}
	}
	.default-container {
		width: 7.5rem;
		background: #ffffff;
		border-radius: 0.24rem;
		header {
			width: 7.5rem;
			height: 1rem;
			padding: 0 0.3rem;
			div {
				width: 6.9rem;
				height: 1rem;
				line-height: 1rem;
				font-size: 0.28rem;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: #333333;
				border-bottom: 0.01rem solid #eee;
			}
		}
	}
    .level-up {
        margin-top: 0.4rem;
        min-height: 3.39rem;
        padding-bottom: 0.3rem;
        .level-up-title {
            font-weight: 400;
            font-size: 0.24rem;
            color: #333333;
            margin-top: 0.3rem;
            margin-bottom: 0.2rem;
            margin-left: 0.3rem;
        }
        .level-up-list {
            margin-left: 0.3rem;
            width: 6.9rem;
            min-height: 0.84rem;
            padding: 0.2rem;
            background: #F9F9F9;
            border-radius: 0.24rem;
            display: flex;
            flex-wrap: wrap;
            .level-up-item {
                min-width: 1.14rem;
                // max-width: 1rem;
                padding: 0.1rem 0.12rem;
                height: 0.44rem;
                background: #FBF7DE;
                border-radius: 0.06rem;
                border: 0.02rem solid #FAE5C5;

                transform: skewX(-10deg);
                margin-right: 0.06rem;
                .level-up-item-content {
                    text-align: center;
                    line-height: 0.2rem;
                    transform: skewX(10deg);
                    font-size: 0.2rem;
                    color: #333333;
                    img {
                        width: 0.24rem;
                        height: auto;
                        position: relative;
                        bottom: 0.02rem;
                    }
                }
                &.disabled {
                    background: #E9E9E9;
                    border: 0.02rem solid #CFCFCF;
                    color: #999;
                    img {
                        filter: grayscale(100%);
                    }
                }
            }
        }
        .level-up-info {
            font-weight: 400;
            font-size: 0.24rem;
            color: #999999;
            margin-top: 0.2rem;
            margin-left: 0.3rem;
        }
    }
	.level-ranges {
		margin-top: 0.1rem;
		.ranges-list {
			padding: 0.3rem;
			padding-bottom: 0.1rem;
			width: 7.5rem;
			min-height: 3rem;
			display: flex;
			flex-wrap: wrap;
			.ranges-item {
				width: 1.22rem;
				height: 1.1rem;
				margin-bottom: 0.2rem;
				background: #f9f9f9;
				border-radius: 0.24rem;
				margin-right: 0.2rem;
				padding: 0.2rem 0.16rem 0;
				&:nth-child(5n) {
					margin-right: 0;
				}
				img {
					display: block;
					width: 0.9rem;
					height: 0.36rem;
				}
				p {
					margin-top: 0.08rem;
					text-align: center;
					width: 120%;
					margin-left: -10%;
					font-weight: 600;
					color: #999999;
					font-size: 0.22rem;
					transform: scale(0.91777);
				}
			}
		}
	}
	.level-rewards {
		margin-top: 0.1rem;
		.rewards-list {
			width: 7.5rem;
			padding: 0.3rem;
			display: flex;
			flex-wrap: wrap;
			.rewards-item {
				width: 2.14rem;
				height: 3.22rem;
				margin-right: 0.24rem;
				&:nth-child(3n) {
					margin-right: 0;
				}
				.rewards-img {
					width: 2.14rem;
					height: 2.14rem;
					background: #f9f9f9;
					border-radius: 0.24rem;
					display: flex;
					justify-content: center;
					align-items: center;
                    position: relative;
					img {
						width: 1.8rem;
						height: auto;
					}
                    
				}
				.rewards-name {
					width: 2.14rem;
					text-align: center;
					font-size: 0.28rem;
					font-weight: 600;
					color: #333333;
                    margin-top: 0.1rem;
				}
				.rewards-tip {
					width: 2.14rem;
					text-align: center;
					font-weight: 600;
					margin-top: 0.1rem;
					font-size: 0.24rem;
					color: #999999;
					margin-top: 0.02rem;
                    line-height: 1;
				}
			}
		}
	}
	.level-methods {
		margin-top: 0.1rem;
		.methods-list {
			width: 7.5rem;
			padding: 0.5rem 0.3rem 0.3rem;
			.methods-item {
				width: 6.9rem;
				height: 0.75rem;
				margin-bottom: 0.5rem;
				&:last-child {
					margin-bottom: 0;
				}
				display: flex;
				justify-content: space-between;
				flex-wrap: nowrap;
				align-items: center;
				img {
					width: 0.54rem;
					height: 0.54rem;
				}
				.methods-info {
					width: 6.36rem;
					height: 0.75rem;
					padding-left: 0.1rem;
					.methods-name {
						width: 6.36rem;
						font-size: 0.26rem;
						font-family: PingFangSC-Semibold, PingFang SC;
						font-weight: 600;
						color: #333333;
					}
					.methods-tip {
						font-size: 0.22rem;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #999999;
					}
				}
			}
		}
	}
	.image-viewer {
		width: 5.9rem;
		height: 5.03rem;
		background: #ffffff;
		border-radius: 0.24rem;
		position: absolute;
		padding-top: 0.5rem;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
		.close {
			width: 0.22rem;
			height: 0.22rem;
			position: absolute;
			top: 0.3rem;
			right: 0.3rem;
		}
        .img-div{
            width: 5.9rem;
            height: 2.6rem;
            display: flex;
            justify-content: center;
            align-items: center;
            .img {
                width: 2.6rem;
                height: auto;
            }
        }
        .avatar-div{
            width: 5.9rem;
            height: 2.6rem;
            display: flex;
            justify-content: center;
            align-items: center;

            .img-box{
                width: 2.6rem;
                height: 2.6rem;
                background-size: contain;
                background-repeat: no-repeat;
                position: relative;
                .avatar{
                    width: 1.6rem;
                    height: 1.6rem;
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 1;
                    border-radius: 50%;
                }
                .avatar-bg{
                    width: 2.6rem;
                    height: 2.6rem;
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 2;
                }
            }
        }
		
		.name {
			font-size: 0.34rem;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: #333333;
			margin-top: 0.4rem;
            text-align: center;
		}
		.time {
			font-size: 0.24rem;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: #999999;
			margin-top: 0.12rem;
            text-align: center;
		}
	}
}
.income.big-income{
    top: 1.7rem;
    left: 2.04rem;
    transform: scale(1.5);
}
.income{
    width: 1.4rem;
    height: 0.2rem;
    line-height: 0.2rem;
    position: absolute;
    top: 0.98rem;
    left: 0.26rem;
    font-size: 0.24rem;
    color: #fff;
    img{
        width: auto !important;;
        height: 0.17rem !important;

    }
    .income-name{
        display: inline-block;
        width: 1rem;
        height: 0.24rem;
        transform: scale(0.5);
        color: #FAC556;
        position: absolute;
        left: 0.3rem;
        top: -0.01rem;
    }
    .income-end{
        display: inline-block;
        width: 1rem;
        height: 0.24rem;
        transform: scale(0.5);
        position: absolute;
        left: 0.8rem;
        top: -0.01rem;
    }
}
</style>
