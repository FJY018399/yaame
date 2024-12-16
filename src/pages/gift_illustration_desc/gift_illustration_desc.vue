<!--
 * @Author: Se7enElk
 * @Date: 2022-11-14 22:02:36
 * @FilePath: /yaame-h5/src/pages/gift_illustration_desc/gift_illustration_desc.vue
 * @Description: 
-->
<template>
	<div class="content">
		<div class="item">
			<header>{{ $t('giftWall') }}</header>

			<p>{{ $t('giftWallFun') }}</p>
		</div>
		<div class="item">
			<header>{{ $t('headSculpture') }}</header>

			<p>{{ $t('headSculptureFun') }}</p>
		</div>
		<!-- <div class="item">
			<header>{{ $t('giftSet') }}</header>

			<p>
				{{ $t('giftSetFun') }}
			</p>
		</div>
		<div class="item">
			<header>{{ $t('luckyPavilion') }}</header>

			<p>
				{{ $t('luckyPavilionFun') }}
			</p>
		</div> -->
	</div>
</template>

<script>
    export default {
        mounted() {
            document.title = this.$t('illustrate');
        },
    };
</script>

<style lang="less" scoped>
.content {
	padding-top: 0.5rem;
	.item {
		width: 6.9rem;
		background: #f8fbfd;
		border-radius: 0.24rem;
		padding: 0.3rem;
		margin-bottom: 0.3rem;
		margin-left: 0.3rem;
		header {
			font-size: 0.3rem;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: #333333;
		}
		p {
			margin-top: 0.3rem;
			font-size: 0.24rem;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #999999;
		}
	}
}
</style>
