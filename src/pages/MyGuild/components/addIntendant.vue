<!-- 添加管理员 -->
<template>
    <div class="addIntendant">
        <Header
            :keep="true"
            :title="t('add_admin')"
            style="position: fixed"
            :keepColor="false"
        />
        <!-- 搜索框 -->
        <div class="search-box">
            <VanSearch
                v-model="yaameId"
                left-icon=" "
                shape="round"
                background="transparent"
                :placeholder="t('enter_yaame_id')"
            />
            <div
                @click="search"
                class="search-btn"
            >
                {{ $t('seek') }}
            </div>
        </div>

        <!-- 列表内容 -->
        <div
            v-for="(item, index) in list"
            :key="index"
            class="list-info"
        >
            <div class="top">
                <div class="info">
                    <img
                        :src="item.avatar"
                        alt=""
                    />
                    <div class="txt">
                        <div class="name">{{ item.nick_name }}</div>
                        <div class="id">ID: {{ item.yaame_id }}</div>
                    </div>
                </div>
                <div
                    class="button"
                    @click="showOpen(item)"
                >
                    {{ $t('edit') }}
                </div>
            </div>
            <div
                v-if="item.authority"
                class="bottom"
            >
                <div
                    v-for="(ite, inx) in item.authority"
                    :key="inx"
                    class="permission"
                >
                    <div class="icon"></div>
                    {{ authority.find((item) => item.type === ite).name }}
                </div>
            </div>
        </div>

        <!-- 缺省图 -->
        <div
            v-if="list.length === 0"
            class="lack"
        >
            <img
                src="https://yaame-static.yaame.io/admin/a22559969bf26aaf7cb81beaa0f08f85.png"
                alt=""
            />
            {{ $t('streamer_not_found_in_guild') }}
        </div>

        <!-- 权限弹窗 -->
        <Jurisdiction
            :show="show"
            :info="info"
            @close="close"
        />
    </div>
</template>

<script setup>
import Header from '@/components/common/header.vue';
import { getCurrentInstance, onMounted, ref } from 'vue';
import { getGuildUser } from '@/pages/MyGuild/api';
import Jurisdiction from './jurisdictionWin.vue';
import { Toast } from 'vant';

// 获取实例
const root = getCurrentInstance();
// 获取翻译
const t = (val) => {
    return root.proxy.$i18n.t(val);
};

// 权限
const authority = ref([
    {
        name: t('add_streamer'),
        type: 'ADD_ANCHOR',
    },
    {
        name: t('delete_streamer'),
        type: 'DEL_ANCHOR',
    },
    {
        name: t('view_streamer_income'),
        type: 'QUERY_SETTLE',
    },
]);

// 权限弹窗
const show = ref(false);
// 权限弹窗信息
const info = ref({});

// 搜索内容
const yaameId = ref('');
// 列表内容
const list = ref([]);

// 搜索
const search = async () => {
    try {
        const res = await getGuildUser({ 
            yaame_id: yaameId.value,
            role: 'ANCHOR',
         });
        if (res.status !== 1000) return;
        list.value = res.data.content || [];
    } catch (error) {
        console.log(error);
    }
};

// 打开权限弹窗
const showOpen = (item) => {
    show.value = true;
    info.value = item;
};

// 关闭弹窗
const close = (value) => {
    show.value = false;
    info.value = {};
    if (value) {
        search();
    }
};

onMounted(() => {
    search();
});
</script>

<style lang="less" scoped>
.addIntendant {
    padding-top: 1.8rem;
    background: #f4f8fb;

    .search-box {
        position: relative;
        width: 6.9rem;
        margin: 0 auto 0.3rem;

        .search-btn {
            position: absolute;
            top: 50%;
            right: 0.1rem;
            transform: translateY(-50%);
            display: flex;
            justify-content: center;
            align-items: center;
            width: 1.47rem;
            height: 0.7rem;
            background: linear-gradient(90deg, #63df6d 0%, #4cc9a4 100%);
            font-weight: 600;
            font-size: 0.3rem;
            color: #fff;
            border-radius: 0.48rem;
        }
    }

    // 列表样式
    .list-info {
        display: flex;
        flex-direction: column;
        width: 6.9rem;
        margin: 0 auto 0.2rem;
        padding: 0.2rem 0 0.2rem 0.2rem;
        background: #ffffff;
        border-radius: 0.24rem;

        .top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex: 3;

            .info {
                display: flex;
                flex-direction: row;

                img {
                    width: 0.82rem;
                    height: 0.82rem;
                    border-radius: 50%;
                }

                .txt {
                    display: flex;
                    flex-direction: column;
                    margin-left: 0.2rem;

                    .name {
                        font-weight: 400;
                        font-size: 0.28rem;
                        color: #333333;
                    }

                    .id {
                        font-size: 0.2rem;
                        color: #999999;
                    }
                }
            }

            .button {
                display: flex;
                justify-content: center;
                align-items: center;
                min-width: 1.28rem;
                height: 0.62rem;
                margin-right: 0.3rem;
                background: linear-gradient(90deg, #63df6d 0%, #4cc9a4 100%);
                border-radius: 0.31rem;
                font-size: 0.24rem;
                color: #ffffff;
            }
        }
        .bottom {
            display: flex;
            flex-wrap: wrap;
            margin-top: 0.1rem;
            flex: 1;

            .permission {
                display: flex;
                align-items: center;
                min-height: 0.4rem;
                padding: 0 0.12rem;
                margin-right: 0.14rem;
                margin-top: 0.1rem;
                border-radius: 0.25rem;
                border: 0.01rem solid #f1f1f1;
                font-weight: 400;
                font-size: 0.2rem;
                color: #999999;

                .icon {
                    width: 0.2rem;
                    height: 0.2rem;
                    margin-right: 0.04rem;
                    background-image: url(https://yaame-static.yaame.io/admin/e0e8856f3eb2715c580c818afbdd94f2.png);
                    background-repeat: no-repeat;
                    background-size: contain;
                }
            }
        }

        .bottom {
            flex: 1;
        }
    }

    .lack {
        display: flex;
        align-items: center;
        flex-direction: column;
        margin-top: 4.77rem;
        font-weight: 400;
        font-size: 0.24rem;
        color: #333333;
        img {
            width: 1.8rem;
            height: 1.8rem;
        }
    }

    // 设置搜索框宽度
    :deep(.van-search) {
        position: relative;
        padding: 0;
        width: 6.9rem;
        margin: 0 auto 0.3rem;
    }

    // 设置搜索框内部颜色和高度
    :deep(.van-search__content) {
        height: 0.9rem;
        background-color: #fff;
    }

    // 调整内边距
    :deep(.van-search__content) {
        padding: 0 0 0 0.3rem;
    }

    // 调整搜索框内容高度剧中
    :deep(.van-field__value) {
        display: flex;
        align-items: center;
    }

    // 调整搜索框内容高度
    :deep(.van-field__body) {
        width: 75%;
        height: 80%;
    }
}
</style>
