<!--
 * @Author: lianxiaoxia@weli.cn
 * @Date: 2022-12-07 10:20:44
 * @LastEditors: Please set LastEditors
 * @Description: 疯狂动物城
 * @FilePath: /yaame-h5/src/pages/zootopia/zootopia.vue
-->
<template>
	<div :class="['main', 'main-' + language]">
		<img v-show="loading" :src="loadingPage" alt="" class="loadingPage" />
		<div v-show="!loading">
			<!-- 规则按钮 -->
			<img
				:src="images.rule_btn"
				class="fixed-btn rule"
				alt=""
				@click="rule_modal = true"
			/>
			<!-- 赛跑记录按钮 -->
			<div
				:class="['fixed-btn', 'record', 'record-' + language]"
				alt=""
				@click="showRecordModal"
			/>
			<!-- 参与记录按钮 -->
			<div
				:class="['fixed-btn', 'join-record', 'join-record-' + language]"
				alt=""
				@click="showJoinRecordModal"
			/>
			<!-- 动物们 -->
			<img
				v-for="(animal, index) in images.animal_gif"
				:id="'animalGifRef' + index"
				:key="'animal' + index"
				:src="resting ? animal.url : animal.gif_url"
				:class="['animal-gif', 'animal-gif-' + index]"
				alt=""
			/>
			<!-- 开局倒计时 -->
			<div v-show="countdowns" :class="['countdown', 'countdown-' + language]">
				{{ countdowns }}
			</div>
			<!-- 投注用户列表 -->
			<div :class="['user-list', 'home']">
				<div
					v-for="(user, index) in user_list_show"
					:key="index"
					class="user-box"
				>
					<div class="user">
						<img v-lazy="user.a" class="avatar" alt="" />
					</div>
					<div v-show="user.v" class="value">
						<img
							src="https://static.yaame.io/admin/6cb1c5b826ed0a74d3258baa15dd542a.png"
							alt=""
						/>
						<span>{{ user.v }}</span>
					</div>
				</div>
			</div>
			<!-- 下注选项 -->
			<div class="content">
				<!-- 默认奖励icon -->
				<img
					v-if="language === 'en'"
					class="multiple_icon multiple_6"
					src="https://static.yaame.io/admin/6467e2fcfacc228ed7af05537f70a14c.png"
					alt=""
				/>
				<img
					v-else-if="language === 'id'"
					class="multiple_icon multiple_6"
					src="https://static.yaame.io/admin/e5aec828932c720585349a7ab76c6c21.png"
					alt=""
				/>
				<img
					v-else-if="language === 'zh-tw'"
					class="multiple_icon multiple_6"
					src="https://static.yaame.io/admin/35ff30145e68dccb4320289bb8852661.png"
					alt=""
				/>
				<img
					v-else
					class="multiple_icon multiple_6"
					src="https://static.yaame.io/admin/cd5bfb81592fcd6bd6ff92316582381d.png"
					alt=""
				/>

				<img
					v-if="language === 'en'"
					class="multiple_icon multiple_3"
					src="https://static.yaame.io/admin/fa52deb7dfc05db911ddd4ad0453b0b1.png"
					alt=""
				/>
				<img
					v-else-if="language === 'id'"
					class="multiple_icon multiple_3"
					src="https://static.yaame.io/admin/d90bcb152aa55b4b0049fe8a320ff950.png"
					alt=""
				/>
				<img
					v-else-if="language === 'zh-tw'"
					class="multiple_icon multiple_3"
					src="https://static.yaame.io/admin/5f884088db3a60cb6597a164edbd37d0.png"
					alt=""
				/>
				<img
					v-else
					class="multiple_icon multiple_3"
					src="https://static.yaame.io/admin/f941564ffff9b6b06497683f2f90e22b.png"
					alt=""
				/>

				<img
					v-if="language === 'en'"
					class="multiple_icon multiple_2"
					src="https://static.yaame.io/admin/a6178d6bebdfb138f15cb574df40656b.png"
					alt=""
				/>
				<img
					v-else-if="language === 'id'"
					class="multiple_icon multiple_2"
					src="https://static.yaame.io/admin/35ff30145e68dccb4320289bb8852661.png"
					alt=""
				/>
				<img
					v-else-if="language === 'zh-tw'"
					class="multiple_icon multiple_2"
					src="https://static.yaame.io/admin/b55eb3d948241768a9dc66074a20085d.png"
					alt=""
				/>
				<img
					v-else
					class="multiple_icon multiple_2"
					src="https://static.yaame.io/admin/bf0825895ad36bc648b9793d06e6435f.png"
					alt=""
				/>

				<!-- 六倍选项卡 -->
				<div class="row">
					<div
						v-for="item in sixfold_match_list_show"
						:key="item.type"
						:style="{
							backgroundImage:
								betting_type['sixfold'] !== '' &&
								betting_type['sixfold'] !== item.type
									? `url(${item.disabled})`
									: betting_type['sixfold'] === item.type
									? `url(${item.active})`
									: `url(${item.default})`,
						}"
						class="cell sixfold-cell"
						@click="handlerBetting(item.type, 'sixfold')"
					>
						<div class="cell-value">
							<img
								src="https://static.yaame.io/admin/6cb1c5b826ed0a74d3258baa15dd542a.png"
								alt=""
							/>
							<span>{{ item.value }}</span>
						</div>
					</div>
				</div>
				<!-- 三倍选项卡 -->
				<div class="row" style="margin-top: 0.08rem">
					<div
						v-for="item in triple_match_list_show"
						:key="item.type"
						:style="{
							backgroundImage:
								betting_type['triple'] !== '' &&
								betting_type['triple'] !== item.type
									? `url(${item.disabled})`
									: betting_type['triple'] === item.type
									? `url(${item.active})`
									: `url(${item.default})`,
						}"
						class="cell triple-cell"
						@click="handlerBetting(item.type, 'triple')"
					>
						<div class="cell-value">
							<img
								src="https://static.yaame.io/admin/6cb1c5b826ed0a74d3258baa15dd542a.png"
								alt=""
							/>
							<span>{{ item.value }}</span>
						</div>
					</div>
				</div>
				<!-- 二倍选项卡 -->
				<div class="row" style="margin-top: 0.08rem">
					<div
						v-for="item in twice_match_list_show"
						:key="item.type"
						:style="{
							backgroundImage:
								betting_type['twice'] !== '' &&
								betting_type['twice'] !== item.type
									? `url(${item.disabled})`
									: betting_type['twice'] === item.type
									? `url(${item.active})`
									: `url(${item.default})`,
						}"
						class="cell twice-cell"
						@click="handlerBetting(item.type, 'twice')"
					>
						<div class="cell-value">
							<img
								src="https://static.yaame.io/admin/6cb1c5b826ed0a74d3258baa15dd542a.png"
								alt=""
							/>
							<span>{{ item.value }}</span>
						</div>
					</div>
				</div>
			</div>
			<!-- 用户金币钻石余额、下注金额选择 -->
			<div class="bottom">
				<div style="margin-right: 0.16rem; margin-top: 0.16rem">
					<!-- 金币余额 -->
					<!-- <div class="balance-box">
					<img
						src="https://static.yaame.io/admin/6cb1c5b826ed0a74d3258baa15dd542a.png"
						alt=""
					/>
					<span>{{ bean }}</span>
				</div> -->
					<!-- 钻石余额 -->
					<div class="balance-box" style="margin-top: 0.04rem">
						<img
							src="https://static.yaame.io/admin/6cb1c5b826ed0a74d3258baa15dd542a.png"
							alt=""
						/>
						<span>{{ diamond }}</span>
					</div>
				</div>
				<div
					v-for="(price, index) in price_list"
					:key="'price' + index"
					:class="['bet-btn', price === betting_bean && 'active']"
					@click="betting_bean = price"
				>
					<img
						:src="
							price === betting_bean ? images.bean_active : images.bean_default
						"
						alt=""
					/>
					<span>{{ price }}</span>
				</div>
			</div>

			<!-- 结果弹窗 -->
			<popup v-if="res_modal" class="flex-box">
				<div :class="['res-modal', in_act && 'act-res-modal']">
					<img
						class="modal-close"
						src="../../assets/img/common/icon_cha.png"
						alt=""
						@click="res_modal = false"
					/>
					<div class="title">
						{{ $t("thisRound") }}
						{{
							images.animal_gif[reward_info.n - 1] &&
							$t(images.animal_gif[reward_info.n - 1].name)
						}}
						{{ $t("victory") }}
					</div>
					<img
						:src="
							images.animal_gif[reward_info.n - 1] &&
							images.animal_gif[reward_info.n - 1].url
						"
						class="animal"
						alt=""
					/>
					<div v-show="reward_info.bean > 0" class="reward-desc">
						{{ $t("winGame") }}
						<span>{{ reward_info.bean }}</span>
						{{ $t("diamond") }}
					</div>
					<!-- 额外奖励金豆 -->
					<!-- <div v-show="reward_info.extra_bean" class="extra-reward-desc">
					恭喜额外获得奖励
					<span>{{ reward_info.extra_bean }}</span>
					金豆
				</div> -->
					<!-- 中奖用户 -->
					<div
						v-if="reward_info.r && reward_info.r.length"
						:class="['user-list', 'reward']"
					>
						<div
							v-for="(user, index) in reward_info.r"
							:key="index"
							class="user-box"
						>
							<div class="user">
								<img v-lazy="user.a" class="avatar" alt="" />
							</div>
							<div class="number">NO.{{ index + 1 }}</div>
							<div class="value">
								<img
									src="https://static.yaame.io/admin/6cb1c5b826ed0a74d3258baa15dd542a.png"
									alt=""
								/>
								<span>{{ user.r }}</span>
							</div>
						</div>
					</div>
					<!-- 额外金豆中奖用户 -->
					<!-- <p v-if="reward_info.e && reward_info.e.length" class="extra-user-desc">
					本场额外奖励
				</p> -->
					<div
						v-if="reward_info.e && reward_info.e.length"
						class="user-list reward extra-reward"
					>
						<div
							v-for="(user, index) in reward_info.e"
							:key="'e' + index"
							class="user-box"
						>
							<div class="user">
								<img v-lazy="user.a" class="avatar" alt="" />
							</div>
							<div class="value">
								<img
									src="https://static.yaame.io/admin/6cb1c5b826ed0a74d3258baa15dd542a.png"
									alt=""
								/>
								<span>{{ user.r }}</span>
							</div>
						</div>
					</div>
				</div>
			</popup>

			<!-- 赛跑比赛记录弹窗  -->
			<popup v-if="record_modal" class="flex-box">
				<div :class="['record-modal', 'record-modal-' + language]">
					<img
						class="modal-close"
						src="../../assets/img/common/icon_cha.png"
						alt=""
						@click="record_modal = false"
					/>
					<div class="record-title">
						<div class="time">{{ $t("time") }}</div>
						<img
							v-for="(url, index) in images.record_modal_animal"
							:key="'record_modal_animal' + index"
							:src="url"
							class="animal"
							alt=""
						/>
					</div>
					<div class="record-list">
						<div v-for="record in records" :key="record.id" class="record-row">
							<div class="time">
								<p>{{ formatDate(record.time, "yyyy.MM.dd") }}</p>
								<p>{{ formatDate(record.time, "hh:mm:ss") }}</p>
							</div>
							<div
								v-for="(item, index) in 6"
								:key="'record_modal_qizhi' + index"
								class="qizhi"
							>
								<img
									v-if="index + 1 === record.win_num"
									:src="images.qizhi[index]"
									alt=""
								/>
							</div>
						</div>
					</div>
				</div>
			</popup>

			<!-- 活动规则弹窗 -->
			<popup v-if="rule_modal" class="flex-box">
				<div :class="['rule-modal', 'rule-modal-' + language]">
					<img
						class="modal-close"
						src="../../assets/img/common/icon_cha.png"
						alt=""
						@click="rule_modal = false"
					/>
					<div class="rule-modal-content">
						<p><span>1. </span>{{ $t("content-1") }}</p>
						<p>{{ $t("content-2") }}</p>
						<p>{{ $t("content-3") }}</p>
						<p>{{ $t("content-4") }}</p>
						<p>{{ $t("content-5") }}</p>
						<p><span>2. </span>{{ $t("content-6") }}</p>
						<p><span>3. </span>{{ $t("content-7") }}</p>
						<p><span>4. </span>{{ $t("content-8") }}</p>
					</div>
				</div>
			</popup>

			<!-- 参与记录 -->
			<popup v-if="join_record_modal" class="flex-box">
				<div :class="['join-modal', 'join-modal-' + language]">
					<img
						class="modal-close"
						src="../../assets/img/common/icon_cha.png"
						alt=""
						@click="join_record_modal = false"
					/>
					<div v-if="join_records.length > 0" class="join-content">
						<div
							v-for="(item, k) in join_records"
							:key="'join' + k"
							class="join-item"
						>
							<div class="time">
								{{ momentFormatData(item.time) }}
							</div>
							<div
								:class="['record-text', item.win ? 'win-text' : 'lose-text']"
							>
								{{ item.desc }}
							</div>
						</div>
					</div>
					<div v-else class="empty-join">
						<img
							class="no-record"
							src="https://static.yaame.io/admin/41c64f3e10fda85cbe97b67918c260b2.png"
							alt=""
						/>
					</div>
					<div class="footer-title">
						<img
							v-if="language === 'en'"
							src="https://static.yaame.io/admin/665f15542bf53721cdb08a9ff4d25a6f.png"
							alt=""
						/>
						<img
							v-else-if="language === 'id'"
							src="https://static.yaame.io/admin/474a748e9a2d8d0ac0d59237e700a4a5.png"
							alt=""
						/>
						<img
							v-else-if="language === 'zh-tw'"
							src="https://static.yaame.io/admin/ac0d474cf43ca89b9f81d1b0c6cbaa23.png"
							alt=""
						/>
						<img
							v-else
							src="https://static.yaame.io/admin/9a4cdda15d2e8eb39e38f8d17a8074f7.png"
							alt=""
						/>
					</div>
				</div>
			</popup>

			<!-- 比赛进行中蒙层提示 -->
			<div v-if="init_stage === 'running'" class="running-tip">
				<img :src="loadingImg" alt="" />
			</div>
		</div>
	</div>
