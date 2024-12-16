<!--
 * @Author: Elk
 * @Date: 2023-08-10 15:36:01
 * @FilePath: /yaame-h5/src/pages/ChatMyGuild/views/Wallets.vue
 * @Description: 
-->
<template>
	<div :style="{ paddingTop: safe_height + 1.08 + 'rem' }" class="Wallets">
		<Header :keep="true" style="position: fixed;">{{ $t('MyGuild') }}</Header>

		<div class="content">
			<div v-for="(item, index) in list" :key="index" class="item" @click="goPage(item.path)">
				{{ item.name }}
				<img src="https://static.yaame.io/admin/cef65a144164f57475cda464b946c142.png" alt="" />
			</div>
		</div>

        <PageLoading v-if="pageLoading"></PageLoading>
	</div>
</template>

<script>
import { ref, onMounted, getCurrentInstance } from "vue";
import Header from "@/components/common/header.vue";
import PageLoading from '@/components/common/page_loading.vue'
import { getSafeHeight } from "@/lib/device";
import request from "@/lib/request/contribution";
export default {
	components: {
		Header,
        PageLoading
	},
	setup() {
        const root = getCurrentInstance();
        const t = (val) => {
            return root.proxy.$i18n.t(val)
        }
        const router = root.proxy.$router;

		let safe_height = ref(0);
		const list = ref([
			{
				name: t('Rules'),
				path: "Regulations",
			},
			{
				name: t('MyIncome'),
				path: "MyIncome",
			},
		]);
		const goPage = (href) => {
            router.push({
                name: href,
            });
		};
        
        let pageLoading = ref(true);
		// 判断用户权限
		const getJurisdiction = async () => {
			try {
				const res = await request.getIncomeConfig();
				if (res.status !== 1000) return;
				if (res.data.is_guild_owner) {
                    // 删除第二个元素
                    list.value.splice(1, 1);

					list.value.splice(2, 0, {
						name: t('GuildIncome'),
						path: "AgencyRevenue",
					});
                    list.value.push({
                        name: t('GuildMembers'),
                        path: "GuildMembers",
                    })
				}
                pageLoading.value = false;
			} catch (error) {
				console.log(error);
			}
		};

		onMounted(() => {
			let safe_area = getSafeHeight() || 0;
			safe_height.value = (safe_area * 2) / 100;
			getJurisdiction();
		});
		return {
			safe_height,
			list,

			goPage,
            pageLoading
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
