<!--
 * @Author: ZhaoZhiqi
 * @Date: 2023-12-18 15:06:39
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-06-28 11:46:09
 * @Description: 
 * @FilePath: /yaame-h5/src/pages/cp/pages/Privilege.vue
-->
<template>
    <div v-if="!loading" class="privilege-container">
        <div class="header">
            <div class="header-gap" :style="{ height: safe_height }"></div>
            <div class="header-content">
                <img class="back" src="../../../assets/img/cp/back-gray.png" @click="back" />
                <div class="header-title">{{ $t("CP Privileges") }}</div>
            </div>
        </div>
        <!-- <div class="tabs">
            <div class="tab" :class="{ active: tabIndex == index }" v-for="(item, index) in privilegeList" :key="item.privilege_type" @click="tabIndex = index">{{ item.privilege_name }}</div>
        </div> -->
        <van-tabs class="tabs" :style="{ marginTop: tab_height }" v-model="tabIndex" line-width="0" animated swipeable sticky :offset-top="tab_height">
            <van-tab v-for="(item, index) in privilegeList" :title="item.privilege_name" :key="item.privilege_type">
                <!-- 资料卡 -->
                <div v-if="item.privilege_type == 'PROFILE_CARD'" class="privilege-content">
                    <div class="privilege-title">Love</div>
                    <div class="privilege-wrapper">
                        <div class="border border_1">
                            <div class="item love1">
                                <img src="../../../assets/img/cp/privilege/item1-love1.png" alt="" />
                                <div>Lv.0</div>
                            </div>
                        </div>
                        <div class="border border_1">
                            <div class="item love2">
                                <img src="../../../assets/img/cp/privilege/item1-love2.png" alt="" />
                                <div>Lv.30</div>
                            </div>
                        </div>
                        <div class="border border_1">
                            <div class="item love3">
                                <img src="../../../assets/img/cp/privilege/item1-love3.png" alt="" />
                                <div>Lv.90</div>
                            </div>
                        </div>
                    </div>
                    <div class="privilege-title" style="margin-top: 0.6rem">Bestie</div>
                    <div class="privilege-wrapper">
                        <div class="border border_1">
                            <div class="item bestie1">
                                <img src="../../../assets/img/cp/privilege/item1-bestie1.png" alt="" />
                                <div>Lv.0</div>
                            </div>
                        </div>
                        <div class="border border_1">
                            <div class="item bestie2">
                                <img src="../../../assets/img/cp/privilege/item1-bestie2.png" alt="" />
                                <div>Lv.30</div>
                            </div>
                        </div>
                        <div class="border border_1">
                            <div class="item bestie3">
                                <img src="../../../assets/img/cp/privilege/item1-bestie3.png" alt="" />
                                <div>Lv.90</div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 头像框 -->
                <div v-if="item.privilege_type == 'AVATAR_FRAME'" class="privilege-content">
                    <div class="privilege-title">Love</div>
                    <div class="privilege-wrapper" style="flex-direction: row; justify-content: space-between">
                        <div class="border border_small border_love">
                            <div class="item">
                                <div class="item-bg"></div>
                                <img style="width: 1.8rem; height: 1.8rem" src="../../../assets/img/cp/privilege/item2-love1.png" alt="" />
                                <div>Lv.5</div>
                            </div>
                        </div>
                        <div class="border border_small border_love">
                            <div class="item">
                                <div class="item-bg"></div>
                                <img style="width: 1.8rem; height: 1.8rem" src="../../../assets/img/cp/privilege/item2-love2.png" alt="" />
                                <div>Lv.45</div>
                            </div>
                        </div>
                        <div class="border border_small border_love">
                            <div class="item">
                                <div class="item-bg"></div>
                                <img style="width: 1.8rem; height: 1.8rem" src="../../../assets/img/cp/privilege/item2-love3.png" alt="" />
                                <div>Lv.85</div>
                            </div>
                        </div>
                    </div>
                    <div class="privilege-title" style="margin-top: 0.6rem">Bestie</div>
                    <div class="privilege-wrapper" style="flex-direction: row; justify-content: space-between">
                        <div class="border border_small border_bestie">
                            <div class="item">
                                <div class="item-bg"></div>
                                <img style="width: 1.8rem; height: 1.8rem" src="../../../assets/img/cp/privilege/item2-bestie1.png" alt="" />
                                <div>Lv.5</div>
                            </div>
                        </div>
                        <div class="border border_small border_bestie">
                            <div class="item">
                                <div class="item-bg"></div>
                                <img style="width: 1.8rem; height: 1.8rem" src="../../../assets/img/cp/privilege/item2-bestie2.png" alt="" />
                                <div>Lv.45</div>
                            </div>
                        </div>
                        <div class="border border_small border_bestie">
                            <div class="item">
                                <div class="item-bg"></div>
                                <img style="width: 1.8rem; height: 1.8rem" src="../../../assets/img/cp/privilege/item2-bestie3.png" alt="" />
                                <div>Lv.85</div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 虚拟人装扮 -->
                <div v-if="item.privilege_type == 'CLOTHING'" class="privilege-content">
                    <div class="privilege-title">Love</div>
                    <div class="privilege-wrapper" style="flex-direction: row; justify-content: space-between">
                        <div class="border border_middle border_love">
                            <div class="item">
                                <div class="item-bg"></div>
                                <img style="width: 2.95rem; height: 2.95rem; margin-bottom: 0.2rem" src="../../../assets/img/cp/privilege/item3-love1.png" alt="" />
                                <div>Lv.7</div>
                            </div>
                        </div>
                        <div class="border border_middle border_love">
                            <div class="item">
                                <div class="item-bg"></div>
                                <img style="width: 2.95rem; height: 2.95em; margin-bottom: 0.2rem" src="../../../assets/img/cp/privilege/item3-love2.png" alt="" />
                                <div>Lv.17</div>
                            </div>
                        </div>
                    </div>
                    <div class="privilege-title" style="margin-top: 0.6rem">Bestie</div>
                    <div class="privilege-wrapper" style="flex-direction: row; justify-content: space-between">
                        <div class="border border_middle border_bestie">
                            <div class="item">
                                <div class="item-bg"></div>
                                <img style="width: 2.95rem; height: 2.95rem; margin-bottom: 0.2rem" src="../../../assets/img/cp/privilege/item3-bestie1.png" alt="" />
                                <div>Lv.7</div>
                            </div>
                        </div>
                        <div class="border border_middle border_bestie">
                            <div class="item">
                                <div class="item-bg"></div>
                                <img style="width: 2.95rem; height: 2.95rem; margin-bottom: 0.2rem" src="../../../assets/img/cp/privilege/item3-bestie2.png" alt="" />
                                <div>Lv.17</div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 气泡 -->
                <div v-if="item.privilege_type == 'BUBBLE'" class="privilege-content">
                    <div class="privilege-title">Love</div>
                    <div class="privilege-wrapper" style="flex-direction: row; justify-content: space-between">
                        <div class="border border_small border_love">
                            <div class="item">
                                <div class="item-bg"></div>
                                <img style="width: 1.8rem; height: 1.8rem" src="../../../assets/img/cp/privilege/item5-love2.png" alt="" />
                                <div>Lv.10</div>
                            </div>
                        </div>
                        <div class="border border_small border_love">
                            <div class="item">
                                <div class="item-bg"></div>
                                <img style="width: 1.8rem; height: 1.8rem" src="../../../assets/img/cp/privilege/item5-love2.png" alt="" />
                                <div>Lv.50</div>
                            </div>
                        </div>
                        <div class="border border_small border_love">
                            <div class="item">
                                <div class="item-bg"></div>
                                <img style="width: 1.8rem; height: 1.8rem" src="../../../assets/img/cp/privilege/item5-love3.png" alt="" />
                                <div>Lv.80</div>
                            </div>
                        </div>
                    </div>
                    <div class="privilege-title" style="margin-top: 0.6rem">Bestie</div>
                    <div class="privilege-wrapper" style="flex-direction: row; justify-content: space-between">
                        <div class="border border_small border_bestie">
                            <div class="item">
                                <div class="item-bg"></div>
                                <img style="width: 1.8rem; height: 1.8rem" src="../../../assets/img/cp/privilege/item5-bestie1.png" alt="" />
                                <div>Lv.10</div>
                            </div>
                        </div>
                        <div class="border border_small border_bestie">
                            <div class="item">
                                <div class="item-bg"></div>
                                <img style="width: 1.8rem; height: 1.8rem" src="../../../assets/img/cp/privilege/item5-bestie2.png" alt="" />
                                <div>Lv.50</div>
                            </div>
                        </div>
                        <div class="border border_small border_bestie">
                            <div class="item">
                                <div class="item-bg"></div>
                                <img style="width: 1.8rem; height: 1.8rem" src="../../../assets/img/cp/privilege/item5-bestie3.png" alt="" />
                                <div>Lv.80</div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 表情 -->
                <div v-if="item.privilege_type == 'EXPRESSION'" class="privilege-content">
                    <div class="privilege-title">Love</div>
                    <div class="privilege-wrapper" style="flex-direction: row; justify-content: space-between">
                        <div class="border border_middle border_love">
                            <div class="item">
                                <div class="item-bg"></div>
                                <img style="width: 2.95rem; height: 2.95rem; margin-bottom: 0.2rem" src="../../../assets/img/cp/privilege/item4-love1.png" alt="" />
                                <div>Lv.3</div>
                            </div>
                        </div>
                        <div class="border border_middle border_love">
                            <div class="item">
                                <div class="item-bg"></div>
                                <img style="width: 2.95rem; height: 2.95em; margin-bottom: 0.2rem" src="../../../assets/img/cp/privilege/item4-love2.png" alt="" />
                                <div>Lv.40</div>
                            </div>
                        </div>
                    </div>
                    <div class="privilege-title" style="margin-top: 0.6rem">Bestie</div>
                    <div class="privilege-wrapper" style="flex-direction: row; justify-content: space-between">
                        <div class="border border_middle border_bestie">
                            <div class="item">
                                <div class="item-bg"></div>
                                <img style="width: 2.95rem; height: 2.95rem; margin-bottom: 0.2rem" src="../../../assets/img/cp/privilege/item4-bestie1.png" alt="" />
                                <div>Lv.3</div>
                            </div>
                        </div>
                        <div class="border border_middle border_bestie">
                            <div class="item">
                                <div class="item-bg"></div>
                                <img style="width: 2.95rem; height: 2.95rem; margin-bottom: 0.2rem" src="../../../assets/img/cp/privilege/item4-bestie2.png" alt="" />
                                <div>Lv.40</div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 房间背景 -->
                <div v-if="item.privilege_type == 'ROOM_BACKGROUND'" class="privilege-content">
                    <div class="privilege-title">Love</div>
                    <div class="privilege-wrapper" style="flex-direction: row; justify-content: space-between">
                        <div class="border border_middle border_love">
                            <div class="item">
                                <div class="item-bg"></div>
                                <img style="width: 2.95rem; height: 2.95rem; margin-bottom: 0.2rem" src="../../../assets/img/cp/privilege/item6-love1.png" alt="" />
                                <div>Lv.15</div>
                            </div>
                        </div>
                        <div class="border border_middle border_love">
                            <div class="item">
                                <div class="item-bg"></div>
                                <img style="width: 2.95rem; height: 2.95em; margin-bottom: 0.2rem" src="../../../assets/img/cp/privilege/item6-love2.png" alt="" />
                                <div>Lv.55</div>
                            </div>
                        </div>
                    </div>
                    <div class="privilege-title" style="margin-top: 0.6rem">Bestie</div>
                    <div class="privilege-wrapper" style="flex-direction: row; justify-content: space-between">
                        <div class="border border_middle border_bestie">
                            <div class="item">
                                <div class="item-bg"></div>
                                <img style="width: 2.95rem; height: 2.95rem; margin-bottom: 0.2rem" src="../../../assets/img/cp/privilege/item6-bestie1.png" alt="" />
                                <div>Lv.15</div>
                            </div>
                        </div>
                        <div class="border border_middle border_bestie">
                            <div class="item">
                                <div class="item-bg"></div>
                                <img style="width: 2.95rem; height: 2.95rem; margin-bottom: 0.2rem" src="../../../assets/img/cp/privilege/item6-bestie2.png" alt="" />
                                <div>Lv.55</div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 进房飘带 -->
                <div v-if="item.privilege_type == 'ENTER_ROOM_RIBBON'" class="privilege-content">
                    <div class="privilege-title">Love</div>
                    <div class="privilege-wrapper">
                        <div class="border border_big border_love">
                            <div class="item">
                                <div class="item-bg"></div>
                                <img style="width: 6.5rem; height: 2.01rem" src="../../../assets/img/cp/privilege/item7-love2.png" alt="" />
                                <div>Lv.1</div>
                            </div>
                        </div>
                        <div class="border border_big border_love">
                            <div class="item">
                                <div class="item-bg"></div>
                                <img style="width: 6.5rem; height: 2.01rem" src="../../../assets/img/cp/privilege/item7-love2.png" alt="" />
                                <div>Lv.20</div>
                            </div>
                        </div>
                        <div class="border border_big border_love">
                            <div class="item">
                                <div class="item-bg"></div>
                                <img style="width: 6.5rem; height: 2.01rem" src="../../../assets/img/cp/privilege/item7-love3.png" alt="" />
                                <div>Lv.60</div>
                            </div>
                        </div>
                    </div>
                    <div class="privilege-title" style="margin-top: 0.6rem">Bestie</div>
                    <div class="privilege-wrapper">
                        <div class="border border_big border_bestie">
                            <div class="item">
                                <div class="item-bg"></div>
                                <img style="width: 6.5rem; height: 2.01rem" src="../../../assets/img/cp/privilege/item7-bestie1.png" alt="" />
                                <div>Lv.1</div>
                            </div>
                        </div>
                        <div class="border border_big border_bestie">
                            <div class="item">
                                <div class="item-bg"></div>
                                <img style="width: 6.5rem; height: 2.01rem" src="../../../assets/img/cp/privilege/item7-bestie2.png" alt="" />
                                <div>Lv.20</div>
                            </div>
                        </div>
                        <div class="border border_big border_bestie">
                            <div class="item">
                                <div class="item-bg"></div>
                                <img style="width: 6.5rem; height: 2.01rem" src="../../../assets/img/cp/privilege/item7-bestie3.png" alt="" />
                                <div>Lv.60</div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 座位特效 -->
                <div v-if="item.privilege_type == 'SEAT_EFFECT'" class="privilege-content">
                    <div class="privilege-title">Love</div>
                    <div class="privilege-wrapper">
                        <div class="border border_big border_love">
                            <div class="item">
                                <div class="item-bg"></div>
                                <img style="width: 6.5rem; height: 3.28rem" src="../../../assets/img/cp/privilege/item8-love1.png" alt="" />
                                <div>Lv.25</div>
                            </div>
                        </div>
                        <div class="border border_big border_love">
                            <div class="item">
                                <div class="item-bg"></div>
                                <img style="width: 6.5rem; height: 3.28rem" src="../../../assets/img/cp/privilege/item8-love2.png" alt="" />
                                <div>Lv.65</div>
                            </div>
                        </div>
                    </div>
                    <div class="privilege-title" style="margin-top: 0.6rem">Bestie</div>
                    <div class="privilege-wrapper">
                        <div class="border border_big border_bestie">
                            <div class="item">
                                <div class="item-bg"></div>
                                <img style="width: 6.5rem; height: 3.28rem" src="../../../assets/img/cp/privilege/item8-bestie1.png" alt="" />
                                <div>Lv.25</div>
                            </div>
                        </div>
                        <div class="border border_big border_bestie">
                            <div class="item">
                                <div class="item-bg"></div>
                                <img style="width: 6.5rem; height: 3.28rem" src="../../../assets/img/cp/privilege/item8-bestie2.png" alt="" />
                                <div>Lv.65</div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 消息列表 -->
                <div v-if="item.privilege_type == 'MESSAGE_BACKGROUND'" class="privilege-content">
                    <div class="privilege-title">Love</div>
                    <div class="privilege-wrapper">
                        <div class="border border_big border_love">
                            <div class="item">
                                <div class="item-bg"></div>
                                <img style="width: 6.5rem; height: 2.01rem" src="../../../assets/img/cp/privilege/item10-love2.png" alt="" />
                                <div>Lv.30</div>
                            </div>
                        </div>
                        <div class="border border_big border_love">
                            <div class="item">
                                <div class="item-bg"></div>
                                <img style="width: 6.5rem; height: 2.01rem" src="../../../assets/img/cp/privilege/item10-love3.png" alt="" />
                                <div>Lv.70</div>
                            </div>
                        </div>
                    </div>
                    <div class="privilege-title" style="margin-top: 0.6rem">Bestie</div>
                    <div class="privilege-wrapper">
                        <div class="border border_big border_bestie">
                            <div class="item">
                                <div class="item-bg"></div>
                                <img style="width: 6.5rem; height: 2.01rem" src="../../../assets/img/cp/privilege/item10-bestie2.png" alt="" />
                                <div>Lv.30</div>
                            </div>
                        </div>
                        <div class="border border_big border_bestie">
                            <div class="item">
                                <div class="item-bg"></div>
                                <img style="width: 6.5rem; height: 2.01rem" src="../../../assets/img/cp/privilege/item10-bestie3.png" alt="" />
                                <div>Lv.70</div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 聊天背景 -->
                <div v-if="item.privilege_type == 'CHAT_BACKGROUND'" class="privilege-content">
                    <div class="privilege-title">Love</div>
                    <div class="privilege-wrapper">
                        <div class="border border_big border_love">
                            <div class="item">
                                <div class="item-bg"></div>
                                <img style="width: 6.5rem; height: 2.78rem" src="../../../assets/img/cp/privilege/item11-love1.png" alt="" />
                                <div>Lv.35</div>
                            </div>
                        </div>
                        <div class="border border_big border_love">
                            <div class="item">
                                <div class="item-bg"></div>
                                <img style="width: 6.5rem; height: 2.78rem" src="../../../assets/img/cp/privilege/item11-love2.png" alt="" />
                                <div>Lv.75</div>
                            </div>
                        </div>
                        <div class="border border_big border_love">
                            <div class="item">
                                <div class="item-bg"></div>
                                <img style="width: 6.5rem; height: 2.78rem" src="../../../assets/img/cp/privilege/item11-love3.png" alt="" />
                                <div>Lv.95</div>
                            </div>
                        </div>
                    </div>
                    <div class="privilege-title" style="margin-top: 0.6rem">Bestie</div>
                    <div class="privilege-wrapper">
                        <div class="border border_big border_bestie">
                            <div class="item">
                                <div class="item-bg"></div>
                                <img style="width: 6.5rem; height: 2.78rem" src="../../../assets/img/cp/privilege/item11-bestie1.png" alt="" />
                                <div>Lv.35</div>
                            </div>
                        </div>
                        <div class="border border_big border_bestie">
                            <div class="item">
                                <div class="item-bg"></div>
                                <img style="width: 6.5rem; height: 2.78rem" src="../../../assets/img/cp/privilege/item11-bestie2.png" alt="" />
                                <div>Lv.75</div>
                            </div>
                        </div>
                        <div class="border border_big border_bestie">
                            <div class="item">
                                <div class="item-bg"></div>
                                <img style="width: 6.5rem; height: 2.78rem" src="../../../assets/img/cp/privilege/item11-bestie3.png" alt="" />
                                <div>Lv.95</div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 勋章 -->
                <div v-if="item.privilege_type == 'MEDAL'" class="privilege-content">
                    <div class="privilege-title">Love</div>
                    <div class="privilege-wrapper" style="flex-direction: row; justify-content: space-between">
                        <div class="border border_middle border_love">
                            <div class="item">
                                <div class="item-bg"></div>
                                <img style="width: 1.8rem; height: 1.8rem; margin-bottom: 0.7rem" src="../../../assets/img/cp/privilege/item12-love2.png" alt="" />
                                <div>Lv.70</div>
                            </div>
                        </div>
                        <div class="border border_middle border_love">
                            <div class="item">
                                <div class="item-bg"></div>
                                <img style="width: 1.8rem; height: 1.8rem; margin-bottom: 0.7rem" src="../../../assets/img/cp/privilege/item12-love3.png" alt="" />
                                <div>Lv.100</div>
                            </div>
                        </div>
                    </div>
                    <div class="privilege-title" style="margin-top: 0.6rem">Bestie</div>
                    <div class="privilege-wrapper" style="flex-direction: row; justify-content: space-between">
                        <div class="border border_middle border_bestie">
                            <div class="item">
                                <div class="item-bg"></div>
                                <img style="width: 1.8rem; height: 1.8rem; margin-bottom: 0.7rem" src="../../../assets/img/cp/privilege/item12-bestie2.png" alt="" />
                                <div>Lv.70</div>
                            </div>
                        </div>
                        <div class="border border_middle border_bestie">
                            <div class="item">
                                <div class="item-bg"></div>
                                <img style="width: 1.8rem; height: 1.8rem; margin-bottom: 0.7rem" src="../../../assets/img/cp/privilege/item12-bestie3.png" alt="" />
                                <div>Lv.100</div>
                            </div>
                        </div>
                    </div>
                </div>
            </van-tab>
        </van-tabs>
    </div>
