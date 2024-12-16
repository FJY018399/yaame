<!--
 * @Author: Elk
 * @Date: 2024-06-10 10:48:29
 * @FilePath: /yaame-h5/src/pages/EidAlAdha/views/mainHall.vue
 * @Description: 
-->
<template>
	<div class="mainHall">
		<div
			class="turntable"
			:style="{ transform: `rotate(${turntableRotate}deg)` }"
		>
			<div
				v-for="(item, index) in dish_list"
				:style="{ transform: `rotate(${turntableItemRotate}deg)` }"
				:class="['turntable-item', 'item-' + index, turntableActive === index && 'active']"
				@click="turntableClick(item, index)"
			>
                <img v-if="item.status_type === 'CAN_NOT_RECEIVE'" :src="item.icon_grey" class="turntable-item-img" alt="" />
				<img v-else :src="item.icon" class="turntable-item-img" alt="" />
				

                <img v-show="turntableActive === index && !showGamePlay" class="select-img" src="https://yaame-static.yaame.io/admin/319c136d693a3c3cb9f4b6feb3865591.png" alt="">
				<div v-if="item.merger_count" class="turntable-count">{{ item.merger_count }}</div>
				<div v-else style="color: #747F80;" class="turntable-count">{{ item.merger_count }}</div>
			</div>
		</div>

		<div v-show="showGamePlay" class="game-play">
			<img :src="gameImgList[language]" alt="" />
		</div>

		<div v-show="!showGamePlay" class="synthesis">
			<div v-if="mergeList && mergeList.length === 3" class="synthesis-list">
				<div
					v-for="(item, index) in mergeList"
					:key="index"
					class="synthesis-item"
				>
					<div class="img-div">
						<img :src="item.icon" alt="" />
					</div>
					<p v-if="item.count >= item.need_count" class="synthesis-item-name">
						{{ item.count }}/{{ item.need_count }}
					</p>
                    <p v-else style="color: #FF7272" class="synthesis-item-name">
						{{ item.count }}/{{ item.need_count }}
					</p>
				</div>
				<div class="synthesis-item">
					<div class="img-div">
						<img :src="turntableActiveItem.icon" alt="" />
					</div>
					<p v-if="turntableActiveItem.merger_count > 0" class="synthesis-item-name">
						{{ turntableActiveItem.name }}
					</p>
                    <p v-else style="color: #FF7272" class="synthesis-item-name">
						{{ $t('insufficient_ingredients') }}
					</p>
				</div>

				<img
					class="synthesis-item-icon"
					style="left: 1.77rem"
					src="https://yaame-static.yaame.io/admin/11215205db59ff469ed20c5cd196d441.png"
					alt=""
				/>
				<img
					class="synthesis-item-icon"
					style="left: 3.47rem"
					src="https://yaame-static.yaame.io/admin/11215205db59ff469ed20c5cd196d441.png"
					alt=""
				/>
				<img
					class="synthesis-item-icon"
					style="left: 5.26rem"
					src="https://yaame-static.yaame.io/admin/d194486cf451ffcccd19a702eca2567e.png"
					alt=""
				/>
			</div>
			<div
				v-if="mergeList && mergeList.length === 4"
				class="synthesis-list-four"
			>
				<div
					v-for="(item, index) in mergeList"
					:key="index"
					class="synthesis-item"
				>
					<div class="img-div">
						<img :src="item.icon" alt="" />
					</div>
					<p v-if="item.count >= item.need_count" class="synthesis-item-name">
						{{ item.count }}/{{ item.need_count }}
					</p>
                    <p v-else style="color: #FF7272" class="synthesis-item-name">
						{{ item.count }}/{{ item.need_count }}
					</p>
				</div>

				<div class="synthesis-item">
					<div class="img-div">
						<img :src="turntableActiveItem.icon" alt="" />
					</div>
					<p v-if="turntableActiveItem.merger_count > 0" class="synthesis-item-name">
						{{ turntableActiveItem.name }}
					</p>
                    <p v-else style="color: #FF7272" class="synthesis-item-name">
						{{ $t('insufficient_ingredients') }}
					</p>
				</div>
				<img
					class="synthesis-item-icon"
					style="left: 1.45rem"
					src="https://yaame-static.yaame.io/admin/11215205db59ff469ed20c5cd196d441.png"
					alt=""
				/>
				<img
					class="synthesis-item-icon"
					style="left: 2.85rem"
					src="https://yaame-static.yaame.io/admin/11215205db59ff469ed20c5cd196d441.png"
					alt=""
				/>
				<img
					class="synthesis-item-icon"
					style="left: 4.25rem"
					src="https://yaame-static.yaame.io/admin/11215205db59ff469ed20c5cd196d441.png"
					alt=""
				/>
				<img
					class="synthesis-item-icon"
					style="left: 5.65rem"
					src="https://yaame-static.yaame.io/admin/d194486cf451ffcccd19a702eca2567e.png"
					alt=""
				/>
			</div>

			<div v-if="turntableActiveItem.merger_count > 1" class="btn-list">
				<div class="btn-item" @click="postCompose(2)">
                    {{ $t('make_times', [turntableActiveItem.merger_count]) }}
				</div>
				<div class="btn-item" @click="postCompose(1)">{{ $t('make_times', [1]) }}</div>
			</div>

			<div
				v-else
				:class="[
					'btn-one',
					turntableActiveItem.merger_count === 0 && 'disabled',
				]"
				@click="postCompose(1)"
			>
				{{ turntableActiveItem.merger_count === 0 ? $t('unable_to_make') : $t('make_food') }}
			</div>
            <div
                v-if="language === 'id'"
				:class="['reward-icon-big', turntableActiveItem.status_type]"
				@click="receiveBox()"
			>{{ $t('food_reward') }}</div>
            <div
                v-else
				:class="['reward-icon', turntableActiveItem.status_type]"
				@click="receiveBox()"
			>{{ $t('food_reward') }}</div>
		</div>

		<div class="route-list">
			<div
				v-for="(item, index) in routeList"
				:key="index"
				:style="{ 'background-image': `url(${item.img})` }"
				class="route-item"
				@click="handleRoute(item)"
			>
				<p class="route-name">{{ $t(item.i18nKey) }}</p>
			</div>
		</div>
		<Popup v-show="resultVisible" class="flex-box">
			<div class="result-container">
				<div class="result-header-text">{{ $t('make_success') }}</div>

				<img class="result-reward-icon" :src="resultContent.icon" alt="" />
				<img
					:class="['result-img bg']"
					src="https://yaame-static.yaame.io/admin/85d2b437379318818eb2a081a01c47ad.png"
					alt=""
				/>
				<p class="result-num">
					{{ resultContent.reward_name }}x{{ resultContent.reward_num }}
				</p>

				<img
					class="close-icon"
					src="https://yaame-static.yaame.io/admin/9fdf039b8172513f17b2ee3742f053bc.png"
					alt=""
					@click="closePopup('result')"
				/>

				<div class="result-btn" @click="closePopup('result')">
					{{ $t("confirm") }}
				</div>
				<p class="result-progress">
					{{ $t("rank_points") }}+{{ resultContent.score }}
				</p>
			</div>
		</Popup>

		<Popup v-show="rewardVisible" class="flex-box">
			<div class="result-container">
				<img
					class="result-header"
					:src="rewardHeaderImgList[language]"
					alt=""
				/>

				<img
					class="result-reward-icon"
					:src="rewardContent.reward_icon"
					alt=""
				/>
				<img
					:class="['result-img bg']"
					src="https://yaame-static.yaame.io/admin/85d2b437379318818eb2a081a01c47ad.png"
					alt=""
				/>
				<p v-if="rewardContent.diamond_worth" class="result-num">
					x{{ rewardContent.diamond_worth }}
					<img
						src="https://yaame-static.yaame.io/admin/f8a2d6dd3c7c1516135e1d2e6d3bc6fc.png"
						alt=""
					/>
				</p>
                <p v-else-if="rewardContent.reward_name" class="result-num">
					{{ rewardContent.reward_name }}
				</p>

				<img
					class="close-icon"
					src="https://yaame-static.yaame.io/admin/9fdf039b8172513f17b2ee3742f053bc.png"
					alt=""
					@click="closePopup('reward')"
				/>

				<div class="result-btn" @click="closePopup('reward')">
					{{ $t("confirm") }}
				</div>
			</div>
		</Popup>

		<BackPack v-if="backPackShow" @close="backPackShow = false"></BackPack>
	</div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, computed, watch } from "vue";
