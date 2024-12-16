<template>
    <div v-if="!ruleStatus" class="main">
        <!--返回栏-->
        <custom-header color="white">{{
            $t("thanksgiving_season")
        }}</custom-header>
        <!--规则-->
        <div class="rule" @click="ruleStatus = true">{{ $t("rule") }}</div>
        <div class="thankful" @click="thankfulFun">
            {{ $t("thanksgiving_wall") }}
        </div>
        <!-- 飘屏 -->
        <floating :floatingList="jackpotData.floating" />

        <div class="txt">{{ regionTime[region] }}</div>
        <div
            class="page-bg"
            :style="{ backgroundImage: `url(${logoImg[language]})` }"
        ></div>
        <!-- 添加tab吸顶 -->
        <top-tab original-top="6.42" :openTop="openTop">
            <div class="tabs" :class="{ 'tabs-sty': styleStatus }">
                <div
                    :class="tabsType == 0 ? 'tabs-a' : 'tabs-d'"
                    @click="changeTab(0)"
                >
                    {{ $t("daily_pool") }}
                </div>
                <div
                    :class="tabsType == 1 ? 'tabs-a' : 'tabs-d'"
                    @click="changeTab(1)"
                >
                    {{ $t("discount_shop") }}
                </div>
            </div>
        </top-tab>
        <div class="jackpot-box" v-show="tabsType == 0">
            <Jackpot
                :jackpotInfo="jackpotInfo"
                :jackpotData="jackpotData.jackpot"
            />
            <ranking
                ref="ranking"
                :jackpotData="jackpotData.rank"
                :rankingFun="rankingFun"
            />
        </div>
        <div v-show="tabsType == 1">
            <!-- 商店 -->
            <Shop ref="shopNode" :countdown="jackpotData.jackpot.countdown" />
        </div>

        <!-- 感恩墙 -->
        <thanks-wall
            v-show="thankful"
            :thankfulStatus="thankful"
            @call-parent-method="thankfulFalse"
        />
        <pageLoading class="loading" v-show="pageLoadingStatus"></pageLoading>
    </div>
    <rules v-else :reward="jackpotData.reward" :ruleStatus="ruleStatusFun" />
</template>

<script setup>
import { ref, onMounted, reactive, getCurrentInstance, computed, nextTick } from "vue";
import { getLanguage } from "@/lib/device";
import { burialPointFun, getYearMonthDay } from "@/lib/utils";
import { getJackpotInfo } from "./api";
import Jackpot from "./components/jackpot.vue";
import Shop from "./components/shop.vue";
import customHeader from "@/components/common/header";
import Ranking from "@/pages/Thanksgiving/components/ranking.vue";
import ThanksWall from "@/pages/Thanksgiving/components/thanksWall.vue";
import Rules from "@/pages/Thanksgiving/components/rules.vue";
import Floating from "@/pages/Thanksgiving/components/floating.vue";
import Toast from "../../components/third/toast/toast";
import pageLoading from "@/components/common/page_loading.vue";
import TopTab from "@/components/common/topTab.vue";

// 时间列表
const dateList = [
    "11/26",
    "11/27",
    "11/28",
    "11/29",
    "11/30",
    "12/01",
    "12/02",
    "12/03",
];
// 获取国际化函数
const root = getCurrentInstance();
const t = (val, msg) => {
    return root.proxy.$i18n.t(val, msg);
};
// 获取语言
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
// 头部国际化
const logoImg = ref({
    ar: "https://yaame-static.yaame.io/admin/c339ad8301b6b6676bab38b6544f67b2.png",
    en: "https://yaame-static.yaame.io/admin/db01f0a28f377ce716efa75e6ecb9a7c.png",
    id: "https://yaame-static.yaame.io/admin/1c2b44cbf946a14b7fe61e72c1abd51a.png",
    "zh-cn":
        "https://yaame-static.yaame.io/admin/ca425cb57d1dccf5f4f3ae0e97bc04f2.png",
    "zh-tw":
        "https://yaame-static.yaame.io/admin/2a16c51d03e15407297916fc745456c1.png",
});
// 大区活动事件
const regionTime = ref({
    INDONESIA: "11/26 00:00 - 12/3 23:59 (GMT+7)",
    MIDDLE_EAST: "11/26 00:00 - 12/3 23:59 (GMT+3)",
    SOUTHEAST_ASIA: "11/26 00:00 - 12/3 23:59 (GMT+8)",
    PHILIPPINES: "11/26 00:00 - 12/3 23:59 (GMT+8)",
});
// 感恩墙
const thankful = ref(false);
// 规则
const ruleStatus = ref(false);
// 当前大区
const region = ref("");
// tab切换标识
const tabsType = ref(0);
// 首页请求数据存储
const saveSelectDate = ref("");
const pageLoadingStatus = ref(true);
// 商店组件节点
const shopNode = ref();
const jackpotData = reactive({
    jackpot: {
        countdown: 0,
    },
    rank: {},
    reward: {},
    floating: {},
});
// 切换tab方法
const changeTab = (type) => {
    if (type === tabsType.value) return;
    tabsType.value = type;
    if (type === 0) {
        jackpotInfo(saveSelectDate.value);
    } else {
        shopNode.value.handleGetShopGoods();
    }
};
// 数据接口
const jackpotInfo = async (timeStr, callback) => {
    const dateStr = "2024/" + timeStr;
    saveSelectDate.value = timeStr;
    await getJackpotInfo({
        timeStr: dateStr,
    }).then(
        (res) => {
            // console.log("获取首页数据", res);
            if (res.status === 1000) {
                jackpotData.jackpot = {
                    currentTime: res?.data?.time_str || "",
                    countdown: res?.data?.countdown || 0,
                    pool_diamond: res?.data?.pool_diamond || 0,
                    pool_diamond_reward_status:
                        res?.data?.pool_diamond_reward_status,
                    reward_pool_user: res?.data?.reward_pool_user, // [{ diamond: 1000, nickname: "test1" }]
                };
                jackpotData.rank = {
                    my_user_info: res.data.my_user_info || {},
                    rank: res.data.rank || [],
                };
                jackpotData.reward = {
                    rank_reward: res.data.rank_reward,
                    send_gifts: res.data.send_gifts,
                    region: res.data.region,
                };
                jackpotData.floating = {
                    carousels: res.data.carousels,
                };
                region.value = res.data.region;
            } else {
                Toast(res?.desc || "network error!");
            }
            callback && callback();
            // 关闭loading
            if (pageLoadingStatus.value) pageLoadingStatus.value = false;
        },
        (e) => {
            callback && callback();
        }
    );
};
// 关闭弹窗
const thankfulFalse = () => {
    thankful.value = false;
    jackpotData.floating = {};
    jackpotInfo(saveSelectDate.value);
};

