/*
 * @Author: Elk
 * @Date: 2023-04-07 11:00:26
 * @FilePath: /yaame-h5/src/pages/levelPrivileges/levelPrivileges.js
 * @Description: 
 */
import Vue from 'vue';

import App from './levelPrivileges.vue';
import './../../assets/css/reset.css';
import FastClick from 'fastclick';
import Vuei18n from "vue-i18n";
Vue.use(Vuei18n);
import en from "./locale/en-US";
import id from "./locale/in-ID";
import zh from "./locale/zh-CN";
import tw from "./locale/zh-TW";
import ar from "./locale/ar-SA";
import { getLanguage } from '../../lib/device';
import { getQueryString } from '../../lib/utils';
import wealthLevel from "@/lib/request/wealthLevel";
let locale = getLanguage() || 'ar';

if (getQueryString('language')) {
    locale = getQueryString('language');
}
if (['zh-hk', 'zh-tw', 'zh-mo', 'zh-cn'].indexOf(locale) > -1) {
    let localEnum = {
        'zh-hk': 'tw',
        'zh-tw': 'tw',
        'zh-mo': 'tw',
        'zh-cn': 'zh',
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
        ar
	},
});
;

if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function () {
        FastClick.attach(document.body);
    }, false);
}
// 存取数据减少接口调用
let wealthData = null;
let level_type = Number(getQueryString("active") || 0) ? 'popular' : 'wealth'
wealthLevel.getWealthLevel({ level_type }).then(res => {
    wealthData = res;
    if (res.data.new_wealth_flag === 1) {
        if (Number(getQueryString("active") || 0)) { // 判断是否访问
            new Vue({
                i18n,
                data() {
                    return {
                        wealthData,  // 将获取的数据注入到 Vue 实例中
                    };
                },
                render: h => h(App),
            }).$mount('#app');
            return;
        }
        // 获取当前页面的完整URL
        let fullUrl = window.location.href;
        let url = new URL(fullUrl);
        let protocol = url.protocol;
        let host = url.host;
        let domain = `${protocol}//${host}`;
        window.location.href = domain + '/wealthClass.html'
    } else {
        new Vue({
            i18n,
            data() {
                return {
                    wealthData,  // 将获取的数据注入到 Vue 实例中
                };
            },
            render: h => h(App),
        }).$mount('#app');
    }
}).catch((err) => {
    console.log(err)
})