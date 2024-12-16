<template>
	<div class="commonActivity">
		<custom-header color="white" />
		<div class="images">
			<img v-for="(item, k) in images" :key="'image' + k" :src="item" alt="" />
		</div>
	</div>
</template>

<script>
import { getCommonActivity } from "./api";
import customHeader from "@/components/common/header.vue";
import { getQueryString } from "@/lib/utils";

export default {
	name: "commonActivity",
	components: { customHeader },
	data() {
		return {
			activity_id: +getQueryString("activityId"),
			title: "",
			images: [],
		};
	},
	created() {
		this.getData();
	},
	mounted() {
		setTimeout(() => {
			this.getData();
		}, 20000);
	},
	methods: {
		async getData() {
			const res = await getCommonActivity({
				activity_id: this.activity_id,
			});
			if (res.status !== 1000) return;
			let { name, images } = res.data;

			this.images = images;
			document.title = name || "";
		},
	},
};
</script>

<style lang="less" scoped>
@fontFamily: Hiragino Sans GB SemiBold;

.commonActivity {
	width: 7.5rem;
	min-height: 100vh;
	position: relative;
	padding: 0.01rem;
	.images {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		img {
			width: 100%;
			height: 100%;
		}
	}
}
</style>
