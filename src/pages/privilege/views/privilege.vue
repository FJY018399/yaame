<template>
	<div
		:style="{ paddingTop: isFullScreen ? safeHeight + 0.88 + 'rem' : '0.88rem' }"
		:class="['privilege', language]"
	>
		<header
			:style="{
				background: headerWhite ? '#121F26' : '',
				height: isFullScreen ? safeHeight + 0.88 + 'rem' : '0.88rem',
			}"
			class="page-header"
		>
			
            <div class="back-img" @click="back">
                <img
                    src="https://yaame-static.yaame.io/admin/2a3fcadb7a3b0bf487b8c7d548b1c5d8.png"
                    @click="back"
                />
            </div>
			<div class="header-content">{{ $t('title') }}</div>
			<img
				src="https://yaame-static.yaame.io/admin/464e5310e3305f0b80b2e20f134b7a73.png"
				class="info-img"
				@click="toDesc"
			/>
		</header>

		<van-tabs
			v-model="nobleActive"
			:swipe-threshold="2"
			swipeable
			class="noble-type"
			@change="nobleActiveChange"
		>
			<van-tab v-for="(item, index) in nobleLevels" :key="index">
				<template #title>
					<div
						:class="{
							'noble-tab-item': true,
							active: nobleActive === index,
						}"
					>
						{{ item.noble_name }}
					</div>
				</template>
				<template #default>
					<div class="canvas-container">
						<canvas class="nobel-canvas" :id="`canvas-id-${index}`"></canvas>

						<div class="nobel-level">{{ $t('privilegeProgress', [nobleLevels[nobleActive].unlock_privileges.length, privileges.length]) }}</div>
					</div>

					<div class="privilege-list">
						<div
							v-for="(item, index) in privilegesList"
							:key="index"
							:class="['privilege-item', !item.isUnlock && 'isUnlock']"
							@click="toDetails(item, index)"
						>
							<img :src="item.privilege_img" alt="" />
							<p>{{ item.privilege_name }}</p>
						</div>
					</div>
				</template>
			</van-tab>
		</van-tabs>

		<div class="user-info">
			<div class="user-container">
				<div class="user-noble">
					<div class="user-avatar">
						<img :src="userInfo.avatar" />
					</div>
					<div>
						<p class="user-title-p" v-if="userNobleInfo.noble_level === -1">
							{{ $t('noNobel') }}
						</p>
						<p class="user-title-p" v-else>{{ userNobleInfo.noble_name }}</p>

						<p v-if="!userNobleInfo.expiration">{{ $t('expiration') }}: ---- -- --</p>
						<p v-else>{{ $t('expiration') }}: {{ userNobleInfo.expiration }}</p>
					</div>
				</div>
				<div class="noble-value">
					<p style="font-size: 0.24rem;" class="user-title-p color-white">
						<img
							src="https://yaame-static.yaame.io/admin/8d09e5a6ed41fa7d1fb6853aae540a16.png"
                            style="margin-bottom: 0.04rem"
							alt=""
                            @click="toDesc"
						/>
						{{ $t('nobleExperience') }}
					</p>
					<p class="text-align-right color-pri">{{ userNobleInfo.noble_level_point }}</p>
				</div>
			</div>
			<div class="process-container">
				<div class="process">
					<div :style="{ width: processWidth }" class="process-content"></div>

					<div
						v-for="item in 5"
						:key="item"
						:style="{ left: item * 16.6 + '%' }"
						class="process-point"
					></div>
				</div>
				<div class="process-info">
					<div v-if="userNobleInfo.noble_level === -1">
						<p>0</p>
					</div>

					<div v-else>
						<p v-if="userNobleInfo.progress_vo && userNobleInfo.progress_vo.left_noble_name">{{ userNobleInfo.progress_vo.left_noble_name }}</p>
						<p v-if="userNobleInfo.progress_vo && userNobleInfo.progress_vo.level_min_point">{{ userNobleInfo.progress_vo.level_min_point }}</p>
                        <p v-else>0</p>
					</div>

					<div style="width: 3rem; text-align: center;" v-if="userNobleInfo.noble_level !== -1">
						<p v-if="userNobleInfo.progress_vo && userNobleInfo.progress_vo.relegation_desc">{{ userNobleInfo.progress_vo.relegation_desc }}</p>
					</div>

					<div v-if="userNobleInfo.progress_vo">
						<p v-if="userNobleInfo.progress_vo.right_noble_name">{{ userNobleInfo.progress_vo.right_noble_name }}</p>
						<p v-if="userNobleInfo.progress_vo.level_max_point">{{ userNobleInfo.progress_vo.level_max_point }}</p>
					</div>
				</div>
			</div>
		</div>

        <pageLoading v-if="pageLoading"></pageLoading>
	</div>
