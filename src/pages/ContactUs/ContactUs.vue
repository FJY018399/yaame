<!--
 * @Author: Elk
 * @Date: 2023-07-28 15:15:40
 * @FilePath: /yaame-h5/src/pages/ContactUs/ContactUs.vue
 * @Description: 
-->
<template>
	<div :style="{ paddingTop: safe_height + 1.08 + 'rem' }" class="Wallets">
		<Header :keep="true" style="position: fixed" title="Contact Us"></Header>

		<div class="content">
			<div v-for="item in list" class="item" @click="handleCopy(item.content)">
				{{ item.name }}

				<img
					src="https://static.yaame.io/admin/b2f612029a1b8cbbfa848f39d9f5dec8.png"
					alt=""
				/>
			</div>
		</div>
	</div>
</template>

<script>
import { ref, onMounted } from "vue";
import Header from "../../components/common/header.vue";
import { getSafeHeight } from "../../lib/device";
import Toast from "../../components/third/toast/toast.js";
import request from "../../lib/request/contribution";
export default {
	components: {
		Header,
	},
	setup() {
		let safe_height = ref(0);
		let list = ref([
			{
				name: "Whats App:**********",
				content: "86 15600635111",
			},
			{
				name: "E-mail:yaameoffusa@gahj.com",
				content: "yaameofficial@gmail.com",
			},
		]);
		// 复制文本的函数
		const handleCopy = (textToCopy) => {
			// 创建一个临时的textarea元素
			const tempTextarea = document.createElement("textarea");

			// 将textarea的值设置为要复制的文本内容
			tempTextarea.value = textToCopy;

			// 将textarea添加到DOM中
			document.body.appendChild(tempTextarea);

			// 选中textarea中的文本
			tempTextarea.select();

			try {
				// 尝试执行复制操作
				const successful = document.execCommand("copy");
				const message = successful
					? "Successful replication"
					: "Replication failure";
				Toast("Copy Success");
			} catch (err) {
				console.error("复制失败：", err);
			}

			// 移除临时的textarea元素
			document.body.removeChild(tempTextarea);
		};

		const getData = async () => {
			try {
				const res = await request.getIncomeConfig();
				if (res.status === 1000) {
					list.value = [
						{
							name: `Whats App:${res.data.whats_app}`,
							content: res.data.whats_app,
						},
						{
							name: `E-mail:${res.data.email}`,
							content: res.data.email,
						},
					];
				}
			} catch (error) {
				throw new Error(error);
			}
		};
		onMounted(() => {
			let safe_area = getSafeHeight() || 0;
			safe_height.value = (safe_area * 2) / 100;

			getData();
		});
		return {
			safe_height,
			list,

			handleCopy,
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
				width: 0.38rem;
				position: absolute;
				right: 0.4rem;
				top: 0.49rem;
			}
		}
	}
}
</style>