// 处理排行榜关注
const rankingFun = () => {
    jackpotData.rank = {};
    jackpotInfo(saveSelectDate.value);
};

// 关闭规则
const ruleStatusFun = () => {
    ruleStatus.value = false;
    nextTick(()=>{
        tabsType.value === 0 ? jackpotInfo(saveSelectDate.value) :shopNode.value.handleGetShopGoods();
})
};

// 控制tab样式显示
const styleStatus = ref(0);
const openTop = (status) => {
    styleStatus.value = status;
};

// 感恩墙上报
const thankfulFun = () => {
    thankful.value = true;
    burialPointFun({
        event_name: "page_btn_click",
        cid: -1000,
        md: 2,
        args_name: "",
        args: {
            type: "Thanksgivingwall_click",
            page_name: "Thanksgiving_event",
        },
    });
};

onMounted(async () => {
    window.onload = function () {
        let now = getYearMonthDay("MM") + "/" + getYearMonthDay("DD");
        if (getYearMonthDay("MM") == 11 && getYearMonthDay("DD") < 26) {
            now = dateList[0];
        }
        const lastDate = dateList[dateList.length - 1].split("/");
        if (
            getYearMonthDay("MM") == 12 &&
            getYearMonthDay("DD") > parseInt(lastDate[1])
        ) {
            now = dateList[dateList.length - 1];
        }
        jackpotInfo(now);
    };
    // 页面浏览埋点
    burialPointFun({
        event_name: "event_page_view",
        cid: -1000,
        md: 1,
        args_name: "",
        args: {
            from: "",
            page_name: "Thanksgiving_event",
        },
    });
});
</script>

<style scoped lang="less">
.main {
    position: relative;
    background-color: #df7304;
    min-height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
    .txt {
        position: absolute;
        top: 1.44rem;
        left: 50%;
        transform: translateX(-50%);
        height: 0.25rem;
        font-weight: 600;
        font-size: 0.18rem;
        color: #c64607;
        line-height: 0.25rem;
        text-align: center;
    }
    .page-bg {
        background-repeat: no-repeat;
        background-size: contain;
        width: 100%;
        height: 7.2rem;
    }
    .tabs {
        width: 7.5rem;
        height: 1.22rem;
        padding: 0 0.64rem;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: bold;
        transition-duration: 0.3s;
        div {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.3rem;
            width: 2.79rem;
            height: 1.03rem;
            padding: 0.2rem 0.1rem 0;
            line-height: 0.28rem;
            text-align: center;
        }
        .tabs-a {
            background: url("https://yaame-static.yaame.io/admin/43ff385d8d384bb925bd6d5289553906.png")
                no-repeat;
            background-size: contain;
            color: #fff;
        }
        .tabs-d {
            background: url("https://yaame-static.yaame.io/admin/9842e2bcbaa8dc2c81c60827453e36b7.png")
                no-repeat;
            background-size: contain;
            color: #8c300c;
        }
    }
    .tabs-sty {
        background: rgba(255, 148, 37, 0.8);
    }

    .jackpot-box {
        margin-top: 0.3rem;
    }

    .rule {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 1.99rem;
        right: 0;
        width: 1.45rem;
        height: 0.55rem;
        padding: 0 0.2rem;
        background: url("https://yaame-static.yaame.io/admin/be2bdb7a9fa2ef18ee49a86cafe05bba.png")
            no-repeat;
        background-size: contain;
        font-weight: 500;
        font-size: 0.2rem;
        color: #ffffff;
    }
    .thankful {
        position: absolute;
        top: 2.82rem;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 1.54rem;
        height: 0.64rem;
        line-height: 0.22rem;
        padding: 0.1rem 0.32rem 0 0.45rem;
        background: url("https://yaame-static.yaame.io/admin/89591a0c02aa7335b4c6a0489f0e9475.png")
            no-repeat;
        background-size: contain;
        font-weight: 500;
        font-size: 0.2rem;
        color: #ffffff;
        text-align: center;
    }
}
</style>

<!-- UA: Mozilla/5.0 (Linux; Android 13; 22041216UC Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/104.0.5112.97 Mobile Safari/537.36 ssy={wlyaame;V1.8.0;default;;WIFI;libertyad;ebrowser;suid=80a9313878ad1084;device_id=d41d8cd98f00b204e9800998ecf8427e;app_key=20001301;ver_code=10800;app_type=yaame;status_bar_h=36;language=in;x_ver_code=10800;uid=9700;region_id=INDONESIA;} -->
