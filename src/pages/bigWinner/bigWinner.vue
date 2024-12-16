<template>
	<div :class="['main', language, tabActive]">
		<!-- 各种音效 -->
		<audio
			ref="audio-bg"
			loop
			:autoplay="true"
			:src="audio.bg"
			@error="handleAudioError"
		></audio>
		<audio
			ref="audio-modal"
			:autoplay="false"
			:src="audio.modal"
			@error="handleAudioError"
		></audio>
		<audio
			ref="audio-result"
			:autoplay="false"
			:src="audio.result"
			@error="handleAudioError"
		></audio>
		<audio
			ref="audio-timeActive"
			loop
			:autoplay="false"
			:src="audio.timeActive"
			@error="handleAudioError"
		></audio>
		<audio
			ref="audio-switch"
			:autoplay="false"
			:src="audio.switch"
			@error="handleAudioError"
		></audio>
		<audio
			ref="audio-bet"
			:autoplay="false"
			:src="audio.bet"
			@error="handleAudioError"
		></audio>
		<img :src="titleImgList[language][tabActive]" class="title" alt="title" />

		<img
			src="https://yaame-static.yaame.io/admin/e62b76d5089b5fc2b3aa8405646bbc29.png"
			class="home-icon"
			@click="goBack"
		/>
		<img
			src="https://yaame-static.yaame.io/admin/f34d3bc382be64569a189ca94531fc62.png"
			class="rule-icon"
			@click="ruleVisible = true"
		/>
		<img
			src="https://yaame-static.yaame.io/admin/0f0e6f18cd75fcfd5190068f104473bd.png"
			class="record-icon"
			@click="recordHandle"
		/>

		<img
			v-if="audioPlaying"
			class="bgm"
			:class="{ stop: !audioPlaying }"
			src="https://yaame-static.yaame.io/admin/a01ac66763b8ed05d6b8e802aa4130e3.png"
			@click="playBGM"
		/>
		<img
			v-else
			class="bgm"
			:class="{ stop: !audioPlaying }"
			src="https://yaame-static.yaame.io/admin/60b6207e93a43aecd64f885b9a599d08.png"
			@click="playBGM"
		/>

		<div :class="['tab-container', tabActive]">
			<div @click="tabChange('Silver')">{{ $t("silver") }}</div>
			<div @click="tabChange('Gold')">{{ $t("gold") }}</div>
		</div>

		<div class="machine-container">
			<div class="activity-times">
				<van-notice-bar :scrollable="false">
					<van-swipe
						:autoplay="3000"
						:show-indicators="false"
						vertical
						class="notice-swipe"
					>
						<van-swipe-item v-for="(item, index) in rewardBanners" :key="index">
							<p class="swipe-item-p no-wrap">
								{{ item }}
							</p>
						</van-swipe-item>
					</van-swipe>
				</van-notice-bar>
			</div>

			<img
				v-show="tabActive === 'Silver'"
				src="https://yaame-static.yaame.io/admin/a01bb439174f4c5ed2a3c852c11265b0.png"
				class="little-title"
			/>
			<img
				v-show="tabActive === 'Gold'"
				src="https://yaame-static.yaame.io/admin/fcca9f1a2f729e6fdaf95aceb92facd4.png"
				class="little-title"
			/>

			<div :class="['reward-container', tabActive]">
				<div
					v-for="(item, index) in rewardList"
					:key="index"
					:class="[
						'reward-item',
						'reward-item-' + index,
						current === index && 'active',
					]"
				>
					<img class="reward-img" :src="item.reward_icon" />
					<p class="reward-name no-wrap">
						<img
							src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png"
						/>
						{{ item.worth_diamonds }}
					</p>
				</div>
			</div>

			<div>
				<div class="one-btn">
					<img
						:src="btnImgList[language][tabActive]['one']"
						class="btn-img press-animation"
						@click="drawClick(1, $event)"
					/>
					<img
						v-if="must_win_card_num && tabActive === 'Silver'"
						:src="cardImgList[language]"
						alt=""
						class="card-img"
						@click="openCard"
					/>
				</div>
				<img
					:src="btnImgList[language][tabActive]['ten']"
					class="ten-btn press-animation"
					@click="drawClick(10, $event)"
				/>
				<img
					:src="btnImgList[language][tabActive]['hundred']"
					class="hundred-btn press-animation"
					@click="drawClick(100, $event)"
				/>
			</div>

			<div :class="['info-container', tabActive]" style="left: 0.36rem">
				<p>
					<span class="title-span"
						>{{ $t("my")
						}}<img
							src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png"
						/>:</span
					>
					{{ diamond_balance }}
				</p>
				<p>
					<span class="title-span"
						>{{ $t("won")
						}}<img
							src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png"
						/>:</span
					>
					{{ todayWinDiamonds }}
				</p>
			</div>
			<div
				:class="['info-container', tabActive]"
				style="left: 3.9rem"
				@click="goRank"
			>
				<div class="avatar-address">
					<img :src="topUser.avatar" alt="" />
				</div>
				<p class="title-p no-wrap">{{ $t("todayChampion") }}</p>

				<p class="value-p no-wrap">
					<img
						src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png"
					/>{{ topUser.win_diamonds }}
				</p>

				<img
					v-if="tabActive === 'Silver'"
					class="live-icon"
					src="https://yaame-static.yaame.io/admin/d813ad4e0c1801a6c0813f7fbf1bb990.png"
				/>
				<img
					v-else
					class="live-icon"
					src="https://yaame-static.yaame.io/admin/e4d9fb448e3ab5ae030cbb6e86775b85.png"
				/>
			</div>

			<div class="animation-container">
				<img
					v-show="tabActive === 'Silver'"
					src="https://yaame-static.yaame.io/admin/4e84ba824f26d446abbb4937c92d9c17.png"
					class="animation-icon"
				/>
				<img
					v-show="tabActive === 'Gold'"
					class="animation-icon"
					src="https://yaame-static.yaame.io/admin/22424f5735d52a278fdc6b14e8604ad7.png"
				/>
				<p class="animation-text">{{ $t("gameAnimation") }}</p>
				<img
					v-show="tabActive === 'Silver' && silverAnimationVisible"
					src="https://yaame-static.yaame.io/admin/613b05005da010d3d51b3df5b44a098f.png"
					class="animation-toggle"
					@click="silverAnimationVisible = !silverAnimationVisible"
				/>
				<img
					v-show="tabActive === 'Silver' && !silverAnimationVisible"
					src="https://yaame-static.yaame.io/admin/12092d39d12746fc8a40c60025eeb35d.png"
					class="animation-toggle"
					@click="silverAnimationVisible = !silverAnimationVisible"
				/>

				<img
					v-show="tabActive === 'Gold' && goldAnimationVisible"
					class="animation-toggle"
					src="https://yaame-static.yaame.io/admin/686737deca44c0eea7f72709e2ba9813.png"
					@click="goldAnimationVisible = !goldAnimationVisible"
				/>
				<img
					v-show="tabActive === 'Gold' && !goldAnimationVisible"
					src="https://yaame-static.yaame.io/admin/8d69310439481377f1b360817ff45541.png"
					class="animation-toggle"
					@click="goldAnimationVisible = !goldAnimationVisible"
				/>
			</div>
		</div>

		<popup v-show="ruleVisible" class="flex-container">
			<div class="popup-container rule-container">
				<div class="title-p">{{ $t("rules") }}</div>
				<p v-show="tabActive === 'Silver'">{{ $t("rule1") }}</p>
				<p v-show="tabActive === 'Gold'">{{ $t("rule2") }}</p>
				<p>{{ $t("rule3") }}</p>
				<p>{{ $t("rule4") }}</p>
				<p>{{ $t("rule5") }}</p>

				<img
					class="close-icon"
					src="https://yaame-static.yaame.io/admin/5238bb839dac25082773494bed23541e.png"
					@click="ruleVisible = false"
				/>
			</div>
		</popup>

		<popup v-show="recordVisible" class="flex-container">
			<div class="popup-container record-container">
				<div class="title-p">{{ $t("drawRecord") }}</div>

				<div v-if="lottery_logs.length > 0" class="record-list">
					<div
						v-for="(item, index) in lottery_logs"
						:key="index"
						class="record-item"
					>
						<p class="item-p">
							{{ formatDate(item.lottery_time, "yyyy-MM-dd hh:mm:ss") }}
						</p>

						<div class="reward-list">
							<div
								v-for="(ele, inx) in item.lottery_rewards"
								:key="inx"
								class="reward-item"
							>
								<div class="reward-img">
									<img :src="ele.reward_icon" />
								</div>
								<p class="reward-name">
									<img
										src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png"
									/>
									{{ ele.worth_diamonds }}
								</p>
								<p class="reward-num">{{ ele.reward_amount }}</p>
							</div>
						</div>
					</div>
				</div>

				<p v-else class="empty">{{ $t("noGameParticipation") }}</p>

				<img
					class="close-icon"
					src="https://yaame-static.yaame.io/admin/5238bb839dac25082773494bed23541e.png"
					@click="recordVisible = false"
				/>
			</div>
		</popup>

		<popup v-show="drawVisible" class="flex-container">
			<div class="popup-container draw-container">
				<div class="title-p">{{ $t("myPrizes") }}</div>
				<div v-show="cardFlag" class="card-flag-text title">{{ $t('yourLuckIsTooGood') }}</div>
				<div v-if="resultList.length === 1" class="one-reward">
					<div class="reward-img">
						<img :src="resultList[0].reward_icon" />
						<span class="num">{{ resultList[0].reward_amount }}</span>
					</div>
					<div v-if="cardFlag" class="card-flag-text">
						{{ $t('useSureCardWon') }}
						<img
							src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png"
							alt=""
						/>
					</div>
					<p v-else class="reward-name">
						<img
							src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png"
						/>
						{{ resultList[0].worth_diamonds }}
					</p>
				</div>

				<div v-if="resultList.length === 2" class="two-reward">
					<div
						v-for="(item, index) in resultList"
						:key="index"
						class="two-reward-item"
					>
						<div class="reward-img">
							<img :src="item.reward_icon" />
							<span class="num">{{ item.reward_amount }}</span>
						</div>
						<p class="reward-name">
							<img
								src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png"
							/>
							{{ item.worth_diamonds }}
						</p>
					</div>
				</div>

				<div v-if="resultList.length === 3" class="three-reward">
					<div
						v-for="(item, index) in resultList"
						:key="index"
						class="three-reward-item"
					>
						<div class="reward-img">
							<img :src="item.reward_icon" />
							<span class="num">{{ item.reward_amount }}</span>
						</div>
						<p class="reward-name">
							<img
								src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png"
							/>
							{{ item.worth_diamonds }}
						</p>
					</div>
				</div>

				<div v-else-if="resultList.length > 3" class="more-reward">
					<div
						v-for="(item, index) in resultList"
						:key="index"
						class="more-reward-item"
					>
						<div class="reward-img">
							<img :src="item.reward_icon" />
							<span class="num">{{ item.reward_amount }}</span>
						</div>
						<p class="reward-name">
							<img
								src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png"
							/>
							{{ item.worth_diamonds }}
						</p>
					</div>
				</div>
				<div class="footer-btn">
					<div class="btn" @click="drawClick(1)">
						<p>{{ $t("once") }}</p>
						<p style="margin-top: 0.06rem">
							<img
								src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png"
							/>
							{{ tabActive === "Silver" ? 20 : 300 }}
						</p>
					</div>
					<div class="btn" @click="drawClick(10)">
						<p>{{ $t("tenTimes") }}</p>
						<p style="margin-top: 0.06rem">
							<img
								src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png"
							/>
							{{ tabActive === "Silver" ? 200 : 3000 }}
						</p>
					</div>
					<div class="btn" @click="drawClick(100)">
						<p>{{ $t("hundredTimes") }}</p>
						<p style="margin-top: 0.06rem">
							<img
								src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png"
							/>
							{{ tabActive === "Silver" ? 2000 : 30000 }}
						</p>
					</div>
				</div>

				<img
					class="close-icon"
					src="https://yaame-static.yaame.io/admin/5238bb839dac25082773494bed23541e.png"
					@click="
						drawVisible = false;
						flash();
					"
				/>
			</div>
		</popup>

		<!-- <Rank v-if="rankVisible" :language="language"></Rank> -->

		<!-- 必赚卡弹窗 -->
		<popup v-show="cardVisible" class="flex-container">
			<div class="card-container">
				<img class="content-img" :src="cardContentImg[language]" alt="" />

				<div class="btn-img" @click="drawClick(1, $event, true)">
					<img
						style="width: 0.48rem"
						:src="cardImgList[language]"
						alt=""
					/>
					+20
					<img
						style="width: 0.36rem"
						src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png"
						alt=""
					/>
					1{{ $t("times") }}
				</div>

				<div class="close-btn" @click="cardVisible = false"></div>
			</div>
		</popup>
	</div>
