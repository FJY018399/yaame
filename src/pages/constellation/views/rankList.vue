<!--
 * @Author: Elk
 * @Date: 2024-08-29 16:26:39
 * @FilePath: /yaame-h5/src/pages/constellation/views/rank.vue
 * @Description: 
-->
<template>
    <div
        class="ranking"
        :style="backImg('ranking')"
    >
        <div class="top-list">
            <div
                v-for="(item, index) in topList"
                :key="index"
                :class="['top-' + (index + 1)]"
            >
                <img
                    v-if="item.avatar"
                    class="user-avatar"
                    :src="item.avatar"
                    alt=""
                    @click="toDetails(item)"
                />
                <img
                    v-else
                    class="user-avatar"
                    src="@/assets/img/deficiency.png"
                    alt=""
                />

                <div
                    v-if="item.user_status === 1"
                    class="status-img"
                    :style="getStyle('on-line')"
                >
                    {{ $t('online') }}
                </div>
                <div
                    v-if="item.user_status === 2"
                    class="status-img"
                    :style="getStyle('status-img')"
                >
                    {{ $t('start_broadcast') }}
                </div>

                <div class="user-name no-wrap">
                    <span class="no-wrap">{{ item.nick_name }}</span>

                    <img
                        v-if="item.popular_level && props.groupType === 'ANCHOR'"
                        :src="item.popular_level"
                        alt=""
                    />
                    <img
                        v-if="item.wealth_level && props.groupType === 'AUDIENCE'"
                        :src="item.wealth_level"
                        alt=""
                    />
                </div>
                <div class="user-score">
                    <img
                        src="https://yaame-static.yaame.io/admin/1aa7e4f587100146d0324b9d827e27e1.png"
                        alt=""
                    />
                    {{ item.score }}
                </div>

                <template v-if="item.uid !== userInfo.uid">
                    <img
                        v-if="item.relation && item.relation.attention === 0"
                        :src="getSrcImg('attention')"
                        alt=""
                        class="user-icon"
                        @click="attentions(item)"
                    />
                    <img
                        v-else-if="item.user_status !== 1"
                        :src="getSrcImg('chat')"
                        alt=""
                        class="user-icon"
                        @click="attentions(item)"
                    />
                </template>
            </div>
        </div>
        <div class="rank-list">
            <div
                v-for="(item, index) in rankList"
                :key="index"
                class="rank-item"
                :style="[item.reward_status === 2 ? backImg('super') : backImg('rank-item')]"
            >
                <div class="item-rank">{{ item.rank }}</div>
                <div class="item-avatar">
                    <div
                        class="user-avatar"
                        @click="toDetails(item)"
                    >
                        <img
                            class="user-avatar-img"
                            :src="item.avatar"
                            alt=""
                        />
                        <img
                            class="user-dress-img"
                            :src="getSrcImg('user-dress-img')"
                            alt=""
                        />
                    </div>
                    <div
                        v-if="item.user_status === 1"
                        class="status-img"
                        :style="getStyle('on-line')"
                    >
                        {{ $t('online') }}
                    </div>
                    <div
                        v-if="item.user_status === 2"
                        class="status-img"
                        :style="getStyle('status-img')"
                    >
                        {{ $t('start_broadcast') }}
                    </div>
                </div>
                <div class="item-info">
                    <div class="item-info-name">
                        <span class="no-wrap">{{ item.nick_name }}</span>
                        <img
                            v-if="item.popular_level && props.groupType === 'ANCHOR'"
                            :src="item.popular_level"
                            alt=""
                        />
                        <img
                            v-if="item.wealth_level && props.groupType === 'AUDIENCE'"
                            :src="item.wealth_level"
                            alt=""
                        />
                    </div>
                    <div class="item-info-score">
                        <img
                            src="https://yaame-static.yaame.io/admin/1aa7e4f587100146d0324b9d827e27e1.png"
                            alt=""
                        />
                        {{ item.score }}
                    </div>
                </div>
                <template v-if="item.uid !== userInfo.uid">
                    <img
                        v-if="item.relation && item.relation.attention === 0"
                        :src="getSrcImg('attention')"
                        alt=""
                        class="item-btn"
                        @click="attentions(item)"
                    />
                    <img
                        v-else-if="item.user_status !== 1"
                        :src="getSrcImg('chat')"
                        alt=""
                        class="item-btn"
                        @click="attentions(item)"
                    />
                </template>
            </div>

            <!--缺省图-->
            <div
                v-if="noData"
                class="lack"
                :style="getStyle('lack')"
            >
                <p>{{ $t('noRank') }}</p>
            </div>
        </div>

        <div
            v-if="userInfo && userInfo.uid"
            class="user-info"
            :style="[userInfo.reward_status === 2 ? backImg('user-super') : backImg('user-info')]"
        >
            <div class="item-rank">
                {{ formatRank(userInfo.rank) }}
            </div>
            <div class="item-avatar">
                <div class="user-avatar">
                    <img
                        class="user-avatar-img"
                        :src="userInfo.avatar"
                        alt=""
                    />
                    <img
                        class="user-dress-img"
                        :src="getSrcImg('user-dress-img')"
                        alt=""
                    />
                </div>
                <div
                    v-if="userInfo.user_status === 1"
                    class="status-img"
                    :style="getStyle('on-line')"
                >
                    {{ $t('online') }}
                </div>
                <div
                    v-if="userInfo.user_status === 2"
                    class="status-img"
                    :style="getStyle('status-img')"
                >
                    {{ $t('start_broadcast') }}
                </div>
            </div>
            <div class="item-info">
                <div class="item-info-name">
                    <span class="no-wrap">{{ userInfo.nick_name }}</span>
                    <img
                        v-if="userInfo.popular_level && props.groupType === 'ANCHOR'"
                        :src="userInfo.popular_level"
                        alt=""
                    />
                    <img
                        v-if="userInfo.wealth_level && props.groupType === 'AUDIENCE'"
                        :src="userInfo.wealth_level"
                        alt=""
                    />
                </div>
                <div class="item-info-score">
                    <img
                        src="https://yaame-static.yaame.io/admin/1aa7e4f587100146d0324b9d827e27e1.png"
                        alt=""
                    />
                    {{ userInfo.score }}
                </div>
            </div>
            <div
                v-if="userInfo.delta_score && userInfo.rank !== 1 && userInfo.rank <= 99"
                class="item-next"
            >
                {{ $t('distance_to_next') }}{{ userInfo.delta_score }}
            </div>
            <div
                v-else-if="userInfo.delta_score === 0"
                class="item-next"
            >
                {{ $t('distance_to_next') }}{{ userInfo.delta_score }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { getRankAPI } from '@/pages/constellation/api';
import { ref, onMounted, watch, getCurrentInstance, defineProps, defineExpose } from 'vue';
import { postAttentionsApi } from '@/pages/independence/api';
import { burialPointFun } from '@/lib/utils';
import { Toast } from 'vant';

// 获取当前查看星座
const key = new URLSearchParams(window.location.search).get('type');

// 获取国际化函数
const root = getCurrentInstance();
const t = (val, msg) => {
    return root.proxy.$i18n.t(val, msg);
};
const props = defineProps(['groupType']);

// 背景图片配置方法
const backImg = (key) => {
    return {
        backgroundImage: `url(${root.proxy.$list.rank[key]})`,
    };
};
// 获取样式
const getStyle = (key) => {
    return root.proxy.$list.rank[key];
};

// 返回img链接
const getSrcImg = (key) => {
    return root.proxy.$list.rank[key];
};

const rankList = ref([]);
const userInfo = ref({});
const topList = ref([]);
const noData = ref(false);
const getRank = async () => {
    const res = await getRankAPI({
        constellation_type: props.groupType,
        cycleType: key,
    });
    if (res.status === 1000) {
        userInfo.value = res.data.my_rank_info;
        topList.value = [];
        rankList.value = [];
        noData.value = false;

        if (res.data.rank && res.data.rank.length) {
            if (res.data.rank.length > 3) {
                topList.value = res.data.rank.slice(0, 3);
                rankList.value = res.data.rank.slice(3);
            } else {
                topList.value = res.data.rank;
                if (topList.value.length < 3) {
                    // 补全前三名
                    for (let i = topList.value.length; i < 3; i++) {
                        topList.value.push({
                            nick_name: '-',
                            score: '-',
                            avatar: '',
                            relation: {
                                attention: 0,
                            },
                            uid: null,
                        });
                    }
                }
            }
        } else {
            rankList.value = [];
            topList.value = [];
            for (let index = 0; index < 3; index++) {
                topList.value.push({
                    nick_name: '-',
                    score: '-',
                    avatar: '',
                    relation: {
                        attention: 0,
                    },
                    uid: null,
                });
            }
            noData.value = true;
        }
    }
};

watch(
    () => props.groupType,
    () => {
        getRank();
    },
);
defineExpose({
    getRank,
});
// 跳转
const toDetails = (url) => {
    if (url.mystery === 1) {
        Toast(t('mystery_user'));
        return;
    }
    window.location.href = url.scheme_user_url;
};
// 关注
const attentions = async (value) => {
    try {
        if (!value.uid) {
            return;
        }
        if (value.uid === userInfo.value.uid) {
            return;
        }
        if (value.mystery === 1) {
            // 神秘人
            Toast(t('mystery_user'));
            return;
        }
        if (value.relation.attention === 0) {
            const res = await postAttentionsApi({
                target_uid: value.uid,
                group_id: 2024,
            });
            burialPointFun({
                event_name: 'page_btn_click',
                cid: -1000,
                md: 2,
                args_name: '',
                args: {
                    type: 'follow_btn',
                    page_name: 'Virgo_event',
                },
            });
            if (res.status !== 1000) {
                Toast(res.desc);
                return;
            }
            Toast(t('followed'));

            // 重新拉取数据
            getRank();
        } else {
            burialPointFun({
                event_name: 'page_btn_click',
                cid: -1000,
                md: 2,
                args_name: '',
                args: {
                    type: 'chat_btn',
                    page_name: 'Virgo_event',
                },
            });
            location.href = value.scheme_url;
        }
    } catch (err) {
        console.log(err);
    }
};
onMounted(async () => {
    await getRank();
});

// 格式化排名显示
const formatRank = (rank) => {
    if (!rank) return '-';
    return rank <= 99 ? rank : '99+';
};
</script>

<style lang="less" scoped>
.ranking {
    padding-bottom: 1.95rem;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: 0 -0.6rem;
    .top-list {
        height: 4.52rem;
        width: 7.5rem;
        position: relative;
        top: -0.3rem;
        .top-1 {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 4.08rem;
            height: 4.42rem;
            position: absolute;
            left: 1.72rem;
            top: 0;
            padding-top: 2.73rem;
            background-size: contain;
            background-repeat: no-repeat;
            background-image: url(https://yaame-static.yaame.io/admin/69c02edd48df775a1e4d62dc4630bb33.png);
            .user-avatar {
                width: 1.37rem;
                height: 1.37rem;
                display: block;
                border-radius: 50%;
                position: absolute;
                left: 1.36rem;
                top: 1.28rem;
            }
            .status-img {
                position: absolute;
                top: 2.46rem;
                left: 50%;
                min-width: 0.66rem;
                height: 0.24rem;
                padding: 0 0.08rem;
                border-radius: 0.08rem;
                font-size: 0.18rem;
                color: #ffffff;
                line-height: 0.24rem;
                transform: translateX(-50%);
                text-align: center;
                white-space: nowrap;
                z-index: 2;
            }
            .user-name {
                width: 2rem;
                text-align: center;
                font-weight: 500;
                font-size: 0.2rem;
                color: #b74600;
                display: flex;
                align-items: center;
                justify-content: center;
                img {
                    height: 0.2rem;
                    width: auto;
                    vertical-align: middle;
                    position: relative;
                }
            }
            .user-score {
                width: 2rem;
                text-align: center;
                font-size: 0.22rem;
                font-weight: 500;
                color: #b74600;
                img {
                    height: 0.3rem;
                    width: auto;
                    vertical-align: middle;
                    position: relative;
                    margin-right: -0.1rem;
                }
            }
            .user-icon {
                width: 0.42rem;
                height: 0.42rem;
                position: absolute;
                left: 1.83rem;
                bottom: 0.57rem;
            }
        }
        .top-2,
        .top-3 {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 2rem;
            height: 2.82rem;
            position: absolute;
            top: 1.7rem;
            left: 0.37rem;
            padding-top: 1.52rem;
            background-size: contain;
            background-image: url(https://yaame-static.yaame.io/admin/575f279aac4a5b3af62c958e014635c8.png);
            background-repeat: no-repeat;
            .status-img {
                position: absolute;
                top: 1.28rem;
                left: 50%;
                min-width: 0.66rem;
                height: 0.24rem;
                padding: 0 0.08rem;
                border-radius: 0.08rem;
                font-size: 0.18rem;
                color: #ffffff;
                line-height: 0.24rem;
                transform: translateX(-50%);
                text-align: center;
                white-space: nowrap;
                z-index: 2;
            }
            .user-avatar {
                width: 1.04rem;
                height: 1.04rem;
                display: block;
                border-radius: 50%;
                position: absolute;
                left: 0.47rem;
                top: 0.44rem;
            }
            .user-name {
                width: 2rem;
                padding: 0 0.3rem;
                font-weight: 500;
                font-size: 0.16rem;
                color: #2c17c2;
                display: flex;
                align-items: center;
                justify-content: center;
                img {
                    height: 0.16rem;
                    width: auto;
                    vertical-align: middle;
                    position: relative;
                    top: -0.02rem;
                    left: 0.04rem;
                }
            }
            .user-score {
                width: 1.5rem;
                text-align: center;
                font-weight: 500;
                font-size: 0.18rem;
                color: #2c17c2;
                img {
                    height: 0.25rem;
                    width: auto;
                    vertical-align: middle;
                    position: relative;
                    margin-right: -0.1rem;
                    top: 0.02rem;
                    left: 0;
                }
            }
            .user-icon {
                width: 0.34rem;
                height: 0.34rem;
                position: absolute;
                left: 0.81rem;
                bottom: 0.44rem;
            }
        }
        .top-3 {
            left: 5.16rem;
            background-image: url(https://yaame-static.yaame.io/admin/7761fa94050aa4736f751362d6cbb6fb.png);
            .user-name {
                color: #66029a;
            }
            .user-score {
                color: #66029a;
            }
            .user-avatar {
                width: 1rem;
                height: 1rem;
                display: block;
                border-radius: 50%;
                position: absolute;
                left: 0.47rem;
                top: 0.46rem;
            }
        }
    }
    .rank-list {
        .rank-item {
            width: 6.8rem;
            height: 1.42rem;
            margin-top: 0.12rem;
            background-repeat: no-repeat;
            // background-image: url(https://yaame-static.yaame.io/admin/9e9f8bd9adf40ea046cfddba462b1d9c.png);
            background-size: contain;
            margin-left: 0.35rem;
            padding-left: 0.4rem;
            display: flex;
            align-items: center;
            font-weight: 500;
            font-size: 0.24rem;
            color: #ffffff;
            .item-rank {
                width: 0.56rem;
                font-weight: 500;
                font-size: 0.24rem;
                color: #ffffff;
                padding-left: 0.1rem;
            }
            .item-avatar {
                width: 0.93rem;
                height: 0.93rem;
                position: relative;
                .status-img {
                    position: absolute;
                    top: 0.76rem;
                    left: 50%;
                    min-width: 0.66rem;
                    height: 0.24rem;
                    padding: 0 0.08rem;
                    border-radius: 0.08rem;
                    font-size: 0.18rem;
                    color: #ffffff;
                    line-height: 0.24rem;
                    transform: translateX(-50%);
                    text-align: center;
                    white-space: nowrap;
                    z-index: 2;
                }
                .user-avatar {
                    width: 0.93rem;
                    height: 0.93rem;
                    border-radius: 50%;
                    background-color: #b37cff;
                    .user-avatar-img {
                        width: 0.93rem;
                        height: 0.93rem;
                        border-radius: 50%;
                        position: absolute;
                    }
                    .user-dress-img {
                        width: 0.93rem;
                        height: 0.93rem;
                        border-radius: 50%;
                        position: absolute;
                        z-index: 1;
                    }
                }
            }
            .item-info {
                width: 3.94rem;
                padding-left: 0.22rem;
                .item-info-name {
                    display: flex;
                    align-items: center;
                    width: 3.5rem;
                    font-weight: 500;
                    font-size: 0.24rem;
                    color: #ffffff;
                    img {
                        height: 0.22rem;
                        width: auto;
                        vertical-align: middle;
                        position: relative;
                        margin-left: 0.04rem;
                    }
                }
                .item-info-score {
                    font-weight: 500;
                    font-size: 0.22rem;
                    color: #ffffff;
                    img {
                        height: 0.3rem;
                        width: auto;
                        vertical-align: middle;
                        position: relative;
                        margin-right: 0;
                        top: 0.02rem;
                    }
                }
            }
            .item-btn {
                width: 0.42rem;
                height: auto;
            }
        }
    }
    .user-info {
        width: 7.5rem;
        height: 1.64rem;
        background-size: contain;
        background-repeat: no-repeat;
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 9;
        display: flex;
        align-items: center;
        font-weight: 500;
        font-size: 0.24rem;
        color: #ffffff;
        padding-left: 0.37rem;
        padding-top: 0.26rem;
        .item-rank {
            width: 0.66rem;
            font-weight: 500;
            font-size: 0.24rem;
            color: #ffffff;
            padding-left: 0.1rem;
        }
        .item-avatar {
            width: 0.93rem;
            height: 0.93rem;
            position: relative;
            .status-img {
                position: absolute;
                top: 0.76rem;
                left: 50%;
                min-width: 0.66rem;
                height: 0.24rem;
                padding: 0 0.08rem;
                border-radius: 0.08rem;
                font-size: 0.18rem;
                color: #ffffff;
                line-height: 0.24rem;
                transform: translateX(-50%);
                text-align: center;
                white-space: nowrap;
                z-index: 2;
            }
            .user-avatar {
                width: 0.93rem;
                height: 0.93rem;
                border-radius: 50%;
                background-color: #b37cff;
                .user-avatar-img {
                    width: 0.93rem;
                    height: 0.93rem;
                    border-radius: 50%;
                    position: absolute;
                }
                .user-dress-img {
                    width: 0.93rem;
                    height: 0.93rem;
                    border-radius: 50%;
                    position: absolute;
                    z-index: 1;
                }
            }
        }
        .item-info {
            width: 4.05rem;
            padding-left: 0.22rem;
            .item-info-name {
                display: flex;
                align-items: center;
                width: 3.5rem;
                font-weight: 500;
                font-size: 0.24rem;
                color: #ffffff;
                img {
                    height: 0.22rem;
                    width: auto;
                    vertical-align: middle;
                    margin-left: 0.04rem;
                }
            }
            .item-info-score {
                font-weight: 500;
                font-size: 0.22rem;
                color: #ffffff;
                img {
                    height: 0.3rem;
                    width: auto;
                    vertical-align: middle;
                    position: relative;
                    margin-right: 0;
                    top: 0.02rem;
                }
            }
        }
        .item-next {
            width: 1rem;
            font-weight: 500;
            font-size: 0.2rem;
            color: #ffffff;
        }
    }
}
.lack {
    position: relative;
    width: 1rem;
    height: 3.2rem;
    margin: 1rem auto 0;
    background: url('https://yaame-static.yaame.io/admin/ef71d61f37f9a60d0051019f56311a71.png')
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
        color: #ffffff;
        white-space: nowrap;
    }
}
</style>
