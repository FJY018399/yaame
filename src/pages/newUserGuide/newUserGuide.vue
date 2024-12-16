<!--
 * @Author: ZhaoZhiqi
 * @Date: 2023-10-26 10:41:53
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-12-09 15:57:31
 * @Description: 
 * @FilePath: /yaame-h5/src/pages/newUserGuide/newUserGuide.vue
-->
<template>
	<div class="newUserGuide">
		<!-- <Header></Header> -->
		<div class="header-content">
			<p class="title">{{ $t("title") }}</p>
			<p class="content">{{ $t("content") }}</p>
		</div>

		<div class="container">
			<van-tabs class="dress-type" v-model="active" scrollspy sticky>
				<van-tab :title="$t('room')">
					<div class="info">
						<p class="title-p">{{ $t("room.content1") }}</p>
						<p class="info-p">{{ $t("room.content2") }}</p>
						<p class="info-p mb-50">{{ $t("room.content3") }}</p>
						<p class="info-p">{{ $t("room.content4") }}</p>
						<img :src="imgObj.room.img1" alt="" />
						<p class="info-p">{{ $t("room.content5") }}</p>
						<img :src="imgObj.room.img2" alt="" />
						<p class="info-p">{{ $t("room.content6") }}</p>
						<img :src="imgObj.room.img3" alt="" />
						<p class="info-p">{{ $t("room.content7") }}</p>
						<img :src="imgObj.room.img4" alt="" />

						<p style="margin-bottom: 0" class="title-p">
							{{ $t("room.content8") }}
						</p>
						<img style="margin-bottom: 0" :src="imgObj.room.img5" alt="" />
						<img style="margin-bottom: 0" :src="imgObj.room.img6" alt="" />
						<img :src="imgObj.room.img7" alt="" />

						<p class="info-p">{{ $t("room.content13") }}</p>
						<img :src="imgObj.room.img8" alt="" />

						<p class="info-p">{{ $t("room.content14") }}</p>
						<img :src="imgObj.room.img9" alt="" />

						<p class="info-p">{{ $t("room.content15") }}</p>
						<img :src="imgObj.room.img10" alt="" />
					</div>
				</van-tab>
				<van-tab :title="$t('square')">
					<div class="info">
						<p class="title-p">{{ $t("square.content1") }}</p>
						<p class="info-p mb-50">{{ $t("square.content2") }}</p>

						<p class="info-p">{{ $t("square.content3") }}</p>
						<img :src="imgObj.square.img1" alt="" />
						<p class="info-p">{{ $t("square.content4") }}</p>
						<img :src="imgObj.square.img2" alt="" />
						<p class="info-p">{{ $t("square.content5") }}</p>
						<img :src="imgObj.square.img3" alt="" />
						<p class="info-p">{{ $t("square.content6") }}</p>
						<img :src="imgObj.square.img4" alt="" />
						<p class="info-p">{{ $t("square.content7") }}</p>
						<img :src="imgObj.square.img5" alt="" />
					</div>
				</van-tab>
				<van-tab :title="$t('information')">
					<div class="info">
						<p style="margin-bottom: 0.5rem" class="title-p">
							{{ $t("information.content1") }}
						</p>

						<p class="info-p">{{ $t("information.content2") }}</p>
						<img :src="imgObj.information.img1" alt="" />
						<p class="info-p">{{ $t("information.content3") }}</p>
						<img :src="imgObj.information.img2" alt="" />
						<p class="info-p">{{ $t("information.content4") }}</p>
						<img :src="imgObj.information.img3" alt="" />
					</div>
				</van-tab>
				<van-tab :title="$t('my')"
					><div class="info">
						<p style="margin-bottom: 0" class="title-p">
							{{ $t("my.content1") }}
						</p>
						<p style="margin-bottom: 0.5rem" class="title-p">
							{{ $t("my.content2") }}
						</p>
						<p class="info-p">{{ $t("my.content3") }}</p>
						<img :src="imgObj.my.img1" alt="" />
						<p class="info-p">{{ $t("my.content4") }}</p>
						<img :src="imgObj.my.img2" alt="" />
						<p class="info-p">{{ $t("my.content5") }}</p>
						<img :src="imgObj.my.img3" alt="" />
						<p class="info-p">{{ $t("my.content6") }}</p>
						<img :src="imgObj.my.img4" alt="" />

						<p style="margin-bottom: 0" class="info-p">
							{{ $t("my.content7") }}
						</p>
						<div class="flex-img-box">
							<img style="margin-bottom: 0" :src="imgObj.my.img5" alt="" />
							<img style="margin-bottom: 0" :src="imgObj.my.img6" alt="" />
						</div>
						<p class="info-p">{{ $t("my.content8") }}</p>
						<img :src="imgObj.my.img7" alt="" />
						<p class="info-p">{{ $t("my.content9") }}</p>
						<img :src="imgObj.my.img8" alt="" />
						<p class="info-p">{{ $t("my.content10") }}</p>
						<img :src="imgObj.my.img9" alt="" /></div
				></van-tab>
			</van-tabs>
		</div>
	</div>
