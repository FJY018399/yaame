<template>
	<div
		:style="{ paddingTop: safeHeight + 0.88 + 'rem' }"
		:class="['details', language]"
	>
		<header
			:style="{
				background: headerWhite ? '#1E1608' : '',
				height: safeHeight + 0.88 + 'rem',
			}"
			class="page-header"
		>
			<div class="back-img" @click="back">
				<img
					src="https://yaame-static.yaame.io/admin/2a3fcadb7a3b0bf487b8c7d548b1c5d8.png"
				/>
			</div>
			<div class="header-content">{{ $t("vip_privilege") }}</div>
		</header>

		<van-tabs
			v-model="active"
			:swipe-threshold="2"
			swipeable
			class="noble-type"
			@change="activeChange"
		>
			<van-tab v-for="(item, index) in privilegeConfigs" :key="index">
				<template #title>
					<div
						:class="{
							'noble-tab-item': true,
							active: active === index,
						}"
					>
						<div class="img-container">
							<img :src="item.icon" class="p-img" alt="" />
                            <img v-if="item.level_badge_icon" :src="item.level_badge_icon" class="icon-img" alt="">
						</div>
					</div>
				</template>
				<template #default>
					<div class="content-container">
						<div class="title">{{ $t(detailsList[index].desc) }}</div>

						<div v-for="(ele, inx) in detailsList[index].content" :key="inx">
							<p
								v-if="ele.type === 'text'"
								:style="{ 'margin-bottom': ele.marginBottom || '0' }"
							>
								<span>{{ $t(ele.key) }}</span>
							</p>

							<div v-if="ele.type === 'img'">
								<div v-if="ele.imgList">
									<img
										v-for="(it, i) in ele.imgList"
										:key="i"
										:src="it"
										alt=""
									/>
								</div>
								<img v-else :src="ele.url" alt="" />
							</div>
						</div>
					</div>
				</template>
			</van-tab>
		</van-tabs>
	</div>
</template>

