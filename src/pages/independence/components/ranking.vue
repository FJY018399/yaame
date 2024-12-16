<template>
	<div class="ranking">
		<!--前三-->
		<div class="frame">
			<div class="front" v-for="(item, index) in 3" :key="item">
				<div class="head" @click="toDetails(rankingThree[index])">
					<div class="head-img"></div>
					<div
						v-if="rankingThree[index] && rankingThree[index].user_live_status"
						class="status"
						:class="{ 'on-line': rankingThree[index].user_live_status === 2 }"
					>
						{{
							rankingThree[index].user_live_status === 2
								? $t("online")
								: $t("start_broadcast")
						}}
					</div>
					<img
						v-if="rankingThree[index] && rankingThree[index].avatar"
						:src="rankingThree[index].avatar"
						alt=""
					/>
					<img
						v-else
						src="https://yaame-static.yaame.io/admin/9cf28c04a72e07566476ac29bf3c6b8f.png"
						alt=""
					/>
				</div>
				<div class="name no-wrap" v-if="rankingThree[index]">
					<span class="no-wrap" @click="toDetails(rankingThree[index])">{{ rankingThree[index].nick_name }}</span>
				</div>
				<div v-if="rankingThree[index]" class="number">
					<img
						src="https://yaame-static.yaame.io/admin/341ff330a26e9b6423429d52cbeab569.png"
						alt=""
					/>
					{{ rankingThree[index].score }}
				</div>
				<div
					v-if="rankingThree[index] && userList.uid !== rankingThree[index].uid"
					class="attention"
					:class="{ chat: rankingThree[index].relation.attention }"
					@click="attentions(rankingThree[index])"
				></div>
			</div>
		</div>

		<!--剩余排行-->
		<div class="rank-last" v-for="(item, index) in rankingLast" :key="index">
			<div class="rank-back">{{ item.subject_rank }}</div>
			<div class="head-back" @click="toDetails(item)">
				<div
					class="status"
					v-if="item.user_live_status"
					:class="{ 'on-line': item.user_live_status === 2 }"
				>
					{{ item.user_live_status === 2 ? $t("online") : $t("start_broadcast") }}
				</div>
				<img :src="item.avatar" class="user-avatar" alt="" />

                <img src="https://yaame-static.yaame.io/admin/cac3fb67bb1fc5f7717b90bc9f3dbcd1.png" class="bg-img" alt="">
			</div>
			<div class="name-back">
				<div class="name" @click="toDetails(item)">
					<span class="no-wrap">{{ item.nick_name }}</span>
				</div>
				<div class="id">
					<img
						src="https://yaame-static.yaame.io/admin/341ff330a26e9b6423429d52cbeab569.png"
						alt=""
					/>
					{{ item.score }}
				</div>
			</div>
			<div
				v-if="userList.uid !== item.uid"
				class="attention"
				:class="{ chat: item.relation.attention }"
				@click="attentions(item)"
			></div>
		</div>

		<!--缺省图-->
		<div v-if="!rankingThree[1]" class="lack">
			<p>{{ $t("noRank") }}</p>
		</div>

		<!--用户排名-->
		<div class="my-list">
			<div class="rank-back">
				{{
					userList.subject_rank && userList.subject_rank <= 99
						? userList.subject_rank
						: "99+"
				}}
			</div>
			<div class="head-back" @click="toDetails(userList)">
                <img :src="userList.avatar" class="user-avatar" alt="" />

                <img src="https://yaame-static.yaame.io/admin/cac3fb67bb1fc5f7717b90bc9f3dbcd1.png" class="bg-img" alt="">
			</div>
			<div class="name-back">
				<div class="name">
					<span class="no-wrap">{{ userList.nick_name }}</span>
				</div>
				<div class="id">
          <img
              src="https://yaame-static.yaame.io/admin/341ff330a26e9b6423429d52cbeab569.png"
              alt=""
          />
          {{ userList.score }}
				</div>
			</div>
			<div v-if="userList.subject_rank && userList.subject_rank <= 99 && userList.subject_rank !== 1" class="number">
        {{ $t('distance_to_next') }}
				{{ userList.diff_score ? userList.diff_score : 0 }}
			</div>
		</div>
	</div>
