<template>
    <div class="main">
        <Header v-if="isFullScreen" color="white">{{ $t('defeatDemonKing') }}</Header>

        <img
            v-if="isFullScreen"
            class="banner-img"
            :src="titleImgList[language]"
            alt="title"
        />

        <div :style="{ top: isFullScreen ? '3.8rem' : '0.3rem' }" class="tab-container">
            <div
                v-for="item in tabList"
                :key="item.value"
                :class="[item.value === tabActive ? 'tab-active' : '']"
                @click="tabClick(item.value)"
            >
                {{ $t(item.value) }}
            </div>
        </div>

        <div
            v-show="tabActive === 'demonKing'"
            :style="{ 'background-image': `url('${homeBackGroundImg}')` }"
            :class="['demonKing-container', !isFullScreen && 'relative-container']"
        >
            <img class="rule-icon" src="https://yaame-static.yaame.io/admin/3b4d9ea28abf08be6641ce78910d5ed8.png"
                 alt="rule" @click="showRulesPopup = true"
            >
            <img v-if="!isFullScreen" class="home-icon" src="https://yaame-static.yaame.io/admin/864d2913a6deaaa7dd17a02d10fa2cdd.png" alt="" @click="backHome">
            <div
                class="icon-box reward"
                @click="showRewardPopup = true"
            >
                {{ $t('rewards') }}
            </div>
            <div
                class="icon-box record"
                @click="showRecordPopup = true"
            >
                {{ $t('records') }}
            </div>
            <div class="monster-box">
                <canvas id="monster_canvas"></canvas>
            </div>
            <div v-show="currentMonsterType !== 'mbmon'" class="process-box">
                <div class="flex-div">
                    <div class="process-bar">
                        <img
                            src="http://imgcom.static.suishenyun.net/home_bloodbar-3d917f.png"
                            alt=""
                        />
                        <div
                            v-for="item in processList"
                            :key="item.color"
                            :style="{
									'background-color': item.color,
									'z-index': item.sort,
									width: getHPWidth(monsterInfo, item),
									display: getDisplay(monsterInfo, item),
								}"
                        ></div>
                    </div>

                    <div v-if="!monsterInfo.end" class="process-num">
                        {{
                            `${((monsterInfo.left_blood / monsterInfo.total_blood) * 100).toFixed(
                                0
                            )}%`
                        }}
                    </div>
                    <div v-else class="process-num">0%</div>
                </div>
                <p class="process-info">
                    {{ $t('dealtDamage') }}<span :style="{ color: blood_color, margin: '0 0.08rem' }">{{
                        userTotalHarmBloodAmount
                    }}</span
                >
                </p>
            </div>

            <div v-show="monsterTalkShow === 1" class="monster-info info-one">
                <img
                    class="home-dialog"
                    src="https://yaame-static.yaame.io/admin/b050cfcefd84a2105a739ebbf90bb3f8.png"
                    alt=""
                />
                <p>{{ $t(talkShowText) }}</p>
            </div>
            <div v-show="monsterTalkShow === 2" class="monster-info info-two">
                <img
                    class="home-dialog"
                    src="https://yaame-static.yaame.io/admin/b050cfcefd84a2105a739ebbf90bb3f8.png"
                    alt=""
                />
                <p>{{ $t(talkShowText) }}</p>
            </div>

            <div class="select-arms">
                <div class="select-arms-content">
                    <div
                        v-for="(item, index) in weapons"
                        v-show="shouldShowItem(item)"
                        :key="index"
                        :class="{
								'select-arms-content-item': true,
								'arms-item-active': armsActive === item.weapon_type,
							}"
                        @click="armsActive = item.weapon_type"
                    >
                        <div class="arms-item-img">
                            <img :src="item.weapon_icon" alt="weaponIcon" />
                            <div v-if="item.weapon_count" class="num_box">
                                <p>{{ item.weapon_count }}</p>
                            </div>
                        </div>
                        <p class="arms-item-name no-wrap">{{ item.weapon_name }}</p>
                        <div class="arms-item-price">
                            <p>{{ item.diamond_price }}</p>
                        </div>
                    </div>
                </div>
                <footer class="select-arms-footer">
                    <div @click="handleAttack(1)">{{ $t('attackOnce') }}</div>
                    <div @click="handleAttack(10)">{{ $t('attackTenTimes') }}</div>
                </footer>
            </div>


        </div>

        <div v-show="tabActive === 'weapon'" :class="['demonKing-container', !isFullScreen && 'relative-container']">
            <img v-if="!isFullScreen" class="home-icon" src="https://yaame-static.yaame.io/admin/864d2913a6deaaa7dd17a02d10fa2cdd.png" alt="" @click="backHome">
            <div class="arms-info-content">
                <div
                    v-for="(item, index) in weaponsList"
                    :key="index"
                    class="arms-info-item"
                >
                    <div class="arms-info-box">
                        <div class="img-container">
                            <img :src="item.weapon_icon" alt=""/>
                            <div class="img-text">{{ item.weapon_name }}</div>
                        </div>
                        <div class="arms-process">
                            <div class="arms-process-bar">
                                <div
                                    :style="{ width: `${(item.today_gather_weapon_count / item.weapon_limit_count) * 100}%` }"
                                    class="arms-process-bar-color"
                                ></div>
                            </div>
                            <p  class="arms-process-info">
                                {{ $t('todayObtained', [item.today_gather_weapon_count, item.weapon_limit_count]) }}
                            </p>
                        </div>
                    </div>
                    <p class="arms-info-p" style="margin-top: 0.3rem">
                        · {{ item.weapon_desc_infos[0] }}
                    </p>
                    <p class="arms-info-p" style="margin-top: 0.1rem">
                        · {{ item.weapon_desc_infos[1] }}
                    </p>
                </div>
            </div>
        </div>

        <div v-if="tabActive === 'ranking'" :class="['demonKing-container', !isFullScreen && 'relative-container']">
            <img v-if="!isFullScreen" class="home-icon" src="https://yaame-static.yaame.io/admin/864d2913a6deaaa7dd17a02d10fa2cdd.png" alt="" @click="backHome">
            <div class="arms-tab">
                <div
                    v-for="item in rankTabList"
                    :key="item"
                    :class="[rankTabActive === item ? 'arms-tab-active' : '']"
                    @click="rankTabActive = item"
                >
                    {{ $t(item) }}
                    <div v-if="rankTabActive === item" class="brClass"></div>
                </div>
            </div>
            <div v-show="rankTabActive === 'damageBoard'" class="rank-content">
                <HurtRankList :activity_cycle_flag="activity_cycle_flag" :monster_id="monsterInfo.monster_id"></HurtRankList>
            </div>
            <div v-show="rankTabActive === 'heroBoard'" class="rank-content">
                <HeroRankList :activity_cycle_flag="activity_cycle_flag" :monster_id="monsterInfo.monster_id"></HeroRankList>
            </div>
        </div>

        <Rule v-if="showRulesPopup" @close="showRulesPopup = false"></Rule>
        <Record v-if="showRecordPopup" @close="showRecordPopup = false"></Record>
        <Rewards v-if="showRewardPopup" @close="showRewardPopup = false"></Rewards>

        <DemonKingPopUp v-if="getArmsShow">
            <p class="demonKingPopUp-header">{{ $t('insufficientWeapons') }}</p>
            <footer style="margin-top: 0.38rem" class="demonKingPopUp-footer">
                <div @click="getArmsShow = false">{{ $t('Cancel') }}</div>
                <div @click="getArmsFun">{{ $t('obtainMethods') }}</div>
            </footer>
        </DemonKingPopUp>
        <DemonKingPopUp v-if="buyMoney">
            <p class="demonKingPopUp-header">{{ $t('insufficientDiamonds') }}</p>
            <footer style="margin-top: 0.38rem" class="demonKingPopUp-footer">
                <div @click="buyMoney = false">{{ $t('Cancel') }}</div>
                <div @click="toRecharge">{{ $t('goToRecharge') }}</div>
            </footer>
        </DemonKingPopUp>

        <DemonKingPopUp v-if="endPopupShow">
            <p class="end-text-p">{{ $t('activityEnd') }}</p>
            <div class="end-text-container">{{ $t('activityEndTime') }}</div>

            <img class="end-text-close" src="https://yaame-static.yaame.io/admin/8fe1c6ad9edb7f24bcced49870f6f129.png" @click="endPopupShow = false;">
        </DemonKingPopUp>

        <DemonKingPopUp v-if="buyWeaponShow">
            <p class="demonKingPopUp-header">

                <template v-if="armsActive === 'bsj'">{{ $t('consumeDiamonds', [attackTimes * 50, attackTimes]) }}</template>
                <template v-if="armsActive === 'jhsj'">{{ $t('consumeDiamonds2', [attackTimes * 100, attackTimes]) }}</template>
            </p>
            <div class="normal-select" @click="checked = !checked">
                <div class="normal-select-span"><div v-if="checked"></div></div>
                {{ $t('noPrompt') }}
            </div>
            <footer style="margin-top: 0.3rem" class="demonKingPopUp-footer">
                <div @click="buyWeaponShow = false">{{ $t('Cancel') }}</div>
                <div @click="buyWeaponFun">{{ $t('Confirm') }}</div>
            </footer>
        </DemonKingPopUp>

        <DamagePopup v-if="attackAgainShow" :attack-obj="attackRes" @submit="handleAttack" @close="attackAgainClose"></DamagePopup>

        <PageLoading v-if="pageLoading"></PageLoading>
    </div>
