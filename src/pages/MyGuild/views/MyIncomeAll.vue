<!--
 * @Author: Elk
 * @Date: 2023-07-27 11:45:59
 * @FilePath: /yaame-h5/src/pages/MyGuild/views/MyIncomeAll.vue
 * @Description: Regulations
-->
<template>
	<div :class="[language]" :style="{ paddingTop: safe_height + 1.08 + 'rem' }">
		<Header
			style="position: fixed"
			:keep="true"
			:keepColor="false"
			color="blank"
            :custom_back="true" @onCustomBack="back"
            :right_img="guildType === 'CHAT' ? 'https://yaame-static.yaame.io/admin/1f0291999b2305dc8bb4cd73097a2778.png' : ''"
            @rightCall="rightCallBack"
			>{{ $t("MyIncome") }}
		</Header>

		<div class="tab">
			<div
				v-for="(item, index) in tabList"
				:key="index"
				:class="[active === item.key && 'active']"
				@click="activeClick(item.key)"
			>
				{{ item.name }}
			</div>
		</div>

		<div v-if="active === 'DailyIncome'" class="select-time">
			<img
				src="https://static.yaame.io/admin/c625997a9fbdf699be58fc0fd5c4a3c0.png"
				@click="handlePrev"
			/>
			<div class="time-text" @click="openPicker">{{ currentDayText }}</div>
			<img
				src="https://static.yaame.io/admin/1c9d434952ad8a4632acd090de3e0402.png"
				@click="handleNext"
			/>
		</div>
		<div v-else class="select-time">
			<img
				src="https://static.yaame.io/admin/c625997a9fbdf699be58fc0fd5c4a3c0.png"
				@click="handleMouthPrev"
			/>
			<div class="time-text">
				{{ setMouth() }}
			</div>
			<img
				src="https://static.yaame.io/admin/1c9d434952ad8a4632acd090de3e0402.png"
				@click="handleMouthNext"
			/>
		</div>

		<p>{{ $t("dataRefresh") }}</p>
		<p>{{ $t("dataRefreshTip") }}</p>
		<p v-if="isTodayFlag">{{ $t("dataRefreshTip2", [timeText]) }}</p>

		<div class="list-tab">
			<div v-for="(item, index) in listTab" :key="index">
				<div
					:class="[activeTab === item.key && 'active']"
					@click="activeTab = item.key"
				>
					{{ item.name }}
				</div>
			</div>
		</div>

		<template v-if="list.length > 0">
			<div v-show="activeTab === 'roomIncome'" class="room-list">
				<div class="room-list-item">
					<div class="room-list-item-header">
						<span>{{ $t('liveData') }}</span>
					</div>
					<div class="room-list-item-content">
						<span>{{ $t('LiveDuration') }}</span>
						<span> {{ listInfo.live_time }}min </span>
					</div>
					<div
						v-show="active === 'MonthlyIncome'"
						class="room-list-item-content"
					>
						<span>{{ $t('LiveDays') }}</span>
						<span>
							{{ listInfo.live_day }}days
						</span>
					</div>
				</div>
				<div v-for="(item, index) in list" :key="index" class="room-list-item">
					<div class="room-list-item-header">
						<span>{{ item.name }}</span>
						<span v-show="item.current === 1">{{ $t('current') }}</span>
					</div>
					<div class="room-list-item-content">
						<span>{{ $t('income_coins') }}</span>
						<span>
							<img
								src="https://yaame-static.yaame.io/admin/6665fab9f0ec633585db5d55a0c921f5.png"
								alt=""
							/>
							{{ item.income ? item.income : 0 }}
						</span>
					</div>
				</div>
			</div>

			<div v-show="activeTab === 'textIncome'" class="text-list">
				<div v-for="(item, index) in list" :key="index" class="text-list-item">
					<div class="text-list-item-header">
						<span>{{ item.name }}</span>
						<span v-show="item.current === 1">{{ $t('current') }}</span>
					</div>
					<div class="text-list-item-content">
						<span>{{ $t('getUSD') }}</span>
						<span>{{ item.text_income?.income }}USD</span>
					</div>
					<div class="text-list-item-info">
						<span class="left-item">{{ $t('sixRoundEffectiveNumber') }}</span>
						<span class="right-item">{{ item.text_income?.six_cycle_num }}</span>
					</div>
					<div class="text-list-item-info">
						<span class="left-item">{{ $t('threeRoundEffectiveNumber') }}</span>
						<span class="right-item">{{
							item.text_income?.three_cycle_num
						}}</span>
					</div>
				</div>
			</div>

			<div v-show="activeTab === 'chatIncome'" class="text-list">
				<div v-for="(item, index) in list" :key="index" class="text-list-item">
					<div class="text-list-item-header">
						<span>{{ item.name }}</span>
						<span v-show="item.current === 1">{{ $t('current') }}</span>
					</div>
					<div class="text-list-item-content">
						<span>{{ $t('totalGoldIncome') }}</span>
						<span>
							<img
								src="https://yaame-static.yaame.io/admin/6665fab9f0ec633585db5d55a0c921f5.png"
								alt=""
							/>
							{{ item.chat_income?.income }}
						</span>
					</div>
					<div class="text-list-item-info">
						<span class="left-item">{{ $t('voiceChatGoldIncome') }}</span>
						<span class="right-item"
							><img
								src="https://yaame-static.yaame.io/admin/6665fab9f0ec633585db5d55a0c921f5.png"
								alt=""
							/>{{ item.chat_income?.audio_chat_income }}</span
						>
					</div>
					<div class="text-list-item-info">
						<span class="left-item">{{ $t('chatGiftGoldIncome') }}</span>
						<span class="right-item"
							><img
								src="https://yaame-static.yaame.io/admin/6665fab9f0ec633585db5d55a0c921f5.png"
								alt=""
							/>{{ item.chat_income?.gift_income }}</span
						>
					</div>
					<div class="text-list-item-info">
						<span class="left-item">{{ $t('textChatGoldIncome') }}</span>
						<span class="right-item"
							><img
								src="https://yaame-static.yaame.io/admin/6665fab9f0ec633585db5d55a0c921f5.png"
								alt=""
							/>{{ item.chat_income?.soul_match_income }}</span
						>
					</div>
                    <div v-if="active === 'MonthlyIncome'" class="text-list-item-info">
						<span class="left-item">{{ $t('rewardGold') }}</span>
						<span class="right-item"><img
								src="https://yaame-static.yaame.io/admin/6665fab9f0ec633585db5d55a0c921f5.png"
								alt=""
							/>{{
							item.chat_income?.reward_income
						}}</span>
					</div>
				</div>
			</div>
		</template>

		<!-- 缺省 -->
		<div v-if="list.length === 0" class="empty-div">
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

        <div class="to-flow" @click="toFlow">
            {{ active === 'DailyIncome' ? $t('dailyIncomeDetails') : $t('weeklyIncomeDetails') }}
        </div>

		<van-popup v-model="dayToggle" position="bottom">
			<van-datetime-picker
				v-model="dayPickerTime"
				:formatter="formatter"
				:max-date="maxDate"
				confirm-button-text="Confirm"
				cancel-button-text="Cancel"
				type="date"
				@cancel="dayToggle = false"
				@confirm="dayConfirm"
			>
			</van-datetime-picker>
		</van-popup>

        <pageLoading v-if="loading"></pageLoading>
	</div>
