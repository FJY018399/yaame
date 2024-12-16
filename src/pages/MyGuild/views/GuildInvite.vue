<template>
	<div :style="{ paddingTop: safe_height + 1.08 + 'rem' }" class="main">
		<Header
			:keep="true"
			:keepColor="false"
			style="position: fixed"
		>{{ $t('GuildMembers') }}</Header>
		<div class="content">
			<div class="input-container">
				<input
					placeholder="Yaame ID"
					:value="uid"
                    type="text"
                    @input="handleInput($event)"
				/>
				<div class="seek" @click="handleSeek">{{ $t('seek') }}</div>
			</div>
			<div v-if="userInfo" class="user-details">
				<img class="user-avatar" :src="userInfo.avatar" alt="" />
				<div class="user-info">
					<p class="user-name wrap">{{ userInfo.nick_name }}</p>
					<p class="no-wrap">Yaame ID：{{ userInfo.yaame_id }}</p>
				</div>
			</div>
			<div v-if="userInfo && !userInfo.guild_id" :class="['invite-btn', invite_status === 1 && 'disabled']" @click="handleInvite">{{ buttonText }}</div>


            <div v-if="emptyVisible" class="empty-box">
                <img src="https://yaame-static.yaame.io/admin/5ed815456f72599af248801595be684a.png" alt="">
                <p>None</p>
            </div>
		</div>


        <popup v-if="inviteVisible" class="flex-box">
			<div class="container">
				<p class="container-title">Tips</p>
				<div class="container-content">
					{{ inviteDesc }}
				</div>
				<div class="container-footer">
					<div @click="inviteVisible = false;">{{ $t('cancel') }}</div>
				</div>
			</div>
		</popup>
	</div>
</template>

<script>
import Header from "../../../components/common/header.vue";
import { getSafeHeight } from "../../../lib/device";
import request from "../../../lib/request/withdraw";
import refresh from "../../../components/common/refresh.vue";
import popup from "../../../components/common/pop_up.vue";
import { Toast } from "vant";
export default {
	components: {
		Header,
		refresh,
		popup,
	},
	data() {
		return {
			safe_height: 0,
			uid: "",
			userInfo: false,
			// userInfo: {
			//     uid: null,
			//     nick_name: "-",
			//     avatar: 'https://static.yaame.io/admin/8c3b0cd98d7a833f42ceb6612a8362c7.png',
			//     yaame_id: null
			// }
            emptyVisible: false,
            invite_status: 0,

            inviteVisible: false,
            inviteDesc: "",
		};
	},
	methods: {
		// handleInput(event) {
		// 	let value = event.target.value;
        //     if (!!value && !value.match(/^[A-Za-z0-9]+$/)) {
        //         Toast(this.$t('pleaseEnterCorrectYaameID'));
		// 		return;
        //     }
		// 	this.uid = value;
        //     event.target.value = value;
		// },
        handleInput(event) {
            let value = event.target.value;
            const regex = /^[A-Za-z0-9]*$/; // 允许空字符串以便清空输入
            if (regex.test(value)) {
                this.uid = value;
            } else {
                // 下次更新周期时，输入框将自动与this.uid保持同步
                // 因为它们是通过v-model或其他方式绑定的
                this.$nextTick(() => {
                    event.target.value = this.uid;
                });
            }
        },
		async handleSeek() {
			if (this.uid) {
				try {
					let res = await request.queryGuildsUserInfo(this.uid);
					if (res.status === 1000) {
                        if (JSON.stringify(res.data) === "{}") {
                            this.emptyVisible = true;
                            this.userInfo = false;
                        } else {
                            this.emptyVisible = false;
                            this.userInfo = res.data;
                            if (this.userInfo.guild_id) {
                                Toast(res.data.remind_tip)
                            }
                            this.invite_status = res.data.invite_status;
                            if (res.data.invite_status === 1) {
                                this.buttonText = this.$t('invited')
                            } else {
                                this.buttonText = this.$t('invite')
                            }
                        }
                    } else {
                        Toast(res.desc);
                    }
					
				} catch (error) {
					console.log(error);
				}
			} else {
				Toast(this.$t('pleaseEnterCorrectYaameID'));
			}
		},
        async handleInvite() {
            if (this.invite_status === 1) return;
            if (!this.userInfo) {
                Toast(this.$t('pleaseEnterCorrectYaameID'));
            }
            try {
                let res = await request.inviteGuildsUser({
                    invite_uid: this.userInfo.uid,
                });
                if (res.status === 1000) {
                    Toast(this.$t('inviteSuccess'));
                    this.invite_status = 1;
                } else {
                    // Dialog.alert({
                    //     title: this.$t('tips'),
                    //     message: res.desc,
                    //     confirmButtonText: this.$t('confirm'),
                    // });

                    this.inviteDesc = res.desc;
                    this.inviteVisible = true;

                }
            } catch (error) {
                console.log(error);
            }
        }
	},
	mounted() {
		let safe_area = getSafeHeight() || 0;
		this.safe_height = (safe_area * 2) / 100;
	},
};
</script>