</template>

<script>
    import { ref, onMounted, computed, nextTick, onUnmounted, getCurrentInstance } from "vue";
    import { getQueryString, sleep } from '@/lib/utils.js';
    import Header from '@/components/common/header.vue';
    import Rule from './components/Rule.vue';
    import Record from './components/WinRecord.vue';
    import Rewards from './components/Rewards.vue';
    import HurtRankList from "@/pages/demonKing/components/HurtRankList.vue";
    import HeroRankList from "@/pages/demonKing/components/HeroRankList.vue";
    import DemonKingPopUp from "@/pages/demonKing/components/DemonKingPopUp.vue";
    import DamagePopup from "@/pages/demonKing/components/DamagePopup.vue";
    import PageLoading from "@/components/common/page_loading.vue";
    import { getLanguage } from "@/lib/device";
    import { getDemonKingInfo, getDemonKingWeapon, postDemonKingAttack } from '@/lib/request/draw';
    import { Toast } from "vant";
    import { Downloader, Parser, Player } from "svga.lite";
    import DB from 'svga.lite/db';

    export default {
        components: {
            Header,
            Rule,
            Record,
            Rewards,
            HurtRankList,
            HeroRankList,
            DemonKingPopUp,
            DamagePopup,
            PageLoading
        },
        setup() {
            const root = getCurrentInstance();

            const t = (val) => {
                return root.proxy.$i18n.t(val)
            }

            let isFullScreen = !getQueryString('popup');

            let language = computed(() => {
                let locale = getLanguage() || "en";
                if (['zh-hk', 'zh-tw', 'zh-mo', 'zh-cn', 'zh_cn'].indexOf(locale) > -1) {
                    let localEnum = {
                        'zh-hk': 'zh-tw',
                        'zh-tw': 'zh-tw',
                        'zh-mo': 'zh-tw',
                        'zh-cn': 'zh-cn',
                        'zh_cn': 'zh-cn',
                    };

                    locale = localEnum[locale];
                }
                return locale;
            });

            let titleImgList = ref({
                'zh-cn': 'https://yaame-static.yaame.io/admin/bd593945b30edcb1aaf0facfd1f461c0.png',
                'zh-tw': 'https://yaame-static.yaame.io/admin/9acdd048bb58c5d789d356f224e32b41.png',
                'en': 'https://yaame-static.yaame.io/admin/40c468c407a53ffc358409d80e5ff77d.png',
                'id': 'https://yaame-static.yaame.io/admin/bdd96a3177da9fe771e46240177f16c8.png',
                'ar': 'https://yaame-static.yaame.io/admin/535151abad10912dd549ed4e33ce002e.png',
            });

            let tabList = ref([
                {
                    label: '讨伐魔王',
                    value: 'demonKing',
                },
                {
                    label: '武器获取',
                    value: 'weapon',
                },
                {
                    label: '排行榜',
                    value: 'ranking',
                },
            ]);
            let tabActive = ref('demonKing');
            const tabClick = (value) => {
                tabActive.value = value;
                if (tabActive.value === 'ranking') {
                    rankTabActive.value = 'damageBoard';
                }
            };

            const showRulesPopup = ref(false);
            const showRewardPopup = ref(false);
            const showRecordPopup = ref(false);

            const monster = ref({
                downloader: null,
                parser: null,
                player: null,
                svgaStaticData: null,
                svgaAttackData: null,
            });

            const monsterList = ref([
                {
                    transition:
                        "https://yaame-static.yaame.io/admin/a5a39ed011f76bb5dd8409056ebd327c.svga",
                    permanent:
                        "https://yaame-static.yaame.io/admin/fccc903885581bb2199e0491ab6a46d5.svga",
                    cannon:
                        "https://yaame-static.yaame.io/admin/3397cb56f8d3e67599f78c5b3bc1b5fa.svga",
                    sword:
                        "https://yaame-static.yaame.io/admin/e894fd9b70e25aceee27e615a1430f71.svga",
                    crystal:
                        "https://yaame-static.yaame.io/admin/c83f56b4704a6dc414fbb96467f69c17.svga",
                    bg_img: 'https://yaame-static.yaame.io/admin/d8e1eb6c9f90a2ecebd69f96cc4d731d.jpeg'
                }, {
                    transition:
                        "https://yaame-static.yaame.io/admin/baa8a8f65e22c46015522f607bc13385.svga",
                    permanent:
                        "https://yaame-static.yaame.io/admin/6fc80c159b52a5b65e793709b1248666.svga",
                    cannon:
                        "https://yaame-static.yaame.io/admin/956696a882b15bcbc4c653f70dc1bc62.svga",
                    sword:
                        "https://yaame-static.yaame.io/admin/f7e765681767aeafff48c0f76be64b33.svga",
                    crystal:
                        "https://yaame-static.yaame.io/admin/6699f568c58735cb910d40bc9ca736a3.svga",
                    bg_img: 'https://yaame-static.yaame.io/admin/8436426f2dc54d2ae0e19be0833be857.jpeg'
                }, {
                    transition:
                        "https://yaame-static.yaame.io/admin/034df4169fefd4a1864a190a639c7168.svga",
                    permanent:
                        "https://yaame-static.yaame.io/admin/3a82dcc4cd70daff17b15b5491276a11.svga",
                    cannon:
                        "https://yaame-static.yaame.io/admin/7d441ee8ab6042262c308b078f51246b.svga",
                    sword:
                        "https://yaame-static.yaame.io/admin/ff69ca0a1782b01a74914c736aea9831.svga",
                    crystal:
                        "https://yaame-static.yaame.io/admin/b0bde3dfd85cbc046af00c54f58037d7.svga",
                    bg_img: 'https://yaame-static.yaame.io/admin/0699a0191f947750a1c349615b3bffe6.jpeg'
                }, {

                    transition:
                        "https://yaame-static.yaame.io/admin/48abd28e68e3151b051d1605538397a9.svga",
                    permanent:
                        "https://yaame-static.yaame.io/admin/cdf526ee26b5989cf8877e7702017757.svga",
                    bg_img: 'https://yaame-static.yaame.io/admin/62505861f983dc723411ba92b52bafe8.jpeg'
                }
            ]);

            const MONSTER_ENUM = {
                jsmon: 0,
                xxgmon: 1,
                kingmon: 2,
                mbmon: 3
            };

            let currentMonsterType = ref(null);

            let monsterInfo = ref({
                left_blood: 0,
                total_blood: 0,
                monster_type: 'jsmon',
                monster_id: null
            });

            let userTotalHarmBloodAmount = ref(0);

            const initSVGAData = async (obj, svga_static) => {
                let options = obj.value;
                options.downloader = new Downloader();
                // 默认调用 WebWorker 线程解析
                // 可配置 new Parser({ disableWorker: true }) 禁止
                options.parser = new Parser();
                // #canvas 是 HTMLCanvasElement
                options.player = new Player(`#monster_canvas`);
                // 加载静态年兽动画
                const fileStaticData = await options.downloader.get(svga_static);
                options.svgaStaticData = await options.parser.do(fileStaticData);

                options.player.set({ loop: 0 });

                await options.player.mount(options.svgaStaticData);
                options.player.start();
            };

            const attackSVGA = async (obj, svgaFile, is_attack) => {
                let options = obj.value;


                let fileOptions = void 0;
                let db = void 0;
                try {
                    db = new DB()
                } catch (error) {
                    console.error(error)
                }

                if (db) {
                    fileOptions = await db.find(svgaFile)
                }

                if (fileOptions && is_attack) {
                    options.svgaAttackData = fileOptions;
                    if (!options.svgaAttackData) {
                        return;
                    }
                    options.downloader.cancel();
                    options.player.clear();
                    await options.player.mount(fileOptions);
                    options.player.start();
                } else {
                    if (is_attack) {
                        const fileAttackData = await options.downloader.get(svgaFile);
                        options.svgaAttackData = await options.parser.do(fileAttackData);

                        db && (await db.insert(svgaFile, options.svgaAttackData))
                        if (!options.svgaAttackData) {
                            return;
                        }
                        options.downloader.cancel();
                        options.player.clear();

                        const data = is_attack ? options.svgaAttackData : options.svgaStaticData;
                        await options.player.mount(data);
                        options.player.start();
                    } else {
                        options.downloader.cancel();
                        options.player.clear();

                        const data = is_attack ? options.svgaAttackData : options.svgaStaticData;
                        await options.player.mount(data);
                        options.player.start();
                    }
                }
            };

            let homeBackGroundImg = computed(() => {
                if (currentMonsterType.value) {
                    return monsterList.value[MONSTER_ENUM[currentMonsterType.value]].bg_img;
                } else {
                    return  monsterList.value[0].bg_img
                }
            });

            let currentFile = computed(() => {
                return monsterList.value[MONSTER_ENUM[currentMonsterType.value]];
            });

            let processList = ref([
                {
                    color: "#59CB61",
                    max: 100,
                    min: 67,
                    sort: 4,
                    type: "jsmon",
                },
                {
                    color: "#DB58FF",
                    max: 66,
                    min: 34,
                    sort: 3,
                    type: "xxgmon",
                },
                {
                    color: "#FF7263",
                    max: 34,
                    min: 0,
                    sort: 2,
                    type: "kingmon",
                },
            ]);

            const getHPWidth = (monster, item) => {
                if (monster.monster_type === item.type) {
                    let difference = monster.left_blood / monster.total_blood;
                    return `${2.81 * difference}rem`;
                } else {
                    let mapObj = {
                        jsmon: 4,
                        xxgmon: 3,
                        kingmon: 2,
                    };
                    if (item.sort < mapObj[monster.monster_type]) {
                        return "2.81rem";
                    } else {
                        return "0rem";
                    }
                }
            };
            const getDisplay = (monster, item) => {
                if (monster.monster_type === item.type) {
                    return "block";
                } else {
                    let mapObj = {
                        jsmon: 4,
                        xxgmon: 3,
                        kingmon: 2,
                    };
                    if (item.sort < mapObj[monster.monster_type]) {
                        return "block";
                    } else {
                        return "none";
                    }
                }
            };

            let blood_color = computed(() => {
                if (monsterInfo.value.monster_type === 'jsmon') {
                    return '#59CB61';
                } else if (monsterInfo.value.monster_type === 'xxgmon') {
                    return '#DB58FF';
                } else if (monsterInfo.value.monster_type === 'kingmon') {
                    return '#FF7263';
                }
            });

            let monsterTalkShow = ref(0);
            let talkShowTimeOut = ref(null);
            let talkShowList = ref({
                jsmon: [
                    'itchingPerson',
                    'runAway'
                ],
                xxgmon: [
                    'foolishHumans',
                    'angry'
                ],
                kingmon: [
                    'boring',
                    'goodLuck'
                ],
                mbmon: [
                    'strongerNextWeek',
                    'luckyVictory'
                ]
            });
            let talkShowText = ref('');

            let weapons = ref([]);
            let armsActive = ref('bsj');

            let activity_cycle_flag = ref('');

            let firstViewPage = ref(true);
            // 获取首页信息

            const getTypeFile = (type) => {
                return monsterList.value[MONSTER_ENUM[type]];
            }

            let activity_status = ref(0);
            let pageLoading = ref(true);


            const getHomeInfo = async () => {
                try {
                    let res = await getDemonKingInfo({
                        activityType: 'BIG_MONSTER'
                    });

                    if (res.status === 1000) {
                        let oldType = currentMonsterType.value;
                        activity_status.value = res.data.activity_status;

                        if (activity_status.value === 1) {
                            monsterInfo.value = res.data.monster_info;
                        } else {
                            monsterInfo.value = {
                                left_blood: 0,
                                total_blood: 1,
                                monster_type: 'mbmon',
                                monster_id: null
                            };
                        }
                        currentMonsterType.value = monsterInfo.value.monster_type;
                        userTotalHarmBloodAmount.value = res.data.user_total_harm_blood_amount;
                        weapons.value = res.data.weapons;
                        activity_cycle_flag.value = res.data.activity_cycle_flag;

                        if (!talkShowTimeOut.value) {
                            let index =
                                Math.round(Math.random() * (talkShowList.value[currentMonsterType.value].length - 1));
                            talkShowText.value = talkShowList.value[currentMonsterType.value][index];
                            monsterTalkShow.value = 1;
                            talkShowTimeOut.value = setInterval(() => {
                                if (monsterTalkShow.value === 1) {
                                    monsterTalkShow.value = 2;
                                } else {
                                    monsterTalkShow.value = 1;
                                }

                                let index =
                                    Math.round(Math.random() * (talkShowList.value[currentMonsterType.value].length - 1));
                                talkShowText.value = talkShowList.value[currentMonsterType.value][index];
                            }, 5000);
                        }

                        if (firstViewPage.value) {
                            await initSVGAData(monster, currentFile.value.permanent);
                            firstViewPage.value = false;
                        }

                        if (oldType && oldType !== currentMonsterType.value) {
                            await attackSVGA(monster, getTypeFile(currentMonsterType.value).transition, true);

                            await sleep(1000);

                            await attackSVGA(monster, getTypeFile(currentMonsterType.value).transition, false);

                            monster.value.downloader.destroy();
                            monster.value.parser.destroy();
                            monster.value.player.destroy();

                            await initSVGAData(monster, getTypeFile(currentMonsterType.value).permanent);

                            if (oldType === 'jsmon') {
                                if (armsActive.value === 'jgp') {
                                    armsActive.value = 'bsj';
                                }
                            }
                        }

                        nextTick(() => {
                            pageLoading.value = false;
                        })
                    } else {
                        Toast(res.desc);
                    }

                } catch (error) {
                    throw new Error(error);
                }
            };


            let getArmsShow = ref(false);
            const getArmsFun = () => {
                getArmsShow.value = false;
                tabActive.value = "weapon";
            }

            let attackTimes = ref(0);

            let buyWeaponShow = ref(false);
            let checked = ref(true);
            const buyWeaponFun = () => {
                if (checked.value) {
                    localStorage.setItem("is_buy", "1");
                }
                buyWeaponShow.value = false;

                attackFun(attackTimes.value);
            }


            let attackSvgaFile = computed(() => {
                let armsEnum = {
                    jgp: "cannon",
                    bsj: "sword",
                    jhsj: "crystal",
                };

                let monsterEnum = {
                    jsmon: 0,
                    xxgmon: 1,
                    kingmon: 2,
                };

                let monster = monsterEnum[monsterInfo.value.monster_type];

                if (typeof monster === 'number') {
                    return monsterList.value[monster][armsEnum[armsActive.value]];
                }
            })

            let attackAgainShow = ref(false)
            let attackRes = ref({
                harm_blood_amount: 0,
                left_blood: 0,
                rewards: [],
                user_total_harm_blood_amount: 0,
            })

            const buyMoney = ref(false);

            let attackFlag = ref(true)

            let endPopupShow =ref(false);
            const attackFun  = async (count) => {
                try {

                    if (!attackFlag.value) return;

                    attackFlag.value = false;
                    let res = await postDemonKingAttack({
                        activity_type: 'BIG_MONSTER',
                        attack_times: count,
                        monster_id: monsterInfo.value.monster_id,
                        weapon_flag: armsActive.value,
                    })

                    if (res.status === 1000) {
                        attackAgainShow.value = false;
                        await attackSVGA(monster, attackSvgaFile.value, true);
                        await sleep(1000);
                        await attackSVGA(monster, attackSvgaFile.value, false);

                        attackRes.value = res.data;
                        attackAgainShow.value = true;

                        getHomeInfo();
                        getWeapons();
                    } else if (res.status === 6002) {
                        getArmsShow.value = true;
                    } else if (res.status === 6001) {
                        getHomeInfo();
                        getWeapons();
                    } else if (res.status === 6600) {
                        Toast(res.desc);
                        // buyMoney.value = true;

                        setTimeout(() => {
                            window.location.href = "wlyaame://mine/shop/diamond";
                        }, 1500);
                    } else if (res.status === 6003){
                        // Toast(res.desc);
                        endPopupShow.value = true;
                    }
                    attackFlag.value = true;
                } catch (error) {
                    throw new Error(error);
                }
            }
            const handleAttack = (count) => {
                try {
                    attackAgainShow.value = false;
                    if (currentMonsterType.value === 'mbmon') {
                        Toast(t('monsterDead'))
                    }

                    attackTimes.value = count;
                    if (armsActive.value === 'jhsj' || armsActive.value === 'bsj') {
                        if (!localStorage.getItem("is_buy")) {
                            buyWeaponShow.value = true;
                            return;
                        }
                    }

                    attackFun(attackTimes.value)
                } catch (error) {
                    throw new Error(error);
                }
            }

            const attackAgainClose = () => {
                attackAgainShow.value = false;
            }

            const weaponsList = ref([]);
            const getWeapons = async () => {
                try {
                    let res = await getDemonKingWeapon({
                        activityType: 'BIG_MONSTER',
                        activity_cycle_flag: activity_cycle_flag.value
                    });
                    if (res.status === 1000) {
                        weaponsList.value = res.data.weapons;
                    } else {
                        Toast(res.desc);
                    }
                } catch (error) {
                    throw new Error(error);
                }
            };

            const rankTabList = ref([
                'damageBoard',
                'heroBoard',
            ]);
            const rankTabActive = ref('damageBoard');

            const toRecharge = () => {
                window.location.href = "wlyaame://mine/shop/diamond";
            }

            const shouldShowItem = (item)=>  {
                // 判断条件
                if (currentMonsterType.value !== 'jsmon') {
                    return item.weapon_type !== 'jgp';
                }
                return true;
            }


            const backHome = () => {
                window.location.href = "wlyaame://webview/pop";
            }

            let infoInterVal = ref(null);
            onMounted(async () => {
                await getHomeInfo();
                await getWeapons();

                infoInterVal.value = setInterval(() => {
                    getHomeInfo();
                }, 10000);
            });
            onUnmounted(() => {
                clearInterval(talkShowTimeOut.value);
                clearInterval(infoInterVal.value);
            });
            return {
                language,
                titleImgList,
                isFullScreen,

                tabList,
                tabActive,
                tabClick,

                showRulesPopup,
                showRewardPopup,
                showRecordPopup,

                monsterInfo,
                userTotalHarmBloodAmount,
                homeBackGroundImg,

                processList,
                getHPWidth,
                getDisplay,
                blood_color,

                monsterTalkShow,
                talkShowText,

                weapons,
                armsActive,

                getArmsShow,
                getArmsFun,

                attackTimes,
                buyWeaponShow,
                checked,
                buyWeaponFun,
                attackAgainShow,
                handleAttack,
                attackAgainClose,
                attackRes,

                activity_cycle_flag,
                weaponsList,

                rankTabList,
                rankTabActive,

                pageLoading,

                buyMoney,
                toRecharge,


                currentMonsterType,

                shouldShowItem,
                backHome,

                endPopupShow
            };
        },
    };