</template>
<script>
import request from "../../lib/request/activity.js";
import { formatDate, formatDateString, sleep, isEmpty } from "../../lib/utils";
import Toast from "../../components/third/toast/toast";
import { local_storage } from "../../lib/storage";
import { getLanguage } from "../../lib/device";
import SDK from "@yxim/nim-web-sdk";
import moment from "moment";
const storage_key = "YAAME_ZOOTOPIA_CONFIRM";
const N_ENUM = {
	1: "ONE",
	2: "TWO",
	3: "THREE",
	4: "FOUR",
	5: "FIVE",
	6: "SIX",
};
const DEFAULT_MULTIPLE_ENMU = {
	sixfold: 6,
	triple: 3,
	twice: 2,
};

const getDefaultSixfold = () => {
	return {
		ONE: {
			type: "ONE",
			default:
				"https://static.yaame.io/admin/ed58e70ae662b8e31cec07596b818c2a.png", // 可投注状态
			disabled:
				"https://static.yaame.io/admin/e1ccef6a6c281f2accdc5149af3bc5bf.png", // 不可投注状态
			active:
				"https://static.yaame.io/admin/6843414f1e57f6900410b4fdd75d70c7.png", // 已投注状态
			value: 0, // 已下注金豆数
		},
		TWO: {
			type: "TWO",
			default:
				"https://static.yaame.io/admin/21aaf5eca1096da3253942cef77925f2.png",
			disabled:
				"https://static.yaame.io/admin/a5a20b193c53c3a7bfa93bb3738003ee.png",
			active:
				"https://static.yaame.io/admin/00f5d7125dfcca158dd29ffde09df4f6.png",
			value: 0,
		},
		THREE: {
			type: "THREE",
			default:
				"https://static.yaame.io/admin/3e163f23539130ad899252c08b00e833.png",
			disabled:
				"https://static.yaame.io/admin/32b0727846ad82433dc82654d98d566d.png",
			active:
				"https://static.yaame.io/admin/a9a5728e23c1e373ba861427610924ff.png",
			value: 0,
		},
		FOUR: {
			type: "FOUR",
			default:
				"https://static.yaame.io/admin/5d16f12c6a52316cb39a1e84c92e8752.png",
			disabled:
				"https://static.yaame.io/admin/561e30e0a90d92cfbf4257f8be032f4c.png",
			active:
				"https://static.yaame.io/admin/3c2f2b9366814fdff4183cc881331d8e.png",
			value: 0,
		},
		FIVE: {
			type: "FIVE",
			default:
				"https://static.yaame.io/admin/579eda720dd59c4d441e9cce6b6d4f17.png",
			disabled:
				"https://static.yaame.io/admin/97a1978eb7d930b0e919dd86b79739ec.png",
			active:
				"https://static.yaame.io/admin/54ecf0d46274a31538cf234979281b39.png",
			value: 0,
		},
		SIX: {
			type: "SIX",
			default:
				"https://static.yaame.io/admin/55587f4401f6c04c054aa19ecb43e4fe.png",
			disabled:
				"https://static.yaame.io/admin/7638285b472a61f793af2c252ae56ce7.png",
			active:
				"https://static.yaame.io/admin/18711746eb74bb038bf7e6e97e4cd827.png",
			value: 0,
		},
	};
};
const getENSixfold = () => {
	return {
		ONE: {
			type: "ONE",
			default:
				"https://static.yaame.io/admin/db3caf70a4784b523847ff75cc60e6c6.png", // 可投注状态
			disabled:
				"https://static.yaame.io/admin/567bd87680e32e561bf3e81a2c33fcbc.png", // 不可投注状态
			active:
				"https://static.yaame.io/admin/ce99106257f3d3c8311e90b3df998f58.png", // 已投注状态
			value: 0, // 已下注金豆数
		},
		TWO: {
			type: "TWO",
			default:
				"https://static.yaame.io/admin/db3caf70a4784b523847ff75cc60e6c6.png",
			disabled:
				"https://static.yaame.io/admin/0d16215798c68205f86d26ec453e476e.png",
			active:
				"https://static.yaame.io/animal/e93f96db0276483ea9a5ce3133f287aa.png",
			value: 0,
		},
		THREE: {
			type: "THREE",
			default:
				"https://static.yaame.io/animal/2ac592602cc347fea1124df6196e45fd.png",
			disabled:
				"https://static.yaame.io/animal/b656f8fce90c4abc805d63604264f6a7.png",
			active:
				"https://static.yaame.io/animal/40f06d92b68c47d88ba91985e2bc2b44.png",
			value: 0,
		},
		FOUR: {
			type: "FOUR",
			default:
				"https://static.yaame.io/animal/635c356cd35f4ebbb306cb2054bab69f.png",
			disabled:
				"https://static.yaame.io/animal/98c5b43917f84ff2ac7b77fa87a632fd.png",
			active:
				"https://static.yaame.io/animal/bbbe83f944ba482ba531edc537b97b50.png",
			value: 0,
		},
		FIVE: {
			type: "FIVE",
			default:
				"https://static.yaame.io/admin/c9fdfce5a70e5a87ffa5efc8b33a34a9.png",
			disabled:
				"https://static.yaame.io/admin/f65a9c77b19c74cdd0b7e2fdee22644f.png",
			active:
				"https://static.yaame.io/animal/244775c3086644ae9b1f5037ff89ebb0.png",
			value: 0,
		},
		SIX: {
			type: "SIX",
			default:
				"https://static.yaame.io/admin/495de5b14d88eda52b3123de2725b4d0.png",
			disabled:
				"https://static.yaame.io/admin/8574bcf5aa068116398c581bac96667f.png",
			active:
				"https://static.yaame.io/animal/f38aad0eb4754827a34f932e272eefc6.png",
			value: 0,
		},
	};
};
const getIDSixfold = () => {
	return {
		ONE: {
			type: "ONE",
			default:
				"https://static.yaame.io/admin/7ad6c32018212b39d142f6e2dd1d2437.png", // 可投注状态
			disabled:
				"https://static.yaame.io/admin/e82cce14aa86a868ae4623fef0b60829.png", // 不可投注状态
			active:
				"https://static.yaame.io/admin/e732be69aab7f5bb802660cb4b052343.png", // 已投注状态
			value: 0, // 已下注金豆数
		},
		TWO: {
			type: "TWO",
			default:
				"https://static.yaame.io/admin/dd4f815b6ea6b9b355d830113af9fa26.png",
			disabled:
				"https://static.yaame.io/admin/4f8829495df474b7432e93be6cb622cd.png",
			active:
				"https://static.yaame.io/animal/8d9f46e50bac4a7f98c5489ebb9acf27.png",
			value: 0,
		},
		THREE: {
			type: "THREE",
			default:
				"https://static.yaame.io/animal/b265281211d744b1837a88d203fe1968.png",
			disabled:
				"https://static.yaame.io/animal/d07c367f36db4b808ed6137da18b0272.png",
			active:
				"https://static.yaame.io/animal/52473a91dd49484eb9a75e9228564bf8.png",
			value: 0,
		},
		FOUR: {
			type: "FOUR",
			default:
				"https://static.yaame.io/animal/9be3b91409244ca49ddc19869f820921.png",
			disabled:
				"https://static.yaame.io/animal/1e9b046057c14f1a8e8ef8842671092c.png",
			active:
				"https://static.yaame.io/animal/75667432178546458e85c24a62fe51ab.png",
			value: 0,
		},
		FIVE: {
			type: "FIVE",
			default:
				"https://static.yaame.io/admin/c56fc6b085a50394c87193cb2c68f92c.png",
			disabled:
				"https://static.yaame.io/admin/827a13dd4a2d8ae4da380d997bfa80b4.png",
			active:
				"https://static.yaame.io/animal/1a177f82e82c4cc49bdc86c60254f539.png",
			value: 0,
		},
		SIX: {
			type: "SIX",
			default:
				"https://static.yaame.io/admin/3602959e95a531133f2c6b669aef146e.png",
			disabled:
				"https://static.yaame.io/admin/806a68af067384d1d9ce50eb8cc9c89e.png",
			active:
				"https://static.yaame.io/animal/2b03868484da49788b7be7c3a40ca3ef.png",
			value: 0,
		},
	};
};
const getTWSixfold = () => {
	return {
		ONE: {
			type: "ONE",
			default:
				"https://static.yaame.io/admin/0568b702397ddb3fbb05b61a3bb68077.png", // 可投注状态
			disabled:
				"https://static.yaame.io/admin/3486c918c175620df6b12575d358fb74.png", // 不可投注状态
			active:
				"https://static.yaame.io/admin/546714e3c01f1fc75386e82e77855076.png", // 已投注状态
			value: 0, // 已下注金豆数
		},
		TWO: {
			type: "TWO",
			default:
				"https://static.yaame.io/admin/6de6bb3a1df69f7ca9342485a0f2cbac.png",
			disabled:
				"https://static.yaame.io/admin/7384d9aae5c07599d233d3186bf692de.png",
			active:
				"https://static.yaame.io/animal/26ecca693c0349ab953c03938ef38f20.png",
			value: 0,
		},
		THREE: {
			type: "THREE",
			default:
				"https://static.yaame.io/admin/752ad39bcb69e9844ee83b9cb57da130.png",
			disabled:
				"https://static.yaame.io/animal/0ec52b91020247c8970a272c42bd3704.png",
			active:
				"https://static.yaame.io/animal/d6ba4ba7313c4acba90c084aeb1c6c94.png",
			value: 0,
		},
		FOUR: {
			type: "FOUR",
			default:
				"https://static.yaame.io/animal/d918cb5bdf734373b19c595b1833bbac.png",
			disabled:
				"https://static.yaame.io/animal/9169dadda8db4cf5b4f5e2096d495625.png",
			active:
				"https://static.yaame.io/animal/81df1949b65549949e21b9fa90d57964.png",
			value: 0,
		},
		FIVE: {
			type: "FIVE",
			default:
				"https://static.yaame.io/admin/2e46932af702cf27fb941ae7a11f446b.png",
			disabled:
				"https://static.yaame.io/admin/c3e99af1ed27f0e668a0b03cd8094444.png",
			active:
				"https://static.yaame.io/animal/b12bb8e19e254090a274624e0766073f.png",
			value: 0,
		},
		SIX: {
			type: "SIX",
			default:
				"https://static.yaame.io/admin/4b997db231dbbe7b28c141132819f92c.png",
			disabled:
				"https://static.yaame.io/admin/403539bf29747639a5f65435c6c5b630.png",
			active:
				"https://static.yaame.io/animal/210a014869694ca8b944a964c0b5f19f.png",
			value: 0,
		},
	};
};
// =======================================================================
const getDefaultTriple = () => {
	return {
		ONE_TWO: {
			type: "ONE_TWO",
			default:
				"https://static.yaame.io/admin/1111af8f681bf6aa5d334ee454040411.png",
			disabled:
				"https://static.yaame.io/admin/3a3dcf8f6018a2cb1f0e87529afbba9c.png",
			active:
				"https://static.yaame.io/admin/6f9198b4aa6e041b9d06879e02d3021e.png",
			value: 0,
		},
		THREE_FOUR: {
			type: "THREE_FOUR",
			default:
				"https://static.yaame.io/admin/f7ca890424dce62a083a6327abf4d647.png",
			disabled:
				"https://static.yaame.io/admin/72b6905740407a0e08e936bb12f5e09b.png",
			active:
				"https://static.yaame.io/admin/1cf20564061c995a72b54a8a7a8c7672.png",
			value: 0,
		},
		FIVE_SIX: {
			type: "FIVE_SIX",
			default:
				"https://static.yaame.io/admin/8fb126f5d3537e4569785bdda8e39614.png",
			disabled:
				"https://static.yaame.io/admin/06a1cfeba8718c2635d0ee758d76f34f.png",
			active:
				"https://static.yaame.io/admin/f61eb9ac8fe157a527c5cc09506530f3.png",
			value: 0,
		},
	};
};
const getENTriple = () => {
	return {
		ONE_TWO: {
			type: "ONE_TWO",
			default:
				"https://static.yaame.io/admin/5376cbf1bb2670bb439535e5c375d7fb.png",
			disabled:
				"https://static.yaame.io/admin/7756085a546c21cc433ffa3149af1c59.png",
			active:
				"https://static.yaame.io/admin/47f2e9a14c45784cc74d9b7a2ceb24a0.png",
			value: 0,
		},
		THREE_FOUR: {
			type: "THREE_FOUR",
			default:
				"https://static.yaame.io/animal/e59014ea8e0f4447a24520456e27592f.png",
			disabled:
				"https://static.yaame.io/animal/f2a2dc5ae1264700adc58ef8eb077d6a.png",
			active:
				"https://static.yaame.io/animal/753f4b2a9c6c47be88efd4a637025e54.png",
			value: 0,
		},
		FIVE_SIX: {
			type: "FIVE_SIX",
			default:
				"https://static.yaame.io/admin/b4f57f580a8faae4a1766c31e963fd6e.png",
			disabled:
				"https://static.yaame.io/admin/298dbc30f5851eb4e6b8f833333dd2fe.png",
			active:
				"https://static.yaame.io/admin/51f2d74e2b8abae969c15418da632575.png",
			value: 0,
		},
	};
};
const getIDTriple = () => {
	return {
		ONE_TWO: {
			type: "ONE_TWO",
			default:
				"https://static.yaame.io/admin/5f711383d547f01fa58a7f7956e8d5b5.png",
			disabled:
				"https://static.yaame.io/admin/6cf2f794e9c2da047828a6d4a9051c66.png",
			active:
				"https://static.yaame.io/admin/b448d1762cf8ea68a20f6e9e5415e5dc.png",
			value: 0,
		},
		THREE_FOUR: {
			type: "THREE_FOUR",
			default:
				"https://static.yaame.io/animal/4c22b065dde2435d8bd6fddf8b9f532c.png",
			disabled:
				"https://static.yaame.io/animal/f7a172a8184c4513926a7dd0193c5efe.png",
			active:
				"https://static.yaame.io/animal/fe11f2f9f6de4f6ab7126ced61279aa5.png",
			value: 0,
		},
		FIVE_SIX: {
			type: "FIVE_SIX",
			default:
				"https://static.yaame.io/admin/6b7a012f05c9ddef1feb554d4b923077.png",
			disabled:
				"https://static.yaame.io/admin/bfaeaca4d58c5c108faecb05f72c15b5.png",
			active:
				"https://static.yaame.io/admin/9a42eaf0e36e95ddeb4dde41709cda61.png",
			value: 0,
		},
	};
};
const getTWTriple = () => {
	return {
		ONE_TWO: {
			type: "ONE_TWO",
			default:
				"https://static.yaame.io/admin/800e7e9a9d7c4f1226ebcf350c0cabdc.png",
			disabled:
				"https://static.yaame.io/admin/a13e328d841ce35d40e63ae496f28b10.png",
			active:
				"https://static.yaame.io/admin/0b6a855f642ead9bfaa0764c403ddac0.png",
			value: 0,
		},
		THREE_FOUR: {
			type: "THREE_FOUR",
			default:
				"https://static.yaame.io/animal/26ecca693c0349ab953c03938ef38f20.png",
			disabled:
				"https://static.yaame.io/animal/7a4d8db5b6a94f61b878689f5b64be40.png",
			active:
				"https://static.yaame.io/animal/6cc2cc071ad24be391b1f72ffb03a0bc.png",
			value: 0,
		},
		FIVE_SIX: {
			type: "FIVE_SIX",
			default:
				"https://static.yaame.io/admin/363ef2587cd8af81b9e7a68cae40b28d.png",
			disabled:
				"https://static.yaame.io/admin/82995462753dbc943e1f7efdd40264f8.png",
			active:
				"https://static.yaame.io/admin/3f6191f0dd41200ce39c74645d37e505.png",
			value: 0,
		},
	};
};
// =======================================================================
const getDefaultTwice = () => {
	return {
		ONE_TWO_THREE: {
			type: "ONE_TWO_THREE",
			default:
				"https://static.yaame.io/admin/276c188c55b8314ed924b6cb9acf5ad6.png",
			disabled:
				"https://static.yaame.io/admin/bba1a7b5732240566b1588daa30dd40d.png",
			active:
				"https://static.yaame.io/admin/7b56149c0f1c34d4889385723fe73f78.png",
			value: 0,
		},
		FOUR_FIVE_SIX: {
			type: "FOUR_FIVE_SIX",
			default:
				"https://static.yaame.io/admin/c0fda4dacc58b9966d187e16e0c28e9f.png",
			disabled:
				"https://static.yaame.io/admin/7776814538d763483e553693ca8afc56.png",
			active:
				"https://static.yaame.io/admin/5756487fa2713c90828c289757b0178a.png",
			value: 0,
		},
	};
};
const getENTwice = () => {
	return {
		ONE_TWO_THREE: {
			type: "ONE_TWO_THREE",
			default:
				"https://static.yaame.io/animal/42ba856aca3e44d9938ff1e634bd0d4c.png",
			disabled:
				"https://static.yaame.io/animal/d8deabd2bcfb489988c42265a51ec322.png",
			active:
				"https://static.yaame.io/animal/fe30efec50a1459eb0ccf34836042b2e.png",
			value: 0,
		},
		FOUR_FIVE_SIX: {
			type: "FOUR_FIVE_SIX",
			default:
				"https://static.yaame.io/animal/5d670e43a15d4c2793e5d176674dfd8c.png",
			disabled:
				"https://static.yaame.io/animal/690bf4fe0b7e46daa157ccc276154e7c.png",
			active:
				"https://static.yaame.io/animal/4a59679385a9482c8cd013c0000fe092.png",
			value: 0,
		},
	};
};
const getIDTwice = () => {
	return {
		ONE_TWO_THREE: {
			type: "ONE_TWO_THREE",
			default:
				"https://static.yaame.io/animal/cd33bcdbbace49b89983ec8f5f27d4f0.png",
			disabled:
				"https://static.yaame.io/animal/e35814086059450ab322b586850e0f0a.png",
			active:
				"https://static.yaame.io/animal/33909807a6e14949b85c5ef21290ba2b.png",
			value: 0,
		},
		FOUR_FIVE_SIX: {
			type: "FOUR_FIVE_SIX",
			default:
				"https://static.yaame.io/animal/21639f289fc142388877d2fa131f12e3.png",
			disabled:
				"https://static.yaame.io/animal/268dc487b97b4fe3820b00f18387a49a.png",
			active:
				"https://static.yaame.io/animal/86ab3b287f2043dc92add93e961e8365.png",
			value: 0,
		},
	};
};
const getTWTwice = () => {
	return {
		ONE_TWO_THREE: {
			type: "ONE_TWO_THREE",
			default:
				"https://static.yaame.io/animal/fe3275ae9d0948b2a3cb62c391694523.png",
			disabled:
				"https://static.yaame.io/animal/7e693298168e479fb56aae81245e3576.png",
			active:
				"https://static.yaame.io/animal/d770262c53494db3b7981f4b5c727399.png",
			value: 0,
		},
		FOUR_FIVE_SIX: {
			type: "FOUR_FIVE_SIX",
			default:
				"https://static.yaame.io/animal/a03fff8a3f5142c8ba8be39d4c369607.png",
			disabled:
				"https://static.yaame.io/animal/b9d0c72d1ea14b139a66fd44b10b86cc.png",
			active:
				"https://static.yaame.io/animal/0b1addaf15ae475785955d9f6cedf9c5.png",
			value: 0,
		},
	};
};
// =======================================================================
const getDefaultUserList = () => {
	return new Array(7).fill({
		// 默认占位图
		a: "https://static.yaame.io/admin/8c3b0cd98d7a833f42ceb6612a8362c7.png",
		v: 0,
	});
};
// =======================================================================
export default {
	components: {
		popup: () => import("../../components/common/pop_up.vue"),
	},
	data() {
		return {
			nim: null,
			// 用户基本信息
			base_info: {
				chat_room_id: "",
				token: "",
				app_key: "",
				chatroom_addresses: [],
				avatar: "",
				nick_name: "",
				uid: "",
			},
			// 游戏基本信息
			bean: 0, // 金豆余额
			diamond: 0, // 钻石余额
			start_time: null, // 比赛开始时间
			end_time: null, // 比赛结束时间
			match_id: null, // 比赛id,为空时代表没有比赛
			betting: [], // 已投注详情
			init_stage: "", // betting（下注中）、running（比赛中）
			// sixfold、triple、twice
			betting_type: {
				sixfold: "",
				triple: "",
				twice: "",
			},
			// 赛跑记录数据
			records: [],
			// 开局倒计时
			countdowns: 0,
			timer: null,
			// 金币不足钻石兑换弹窗
			confirm_check_flag: true,
			match_type: "", // 档位类型
			type: "", // 下注类型
			// 结果
			reward_info: {
				n: 0, // 中奖赛道
				r: [], // 中奖名单
				bean: 0, // 竞猜成功获得的金豆数量，为0则表示未中奖
				extra_bean: 0, // 额外获得奖励金豆值
				e: [], // 额外金豆奖励中奖名单
			},
			// 投注用户列表
			user_list: getDefaultUserList(),

			rule_modal: false,
			record_modal: false,
			join_record_modal: false,
			join_records: [],
			res_modal: false,
			price_list: [10, 100, 500, 1000], // 投注金豆档位
			betting_bean: 100, // 选中档位金豆数量
			images: {
				rule_btn:
					"https://static.yaame.io/admin/053e1c19e67ffd75d2c6c3157d7549c5.png",
				bean_active:
					"https://static.yaame.io/admin/3594eb51ddfc0d0dc365fc8c9cdc1db2.png",
				bean_default:
					"https://static.yaame.io/admin/274d38c76e7d2b8ef3cb93777b0844fe.png",
				animal_gif: [
					{
						name: "Deer",
						gif_url:
							"https://static.yaame.io/admin/4cfb030f155130fc1ed348b87ba5e6ad.gif",
						url: "https://static.yaame.io/admin/39131d182f30f1f761b4093922d81ef9.png",
					},
					{
						name: "Fox",
						gif_url:
							"https://static.yaame.io/admin/bd3835c618d27cd57f2ae0d55a64f731.gif",
						url: "https://static.yaame.io/admin/20337e6ddf6b62f0bfbdd98e9609e193.png",
					},
					{
						name: "Cat",
						gif_url:
							"https://static.yaame.io/animal/c132f41dd652407ca321f26b2a3d4a00.gif",
						url: "https://static.yaame.io/animal/354e54d8c9b248ae94bbf78e523881ca.png",
					},
					{
						name: "Rabbit",
						gif_url:
							"https://static.yaame.io/animal/18cb429a786642be81278d1d18746522.gif",
						url: "https://static.yaame.io/animal/0fad8a787dbe4769ad9767b5b5662f24.png",
					},
					{
						name: "Dog",
						gif_url:
							"https://static.yaame.io/admin/30b7ef6870c25025799b61541d8ff2a3.gif",
						url: "https://static.yaame.io/admin/0898e92736d27f1239c16e769fa47f2d.png",
					},
					{
						name: "Sheep",
						gif_url:
							"https://static.yaame.io/admin/5d13be42e6ec0a9418423fc163e4914c.gif",
						url: "https://static.yaame.io/admin/7ec638b9f04f9753536ecd8f7b946a26.png",
					},
				],
				record_modal_animal: [
					"https://static.yaame.io/admin/77270cafdca8d9f8c2efc3a5857fba06.png",
					"https://static.yaame.io/admin/6029dfda095077af584bc58b7ce70698.png",
					"https://static.yaame.io/animal/57f2c6ae687f4c8daaaaa498f1f51ef0.png",
					"https://static.yaame.io/animal/0b339051f6e946efac6508723cbcb999.png",
					"https://static.yaame.io/admin/84b8b211eb6e950a0d6eb675ca08f59b.png",
					"https://static.yaame.io/admin/eb0df23834c81349bff7388b92210add.png",
				],
				qizhi: [
					"http://imgcom.static.suishenyun.net/h5/6fb871b1-6750-4add-b45a-61a5f9e4c6f3.png",
					"http://imgcom.static.suishenyun.net/h5/01e76168-d491-433f-9002-2dfe88cbab30.png",
					"http://imgcom.static.suishenyun.net/h5/7d74a66c-8e86-4e57-a0b7-4081796b4b82.png",
					"http://imgcom.static.suishenyun.net/h5/043e833a-6031-46f2-ba7a-60f05cbced93.png",
					"http://imgcom.static.suishenyun.net/h5/b3a2f535-504d-4309-9ab0-3d3ba489f6f7.png",
					"http://imgcom.static.suishenyun.net/h5/dad9487a-5191-44f6-84f8-a01d1d48e5ab.png",
				],
			},
			// 六倍
			sixfold_match_list: {},
			// 三倍
			triple_match_list: {},
			// 二倍
			twice_match_list: getDefaultTwice(),

			// 本轮用户累计投注总数（包括金豆、钻石）
			round_total: 0,

			// 是否在额外金豆活动期间
			in_act: false,

			// 限时开启
			resting: false,
			resting_desc: "",

			language: getLanguage() || "en",

			loading: true,
		};
	},
	computed: {
		twice_match_list_show() {
			return Object.values(this.twice_match_list);
		},
		triple_match_list_show() {
			return Object.values(this.triple_match_list);
		},
		sixfold_match_list_show() {
			return Object.values(this.sixfold_match_list);
		},
		user_list_show() {
			return this.user_list.slice(0, 7);
		},

		loadingImg() {
			if (this.language === "en") {
				return "https://static.yaame.io/animal/b0ee93a1801b4883aea978681f956ff4.png";
			} else if (this.language === "id") {
				return "https://static.yaame.io/animal/1cf4e83ebdf043bba7de433dd44ff077.png";
			} else if (this.language === "zh-tw") {
				return "https://static.yaame.io/animal/f8014876ded04ab0bef9aef71f2df290.png";
			} else {
				return "https://static.yaame.io/admin/e5037a5991a1b781def956603b48710e.png";
			}
		},

		loadingPage() {
			if (this.language === "en") {
				return "https://static.yaame.io/admin/daa9d719ea6d4fe2e17bbdad25eab28a.png";
			} else if (this.language === "id") {
				return "https://static.yaame.io/admin/ed48bad6a7ba9a0910902b788adc333c.png";
			} else if (this.language === "zh-tw") {
				return "https://static.yaame.io/admin/079654b3c004382bf75c7a791e236444.png";
			} else {
				return "https://static.yaame.io/admin/1d4579c5f06e78a95dc2191c2c58bc0c.png";
			}
		},
	},
	mounted() {
		let self = this;
		this.joinGame();

		if (this.language === "en") {
			this.sixfold_match_list = getENSixfold();
			this.triple_match_list = getENTriple();
			this.twice_match_list = getENTwice();
		} else if (this.language === "id") {
			this.sixfold_match_list = getIDSixfold();
			this.triple_match_list = getIDTriple();
			this.twice_match_list = getIDTwice();
		} else if (this.language === "zh-cn" || this.language === "zh") {
			this.sixfold_match_list = getDefaultSixfold();
			this.triple_match_list = getDefaultTriple();
			this.twice_match_list = getDefaultTwice();
		} else {
			this.sixfold_match_list = getTWSixfold();
			this.triple_match_list = getTWTriple();
			this.twice_match_list = getTWTwice();
		}

		window.onload = function () {
			self.loading = false;
		};
	},
	destroyed() {
		this.clearAllTimer();
		if (this.nim) {
			this.nim.disconnect();
			this.nim.destroy();
		}
	},
	methods: {
		formatDate,
		clearAllTimer() {
			clearTimeout(this.timer);
		},
		randomFrom(lowerValue, upperValue) {
			return Math.floor(
				Math.random() * (upperValue - lowerValue + 1) + lowerValue
			);
		},
		getCharCount(str) {
			return (str.match(/_/g) || []).length;
		},
		// 动物奔跑 n：第n个赛道的小动物赢了
		gogogo(n) {
			let array = document.getElementsByClassName("animal-gif");
			for (let index = 0; index < array.length; index++) {
				const element = array[index];
				if (index === n - 1) {
					element.classList.add("runAnimation_1");
				} else {
					let random_index = this.randomFrom(2, 6);
					element.classList.add(`runAnimation_${random_index}`);
				}
			}
		},
		// 动物回到起点
		animalHoming() {
			let array = document.getElementsByClassName("animal-gif");
			for (let index = 0; index < array.length; index++) {
				const element = array[index];
				element.classList = `animal-gif animal-gif-${index}`;
			}
		},
		/**
		 * @description: 加入游戏，获取房间id token
		 * @return {*}
		 */
		async joinGame() {
			let { status, data, desc } = await request.joinZootopia();
			if (status !== 1000 && status !== 4004) return;
			// 未到开启时间
			if (status === 4004) {
				this.showResting(desc);
				return;
			}
			Object.assign(this.base_info, data);

			// 判断是否在额外返金豆活动中
			if (data.active) {
				this.in_act = true;
			} else {
				this.in_act = false;
			}

			// 登录云信
			this.initNim();
		},
		/**
		 * @description: 获取游戏基本信息
		 * @return {*}
		 */
		async getHomeInfo() {
			let { status, data } = await request.getZootopiaInfo();
			if (status !== 1000) return;
			Object.assign(this, data);

			// 正处于下注状态
			let now = new Date().getTime();
			if (this.match_id && now < this.end_time) {
				this.countdowns = Math.floor((this.end_time - now) / 1000);
				this.countDown();
				this.init_stage = "betting";
			} else {
				this.init_stage = "running";
			}

			if (data.betting && data.betting.length > 0) {
				// 本局已有投注，更新已投注
				for (let i = 0; i < data.betting.length; i++) {
					const item = data.betting[i];
					let { type, amount } = item;
					const char_times = this.getCharCount(type);

					if (char_times === 0) {
						this.betting_type.sixfold = type;
						Object.assign(this.sixfold_match_list[type], { value: amount });
					} else if (char_times === 1) {
						this.betting_type.triple = type;
						Object.assign(this.triple_match_list[type], { value: amount });
					} else if (char_times === 2) {
						this.betting_type.twice = type;
						Object.assign(this.twice_match_list[type], { value: amount });
					}
				}
			}
		},
		// 投注校验
		async validateBetting(type, match_type) {
			if (new Date().getTime() >= this.end_time) {
				// 投注已结束
				Toast(this.$t("toast-4"));
				return false;
			}
			if (
				this.betting_type[match_type] &&
				this.betting_type[match_type] !== type
			) {
				return false;
			}
			let balance_sum = this.diamond;
			// 金币和钻石的余额总和也不足本次下注，弹出充值提示弹窗，引导充值
			if (this.betting_bean > balance_sum) {
				window.location.href = "wlyaame://mine/shop/diamond?popup=1";
				await sleep(300);
				Toast(this.$t("toast-3"));
				return false;
			}
			return true;
		},
		/**
		 * @description: 处理三个档位的下注事件
		 * @param {*} type  押注类型,可用值:ONE,TWO,THREE,FOUR,FIVE,SIX,ONE_TWO,THREE_FOUR,FIVE_SIX,ONE_TWO_THREE,FOUR_FIVE_SIX
		 * @param {*} match_type 可用值 sixfold、triple、twice
		 * @return {*}
		 */
		async handlerBetting(type, match_type) {
			this.match_type = match_type;
			this.type = type;
			let valid = await this.validateBetting(type, match_type);

			if (!valid) return;
			this.submitBetting();
		},
		/**
		 * @description: 提交下注请求
		 * @param {*}
		 * @return {*}
		 */
		async submitBetting() {
			let match_type = this.match_type;
			let type = this.type;
			let { status, data } = await request.bettingZootopia({
				match_id: this.match_id,
				bean: this.betting_bean,
				type,
			});
			if (status !== 1000) return;
			let { bean, diamond, betting } = data;
			this.round_total = this.round_total + this.betting_bean;

			// 押注阶段最后三秒的用户更新消息不在聊天室广播，只更新本地的用户列表
			if (this.countdowns > 3) {
				this.sendNewComerMsg(this.betting_bean);
			} else {
				this.user_list.unshift({
					a: this.base_info.avatar,
					v: this.betting_bean,
				});
			}
			this.diamond = diamond;

			// 给该档位的type赋值
			this.betting_type[match_type] = type;

			// 更新投注份额
			// this[match_type + '_match_list'].map(item => {
			//     if (item.type === type) {
			//         Object.assign(item, { value: betting });
			//     }
			// });
			this[match_type + "_match_list"][type] = Object.assign(
				this[match_type + "_match_list"][type],
				{ value: betting }
			);
		},
		/**
		 * @description: 开局倒计时
		 * @return {*}
		 */
		countDown() {
			this.timer = setTimeout(() => {
				this.countdowns--;
				if (this.countdowns <= 0) {
					clearTimeout(this.timer);
					this.countdowns = 0;
					return;
				}
				this.countDown();
			}, 1000);
		},
		/**
		 * @description: 打开赛跑记录弹窗
		 * @return {*}
		 */
		showRecordModal() {
			this.record_modal = true;
			this.getRecords();
		},
		/**
		 * @description: 获取赛跑记录
		 * @return {*}
		 */
		async getRecords() {
			let { status, data } = await request.getZootopiaRecords();
			if (status !== 1000) return;

			this.records = data.match_records;
		},
		momentFormatData(time) {
			return moment(time).format("YYYY-MM-DD HH:mm:ss");
		},
		/**
		 * @description: 打开参与记录弹窗
		 * @return {*}
		 */
		showJoinRecordModal() {
			this.join_record_modal = true;
			this.getJoinRecords();
		},
		/**
		 * @description: 获取参与记录
		 * @return {*}
		 */
		async getJoinRecords() {
			let { status, data } = await request.getZootopiaJoinRecords();
			if (status !== 1000) return;
			this.join_records = data.betting_records;
			this.join_records.forEach((item) => {
				if (item.records.includes(item.win_num)) {
					item.win = true;
					item.desc = this.$t("toast-1", {
						win_num: item.win_num,
						reward: item.reward,
					});
				} else {
					item.win = false;
					item.desc = this.$t("toast-2", {
						win_num: item.win_num,
						records: item.records.join(","),
					});
				}
			});
			this.$forceUpdate();
		},

		// 开始新的一局
		createGame(msg_data) {
			let { id, st, et } = msg_data;
			this.match_id = id;
			this.start_time = st;
			this.end_time = et;

			let now = new Date().getTime();

			// 重置倒计时
			if (this.match_id && now < this.end_time) {
				this.countdowns = Math.floor((this.end_time - now) / 1000);
				this.countDown();
			}
			// 重置数据
			this.init_stage = "";
			this.reward_info = {
				n: 0,
				r: [],
				bean: 0,
				extra_bean: 0,
				e: [],
			};
			this.betting_type = {
				sixfold: "",
				triple: "",
				twice: "",
			};
			this.sixfold_match_list = getDefaultSixfold();
			// this.triple_match_list = getDefaultTriple();
			// this.twice_match_list = getDefaultTwice();

			if (this.language === "en") {
				this.sixfold_match_list = getENSixfold();
				this.triple_match_list = getENTriple();
				this.twice_match_list = getENTwice();
			} else if (this.language === "id") {
				this.sixfold_match_list = getIDSixfold();
				this.triple_match_list = getIDTriple();
				this.twice_match_list = getIDTwice();
			} else if (this.language === "zh-cn" || this.language === "zh") {
				this.sixfold_match_list = getDefaultSixfold();
				this.triple_match_list = getDefaultTriple();
				this.twice_match_list = getDefaultTwice();
			} else {
				this.sixfold_match_list = getTWSixfold();
				this.triple_match_list = getTWTriple();
				this.twice_match_list = getTWTwice();
			}
			this.user_list = getDefaultUserList();

			this.round_total = 0;
		},
		// 投注阶段结束
		async gameOver(msg_data) {
			let { id, n, r, e } = msg_data;
			if (this.match_id !== id) return;
			this.reward_info.n = n;
			this.reward_info.r = r || [];
			this.reward_info.e = e || [];
			// console.log('本次结果', n, r);
			// 判断当前用户是否获得额外金豆奖励
			if (e && e.length) {
				this.reward_info.e = e;
				let user = e.find((item) => item.u === this.base_info.uid);
				if (user) {
					this.reward_info.extra_bean = user.r;
				}
			}
			// 计算中奖结果
			this.calculateResult();
			// 清除倒计时
			this.countdowns = 0;
			clearTimeout(this.timer);
			this.gogogo(n);
			await sleep(5200);
			this.res_modal = true;
			// 更新金币余额
			if (this.reward_info.bean > 0) {
				this.diamond = this.diamond + this.reward_info.bean;
			}
			await sleep(4000);
			this.res_modal = false;
			this.animalHoming();
		},
		// 计算是否中奖，以及中奖的金额
		calculateResult() {
			let win_key = N_ENUM[this.reward_info.n];
			let num = 0;
			for (let key of Object.keys(this.betting_type)) {
				const type = this.betting_type[key];
				if (type.indexOf(win_key) > -1) {
					// 中奖了
					let cur_list = Object.values(this[key + "_match_list"]);
					for (let i = 0; i < cur_list.length; i++) {
						const detail = cur_list[i];
						if (detail.type.indexOf(win_key) > -1) {
							num = num + detail.value * DEFAULT_MULTIPLE_ENMU[key];
						}
					}
				}
			}
			// this.diamond = this.diamond + num;
			this.reward_info.bean = num;
		},
		/**
		 * @description: 登录云信
		 * @return {*}
		 */
		initNim() {
			let { app_key, chat_room_id, chatroom_addresses, token, uid } =
				this.base_info;
			let self = this;

			console.log(app_key);
			try {
				self.nim = new SDK.Chatroom({
					// debug: true,
					chatroomId: chat_room_id,
					appKey: app_key,
					account: uid,
					token: token,
					db: false,
					chatroomAddresses: chatroom_addresses,
					loginAuthType: 1,
					done: self.getChatroomAddressDone,
					onconnect: self.onChatroomConnect,
					onerror: self.onChatroomError,
					onmsgs: self.onChatroomMsgs,
					onwillreconnect: self.onChatroomWillReconnect,
					ondisconnect: self.onChatroomDisconnect,
				});
			} catch (error) {
				console.log("==========");
				console.log("error", error);
			}
		},
		// 处理收到自定义消息
		onChatroomMsgs(msgs) {
			if (!Array.isArray(msgs)) {
				msgs = [msgs];
			}
			let msg = msgs[0];
			if (msg.type !== "custom") return;
			if (isEmpty(msg.content)) return;
			let { msg_type, msg_data } = JSON.parse(msg.content);
			// console.log('收到聊天室消息', msg_type, msg_data);
			switch (msg_type) {
				case "ANIMAL_MATCH_CREAT":
					// 投注阶段开始
					this.createGame(msg_data);
					break;
				case "ANIMAL_MATCH_OVER":
					// 投注阶段结束
					this.gameOver(msg_data);
					break;
				case "ANIMAL_MATCH_STOP":
					// 限时开启时间结束
					this.showResting(msg_data.tips);
					break;
				case "NEW_COMER":
					// 更新用户列表
					this.user_list.unshift(msg_data);
					break;
				case "ANIMAL_MATCH_EXTRA_START":
					// 额外金豆奖励开始
					this.in_act = true;
					break;
				case "ANIMAL_MATCH_EXTRA_END":
					// 额外金豆奖励结束
					this.in_act = false;
					break;
				default:
					break;
			}
		},
		getChatroomAddressDone(error, obj) {
			console.log("获取聊天室地址" + (!error ? "成功" : "失败"), error, obj);
		},
		onChatroomConnect(obj) {
			console.log("进入聊天室", obj);
			// 获取游戏信息
			this.getHomeInfo();
		},
		onChatroomError(error, obj) {
			console.log("发生错误", error, obj);
			// 重新进入聊天室
			this.reconnectionGame();
		},
		onChatroomWillReconnect(obj) {
			// 此时说明 `SDK` 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
			console.log("即将重连", obj);
			// this.reconnectionGame();
		},
		onChatroomDisconnect(error) {
			// 此时说明 `SDK` 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
			console.log("连接断开", error);
			if (error) {
				switch (error.code) {
					// 账号或者密码错误, 请跳转到登录页面并提示错误
					case 302:
						break;
					// 被踢, 请提示错误后跳转到登录页面
					case "kicked":
						break;
					default:
						break;
				}
			}
			// this.reconnectionGame();
		},
		reconnectionGame() {
			this.nim = null;
			this.joinGame();
		},
		sendNewComerMsg(v) {
			let content = {
				msg_type: "NEW_COMER",
				msg_data: {
					a: this.base_info.avatar,
					v,
				},
			};
			const msg = this.nim.sendCustomMsg({
				content: JSON.stringify(content),
				done: this.sendChatroomMsgDone(content.msg_data),
			});
		},
		// 发送消息成功回调
		sendChatroomMsgDone(user) {
			this.user_list.unshift(user);
		},
		// 展示休息中弹窗
		showResting(msg_data) {
			this.resting = true;
			this.resting_desc = msg_data;
		},
	},
};
</script>
<style lang="less" scoped>
.main {
	width: 7.5rem;
	height: 11.69rem;
	background-image: url("https://static.yaame.io/admin/f87076457cdc51ea238d7ab3abc4ac5e.png");
	background-size: 7.5rem 11.69rem;
	position: relative;
	padding-top: 7.49rem;
}
.main-en {
	background-image: url(https://static.yaame.io/admin/095852c9839d18bd9fc96209da7700eb.png);
}
.main-id {
	background-image: url(https://static.yaame.io/admin/c0a69634163121dcc2c9155bf9e0aee6.png);
}
.main-zh-tw {
	background-image: url(https://static.yaame.io/admin/d900563cf9ea12921a269d37b40af845.png);
}
.flex-box {
	display: flex;
	align-items: center;
	justify-content: center;
}
.fixed-btn {
	position: fixed;
	&.rule {
		width: 0.64rem;
		height: 0.64rem;
		left: 0.28rem;
		top: 0.22rem;
	}
	&.record {
		width: 1.2rem;
		height: 0.51rem;
		right: 0;
		top: 0.28rem;
		background-size: contain;
		background-repeat: no-repeat;
		background-image: url(https://static.yaame.io/admin/68dbb2f1015edd7e289f8c23eb35d9a0.png);
		&.record-en {
			background-image: url(https://static.yaame.io/admin/51b8bbd19d6d8fc932dbc12955bac5e1.png);
		}
		&.record-id {
			background-image: url(https://static.yaame.io/admin/8f3b7018c721124d7dda30903018f4be.png);
		}
		&.record-zh-tw {
			background-image: url(https://static.yaame.io/admin/8dd68b6738054197d3093c1332d66072.png);
		}
	}
	&.join-record {
		width: 1.2rem;
		height: 0.51rem;
		right: 0;
		top: 0.95rem;
		background-image: url(http://img1000.static.suishenyun.net/2e52e1dc5ac9d868e9983bd3fd8ced1c/52bb66ab7089215d90cf9b41237349f9.png);
		background-size: contain;
		background-repeat: no-repeat;
		&.join-record-id {
			background-image: url(https://static.yaame.io/admin/05d352d4c088030e8c65f2706575d203.png);
		}
		&.join-record-en {
			background-image: url(https://static.yaame.io/admin/99e9616ffb92db4d928eaff3f63501fe.png);
		}
		&.join-record-zh-tw {
			background-image: url(https://static.yaame.io/admin/786afd600834d0d634baddee9ca03b5f.png);
		}
	}
}
.act-desc {
	position: absolute;
	font-size: 0.26rem;
	line-height: 0.42rem;
	font-weight: bold;
	color: #cdd1e4;
	top: 2.77rem;
	display: flex;
	flex-direction: column;
	width: 7.5rem;
	padding-left: 0.4rem;
	p {
		display: inline-block;
		margin: 0 auto;
		background: #72789f;
		padding: 0 0.1rem;
	}
}
.countdown {
	position: absolute;
	width: 1.25rem;
	height: 1.32rem;
	background-image: url("https://static.yaame.io/admin/114277549018312f05e40ab074c5f50e.png");
	background-size: 1.25rem 1.32rem;
	left: 3.13rem;
	top: 4.97rem;
	color: #001267;
	font-size: 0.48rem;
	line-height: 0.48rem;
	text-align: center;
	font-weight: 600;
	padding-top: 0.29rem;
}
.countdown-en {
	background-image: url("https://static.yaame.io/admin/c10aecadc4e0567c3cc268948618206d.png");
}
.countdown-id {
	background-image: url("https://static.yaame.io/admin/b406369143b7eb5030c938f7be7dc5c9.png");
}
.countdown-zh-tw {
	background-image: url("https://static.yaame.io/admin/d15f1b62b3e552a97e0460309123f120.png");
}
.user-list {
	display: flex;
	&.home {
		position: absolute;
		width: 7.5rem;
		left: 0;
		top: 6.42rem;
		padding: 0 0.25rem;
	}

	.user-box {
		width: 1rem;
		height: 0.9rem;
		position: relative;
	}

	.user {
		width: 0.8rem;
		height: 0.8rem;
		margin: 0 auto;
		border-radius: 50%;
		background: #b8cfff;
		border: 1px solid rgba(45, 141, 249, 1);
		box-sizing: content-box;
		position: relative;
	}

	.avatar {
		width: 0.8rem;
		height: 0.8rem;
		border-radius: 50%;
		object-fit: cover;
	}
	.value {
		display: flex;
		height: 0.28rem;
		align-items: center;
		background: #3c9aff;
		border-radius: 0.05rem;
		padding-left: 0.05rem;
		padding-right: 0.05rem;
		position: absolute;
		left: 50%;
		transform: translate(-50%, -0%) scale(0.66);
		bottom: 0;
		img {
			width: 0.22rem;
			height: 0.22rem;
			margin-right: 0.04rem;
		}
		span {
			font-size: 0.24rem;
			line-height: 0.24rem;
			color: #ffffff;
			font-weight: 600;
		}
	}

	.number {
		position: absolute;
		font-size: 0.24rem;
		line-height: 0.24rem;
		color: #0072ff;
		left: 50%;
		transform: translate(-50%, -0%) scale(0.66);
		top: -0.24rem;
		font-weight: 600;
	}

	&.reward {
		position: absolute;
		width: 6.41rem;
		bottom: 0.34rem;
		justify-content: center;
		.user-box {
			width: 0.9rem;
			height: 0.8rem;
		}
		.user {
			width: 0.72rem;
			height: 0.72rem;
			border: 1px solid solid rgba(0, 166, 255, 1);
		}
		.avatar {
			width: 0.72rem;
			height: 0.72rem;
			border-radius: 50%;
			object-fit: cover;
		}
	}
}
.act-res-modal .user-list.reward {
	bottom: 1.75rem;
	// .user{
	//     background: #FBDDDF;
	//     border: 1px solid rgba(229,28,25,1)
	// }
	// .number{
	//     color: #E51C19;
	// }
	// .value{
	//     background: #E51C19;
	// }
}
.act-res-modal .user-list.reward.extra-reward {
	bottom: 0.42rem;
}

.content {
	height: 2.98rem;
	position: relative;
	padding-left: 0.6rem;
	.multiple_icon {
		position: absolute;
		width: 0.62rem;
		height: 0.6rem;
		left: 0;
		&.multiple_2 {
			top: 2.1rem;
		}
		&.multiple_3 {
			top: 1.12rem;
		}
		&.multiple_6 {
			top: 0.14rem;
		}
	}
}
.row {
	display: flex;
}
.cell {
	height: 0.9rem;
	margin-right: 0.08rem;
	position: relative;
	&.sixfold-cell {
		width: 1.06rem;
		background-size: 1.06rem 0.9rem;
	}
	&.triple-cell {
		width: 2.2rem;
		background-size: 2.2rem 0.9rem;
	}
	&.twice-cell {
		width: 3.34rem;
		background-size: 3.34rem 0.9rem;
	}
	.cell-value {
		display: flex;
		height: 0.3rem;
		align-items: center;
		position: absolute;
		left: 0;
		transform: translate(-5%, -0%) scale(0.66);
		top: 0.03rem;
		img {
			width: 0.22rem;
			height: 0.22rem;
			margin-right: 0.04rem;
		}
		span {
			font-size: 0.3rem;
			line-height: 0.3rem;
			color: #ffffff;
			font-weight: bold;
		}
	}
}
.bottom {
	width: 7.24rem;
	height: 1rem;
	background: #0035ce;
	border-radius: 0.1rem;
	margin: 0 auto;
	display: flex;
	padding-left: 0.12rem;
	padding-top: 0.1rem;
}

.balance-box {
	width: 2rem;
	height: 0.38rem;
	background: rgba(0, 0, 0, 0.2);
	border-radius: 0.06rem;
	display: flex;
	align-items: center;
	font-size: 0.24rem;
	line-height: 0.38rem;
	color: #ffffff;
	font-weight: 600;
	padding-left: 0.06rem;
	img {
		display: block;
		width: 0.23rem;
		// height: 0.23rem;
		margin-right: 0.1rem;
	}
}
.bet-btn {
	width: 1.17rem;
	height: 0.8rem;
	background-image: url(https://static.yaame.io/admin/4571750f0df683758375625009119ca8.png);
	background-size: 1.17rem 0.8rem;
	margin-right: 0.06rem;
	display: flex;
	align-items: center;
	justify-content: center;

	span {
		font-size: 0.24rem;
		line-height: 0.36rem;
		color: #ffffff;
		font-weight: bold;
	}
	img {
		display: block;
		width: 0.24rem;
		height: 0.24rem;
		margin-right: 0.05rem;
	}
	&.active {
		background-image: url(https://static.yaame.io/admin/e0848ec3847a92fe883812a837654a97.png);
	}
}
.record-modal {
	position: relative;
	width: 6.41rem;
	height: 8.12rem;
	background-image: url(https://static.yaame.io/admin/b77e3e7c01651f9f6b414afea65c7360.png);
	background-size: 6.41rem 8.12rem;
	padding: 0.86rem 0 0 0.4rem;
	&.record-modal-en {
		background-image: url(https://static.yaame.io/admin/100df9e4332eb77ded80a83083f193c1.png);
	}
	&.record-modal-id {
		background-image: url(https://static.yaame.io/admin/5349d9903e022b51a3161f2f2e2b50ad.png);
	}
	&.record-modal-zh-tw {
		background-image: url(https://static.yaame.io/admin/d36227c02f51ad4d0d9e62a1344bf04c.png);
	}
	.record-list {
		height: 6.5rem;
		overflow-y: scroll;
	}
	.record-row {
		display: flex;
		height: 0.6rem;
		margin-bottom: 0.02rem;
		.time {
			width: 1.3rem;
			background: rgba(255, 255, 255, 0.6);
			color: #007189;
			padding-top: 0.05rem;
			p {
				font-size: 0.24rem;
				line-height: 0.24rem;
				transform: scale(0.66);
				text-align: center;
				font-weight: 600;
			}
			margin-right: 0.02rem;
		}
		.qizhi {
			width: 0.7rem;
			background: rgba(255, 255, 255, 0.6);
			margin-right: 0.02rem;
			display: flex;
			align-items: center;
			justify-content: center;
			img {
				display: block;
				width: 0.25rem;
				height: 0.4rem;
			}
		}
	}
	.record-title {
		display: flex;
		height: 0.42rem;
		.time {
			width: 1.3rem;
			height: 0.42rem;
			font-size: 0.24rem;
			line-height: 0.42rem;
			color: #ffffff;
			font-weight: 600;
			background: #007189;
			text-align: center;
			margin-right: 0.02rem;
		}
		.animal {
			width: 0.7rem;
			height: 0.42rem;
			margin-right: 0.02rem;
		}
	}
}

.join-modal {
	position: relative;
	width: 6.41rem;
	height: 8.12rem;
	background-image: url(https://static.yaame.io/admin/6cbaa427732a7b8ede8e08bc9fb75ac5.png);
	background-size: 6.41rem 8.12rem;
	padding: 0.86rem 0.57rem 0.4rem;
	&.join-modal-en {
		background-image: url(https://static.yaame.io/admin/96776c71729a1391bc6d1d5fdf6a6f45.png);
	}
	&.join-modal-id {
		background-image: url(https://static.yaame.io/admin/23bbd34b70bf976dd1eeb5c3a1c3b336.png);
	}
	&.join-modal-zh-tw {
		background-image: url(https://static.yaame.io/admin/b8c1b5d6038cd09fed797b020364852c.png);
	}
	.join-content {
		height: 6.5rem;
		overflow-y: auto;
		.join-item {
			margin-bottom: 0.2rem;
			.time {
				font-family: Hiragino Sans GB SemiBold;
				font-size: 0.24rem;
				color: #001267;
				letter-spacing: 0;
				font-weight: 600;
			}
			.record-text {
				font-family: Hiragino Sans GB SemiBold;
				font-size: 0.24rem;
				letter-spacing: 0;
				line-height: 0.4rem;
				font-weight: 600;
			}
			.win-text {
				color: #ff6f06;
			}
			.lose-text {
				color: #0041ff;
			}
		}
	}
	.empty-join {
		width: 100%;
		margin-top: 2.28rem;
		text-align: center;
		.no-record {
			width: 1.25rem;
			height: 1.08rem;
		}
	}
	.footer-title {
		width: 5.27rem;
		height: 0.2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		bottom: 0.44rem;
		img {
			width: 100%;
			height: 100%;
		}
	}
}

.rule-modal {
	position: relative;
	width: 6.41rem;
	height: 8.12rem;
	background-image: url(https://static.yaame.io/admin/7cc0ef2e0975f4866436fbeaa8dbd5c3.png);
	background-size: 6.41rem 8.12rem;
	padding: 0.9rem 0 0;
	font-size: 0.24rem;
	line-height: 0.46rem;
	color: #001267;
	font-weight: 600;
	text-align: justify;
	&.rule-modal-en {
		background-image: url(https://static.yaame.io/admin/3e54025325054a4c16d66d6f5dfd4051.png);
	}
	&.rule-modal-id {
		background-image: url(https://static.yaame.io/admin/2928ed27aa4a838274a57146c6041812.png);
	}
	&.rule-modal-zh-tw {
		background-image: url(https://static.yaame.io/admin/fa52ec97b47754f0ac7ece91cb6348c1.png);
	}
	span {
		color: #0041ff;
	}
	.rule-modal-content {
		height: 6.8rem;
		padding: 0 0.5rem;
		overflow-y: scroll;
	}
}
.modal-close {
	position: absolute;
	width: 0.5rem;
	height: 0.5rem;
	bottom: -0.7rem;
	left: 50%;
	margin-left: -0.25rem;
}

.confirm-modal {
	width: 6.4rem;
	height: 4rem;
	background: #c4ecff;
	border: 2px solid rgba(60, 154, 255, 1);
	border-radius: 0.1rem;
	color: #001267;
	text-align: center;
	padding-top: 0.8rem;
	font-weight: 600;
	p {
		font-size: 0.32rem;
		line-height: 0.48rem;
	}
	.confirm-check-box {
		height: 0.48rem;
		font-size: 0.24rem;
		line-height: 0.36rem;
		margin: 0.24rem 0 0.2rem;
		.confirm-check {
			width: 0.28rem;
			height: 0.28rem;
			background: #ffa606;
			border: 1px solid rgba(60, 154, 255, 1);
			border-radius: 50%;
			margin-right: 0.16rem;
			img {
				display: block;
				width: 0.15rem;
				margin-left: 0.02rem;
			}
		}
	}
	.confirm-btns {
		display: flex;
	}
	.confirm-btn {
		width: 2.2rem;
		height: 0.7rem;
		font-size: 0.26rem;
		line-height: 0.7rem;
		color: #fff;
		border-radius: 0.1rem;
		margin: 0 0.25rem;
		&.cancel {
			background-image: linear-gradient(90deg, #035cdd 0%, #55b5fc 100%);
		}
		&.submit {
			background-image: linear-gradient(90deg, #ff3ab8 0%, #ff61e3 100%);
		}
	}
}

.res-modal {
	position: relative;
	width: 6.41rem;
	height: 5.11rem;
	background-image: url(http://imgcom.static.suishenyun.net/h5/aff7451f-c597-40c7-98e7-cc3d80ba3c36.png);
	background-size: 6.41rem 5.11rem;
	text-align: center;
	font-weight: 600;
	padding-top: 0.68rem;
	&.act-res-modal {
		height: 7.01rem;
		background-image: url(http://imgcom.static.suishenyun.net/h5/d46bdb1d-808b-4910-9d07-d45ffa639f83.png);
		background-size: 6.41rem 7.01rem;
	}
	.title {
		font-size: 0.32rem;
		line-height: 0.32rem;
		color: #ff6f06;
	}
	.animal {
		display: block;
		width: 1.2rem;
		height: 1.2rem;
		margin: 0.13rem auto 0;
	}
	.reward-desc {
		position: absolute;
		top: 3.3rem;
		width: 6.41rem;
		font-size: 0.28rem;
		line-height: 0.42rem;
		font-weight: 600;
		color: #001267;
		span {
			color: #ff6f06;
		}
	}
	.extra-reward-desc {
		position: absolute;
		top: 3.7rem;
		width: 6.41rem;
		font-size: 0.28rem;
		line-height: 0.42rem;
		font-weight: 600;
		color: #0072ff;
		span {
			color: #ff6f06;
		}
	}
	.extra-user-desc {
		position: absolute;
		bottom: 1.25rem;
		width: 6.41rem;
		font-size: 0.28rem;
		line-height: 0.42rem;
		font-weight: 600;
		color: #0072ff;
	}
}
.animal-gif {
	display: block;
	width: 0.9rem;
	height: 0.9rem;
	position: absolute;
	left: 0.29rem;
	&.animal-gif-0 {
		top: 1.63rem;
	}
	&.animal-gif-1 {
		top: 2.35rem;
	}
	&.animal-gif-2 {
		top: 3.07rem;
	}
	&.animal-gif-3 {
		top: 3.79rem;
	}
	&.animal-gif-4 {
		top: 4.51rem;
	}
	&.animal-gif-5 {
		top: 5.23rem;
	}
}
.runAnimation_1 {
	animation: run_1 5s 0.2s cubic-bezier(0.625, 0.155, 0.605, 0.79) both;
}
.runAnimation_2 {
	animation: run_2 5s 0.2s cubic-bezier(0.625, 0.155, 0.605, 0.79) both;
}
.runAnimation_3 {
	animation: run_3 5s 0.2s cubic-bezier(0.625, 0.155, 0.605, 0.79) both;
}
.runAnimation_4 {
	animation: run_4 5s 0.2s cubic-bezier(0.625, 0.155, 0.605, 0.79) both;
}
.runAnimation_5 {
	animation: run_5 5s 0.2s cubic-bezier(0.625, 0.155, 0.605, 0.79) both;
}
.runAnimation_6 {
	animation: run_6 5s 0.2s cubic-bezier(0.625, 0.155, 0.605, 0.79) both;
}
@keyframes run_1 {
	0% {
		transform: translateX(0);
	}
	100% {
		transform: translateX(5.8rem);
	}
}
@keyframes run_2 {
	0% {
		transform: translateX(0);
	}
	100% {
		transform: translateX(5.3rem);
	}
}
@keyframes run_3 {
	0% {
		transform: translateX(0);
	}
	100% {
		transform: translateX(5.1rem);
	}
}
@keyframes run_4 {
	0% {
		transform: translateX(0);
	}
	100% {
		transform: translateX(4.9rem);
	}
}
@keyframes run_5 {
	0% {
		transform: translateX(0);
	}
	100% {
		transform: translateX(4.7rem);
	}
}
@keyframes run_6 {
	0% {
		transform: translateX(0);
	}
	100% {
		transform: translateX(4.5rem);
	}
}

.running-tip {
	position: fixed;
	z-index: 9;
	width: 7.5rem;
	height: 6.18rem;
	left: 0;
	top: 0;
	background-color: rgba(0, 67, 179, 0.3);
	padding-top: 3.67rem;
	img {
		display: block;
		width: 3.5rem;
		height: 0.6rem;
		margin: 0 auto;
	}
}
.loadingPage {
	position: fixed;
	width: 100vw;
	height: auto;
	z-index: 99999999;
	top: 0;
	left: 0;
}
</style>
