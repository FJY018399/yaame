<!--
 * @Author: Se7enElk
 * @Date: 2022-03-29 14:33:46
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-12-03 17:19:46
 * @FilePath: /yaame-h5/src/pages/vip/views/rule.vue
 * @Description: 
-->
<template>
    <div :style="{ paddingTop: isFullScreen ? safe_height + 0.88 + 'rem' : '0.88rem' }" class="privilege">
        <header
            :style="{
                background: header_white ? '#30210E' : '',
                height: isFullScreen ? safe_height + 0.88 + 'rem' : '0.88rem',
            }"
            class="page_header"
        >
            <div class="back-img" @click="back">
                <img src="https://yaame-static.yaame.io/admin/2a3fcadb7a3b0bf487b8c7d548b1c5d8.png" />
            </div>
            <div class="header-content">{{ $t('vip_rule') }}</div>
        </header>

        <div class="content-box">
            <header class="content-header">{{ $t('buy_vip') }}</header>
            <p>{{ $t('buy_vip_1') }}</p>
        </div>
        <div class="content-box">
            <header class="content-header">{{ $t('auto_subscribe') }}</header>

            <p>{{ $t('auto_subscribe_1') }}</p>
        </div>
        <div class="content-box">
            <header class="content-header">{{ $t('vip_level') }}</header>

            <p>{{ $t('vip_level_1') }}</p>
        </div>

        <div class="content-box">
            <table class="content-table">
                <tr>
                    <th>{{ $t('vip_level') }}</th>
                    <th>{{ $t('wealth_level') }}</th>
                    <th>{{ $t('wealth_experience') }}</th>
                </tr>
                <tr v-for="(item, index) in Number(getVerCode()) < 11800 ? levelList : newlevelList" :key="index">
                    <td style="color: #efb379">{{ item.level }}</td>
                    <td>{{ item.wealthLevel }}</td>
                    <td>{{ item.wealthExperience }}</td>
                </tr>
            </table>
        </div>

        <div class="content-box">
            <header class="content-header">{{ $t('vip_level_up') }}</header>

            <p>{{ $t('vip_level_up_1') }}</p>
            <p>{{ $t('vip_level_up_2') }}</p>
            <p>{{ $t('vip_level_up_3') }}</p>
            <p>{{ $t('vip_level_up_4') }}</p>
        </div>
    </div>
</template>

<script>
import { getScrollTop } from '../../../lib/utils';
import { getSafeHeight, getVerCode } from '../../../lib/device';
export default {
    data() {
        return {
            safe_height: 0,
            header_white: false,

            levelList: [
                {
                    level: 'VIP 1',
                    wealthLevel: '0',
                    wealthExperience: '0',
                },
                {
                    level: 'VIP 2',
                    wealthLevel: '6',
                    wealthExperience: '60000',
                },
                {
                    level: 'VIP 3',
                    wealthLevel: '8',
                    wealthExperience: '140000',
                },
                {
                    level: 'VIP 4',
                    wealthLevel: '10',
                    wealthExperience: '260000',
                },
                {
                    level: 'VIP 5',
                    wealthLevel: '13',
                    wealthExperience: '575000',
                },
                {
                    level: 'VIP 6',
                    wealthLevel: '16',
                    wealthExperience: '1090000',
                },
                {
                    level: 'VIP 7',
                    wealthLevel: '20',
                    wealthExperience: '2310000',
                },
                {
                    level: 'VIP 8',
                    wealthLevel: '24',
                    wealthExperience: '4570000',
                },
                {
                    level: 'VIP 9',
                    wealthLevel: '29',
                    wealthExperience: '9595000',
                },
                {
                    level: 'VIP 10',
                    wealthLevel: '36',
                    wealthExperience: '22350000',
                },
                {
                    level: 'VIP 11',
                    wealthLevel: '41',
                    wealthExperience: '37025000',
                },
                {
                    level: 'VIP 12',
                    wealthLevel: '46',
                    wealthExperience: '58700000',
                },
                {
                    level: 'VIP 13',
                    wealthLevel: '53',
                    wealthExperience: '105605000',
                },
            ],
            newlevelList: [
                {
                    level: 'VIP 1',
                    wealthLevel: '0',
                    wealthExperience: '0',
                },
                {
                    level: 'VIP 2',
                    wealthLevel: '13',
                    wealthExperience: '60000',
                },
                {
                    level: 'VIP 3',
                    wealthLevel: '16',
                    wealthExperience: '140000',
                },
                {
                    level: 'VIP 4',
                    wealthLevel: '18',
                    wealthExperience: '260000',
                },
                {
                    level: 'VIP 5',
                    wealthLevel: '21',
                    wealthExperience: '575000',
                },
                {
                    level: 'VIP 6',
                    wealthLevel: '24',
                    wealthExperience: '1090000',
                },
                {
                    level: 'VIP 7',
                    wealthLevel: '28',
                    wealthExperience: '2310000',
                },
                {
                    level: 'VIP 8',
                    wealthLevel: '32',
                    wealthExperience: '4570000',
                },
                {
                    level: 'VIP 9',
                    wealthLevel: '37',
                    wealthExperience: '9595000',
                },
                {
                    level: 'VIP 10',
                    wealthLevel: '44',
                    wealthExperience: '22350000',
                },
                {
                    level: 'VIP 11',
                    wealthLevel: '49',
                    wealthExperience: '37025000',
                },
                {
                    level: 'VIP 12',
                    wealthLevel: '54',
                    wealthExperience: '58700000',
                },
                {
                    level: 'VIP 13',
                    wealthLevel: '61',
                    wealthExperience: '105605000',
                },
            ],
        };
    },
    computed: {
        headerTop() {
            if (this.header_white) {
                return 0;
            } else {
                return this.safe_height;
            }
        },
        isFullScreen() {
            if (location.href.indexOf('is_full_screen') > -1) {
                return true;
            } else {
                return false;
            }
        },
    },
    mounted() {
        let safe_area = getSafeHeight() || 0;
        this.safe_height = (safe_area * 2) / 100;
        window.addEventListener('scroll', this.pageChange, false);
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.pageChange);
    },
    methods: {
        getVerCode,
        pageChange() {
            const scroll_top = getScrollTop();
            if (scroll_top > 10) {
                this.header_white = true;
            } else {
                this.header_white = false;
            }
        },
        back() {
            location.href = `wlyaame://webview/back`;
            // if (this.isFullScreen) {
            //     this.$router.back();
            // } else {
            //     location.href = `wlyaame://webview/pop`;
            // }
        },
    },
};
</script>