import { getLanguage } from "@/lib/device";
import { getHomeInfoApi, postComposeApi, postFoodRewardApi } from "../api.js";
import Popup from "@/components/common/pop_up";
import BackPack from "../components/backpack";
import { Toast } from "vant";
const root = getCurrentInstance();

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

let dish_list = ref([]);
let showGamePlay = ref(true);
let turntableActive = ref(0);
let turntableRotate = ref(0);
let turntableItemRotate = ref(0);

let turntableActiveItem = ref({});
const turntableClick = (item, index) => {
	// console.log(index, turntableActive.value);
	showGamePlay.value = false;

	// let diff = Math.abs(turntableActive.value - index);
	let diff = turntableActive.value - index;

    if (diff === 7) {
        turntableRotate.value = turntableRotate.value + 45;
        turntableItemRotate.value = turntableItemRotate.value - 45;
    } else if (diff === -7) {
        turntableRotate.value = turntableRotate.value - 45;
        turntableItemRotate.value = turntableItemRotate.value + 45;
    } else {
        turntableRotate.value = turntableRotate.value - 45 * diff;
        turntableItemRotate.value = turntableItemRotate.value + 45 * diff;
    }

	turntableActive.value = index;
	turntableActiveItem.value = item;
};
let dish_merge_reward_map = ref({});
const getHomeInfo = async () => {
	const res = await getHomeInfoApi();
	if (res.status === 1000) {
		dish_list.value = res.data.dish_list;
		dish_merge_reward_map.value = res.data.dish_merge_reward_map;

		let ingredients_list = res.data.ingredients_list;
		let ingredientsMap = {};
		ingredients_list.forEach((item) => {
			ingredientsMap[item.ingredients] = item.count;
		});

		Object.values(mergeMap.value).forEach((dish) => {
			dish.forEach((item) => {
				if (ingredientsMap.hasOwnProperty(item.ingredients)) {
					item.count = ingredientsMap[item.ingredients];
				}
			});
		});
	} else {
        Toast(res.desc)
    }
};