</template>
<script setup>
import Header from "@/components/common/header.vue";
import { ref, computed, onMounted, getCurrentInstance } from "vue";
import { getLanguage } from "@/lib/device.js";
import { burialPointFun } from "@/lib/utils.js"

const active = ref(0);

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

let cnImg = {
	room: {
		img1: "https://yaame-static.yaame.io/admin/5986e4b23f805376c857e5f237533d98.png",
		img2: "https://yaame-static.yaame.io/admin/b37295384f999b7258bd9a4313ca6b85.png",
		img3: "https://yaame-static.yaame.io/admin/a00e08f31b0d2fcea0497a47152cda00.png",
		img4: "https://yaame-static.yaame.io/admin/597365740adb2989e0125d84233c9fe4.png",
		img5: "https://yaame-static.yaame.io/admin/b9bc5e462474a739d5585015fc13835e.png",
		img6: "https://yaame-static.yaame.io/admin/0522d974d53732728320d4c411cf8fa9.png",
		img7: "https://yaame-static.yaame.io/admin/ef9454f76c3134552a7ce915cebe79e1.png",
		img8: "https://yaame-static.yaame.io/admin/52bb473e3227202ac3028b44f428d630.png",
		img9: "https://yaame-static.yaame.io/admin/993afab4089c0e93766b001bc7fe94dd.png",
		img10:
			"https://yaame-static.yaame.io/admin/2b461784909385b8e31c20355d4ecfd2.png",
	},
	square: {
		img1: "https://yaame-static.yaame.io/admin/16d71d37f949994f5c28bdb241faf37e.png",
		img2: "https://yaame-static.yaame.io/admin/80baf8950e588fcdb142587abeca8528.png",
		img3: "https://yaame-static.yaame.io/admin/40a9ac5adb09f5bf8f7e849a1f06e957.png",
		img4: "https://yaame-static.yaame.io/admin/3fc8a4d15d7139b8d16d122d09b0f9b4.png",
		img5: "https://yaame-static.yaame.io/admin/cc1231d4b0170ec6749604b36071ee37.png",
	},
	information: {
		img1: "https://yaame-static.yaame.io/admin/86f7ad011c8fed6bbace522c4e32082e.png",
		img2: "https://yaame-static.yaame.io/admin/f3b6048f8653ecbba255c662cbf0c483.png",
		img3: "https://yaame-static.yaame.io/admin/7ab0cef2ae7fd04e7a0f883ec0595864.png",
	},
	my: {
		img1: "https://yaame-static.yaame.io/admin/57de71247e239971b6cccfb3572037dc.png",
		img2: "https://yaame-static.yaame.io/admin/796f74c4b7e7e57cd2f5ade4379b9a48.png",
		img3: "https://yaame-static.yaame.io/admin/8e07b19dc7f192f682ef2ada8013c7c2.png",
		img4: "https://yaame-static.yaame.io/admin/f366d634d7f31816def85ed7293aa3fa.png",
		img5: "https://yaame-static.yaame.io/admin/8df084c09fc5f7a39e16706f875ef60f.png",
		img6: "https://yaame-static.yaame.io/admin/1db6de4523df7d67f69f2eaf396eedc5.png",
		img7: "https://yaame-static.yaame.io/admin/da255eb9cf4c2f09996c07874227295e.png",
		img8: "https://yaame-static.yaame.io/admin/b769874fcca27170faf85af158b5ffde.png",
		img9: "https://yaame-static.yaame.io/admin/a0cd64a3b81f2683178dfa189618177d.png",
	},
};
let twImg = {
	room: {
		img1: "https://yaame-static.yaame.io/admin/7b5338b493b545440032ad7362b4126e.png",
		img2: "https://yaame-static.yaame.io/admin/77679d444ed91969f779952511411b63.png",
		img3: "https://yaame-static.yaame.io/admin/eb67863ba5c7b5ae4604385c24d82202.png",
		img4: "https://yaame-static.yaame.io/admin/7778135aaa78b00223932946f5a6bfa2.png",
		img5: "https://yaame-static.yaame.io/admin/8623f76805f349d93156e1124155822b.png",
		img6: "https://yaame-static.yaame.io/admin/96c57d6c417f976816bb6c249a185977.png",
		img7: "https://yaame-static.yaame.io/admin/6dcc8305aa8859b598d1f1d4abfc724a.png",
		img8: "https://yaame-static.yaame.io/admin/1bbe2cea055acdc87a4f4c47f46a369d.png",
		img9: "https://yaame-static.yaame.io/admin/690f91823f36b843e77e554a1307481c.png",
		img10:
			"https://yaame-static.yaame.io/admin/c77d93adb946f2ada840fa9796321042.png",
	},
	square: {
		img1: "https://yaame-static.yaame.io/admin/39e69fcb599dd7e9c8796509468e8049.png",
		img2: "https://yaame-static.yaame.io/admin/a34a230e351024b8af9e2d0183e048e7.png",
		img3: "https://yaame-static.yaame.io/admin/7f4e67e1af3df9081d7fb1ba6992cb2c.png",
		img4: "https://yaame-static.yaame.io/admin/181b9260b705005ddae08b7ef4b569d2.png",
		img5: "https://yaame-static.yaame.io/admin/ea620d392d56710a7fc7f72372ff66a5.png",
	},
	information: {
		img1: "https://yaame-static.yaame.io/admin/b4b144e267823226457838126657021f.png",
		img2: "https://yaame-static.yaame.io/admin/6641e075fd98fd6250a64b7c01e7e7ba.png",
		img3: "https://yaame-static.yaame.io/admin/f211d32fdf90650385c2297c8f109486.png",
	},
	my: {
		img1: "https://yaame-static.yaame.io/admin/bb0d8bcbb5d294a668ea01f8dd8d0bab.png",
		img2: "https://yaame-static.yaame.io/admin/e26972246e6445f5afe4ef4709f812c7.png",
		img3: "https://yaame-static.yaame.io/admin/5b49a99bd07e2ad1d69228795dd5a4c7.png",
		img4: "https://yaame-static.yaame.io/admin/95bdad016a2999f8e1ef5c2aab8db2cb.png",
		img5: "https://yaame-static.yaame.io/admin/004924101463293451e70b6becebfdd8.png",
		img6: "https://yaame-static.yaame.io/admin/571512418e951046051c652f727fbfc8.png",
		img7: "https://yaame-static.yaame.io/admin/681152cc1ec92e7c856a12196db4507b.png",
		img8: "https://yaame-static.yaame.io/admin/db3a1729b90f2da2cdd0eb9a081c848d.png",
		img9: "https://yaame-static.yaame.io/admin/fdfc953ef2c9177f316eeb9b68994718.png",
	},
};