</template>

<script setup>
    import {
        ref,
        onMounted,
        reactive,
        computed,
        watch,
        getCurrentInstance,
        onBeforeUnmount,
        nextTick, onActivated,
    } from "vue";
import Header from "@/components/common/header.vue";
import { getSafeHeight, getLanguage } from "@/lib/device";
import request from "@/lib/request/contribution";
import { Toast } from "vant";
import pageLoading from "../../../components/common/page_loading.vue";

let safe_height = ref(0);
let active = ref("DailyIncome");
const root = getCurrentInstance();
const t = (val) => {
	return root.proxy.$i18n.t(val);
};

let language = computed(() => {
    let locale = getLanguage() || "en";
    if (['zh-hk', 'zh-tw', 'zh-mo', 'zh-cn', 'zh_cn'].indexOf(locale) > -1) {
        let localEnum = {
            'zh-hk': 'zh-tw',
            'zh-tw': 'zh-tw',
            'zh-mo': 'zh-tw',
            'zh-cn': 'zh-cn',
            'zh_cn': 'zh-cn',
        };

        locale = localEnum[locale];
    }
    return locale;
});

let loading = ref(true);

let listTab = ref([
	{
		name: t("roomIncome"),
		// name: "语音房收益",
		key: "roomIncome",
	},
	{
		name: t("textIncome"),
		// name: "1V1收益",
		key: "textIncome",
	},
	{
		name: t("chatIncome"),
		// name: "聊天收益",
		key: "chatIncome",
	},
]);

let activeTab = ref("roomIncome");

const deleteListTab = () => {
    // 如果公会类型为1V1
    if (guildType.value !== 'CHAT') {
        // 删除1V1收益
        listTab.value.splice(1, 1);
        activeTab.value = "roomIncome";
    }
}

