<!--
 * @Author: wujiang@weli.cn
 * @Date: 2023-12-07 17:29:17
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-08-07 17:21:14
 * @Description: 邀请别人
-->
<template>
	<div class="tab-box">
		<div class="code-box">
			<div class="title">{{ $t("your-code") }}</div>
			<div class="code">
				<div class="code-num">{{ invite_code }}</div>
				<img
					:data-clipboard-text="invite_code"
					@click="handleCopy(invite_code)"
					class="copy"
					src="https://yaame-static.yaame.io/admin/fcab82e62455d833d2971fb6a1796ae7.png"
					alt=""
				/>
			</div>
			<div class="tips">
				{{ $t("your-code-tips") }}
			</div>
		</div>
		<div class="rule">
			<div class="title">{{ $t("invite-rule") }}:</div>

			<div class="game-container" @click="openGame">
				<div class="game-header">
					<img
						src="https://yaame-static.yaame.io/admin/cfaa01e483054b262cd9171bd03d2bf8.png"
						alt=""
					/>
					<span v-if="region_id !== 'SOUTHEAST_ASIA'">{{ $t("game-header") }}</span>
					<span v-else>{{ $t("game-header-other") }}</span>
				</div>
				<div class="to-details">
					{{ $t("game-details") }}
					<img
						src="https://yaame-static.yaame.io/admin/fdb44adba1296c4923e8850b4bba4a59.png"
						alt=""
					/>
				</div>
				<div class="game-info">{{ $t("game-info") }}</div>
				<div class="game-gift">
					<div v-for="(item, index) in gameGiftList" :key="index">
                        <img :src="item" alt="">
                    </div>
				</div>
				<div class="game-btn">{{ $t("game-btn") }}({{ can_lottery_times }})</div>
			</div>

			<div class="desc">
				<div v-show="!specialRegionList.includes(region_id)" class="desc-rule">
					<div class="rule-text">{{ $t("invite-rule-0") }}</div>
					<div class="info">
						<p class="invite-person">{{ $t("inviter") }}</p>
						<p>
							<span class="diamond">+200</span
							><img
								src="https://imgcom.static.suishenyun.net/im_icon_zs-e6a435.png"
								alt=""
							/>
						</p>
					</div>
				</div>
				<div class="desc-rule">
					<div class="rule-text">{{ $t("invite-rule-1") }}</div>
					<div class="info">
						<p class="invite-person">{{ $t("inviter") }}</p>
						<p>
							<span class="diamond">{{ specialRegionList.includes(region_id) ? '+300' : '+500' }}</span
							><img
								src="https://imgcom.static.suishenyun.net/im_icon_zs-e6a435.png"
								alt=""
							/>
						</p>
					</div>
				</div>
				<div class="desc-rule">
					<div class="rule-text">{{ $t("invite-rule-2") }}</div>
					<div class="info">
						<p class="invite-person">{{ $t("inviter") }}</p>
						<p>
							<span class="diamond">{{ specialRegionList.includes(region_id) ? '+500' : '+800' }}</span
							><img
								src="https://imgcom.static.suishenyun.net/im_icon_zs-e6a435.png"
								alt=""
							/>
						</p>
					</div>
				</div>
				<div class="desc-rule" :class="getBackgroundStyle">
					<div class="rule-text">{{ $t("invite-rule-3") }}</div>
					<div class="info">
						<p class="invite-person">{{ $t("inviter") }}</p>
						<p>
							<span class="diamond">+10%</span
							><img
								src="https://imgcom.static.suishenyun.net/im_icon_zs-e6a435.png"
								alt=""
							/>
						</p>
					</div>
				</div>
				<!-- <p>{{ $t('invite-rule-3') }}</p>
        <p>{{ $t('invite-rule-4') }}</p> -->
			</div>
		</div>
		<div class="process">
			<div class="title">{{ $t("invite-process") }}:</div>
			<div class="detail">
				<div class="detail-info">
					<div class="order">
						<img src="../../../assets/img/invite/01.png" alt="" />
					</div>
					<div class="desc">
						<div class="invite-friend">{{ $t("invite-friend") }}</div>
						<div>{{ $t("support-download") }}</div>
					</div>
				</div>
				<div class="copy">
					<div class="left">{{ $t("goto-download") }}</div>
					<div
						class="right link"
						:data-clipboard-text="invite_link + `?language=${language}`"
						@click="handleCopyLink(invite_link + `?language=${language}`)"
					>
						<p>{{ $t("copy") }}</p>
					</div>
				</div>
			</div>
			<div
				class="detail"
				style="
					 
						margin-bottom: 0.4rem;
					
				"
			>
				<div class="detail-info">
					<div class="order">
						<img src="../../../assets/img/invite/02.png" alt="" />
					</div>
					<div class="desc">
						<p class="invite-friend">{{ $t("register-fill-invite") }}</p>
					</div>
				</div>
				<div class="copy">
					<div class="left">{{ $t("copy-invite-code") }}</div>
					<div
						class="right copy1"
						:data-clipboard-text="invite_code"
						@click="handleCopy1(invite_code)"
					>
						<p style="z-index: 99">{{ $t("copy") }}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import request from "@/lib/request/activity";