let enImg = {
	room: {
		img1: "https://yaame-static.yaame.io/admin/5ffb506dbf9bc5e692cb72000bd90a22.png",
		img2: "https://yaame-static.yaame.io/admin/04125a4704b161df2a952edf5e901784.png",
		img3: "https://yaame-static.yaame.io/admin/69d08b18b0bdd9d33db6938836300e58.png",
		img4: "https://yaame-static.yaame.io/admin/1b1643714ee49a4dd9ff6414fd73fff3.png",
		img5: "https://yaame-static.yaame.io/admin/d194bafa084ef230ead1550c9cab44c5.png",
		img6: "https://yaame-static.yaame.io/admin/64cc06caaa50e318004a1baa40a4cc47.png",
		img7: "https://yaame-static.yaame.io/admin/82b64cbba3e6e5983ee63e1059c47475.png",
		img8: "https://yaame-static.yaame.io/admin/82b64cbba3e6e5983ee63e1059c47475.png",
		img9: "https://yaame-static.yaame.io/admin/9e73f7a035806609f1ed1b2258abfe2f.png",
		img10:
			"https://yaame-static.yaame.io/admin/613a7b60ec1d2aa3632cd1977269d1cf.png",
	},
	square: {
		img1: "https://yaame-static.yaame.io/admin/77f89b424be0b2b21c2c3cde633dc17a.png",
		img2: "https://yaame-static.yaame.io/admin/bf8e9deead74104cfb56ae08066a6fcb.png",
		img3: "https://yaame-static.yaame.io/admin/8d713a5ffde20f91dbfbd66e513604bb.png",
		img4: "https://yaame-static.yaame.io/admin/247f3f9d759fa7d0074523f0f9fd5045.png",
		img5: "https://yaame-static.yaame.io/admin/af7292f013f5f19011c4b2bf024243a4.png",
	},
	information: {
		img1: "https://yaame-static.yaame.io/admin/44e785329055870d36863d727109810e.png",
		img2: "https://yaame-static.yaame.io/admin/f75512a2881354188a9002b266a31995.png",
		img3: "https://yaame-static.yaame.io/admin/483f0e1f3e247b42deca9b0ada86aea6.png",
	},
	my: {
		img1: "https://yaame-static.yaame.io/admin/c10f704d92941497574dbe52fc362ed4.png",
		img2: "https://yaame-static.yaame.io/admin/6312361bd0f48bee161132e03b50c0bd.png",
		img3: "https://yaame-static.yaame.io/admin/58b2369d13a08d0c70c1681ea39711a3.png",
		img4: "https://yaame-static.yaame.io/admin/a1016d6048a7ebae67fa2a76b6e03191.png",
		img5: "https://yaame-static.yaame.io/admin/85f58a8f783ce431e34938311733cb44.png",
		img6: "https://yaame-static.yaame.io/admin/fe43ecaeba206cfe8a5ca9c57039af63.png",
		img7: "https://yaame-static.yaame.io/admin/27a7c96ecc59eb93ad1e5c62ec1c8412.png",
		img8: "https://yaame-static.yaame.io/admin/69cd5974d3d1bbb1f8f89973e595d260.png",
		img9: "https://yaame-static.yaame.io/admin/ba4ae2c8a79e47dec293263d20f68189.png",
	},
};

