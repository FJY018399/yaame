<!-- 操作记录 -->
<template>
    <div class="operation">
        <!-- 搜索框 -->
        <div class="search-box">
            <!-- 身份 -->
            <div
                class="identity"
                @click="cutIdentity"
            >
                {{ identity }}
                <i
                    class="iconfont icon-xiajiantou"
                    :class="{ 'yes-icon': showIdentity }"
                ></i>
                <!-- 身份选择弹窗 -->
                <div
                    class="identity-popup"
                    v-show="showIdentity"
                >
                    <div
                        class="identity-item"
                        v-for="item in identityList"
                        :key="item.value"
                        @click.stop="selectIdentity(item.name, item.value)"
                    >
                        {{ item.name }}
                    </div>
                </div>
            </div>
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

        <!-- 筛选添加主播删除主播 -->
        <div class="screen-box">
            <div
                class="screen-item"
                v-for="(item, index) in screenItem"
                :key="index"
                @click="cutStatus(index)"
            >
                {{ item.name }}
                <div :class="item.status ? 'icon' : 'icon-no'"></div>
            </div>
        </div>

        <!-- 列表 -->
        <VanList
            v-if="showList.length"
            v-model="loading"
            :finished="finished"
            finished-text=" "
            @load="getList"
            loading-text=" "
            class="list"
        >
            <!-- 标题 -->
            <div class="head-txt">
                <div class="head-txt-item">{{ $t('admin') }}</div>
                <div class="head-txt-item">{{ $t('operation') }}</div>
                <div class="head-txt-item">{{ $t('streamer') }}</div>
            </div>
            <div
                v-for="(item, index) in showList"
                :key="index"
                class="list-info"
            >
                <div :class="['lift-style', item.operate_type ? '' : 'no']"></div>
                <!-- 上部分 -->
                <div class="top">
                    <!-- 管理员信息 -->
                    <div class="top-avatar">
                        <div class="avatar">
                            <img
                                :src="item.operator_avatar"
                                alt=""
                            />
                        </div>
                        <div class="txt">
                            <div class="name no-wrap">{{ item.operator_name }}</div>
                            <div class="id">ID: {{ +item.operator_yaame_id }}</div>
                        </div>
                    </div>
                    <!-- 展示操作状态 -->
                    <div :class="['top-item', item.operate_type ? '' : 'no-item']">{{ item.operate_type ? t('add') : t('delete') }}</div>
                    <!-- 被操作人 -->
                    <div class="top-avatar">
                        <div class="avatar">
                            <img
                                :src="item.target_avatar"
                                alt=""
                            />
                        </div>
                        <div class="txt">
                            <div class="name no-wrap">{{ item.target_name }}</div>
                            <div class="id">ID: {{ item.target_yaame_id }}</div>
                        </div>
                    </div>
                </div>
                <!-- 下部分时间 -->
                <div class="bottom">{{ item.operate_type ? t('added_time') : t('deleted_time') }} {{ formatDate(item.create_time, 'yyyy.MM.dd hh:mm:ss') }}</div>
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
            {{ $t('no_operation_log') }}
        </div>
    </div>
</template>

<script setup>
import { getCurrentInstance, ref, watch } from 'vue';
import { getManagerList } from '../api';
import { Toast } from 'vant';
import { formatDate } from '../../../lib/utils';

// 获取当前实例
const root = getCurrentInstance();
const t = (val) => {
    return root.proxy.$i18n.t(val);
};

// 搜索内容
const yaameId = ref('');

// 身份选择弹窗
const showIdentity = ref(false);

// 身份
const identity = ref(t('admin'));
// 身份列表
const identityList = ref([
    {
        name: t('streamer'),
        value: 0,
    },
    {
        name: t('admin'),
        value: 1,
    },
]);
// 选中类型
const selectType = ref(1);
// 身份选择
const selectIdentity = (item, type) => {
    identity.value = item;
    showIdentity.value = false;
    // 选中类型
    selectType.value = type;
};

// 弹窗控制
const cutIdentity = () => {
    showIdentity.value = !showIdentity.value;
};

// 搜索
const search = async () => {
    query.value.page = 1;
    getList();
};

// 筛选列表状态
const screenItem = ref([
    {
        name: t('add_streamer'),
        status: 1,
        type: 1,
    },
    {
        name: t('delete_streamer'),
        status: 1,
        type: 0,
    },
]);
// 筛选状态
const cutStatus = (index) => {
    screenItem.value[index].status = !screenItem.value[index].status;
    query.value.page = 1;
    getList();
    // showData();
};

// 展示对应数据
const showData = () => {
    // 判断当前选中
    const status = screenItem.value.filter((item) => item.status);
    // 选中两个
    if (status.length === 2) {
        showList.value = list.value;
    } else if (status.length === 1) {
        showList.value = list.value.filter((item) => item.operate_type === status[0].type);
    } else showList.value = [];
};

