<template>
    <div class="ranking">
        <!-- 任务进度条 -->
        <div
            class="progress-bar"
            :style="[{ height: progressBarHeight + 'px' }, getStyle('progress-bar')]"
        >
            <div
                class="schedule"
                :style="[{ height: scheduleHeight + 'px' }, getStyle('schedule')]"
            ></div>
            <!-- 任务状态点亮未点亮 -->
            <div
                class="task-status"
                :style="[
                    { top: index ? dotListTop[index - 1] + 'px' : '-0.21rem' },
                    item.reward_status ? backImg('task-status-yes') : backImg('task-status'),
                ]"
                v-for="(item, index) in progressList"
                :key="index"
            ></div>
        </div>
        <!-- 任务进度列表 -->
        <div
            v-for="(item, index) in progressList"
            :key="index"
            ref="rankList"
            class="rank-list"
            :style="getStyle('rank-list')"
        >
            <!-- 进度条 -->
            <div
                class="receiving"
                :style="getStyle('receiving-style')"
            >
                <div class="task">
                    {{
                        props.groupType === 'ANCHOR'
                            ? $t('gift_target', { 0: item.tasks[0].requirement })
                            : $t('gift_target_diamonds', { 0: item.tasks[0].requirement })
                    }}
                </div>
                <div
                    v-show="item.tasks[0].progress"
                    class="schedule"
                    :style="[
                        {
                            width:
                                (2.4 / item.tasks[0].requirement) * item.tasks[0].progress + 'rem',
                        },
                        getStyle('receiving-schedule'),
                    ]"
                ></div>
                <span :style="getStyle('name-style')">
                    {{ item.tasks[0].progress }}/{{ item.tasks[0].requirement }}
                </span>
            </div>
            <div
                class="remain"
                :style="getStyle('receiving-style')"
            >
                <div class="task">
                    {{
                        props.groupType === 'ANCHOR'
                            ? $t('mic_duration', { 0: Math.floor(item.tasks[1].requirement / 1000 / 60) })
                            : $t('room_duration', { 0: Math.floor(item.tasks[1].requirement / 1000 / 60) })
                    }}
                </div>
                <div
                    v-show="item.tasks[1].progress"
                    class="schedule"
                    :style="[
                        {
                            width: (2.4 / item.tasks[1].requirement) * item.tasks[1].progress + 'rem',
                        },
                        getStyle('remain-schedule'),
                    ]"
                ></div>
                <span :style="getStyle('name-style')">
                    {{ Math.floor(item.tasks[1].progress / 1000 / 60) }}/{{
                        Math.floor(item.tasks[1].requirement / 1000 / 60)
                    }}
                </span>
            </div>
            <!-- 奖励 -->
            <div
                class="frame"
                v-for="(ite, inx) in item.rewards"
                :key="inx"
            >
                <div
                    class="icon"
                    :style="getStyle('icon-style')"
                >
                    <div
                        class="day"
                        :style="getStyle('day-style')"
                    >
                        {{ ite.subscript }}
                    </div>
                    <img
                        :style="{
                            width: ite.object_type === 'ROOM_BG_IMAGE' ? 'auto' : '',
                            height: ite.object_type === 'INCOME_RIBBON' ? 'auto' : '',
                        }"
                        :src="ite.reward_icon"
                        alt=""
                    />
                </div>
                <div class="name">{{ ite.reward_name }}</div>
            </div>
            <!-- 领取 -->
            <div
                class="git-button"
                :class="{ 'git-button-yes': item.reward_status === 2 }"
                :style="[
                    { opacity: item.reward_status === 0 ? '0.6' : 1 },
                    item.reward_status === 2 ? getStyle('git-button-yes') : backImg('git-button'),
                ]"
                @click="getReward(item, index)"
            >
                {{
                    item.reward_status === 0 || item.reward_status === 1
                        ? $t('claim')
                        : $t('already_claimed')
                }}
            </div>
        </div>

        <p>
            {{
                props.groupType === 'ANCHOR'
                    ? $t('ambassador_tasks_completed')
                    : $t('guardian_tasks_completed')
            }}
        </p>
    </div>