const getUTC = () => {
	let now = new Date();
	return new Date(
		now.getUTCFullYear(),
		now.getUTCMonth(),
		now.getUTCDate(),
		now.getUTCHours(),
		now.getUTCMinutes(),
		now.getUTCSeconds()
	);
};

// 获取对于本地时间的10.1日时间戳
const getUTCOne = () => {
	return new Date(2024, 9, 1, 0, 0, 0);
};

// 获取UTC时间戳
const getUTCTime = () => {
	return new Date(Date.UTC(2024, 9, 1, 0, 0, 0));
};

// 获取菲律宾时间戳
const getPHILIPPINESTime = () => {
  return new Date(Date.UTC(2024, 10, 11, 0, 0, 0));
}
// // 获取相对本地时间11.10时间
// const getPHILIPPINESTwo = () => {
//   return new Date(Date.UTC(2024, 10, 4, 0, 0, 0));
// }


// 判断当前国家 和 时间是否超过24年10月1日
const regionIdStatus = ref(true);

if (root.proxy.$route.query.region_id === 'PHILIPPINES') {
    // 菲律宾只能查看11.10号之前的数据
    regionIdStatus.value = new Date().getTime() < getPHILIPPINESTime().getTime();
} else {
    // 其他国家只能查看10.1号之前的数据
    regionIdStatus.value = new Date().getTime() < getUTCTime().getTime();
}

const tabList = ref([
	{
		name: t("Days"),
		key: "DailyIncome",
	},
	{
		name: t("week"),
		key: "MonthlyIncome",
	},
]);

// 防止多次点击
let status = "";
const activeClick = (key) => {
	active.value = key;
	page.value = 1;
	if (key === "DailyIncome" && status !== "DailyIncome") {
		dayList.value = [];
		status = key;
		// 获取日数据
		getDay();
	}
	if (key === "MonthlyIncome" && status !== "MonthlyIncome") {
		mouthList.value = [];
		status = key;
		getMouth();
	}
};
let dayToggle = ref(false);
let currentDayDate = ref(regionIdStatus.value ? getUTCOne() : getUTC());
if (regionIdStatus.value) {
    if (root.proxy.$route.query.region_id === 'PHILIPPINES') {
        currentDayDate.value = getPHILIPPINESTime();
    } else {
        currentDayDate.value = getUTCOne();
    }
} else {
    currentDayDate.value = getUTC();
}


currentDayDate.value.setDate(currentDayDate.value.getDate());

let dayPickerTime = ref(getUTC());
dayPickerTime.value.setDate(dayPickerTime.value.getDate());

const currentDayText = computed(() => {
	let year = currentDayDate.value.getFullYear();
	let month = (currentDayDate.value.getMonth() + 1).toString().padStart(2, "0");
	let day = currentDayDate.value.getDate().toString().padStart(2, "0");
	return `${year}.${month}.${day}`;
});

const monthMap = reactive({
	"01": "January",
	"02": "February",
	"03": "March",
	"04": "April",
	"05": "May",
	"06": "June",
	"07": "July",
	"08": "August",
	"09": "September",
	10: "October",
	11: "November",
	12: "December",
});
const formatter = (type, val) => {
	if (type === "month") {
		return monthMap[val];
	}
	return val;
};
const openPicker = () => {
	dayToggle.value = true;
};

const handlePrev = () => {
	let time = new Date(currentDayDate.value).getTime() - 86400000;
    if (root.proxy.$route.query.region_id === 'PHILIPPINES') {
        if (time < getPHILIPPINESTime().getTime()) {
            Toast(t("earliest_view_nov_11"));
            return;
        }
    } else {
        if (time < getUTCTime().getTime()) {
            Toast(t("earliest_view_oct_1"));
            return;
        }
    }
	currentDayDate.value = new Date(
		new Date(currentDayDate.value).getTime() - 86400000
	);

	dayList.value = [];
	page.value = 1;
};

const handleNext = () => {
	const currentDate = new Date(currentDayDate.value);
	const tomorrow = new Date(getUTC().getTime() + 86400000);
	tomorrow.setHours(0, 0, 0, 0); // Set current time to the beginning of the day

	const yesterday = new Date(tomorrow);
	yesterday.setDate(yesterday.getDate() - 1);

	if (currentDate.getTime() < tomorrow.getTime()) {
		currentDayDate.value = new Date(currentDate.getTime() + 86400000);
		if (currentDate.getTime() >= yesterday.getTime()) {
			currentDayDate.value = yesterday;
			Toast(t("latest_day"));
			return;
		}
	} else {
		Toast(t("latest_day"));
		return;
	}

	dayList.value = [];
	page.value = 1;
};

