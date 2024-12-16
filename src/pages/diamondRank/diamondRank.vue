<template>
    <div
        :style="{
            backgroundImage: `url(${bg_img})`,
            backgroundColor: theme_color,
            paddingTop: safe_height + 'rem',
        }"
        class="main"
    >
        <Loading v-if="loading"></Loading>

        <!-- <img
			src="../../assets/img/common/icon_back_white.png"
			class="back"
			@click="back"
		/> -->

        <Header :keep="true" :keepColor="false" color="white" :safeHeightShow="is_full_screen"
            ><span>{{ title_name }}</span></Header
        >

        <div class="tab-container">
            <div v-for="(tab, index) in tabList" :key="index" :class="['tab', tabActive === tab && 'active']" @click="clickTab(tab)">
                {{ $t(tab) }}
            </div>
        </div>

        <div class="top-container">
            <div v-for="(item, index) in topList" :key="index" :class="['top', index === 1 && 'big-top']">
                <div class="avatar-container">
                    <img v-if="index === 0" src="https://yaame-static.yaame.io/admin/f313ed7f83d30ba2324cd562daa4de76.png" alt="" />
                    <img v-if="index === 1" src="https://yaame-static.yaame.io/admin/20f23088205bae1284508e89bf98e4c3.png" alt="" />
                    <img v-if="index === 2" src="https://yaame-static.yaame.io/admin/046ec82c80cabf867c63bfaf62d0f921.png" alt="" />
                    <div
                        :style="{
                            backgroundImage: `url(${item.subject_icon})`,
                        }"
                        class="avatar"
                    ></div>
                </div>
                <p v-if="item.subject_id" class="nick-name">{{ item.subject_name }}</p>
                <p v-if="item.subject_id" class="nick-name"><img src="https://yaame-static.yaame.io/admin/c71a2adb26d99bd65a476bffb946244c.png" alt="" />{{ item.income_diamonds }}</p>
            </div>
        </div>

        <div
            v-if="list && list.length"
            :style="{
                backgroundColor: table_color,
            }"
            class="list-container"
            v-infinite-scroll="loadMore"
            :infinite-scroll-immediate-check="true"
            infinite-scroll-disabled="loading"
            infinite-scroll-distance="10"
        >
            <div v-for="(item, index) in list" :key="index" class="list-item">
                <div class="sort">{{ item.subject_rank }}</div>
                <div class="avatar"><img :src="item.subject_icon" alt="" /></div>
                <div class="name">{{ item.subject_name }}</div>
                <div class="num">
                    <img src="https://yaame-static.yaame.io/admin/c71a2adb26d99bd65a476bffb946244c.png" alt="" />
                    {{ item.income_diamonds }}
                </div>
            </div>
        </div>
        <div
            v-else
            :style="{
                backgroundColor: table_color,
            }"
            class="list-container no-data"
        >
            <div class="empty">
                <img :src="define.empty_img_url" alt="" />
            </div>
        </div>
        <div
            :style="{
                backgroundColor: user_frame_color,
            }"
            class="user-info"
        >
            <div class="list-item">
                <div class="sort">{{ userInfo.subject_rank || "99+" }}</div>
                <div class="avatar"><img :src="userInfo.subject_icon" alt="" /></div>
                <div class="name">{{ userInfo.subject_name }}</div>
                <div class="num">
                    <img src="https://yaame-static.yaame.io/admin/c71a2adb26d99bd65a476bffb946244c.png" alt="" />
                    {{ userInfo.income_diamonds || "0" }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, getCurrentInstance } from "vue";
