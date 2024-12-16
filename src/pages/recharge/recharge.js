/*
 * @Author: ZhaoZhiqi
 * @Date: 2023-10-26 10:41:53
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-08-02 16:00:55
 * @Description:
 * @FilePath: /yaame-h5/src/pages/recharge/recharge.js
 */
import Vue from "vue";
import App from "./recharge.vue";
import { Empty, Loading, Button, Popover, Popup, Picker, Field } from "vant";

Vue.use(Empty);
Vue.use(Loading);
Vue.use(Button);
Vue.use(Popover);
Vue.use(Popup);
Vue.use(Picker);
Vue.use(Field);

import Vuei18n from "vue-i18n";
Vue.use(Vuei18n);
import en from "./locale/en-US";
import id from "./locale/in-ID";
import zh from "./locale/zh-CN";
import tw from "./locale/zh-TW";
import ar from "./locale/ar-SA";
import { getLanguage } from "../../lib/device";
import { getQueryString } from "../../lib/utils";
let locale = getLanguage() || "en";

if (getQueryString("language")) {
    locale = getQueryString("language");
}
if (['zh-hk', 'zh-tw', 'zh-mo', 'zh-cn', 'zh_cn'].indexOf(locale) > -1) {
    let localEnum = {
        'zh-hk': 'tw',
        'zh-tw': 'tw',
        'zh-mo': 'tw',
        'zh-cn': 'zh',
        "zh_cn": "zh",
    };

    locale = localEnum[locale];
}
const i18n = new Vuei18n({
    locale, // 语言
    messages: {
        en, // 文案的英文版
        id,
        zh,
        tw,
        ar,
    },
});

new Vue({
    i18n,
    render: (h) => h(App),
}).$mount("#app");