let gameImgList = ref({
	"zh-cn":
		"https://yaame-static.yaame.io/admin/75f55439fca24a4dc0a969693fab4dd2.png",
	"zh-tw":
		"https://yaame-static.yaame.io/admin/f35078f8cbdcaa995e1ea538a8e81ee5.png",
	en: "https://yaame-static.yaame.io/admin/fdfdc150c3553a08b4e80e5a95210b78.png",
	id: "https://yaame-static.yaame.io/admin/aa95d15cfbce663517bc11e7f0d3fc5f.png",
	ar: "https://yaame-static.yaame.io/admin/452dab3e64a643391f3d4bcf863a04fd.png",
});

let routeList = ref([
	{
		img: "https://yaame-static.yaame.io/admin/23049ecbad3a9f546653effcfce83c80.png",
		i18nKey: "dailyBlessing",
		route: "preheat",
	},
	{
		img: "https://yaame-static.yaame.io/admin/f13d422ee19857051112eff3e6bb93df.png",
		i18nKey: "draw",
		route: "draw",
	},
	{
		img: "https://yaame-static.yaame.io/admin/e45716f65fb2c2664fd9c09e8cd7a5b7.png",
		i18nKey: "task",
		route: "task",
	},
	{
		img: "https://yaame-static.yaame.io/admin/839992e3a27d41d970772251cce1b593.png",
		i18nKey: "bag",
		route: "bag",
	},
]);

let backPackShow = ref(false);
const handleRoute = (item) => {
	if (item.route === "preheat") {
		root.proxy.$router.push({ name: "preheat" });
	} else if (item.route === "draw") {
		root.proxy.$router.push({ name: "turntable" });
	} else if (item.route === "task") {
		root.proxy.$router.push({ name: "task" });
	} else if (item.route === "bag") {
		backPackShow.value = true;
	}
};

let resultVisible = ref(false);
let resultContent = ref({
	icon: "",
	reward_name: "",
	reward_num: 0,
    score: 0
});
let rewardVisible = ref(false);
let rewardContent = ref({
	reward_icon: "",
	reward_id: "",
	diamond_worth: 0,
});
let rewardHeaderImgList = ref({
	"zh-cn":
		"https://yaame-static.yaame.io/admin/0aae3331981e7f406ad1bb632ae3eb0e.png",
	"zh-tw":
		"https://yaame-static.yaame.io/admin/9f12b7638fe090590b7239aebe05cd3e.png",
	en: "https://yaame-static.yaame.io/admin/da5274a3cf2fc39060a9637ea5d41fa8.png",
	id: "https://yaame-static.yaame.io/admin/ebe1ee5b49bc6eb39773ada92c3eafa4.png",
	ar: "https://yaame-static.yaame.io/admin/2eb03f0a9d21844a789ee7c45bd06a8f.png",
});
const closePopup = (type) => {
	if (type === "result") {
		resultVisible.value = false;
	} else if (type === "reward") {
		rewardVisible.value = false;
	}
};

