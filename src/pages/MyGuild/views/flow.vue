<!--
 * @Author: Elk
 * @Date: 2023-07-27 11:45:59
 * @FilePath: /yaame-h5/src/pages/MyGuild/views/flow.vue
 * @Description: Regulations
-->
<template>
	<div :style="{ paddingTop: safe_height + 1.08 + 'rem' }">
		<Header
			style="position: fixed"
			:keep="true"
			:keepColor="false"
			color="blank"
            :custom_back="true" @onCustomBack="back"
			>{{ title }}
		</Header>

		<div v-if="tab === 'textIncome'" class="tab">
			<div
				v-for="(item, index) in tabList"
				:key="index"
				:class="[tabActive === item.key && 'active']"
				@click="handleTabClick(item.key)"
			>
				{{ item.name }}
			</div>
		</div>

		
		<div
            v-if="list && list.length"
			v-infinite-scroll="loadMore"
			:infinite-scroll-immediate-check="true"
			infinite-scroll-disabled="loading"
			infinite-scroll-distance="10"
			class="list"
		>
			<div v-if="tab === 'textIncome'">
				<div v-if="active === 'DailyIncome'" class="text-list">
					<div v-for="(item, index) in list" :key="index" class="text-list-item">
						<div class="text-list-item-avatar">
							<img
								:src="item.avatar"
								alt=""
							/>
						</div>
						<div class="text-list-item-info">
							<div class="text-list-item-info-name">{{ item.nick_name }}</div>
							<div v-if="item.create_time" class="text-list-item-info-time">{{ statusTime ? formatDate(item.create_time, "yyyy-MM-dd hh:mm:ss") : formatDate(item.create_time, "yyyy-MM-dd") }}</div>
                            <div v-else class="room-list-item-info-time">{{ formatDs(item.ds) }}</div>
						</div>
						<div class="text-list-item-money">{{ item.tip }}</div>
					</div>
				</div>
                <div v-else class="room-list">
                    <div v-for="(item, index) in list" :key="index" class="room-list-item">
                        <div class="room-list-item-info">
                            <div class="room-list-item-info-name">{{ $t('getCommission') }}</div>
                            <div v-if="item.create_time" class="room-list-item-info-time">{{ statusTime ? formatDate(item.create_time, "yyyy-MM-dd hh:mm:ss") : formatDate(item.create_time, "yyyy-MM-dd") }}</div>
                            <div v-else class="room-list-item-info-time">{{ formatDs(item.ds) }}</div>
                        </div>
                        <div class="room-list-item-money">{{ item.tip }}</div>
                    </div>
                </div>
			</div>
			<div v-if="tab === 'roomIncome'">
				<div class="room-list">
                    <div v-for="(item, index) in list" :key="index" class="room-list-item">
                        <div class="room-list-item-info">
                            <div class="room-list-item-info-name">{{ item.title }}</div>
                            <div v-if="item.create_time" class="room-list-item-info-time">{{ statusTime ? formatDate(item.create_time, "yyyy-MM-dd hh:mm:ss") : formatDate(item.create_time, "yyyy-MM-dd") }}</div>
                            <div v-else class="room-list-item-info-time">{{ formatDs(item.ds) }}</div>
                        </div>
                        <div class="room-list-item-money">{{ item.diamond_tip }}</div>
                    </div>
                </div>
			</div>
            <div v-if="tab === 'chatIncome'">
				<div class="room-list">
                    <div v-for="(item, index) in list" :key="index" class="room-list-item">
                        <div class="room-list-item-info">
                            <div class="room-list-item-info-name">{{ item.title }}</div>
                            <div v-if="item.create_time" class="room-list-item-info-time">{{ statusTime ? formatDate(item.create_time, "yyyy-MM-dd hh:mm:ss") : formatDate(item.create_time, "yyyy-MM-dd") }}</div>
                            <div v-else class="room-list-item-info-time">{{ formatDs(item.ds) }}</div>
                        </div>
                        <div class="room-list-item-money">{{ item.diamond_tip }}</div>
                    </div>
                </div>
			</div>
		</div>

		<!-- 缺省 -->
		<div v-else class="empty-div">
			<div class="no-data">
				<div>
					<img
						src="https://static.yaame.io/admin/353cbb29343578377f92f2d13c2e4638.png"
						alt=""
					/>
					<p>{{ $t("noGift") }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, computed } from "vue";