<style lang="less" scoped>
.main {
	width: 100%;
	height: 100%;
	position: relative;
	.content {
		width: 7.5rem;
		min-height: calc(100vh - 2rem);
		background: #ffffff;
		border-radius: 0.3rem 0.3rem 0px 0px;
		padding: 0.3rem;
		.input-container {
			width: 6.9rem;
			height: 1rem;
			border-radius: 0.5rem;
			background: #f4f8fb;
			position: relative;
			input {
				width: 6.9rem;
				height: 1rem;
				border-radius: 0.5rem;
				background: #f4f8fb;
				border: none;
				font-size: 0.32rem;
				font-weight: 500;

				color: #333333;
				line-height: 1rem;
				padding-left: 0.4rem;
				padding-right: 2.2rem;
				position: absolute;
				top: 0;
				left: 0;
			}
			.seek {
				width: 1.8rem;
				height: 0.8rem;
				text-align: center;
				line-height: 0.8rem;
				border-radius: 0.48rem;
				background-size: contain;
				background-image: url(https://yaame-static.yaame.io/admin/6607f2ee004f2b9d768e3d2348b4740c.png);
				background-repeat: no-repeat;
				font-size: 0.3rem;
				font-family: SFProDisplay-Semibold, SFProDisplay;
				font-weight: 600;
				color: #ffffff;
				position: absolute;
				right: 0.1rem;
				top: 0.1rem;
			}
		}
		.user-details {
			width: 6.9rem;
			height: 1.2rem;
			display: flex;
			margin-top: 0.6rem;
			.user-avatar {
				width: 1.2rem;
				height: 1.2rem;
				border-radius: 50%;
			}
			.user-info {
				flex: 1;
				padding-left: 0.2rem;
				font-size: 0.24rem;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #999999;
				padding-top: 0.18rem;
				.user-name {
					font-size: 0.32rem;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #333333;
					margin-bottom: 0.1rem;
				}
			}
		}
		.invite-btn {
			margin-left: 0.55rem;
			margin-top: 0.8rem;
			width: 5.8rem;
			height: 1rem;
			background-image: url(https://yaame-static.yaame.io/admin/67e66f179d463ab8ce5723a7f01b3443.png);
			background-repeat: no-repeat;
			background-size: contain;
			text-align: center;
			line-height: 1rem;
			font-weight: 600;
			color: #ffffff;
			font-size: 0.32rem;
            &.disabled {
                background-image: none;
                background-color: #fff;
                color: #999;
                border: 0.02rem solid #999;
                border-radius: 0.5rem;
            }
		}
        .empty-box {
            margin-top: 4rem;
            width: 6.9rem;
            height: 5rem;
            text-align: center;
            img {
                width: 1.8rem;
                height: 1.8rem;
            }
            p {
                font-size: 0.24rem;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #333333;
                margin-top: 0.2rem;
            }
        }
	}

    .flex-box {
		display: flex;
		justify-content: center;
		align-items: center;
		.container {
			width: 5.9rem;
			min-height: 4.38rem;
			border-radius: 0.24rem;
			background-color: #fff;
			background-image: url(https://yaame-static.yaame.io/admin/0edbd9af12b8be6973449c650125c50d.png);
			background-size: contain;
			background-repeat: no-repeat;
			position: relative;
			padding-top: 0.6rem;
            padding-bottom: 1.6rem;
			.container-footer {
				width: 100%;
				height: 1.48rem;
				position: absolute;
				bottom: 0;
				left: 0;
				padding: 0.2rem 0.4rem 0.4rem;
				display: flex;
				justify-content: center ;
				div {
					width: 2.4rem;
					height: 0.88rem;
					border-radius: 0.5rem;
					font-size: 0.3rem;
					font-weight: 600;
					text-align: center;
					line-height: 0.88rem;
					&:nth-child(1) {
						background: #ededed;
						color: #666666;
					}
					&:nth-child(2) {
						background: linear-gradient(135deg, #abf78e 0%, #00e59e 100%);
						color: #ffffff;
					}
				}
			}
			.container-title {
				font-size: 0.34rem;
				font-weight: 600;
				color: #333333;
				padding-left: 0.5rem;
			}
			.container-content {
				min-height: 1.6rem;
				margin-top: 0.2rem;
				padding: 0 0.5rem;
				font-size: 0.26rem;
				font-weight: 400;
				color: #666666;
			}
		}
	}
}
</style>