const dayConfirm = (value) => {
	currentDayDate.value = value;
	dayToggle.value = false;
};
const currentMouthDate = ref(regionIdStatus.value ? getUTCOne() : getUTC());
if (regionIdStatus.value) {
    if (root.proxy.$route.query.region_id === 'PHILIPPINES') {
        currentMouthDate.value = getPHILIPPINESTime();
    } else {
        currentMouthDate.value = getUTCOne();
    }
} else {
    currentMouthDate.value = getUTC();
}
// 获取当前 年月锚点
const anchorYear = ref(currentMouthDate.value.getFullYear());
const anchorMouth = ref(currentMouthDate.value.getMonth() + 1);

const currentMouthText = ref("");

const handleMouthPrev = () => {
    if (root.proxy.$route.query.region_id === 'PHILIPPINES') {
        if (weeks.value[inx.value].start.getTime() <= getPHILIPPINESTime().getTime()) {
            Toast(t("earliest_view_nov_11"));
            return;
        }
    } else {
        if (weeks.value[inx.value].start.getTime() <= getUTCTime().getTime()) {
            Toast(t("earliest_view_oct_1"));
            return;
        }
    }
	// 此逻辑判断是否有跨月情况
	const status = weeks.value[0].start.getDate() !== 1;
	if (inx.value <= 0) {
		anchorMouth.value--;
		if (anchorMouth.value < 1) {
			anchorYear.value--;
			anchorMouth.value = 12;
		}
		weeks.value = getWeeksInMonth(anchorYear.value, anchorMouth.value);
		inx.value = weeks.value.length - 1;
	} else if (!status) inx.value--;
	if (status) inx.value--;
	tacitly();
};

const handleMouthNext = () => {
	if (weeks.value[inx.value].start.getTime() >= belongTo.value.getTime()) {
		Toast(t("latest_week"));
		return;
	}
	// 此逻辑判断是否有跨月情况
	const status =
		weeks.value[weeks.value.length - 1].end.getDate() !== 30 &&
		weeks.value[weeks.value.length - 1].end.getDate() !== 31;

	if (inx.value >= weeks.value.length - 1) {
		anchorMouth.value++;
		if (anchorMouth.value > 12) {
			anchorYear.value++;
			anchorMouth.value = 1;
			weeks.value = getWeeksInMonth(anchorYear.value, anchorMouth.value);
		} else weeks.value = getWeeksInMonth(anchorYear.value, anchorMouth.value);
		inx.value = 0;
	} else if (!status) inx.value++;
	if (status) inx.value++;
	tacitly();
};

let dayList = ref([]);
let mouthList = ref([]);
let page = ref(1);

let dayInfo = ref({
	last_text_first_flow_time: null,
    last_text_second_flow_time: null,
	last_time: null,
	live_day: 0,
	live_time: 0,
});
let MonthInfo = ref({
	last_text_first_flow_time: null,
    last_text_second_flow_time: null,
	last_time: null,
	live_day: 0,
	live_time: 0,
});

// 公会收入情况
const guildInfos = ref([]);
// 获取流水回传
const dayLastTime = ref(null);
const dayLastTextFirstTime = ref(null);
const dayLastTextSecondTime = ref(null);
const guildType = ref(root.proxy.$route.query.guild_type);
const getDay = async () => {
	try {
        let options = {
			cycle: "DAY",
			ds: Number(currentDayText.value.split(".").join("")),
		};
        if (root.proxy.$route.query.guild_id) {
            options.guild_id = root.proxy.$route.query.guild_id;
        }
		let res = await request.getIncomeRearDaily(options);
		if (res.status !== 1000) return;
		guildInfos.value = res.data.guild_infos || [];
		// 此逻辑防止上条时间戳和这次一样  一样不会触发 watch
		if (typeof res.data.last_time === 'number') {
            dayLastTime.value = res.data.last_time;
        }
        if (typeof res.data.last_text_first_flow_time === 'number') {
            dayLastTextFirstTime.value = res.data.last_text_first_flow_time;
        }
        if (typeof res.data.last_text_second_flow_time === 'number') {
            dayLastTextSecondTime.value = res.data.last_text_second_flow_time;
        }
		dayInfo.value = {
			last_text_first_flow_time: res.data.last_text_first_flow_time || null,
            last_text_second_flow_time: res.data.last_text_second_flow_time || null,
			last_time: res.data.last_time || null,
			live_day: res.data.live_day || 0,
			live_time: res.data.live_time || 0,
		};

		if (res.data.guild_infos) {
			dayList.value = res.data.guild_infos;
		}
	} catch (error) {
		console.log(error);
	}
};