let idImg = {
	room: {
		img1: "https://yaame-static.yaame.io/admin/71050038f44f6eac1c595eb2b2bd9e6e.png",
		img2: "https://yaame-static.yaame.io/admin/1560fea88e7518d123e1e37f6025329b.png",
		img3: "https://yaame-static.yaame.io/admin/82bbee8b4d447125226e9ae77f27c465.png",
		img4: "https://yaame-static.yaame.io/admin/8ab5eddde8051679bf176a118039ad1d.png",
		img5: "https://yaame-static.yaame.io/admin/df7332f98d54c697e3cb5754f6630b1c.png",
		img6: "https://yaame-static.yaame.io/admin/d7d4cdd3f22c36019b20a89cce494b3b.png",
		img7: "https://yaame-static.yaame.io/admin/6f4469cb26efda790a2478de731787aa.png",
		img8: "https://yaame-static.yaame.io/admin/3a37d6d78eac7dcddedc543241015b99.png",
		img9: "https://yaame-static.yaame.io/admin/c108ee030d69e39e258cdc0eb95a1d6f.png",
		img10:
			"https://yaame-static.yaame.io/admin/a2754e627f69e6c7963e542d43b2fdaf.png",
	},
	square: {
		img1: "https://yaame-static.yaame.io/admin/1e29ba80827f956a9cac99ca0a0beaa5.png",
		img2: "https://yaame-static.yaame.io/admin/2bddc681d33a960727ec8fbbe4f26c1f.png",
		img3: "https://yaame-static.yaame.io/admin/5d07b298e79ab33f3dea55277bce9954.png",
		img4: "https://yaame-static.yaame.io/admin/1322b4237fdb64e7ebee3f22a8e03b3c.png",
		img5: "https://yaame-static.yaame.io/admin/c45ae291c33a6a254602b471e52f187d.png",
	},
	information: {
		img1: "https://yaame-static.yaame.io/admin/b22e89a9ec15281717e9c3bdecebe3bb.png",
		img2: "https://yaame-static.yaame.io/admin/ff649fc3cf743f1962f4944b182c69cd.png",
		img3: "https://yaame-static.yaame.io/admin/4c0d1972f5235e3ab1cc9c755840903e.png",
	},
	my: {
		img1: "https://yaame-static.yaame.io/admin/1eb8cc4f193a39616e002c871f47a6bb.png",
		img2: "https://yaame-static.yaame.io/admin/6312361bd0f48bee161132e03b50c0bd.png",
		img3: "https://yaame-static.yaame.io/admin/e2c8b9d3fc7a2df4e17c62a7b458a446.png",
		img4: "https://yaame-static.yaame.io/admin/c2803089e17eff738e02835e7f7ea36d.png",
		img5: "https://yaame-static.yaame.io/admin/5560107749f707b9077505f2e781e1b3.png",
		img6: "https://yaame-static.yaame.io/admin/8f6cd7f336adb98072e07b1db0eac510.png",
		img7: "https://yaame-static.yaame.io/admin/68df602ff4df53e325f217881b195efa.png",
		img8: "https://yaame-static.yaame.io/admin/5028de2a0e1efef4945801e32d477210.png",
		img9: "https://yaame-static.yaame.io/admin/c3374b41cfcea4ede9a10477dad57598.png",
	},
};

