<!-- 家族排行 -->
<template>
    <div class="family-ranking">
        <div class="head-img"></div>
        <div
            class="time"
            v-if="condition"
        >
            <span>{{ props.paramsName }}</span>
            <div class="times-front">
                <div class="times">{{ formattedDays }}</div>
                <div class="times">{{ formattedHours }}</div>
                <div class="times">{{ formattedMinutes }}</div>
                <div class="times">{{ formattedSeconds }}</div>
            </div>
        </div>
        <div
            class="time end"
            v-else
        >
            {{ $t('stage_ended') }}
        </div>
        <!--前三-->
        <div class="frame">
            <div
                class="front"
                v-for="(item, index) in 3"
                :key="item"
            >
                <div class="bg"></div>
                <div
                    class="click"
                    @click="toDetails(rankingThree[index])"
                ></div>
                <div class="head">
                    <img
                        v-if="rankingThree[index] && rankingThree[index].icon"
                        :src="rankingThree[index].icon"
                        alt=""
                    />
                    <img
                        v-else
                        src="https://yaame-static.yaame.io/admin/283df6ae522b13aadeb97768ef9cb033.png"
                        alt=""
                    />
                </div>
                <div
                    class="name no-wrap"
                    v-if="rankingThree[index]"
                >
                    <span class="no-wrap">{{ rankingThree[index].name }}</span>
                    <img
                        v-if="rankingThree[index].level_icon"
                        :src="rankingThree[index].level_icon"
                        alt=""
                    />
                </div>
                <div
                    v-if="rankingThree[index]"
                    class="number"
                >
                    <img
                        src="https://yaame-static.yaame.io/admin/b9b377b5cb1d96a3b57532deb48a045b.png"
                        alt=""
                    />
                    {{ rankingThree[index].score }}
                </div>
                <!-- 成员排名 -->
                <div
                    v-if="rankingThree[index] && rankingThree[index].users.length"
                    class="member-ranking"
                    @click="showUserRank(rankingThree[index])"
                >
                    <div
                        v-for="(item1, index1) in 3"
                        :key="index1"
                    >
                        <img
                            v-if="rankingThree[index].users[index1]"
                            :src="rankingThree[index].users[index1]"
                            alt=""
                        />
                        <img
                            v-else
                            src="https://yaame-static.yaame.io/admin/9cf28c04a72e07566476ac29bf3c6b8f.png"
                            alt=""
                        />
                    </div>
                    >
                </div>
            </div>
        </div>

        <!--剩余排行-->
        <VanList
            v-if="rankingThree.length"
            v-model="loading"
            :finished="finished"
            finished-text=" "
            loading-text=" "
            error-text=" "
            @load="getFamilyRanking"
        >
            <div
                class="rank-last"
                v-for="(item, index) in rankingLast"
                :key="index"
            >
                <div class="rank-back">{{ index + 4 }}</div>
                <div
                    class="head-back"
                    @click="toDetails(item)"
                >
                    <img
                        :src="item.icon"
                        alt=""
                    />
                </div>
                <div class="name-back">
                    <div class="name">
                        <span class="no-wrap">{{ item.name }}</span>
                        <img
                            v-if="item.level_icon"
                            :src="item.level_icon"
                            alt=""
                        />
                    </div>
                    <div class="id">
                        <img
                            src="https://yaame-static.yaame.io/admin/b9b377b5cb1d96a3b57532deb48a045b.png"
                            alt=""
                        />
                        {{ item.score }}
                    </div>
                </div>
                <div
                    v-if="index + 4 <= props.data.ranking"
                    class="promoted"
                >
                    {{ $t('advancement') }}
                </div>
                <!-- 成员排名 -->
                <div
                    class="member-ranking"
                    @click="showUserRank(item)"
                >
                    <div
                        v-for="(item1, index1) in 3"
                        :key="index1"
                    >
                        <img
                            v-if="item.users[index1]"
                            :src="item.users[index1]"
                            alt=""
                        />
                        <img
                            v-else
                            src="https://yaame-static.yaame.io/admin/9cf28c04a72e07566476ac29bf3c6b8f.png"
                            alt=""
                        />
                    </div>
                    >
                </div>
            </div>
        </VanList>

        <!-- 我的家族 -->
        <div class="my-family">
            <div
                v-if="Object.keys(userList).length"
                class="frame"
            >
                <div class="rank-back">
                    {{ userList.rank || userList.rank > 99 ? userList.rank : '99+' }}
                </div>
                <div class="head-back">
                    <img
                        :src="userList.icon"
                        alt=""
                    />
                </div>
                <div class="name-back">
                    <div class="name">
                        <span class="no-wrap">{{ userList.name }}</span>
                        <img
                            v-if="userList.level_icon"
                            :src="userList.level_icon"
                            alt=""
                        />
                    </div>
                    <div class="id">
                        <img
                            src="https://yaame-static.yaame.io/admin/b9b377b5cb1d96a3b57532deb48a045b.png"
                            alt=""
                        />
                        {{ userList.score }}
                    </div>
                </div>
                <!-- 我的贡献值 -->
                <div v-if="props.params.index === 1">
                    <div
                        v-if="userList.in_promotion || props.data.litre"
                        class="contribute"
                    >
                        <div class="contribute-title">{{ $t('my_honor_points') }}</div>
                        <div class="contribute-value">{{ userList.own_score }}</div>
                    </div>
                    <div
                        v-else
                        class="contribute"
                    >
                        {{ $t('not_advanced') }}
                    </div>
                </div>
                <div v-if="props.params.index === 2">
                    <div
                        v-if="userList.in_promotion"
                        class="contribute"
                    >
                        <div class="contribute-title">{{ $t('my_honor_points') }}</div>
                        <div class="contribute-value">{{ userList.own_score }}</div>
                    </div>
                    <div
                        v-else
                        class="contribute"
                    >
                        {{ $t('not_advanced') }}
                    </div>
                </div>
                <div v-if="props.params.index === 3">
                    <div
                        v-if="userList.in_promotion"
                        class="contribute"
                    >
                        <div class="contribute-title">{{ $t('my_honor_points') }}</div>
                        <div class="contribute-value">{{ userList.own_score }}</div>
                    </div>
                    <div
                        v-else
                        class="contribute"
                    >
                        {{ $t('not_advanced') }}
                    </div>
                </div>
            </div>

            <!-- 加入家族 -->
            <div
                v-else
                class="join-family"
            >
                <!-- 测试遮罩层 -->
                <div
                    class="img"
                    @click="skip"
                >
                    {{ $t('join_family') }}
                </div>
                <p>{{ $t('not_in_family') }}</p>
            </div>
        </div>

        <!-- 成员排行榜 -->
        <UserRanking
            ref="userRank"
            :queryData="queryData"
            @showOpen="showOpen"
        />
    </div>