import Toast from "@/components/third/toast/toast.js";
import Clipboard from "clipboard";

const copyText = {
	"zh-cn": "复制成功",
	"zh-tw": "複製成功",
	en: "Copied successfully",
	ar: "تم النسخ بنجاح",
	id: "Salin berhasil",
};

export default {
	name: "InviteOther",
	components: {},
	data() {
		return {
			//invite_code: 123456,
			copySuccessText: "",
			invite_link: "https://www.yaame.io/InviteDownload.html",

            specialRegionList: ['PHILIPPINES', 'MIDDLE_EAST', 'SOUTHEAST_ASIA'],
		};
	},
	created() {
		this.copySuccessText = copyText[this.language];
	},
	methods: {
		/**
		 * @description: 复制邀请码
		 * @param {*}
		 * @return {*}
		 */
		handleCopy() {
			let clipboard = new Clipboard(".copy");
			clipboard.on("success", (e) => {
				Toast(this.copySuccessText);
				e.clearSelection();
			});
		},
		handleCopy1() {
			let clipboard = new Clipboard(".copy1");
			clipboard.on("success", (e) => {
				Toast(this.copySuccessText);
				e.clearSelection();
			});
		},

		handleCopyLink() {
			let clipboard = new Clipboard(".link");
			clipboard.on("success", (e) => {
				Toast(this.copySuccessText);
				e.clearSelection();
				// window.location.href = this.invite_link;
				// window.open(this.invite_link, "_blank");
			});
		},
        openGame() {
            this.$emit('openGame');
        },
	},
	computed: {
		getBackgroundStyle() {
			if (
				this.language === "in" ||
				this.language === "ar" ||
				this.language === "en"
			) {
				return "desc-rule-bg";
			} else return "";
		},
	},
	props: {
		invite_code: {
			default: "12345678",
			type: String,
		},
		language: {
			default: "en",
			type: String,
		},
        can_lottery_times: {
            default: 0,
            type: Number,
        },
        gameGiftList: {
            type: Array,
        },
        region_id: {
            type: String,
            default: '',
        },
	},
};
</script>
<style scoped lang="less">
.tab-box {
	width: 100%;
	.code-box {
		width: 6.1rem;
		// height: 2.94rem;
		background: url("https://yaame-static.yaame.io/admin/eb9d376d5589dea54d97bfad05dea278.png");
		background-size: 100% 100%;
		font-family: PingFangSC, PingFang SC;
		margin: 0.3rem auto 0.2rem;
		overflow-x: hidden;
		.title {
			width: 100%;
			height: 0.37rem;
			font-size: 0.26rem;
			font-weight: 700;
			color: #000000;
			line-height: 0.37rem;
			text-align: center;
			margin-top: 0.4rem;
			margin-bottom: 0.1rem;
		}
		.code {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			height: 0.81rem;
			.code-num {
				height: 0.81rem;
				font-size: 0.58rem;
				font-weight: 600;
				color: #000000;
				line-height: 0.81rem;
			}
			.copy {
				width: 0.3rem;
				height: 0.3rem;
				margin-left: 0.16rem;
			}
		}
		.tips {
			width: 4.83rem;
			font-size: 0.24rem;
			font-weight: 400;
			color: #192d29;
			line-height: 0.33rem;
			padding-top: 0.2rem;
			margin-left: 0.64rem;
			text-align: center;
			padding-bottom: 0.3rem;
		}
	}
	.rule {
		margin: 0.5rem 0.4rem 0;
		width: 6.1rem;
		font-weight: 400;
		.title {
			height: 0.33rem;
			width: 5rem;
			font-weight: 700;
			font-size: 0.28rem;
			color: #000000;
			line-height: 0.4rem;
			background-image: url("../../../assets/img/invite/lingBg.png");
			background-repeat: no-repeat;
			background-size: 26% 90%;
		}
		.game-container {
			width: 6.1rem;
			height: 2.78rem;
			margin: 0.2rem 0 0.3rem;
			background-size: 100% 100%;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/b24f65d9594ea02eca58c96fbb7a781c.png);
			position: relative;
			.game-header {
				width: 4rem;
				height: 0.3rem;
				line-height: 0.3rem;
				position: absolute;
				left: 0.31rem;
				top: 0.25rem;
				font-size: 0.26rem;
				font-weight: normal;
				color: #ffffff;
				img {
					width: 0.3rem;
					height: 0.3rem;
					display: inline-block;
					margin-right: 0.12rem;
				}
			}
			.to-details {
				height: 0.3rem;
				width: 1.82rem;
				position: absolute;
				left: 4.36rem;
				top: 0.2rem;
				font-size: 0.22rem;
				font-weight: 600;
				color: #ed6fb2;
				display: flex;
				align-items: center;
				img {
					width: 0.2rem;
					height: 0.2rem;
					margin-left: 0.1rem;
				}
			}
			.game-info {
				width: 5.5rem;
				position: absolute;
				left: 0.3rem;
				top: 0.73rem;
				font-size: 0.2rem;
				font-weight: 400;
				color: #ffffff;
				opacity: 0.8;
			}
			.game-gift {
				width: 3.22rem;
				height: 1.08rem;
				background: linear-gradient(
					180deg,
					#f6ccdf 0%,
					#ffffff 24%,
					#ffffff 52%,
					#fcedf5 86%,
					#fae4f0 100%
				);
				border-radius: 0.2rem;
				border: 0.02rem solid #b5799b;
				position: absolute;
				left: 0.3rem;
				top: 1.41rem;
				display: flex;
				justify-content: space-between;
				flex-wrap: nowrap;
				padding: 0.1rem;
				div {
					width: 0.94rem;
					height: 0.88rem;
					background: #ffcfe8;
					border-radius: 0.2rem;
					display: flex;
					justify-content: center;
					align-items: center;
					img {
						width: 0.88rem;
						height: auto;
					}
				}
			}
			.game-btn {
				width: 2.38rem;
				height: 1.06rem;
				background-size: contain;
				background-repeat: no-repeat;
				background-image: url(https://yaame-static.yaame.io/admin/89874ec0bed650be080f383443f83cb9.png);
				position: absolute;
				left: 3.55rem;
				top: 1.47rem;
				text-align: center;
				line-height: 1.04rem;
				font-size: 0.22rem;
				font-weight: 600;
				color: #3b3924;
			}
		}
		.desc {
			margin-top: 0.25rem;
			font-size: 0.24rem;
			color: #7e8b85;
			line-height: 0.33rem;
			.desc-rule {
				width: 6.1rem;
				min-height: 1.46rem;
				margin-bottom: 0.2rem;
				background-image: url("../../../assets/img/invite/rule.png");
				background-size: 100% 100%;
				display: flex;
				align-items: center;
				padding: 0 0 0 0.3rem;
				.rule-text {
					margin: 0.2rem 0;
					width: 4.25rem;
					color: #482835;
					font-size: 0.24rem;
				}
				.info {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					p {
						margin: 0 0 0 0.15rem;
						color: #ffffff;
					}
					.invite-person {
						font-size: 0.22rem;
					}
					.diamond {
						font-size: 0.3rem;
						font-weight: 700;
					}
					img {
						width: 0.33rem;
						height: 0.33rem;
						margin-right: 0.02rem;
						margin-top: 0.02rem;
					}
				}
			}
			.desc-rule-bg {
				background-image: url("../../../assets/img/invite/rule1.png");
			}
			p {
				margin-bottom: 0.2rem;
			}
		}
	}
	.process {
		margin: 0.3rem 0.4rem 0;
		width: 6.1rem;
		font-family: PingFangSC, PingFang SC;
		.title {
			height: 0.33rem;
			width: 5rem;
			font-size: 0.28rem;
			color: #000000;
			line-height: 0.4rem;
			font-weight: 700;
			background-image: url("../../../assets/img/invite/lingBg.png");
			background-repeat: no-repeat;
			background-size: 26% 100%;
		}
		.detail {
			width: 6.1rem;
			padding: 0.26rem 0 0.23rem 0.2rem;
			border-radius: 0.3rem;
			// height: 2.51rem;
			margin-top: 0.2rem;
			margin-bottom: 0.4rem;
			background-image: url("../../../assets/img/invite/processBg.png");
			background-size: 100% 100%;
			border-radius: 0.24rem;
			.detail-info {
				box-sizing: border-box;
				display: flex;
				flex-direction: row;
				// margin: .26rem 0 .23rem .20rem;
				// height: .75rem;
				margin: 0rem 0 0 0.1rem;
				.order {
					height: 0.68rem;
					img {
						width: 0.68rem;
						height: 0.68rem;
					}
				}
				.desc {
					// height: .68rem;
					margin-left: 0.2rem;
					font-size: 0.22rem;
					color: #6d3116;
					.invite-friend {
						font-size: 0.24rem;
						font-weight: 700;
					}
				}
			}
			.copy {
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 5.5rem;
				margin: 0.26rem 0 0 0.1rem;
				padding: 0.2rem 0 0.2rem 0.3rem;
				font-size: 0.22rem;
				background-image: url("../../../assets/img/invite/borderImg.png");
				background-size: 100% 100%;
				//  border:0.01rem solid linear-gradient(117deg, #EFCDA6, #FFE2CE, #FFF9C6);
				.left {
					width: 4rem;
					// height: .6rem;
					line-height: 0.3rem;
					font-family: PingFangSC, PingFang SC;
					color: #6d3116;
				}
				.right {
					height: 0.8rem;
					width: 1.58rem;
					display: flex;
					align-items: center;
					justify-content: center;
					background-image: url("../../../assets/img/invite/copyBtn.png");
					background-size: cover;
					font-size: 0.24rem;
					font-weight: 600;
					color: #ffffff;
					img {
						width: 100%;
						height: 100%;
					}
				}
			}
		}
	}
}
</style>
