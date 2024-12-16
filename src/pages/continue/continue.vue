<template>
    <div class="main">
        <!-- 标题 -->
        <!--头部数据列表-->
        <div v-if="roomId" class="welcome-list">
            <div class="welcome-img">
                <h1>{{ $t('welcomeRoomData') }}</h1>
                <p>{{ $t('hideEmptyAnchorData') }}</p>
            </div>
            <div class="welcome-room-list" :style="{ 'height': height + 'rem' }">
                <div class="room-id">- {{ $t('roomId') }}：{{ roomId }} -</div>
                <div class="anchor-yaame-id">{{ $t('anchorYaameId') }}</div>
                <ul class="yaame-id-list">
                    <li v-for="(item, index) in anchorId" :key="index">{{ item }}</li>
                </ul>
                <div v-show="anchorYaame.length" class="more" @click="more">
                    {{ change === 1 ? $t('viewMore') : $t('getMore') }}
                    <img :src="change === 1 ? 'https://yaame-static.yaame.io/admin/fcc395b8b99cb2c80baffb4daa93d2aa.png' : 'https://yaame-static.yaame.io/admin/b885fbedba6474181cdf75af52a34bfd.png'" alt="">
                </div>
            </div>
        </div>
        <!-- 日月切换tab -->
        <div v-if="roomId" class="tab">
            <div :style="{ left: active === 'DailyIncome'? '0.08rem' : '2.4rem' }" class="active"></div>
            <div v-for="(item, index) in tabList" :key="index" @click="activeClick(item.key)" class="tab-div">
                {{ item.name }}
            </div>
        </div>
        <!--utc-->
        <div v-if="roomId" class="utc">{{ $t('datesUTC') }}</div>
        <!-- 日期切换 -->
        <!-- 日份 -->
        <div v-if="roomId && active === 'DailyIncome'" class="select-time">
            <img src="https://static.yaame.io/admin/c625997a9fbdf699be58fc0fd5c4a3c0.png" @click="handlePrev" />
            <div class="time-text" @click="openPicker">{{ currentDayText }}</div>
            <img src="https://static.yaame.io/admin/1c9d434952ad8a4632acd090de3e0402.png" @click="handleNext" />
        </div>
        <!-- 月份 -->
        <div v-else-if="roomId" class="select-time">
            <img src="https://static.yaame.io/admin/c625997a9fbdf699be58fc0fd5c4a3c0.png" @click="handleMouthPrev" />
            <div class="time-text" @click="openMouthPicker">
                {{ currentMouthText }}
            </div>
            <img src="https://static.yaame.io/admin/1c9d434952ad8a4632acd090de3e0402.png" @click="handleMouthNext" />
        </div>
        <!--房间新增用户-->
        <div v-if="roomData" class="room-user">
            <div class="room-header">{{ $t('roomUserEntry') }}</div>
            <div class="room-user-list">
                <ul v-for="(item,index) in roomLis" :key="index" class="room-ul">
                    <li v-for="(value,index) in item" :key="index" class="room-li">
                        {{ value ? value : 0 }}
                    </li>
                </ul>
            </div>
        </div>
        <!--主播用户数据-->
        <van-list v-if="anchorList.length !== 0" class="van-anchor" ref="topDay" v-model="loading" loading-text="loading" :finished="finished"
                  finished-text="completed" @load="onLoad">
            <div class="anchor-user" v-for="(item, index) in anchorList" :key="index">
                <div class="anchor-header">{{ $t('anchorUserEntry', {msg: item.yaame_id}) }}</div>
                <div>
                    <ul class="anchor-ul">
                        <li class="anchor-li">{{ $t('newUsersMutualChatCount') }}</li>
                        <li class="anchor-li">{{ item.start_anchor_chat_user_cnt ? item.start_anchor_chat_user_cnt : 0 }}</li>
                    </ul>
                    <ul class="anchor-ul">
                        <li class="anchor-li">{{ $t('privateChatCount') }}</li>
                        <li class="anchor-li">{{ item.receive_anchor_chat_user_cnt ? item.receive_anchor_chat_user_cnt : 0 }}</li>
                    </ul>
                    <ul class="anchor-ul">
                        <li class="anchor-li">{{ $t('mutualPrivateChatCount') }}</li>
                        <li class="anchor-li">{{ item.interactive_anchor_chat_user_cnt ? item.interactive_anchor_chat_user_cnt : 0 }}</li>
                    </ul>
                </div>
            </div>
        </van-list>
        <!--没有数据显示-->
        <div v-if="!roomData && !(anchorList.length !== 0)" :class="roomId ? 'lack' : 'all-lack'">
            <img src="https://yaame-static.yaame.io/admin/5dfd226ebdc3647b5428697a2794ea78.png" alt="">
            <p>{{ $t('noRoomData') }}</p>
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

