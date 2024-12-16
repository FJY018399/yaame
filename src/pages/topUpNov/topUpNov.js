import Vue from 'vue';
import App from './topUpNov.vue';
import './../../assets/css/reset.css';
import FastClick from 'fastclick';

if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}

new Vue({
    render: h => h(App),
}).$mount('#app');