let arImg = {
	room: {
		img1: "https://yaame-static.yaame.io/admin/c2fd0d5ee0b73a3944d24db45f24a125.png",
		img2: "https://yaame-static.yaame.io/admin/e8ad3b1ce14dd0b0df96749b7efcef24.png",
		img3: "https://yaame-static.yaame.io/admin/e01faaf09cbebc23f17b76a8feff62c9.png",
		img4: "https://yaame-static.yaame.io/admin/e8688755abd0b49094dc3d696afdb9f6.png",
		img5: "https://yaame-static.yaame.io/admin/b56bee37329f05634f2620e3c6311d34.png",
		img6: "https://yaame-static.yaame.io/admin/53de650c9100754d6d5567af190ea807.png",
		img7: "https://yaame-static.yaame.io/admin/7e879ee58f87c1ce71ca7e20129799f6.png",
		img8: "https://yaame-static.yaame.io/admin/031969a0cc6031add86be3dcbbc0bd2f.png",
		img9: "https://yaame-static.yaame.io/admin/9aee8fadc3bb24a416d1e821cefa2f6d.png",
		img10:
			"https://yaame-static.yaame.io/admin/6ecf87925732a30a0495fa90b7c72f0f.png",
	},
	square: {
		img1: "https://yaame-static.yaame.io/admin/fc60d14296de80fa8b817a9314ddd6c3.png",
		img2: "https://yaame-static.yaame.io/admin/ab1b31b2e630c5936d0cb4607d587134.png",
		img3: "https://yaame-static.yaame.io/admin/1bb7b7714bd564e5c7d32eeaa3db74e4.png",
		img4: "https://yaame-static.yaame.io/admin/5b6481e6bbf98642b6ed68b821ff4f92.png",
		img5: "https://yaame-static.yaame.io/admin/0c3ac0fc06d409fffb9db5394a934109.png",
	},
	information: {
		img1: "https://yaame-static.yaame.io/admin/9c9f430f4b8079d22b8a9b02b3a1355e.png",
		img2: "https://yaame-static.yaame.io/admin/b2439054b11a84bd339a8d680bf19877.png",
		img3: "https://yaame-static.yaame.io/admin/5d9748732a2d0490bf9cace1c858009c.png",
	},
	my: {
		img1: "https://yaame-static.yaame.io/admin/7d4d4bfa868f1f05135c17da20016114.png",
		img2: "https://yaame-static.yaame.io/admin/2947d10eb2ccce91675ee42a4a69a3b4.png",
		img3: "https://yaame-static.yaame.io/admin/cb7543b095ce96e545d1d1fa332347a4.png",
		img4: "https://yaame-static.yaame.io/admin/8a556eed5c9662d53688216075abc47e.png",
		img5: "https://yaame-static.yaame.io/admin/708a10684ac41fd33dc80dbab8438a6f.png",
		img6: "https://yaame-static.yaame.io/admin/ff7145e3dc49cf88551285415d3809f1.png",
		img7: "https://yaame-static.yaame.io/admin/02176d93652b59dace71e12446dd8b18.png",
		img8: "https://yaame-static.yaame.io/admin/3175b58840a504bb54f19ace7a79fc32.png",
		img9: "https://yaame-static.yaame.io/admin/816b34286215fc570c151d50e4e26047.png",
	},
};

