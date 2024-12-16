<!--
 * @Author: wujiang@weli.cn
 * @Date: 2023-12-07 17:29:17
 * @LastEditors: wujiang 
 * @LastEditTime: 2023-12-18 21:28:55
 * @Description: 谁邀请你
-->
<template>
	<div class="exceedDate">
		<div class="box">
			<img src="https://yaame-static.yaame.io/admin/ce3ce25d047fe6133c38dc3c8cd2d6db.png" alt="" />
			<p style="width: 3.94rem">{{ $t("activity-end") }}</p>
		</div>
	</div>
</template>
<script></script>
<style scoped lang="less">
.exceedDate {
	width: 100%;
	height: 100%;
	font-weight: 400;
	font-family: PingFangSC, PingFang SC;
	font-size: 0.22rem;
	color: #6d3116;
	display: flex;
	justify-content: center;
	.box {
		width: 6.1rem;
		height: 8.09rem;
		margin-top: 0.4rem;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		background-image: url("../../../assets//img//invite/exceedDate.png");
		background-size: 100% 100%;
		img {
			width: 1.8rem;
			height: 1.8rem;
		}
	}
}
</style>