</template>

<script setup>
import {
    getCurrentInstance,
    nextTick,
    onMounted,
    ref,
    defineEmits,
    defineProps,
    defineExpose,
} from 'vue';
import { getTaskRewardAPI, getWelfareInfoAPI } from '@/pages/constellation/api';
import { Toast } from 'vant';

// 获取国际化多语言
const root = getCurrentInstance();
const t = (val, msg) => {
    return root.proxy.$i18n.t(val, msg);
};

const emits = defineEmits(['awardShow']);

const props = defineProps({
    groupType: {
        type: String,
        default: 'ANCHOR',
    },
    valueKey: {
        type: String,
        default: '',
    },
});

// 背景图片配置方法
const backImg = (key) => {
    return {
        backgroundImage: `url(${root.proxy.$list.reward[key]})`,
    };
};
// 获取样式
const getStyle = (key) => {
    return root.proxy.$list.reward[key];
};

// 领取任务奖励
const getReward = async (value) => {
    try {
        if (!value.reward_status) {
            Toast(t('reward_not_unlocked'));
            return;
        }
        if (value.reward_status === 2) return;
        const res = await getTaskRewardAPI({
            constellation_type: props.groupType,
            task_id: value.task_id,
            group_id: 2024,
        });
        if (res.status !== 1000) {
            Toast(res.desc);
            return;
        }
        // 成功后提示拉起弹窗
        Toast(t('reward_claimed_success'));
        await getRewardData();
        emits('awardShow', value.rewards);
    } catch (err) {
        console.log(err);
    }
};

// 页面数据
const progressList = ref([]);
const getRewardData = async () => {
    try {
        const res = await getWelfareInfoAPI({
            constellationType: props.groupType,
            cycleType: props.valueKey,
            group_id: 2024,
        });
        if (res.status !== 1000) return;
        progressList.value = res.data.progress;
        nextTick(() => {
            // 计算进度条
            getScheduleCalculate();
        });
    } catch (err) {
        console.log(err);
    }
};
// 导出方法切换二级组件使用
defineExpose({
    getRewardData,
});
// 大进度条进度
const scheduleHeight = ref(0);
// 记录小点位置
const dotListTop = ref([]);
// 计算进度条
const getScheduleCalculate = () => {
    progressBarHeight.value = 0;
    scheduleHeight.value = 0;
    dotListTop.value = [];
    // 获取dom之间间距  间距固定只需要算出第一个和第二个之间的间距即可
    if (rankList.value[1] && rankList.value[0])
        marginNumber.value =
            rankList.value[1].getBoundingClientRect().top -
            rankList.value[0].getBoundingClientRect().top -
            rankList.value[0].offsetHeight;
    // 计算进度条长度
    rankList.value.forEach((item, inx) => {
        if (inx !== 0) {
            progressBarHeight.value += item.offsetHeight + marginNumber.value;
            dotListTop.value.push(progressBarHeight.value - marginNumber.value);
        }
    });
    // 计算进度 进度除去第一个挡位长度
    progressList.value.forEach((itemRef, index) => {
        if (itemRef.reward_status && index)
            scheduleHeight.value += rankList.value[index].offsetHeight + marginNumber.value;
    });
    // 获取当前处于挡位
    const fIndex = progressList.value.findIndex((itemRef) => itemRef.reward_status === 0);
    // 判断当前进度状态是否不在第一挡位 执行逻辑  跳过0
    if (fIndex > 0) {
        // 计算属于当前挡位的进度位置 两种任务每种50%分开计算
        scheduleHeight.value +=
            ((rankList.value[fIndex].offsetHeight + marginNumber.value) /
                2 /
                progressList.value[fIndex].tasks[0].requirement) *
            progressList.value[fIndex].tasks[0].progress;
        scheduleHeight.value +=
            ((rankList.value[fIndex].offsetHeight + marginNumber.value) /
                2 /
                progressList.value[fIndex].tasks[1].requirement) *
            progressList.value[fIndex].tasks[1].progress;
    }
};

