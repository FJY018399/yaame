<!--
 * @Author: Elk
 * @Date: 2023-07-27 11:45:59
 * @FilePath: /yaame-h5/src/pages/ChatMyGuild/views/MyIncome.vue
 * @Description: Regulations
-->
<template>
	<div :style="{ paddingTop: safe_height + 1.08 + 'rem', paddingBottom: '0.3rem' }">
		<Header
			style="position: fixed"
			:keep="true"
			:keepColor="false"
			color="blank"
            right_img="https://yaame-static.yaame.io/admin/1f0291999b2305dc8bb4cd73097a2778.png"
             @rightCall="rightCallBack"
		>{{ $t('MyIncome') }}</Header>

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
			<div class="time-text" @click="openMouthPicker">
				{{ currentMouthText }}
			</div>
			<img
				src="https://static.yaame.io/admin/1c9d434952ad8a4632acd090de3e0402.png"
				@click="handleMouthNext"
			/>
		</div>

        <p>{{ $t('dataTip') }}</p>
        <p>{{ $t('dataRefreshTip2', [timeText]) }}</p>

		<div v-if="active === 'DailyIncome'" class="info-content">
			<div>
				<span class="label">{{ $t('getUSD') }}</span>
				<span class="value">{{ dayInfo.total_income }}</span>
			</div>
			<div>
				<span class="label">{{ $t('validNumber6') }}</span>
				<span class="value">{{ dayInfo.today_effect_num }}</span>
			</div>
            <div>
				<span class="label">{{ $t('validNumber3') }}</span>
				<span class="value">{{ dayInfo.second_effect_num }}</span>
			</div>
		</div>

		<div v-else class="info-content">
            <div>
				<span class="label">{{ $t('getUSD') }}</span>
				<span class="value">{{ mouthInfo.total_income }}</span>
			</div>
			<div>
				<span class="label">{{ $t('validNumber6') }}</span>
				<span class="value">{{ mouthInfo.today_effect_num }}</span>
			</div>
            <div>
				<span class="label">{{ $t('validNumber3') }}</span>
				<span class="value">{{ mouthInfo.second_effect_num }}</span>
			</div>
		</div>

		<p class="list-info">{{ $t('detail') }}</p>

		<div
			v-if="active === 'DailyIncome' && list && list.length"
			v-infinite-scroll="loadMore"
			:infinite-scroll-immediate-check="true"
			infinite-scroll-disabled="loading"
			infinite-scroll-distance="10"
			class="list"
		>
            <van-tabs v-model="tabActive" @click="handleTabClick">
                <van-tab :title="$t('validNumber6')"></van-tab>
                <van-tab :title="$t('validNumber3')"></van-tab>
            </van-tabs>
			<div v-for="(item, index) in list" :key="index" class="list-item">
				<img class="user-avatar" :src="item.avatar" alt="" @click="toDetails(item)">
                <div class="user-info">
                    <p class="user-name no-wrap">{{ item.nickname }}</p>
                    <p class="user-time no-wrap">{{ formatDate(active, item.create_time) }}</p>
                </div>
                <div class="user-value">{{ item.income }}</div>
			</div>
		</div>
		<div v-else-if="active === 'DailyIncome'" class="list">
            <van-tabs v-model="tabActive" @click="handleTabClick">
                <van-tab :title="$t('validNumber6')"></van-tab>
                <van-tab :title="$t('validNumber3')"></van-tab>
            </van-tabs>
			<div class="no-data">
				<div>
					<img
						src="https://static.yaame.io/admin/353cbb29343578377f92f2d13c2e4638.png"
						alt=""
					/>
					<p>{{ $t('NotOnTheListYet') }}</p>
				</div>
			</div>
		</div>

		<div v-if="active === 'MonthlyIncome'" class="list">
            <van-tabs v-model="tabActive" @click="handleTabClick">
                <van-tab :title="$t('validNumber6')"></van-tab>
                <van-tab :title="$t('validNumber3')"></van-tab>
            </van-tabs>
			<!-- <div v-for="(item, index) in list" :key="index" class="list-item">
				<img class="user-avatar" :src="item.avatar" alt="" @click="toDetails(item)">
                <div class="user-info">
                    <p class="user-name no-wrap">{{ item.nickname }}</p>
                    <p class="user-time no-wrap">{{ formatDate(active, item.create_time) }}</p>
                </div>
                <div class="user-value">{{ item.income }}</div>
			</div> -->
            <div v-for="(item, index) in list" :key="index" class="mouth-list-item">
				<span class="label">
					<div style="width: 5rem" class="no-wrap">{{ item.title }}</div>
					<p>{{ formatDate(active, item.create_time) }}</p>
				</span>
				<span class="value">{{ item.income }}</span>
			</div>

			<div v-if="list && list.length === 0" class="no-data">
				<div>
					<img
						src="https://static.yaame.io/admin/353cbb29343578377f92f2d13c2e4638.png"
						alt=""
					/>
					<p>{{ $t('NotOnTheListYet') }}</p>
				</div>
			</div>
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

		<van-popup v-model="mouthToggle" position="bottom">
			<van-datetime-picker
				v-model="mouthPickerTime"
				:formatter="formatter"
				:max-date="maxDate"
				confirm-button-text="Confirm"
				cancel-button-text="Cancel"
				type="year-month"
				@cancel="mouthToggle = false"
				@confirm="mouthConfirm"
			>
			</van-datetime-picker>
		</van-popup>
	</div>
