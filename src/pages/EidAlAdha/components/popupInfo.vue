<template>
	<Popup class="flex-box">
		<div class="info-container">
			<div class="popup-header">
				<div class="header-content">
					<slot name="header"></slot>
				</div>
			</div>

			<slot name="default"></slot>
			<div class="close-btn" @click="popupShow"><slot name="btn"></slot></div>
            <div class="close-icon" @click="closeClick"></div>
		</div>
	</Popup>
</template>

<script setup>
import Popup from "@/components/common/pop_up";
const emits = defineEmits(["confirm", "close"]);
const popupShow = () => {
    emits('confirm'); 
};
const closeClick = () => {
    emits('close');
};
</script>
<style scoped lang="less">
.flex-box {
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 0.24rem;
	.info-container {
		width: 5.9rem;
		height: 3.63rem;
		background-size: contain;
		background-repeat: no-repeat;
		background-image: url(https://yaame-static.yaame.io/admin/a10cc54cb4516e86516e0817698cf843.png);
		position: relative;
		padding-top: 0.3rem;
		.popup-header {
			width: 5.9rem;
			height: 0.5rem;
			text-align: center;
			.header-content {
				font-weight: 600;
				font-size: 0.36rem;
				color: #f1c58b;
				position: relative;
				display: inline-block;
				&::after {
					content: "";
					display: block;
					width: 0.68rem;
					height: 0.32rem;
					background-size: contain;
					background-repeat: no-repeat;
					background-image: url(https://yaame-static.yaame.io/admin/e7a35ce40628ac621713453535c44dd0.png);
					position: absolute;
					left: -0.76rem;
					top: 0.04rem;
				}
				&::before {
					content: "";
					display: block;
					width: 0.68rem;
					height: 0.32rem;
					background-size: contain;
					background-repeat: no-repeat;
					background-image: url(https://yaame-static.yaame.io/admin/7bc494f79c70097eed327be7c26478b6.png);
					position: absolute;
					right: -0.76rem;
					top: 0.04rem;
				}
			}
		}
		.close-btn {
			width: 4.18rem;
			height: 0.9rem;
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			bottom: 0.64rem;
			text-align: center;
			line-height: 0.9rem;
			font-weight: 600;
			font-size: 0.3rem;
			color: #6b3e17;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/179a9b76b10e023f1d6d1817bf2cbbc6.png);
			z-index: 3;
			&.disabled {
				// 灰色滤镜
				filter: grayscale(100%);
			}
		}
		.close-icon {
			width: 0.5rem;
			height: 0.5rem;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/40b31f437fb27d24313849c57e7a5f4f.png);
			position: absolute;
			left: 2.7rem;
			bottom: -0.9rem;
		}
	}
}
</style>