const rankList = ref(null);
// 获取进度条高度
const progressBarHeight = ref(0);
// dom之间间距
const marginNumber = ref(0);
onMounted(async () => {
    await new Promise((resolve) => {
        setTimeout(() => {
            return resolve();
        }, 100);
    });
    await getRewardData();
});
</script>

<style lang="less" scoped>
.ranking {
    position: relative;
    margin-top: 0.54rem;
    padding-bottom: 0.36rem;

    .progress-bar {
        position: absolute;
        top: 1.82rem;
        left: 0.37rem;
        width: 0.18rem;
        border-radius: 0.1rem;
        //box-sizing: content-box;
        .schedule {
            position: absolute;
            top: 0;
            left: 0;
            width: 0.16rem;
            height: 6.34rem;
            border-radius: 0.1rem;
            transition-duration: 0.3s;
        }
        .task-status {
            position: absolute;
            top: -0.21rem;
            left: -0.13rem;
            //transform: translateY(-50%);
            width: 0.42rem;
            height: 0.42rem;
            background-repeat: no-repeat;
            background-size: contain;
        }
    }

    .rank-list {
        display: flex;
        justify-content: space-evenly;
        flex-wrap: wrap;
        position: relative;
        width: 6.26rem;
        margin: 0 0 0.22rem 0.94rem;
        padding: 1.02rem 0 0.88rem;
        border-radius: 0.24rem;

        .receiving,
        .remain {
            position: absolute;
            top: 0.48rem;
            left: 0.47rem;
            width: 2.4rem;
            height: 0.12rem;
            border-radius: 0.15rem;
            box-sizing: content-box;

            .task {
                position: absolute;
                top: -0.29rem;
                left: 50%;
                transform: translateX(-50%);
                height: 0.2rem;
                font-weight: 400;
                font-size: 0.18rem;
                color: #ffea83;
                line-height: 0.2rem;
                white-space: nowrap;
            }

            span {
                position: absolute;
                bottom: -0.32rem;
                left: 50%;
                transform: translateX(-50%);
                height: 0.32rem;
                font-weight: 400;
                font-size: 0.16rem;
                line-height: 0.32rem;
            }
        }

        .receiving {
            .schedule {
                width: 1.79rem;
                height: 0.12rem;
                background: linear-gradient(180deg, #fff4ae 0%, #f88812 100%);
                border-radius: 0.14rem;
                border: 0.01rem solid #fdd377;
                transition-duration: 0.2s;
            }
        }

        .remain {
            left: 3.39rem;

            .schedule {
                width: 1.79rem;
                height: 0.12rem;
                background: linear-gradient(180deg, #ff83ef 0%, #d019ef 100%);
                border-radius: 0.14rem;
                border: 0.01rem solid #fdd377;
                transition-duration: 0.2s;
            }
        }

        .frame {
            width: 1.3rem;

            .icon {
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                width: 1.3rem;
                height: 1.3rem;
                border-radius: 0.16rem;

                .day {
                    position: absolute;
                    top: 0;
                    right: 0;
                    height: 0.26rem;
                    line-height: 0.26rem;
                    padding: 0 0.1rem;
                    border-radius: 0 0.13rem 0 0.13rem;
                    text-align: center;
                    font-size: 0.16rem;
                    color: #ffffff;
                }

                img {
                    width: 1rem;
                    height: 1rem;
                }
            }

            .name {
                margin: 0.06rem 0;
                font-size: 0.22rem;
                color: #ffffff;
                line-height: 0.22rem;
                text-align: center;
            }
        }

        .git-button {
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            bottom: 0.16rem;
            left: 50%;
            transform: translateX(-50%);
            width: 1.43rem;
            height: 0.59rem;
            background-repeat: no-repeat;
            background-size: contain;
            font-weight: 500;
            font-size: 0.22rem;
            color: #ffffff;
        }

        .git-button-yes {
            height: 0.53rem;
            font-weight: 500;
            font-size: 0.22rem;
        }
    }

    p {
        width: 6.49rem;
        margin: 0.08rem auto 0;
        font-size: 0.22rem;
        line-height: 0.24rem;
        color: #ffffff;
    }
}
</style>