</template>

<script>
import {
	ref,
	onMounted,
	reactive,
	computed,
	watch,
    getCurrentInstance,
    onBeforeUnmount
} from "vue";
import Header from "@/components/common/header.vue";
import { getSafeHeight } from "@/lib/device";
import { getIncomeDaily, getIncomeMonth } from "../api";

const getUTC = () => {
	let now = new Date()
	return new Date(
		now.getUTCFullYear(),
		now.getUTCMonth(),
		now.getUTCDate(),
		now.getUTCHours(),
		now.getUTCMinutes(),
		now.getUTCSeconds(),
	)
}

console.log(new Date())
export default {
	components: {
		Header,
	},
	setup() {
		let safe_height = ref(0);
		let active = ref("DailyIncome");
        const root = getCurrentInstance();
        const t = (val) => {
            return root.proxy.$i18n.t(val)
        }

		const tabList = ref([
			{
				name: t('Days'),
				key: "DailyIncome",
			},
			{
				name: t('Months'),
				key: "MonthlyIncome",
			},
		]);

		const activeClick = async (key) => {
            if (active.value === key) return;
			active.value = key;
			page.value = 1;
            dayList.value = [];
            mouthList.value = [];
			if (key === "DailyIncome") {
                await getDay();
            } else {
			    await getMouth();
            }
		};
		let dayToggle = ref(false);
		let currentDayDate = ref(getUTC());
		// currentDayDate.value.setDate(currentDayDate.value.getDate());
        // 默认日期为昨天
        currentDayDate.value.setDate(currentDayDate.value.getDate() - 1);

		let dayPickerTime = ref(getUTC());
		// dayPickerTime.value.setDate(dayPickerTime.value.getDate());
        // 默认日期为昨天
        dayPickerTime.value.setDate(dayPickerTime.value.getDate() - 1);

		const currentDayText = computed(() => {
			let year = currentDayDate.value.getFullYear();
			let month = (currentDayDate.value.getMonth() + 1)
				.toString()
				.padStart(2, "0");
			let day = currentDayDate.value.getDate().toString().padStart(2, "0");
			return `${year}-${month}-${day}`;
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
			currentDayDate.value = new Date(
				new Date(currentDayDate.value).getTime() - 86400000
			);

            dayList.value = [];
            page.value = 1;
		};

		const handleNext = () => {
			const currentDate = new Date(currentDayDate.value);
			const tomorrow = new Date(getUTC().getTime());
            // const tomorrow = new Date(getUTC().getTime()+ 86400000);
			tomorrow.setHours(0, 0, 0, 0); // Set current time to the beginning of the day

			const yesterday = new Date(tomorrow);
			yesterday.setDate(yesterday.getDate() - 1);

			if (currentDate.getTime() < tomorrow.getTime()) {
				currentDayDate.value = new Date(currentDate.getTime() + 86400000);
				if (currentDate.getTime() >= yesterday.getTime()) {
					currentDayDate.value = yesterday;
                    return
				}
			} else {
                return
			}

            dayList.value = [];
            page.value = 1;
		};

		const dayConfirm = (value) => {
			currentDayDate.value = value;
			dayToggle.value = false;
		};

		const mouthToggle = ref(false);
		const openMouthPicker = () => {
			mouthToggle.value = true;
		};
		const currentMouthDate = ref(getUTC());

		let mouthPickerTime = ref(getUTC());
		const currentMouthText = computed(() => {
			let year = currentMouthDate.value.getFullYear();
			let month = (currentMouthDate.value.getMonth() + 1)
				.toString()
				.padStart(2, "0");
			return `${year}-${month}`;
		});

		const handleMouthPrev = () => {
			const date = new Date(currentMouthDate.value);

			// 获取传入时间戳的年份和月份
			const year = date.getFullYear();
			const month = date.getMonth();

			// 计算上一个月的年份和月份
			const prevYear = month === 0 ? year - 1 : year;
			const prevMonth = month === 0 ? 11 : month - 1;

			// 创建上一个月的日期对象
			const prevMonthDate = new Date(prevYear, prevMonth);

			// 获取上一个月的最后一天日期
			const lastDayOfPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();

			// 设置日期为上一个月的最后一天
			prevMonthDate.setDate(lastDayOfPrevMonth);

			currentMouthDate.value = prevMonthDate;

            mouthList.value = [];
		};

		const handleMouthNext = () => {
			const date = new Date(currentMouthDate.value);

			// 获取传入时间戳的年份和月份
			const year = date.getFullYear();
			const month = date.getMonth();

			// 获取当前日期的年份和月份
			const currentYear = getUTC().getFullYear();
			const currentMonth = getUTC().getMonth();

			if (year === currentYear && month === currentMonth) {
				console.log("已达到时间上限（本月最后一天）。");
				return;
			}

			// 计算下一个月的年份和月份
			const nextYear = month === 11 ? year + 1 : year;
			const nextMonth = month === 11 ? 0 : month + 1;

			// 创建下一个月的日期对象
			const nextMonthDate = new Date(nextYear, nextMonth);

			// 获取下一个月的最后一天日期
			const lastDayOfNextMonth = new Date(nextYear, nextMonth + 1, 0).getDate();

			// 设置日期为下一个月的最后一天
			nextMonthDate.setDate(lastDayOfNextMonth);

			currentMouthDate.value = nextMonthDate;

            mouthList.value = [];
		};

		const mouthConfirm = (value) => {
			currentMouthDate.value = value;
			mouthToggle.value = false;
		};

		let dayList = ref([]);
		let has_next = ref(true);
		let page = ref(1);

		let dayInfo = ref({
			total_income: 0,
            today_effect_num: 0,
            second_effect_num: 0,
		});
		const getDay = async () => {
			try {
				let res = await getIncomeDaily({
					ds: currentDayText.value.replace(/-/g, ""),
					page: page.value,
					size: 20,
                    chat_anchor_round_type: tabActive.value === 0 ? 'TO_DAY_ROUND' : 'SECOND_ROUND'
				});
				if (res.status === 1000) {
					if (res.data) {

                        if (res.data.today_effect_num > 0) {
                            dayInfo.value.today_effect_num = res.data.today_effect_num;
                        }
                        if (res.data.second_effect_num > 0) {
                            dayInfo.value.second_effect_num = res.data.second_effect_num;
                        }
                        if (res.data.total_income) {
                            dayInfo.value.total_income = res.data.total_income;
                        }
						if (res.data.content) {
							if (dayList.value.length) {
								dayList.value = dayList.value.concat(res.data.content);
							} else {
								dayList.value = res.data.content;
							}
                            has_next.value = res.data.has_next;
						} else {
							dayList.value = [];
							has_next.value = false;
						}
						if (!res.data.content || res.data.has_next === false) {
							has_next.value = false;
						}
					} else {
						dayList.value = [];
					}
				}
			} catch (error) {
				console.log(error);
			}
		};

		let mouthInfo = ref({
			total_income: 0,
            today_effect_num: 0,
            second_effect_num: 0,
		});
		let mouthList = ref([]);
		const getMouth = async () => {
			try {
				let res = await getIncomeMonth({
					monthFlag: currentMouthText.value.replace(/-/g, ""),
                    chat_anchor_round_type: tabActive.value === 0 ? 'TO_DAY_ROUND' : 'SECOND_ROUND'
				});
				if (res.status === 1000) {
					if (res.data) {
						mouthInfo.value = {
							total_income: res.data.total_income || 0,
                            today_effect_num: res.data.today_effect_num || 0,
                            second_effect_num: res.data.second_effect_num || 0,
						};

						mouthList.value = res.data.content || [];
					} else {
						mouthList.value = [];
					}
				}
			} catch (error) {
				console.log(error);
			}
		};

		watch(currentDayText, () => {
            dayInfo.value = {
                total_income: 0,
                today_effect_num: 0,
                second_effect_num: 0,
            };
            dayList.value = [];
			getDay();
            isToday(currentDayDate.value);
		});
		watch(currentMouthText, () => {
            mouthInfo.value = {
                total_income: 0,
                today_effect_num: 0,
                second_effect_num: 0,
            };
            mouthList.value = [];
			getMouth();
            isToday(currentMouthDate.value);
		});

		const list = computed(() => {
			if (active.value === "MonthlyIncome") {
				return mouthList.value;
			} else {
				return dayList.value;
			}
		});

		let maxDate = ref(new Date(getUTC().getTime() + 86400000));
		maxDate.value.setDate(maxDate.value.getDate() - 2);

		const formatDate = (activeValue, timestampOrDate) => {
			if (activeValue === "DailyIncome") {
				const date = new Date(timestampOrDate);
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, "0");
				const day = String(date.getDate()).padStart(2, "0");
				return `${year}.${month}.${day}`;
			} else {
				// 处理时间戳
                const date = new Date(timestampOrDate);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const day = String(date.getDate()).padStart(2, "0");
                return `${year}.${month}.${day}`;
			}
		};

		const loadMore = () => {
			if (has_next.value) {
				page.value++;
				getDay();
			}
		};


        let timeText = ref('')
        // 距离今日结束倒计时函数 utc时区 hh:mm:ss
        const countDown = () => {
            // 获取当前时间的UTC表示
            const now = new Date();
            const utcNow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()));

            // 获取UTC时间今天结束的时间（即下一个凌晨0点）
            const utcMidnight = new Date(Date.UTC(utcNow.getUTCFullYear(), utcNow.getUTCMonth(), utcNow.getUTCDate() + 1));

            // 计算当前时间到UTC凌晨的毫秒数
            const countdownMilliseconds = utcMidnight - utcNow;

            // 将毫秒转换为小时、分钟和秒
            const h = Math.floor(countdownMilliseconds / (1000 * 60 * 60));
            const m = Math.floor((countdownMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((countdownMilliseconds % (1000 * 60)) / 1000);

            timeText.value = `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
        };

        watch(active, (val) => {
            if (val === 'DailyIncome') {
                isToday(currentDayDate.value);
            } else {
                isToday(currentMouthDate.value);
            }
        });
        let isTodayFlag = ref(true);
        // 计算传入时间（未转换utc）是否为utc时区的今天
        const isToday = (inputDate) => {
            if (active.value === 'MonthlyIncome') {
                // 创建当前时间的Date对象（基于本地时区）
                const now = new Date();

                // 构建当前UTC时间的年月日（'YYYY-MM-DD'格式）
                const utcTodayString = now.getUTCFullYear() + '-' +
                String(now.getUTCMonth() + 1).padStart(2, '0');

                // 构建传入时间的UTC年月日（'YYYY-MM-DD'格式）
                const inputUTCString = inputDate.getFullYear() + '-' +
                String(inputDate.getMonth() + 1).padStart(2, '0');
                
                console.log(utcTodayString, inputUTCString);
                // 比较两个日期字符串是否相等
                isTodayFlag.value = utcTodayString === inputUTCString;
                
                return;
            }

            // 创建当前时间的Date对象（基于本地时区）
            const now = new Date();

            // 构建当前UTC时间的年月日（'YYYY-MM-DD'格式）
            const utcTodayString = now.getUTCFullYear() + '-' +
            String(now.getUTCMonth() + 1).padStart(2, '0') + '-' +
            String(now.getUTCDate()).padStart(2, '0');

            // 构建传入时间的UTC年月日（'YYYY-MM-DD'格式）
            const inputUTCString = inputDate.getFullYear() + '-' +
            String(inputDate.getMonth() + 1).padStart(2, '0') + '-' +
            String(inputDate.getDate()).padStart(2, '0');

            // 比较两个日期字符串是否相等
            isTodayFlag.value = utcTodayString === inputUTCString;
        }
        let intervalFlag = null;


        let tabActive = ref(0);
        const handleTabClick = (index) => {
            if (active.value === 'DailyIncome') {
                tabActive.value = index;
                dayList.value = [];
                page.value = 1;
                getDay();
            } else {
                mouthList.value = [];
                getMouth();
            }
        }

        const rightCallBack = () => {
            root.proxy.$router.push({
                name: 'Regulations',
            });
        }

        const toDetails = (item) => {
            if (item.scheme_url) {
                location.href = item.scheme_url;
            }
        }

		onMounted(async () => {
			let safe_area = getSafeHeight() || 0;
			safe_height.value = (safe_area * 2) / 100;

			await getDay();
			await getMouth();
            // setInterval(() => {
            //     getDay();
            //     getMouth();
            // }, 1000 * 60 * 10);

            countDown();
            intervalFlag = setInterval(() => {
                countDown();
            }, 1000)
		});
        onBeforeUnmount(() => {
            clearInterval(intervalFlag);
        });
		return {
			safe_height,

			active,
			tabList,
			activeClick,

			dayToggle,
			openPicker,

			currentDayDate,
			currentDayText,
			dayPickerTime,

			handlePrev,
			handleNext,
			dayConfirm,

			formatter,

			// 月选择器
			mouthToggle,
			openMouthPicker,

			currentMouthDate,
			currentMouthText,
			mouthPickerTime,

			handleMouthPrev,
			handleMouthNext,
			mouthConfirm,

			list,
			mouthInfo,
			dayInfo,

			maxDate,

			formatDate,

			loadMore,

            timeText,
            isTodayFlag,
            tabActive,
            handleTabClick,

            rightCallBack,
            toDetails,
		};
	},
};
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
		width: 2.31rem;
		font-weight: 500;
		color: #333333;
		font-size: 0.36rem;
		text-align: center;
	}
}
.info-content {
	width: 6.9rem;
	height: auto;
	background: #ffffff;
	border-radius: 0.24rem;
	margin-left: 0.3rem;
	margin-top: 0.4rem;
	padding: 0 0.3rem;
	div {
		width: 6.3rem;
		height: 1.36rem;
		line-height: 1.36rem;
		display: flex;
		justify-content: space-between;
		border-bottom: 0.01rem solid #eeeeee;
		.label {
			font-size: 0.3rem;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #393939;
		}
		.value {
			font-size: 0.48rem;
			font-family: DINAlternate-Bold, DINAlternate;
			font-weight: bold;
			color: #393939;
		}
		&:last-child {
			border-bottom: none;
		}
	}
}
.list-info {
	padding-left: 0.3rem;
	margin-top: 0.8rem;
	font-size: 0.3rem;
	font-family: PingFangSC-Medium, PingFang SC;
	font-weight: 500;
	color: #999999;
}
.list {
	width: 6.9rem;
	background: #ffffff;
	border-radius: 0.24rem;
	margin-left: 0.3rem;
	margin-top: 0.3rem;
	padding: 0 0.3rem;
    padding-top: 0.2rem;
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
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #333333;
			}
		}
	}
	.list-item {
		width: 6.3rem;
		height: 1.6rem;
		border-bottom: 0.01rem solid #eeeeee;
		display: flex;
		justify-content: space-between;
		align-items: center;
        padding: 0 0.3rem;
		&:last-child {
			border-bottom: none;
		}
		.user-avatar {
            width: 0.99rem;
            height: 0.99rem;
            border-radius: 50%;
            margin-right: 0.3rem;
        }
        .user-info {
            width: 3.9rem;
            .user-name {
                font-weight: 400;
                font-size: 0.3rem;
                color: #000000;
            }
            .user-time {
                font-weight: 400;
                font-size: 0.3rem;
                color: #999999;
            }
        }
        .user-value {
            font-weight: bold;
            font-size: 0.4rem;
            color: #393939;
        }
	}
}
p {
    font-size: 0.24rem;
    color: #666;
    padding-left: 0.3rem;
}

/deep/.van-tabs__content {
    min-height: 0;
}
/deep/.van-tab {
    padding: 0;
    margin: 0;
    text-align: center;
    width: 50%;
    height: 0.6rem;
    font-weight: 600;
    font-size: 0.3rem;
    color: #999999;
    &.van-tab--active {
        color: #393939;
    }
    .van-tab__text {
        display: inline-block;
        // 文字超出打点
        // overflow: hidden;
        // text-overflow: ellipsis;
        // white-space: nowrap;

        justify-content: center;
        align-items: center;
        text-align: center;
        // 文字强制换行
        white-space: normal;
        word-wrap: break-word;
        word-break: break-all;
        line-height: 1;
    }
    
}
/deep/.van-tabs__nav {
    background-color: transparent;
    padding: 0 0.1rem;
}
/deep/.van-tabs__line {
    position: absolute;
    background-image: none;
    left: 0;
    bottom: 0;
    width: 0.33rem;
    height: 0.06rem;
    background-color: #000;
}

.mouth-list-item {
    width: 6.3rem;
    height: 1.36rem;
    border-bottom: 0.01rem solid #eeeeee;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &:last-child {
        border-bottom: none;
    }
    .label {
        font-size: 0.3rem;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 400;
        color: #393939;
        p {
            font-size: 0.3rem;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
            padding-left: 0;
        }
    }
    .value {
        font-size: 0.48rem;
        font-family: DINAlternate-Bold, DINAlternate;
        font-weight: bold;
        color: #393939;
    }
}
</style>