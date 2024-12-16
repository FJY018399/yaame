<template>
	<div class="greetingList">
		<refresh
			v-if="records && records.length"
			ref="wlRefresh"
			style="min-height: 100vh"
			@onRefresh="handleRefresh"
		>
			<div class="list">
				<div
					v-infinite-scroll="loadMore"
					v-if="records && records.length"
					:infinite-scroll-immediate-check="true"
					class="content scroll-box"
					infinite-scroll-disabled="loading"
					infinite-scroll-distance="10"
				>
					<div v-for="(item, index) in records" :key="index" class="item">
						<div class="user_avatar" @click="goDetails(item)">
							<img :src="item.avatar" alt="" />
						</div>
						<div class="user_info">
							<h6>{{ item.nick_name }}</h6>
							<p>Lv.{{ item.level }}</p>
						</div>
						<div class="btn" @click="chatWith(item)">
							<img
								src="http://imgcom.static.suishenyun.net/icon_mine_default%E5%A4%87%E4%BB%BD@2x-cb65c4.png"
								alt=""
							/>
							Chat
						</div>
					</div>
				</div>
			</div>
		</refresh>
		<blankPage v-else></blankPage>
	</div>
</template>

<script>
import { ref, onMounted } from "vue";
import request from "../../lib/request/withdraw";
import refresh from "../../components/common/refresh.vue";
import blankPage from "../../components/common/blank_page.vue";

export default {
	components: {
		// customHeader,
		refresh,
		blankPage,
	},
	setup() {
		const loadMore = ref(true);
		const page = ref(1);
		const records = ref([]);

		onMounted(() => {
			getList();
			document.title = "打招呼列表";
		});

		async function handleRefresh() {
			page.value = 1;
			await getList();
			setTimeout(() => {
				wlRefresh.isLoading = false;
			}, 500);
		}

		async function getList() {
			const { data, status } = await request.getStatisticChargeList();
			if (status !== 1000) {
				return;
			}
			records.value = data || [];
		}

		function chatWith(item) {
			location.href = `wlyaame://chat/p2p?nim_id=${item.accid}&nick_name=${item.nick_name}&uid=${item.uid}&avatar=${item.avatar}`;
		}

		function goDetails(item) {
			location.href = `wlyaame://trend/user?uid=${item.uid}`;
		}

		return {
			loadMore,
			page,
			records,
			handleRefresh,
			getList,
			chatWith,
			goDetails,
		};
	},
};
</script>

<style scoped>
/* Your CSS styles remain unchanged */
</style>

<style scoped>
.greetingList {
	padding: 0.3rem;
	background-color: #f4f8fb;
}
.item {
	width: 6.9rem;
	height: 1.7rem;
	background: #ffffff;
	border-radius: 0.24rem;
	margin-bottom: 0.2rem;
	display: flex;
	padding: 0.3rem;
}
.user_avatar {
	width: 1.1rem;
	height: 1.1rem;
	border-radius: 50%;
	overflow: hidden;
}
.user_avatar > img {
	width: 1.1rem;
	height: 1.1rem;
}
.user_info {
	width: 3.7rem;
	margin-left: 0.3rem;
	overflow: hidden;
}
.btn {
	width: 1.3rem;
	height: 0.66rem;
	background: linear-gradient(90deg, #fe3e7f 0%, #fe47bc 100%);
	box-shadow: 0px 0px 12px 0px rgba(255, 48, 146, 0.3);
	border-radius: 0.33rem;
	opacity: 0.9;
	margin-top: 0.22rem;
	font-size: 0.24rem;
	color: #fff;
	line-height: 0.66rem;
	font-weight: 600;
	text-align: center;
}
.btn > img {
	width: 0.32rem;
	height: 0.32rem;
	vertical-align: middle;
}
.user_info > p {
	font-size: 0.24rem;
	font-weight: 400;
	color: #666666;
	margin-top: 0.1rem;
}
.user_info > h6 {
	font-size: 0.3rem;
	font-weight: 600;
	color: #000000;
	margin-top: 0.12rem;
}
</style>
