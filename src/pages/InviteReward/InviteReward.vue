<!--
 * @Author: wujiang@weli.cn
 * @Date: 2023-12-07 17:29:17
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-08-07 11:13:58
 * @Description: 邀请有礼
-->
<template>
	<div class="whole-content">
		<div
			class="main"
			:style="{ backgroundImage: `url(${bgUrl})` }"
		>
			<Header :title="inviteText" :keep="false"></Header>
			<page-loading v-if="page_loading"></page-loading>

			<div class="tab-list">
				<div
					v-for="(it, k) in tabList"
					:key="'tab' + k"
					:class="[activeTab === it.nid ? 'tab-icon' : 'item']"
					@click="activeTab = it.nid"
					:style="{ width: is_show ? '2.3rem' : '3.45rem' }"
				>
					<img
						v-if="activeTab === it.nid"
						:src="tabImgList[k]"
						class="tab-icon"
						alt=""
						:style="{ width: is_show ? '2.3rem' : '3.45rem' }"
					/>
					<span v-else>{{ it[language] }}</span>
				</div>
			</div>
			<div
				:class="['content', activeTab === 2 ? 'content-2' : 'content-other']"
			>
				<InviteOther
					v-if="activeTab === 1"
					:invite_code="invite_code"
                    :can_lottery_times="can_lottery_times"
                    :gameGiftList="gameGiftList"
					:language="language"
                    :region_id="region_id"
                    @openGame="toGame"
				/>
				<InviteRecord
					ref="record"
					v-else-if="activeTab === 2"
					:language="language"
                    :can_lottery_times="can_lottery_times"
                    :gameGiftList="gameGiftList"
                    :region_id="region_id"
                    @openGame="toGame"
					@loadingRefresh="loadingRefresh"
				/>
                <template v-if="specialRegionList.includes(region_id)">
                    <InviteMe
                        ref="me"
                        v-if="activeTab === 3 && is_show == true"
                        :language="language"
                        :ad_conversion="ad_conversion"
                        @openGame="toGame"
                        @loadingRefresh="loadingRefresh"
                    />
                </template>


                <template v-else>
                    <InviteMeEnd
                        ref="me"
                        v-if="activeTab === 3 && is_show == true"
                        :language="language"
                        :ad_conversion="ad_conversion"
                        @openGame="toGame"
                        @loadingRefresh="loadingRefresh"
                    />
                </template>
			</div>
			<div v-show="activeTab === 2" class="footer"></div>
		</div>
	</div>
</template>
<script>
import customHeader from "../../components/common/header.vue";
import request from "../../lib/request/activity";
import popup from "../../components/common/pop_up.vue";
import { getLanguage } from "@/lib/device";
import InviteOther from "./components/InviteOther.vue";
import InviteMe from "./components/InviteMe.vue";
import InviteMeEnd from "./components/InviteMeEnd.vue";
import InviteRecord from "./components/InviteRecord";
import Header from "@/components/common/header.vue";
import {
	getScrollTop,
	sleep,
	burialPointFun,
	getQueryString,
} from "@/lib/utils";

import enUserBtnImg from "../../assets/img/invite/btn/en-user.png";
import enRecardBtnImg from "../../assets/img/invite/btn/en-recard.png";
import enInviteBtnImg from "../../assets/img/invite/btn/en-invites.png";
import inUserBtnImg from "../../assets/img/invite/btn/in-user.png";
import inRecardBtnImg from "../../assets/img/invite/btn/in-recard.png";
import inInviteBtnImg from "../../assets/img/invite/btn/in-invites.png";
import arUserBtnImg from "../../assets/img/invite/btn/ar-user.png";
import arRecardBtnImg from "../../assets/img/invite/btn/ar-recard.png";
import arInviteBtnImg from "../../assets/img/invite/btn/ar-invites.png";
import zhTwUserBtnImg from "../../assets/img/invite/btn/zhTw-user.png";
import zhTwRecardBtnImg from "../../assets/img/invite/btn/zhTw-recard.png";
import zhTwInviteBtnImg from "../../assets/img/invite/btn/zhTw-invites.png";
import zhCNUserBtnImg from "../../assets/img/invite/btn/zhCN-user.png";
import zhCNRecardBtnImg from "../../assets/img/invite/btn/zhCN-recard.png";
import zhCNInviteBtnImg from "../../assets/img/invite/btn/zhCN-invites.png";

import zhCNUserBtnImg2 from "../../assets/img/invite/btn/zhCN-user2.png";
import zhCNRecardBtnImg2 from "../../assets/img/invite/btn/zhCN-recard2.png";
import enUserBtnImg2 from "../../assets/img/invite/btn/en-user2.png";
import enRecardBtnImg2 from "../../assets/img/invite/btn/en-recard2.png";
import inUserBtnImg2 from "../../assets/img/invite/btn/in-user2.png";
import inRecardBtnImg2 from "../../assets/img/invite/btn/in-recard2.png";
import arUserBtnImg2 from "../../assets/img/invite/btn/ar-user2.png";
import arRecardBtnImg2 from "../../assets/img/invite/btn/ar-recard2.png";
import zhTwUserBtnImg2 from "../../assets/img/invite/btn/zhTw-user2.png";
import zhTwRecardBtnImg2 from "../../assets/img/invite/btn/zhTw-recard2.png";

