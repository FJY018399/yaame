<!-- 权限弹窗 -->
<template>
    <div class="jurisdiction">
        <!-- 弹窗 -->
        <VanActionSheet
            v-model="show"
            :safe-area-inset-bottom="false"
            @close="close(0)"
        >
            <!-- 背景 -->
            <div class="bg"></div>
            <div class="content">
                <div class="head">{{ $t('set_permissions') }}</div>
                <!-- 用户信息 -->
                <div class="info">
                    <div class="avatar">
                        <img
                            :src="props.info.avatar"
                            alt=""
                        />
                    </div>
                    <div class="txt">
                        <div class="name">{{ props.info.nick_name }}</div>
                        <div class="id">ID: {{ props.info.yaame_id }}</div>
                    </div>
                </div>
                <!-- 权限选择 -->
                <div class="authority">
                    <div
                        class="item"
                        v-for="(item, index) in authorityList"
                        :key="index"
                        @click="changeAuthority(item)"
                    >
                        <div class="txt">{{ item.name }}</div>
                        <div
                            class="icon"
                            :class="{ active: item.icon === 1 }"
                        ></div>
                    </div>
                </div>
                <!-- 弹窗按钮 -->
                <div class="btn">
                    <div
                        class="no-btn"
                        @click="close(0)"
                    >
                        {{ $t('cancel') }}
                    </div>
                    <div
                        class="yes-btn"
                        @click="saveAuthority"
                    >
                        {{ $t('save') }}
                    </div>
                </div>
            </div>
        </VanActionSheet>
    </div>
</template>

<script setup>
import { Toast } from 'vant';
import { setAuthority } from '../api';
import { ref, watch, defineEmits, defineProps, getCurrentInstance } from 'vue';

// 获取实例
const root = getCurrentInstance();
// 获取翻译
const t = (val) => {
    return root.proxy.$i18n.t(val);
};

const emit = defineEmits();

// 接收父组件传值
const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },
    info: {
        type: Object,
        default: () => {},
    },
});

// 防止eslint报错意外修改props
const show = ref(props.show);
watch(
    () => props.show,
    (newVal) => {
        show.value = newVal;
    },
);

// 权限列表
const authorityList = ref([
    {
        name: t('add_streamer'),
        type: 'ADD_ANCHOR',
        icon: 0,
    },
    {
        name: t('delete_streamer'),
        type: 'DEL_ANCHOR',
        icon: 0,
    },
    {
        name: t('view_streamer_income'),
        type: 'QUERY_SETTLE',
        icon: 0,
    },
]);

// 处理当前拥有权限
watch(
    () => props.info.authority,
    (newVal) => {
        if (newVal) {
            authorityList.value.forEach((item) => {
                if (newVal.includes(item.type)) {
                    item.icon = 1;
                }
            });
        }
    },
);

// 保存权限
const saveAuthority = async () => {
    try {
        // 处理当前选中权限
        const authority = authorityList.value
            .filter((item) => item.icon === 1)
            .map((item) => item.type);
        const res = await setAuthority({
            target_uid: props.info.uid,
            authority: authority,
        });
        if (res.status !== 1000) {
            Toast(res.desc);
            return;
        }
        close(1);
    } catch (error) {
        console.log(error);
    }
};

// 修改权限
const changeAuthority = (item) => {
    item.icon = item.icon === 0 ? 1 : 0;
};

// 关闭弹窗
const close = (value) => {
    emit('close', value);
    authorityList.value = [
        {
            name: t('add_streamer'),
            type: 'ADD_ANCHOR',
            icon: 0,
        },
        {
            name: t('delete_streamer'),
            type: 'DEL_ANCHOR',
            icon: 0,
        },
        {
            name: t('view_streamer_income'),
            type: 'QUERY_SETTLE',
            icon: 0,
        },
    ];
};
</script>

<style lang="less" scoped>
.jurisdiction {

    .bg {
        position: absolute;
        width: 100%;
        height: 1.71rem;
        background-image: url(https://yaame-static.yaame.io/admin/023f4c81ee66b4676e7f14bf676b63c7.png);
        background-repeat: no-repeat;
        background-size: contain;
    }

    .content {
        position: relative;
        padding: 0 0.4rem;

        .head {
            height: 0.48rem;
            margin-top: 0.6rem;
            font-family: PingFangSC, PingFang SC;
            font-weight: 600;
            font-size: 0.34rem;
            color: #333333;
            line-height: 0.48rem;
            text-align: center;
        }

        .info {
            display: flex;
            margin-top: 0.4rem;

            .avatar {
                width: 0.82rem;
                height: 0.82rem;

                img {
                    width: 0.82rem;
                    height: 0.82rem;
                    border-radius: 50%;
                }
            }

            .txt {
                display: flex;
                flex-direction: column;
                justify-content: space-evenly;
                margin-left: 0.2rem;

                .name {
                    height: 0.28rem;
                    font-weight: 400;
                    font-size: 0.28rem;
                    color: #333333;
                    line-height: 0.28rem;
                }

                .id {
                    height: 0.2rem;
                    font-weight: 400;
                    font-size: 0.2rem;
                    color: #999999;
                    line-height: 0.2rem;
                }
            }
        }

        .authority {
            margin-top: 0.4rem;
            overflow: auto;
            height: 3.9rem;

            .item {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                width: 6.7rem;
                height: 1.08rem;
                padding: 0 0.29rem 0 0.4rem;
                margin-bottom: 0.2rem;
                background: #ffffff;
                border-radius: 0.24rem;
                font-weight: 400;
                font-size: 0.28rem;
                color: #333333;
            }

            .icon {
                width: 0.26rem;
                height: 0.26rem;
                background-image: url(https://yaame-static.yaame.io/admin/1e3cf13de810b6683dc71c9c0aec6703.png);
                background-repeat: no-repeat;
                background-size: contain;
            }
            .active {
                background-image: url(https://yaame-static.yaame.io/admin/e0e8856f3eb2715c580c818afbdd94f2.png);
            }
        }

        .btn {
            display: flex;
            justify-content: space-between;
            margin: 0.4rem 0 0.6rem;

            .no-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 3.25rem;
                height: 0.88rem;
                background: #f1f1f1;
                font-weight: 600;
                font-size: 0.3rem;
                color: #333333;
                border-radius: 0.5rem;
            }

            .yes-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 3.25rem;
                height: 0.88rem;
                background: linear-gradient(90deg, #63df6d 0%, #4cc9a4 100%);
                font-weight: 600;
                font-size: 0.3rem;
                color: #ffffff;
                border-radius: 0.5rem;
            }
        }
    }

    // vant组件头颜色修改
    :deep(.van-action-sheet__content) {
        background-color: #f4f8fb;
    }
}
</style>