let mergeMap = ref({
	GRILLED_FISH: [
		{
			// 鱼
			count: 0,
			icon: "https://yaame-static.yaame.io/imgs/dummy/18cf72ecd616464dabe5b7ebf8b094b2.png",
			ingredients: "FISH",
			name: "fish",
			need_count: 5,
		},
		{
			// 辣椒
			count: 0,
			icon: "https://yaame-static.yaame.io/imgs/dummy/e0da580fe3904bc99b985f7bc9697bbb.png",
			ingredients: "CAPSICUM",
			name: "capsicum",
			need_count: 10,
		},
		{
			// 洋葱
			count: 0,
			icon: "https://yaame-static.yaame.io/imgs/dummy/d9e40c147a9e49a4a859af8bf06bfeb3.png",
			ingredients: "ONION",
			name: "onion",
			need_count: 10,
		},
		{
			// 蒜
			count: 0,
			icon: "https://yaame-static.yaame.io/imgs/dummy/8ce6ec0a4aa94192b4f97f659fcf5b76.png",
			ingredients: "GARLIC",
			name: "garlic",
			need_count: 10,
		},
	],
	LAVANG_BEEF: [
		{
			// 牛肉
			count: 0,
			icon: "https://yaame-static.yaame.io/imgs/dummy/2bcbb19bd4d34ba9b0c995f3aa03da9d.png",
			ingredients: "BEEF",
			name: "beef",
			need_count: 5,
		},
		{
			// 黑果 
            count: 0,
			icon: "https://yaame-static.yaame.io/imgs/dummy/113deaa1ad6440afb7aac648b3612c09.png",
			ingredients: "BLACK_FRUIT",
			name: "blackFruit",
			need_count: 5,
		},
		{
			// 生姜
			count: 0,
			icon: "https://yaame-static.yaame.io/imgs/dummy/b0126065ad014427ac452171122c1af6.png",
			ingredients: "GINGER",
			name: "ginger",
			need_count: 10,
		},
		{
			// 辣椒
			count: 0,
			icon: "https://yaame-static.yaame.io/imgs/dummy/e0da580fe3904bc99b985f7bc9697bbb.png",
			ingredients: "CAPSICUM",
			name: "capsicum",
			need_count: 10,
		},
	],
	SATAY_LAMB: [
		{
			// 羊肉
			count: 0,
			icon: "https://yaame-static.yaame.io/imgs/dummy/ca54ae70346542bc9aa3ad8b26403c9e.png",
			ingredients: "MUTTON",
			name: "mutton",
			need_count: 5,
		},
		{
			// 沙爹酱
			count: 0,
			icon: "https://yaame-static.yaame.io/imgs/dummy/270deec6d0ee468e83cd15bdc3489321.png",
			ingredients: "SATAY_SAUCE",
			name: "sataySauce",
			need_count: 5,
		},
		{
			// 洋葱
			count: 0,
			icon: "https://yaame-static.yaame.io/imgs/dummy/d9e40c147a9e49a4a859af8bf06bfeb3.png",
			ingredients: "ONION",
			name: "onion",
			need_count: 5,
		},
		{
			// 黄瓜
			count: 0,
			icon: "https://yaame-static.yaame.io/imgs/dummy/6f3f7b8698394140b3e4534a88f22995.png",
			ingredients: "CUCUMBER",
			name: "cucumber",
			need_count: 10,
		},
	],
	RENDANG_BEEF: [
		{
			// 牛肉
			count: 0,
			icon: "https://yaame-static.yaame.io/imgs/dummy/2bcbb19bd4d34ba9b0c995f3aa03da9d.png",
			ingredients: "BEEF",
			name: "beef",
			need_count: 5,
		},
		{
			// 生姜
			count: 0,
			icon: "https://yaame-static.yaame.io/imgs/dummy/b0126065ad014427ac452171122c1af6.png",
			ingredients: "GINGER",
			name: "ginger",
			need_count: 5,
		},
		{
			// 洋葱
			count: 0,
			icon: "https://yaame-static.yaame.io/imgs/dummy/d9e40c147a9e49a4a859af8bf06bfeb3.png",
			ingredients: "ONION",
			name: "onion",
			need_count: 10,
		},
		{
			// 蒜
			count: 0,
			icon: "https://yaame-static.yaame.io/imgs/dummy/8ce6ec0a4aa94192b4f97f659fcf5b76.png",
			ingredients: "GARLIC",
			name: "garlic",
			need_count: 10,
		},
	],
	ROASTED_LAMB: [
		{
			// 羊肉
			count: 0,
			icon: "https://yaame-static.yaame.io/imgs/dummy/ca54ae70346542bc9aa3ad8b26403c9e.png",
			ingredients: "MUTTON",
			name: "mutton",
			need_count: 5,
		},
		{
			// 辣椒
			count: 0,
			icon: "https://yaame-static.yaame.io/imgs/dummy/e0da580fe3904bc99b985f7bc9697bbb.png",
			ingredients: "CAPSICUM",
			name: "capsicum",
			need_count: 10,
		},
		{
			// 洋葱
			count: 0,
			icon: "https://yaame-static.yaame.io/imgs/dummy/d9e40c147a9e49a4a859af8bf06bfeb3.png",
			ingredients: "ONION",
			name: "onion",
			need_count: 5,
		},
		{
			// 蒜
			count: 0,
			icon: "https://yaame-static.yaame.io/imgs/dummy/8ce6ec0a4aa94192b4f97f659fcf5b76.png",
			ingredients: "GARLIC",
			name: "garlic",
			need_count: 5,
		},
	],
	COCONUT_MILK_RICE: [
		{
			// 椰奶
			count: 0,
			icon: "https://yaame-static.yaame.io/imgs/dummy/5860cd3863c940f9845cce2d9465332b.png",
			ingredients: "COCONUT_MILK",
			name: "coconutMilk",
			need_count: 5,
		},
		{
			// 米饭
			count: 0,
			icon: "https://yaame-static.yaame.io/imgs/dummy/858250bdbd864f948cbcd9ee68513f3d.png",
			ingredients: "RICE",
			name: "rice",
			need_count: 5,
		},
		{
			// 鸡蛋
			count: 0,
			icon: "https://yaame-static.yaame.io/imgs/dummy/1aa95f8827294855b69ec2f5f0c157c9.png",
			ingredients: "EGG",
			name: "egg",
			need_count: 5,
		},
		{
			// 黄瓜
			count: 0,
			icon: "https://yaame-static.yaame.io/imgs/dummy/6f3f7b8698394140b3e4534a88f22995.png",
			ingredients: "CUCUMBER",
			name: "cucumber",
			need_count: 5,
		},
	],
	BADONG_CUISINE: [
		{
			// 米饭
			count: 0,
			icon: "https://yaame-static.yaame.io/imgs/dummy/858250bdbd864f948cbcd9ee68513f3d.png",
			ingredients: "RICE",
			name: "rice",
			need_count: 10,
		},
		{
			// 辣椒
			count: 0,
			icon: "https://yaame-static.yaame.io/imgs/dummy/e0da580fe3904bc99b985f7bc9697bbb.png",
			ingredients: "CAPSICUM",
			name: "capsicum",
			need_count: 5,
		},
		{
			// 黄瓜
			count: 0,
			icon: "https://yaame-static.yaame.io/imgs/dummy/6f3f7b8698394140b3e4534a88f22995.png",
			ingredients: "CUCUMBER",
			name: "cucumber",
			need_count: 5,
		},
	],
	FRIED_RICE: [
		{
			// 米饭
			count: 0,
			icon: "https://yaame-static.yaame.io/imgs/dummy/858250bdbd864f948cbcd9ee68513f3d.png",
			ingredients: "RICE",
			name: "rice",
			need_count: 5,
		},
		{
			// 鸡蛋
			count: 0,
			icon: "https://yaame-static.yaame.io/imgs/dummy/1aa95f8827294855b69ec2f5f0c157c9.png",
			ingredients: "EGG",
			name: "egg",
			need_count: 5,
		},
		{
			// 黄瓜
			count: 0,
			icon: "https://yaame-static.yaame.io/imgs/dummy/6f3f7b8698394140b3e4534a88f22995.png",
			ingredients: "CUCUMBER",
			name: "cucumber",
			need_count: 5,
		},
	],
});

