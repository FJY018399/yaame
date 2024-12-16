<template>
    <div class="main">
        <custom-header color="white" class="main-header">{{ $t("greedyKing") }}</custom-header>
        <!-- 奖励查看 -->
        <div class="details" @click="$router.push('gameReward')">
            {{ $t("gameRewards") }}
        </div>
        <!-- logo -->
        <img class="logo-img" :src="logoImg[locale]" alt=""/>
        <!-- 活动时间 -->
        <div class="time-img">
            <img v-if="typeof status === 'number'" class="activity-img" :src="status === 0 && myIconImg
                ? activityImg[locale]
                : 'https://yaame-static.yaame.io/admin/efefb292b7b07ee293ff1b099fa75ccc.png'
                " alt=""
            />
        </div>
        <!-- 上部分排名 -->
        <div class="top-ranking">
            <!-- 切换按钮 -->
            <div class="tab">
                <div v-for="(item, index) in topRanking" :key="index"
                     :class="['tab-top', topTab === item.type && 'tab-top-img']" ref="tabTop"
                     @click="cueTopTab(item.type, index)"
                >
                    {{ item.name }}
                </div>
            </div>
            <!-- 游戏排名 -->
            <div v-show="topTab === 'GameRanking'" class="game">
                <!-- 奖台 -->
                <div class="game-img"></div>
                <!-- 前三名排名 -->
                <div v-for="(item, index) in 3" :key="index" :class="[`sharp${index}`, 'sharp']">
                    <div v-if="sharpRanking[index]" class="sharp-img">
                        <img :src="sharpRanking[index].subject_icon" alt=""/>
                    </div>
                    <div v-else class="sharp-img">
                        <img src="https://yaame-static.yaame.io/admin/cf9efff9535bb9b493c9c4879b0f2994.png" alt=""/>
                    </div>
                    <div v-if="sharpRanking[index]" class="sharp-name no-wrap">
                        {{ sharpRanking[index].subject_name }}
                    </div>
                    <div v-if="sharpRanking[index]" class="sharp-diamond">
                        <img src="https://yaame-static.yaame.io/admin/a6365534fe80ca135be857d52b29408c.png" alt=""/>
                        <span>{{ sharpRanking[index].subject_score }}</span>
                    </div>
                    <div v-else class="sharp-diamond">
                        <img src="https://yaame-static.yaame.io/admin/a6365534fe80ca135be857d52b29408c.png" alt=""/>
                        <span>0</span>
                    </div>
                </div>
                <!-- 低于前三名 -->
                <div v-if="sharpRanking.length" class="low-list">
                    <!-- 循环每一条数据 -->
                    <div v-for="(item, index) in 7" :key="index" class="low-list-user">
                        <span v-if="lowRanking[index]" class="low-list-ranking">{{
                                lowRanking[index].subject_rank
                            }}</span>
                        <span v-else class="low-list-ranking">{{ index + 4 }}</span>
                        <div class="low-list-img">
                            <img v-if="lowRanking[index]" :src="lowRanking[index].subject_icon" alt=""/>
                            <img v-else src="https://yaame-static.yaame.io/admin/cf9efff9535bb9b493c9c4879b0f2994.png" alt=""/>
                        </div>
                        <div v-if="lowRanking[index]" class="low-list-name">{{ lowRanking[index].subject_name }}</div>
                        <div class="low-list-diamond">
                            <img src="https://yaame-static.yaame.io/admin/a6365534fe80ca135be857d52b29408c.png" alt=""/>
                            <span v-if="lowRanking[index]">{{ lowRanking[index].subject_score }}</span>
                            <span v-else>0</span>
                        </div>
                    </div>
                </div>
                <div v-else class="low-list">
                    <div class="not">
                        <img src="https://yaame-static.yaame.io/admin/b58ab45c8f9366c9af0d836f67f56f4b.png"  alt=""/>
                        <span>{{ $t('noRanking') }}</span>
                    </div>
                </div>
            </div>
            <!-- 奖励 -->
            <div v-show="topTab === 'Reward'" class="top-reward">
                <!-- 循环四条数据 -->
                <div v-for="(item, index) in 4" :key="index" :class="[`reward-list${index}`, 'reward-list']">
                    <!-- Top -->
                    <div v-show="item === 4" class="top-several">
                        TOP {{ item + "~10" }}
                    </div>
                    <div v-show="item !== 4" class="top-several">TOP {{ item }}</div>
                    <!-- TOP1 -->
                    <div v-show="item === 1" class="top-award">
                        <div v-for="(item, index) in awardImg1" :key="index" class="award">
                            <div class="award-img">
                                <img :src="item.img" alt=""/>
                            </div>
                            <span v-show="index === 3">20000</span>
                            <span v-show="index !== 3">{{ $t("totalDays") }}</span>
                        </div>
                    </div>
                    <!-- TOP2 -->
                    <div v-show="item === 2" class="top-award">
                        <div v-for="(item, index) in awardImg2" :key="index" class="award">
                            <div class="award-img">
                                <img :src="item.img" alt=""/>
                            </div>
                            <span v-show="index === 2">15000</span>
                            <span v-show="index !== 2">{{ $t("totalDays") }}</span>
                        </div>
                    </div>
                    <!-- TOP3 -->
                    <div v-show="item === 3" class="top-award">
                        <div v-for="(item, index) in awardImg3" :key="index" class="award">
                            <div class="award-img">
                                <img :src="item.img" alt=""/>
                            </div>
                            <span v-show="index === 1">12000</span>
                            <span v-show="index !== 1">{{ $t("totalDays") }}</span>
                        </div>
                    </div>
                    <!-- TOP4-10 -->
                    <div v-if="item === 4" class="top-award">
                        <div v-for="(item, index) in awardImg4" :key="index" class="award">
                            <div class="award-img">
                                <img :src="item.img" alt=""/>
                            </div>
                            <span v-if="index === 0">2000</span>
                            <span v-else>{{ $t("totalDays") }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 下部分排名 -->
        <div class="Bottom-ranking">
            <!-- 切换按钮 -->
            <div class="tab">
                <div v-for="(item, index) in bottomRanking" :key="index" :class="[
                    'tab-top',
                    bottomTab === item.type && 'tab-top-img',
                ]" @click="cueBottomTab(item.type, index)"
                >
                    {{ item.name }}
                </div>
            </div>
            <!-- 点击排名 -->
            <div v-show="bottomTab === 'HitRanking'" class="hit">
                <div v-for="(item, index) in foodList" :key="index"
                     :class="item.top_user_name ? 'food-hit' : 'food-no'"
                >
                    <div class="min-food">
                        <img :src="item.option_icon" alt=""/>
                    </div>
                    <div class="food-user">
                        <img :class="item.top_user_avatar
                            ? 'food-user-img'
                            : 'food-user-no'
                            " :src="item.top_user_avatar
        ? item.top_user_avatar
        : 'https://yaame-static.yaame.io/admin/5b3ac144a3415c9f3889c0d0f2d26c6c.png'
        " alt=""
                        />
                    </div>
                    <div class="food-user-name no-wrap">
                        {{ item.top_user_name }}
                    </div>
                    <div class="food-user-diamond">
                        <img src="https://yaame-static.yaame.io/admin/a6365534fe80ca135be857d52b29408c.png" alt=""/>
                        <span>{{ item.win_diamond_amount }}</span>
                    </div>
                </div>
            </div>
            <!-- 奖励 -->
            <div v-show="bottomTab === 'Reward'" class="bottom-reward">
                <div class="top-reward-food">
                    <div v-for="(item, index) in vegetable" :key="index" class="list-reward">
                        <div class="min-food">
                            <img :src="item.vegetableImg" alt=""/>
                        </div>
                        <span class="list-reward-span">Top1</span>
                        <div class="reward-tow">
                            <div v-for="(item, index) in item.img" :key="index" class="reward">
                                <div class="reward-img">
                                    <img :src="item" alt=""/>
                                </div>
                                <span v-show="index === 'award'">{{
                                        $t("totalDays")
                                    }}</span>
                                <span v-show="index === 'diamond'">{{ $t('GiftKey') }}
                                    <img src="https://yaame-static.yaame.io/admin/a6365534fe80ca135be857d52b29408c.png"
                                         alt=""
                                    />888</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bottom-reward-food">
                    <div v-for="(item, index) in meat" :key="index" class="list-reward">
                        <div class="min-food">
                            <img :src="item.meatImg" alt=""/>
                        </div>
                        <span class="list-reward-span">Top1</span>
                        <div class="reward-tow">
                            <div v-for="(item, index) in item.img" :key="index" class="reward">
                                <img :src="item" alt=""/>
                                <span v-show="index === 'award'">{{
                                        $t("totalDays")
                                    }}</span>
                                <span v-show="index === 'diamond'">{{ $t('GiftKey') }}
                                    <img src="https://yaame-static.yaame.io/admin/a6365534fe80ca135be857d52b29408c.png"
                                         alt=""
                                    />888</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 用户信息 -->
        <div class="user-info">
            <!-- 头像部分 -->
            <div class="user-list">
                <div class="user-list-img"><img :src="myIconImg" alt=""/></div>
                <img class="diamond" src="https://yaame-static.yaame.io/admin/389d6049f3a773afaca6c2500fa6bdf8.png"
                     alt=""
                />
                <div class="user-diamond">{{ myDiamond }}</div>
                <span class="user-name" @click="getRankingMy">{{ $t('more') }}></span>
            </div>
            <!-- 排名部分 -->
            <div class="user-ranking">
                {{ myRank > 99 ? 99 + "+" : myRank }}
            </div>
        </div>
        <!-- 我的排行榜 -->
        <popup v-show="show">
            <div class="my-ranking">
                <div class="my-img">
                    <img :src="myIcon" alt=""/>
                </div>
                <div class="my-user-list">
                    <div v-for="(item, index) in ranking" :key="index" class="my-list">
                        <div class="low-list-img">
                            <img :src="item.option_icon" alt=""/>
                        </div>
                        <div class="low-list-diamond">
                            <img src="https://yaame-static.yaame.io/admin/a6365534fe80ca135be857d52b29408c.png" alt=""/>
                            <span>{{ item.win_diamond_amount }}</span>
                        </div>
                        <div class="my-list-ranking">
                            {{ item.rank > 99 ? 99 + "+" : item.rank }}
                        </div>
                    </div>
                </div>
                <div class="close-button" @click="show = !show"></div>
            </div>
        </popup>
    </div>