<style scoped lang="less">
.privilege {
    padding-top: 0.88rem;
    padding-left: 0.3rem;
    padding-right: 0.3rem;
    background-color: #30210e;
    padding-bottom: 0.01rem;
}
.page_header {
    display: flex;
    height: 0.88rem;
    line-height: 0.88rem;
    width: 100%;
    font-size: 0.34rem;
    color: #d9b99f;
    text-align: center;
    position: fixed;
    top: 0;
    left: 0;
    align-items: center;
    justify-content: center;
    z-index: 99;
    background-color: #30210e;
}
.back-img {
    width: 0.4rem;
    height: 0.3rem;
    position: absolute;
    left: 0.3rem;
    bottom: 0.24rem;
    img {
        height: 0.3rem;
        width: auto;
    }
}
.info-img {
    width: 0.4rem;
    height: 0.4rem;
    position: absolute;
    right: 0.3rem;
    bottom: 0.24rem;
}
.header-content {
    position: absolute;
    bottom: 0.24rem;
    height: 0.4rem;
    line-height: 0.4rem;
    left: 50%;
    transform: translate(-50%, -0%);
}
.content-box {
    width: 6.9rem;

    background: #5c3d1c;
    border-radius: 0.24rem;
    padding: 0.3rem;
    color: #c0a976;
    font-size: 0.24rem;
    margin-bottom: 0.2rem;
    border: 0.02rem solid #faecc4;
}
.active.content-box {
    padding-bottom: 0;
    border: 1px solid #ffd3b4;
}
.active.content-box > p {
    margin-bottom: 0.3rem;
    margin-top: 0.15rem;
}
.content-box > p {
    margin-top: 0.3rem;
}
.content-header {
    padding-left: 0.01rem;
    color: #fbebc1;
    font-size: 0.3rem;
    font-weight: 700;
}
.content-table {
    width: 6.3rem;
    border-radius: 0.12rem;
    border: 1px solid #b09a90;
    height: 6.75rem;
    margin-top: 0.3rem;
    border-collapse: unset;
    overflow: hidden;
}
th {
    color: #fff;
    font-size: 0.24rem;
    background-color: #462807;
    height: 0.84rem;
    border: 1px solid #b09a90;
    text-align: center;
    // line-height: 0.84rem;
}
td {
    background-color: #613b14;
    color: #ffece0;
    font-size: 0.28rem;
    height: 0.86rem;
    text-align: center;
    line-height: 0.86rem;
}
tr > th:nth-child(1) {
    width: 1.75rem;
    border: 1px solid #b09a90;
    color: #fae7b2;
    background: linear-gradient(180deg, #42290e 0%, #775320 100%);
}
tr > th:nth-child(2) {
    width: 2.54rem;
    border: 1px solid #b09a90;
    color: #fae7b2;
    background: linear-gradient(180deg, #42290e 0%, #775320 100%);
}
tr > th:nth-child(3) {
    width: 1.97rem;
    border: 1px solid #b09a90;
    color: #fae7b2;
    background: linear-gradient(180deg, #42290e 0%, #775320 100%);
}
tr > td:nth-child(1) {
    width: 1.75rem;
    border: 1px solid #b09a90;
}
tr > td:nth-child(2) {
    width: 2.54rem;
    border: 1px solid #b09a90;
}
tr > td:nth-child(3) {
    width: 1.97rem;
    border: 1px solid #b09a90;
}
</style>