const monthLastTime = ref(null);
const mouthLastTextFirstTime = ref(null);
const mouthLastTextSecondTime = ref(null);
const getMouth = async () => {
	try {
        let options = {
			cycle: "WEEK",
			ds: Number(start.value.split(".").join("")),
		};
        if (root.proxy.$route.query.guild_id) {
            options.guild_id = root.proxy.$route.query.guild_id;
        }
		// 转换时间戳开始
		let res = await request.getIncomeRearDaily(options);
		if (res.status === 1000) {
			if (res.data) {
				
				guildInfos.value = res.data.guild_infos || [];
				// 此逻辑防止上条时间戳和这次一样  一样不会触发 watch
				if (typeof res.data.last_time === 'number') {
                    monthLastTime.value = res.data.last_time;
                }
                if (typeof res.data.last_text_first_flow_time === 'number') {
                    mouthLastTextFirstTime.value = res.data.last_text_first_flow_time;
                }
                if (typeof res.data.last_text_second_flow_time === 'number') {
                    mouthLastTextSecondTime.value = res.data.last_text_second_flow_time;
                }

                MonthInfo.value = {
					last_text_first_flow_time: res.data.last_text_first_flow_time || null,
                    last_text_second_flow_time: res.data.last_text_second_flow_time || null,
					last_time: typeof res.data.last_time === 'number' ? res.data.last_time : null,
					live_day: res.data.live_day || 0,
					live_time: res.data.live_time || 0,
				};

				if (res.data.guild_infos) {
					mouthList.value = res.data.guild_infos;
				}
			}
		}
	} catch (error) {
		console.log(error);
	}
};

// 监听时间变化调用当前时间数据
watch(currentDayText, () => {
	dayInfo.value = {
		last_text_first_flow_time: null,
        last_text_second_flow_time: null,
        last_time: null,
		live_day: 0,
		live_time: 0,
	};
	dayList.value = [];
	getDay();
	isToday(currentDayDate.value);
});

nextTick(() => {
    watch(currentMouthText, () => {
        MonthInfo.value = {
            last_text_first_flow_time: null,
            last_text_second_flow_time: null,
            last_time: null,
            live_day: 0,
            live_time: 0,
        };
        mouthList.value = [];
        getMouth();
        isToday(currentMouthDate.value);
    });
})

const list = computed(() => {
	if (active.value === "DailyIncome") {
		return dayList.value;
	} else {
		return mouthList.value;
	}
});

const listInfo = computed(() => {
	if (active.value === "DailyIncome") {
		return dayInfo.value;
	} else {
		return MonthInfo.value;
	}
});

let maxDate = ref(new Date(getUTC().getTime() + 86400000));
maxDate.value.setDate(maxDate.value.getDate() - 1);

const formatDate = (activeValue, timestampOrDate) => {
	if (activeValue === "DailyIncome") {
		const date = new Date(timestampOrDate);
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		return `${year}.${month}.${day}`;
	} else {
		const dateStr = String(timestampOrDate);
		const year = dateStr.substr(0, 4);
		const month = dateStr.substr(4, 2);
		const day = dateStr.substr(6, 2) || "01";
		return `${year}.${month}.${day}`;
	}
};