</template>

<script>
import Header from "../../components/common/header.vue";
import popup from "../../components/common/pop_up.vue";
// import Rank from "./components/rank.vue";
import { getLanguage } from "@/lib/device";
import pageLoading from "../../components/common/page_loading.vue";
import { formatDate } from "@/lib/utils";
import Toast from "../../components/third/toast/toast";
import request from "@/lib/request/draw.js";
import { burialPointFun } from "@/lib/utils";
import { getQueryString } from "../../lib/utils";
const getDefaultItem = () => {
	return {
		avatar:
			'"https://static.yaame.io/admin/e4a419c9d7d94db41ea41e3f810a3759.png',
		win_diamonds: "-",
	};
};
export default {
	components: {
		Header,
		pageLoading,
		popup,
		// Rank,
	},
	data() {
		return {
			titleImgList: {
				"zh-cn": {
					Silver:
						"https://yaame-static.yaame.io/admin/78f4ff850d7351990a1ac380884487ef.png",
					Gold: "https://yaame-static.yaame.io/admin/4fc0058432f3c12885733a470877f0c4.png",
				},
				"zh-tw": {
					Silver:
						"https://yaame-static.yaame.io/admin/574b1e0d253f33fdc4f9e081c90606ee.png",
					Gold: "https://yaame-static.yaame.io/admin/c64d9776ec1c496c9155c02d32479bd0.png",
				},
				en: {
					Silver:
						"https://yaame-static.yaame.io/admin/353cf532211c2509162be7505e7c44ad.png",
					Gold: "https://yaame-static.yaame.io/admin/0f7ba345d76dfaadf7ed3ca48df36f3b.png",
				},
				ar: {
					Silver:
						"https://yaame-static.yaame.io/admin/e96bb1e17f722eb0998731e5c58b24e0.png",
					Gold: "https://yaame-static.yaame.io/admin/3cfca10790a16348e3f8317909e96005.png",
				},
				id: {
					Silver:
						"https://yaame-static.yaame.io/admin/c69d6b7e1152d0fdfd6148384a1420d8.png",
					Gold: "https://yaame-static.yaame.io/admin/f1eee541df90dc3f76d8d6b28fc81bfc.png",
				},
			},

			btnImgList: {
				"zh-cn": {
					Silver: {
						one: "https://yaame-static.yaame.io/admin/97b7ff8f5ad8238a24786a48fa998bb4.png",
						ten: "https://yaame-static.yaame.io/admin/fbf749725c38bcd839a4fe3de47fa77d.png",
						hundred:
							"https://yaame-static.yaame.io/admin/21af3c627cd2ab44f6de7f15de8f37e1.png",
					},
					Gold: {
						one: "https://yaame-static.yaame.io/admin/da50d1b145386de66f713fc704ff43ed.png",
						ten: "https://yaame-static.yaame.io/admin/818f8ee5f421cb94acc9f5a35d57db5f.png",
						hundred:
							"https://yaame-static.yaame.io/admin/8bdb8f033f6dd7b3fdde119005dbd062.png",
					},
				},
				"zh-tw": {
					Silver: {
						one: "https://yaame-static.yaame.io/admin/97b7ff8f5ad8238a24786a48fa998bb4.png",
						ten: "https://yaame-static.yaame.io/admin/fbf749725c38bcd839a4fe3de47fa77d.png",
						hundred:
							"https://yaame-static.yaame.io/admin/21af3c627cd2ab44f6de7f15de8f37e1.png",
					},
					Gold: {
						one: "https://yaame-static.yaame.io/admin/da50d1b145386de66f713fc704ff43ed.png",
						ten: "https://yaame-static.yaame.io/admin/818f8ee5f421cb94acc9f5a35d57db5f.png",
						hundred:
							"https://yaame-static.yaame.io/admin/8bdb8f033f6dd7b3fdde119005dbd062.png",
					},
				},
				en: {
					Silver: {
						one: "https://yaame-static.yaame.io/admin/ee06e87a1744216ee5150d96b37974c4.png",
						ten: "https://yaame-static.yaame.io/admin/6bf45d9c86a196ac5ddadcba0efdac20.png",
						hundred:
							"https://yaame-static.yaame.io/admin/b9781d257d2a28959b320fec3df1fc59.png",
					},
					Gold: {
						one: "https://yaame-static.yaame.io/admin/1c9e2108e2099c42c5d8741325172d53.png",
						ten: "https://yaame-static.yaame.io/admin/33801ea879cdda480dbc82b54082f683.png",
						hundred:
							"https://yaame-static.yaame.io/admin/81dd4c70142f66d7b42ebe9afb974334.png",
					},
				},
				ar: {
					Silver: {
						one: "https://yaame-static.yaame.io/admin/d713b728bed55488dd18187a11335129.png",
						ten: "https://yaame-static.yaame.io/admin/552200e623d1ce1d31ade1156085ba38.png",
						hundred:
							"https://yaame-static.yaame.io/admin/4beda867f1c4c653accace7e6ad0c178.png",
					},
					Gold: {
						one: "https://yaame-static.yaame.io/admin/b0846eb634595d8186ef2ec9d0a2c7ad.png",
						ten: "https://yaame-static.yaame.io/admin/26f87aa60e2e81d89f97f0c25b51bb5a.png",
						hundred:
							"https://yaame-static.yaame.io/admin/8aa45d4802ba5a503f9f3d9cb3a2efde.png",
					},
				},
				id: {
					Silver: {
						one: "https://yaame-static.yaame.io/admin/6479a1048b8e9cb547334e67de867e2d.png",
						ten: "https://yaame-static.yaame.io/admin/ec382355f02e11f52d5cc4e5ecb43ed2.png",
						hundred:
							"https://yaame-static.yaame.io/admin/8a8788b4fd4338bf905322bd16d9a38a.png",
					},
					Gold: {
						one: "https://yaame-static.yaame.io/admin/27b6464ac54ef95eab113b320fb11e51.png",
						ten: "https://yaame-static.yaame.io/admin/06ec50e22fd95a126c0fb221e9783ba5.png",
						hundred:
							"https://yaame-static.yaame.io/admin/d7a9d9b9823c73c214d9ef17b3f6c6ba.png",
					},
				},
			},

			tabActive: "Silver",

			ruleVisible: false,
			recordVisible: false,
			rankVisible: true,
			drawVisible: false,

			diamond_balance: 0,
			goldRewardList: [],
			goldTodayWinDiamonds: 0,
			silverRewardList: [],
			silverTodayWinDiamonds: 0,

			lottery_logs: [],

			current: -1,

			gameStart: false,

			silverAnimationVisible: true,
			goldAnimationVisible: true,

			resultList: [],
			silverTopUser: {
				avatar: "",
				win_diamonds: "",
			},
			goldTopUser: {
				avatar: "",
				win_diamonds: "",
			},
			silverRewardBanners: [],
			goldRewardBanners: [],

			intervalNum: null,

			must_win_card_num: 0,
			cardImgList: {
				"zh-cn":
					"https://yaame-static.yaame.io/admin/016532b433e5728b23a996d0629512bb.png",
				"zh-tw":
					"https://yaame-static.yaame.io/admin/79555aa1bda24c034b84a791074f5498.png",
				en: "https://yaame-static.yaame.io/admin/c82865146817adc26eb755704d7f5feb.png",
				ar: "https://yaame-static.yaame.io/admin/bdd65261f8866959a0d43b8fcef444ce.png",
				id: "https://yaame-static.yaame.io/admin/1be98f71223575402d058029ac1ccdfa.png",
			},
			cardContentImg: {
				"zh-cn":
					"https://yaame-static.yaame.io/admin/d9c9d2d6c68207ee3f3a9f0a19cece52.png",
				"zh-tw":
					"https://yaame-static.yaame.io/admin/1bfa629ad0a20be69524c824a9bd4696.png",
				en: "https://yaame-static.yaame.io/admin/d68154f88404b20abe2b5f46006105f3.png",
				ar: "https://yaame-static.yaame.io/admin/2a6826c37f9ed25fc99c8cccfa0d0c5a.png",
				id: "https://yaame-static.yaame.io/admin/13efc37569edbf9eba4b32f39ad9f239.png",
			},
			cardVisible: false,

			cardFlag: false,

			audioRef: {
				bg: null,
				modal: null,
				result: null,
				timeActive: null,
				switch: null,
				bet: null,
			},
			audioPlaying: false,
			clickInit: false,
			audio: {
				bg: "https://yaame-static.yaame.io/admin/7e6f999c9fb337fb3fcf086f8a311c64.mp3", // BGM
				modal:
					"https://yaame-static.yaame.io/admin/f1a6a079542a8ca680f304073914bb51.mp3", // 出现结果弹窗音效
				result:
					"https://yaame-static.yaame.io/admin/1cd0d030975fa7d92c8fad90f9e43eda.mp3", // 出现结果
				timeActive:
					"https://yaame-static.yaame.io/admin/9bfc2aabe3176dd36f2aa7fc7d747a13.mp3", // 开奖倒计时
				switch:
					"https://yaame-static.yaame.io/admin/af85834f5f43e5e2c36ce0f4f052c98b.mp3", // 切换金额
				bet: "https://yaame-static.yaame.io/admin/6e40d8f0e219e061e474ef9d2b091e7a.mp3", // 押注
			},

			rewardInterval: null,

			firstLoad: true,
		};
	},
	computed: {
		language() {
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
		},
		rewardList() {
			return this.tabActive === "Silver"
				? this.silverRewardList
				: this.goldRewardList;
		},
		todayWinDiamonds() {
			return this.tabActive === "Silver"
				? this.silverTodayWinDiamonds
				: this.goldTodayWinDiamonds;
		},
		topUser() {
			return this.tabActive === "Silver"
				? this.silverTopUser
				: this.goldTopUser;
		},
		rewardBanners() {
			return this.tabActive === "Silver"
				? this.silverRewardBanners
				: this.goldRewardBanners;
		},
	},
	created() {
		document.addEventListener("visibilitychange", () => {
			// 用户离开了当前页面
			if (document.visibilityState === "hidden") {
				console.log("hidden");
				this.audioPlaying = false;
				this.audioRef.bg && this.audioRef.bg.pause();
				this.audioRef.modal && this.audioRef.modal.pause();
				this.audioRef.result && this.audioRef.result.pause();
				this.audioRef.timeActive && this.audioRef.timeActive.pause();
				this.audioRef.switch && this.audioRef.switch.pause();
				this.audioRef.bet && this.audioRef.bet.pause();
			}

			// 用户打开或回到页面
			if (document.visibilityState === "visible") {
				console.log("visible");
				// 重新加载页面
				location.reload();
			}
		});
	},
	async mounted() {
		const self = this;
		await this.getData();
        await this.getDialog();
		this.getRecord();
		// this.getTop();

		this.intervalNum = setInterval(() => {
			// this.getTop();
			this.getData();
		}, 5000);

		// window.onPaySuccess = function () {
		//     self.getData();
		// }

		this.audioRef.bg = this.$refs["audio-bg"];
		this.audioRef.modal = this.$refs["audio-modal"];
		this.audioRef.result = this.$refs["audio-result"];
		this.audioRef.timeActive = this.$refs["audio-timeActive"];
		this.audioRef.switch = this.$refs["audio-switch"];
		this.audioRef.bet = this.$refs["audio-bet"];

		if (this.isIOS) {
			console.log("isIOS");
			document.addEventListener("click", () => {
				if (!this.clickInit) {
					this.clickInit = true;
					this.audioPlaying = true;
					this.audioRef.bg.play();

					// 通过click播放后暂停 规避IOS NotAllowedError报错
					this.audioRef.modal.play();
					this.audioRef.result.play();
					this.audioRef.timeActive.play();
					this.audioRef.switch.play();
					this.audioRef.bet.play();
					this.audioRef.modal.pause();
					this.audioRef.result.pause();
					this.audioRef.timeActive.pause();
					this.audioRef.switch.pause();
					this.audioRef.bet.pause();
				}
			});
		} else {
			console.log("not IOS");
			this.clickInit = true;
			this.audioPlaying = true;
			this.audioRef.bg.play();
		}

        burialPointFun({
            event_name: "view_bigwinner_game",
            cid: -1003,
            md: 122,
            args_name: "view",
            args: {
                from: getQueryString("from") || "other",
            },
        });
	},
	destroyed() {
		clearInterval(this.intervalNum);
		clearInterval(this.rewardInterval);
	},
	methods: {
		playBGM() {
			try {
				if (this.audioPlaying) {
					this.audioPlaying = false;
					this.audioRef.bg.pause();
					this.audioRef.modal.pause();
					this.audioRef.result.pause();
					this.audioRef.timeActive.pause();
					this.audioRef.switch.pause();
					this.audioRef.bet.pause();
				} else {
					this.audioPlaying = true;
					this.clickInit = true;
					this.audioRef.bg.play();
				}
			} catch (error) {
				console.log("error", error);
			}
		},
		tabChange(val) {
			this.current = -1;
			this.tabActive = val;
			// this.getTop();
			this.getData();
		},
		async getData() {
			let res = await request.getPolLotteryInfo({
				activity_type: "BIG_WIN",
			});
			if (res.status === 1000) {
				if (!this.gameStart) {
					this.diamond_balance = res.data.diamond_balance;

					this.goldRewardList =
						res.data.lottery_strategy_config.gold.lottery_rewards;
					this.goldTodayWinDiamonds =
						res.data.lottery_strategy_config.gold.today_win_diamonds;

					this.silverRewardList =
						res.data.lottery_strategy_config.silver.lottery_rewards;
					this.silverTodayWinDiamonds =
						res.data.lottery_strategy_config.silver.today_win_diamonds;
				}

				this.silverTopUser =
					res.data.lottery_strategy_config.silver.today_champion ||
					getDefaultItem();
				this.goldTopUser =
					res.data.lottery_strategy_config.gold.today_champion ||
					getDefaultItem();

				this.silverRewardBanners =
					res.data.lottery_strategy_config.silver.reward_banners || [];
				this.goldRewardBanners =
					res.data.lottery_strategy_config.gold.reward_banners || [];
				this.must_win_card_num =
					res.data.lottery_strategy_config.silver.must_win_card_num || 0;

				if (this.firstLoad) {
                    setTimeout(() => {
                        this.flash();
                        this.firstLoad = false;
                    }, 1000);
				}
			}
		},
		async drawClick(lottery_times, event, isCard = false) {
			if (this.gameStart) {
				return;
			}

            if (event && isCard === false) {
                const target = event.target;
                // 添加按压效果的类
                target.classList.add('pressed');

                // 在100ms后移除按压效果
                setTimeout(() => {
                    target.classList.remove('pressed');
                }, 200); // 100ms时间可根据需求调整
            }


			this.cardFlag = false;
			let requestFun = request.postPolLottery;
			

            if (isCard) {
                requestFun = request.postPolLotterySure;
                // 关闭弹窗
                this.cardVisible = false;
                this.cardFlag = true;

                burialPointFun({
                    event_name: "click_card_prompt_lottery",
                    cid: -1004,
                    md: 122,
                    args_name: "click",
                });
            } else {
                if (
                    this.must_win_card_num &&
                    this.tabActive === "Silver" &&
                    lottery_times === 1
                ) {
                    // 关闭弹窗
                    this.cardVisible = false;
                    requestFun = request.postPolLotterySure;
                    this.cardFlag = true;
                } else {
                    this.cardFlag = false;
                    // 关闭弹窗
                    this.cardVisible = false;
                    requestFun = request.postPolLottery;
                }
            }
			this.drawVisible = false;
			// if (isNext) {
			// 	// 判断动画是否开启 且是否对应tabActive
			// 	if (this.tabActive === "Silver" && this.silverAnimationVisible) {
			// 		this.drawVisible = false;
			// 	} else if (this.tabActive === "Gold" && this.goldAnimationVisible) {
			// 		this.drawVisible = false;
			// 	}
			// }
			this.gameStart = true;
			let res = await requestFun({
				activity_type: "BIG_WIN",
				lottery_strategy_type: this.tabActive === "Silver" ? "silver" : "gold",
				lottery_times,
			});
			if (res.status === 1000) {
				this.resultList = res.data.lottery_rewards;

				if (res.data.lottery_times_tip) {
					Toast(res.data.lottery_times_tip);
				}

                if (this.cardFlag) {
                    Toast(this.$t('alreadyUseSureCard'));
                }

				let animationFlag = false;

				// 判断动画是否开启 且是否对应tabActive
				if (this.tabActive === "Silver" && this.silverAnimationVisible) {
					animationFlag = true;
				} else if (this.tabActive === "Gold" && this.goldAnimationVisible) {
					animationFlag = true;
				}

				if (animationFlag) {
					// 游戏开始之前清除闪烁效果
					clearInterval(this.rewardInterval);
					this.clearFlash();
					let index = this.rewardList.findIndex((item) => {
						return (
							item.reward_flag ===
							this.resultList.reduce((prev, cur) => {
								return prev.worth_diamonds > cur.worth_diamonds ? prev : cur;
							}).reward_flag
						);
					});

					this.startSpin(index).then(() => {
						// 结束上一个音频
						this.audioPlaying &&
							this.audioRef.timeActive &&
							this.audioRef.timeActive.pause();
						setTimeout(() => {
							this.audioPlaying &&
								this.audioRef.result &&
								this.audioRef.result.play();

							this.drawVisible = true;
							this.gameStart = false;
							this.current = -1;

							if (this.tabActive === "Silver") {
								this.silverTodayWinDiamonds = res.data.today_win_diamonds;

								this.silverTopUser = res.data.today_champion;
							} else {
								this.goldTodayWinDiamonds = res.data.today_win_diamonds;

								this.goldTopUser = res.data.today_champion;
							}
							this.diamond_balance = res.data.diamond_balance;
						}, 1500);
					});
				} else {
					this.drawVisible = true;
					this.gameStart = false;

					if (this.tabActive === "Silver") {
						this.silverTodayWinDiamonds = res.data.today_win_diamonds;
					} else {
						this.goldTodayWinDiamonds = res.data.today_win_diamonds;
					}
					this.diamond_balance = res.data.diamond_balance;
				}

                setTimeout(() => {
                    this.getData();
                }, 200);
			} else if (res.status === 6600) {
				Toast(res.desc);
				this.gameStart = false;
				setTimeout(() => {
					window.location.href =
						"wlyaame://mine/shop/diamond?popup=1&source=play_game";
				}, 2000);

                if (this.cardFlag) {
                    burialPointFun({
                        event_name: "view_popup_giftbag",
                        cid: -1005,
                        md: 107,
                        args_name: "view_popup",
                        args: {
                            banner_id: 'bigwinner_card'
                        },
                    });
                }
			} else {
				Toast(res.desc);
                this.getData();
				this.gameStart = false;
			}
		},
		formatDate,
		async recordHandle() {
			await this.getRecord();
			this.recordVisible = true;
		},
		async getRecord() {
			try {
				let res = await request.getPolLotteryLog({
					activity_type: "BIG_WIN",
					lottery_strategy_type:
						this.tabActive === "Silver" ? "silver" : "gold",
				});

				if (res.status === 1000) {
					this.lottery_logs = res.data.lottery_logs;
				} else {
					Toast(res.desc);
				}
			} catch (error) {
				console.log(error);
			}
		},
		startSpin(targetIndex) {
			this.audioPlaying &&
				this.audioRef.timeActive &&
				this.audioRef.timeActive.play();
			return new Promise(async (resolve) => {
				const totalRotations = 2; // 转2圈
				const spinsPerRotation = this.rewardList.length;
				const totalSpins = totalRotations * spinsPerRotation + targetIndex;
				const spinDuration = 10000; // 总动画时间
				let spinCount = 0;

				const delay = (ms) => new Promise((res) => setTimeout(res, ms));

				const rotate = async () => {
					if (spinCount < totalSpins) {
						this.current = spinCount % spinsPerRotation;
						spinCount++;

						const waitTime =
							(spinDuration / totalSpins) * Math.pow(spinCount / totalSpins, 2); // 使用平方函数增加减速效果

						await delay(waitTime);
						await rotate();
					} else {
						this.current = targetIndex; // 确保最终停留在指定位置
						resolve();
					}
				};

				await rotate();
			});
		},
		goBack() {
			window.location.href = "wlyaame://webview/pop";
		},
		goRank() {
			if (this.tabActive === "Silver") {
				location.href = "./diamondRank.html?activityRankType=BIG_WIN_SILVER";
			} else {
				location.href = "./diamondRank.html?activityRankType=BIG_WIN_GOLD";
			}
		},
		handleAudioError(e) {
			console.log("Audio Error: ", e);
		},

		// 实现一个方法，用于将class为reward-item的元素交替闪烁 元素闪烁的时间间隔为1s 闪烁的状态为灰色滤镜透明度0.5
		flash() {
			// 获取所有 class 为 'reward-item' 的元素
			const rewardItems = document.querySelectorAll(".reward-item");

			// 设置一个布尔变量来跟踪当前闪烁的状态
			let isEvenBlinking = true; // 初始状态为偶数索引闪烁

			// 使用 setInterval 每隔 1 秒切换一次闪烁状态
			this.rewardInterval = setInterval(() => {
				// 遍历所有的 reward-item 元素，应用或移除滤镜
				rewardItems.forEach((item, index) => {
					if (index % 2 === 0) {
						// 偶数索引
						if (isEvenBlinking) {
							item.classList.add("active"); // 添加闪烁效果
						} else {
							item.classList.remove("active"); // 移除闪烁效果
						}
					} else {
						// 奇数索引
						if (!isEvenBlinking) {
							item.classList.add("active");
                        } else {
                            item.classList.remove("active");
						}
					}
				});

				// 切换状态
				isEvenBlinking = !isEvenBlinking;
			}, 1000); // 每隔 1 秒切换一次
		},

		clearFlash() {
			// 恢复元素的默认样式
			const rewardItems = document.querySelectorAll(".reward-item");
			rewardItems.forEach((item) => {
				item.classList.remove("active");
			});
		},
        async getDialog() {
            let res = await request.getCommonDialog({
                criteria_type: "MUST_WIN_CARD",
            });
            if (res.status === 1000) {
                if (res.data && res.data.big_winner_card_dialog && res.data.big_winner_card_dialog.h5_show === 1) {
                    this.cardVisible = true;
                }
            }
        },
        openCard() {
            this.cardVisible = true;
            burialPointFun({
                event_name: "view_card_prompt",
                cid: -1001,
                md: 122,
                args_name: "view",
                args: {
                    from: 'manual',
                    type: 'in_game',
                },
            });
        },

	},
};
</script>
<style scoped lang="less">
.main {
	width: 7.5rem;
	height: 12.2rem;
	background-image: url("https://yaame-static.yaame.io/admin/83ae49dba998ec22f76b61e5493de07d.png");
	background-size: 7.5rem auto;
	background-repeat: no-repeat;
	position: relative;
	&.ar {
		text-align: right !important;
		.reward-list {
			justify-content: flex-end;
		}
	}
	&.Silver {
		background-image: url("https://yaame-static.yaame.io/admin/83ae49dba998ec22f76b61e5493de07d.png");
	}
	&.Gold {
		background-image: url("https://yaame-static.yaame.io/admin/b04a5264971b3c99bb2028e9320c5da0.png");
	}
	.title {
		width: 5.02rem;
		height: auto;
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
	}
	.home-icon {
		width: 0.56rem;
		height: 0.56rem;
		position: absolute;
		left: 0.17rem;
		top: 0.44rem;
	}
	.rule-icon {
		width: 0.56rem;
		height: 0.56rem;
		position: absolute;
		right: 0.21rem;
		top: 0.44rem;
	}
	.record-icon {
		width: 0.56rem;
		height: 0.56rem;
		position: absolute;
		right: 0.21rem;
		top: 1.24rem;
	}
	.tab-container {
		width: 3.11rem;
		height: 0.58rem;
		position: absolute;
		left: 50%;
		top: 1.27rem;
		transform: translateX(-50%);
		display: flex;
		background-size: contain;
		background-repeat: no-repeat;
		color: #fff;
		&.Silver {
			background-image: url(https://yaame-static.yaame.io/admin/ee9d2e5b1ff8f3f9a4155fbb15da7dc8.png);
			div:nth-child(1) {
				width: 1.7rem;
				color: #3160ff;
			}
		}
		&.Gold {
			background-image: url(https://yaame-static.yaame.io/admin/0cd5a58d583c37831e91aa19d23b910d.png);
			div:nth-child(2) {
				width: 1.7rem;
				color: #dd1900;
			}
		}
		div {
			width: 1.31rem;
			text-align: center;
			line-height: 0.58rem;
			font-size: 0.28rem;
			font-weight: bold;
		}
	}
	.machine-container {
		width: 7.5rem;
		height: 10.3rem;
		position: absolute;
		top: 2.27rem;
		left: 0;
		.activity-times {
			width: 4rem;
			height: 0.4rem;
			position: absolute;
			top: 0.24rem;
			left: 2rem;
			.van-notice-bar {
				background: transparent;
				line-height: 0.4rem;
				color: #6c0023;
				height: 100%;
				font-size: 0.24rem;
				padding: 0;
			}
			.notice-swipe {
				height: 0.4rem;
				line-height: 0.4rem;
				text-align: left;
			}
		}
		.little-title {
			width: 1.92rem;
			height: 0.28rem;
			top: 1.08rem;
			left: 2.79rem;
			position: absolute;
		}
		.reward-container {
			width: 5.15rem;
			height: 4.17rem;
			position: absolute;
			left: 1.2rem;
			top: 1.66rem;
			background-size: contain;
			background-repeat: no-repeat;
			position: relative;
			background-image: url(https://yaame-static.yaame.io/admin/74d5f5e0a037dc9936e732080b9e51dc.png);
			&.Silver {
				background-image: url(https://yaame-static.yaame.io/admin/74d5f5e0a037dc9936e732080b9e51dc.png);
				.active {
					background-image: url(https://yaame-static.yaame.io/admin/85c3c45439e2ec685120a6b565ff3b55.png);
				}
			}
			&.Gold {
				background-image: url(https://yaame-static.yaame.io/admin/9e6ca8bca1b0c1a6e4a710a5566bc24b.png);
				.active {
					background-image: url(https://yaame-static.yaame.io/admin/aa7804ee5db2f66beaa42d1845e2cfb6.png);
				}
			}

			.reward-item {
				width: 1.22rem;
				height: 1rem;
				position: absolute;
				background-size: contain;
				background-repeat: no-repeat;

				.reward-img {
					width: 0.6rem;
					height: 0.6rem;
					position: absolute;
					left: 0.31rem;
					top: 0.06rem;
				}
				.reward-name {
					position: absolute;
					bottom: -0.02rem;
					width: 1.22rem;
					text-align: center;
					font-size: 0.24rem;
					color: #2554be;
					transform: scale(0.833);
					img {
						width: 0.2rem;
						height: auto;
						vertical-align: middle;
					}
				}
			}
			.reward-item-0 {
				left: 0rem;
				top: 0rem;
			}
			.reward-item-1 {
				left: 1.3rem;
				top: 0rem;
			}
			.reward-item-2 {
				left: 2.6rem;
				top: 0rem;
			}
			.reward-item-3 {
				left: 3.92rem;
				top: 0rem;
			}
			.reward-item-4 {
				left: 3.92rem;
				top: 1.04rem;
			}
			.reward-item-5 {
				left: 3.92rem;
				top: 2.1rem;
			}
			.reward-item-6 {
				left: 3.92rem;
				top: 3.16rem;
			}
			.reward-item-6 {
				left: 3.92rem;
				top: 3.16rem;
			}
			.reward-item-7 {
				left: 2.6rem;
				top: 3.16rem;
			}
			.reward-item-8 {
				left: 1.3rem;
				top: 3.16rem;
			}
			.reward-item-9 {
				left: 0;
				top: 3.16rem;
			}
			.reward-item-10 {
				left: 0rem;
				top: 2.1rem;
			}
			.reward-item-11 {
				left: 0rem;
				top: 1.04rem;
			}
		}
		.one-btn {
			position: absolute;
			width: 2.07rem;
			height: 1.12rem;
			left: 0.5rem;
			top: 6.3rem;
			.btn-img {
				width: 2.07rem;
				height: 1.12rem;
			}
			.card-img {
				width: 0.72rem;
				height: 0.56rem;
				position: absolute;
				left: 0.15rem;
				top: -0.34rem;
			}
		}
		.ten-btn {
			position: absolute;
			width: 1.98rem;
			height: 1.12rem;
			left: 2.82rem;
			top: 6.3rem;
		}
		.hundred-btn {
			position: absolute;
			width: 2.08rem;
			height: 1.12rem;
			left: 4.98rem;
			top: 6.3rem;
		}
		.info-container {
			width: 3.18rem;
			height: 0.89rem;
			position: absolute;
			top: 8.48rem;
			background-size: contain;
			background-repeat: no-repeat;
			padding-left: 0.24rem;
			padding-right: 0.24rem;
			padding-top: 0.08rem;
			&.Silver {
				background-image: url(https://yaame-static.yaame.io/admin/4cd0f5bad11112c165db07ec0fc9d03b.png);
				font-size: 0.24rem;
				font-weight: 600;
				color: #ffffff;
				.title-span {
					font-size: 0.26rem;
					font-weight: 600;
					color: #669eff;
					margin-right: 0.04rem;
					img {
						width: 0.25rem;
						height: auto;
						vertical-align: middle;
					}
				}
				.avatar-address {
					background-image: url(https://yaame-static.yaame.io/admin/264f920b7cf8f56233b79c833d82380a.png);
				}
			}
			&.Gold {
				background-image: url(https://yaame-static.yaame.io/admin/060d3d43593b70c2f7d9b0ecc52c1d44.png);
				font-size: 0.24rem;
				font-weight: 600;
				color: #ffffff;
				.title-span {
					font-size: 0.26rem;
					font-weight: 600;
					color: #dd1600;
					margin-right: 0.04rem;
					img {
						width: 0.25rem;
						height: auto;
						vertical-align: middle;
					}
				}
				.avatar-address {
					background-image: url(https://yaame-static.yaame.io/admin/de5efa9c9137d7973abedec1323438d8.png);
				}
			}
			.avatar-address {
				width: 0.6rem;
				height: 0.6rem;
				position: absolute;
				top: 0.14rem;
				left: 0.18rem;
				display: flex;
				justify-content: center;
				align-items: center;
				background-size: contain;
				background-repeat: no-repeat;
				img {
					width: 0.52rem;
					height: 0.52rem;
					border-radius: 50%;
				}
			}
			.title-p {
				width: 2.2rem;
				height: 0.3rem;
				position: absolute;
				top: 0.13rem;
				left: 0.78rem;
				padding-left: 0.1rem;
				font-size: 0.22rem;
				font-weight: 600;
				color: #669eff;
			}
			.value-p {
				width: 2rem;
				height: 0.3rem;
				position: absolute;
				top: 0.43rem;
				left: 0.97rem;
				font-size: 0.24rem;
				font-weight: 600;
				color: #fff;
				img {
					width: 0.25rem;
					height: auto;
					vertical-align: middle;
				}
			}
			.live-icon {
				width: 0.34rem;
				height: 0.34rem;
				position: absolute;
				right: -0.12rem;
				top: 0.27rem;
			}
		}
		.animation-container {
			height: 0.507rem;
			display: flex;
			align-items: center;
			position: absolute;
			right: 0.26rem;
			top: 7.96rem;
			transform: scale(0.75);

			.animation-icon {
				width: 0.29rem;
				height: auto;
			}
			.animation-text {
				font-size: 0.24rem;
				color: #fff;
				flex: 1;
				text-align: right;
				margin: 0 0.06rem;
			}
			.animation-toggle {
				width: auto;
				height: 0.507rem;
			}
		}
	}
	.flex-container {
		display: flex;
		justify-content: center;
		align-items: center;
		.popup-container {
			width: 6.84rem;
			height: 9.2rem;
			background-image: url(https://yaame-static.yaame.io/admin/a27f90cf4f9507eec5912389ddd35a46.png);
			background-size: contain;
			background-repeat: no-repeat;
			padding-top: 0.5rem;
			font-size: 0.3rem;
			font-weight: 400;
			color: #ffffff;
			padding-left: 0.45rem;
			padding-right: 0.45rem;
			position: relative;
			.close-icon {
				width: 0.28rem;
				height: 0.28rem;
				position: absolute;
				top: 0.3rem;
				right: 0.3rem;
			}
			.title-p {
				width: 5.94rem;
				font-size: 0.44rem;
				font-weight: normal;
				color: #ffffff;
				text-align: center;
			}
		}
		.rule-container {
			P {
				margin-bottom: 0.2rem;
			}
		}
		.record-container {
			color: #fff;
			.empty {
				width: 5.94rem;
				text-align: center;
				font-size: 0.32rem;
				font-weight: 400;
				color: #cc9898;
				margin-top: 3.44rem;
			}
			.record-list {
				width: 5.94rem;
				margin-top: 0.34rem;
				height: 7.26rem;
				overflow-y: scroll;
				overflow-x: hidden;

				.record-item {
					width: 5.94rem;

					.item-p {
						margin-bottom: 0.15rem;
					}
					.reward-list {
						width: 5.94rem;
						display: flex;
						flex-wrap: wrap;
						margin-bottom: 0.3rem;
					}
					.reward-item {
						width: 1rem;
						height: 1.54rem;
						margin-right: 0.2rem;
						position: relative;
						&:nth-child(5n) {
							margin-right: 0;
						}
						.reward-img {
							width: 1rem;
							height: 1rem;
							background-image: url(https://yaame-static.yaame.io/admin/ed1c1b7c28af4ecc34a753c32c66416a.png);
							background-size: contain;
							background-repeat: no-repeat;
							display: flex;
							justify-content: center;
							align-items: center;
							img {
								width: 0.71rem;
								height: 0.71rem;
							}
						}
						.reward-name {
							width: 1rem;
							height: 0.54rem;
							font-size: 0.24rem;
							font-weight: 600;
							color: #fff;
							text-align: center;
							transform: scale(0.833);
							img {
								width: 0.19rem;
								height: auto;
								vertical-align: middle;
							}
						}
						.reward-num {
							height: 0.4rem;
							line-height: 0.4rem;
							text-align: center;
							padding: 0 0.2rem;
							font-size: 0.28rem;
							font-weight: 400;
							color: #ffffff;
							position: absolute;
							top: -0.02rem;
							right: -0.2rem;
							background-color: #f30d69;
							border-radius: 0.3rem;
							transform: scale(0.6);
						}
					}
				}
			}
		}
		.draw-container {
			padding-left: 0rem;
			padding-right: 0rem;
			.title-p {
				width: 6.83rem;
			}
			.footer-btn {
				width: 6.83rem;
				height: 1.3rem;
				padding: 0 0.27rem;
				display: flex;
				justify-content: space-between;
				align-items: center;
				position: absolute;
				left: 0;
				bottom: 0.43rem;
				.btn {
					width: 2rem;
					height: 1.3rem;
					background-image: url(https://yaame-static.yaame.io/admin/f8ff8a7ed295b0f66b0bebf587d345b8.png);
					background-size: contain;
					background-repeat: no-repeat;
					font-size: 0.32rem;
					font-weight: 600;

					color: #7f0000;
					padding-top: 0.14rem;
					p {
						text-align: center;
						width: 2rem;
						img {
							width: 0.19rem;
							height: auto;
							vertical-align: middle;
						}
					}
				}
			}
			.one-reward {
				width: 3.32rem;
				height: 4.16rem;
				margin-left: 1.74rem;
				margin-top: 1.16rem;
				.reward-img {
					width: 3.32rem;
					height: 3.32rem;
					background-size: contain;
					background-repeat: no-repeat;
					background-image: url(https://yaame-static.yaame.io/admin/9ca2fbe67602ab74b852e177aa3e73f4.png);
					position: relative;
					display: flex;
					justify-content: center;
					align-items: center;
					img {
						width: 2.4rem;
						height: 2.4rem;
					}
					.num {
						height: 0.58rem;
						line-height: 0.58rem;
						text-align: center;
						padding: 0 0.2rem;
						font-size: 0.36rem;
						font-weight: 400;
						color: #ffffff;
						position: absolute;
						top: -0.02rem;
						right: -0.14rem;
						background-color: #f30d69;
						border-radius: 0.3rem;
					}
				}
				.reward-name {
					margin-top: 0.16rem;
					font-size: 0.48rem;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #ffffff;
					text-align: center;
					img {
						width: 0.425rem;
						height: 0.384rem;
						vertical-align: middle;
					}
				}
			}
			.two-reward {
				width: 5.41rem;
				height: 3rem;
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 1.72rem;
				margin-left: 0.71rem;
				.two-reward-item {
					width: 2.4rem;
					height: 3rem;
					.reward-img {
						width: 2.4rem;
						height: 2.4rem;
						background-size: contain;
						background-repeat: no-repeat;
						background-image: url(https://yaame-static.yaame.io/admin/9ca2fbe67602ab74b852e177aa3e73f4.png);
						position: relative;
						display: flex;
						justify-content: center;
						align-items: center;
						img {
							width: 1.8rem;
							height: 1.8rem;
						}
						.num {
							height: 0.45rem;
							line-height: 0.45rem;
							text-align: center;
							padding: 0 0.2rem;
							font-size: 0.28rem;
							font-weight: 400;
							color: #ffffff;
							position: absolute;
							top: -0.02rem;
							right: -0.02rem;
							background-color: #f30d69;
							border-radius: 0.3rem;
						}
					}
				}
				.reward-name {
					margin-top: 0.1rem;
					font-size: 0.36rem;
					font-weight: 400;
					color: #ffffff;
					text-align: center;
					img {
						width: 0.3rem;
						height: auto;
						vertical-align: middle;
					}
				}
			}
			.three-reward {
				width: 6.83rem;
				height: 5.8rem;
				margin-top: 0.34rem;
				display: flex;
				justify-content: space-around;
				align-items: center;
				flex-wrap: wrap;
				padding: 0 0.52rem;
				.three-reward-item {
					width: 2.2rem;
					height: 2.76rem;
					.reward-img {
						width: 2.2rem;
						height: 2.2rem;
						background-size: contain;
						background-repeat: no-repeat;
						background-image: url(https://yaame-static.yaame.io/admin/9ca2fbe67602ab74b852e177aa3e73f4.png);
						position: relative;
						display: flex;
						justify-content: center;
						align-items: center;
						img {
							width: 1.6rem;
							height: 1.6rem;
						}
						.num {
							height: 0.45rem;
							line-height: 0.45rem;
							text-align: center;
							padding: 0 0.2rem;
							font-size: 0.28rem;
							font-weight: 400;
							color: #ffffff;
							position: absolute;
							top: -0.02rem;
							right: -0.02rem;
							background-color: #f30d69;
							border-radius: 0.3rem;
						}
					}
				}
				.reward-name {
					margin-top: 0.1rem;
					font-size: 0.32rem;
					font-weight: 400;
					color: #ffffff;
					text-align: center;
					img {
						width: 0.3rem;
						height: auto;
						vertical-align: middle;
					}
				}
			}
			.more-reward {
				width: 6.83rem;
				height: 5.7rem;
				margin-top: 0.34rem;
				display: flex;
				justify-content: space-around;
				flex-wrap: wrap;
				padding: 0 0.32rem;
				overflow-x: hidden;
				overflow-y: scroll;
				align-content: flex-start;
				.more-reward-item {
					width: 1.6rem;
					height: 2.1rem;
					margin-bottom: 0.24rem;
					.reward-img {
						width: 1.6rem;
						height: 1.6rem;
						background-size: contain;
						background-repeat: no-repeat;
						background-image: url(https://yaame-static.yaame.io/admin/9ca2fbe67602ab74b852e177aa3e73f4.png);
						position: relative;
						display: flex;
						justify-content: center;
						align-items: center;
						img {
							width: 1.4rem;
							height: 1.4rem;
						}
						.num {
							height: 0.4rem;
							line-height: 0.4rem;
							text-align: center;
							padding: 0 0.2rem;
							font-size: 0.28rem;
							font-weight: 400;
							color: #ffffff;
							position: absolute;
							top: -0.02rem;
							right: -0.02rem;
							background-color: #f30d69;
							border-radius: 0.3rem;
						}
					}
				}
				.reward-name {
					margin-top: 0.1rem;
					font-size: 0.28rem;
					font-weight: 400;
					color: #ffffff;
					text-align: center;
					img {
						width: 0.3rem;
						height: auto;
						vertical-align: middle;
					}
				}
			}
		}
	}
}

.card-container {
	width: 6.3rem;
	height: 6rem;
	position: relative;
	.content-img {
		width: 6.3rem;
		height: 4.5rem;
	}
	.btn-img {
		width: 3.32rem;
		height: 1rem;
		margin-left: 1.49rem;
		background-size: contain;
		background-repeat: no-repeat;
		background-image: url(https://yaame-static.yaame.io/admin/87a1cdbe3f5d33cd855af981eb3b32ad.png);
		margin-top: 0.4rem;
		text-align: center;
		line-height: 0.9rem;
		font-size: 0.3rem;
		color: #fff;
		img {
			vertical-align: middle;
		}
	}
	.close-btn {
		width: 0.4rem;
		height: 0.4rem;
		position: absolute;
		right: 1.2rem;
		top: 0.5rem;
	}
}
.card-flag-text {
	width: 5.32rem;
	margin-left: -1rem;
	font-weight: 600;
	font-size: 0.36rem;
	color: #ffee79;
	line-height: 0.36rem;
	text-align: center;
	margin-top: 0.6rem;
	img {
		width: 0.42rem;
		vertical-align: middle;
	}
	&.title {
		width: 6.84rem;
		position: absolute;
		top: 1.74rem;
		margin-left: 0;
		margin-top: 0;
	}
}
.bgm {
	width: 0.56rem;
	height: 0.56rem;
	left: 0.17rem;
	top: 1.26rem;
	animation: playBGMusic 10s linear infinite;
	animation-play-state: running;
	position: absolute;
	&.stop {
		animation-play-state: paused;
	}
}

@keyframes playBGMusic {
	0% {
		transform: rotateZ(0);
	}

	50% {
		transform: rotateZ(180deg);
	}

	100% {
		transform: rotateZ(360deg);
	}
}

/* 按压时的动画 */
.press-animation {
  transition: transform 0.1s ease;
}

.pressed {
      transform: scale(0.95);
    margin-top: 0.06rem;
}
</style>
