<template>
	<div
		:style="{ paddingTop: safeHeight + 0.88 + 'rem' }"
		:class="['privilege', language]"
	>
		<header
			:style="{
				background: headerWhite ? '#121F26' : '',
				height: safeHeight + 0.88 + 'rem',
			}"
			class="page-header"
		>
        <div class="back-img" @click="back">
                <img
                    src="https://yaame-static.yaame.io/admin/2a3fcadb7a3b0bf487b8c7d548b1c5d8.png"
                />
            </div>
			<div v-if="nobleLevels[nobleActive]" class="header-content">{{ nobleLevels[nobleActive].noble_name }}</div>
		</header>

		<van-tabs
			v-model="privilegeActive"
			:swipe-threshold="2"
			swipeable
			class="noble-type"
			@change="privilegeActiveChange"
		>
			<van-tab v-for="(item, index) in privilegesList" :key="index">
				<template #title>
					<div
						:class="{
							'noble-tab-item': true,
							active: privilegeActive === index,
						}"
					>
						<div class="img-container">
							<img :src="item.privilege_img" alt="" />
						</div>

                        <div v-if="privilegeActive === index" class="triangle"></div>
					</div>
				</template>
				<template #default>
					<div class="content-container">
                        <div v-if="levelDetails[index] && levelDetails[index].title" class="title">{{ $t(levelDetails[index].title) }}</div>

                        <template v-if="levelDetails[index] && levelDetails[index].content">
                            <div v-for="(ele, inx) in levelDetails[index].content" :key="inx">
                                <p v-if="ele.type === 'text'">
                                    <span>{{ $t(ele.key) }}</span>
                                </p>

                                <div v-if="ele.type === 'img'">
                                    <div v-if="ele.img.type === 'array'">
                                        <img v-for="(it, i) in ele.img.list" :key="i" :src="it" alt="">
                                    </div>
                                    <img v-else :src="ele.img" alt="" />
                                </div>
                            </div>
                        </template>
                    </div>
				</template>
			</van-tab>
		</van-tabs>
	</div>
</template>