import Loading from "../../components/common/page_loading.vue";
import Header from "../../components/common/header";
import request from "../../lib/request/activity";
import { getQueryString } from "../../lib/utils";
import define from "../../lib/define.js";
import { getSafeHeight } from "@/lib/device";
const setDefaultItem = () => {
    return {
        subject_icon: "https://static.yaame.io/admin/e4a419c9d7d94db41ea41e3f810a3759.png",
        subject_rank: "99+",
        subject_name: "-",
        income_diamonds: "0",
    };
};
export default {
    components: {
        Loading,
        Header,
    },
    setup() {
        const root = getCurrentInstance();
        console.log("==============================");
        console.log(root.proxy.$i18n.t("WEEK"));
        console.log(root.proxy.$i18n.prototype);
        // console.log(t('WEEK'));
        const loading = ref(true);
        const back = () => {
            location.href = "wlyaame://webview/back";
        };

        let safe_area = getSafeHeight() || 0;

        let is_full_screen = !!getQueryString("is_full_screen");
        let safe_height;
        if (is_full_screen) {
            safe_height = (safe_area * 2) / 100;
            safe_height = safe_height + 1;
        } else {
            safe_height = 1.3;
        }
        const tabList = ref(["DAY", "WEEK"]);
        let tabActive = ref("DAY");

        const activityRankType = getQueryString("activityRankType");

        let page = ref(1);
        let has_next = ref(true);
        let bg_img = ref("");
        let frame_color = ref("");
        let table_color = ref("");
        let theme_color = ref("");
        let user_frame_color = ref("");
        let topList = ref([]);
        let list = ref([]);
        let userInfo = ref({});
        let title_name = ref("");
        const getData = async () => {
            try {
                const res = await request.getActivityRank({
                    page: page.value,
                    size: 20,
                    activityRankCycleType: tabActive.value,
                    activityRankType,
                });
                loading.value = false;
                if (res.status === 1000) {
                    bg_img.value = res.data.bg_img;
                    frame_color.value = res.data.frame_color;
                    table_color.value = res.data.table_color;
                    theme_color.value = res.data.theme_color;
                    user_frame_color.value = res.data.user_frame_color;

                    userInfo.value = res.data.my_rank;
                    title_name.value = res.data.title_name;

                    if (page.value === 1) {
                        if (res.data.content.length <= 3) {
                            while (res.data.content.length < 3) {
                                res.data.content.push(setDefaultItem());
                            }
                        }
                        const firstThree = res.data.content.slice(0, 3);
                        const remaining = res.data.content.slice(3);
                        [firstThree[0], firstThree[1]] = [firstThree[1], firstThree[0]];

                        topList.value = firstThree;
                        list.value = remaining;
                    } else {
                        list.value = list.value.concat(res.data.content);
                    }
                    has_next.value = res.data.has_next;

                    document.body.style.backgroundColor = res.data.theme_color;
                }
            } catch (err) {
                console.log(err);
            }
        };

        const clickTab = (tab) => {
            tabActive.value = tab;
            getData();
        };

        const loadMore = () => {
            if (has_next.value) {
                page.value = page.value + 1;
                getData();
            }
        };

        onMounted(() => {
            getData();
        });

        return {
            loading,
            back,

            tabList,
            tabActive,
            clickTab,

            bg_img,
            frame_color,
            table_color,
            theme_color,
            user_frame_color,
            topList,
            list,
            userInfo,

            loadMore,

            define,

            title_name,

            safe_height,

            is_full_screen,
        };
    },
};
</script>
<style lang="less">
.main {
    background-size: 7.5rem auto;
    background-repeat: no-repeat;
    padding-top: 1.47rem;
    position: relative;
    .back {
        position: absolute;
        width: 0.5rem;
        height: auto;
        top: 0.58rem;
        left: 0.3rem;
    }
    .tab-container {
        width: 4.12rem;
        height: 0.68rem;
        border-radius: 0.34rem;
        background-color: rgba(0, 0, 0, 0.35);
        display: flex;
        justify-content: space-between;
        padding: 0.04rem 0.06rem;
        margin-left: 1.68rem;
        .tab {
            width: 2rem;
            height: 0.6rem;
            border-radius: 0.3rem;
            text-align: center;
            line-height: 0.6rem;
            font-size: 0.28rem;
            font-family: HiraginoSansGB-W6, HiraginoSansGB;
            font-weight: normal;
            color: #ffffff;
            &.active {
                background: linear-gradient(180deg, #76abff 0%, #4648ff 100%);
            }
        }
    }
    .top-container {
        height: 5.43rem;
        width: 7.5rem;
        display: flex;
        padding-left: 0.35rem;
        .top {
            height: 6.43rem;
            padding-top: 0.9rem;
            width: 2.2rem;
            .avatar-container {
                width: 2.2rem;
                height: 2.2rem;
                position: relative;
                .avatar {
                    width: 1.3rem;
                    height: 1.3rem;
                    border-radius: 50%;
                    background-size: contain;
                    background-repeat: no-repeat;
                    position: absolute;
                    left: 0.45rem;
                    top: 0.45rem;
                }
                img {
                    width: 2.2rem;
                    height: 2.2rem;
                }
            }
            .nick-name {
                font-size: 0.24rem;
                font-family: HiraginoSansGB-W6, HiraginoSansGB;
                font-weight: normal;
                color: #ffffff;
                text-align: center;
                word-break: break-all;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                img {
                    width: 0.24rem;
                    height: auto;
                    vertical-align: middle;
                    margin-right: 0.02rem;
                }
            }
            &.big-top {
                width: 2.4rem;
                padding-top: 0.26rem;
                .avatar-container {
                    width: 2.4rem;
                    height: 2.4rem;
                    .avatar {
                        width: 1.5rem;
                        height: 1.5rem;
                    }
                    img {
                        width: 2.4rem;
                        height: 2.4rem;
                    }
                }
            }
        }
    }
    .list-container {
        width: 6.8rem;
        min-height: 4.1rem;
        margin-left: 0.35rem;
        box-shadow: inset 0px 0px 0.05rem 0px #ffffff;
        border-radius: 0.2rem 0.2rem 0px 0px;
        padding-bottom: 1.96rem;
        border-top: 1px solid transparent;
        .list-item {
            width: 6.8rem;
            height: 0.86rem;
            display: flex;
            align-items: center;
            padding-left: 0.2rem;
            margin-top: 0.36rem;
            .sort {
                width: 0.6rem;
                font-size: 0.24rem;
                font-family: HiraginoSansGB-W6, HiraginoSansGB;
                font-weight: normal;
                color: #ffffff;
                text-align: center;
            }
            .avatar {
                width: 0.86rem;
                height: 0.86rem;
                background: #2a0089;
                border: 0.02rem solid #844eff;
                border-radius: 50%;
                img {
                    width: 0.86rem;
                    height: 0.86rem;
                    border-radius: 50%;
                }
            }
            .name {
                margin-left: 0.17rem;
                width: 3.4rem;
                font-size: 0.24rem;
                font-family: HiraginoSansGB-W6, HiraginoSansGB;
                font-weight: normal;
                color: #ffffff;
                word-break: break-all;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .num {
                width: 1.52rem;
                text-align: right;
                font-size: 0.24rem;
                font-family: HiraginoSansGB-W6, HiraginoSansGB;
                font-weight: normal;
                color: #ffffff;
                padding-right: 0.24rem;
                img {
                    width: 0.24rem;
                    height: auto;
                    vertical-align: middle;
                }
            }
        }
        &.no-data {
            display: flex;
            justify-content: center;
            align-items: center;
            .empty {
                width: 1.2rem;
                height: 1.2rem;
                img {
                    width: 1.2rem;
                    height: 1.2rem;
                }
            }
        }
    }
    .user-info {
        width: 7.2rem;
        height: 1.8rem;
        box-shadow: inset 0px 0px 0.05rem 0px #ffffff;
        border-radius: 0.1rem;
        position: fixed;
        bottom: 0;
        left: 0.15rem;
        padding-left: 0.2rem;
        .list-item {
            width: 6.8rem;
            height: 0.86rem;
            display: flex;
            align-items: center;
            padding-left: 0.2rem;
            margin-top: 0.36rem;
            .sort {
                width: 0.6rem;
                font-size: 0.24rem;
                font-weight: normal;
                color: #ffffff;
                text-align: center;
            }
            .avatar {
                width: 0.86rem;
                height: 0.86rem;
                background: #2a0089;
                border: 0.02rem solid #844eff;
                border-radius: 50%;
                img {
                    width: 0.82rem;
                    height: 0.82rem;
                    border-radius: 50%;
                }
            }
            .name {
                margin-left: 0.17rem;
                width: 3.4rem;
                font-size: 0.24rem;
                font-weight: normal;
                color: #ffffff;
            }
            .num {
                width: 1.52rem;
                text-align: right;
                font-size: 0.24rem;
                font-weight: normal;
                color: #ffffff;
                padding-right: 0.24rem;
                img {
                    width: 0.24rem;
                    height: auto;
                    vertical-align: middle;
                }
            }
        }
    }
}
</style>