</template>

<script setup>
import { Toast } from "vant";
import { getCurrentInstance, onActivated, ref } from "vue";
import { getPearlCollectorRankApi, postAttentionsApi } from '@/pages/independence/api';
import { burialPointFun } from "@/lib/utils";
// 获取国际化函数
const root = getCurrentInstance();
const t = (val, msg) => {
	return root.proxy.$i18n.t(val, msg);
};

// 跳转
const toDetails = (url) => {
	if (url.is_mystery === 1) {
		Toast(t("mystery_user"));
		return;
	}
	window.location.href = url.scheme_url;
};
// 获取页面信息
const userList = ref({});
// 排名前三的数据
const rankingThree = ref([]);
// 剩下排名数据
const rankingLast = ref([]);

const homeData = async () => {
	try {
        let res = await getPearlCollectorRankApi();
        if (res.status === 1000) {
            userList.value = res.data.my_rank;
            processRanking(res.data.rank_list);
        } else {
            Toast(res.desc);
        }
	} catch (err) {
		console.log(err);
	}
};

// 处理排名数据
const processRanking = (data) => {
	if (!data) return;
	rankingThree.value = data.splice(0, 3);
	rankingLast.value = data;
	swapElements(rankingThree.value, 0, 1);
};
// 交换数组内容
const swapElements = (arr, index1, index2) => {
	let temp = arr[index1];
	arr[index1] = arr[index2];
	arr[index2] = temp;
};

// 关注
const attentions = async (value) => {
	try {
		if (value.is_mystery === 1) {
			// 神秘人
			Toast(t("mystery_user"));
			return;
		}
		if (value.relation.attention === 0) {
			const res = await postAttentionsApi({
				target_uid: value.uid,
			});
			if (res.status !== 1000) {
				Toast(res.desc);
				return;
			}
			Toast(t("followed"));

            // 重新拉取数据
            homeData();

            burialPointFun({
                event_name: "page_btn_click",
                cid: -1000,
                md: 2,
                args_name: "page_btn_click",
                args: {
                    type: 'follow_btn',
                },
            });
		} else {
            location.href = `wlyaame://chat/p2p?nim_id=${value.nim_id}&nick_name=${value.nick_name}&uid=${value.uid}&avatar=${value.avatar}`;
            burialPointFun({
                event_name: "page_btn_click",
                cid: -1000,
                md: 2,
                args_name: "page_btn_click",
                args: {
                    type: 'chat_btn',
                },
            });
        }
	} catch (err) {
		console.log(err);
	}
};

onActivated(() => {
	homeData();
});
</script>