<script setup>
    import { computed, onMounted, reactive, ref, nextTick, watch, getCurrentInstance } from "vue";
    import axios from "axios";
    // 获取国际化函数
    const root = getCurrentInstance();
    const t = (val) => {
        return root.proxy.$i18n.t(val);
    };
    // 列表高度
    let height = ref(3.09);
    // 页面第几页数据
    let pageNum = ref(1);
    // 加载效果
    let loading = ref(false);
    // 数据全部加载完毕效果
    let finished = ref(false);
    // 房间ID
    let roomId = ref(0);
    // 主播yaameID
    let anchorId = ref([])
    let anchorYaame = ref([]);
    let change = ref(1);
    // 房间用户数据
    let roomLis = ref([
        {
            name: t('newUserEntryCount'),
            enter_room_user_cnt: 0,
        },
        {
            name: t('newUsersOnMicCount'),
            mike_user_cnt: 0,
        },
        {
            name: t('newUsersMessageCount'),
            send_msg_user_cnt: 0,
        },
        {
            name: t('newUsersPrivateChatCount'),
            start_anchor_chat_user_cnt: 0,
        },
        {
            name: t('newUsersOnMicByAnchorCount'),
            receive_anchor_chat_user_cnt: 0,
        },
        {
            name: t('newUsersMutualPrivateChatCount'),
            interactive_anchor_chat_user_cnt: 0,
        }
    ]);
    const roomData = ref(0);
    // 主播用户数据
    let anchorList = ref([]);
    // tab
    const tabList = ref([
        {
            name: t('dailyData'),
            key: "DailyIncome",
        },
        {
            name: t('monthlyData'),
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
    // 日期
    let currentDayDate = ref(getUTC());
    const currentMouthDate = ref(getUTC());
    currentDayDate.value.setDate(currentDayDate.value.getDate());
    let dayPickerTime = ref(getUTC());
    dayPickerTime.value.setDate(dayPickerTime.value.getDate());
    let mouthPickerTime = ref(getUTC());
    // 最大日期
    let maxDate = ref(new Date(getUTC().getTime() + 86400000));
    maxDate.value.setDate(maxDate.value.getDate() - 1);
    // tab切换
    let active = ref("DailyIncome");
    // 当前时间
    const currentDayText = computed(() => {
        let year = currentDayDate.value.getFullYear();
        let month = (currentDayDate.value.getMonth() + 1)
            .toString()
            .padStart(2, "0");
        let day = currentDayDate.value.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    });
    // 退后一天时间
    const handlePrev = () => {
        currentDayDate.value = new Date(
            new Date(currentDayDate.value).getTime() - 86400000
        );
        pageNum.value = 1;
        getDay(1);
    };
    // 打开选择时间弹窗
    const openPicker = () => {
        dayToggle.value = true;
    };
    let dayToggle = ref(false);
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
            }
        } else {
            console.log("已达到时间上限（昨天）。");
        }
        pageNum.value = 1;
        getDay(1);
    };
    // 绑定选择月tab
    const formatter = (type, val) => {
        if (type === "month") {
            return monthMap[val];
        }
        return val;
    };
    // 日选择
    const dayConfirm = (value) => {
        currentDayDate.value = value;
        dayToggle.value = false;
        pageNum.value = 1;
        getDay(1);
    };
    // 月选择
    const mouthConfirm = (value) => {
        currentMouthDate.value = value;
        mouthToggle.value = false;
        pageNum.value = 1;
        getMonth(1);
    };
    // tab切换
    const activeClick = (key) => {
        active.value = key;
        pageNum.value = 1;
        // 清空数据
        roomData.value = 0;
        anchorList.value = [];
        if (key === "DailyIncome") {
            getDay(1);
        } else {
            getMonth(1);
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

        pageNum.value = 1;
        getMonth(1);
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

        pageNum.value = 1;
        getMonth(1);
    };

    // 每日数据请求
    const onLoad = () => {
        if (active.value === "DailyIncome") {
            getDay(0);
        } else {
            getMonth(0);
        }
    };
    // 拿取房间用户数据方法
    const saveRoomData = (value) => {
        roomData.value = 1;
        roomLis.value.forEach((item) => {
            // 根据 name 字段的值找到对应的字段进行更新
            const fieldName = Object.keys(item).find((key) => key !== 'name');
            if (item.hasOwnProperty(fieldName)) {
                item[fieldName] = value[fieldName];
            }
        });
    };
    // 拿取主播用户数据方法
    const saveAnchor = (value) => {
        anchorList.value = [...anchorList.value, ...value];
    };
    // 对房间yaameID进行处理
    const dispose = (value) => {
        anchorYaame.value = value;
        anchorId.value = [...anchorId.value, ...anchorYaame.value];
        anchorYaame.value = anchorId.value.slice(3);
        anchorId.value.splice(3);
    };
    // 获取当日数据
    const getDay = async (value) => {
        /*
            0: value判断是不是下滑获取数据
            1: 是不是第一次获取当天请求
            2: 只获取一次房间所属主播ID
        */
        try {
            const { data: res } = await axios.get('https://api.yaame.net/yaame/api/h5/open/undertake/rooms/statistic/data',{
                params: {
                    voiceRoomFlag: roomId.value,
                    ds: currentDayText.value.replace(/-/g, ""),
                    pageNum: pageNum.value,
                    pageSize: 10
                }
            })
            if (res.status !== 1000) return;
            // 判断是否第一次查看当天数据
            if (value === 1) anchorList.value = [];
            // 拿取主播用户数据
            if (res.data.anchor_statistic_datas.length !== 0) saveAnchor(res.data.anchor_statistic_datas);
            else if (value !== 0) {
                anchorList.value = [];
                roomData.value = 0;
            }
            // 拿取房间用户数据
            if (value !== 0 && Object.keys(res.data.room_statistic_data).length !== 0) saveRoomData(res.data.room_statistic_data);
            else if (res.data.room_statistic_data && Object.keys(res.data.room_statistic_data).length === 0) roomData.value = 0;
            // 获取主播yaameID
            if (value === 2 && res.data.room_anchor_ids && res.data.room_anchor_ids.length !== 0) dispose(res.data.room_anchor_ids);
            // 判断是否还有下一页数据
            if (res.data.has_next) {
                pageNum.value++;
                loading.value = false;
                finished.value = false;
            } else {
                loading.value = true;
                finished.value = true;
            }
        }catch (error) {
            console.log(error);
        }
    };

    // 获取月份数据
    const getMonth = async (value) => {
        try {
            // https://test-yamme-api.yaame.net
            // https://api.yaame.net
            const { data: res } = await axios.get('https://api.yaame.net/yaame/api/h5/open/undertake/rooms/statistic/data',{
                params: {
                    voiceRoomFlag: roomId.value,
                    ds: currentMouthText.value.replace(/-/g, ""),
                    pageNum: pageNum.value,
                    pageSize: 10
                }
            })
            if (res.status !== 1000) return;
            // 判断是否第一次查看当天数据
            if (value === 1) anchorList.value = [];
            // 拿取主播用户数据
            if (res.data.anchor_statistic_datas.length !== 0) saveAnchor(res.data.anchor_statistic_datas);
            else if (value !== 0){
                anchorList.value = [];
                roomData.value = 0;
            }
            // 拿取房间用户数据
            if (value !== 0 && Object.keys(res.data.room_statistic_data).length !== 0) saveRoomData(res.data.room_statistic_data);
            else if (res.data.room_statistic_data && Object.keys(res.data.room_statistic_data).length === 0) roomData.value = 0;
            // 判断是否还有下一页数据
            if (res.data.has_next) {
                pageNum.value++;
                loading.value = false;
                finished.value = false;
            } else {
                loading.value = true;
                finished.value = true;
            }
        }catch (error) {
            return error;
        }
    };

    // 获取地址栏房间ID
    const getQueryStringParameter = (name) => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }
    // 展开更多数据
    const more = () => {
        change.value = change.value === 1 ? 2 : 1;
        if (change.value === 1) {
            anchorYaame.value = anchorId.value.splice(3);
            height.value = 3.09;
        } else {
            anchorId.value = [...anchorId.value, ...anchorYaame.value];
            // 添加表单ID动画效果
            let h = anchorYaame.value.length % 3;
            height.value += h === 0 ? Math.floor(anchorYaame.value.length / 3) * 0.88 : Math.floor((anchorYaame.value.length / 3) + 1) * 0.88
        }
    };

    // 切换日期让表格滚回顶部
    let topDay = ref(null);
    watch(currentDayDate, () => {
        nextTick(() => {
            if (!topDay.value) return;
            topDay.value.$el.scrollTop = 0
        })
    });
    watch(currentMouthDate, () => {
        nextTick(() => {
            if (!topDay.value) return;
            topDay.value.$el.scrollTop = 0
        })
    });

    onMounted(() => {
        // 获取当前房间ID
        roomId.value = getQueryStringParameter('id');
        getDay(2);
    })