import Header from "@/components/common/header.vue";
import { getSafeHeight } from "@/lib/device";
import { getTextFlows, getFlows } from "../api";
import { formatDate } from "../../../lib/utils.js";


let safe_height = ref(0);
let tabActive = ref("TO_DAY_ROUND");
const root = getCurrentInstance();
const t = (val) => {
	return root.proxy.$i18n.t(val);
};

let tab = root.proxy.$route.query.tab || "roomIncome";
let active = root.proxy.$route.query.active || "DailyIncome";

// 用来判断页面展示时间
const statusTime = ref(active === "DailyIncome");

const tabList = ref([
	{
		name: t("sixRoundNumber"),
		key: "TO_DAY_ROUND",
	},
	{
		name: t("threeRoundNumber"),
		key: "SECOND_ROUND",
	},
]);

const handleTabClick = (key) => {
	tabActive.value = key;
	page.value = 1;
    // 重置last_time
    if (tab === "textIncome") {
        if (key === "TO_DAY_ROUND") {
            last_time.value = root.proxy.$route.query.first_time;
        } else {
            last_time.value = root.proxy.$route.query.second_time;
        }
    } else {
        last_time.value = root.proxy.$route.query.last_time;
    }

	getData();
};

let page = ref(1);
let has_next = ref(true);
const loadMore = async () => {
	if (has_next.value) {
		page.value++;
		await getData();
	}
};

let textList = ref([]);
let roomList = ref([]);
let chatList = ref([]);

let last_time = ref(0);

const getData = async () => {
	try {
		if (tab === "textIncome") {
            let submitTime = last_time.value;
            let first_time = root.proxy.$route.query.first_time;
            let second_time = root.proxy.$route.query.second_time;
            
            if (!submitTime) {
                if (tabActive.value === "TO_DAY_ROUND") {
                    submitTime = first_time;
                } else {
                    submitTime = second_time;
                }
            }

            let options = {
				page: page.value,
				size: 30,
				type: tabActive.value,
				ds: active === "DailyIncome" ? root.proxy.$route.query.ds : root.proxy.$route.query.start.split(".").join(""),
				cycle: active === "DailyIncome" ? "DAY" : "WEEK",
			};

            if (submitTime) {
                options.last_time = submitTime;
            }

			let res = await getTextFlows(options);
			if (res.status === 1000) {
				if (res.data.content && res.data.content.length) {
                    if (page.value === 1) {
                        textList.value = res.data.content;
                    } else {
                        textList.value = textList.value.concat(res.data.content);
                    }
                    has_next.value = res.data.has_next;
                } else {
                    has_next.value = false;
                    textList.value = [];
                }

                last_time.value = res.data.last_time;
			}
		} else {
            let options = {
				page: page.value,
				size: 30,
				type: tab === "roomIncome" ? 0 : 1,
				ds: active === "DailyIncome" ? root.proxy.$route.query.ds : root.proxy.$route.query.start.split(".").join(""),
				cycle: active === "DailyIncome" ? "DAY" : "WEEK",
			};
            if (last_time.value) {
                options.last_time = last_time.value;
            } else {
                if (root.proxy.$route.query.last_time) {
                    options.last_time = root.proxy.$route.query.last_time;
                }
            }
			let res = await getFlows(options);
			if (res.status === 1000) {
				if (res.data.content && res.data.content.length) {
                    if (page.value === 1) {
                        if (tab === "roomIncome") {
                            roomList.value = res.data.content;
                        } else {
                            chatList.value = res.data.content;
                        }
                    } else {
                        if (tab === "roomIncome") {
                            roomList.value = roomList.value.concat(res.data.content);
                        } else {
                            chatList.value = chatList.value.concat(res.data.content);
                        }
                    }
                    has_next.value = res.data.has_next;
                }

                last_time.value = res.data.last_time;
			}
		}
	} catch (error) {
		console.log(error);
	}
};

const list = computed(() => {
	if (tab === "textIncome") {
		return textList.value;
	} else if (tab === "roomIncome") {
		return roomList.value;
	} else {
		return chatList.value;
	}
});

const back = () => {
    root.proxy.$router.go(-1);
};