</template>

<script>
    import { onMounted, ref, getCurrentInstance, nextTick } from "vue";
    import customHeader from "@/components/common/header.vue";
    import { getGreedyKingHome, getGreedyKingMy } from "@/lib/request/activity";
    import popup from "@/components/common/pop_up.vue";
    import { getLanguage } from "@/lib/device";

    export default {
        components: {
            customHeader,
            popup,
        },
        setup() {
            // 获取国家
            let locale = getLanguage() || "en";
            // 获取国际化函数
            const root = getCurrentInstance();
            const t = (val) => {
                return root.proxy.$i18n.t(val);
            };
            // logo图片
            const logoImg = ref({
                "ar": "https://yaame-static.yaame.io/admin/b2cb30d43851ee36cd13361a43036cf2.png",
                "en": "https://yaame-static.yaame.io/admin/b2cb30d43851ee36cd13361a43036cf2.png",
                "id": "https://yaame-static.yaame.io/admin/b2cb30d43851ee36cd13361a43036cf2.png",
                "zh-cn":
                    "https://yaame-static.yaame.io/admin/9cdca887f5c17bd4705284214c244691.png",
                "zh-tw":
                    "https://yaame-static.yaame.io/admin/9cdca887f5c17bd4705284214c244691.png",
            });
            // 活动结束图片
            const activityImg = ref({
                "ar": "https://yaame-static.yaame.io/admin/0b1d94ae5600a294129e116b3c295f00.png",
                "en": "https://yaame-static.yaame.io/admin/facc084449bac9fa4622b782e205eb6c.png",
                "id": "https://yaame-static.yaame.io/admin/a6d5a9ddf240c07bc77feda7abefee0f.png",
                "zh-cn":
                    "https://yaame-static.yaame.io/admin/4a9e62976fc3cd8ddfd884d2c1bbf616.png",
                "zh-tw":
                    "https://yaame-static.yaame.io/admin/f2503e90c64c51cbf7654462a300036c.png",
            });
            // 定时器声明
            const time = ref(null);
            // 页面四种奖励图片存放
            const awardImg1 = ref([
                {
                    // 座驾
                    id: 3,
                    img: "https://yaame-static.yaame.io/admin/37aafd602e3265bd3ecfc082d8cece1c.png",
                },
                {
                    // 气泡
                    id: 2,
                    img: "https://yaame-static.yaame.io/admin/502f253810bdde4cee7c426f3ffed801.png",
                },
                {
                    // 头像
                    id: 1,
                    img: "https://yaame-static.yaame.io/admin/aa6f4ea547e780f716b06ee7a7283b2d.png",
                },
                {
                    // 铃铛
                    id: 4,
                    img: "https://yaame-static.yaame.io/admin/b68a3c52bf8d99da9d618718e36b9966.png",
                },
            ]);
            const awardImg2 = ref([
                {
                    // 气泡
                    id: 2,
                    img: "https://yaame-static.yaame.io/admin/502f253810bdde4cee7c426f3ffed801.png",
                },
                {
                    // 头像
                    id: 1,
                    img: "https://yaame-static.yaame.io/admin/aa6f4ea547e780f716b06ee7a7283b2d.png",
                },
                {
                    // 铃铛
                    id: 4,
                    img: "https://yaame-static.yaame.io/admin/b68a3c52bf8d99da9d618718e36b9966.png",
                },
            ]);
            const awardImg3 = ref([
                {
                    // 头像
                    id: 1,
                    img: "https://yaame-static.yaame.io/admin/aa6f4ea547e780f716b06ee7a7283b2d.png",
                },
                {
                    // 铃铛
                    id: 4,
                    img: "https://yaame-static.yaame.io/admin/b68a3c52bf8d99da9d618718e36b9966.png",
                },
            ]);
            const awardImg4 = ref([
                {
                    // 铃铛
                    id: 4,
                    img: "https://yaame-static.yaame.io/admin/b68a3c52bf8d99da9d618718e36b9966.png",
                },
            ]);
            // 蔬菜数据
            const vegetable = ref([
                {
                    // 蔬菜
                    id: 1,
                    vegetableImg: "https://yaame-static.yaame.io/admin/3bf1e62fa9ea3cb0f5f5d43b33aa3f03.png",
                    img: {
                        award: "https://yaame-static.yaame.io/admin/357d1afed18df4b46ad2aa618293037e.png",
                        diamond: "https://yaame-static.yaame.io/admin/f21505daf5289ad62cae4747cfa90a9a.png",
                    },
                },
                {
                    // 蔬菜
                    id: 2,
                    vegetableImg:
                        "https://yaame-static.yaame.io/admin/9fe63b0cd71a17954d5ba45bc3e4e7c2.png",
                    img: {
                        award: "https://yaame-static.yaame.io/admin/22475a8a38fe77baa26acc8d495efaa6.png",
                        diamond: "https://yaame-static.yaame.io/admin/f21505daf5289ad62cae4747cfa90a9a.png",
                    },
                },
                {
                    // 蔬菜
                    id: 3,
                    vegetableImg:
                        "https://yaame-static.yaame.io/admin/d2a6d18cfc761493772be06753335665.png",
                    img: {
                        award: "https://yaame-static.yaame.io/admin/03bb95ea7e5553415de5ab38f03cae69.png",
                        diamond: "https://yaame-static.yaame.io/admin/f21505daf5289ad62cae4747cfa90a9a.png",
                    },
                },
                {
                    // 蔬菜
                    id: 4,
                    vegetableImg:
                        "https://yaame-static.yaame.io/admin/7741c2930010e140668f1039c3d561a6.png",
                    img: {
                        award: "https://yaame-static.yaame.io/admin/56424d1b81c4ecf42dd1688061174e4a.png",
                        diamond: "https://yaame-static.yaame.io/admin/f21505daf5289ad62cae4747cfa90a9a.png",
                    },
                },
            ]);
            // 肉类数据
            const meat = ref([
                {
                    id: 1,
                    meatImg:
                        "https://yaame-static.yaame.io/admin/053abc7e6d604a800b9e375cbc2f378b.png",
                    img: {
                        award: "https://yaame-static.yaame.io/admin/e409711278938334d9d435d550f59c2a.png",
                        diamond: "https://yaame-static.yaame.io/admin/a82990f5c35935cd74eaa9b7c79bd564.png",
                    },
                },
                {
                    id: 2,
                    meatImg:
                        "https://yaame-static.yaame.io/admin/0607e147677db61ca4b8bcc4af43e274.png",
                    img: {
                        award: "https://yaame-static.yaame.io/admin/354d91a0ec764137ad8c44ceedb6d7be.png",
                        diamond: "https://yaame-static.yaame.io/admin/a82990f5c35935cd74eaa9b7c79bd564.png",
                    },
                },
                {
                    id: 3,
                    meatImg:
                        "https://yaame-static.yaame.io/admin/43cb2137bc7f31b42685bc0bd55b2098.png",
                    img: {
                        award: "https://yaame-static.yaame.io/admin/24deab429111dda7fe180ed71c1f76d6.png",
                        diamond: "https://yaame-static.yaame.io/admin/a82990f5c35935cd74eaa9b7c79bd564.png",
                    },
                },
                {
                    id: 4,
                    meatImg:
                        "https://yaame-static.yaame.io/admin/bf96658644614a2b7b6493ce86dc18eb.png",
                    img: {
                        award: "https://yaame-static.yaame.io/admin/50dc40b0c9628e26e2cbc71ff1446122.png",
                        diamond: "https://yaame-static.yaame.io/admin/a82990f5c35935cd74eaa9b7c79bd564.png",
                    },
                },
            ]);
            // 控制上部分排名tab
            let topTab = ref("GameRanking");
            const topRanking = ref([
                {
                    name: t("overallRanking"),
                    type: "GameRanking",
                },
                {
                    name: t("rewards"),
                    type: "Reward",
                },
            ]);
            // 切换上部分tab方法
            const cueTopTab = (key, index) => {
                topTab.value = key;
                if (index === 0) getRankingHome(index);
                clearInterval(time.value);
            };
            // 控制下部分排名tab
            let bottomTab = ref("HitRanking");
            const bottomRanking = ref([
                {
                    name: t("hitRanking"),
                    type: "HitRanking",
                },
                {
                    name: t("rewards"),
                    type: "Reward",
                },
            ]);
            // 切换下部分tab方法
            const cueBottomTab = (key, index) => {
                bottomTab.value = key;
                if (index === 0) getRankingHome(index);
                clearInterval(time.value);
            };

            // 首页排行榜数据，前三名和后面
            let sharpRanking = ref([]);
            let lowRanking = ref([]);
            // 首页用户自己数据排行
            let myIconImg = ref("");
            let myDiamond = ref("");
            let myRank = ref(null);
            // 首页食物数据
            let foodList = ref([]);
            // 活动时间
            let status = ref(null);
            // 我的排行榜总数据
            let sumUp = ref({
                "option_icon": "https://yaame-static.yaame.io/admin/280f00568f55a4aaa30508915d1d14c2.png",
                "win_diamond_amount": "",
                "rank": 0,
            });
            const getRankingHome = async (index) => {
                try {
                    const res = await getGreedyKingHome();
                    if (res.status !== 1000) return;
                    // 用户头像
                    myIconImg.value = res.data.game_ranking.my_rank.subject_icon;
                    // 钻石数
                    myDiamond.value =
                        res.data.game_ranking.my_rank.subject_score - 0;
                    sumUp.value.win_diamond_amount = myDiamond.value;
                    // 排名
                    myRank.value = res.data.game_ranking.my_rank.subject_rank;
                    sumUp.value.rank = myRank.value ? myRank.value : 100;
                    if(typeof myRank.value !== "number") myRank.value = 100;
                    // 分开前三名和后三名
                    if (res.data.game_ranking.content) {
                        sharpRanking.value = res.data.game_ranking.content.filter(
                            (item) => item.subject_rank <= 3
                        );
                        lowRanking.value = res.data.game_ranking.content.filter(
                            (item) => item.subject_rank > 3
                        );
                    }
                    // 首页食物数据
                    foodList.value = res.data.option_top_infos;
                    // 活动时间
                    status.value = res.data.status;
                    // 切换tab
                    time.value = setInterval(() => {
                        // 上部分tab自动切换
                        if (topTab.value === "GameRanking") {
                            topTab.value = "Reward";
                        } else {
                            topTab.value = "GameRanking";
                        }
                        // 下部分tab自动切换
                        if (bottomTab.value === "HitRanking") {
                            bottomTab.value = "Reward";
                        } else {
                            bottomTab.value = "HitRanking";
                        }
                    }, 10000);
                    if (index === undefined) {
                        // 判断榜单有无数据
                        if (sharpRanking.value.length === 0) {
                            topTab.value = "Reward";
                            clearInterval(time.value);
                        }

                        // 判断榜单有无数据
                        let i = 0;
                        for (const resKey in foodList.value) {
                            if (!foodList.value[resKey].win_diamond_amount) i++;
                            if (i === 8) {
                                bottomTab.value = "Reward";
                                clearInterval(time.value);
                            }
                        }
                    }
                    // 判断是不是切换tab的请求
                    if (index === 0) clearInterval(time.value);
                } catch (error) {
                    console.log(error);
                }
            };
            console.log(myDiamond.value);
            // 我的排名
            let myIcon = ref("");
            let ranking = ref([]);
            let show = ref(false);
            const getRankingMy = async () => {
                try {
                    show.value = true;
                    const res = await getGreedyKingMy();
                    if (res.status !== 1000) return;
                    ranking.value = res.data.rank_items;
                    ranking.value.unshift(sumUp.value);
                    myIcon.value = res.data.avatar;
                    console.log(ranking.value);
                } catch (error) {
                    console.log(error);
                }
            };

            onMounted(() => {
                // 背景颜色
                document.body.style.backgroundColor = "#FFFCDE";
                // 调取数据
                getRankingHome();
            });
            return {
                topRanking,
                topTab,
                bottomTab,
                bottomRanking,
                sharpRanking,
                lowRanking,
                show,
                myIcon,
                ranking,
                myIconImg,
                myDiamond,
                myRank,
                foodList,
                awardImg1,
                awardImg2,
                awardImg3,
                awardImg4,
                vegetable,
                meat,
                status,
                activityImg,
                locale,
                logoImg,

                cueTopTab,
                cueBottomTab,
                getRankingMy,
            };
        },
    };