<script>
import { computed, onMounted, onUnmounted, ref, getCurrentInstance } from "vue";
import {getLanguage, getSafeHeight, getVerCode} from "@/lib/device";
import { getScrollTop } from "@/lib/utils";
import { getNobleInfo } from "@/lib/request/noble";
export default {
	setup() {
		const root = getCurrentInstance();
        const route = root.proxy.$route;
        const router = root.proxy.$router;
		let nobleActive = Number(route.query.nobleActive) || 0;
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
			// location.href = `wlyaame://webview/back`;
            router.back();
		};

		let privilegeActive = ref(Number(route.query.privilegeActive) || 0);
		const privilegeActiveChange = (index) => {
			privilegeActive.value = index;
            console.log(levelDetails.value[index])
		};

		let nobleLevels = ref([]);
		let privileges = ref([]);

		const getData = async () => {
			try {
				let res = await getNobleInfo();
				if (res.status === 1000) {
					nobleLevels.value = res.data.noble_levels;
					privileges.value = res.data.privileges;
				}
			} catch (error) {
				console.log(error);
			}
		};

		let privilegesList = computed(() => {
			if (nobleLevels.value && nobleLevels.value.length) {
				let unlockValues = nobleLevels.value[nobleActive].unlock_privileges;
				const filteredPrivilegesArray = privileges.value.filter((privilege) =>
					unlockValues.includes(privilege.privilege_value)
				);
                console.log(filteredPrivilegesArray);
				return filteredPrivilegesArray;
			} else {
				return [];
			}
		});

        let messageImgList = [
            'https://yaame-static.yaame.io/admin/1d04d84c2a2136122c9eee413144ff63.png',
            'https://yaame-static.yaame.io/admin/3e1509ef44e7b8f4267e474f9aa6d2eb.png',
            'https://yaame-static.yaame.io/admin/92eacde7e3f93c798d6006a2088cd79e.png',
            'https://yaame-static.yaame.io/admin/afc5101f6906b5e1c93fa4f085f42c4e.png',
            'https://yaame-static.yaame.io/admin/e8ed2557ebaceccb72d443830c5a1c00.png',
            'https://yaame-static.yaame.io/admin/00f98be676998f06c5d0d61514e9d22c.png',
            'https://yaame-static.yaame.io/admin/f8d250660bb5aefb716871083a039dae.png'
        ];

        let avatarImgList = [
            'https://yaame-static.yaame.io/admin/2b0b7acc0badde372b16b328c881140e.png',
            'https://yaame-static.yaame.io/admin/9053762b4397151184b567729634a2ed.png',
            'https://yaame-static.yaame.io/admin/09a83df423394c4d8e876a4ab1858f28.png',
            'https://yaame-static.yaame.io/admin/2212ead6fdffeda51927c590fe828d37.png',
            'https://yaame-static.yaame.io/admin/73eb81702b16344cdea90f88ec0e415d.png',
            'https://yaame-static.yaame.io/admin/3872de2e7b123924179a45eff9c7f047.png',
            'https://yaame-static.yaame.io/admin/5d89bc42ce35dd195a56597677ff5a50.png',
        ];

        let colorNameForRoom = [
            'https://yaame-static.yaame.io/admin/fb402106f5e89a17d7fbb8f5bcf5ae3d.png',
            'https://yaame-static.yaame.io/admin/90b2b2fdd4ddd12be007f1cb721878a9.png',
            'https://yaame-static.yaame.io/admin/3d0b4a76d2ef022e61c9dfadce4d22cf.png',
            'https://yaame-static.yaame.io/admin/2bd0f6a6a90bdcf40f29f02be53f4758.png',
            'https://yaame-static.yaame.io/admin/0a1b465ef59f9ae078d2ba594ef1f31b.png',
            'https://yaame-static.yaame.io/admin/499a2a275fcf78c7d043dcc2a97f953b.png',
            'https://yaame-static.yaame.io/admin/6b3b6d5777d8f2d35f7bd337a353b52f.png'
        ];
        let callingCard = [
            'https://yaame-static.yaame.io/admin/e0ce821c307b4927ee537440d629ff42.png',
            'https://yaame-static.yaame.io/admin/7ae75f6561d0180c43a3abacc9609919.png',
            'https://yaame-static.yaame.io/admin/948fa488eeb5f38ca8797b4d9fcb54da.png',
            'https://yaame-static.yaame.io/admin/0dd5f53ab85f6206f2fb0821ea018813.png',
            'https://yaame-static.yaame.io/admin/643b02404f2df72656e5fbd888ab1c5b.png',
            'https://yaame-static.yaame.io/admin/f23b85d90417c6f3c6aceb1e291170fd.png',
            'https://yaame-static.yaame.io/admin/4f1a6852d3dfacd6a796032dc0193ad5.png'
        ];
        let roomUserList = [
            'https://yaame-static.yaame.io/admin/95f0ec078df28b3253c94068e50e19b0.png',
            'https://yaame-static.yaame.io/admin/0c4a9008341ee3cb04def0974007024c.png',
            'https://yaame-static.yaame.io/admin/857c3136b6a1d6ebe1126a04f29da368.png',
            'https://yaame-static.yaame.io/admin/401a9c1a9324d459ce59db10e2408f6e.png',
            'https://yaame-static.yaame.io/admin/875a2ca3186aa334b3581b5caa0b42e3.png',
            'https://yaame-static.yaame.io/admin/dfbda1bd989780216667411efab27e29.png',
            'https://yaame-static.yaame.io/admin/0a0f3dd5eb21392d5ded1f55ddf2247c.png'
        ];
        let roomReview = [
            'https://yaame-static.yaame.io/admin/4797ec5df3f671bedced0f279bab4e18.png',
            'https://yaame-static.yaame.io/admin/31acf1622ac3e1905b692e607a3a0af7.png',
            'https://yaame-static.yaame.io/admin/688d47ec3f92c6d70a644a8775751c5e.png',
            'https://yaame-static.yaame.io/admin/775dd98f54e70c565b86f2ec3ea56624.png',
            'https://yaame-static.yaame.io/admin/6c5b3ddff5c49e9722f12dc0e3b6f006.png',
            'https://yaame-static.yaame.io/admin/85acff80fc2b8ce028fc18d3414cbf21.png',
            'https://yaame-static.yaame.io/admin/e5274afda4fb25baddfde6e79429d738.png'
        ];
        let rankName = [
            'https://yaame-static.yaame.io/admin/e5e05beb84823a36d1916d1c6cb63739.png',
            'https://yaame-static.yaame.io/admin/18533db9be03d87d3706a1a0e8eba0c9.png',
            'https://yaame-static.yaame.io/admin/0d09a99495a7e113ce52409e4fb328ac.png',
            'https://yaame-static.yaame.io/admin/9fabaffaaebf2c60eb6993f3b16c04ea.png',
            'https://yaame-static.yaame.io/admin/7c291d234034131aaa297f2482833e63.png',
            'https://yaame-static.yaame.io/admin/877649243661537aeaf32c2770238099.png',
            'https://yaame-static.yaame.io/admin/7634840378e8121cb11198b134b5ad3e.png'
        ]
        let postName = [
            'https://yaame-static.yaame.io/admin/9cea7d07068ca2911b6b4a86e6049226.png',
            'https://yaame-static.yaame.io/admin/708fdd1aac5f4f4db9de715eb66f74a8.png',
            'https://yaame-static.yaame.io/admin/431d807ed5d7ce747a9dc91d9e60a1b7.png',
            'https://yaame-static.yaame.io/admin/ec53fb747860ba51bbccfd2f33ee12c3.png',
            'https://yaame-static.yaame.io/admin/ff5caa23dc4ef643a171040b9e2cf321.png',
            'https://yaame-static.yaame.io/admin/6ffe618f01e632df46314430be11feef.png',
            'https://yaame-static.yaame.io/admin/85ddcb2a635db507b5c41901517e5132.png',

        ];
        let searchList = [
            'https://yaame-static.yaame.io/admin/91ec2ef8f30cf999685665f51cb4e3aa.png',
            'https://yaame-static.yaame.io/admin/154d69de8202cd744f0c970783b8fcce.png',
            'https://yaame-static.yaame.io/admin/d744e97c97fbb1be100c1afdb9d1caf6.png',
            'https://yaame-static.yaame.io/admin/9c3be9172d83462fa8f360ede9e8f194.png',
            'https://yaame-static.yaame.io/admin/77d0c52d94946f7323ccf4731490f475.png',
            'https://yaame-static.yaame.io/admin/230d6639198da479d6d680fe1bae7bce.png',
            'https://yaame-static.yaame.io/admin/46ca4b637a7b48816be1a7384a873ba0.png',
        ];

        let badgeAvatar = [
            'https://yaame-static.yaame.io/admin/d0f2308900a1f7b6b069a746b35f3b68.png',
            'https://yaame-static.yaame.io/admin/7b871c3fe571f6947506e76044e421e9.png',
            'https://yaame-static.yaame.io/admin/5ef782adf519aebaba08f38dce09e033.png',
            'https://yaame-static.yaame.io/admin/e0531a0ecb828177caa3d6196e3727a3.png',
            'https://yaame-static.yaame.io/admin/7556c196297fa7c83e974793c6cff820.png',
            'https://yaame-static.yaame.io/admin/512536af0434f96eb0a3da7b5a41bea1.png',
            'https://yaame-static.yaame.io/admin/d77b03c0f86fcffc527b99320e423803.png',
        ];
        let badgeCallingCard = [
            'https://yaame-static.yaame.io/admin/41c98037858a1af3a492471f8a301b8e.png',
            'https://yaame-static.yaame.io/admin/b567f573c472045d19e7d2f46f36b470.png',
            'https://yaame-static.yaame.io/admin/39837925ec2fe3008a0ffb51cd1dd56e.png',
            'https://yaame-static.yaame.io/admin/cb50d386f9a67b95cd87e6094a293776.png',
            'https://yaame-static.yaame.io/admin/4be9fec0079f90c5e8689ed05168d762.png',
            'https://yaame-static.yaame.io/admin/adf20310f65bbfd86d777ad30d72d04c.png',
            'https://yaame-static.yaame.io/admin/5e470563c5e03bfa6838e7f0b215c518.png'
        ];
        let badgeRoomUser = [
            'https://yaame-static.yaame.io/admin/fe72e530b89807b9e8428d96bf01ed62.png',
            'https://yaame-static.yaame.io/admin/80317cc77d9d228a5aae5af1ed9f8ced.png',
            'https://yaame-static.yaame.io/admin/1526d59b4a60469f21141a1b71e00a5d.png',
            'https://yaame-static.yaame.io/admin/401c095df47cb65e07b4784b82c39fd5.png',
            'https://yaame-static.yaame.io/admin/969f85fb64aa62a09214484598ff17fc.png',
            'https://yaame-static.yaame.io/admin/36e4be751e238b91268d732a534e59fd.png',
            'https://yaame-static.yaame.io/admin/cca314d73c8c1a989085c875e4b68591.png',
        ];
        let badgeRoomReview = [
            'https://yaame-static.yaame.io/admin/5bf5a8a0fc45ca8dede8b3e2b3f68de6.png',
            'https://yaame-static.yaame.io/admin/b00aaab5a158126aa302723bd6a1485c.png',
            'https://yaame-static.yaame.io/admin/d303db7130b3ed6a0f875e06c9a6db55.png',
            'https://yaame-static.yaame.io/admin/ba80afb7c4fbaae22d01d3044defc0d4.png',
            'https://yaame-static.yaame.io/admin/79fe4b2d73d2654c0c9875890e1cebae.png',
            'https://yaame-static.yaame.io/admin/4bb323f4724d06cb2d34e2f20d6d7dbb.png',
            'https://yaame-static.yaame.io/admin/6aba4e601dae449653bcaab8202cd928.png'
        ];
        let badgeRankName = [
            'https://yaame-static.yaame.io/admin/9114f8454e3d608155f0ac3e25410b1e.png',
            'https://yaame-static.yaame.io/admin/75f16e8dbe1762515524f52626ed8519.png',
            'https://yaame-static.yaame.io/admin/a513de446cf34800337ac795122e811d.png',
            'https://yaame-static.yaame.io/admin/37f80b156b8cae96e200472b5923d54a.png',
            'https://yaame-static.yaame.io/admin/997d9cbc04b69e2a19104496a50f2682.png',
            'https://yaame-static.yaame.io/admin/a679726685f90b6c5e52acd016b915d7.png',
            'https://yaame-static.yaame.io/admin/f8339c10a058ceeac3a66bb501a625f4.png'
        ];
        let badgePostName = [
            'https://yaame-static.yaame.io/admin/b64434d4a157c773dc50715c191c0005.png',
            'https://yaame-static.yaame.io/admin/67167e00572e83177b9a1a3e80670a8e.png',
            'https://yaame-static.yaame.io/admin/5d79b545353cd3e43c631fa031423939.png',
            'https://yaame-static.yaame.io/admin/ddbbad1fa7684d97000086da144f61e4.png',
            'https://yaame-static.yaame.io/admin/5b152f881b89035736d0f789d8c70866.png',
            'https://yaame-static.yaame.io/admin/b0dc8bedc3c80f1c139d77e103f1a1e5.png',
            'https://yaame-static.yaame.io/admin/4a1c331a1963f275724f44f58c46c76c.png'
        ];
        let badgeSearchList = [
            'https://yaame-static.yaame.io/admin/9321bd41b6ce4171a5124adef9148570.png',
            'https://yaame-static.yaame.io/admin/b1888a2641efcdf4aa50ead8fef36b3f.png',
            'https://yaame-static.yaame.io/admin/284447b2b02a781195f34881c914d422.png',
            'https://yaame-static.yaame.io/admin/8e7937e56dbeef429f9a9e2d0509d524.png',
            'https://yaame-static.yaame.io/admin/94c54d83e4e5f24ce89f413650bfb392.png',
            'https://yaame-static.yaame.io/admin/266ee3e0bc99125d551023bc4dcfeebe.png',
            'https://yaame-static.yaame.io/admin/66ea900455f61116a2471aba59c07836.png',
        ];

        let nobleMount = [
            'https://yaame-static.yaame.io/admin/cb69742c65de8ece8fea45153bb82e57.png',
            'https://yaame-static.yaame.io/admin/07a12e7ac7089b9ac9bef21c9a481f3d.png',
            'https://yaame-static.yaame.io/admin/24a35785a606f5a390a0ca8b8195e269.png',
            'https://yaame-static.yaame.io/admin/611f115f81168c2d68c323f900a7552c.png',
            'https://yaame-static.yaame.io/admin/f31305adf8330970430432ecebbf1c1d.png',
            'https://yaame-static.yaame.io/admin/7677ae78416268c45f1ba992bf672315.png',
            'https://yaame-static.yaame.io/admin/4a173d6e06fcf28d867d1cf2d848654e.png'
        ];

        let avatarCostume = [
            'https://yaame-static.yaame.io/admin/94945b7aad085130051bc48f0caec9c3.png',
            'https://yaame-static.yaame.io/admin/b65d9d68f203ee4b675ee96b7d9467ca.png',
            'https://yaame-static.yaame.io/admin/4e491fa538ea1682e7e0bc885cbc46e0.png',
            'https://yaame-static.yaame.io/admin/b2a3a889e06835303ce2552de3ebf0da.png',
            'https://yaame-static.yaame.io/admin/9a94defdd39aa37de078f8f153da04bc.png',
            'https://yaame-static.yaame.io/admin/4c52ef3dcee23980080bf955ba9d6889.png',
            'https://yaame-static.yaame.io/admin/0fba63b59f6b42e7cd95cdb370d16547.png',
        ];

        let nobleChatBubble = [
            'https://yaame-static.yaame.io/admin/ebd0639ee22ffc48846a38cf422beedb.png',
            'https://yaame-static.yaame.io/admin/ae7825d8b95728af75335b9de267411b.png',
            'https://yaame-static.yaame.io/admin/ac11e2c364950759ad1c4424f839144b.png',
            'https://yaame-static.yaame.io/admin/20cfdcd71c06792041d442764d0b1a90.png',
            'https://yaame-static.yaame.io/admin/98366b79836a1e5ad5b0ea1aeebdf1a9.png',
            'https://yaame-static.yaame.io/admin/39970b358db5421f491d8de7173073d2.png',
            'https://yaame-static.yaame.io/admin/7ad696c9bfe0c122eb85f70033da6e94.png'
        ];

        let nobleAvatarFrame = [
            'https://yaame-static.yaame.io/admin/ebdcc3b4cced6b4f2d731fac6fb1d75c.png',
            'https://yaame-static.yaame.io/admin/06f37ec90e0a2a797a9dd4ae0809c340.png',
            'https://yaame-static.yaame.io/admin/2f7ecb14d8587fa75ca0bf3e2809a6ce.png',
            'https://yaame-static.yaame.io/admin/dea933b4f263969cf28be93e2a7609b9.png',
            'https://yaame-static.yaame.io/admin/614692e2a06cc08a323163aec4c868c9.png',
            'https://yaame-static.yaame.io/admin/69daaef1d19ae695f82a31b8b397f95d.png',
            'https://yaame-static.yaame.io/admin/4473322bc8fa4e12dc2b647d909e4b6b.png'
        ];

        let nobleInfoCard = [
            'https://yaame-static.yaame.io/admin/26ead3f7f6aae5e8c0a12b1eb71e2805.png',
            'https://yaame-static.yaame.io/admin/eece8fd1e23391097e36eb24060da8d8.png',
            'https://yaame-static.yaame.io/admin/d09ab77bc7b25f24c95449eac5762e45.png',
            'https://yaame-static.yaame.io/admin/fe1fd96dfb7d063195268e8eaeac9bc9.png',
            'https://yaame-static.yaame.io/admin/a868403c16b916dc5a701922b1c42ce1.png',
            'https://yaame-static.yaame.io/admin/239b53d013a75d92cc7bbd42e7a37502.png',
            'https://yaame-static.yaame.io/admin/7d8bd59797ea3ad724d64f8c98005029.png'
        ];

        let topRanking = [
            {
                img: 'https://yaame-static.yaame.io/admin/b639c83ab3f244c767577ccf70aff5a2.png',
                level: 0,
            }, {
                img: 'https://yaame-static.yaame.io/admin/254931b0bd00e4a7c760ca99bf995a02.png',
                level: 1,
            }, {
                img: 'https://yaame-static.yaame.io/admin/1287b9d721c589d871da74966c7cc618.png',
                level: 2,
            }, {
                img: 'https://yaame-static.yaame.io/admin/16f6153fd1e25a6083f0a1c338f0d762.png',
                level: 3,
            }, {
                img: 'https://yaame-static.yaame.io/admin/f1816e394d7554f2f7e009ba0f4a59bf.png',
                level: 4,
            }, {
                img: 'https://yaame-static.yaame.io/admin/61ef18ea2550807384f547d3e30cd04b.png',
                level: 5,
            }, {
                img: 'https://yaame-static.yaame.io/admin/601945fdf729714d3fbd75b7f9aac0d9.png',
                level: 6,
            }
        ];

        let antiKickPrivilege = [
            {
                img: 'https://yaame-static.yaame.io/admin/5314c85cdd89714c7c581bfda43bb075.png',
                level: 4,
            }, {
                img: 'https://yaame-static.yaame.io/admin/c0bfc3384a081b1ede24cf88ca9f8eed.png',
                level: 5,
            }, {
                img: 'https://yaame-static.yaame.io/admin/9aa20a1aecb4886772d0f4163e691c9a.png',
                level: 6,
            }
        ]

        let nobleGift = [
            'https://yaame-static.yaame.io/admin/bd058f109a951c90f64df712fa0f1430.png',
            'https://yaame-static.yaame.io/admin/86c63a1327e46eb80cfe4087119c9592.png',
            'https://yaame-static.yaame.io/admin/1c679ef1755dfa9eccb39591021bf4e9.png',
            'https://yaame-static.yaame.io/admin/5823fdb16f0d19e2e9372b8efdd353dc.png',
            'https://yaame-static.yaame.io/admin/e8d1af33dff90604b19123b32abc162b.png',
            'https://yaame-static.yaame.io/admin/598069107f09c97044c57825600d0428.png',
            'https://yaame-static.yaame.io/admin/6d2ccc82837cabfc25e4e3d387448386.png',
        ];

        let nobleEmoticon = [
            {
                type: 'array',
                list: [
                    'https://yaame-static.yaame.io/admin/417261cdd46be4a62596304aa4cfadd7.png',
                    'https://yaame-static.yaame.io/admin/1fe18d10ac36165afd0df9121f7012a7.png',
                ],
            }, 
            'https://yaame-static.yaame.io/admin/dbf9d91ab1bf53bba674967e4861e42c.png',
            'https://yaame-static.yaame.io/admin/56a39eb8d168623e49b5cad5679aaa92.png',
            'https://yaame-static.yaame.io/admin/26cd684a02eadd6c1f0660e73cb06593.png',
            'https://yaame-static.yaame.io/admin/9d3496f0d1251b6eace96331afa35b21.png',
            'https://yaame-static.yaame.io/admin/f0e9783f289ee7eca8237f22ad2f3492.png',
            'https://yaame-static.yaame.io/admin/3f22a1568fd82c4c7b5dff3a72dd1cc4.png'
        ];
        const computedImg = (list, key) => {
            for (let i = 0; i < list.length; i++) {
                if (list[i].level === key) {
                    return list[i].img;
                }
            }
        };
		let levelDetails = ref([
			{
				title: "colorfulNickname",
				content: [
					{
						type: "text",
						key: "colorfulNickname1",
					},
                    {
                        type: "img",
                        img: avatarImgList[nobleActive],
                    },
					{
						type: "text",
						key: "colorfulNickname2",
					},
                    {
                        type: "img",
                        img: colorNameForRoom[nobleActive],
                    },
					{
						type: "text",
						key: "colorfulNickname3",
					},
                    {
                        type: "img",
                        img: callingCard[nobleActive],
                    },
					{
						type: "text",
						key: "colorfulNickname4",
					},
                    {
                        type: "img",
                        img: roomUserList[nobleActive],
                    },
					{
						type: "text",
						key: "colorfulNickname5",
					},
                    {
                        type: "img",
                        img: roomReview[nobleActive],
                    },
					{
						type: "text",
						key: "colorfulNickname6",
					},
                    {
                        type: "img",
                        img: rankName[nobleActive],
                    },
					{
						type: "text",
						key: "colorfulNickname7",
					},
                    {
                        type: "img",
                        img: postName[nobleActive],
                    },
					{
						type: "text",
						key: "colorfulNickname8",
					},
                    {
                        type: "img",
                        img: searchList[nobleActive],
                    },
				],
			},
			{
				title: "nobleBadge",
				content: [
					{
						type: "text",
						key: "nobleBadge1",
					},
                    {
                        type: "img",
                        img: badgeAvatar[nobleActive],
                    },
					{
						type: "text",
						key: "nobleBadge2",
					},
                    {
                        type: "img",
                        img: badgeCallingCard[nobleActive],
                    },
					{
						type: "text",
						key: "nobleBadge3",
					},
                    {
                        type: "img",
                        img: badgeRoomUser[nobleActive],
                    },
					{
						type: "text",
						key: "nobleBadge4",
					},
                    {
                        type: "img",
                        img: badgeRoomReview[nobleActive],
                    },
					{
						type: "text",
						key: "nobleBadge5",
					},
                    {
                        type: "img",
                        img: badgeRankName[nobleActive],
                    },
					{
						type: "text",
						key: "nobleBadge6",
					},
                    {
                        type: "img",
                        img: badgePostName[nobleActive],
                    },
					{
						type: "text",
						key: "nobleBadge7",
					},
                    {
                        type: "img",
                        img: badgeSearchList[nobleActive],
                    }
				],
			},
            {
				title: "nobleMount",
				content: [
                    {
                        type: "img",
                        img: nobleMount[nobleActive],
                    },
				],
			},
            {
				title: "avatarCostume",
				content: [
                    {
						type: "text",
						key: "avatarCostumeInfo",
					},
                    {
                        type: "img",
                        img: avatarCostume[nobleActive],
                    },
				],
			},
            {
				title: "nobleEntranceMessage",
				content: [
                    {
                        type: "img",
                        img: messageImgList[nobleActive],
                    },
				],
			},
            {
				title: "nobleChatBubble",
				content: [
                    {
                        type: "img",
                        img: nobleChatBubble[nobleActive],
                    },
				],
			},
            {
				title: "nobleAvatarFrame",
				content: [
                    {
                        type: "img",
                        img: nobleAvatarFrame[nobleActive],
                    },
				],
			},
            {
				title: "nobleInfoCard",
				content: [
                    {
                        type: "img",
                        img: nobleInfoCard[nobleActive],
                    },
				],
			},
            {
				title: "nobleEmoticon",
				content: [
                    {
						type: "text",
						key: "nobleEmoticonInfo",
					},
                    {
                        type: "img",
                        img: nobleEmoticon[nobleActive],
                    },
				],
			},
            {
				title: "nobleGift",
				content: [
                    {
						type: "text",
						key: "nobleGiftInfo",
					},
                    {
                        type: "img",
                        img: nobleGift[nobleActive],
                    },
				],
			},
            {
				title: "topRanking",
				content: [
                    {
						type: "text",
						key: "topRankingInfo",
					},
                    {
                        type: 'img',
                        img: computedImg(topRanking, nobleActive),
                    }
				],
			},
            {
				title: "fastLevelUp",
				content: [
                    {
						type: "text",
						key: "fastLevelUpInfo",
					},
                    {
                        type: "img",
                        img: 'https://yaame-static.yaame.io/admin/8078cd8785c94a6713118eb5773d57ef.png'
                    },
				],
			},
            {
				title: "customID",
				content: [
                    {
						type: "text",
						key: "customIDInfo",
					},
                    {
                        type: "img",
                        img: 'https://yaame-static.yaame.io/admin/1f06d80a15eebcfa435a227e7a88139f.png'
                    },
				],
			},
      {
        title: "custom_vanity_id",
        content: [
          {
            type: "text",
            key: "modify_id_in_app",
          },
          {
            type: "img",
            img: 'https://yaame-static.yaame.io/admin/409b1591c14acc83d71986292419e436.png'
          },
        ],
      },
            {
				title: "antiKickPrivilege",
				content: [
                    {
						type: "text",
						key: "antiKickPrivilegeInfo",
					},
                    {
                        type: 'img',
                        img: computedImg(antiKickPrivilege, nobleActive),
                    }
				],
			},
            {
				title: "mysteriousUser",
				content: [
                    {
						type: "text",
						key: "mysteriousUserInfo",
					},{
						type: "text",
						key: "mysteriousUserInfo1",
					},{
						type: "text",
						key: Number(getVerCode()) < 11800 ? "mysteriousUserInfo_2" : "mysteriousUserInfo2",
					},{
						type: "text",
						key: "mysteriousUserInfo3",
					},{
						type: "text",
						key: "mysteriousUserInfo4",
					},{
                        type: "img",
                        img: 'https://yaame-static.yaame.io/admin/5759ca2f495a1be0d61f1ea1c6bb9218.png'
                    },
				],
			},
            {
				title: "noblePrivilege",
				content: [
                    {
						type: "text",
						key: "noblePrivilegeInfo",
					},{
                        type: "img",
                        img: 'https://yaame-static.yaame.io/admin/1451a95923206388f63ecdae78ed7b00.png'
                    },
				],
			},
		]);



		onMounted(() => {
			getData();
			window.addEventListener("scroll", pageChange);

            document.body.style.backgroundColor = '#151F25';
		});
		onUnmounted(() => {
			window.removeEventListener("scroll", pageChange);
		});
		return {
			language,
			safeHeight,

			headerWhite,
			back,

			privilegeActiveChange,
			privilegeActive,

			privilegesList,
            nobleLevels,
            nobleActive,

            levelDetails,
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
	min-height: 100vh;
	padding-top: 0.88rem;
	font-size: 0.24rem;
	color: #b7a69b;
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
		background-color: transparent;
	}
	/deep/.van-tabs__wrap {
		height: 1.3rem;
	}
	.noble-type {
		height: 1.3rem;
		align-items: center;
	}
	.noble-tab-item {
		color: @color-no-selected-text;
		font-size: 0.3rem;
		position: relative;
		&.active {
			.img-container {
				img {
					width: 0.7rem;
					height: 0.7rem;
					opacity: 1;
				}
			}
		}
		.img-container {
			width: 0.7rem;
			height: 0.7rem;
			display: flex;
			justify-content: center;
			align-items: center;
			img {
				width: 0.6rem;
				height: 0.6rem;
				opacity: 0.3;
			}
		}
        .triangle {
            width: 0.3rem;
            height: 0.3rem;
            position: absolute;
            left: 50%;
            bottom: -0.6rem;
            transform: translate(-50%, -50%) rotate(45deg);
            background-color: #1B262D;
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
		min-height: calc(100vh - 4rem);
		padding: 0.4rem;
        background-color: #1B262D;
		font-size: 0.22rem;
		font-weight: 400;
		color: #d9b99f;
        border-top-right-radius: 0.24rem;
        border-top-left-radius: 0.24rem;
        background-color: #1D262C;
		.title {
			width: 6.7rem;
			text-align: center;
			font-size: 0.26rem;
			font-weight: 600;
			color: #d9b99f;
            margin-bottom: 0.3rem;
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