const title = computed(() => {
    if (root.proxy.$route.query.tab === 'roomIncome') {
        if (root.proxy.$route.query.active === 'DailyIncome') {
            return t('voiceRoomDailyIncomeDetails');
        } else {
            return t('voiceRoomWeeklyIncomeDetails');
        }
    } else if (root.proxy.$route.query.tab === 'chatIncome') {
        if (root.proxy.$route.query.active === 'DailyIncome') {
            return t('chatDailyIncomeDetails');
        } else {
            return t('chatWeeklyIncomeDetails');
        }
    } else {
        if (root.proxy.$route.query.active === 'DailyIncome') {
            return t('textDailyIncomeDetails');
        } else {
            return t('textWeeklyIncomeDetails');
        }
    }
});

const formatDs = (ds) => {
    let content = String(ds).substring(0, 8);
    // ds = yyyyMMdd 转换为 yyyy-MM-dd
    return content.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
}

onMounted(async () => {
	let safe_area = getSafeHeight() || 0;
	safe_height.value = (safe_area * 2) / 100;

	await getData();
});
</script>
<style lang="less" scoped>
.tab {
	width: 6.9rem;
	height: 0.68rem;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0.08rem;
	background: #e9eff4;
	border-radius: 0.34rem;
	font-size: 0.26rem;
	font-weight: 500;
	color: #333333;
	margin-left: 0.3rem;

	div {
		width: 3.45rem;
		height: 0.52rem;
		text-align: center;
		line-height: 0.52rem;

		border-radius: 0.3rem;

		&.active {
			background-color: #fff;
		}
	}
}

.empty-div {
	width: 6.9rem;
	background: #ffffff;
	border-radius: 0.24rem;
	margin-left: 0.3rem;
	padding: 0.3rem;
	margin-top: 0.3rem;
	.no-data {
		width: 6.3rem;
		min-height: 4.82rem;
		background: #ffffff;
		border-radius: 0.24rem;
		display: flex;
		justify-content: center;
		align-items: center;

		div {
			width: 1.8rem;
			height: 2.4rem;

			img {
				width: 1.8rem;
				height: 1.8rem;
				margin-bottom: 0.3rem;
			}

			p {
				text-align: center;
				font-size: 0.24rem;
				font-weight: 400;
				color: #333333;
			}
		}
	}
}
.list {
	margin-top: 0.3rem;
}
.text-list {
	width: 7.1rem;
	height: auto;
	margin-left: 0.2rem;
	background: #ffffff;
	border-radius: 0.24rem 0.24rem 0 0;
	padding: 0.3rem;
	.text-list-item {
		width: 6.5rem;
		height: 0.9rem;
		margin-bottom: 0.5rem;
		display: flex;
		align-items: center;
        &:nth-last-of-type(1) {
            margin-bottom: 0;
        }
		.text-list-item-avatar {
			width: 0.9rem;
			height: 0.9rem;
			border-radius: 50%;
			overflow: hidden;
			img {
				width: 100%;
				height: 100%;
			}
		}
		.text-list-item-info {
			width: 4.3rem;
			height: 0.9rem;
			padding-left: 0.3rem;
			.text-list-item-info-name {
				font-weight: 400;
				font-size: 0.28rem;
				color: #333333;
			}
			.text-list-item-info-time {
				font-weight: 400;
				font-size: 0.2rem;
				color: #999999;
			}
		}
		.text-list-item-money {
			font-weight: bold;
			font-size: 0.36rem;
			color: #393939;
		}
	}
}
.room-list {
	width: 7.1rem;
	height: auto;
	margin-left: 0.2rem;
	background: #ffffff;
	border-radius: 0.24rem;
	padding: 0.3rem;
	.room-list-item {
		width: 6.5rem;
		height: 0.74rem;
		margin-bottom: 0.5rem;
		display: flex;
		align-items: center;
        &:nth-last-of-type(1) {
            margin-bottom: 0;
        }
		.room-list-item-info {
			width: 5.24rem;
			height: 0.74rem;
			.room-list-item-info-name {
				font-weight: 500;
				font-size: 0.3rem;
				color: #393939;
			}
			.room-list-item-info-time {
				font-weight: 500;
				font-size: 0.24rem;
				color: #999999;
			}
		}
        .room-list-item-money {
            font-weight: bold;
            font-size: 0.36rem;
            color: #393939;
        }
	}
}
</style>