</script>

<style lang="less" scoped>
.main {
    min-height: 100vh;
    background: url("https://yaame-static.yaame.io/admin/64cc234e118d49b22c361e8180dd0b81.png") no-repeat;
    background-size: contain;
    padding-bottom: 1.48rem;
    overflow: hidden;
    .main-header {
        transition: all 1s;
    }
    // 奖励详情样式
    .details {
        position: fixed;
        top: 2.89rem;
        right: 0;
        min-width: 1.35rem;
        height: 0.54rem;
        padding: 0 .1rem;
        font-size: 0.24rem;
        font-weight: 600;
        text-align: center;
        line-height: 0.54rem;
        color: #770604;
        background: url("https://yaame-static.yaame.io/admin/7ee68997bbbee342debd9830bdd32b52.png") no-repeat;
        background-size: 100% 100%;
        z-index: 9;
    }

    .logo-img {
        position: absolute;
        width: 6.07rem;
        height: 1.26rem;
        margin: 0.5rem 0.72rem 0 0.71rem;
    }

    // 活动时间
    .time-img {
        width: 5.68rem;
        height: 1.04rem;
        margin: 6.4rem 0.91rem 0.22rem;

        .activity-img {
            width: 100%;
            height: 100%;
        }
    }

    // 上半部分排名样式
    .top-ranking {
        position: relative;

        .top-reward {
            padding: 0 0.29rem;

            .reward-list {
                position: relative;
                width: 6.4rem;
                height: 2.9rem;
                margin: 0.3rem 0;
                background: url("https://yaame-static.yaame.io/admin/68a163c848ae504a83b49806c6e0c041.png") no-repeat;
                background-size: contain;
                overflow: hidden;

                .top-several {
                    position: absolute;
                    top: 0;
                    left: 2.29rem;
                    width: 1.82rem;
                    height: 0.52rem;
                    text-align: center;
                    font-weight: 600;
                    color: #760e0c;
                    font-size: 0.3rem;
                    background: url("https://yaame-static.yaame.io/admin/e3e69aed4568151fb1e10d4ab49e893c.png") no-repeat;
                    background-size: contain;
                }

                .top-award {
                    display: flex;
                    margin-top: 0.7rem;
                    justify-content: space-around;
                    align-items: center;

                    .award {
                        display: flex;
                        width: 1.35rem;
                        height: 1.94rem;
                        color: #fff;
                        font-size: 0.24rem;
                        box-shadow: 0 0.02rem 0.04rem 0 rgba(238, 179, 61, 0.53);
                        background: url("https://yaame-static.yaame.io/admin/244f8ae62dadd2a12e9b3ac4b4d1e696.png") no-repeat;
                        background-size: contain;
                        align-items: center;
                        flex-wrap: wrap;
                        justify-content: center;
                        border-radius: 0 0 0.2rem 0.2rem;

                        .award-img {
                            display: flex;
                            align-items: center;
                            width: 1.31rem;
                            height: 1.31rem;

                            img {
                                width: 1.31rem;
                                height: auto;
                                border-radius: 0.2rem 0.2rem 0 0;
                            }
                        }

                        span {
                            width: 1.31rem;
                            height: 0.63rem;
                            line-height: 0.63rem;
                            border-radius: 0 0 0.2rem 0.2rem;
                            text-align: center;
                        }
                    }
                }
            }
        }
    }

    .top-ranking,
    .Bottom-ranking {
        // 上下公用tab样式
        width: 7rem;
        height: 14.1rem;
        margin: 0 0.25rem 0.34rem;
        box-shadow: 0 0.04rem 0.04rem 0 #f9e2a0;
        border-radius: 0.2rem;
        border: 0.02rem solid #770402;
        background: url("https://yaame-static.yaame.io/admin/085e299f4fbaed1d761990d1d2ebe139.png") no-repeat #fddc80;
        background-size: contain;

        // tab切换样式
        .tab {
            display: flex;
            width: 5.8rem;
            height: 0.72rem;
            margin: 0.3rem 0.6rem 0;
            padding: 0 0.06rem;
            background: #000000;
            border-radius: 0.34rem;
            background: rgba(0, 0, 0, 0.35);
            align-items: center;
            overflow: hidden;

            .tab-top {
                width: 2.91rem;
                height: 0.64rem;
                font-size: 0.28rem;
                color: #fff;
                line-height: 0.64rem;
                text-align: center;
            }
        }

        // 排名样式
        .game {
            position: relative;
            overflow: hidden;

            .game-img {
                position: absolute;
                top: 0.52rem;
                width: 7rem;
                height: 5.3rem;
                background: url("https://yaame-static.yaame.io/admin/98a5f0baec6d64b5677149c49c4c5e32.png") no-repeat;
                background-size: contain;
            }

            // 前三名公共样式
            .sharp {
                position: absolute;
                width: 2.2rem;
                height: 2.2rem;
                color: #900000;
                font-size: 0.24rem;

                .sharp-img {
                    display: flex;
                    width: 2.2rem;
                    height: 2.2rem;
                    text-align: center;
                    line-height: 2.2rem;
                    justify-content: center;
                    align-items: center;

                    img {
                        width: 1.3rem;
                        height: 1.3rem;
                        border-radius: 50%;
                    }
                }

                .sharp-name {
                    position: absolute;
                    top: 2.06rem;
                    left: 50%;
                    width: 1.25rem;
                    height: 0.24rem;
                    line-height: 0.24rem;
                    transform: translateX(-50%);
                    text-align: center;
                }

                .sharp-diamond {
                    position: absolute;
                    top: 2.38rem;
                    left: 50%;
                    transform: translateX(-50%);
                    height: 0.24rem;
                    line-height: 0.24rem;

                    img {
                        width: 0.24rem;
                        height: 0.21rem;
                    }
                }
            }

            .sharp0 {
                top: 0.14rem;
                left: 2.3rem;
                background: url("https://yaame-static.yaame.io/admin/250b12ac472e7cb1f9bd0a1ce6224c91.png") no-repeat;
                background-size: contain;
            }

            .sharp1 {
                top: 0.78rem;
                left: 0.11rem;
                background: url("https://yaame-static.yaame.io/admin/900256ba665ad7763c6351eb09b196d5.png") no-repeat;
                background-size: contain;
            }

            .sharp2 {
                top: 0.78rem;
                right: 0.17rem;
                background: url("https://yaame-static.yaame.io/admin/f0a46fa6874c2eff57709b10209ccddb.png") no-repeat;
                background-size: contain;
            }

            // 小于前三名排名样式
            .low-list {
                position: relative;
                width: 6.4rem;
                height: 7.68rem;
                margin: 5.1rem 0.3rem 0;
                padding: 0 0.26rem 0 .13rem;
                background: #f5be51;
                box-shadow: inset 0 0 0.05rem 0 #ffffff;
                border-radius: 0.2rem;
                border: 0.02rem solid #ffffff;
                color: #fff;
                font-size: 0.24rem;

                // 缺省图
                .not {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    transform: translate(-50%,-50%);
                    img {
                        width: .84rem;
                        height: .82rem;
                        margin-bottom: .19rem;
                    }
                    span {
                        height: .3rem;
                        font-size: .24rem;
                        color: #fff;
                    }
                }
                .low-list-user {
                    width: 5.88rem;
                    height: 0.8rem;
                    margin: 0.26rem 0;
                    line-height: 0.8rem;

                    .low-list-ranking {
                        float: left;
                        width: .45rem;
                        text-align: center;
                    }

                    .low-list-img {
                        float: left;
                        width: 0.7rem;
                        height: 0.7rem;
                        margin: 0 0.13rem 0 0.13rem;
                        background: #fdca67;
                        border: 0.02rem solid #ffffff;
                        border-radius: 50%;
                        overflow: hidden;

                        img {
                            width: 0.68rem;
                            height: 0.68rem;
                        }
                    }

                    .low-list-name {
                        float: left;
                    }

                    .low-list-diamond {
                        float: right;
                        display: flex;
                        align-items: center;

                        img {
                            width: 0.23rem;
                            height: 0.2rem;
                            margin-right: .1rem;
                        }
                    }
                }
            }
        }
    }

    // 下半部分排名样式
    .Bottom-ranking {
        width: 7rem;
        height: 7.88rem;
        box-shadow: 0 0.03rem 0.04rem 0 #feeab2;
        border-radius: 0.2rem;
        border: 0.02rem solid #770402;

        .hit {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;

            .food-hit {
                position: relative;
                float: left;
                width: 1.54rem;
                height: 2.2rem;
                margin-top: 0.92rem;
                color: #fff;
                font-size: 0.24rem;
                background: url("https://yaame-static.yaame.io/admin/530fd0537206cedd52aff046b111e466.png") no-repeat;
                background-size: contain;

                .min-food {
                    position: absolute;
                    display: flex;
                    top: -0.32rem;
                    left: 0.45rem;
                    width: 0.64rem;
                    height: 0.64rem;
                    background: url("https://yaame-static.yaame.io/admin/8e8354dfd57dbc23c6f112c89ff9f6af.png") no-repeat;
                    background-size: contain;
                    justify-content: center;
                    align-items: center;

                    img {
                        width: 0.5rem;
                        height: 0.5rem;
                    }
                }

                .food-user {
                    position: absolute;
                    display: flex;
                    left: 0.39rem;
                    top: 0.4rem;
                    width: 0.78rem;
                    height: 0.78rem;
                    background: url("https://yaame-static.yaame.io/admin/608ae6275339a404324ca35ec782b086.png") no-repeat;
                    background-size: contain;
                    justify-content: center;
                    align-content: center;
                    border-radius: 50%;
                    overflow: hidden;

                    .food-user-img {
                        width: 100%;
                        height: 100%;
                    }

                    .food-user-no {
                        width: 0.42rem;
                        height: 0.42rem;
                    }
                }

                .food-user-name {
                    position: absolute;
                    top: 1.3rem;
                    left: 50%;
                    width: 1.25rem;
                    text-align: center;
                    transform: translateX(-50%);
                }

                .food-user-diamond {
                    position: absolute;
                    bottom: 0.2rem;
                    left: 50%;
                    height: 0.24rem;
                    line-height: 0.24rem;
                    transform: translateX(-50%);
                    white-space: nowrap;

                    img {
                        width: 0.22rem;
                        height: 0.2rem;
                    }
                }
            }

            .food-no {
                position: relative;
                float: left;
                width: 1.54rem;
                height: 2.2rem;
                margin-top: 0.92rem;
                color: #fff;
                font-size: 0.24rem;
                background: url("https://yaame-static.yaame.io/admin/530fd0537206cedd52aff046b111e466.png") no-repeat;
                background-size: contain;

                .min-food {
                    position: absolute;
                    display: flex;
                    top: -0.32rem;
                    left: 0.45rem;
                    width: 0.64rem;
                    height: 0.64rem;
                    background: url("https://yaame-static.yaame.io/admin/8e8354dfd57dbc23c6f112c89ff9f6af.png") no-repeat;
                    background-size: contain;
                    justify-content: center;
                    align-items: center;

                    img {
                        width: 0.5rem;
                        height: 0.5rem;
                    }
                }

                .food-user {
                    position: absolute;
                    display: flex;
                    left: 0.39rem;
                    top: 0.59rem;
                    width: 0.78rem;
                    height: 0.78rem;
                    background: url("https://yaame-static.yaame.io/admin/608ae6275339a404324ca35ec782b086.png") no-repeat;
                    background-size: contain;
                    justify-content: center;
                    align-content: center;
                    border-radius: 50%;
                    overflow: hidden;
                    align-items: center;

                    .food-user-img {
                        width: 100%;
                        height: 100%;
                    }

                    .food-user-no {
                        width: 0.42rem;
                        height: 0.42rem;
                    }
                }

                .food-user-name {
                    position: absolute;
                    top: 1.3rem;
                    left: 50%;
                    transform: translateX(-50%);
                }

                .food-user-diamond {
                    position: absolute;
                    bottom: 0.32rem;
                    left: 50%;
                    height: 0.24rem;
                    line-height: 0.24rem;
                    transform: translateX(-50%);

                    img {
                        width: 0.22rem;
                        height: 0.2rem;
                    }
                }
            }
        }

        .bottom-reward {
            width: 99%;
            margin: auto;
            overflow-x: auto;

            .top-reward-food,
            .bottom-reward-food {
                position: relative;
                width: 16.56rem;

                .min-food {
                    display: flex;
                    position: absolute;
                    top: -0.34rem;
                    left: 1.56rem;
                    width: 0.64rem;
                    height: 0.64rem;
                    background: #ffe779;
                    border-radius: 0.16rem;
                    border: 0.01rem solid #ffffff;
                    justify-content: center;
                    align-items: center;

                    img {
                        width: 0.52rem;
                        height: 0.5rem;
                    }
                }
            }

            .list-reward {
                position: relative;
                float: left;
                width: 3.84rem;
                height: 2.67rem;
                margin-left: 0.3rem;
                margin-top: 0.52rem;
                font-size: 0.24rem;
                color: #fff;
                background: url("https://yaame-static.yaame.io/admin/99d2e5cbe58bc935698a97ca7fe685a7.png") no-repeat;
                background-size: contain;

                .list-reward-span {
                    position: absolute;
                    top: 0.42rem;
                    left: 50%;
                    height: 0.27rem;
                    color: #760e0c;
                    transform: translateX(-50%);
                }

                .reward-tow {
                    display: flex;
                    height: 2.37rem;
                    align-items: flex-end;
                    justify-content: space-around;

                    .reward {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        width: 1.43rem;
                        height: 1.68rem;
                        background: url("https://yaame-static.yaame.io/admin/69cc452b58283eb08dcfef654d2dc52c.png") no-repeat;
                        background-size: contain;

                        .reward-img {
                            width: 1.4rem;
                            height: 1.4rem;
                        }

                        img {
                            width: 1.4rem;
                            height: auto;
                        }

                        span {
                            height: 0.24rem;
                            line-height: 0.24rem;
                            white-space: nowrap;

                            img {
                                width: 0.24rem;
                                height: 0.2rem;
                            }
                        }
                    }
                }
            }
        }
    }

    // 公共tab切换图片
    .tab-top-img {
        background: url("https://yaame-static.yaame.io/admin/f66afab59ebee12b6f48d9d05864e105.png") no-repeat;
        background-size: contain;
    }

    // 用户信息样式
    .user-info {
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 1.14rem;
        background: #f5be53;
        border-radius: 0.2rem 0.2rem 0 0;
        border: 0.01rem solid #ffffff;
        color: #fff;

        .user-list {
            position: relative;
            float: left;

            .diamond {
                position: absolute;
                top: 0.21rem;
                left: 1.48rem;
                width: 0.39rem;
                height: 0.33rem;
            }

            .user-list-img {
                position: absolute;
                top: 0.17rem;
                left: 0.48rem;
                width: 0.8rem;
                height: 0.8rem;
                background: #ffe7a4;
                border-radius: 50%;
                border: 0.02rem solid #ffffff;
                overflow: hidden;

                img {
                    width: 100%;
                    height: 100%;
                }
            }

            .user-diamond {
                position: absolute;
                top: 0.17rem;
                left: 1.88rem;
                height: 0.33rem;
                font-size: 0.36rem;
                line-height: 0.33rem;
            }

            .user-name {
                position: absolute;
                top: 0.7rem;
                left: 1.48rem;
                min-width: 0.8rem;
                height: 0.24rem;
                line-height: 0.24rem;
                font-size: 0.24rem;
            }

        }

        .user-ranking {
            float: right;
            width: 0.72rem;
            height: 0.34rem;
            margin: 0.38rem 0.76rem 0 0;
            line-height: 0.34rem;
            font-size: 0.34rem;
        }
    }

    // 我的排名样式
    .my-ranking {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 5.62rem;
        height: 9.39rem;
        background: url("https://yaame-static.yaame.io/admin/e918e2ea3be1a60dfeb732d06a46d0e8.png") no-repeat;
        background-size: contain;
        transform: translate(-50%, -50%);

        .my-img {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 1.2rem;
            height: 1.2rem;
            margin: 0.32rem 2.21rem 0;
            background: url("https://yaame-static.yaame.io/admin/3ebbf920e1606c1f90257e2289b27d0b.png") no-repeat;
            background-size: contain;

            img {
                width: 1rem;
                height: 1rem;
                border-radius: 50%;
            }
        }

        .my-user-list {
            height: 7.28rem;
            overflow-x: auto;

            .my-list {
                width: 4.7rem;
                height: 0.8rem;
                margin: 0 0.46rem 0.28rem;
                line-height: 0.8rem;
                font-size: 0.24rem;
                color: #fff;

                .low-list-img {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    float: left;
                    width: 0.8rem;
                    height: 0.8rem;
                    margin-right: 0.28rem;
                    background: #fdca67;
                    border: 0.02rem solid #ffffff;
                    border-radius: 50%;

                    img {
                        width: 0.68rem;
                        height: 0.68rem;
                    }
                }

                .low-list-diamond {
                    float: left;
                    display: flex;
                    align-items: center;

                    img {
                        width: 0.23rem;
                        height: 0.2rem;
                    }
                }

                .my-list-ranking {
                    float: right;
                    width: 0.69rem;
                    height: 0.24rem;
                    line-height: 0.24rem;
                    margin-top: 0.28rem;
                    text-align: center;
                }
            }
        }
    }

    // 关闭按钮样式
    .close-button {
        width: 0.57rem;
        height: 0.57rem;
        margin: 1.35rem 0 0 2.5rem;
        background: url("https://yaame-static.yaame.io/admin/d7c66e64039483b5a4c1d636848e209c.png") no-repeat;
        background-size: contain;
    }
}
</style>
