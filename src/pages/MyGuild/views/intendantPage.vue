<!-- 管理员 -->
<template>
    <div class="intendant">
        <Header
            :keep="true"
            :keepColor="false"
            style="position: fixed"
        >
            {{ $t('admin') }}
        </Header>

        <!-- tab -->
        <div class="tabs">
            <div
                :class="['tab', tabType === item.type ? 'yes' : '']"
                v-for="(item, index) in tab"
                :key="index"
                @click="cutTabs(item.type)"
            >
                {{ item.name }}
            </div>
        </div>

        <!-- 管理员操作列表 -->
        <CustodianList v-show="tabType === 1" />
        <Operation v-show="tabType === 2" :tabType="tabType" />
    </div>
</template>

<script setup>
import Header from '@/components/common/header.vue';
import { getCurrentInstance, ref } from 'vue';
import CustodianList from '@/pages/MyGuild/components/custodianList.vue';
import Operation from '@/pages/MyGuild/components/operation.vue';

// 获取实例
const root = getCurrentInstance();
const t = (val) => {
    return root.proxy.$i18n.t(val);
};

// tab
const tabType = ref(1);
const tab = ref([
    {
        name: t('admin'),
        type: 1,
    },
    {
        name: t('operation_log'),
        type: 2,
    },
]);
// 切换tab
const cutTabs = (type) => {
    tabType.value = type;
};
</script>

<style lang="less" scoped>
.intendant {
    min-height: 100vh;
    overflow: hidden;
    .tabs {
        display: flex;
        align-items: center;
        width: 6.9rem;
        height: 0.68rem;
        padding: 0 0.08rem;
        margin: 1.8rem auto 0;
        background: #e9eff4;
        border-radius: 0.34rem;
        .tab {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 3.37rem;
            height: 0.52rem;
            border-radius: 0.3rem;
            font-weight: 500;
            font-size: 0.26rem;
            color: #333333;
            flex: 1;
            transition-duration: 0.3s;
        }
        .yes {
            background: #ffffff;
        }
    }
}
</style>
