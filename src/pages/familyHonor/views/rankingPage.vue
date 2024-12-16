<!-- mvp榜 -->
<template>
    <div
        class="ranking"
        :style="{ backgroundImage: `url(${logo[language]})` }"
    >
        <!-- 返回头 -->
        <CustomHeader color="white">
            {{ $t('best_mvp_board') }}
        </CustomHeader>
        <div class="ranking-container">
            <!-- 头部标题 -->
            <div class="header">
                <div class="title-txt">{{ $t('best_mvp_board') }}</div>
            </div>

            <!--前三-->
            <div class="frame">
                <div
                    class="front"
                    v-for="(item, index) in 3"
                    :key="item"
                >
                    <div
                        class="head"
                        @click="toDetails(rankingThree[index])"
                        :style="getHeadStyle(rankingThree[index])"
                    >
                        <img
                            :src="getSrc(index)"
                            alt=""
                        />
                    </div>

                    <!-- 名次 -->
                    <div class="rank">TOP{{ index + 1 }}</div>

                    <!-- 名字 -->
                    <div
                        class="name no-wrap"
                        v-if="rankingThree[index]"
                    >
                        <span class="no-wrap">{{ rankingThree[index].nick_name }}</span>
                        <img
                            v-if="rankingThree[index].wealth_level"
                            :src="rankingThree[index].wealth_level"
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
                    <div
                        v-if="rankingThree[index] && userList.uid !== item.uid"
                        class="attention"
                        :class="{ chat: rankingThree[index].relation.attention }"
                        @click="attentions(rankingThree[index])"
                    ></div>
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
                <!-- 每一项 -->
                <div class="item-scroll">
                    <div
                        class="back"
                        v-for="(item, index) in rankingLast"
                        :key="index"
                    >
                        <div class="rank-back">{{ index + 4 }}</div>
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
                                <img
                                    :src="item.wealth_level"
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
                            v-show="userList.uid !== item.uid"
                            class="number-back"
                            :class="{ 'number-one': item.relation.attention }"
                            @click="attentions(item)"
                        ></div>
                    </div>
                </div>
            </VanList>
        </div>
        <!-- 用户排行 -->
        <div
            v-if="Object.keys(userList).length"
            class="user-rank"
        >
            <div class="rank-back">
                {{ userList.rank && 100 > userList.rank ? userList.rank : '99+' }}
            </div>
            <div
                class="head-back"
                @click="toDetails(item)"
            >
                <img
                    :src="userList.avatar"
                    alt=""
                />
            </div>
            <div class="name-back">
                <div class="name">
                    <span class="no-wrap">{{ userList.nick_name }}</span>
                    <img
                        v-if="userList.wealth_level"
                        :src="userList.wealth_level"
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
            <div v-if="userList.rank && 100 > userList.rank" class="contribute">
                <div class="contribute-title">{{ $t('distance_to_next') }}</div>
                <div class="contribute-value">{{ userList.last }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, getCurrentInstance, onActivated, onMounted, reactive, ref } from 'vue';
import { getLanguage } from '@/lib/device';
import { getMvpRankApi, postAttentionsApi } from '../api';
import { Toast } from 'vant';
import CustomHeader from '@/components/common/header.vue';

// 获取实例
const root = getCurrentInstance();
// 国际化
const t = (value) => {
    return root.proxy.$t(value);
};