const imgObj = computed(() => {
	if (language.value === "zh-cn") {
		return cnImg;
	} else if (language.value === "zh-tw") {
		return twImg;
	} else if (language.value === "en") {
		return enImg;
	} else if (language.value === "id") {
		return idImg;
	} else if (language.value === "ar") {
		return arImg;
	}
});

onMounted(() => {
    let root = getCurrentInstance();

    document.title = root.proxy.$t("title");

    burialPointFun({
        event_name: "view_manual",
        cid: -1017,
        md: 104,
        args_name: "page_manual",
    });
});
</script>
<style lang="less" scoped>
.newUserGuide {
	width: 7.5rem;
	min-height: 100vh;
	background-size: contain;
	background-repeat: no-repeat;
	background-image: url(https://yaame-static.yaame.io/admin/ef66a7d24579d963476fde41aca34782.png);
	.header-content {
		width: 7.5rem;
		height: 5.33rem;
		padding-top: 2.18rem;
		padding-left: 0.4rem;
		.title {
			font-weight: 600;
			font-size: 0.34rem;
			color: #333333;
		}
		.content {
			margin-top: 0.24rem;
			width: 3.96rem;
			line-height: 1.3;
			font-weight: 400;
			font-size: 0.24rem;
			color: #1f6061;
		}
	}
	.container {
		width: 6.9rem;
		height: auto;
		background-color: #fff;
		box-shadow: 0 0 0.12rem 0 rgba(131, 214, 226, 0.38);
		border-radius: 0.3rem 0.3rem 0 0;
		margin-left: 0.3rem;
		padding-top: 0.18rem;
		.info {
			padding: 0.3rem;
			img {
				width: 6.3rem;
				height: auto;
				margin: 0.2rem 0 0.5rem 0;
			}
			.title-p {
				font-weight: 400;
				font-size: 0.24rem;
				color: #333333;
				margin-bottom: 0.24rem;
			}
			.info-p {
				font-weight: 400;
				font-size: 0.24rem;
				color: #666666;
			}
			.flex-img-box {
				width: 6.3rem;
				height: 1.98rem;
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 0.2rem;
				margin-bottom: 0.5rem;
				img {
					width: 3.05rem;
					height: 1.98rem;
					margin: 0;
				}
			}
		}
	}

	.dress-type /deep/.van-tab {
		width: 1.725rem;
		margin-right: 0;
	}
    .dress--type /deep/.van-tabs__wrap {
        background-color: #fff;
        border-radius: 0.3rem 0.3rem 0 0;
    }
	.dress-type /deep/.van-tabs__nav {
		background-color: transparent;
        padding: 0 0.01rem;
	}
	.dress-type /deep/.van-tabs__line {
		position: absolute;
        bottom: 0;
        left: 0;
        width: 0.28rem;
        height: 0.06rem;
        background-color: #78f2b6;
        background-image: none;
	}
	.mb-50 {
		margin-bottom: 0.5rem;
	}
}
</style>

<style lang="less">
.van-sticky {
    &.van-sticky--fixed {
        .van-tabs__wrap {
            margin-left: 0.3rem;
            width: 6.9rem;
            background-color: #fff;
            border-radius: 0.3rem 0.3rem 0 0;
        }
    }
}
</style>