let timeText = ref("");
// 距离今日结束倒计时函数 utc时区 hh:mm:ss
const countDown = () => {
	// 获取当前时间的UTC表示
	const now = new Date();
	const utcNow = new Date(
		Date.UTC(
			now.getUTCFullYear(),
			now.getUTCMonth(),
			now.getUTCDate(),
			now.getUTCHours(),
			now.getUTCMinutes(),
			now.getUTCSeconds()
		)
	);

	// 获取UTC时间今天结束的时间（即下一个凌晨0点）
	const utcMidnight = new Date(
		Date.UTC(
			utcNow.getUTCFullYear(),
			utcNow.getUTCMonth(),
			utcNow.getUTCDate() + 1
		)
	);

	// 计算当前时间到UTC凌晨的毫秒数
	const countdownMilliseconds = utcMidnight - utcNow;

	// 将毫秒转换为小时、分钟和秒
	const h = Math.floor(countdownMilliseconds / (1000 * 60 * 60));
	const m = Math.floor(
		(countdownMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
	);
	const s = Math.floor((countdownMilliseconds % (1000 * 60)) / 1000);

	timeText.value = `${h < 10 ? "0" + h : h}:${m < 10 ? "0" + m : m}:${
		s < 10 ? "0" + s : s
	}`;
};

watch(active, (val) => {
	if (val === "DailyIncome") {
		isToday(currentDayDate.value);
	} else {
		isToday(currentMouthDate.value);
	}
});
let isTodayFlag = ref(true);
// 计算传入时间（未转换utc）是否为utc时区的今天
const isToday = (inputDate) => {
	if (active.value === "MonthlyIncome") {
		// 构建当前UTC时间的年月日（'YYYY-MM-DD'格式）
		const startTime = start.value.split(".").join("");
		const endTime = end.value.split(".").join("");

		// 构建传入时间的UTC年月日（'YYYY-MM-DD'格式）
		const inputUTCString =
			inputDate.getFullYear() +
			"" +
			String(inputDate.getMonth() + 1).padStart(2, "0") +
			String(inputDate.getDate()).padStart(2, "0");

		// 比较两个日期字符串是否相等
		isTodayFlag.value =
			inputUTCString >= startTime && inputUTCString <= endTime;

		return;
	}

	// 创建当前时间的Date对象（基于本地时区）
	const now = new Date();

	// 构建当前UTC时间的年月日（'YYYY-MM-DD'格式）
	const utcTodayString =
		now.getUTCFullYear() +
		"-" +
		String(now.getUTCMonth() + 1).padStart(2, "0") +
		"-" +
		String(now.getUTCDate()).padStart(2, "0");

	// 构建传入时间的UTC年月日（'YYYY-MM-DD'格式）
	const inputUTCString =
		inputDate.getFullYear() +
		"-" +
		String(inputDate.getMonth() + 1).padStart(2, "0") +
		"-" +
		String(inputDate.getDate()).padStart(2, "0");

	// 比较两个日期字符串是否相等
	isTodayFlag.value = utcTodayString === inputUTCString;
};
let intervalFlag = null;

// 记录当月周
const getWeeksInMonth = (year, month) => {
	const weeks = [];
	const firstDay = new Date(year, month - 1, 1); // 获取该月的第一天
	const lastDay = new Date(year, month, 0); // 获取该月的最后一天

	// 迭代计算每周的起始和结束日期
	let weekStart = new Date(firstDay);
	let dayOfWeek = weekStart.getDay();
	// 如果 1 号不是周一，则回退到上一个周一
	if (dayOfWeek !== 1) {
		weekStart.setDate(
			weekStart.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)
		);
	}

	while (weekStart <= lastDay || weekStart.getMonth() === month) { //NOSONAR
		const weekEnd = new Date(weekStart);
		weekEnd.setDate(weekStart.getDate() + 6);

		weeks.push({
			start: new Date(weekStart),
			end: new Date(weekEnd.getTime() + 86394000),
		});

		if (weekEnd.getTime() >= lastDay.getTime()) {
			return weeks;
		}

		// 下周的开始日期
		weekStart.setDate(weekStart.getDate() + 7);
        // 调整思码意报错
        if (weekEnd.getTime() >= lastDay.getTime()) {
            break;
        }
	}
};
// 获取本月周  regionIdStatus.value ? getWeeksInMonth(2024, 10) : getWeeksInMonth(Number(currentMouthDate.value.getFullYear()), Number((currentMouthDate.value.getMonth() + 1)))
const weeks = ref(
	getWeeksInMonth(
		Number(currentMouthDate.value.getFullYear()),
		Number(currentMouthDate.value.getMonth() + 1)
	)
);
// 获取本月总周数
const sumWeek = ref(weeks.value.length - 1);
let dayIndex = new Date();
let monthIndex = currentMouthDate.value.getMonth() + 1;

// 获取下标  为防止上月有20多号如果本月在二十多号必须和本月同月
const inx = ref(
	weeks.value.findIndex((item) => {
		if (
			(dayIndex.getDate() < 25 || monthIndex === item.start.getMonth() + 1) &&
			dayIndex.getTime() >= item.start.getTime() &&
			dayIndex.getTime() <= item.end.getTime()
		)
			return true;
	})
);
// 防止页面加载失败
inx.value = inx.value < 0 ? 0 : inx.value;

// 获取默认当前属于周
const belongTo = ref(weeks.value[inx.value].start);

// 获取默认周
const start = ref(null);
const end = ref(null);
const tacitly = () => {
	const startText = weeks.value[inx.value].start;
	const endText = weeks.value[inx.value].end;
	start.value =
		startText.getFullYear() +
		"." +
		String(startText.getMonth() + 1).padStart(2, "0") +
		"." +
		String(startText.getDate()).padStart(2, "0");
	end.value =
		endText.getFullYear() +
		"." +
		String(endText.getMonth() + 1).padStart(2, "0") +
		"." +
		String(endText.getDate()).padStart(2, "0");
	// 单独限制2024  10月数据
	if (
		startText.getFullYear() <= 2024 &&
		startText.getMonth() + 1 === 9 &&
		startText.getDate() === 30
	) {
		let arr = start.value.split(".");
		arr[1] = 10;
		arr[2] = "01";
		start.value = arr.join(".");
	}
	currentMouthText.value = start.value + "-" + end.value;
};

