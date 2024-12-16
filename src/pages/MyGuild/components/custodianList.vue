<!-- 管理员 -->
<template>
    <div class="custodian">
        <!-- 管理员列表 -->
        <VanList
            v-if="list.length"
            v-model="loading"
            :finished="finished"
            finished-text=" "
            @load="onLoad"
            loading-text=" "
        >
            <div
                v-for="(item, index) in list"
                :key="index"
                class="list-info"
            >
                <!-- 头部信息 -->
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
                        @click="editCustodian(item)"
                    >
                        {{ $t('edit') }}
                    </div>
                </div>
                <!-- 权限信息展示 -->
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
        </VanList>
        <!-- 缺省样式 -->
        <div
            v-else
            class="lack"
        >
            <img
                src="https://yaame-static.yaame.io/admin/a22559969bf26aaf7cb81beaa0f08f85.png"
                alt=""
            />
            {{ $t('no_admin_in_guild') }}
        </div>
        <!-- 添加 -->
        <div
            class="add-button"
            @click="addCustodian"
        >
            {{ $t('add_admin') }}
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
import { getCurrentInstance, onMounted, ref } from 'vue';
import { Toast } from 'vant';
import { getGuildUser } from '@/pages/MyGuild/api';
import Jurisdiction from './jurisdictionWin.vue';

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

// 控制页面下滑加载状态
const loading = ref(false);
// 控制下滑是否请求
const finished = ref(false);
// 数据存放
const list = ref([]);
// 请求参数
const params = ref({
    page: 1,
    size: 10,
    yaame_id: '',
});

// 下滑数据请求
const onLoad = async () => {
    try {
        const res = await getGuildUser(params.value);
        if (res.status === 1000) {
            // 判断当前是否是第一页数据
            if (params.value.page === 1) {
                list.value = res.data.content;
            } else if (res.data.content) {
                // 第二页拼接数据
                list.value = list.value.concat(res.data.content);
            }
            // 判断是否有下一页数据
            finished.value = !res.data.has_next;
            loading.value = !res.data.has_next;
            // 有数据请求下一页
            if (res.data.has_next) params.value.page += 1;
            // 处理当前有权限用户
            setJurisdiction();
        } else {
            Toast(res.desc);
            list.value = [];
        }
    } catch (error) {
        console.log(error);
    }
};
// 判断是否有权限
const setJurisdiction = () => {
    list.value = list.value.filter((item, index) => {
        if (item.authority) return item;
    });
};
// 跳转添加管理员
const addCustodian = () => {
    root.proxy.$router.push({
        path: '/addIntendant',
    });
};

// 权限弹窗
const show = ref(false);
// 权限弹窗信息
const info = ref({});
// 编辑管理员
const editCustodian = (item) => {
    show.value = true;
    info.value = item;
};
// 关闭权限弹窗
const close = (value) => {
    show.value = false;
    info.value = {};
    if (value) {
        params.value.page = 1;
        onLoad();
    }
};

onMounted(() => {
    onLoad();
});
</script>

<style lang="less" scoped>
.custodian {
    margin-top: 0.3rem;
    padding-bottom: 1.6rem;
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

    .add-button {
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        bottom: 0.6rem;
        left: 50%;
        transform: translateX(-50%);
        width: 5.8rem;
        height: 1rem;
        background: linear-gradient(90deg, #63df6d 0%, #4cc9a4 100%);
        border-radius: 0.5rem;
        font-weight: 600;
        font-size: 0.32rem;
        color: #ffffff;
    }
}
</style>
