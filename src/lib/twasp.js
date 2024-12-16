// import Vue from 'vue';
// import tWasp from 'twasp';

// Vue.use(tWasp);

// export default {
//     sendCustomLog(message) {
//         if (!message) return;
//         tWasp.sendCustomLog(message);
//     },

//     /**
//      * 
//      * @param {string} [platform]  - 平台信息
//      * @param {object} [extra = {uid, devid, version}] - 其他信息 包括用户uid, devid, 客户端version
//      */
//     init(platform, extra) {
//         tWasp.init({
//             platform: platform || 'MAYBEH5',
//             extra,
//             noReport: false
//         });
//     }
// };