</template>

<script setup>
import { reactive, ref, defineProps, defineExpose, computed } from 'vue';
import { getFamilyRankingApi } from '../api';
import UserRanking from '../components/userRanking.vue';

// 接收父组件数据
const props = defineProps({
    params: {
        type: Object,
        default: () => ({}),
    },
    data: {
        type: Object,
        default: () => ({}),
    },
    paramsName: {
        type: String,
        default: '',
    },
});
// 获取页面信息
const userList = ref({});
// 排名前三的数据
const rankingThree = ref([]);
// 剩下排名数据
const rankingLast = ref([]);

// 查询数据
const query = reactive({
    page: 1,
    size: 10,
});
// 是否加载中
const loading = ref(false);
// 是否结束
const finished = ref(false);

// 活动结束时间戳
const timeEnd = ref(0);
// 页面计时时间
const days = ref(0);
const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);
// 标记倒计时已结束
const condition = ref(true);
const updateTime = () => {
    const now = new Date().getTime();
    const timeDifference = timeEnd.value - now;
    if (timeDifference > 0) {
        condition.value = true;
        days.value = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        hours.value = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        minutes.value = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        seconds.value = Math.floor((timeDifference % (1000 * 60)) / 1000);
    } else {
        days.value = 0;
        hours.value = 0;
        minutes.value = 0;
        seconds.value = 0;
        condition.value = false;
    }
};
// 定时器倒计时
let timeOut = null;
const openTiming = () => {
    timeOut = setInterval(() => {
        updateTime();
    }, 1000);
};
// 节流阀
const throttle = ref(false);
// 获取家族排行数据
const getFamilyRanking = async (status = 0) => {
    try {
        if (throttle.value) return;
        throttle.value = true;
        // 切换赛程时间倒计时
        if (status) {
            clearInterval(timeOut);
            timeEnd.value = props.params.endTime;
            openTiming();
            // 第一页清空之前残留数据
            rankingThree.value = [];
            rankingLast.value = [];
            query.page = 1;
        } else {
            timeEnd.value = props.params.endTime;
            openTiming();
        }
        // 记录当前活动id和赛段id
        queryData.value.id = props.params.id;
        queryData.value.index = props.params.index;
        const res = await getFamilyRankingApi({
            ...query,
            ...props.params,
        });
        if (res.status !== 1000) return;
        loading.value = !res.data.has_next;
        finished.value = !res.data.has_next;
        // 判断是否是第一页数据
        if (query.page === 1) {
            // 第一页清空之前残留数据
            rankingThree.value = [];
            rankingLast.value = [];
            userList.value = {};
            // 前三数据
            rankingThree.value = res.data.content ? res.data.content.slice(0, 3) : [];
            // 剩余数据
            rankingLast.value = res.data.content ? res.data.content.slice(3) : [];
            // 家族信息
            userList.value = res.data.owner || {};
            queryData.value.uid = res.data.owner?.uid;
            query.page++;
            // 赋值数据后关闭节流阀
            throttle.value = false;
        } else {
            query.page++;
            rankingLast.value.push(...res.data.content);
            // 判断当前数据超过99条不进行请求并删除到99条
            if (rankingLast.value.length > 99) {
                rankingLast.value = rankingLast.value.slice(0, 96);
                finished.value = true;
            }
            // 赋值数据后关闭节流阀
            throttle.value = false;
        }
    } catch (error) {
        console.log(error);
    }
};

