<!-- 成员排名弹窗 -->
<template>
    <Popup
        class="popup"
        v-show="show"
        :visible="show"
    >
        <!-- 用户排名 -->
        <div class="user-rank">
            <div class="head">
                <div class="title">{{ $t('honor_contribution_board') }}</div>
            </div>
            <!-- 排名 -->
            <div class="item-scroll">
                <div
                    class="back"
                    v-for="(item, index) in userList"
                    :key="item.peanut_id"
                >
                    <div class="rank-back">{{ index + 1 }}</div>
                    <div
                        class="head-back"
                        @click="toDetails(item)"
                    >
                        <img
                            :src="item.avatar"
                            alt=""
                        />
                        <!--状态-->
                        <div
                            v-if="item.user_status === 1 || item.user_status === 2"
                            class="online"
                            :class="{ living: item.user_status === 2 }"
                        >
                            {{ getOnline(item.user_status) }}
                        </div>
                    </div>
                    <div class="name-back">
                        <div class="name no-wrap">
                            <span class="name-one no-wrap">{{ item.nick_name }}</span>
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
                        v-show="props.queryData.uid !== item.uid"
                        class="number-back"
                        :class="{ 'number-one': item.relation.attention }"
                        @click="attentions(item)"
                    ></div>
                </div>
            </div>
            <!-- 底部 -->
            <div class="bottom"></div>
        </div>
        <!-- 关闭 -->
        <div
            class="close"
            @click="close"
        >
            <img
                src="https://yaame-static.yaame.io/admin/ab04ae118d3d5f97d9a70d725f2b5f8f.png"
                alt=""
            />
        </div>
    </Popup>
</template>

<script setup>
import Popup from '@/components/common/pop_up.vue';
import { ref, defineProps, defineExpose, watch, defineEmits, getCurrentInstance } from 'vue';
import { getUserRankApi, postAttentionsApi } from '../api';
import { Toast } from 'vant';

// 获取实例
const root = getCurrentInstance();
// 国际化
const t = (value) => {
    return root.proxy.$t(value);
};

const emit = defineEmits(['showOpen']);

// 接收父组件信息
const props = defineProps({
    queryData: {
        type: Object,
        default: () => ({}),
    },
});

// 用户数据
const userList = ref([]);

// 获取用户排名
const getUserRank = async () => {
    try {
        const res = await getUserRankApi({
            id: props.queryData.id,
            index: props.queryData.index,
            family_id: props.queryData.family_id,
        });
        userList.value = res.data;
    } catch (error) {
        console.log(error);
    }
};

// 关闭弹窗清空数据
const close = () => {
    userList.value = [];
    // 通知父组件关闭
    emit('showOpen');
};

// 监听弹窗显示
const show = ref(false);

watch(
    () => props.queryData.show,
    (value) => {
        show.value = value;
    },
);

// 获取在线状态
const getOnline = (status) => {
    return status === 2 ? t('start_broadcast') : status === 1 ? t('online') : '';
};

// 关注
const attentions = async (value) => {
    try {
        if (value.mystery) {
            // 神秘人
            Toast(t('mystery_user'));
            return;
        }
        if (value.relation.attention) {
            // 已关注跳转私聊页面
            window.location.href = value.scheme_url;
            return;
        }

        const res = await postAttentionsApi({
            target_uid: value.uid,
        });
        if (res.status !== 1000) {
            Toast(res.desc);
            return;
        }
        Toast(t('followed'));
        // 刷新当前信息
        await getUserRank();
    } catch (err) {
        console.log(err);
    }
};
// 跳转
const toDetails = (url) => {
    if (url.mystery === 1) {
        Toast(t('mystery_user'));
        return;
    }
    window.location.href = url.scheme_user_url;
};

defineExpose({
    getUserRank,
});
</script>