let mergeList = computed(() => {
	if (!turntableActiveItem.value.eid_al_ad_dish_type) {
		return [];
	}
	return mergeMap.value[turntableActiveItem.value.eid_al_ad_dish_type];
});

const postCompose = async (val) => {
	if (turntableActiveItem.value.merger_count === 0) {
		return;
	}

	let res = await postComposeApi({
		merge_type: val,
		eid_al_ad_dish_type: turntableActiveItem.value.eid_al_ad_dish_type,
	});

	if (res.status === 1000) {
		resultContent.value = {
			icon: turntableActiveItem.value.icon,
			reward_name: turntableActiveItem.value.name,
			reward_num: val === 1 ? 1 : turntableActiveItem.value.merger_count,
			merge_success_type: res.data.merge_success_type || 0,
            score: res.data.score || 0
		};
		resultVisible.value = true;
		await getHomeInfo();
		turntableActiveItem.value = dish_list.value[turntableActive.value];
	} else {
        Toast(res.desc)
    }
};

const receiveBox = async () => {
	let res = await postFoodRewardApi({
		eid_al_ad_dish_type: turntableActiveItem.value.eid_al_ad_dish_type,
	});

	if (res.status === 1000) {
        // Toast(root.proxy.$t('receive_success'));
		rewardContent.value = res.data.merge_reward;
		rewardVisible.value = true;
		await getHomeInfo();
		turntableActiveItem.value = dish_list.value[turntableActive.value];
	} else {
        Toast(res.desc)
    }
};