// 查询信息
const queryData = ref({
    show: false,
    id: 0,
    index: 0,
    family_id: 0,
});
// 用户排行榜组件
const userRank = ref(null);

// 查看当前家族成员排名
const showUserRank = (item) => {
    queryData.value.show = true;
    queryData.value.family_id = item.id;
    userRank.value.getUserRank();
};

// 关闭弹窗
const showOpen = () => {
    queryData.value.show = false;
};

// 返回格式逻辑
// 天
const formattedDays = computed(() => {
    return days.value < 10 ? '0' + days.value : days.value;
});
// 小时
const formattedHours = computed(() => {
    return hours.value < 10 ? '0' + hours.value : hours.value;
});
// 分钟
const formattedMinutes = computed(() => {
    return minutes.value < 10 ? '0' + minutes.value : minutes.value;
});
// 秒
const formattedSeconds = computed(() => {
    return seconds.value < 10 ? '0' + seconds.value : seconds.value;
});

// 点击跳转到特定页
const skip = () => {
    // 更改页面标识
    window.localStorage.setItem('familyHonor', '2');
    // 打开新页面
    window.location.href = 'https://' + window.location.host + '/familyRank_1_18.html?is_full_screen=1&active=NEW';
};

// 跳转家族页
const toDetails = (item) => {
    window.location.href = `wlyaame://family/details?family_id=${item.id}`;
};

// 暴露接口方法
defineExpose({
    getFamilyRanking,
});
</script>