const language = computed(() => {
    let locale = getLanguage() || 'en';
    if (['zh-hk', 'zh-tw', 'zh-mo', 'zh-cn', 'zh_cn'].indexOf(locale) > -1) {
        const localEnum = {
            'zh-hk': 'zh-tw',
            'zh-tw': 'zh-tw',
            'zh-mo': 'zh-tw',
            'zh-cn': 'zh-cn',
        };

        locale = localEnum[locale];
    }
    return locale;
});
const logo = reactive({
    ar: 'https://yaame-static.yaame.io/admin/ed137bd9712e902db1eac196b9b9e116.png',
    en: 'https://yaame-static.yaame.io/admin/338384cb90c3a836c25bb35afd293734.png',
    id: 'https://yaame-static.yaame.io/admin/f24d74eced37cc3529f0f88aa4583a12.png',
    'zh-cn': 'https://yaame-static.yaame.io/admin/72ed1b78a4295715eda6eab07e8e0946.png',
    'zh-tw': 'https://yaame-static.yaame.io/admin/72ed1b78a4295715eda6eab07e8e0946.png',
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

// 头像框
const headSrc = ref([
    'https://yaame-static.yaame.io/admin/6482c678ec7d7a66655b6ab6f5ecf52d.png',
    'https://yaame-static.yaame.io/admin/47453daee4dba244e2cfb7682f27c19a.png',
    'https://yaame-static.yaame.io/admin/86c489874eda38e387368221c0f33cde.png',
]);
// 获取当前头像框
const getSrc = (index) => {
    return headSrc.value[index];
};
// 获取头像样式
const getHeadStyle = (item) => {
    return {
        backgroundImage:
            item && item.avatar
                ? `url(${item.avatar})`
                : 'url(https://yaame-static.yaame.io/admin/9cf28c04a72e07566476ac29bf3c6b8f.png)',
    };
};

// 分页
const page = ref(1);
const size = ref(10);

// 获取当前页面数据
const getFamilyRanking = async () => {
    try {
        const { id, index } = root.proxy.$route.query;
        const res = await getMvpRankApi({
            id,
            index,
            page: page.value,
            size: size.value,
        });
        if (res.status !== 1000) return;
        loading.value = !res.data.has_next;
        finished.value = !res.data.has_next;
        // 判断是否是第一页数据
        if (page.value === 1) {
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
            if (res.data.has_next) page.value++;
        } else {
            page.value++;
            rankingLast.value.push(...res.data.content);
            // 判断当前数据超过99条不进行请求并删除到99条
            if (rankingLast.value.length > 99) {
                rankingLast.value = rankingLast.value.slice(0, 96);
                finished.value = true;
            }
        }
    } catch (error) {
        console.log(error);
    }
};

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
        page.value = 1;
        // 刷新当前信息
        await getFamilyRanking();
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

onActivated(() => {
    page.value = 1;
    getFamilyRanking();
});
</script>

<style lang="less" scoped>
.ranking {
    min-height: 100vh;
    padding-top: 6.44rem;
    background-repeat: no-repeat;
    background-size: contain;
    .ranking-container {
        width: 7.18rem;
        min-height: 15.07rem;
        margin: 0 auto;
        position: relative;
        padding-top: 5.19rem;
        background: #e1902b;
        border: 0.08rem solid #ffde56;
        background-image: url(https://yaame-static.yaame.io/admin/cd6268723ef258da227ccec10e6f6169.png);
        background-repeat: no-repeat;
        background-size: contain;

        .header {
            position: absolute;
            top: -0.67rem;
            left: 50%;
            transform: translateX(-50%);
            width: 7.18rem;
            height: 1.17rem;
            background-image: url(https://yaame-static.yaame.io/admin/f98f9a196d2ba2828e5e831db0634048.png);
            background-repeat: no-repeat;
            background-size: contain;
            .title-txt {
                display: flex;
                justify-content: center;
                align-items: center;
                position: absolute;
                top: 0.47rem;
                left: 50%;
                transform: translateX(-50%);
                width: 1.8rem;
                height: 0.52rem;
                line-height: 0.26rem;
                font-weight: 600;
                font-size: 0.26rem;
                color: #fff3df;
                text-align: center;
            }
        }

        // 前三样式
        .frame {
            .front {
                position: absolute;
                top: 1.41rem;
                left: 0.06rem;
                width: 2.32rem;
                height: 3.54rem;
                overflow: hidden;
                background-repeat: no-repeat;
                background-size: contain;

                .head {
                    position: relative;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 1.12rem;
                    height: 1.12rem;
                    margin: 0.42rem auto 0;
                    background-repeat: no-repeat;
                    background-size: contain;
                    border-radius: 50%;

                    img {
                        position: absolute;
                        top: -0.42rem;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 1.97rem;
                        height: 1.97rem;
                    }
                }

                .rank {
                    height: 0.23rem;
                    margin: 0.29rem auto 0;
                    font-size: 0.23rem;
                    text-align: center;
                }

                .name {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 1.79rem;
                    height: 0.2rem;
                    margin: 0.07rem auto 0.1rem;
                    font-size: 0.2rem;
                    line-height: 0.2rem;
                    img {
                        width: 0.55rem;
                        height: 0.23rem;
                        margin-left: 0.04rem;
                    }
                }

                .number {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 0.22rem;
                    margin: 0.04rem auto 0.16rem;
                    font-size: 0.2rem;
                    img {
                        width: 0.26rem;
                        height: 0.28rem;
                        margin-right: 0.04rem;
                    }
                }

                .attention,
                .chat {
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 0.42rem;
                    height: 0.42rem;
                    background-image: url(https://yaame-static.yaame.io/admin/2cf15f4001a3b84d30646dbe340c0ebb.png);
                    background-repeat: no-repeat;
                    background-size: contain;
                }
                .chat {
                    height: 0.36rem;
                    background-image: url(https://yaame-static.yaame.io/admin/4f884e630709ca7dcb4fade38bb45b97.png);
                }
            }
            .front:nth-child(1) {
                top: 0.96rem;
                left: 50%;
                transform: translateX(-50%);
                width: 2.28rem;
                height: 3.6rem;
                color: #a34302;
                background-image: url(https://yaame-static.yaame.io/admin/dc5c46d2c24498b6abb3547a9ad0183f.png);
                .rank {
                    height: 0.26rem;
                    margin-top: 0.29rem;
                    line-height: 0.26rem;
                    font-size: 0.26rem;
                }

                .name {
                    height: 0.22rem;
                    line-height: 0.22rem;
                    font-size: 0.22rem;
                }

                .number {
                    margin-top: 0.09rem;
                    font-size: 0.22rem;
                }
            }
            .front:nth-child(2) {
                color: #2e51b0;
                background-image: url(https://yaame-static.yaame.io/admin/be618391bf84d0942dac82e1ad759c7a.png);
                .name {
                    font-size: 0.2rem;
                }
            }
            .front:nth-child(3) {
                left: 4.65rem;
                color: #a34302;
                background-image: url(https://yaame-static.yaame.io/admin/f02001437750f711db14d1289619031e.png);
                .name {
                    font-size: 0.2rem;
                }
            }
        }

        // 剩余排名
        .item-scroll {
            width: 100%;
            height: 100%;
            padding: 0.65rem 0 1.55rem;
            overflow: auto;
            .back {
                position: relative;
                display: flex;
                align-items: center;
                width: 6.64rem;
                height: 1.58rem;
                margin: 0 auto 0.18rem;
                padding-bottom: 0.1rem;
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
                        display: flex;
                        align-items: center;
                        width: 2.2rem;
                        height: 0.34rem;
                        line-height: 0.34rem;
                        img {
                            width: 0.55rem;
                            height: 0.23rem;
                            margin-left: 0.04rem;
                        }
                    }
                    .id {
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        height: 0.32rem;
                        font-size: 0.22rem;
                        img {
                            width: 0.28rem;
                            height: 0.3rem;
                            margin-right: 0.1rem;
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
    }

    .user-rank {
        position: relative;
        display: flex;
        align-items: center;
        position: fixed;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 7.5rem;
        height: 1.58rem;
        padding-top: 0.1rem;
        background-image: url('https://yaame-static.yaame.io/admin/defe6008f40146fa74cefb8aa7ef0f99.png');
        background-repeat: no-repeat;
        background-size: contain;
        color: #aa4201;

        .rank-back {
            width: 0.45rem;
            height: 0.34rem;
            margin: 0 0.2rem 0 0.46rem;
            font-weight: 500;
            font-size: 0.24rem;
            text-align: center;
        }

        .head-back {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 1.01rem;
            height: 1.01rem;
            margin-right: 0.18rem;
            background-image: url(https://yaame-static.yaame.io/admin/c3389ed1785a86c98b8d15ffe3a01e49.png);
            background-repeat: no-repeat;
            background-size: contain;
            img {
                width: 0.86rem;
                height: 0.86rem;
                border-radius: 50%;
            }
        }

        .name-back {
            display: flex;
            flex-direction: column;

            .name {
                display: flex;
                align-items: center;
                width: 2.3rem;
                font-weight: 500;
                font-size: 0.24rem;
                img {
                    width: 0.55rem;
                    height: 0.23rem;
                    margin-left: 0.04rem;
                }
            }

            .id {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                height: 0.32rem;
                font-size: 0.22rem;
                img {
                    width: 0.27rem;
                    height: 0.28rem;
                    margin-right: 0.1rem;
                }
            }
        }

        .contribute {
            position: absolute;
            right: 0.53rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            font-weight: 500;
            font-size: 0.22rem;
            color: #aa4201;
            .contribute-title {
                width: 1.54rem;
                text-align: center;
            }
        }
    }
}
</style>