</template>
<script>
import { getSafeHeight, getLanguage } from "../../../lib/device";
import { getScrollTop, getQueryString } from "../../../lib/utils";
import { getPrivilegesAPI } from "../api";
let locale = getLanguage() || "en";

if (["zh-hk", "zh-tw", "zh-mo", "zh-cn"].indexOf(locale) > -1) {
    let localEnum = {
        "zh-hk": "tw",
        "zh-tw": "tw",
        "zh-mo": "tw",
        "zh-cn": "zh",
    };

    locale = localEnum[locale];
}
export default {
    data() {
        return {
            locale,
            tabIndex: 0,
            safe_height: "",
            tab_height: "",
            onTop: true,
            privilegeList: [],
            loading: true,
        };
    },
    activated() {
        this.tabIndex = this.$route.query.index / 1;
        getPrivilegesAPI().then((res) => {
            if (res.status === 1000) {
                this.privilegeList = res.data.privileges;
            }
            this.loading = false;
        });
    },
    mounted() {
        const safe_area = getSafeHeight() || 0;
        this.safe_height = (safe_area * 2) / 100 + "rem";
        this.tab_height = (safe_area * 2) / 100 + 0.88 + "rem";
        window.addEventListener("scroll", this.pageChange, false);
    },
    methods: {
        pageChange() {
            const scroll_top = getScrollTop();
            this.onTop = scroll_top <= 10;
        },
        back() {
            this.$router.back();
        },
    },
};
</script>
<style scoped lang="less">
.privilege-container {
    background-color: #fff;
    min-height: 100vh;
    overflow: hidden;
    .header {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 10;
        box-sizing: border-box;
        background-color: #fff;
        transition-duration: 0.2s;
        .header-content {
            position: relative;
            height: 0.88rem;
            display: flex;
            justify-content: center;
            align-items: center;
            .header-title {
                font-size: 0.34rem;
                color: #333;
                font-weight: bold;
            }
            .back {
                width: 0.48rem;
                height: 0.48rem;
                position: absolute;
                top: 0.2rem;
                left: 0.3rem;
            }
        }
    }
    .privilege-content {
        padding: 0 0.27rem;
        .privilege-title {
            font-size: 0.3rem;
            line-height: 1;
            color: #999;
            margin: 0.25rem 0 0.15rem;
            font-weight: bold;
        }
        .privilege-wrapper {
            display: flex;
            flex-direction: column;
            .border {
                .item {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    background-repeat: no-repeat;
                    background-size: cover;
                    background-position: center;
                    * {
                        position: relative;
                        z-index: 2;
                    }
                    .item-bg {
                        width: calc(100% - 0.04rem);
                        height: calc(100% - 0.04rem);
                        position: absolute;
                        top: 0.02rem;
                        left: 0.02rem;
                        background-color: #fff;
                        border-radius: 0.24rem;
                        z-index: 1;
                    }
                    img {
                        margin-bottom: 0.2rem;
                    }
                    div {
                        font-size: 0.24rem;
                        line-height: 1;
                        color: #333;
                    }
                }
                &.border_1 {
                    .item {
                        width: 6.96rem;
                        height: 3.14rem;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        background-repeat: no-repeat;
                        background-size: cover;
                        background-position: center;
                        margin-bottom: 0.14rem;
                        &.love1 {
                            background-image: url("../../../assets/img/cp/privilege/item1-love-bg1.png");
                        }
                        &.love2 {
                            background-image: url("../../../assets/img/cp/privilege/item1-love-bg2.png");
                        }
                        &.love3 {
                            background-image: url("../../../assets/img/cp/privilege/item1-love-bg3.png");
                        }
                        &.bestie1 {
                            background-image: url("../../../assets/img/cp/privilege/item1-bestie-bg1.png");
                        }
                        &.bestie2 {
                            background-image: url("../../../assets/img/cp/privilege/item1-bestie-bg2.png");
                        }
                        &.bestie3 {
                            background-image: url("../../../assets/img/cp/privilege/item1-bestie-bg3.png");
                        }
                        img {
                            width: 6.5rem;
                            height: 2.14rem;
                        }
                    }
                }

                &.border_small {
                    width: 2.2rem;
                    height: 2.64rem;
                    box-sizing: border-box;
                    padding: 0.02rem;
                    border-radius: 0.24rem;
                    overflow: hidden;
                    .item {
                        height: 100%;
                        border-radius: 0.24rem;
                    }
                }
                &.border_middle {
                    width: 3.35rem;
                    height: 3.89rem;
                    box-sizing: border-box;
                    padding: 0.02rem;
                    border-radius: 0.24rem;
                    overflow: hidden;
                    .item {
                        height: 100%;
                        border-radius: 0.24rem;
                    }
                }
                &.border_big {
                    width: 100%;
                    box-sizing: border-box;
                    border-radius: 0.24rem;
                    padding: 0.02rem;
                    overflow: hidden;
                    margin-bottom: 0.2rem;
                    .item {
                        padding: 0.2rem 0 0.3rem;
                        height: 100%;
                        border-radius: 0.24rem;
                    }
                }
            }
        }
    }

    .border_love {
        background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 233, 218, 1)) !important;
        .item {
            background-color: #fff;
            .item-bg {
                background-image: linear-gradient(to bottom, rgba(255, 233, 218, 0.4), rgba(255, 255, 255, 1)) !important;
            }
        }
    }
    .border_bestie {
        background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(218, 218, 255, 1)) !important;
        .item {
            background-color: #fff;
            .item-bg {
                background-image: linear-gradient(to bottom, rgba(219, 231, 255, 0.4), rgba(255, 255, 255, 1)) !important;
            }
        }
    }
}
</style>
<style lang="less">
.van-tab {
    width: auto;
    margin-right: 0rem;
    .van-tab__text {
        font-size: 0.28rem;
    }
    &.van-tab--active {
        .van-tab__text {
            font-size: 0.36rem;
            font-weight: bold;
        }
    }
}
.van-tabs__content {
    min-height: 0px;
}
</style>