// 展示去掉年展示
const setMouth = () => {
	const arr = currentMouthText.value.split("-");
	const end = arr[1].split(".");
	return arr[0] + "-" + end[1] + "." + end[2];
};

const toFlow = () => {
    let last_time = null;
    let first_time = null;
    let second_time = null;
    if (active.value === "DailyIncome") {
        if (activeTab.value === "textIncome") {
            last_time = '';

            first_time = dayLastTextFirstTime.value;
            second_time = dayLastTextSecondTime.value;
        } else {
            last_time = dayLastTime.value;
        }
    } else {
        if (activeTab.value === "textIncome") {
            last_time = '';
            first_time = mouthLastTextFirstTime.value;
            second_time = mouthLastTextSecondTime.value;
        } else {
            last_time = monthLastTime.value;
        }
    }

    // 设置缓存 返回选中tab
    localStorage.setItem("activeTab", activeTab.value);
    localStorage.setItem("active", active.value);


    // 记录当前查询数据的时间 用于返回    
    localStorage.setItem("currentDayDate", currentDayDate.value.getTime());

    root.proxy.$router.push({
        path: "/flow",
        query: {
            guild_id: root.proxy.$route.query.guild_id,
            active: active.value,
            tab: activeTab.value,
            start: start.value,
            end: end.value,
            ds: currentDayText.value.split(".").join(""),
            last_time,
            first_time,
            second_time,
        },
    });
};

const back = () => {
    if (localStorage.getItem("oneTab")) {
        localStorage.removeItem("oneTab");
        location.href = 'wlyaame://webview/pop';
    } else {
        root.proxy.$router.go(-1);
    }
        
};

const rightCallBack = () => {
    root.proxy.$router.push({
        name: 'Regulations',
        query: {
            guild_id: root.proxy.$route.query.guild_id,
            guild_type: root.proxy.$route.query.guild_type,
            region_id: root.proxy.$route.query.region_id,
        }
    });
}

let is_guild_owner = ref(Number(root.proxy.$route.query.is_guild_owner));

onMounted( () => {
    deleteListTab();
})

onActivated(async () => {
	let safe_area = getSafeHeight() || 0;
	safe_height.value = (safe_area * 2) / 100;
	tacitly();

    // 根据缓存设置默认选中tab 并且清空缓存 防止刷新
    if (localStorage.getItem("activeTab")) {
        activeTab.value = localStorage.getItem("activeTab");
        localStorage.removeItem("activeTab");
    }

    if (localStorage.getItem("active")) {
        active.value = localStorage.getItem("active");
        localStorage.removeItem("active");
    }


    if (localStorage.getItem("currentDayDate")) {
        currentDayDate.value = new Date(Number(localStorage.getItem("currentDayDate")));
        localStorage.removeItem("currentDayDate");
    }

    loading.value = false;


    countDown();
    intervalFlag = setInterval(() => {
        countDown();
    }, 1000);

    // 如果active为MonthlyIncome  则获取月数据
    if (active.value === "MonthlyIncome") {
        await getMouth();
    } else {
        await getDay();
    }
});
onBeforeUnmount(() => {
	clearInterval(intervalFlag);
});
</script>
<style lang="less" scoped>
.tab {
	width: 4.8rem;
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
	margin-left: 1.35rem;

	div {
		width: 2.32rem;
		height: 0.52rem;
		text-align: center;
		line-height: 0.52rem;

		border-radius: 0.3rem;

		&.active {
			background-color: #fff;
		}
	}
}

.select-time {
	width: 7.5rem;
	height: 0.4rem;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 0.6rem;
	margin-bottom: 0.3rem;

	img {
		width: 0.24rem;
	}

	.time-text {
		margin: 0 0.2rem;
		min-width: 2.31rem;
		font-weight: 500;
		color: #333333;
		font-size: 0.36rem;
		text-align: center;
	}
}
.ar {
    text-align: right;
    .list-tab {
        flex-direction: row-reverse;
    }
    .text-list {
        .text-list-item {
            .text-list-item-header {
                flex-direction: row-reverse;
            }
            .text-list-item-content {
                flex-direction: row-reverse;
            }
            .text-list-item-info {
                flex-direction: row-reverse;
            }
        }
    }
    .room-list {
        .room-list-item {
            .room-list-item-header {
                flex-direction: row-reverse;
            }
            .room-list-item-content {
                flex-direction: row-reverse;
            }
        }
    }
    .info-container {
        flex-direction: row-reverse;
    }
}
p {
	font-size: 0.24rem;
	color: #666;
	padding-left: 0.3rem;
	padding-right: 0.3rem;
}
.list-tab {
	width: 7.5rem;
	height: 0.4rem;
	font-weight: 500;
	font-size: 0.24rem;
	color: #999999;
	display: flex;
	flex-wrap: nowrap;
	padding: 0 0.3rem;
	margin-top: 0.67rem;
	margin-bottom: 0.4rem;
	line-height: 0.4rem;
	div {
		margin-right: 0.2rem;
	}
	.active {
		font-weight: 500;
		font-size: 0.26rem;
		color: #333333;
	}
}

