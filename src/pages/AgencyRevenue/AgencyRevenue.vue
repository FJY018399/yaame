<template>
    <div :style="{ paddingTop: safe_height + 1.08 + 'rem' }">
        <!-- 标题 -->
        <Header style="position: fixed" :keep="true" :keepColor="false" color="blank" title="Agency Revenue"></Header>
        <!-- tab -->
        <div class="tab">
            <div v-for="(item, index) in tabList" :key="index" :class="[active === item.key && 'active']"
                @click="activeClick(item.key)">
                {{ item.name }}
            </div>
        </div>
        <!-- 日期切换 -->
        <!-- 日份 -->
        <div v-if="active === 'DailyIncome'" class="select-time">
            <img src="https://static.yaame.io/admin/c625997a9fbdf699be58fc0fd5c4a3c0.png" @click="handlePrev" />
            <div class="time-text" @click="openPicker">{{ currentDayText }}</div>
            <img src="https://static.yaame.io/admin/1c9d434952ad8a4632acd090de3e0402.png" @click="handleNext" />
        </div>
        <!-- 月份 -->
        <div v-else class="select-time">
            <img src="https://static.yaame.io/admin/c625997a9fbdf699be58fc0fd5c4a3c0.png" @click="handleMouthPrev" />
            <div class="time-text" @click="openMouthPicker">
                {{ currentMouthText }}
            </div>
            <img src="https://static.yaame.io/admin/1c9d434952ad8a4632acd090de3e0402.png" @click="handleMouthNext" />
        </div>

        <p class="info-p">The data is refreshed every 10 minutes or so</p>
        <p class="info-p">The time here is the time in UTC 0 time zone</p>
        <p v-if="isTodayFlag" class="info-p">Remaining until the end of today: {{ timeText }}</p>

        <!-- 每日数据 -->
        <div v-if="active === 'DailyIncome' && listShow" class="table" ref="topDay">
            <van-list v-if="!showEight" ref="contentHeight" v-model="loading" loading-text="loading" :finished="finished"
                finished-text="completed" @load="onLoad">
                <table class="table-header">
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>User's Nickname</th>
                            <th>Revenue (Diamond)</th>
                            <th>Live Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in dayList" :key="index">
                            <td>{{ item.yaame_id }}</td>
                            <td>{{ item.nick_name }}</td>
                            <td>{{ item.diamonds }}</td>
                            <td>{{ item.mike_minute }}min</td>
                        </tr>
                    </tbody>
                </table>
            </van-list>
            <!-- 数据小于10条样式 -->
            <table v-if="showEight" class="table-header">
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>User's Nickname</th>
                        <th>Revenue (Diamond)</th>
                        <th>Live Duration</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in dayList" :key="index">
                        <td>{{ item.yaame_id }}</td>
                        <td>{{ item.nick_name }}</td>
                        <td>{{ item.diamonds }}</td>
                        <td>{{ item.mike_minute }}min</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- 每月数据 -->
        <div v-else-if="active === 'MonthlyIncome' && listShow" class="month" ref="topMonth">
            <van-list v-if="!showEight" ref="contentHeight" v-model="loading" loading-text="loading" :finished="finished"
                finished-text="completed" @load="onLoadMonth">
                <table class="table-header table-header-month">
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>User's Nickname</th>
                            <th>Revenue (Diamond)</th>
                            <th>Live Duration</th>
                            <th>Days of live broadcast</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in monthList" :key="index">
                            <td>{{ item.yaame_id }}</td>
                            <td>{{ item.nick_name }}</td>
                            <td>{{ item.diamonds }}</td>
                            <td>{{ item.mike_minute }}min</td>
                            <td>{{ item.mike_day }}days</td>
                        </tr>
                    </tbody>
                </table>
            </van-list>
            <!-- 数据小于10条样式 -->
            <table v-if="showEight" class="table-header table-header-month">
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>User's Nickname</th>
                        <th>Revenue (Diamond)</th>
                        <th>Live Duration</th>
                        <th>Days of live broadcast</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in monthList" :key="index">
                        <td>{{ item.yaame_id }}</td>
                        <td>{{ item.nick_name }}</td>
                        <td>{{ item.diamonds }}</td>
                        <td>{{ item.mike_minute }}min</td>
                        <td>{{ item.mike_day }}days</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 没有数据时显示 -->
        <div v-show="!listShow" class="no-data">
            <img src="https://static.yaame.io/admin/353cbb29343578377f92f2d13c2e4638.png" alt="" />
            <p>Your agency has no anchor</p>
        </div>
        <!-- 控制选择日期 -->
        <van-popup v-model="dayToggle" position="bottom">
            <!-- 日选择器 -->
            <van-datetime-picker v-model="dayPickerTime" :formatter="formatter" :max-date="maxDate"
                confirm-button-text="Confirm" cancel-button-text="Cancel" type="date" @cancel="dayToggle = false"
                @confirm="dayConfirm">
            </van-datetime-picker>
        </van-popup>
        <van-popup v-model="mouthToggle" position="bottom">
            <!-- 月选择 -->
            <van-datetime-picker v-model="mouthPickerTime" :formatter="formatter" :max-date="maxDate"
                confirm-button-text="Confirm" cancel-button-text="Cancel" type="year-month" @cancel="mouthToggle = false"
                @confirm="mouthConfirm">
            </van-datetime-picker>
        </van-popup>
    </div>