</script>

<style lang="less" scoped>
.main {
    min-height: 5.94rem;
    background: url("https://yaame-static.yaame.io/admin/ccdb0237a5814aff390d1a911584bb4b.png") no-repeat;
    background-size: contain;
    overflow: hidden;
    .header {
        transition-duration: .3s;
    }
    .utc {
        margin-top: .29rem;
        text-align: center;
        font-size: .24rem;
        font-weight: 400;
        color: #999;
        line-height: .33rem;
    }
    //tab样式
    .tab {
        position: relative;
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
        margin-top: .5rem;

        .tab-div {
            width: 2.32rem;
            height: 0.52rem;
            text-align: center;
            line-height: 0.52rem;
            border-radius: 0.3rem;
            z-index: 2;
        }
        .active {
            position: absolute;
            left: 0.08rem;
            width: 2.32rem;
            height: .52rem;
            border-radius: .3rem;
            background-color: #fff;
            z-index: 1;
            transition-duration: 0.3s;
        }
    }
    //头部房间数据样式
    .welcome-list {
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: hidden;
        .welcome-img {
            position: relative;
            top: .35rem;
            width: 6.2rem;
            height: 1.98rem;
            background: url("https://yaame-static.yaame.io/admin/ec9b495fce496a89a1fc2fa5b54d0b49.png") no-repeat;
            background-size: contain;
            h1 {
                position: absolute;
                top: .56rem;
                left: .3rem;
                font-size: .38rem;
                font-weight: normal;
                color: #FFFFFF;
                line-height: .48rem;
            }
            p {
                position: absolute;
                top: 1.14rem;
                left: .3rem;
                font-size: .18rem;
                font-weight: 400;
                color: #FFFFFF;
                line-height: .25rem;
                opacity: 0.8;
            }
        }
        .welcome-room-list {
            display: flex;
            position: relative;
            width: 6.9rem;
            height: 3.09rem;
            padding: 0 0.3rem;
            background: #fff url("https://yaame-static.yaame.io/admin/c146fa9f644d2ea8329df67bfd7db178.png") no-repeat;
            background-size: contain;
            flex-direction: column;
            align-items: center;
            border-radius: .3rem;
            transition: height 0.3s ease;
            .room-id {
                font-size: .28rem;
                font-weight: 600;
                color: #333333;
                line-height: .40rem;
                margin: 0.3rem 0 0.1rem;
            }
            .anchor-yaame-id {
                font-size: .24rem;
                font-weight: 400;
                color: #333333;
                line-height: .33rem;
            }
            .yaame-id-list {
                display: flex;
                width: 6.3rem;
                flex-direction: row;
                flex-wrap: wrap;
                margin: .3rem 0 .1rem;
                li {
                    width: 1.94rem;
                    height: .68rem;
                    margin-bottom: .2rem;
                    margin-right: .24rem;
                    background: #E9F4EE;
                    border-radius: .16rem;
                    font-size: .24rem;
                    font-weight: 400;
                    color: #666666;
                    text-align: center;
                    line-height: .68rem;
                    &:nth-child(3n+3) {
                        margin-right: 0;
                    }
                }
            }
            .more {
                min-width: 1.38rem;
                height: .38rem;
                background: #EBEBEB;
                border-radius: .19rem;
                opacity: 0.5;
                font-size: .18rem;
                font-weight: 600;
                color: #666666;
                line-height: .38rem;
                text-align: center;
                margin-bottom: .3rem;
                img {
                    width: .2rem;
                    height: .2rem;
                    margin-top: .08rem;
                }
            }
        }
    }
    //日期样式
    .select-time {
        width: 7.5rem;
        height: 0.4rem;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 0.4rem;
        margin-bottom: 0.4rem;
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
    //房间新增用户样式
    .room-user {
        width: 6.9rem;
        min-height: 5.08rem;
        background: #FFFFFF;
        border-radius: .24rem;
        margin: 0 auto .3rem;
        .room-header {
            width: 100%;
            height: .7rem;
            background: url("https://yaame-static.yaame.io/admin/917f351fdbecf7a45820247e2a86af93.png") no-repeat;
            background-size: contain;
            font-size: .24rem;
            font-weight: 500;
            color: #FFFFFF;
            line-height: .7rem;
            text-align: center;
        }

        .room-user-list {
            .room-ul {
                display: flex;
                height: .74rem;
                align-items: center;
                font-size: .24rem;
                font-weight: 400;
                color: #333333;
                line-height: .24rem;
                border-bottom: .01rem solid #eee;
                &:last-of-type {
                    border: none;
                }
                .room-li {
                    display: flex;
                    width: 4.9rem;
                    height: 100%;
                    text-align: center;
                    border-right: .01rem solid #eee;
                    align-items: center;
                    justify-content: center;
                    &:last-of-type {
                        width: 1.99rem;
                        border: none;
                    }
                }
            }
        }
    }
    // 主播用户数据
    .van-anchor {
        height: 9.75rem;
        overflow-x: auto;
        .anchor-user {
            width: 6.9rem;
            min-height: 2.89rem;
            background: #FFFFFF;
            border-radius: .24rem;
            margin: 0 auto .3rem;
            .anchor-header {
                width: 100%;
                height: .7rem;
                background: url("https://yaame-static.yaame.io/admin/6ff7bf387e75079657c49d5c0ff38aba.png") no-repeat;
                background-size: contain;
                font-size: .24rem;
                font-weight: 500;
                color: #FFFFFF;
                line-height: .7rem;
                text-align: center;
            }
            .anchor-ul {
                display: flex;
                height: 0.74rem;
                align-items: center;
                font-size: 0.24rem;
                font-weight: 400;
                color: #333333;
                line-height: 0.24rem;
                border-bottom: 0.01rem solid #eee;
                &:last-of-type {
                    border: none;
                }
                .anchor-li {
                    display: flex;
                    width: 4.9rem;
                    height: 100%;
                    text-align: center;
                    border-right: 0.01rem solid #eee;
                    align-items: center;
                    justify-content: center;
                    &:last-of-type {
                        width: 1.99rem;
                        border: none;
                    }
                }
            }
        }
    }
    //数据缺少样式
    .lack {
        display: flex;
        margin-top: 1.18rem;
        font-size: .24rem;
        font-weight: 400;
        color: #333333;
        line-height: .28rem;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        img {
            width: 1.8rem;
            height: 1.8rem;
            margin-top: .3rem;
        }
    }
    .all-lack {
        position: absolute;
        top: 50%;
        left: 50%;
        display: flex;
        font-size: .24rem;
        font-weight: 400;
        color: #333333;
        line-height: .28rem;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        transform: translate(-50%,-50%);
        img {
            width: 1.8rem;
            height: 1.8rem;
            margin-top: .3rem;
        }
    }
}
</style>