<style lang="less" scoped>
.ranking {
	min-height: 14.87rem;
  padding-bottom: 1.61rem;
	overflow: hidden;

	.txt {
		width: 6.55rem;
		height: 0.63rem;
		margin: 0.35rem auto 0.36rem;
		font-size: 0.24rem;
		color: #ffffff;
		line-height: 0.28rem;
		text-align: center;
	}

	//tab样式
	.tab {
		position: relative;
		display: flex;
		width: 5rem;
		height: 0.68rem;
		margin: 0 auto 0.26rem;
		background: #083da5;
		border-radius: 0.55rem;
		justify-content: space-around;
		align-items: center;
		font-size: 0.28rem;
		color: #6270e7;

		.tabs {
			position: relative;
			flex: 1;
			z-index: 1;
			text-align: center;
			line-height: 0.26rem;
		}

		.opt-for {
			position: absolute;
			top: 0.02rem;
			width: 2.48rem;
			height: 0.64rem;
			background: linear-gradient(#1cc4d2 0%, #3354e5 99%);
			border-radius: 0.45rem;
			transition-duration: 0.3s;
		}

		&-in {
			color: #fcffb0;
		}
	}

	// 组别tab
	.secondary-tab {
		display: flex;
		justify-content: space-evenly;
		width: 100%;
		height: 0.71rem;

		.secondary-tabs {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 1.8rem;
			height: 0.71rem;
			font-weight: 600;
			font-size: 0.22rem;
			color: #ffffff;
			background-image: url("https://yaame-static.yaame.io/admin/9eec9b916942d373e094964939259962.png");
			background-repeat: no-repeat;
			background-size: contain;
			transition-duration: 0.3s;
		}

		&-in {
			background-image: url("https://yaame-static.yaame.io/admin/3362c67531be7ae995f160b69383d69f.png") !important;
		}
	}

	// 前三样式
	.frame {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		width: 7.06rem;
		height: 4.52rem;
		margin: 0 auto 0.28rem;

		.front {
			display: flex;
			flex-direction: column;
			width: 2.17rem;
			height: 4.06rem;
			background-repeat: no-repeat;
			background-size: contain;
			overflow: hidden;

			.head {
				position: relative;
				display: flex;
				justify-content: center;
				align-items: center;
				width: 1.69rem;
				height: 1.42rem;
				margin: 1.08rem auto 0.06rem;
				background-repeat: no-repeat;
				background-size: contain;
				padding-bottom: 0.06rem;

				&-img {
					position: absolute;
					width: 100%;
					height: 100%;
					background-repeat: no-repeat;
					background-size: contain;
				}

				.status {
					position: absolute;
					top: 1.13rem;
					left: 50%;
					min-width: 0.66rem;
					height: 0.24rem;
					padding: 0 0.08rem;
					background: #eeac19;
					border-radius: 0.08rem;
					font-size: 0.18rem;
					color: #ffffff;
					line-height: 0.24rem;
					transform: translateX(-50%);
					text-align: center;
					white-space: nowrap;
                    z-index: 2;
				}

				.on-line {
					background: #629F81;
				}

				img {
					width: 1.06rem;
					height: 1.06rem;
					border-radius: 50%;
				}
			}

			.name {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 1.71rem;
				height: 0.2rem;
				margin: 0 auto 0;
				font-size: 0.2rem;
				color: #ffffff;
			}

			.number {
				min-width: 1.6rem;
				height: 0.34rem;
				margin: 0.16rem auto 0.14rem;
				line-height: 0.34rem;
				text-align: center;
				font-size: 0.2rem;
				white-space: nowrap;
				background-repeat: no-repeat;
				background-size: contain;
				img {
					width: 0.28rem;
					height: 0.22rem;
					margin-top: 0.06rem;
					//vertical-align: middle;
				}
			}

			.attention {
				width: 0.42rem;
				height: 0.42rem;
				margin: 0 auto 0;
				background-repeat: no-repeat;
				background-size: contain;
				background-image: url("https://yaame-static.yaame.io/admin/bd3970c426c39c57117a59243bef4674.png");
			}
			.chat {
				background-image: url("https://yaame-static.yaame.io/admin/62bedcda466785ed681d907e9bbf46d9.png");
			}
		}
		.front:nth-child(2) {
			width: 2.4rem;
			height: 4.52rem;
			background-image: url("https://yaame-static.yaame.io/admin/7e009e3b9bcc747121e3aaf8c02841a0.png");
			.head {
				position: relative;
				display: flex;
				justify-content: center;
				align-items: center;
				width: 1.88rem;
				height: 1.59rem;
				margin: 1.2rem auto 0.06rem;
				&-img {
					background-image: url("https://yaame-static.yaame.io/admin/71c12f8ac8f558dafe31517d5ef161ac.png");
				}

				.status {
					position: absolute;
					top: 1.23rem;
					left: 50%;
					min-width: 0.66rem;
					height: 0.24rem;
					padding: 0 0.08rem;
					background: #eeac19;
					border-radius: 0.08rem;
					font-size: 0.18rem;
					color: #ffffff;
					line-height: 0.24rem;
					transform: translateX(-50%);
					text-align: center;
                    z-index: 2;
				}

				.on-line {
					background: #629F81;
				}

				img {
					width: 1.16rem;
					height: 1.16rem;
				}
			}
			.number {
				min-width: 1.77rem;
				height: 0.36rem;
				line-height: 0.36rem;
				font-size: 0.22rem;
				color: #ac4e15;
				background-image: url("https://yaame-static.yaame.io/admin/63f114b7bd751b29b4e58b93b2c92747.png");
				img {
					height: 0.23rem;
				}
			}
		}
		.front:nth-child(1) {
			background-image: url("https://yaame-static.yaame.io/admin/9c6a3ae98cbd06e64acb478b22b51a33.png");
			.head {
				&-img {
					background-image: url("https://yaame-static.yaame.io/admin/5659259a7b01db0318d322d0b447c2b1.png");
				}
			}
			.number {
				color: #7475b8;
				background-image: url("https://yaame-static.yaame.io/admin/3cf1a9565e9f219fb56b657309f0c2a1.png");
			}
		}
		.front:nth-child(3) {
			background-image: url("https://yaame-static.yaame.io/admin/4d8b1371e66707fbf6bdf94c29913b42.png");
			.head {
				&-img {
					background-image: url("https://yaame-static.yaame.io/admin/f5452756815138945759561eb3febaaa.png");
				}
			}
			.number {
				color: #b4411d;
				background-image: url("https://yaame-static.yaame.io/admin/9ca177c4221e3a65902c4b46b957ff9c.png");
			}
		}
	}

	// 剩余排名
	.rank-last {
		display: flex;
		align-items: center;
		width: 7.24rem;
		height: 1.44rem;
		margin: 0 auto 0.2rem;
		background: url("https://yaame-static.yaame.io/admin/3cd00601b110fccafaa9263bb46f05f6.png")
			no-repeat;
		background-size: contain;
		font-weight: 500;
		font-size: 0.24rem;
		color: #ffffff;

		.rank-back {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 0.15rem;
			margin: 0 0.37rem 0 0.48rem;
      color: #FFF2B3;
		}

		.head-back {
			position: relative;
			display: flex;
			justify-content: center;
			align-items: center;
			width: 1.04rem;
			height: 1.06rem;
			margin-right: 0.38rem;
			background-size: contain;
			.user-avatar {
				width: 0.9rem;
				height: 0.9rem;
				border-radius: 50%;
                position: absolute;
                top: 0.05rem;
                left: 0.07rem;
			}
            .bg-img {
                width: 1.04rem;
                height: 1.06rem;
                position: absolute;
                left: 0;
                top: 0;
                z-index: 1;
            }
			.status {
				position: absolute;
				top: 0.83rem;
				left: 50%;
				min-width: 0.66rem;
				height: 0.24rem;
				padding: 0 0.08rem;
				background: #eeac19;
				border-radius: 0.08rem;
				font-size: 0.18rem;
				color: #ffffff;
				line-height: 0.24rem;
				transform: translateX(-50%);
				text-align: center;
                z-index: 2;
			}

			.on-line {
				background: #629F81;
			}
		}

		.name-back {
			position: relative;
			font-size: 0.22rem;
			color: #fff2b3;
			.name {
				display: flex;
				width: 2.52rem;
				height: 0.24rem;
				margin-bottom: 0.14rem;
				align-items: baseline;
			}

			.id {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				height: 0.3rem;
				line-height: 0.3rem;
				font-size: 0.22rem;
				color: #fff;
				img {
					width: 0.34rem;
					height: 0.28rem;
					margin-right: 0.08rem;
				}
			}
		}

		.attention {
			width: 0.42rem;
			height: 0.42rem;
			margin-left: 1.06rem;
			background-repeat: no-repeat;
			background-size: contain;
			background-image: url("https://yaame-static.yaame.io/admin/bd3970c426c39c57117a59243bef4674.png");
		}
		.chat {
			background-image: url("https://yaame-static.yaame.io/admin/62bedcda466785ed681d907e9bbf46d9.png");
		}
	}

	.lack {
		position: relative;
		width: 1rem;
		height: 1.2rem;
		margin: 1rem auto 0;
		background: url("https://yaame-static.yaame.io/admin/5b8c5313fe3d87e4ef39e6a7ef6bfc05.png")
			no-repeat;
		background-size: contain;
		p {
			position: absolute;
			top: 1.51rem;
			left: 50%;
			transform: translateX(-50%);
			height: 0.33rem;
			font-weight: 400;
			font-size: 0.24rem;
			line-height: 0.33rem;
			color: #FFF2B3;
			white-space: nowrap;
		}
	}

	// 个人排名样式
	.my-list {
		display: flex;
		align-items: center;
		position: fixed;
		bottom: 0;
		width: 7.5rem;
		height: 1.61rem;
		background: url("https://yaame-static.yaame.io/admin/aea5b65a0a1f924149db1c779295c835.png")
			no-repeat;
		background-size: contain;
		font-weight: 500;
		font-size: 0.24rem;
		color: #ffffff;
		z-index: 3;
        padding-left: 0.2rem;
		.rank-back {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 0.15rem;
			margin: 0 0.37rem 0 0.48rem;
      color: #FFF2B3;
		}

		.head-back {
			position: relative;
			display: flex;
			justify-content: center;
			align-items: center;
			width: 1.04rem;
			height: 1.06rem;
			margin-right: 0.38rem;
			background-size: contain;
			.user-avatar {
				width: 0.9rem;
				height: 0.9rem;
				border-radius: 50%;
                position: absolute;
                top: 0.05rem;
                left: 0.07rem;
			}
            .bg-img {
                width: 1.04rem;
                height: 1.06rem;
                position: relative;
                left: 0;
                top: 0;
                z-index: 1;
            }
			.status {
				position: absolute;
				top: 0.83rem;
				left: 50%;
				min-width: 0.66rem;
				height: 0.24rem;
				padding: 0 0.08rem;
				background: #eeac19;
				border-radius: 0.08rem;
				font-size: 0.18rem;
				color: #ffffff;
				line-height: 0.24rem;
				transform: translateX(-50%);
				text-align: center;
                z-index: 2;
			}

			.on-line {
				background: #629F81;
			}
		}

		.name-back {
			position: relative;
			font-size: 0.22rem;
			color: #fff2b3;
			.name {
				display: flex;
				width: 2.52rem;
				height: 0.24rem;
				margin-bottom: 0.14rem;
				align-items: center;
			}

			.id {
				display: flex;
				flex-wrap: wrap;
				flex-direction: row;
				width: 2.9rem;
        img {
          width: .35rem;
          height: .28rem;
          margin-right: .08rem;
        }
			}
		}

		.number {
			display: flex;
			justify-content: center;
			align-items: center;
			margin: 0 0.2rem;
      text-align: center;
      color: #FFF2B3;
			img {
				width: 0.26rem;
				height: 0.24rem;
				margin-right: 0.06rem;
			}
		}
        .attention {
			width: 0.42rem;
			height: 0.42rem;
			margin-left: 1.06rem;
			background-repeat: no-repeat;
			background-size: contain;
			background-image: url("https://yaame-static.yaame.io/admin/bd3970c426c39c57117a59243bef4674.png");
		}
		.chat {
			background-image: url("https://yaame-static.yaame.io/admin/62bedcda466785ed681d907e9bbf46d9.png");
		}
	}
}
</style>
