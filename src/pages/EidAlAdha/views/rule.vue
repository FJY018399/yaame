<!--
 * @Author: Se7enElk
 * @Date: 2022-03-29 14:33:46
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-13 17:27:15
 * @FilePath: /peanut_h5/src/pages/nobleDescription/nobleDescription.vue
 * @Description: 
-->
<template>
	<div :style="{ paddingTop: safe_height + 0.88 + 'rem' }" class="privilege">
		<header
			:style="{
				background: header_white ? '#121F26' : '',
				height: safe_height + 0.88 + 'rem',
			}"
			class="page_header"
		>
        <div class="back-img" @click="back">
                <img
                    src="https://yaame-static.yaame.io/admin/2a3fcadb7a3b0bf487b8c7d548b1c5d8.png"
                    @click="back"
                />
            </div>
			<div class="header-content">{{ $t('nobleExplanation') }}</div>
		</header>

		<div class="content-box">
			<header class="content-header">{{ $t('whatIsNoble') }}</header>
			<p>{{ $t('nobleDefinition1') }}</p>
			<p>{{ $t('nobleDefinition2') }}</p>
		</div>
		<!-- <div class="content-box">
			<header class="content-header">如何成为贵族</header>
			<p>
				每自然月1日0点起，根据充值获得的累计贵族值，获得对应的贵族身份和特权，每充值1钻=1贵族值
			</p>
			<table class="content-table">
				<tr>
					<th>等级</th>
					<th>升级贵族值（钻石）</th>
					<th>保级值（钻石）</th>
				</tr>
				<tr>
					<td style="color: #d9b99f">骑士</td>
					<td>5000</td>
					<td>2500</td>
				</tr>
				<tr>
					<td style="color: #d9b99f">子爵</td>
					<td>10000</td>
					<td>5000</td>
				</tr>
				<tr>
					<td style="color: #d9b99f">伯爵</td>
					<td>50000</td>
					<td>25000</td>
				</tr>
				<tr>
					<td style="color: #d9b99f">侯爵</td>
					<td>100000</td>
					<td>50000</td>
				</tr>
				<tr>
					<td style="color: #d9b99f">公爵</td>
					<td>300000</td>
					<td>150000</td>
				</tr>
				<tr>
					<td style="color: #d9b99f">国王</td>
					<td>1000000</td>
					<td>500000</td>
				</tr>
				<tr>
					<td style="color: #d9b99f">帝王</td>
					<td>3000000</td>
					<td>1500000</td>
				</tr>
			</table>
		</div> -->
		<div class="content-box">
			<header class="content-header">{{ $t('upgrade') }}</header>

			<p>{{ $t('nobleValidity1') }}</p>
			<p>{{ $t('nobleValidity2') }}</p>
		</div>
		<div class="content-box">
			<header class="content-header">{{ $t('maintainLevel') }}</header>

			<p>{{ $t('maintainLevel1') }}</p>
			<p>{{ $t('maintainLevel2') }}</p>
		</div>
		<div class="content-box">
			<header class="content-header">{{ $t('demotion') }}</header>

			<p>{{ $t('demotion1') }}</p>
		</div>

        <div class="content-box">
            <table class="content-table">
                <tr>
                    <th>{{ $t('noblePrivileges') }}</th>
                    <th>{{ $t('upgrade') }}</th>
                    <th>{{ $t('maintainLevel') }}</th>
                </tr>
                <tr>
                    <td style="color: #D9B99F">{{ $t('nobleLevelKnight') }}</td>
                    <td>5,000</td>
                    <td>2,500</td>
                </tr>
                <tr>
                    <td style="color: #D9B99F">{{ $t('nobleLevelViscount') }}</td>
                    <td>20,000</td>
                    <td>10,000</td>
                </tr>
                <tr>
                    <td style="color: #D9B99F">{{ $t('nobleLevelEarl') }}</td>
                    <td>80,000</td>
                    <td>40,000</td>
                </tr>
                <tr>
                    <td style="color: #D9B99F">{{ $t('nobleLevelMarquis') }}</td>
                    <td>240,000</td>
                    <td>120,000</td>
                </tr>
                <tr>
                    <td style="color: #D9B99F">{{ $t('nobleLevelDuke') }}</td>
                    <td>600,000</td>
                    <td>300,000</td>
                </tr>
                <tr>
                    <td style="color: #D9B99F">{{ $t('nobleLevelKing') }}</td>
                    <td>1,200,000</td>
                    <td>600,000</td>
                </tr>
                <tr>
                    <td style="color: #D9B99F">{{ $t('nobleLevelOverlord') }}</td>
                    <td>2,000,000</td>
                    <td>1,000,000</td>
                </tr>
            </table>
        </div>
	</div>
