<!--
 * @Author: Elk
 * @Date: 2023-08-10 15:36:01
 * @FilePath: /yaame-h5/src/pages/MyGuild/views/WalletsMain.vue
 * @Description: 
-->
<template>
    <div
        :style="{ paddingTop: safe_height + 1.08 + 'rem' }"
        class="Wallets"
    >
        <Header
            :keep="true"
            style="position: fixed"
        >
            {{ $t('MyGuild') }}
        </Header>

        <div class="content">
            <div
                v-for="(item, index) in list"
                :key="index"
                class="item"
                @click="goPage(item.path)"
            >
                {{ item.name }}
                <!-- <template v-if="regionId === 'PHILIPPINES'">
                    <span v-if="item.ago">{{ $t('before_nov_10_2024') }}</span>
                    <span v-if="item.rear">{{ $t('after_nov_11_2024') }}</span>
                </template>
                <template v-else>
                    <span v-if="item.ago">{{ $t('before_sept_30_2024') }}</span>
                    <span v-if="item.rear">{{ $t('after_oct_1_2024') }}</span>
                </template> -->
                <img
                    src="https://static.yaame.io/admin/cef65a144164f57475cda464b946c142.png"
                    alt=""
                />
            </div>
        </div>

        <PageLoading v-if="pageLoading"></PageLoading>
    </div>
</template>

<script>
import { ref, onMounted, getCurrentInstance } from 'vue';
import Header from '@/components/common/header.vue';
import PageLoading from '@/components/common/page_loading.vue';
import { getSafeHeight } from '@/lib/device';
import request from '@/lib/request/contribution';
// 获取UTC时间
const getUTC = () => {
    return new Date();
};

// 获取对于本地时间的10.1日时间戳
const getUTCOne = () => {
    return new Date(Date.UTC(2024, 9, 1, 0, 0, 0));
};

const getUTCforPH = () => {
    return new Date(Date.UTC(2024, 10, 11, 0, 0, 0));
};