.room-list {
	padding: 0 0.3rem 1.6rem;
	.room-list-item {
		width: 6.9rem;
		background: #ffffff;
		border-radius: 0.24rem;
		padding: 0 0.3rem;
		margin-bottom: 0.24rem;
		.room-list-item-header {
			width: 6.4rem;
			border-bottom: 0.01rem solid #eee;
			height: 0.84rem;
			line-height: 0.84rem;
			font-weight: 500;
			font-size: 0.24rem;
			color: #999999;
			display: flex;
			justify-content: space-between;
		}
		.room-list-item-content {
			width: 6.4rem;
			height: 0.9rem;
			line-height: 0.9rem;
			font-weight: 500;
			font-size: 0.3rem;
			color: #393939;
			display: flex;
			justify-content: space-between;
			img {
				width: 0.28rem;
				height: auto;
				vertical-align: middle;
				position: relative;
				bottom: 0.03rem;
				right: 0.03rem;
			}
		}
	}
}
.text-list {
	padding: 0 0.3rem 1.6rem;
	.text-list-item {
		width: 6.9rem;
		background: #eaf5ec;
		border-radius: 0.24rem;
		margin-bottom: 0.24rem;
		overflow: hidden;
		.text-list-item-header {
			background-color: #fff;
			width: 6.9rem;
			border-bottom: 0.01rem solid #eee;
			height: 0.84rem;
			line-height: 0.84rem;
			font-weight: 500;
			font-size: 0.24rem;
			color: #999999;
			display: flex;
			justify-content: space-between;
			padding: 0 0.3rem;
		}
		.text-list-item-content {
			background-color: #fff;
			width: 6.9rem;
			height: 0.9rem;
			line-height: 0.9rem;
			font-weight: 500;
			font-size: 0.3rem;
			color: #393939;
			display: flex;
			justify-content: space-between;
			margin-bottom: 0.06rem;
			padding: 0 0.3rem;
			border-bottom-left-radius: 0.24rem;
			border-bottom-right-radius: 0.24rem;
			img {
				width: 0.28rem;
				height: auto;
				vertical-align: middle;
				position: relative;
				bottom: 0.03rem;
				right: 0.03rem;
			}
		}

		.text-list-item-info {
			width: 6.9rem;
			height: 0.7rem;
			line-height: 0.7rem;
			display: flex;
			justify-content: space-between;
			padding: 0 0.3rem;
			.left-item {
				font-weight: 400;
				font-size: 0.24rem;
				color: #666666;
			}
			.right-item {
				font-weight: bold;
				font-size: 0.28rem;
				color: #666666;
				img {
					width: 0.28rem;
					height: auto;
					vertical-align: middle;
					position: relative;
					bottom: 0.03rem;
					right: 0.03rem;
				}
			}
		}
	}
}

.empty-div {
	width: 6.9rem;
	background: #ffffff;
	border-radius: 0.24rem;
	margin-left: 0.3rem;
	padding: 0.3rem;
	.no-data {
		width: 6.3rem;
		min-height: 4.82rem;
		background: #ffffff;
		border-radius: 0.24rem;
		display: flex;
		justify-content: center;
		align-items: center;

		div {
			width: 6.3rem;
			height: 2.4rem;
            text-align: center;
			img {
                // margin-left: 2.25rem;
				width: 1.8rem;
				height: 1.8rem;
				margin-bottom: 0.3rem;
			}

			p {
                width: 6.3rem;
				text-align: center;
				font-size: 0.24rem;
				font-weight: 400;
				color: #333333;
			}
		}
	}
}
.to-flow {
    position: fixed;
    bottom: 0.6rem;
    left: 0.85rem;
    width: 5.8rem;
    height: 1rem;
    background-image: url(https://yaame-static.yaame.io/admin/43bfec1b21b0734fca84df25e550fb27.png);
    background-size: contain;
    background-repeat: no-repeat;
    text-align: center;
    line-height: 1rem;
    font-weight: 600;
    font-size: 0.32rem;
    color: #FFFFFF;
}
</style>