import pageLoading from "@/components/common/page_loading.vue";

const inviteGetReward = {
	"zh-cn": "邀请有礼",
	"zh-tw": "邀請有禮",
	en: "Invitation Reward",
	ar: "مكافأة الدعوة",
	id: "Penghargaan Undangan",
};

const getActiveTabList = {
	"zh-cn": [zhCNUserBtnImg, zhCNRecardBtnImg, zhCNInviteBtnImg],
	"zh-tw": [zhTwUserBtnImg, zhTwRecardBtnImg, zhTwInviteBtnImg],
	en: [enUserBtnImg, enRecardBtnImg, enInviteBtnImg],
	id: [inUserBtnImg, inRecardBtnImg, inInviteBtnImg],
	ar: [arUserBtnImg, arRecardBtnImg, arInviteBtnImg],
};

const getActiveTabList2 = {
	"zh-cn": [zhCNUserBtnImg2, zhCNRecardBtnImg2],
	"zh-tw": [zhTwUserBtnImg2, zhTwRecardBtnImg2],
	en: [enUserBtnImg2, enRecardBtnImg2],
	id: [inUserBtnImg2, inRecardBtnImg2],
	ar: [arUserBtnImg2, arRecardBtnImg2],
};

const bgUrl = {
	"zh-cn": 'https://yaame-static.yaame.io/admin/1da4132039e398553f271e75b82c52da.png',
	"zh-tw": 'https://yaame-static.yaame.io/admin/f310dcc8c2a001686fea768e9fbd1739.png',
	en: 'https://yaame-static.yaame.io/admin/4c36eb3c0660555b598363c798d3e6b8.png',
	ar: 'https://yaame-static.yaame.io/admin/f0a879843562e82b46f24af1ee170711.png',
	id: 'https://yaame-static.yaame.io/admin/3aec148bddecee121a2540718e47f7e8.png',
};