<style lang="less" scoped>
.user-rank {
    position: relative;
    width: 6.78rem;
    height: 9.42rem;
    margin: 2.9rem auto 0;
    background: linear-gradient(180deg, #ec8734 0%, #df8848 100%);
    border: 0.04rem solid #fed267;
    .head {
        position: absolute;
        top: -0.37rem;
        left: 50%;
        transform: translateX(-50%);
        width: 6.8rem;
        height: 0.74rem;
        background-image: url(https://yaame-static.yaame.io/admin/e71724cf5dcb9ebec9ecf9e6102609e4.png);
        background-repeat: no-repeat;
        background-size: contain;
        z-index: 2;
        .title {
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: -0.43rem;
            left: 50%;
            transform: translateX(-50%);
            width: 3.8rem;
            height: 1.17rem;
            line-height: 0.24rem;
            padding: 0.3rem 0.6rem 0;
            background-image: url(https://yaame-static.yaame.io/admin/56efb2d356fd25506d462cdf03712463.png);
            background-repeat: no-repeat;
            background-size: contain;
            font-weight: 600;
            font-size: 0.28rem;
            color: #fff3df;
            text-align: center;
        }
    }

    .item-scroll {
        width: 100%;
        height: 100%;
        padding: 0.65rem 0 0.55rem;
        overflow: auto;
        .back {
            position: relative;
            display: flex;
            align-items: center;
            width: 6.5rem;
            height: 1.5rem;
            margin: 0 auto 0.18rem;
            background-image: url(https://yaame-static.yaame.io/admin/92099d212f7ad860ba44bc25c1cc58eb.png);
            background-repeat: no-repeat;
            background-size: contain;
            font-size: 0.24rem;
            color: #aa4201;
            .rank-back {
                width: 0.1rem;
                text-align: center;
                margin: 0 0.42rem;
            }

            .head-back {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 0.98rem;
                height: 0.98rem;
                margin-right: 0.18rem;
                background-image: url(https://yaame-static.yaame.io/admin/c3389ed1785a86c98b8d15ffe3a01e49.png);
                background-repeat: no-repeat;
                background-size: contain;

                img {
                    width: 0.84rem;
                    height: 0.84rem;
                    border-radius: 50%;
                }

                .online,
                .living {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: absolute;
                    top: 0.78rem;
                    min-width: 0.67rem;
                    height: 0.24rem;
                    padding: 0 0.08rem;
                    background: #27a3d5;
                    border-radius: 0.08rem;
                    font-weight: 400;
                    font-size: 0.18rem;
                    color: #ffffff;
                }

                .online {
                    background: #ff7831;
                }
            }

            .name-back {
                display: flex;
                flex-direction: column;
                .name {
                    width: 2.2rem;
                    height: 0.33rem;
                    line-height: 0.33rem;
                }
                .id {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    height: 0.3rem;
                    font-size: 0.22rem;
                    img {
                        width: 0.28rem;
                        height: 0.3rem;
                        margin-right: 0.04rem;
                    }
                }
            }

            .number-back {
                position: absolute;
                right: 0.53rem;
                width: 0.42rem;
                height: 0.42rem;
                background-image: url(https://yaame-static.yaame.io/admin/2cf15f4001a3b84d30646dbe340c0ebb.png);
                background-repeat: no-repeat;
                background-size: contain;
            }
            .number-one {
                width: 0.42rem;
                height: 0.36rem;
                background-image: url(https://yaame-static.yaame.io/admin/4f884e630709ca7dcb4fade38bb45b97.png);
            }
        }
    }

    .bottom {
        position: absolute;
        bottom: -0.36rem;
        left: 50%;
        transform: translateX(-50%);
        width: 6.8rem;
        height: 0.74rem;
        background-image: url(https://yaame-static.yaame.io/admin/7b2f3fabfb43267377ce784e80348b11.png);
        background-repeat: no-repeat;
        background-size: contain;
    }
}
.close {
    width: 0.6rem;
    height: 0.6rem;
    margin: 0.64rem auto 0;
    img {
        width: 100%;
        height: 100%;
    }
}
</style>
