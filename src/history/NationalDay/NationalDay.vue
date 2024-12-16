<!--
 * @Author: Elk
 * @Date: 2023-07-28 15:15:40
 * @FilePath: /yaame-h5/src/pages/NationalDay/NationalDay.vue
 * @Description: 
-->
<template>
	<div class="NationalDay">
		<Header v-if="!rewardVisible">العيد الوطني السعودي</Header>
		<PageLoading v-if="page_loading"></PageLoading>

		<img
			class="rule-icon"
			src="https://yaame-static.yaame.io/admin/9d45f8e441ea45a356df7f1d75fbe2a2.png"
			alt=""
			@click="ruleVisible = true"
		/>
		<img
			class="reward-icon"
			src="https://yaame-static.yaame.io/admin/0ccc19b90bee33608aabbb653f8a76ab.png"
			alt=""
			@click="rewardVisible = true"
		/>
		<div class="reward">
			<div v-for="item in giftList" :key="item.icon" class="reward-item">
				<div class="reward-item-img">
					<img :src="item.icon" alt="" />
					<p class="reward-price">
						{{ item.diamond_worth }}
						<img
							src="https://static.yaame.io/admin/bd139381c5431a3773a63de27f952067.png"
							alt=""
						/>
					</p>
				</div>
				<p class="reward-name">{{ item.gift_name }}</p>
			</div>
		</div>
		<div class="tab-list">
			<div
				v-for="item in tabList"
				:key="item.key"
				class="tab"
				@click="tabClick(item.key)"
			>
				<img
					:src="item.key === tabActive ? item.active : item.default"
					alt=""
				/>
			</div>
		</div>
		<div v-if="topList && topList.length" class="top-list">
			<div
				v-for="(item, index) in topList"
				:key="index"
				:class="['top-item', index === 1 && 'big']"
			>
				<div
					:style="{ backgroundImage: `url(${item.subject_icon})` }"
					class="avatar"
                    @click="toDetails(item)"
				>
					<img
						v-if="index === 0"
						src="https://yaame-static.yaame.io/admin/ad87c311bea91da199ea824dc596716d.png"
						alt=""
					/>
					<img
						v-if="index === 1"
						src="https://yaame-static.yaame.io/admin/c94da9efc0cd266c935995263a2ff914.png"
						alt=""
					/>
					<img
						v-if="index === 2"
						src="https://yaame-static.yaame.io/admin/6d388da5047ee38c76b4d0ffb76dae98.png"
						alt=""
					/>
				</div>
				<p class="no-wrap info">{{ item.subject_name }}</p>
				<p class="no-wrap info">ID: {{ item.yaame_id }}</p>
				<div class="num">
					<img
						v-if="tabActive === 'WARRIOR'"
						src="https://static.yaame.io/admin/93e07138b78e0cbe47af5e328a37deda.png"
						alt=""
					/>
					<img
						v-else
						src="https://static.yaame.io/admin/146a488ee6fee851eaaaa466c89af38c.png"
						alt=""
					/>
					{{ item.score_value }}
				</div>
			</div>
		</div>
		<div v-if="list && list.length" :class="['list', tabActive]">
			<div v-for="(item, index) in list" :key="index" class="list-item">
				<div class="sort">{{ item.subject_rank }}</div>
				<div
					:style="{ backgroundImage: `url(${item.subject_icon})` }"
					class="avatar"
                    @click="toDetails(item)"
				>
					<img
						src="https://static.yaame.io/admin/355400fcd6defd74ccadf75e2f9167a3.png"
						alt=""
					/>
				</div>
				<div class="info">
					<p>{{ item.subject_name }}</p>
					<p>ID: {{ item.yaame_id }}</p>
				</div>
				<div class="value">
					<img
						v-if="tabActive === 'WARRIOR'"
						src="https://static.yaame.io/admin/93e07138b78e0cbe47af5e328a37deda.png"
						alt=""
					/>
					<img
						v-else
						src="https://static.yaame.io/admin/146a488ee6fee851eaaaa466c89af38c.png"
						alt=""
					/>
					{{ item.score_value }}
				</div>
			</div>
		</div>
        <div v-else class="no-data flex-box">
            <img src="https://yaame-static.yaame.io/admin/e0eabe016dcc1fb927efe1f529808374.png" alt="">
        </div>
		<div class="user-info">
			<div class="sort">
				{{ userInfo.subject_rank > 0 ? userInfo.subject_rank : "99+" }}
			</div>
			<div
				:style="{ backgroundImage: `url(${userInfo.subject_icon})` }"
				class="avatar"
			>
				<img
					src="https://static.yaame.io/admin/355400fcd6defd74ccadf75e2f9167a3.png"
					alt=""
				/>
			</div>
			<div class="info">
				<p>{{ userInfo.subject_name }}</p>
				<p>ID: {{ userInfo.yaame_id }}</p>
			</div>
			<div class="value">
				<img
					v-if="tabActive === 'WARRIOR'"
					src="https://static.yaame.io/admin/93e07138b78e0cbe47af5e328a37deda.png"
					alt=""
				/>
				<img
					v-else
					src="https://static.yaame.io/admin/146a488ee6fee851eaaaa466c89af38c.png"
					alt=""
				/>
				{{ userInfo.score_value || 0 }}
			</div>
		</div>

		<Popup v-if="ruleVisible" class="flex-box">
			<div class="rule-container">
                <div class="scroll-box">
                    <p>
					<span>1.</span> وقت الحدث : 2023.09.20-2023.09.26
				</p>
				<p>
					<span>2.</span>  خلال الحدث، يمكن للمستخدمين المشاركة في الحدث عن طريق إرسال أو استلام 
                    "(العاب ناريه)" "(المملكة العربية السعودية)" "(العاب ناريه)" "(فريق الروكت)"
				</p>
				<p>
					<span>3.</span> خلال الحدث، يمكن أن يؤدي إرسال هدايا الحدث إلى زيادة نقاط المحارب ، ويمكن أن يؤدي استلام هدايا الحدث إلى زيادة نقاط الحراسة .
				</p>
				<p>
					<span>4.</span> يتم ترتيب التصنيفات حسب عدد النقاط . عندما يكون عدد الماسات هو نفسه ، قيام بالترتيب حسب الوقت (1 ماسة = 1 نقطة حراسة = 1 نقطة محارب)
				</p>
                <p>
					<span>5.</span> قواعد المكافأة
				</p>
                <p>
					مكافأة 1
				</p>
                <p>
					بعد الحدث، سيحصل أفضل ثلاثة مستخدمين في قائمة المحارب وقائمة الحراس على مكافآت مختلفة.
				</p>
                <p>مكافأة 2</p>
                <p>بعد الحدث، سيتم احتساب نقاط المحارب التي ساهم بها كل شخص . نقاط المحارب التي تصل إلى 500، 2000، 10000، 40000، 70000، و100000 سوف تحصل على مكافآت مختلفة.</p>
                <p>بعد انتهاء الحدث، سيتم توزيع المكافآت خلال ثلاثة أيام عمل</p>
                <p>الحق في تفسير الحدث يعود إلى Yaame</p>
                </div>

				<img
					class="close"
					src="https://static.yaame.io/admin/95b76d76c47e76f4eb6769b7cf27d9d7.png"
					@click="ruleVisible = false"
				/>
			</div>
		</Popup>

		<div v-if="rewardVisible" class="reward-container">
			<header>قائمة المكافآت</header>
            <img class="back" src="https://yaame-static.yaame.io/admin/1f62f985a70a688b0f8ad7af6ca6e051.png" @click="rewardVisible = false;">
			<div class="reward-tab-list">
				<div
					v-for="(item, index) in rewardTabList"
					:key="index"
					:class="['tab', item.key === rewardTabActive && 'active']"
					@click="rewardTabActive = item.key"
				>
					{{ item.value }}
				</div>
			</div>

			<div v-if="rewardTabActive === 'LIST'" style="height: 13rem; overflow-y: scroll;">
				<div class="attack-bar">مكافآت قائمة المحارب</div>

				<div
					v-for="(item, index) in rewardList[0]"
					:key="index + 'item1'"
					class="reward-item"
				>
					<div class="title">{{ item.level_text }}</div>
					<div class="reward-list">
						<div
							v-for="(ele, inx) in item.reward_items"
							:key="inx + 'ele'"
							class="reward-ele"
						>
							<div class="ele-avatar">
								<img :src="ele.reward_icon" alt="" />
								<div class="diamond">
									{{ ele.reward_diamond_worth
									}}
								</div>
							</div>
							<p class="ele-name">{{ ele.reward_name }}</p>
						</div>
					</div>
				</div>

				<div class="protection-bar">مكافآت قائمة الحراسة</div>

				<div
					v-for="(item, index) in rewardList[1]"
					:key="index + 'item2'"
					class="reward-item"
				>
                    <div class="title">{{ item.level_text }}</div>
					<div class="reward-list">
						<div
							v-for="(ele, inx) in item.reward_items"
							:key="inx + 'ele'"
							class="reward-ele"
						>
							<div class="ele-avatar">
								<img :src="ele.reward_icon" alt="" />
								<div class="diamond">
									{{ ele.reward_diamond_worth
									}}
								</div>
							</div>
							<p class="ele-name">{{ ele.reward_name }}</p>
						</div>
					</div>
				</div>
			</div>

            <div v-else style="height: 13rem; overflow-y: scroll;">
				<div
					v-for="(item, index) in rewardList"
					:key="index"
					class="reward-item"
				>
					<div class="title-pro">{{ item.level_text }}</div>
					<div class="reward-list">
						<div
							v-for="(ele, inx) in item.reward_items"
							:key="inx"
							class="reward-ele"
						>
							<div class="ele-avatar">
								<img :src="ele.reward_icon" alt="" />
								<div class="diamond">
									{{ ele.reward_diamond_worth
									}}
								</div>
							</div>
							<p class="ele-name">{{ ele.reward_name }}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import Header from "../../components/common/header.vue";
