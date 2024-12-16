<template>
	<div :style="{ paddingTop: safe_height + 1.08 + 'rem' }" class="main">
		<Header
			:keep="true"
			:keepColor="false"
			style="position: fixed"
		>{{ $t('GuildMembers') }}</Header>
		<refresh ref="wlRefresh" @onRefresh="handleRefresh">
			<div
				v-infinite-scroll="loadMore"
				:infinite-scroll-immediate-check="true"
				infinite-scroll-disabled="loading"
				infinite-scroll-distance="10"
				class="content"
			>
				<div v-for="(item, index) in list" :key="index" class="item">
					<img :src="item.avatar" class="avatar" alt="" />
					<div class="info">
						<div class="name">{{ item.nick_name }}</div>
						<div class="time">
							{{ $t('joinTime') }}
							{{ formatDate(item.create_time, "yyyy-MM-dd hh:mm:ss") }}
						</div>
					</div>
					<div
						v-if="is_guild_owner === 1 && item.is_guild_owner === 0"
						class="btn"
						@click="handelDelete(item)"
					>
                    {{ $t('Delete') }}
					</div>
				</div>
			</div>
		</refresh>

		<div v-if="is_guild_owner !== 0" class="submit-btn" @click="submit">
			{{ is_guild_owner === 0 ? $t('exit') : $t('invite') }}
		</div>
        <!-- <div class="submit-btn" @click="submit">
			{{ is_guild_owner === 0 ? $t('exit') : $t('invite') }}
		</div> -->

		<popup v-if="quitVisible" class="flex-box">
			<div class="container">
				<p class="container-title">Tips</p>
				<div class="container-content">
					<!-- Are you sure to quit from this agency? <br />
					No-paid salary can not be settled if you quit from the agency -->
                    {{ $t('exitGuildTip') }} <br />
                    {{ $t('exitGuildTip1') }}
				</div>
				<div class="container-footer">
					<div @click="handelQuit">{{ $t('confirm') }}</div>
					<div @click="quitVisible = false;">{{ $t('cancel') }}</div>
				</div>
			</div>
		</popup>

		<popup v-if="deleteVisible" class="flex-box">
			<div class="container">
				<p class="container-title">Tips</p>
				<div class="container-content">
					{{ $t('removeUserTip1', [selectUser.nick_name]) }}
					<br />
					{{ $t('exitGuildTip2') }}
				</div>
				<div class="container-footer">
					<div @click="deleteConfirm">{{ $t('confirm') }}</div>
					<div @click="deleteVisible = false;">{{ $t('cancel') }}</div>
				</div>
			</div>
		</popup>
	</div>
</template>

<script>
import { formatDate } from "../../../lib/utils.js";
import refresh from "../../../components/common/refresh.vue";
import popup from "../../../components/common/pop_up.vue";

import Header from "@/components/common/header.vue";
import { getSafeHeight } from "@/lib/device";
import request from "@/lib/request/withdraw";


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
			page: 1,
			list: [],
			has_next: true,
			is_guild_owner: 0,
			selectUser: {
				uid: null,
				nick_name: "-",
			},
			quitVisible: false,
			deleteVisible: false,
		};
	},
	methods: {
		async getData() {
			try {
				let res = await request.getGuildsUsersList(this.page, 20);
				if (res.status === 1000) {
                    if (this.page === 1) {
                        this.list = res.data.content;
                    } else {
                        this.list = this.list.concat(res.data.content);
                    }
                    this.has_next = res.data.has_next;
                    if(Object.prototype.toString.call(res.data.is_guild_owner) === '[object Number]') {
                        this.is_guild_owner = res.data.is_guild_owner;
                    }
                } else {
                    Toast(res.desc);
                    this.list = [];
                }
				
			} catch (error) {
				console.log(error);
			}
		},
		handelDelete(item) {
			this.selectUser = item;
            this.deleteVisible = true;
		},
		handleRefresh() {
			this.page = 1;
			this.getData();
			setTimeout(() => {
				this.$refs.wlRefresh.isLoading = false;
			}, 500);
		},
		formatDate,
		/**
		 * @description: 下拉加载钩子fun
		 */
		loadMore() {
			if (this.has_next) {
				this.page++;
				this.getData();
			}
		},
		submit() {
			if (this.is_guild_owner === 0) {
				this.quitVisible = true;
			} else {
				this.$router.push("/GuildInvite");
			}
		},
		async handelQuit() {
			try {
				let res = await request.quitGuildsUsers({});
                if (res.status === 1000) {
                    // this.page = 1;
                    // this.getData();
                    this.quitVisible = false;

                    Toast(this.$t('exitSuccess'));
                    setTimeout(() => {
                        location.href = 'wlyaame://main/tab?index=3';
                    }, 3000);
                } else {
                    Toast(res.desc);
                }
				
			} catch (error) {
				console.log(error);
			}
		},
        async deleteConfirm() {
            try {
                let res = await request.deleteGuildsUsers({
                    delete_uid: this.selectUser.uid
                });
                if (res.status === 1000) {
                    this.page = 1;
                    this.getData();
                    this.deleteVisible = false;
                    Toast(this.$t('deleteSuccess', [this.selectUser.nick_name]));
                } else {
                    Toast(res.desc);
                }
                
            } catch (error) {
                console.log(error);
            }
        },
	},
	mounted() {
		let safe_area = getSafeHeight() || 0;
		this.safe_height = (safe_area * 2) / 100;

		this.getData();
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
		min-height: calc(100vh - 1rem);
		background: #ffffff;
		border-radius: 0.3rem 0.3rem 0px 0px;
		padding-top: 0.4rem;
		padding-bottom: 1.4rem;
		.item {
			width: 7.5rem;
			height: 0.9rem;
			display: flex;
			align-items: center;
			padding-left: 0.4rem;
			padding-right: 0.4rem;
			margin-bottom: 0.5rem;
			.avatar {
				width: 0.9rem;
				height: 0.9rem;
				border-radius: 50%;
			}
			.info {
				width: 4.52rem;
				padding-left: 0.3rem;
				.name {
					font-size: 0.28rem;
					font-weight: 400;
					color: #333333;
				}
				.time {
					font-size: 0.2rem;
					font-weight: 400;
					color: #999999;
				}
			}
			.btn {
				width: 1.28rem;
				height: 0.62rem;
				background: #ed5a5a;
				border-radius: 0.31rem;
				text-align: center;
				line-height: 0.62rem;
				font-size: 0.24rem;
				font-weight: 400;
				color: #ffffff;
			}
		}
	}
	.submit-btn {
		width: 5.8rem;
		height: 1rem;
		position: fixed;
		bottom: 0.6rem;
		left: 0.85rem;
		background-image: url(https://yaame-static.yaame.io/admin/67e66f179d463ab8ce5723a7f01b3443.png);
		background-repeat: no-repeat;
		background-size: contain;
		text-align: center;
		line-height: 1rem;
		font-weight: 600;
		color: #ffffff;
		font-size: 0.32rem;
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
				justify-content: space-between;
				div {
					width: 2.4rem;
					height: 0.88rem;
					border-radius: 0.5rem;
					font-size: 0.3rem;
					font-family: PingFangSC-Semibold, PingFang SC;
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
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: #333333;
				padding-left: 0.5rem;
			}
			.container-content {
				min-height: 1.6rem;
				margin-top: 0.2rem;
				padding: 0 0.5rem;
				font-size: 0.26rem;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #666666;
			}
		}
	}
}
</style>