</script>

<style lang="less" scoped>
@text-color: #fff;
@text-select-color: #FFD738;
.main {
    background-color: #1b0e3c;
    font-size: 0.24rem;
    color: @text-color;
    width: 7.5rem;
    height: 11.69rem;

    .banner-img {
        width: 7.5rem;
        height: auto;
    }

    .tab-container {
        position: absolute;
        z-index: 2;
        left: 0.9rem;
        top: 0.3rem;
        width: 5.7rem;
        height: 0.7rem;
        line-height: 0.7rem;
        font-size: 0.24rem;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.4);
        background: rgba(110, 68, 255, 0.4);
        box-shadow: inset 0 1px 0.3rem 0 rgba(0, 0, 0, 0.4);
        border-radius: 0.12rem;
        margin: 0 auto;
        display: flex;

        div {
            flex: 1;
            border-radius: 0.12rem;
            text-align: center;
        }

        .tab-active {
            background-image: linear-gradient(180deg, #7b95ff 0%, #483fff 100%);
            box-shadow: inset 0.01rem 0.02rem 0.03rem 0 rgba(255, 255, 255, 0.3);
            color: #fff;
        }
    }

    .demonKing-container {
        width: 7.5rem;
        height: 11.69rem;
        background-size: 7.5rem auto;
        background-repeat: no-repeat;
        position: absolute;
        top: 3.5rem;
        &.relative-container {
            position: relative;
            top: 0;
        }
        .icon-box {
            position: absolute;
            right: 0;
            width: 1.2rem;
            height: 0.48rem;
            line-height: 0.48rem;
            text-align: center;
            background: #5b5fff;
            border-radius: 0.12rem 0 0 0.12rem;
            font-size: 0.24rem;
            color: #fff;
            font-weight: 700;
            z-index: 99;

            &.reward {
                top: 1.85rem;
            }

            &.record {
                top: 2.63rem;
            }
        }

        .rule-icon {
            position: absolute;
            top: 1.58rem;
            left: 0.18rem;
            width: 0.42rem;
            height: 0.42rem;
            z-index: 99;
        }
        .home-icon {
            position: absolute;
            top: 0.46rem;
            left: 0.13rem;
            width: 0.48rem;
            height: 0.42rem;
            z-index: 99;
        }

        #monster_canvas {
            width: 7.5rem;
            height: 11rem;
        }

        .process-box {
            position: absolute;
            width: 4rem;
            height: 0.8rem;
            top: 1.46rem;
            left: calc(50% - 2rem);
            z-index: 2;

            .process-bar {
                position: relative;
                display: inline-block;
                width: 3.27rem;
                height: 0.42rem;

                img {
                    position: absolute;
                    z-index: 5;
                    width: 3.27rem;
                    height: 0.42rem;
                }

                div {
                    position: absolute;
                    top: 0.08rem;
                    left: 0.44rem;
                    width: 2.81em;
                    height: 0.27rem;
                    border-top-right-radius: 0.28rem;
                    border-bottom-right-radius: 0.28rem;
                }
            }

            .process-num {
                display: inline-block;
                height: 0.42rem;
                line-height: 0.42rem;
                width: 0.63rem;
                text-align: center;
                font-weight: 700;
                font-size: 0.24rem;
                color: #fff;
            }

            .process-info {
                width: 4.8rem;
                text-align: center;
                font-size: 0.24rem;
                transform: scale(0.83);
                margin-left: -0.4rem;
                color: #fff;
                margin-top: 0.12rem;
            }
        }

        .monster-info {
            position: absolute;
            width: 3.02rem;
            //min-height: 0.7rem;
            background-color:  rgba(24,15,62,0.60);
            border-radius: 0.16rem;
            z-index: 7;
            color: #fff;
            font-size: 0.24rem;
            padding: 0.08rem 0;

            p {
                width: 3.24rem;
                font-weight: 700;
                transform: scale(0.833);
                margin-left: -0.1rem;
            }

            .home-dialog {
                width: 0.28rem;
                height: 0.26rem;
                position: absolute;
                opacity: 0.6;
            }
        }

        .info-one {
            left: 0.45rem;
            top: 2.45rem;

            .home-dialog {
                left: 1rem;
                bottom: -0.24rem;
                opacity: 0.6;
            }
        }

        .info-two {
            top: 5.95rem;
            right: 0.51rem;

            .home-dialog {
                transform: rotate(-180deg);
                left: 0.94rem;
                top: -0.24rem;
                opacity: 0.6;
            }
        }

        .select-arms {
            position: absolute;
            width: 6.9rem;
            z-index: 7;
            height: 4.33rem;
            background: rgba(110, 69, 255, 0.4);
            box-shadow: inset 0 1px 0.3rem 0 rgba(255, 255, 255, 0.54);
            border-radius: 0.2rem;
            left: 0.3rem;
            top: 8.08rem;

            .select-arms-content {
                width: 100%;
                padding: 0.25rem 0.4rem 0;
                display: flex;
                justify-content: space-around;
                height: 3.04rem;

                .select-arms-content-item {
                    width: 1.4rem;

                    &.arms-item-active {
                        .arms-item-img {
                            border: 0.05rem solid #ffd56f;
                        }
                    }

                    .arms-item-img {
                        position: relative;
                        width: 1.4rem;
                        height: 1.4rem;
                        background: #2e197f;
                        border-radius: 0.2rem;
                        border: 0.05rem solid #2e197f;

                        img {
                            width: 1.4rem;
                            height: 1.4rem;
                            border-radius: 0.12rem;
                        }

                        .num_box {
                            position: absolute;
                            top: -0.13rem;
                            right: -0.1rem;
                            z-index: 1;

                            height: 0.36rem;
                            line-height: 0.36rem;
                            text-align: center;
                            padding: 0 0.12rem 0;
                            background-color: #ff6161;
                            color: #fff;
                            font-weight: 700;
                            border-radius: 0.18rem;
                            p {
                                transform: scale(0.833);
                                font-size: 0.24rem;
                            }
                        }
                    }

                    .arms-item-name {
                        width: 1.4rem;
                        font-size: 0.24rem;
                        color: #fff;
                        font-weight: 700;
                        text-align: center;
                        margin-top: 0.16rem;
                        margin-bottom: 0.12rem;
                    }

                    .arms-item-name {
                        width: 1.4rem;
                        font-size: 0.24rem;
                        color: #fff;
                        font-weight: 700;
                        text-align: center;
                        margin-top: 0.16rem;
                        margin-bottom: 0.12rem;
                    }

                    .arms-item-price {
                        margin-left: 0.08rem;
                        width: 1.24rem;
                        height: 0.36rem;
                        line-height: 0.36rem;
                        padding-left: 0.34rem;
                        font-size: 0.2rem;
                        font-weight: normal;
                        color: #F3EDCD;
                        background-size: contain;
                        background-image: url(https://yaame-static.yaame.io/admin/d72e8340b22e7de8ce642de7c17c412e.png);
                        background-repeat: no-repeat;

                        p {
                            width: 0.88rem;
                            text-align: center;
                            transform: scale(0.8333);
                        }
                    }
                }
            }

            .select-arms-footer {
                width: 100%;
                height: 0.8rem;
                display: flex;
                padding: 0 0.37rem 0;
                justify-content: space-between;

                div {
                    width: 2.94rem;
                    height: 0.8rem;
                    text-align: center;
                    line-height: 0.8rem;
                    font-size: 0.32rem;
                    color: #ffffff;
                    font-weight: 700;
                    border-radius: 0.12rem;
                }

                div:nth-child(1) {
                    background-image: linear-gradient(180deg, #7b95ff 0%, #483fff 100%);
                    box-shadow: inset 1px 2px 3px 0 rgba(255, 255, 255, 0.3);
                }

                div:nth-child(2) {
                    background-image: linear-gradient(180deg,
                    #ffd56f 0%,
                    #ffb90d 34%,
                    #f38300 100%);
                    box-shadow: inset 1px 2px 3px 0 rgba(255, 255, 255, 0.3);
                }
            }
        }

        .arms-info-content {
            position: absolute;
            top: 1.41rem;
            padding: 0 0.3rem 0;
            .arms-info-item {
                width: 6.9rem;
                padding: 0.4rem 0.85rem;
                background: rgba(56, 39, 153, 0.9);
                border-radius: 0.2rem;
                margin-bottom: 0.3rem;
                .arms-info-box {
                    height: 1.4rem;
                    display: flex;
                    justify-content: space-between;
                    .img-container {
                        width: 1.4rem;
                        height: 1.4rem;
                        background-color: #2e197f;
                        border-radius: 0.2rem;
                        position: relative;
                        img {
                            width: 1.4rem;
                            height: 1.4rem;
                        }
                        .img-text {
                            width: 1.4rem;
                            height: 1.4rem;
                            position: absolute;
                            left: 0;
                            top: 0;
                            background-image: url(https://yaame-static.yaame.io/admin/2e816a43f6f3d09da6426819fbc0685c.png);
                            background-size: contain;
                            background-repeat: no-repeat;
                            padding-top: 1.06rem;
                            text-align: center;
                        }
                    }

                    .arms-process {
                        width: 3rem;
                        padding-top: 0.4rem;
                        margin-right: 0.25rem;
                        .arms-process-bar {
                            width: 3rem;
                            height: 0.16rem;
                            background-image: linear-gradient(180deg, #1b0e3c 0%, #3a206f 100%);
                            border-radius: 0.15rem;
                            .arms-process-bar-color {
                                background-image: linear-gradient(180deg, #ffec51 0%, #ffd428 100%);
                                border-radius: 0.15rem;
                                height: 0.16rem;
                            }
                        }

                    }
                }

                .arms-process-info {
                    width: 3rem;
                    text-align: center;
                    font-size: 0.2rem;
                    color: #ffffff;
                    font-weight: 400;
                    margin-top: 0.34rem;
                }
                .arms-info-p {
                    width: 6.54rem;
                    margin-left: -0.52rem;
                    font-size: 0.2rem;
                    color: #ffffff;
                    font-weight: 400;
                    transform: scale(0.833333);
                }
            }
        }

        .arms-tab {
            width: 100%;
            padding: 0 0.4rem 0;
            display: flex;
            justify-content: space-between;
            position: absolute;
            top: 1.52rem;
            z-index: 2;
            div {
                flex: 1;
                height: 0.6rem;
                text-align: center;
                font-size: 0.32rem;
                color: rgba(255, 255, 255, 0.6);
            }
            .arms-tab-active {
                font-weight: 700;
                color: #ffd428;
            }
            .brClass {
                width: 0.54rem;
                height: 0.06rem;
                background: #ffd428;
                border-radius: 0.04rem;
                margin: 0.11rem auto 0;
            }
        }

        .rank-content {
            border-radius: 0.2rem;
            width: 6.9rem;
            position: relative;
            top: 2.43rem;
            left: 0.3rem;
            background-color: rgba(56, 39, 153, 0.9);
        }

    }

    .demonKingPopUp-header {
        width: 100%;
        font-size: 0.32rem;
        color: #ffffff;
        text-align: center;
        font-weight: 700;
    }
    .demonKingPopUp-footer {
        display: flex;
        justify-content: space-between;
        font-size: 0.32rem;
        color: #ffffff;
        font-weight: 700;
        div {
            width: 2.6rem;
            height: 0.8rem;
            text-align: center;
            line-height: 0.8rem;
            border-radius: 0.12rem;
        }
        div:nth-child(1) {
            background-image: linear-gradient(180deg, #778de6 0%, #8682f1 100%);
            box-shadow: inset 1px 2px 3px 0 rgba(255, 255, 255, 0.3);
        }div:nth-child(2) {
             background-image: linear-gradient(
                 180deg,
                 #ffd56f 0%,
                 #ffb90d 34%,
                 #f38300 100%
             );
             box-shadow: inset 1px 2px 3px 0 rgba(255, 255, 255, 0.3);
         }

    }
    .normal-select {
        display: flex;
        width: 100%;
        font-size: 0.24rem;
        color: #ffffff;
        text-align: center;
        font-weight: 400;
        margin-top: 0.14rem;
    }
    .normal-select-span {
        margin-top: 0.06rem;
        margin-left: 1.4rem;
        width: 0.24rem;
        height: 0.24rem;
        border: 0.01rem solid #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 0.1rem;
        div {
            width: 0.12rem;
            height: 0.12rem;
            background-color: #ffc22f;
            border-radius: 50%;
        }
    }
}

.flex-div {
    display: flex;
    justify-content: space-between;
}

.end-text-p {
    text-align: center;
    font-size: 0.28rem;
    font-weight: normal;
    color: #FFFFFF;
}
.end-text-container {
    width: 4.74rem;
    height: 0.5rem;
    text-align: center;
    line-height: 0.5rem;
    color: #FFD738;
    background-image: url(https://yaame-static.yaame.io/admin/32c75124d569d1c18b1bc7656e325d49.png);
    background-size: contain;
    background-repeat: no-repeat;
    margin-left: 0.34rem;
    margin-top: 0.1rem;
}
.end-text-close {
    position: absolute;
    top: 0.2rem;
    right: 0.2rem;
    width: 0.2rem;
    height: 0.2rem;
}
</style>