import Popup from "../../components/common/pop_up.vue";
import PageLoading from "../../components/common/page_loading.vue";
import { getSafeHeight } from "../../lib/device";
import Toast from "../../components/third/toast/toast.js";
import request from "../../lib/request/activity.js";
const getDefaultUser = () => {
	return {
		subject_icon:
			"https://static.yaame.io/admin/75e34c6499425d04f8a2ce5203abb629.png",
		subject_name: "-",
		score_value: "-",
		yaame_id: "-",
	};
};
export default {
	components: {
		Header,
		Popup,
        PageLoading
	},
	setup() {
		const page_loading = ref(true);
		const ruleVisible = ref(false);
		const rewardVisible = ref(false);

		let safe_height = ref(0);

		const giftList = ref([]);
		const getGift = async () => {
			try {
				let res = await request.getIndonesiaNationalGift();
				if (res.status === 1000) {
					if (res.data.gifts) {
						giftList.value = res.data.gifts;
					}
				}
			} catch (error) {
				console.log(error);
			}
		};

		const rewardTabList = ref([
			{
				key: "LIST",
				value: "قائمة المكافآت",
			},
			{
				key: "CONTRIBUTION",
				value: "مكافأة المساهمة",
			},
		]);
		const rewardTabActive = ref("LIST");
		const rewardList = ref([[], []]);
		const getReward = async () => {
			try {
				let res = await request.getIndonesiaNationalReward({
					rewardType: rewardTabActive.value,
				});
				if (res.status === 1000) {
					if (res.data) {
						if (rewardTabActive.value === "LIST") {
							rewardList.value = [
								res.data.filter((item) => item.reward_item_type === "WARRIOR"),
								res.data.filter((item) => item.reward_item_type === "GUARD"),
							];
						} else {
							rewardList.value = res.data;
						}
					}
				}
			} catch (error) {
				console.log(error);
			}
		};
		watch(
			() => rewardTabActive.value,
			() => {
				getReward();
			}
		);

		const topList = ref([]);
		const list = ref([]);
		const userInfo = ref({});
		const getList = async () => {
			try {
				let res = await request.getIndonesiaNationalRank({
					rewardItemType: tabActive.value,
				});
				if (res.status === 1000) {
					const content = res.data.rank_list_info_items || [];
					topList.value = [
						content[1] || getDefaultUser(),
						content[0] || getDefaultUser(),
						content[2] || getDefaultUser(),
					];
					if (content.length > 3) {
						list.value = content.slice(3) || [];
					} else {
						list.value = [];
					}
					if (res.data.my_rank) {
						userInfo.value = res.data.my_rank;
					}

                    page_loading.value =  false;
				}
			} catch (error) {
				console.log(error);
			}
		};

		const tabList = ref([
			{
				key: "WARRIOR",
				default:
					"https://yaame-static.yaame.io/admin/4f2d03a181dbe7bcf80bfb773cad0a03.png",
				active:
					"https://yaame-static.yaame.io/admin/2d7ff8bf29c3994cd9c26ba478b0cadc.png",
			},
			{
				key: "GUARD",
				default:
					"https://yaame-static.yaame.io/admin/7563c1c83754908064d43cfccc84e77b.png",
				active:
					"https://yaame-static.yaame.io/admin/2d7ff8bf29c3994cd9c26ba478b0cadc.png",
			},
		]);
		const tabActive = ref("WARRIOR");
		const tabClick = (key) => {
			tabActive.value = key;
			getList();
		};

        const toDetails = (item) =>  {
			if (item.uid) {
				location.href = `wlyaame://trend/user?uid=${item.uid}`;
			}
		}

		onMounted(() => {
			let safe_area = getSafeHeight() || 0;
			safe_height.value = (safe_area * 2) / 100;

			getGift();
			getReward();
			getList();
		});

		return {
			safe_height,
			page_loading,
			ruleVisible,
			rewardVisible,

			giftList,

			topList,
			list,
			userInfo,

			tabList,
			tabActive,
			tabClick,

			rewardTabList,
			rewardTabActive,
			getReward,
			rewardList,

            toDetails
		};
	},
};
</script>
<style lang="less">
.NationalDay {
	width: 100%;
	height: 100%;
	position: relative;
	background-image: url(https://yaame-static.yaame.io/admin/fb2866e50c9195ed7cb428b3d8c29b80.png);
	background-size: contain;
	background-repeat: no-repeat;
	padding-top: 8.92rem;
	.rule-icon {
		position: absolute;
		top: 1.6rem;
		right: 0.5rem;
		width: 0.6rem;
		height: auto;
	}
	.reward-icon {
		position: fixed;
		top: 7.67rem;
		right: 0.27rem;
		width: 1.1rem;
		height: auto;
        z-index: 9;
	}
	.reward {
		width: 7.06rem;
		height: 6.64rem;
		background-image: url(https://yaame-static.yaame.io/admin/3c9aff54698a4f983e923fe9196ff404.png);
		background-size: contain;
		background-repeat: no-repeat;
		margin-left: 0.22rem;
		padding: 1.22rem 0.92rem 0;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		.reward-item {
			width: 2.2rem;
			height: 2.7rem;
			.reward-item-img {
				width: 2.2rem;
				height: 2rem;
				background-image: url(https://yaame-static.yaame.io/admin/b47a9f333aca206ec1d8da917a14667f.png);
				background-size: contain;
				background-repeat: no-repeat;
				overflow: hidden;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 0.16rem;
				position: relative;
				img {
					width: 1.6rem;
					height: 1.6rem;
				}
				.reward-price {
					position: absolute;
					top: 0;
					right: 0;
					width: auto;
					text-align: center;
					height: 0.4rem;
					line-height: 0.4rem;
					background-image: linear-gradient(90deg, #27BB24 0%, #1AB81D 100%);
					border-radius: 0px 0.12rem 0px 0.2rem;
					color: #fff;
					font-size: 0.24rem;
					padding: 0 0.1rem;
					img {
						width: 0.24rem;
						height: 0.18rem;
						vertical-align: middle;
					}
				}
			}
			.reward-name {
				width: 100%;
				text-align: center;
				font-size: 0.24rem;
				color: #007309;
				margin-top: 0.1rem;
			}
		}
	}
	.tab-list {
		position: relative;
		z-index: 2;
		width: 7.5rem;
        overflow: hidden;
		height: 1.07rem;
		padding: 0 0.185rem;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 0.38rem;
		.tab {
			width: 3.53rem;
			height: 1.07rem;
            position: relative;
            &:nth-child(1) {
                margin-right: 0.08rem;
            }
			img {
				width: 4.55rem;
				height: 1.07rem;
                position: absolute;
			}
		}
	}
	.top-list {
		width: 7.5rem;
		height: 5.25rem;
		position: relative;
		background-image: url(https://yaame-static.yaame.io/admin/de390a5381b0b7fdc07abe6fe324a33a.png);
		background-size: contain;
		background-repeat: no-repeat;
		z-index: 1;
		top: -0.2rem;
		display: flex;
		justify-content: space-between;
		padding: 0 0.19rem;
		.top-item {
			width: 2.17rem;
			height: 4.06rem;
			margin-top: 1.19rem;
			background-size: contain;
			background-repeat: no-repeat;
			&:nth-child(1) {
				background-image: url(https://static.yaame.io/admin/d5cf059f4015401a1c4b2df7ff59b42d.png);
				.num {
					background-image: url(https://static.yaame.io/admin/0e4264c216b61deb5ae27922a98a4fb1.png);
				}
			}
			&.big {
				width: 2.4rem;
				height: 4.52rem;
				background-image: url(https://static.yaame.io/admin/1cbec9d784451a599b29d8e9cf50ec26.png);
				margin-top: 0.73rem;
				.avatar {
					width: 1.16rem;
					height: 1.16rem;
					margin-left: 0.6rem;
					margin-top: 1.35rem;
					background-size: 1.16rem 1.16rem;
					position: relative;
					border-radius: 50%;
					margin-bottom: 0.2rem;
					img {
						width: 1.88rem;
						height: 1.59rem;
					}
				}
				.num {
					width: 1.77rem;
					height: 0.36rem;
					line-height: 0.36rem;
					margin-left: 0.315rem;
					background-image: url(https://static.yaame.io/admin/b7c06f1a3358904608c4f436363e540d.png);
				}
			}
			&:nth-child(3) {
				background-image: url(https://static.yaame.io/admin/16226bba8830f75c7facbd432ee95059.png);
				.num {
					background-image: url(https://static.yaame.io/admin/118f87de4da41639df35adac04253217.png);
				}
			}
			.avatar {
				width: 1.04rem;
				height: 1.04rem;
				margin-left: 0.6rem;
				margin-top: 1.18rem;
				margin-bottom: 0.2rem;
				background-size: 1.04rem 1.04rem;
				background-repeat: no-repeat;
				background-position: center center;
				position: relative;
				border-radius: 50%;
				img {
					position: absolute;
					left: -0.32rem;
					top: -0.19rem;
					width: 1.68rem;
					height: 1.42rem;
				}
			}
			.info {
				width: 100%;
				font-size: 0.2rem;
				// margin-left: -10%;
				text-align: center;
				font-weight: 600;
				color: #5f1c1c;
				// transform: scale(0.8333);
			}
			.num {
				width: 1.59rem;
				height: 0.34rem;
				line-height: 0.34rem;
				background-size: contain;
				background-repeat: no-repeat;
				margin-left: 0.295rem;
				font-size: 0.2rem;
				color: #d63200;
				text-align: center;
				font-weight: 600;
				img {
					width: 0.22rem;
					height: 0.22rem;
					vertical-align: middle;
				}
			}
		}
	}
	.list {
		margin-top: 0.1rem;
		width: 7.5rem;
		padding: 0 0.13rem;
        min-height: 5rem;
		&.GUARD {
			.list-item {
				background-image: url(https://yaame-static.yaame.io/admin/6c0b1c0bad5eab290c3b05753116e03b.png);
			}
		}
		.list-item {
			width: 7.24rem;
			height: 1.44rem;
			margin-bottom: 0.16rem;
			background-image: url(https://yaame-static.yaame.io/admin/e09d7d161661389c68a2670eb6a85eb4.png);
			background-repeat: no-repeat;
			background-size: contain;
			display: flex;
			flex-wrap: nowrap;
			align-items: center;
			.sort {
				width: 0.56rem;
				height: 0.53rem;
				background-image: url(https://static.yaame.io/admin/f0c1eb62282b19a9f8e20a4c8336b45e.png);
				background-size: contain;
				background-repeat: no-repeat;
				font-size: 0.24rem;
				color: #d6001c;
				text-align: center;
				line-height: 0.53rem;
				margin-bottom: 0;
				margin-left: 0.18rem;
			}
			.avatar {
				width: 0.9rem;
				height: 0.9rem;
				background-size: 0.9rem 0.9rem;
				background-position: center center;
				background-repeat: no-repeat;
				border-radius: 50%;
				position: relative;
				margin-left: 0.22rem;
				img {
					position: absolute;
					left: -0.07rem;
					top: -0.08rem;
					width: 1.04rem;
					height: 1.06rem;
				}
			}
			.info {
				width: 3.4rem;
				font-size: 0.22rem;
				color: #ffffff;
				margin-left: 0.16rem;
			}
			.value {
				width: 1.6rem;
				text-align: right;
				color: #fff;
				font-size: 0.22rem;
				img {
					width: 0.28rem;
					height: 0.28rem;
					vertical-align: middle;
				}
			}
		}
	}
    .no-data {
        width: 7.5rem;
        height: 6rem;
        padding-bottom: 2rem;
        img {
            width: 2.51rem;
            height: auto;
        }
    }
	.user-info {
		width: 7.5rem;
		height: 1.99rem;
		position: fixed;
		z-index: 9;
		bottom: 0;
		left: 0;
		background-image: url(https://yaame-static.yaame.io/admin/a2b32d8d5607e36701d9d3eae9a2de0e.png);
		background-repeat: no-repeat;
		background-size: contain;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		padding-top: 0.26rem;
		padding-left: 0.14rem;
		padding-right: 0.2rem;
		.sort {
			width: 0.56rem;
			height: 0.53rem;
			background-image: url(https://static.yaame.io/admin/f0c1eb62282b19a9f8e20a4c8336b45e.png);
			background-size: contain;
			background-repeat: no-repeat;
			font-size: 0.24rem;
			color: #d6001c;
			text-align: center;
			line-height: 0.53rem;
			margin-bottom: 0;
			margin-left: 0.18rem;
		}
		.avatar {
			width: 0.9rem;
			height: 0.9rem;
			background-size: 0.9rem 0.9rem;
			background-position: center center;
			background-repeat: no-repeat;
			border-radius: 50%;
			position: relative;
			margin-left: 0.22rem;
			img {
				position: absolute;
				left: -0.07rem;
				top: -0.08rem;
				width: 1.04rem;
				height: 1.06rem;
			}
		}
		.info {
			width: 3.4rem;
			font-size: 0.22rem;
			color: #ffffff;
			margin-left: 0.16rem;
		}
		.value {
			width: 1.6rem;
			text-align: right;
			color: #fff;
			font-size: 0.22rem;
			img {
				width: 0.28rem;
				height: 0.28rem;
				vertical-align: middle;
			}
		}
	}
	.flex-box {
		display: flex;
		justify-content: center;
		align-items: center;
		.rule-container {
			width: 7.1rem;
			height: 10.05rem;
			background-image: url(https://yaame-static.yaame.io/admin/0428a4991352f1b3fa75f7d36fceaec5.png);
			background-size: contain;
			background-repeat: no-repeat;
			position: relative;
			padding: 1.78rem 0.33rem 0.33rem;
			font-size: 0.28rem;
			color: #fff;
			margin-top: -0.6rem;
            text-align: right !important;
			p {
				margin-bottom: 0.24rem;
				span {
					color: #FFF2B3;
				}
			}
            .scroll-box {
                width: 6.4rem;
                height: 7.5rem;
                overflow-y: scroll;
            }
			.close {
				width: 0.6rem;
				height: 0.6rem;
				position: absolute;
				bottom: -0.8rem;
				left: 3.23rem;
			}
		}
	}
	.reward-container {
		width: 7.5rem;
		height: 100vh;
		position: fixed;
        overflow-x: hidden;
		z-index: 10;
		top: 0;
		left: 0;
		background-color: #076837;
		background-image: url(https://yaame-static.yaame.io/admin/f209912b3c58c4e39b6db872244ef6b2.png);
		background-size: 7.5rem auto;
		background-repeat: no-repeat;
		padding-top: 1.11rem;
        text-align: right !important;
		.back {
			width: 0.6rem;
			height: 0.6rem;
            position: absolute;
            top: 0.96rem;
            left: 0.4rem;
		}
		header {
			height: 0.32rem;
			font-size: 0.32rem;
			color: #ffffff;
			letter-spacing: 0;
			text-align: center;
			font-weight: 600;
		}
		.reward-tab-list {
			width: 6rem;
			height: 0.8rem;
			line-height: 0.8rem;
			margin-top: 0.4rem;
			margin-left: 0.75rem;
			background: #148800;
			border: 0.03rem solid #25BB23;
			border-radius: 0.4rem;
			overflow: hidden;
			display: flex;
			font-size: 0.24rem;
			.tab {
				flex: 1;
				text-align: center;
				color: #fff;
				opacity: 0.4rem;
                font-weight: 600;
				&.active {
					background-image: linear-gradient(180deg, #FFFFFF 0%, #FDFDFC 0%, #C1DEBC 98%);
					border: 0.02rem solid #25BB23;
					border-radius: 0.4rem;
					color: #007309;
					opacity: 1;
				}
			}
		}
		.attack-bar,
		.protection-bar {
			width: 6.7rem;
			height: 0.5rem;
			line-height: 0.5rem;
			font-size: 0.24rem;
			color: #007309;
			letter-spacing: 0;
			margin-top: 0.5rem;
			margin-left: 0.4rem;
			background-image: url(https://yaame-static.yaame.io/admin/656b671d0679fe27f101233a5eb046aa.png);
			background-size: contain;
			background-repeat: no-repeat;
			padding-right: 0.62rem;
            text-align: right;
		}
		.protection-bar {
			background-image: url(https://yaame-static.yaame.io/admin/8c75a579c98553e4ef4136f99c302278.png);
		}
		.reward-item {
			.title {
				font-size: 0.24rem;
				color: #007309;
				letter-spacing: 0;
				font-weight: 600;
                margin-top: 0.4rem;
				margin-bottom: 0.24rem;
                padding-right: 0.4rem;
			}
            .title-pro {
                width: 6.7rem;
                height: 0.5rem;
                font-size: 0.24rem;
                line-height: 0.5rem;
                color: #007309;
                background-image: url(https://yaame-static.yaame.io/admin/656b671d0679fe27f101233a5eb046aa.png);
                background-size: contain;
                background-repeat: no-repeat;
                font-weight: 600;
                margin-top: 0.4rem;
				margin-bottom: 0.24rem;
                padding-right: 0.62rem;
                margin-left: 0.4rem;
            }
			.reward-list {
				display: flex;
				// justify-content: space-around;
				padding: 0 0.34rem;
                flex-wrap: wrap;
			}
		}
		.reward-ele {
            margin-right: 0.36rem;
			width: 2rem;
			height: 2.3rem;
            &:nth-child(3n) {
                margin-right: 0;
            }
			.ele-avatar {
				width: 2rem;
				height: 1.8rem;
				background-image: url(https://yaame-static.yaame.io/admin/726085f1de9d8cd59a3e4d06f8439d0b.png);background-size: contain;
                background-repeat: no-repeat;
				border-radius: 0.19rem;
				display: flex;
				justify-content: center;
				align-items: center;
				position: relative;
				img {
					width: 1.3rem;
					height: 1.3rem;
				}
				.diamond {
					position: absolute;
					width: auto;
					height: 0.38rem;
					text-align: center;
					line-height: 0.38rem;
					padding: 0 0.1rem;
					right: -0.01rem;
					top: -0.01rem;
					background-image: linear-gradient(90deg, #27BB24 0%, #1AB81D 100%);
					border-radius: 0px 0.1135rem 0px 0.19rem;
					font-size: 0.2rem;
					color: #fff;
					img {
						width: 0.23rem;
						height: auto;
						vertical-align: middle;
					}
				}
			}
			.ele-name {
				font-size: 0.24rem;
				color: #ffffff;
				text-align: center;
				margin-top: 0.12rem;
			}
		}
	}
}
</style>