</template>

<script>
import { getScrollTop } from "../../../lib/utils";
import { getSafeHeight } from "../../../lib/device";
export default {
	data() {
		return {
			safe_height: 0,
			header_white: false,
		};
	},
	computed: {
		headerTop() {
			if (this.header_white) {
				return 0;
			} else {
				return this.safe_height;
			}
		},
	},
	mounted() {
		let self = this;
		document.title = "贵族说明";
		let safe_area = getSafeHeight() || 0;
		this.safe_height = (safe_area * 2) / 100;
		window.addEventListener("scroll", this.pageChange, false);
	},
	beforeDestroy() {
		window.removeEventListener("scroll", this.pageChange);
	},
	methods: {
		pageChange() {
			const scroll_top = getScrollTop();
			if (scroll_top > 10) {
				this.header_white = true;
			} else {
				this.header_white = false;
			}
		},
		back() {
			location.href = `wlyaame://webview/back`;
		},
	},
};
</script>

<style scoped lang="less">
.privilege {
	padding-top: 0.88rem;
	padding-left: 0.3rem;
	padding-right: 0.3rem;
	background-color: #151f25;
}
.page_header {
	display: flex;
	height: 0.88rem;
	line-height: 0.88rem;
	width: 100%;
	font-size: 0.34rem;
	color: #d9b99f;
	text-align: center;
	position: fixed;
	top: 0;
	left: 0;
	align-items: center;
	justify-content: center;
	z-index: 99;
	background-color: #151f25;
}
.back-img {
    width: 0.4rem;
    height: 0.3rem;
    position: absolute;
    left: 0.3rem;
    bottom: 0.24rem;
    img {
        height: 0.3rem;
        width: auto;
    }
}
.info-img {
	width: 0.4rem;
	height: 0.4rem;
	position: absolute;
	right: 0.3rem;
	bottom: 0.24rem;
}
.header-content {
	position: absolute;
	bottom: 0.24rem;
	height: 0.4rem;
	line-height: 0.4rem;
	left: 50%;
	transform: translate(-50%, -0%);
}
.content-box {
	width: 6.9rem;
	background-color: #1d262c;
	border-radius: 0.24rem;
	padding: 0.3rem;
	color: #7D6E64;
	font-size: 0.24rem;
	margin-bottom: 0.2rem;
}
.active.content-box {
	padding-bottom: 0;
	border: 1px solid #ffd3b4;
}
.active.content-box > p {
	margin-bottom: 0.3rem;
	margin-top: 0.15rem;
}
.content-box > p {
	margin-top: 0.3rem;
}
.content-header {
	padding-left: 0.01rem;
	color: #d9b99f;
	font-size: 0.3rem;
	font-weight: 700;
}
.content-table {
	width: 6.3rem;
	border-radius: 0.12rem;
	border: 1px solid #6e6465;
	height: 6.75rem;
	margin-top: 0.3rem;
	border-collapse: unset;
	overflow: hidden;
}
th {
	color: #fff;
	font-size: 0.24rem;
	background-color: #35444d;
	height: 0.84rem;
	border: 1px solid #6e6465;
	text-align: center;
	line-height: 0.84rem;
}
td {
	background-color: #1B262D;
	color: #ac9b91;
	font-size: 0.28rem;
	height: 0.86rem;
	text-align: center;
	line-height: 0.86rem;
}
tr > th:nth-child(1) {
	width: 1.75rem;
	border: 1px solid #6e6465;
}
tr > th:nth-child(2) {
	width: 2.54rem;
	border: 1px solid #6e6465;
}
tr > th:nth-child(3) {
	width: 1.97rem;
	border: 1px solid #6e6465;
}
tr > td:nth-child(1) {
	width: 1.75rem;
	border: 1px solid #6e6465;
}
tr > td:nth-child(2) {
	width: 2.54rem;
	border: 1px solid #6e6465;
}
tr > td:nth-child(3) {
	width: 1.97rem;
	border: 1px solid #6e6465;
}
</style>