watch(() => root.proxy.$route.path, () => {
    if (root.proxy.$route.path.indexOf("mainHall") !== -1) {
        showGamePlay.value = true;
        getHomeInfo();
    }
});
onMounted(() => {
	getHomeInfo();
});
</script>

<style lang="less" scoped>
.mainHall {
	font-size: 0.24rem;
	width: 7.5rem;
	margin-top: 0.17rem;
	padding-bottom: 0.5rem;
	.turntable {
		width: 7.28rem;
		height: 7.15rem;
		background-size: contain;
		background-repeat: no-repeat;
		background-image: url(https://yaame-static.yaame.io/admin/0a663cbc92a9802de97a6fa5fae6c84f.png);
		margin-left: 0.11rem;
		position: relative;
		transition: 500ms;
		.turntable-item {
			width: 1.65rem;
			height: 1.65rem;
			// background-size: contain;
			// background-repeat: no-repeat;
			// background-image: url(https://yaame-static.yaame.io/admin/7265da3ed787c24bd714c229d11bd96a.png);
			position: absolute;
			display: flex;
			justify-content: center;
			align-items: center;
			transition: 200ms;
            z-index: 2;
            &.active {
                z-index: 1;
            }
			.turntable-item-img {
				width: 1.65rem;
				height: 1.65rem;
			}
            .select-img {
                position: absolute;
                left: -0.08rem;
                top: -0.08rem;
                width: 1.781rem;
				height: 1.81rem;
            }
			.turntable-count {
                display: inline-block;
				position: absolute;
				min-width: 0.44rem;
				height: 0.44rem;
                border-radius: 0.44rem;
                padding: 0 0.1rem;
				text-align: center;
				line-height: 0.38rem;
				font-weight: 600;
				font-size: 0.24rem;
				color: #fff;
				left: 1.11rem;
				top: 1.11rem;
                background-color: #00C4AA;
                border: 0.03rem solid #FFE5A6;
                z-index: 99;
            }
			&.item-0 {
				top: 4.99rem;
				left: 2.8rem;
			}
			&.item-1 {
				top: 4.33rem;
				left: 4.39rem;
			}
			&.item-2 {
				top: 2.74rem;
				left: 5.05rem;
			}
			&.item-3 {
				top: 1.15rem;
				left: 4.39rem;
			}
			&.item-4 {
				top: 0.49rem;
				left: 2.8rem;
			}
			&.item-5 {
				top: 1.15rem;
				left: 1.21rem;
			}
			&.item-6 {
				top: 2.74rem;
				left: 0.55rem;
			}
			&.item-7 {
				top: 4.33rem;
				left: 1.21rem;
			}
		}
	}
	.game-play {
		width: 7.17rem;
		height: 1.43rem;
		margin-top: 0.22rem;
		margin-left: 0.17rem;
		// background-size: contain;
		// background-repeat: no-repeat;
		// background-image: url(https://yaame-static.yaame.io/admin/28694061d8322ba155eb32bebe2b015b.png);
		img {
			width: 7.17rem;
			height: 1.43rem;
		}
	}
	.synthesis {
		width: 7.35rem;
		height: 3.82rem;
		background-size: contain;
		background-repeat: no-repeat;
		margin-top: 0.22rem;
		margin-left: 0.08rem;
		background-image: url(https://yaame-static.yaame.io/admin/07b72be67f0d25ae1d4de506e157091b.png);
		position: relative;
		.synthesis-list {
			width: 7.35rem;
			height: 2.66rem;
			padding: 0.84rem 0.4rem 0;
			display: flex;
			justify-content: space-between;
			position: relative;
			.synthesis-item {
				width: 1.26rem;
				.img-div {
					width: 1.26rem;
					height: 1.26rem;
					display: flex;
					justify-content: center;
					align-items: center;
					background-size: contain;
					background-repeat: no-repeat;
					background-image: url(https://yaame-static.yaame.io/admin/588e95ce52fec050d9b1d4bcdb22d1f2.png);
					img {
						width: 0.96rem;
						height: 0.96rem;
					}
				}
				.synthesis-item-name {
					width: 1.26rem;
					font-weight: 600;
					font-size: 0.2rem;
					color: #fee9ab;
					text-align: center;
					margin-top: 0.06rem;
                    line-height: 0.9;
                    margin-top: 0.14rem;
				}
			}
			.synthesis-item-icon {
				width: 0.3rem;
				height: auto;
				position: absolute;
				top: 1.36rem;
			}
		}
		.synthesis-list-four {
			width: 7.35rem;
			height: 2.68rem;
			padding: 0.94rem 0.35rem 0;
			display: flex;
			justify-content: space-between;
			position: relative;
			.synthesis-item {
				width: 1.04rem;
				.img-div {
					width: 1.04rem;
					height: 1.04rem;
					display: flex;
					justify-content: center;
					align-items: center;
					background-size: contain;
					background-repeat: no-repeat;
					background-image: url(https://yaame-static.yaame.io/admin/588e95ce52fec050d9b1d4bcdb22d1f2.png);
					img {
						width: 0.66rem;
						height: 0.66rem;
					}
				}
				.synthesis-item-name {
					width: 1.04rem;
					font-weight: 600;
					font-size: 0.2rem;
					color: #fee9ab;
					text-align: center;
					margin-top: 0.06rem;
                    line-height: 0.9;
                    margin-top: 0.14rem;
				}
			}
			.synthesis-item-icon {
				width: 0.24rem;
				height: auto;
				position: absolute;
				top: 1.36rem;
			}
		}
		.btn-list {
			width: 4.9rem;
			margin-left: 0.56rem;
			height: 0.84rem;
			display: flex;
			justify-content: space-between;
			.btn-item {
				width: 2.3rem;
				height: 0.84rem;
				background-size: contain;
				background-repeat: no-repeat;
				background-image: url(https://yaame-static.yaame.io/admin/53a17f8432f14c8eb95b865521e8b8ef.png);
				text-align: center;
				// line-height: 0.78rem;
				font-weight: 600;
				font-size: 0.3rem;
				color: #854304;
                display: flex;
                align-items: center;
                justify-content: center;
                line-height: 0.9;
                padding-bottom: 0.06rem;
				&.disabled {
					// 灰色滤镜
					filter: grayscale(100%);
				}
			}
		}
		.btn-one {
			width: 2.44rem;
			height: 0.89rem;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/3d5465ad0bdbd5ac453192e84fe64f9e.png);
			position: absolute;
			left: 2.46rem;
			top: 2.66rem;
			text-align: center;
			line-height: 0.98;
			font-weight: 600;
			font-size: 0.3rem;
			color: #854304;
            display: flex;
            align-items: center;
            justify-content: center;
            padding-bottom: 0.1rem;
			&.disabled {
				// 灰色滤镜
				filter: grayscale(100%);
			}
		}
		.reward-icon {
			width: 1.2rem;
			height: 1.2rem;
			position: absolute;
			left: 5.82rem;
			top: 2.5rem;
			background-size: 1.2rem auto;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/638e3fd6fee2b88550550020528e1467.png);
			padding-top: 0.78rem;
			text-align: center;
            // padding-right: 0.2rem;
			font-weight: 600;
			font-size: 0.14rem;
			color: #854304;
			&.CAN_RECEIVE {
				background-image: url(https://yaame-static.yaame.io/admin/9c7f1070165cbab809cbbebb03ff0843.png);
			}
			&.RECEIVED {
				background-image: url(https://yaame-static.yaame.io/admin/ea1e6180bcb25b0942daabe2c2eba449.png);
                color: #293E3B;
			}
		}
        .reward-icon-big {
            width: 1.2rem;
			height: 1.2rem;
			position: absolute;
			left: 5.82rem;
			top: 2.5rem;
			background-size: 1.2rem auto;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/e22488991381e1edcd8028e51bc7f8a0.png);
			padding-top: 0.74rem;
			text-align: center;
			font-weight: 600;
			font-size: 0.14rem;
			color: #854304;
            line-height: 0.9;
            
			&.CAN_RECEIVE {
				background-image: url(https://yaame-static.yaame.io/admin/555d9e5b5e648125d352047da93689b9.png);
			}
			&.RECEIVED {
				background-image: url(https://yaame-static.yaame.io/admin/959d589c8628452791093d825b7c478a.png);
                color: #293E3B;
			}
        }
	}
	.route-list {
		width: 7.5rem;
		height: 1.84rem;
		display: flex;
		justify-content: space-between;
		padding: 0 0.19rem;
		margin-top: 0.22rem;
		.route-item {
			width: 1.6rem;
			height: 1.84rem;
			background-size: contain;
			background-repeat: no-repeat;
			padding-top: 1.48rem;
			.route-name {
				width: 1.6rem;
				text-align: center;
				font-weight: 600;
				font-size: 0.22rem;
				color: #fee9ab;
			}
		}
	}
	.flex-box {
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 10;
		.result-container {
			height: 6.65rem;
			width: 5.1rem;
			position: relative;
			.result-header {
				width: auto;
				max-width: 5.1rem;
                max-height: 1rem;
				height: auto;
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
				top: 0.4rem;
			}
            .result-header-text {
                width: 5.1rem;
                height: 1rem;
                text-align: center;
                line-height: 1rem;
                color: #FCDA7C;
                font-size: 0.7rem;
            }
			.close-icon {
				width: 0.9rem;
				height: 0.9rem;
				position: absolute;
				top: -0.44rem;
				right: -0.6rem;
			}
			.result-reward-icon {
				width: 2.7rem;
				height: 2.7rem;
				position: absolute;
				top: 2.3rem;
				left: 1.2rem;
				z-index: 2;
			}
			.result-img {
				width: 5.1rem;
				height: 5.1rem;
				position: absolute;
				top: 1.1rem;
				left: 0;
				z-index: 2;
				&.bg {
					z-index: 1;
					animation: rotate 30s linear infinite;
				}

				@keyframes rotate {
					0% {
						transform: rotate(0deg);
					}
					100% {
						transform: rotate(360deg);
					}
				}
			}
			.result-num {
				width: 5.1rem;
				position: absolute;
				top: 1.46rem;
				left: 0;
				font-weight: 600;
				font-size: 0.42rem;
				color: #fff28f;
				text-align: center;
				img {
					display: inline;
					width: 0.3rem;
					height: auto;
					vertical-align: middle;
					position: relative;
					bottom: 0.02rem;
				}
			}
			.result-btn {
				width: 4.18rem;
				height: 0.9rem;
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
				bottom: 0;
				text-align: center;
				line-height: 0.9rem;
				font-weight: 600;
				font-size: 0.3rem;
				color: #6b3e17;
				background-size: contain;
				background-repeat: no-repeat;
				background-image: url(https://yaame-static.yaame.io/admin/179a9b76b10e023f1d6d1817bf2cbbc6.png);
				z-index: 3;
			}
			.result-progress {
				width: 5.1rem;
				text-align: center;
				font-weight: 500;
				font-size: 0.26rem;
				color: #fff1aa;
				position: absolute;
				left: 0;
				bottom: -0.6rem;
			}
		}
	}
}
</style>