export default {
	components: {
		customHeader,
		popup,
		InviteOther,
		InviteMe,
        InviteMeEnd,
		InviteRecord,
		Header,
		pageLoading,
	},
	data() {
		return {
			activeTab: 1, // 1: 邀请别人 2: 邀请记录 3: 谁邀请你
			tabImgList: [],
			tabList: [],
			bgUrl: "",
			is_show: 1,
			invite_code: "",
			inviteText: "",
			isShowHeader: false,
			ad_conversion: 0, //0: 非广告用户  1:广告用户

			page_loading: true,

            can_lottery_times: 0,

            // gameGiftList: [
            //     'https://yaame-static.yaame.io/admin/724a09a65345fb3851a794e199564341.png',
            //     'https://yaame-static.yaame.io/admin/cf5a0ca03c4c83f18f878c2c9dc507ff.png',
            //     'https://yaame-static.yaame.io/admin/9704d0bcebd527b4eda9e429c9dd7cd8.png',
            // ],

            region_id: '',

            // 特殊开发地区列表
            specialRegionList: ['PHILIPPINES', 'MIDDLE_EAST', 'SOUTHEAST_ASIA'],
		};
	},

	computed: {
		language() {
			let locale = getLanguage() || "en";
			if (getQueryString("language")) {
				locale = getQueryString("language");
			}
			if (["zh-hk", "zh-tw", "zh-mo", "zh-cn", "zh_cn"].indexOf(locale) > -1) {
				let localEnum = {
					"zh-hk": "zh-tw",
					"zh-tw": "zh-tw",
					"zh-mo": "zh-tw",
					"zh-cn": "zh-cn",
					zh_cn: "zh-cn",
				};

				locale = localEnum[locale];
			}
			return locale;
		},
        gameGiftList() {
            if (this.region_id === 'SOUTHEAST_ASIA') {
                return [
                    'https://yaame-static.yaame.io/admin/2b860aecf10e4f5bc7c90111ea43f021.png',
                    'https://yaame-static.yaame.io/admin/f8ba05c9d82008378fb7e1f7cace83d0.png',
                    'https://yaame-static.yaame.io/admin/8d2d323637946fe58f7c808c618d194b.png',
                ]
            } else {
                return [
                    'https://yaame-static.yaame.io/admin/724a09a65345fb3851a794e199564341.png',
                    'https://yaame-static.yaame.io/admin/cf5a0ca03c4c83f18f878c2c9dc507ff.png',
                    'https://yaame-static.yaame.io/admin/9704d0bcebd527b4eda9e429c9dd7cd8.png',
                ]
            }
        }
	},
	async created() {
		await this.getInviteHomeInfo();
		this.bgUrl = bgUrl[this.language];
		this.inviteText = inviteGetReward[this.language];
		this.initInfo();
	},
	mounted() {
		this.page_loading = false;
		window.addEventListener("scroll", this.pageChange, false);
	},
	beforeDestroy() {
		window.removeEventListener("scroll", this.pageChange);
	},
	methods: {
        toGame() {
            location.href = './InviteGame.html'
        },
		pageChange() {
			const scroll_top = getScrollTop();
			if (scroll_top > 75) {
				this.isShowHeader = true;
			} else {
				this.isShowHeader = false;
			}
		},
		async getInviteHomeInfo() {
			let res = await request.getInviteHome();
			if (res.status === 1000) {
				// 谁邀请我tab
				this.invite_code = res.data.invite_code;
				this.ad_conversion = res.data.ad_conversion;

                this.can_lottery_times = res.data.can_lottery_times || 0;

                this.region_id = res.data.region_id;
                // this.region_id = 'MIDDLE_EAST';
			}
		},
		initInfo() {
			if (this.is_show) {
				this.tabList = [
					{
						nid: 1,
						"zh-tw": "邀請別人",
						"zh-cn": "邀请别人",
						en: "Invite Users",
						id: "Ayo undang",
						ar: "دعوة أشخاص آخرين",
					},
					{
						nid: 2,
						"zh-tw": "邀請記錄",
						"zh-cn": "邀请记录",
						en: "Invitation Record",
						id: "Riwayat undangan",
						ar: "سجل  الدعوة",
					},
					{
						nid: 3,
						"zh-tw": "誰邀請我",
						"zh-cn": "谁邀请我",
						en: "Who invites me",
						id: "Pengundang",
						ar: "من دعاك ",
					},
				];
				this.tabImgList = getActiveTabList[this.language];
			} else {
				this.tabList = [
					{
						nid: 1,
						"zh-tw": "邀請別人",
						"zh-cn": "邀请别人",
						en: "Invite Users",
						id: "Ayo undang",
						ar: "دعوة أشخاص آخرين",
					},
					{
						nid: 2,
						"zh-tw": "邀請記錄",
						"zh-cn": "邀请记录",
						en: "Invitation Record",
						id: "Riwayat undangan",
						ar: "سجل  الدعوة",
					},
				];
				this.tabImgList = getActiveTabList2[this.language];
			}
		},
		back() {
			location.href = `wlyaame://webview/back`;
		},

		/**
		 * @description: 下拉刷新
		 * @return {*}
		 */
		async refreshData() {
			if (this.activeTab === 1) {
				await this.getInviteHomeInfo();
				this.loadingRefresh();
			} else if (this.activeTab === 2) {
				await this.$refs.record.getInviteRecord();
				this.loadingRefresh();
			} else {
				await this.$refs.me.getInviteInfo();
				this.loadingRefresh();
			}
		},
		async loadingRefresh() {
			await sleep(500);
			this.refresh_loading = false;
		},
	},
	watch: {
		activeTab: {
			immediate: true,
			handler: (val) => {
				let tabEnum = {
					1: "inviting",
					2: "record",
					3: "invitee",
				};
				burialPointFun({
					event_name: "page_view",
					cid: -1001,
					md: 201,
					args_name: "enter_invite_page",
					args: {
						view_tab: tabEnum[val],
					},
				});
			},
		},
	},
};
</script>
<style scoped lang="less">
.whole-content {
	min-height: 100vh;
}
.main {
	width: 100%;
	min-height: 100vh;
	//background-image: url('https://yaame-static.yaame.io/admin/f79144ceb247462ff921997158cb6c02.png');
	background-size: contain;
	background-repeat: no-repeat;
	position: relative;
	overflow-x: hidden;
	background-color: #ff9cc2;

	.back-arrow {
		width: 0.14rem;
		height: 0.3rem;
		position: absolute;
		left: 0.34rem;
		top: 1.17rem;
	}

	.tab-list {
		display: flex;
		align-items: flex-end;
		justify-content: center;
		height: 0.9rem;
		margin-top: 6.48rem;
		margin-bottom: 0.1rem;
		.item {
			width: 3.45rem;
			height: 0.8rem;
			background: linear-gradient(180deg, #fff2d4 0%, #ffffff 100%);
			border-radius: 0.3rem 0.3rem 0 0;
			font-size: 0.26rem;
			font-family: PingFangSC, PingFang SC;
			font-weight: 400;
			color: #1f3562;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.tab-icon {
			//width: 2.3rem;
			width: 3.45rem;
			height: 0.94rem;
		}
	}

	.content {
		width: 6.9rem;
		background: #ffffff;
		border-radius: 0 0 0.3rem 0.3rem;
		margin: -0.12rem auto 0;
		overflow-x: hidden;
	}

	.content-2 {
		min-height: 11.49rem;
		padding-bottom: 0.4rem;
	}

	.content-other {
		// height: 10.36rem;
		height: 11.1rem;
	}

	.footer {
		height: 0.5rem;
		width: 100%;
	}
}
</style>