<script>
import { computed, onMounted, onUnmounted, ref, getCurrentInstance } from "vue";
import { getLanguage, getSafeHeight, getVerCode } from "@/lib/device";
import { getScrollTop } from "@/lib/utils";
import { getInfoAPI } from "../api";
export default {
	setup() {
		const root = getCurrentInstance();
		const route = root.proxy.$route;
		const router = root.proxy.$router;
		let active = ref(Number(route.query.active) || 0);
		// 获取国家
		let language = computed(() => {
			let locale = getLanguage() || "en";
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
		});

		let safeHeight = ref(0);
		let safeArea = getSafeHeight() || 0;
		safeHeight.value = (safeArea * 2) / 100;

		let headerWhite = ref(false);
		const pageChange = () => {
			const scroll_top = getScrollTop();
			headerWhite.value = scroll_top > 10;
		};

		const back = () => {
			router.back();
		};

		let privilegeConfigs = ref([]);
		const getData = async () => {
			try {
				let res = await getInfoAPI();
				if (res.status === 1000) {
					privilegeConfigs.value = res.data.vip_privilege_configs;
				}
			} catch (error) {
				console.log(error);
			}
		};

		let detailsList = ref([
			{
                // VIP 标签
				desc: "vip_tag",
				content: [
					{
						type: "img",
						url: "https://yaame-static.yaame.io/admin/293f4b29b4c7994eceb74faff96e24c5.png",
					},
				],
			},
			{
                // 支持发送图片消息
				desc: "send_image",
				content: [
					{
						type: "img",
						url: "https://yaame-static.yaame.io/admin/0aab45315dcd487fd37496b813dc065e.png",
					},
				],
			},
			// {
            //     // 每日登录送钻石
			// 	desc: "daily_login",
			// 	content: [
			// 		{
			// 			type: "text",
			// 			key: "first_login",
			// 			marginBottom: "0.12rem",
			// 		},
			// 		{
			// 			type: "text",
			// 			key: "vip1_4",
			// 		},
			// 		{
			// 			type: "text",
			// 			key: "vip5_8",
			// 		},
			// 		{
			// 			type: "text",
			// 			key: "vip9_11",
			// 		},
			// 		{
			// 			type: "text",
			// 			key: "vip12_13",
			// 		},
			// 		{
			// 			type: "img",
			// 			url: "https://yaame-static.yaame.io/admin/a8ae9a4ade3058d9ce2ee0bbcdb9e70a.png",
			// 		},
			// 	],
			// },      
			{
                // VIP 礼物
				desc: "vip_gift",
				content: [
					{
						type: "text",
						key: "vip_gift_1",
						marginBottom: "0.12rem",
					},
					{
						type: "img",
						url: "https://yaame-static.yaame.io/admin/ed33c501fd4fb480b3055edfb5ce1541.png",
					},
				],
			},
			{
                // VIP 表情
				desc: "vip_emoji",
				content: [
					{
						type: "text",
						key: "vip_emoji_1",
						marginBottom: "0.12rem",
					},
					{
						type: "img",
						url: "https://yaame-static.yaame.io/admin/e33c8a3fe84af93268f3f06017c700fb.png",
					},
				],
			},
			{
                // VIP 头像框
				desc: "vip_avatar",
				content: [
					{
						type: "img",
						url: "https://yaame-static.yaame.io/admin/d9a7de36e1cbd4f17f8cdcf0b3bd5c85.png",
					},
				],
			},
			{
                // 虚拟人装扮
				desc: "virtual_dress",
				content: [
					{
						type: "img",
						imgList: [
							"https://yaame-static.yaame.io/admin/d753aae6964222068c0ccbca4c1421b9.png",
							"https://yaame-static.yaame.io/admin/ba015ec158e9c7743797c300a887487a.png",
							"https://yaame-static.yaame.io/admin/beaf5876c23bee4223d2a24c69f601f8.png",
							"https://yaame-static.yaame.io/admin/6d6e1ca25c81b6d83d8230bb75fe702a.png",
							"https://yaame-static.yaame.io/admin/bc167d29ddb3ec0f092a53268929a897.png",
							"https://yaame-static.yaame.io/admin/fee4f43d87521b44522c1b4926d1bb58.png",
						],
					},
				],
			},
			{
                // VIP 座驾
				desc: "vip_car",
				content: [
                    {
						type: "img",
						url: "https://yaame-static.yaame.io/admin/752cac0212425452d6e103ef53316501.png",
					},
                ],
			},
			{
                // // 支持动态头像
				desc: "dynamic_avatar",
				content: [
					{
						type: "text",
						key: "dynamic_avatar_1",
						marginBottom: "0.12rem",
					},
					{
						type: "img",
						url: "https://yaame-static.yaame.io/admin/e44436d0a4aacca9306e1658e026164b.png",
					},
				],
			},
			{
                // ID 背景
				desc: "id_bg",
				content: [
					{
						type: "img",
						url: "https://yaame-static.yaame.io/admin/624ccd3da6b5b999bb2d4e884d04d02f.png",
					},
				],
			},
			{
                // VIP 座位效果
				desc: "vip_seat",
				content: [
                    {
						type: "img",
						url: "https://yaame-static.yaame.io/admin/7d472e285393d724c5e91ffa43da327f.png",
					},
                ],
			},

			{
                // VIP 聊天气泡
				desc: "vip_bubble",
				content: [
					{
						type: "img",
						url: "https://yaame-static.yaame.io/admin/e33c45b670c26e88433d0d9a211853dc.png",
					},
				],
			},
            {
                // 财富经验值快速成长
				desc: "wealth_experience_up",
				content: [
					{
						type: "text",
						key: "wealth_experience_up_1",
						marginBottom: "0.12rem",
					},
					{
						type: "text",
						key: "wealth_experience_up_2",
					},
					{
						type: "text",
						key: "wealth_experience_up_3",
					},
					{
						type: "text",
						key: "wealth_experience_up_4",
					},
					{
						type: "img",
						url: "https://yaame-static.yaame.io/admin/72f688b28d3394b70e93e3d7de43db88.png",
					},
				],
			},
            {
                // 用户经验值快速成长
				desc: "user_experience_up",
				content: [
					{
						type: "text",
						key: "user_experience_up_1",
						marginBottom: "0.12rem",
					},
					{
						type: "text",
						key: "user_experience_up_2",
					},
					{
						type: "text",
						key: "user_experience_up_3",
					},
					{
						type: "text",
						key: "user_experience_up_4",
					},
					{
						type: "img",
						url: "https://yaame-static.yaame.io/admin/211c63f0d8b2fc3c7d025ad0acb0aac2.png",
					},
				],
			},
            {
				desc: "vip_room",
				content: [
                    {
                        type: 'img',
                        url: 'https://yaame-static.yaame.io/admin/1b69aacd766987b86756d37b91f46b8c.png'
                    }
                ],
			},
            {
				desc: "vip_room_border",
				content: [
                    {
                        type: 'img',
                        url: 'https://yaame-static.yaame.io/admin/b06acff7e289aac86c4fe54f4a844a1a.png'
                    }
                ],
			},
            {
				desc: "vip_dynamic_room_bg",
				content: [
                    {
						type: "img",
						url: "https://yaame-static.yaame.io/admin/4c3c658de7337b839abc1005475f4498.png",
					},
                ],
			},
            {
				desc: "vip_halo",
				content: [
                    {
                        type: 'img',
                        url: 'https://yaame-static.yaame.io/admin/1bcf3722cb7863df4eb5fde02cd5f365.png'
                    }
                ],
			},
            {
				desc: "badge",
				content: [
                    {
                        type: 'img',
                        url: 'https://yaame-static.yaame.io/admin/a1a5fd8d05a4babf127a6ffc5aaa88fe.png'
                    }
                ],
			},
            {
				desc: "custom_number",
				content: [
					{
						type: "text",
						key: "custom_number_1",
						marginBottom: "0.12rem",
					},
					{
						type: "img",
						url: "https://yaame-static.yaame.io/admin/77c11854574ae455f4d36e627219440d.png",
					},
				],
			},
            {
                desc: "mysterious",
                content: [
                    {
                        type: "text",
                        key: "mysteriousUserInfo",
                    },
                    {
                        type: "text",
                        key: "mysteriousUserInfo1",
                    },
                    {
                        type: "text",
                        key: Number(getVerCode()) < 11800 ? "mysteriousUserInfo_2" : "mysteriousUserInfo2",
                    },
                    {
                        type: "text",
                        key: "mysteriousUserInfo3",
                    },
                    {
                        type: "text",
                        key: "mysteriousUserInfo4",
                    },
                    {
                        type: "img",
                        url: "https://yaame-static.yaame.io/admin/5759ca2f495a1be0d61f1ea1c6bb9218.png",
                    },
                ],
            },
            {
				desc: "anti_kick",
				content: [
                    {
						type: "text",
						key: "antiKickPrivilegeInfo",
						marginBottom: "0.12rem",
					},
					{
						type: "img",
						url: "https://yaame-static.yaame.io/admin/9aa20a1aecb4886772d0f4163e691c9a.png",
					},
                ],
			},
            {
				desc: "customer_service",
				content: [
                {
						type: "text",
						key: "customer_service_1",
						marginBottom: "0.12rem",
					},
					{
						type: "img",
						url: "https://yaame-static.yaame.io/admin/5a0a365a84e144e12ce09c0d69cbc778.png",
					},
                ],
			},
            {
				desc: "custom_gift",
				content: [
                {
						type: "text",
						key: "custom_gift_1",
						marginBottom: "0.12rem",
					},
					{
						type: "img",
						url: "https://yaame-static.yaame.io/admin/6288dc8d45f8919a18bee6fb2f1eab2b.png",
					},
                ],
			},
            {
				desc: "custom_virtual_dress",
				content: [
					{
						type: "text",
						key: "custom_virtual_dress_1",
						marginBottom: "0.12rem",
					},
					{
						type: "img",
						url: "https://yaame-static.yaame.io/admin/5c5489e7be433cfad6fcbf5c8a6ac7d8.png",
					},
				],
			},
            {
				desc: "custom_avatar",
				content: [
					{
						type: "text",
						key: "custom_avatar_1",
						marginBottom: "0.12rem",
					},
					{
						type: "img",
						url: "https://yaame-static.yaame.io/admin/1ffb332505a558c7c30eb289dfd9043c.png",
					},
				],
			},
            {
				desc: "custom_bubble",
				content: [
					{
						type: "text",
						key: "custom_bubble_1",
						marginBottom: "0.12rem",
					},
					{
						type: "img",
						url: "https://yaame-static.yaame.io/admin/93e5e1e467467f8d7538befff4d84d48.png",
					},
				],
			},
            {
				desc: "custom_car",
				content: [
					{
						type: "text",
						key: "custom_car_1",
						marginBottom: "0.12rem",
					},
					{
						type: "img",
						url: "https://yaame-static.yaame.io/admin/3d4d8eb7b55490ebcc522fb75d0bf714.png",
					},
				],
			},
            
            
            
            {
				desc: "custom_virtual_seat",
				content: [
                {
						type: "text",
						key: "custom_virtual_seat_1",
						marginBottom: "0.12rem",
					},
					{
						type: "img",
						url: "https://yaame-static.yaame.io/admin/8be15ba9e8e83f286ebdb3a8d44ebde4.png",
					},
                ],
			},
            {
				desc: "custom_virtual_wing",
				content: [
                {
						type: "text",
						key: "custom_virtual_wing_1",
						marginBottom: "0.12rem",
					},
					{
						type: "img",
						url: "https://yaame-static.yaame.io/admin/f36e62c40a5dac3ae26bf86cab7790fe.png",
					},
                ],
			},
            {
				desc: "letter_number",
				content: [
                {
						type: "text",
						key: "letter_number_1",
						marginBottom: "0.12rem",
					},
					{
						type: "img",
						url: "https://yaame-static.yaame.io/admin/f7396132da1633a3d5327b604a978df1.png",
					},
                ],
			},
		]);

		const activeChange = (val) => {
			console.log(val);
		};

		onMounted(() => {

            if (Number(getVerCode()) >= 11100) {
                console.log(1);
                // 将object插入到detailsList中索引3的位置
                detailsList.value.splice(2, 0, {
                    // VIP 礼物
                    desc: "dynamic_room_bg",
                    content: [
                        {
                            type: "text",
                            key: "dynamic_room_bg_1",
                            marginBottom: "0.12rem",
                        },
                        {
                            type: "img",
                            url: "https://yaame-static.yaame.io/admin/940da75222befcdf367e51ec3109562f.png",
                        },
                    ],
                },);
            }

			getData();
			window.addEventListener("scroll", pageChange);

			document.body.style.backgroundColor = "#2d210f";
		});
		onUnmounted(() => {
			window.removeEventListener("scroll", pageChange);
		});
		return {
			language,
			safeHeight,

			headerWhite,
			back,
			active,
			activeChange,

			privilegeConfigs,

			detailsList,
		};
	},
};
</script>
<style lang="less" scoped>
@color-no-selected-text: #52504c;
.color-white {
	color: #fff;
}
.text-align-right {
	text-align: right;
}
.color-pri {
	color: #ffd5b8;
}
.details {
	width: 7.5rem;
	min-height: 100vh;
	padding-top: 0.88rem;
	font-size: 0.24rem;
	color: #1e1608;
	background-size: contain;
	background-repeat: no-repeat;
	background-image: url(https://yaame-static.yaame.io/admin/b6659d596cf63e35f2260bf6dac29ec4.png);
	&.ar {
		.page-header {
			.back-img {
				right: 0.3rem;
				left: auto;
				transform: rotate(180deg);
			}
			.info-img {
				left: 0.3rem;
			}
		}
	}
	.page-header {
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
	}
	.noble-type /deep/.van-tab {
		width: auto;
		margin-right: 0;
		padding: 0 12px;
	}

    // .noble-type /deep/.van-tab--active {
    //     width: 1.68rem!important;
    //     .p-img {
    //         width: 1.2rem;
    //         height: 1.2rem;
    //     }
    // }
	.noble-type /deep/.van-tabs__nav {
		background-color: transparent;
		padding: 0 0.1rem;
	}
	.noble-type /deep/.van-tabs__line {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 0.2rem;
		height: 0.06rem;
		background-color: transparent;
	}
	/deep/.van-tabs__wrap {
		height: 1.7rem;
	}
	.noble-type {
		height: 1.7rem;
		align-items: center;
	}
	.noble-tab-item {
		color: @color-no-selected-text;
		font-size: 0.3rem;
		position: relative;
		&.active {
			.img-container {
                width: 1.2rem;
                height: 1.2rem;
                position: relative;
				.p-img {
                    display: block;
					width: 1.2rem!important;
					height: 1.2rem;
					opacity: 1;
				}
                .icon-img {
                    height: 0.3rem;
                    width: auto;
                    position: absolute;
                    top: -0.25rem;
                    right: -0.25rem;
                }
			}
		}
		.img-container {
			width: 0.9rem;
			height: 0.9rem;
			display: flex;
			justify-content: center;
			align-items: center;
			.p-img {
				width: 0.9rem;
				height: 0.9rem;
				// opacity: 0.3;
			}
            .icon-img {
                height: 0.25rem;
                width: auto;
                position: absolute;
                top: -0.1rem;
                right: -0.1rem;
            }
		}
	}
	// .noble-type /deep/.van-tabs__content {
	//     border-top-right-radius: 0.24rem;
	//     border-top-left-radius: 0.24rem;
	//     background-color: pink;
	// }
	// .noble-type /deep/.van-tab__pane {
	//     border-top-right-radius: 0.24rem;
	//     border-top-left-radius: 0.24rem;
	//     background-color: pink;
	// }
	.content-container {
		width: 7.5rem;
		height: auto;
		background-size: contain;
		background-repeat: no-repeat;
		background-image: url(https://yaame-static.yaame.io/admin/cfabfe3ea3ad25b20281af8ae5ac6ff4.png);
		min-height: calc(100vh - 4rem);
		padding: 1.25rem 0.4rem 0.4rem;
		font-size: 0.22rem;
		font-weight: 400;
		color: #d9b99f;
		border-top-right-radius: 0.24rem;
		border-top-left-radius: 0.24rem;
		background-color: #2d210f;
		position: relative;
		.title {
			display: inline-block;
			min-width: 2.5rem;
			padding: 0 0.2rem;
			text-align: center;
			font-size: 0.28rem;
			font-weight: 600;
			color: #ffbd52;
			position: absolute;
			left: 50%;
			top: 0.26rem;
			transform: translate(-50%, -0%);
			&::after {
				content: "";
				position: absolute;
				bottom: 0.1rem;
                bottom: 50%;
                transform: translateY(50%);
				left: -1.63rem;
				width: 1.63rem;
				height: 0.2rem;
				background-size: contain;
				background-repeat: no-repeat;
				background-image: url(https://yaame-static.yaame.io/admin/7ca27b5df898eff09eabb9631bc3f542.png);
				color: #ffbd52;
			}
			&::before {
				content: "";
				position: absolute;
				bottom: 50%;
                transform: translateY(50%);
				right: -1.63rem;
				width: 1.63rem;
				height: 0.2rem;
				background-size: contain;
				background-repeat: no-repeat;
				background-image: url(https://yaame-static.yaame.io/admin/d8dd25833cf5f0018bb28b3d577401a4.png);
				color: #ffbd52;
			}
		}
		img {
			width: 6.7rem;
			height: auto;
			display: block;
			margin-top: 0.3rem;
			margin-bottom: 0.6rem;
		}
	}
}
</style>