</template>

<script>
import {
	computed,
	onMounted,
	onUnmounted,
	ref,
	getCurrentInstance,
	nextTick,
	onUpdated,
} from "vue";
import { getLanguage, getSafeHeight, isIOS } from "@/lib/device";
import { getScrollTop, getQueryString } from "@/lib/utils";
import { getNobleInfo } from "@/lib/request/noble";
import { Downloader, Parser, Player } from "svga.lite";
import DB from "svga.lite/db";
import pageLoading from "@/components/common/page_loading.vue";

import { PAGInit } from 'libpag';
export default {
    components: {
        pageLoading
    },
	setup() {
		const root = getCurrentInstance();
		const router = root.proxy.$router;
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
			location.href = `wlyaame://webview/back`;
		};
        

		let nobleActive = ref(0);
        if (getQueryString("index")) {
            nobleActive.value = Number(getQueryString("index"));
        }
		let nobleLevels = ref([]);
		const nobleActiveChange = (index) => {

            svgaArr[index].pageView && svgaArr[index].pageView.pause();
			nobleActive.value = index;
            if (!svgaArr[index].parser) {
                nextTick(() => {
                    initSVGAData(svgaArr[index], "canvas-id-" + index, svgaPathArr[index]);
                })
            }
		};

		let userInfo = ref({});
		let userNobleInfo = ref({});
		let privileges = ref([]);
        let pageLoading = ref(true);
		const getData = async () => {
			try {
				let res = await getNobleInfo();
				if (res.status === 1000) {
					nobleLevels.value = res.data.noble_levels;
					userInfo.value = res.data.user_info;
					userNobleInfo.value = res.data.user_noble_info;
					privileges.value = res.data.privileges;
				}
			} catch (error) {
				console.log(error);
			}

            nextTick(() => {
                pageLoading.value = false;
            })
		};

		let privilegesList = computed(() => {
			let unlockValues = nobleLevels.value[nobleActive.value].unlock_privileges;

			let updatedPrivilegesArray = privileges.value.map((privilege) => {
				let isUnlock = unlockValues.includes(privilege.privilege_value);
				return { ...privilege, isUnlock };
			});

			return updatedPrivilegesArray;
		});

		const toDesc = () => {
			router.push({ name: "rule" });
		};

		const toDetails = (item, index) => {
			if (item.isUnlock) {
				router.push({
					name: "details",
					query: {
						nobleActive: nobleActive.value,
						privilegeActive: index,
					},
				});
			}
		};

		let svgaArr = [
			{
				downloader: null,
				parser: null,
				player: null,
				svgaStaticData: null,
				svgaAttackData: null,

                pageView: null,
			},
            {
                downloader: null,
                parser: null,
                player: null,
                svgaStaticData: null,
                svgaAttackData: null,

                pageView: null,
            },
            {
                downloader: null,
                parser: null,
                player: null,
                svgaStaticData: null,
                svgaAttackData: null,

                pageView: null,
            },
            {
                downloader: null,
                parser: null,
                player: null,
                svgaStaticData: null,
                svgaAttackData: null,

                pageView: null,
            },
            {
                downloader: null,
                parser: null,
                player: null,
                svgaStaticData: null,
                svgaAttackData: null,

                pageView: null,
            },
            {
                downloader: null,
                parser: null,
                player: null,
                svgaStaticData: null,
                svgaAttackData: null,

                pageView: null,
            },
            {
                downloader: null,
                parser: null,
                player: null,
                svgaStaticData: null,
                svgaAttackData: null,

                pageView: null,
            },
		];
		let svgaPathArr = [
			"https://yaame-static.yaame.io/admin/6389a4c50933ff52fca582f8f875df6f.svga",
			"https://yaame-static.yaame.io/admin/ccacb39cc40ae171bc48dfad7a4445a2.svga",
			"https://yaame-static.yaame.io/admin/30e312464caf56ddc049df287fce45df.svga",
			"https://yaame-static.yaame.io/admin/1d436a63464aba6f397bc82ae6cd824f.svga",
			"https://yaame-static.yaame.io/admin/72df37acb98608deb4cec3818e703517.svga",
			"https://yaame-static.yaame.io/admin/f81cbdd7eb9696b46e2d498b010f0c0c.svga",
			"https://yaame-static.yaame.io/admin/66081122920ead11da851e9763abf606.svga",
		];

        let pagPathArr = [
            'https://yaame-static.yaame.io/admin/85896e16b9246d91da1762e61f72b732.pag',
            'https://yaame-static.yaame.io/admin/f237a88adda75e781d287e1b2541336e.pag',
            'https://yaame-static.yaame.io/admin/b000a288ed6b9d37cecdae2d7dec5c2b.pag',
            'https://yaame-static.yaame.io/admin/d32d3c4d3681002888d4724449efcc69.pag',
            'https://yaame-static.yaame.io/admin/e80ec8da664cd64a579e9bf54b31b9f2.pag',
            'https://yaame-static.yaame.io/admin/7cb74c8897d5f807866ec8ae8fb3a497.pag',
            'https://yaame-static.yaame.io/admin/d68236af978528e204bf09bb7cd202c8.pag'
        ]

		const initSVGAData = async (obj, canvas, svga_static) => {
			let options = obj;
			options.downloader = new Downloader();
			// 默认调用 WebWorker 线程解析
			// 可配置 new Parser({ disableWorker: true }) 禁止
			options.parser = new Parser();
			// #canvas 是 HTMLCanvasElement
			options.player = new Player(`#${canvas}`);

			let fileOptions = void 0;
			let db = void 0;
			try {
				db = new DB();
			} catch (error) {
				console.error(error);
			}
			if (db) {
				fileOptions = await db.find(svga_static);
			}

			if (fileOptions) {
				options.svgaStaticData = fileOptions;
			} else {
				const fileStaticData = await options.downloader.get(svga_static);
				options.svgaStaticData = await options.parser.do(fileStaticData);

				db && (await db.insert(svga_static, options.svgaStaticData));
			}

			options.player.set({ loop: 0 });

			await options.player.mount(options.svgaStaticData);
			options.player.start();
		};

        let processWidth = computed(() => {
            if (userNobleInfo.value.progress_vo && userNobleInfo.value.progress_vo.level_max_point) {
                let process = (userNobleInfo.value.noble_level_point - userNobleInfo.value.progress_vo.level_min_point) / (userNobleInfo.value.progress_vo.level_max_point - userNobleInfo.value.progress_vo.level_min_point);
                if (process > 1) {
                    process = 1;
                }
                return process * 100 + "%";
            } else {
                return '0%';
            }
        });

        let privilegeNum = computed(() => {
            let unlockValues = nobleLevels.value[nobleActive.value].unlock_privileges;
            let num = 0;
            privileges.value.forEach((item) => {
                if (unlockValues.includes(item.privilege_value)) {
                    num++;
                }
            });
            return num;
        });

        const initPAG = async(obj, id, url) => {
            if (obj.pageView) {
                console.log(obj.pageView);
                await obj.pageView.play();
                return
            }
            const PAG = await PAGInit();
            const buffer = await fetch(url).then(response =>
                response.arrayBuffer()
            );
            const pagFile = await PAG.PAGFile.load(buffer);
            const canvas = document.getElementById(id);
            canvas.width = pagFile.width();
            canvas.height = pagFile.height();
            const pagView = await PAG.PAGView.init(pagFile, canvas);
            obj.pageView = pagView;
            pagView.setRepeatCount(0);
            await pagView.play();
        }

		onMounted(() => {
			getData();
			window.addEventListener("scroll", pageChange);
            document.body.style.backgroundColor = '#1B262D';
            // setTimeout(() => {
            //     initPAG('https://imgcom.static.suishenyun.net/bg-new-4281c9.pag', 'canvas-id-0');
            // }, 2000);
            // document.querySelector('.van-tabs__wrap').style.top = safeHeight.value + 0.88 + 'rem';
            if (isIOS()) {
                window.webkit.messageHandlers.onLogEvent.postMessage(JSON.stringify({
                    event_name: 'page_view_noble',
                    cid: -1004,
                    md: 108,
                    args_name: 'page_view_noble',

                }));
            } else {
                window.peanut_client.onLogEvent(JSON.stringify({
                    event_name: 'page_view_noble',
                    cid: -1004,
                    md: 108,
                    args_name: 'page_view_noble',
                }));
            }
		});

        let isFullScreen = computed(() => {
            if (location.href.indexOf('is_full_screen') > -1) {
                return true;
            } else {
                return false;
            }
        });
		onUpdated(() => {
            if (!svgaArr[nobleActive.value].parser) {
                initSVGAData(svgaArr[nobleActive.value], "canvas-id-" + nobleActive.value, svgaPathArr[nobleActive.value]);
            }
		});
		onUnmounted(() => {
			window.removeEventListener("scroll", pageChange);
		});
		return {
			language,
			safeHeight,

			headerWhite,
			back,

			nobleActive,
			nobleActiveChange,
			nobleLevels,

			userInfo,
			userNobleInfo,
			privileges,
			privilegesList,

			toDesc,
			toDetails,

            processWidth,
            privilegeNum,

            pageLoading,

            isFullScreen,
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
.privilege {
	width: 7.5rem;
	// min-height: 100vh;
	padding-top: 0.88rem;
	font-size: 0.24rem;
	color: #D9B99F;
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
		background-color: #142128;
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
	.noble-type /deep/.van-tabs__nav {
		background-color: #142128;
		padding: 0 0.1rem;
	}
	.noble-type /deep/.van-tabs__line {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 0.2rem;
		height: 0.06rem;
		background-color: #ecdac8;
	}
	.noble-type {
		height: 0.7rem;
		align-items: center;
	}
    // .noble-type /deep/.van-tabs__wrap {
    //     position: fixed;
    //     top: 0;
    //     left: 0;
    //     background-color: #1B262D;
    //     z-index: 9999;
    // }
	.noble-tab-item {
		color: @color-no-selected-text;
		font-size: 0.3rem;
		position: relative;
		&.active {
			color: #d9b99f;
		}
	}

	.canvas-container {
		width: 7.5rem;
		height: 4.26rem;
		background-image: url(https://yaame-static.yaame.io/admin/f6568955cdbad37fb1cd4cd1f9aa9a90.png);
		background-repeat: no-repeat;
		background-size: 7.5rem auto;
		background-position: center -2.3rem;
		position: relative;
		.nobel-canvas {
			width: 3rem;
			height: 3rem;
			position: absolute;
			left: 50%;
			top: 40%;
			transform: translate(-50%, -50%);
		}
		.nobel-level {
			width: 2.8rem;
			height: 0.64rem;
			line-height: 0.64rem;
			background-image: url(https://yaame-static.yaame.io/admin/844a453ae8a2502c2d728ac91c5163c4.png);
			background-repeat: no-repeat;
			background-size: contain;
			position: absolute;
			left: 2.35rem;
			top: 3.32rem;
			text-align: center;
			font-size: 0.26rem;
			font-weight: 600;
			color: #fdebdf;
		}
	}
	.privilege-list {
		width: 7.5rem;
		// height: 13.46rem;
		background-image: url(https://yaame-static.yaame.io/admin/4280fa106c66d526707fe555fd8e7d27.png);
		background-size: contain;
		background-repeat: no-repeat;
		display: flex;
		padding-top: 0.6rem;
		flex-wrap: wrap;
		padding-bottom: 2.1rem;
		.privilege-item {
			width: 2.5rem;
			height: 1.16rem;
			color: #c8af9a;
			position: relative;
			margin-bottom: 0.66rem;
			flex-basis: 2.5rem;
			flex-shrink: 0;

			&.isUnlock {
				opacity: 0.3;
			}
			img {
				width: 0.7rem;
				display: block;
				height: 0.7rem;
				margin: 0 auto;
			}
			p {
				width: 2.5rem;
				text-align: center;
				margin-top: 0.12rem;
			}
		}
	}
	.user-info {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 7.5rem;
		height: 2.7rem;
		background: linear-gradient(180deg, #313d45 0%, #222e32 100%);
		border-radius: 0.24rem 0.24rem 0 0;
		.user-container {
			width: 7.5rem;
			height: 1.3rem;
			display: flex;
			padding: 0.3rem 0.3rem 0 0.3rem;
			justify-content: space-between;
			.user-title-p {
				font-size: 0.3rem;
				img {
					width: 0.24rem;
					height: 0.24rem;
					vertical-align: middle;
				}
			}
			.user-noble {
				display: flex;
				.user-avatar {
					width: 0.8rem;
					height: 0.8rem;
					border-radius: 0.8rem;
					border: 0.02rem solid #cfb29b;
					margin-right: 0.3rem;
					img {
						width: 0.76rem;
						height: 0.76rem;
						display: block;
						border-radius: 0.76rem;
					}
				}
			}
			.noble-value {
			}
		}
		.process-container {
			width: 6.9rem;
			margin-left: 0.3rem;
			.process {
				width: 6.9rem;
				height: 0.2rem;
				background: rgba(255, 218, 180, 0.2);
				border-radius: 1rem;
				position: relative;
				margin-bottom: 0.14rem;
				.process-content {
					width: 30%;
					height: 0.2rem;
					background: linear-gradient(135deg, #fddab9 0%, #fdbd99 100%);
					border-radius: 1rem;
					position: relative;
					z-index: 1;
				}
				.process-point {
					position: absolute;
					width: 0.04rem;
					height: 0.06rem;
					background: #a8968c;
					border-radius: 1rem 1rem 0 0;
					bottom: 0;
				}
			}
			.process-info {
				width: 6.9rem;
				display: flex;
				justify-content: space-between;
				color: #b7a69b;
			}
		}
	}
}
</style>
