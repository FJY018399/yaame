<template>
    <div class="index-container" :class="[tabIndex === 0 ? 'cp' : 'privilege']">
        <div class="header" :style="{ backgroundColor: onTop ? 'transparent' : '#fff' }">
            <div class="header-gap" :style="{ height: safe_height }"></div>
            <div class="header-content">
                <img v-if="onTop" class="back" src="../../../assets/img/cp/back.png" @click="back" />
                <img v-else class="back" src="../../../assets/img/cp/back-gray.png" @click="back" />
                <div class="tabs" :class="{ white: !onTop }">
                    <div class="tab" :style="{ color: tabIndex === 0 ? '#000' : '#fff' }" @click="tabIndex = 0">{{ $t("My CP") }}</div>
                    <div class="tab" :style="{ color: tabIndex === 1 ? '#000' : '#fff' }" @click="tabIndex = 1">{{ $t("CP Privileges") }}</div>
                    <div class="tab-slide" :style="{ left: tabIndex === 0 ? '0.04rem' : '2.14rem' }"></div>
                </div>
                <img v-if="onTop" class="help" src="../../../assets/img/cp/help.png" @click="helpVisible = true" />
                <img v-else class="help" src="../../../assets/img/cp/help-gray.png" @click="helpVisible = true" />
            </div>
        </div>

        <div v-show="tabIndex === 0" class="cp-content" :class="[cpIndex === 0 ? 'love' : 'bestie']">
            <!-- 弹幕 第一行 -->
            <div class="bullet-box" style="top: 2rem">
                <div ref="bulletBar" class="bullet-bar" :style="{ marginLeft: -bulletBarLeft + 'px' }">
                    <div class="bullet" :style="{ backgroundColor: item.cp_relation_type === 'LOVER' ? 'rgba(246, 79, 255, 0.50)' : 'rgba(102, 79, 255, 0.50)' }" v-for="(item, index) in bulletList1" :key="index">
                        <div class="bullet-avatar" :style="{ backgroundImage: `url(${item.avatar})` }"></div>
                        <div class="bullet-text">{{ item.cp_relation_type === "LOVER" ? $t("Send Lover Invitation") : $t("Send Bestie Invitation") }}</div>
                        <div class="bullet-avatar" :style="{ backgroundImage: `url(${item.relation_avatar})` }"></div>
                    </div>
                    <!-- 通过定位 bulletFlag 的位置来控制两行的进度 -->
                    <div class="bullet" :style="{ backgroundColor: item.cp_relation_type === 'LOVER' ? 'rgba(246, 79, 255, 0.50)' : 'rgba(102, 79, 255, 0.50)' }" id="bulletFlag" :class="{ flag: index === 1 }" v-for="(item, index) in bulletList1" :key="index + 100">
                        <div class="bullet-avatar" :style="{ backgroundImage: `url(${item.avatar})` }"></div>
                        <div class="bullet-text">{{ item.cp_relation_type === "LOVER" ? $t("Send Lover Invitation") : $t("Send Bestie Invitation") }}</div>
                        <div class="bullet-avatar" :style="{ backgroundImage: `url(${item.relation_avatar})` }"></div>
                    </div>
                </div>
            </div>
            <!-- 弹幕 第一行 -->
            <div class="bullet-box" style="top: 2.8rem">
                <div ref="bulletBar" class="bullet-bar" :style="{ marginLeft: -bulletBarLeft - 50 + 'px' }">
                    <div class="bullet" :style="{ backgroundColor: item.cp_relation_type === 'LOVER' ? 'rgba(246, 79, 255, 0.50)' : 'rgba(102, 79, 255, 0.50)' }" v-for="(item, index) in bulletList2" :key="index">
                        <div class="bullet-avatar" :style="{ backgroundImage: `url(${item.avatar})` }"></div>
                        <div class="bullet-text">{{ item.cp_relation_type === "LOVER" ? $t("Send Lover Invitation") : $t("Send Bestie Invitation") }}</div>
                        <div class="bullet-avatar" :style="{ backgroundImage: `url(${item.relation_avatar})` }"></div>
                    </div>
                    <div class="bullet" :style="{ backgroundColor: item.cp_relation_type === 'LOVER' ? 'rgba(246, 79, 255, 0.50)' : 'rgba(102, 79, 255, 0.50)' }" :class="{ flag: index === 1 }" v-for="(item, index) in bulletList1" :key="index + 100">
                        <div class="bullet-avatar" :style="{ backgroundImage: `url(${item.avatar})` }"></div>
                        <div class="bullet-text">{{ item.cp_relation_type === "LOVER" ? $t("Send Lover Invitation") : $t("Send Bestie Invitation") }}</div>
                        <div class="bullet-avatar" :style="{ backgroundImage: `url(${item.relation_avatar})` }"></div>
                    </div>
                </div>
            </div>

            <div class="cp-btns" v-if="cpIndex === 0">
                <template v-if="locale === 'en'">
                    <img class="cp-btn love-btn" src="../../../assets/img/cp/love-btn-en_active.png" />
                    <img class="cp-btn bestie-btn" src="../../../assets/img/cp/bestie-btn-en.png" @click="cpIndex = 1" />
                </template>
                <template v-if="locale === 'id'">
                    <img class="cp-btn love-btn" src="../../../assets/img/cp/love-btn-id_active.png" />
                    <img class="cp-btn bestie-btn" src="../../../assets/img/cp/bestie-btn-id.png" @click="cpIndex = 1" />
                </template>
                <template v-if="locale === 'zh'">
                    <img class="cp-btn love-btn" src="../../../assets/img/cp/love-btn-zh_active.png" />
                    <img class="cp-btn bestie-btn" src="../../../assets/img/cp/bestie-btn-zh.png" @click="cpIndex = 1" />
                </template>
                <template v-if="locale === 'tw'">
                    <img class="cp-btn love-btn" src="../../../assets/img/cp/love-btn-tw_active.png" />
                    <img class="cp-btn bestie-btn" src="../../../assets/img/cp/bestie-btn-tw.png" @click="cpIndex = 1" />
                </template>
                <template v-if="locale === 'ar'">
                    <img class="cp-btn love-btn" src="../../../assets/img/cp/love-btn-ar_active.png" />
                    <img class="cp-btn bestie-btn" src="../../../assets/img/cp/bestie-btn-ar.png" @click="cpIndex = 1" />
                </template>
            </div>
            <div class="cp-btns" v-else>
                <template v-if="locale === 'en'">
                    <img class="cp-btn love-btn" src="../../../assets/img/cp/love-btn-en.png" @click="cpIndex = 0" />
                    <img class="cp-btn bestie-btn" src="../../../assets/img/cp/bestie-btn-en_active.png" />
                </template>
                <template v-if="locale === 'id'">
                    <img class="cp-btn love-btn" src="../../../assets/img/cp/love-btn-id.png" @click="cpIndex = 0" />
                    <img class="cp-btn bestie-btn" src="../../../assets/img/cp/bestie-btn-id_active.png" />
                </template>
                <template v-if="locale === 'zh'">
                    <img class="cp-btn love-btn" src="../../../assets/img/cp/love-btn-zh.png" @click="cpIndex = 0" />
                    <img class="cp-btn bestie-btn" src="../../../assets/img/cp/bestie-btn-zh_active.png" />
                </template>
                <template v-if="locale === 'tw'">
                    <img class="cp-btn love-btn" src="../../../assets/img/cp/love-btn-tw.png" @click="cpIndex = 0" />
                    <img class="cp-btn bestie-btn" src="../../../assets/img/cp/bestie-btn-tw_active.png" />
                </template>
                <template v-if="locale === 'ar'">
                    <img class="cp-btn love-btn" src="../../../assets/img/cp/love-btn-ar.png" @click="cpIndex = 0" />
                    <img class="cp-btn bestie-btn" src="../../../assets/img/cp/bestie-btn-ar_active.png" />
                </template>
            </div>

            <!-- love卡片 -->
            <div v-if="cpIndex === 0" class="love-content">
                <img v-if="locale === 'en'" class="top-banner" src="../../../assets/img/cp/love-top-en.png" />
                <img v-if="locale === 'id'" class="top-banner" src="../../../assets/img/cp/love-top-id.png" />
                <img v-if="locale === 'zh'" class="top-banner" src="../../../assets/img/cp/love-top-zh.png" />
                <img v-if="locale === 'tw'" class="top-banner" src="../../../assets/img/cp/love-top-tw.png" />
                <img v-if="locale === 'ar'" class="top-banner" src="../../../assets/img/cp/love-top-ar.png" />
                <div class="relationship-card">
                    <div class="relationship-info">
                        <div class="relationship-user">
                            <div class="relationship-avatar">
                                <div class="relationship-avatar-img" :style="{ backgroundImage: `url(${cpInfo.avatar})` }"></div>
                            </div>
                            <div class="relationship-name">{{ cpInfo.nick_name }}</div>
                        </div>
                        <div class="relationship-link">
                            <img class="relationship-link-icon1" src="../../../assets/img/cp/love-link.png" />
                            <canvas class="relationship-link-icon2" id="love-icon"></canvas>
                        </div>
                        <div class="relationship-user">
                            <div v-if="cpInfo.user_cp_love_info" class="relationship-avatar" @click="toUser(user_cp_love_info.uid)">
                                <div class="relationship-avatar-img" :style="{ backgroundImage: `url(${user_cp_love_info.avatar})` }"></div>
                            </div>
                            <div v-else class="relationship-avatar" @click="link(love_button_info.scheme_url)">
                                <div class="relationship-avatar-img"></div>
                            </div>
                            <div class="relationship-name">{{ user_cp_love_info.nick_name || $t("None") }}</div>
                        </div>
                    </div>
                    <div class="relationship-footer">
                        <div class="relationship-lv">Lv.{{ user_cp_love_info.cp_level || 0 }}</div>
                        <div class="relationship-progress">
                            <span>{{ user_cp_love_info.cp_level_info ? `${user_cp_love_info.cp_exp} / ${user_cp_love_info.cp_level_info.max_value}` : $t("No CP yet") }}</span>
                            <div class="relationship-progress-bar" :style="{ width: `${user_cp_love_info.cp_level_info && user_cp_love_info.cp_level_info.max_value ? (user_cp_love_info.cp_exp / user_cp_love_info.cp_level_info.max_value) * 100 : 0}%` }"></div>
                        </div>
                        <div class="relationship-lv">Lv.{{ user_cp_love_info.cp_level_info ? user_cp_love_info.cp_level_info.next_level : 1 }}</div>
                    </div>
                </div>
                <div v-if="!cpInfo.user_cp_love_info" class="invite-card">
                    <img class="invite-gift" src="../../../assets/img/cp/love-gift.png" />
                    <div class="invite-text1">{{ $t("Send her Lover invitation by ring") }}</div>
                    <div class="invite-text2">{{ $t("After he/she accepts the invitation, the relationship will become a Lover.") }}</div>
                    <div class="invite-btn" @click="link(love_button_info.scheme_url)">{{ $t("Proposal") }}(<img src="../../../assets/img/cp/diamond.png" />{{ love_button_info.worth_diamonds }})</div>
                    <div class="invite-text3">{{ $t("These diamonds will be returned to you if the invitation is rejected.") }}</div>
                </div>
                <div v-if="cpInfo.user_cp_love_info" class="unfriend-link" @click="showUnfriendVisible(user_cp_love_info.uid, user_cp_love_info.nick_name)">{{ $t("Cancel the Lover relationship") }}</div>
            </div>
            <!-- bestie卡片 -->
            <div v-else class="bestie-content">
                <img v-if="locale === 'en'" class="top-banner" src="../../../assets/img/cp/bestie-top-en.png" />
                <img v-if="locale === 'id'" class="top-banner" src="../../../assets/img/cp/bestie-top-id.png" />
                <img v-if="locale === 'zh'" class="top-banner" src="../../../assets/img/cp/bestie-top-zh.png" />
                <img v-if="locale === 'tw'" class="top-banner" src="../../../assets/img/cp/bestie-top-tw.png" />
                <img v-if="locale === 'ar'" class="top-banner" src="../../../assets/img/cp/bestie-top-ar.png" />
                <template v-if="user_bestie_infos.length">
                    <template v-for="(item, index) in user_bestie_infos">
                        <div class="relationship-card" :key="index">
                            <div class="relationship-info">
                                <!-- 人物头像 -->
                                <div class="relationship-user">
                                    <div class="relationship-avatar">
                                        <div class="relationship-avatar-img" :style="{ backgroundImage: `url(${cpInfo.avatar})` }"></div>
                                    </div>
                                    <div class="relationship-name">{{ cpInfo.nick_name }}</div>
                                </div>
                                <div class="relationship-link">
                                    <img class="relationship-link-icon1" src="../../../assets/img/cp/bestie-link.png" />
                                    <!-- <img class="relationship-link-icon2" src="../../../assets/img/cp/bestie-link-icon.png" /> -->
                                    <canvas class="relationship-link-icon2" :id="'bestie-icon_' + index"></canvas>
                                </div>
                                <!-- 人物头像 -->
                                <div class="relationship-user">
                                    <div class="relationship-avatar" @click="toUser(item.uid)">
                                        <div class="relationship-avatar-img" :style="{ backgroundImage: `url(${item.avatar})` }"></div>
                                    </div>
                                    <div class="relationship-name">{{ item.nick_name || $t("None") }}</div>
                                </div>
                            </div>
                            <div class="relationship-footer">
                                <div class="relationship-lv">Lv.{{ item.cp_level }}</div>
                                <div class="relationship-progress">
                                    <span>{{ `${item.cp_exp} / ${item.cp_level_info.max_value}` }}</span>
                                    <div class="relationship-progress-bar" :style="{ width: `${(item.cp_exp / item.cp_level_info.max_value) * 100}%` }"></div>
                                </div>
                                <div class="relationship-lv">Lv.{{ item.cp_level_info.next_level }}</div>
                            </div>
                        </div>
                        <div class="unfriend-link unfriend-link-bestie" @click="showUnfriendVisible(item.uid, item.nick_name)" :key="index + 10">{{ $t("Dismiss Bestie relationship") }}</div>
                    </template>
                </template>
                <template v-else>
                    <div class="relationship-card">
                        <div class="relationship-info">
                            <!-- 人物头像 -->
                            <div class="relationship-user">
                                <div class="relationship-avatar">
                                    <div class="relationship-avatar-img" :style="{ backgroundImage: `url(${cpInfo.avatar})` }"></div>
                                </div>
                                <div class="relationship-name">{{ cpInfo.nick_name }}</div>
                            </div>
                            <div class="relationship-link">
                                <img class="relationship-link-icon1" src="../../../assets/img/cp/bestie-link.png" />
                                <canvas class="relationship-link-icon2" id="bestie-icon"></canvas>
                            </div>
                            <!-- 人物头像 -->
                            <div class="relationship-user">
                                <div class="relationship-avatar" @click="link(bestie_button_info.scheme_url)">
                                    <div class="relationship-avatar-img"></div>
                                </div>
                                <div class="relationship-name">{{ $t("None") }}</div>
                            </div>
                        </div>
                        <div class="relationship-footer">
                            <div class="relationship-lv">Lv.0</div>
                            <div class="relationship-progress">
                                <span>{{ $t("No CP yet") }}</span>
                                <div class="relationship-progress-bar" :style="{ width: 0 }"></div>
                            </div>
                            <div class="relationship-lv">Lv.1</div>
                        </div>
                    </div>
                </template>

                <div v-if="user_bestie_infos.length < 6" class="invite-card">
                    <div v-if="user_bestie_infos.length" class="invite-title">{{ $t("Add Bestie") }}</div>
                    <img class="invite-gift" src="../../../assets/img/cp/bestie-gift.png" />
                    <div class="invite-text1">{{ $t("Send her a Bestie invitation with a ring") }}</div>
                    <div class="invite-text2">{{ $t("After he/she accepts the invitation, it will become a Bestie relationship") }}</div>
                    <div class="invite-btn" @click="link(bestie_button_info.scheme_url)">{{ $t("Bestie") }}(<img src="../../../assets/img/cp/diamond.png" alt="" />{{ bestie_button_info.worth_diamonds || 0 }})</div>
                    <div class="invite-text3">{{ $t("These diamonds will be returned to you if the invitation is rejected.") }}</div>
                </div>
            </div>
        </div>
        <div v-show="tabIndex === 1" class="privilege-content">
            <img class="privilege-bg" src="../../../assets/img/cp/privilege-bg.png" />
            <div class="privilege-card">
                <img class="privilege-card-bg" src="../../../assets/img/cp/privilege-card-bg.png" />
                <div class="privilege-box" v-for="(item, index) in privilegeList" :key="index">
                    <div class="privilege-item" @click="toPrivilege(index)">
                        <div class="privilege-img" :style="{ backgroundImage: `url(${item.privilege_icon})` }"></div>
                        <div class="privilege-name">{{ item.privilege_name }}</div>
                        <div class="privilege-lv">
                            <span v-for="level in item.privilege_levels" :key="level">Lv.{{ level }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- help -->
        <van-popup v-model="helpVisible" round style="overflow: visible">
            <div class="help-card">
                <div class="help-content">
                    <div v-if="cpIndex === 0" class="help-title">{{ $t("Upgrade Lover Level") }}</div>
                    <div v-else class="help-title">{{ $t("Upgrade Bestie Level") }}</div>
                    <div class="help-text">{{ $t("1. CP send 1 message to each other could increase (+30 per day)") }}</div>
                    <div class="help-text">{{ $t("2. CP take the seat in the one same room +1 EXP per 2 mins (+200 EXP max per day)") }}</div>
                    <div class="help-text">{{ $t("3. Give gifts to your CP (1 diamond = 1 EXP)") }}</div>
                    <div class="help-text">{{ $t("4. Give your CP a CP gift (1 diamond = 2 EXP)") }}</div>
                    <div class="help-btn" :class="[cpIndex === 0 ? 'love' : 'bestie']" @click="helpVisible = false">{{ $t("Knew") }}</div>
                </div>
                <img v-if="cpIndex === 0" class="help-img" src="../../../assets/img/cp/plane.png" />
                <img v-else class="help-img" src="../../../assets/img/cp/game.png" />
                <img class="help-bg" src="../../../assets/img/cp/help-bg.png" />
            </div>
        </van-popup>

        <!-- 密码输入框 -->
        <van-popup v-model="unfriendVisbile" round style="overflow: visible" :style="{ marginTop: keyboardVisible ? '-1.4rem' : '0rem' }">
            <div class="unfriend-card">
                <div class="unfriend-content">
                    <div class="unfriend-code">
                        <span v-for="(str, index) in randomCode" :key="index">{{ str }}</span>
                    </div>
                    <div class="unfriend-text1">{{ $t("Please enter the number you see") }}</div>
                    <van-password-input :value="unfriendCode" :focused="keyboardVisible" @focus="onFocus" :length="4" :mask="false" />
                    <div class="unfriend-text2">{{ cpIndex === 0 ? $t("After passing the verification, the Lover relationship with him/her will be terminated.") : $t("After passing the verification, the Bestie relationship with him/her will be terminated.") }}</div>
                    <div class="unfriend-footer">
                        <div class="unfriend-btn unfriend-cancel" @click="closeKeyboard">{{ $t("Cancel") }}</div>
                        <div class="unfriend-btn unfriend-confirm" :class="[cpIndex === 0 ? 'love' : 'bestie', unfriendCode.length !== 4 ? 'disabled' : '']" @click="confirmUnfriend">{{ $t("Confirm") }}</div>
                    </div>
                </div>
                <img class="unfriend-bg" src="../../../assets/img/cp/help-bg.png" />
            </div>
        </van-popup>
        <!-- 数字键盘 -->
        <!-- <van-number-keyboard v-model="unfriendCode" :show="keyboardVisible" @blur="keyboardVisible = false" @show="showKeyboard" @hide="hideKeyboard" :z-index="3000" :maxlength="4" /> -->
        <Keyboard v-model="unfriendCode" :show="keyboardVisible" @blur="keyboardVisible = false"></Keyboard>
    </div>
</template>
<script>
import { getCpInfoAPI, removeCpAPI, getPrivilegesAPI } from "../api";
import { getSafeHeight, getLanguage } from "../../../lib/device";
import { getScrollTop, getQueryString } from "../../../lib/utils";
import { Downloader, Parser, Player } from "svga.lite";
import Keyboard from "../components/Keyboard.vue";
import { Toast } from "vant";
console.log(navigator.userAgent);

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
    components: { Keyboard },
    data() {
        return {
            locale,
            randomCode: "",
            unfriendCode: "",
            unfriendVisbile: false,
            keyboardVisible: false,
            completeShowKeyboard: false,
            helpVisible: false,
            tabIndex: 0,
            cpIndex: 0,

            bulletBarLeft: 0,
            bulletInterval: null,

            cpInfo: {},
            love_button_info: {},
            bestie_button_info: {},
            user_cp_love_info: {},
            user_bestie_infos: [],
            bulletList: [],
            bulletList1: [],
            bulletList2: [],
            unfriendUid: "",
            unfriendName: "",
            privilegeList: [],

            safe_height: "",
            onTop: true,

            loveSvga: "https://yaame-static.yaame.io/imgs/9e1f34ac39af45b0a332283d04d1a4ed.svga",
            bestieSvga: "https://yaame-static.yaame.io/imgs/fe2a1c3f1693409b831b417ad2401ec1.svga",
            svgaMap: {
                // "#id": Player实例,
            },
            hasReverse: false,
        };
    },
    async mounted() {
        // 获取默认tab
        const urlParams = new URLSearchParams(window.location.search);
        const paramValue = Number(urlParams.get('tab'));
        this.cpIndex = paramValue ? paramValue : 0;
        // 获取默认tab结束
        const safe_area = getSafeHeight() || 0;
        this.safe_height = (safe_area * 2) / 100 + "rem";
        window.addEventListener("scroll", this.pageChange, false);


        let res = await getCpInfoAPI();
        if (res.status === 1000) {
            this.cpInfo = res.data || {};
            this.love_button_info = res.data.love_button_info || {};
            this.bestie_button_info = res.data.bestie_button_info || {};
            this.user_cp_love_info = res.data.user_cp_love_info || {};
            this.user_bestie_infos = res.data.user_bestie_infos || [];
            this.bulletList = res.data.user_cp_invite_popup_infos || [];
            this.initScrollBullet();

            this.$nextTick(() => {
                this.initSVGAData(this.user_cp_love_info.cp_dynamic_icon || this.loveSvga, "#love-icon");
            });
        }

        getPrivilegesAPI().then((res) => {
            if (res.status === 1000) {
                this.privilegeList = res.data.privileges;
            }
        });
    },
    watch: {
        tabIndex() {
            this.updateInfo();
        },
        cpIndex() {
            this.updateInfo();
        },
    },
    methods: {
        showKeyboard() {
            console.log("showKeyboard");
            this.completeShowKeyboard = true;
        },
        hideKeyboard() {
            console.log("hideKeyboard");
            this.completeShowKeyboard = false;
        },
        closeKeyboard() {
            if (this.completeShowKeyboard) return false;
            this.unfriendVisbile = false;
        },
        onFocus() {
            this.keyboardVisible = true;
            document.activeElement.blur();
        },
        async initSVGAData(url, id) {
            if (this.svgaMap[id]) {
                this.svgaMap[id].clear && this.svgaMap[id].clear();
            }

            let downloader = new Downloader();
            // 默认调用 WebWorker 线程解析
            // 可配置 new Parser({ disableWorker: true }) 禁止
            let parser = new Parser();
            // #canvas 是 HTMLCanvasElement
            let player = new Player(id);

            // 加载静态动画
            const fileData = await downloader.get(url);
            let svgaData = await parser.do(fileData);

            player.set({ loop: 0 });

            await player.mount(svgaData);
            player.start();
            this.svgaMap[id] = player;
        },
        toPrivilege(index) {
            this.$router.push({
                path: "/privilege",
                query: {
                    index,
                },
            });
        },
        pageChange() {
            const scroll_top = getScrollTop();
            this.onTop = scroll_top <= 10;
        },
        toUser(uid) {
            location.href = `wlyaame://trend/user?uid=${uid}`;
        },
        back() {
            location.href = `wlyaame://webview/back`;
        },
        link(url) {
            if (!url) return false;
            location.href = url;
        },
        updateInfo() {
            getCpInfoAPI().then((res) => {
                if (res.status === 1000) {
                    this.cpInfo = res.data || {};
                    this.love_button_info = res.data.love_button_info || {};
                    this.bestie_button_info = res.data.bestie_button_info || {};
                    this.user_cp_love_info = res.data.user_cp_love_info || {};
                    this.user_bestie_infos = res.data.user_bestie_infos || [];

                    if (this.cpIndex === 0) {
                        this.$nextTick(() => {
                            this.initSVGAData(this.user_cp_love_info.cp_dynamic_icon || this.loveSvga, "#love-icon");
                        });
                    } else {
                        this.$nextTick(() => {
                            if (this.user_bestie_infos.length) {
                                this.user_bestie_infos.forEach((item, index) => {
                                    this.initSVGAData(item.cp_dynamic_icon, `#bestie-icon_${index}`);
                                });
                            } else {
                                this.initSVGAData(this.bestieSvga, `#bestie-icon`);
                            }
                        });
                    }
                }
            });
        },
        // 初始化弹幕
        initScrollBullet() {
            if (!this.bulletList.length) return false;
            let arr = [];
            while (arr.length < 30) {
                arr = [...arr].concat(this.bulletList);
            }
            this.bulletList1 = arr.splice(0, 30);
            this.bulletList2 = [...this.bulletList1].reverse();

            this.$nextTick(() => {
                let flag = document.getElementById("bulletFlag");
                if (flag) {
                    this.bulletInterval = setInterval(() => {
                        if (flag.offsetLeft <= 0) {
                            this.bulletBarLeft = 0;
                        }
                        this.bulletBarLeft += 0.5;
                    }, 10);
                }
            });
        },
        getRandomCode() {
            return Math.floor(Math.random() * 10);
        },
        showUnfriendVisible(uid, name) {
            this.unfriendUid = uid;
            this.unfriendName = name;
            this.randomCode = "";
            for (let i = 0; i < 4; i++) {
                this.randomCode += this.getRandomCode();
            }
            this.unfriendCode = "";
            this.unfriendVisbile = true;
            this.keyboardVisible = true;

            // 阿语反密码文字及输入方向
            if (this.locale === "ar") {
                this.randomCode = this.randomCode.split("").reverse().join("");
                if (!this.hasReverse) {
                    this.$nextTick(() => {
                        let inputBar = document.querySelector(".van-password-input__security");
                        let childrenInputs = [...inputBar.childNodes].reverse();
                        inputBar.innerHTML = "";
                        childrenInputs.forEach((item) => {
                            inputBar.appendChild(item);
                        });
                        this.hasReverse = true;
                    });
                }
            }
        },
        confirmUnfriend() {
            if (this.completeShowKeyboard) return false;
            if (this.unfriendCode.length !== 4) return false;
            let isCorrect = this.locale === "ar" ? this.randomCode.split("").reverse().join("") == this.unfriendCode : this.randomCode == this.unfriendCode;
            Toast.loading({
                message: "",
                duration: 0,
            });
            if (isCorrect) {
                removeCpAPI({
                    cp_relation_type: this.cpIndex === 0 ? "LOVER" : "BESTIE",
                    relation_uid: this.unfriendUid,
                }).then((res) => {
                    let text = "";
                    if (this.cpIndex === 0) {
                        text = this.$t("You have terminated Lover relationship with", { name: this.unfriendName });
                    } else {
                        text = this.$t("You have terminated Bestie relationship with", { name: this.unfriendName });
                    }
                    Toast(text);
                    location.href = "wlyaame://webview/refresh";
                    this.updateInfo();
                    this.unfriendVisbile = false;
                });
            } else {
                Toast(this.cpIndex === 0 ? this.$t("Verification failed, the relationship cannot be terminated") : this.$t("Verification failed, Bestie relationship cannot be terminated"));
                this.unfriendVisbile = false;
            }
        },
    },
};
</script>
<style scoped lang="less">
.index-container {
    background-color: #a086ab;
    position: relative;
    overflow: hidden;
    .header {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 10;
        box-sizing: border-box;
        transition-duration: 0.2s;
        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.15rem 0.3rem 0.3rem;
            .tabs {
                position: relative;
                width: 4.2rem;
                height: 0.6rem;
                border-radius: 0.34rem;
                background-color: rgba(255, 255, 255, 0.2);
                transition-duration: 0.2s;
                display: flex;
                box-sizing: border-box;
                padding: 0 0.04rem;
                z-index: 10;
                &.white {
                    background-color: rgba(0, 0, 0, 0.2);
                }
                .tab {
                    width: 50%;
                    flex: auto;
                    font-size: 0.24rem;
                    line-height: 1;
                    text-align: center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    position: relative;
                    font-weight: bold;
                    z-index: 2;
                    transition-duration: 0.2s;
                }
                .tab-slide {
                    position: absolute;
                    top: 0.04rem;
                    left: 0.04rem;
                    width: 2.04rem;
                    height: 0.52rem;
                    background-color: #fff;
                    z-index: 1;
                    border-radius: 0.34rem;
                    transition-duration: 0.2s;
                }
            }
            .back {
                width: 0.48rem;
                height: 0.48rem;
            }
            .help {
                width: 0.48rem;
                height: 0.48rem;
            }
        }
    }

    .cp-content {
        position: relative;
        min-height: 100vh;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: top;
        transition-duration: 0.2s;
        display: flex;
        flex-direction: column;
        align-items: center;
        &.love {
            background-image: url("../../../assets/img/cp/bg-love.png");
        }
        &.bestie {
            background-image: url("../../../assets/img/cp/bg-bestie.png");
        }
        .bullet-box {
            position: absolute;
            width: 100%;
            left: 0;
            display: flex;
            .bullet-bar {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                flex-wrap: nowrap;
                width: auto;
                .bullet {
                    flex: none;
                    display: flex;
                    align-items: center;
                    border-radius: 0.34rem;
                    box-sizing: content-box;
                    border: 0.02rem solid rgba(255, 255, 255, 0.4);
                    margin-right: 0.6rem;
                    &.flag {
                        background-color: #fff;
                    }
                    .bullet-avatar {
                        flex: none;
                        width: 0.36rem;
                        height: 0.36rem;
                        border-radius: 50%;
                        margin: 0.08rem;
                        background-color: #efefef;
                        background-repeat: no-repeat;
                        background-size: contain;
                        background-position: center;
                        box-sizing: border-box;
                    }
                    .bullet-text {
                        flex: none;
                        font-size: 0.2rem;
                        line-height: 1;
                        color: #fff;
                    }
                }
            }
        }

        .cp-btns {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 6.6rem;
            margin-bottom: 0.2rem;
            .cp-btn {
                width: 2.4rem;
                height: 1rem;
                &.love-btn {
                    left: 1.2rem;
                }
                &.bestie-btn {
                    right: 1.2rem;
                }
            }
        }
        .love-content,
        .bestie-content {
            width: 6.9rem;
            margin: 0 auto;
            border-radius: 0.24rem;
            font-size: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-bottom: 0.4rem;
            transition-duration: 0.2s;
            margin-bottom: 0.3rem;
            .top-banner {
                width: 100%;
                margin-bottom: 0.35rem;
            }
            .relationship-card {
                overflow: hidden;
                width: 6.36rem;
                height: 4.26rem;
                background-repeat: no-repeat;
                background-size: contain;
                background-position: center;
                transition-duration: 0.2s;
                margin-bottom: 0.2rem;
                .relationship-info {
                    display: flex;
                    justify-content: center;
                    margin-top: 0.8rem;
                    .relationship-user {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        width: 1.48rem;
                        .relationship-avatar {
                            width: 1.48rem;
                            height: 1.48rem;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            margin-bottom: 0.11rem;
                            border-radius: 50%;
                            background-repeat: no-repeat;
                            background-size: contain;
                            background-position: center;
                            .relationship-avatar-img {
                                width: 1.4rem;
                                height: 1.4rem;
                                border-radius: 50%;
                                background-repeat: no-repeat;
                                background-size: contain;
                                background-position: center;
                            }
                        }
                        .relationship-name {
                            width: 100%;
                            font-size: 0.24rem;
                            line-height: 0.3rem;
                            color: #333;
                            text-align: center;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                    }
                    .relationship-link {
                        position: relative;
                        width: 1.26rem;
                        height: 0.8rem;
                        margin-top: 0.32rem;
                        .relationship-link-icon1 {
                            width: 1.34rem;
                            height: 0.19rem;
                            position: absolute;
                            top: 0.31rem;
                            left: -0.04rem;
                        }
                        .relationship-link-icon2 {
                            width: 0.8rem;
                            height: 0.8rem;
                            position: absolute;
                            top: 0;
                            left: 0.23rem;
                        }
                    }
                }
                .relationship-footer {
                    margin-top: 0.9rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .relationship-progress {
                        position: relative;
                        flex: none;
                        width: 4.44rem;
                        height: 0.26rem;
                        border-radius: 0.13rem;
                        margin: 0 0.08rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        overflow: hidden;
                        .relationship-progress-bar {
                            position: absolute;
                            top: 0;
                            left: 0;
                            height: 100%;
                            border-radius: 0.13rem;
                            transition-duration: 1s;
                            z-index: 1;
                        }
                        span {
                            position: relative;
                            color: rgba(255, 255, 255, 0.6);
                            font-size: 0.18rem;
                            line-height: 1;
                            z-index: 2;
                            margin-top: 0.04rem;
                        }
                    }
                    .relationship-lv {
                        flex: none;
                        color: #fff;
                        font-size: 0.24rem;
                        line-height: 1;
                    }
                }
            }
            .invite-card {
                background-color: #e4e9ff;
                width: 6.1rem;
                display: flex;
                flex-direction: column;
                align-items: center;
                border-radius: 0.24rem;
                .invite-title {
                    font-size: 0.3rem;
                    line-height: 1;
                    font-weight: bold;
                    color: #333;
                    text-align: center;
                    margin: 0.4rem 0 0.3rem;
                }
                .invite-gift {
                    width: 2.18rem;
                    height: 2.18rem;
                    margin-bottom: 0.2rem;
                }
                .invite-text1 {
                    font-size: 0.3rem;
                    line-height: 1;
                    color: #333;
                    margin-bottom: 0.18rem;
                    padding: 0 0.2rem;
                    text-align: center;
                }
                .invite-text2 {
                    font-size: 0.24rem;
                    line-height: 1;
                    color: #999;
                    margin-bottom: 0.4rem;
                    padding: 0 0.2rem;
                    text-align: center;
                }
                .invite-text3 {
                    font-size: 0.24rem;
                    line-height: 1;
                    margin-bottom: 0.4rem;
                    padding: 0 0.2rem;
                    text-align: center;
                }
                .invite-btn {
                    width: 4.7rem;
                    height: 1rem;
                    background-repeat: no-repeat;
                    background-size: contain;
                    background-position: center;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-bottom: 0.2rem;
                    font-size: 0.32rem;
                    font-weight: bold;
                    color: #fff;
                    img {
                        width: 0.28rem;
                        height: 0.28rem;
                    }
                }
            }
        }
        .unfriend-link {
            font-size: 0.24rem;
            line-height: 1;
            text-align: center;
            text-decoration: underline;
            margin: 0.15rem 0 0.2rem;
            color: #999;
            &.unfriend-link-bestie {
                margin: 0.15rem 0 0.75rem;
            }
        }
        .love-content {
            background: linear-gradient(180deg, #ffffff 0%, #fff5ed 100%);
            .relationship-card {
                background-image: url("../../../assets/img/cp/love-card.png");
                .relationship-footer {
                    .relationship-progress {
                        background-color: #c20049;
                        border: 0.02rem solid #FCA1BD;
                        .relationship-progress-bar {
                            background: linear-gradient(180deg, #fd95a6 0%, #ef286e 100%);
                        }
                    }
                }
                .relationship-info {
                    .relationship-user {
                        .relationship-avatar {
                            background-image: url("../../../assets/img/cp/love-avatar-bg.png");
                        }
                    }
                }
            }

            .invite-card {
                background-color: #ffece4;
                .invite-text3 {
                    color: #ef8686;
                }
                .invite-btn {
                    background-image: url("../../../assets/img/cp/love-invite-btn.png");
                }
            }
        }
        .bestie-content {
            background: linear-gradient(180deg, #ffffff 0%, #edeeff 100%);
            .relationship-card {
                background-image: url("../../../assets/img/cp/bestie-card.png");
                .relationship-footer {
                    .relationship-progress {
                        background-color: #3400c2;
                        border: 0.02rem solid #B1C5FC;
                        .relationship-progress-bar {
                            background: linear-gradient(180deg, #ade6ff 0%, #4452e2 100%);
                        }
                    }
                }
                .relationship-info {
                    .relationship-user {
                        .relationship-avatar {
                            background-image: url("../../../assets/img/cp/bestie-avatar-bg.png");
                        }
                    }
                }
            }
            .invite-card {
                background-color: #e4e9ff;
                .invite-text3 {
                    color: #a386ef;
                }
                .invite-btn {
                    background-image: url("../../../assets/img/cp/bestie-invite-btn.png");
                }
            }
        }
    }
    .privilege-content {
        position: relative;
        min-height: 100vh;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: top;
        background-color: #a086ab;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 0.3rem;
        .privilege-bg {
            position: absolute;
            width: 100%;
            top: 0;
            left: 0;
        }
        .privilege-card {
            margin-top: 2rem;
            position: relative;
            width: 6.9rem;
            border-radius: 0.24rem;
            background: linear-gradient(180deg, #fffbf4, #ffffff);
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            padding: 0.3rem 0.26rem 0;
            box-sizing: border-box;
            justify-content: space-between;
            border: 0.03rem solid #fff;
            z-index: 2;
            .privilege-card-bg {
                width: 100%;
                position: absolute;
                top: 0;
                left: 0;
            }
            .privilege-box {
                position: relative;
                width: 3.07rem;
                // height: 3.79rem;
                display: flex;
                justify-content: center;
                align-items: center;
                background: linear-gradient(180deg, rgba(255, 255, 255, 0), #ffe9da);
                margin-bottom: 0.22rem;
                border-radius: 0.2rem;
                z-index: 2;
                padding: 0.02rem 0;
            }
            .privilege-item {
                border-radius: 0.18rem;
                width: 3.03rem;
                // height: 3.75rem;
                background: linear-gradient(180deg, rgba(255, 219, 219, 0.4), rgba(255, 255, 255, 1));
                display: flex;
                flex-direction: column;
                align-items: center;
                .privilege-img {
                    width: 2.55rem;
                    height: 2.55rem;
                    display: flex;
                    justify-content: center;
                    align-content: center;
                    margin: 0.2rem 0 0.2rem;
                    background-repeat: no-repeat;
                    background-size: contain;
                    background-position: center;
                }
                .privilege-name {
                    font-size: 0.24rem;
                    line-height: 1;
                    color: #333;
                    font-weight: bold;
                    margin-bottom: 0.18rem;
                    text-align: center;
                    padding: 0 0.2rem;
                }
                .privilege-lv {
                    display: flex;
                    align-items: center;
                    margin-bottom: 0.2rem;
                    span {
                        font-size: 0.2rem;
                        line-height: 1;
                        color: #999;
                        margin: 0 0.1rem;
                    }
                }
            }
        }
    }
    .help-card {
        position: relative;
        border-radius: 0.24rem;
        background: linear-gradient(180deg, #dce8ff 0%, #ffffff 100%);
        width: 6.3rem;
        box-sizing: border-box;
        padding: 0.6rem 0.53rem;
        .help-content {
            position: relative;
            z-index: 2;
            display: flex;
            flex-direction: column;
            align-items: center;
            .help-title {
                font-size: 0.34rem;
                line-height: 1;
                color: #333;
                font-weight: bold;
                text-align: left;
                width: 100%;
                margin-bottom: 0.4rem;
            }
            .help-text {
                font-size: 0.26rem;
                line-height: 0.38rem;
                color: #666;
                text-align: left;
                width: 100%;
            }
            .help-btn {
                width: 3.9rem;
                height: 0.88rem;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 0.32rem;
                color: #fff;
                margin-top: 0.5rem;
                background-repeat: no-repeat;
                background-size: contain;
                background-position: center;
                &.love {
                    background-image: url("../../../assets/img/cp/love-help-btn.png");
                }
                &.bestie {
                    background-image: url("../../../assets/img/cp/bestie-help-btn.png");
                }
            }
        }

        .help-img {
            width: 2.2rem;
            height: 2.2rem;
            position: absolute;
            top: -0.97rem;
            right: -0.2rem;
            z-index: 2;
        }
        .help-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
        }
    }
    .unfriend-card {
        position: relative;
        border-radius: 0.24rem;
        background: linear-gradient(180deg, #dce8ff 0%, #ffffff 100%);
        width: 6.3rem;
        box-sizing: border-box;
        padding: 0.8rem 0.8rem 0.6rem;
        .unfriend-content {
            position: relative;
            z-index: 2;
            display: flex;
            flex-direction: column;
            align-items: center;
            .unfriend-code {
                margin-bottom: 0.5rem;
                display: flex;
                justify-content: center;
                span {
                    font-size: 0.82rem;
                    line-height: 1;
                    color: #333;
                    font-weight: bold;
                    margin: 0 0.23rem;
                }
            }
            .unfriend-text1 {
                font-size: 0.26rem;
                line-height: 0.37rem;
                margin-bottom: 0.2rem;
                color: #333;
                text-align: left;
                width: 100%;
            }
            .unfriend-text2 {
                font-size: 0.24rem;
                line-height: 0.3rem;
                margin: 0.3rem 0 0.5rem;
                color: #999;
                text-align: left;
                width: 100%;
            }
            .unfriend-footer {
                display: flex;
                justify-content: center;
                align-items: center;
                .unfriend-btn {
                    width: 2rem;
                    height: 0.88rem;
                    border-radius: 0.5rem;
                    font-size: 0.3rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-weight: bold;
                    margin: 0 0.15rem;
                }
                .unfriend-cancel {
                    background-color: #ededed;
                    color: #666;
                }
                .unfriend-confirm {
                    background-repeat: no-repeat;
                    background-size: contain;
                    background-position: center;
                    color: #fff;
                    &.disabled {
                        opacity: 0.4;
                    }
                    &.love {
                        background-image: url("../../../assets/img/cp/love-unfriend-btn.png");
                    }
                    &.bestie {
                        background-image: url("../../../assets/img/cp/bestie-unfriend-btn.png");
                    }
                }
            }
        }

        .unfriend-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
        }
    }
}
</style>
<style lang="less">
.van-password-input {
    width: 100%;
    margin: 0;
    .van-password-input__security {
        width: 100%;
        justify-content: space-between;
        .van-password-input__item {
            width: 1rem;
            height: 1rem;
            flex: none !important;
            border-radius: 0.24rem;
            background-color: #edeff7 !important;
        }
    }
}
.van-password-input__security::after {
    border: none;
}
.van-password-input__item::after {
    border: none;
}
</style>