// 列表加载
const loading = ref(false);
// 列表是否结束
const finished = ref(false);
// 请求参数
const query = ref({
    page: 1,
    size: 10,
    guild_id: Number(root.proxy.$route.query.guild_id),
});
// 列表
const list = ref([]);
// 展示列表
const showList = ref([]);
// 列表请求
const getList = async () => {
    try {
        let params = { ...query.value };
        // 判断当前查询类型
        const type = screenItem.value.filter((item) => item.status).map((item) => item.type);
        // 判断当前选中类型
        if (type.length === 1) params.operate_type = type[0];
        else delete params.operate_type;
        // 删除查询id跟随当前选择插入数据
        delete params.operator;
        delete params.target;
        // 判断当前是否选择身份输入查询
        if (yaameId.value.length) {
            if (selectType.value) params.operator = yaameId.value;
            else params.target = yaameId.value;
        }
        const res = await getManagerList(params);
        if (res.status === 1000) {
            // 判断当前是否是第一页数据
            if (query.value.page === 1) {
                list.value = res.data.content || [];
            } else if (res.data.content) {
                // 第二页拼接数据
                list.value = list.value.concat(res.data.content);
            }
            // 判断是否有下一页数据
            finished.value = !res.data.has_next;
            loading.value = !res.data.has_next;
            // 有数据请求下一页
            if (res.data.has_next) query.value.page += 1;
            showData();
        } else {
            Toast(res.desc);
            list.value = [];
        }
    } catch (error) {
        console.log(error);
    }
};

// 监听tabType
const props = defineProps({
    tabType: {
        type: Number,
        default: 0,
    },
});

// 防止多次添加数据
watch(
    () => props.tabType,
    (newVal) => {
        if (newVal === 2 && !list.value.length) getList();
    },
);
</script>

<style lang="less" scoped>
.operation {
    height: 100%;
    padding-top: 0.4rem;
    padding: 0 0.3rem;

    .search-box {
        position: relative;
        width: 6.9rem;
        margin: 0.4rem auto 0.3rem;

        .identity {
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 1.48rem;
            height: 0.49rem;
            padding-left: 0.1rem;
            border-right: 0.01rem solid #999;
            font-weight: 600;
            font-size: 0.24rem;
            color: #333333;
            z-index: 1;
            i {
                margin-left: 0.02rem;
                font-size: 0.24rem;
                transition: all 0.3s ease;
                transform-origin: center;
            }

            .yes-icon {
                transform: rotate(180deg);
            }

            .identity-popup {
                display: flex;
                flex-direction: column;
                position: absolute;
                top: 0.82rem;
                left: 0;
                width: 1.32rem;
                height: 1.44rem;
                padding: 0 0.2rem;
                background: #000000;
                border-radius: 0.18rem;
                opacity: 0.8;
                div {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 400;
                    font-size: 0.24rem;
                    color: #ffffff;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                    flex: 1;
                }
                div:last-type {
                    border-bottom: none;
                }
            }
        }

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

    .screen-box {
        display: flex;
        .screen-item {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 0.6rem;
            margin-right: 0.2rem;
            padding: 0 0.2rem;
            border-radius: 0.35rem;
            border: 0.01rem solid #979797;
            font-weight: 400;
            font-size: 0.24rem;
            color: #666666;

            .icon,
            .icon-no {
                width: 0.26rem;
                height: 0.26rem;
                margin-left: 0.1rem;
                background-image: url('https://yaame-static.yaame.io/admin/e0e8856f3eb2715c580c818afbdd94f2.png');
                background-size: contain;
                background-repeat: no-repeat;
            }
            .icon-no {
                background-image: url('https://yaame-static.yaame.io/admin/1e3cf13de810b6683dc71c9c0aec6703.png');
            }
        }
    }

    .list {
        margin-top: 0.4rem;
        .head-txt {
            display: flex;
            margin: 0 0.2rem 0.2rem;
            justify-content: space-between;
            font-weight: 600;
            font-size: 0.24rem;
            color: #333333;
        }

        .list-info {
            width: 6.9rem;
            height: 1.62rem;
            margin-bottom: 0.2rem;
            padding-right: 0.15rem;
            background: #ffffff;
            border-radius: 0.24rem;
            overflow: hidden;
            .lift-style {
                float: left;
                width: 0.08rem;
                height: 1.62rem;
                margin-right: 0.28rem;
                background: #2ac887;
            }

            .no {
                background: #ed5a5a;
            }

            .top {
                display: flex;
                justify-content: space-between;
                margin-top: 0.2rem;
                // 上部分头像名称等样式
                .top-avatar {
                    display: flex;
                    width: 2.5rem;
                    .avatar {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 0.82rem;
                        height: 0.82rem;
                        img {
                            width: 100%;
                            height: 100%;
                            border-radius: 50%;
                        }
                    }
                    .txt {
                        margin-left: 0.2rem;
                        .name {
                            width: 1.4rem;
                            margin-bottom: 0.14rem;
                            font-weight: 400;
                            font-size: 0.24rem;
                            color: #333333;
                        }
                        .id {
                            width: 1.4rem;
                            font-weight: 400;
                            font-size: 0.2rem;
                            color: #999;
                            white-space: nowrap;
                        }
                    }
                }
                // 上部分操作样式
                .top-item {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 400;
                    font-size: 0.24rem;
                    color: #2ac887;
                }

                .no-item {
                    color: #ed5a5a;
                }
            }

            .bottom {
                margin-top: 0.2rem;
                font-weight: 400;
                font-size: 0.2rem;
                color: #999999;
            }
        }
    }

    .lack {
        display: flex;
        align-items: center;
        flex-direction: column;
        margin-top: 2.57rem;
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
        padding: 0 0 0 1.68rem;
    }

    // 调整搜索框内容高度剧中
    :deep(.van-field__value) {
        display: flex;
        align-items: center;
    }

    // 调整搜索框内容高度
    :deep(.van-field__body) {
        width: 65%;
        height: 80%;
    }
}
</style>