</template>

<script>
import { ref, onMounted, computed, reactive, getCurrentInstance, watch, nextTick } from "vue";
import Header from "../../components/common/header.vue";
import { getSafeHeight } from "../../lib/device";
import request from "../../lib/request/contribution";
import { Toast } from 'vant'
export default {
    components: {
        Header,
    },
    setup() {
        // 页面国际化
        const root = getCurrentInstance();
        const t = (val) => {
            return root.proxy.$i18n.t(val);
        };
        // 页面数据没有展示
        let listShow = ref(false);
        // tab切换
        let active = ref("DailyIncome");
        // 数据全部加载完毕
        let finished = ref(false);
        // 加载效果
        let loading = ref(false);
        // 获取UTC时间方法
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
        // 小于八条显示框
        let showEight = ref(false);
        // 日期
        let currentDayDate = ref(getUTC());
        const currentMouthDate = ref(getUTC());
        currentDayDate.value.setDate(currentDayDate.value.getDate());
        let dayPickerTime = ref(getUTC());
        dayPickerTime.value.setDate(dayPickerTime.value.getDate());
        let mouthPickerTime = ref(getUTC());
        // 控制显示两个表格
        const tabList = ref([
            {
                name: "Daily Income",
                key: "DailyIncome",
            },
            {
                name: "Monthly Income",
                key: "MonthlyIncome",
            },
        ]);
        const mouthToggle = ref(false);
        // 月份
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
        // 日期获取页码
        let page = ref(1);
        // tab切换获取那天数据
        const activeClick = (key) => {
            active.value = key;
            page.value = 1;
            if (key === "DailyIncome") {
                // 获取日数据
                getDay();
            } else {
                getMonth();
            }
        };
        // 选择时间
        // 打开选择时间弹窗
        const openPicker = () => {
            dayToggle.value = true;
        };
        let dayToggle = ref(false);
        // 日选择
        const dayConfirm = (value) => {
            page.value = 1;
            currentDayDate.value = value;
            dayToggle.value = false;
            getDay();
        };

        // 选择时间
        const mouthConfirm = (value) => {
            page.value = 1;
            currentMouthDate.value = value;
            mouthToggle.value = false;
            getMonth();
        };
        // 切换日期让表格滚回顶部
        let topDay = ref(null);
        watch(currentDayDate, () => {
            nextTick(() => {
                topDay.value.scrollTop = 0
            })
            isToday(currentDayDate.value);
        });
        let topMonth = ref(null);
        watch(currentMouthDate, () => {
            nextTick(() => {
                topMonth.value.scrollTop = 0
            })
            isToday(currentMouthDate.value);
        });
        // 绑定选择月份
        const formatter = (type, val) => {
            if (type === "month") {
                return monthMap[val];
            }
            return val;
        };
        // 最大日期
        let maxDate = ref(new Date(getUTC().getTime() + 86400000));
        maxDate.value.setDate(maxDate.value.getDate() - 1);
        // 当前时间
        const currentDayText = computed(() => {
            let year = currentDayDate.value.getFullYear();
            let month = (currentDayDate.value.getMonth() + 1)
                .toString()
                .padStart(2, "0");
            let day = currentDayDate.value.getDate().toString().padStart(2, "0");
            return `${year}-${month}-${day}`;
        });
        // 判断日是否到了最后一天
        const handleNext = () => {
            const currentDate = new Date(currentDayDate.value);
            const tomorrow = new Date(getUTC().getTime() + 86400000);
            tomorrow.setHours(0, 0, 0, 0); // Set current time to the beginning of the day

            const yesterday = new Date(tomorrow);
            yesterday.setDate(yesterday.getDate() - 1);
            // 判断是不是已经是今天
            if (currentDate.getTime() < tomorrow.getTime()) {
                currentDayDate.value = new Date(currentDate.getTime() + 86400000);
                if (currentDate.getTime() >= yesterday.getTime()) {
                    currentDayDate.value = yesterday;
                    console.log("已达到时间上限（昨天）。");
                    return;
                }
            } else {
                console.log("已达到时间上限（昨天）。");
                return;
            }
            page.value = 1;
            getDay();
        };
        // 每日数据
        let dayList = ref([]);
        // 每日数据请求
        const onLoad = () => {
            page.value++;
            getDay();
        };
        // 数据小于八条更换样式
        let contentHeight = ref(null);
        // 获取日数据请求
        const getDay = async () => {
            try {
                Toast.loading({
                    message: 'loading...',
                    forbidClick: true,
                });
                loading.value = true;
                const res = await request.getChairmanDaily({
                    ds: currentDayText.value.replace(/-/g, ""),
                    page: page.value,
                    size: 30,
                });
                if (res.status !== 1000) return;
                const next = res.data.has_next;
                const obj = res.data;
                const keys = Object.values(obj);
                // 判断是新日期数据还是当日下一页数据
                if (page.value > 1) {
                    if (keys.length === 0) {
                        finished.value = true;
                        return;
                    }
                    dayList.value = [...dayList.value, ...res.data.content];
                    Toast.clear();
                } else {
                    if (keys.length === 0) {
                        finished.value = true;
                        return;
                    }
                    // 新日期数据
                    dayList.value = [...res.data.content];
                    Toast.clear();
                }
                // 判断数据总共多少
                if (dayList.value.length < 10) {
                    // 有数据战术数据框
                    listShow.value = true;
                    // 小于10条数据更换样式
                    showEight.value = true;
                    return;
                }
                if (!dayList.value) {
                    finished.value = true;
                    // 没有数据显示无数据
                    listShow.value = false;
                } else if (keys.length !== 0 && res.data.content) {
                    // 有数据战术数据框
                    listShow.value = true;
                    showEight.value = false;
                    // 没有下一页结束请求
                    if (!next) {
                        finished.value = true;
                        return;
                    }
                    // 继续打开下滑加载数据
                    loading.value = false;
                    finished.value = false;
                }
            } catch (error) {
                console.log(error);
            }
        };
        // 打开月份选择器
        const openMouthPicker = () => {
            mouthToggle.value = true;
        };
        // 月份显示
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

            page.value = 1;
            getMonth();
        };
        // 判断月份当月
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

            page.value = 1;
            getMonth();
        };
        // 月份数据
        let monthList = ref([]);
        // 下滑获取月份数据
        const onLoadMonth = () => {
            page.value++;
            getMonth();
        };
        // 月数据请求
        const getMonth = async () => {
            try {
                Toast.loading({
                    message: 'loading...',
                    forbidClick: true,
                });
                loading.value = true;
                const res = await request.getChairmanMonth({
                    monthFlag: currentMouthText.value.replace(/-/g, ""),
                    page: page.value,
                    size: 30,
                });
                if (res.status !== 1000) return;
                const next = res.data.has_next;
                const obj = res.data;
                const keys = Object.values(obj);
                // 判断是新日期数据还是当日下一页数据
                if (page.value > 1) {
                    if (keys.length === 0) {
                        finished.value = true;
                        return;
                    }
                    monthList.value = [...monthList.value, ...res.data.content];
                    Toast.clear();
                } else {
                    if (keys.length === 0) {
                        finished.value = true;
                        return;
                    }
                    // 新月期数据
                    monthList.value = res.data.content;
                    Toast.clear();
                }
                // 判断数据是否展示完毕
                if (monthList.value.length < 10) {
                    // 有数据战术数据框
                    listShow.value = true;
                    // 小于10条数据更换样式
                    showEight.value = true;
                    return;
                }
                if (!monthList.value) {
                    finished.value = true;
                    // 没有数据显示无数据
                    listShow.value = false;
                } else if (res.data.content) {
                    // 有数据战术数据框
                    listShow.value = true;
                    showEight.value = false;
                    // 没有下一页结束请求
                    if (!res.data.has_next) {
                        finished.value = true;
                        return;
                    }
                    // 继续打开下滑加载数据
                    loading.value = false;
                    finished.value = false;
                }
            } catch (error) {
                console.log(error);
            }
        };
        // 退后一天时间
        const handlePrev = () => {
            currentDayDate.value = new Date(
                new Date(currentDayDate.value).getTime() - 86400000
            );
            page.value = 1;
            getDay();
        };
        // 获取手机顶栏高度
        let safe_height = ref(0);


        let timeText = ref('')
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

        onMounted(() => {
            let safe_area = getSafeHeight() || 0;
            safe_height.value = (safe_area * 2) / 100;
            // 获取默认当日数据防止没有数据一直有loading
            getDay();
            setInterval(() => {
                getDay();
            }, 1000 * 60 * 10);

            countDown();
            setInterval(() => {
                countDown();
            }, 1000);
        });
        return {
            safe_height,
            active,
            tabList,
            currentDayText,
            currentMouthText,
            dayToggle,
            dayPickerTime,
            mouthToggle,
            mouthPickerTime,
            formatter,
            maxDate,
            finished,
            loading,
            listShow,
            showEight,
            contentHeight,
            dayList,
            monthList,
            handleNext,
            handlePrev,
            handleMouthPrev,
            handleMouthNext,
            activeClick,
            openPicker,
            dayConfirm,
            openMouthPicker,
            mouthConfirm,
            onLoad,
            onLoadMonth,

            topDay,
            topMonth,

            timeText,
            isTodayFlag,
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

.no-data {
    margin-top: 3.81rem;
    text-align: center;

    img {
        width: 1.8rem;
        height: 1.8rem;
    }

    p {
        width: 100%;
        height: 0.28rem;
        line-height: 0.28rem;
        margin-top: 0.3rem;
        font-size: 0.24rem;
    }
}

.month {
    font-size: 0.24rem;
    max-height: 10rem;
    overflow-x: auto;
    border-radius: 0.24rem;
    margin: 0.4rem 0.3rem 0 0.3rem;

    .table-header-month {
        min-width: 8.625rem;
        overflow-x: auto;
        padding-right: 0.4rem;
    }
}

.table {
    min-width: 6.9rem;
    max-height: 10rem;
    border-radius: 0.24rem;
    overflow-x: auto;
    font-size: 0.24rem;
    margin: 0.4rem 0.3rem 0 0.3rem;
}

.table-header {
    width: 100%;
    table-layout: auto;
    background: #ffffff;
    border-radius: 0.24rem;

    thead {
        height: 1.2rem;
        background: #e9eff4;
        border-radius: 0.24rem 0.24rem 0 0;

        tr {
            th {
                max-width: 2.2rem;
                flex: 1;
                border-right: 0.02rem solid #d6dfe7;

                &:last-of-type {
                    border-right: 0;
                }
            }
        }
    }

    tbody {
        border-radius: 0 0 0.24rem 0.24rem;

        .van-list {
            width: 100%;
        }

        tr {
            height: 0.72rem;
            border-bottom: 0.02rem solid #eee;

            td {
                max-width: 2.2rem;
                flex: 1;
                padding: 0 0.1rem;
                text-align: center;
                line-height: 0.72rem;
                border-right: 0.02rem solid #eee;
                overflow: hidden;
                word-wrap: break-word;

                &:last-of-type {
                    border-right: 0;
                }
            }

            &:last-of-type {
                border-bottom: 0;
            }
        }
    }
}
.info-p {
    font-size: 0.24rem;
    color: #666;
    padding-left: 0.3rem;
}
</style>