<style lang="less" scoped>
.family-ranking {
    position: relative;
    width: 7.18rem;
    min-height: 21rem;
    margin: 0 auto;
    padding-top: 9.33rem;
    padding-bottom: 2rem;
    background: #e1902b;
    border: 0.08rem solid #ffde56;
    background-image: url(https://yaame-static.yaame.io/admin/cd6268723ef258da227ccec10e6f6169.png);
    background-repeat: no-repeat;
    background-size: contain;

    .head-img {
        position: absolute;
        top: -0.37rem;
        left: 50%;
        transform: translateX(-50%);
        width: 7.18rem;
        height: 0.78rem;
        background-image: url(https://yaame-static.yaame.io/admin/e71724cf5dcb9ebec9ecf9e6102609e4.png);
        background-repeat: no-repeat;
        background-size: contain;
    }

    .time {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        position: absolute;
        top: 0.43rem;
        left: 50%;
        transform: translateX(-50%);
        width: 6.41rem;
        height: 0.8rem;
        background-image: url(https://yaame-static.yaame.io/admin/938e02b180a6b984ae30f6bf6ec77743.png);
        background-repeat: no-repeat;
        background-size: contain;
        span {
            margin-right: 0.19rem;
            font-weight: 600;
            font-size: 0.26rem;
            color: #b85b02;
            flex: 1;
            text-align: center;
        }
        .times-front {
            display: flex;
            justify-content: space-between;
            width: 3.28rem;
            height: 0.6rem;
            margin-right: 0.4rem;
            .times {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 0.67rem;
                height: 0.6rem;
                font-weight: 600;
                font-size: 0.28rem;
                color: #b85b02;
            }
        }
    }
    .end {
        justify-content: center;
        background-image: url(https://yaame-static.yaame.io/admin/6d90f7eb0b8a11538ab23ca104f6b5d4.png);
        font-weight: 600;
        font-size: 0.26rem;
        color: #b85b02;
    }

    // 前三样式
    .frame {
        .front {
            position: absolute;
            top: 5.24rem;
            left: 0.16rem;
            width: 2.64rem;
            height: 4.05rem;
            overflow: hidden;

            .bg {
                position: absolute;
                width: 100%;
                height: 100%;
                background-repeat: no-repeat;
                background-size: contain;
                z-index: 1;
            }

            .click {
                position: absolute;
                top: 0.23rem;
                left: 50%;
                transform: translateX(-50%);
                z-index: 2;
                width: 1.48rem;
                height: 1.48rem;
            }

            .head {
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 1.48rem;
                height: 1.48rem;
                margin: 0.23rem auto 0;
                background-repeat: no-repeat;
                background-size: contain;

                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 0.14rem;
                }
            }

            .name {
                display: flex;
                align-items: center;
                justify-content: center;
                align-items: center;
                width: 1.79rem;
                height: 0.28rem;
                margin: 0.77rem auto 0.09rem;
                font-size: 0.2rem;
                line-height: 0.28rem;
                span {
                    z-index: 1;
                }
                img {
                    width: 0.33rem;
                    height: 0.33rem;
                    margin-left: 0.04rem;
                    z-index: 1;
                }
            }

            .number {
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 0.22rem;
                margin: 0 auto 0.1rem;
                font-size: 0.22rem;
                z-index: 1;
                img {
                    width: 0.26rem;
                    height: 0.28rem;
                }
            }

            .member-ranking {
                position: relative;
                left: 50%;
                transform: translateX(-50%);
                width: 1.31rem;
                height: 0.46rem;
                line-height: 0.46rem;
                text-align: right;
                font-size: 0.25rem;
                z-index: 1;
                div {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: absolute;
                    width: 0.41rem;
                    height: 0.41rem;
                    background: #df9226;
                    border: 0.02rem solid #ffff97;
                    border-radius: 50%;

                    img {
                        width: 0.39rem;
                        height: 0.39rem;
                        border-radius: 50%;
                    }
                }
                div:nth-child(2) {
                    left: 0.32rem;
                    background: #df9226;
                    border: 0.02rem solid #97d2ff;
                }
                div:nth-child(3) {
                    left: 0.63rem;
                    background: #df9226;
                    border: 0.02rem solid #ffa27c;
                }
            }
        }
        .front:nth-child(1) {
            top: 1.46rem;
            left: 50%;
            transform: translateX(-50%);
            width: 2.93rem;
            height: 4.5rem;
            color: #b85b02;
            .bg {
                background-image: url('https://yaame-static.yaame.io/admin/10f9c65fb545dc5cf06ad020303bba53.png');
            }
            .head {
                width: 1.64rem;
                height: 1.64rem;
                margin-bottom: 0.87rem;
            }
            .name {
                font-size: 0.22rem;
                color: #b85b02;
            }
        }
        .front:nth-child(2) {
            color: #4456b9;
            .bg {
                background-image: url('https://yaame-static.yaame.io/admin/0e6fe21e8904bf4bf83d91b115de642b.png');
            }
            .name {
                font-size: 0.2rem;
            }
        }
        .front:nth-child(3) {
            left: 4.22rem;
            color: #c24907;
            .bg {
                background-image: url('https://yaame-static.yaame.io/admin/3fb98f358b168ea2a3b57041d6c315c4.png');
            }
            .name {
                font-size: 0.2rem;
            }
        }
    }

    // 剩余排名
    .rank-last {
        position: relative;
        display: flex;
        align-items: center;
        width: 6.76rem;
        min-height: 2.16rem;
        margin: 0 auto 0.12rem;
        padding-top: 0.3rem;
        background-image: url('https://yaame-static.yaame.io/admin/de21ac4284ec0e451c27f37fa0da9e39.png');
        background-repeat: no-repeat;
        background-size: contain;
        color: #b85b02;

        .rank-back {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 0.15rem;
            margin: 0 0.37rem 0 0.48rem;
            font-weight: normal;
            font-size: 0.22rem;
        }

        .head-back {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 1.28rem;
            height: 1.28rem;
            margin-right: 0.18rem;
            background-image: url('https://yaame-static.yaame.io/admin/ff4d2b1128544f6432656b643b13f4f8.png');
            background-repeat: no-repeat;
            background-size: contain;
            img {
                width: 1.2rem;
                height: 1.2rem;
                border-radius: 0.12rem;
            }
        }

        .name-back {
            position: relative;
            .name {
                display: flex;
                align-items: center;
                width: 2.52rem;
                font-weight: 600;
                font-size: 0.28rem;
                color: #b85b02;
                img {
                    width: 0.33rem;
                    height: 0.33rem;
                    margin-left: 0.09rem;
                }
            }

            .id {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                height: 0.3rem;
                line-height: 0.3rem;
                margin-top: 0.1rem;
                font-weight: 600;
                font-size: 0.28rem;
                color: #b85b02;
                img {
                    width: 0.28rem;
                    height: 0.3rem;
                    margin-right: 0.08rem;
                }
            }
        }

        .promoted {
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            top: 0.3rem;
            right: 0.13rem;
            width: 1.33rem;
            height: 0.43rem;
            font-size: 0.24rem;
            color: #b85b02;
            background-image: url(https://yaame-static.yaame.io/admin/f60ce3a637ac069e54f0b8858c4f595a.png);
            background-repeat: no-repeat;
            background-size: contain;
        }

        .member-ranking {
            position: relative;
            width: 1.25rem;
            height: 0.46rem;
            margin-left: 0.3rem;
            line-height: 0.46rem;
            text-align: right;
            font-size: 0.25rem;
            z-index: 1;
            div {
                display: flex;
                justify-content: center;
                align-items: center;
                position: absolute;
                width: 0.41rem;
                height: 0.41rem;
                background: #df9226;
                border: 0.02rem solid #ffff97;
                border-radius: 50%;

                img {
                    width: 0.39rem;
                    height: 0.39rem;
                    border-radius: 50%;
                }
            }
            div:nth-child(2) {
                left: 0.32rem;
                background: #df9226;
                border: 0.02rem solid #97d2ff;
            }
            div:nth-child(3) {
                left: 0.63rem;
                background: #df9226;
                border: 0.02rem solid #ffa27c;
            }
        }
    }

    .my-family {
        position: fixed;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 7.5rem;
        height: 2.25rem;
        padding-top: 0.67rem;
        background-image: url('https://yaame-static.yaame.io/admin/6e6ff7e3fed53c5d33c8a03f26060ce4.png');
        background-repeat: no-repeat;
        background-size: contain;
        z-index: 3;

        .frame {
            position: relative;
            display: flex;
            align-items: center;
            .rank-back {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 0.15rem;
                margin: 0 0.37rem 0 0.48rem;
                font-weight: normal;
                font-size: 0.22rem;
                color: #b85b02;
            }

            .head-back {
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 1.28rem;
                height: 1.28rem;
                margin-right: 0.18rem;
                background-image: url('https://yaame-static.yaame.io/admin/ff4d2b1128544f6432656b643b13f4f8.png');
                background-repeat: no-repeat;
                background-size: contain;
                img {
                    width: 1.2rem;
                    height: 1.2rem;
                    border-radius: 0.12rem;
                }
            }

            .name-back {
                position: relative;
                .name {
                    display: flex;
                    align-items: center;
                    width: 2.52rem;
                    align-items: baseline;
                    font-weight: 600;
                    font-size: 0.28rem;
                    color: #b85b02;
                    img {
                        width: 0.33rem;
                        height: 0.33rem;
                        margin-left: 0.09rem;
                    }
                }

                .id {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    height: 0.3rem;
                    margin-top: 0.1rem;
                    line-height: 0.3rem;
                    font-weight: 600;
                    font-size: 0.28rem;
                    color: #b85b02;
                    img {
                        width: 0.28rem;
                        height: 0.3rem;
                        margin-right: 0.08rem;
                    }
                }
            }

            .contribute {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                right: 0.54rem;
                display: flex;
                align-items: center;
                flex-direction: column;
                font-size: 0.22rem;
                color: #b85b02;

                .contribute-title {
                    width: 1.54rem;
                    text-align: center;
                }
            }
        }

        .join-family {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            z-index: 4;
            .img {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 3.23rem;
                height: 0.95rem;
                line-height: 0.3rem;
                margin-bottom: 0.1rem;
                padding: 0.1rem;
                background-image: url('https://yaame-static.yaame.io/admin/ce3d9a93f730f696326c19a41c8e9d36.png');
                background-repeat: no-repeat;
                background-size: contain;
                font-weight: 600;
                font-size: 0.3rem;
                color: #b85b02;
                text-align: center;
            }
            p {
                font-weight: 600;
                font-size: 0.24rem;
                color: #b85b02;
            }
        }
    }
}
</style>