export default {
    components: {
        Header,
        PageLoading,
    },
    setup() {
        const root = getCurrentInstance();
        const t = (val) => {
            return root.proxy.$i18n.t(val);
        };
        const router = root.proxy.$router;

        const safe_height = ref(0);
        const list = ref([
            {
                name: t('ContactUs'),
                path: 'ContactUs',
            },
            {
                name: t('Rules'),
                path: 'Regulations',
            },
            // {
            //     name: t('MyIncome'),
            //     path: 'MyIncome',
            //     ago: false,
            // },
            {
                name: t('GuildMembers'),
                path: 'GuildMembers',
            },
            // {
            // 	name: t("MyIncome"),
            // 	path: "MyIncomeRear",
            // 	rear: false,
            // },
            {
                name: t('MyIncome'),
                path: 'MyIncomeMain',
                rear: false,
            },
        ]);
        const goPage = (href) => {
            router.push({
                name: href,
                query: {
                    region_id: regionId.value,
                    guild_id: guild_id.value,
                    guild_type: guild_type.value,
                    is_guild_owner: is_guild_owner.value,
                    add_authority: add_authority.value,
                    delete_authority: delete_authority.value,
                },
            });
        };

        const pageLoading = ref(true);
        // 获取用户大区
        const regionId = ref('');
        // 获取用户公会id
        const guild_id = ref('');
        // 获取用户公会类型
        const guild_type = ref('');
        // 获取是否会长
        const is_guild_owner = ref(0);
        // 添加权限和删除权限
        const add_authority = ref(0);
        const delete_authority = ref(0);

        // 判断用户权限
        const getJurisdiction = async () => {
            try {
                const res = await request.getIncomeConfig();
                if (res.status !== 1000) return;
                regionId.value = res.data.region_id;
                guild_id.value = res.data.guild_id;
                guild_type.value = res.data.guild_type;
                // 判断是否是会长
                is_guild_owner.value = res.data.role === 'OWNER' ? 1 : 0;
                // 权限判断
                const has_authority = res.data.authority
                    ? res.data.authority.filter((item) => item === 'QUERY_SETTLE').length
                    : 0;
                // 添加权限和删除权限
                add_authority.value = res.data.authority
                    ? res.data.authority.filter((item) => item === 'ADD_ANCHOR').length
                    : 0;
                delete_authority.value = res.data.authority
                    ? res.data.authority.filter((item) => item === 'DEL_ANCHOR').length
                    : 0;

                // 添加对应权限菜单
                if (is_guild_owner.value) {
                    // 判断是否有权限
                    // list.value.splice(2, 0, {
                    //     name: t('GuildIncome'),
                    //     path: 'AgencyRevenue',
                    //     ago: false,
                    // });
                    list.value.push({
                        name: t('GuildIncome'),
                        path: 'AgencyRevenueAll',
                        rear: false,
                    });
                    list.value.splice(5, 0, {
                        name: t('admin'),
                        path: 'intendantPage',
                    });
                    // 判断当前是否有查看收益权限
                } else if (has_authority) {
                    list.value.push({
                        name: t('GuildIncome'),
                        path: 'AgencyRevenueAll',
                        rear: false,
                    });
                }
                // 判断是否是菲律宾用户 当前时间小于开放时间  不开放入口 getUTC().getTime() < getUTCOne().getTime() ||
                if (regionId.value === 'PHILIPPINES') {
                    if (getUTC().getTime() < getUTCforPH().getTime()) {
                        // 去除新版入口
                        list.value = list.value.filter(
                            (obj) => obj.path !== 'AgencyRevenueAll' && obj.path !== 'MyIncomeMain',
                        );
                    } else {
                        // 不是菲律宾展示新版信息
                        list.value.forEach((obj) => {
                            if ('rear' in obj) obj.rear = true;
                            if ('ago' in obj) obj.ago = true;
                        });
                    }
                } else {
                    if (getUTC().getTime() < getUTCOne().getTime()) {
                        // 去除新版入口
                        list.value = list.value.filter(
                            (obj) => obj.path !== 'AgencyRevenueAll' && obj.path !== 'MyIncomeMain',
                        );
                    } else {
                        // 不是菲律宾展示新版信息
                        list.value.forEach((obj) => {
                            if ('rear' in obj) obj.rear = true;
                            if ('ago' in obj) obj.ago = true;
                        });
                    }
                }

                // 聊天主播tab限制
                if (guild_type.value !== 'NORMAL') {
                    if (is_guild_owner.value === 1) {
                        // 删除成员收入
                        list.value = list.value.filter((obj) => obj.path !== 'MyIncome');
                        // 删除新版成员收入
                        list.value = list.value.filter((obj) => obj.path !== 'MyIncomeMain');
                        // 删除联系我们
                        list.value = list.value.filter((obj) => obj.path !== 'ContactUs');
                        list.value = list.value.filter((obj) => obj.path !== 'AgencyRevenue');
                    } else {
                        // 只保留 MyIncomeMain MyIncome 和Regulations
                        list.value = list.value.filter(
                            (obj) => obj.path === 'MyIncomeMain' || obj.path === 'Regulations',
                        );
                        // 判断当前成员权限有权查看公会收益
                        if (has_authority) {
                            list.value.push({
                                name: t('GuildIncome'),
                                path: 'AgencyRevenueAll',
                                rear: true,
                            });
                        }
                        // 判断当前是否有操作成员权限
                        if (add_authority.value || delete_authority.value) {
                            list.value.splice(1, 0, {
                                name: t('GuildMembers'),
                                path: 'GuildMembers',
                            });
                        }
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };

        function getQueryParam(param) {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(param);
        }

        onMounted(async () => {
            const safe_area = getSafeHeight() || 0;
            safe_height.value = (safe_area * 2) / 100;

            await getJurisdiction();
            if (getQueryParam('tab')) {
                const tab = getQueryParam('tab');
                const url = new URL(window.location.href);
                if (url.searchParams.has('tab')) {
                    url.searchParams.delete('tab');
                    window.history.replaceState({}, '', url); // 用替换当前状态的方式删除 tab 参数
                }

                localStorage.setItem('oneTab', tab);
                goPage(tab);
            } else {
                pageLoading.value = false;
            }
        });
        return {
            safe_height,
            list,

            goPage,
            pageLoading,
            regionId,
        };
    },
};
</script>
<style lang="less">
.Wallets {
    width: 100%;
    height: 100%;
    position: relative;

    .content {
        width: 6.9rem;
        background: #ffffff;
        border-radius: 0.24rem;
        margin-left: 0.3rem;
        overflow: hidden;

        .item {
            width: 6.3rem;
            height: 1.22rem;
            border-bottom: 0.01rem solid #eee;
            font-size: 0.3rem;
            margin-left: 0.3rem;
            color: #333333;
            line-height: 1.22rem;
            position: relative;

            span {
                height: 1.22rem;
                line-height: 1.22rem;
                position: absolute;
                right: 0.8rem;
                font-size: 0.24rem;
                color: #ccc;
            }

            &.item:last-child {
                border: none;
            }

            img {
                width: 0.24rem;
                position: absolute;
                right: 0.3rem;
                top: 0.49rem;
            }
        }
    }
}
</style>
