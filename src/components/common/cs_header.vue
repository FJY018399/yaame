<template>
    <!-- <div v-if="!is_show_header" :style="{'background-color': back_color}" :class="['header-box', {'active': is_show, 'header-white': color === 'white', 'posFix': posFix}]">
          <div ref="header" :style="{height: safe_height}"></div>
          <div class="header-item">
              <div class="back-icon" @click="back">
                  <img v-if="is_show || color === 'blank'" src="../../assets/img/common/icon_back_blank.png" alt="">
                  <img v-if="color === 'white' && !is_show" src="../../assets/img/common/icon_back_white.png" alt="">
              </div>
              {{ title }}
              <div v-if="right_text" class="right" @click="right">{{ right_text }}</div>
              <img v-if="right_img" :src="rightImg" class="right_img" @click="right" />
          </div>
      </div> -->

    <div v-if="!is_show_header" :class="{ active: is_show, 'eid-ai-adha': is_show && color === 'eid' }" :style="{'background-color': back_color}" class="header-box">
        <div :style="{ height: safeHeightShow ? safe_height : '0.3rem' }"></div>
        <div class="header-item">
            <div :class="['back-icon', 'back-icon-' + language]" @click="back">
                <img v-if="is_show || color === 'blank'" src="../../assets/img/common/icon_back_blank.png" alt="" />
                <img v-if="color === 'white' && !is_show" src="../../assets/img/common/icon_back_white.png" alt="" />
                <img v-if="color === 'song' && !is_show" src="https://yaame-static.yaame.io/admin/64351398519fe5021b9cdea20668e5ed.png" alt="" />
                <img v-if="color === 'song' && is_show" src="../../assets/img/common/icon_back_blank.png" alt="" />
                <img v-if="color === 'harvest' && !is_show" src="https://yaame-static.yaame.io/admin/184fddf6c01320296eddb45f4614d7ac.png" alt="" />
                <img v-if="color === 'harvest' && is_show" src="../../assets/img/common/icon_back_blank.png" alt="" />
                <img v-if="color === 'eid'" src="../../assets/img/common/icon_back_white.png" alt="" />
            </div>

            <span v-if="!is_show" :style="{ color: color === 'eid' ? '#fff' : '#393939', ...headStyle }">{{ apparentTitle }}</span>

            <!--规则-->
            <div v-if="color === 'eid'" @click.self="cutRule" class="rule" :style="{ right: language === 'ar' ? '' : '0.3rem', left: language === 'ar' ? '0.3rem' : '' }"></div>

            <template v-if="is_show">
                <span v-if="document_title" :style="{ color: '#393939' }">{{ document_title }}</span>
                <span v-else-if="title" :style="{ color: color === 'white' ? '#fff' : '#393939' }">{{ title }}</span>
                <span v-else>
            <slot name="default"></slot>
        </span>
            </template>

            <span v-else-if="keep && title" :style="{ color: color === 'white' ? '#fff' : '#393939' }">{{ title }}</span>
            <span v-else-if="keep" :style="{ color: color === 'white' ? '#fff' : '#393939' }"><slot name="default"></slot></span>
            <div v-if="right_text" :style="{ color: color === 'white' ? '#fff' : '#393939' }" :class="['right', 'right-' + language]" @click="right">
                <img :src="right_img" class="right_img" />
                {{ right_text }}
            </div>
        </div>
    </div>
</template>
<script>
/*
    back_type: 默认是back，调用wlyaame://webview/back，逐级返回；pop 直接关闭webview
    custom_back: 默认false，调用scheme；设置为true时，需配置onCustomBack回调方法
    */
import { getScrollTop, getQueryString } from '../../lib/utils';
import { getSafeHeight, getLanguage } from '../../lib/device';
import { nextTick } from 'vue';
export default {
    props: {
        title: {
            type: String,
            default: '',
        },
        color: {
            type: String,
            default: 'blank',
        },
        custom_back: {
            type: Boolean,
            default: false,
        },
        back_type: {
            type: String,
            default: 'back',
        },
        right_text: {
            type: String,
            default: '',
        },
        right_img: {
            type: String,
            default: '',
        },
        keep: {
            type: Boolean,
            default: false,
        },
        keepColor: {
            type: Boolean,
            default: true,
        },
        back_color: {
            type: String,
            default: '',
        },
        safeHeightShow: {
            type: Boolean,
            default: true,
        },
        apparentTitle : {
            type: String,
            default: ''
        },
        domMain: {
            type: HTMLDivElement,
            default: true
        },
        headStyle: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            safe_height: 0,
            is_show: false,
            is_show_header: getQueryString('popup') || false,
            posFix: false,
            document_title: '',
        };
    },
    computed: {
        language() {
            return getLanguage();
        },
    },
    mounted() {
        const safe_area = getSafeHeight() || 0;
        this.safe_height = (safe_area * 2) / 100 + 'rem';
        nextTick(() => {
            this.domMain.addEventListener('scroll', this.pageChange, false);
        })
    },
    beforeDestroy() {
        this.domMain.removeEventListener('scroll', this.pageChange);
    },
    methods: {
        back() {
            if (this.custom_back) {
                this.$emit('onCustomBack');
                return;
            }
            location.href = `wlyaame://webview/${this.back_type}`;
        },
        pageChange() {
            const scroll_top = this.domMain.scrollTop;
            if (scroll_top > 10) {
                if (this.keep) {
                    this.is_show = true;
                    if (this.keepColor) {
                        this.is_show = false
                    } else {
                        this.is_show = true;
                    }
                } else {
                    this.is_show = true;
                    this.document_title = document.title
                }
                this.posFix = true;

            } else {
                this.is_show = false;
                this.posFix = false;
                this.document_title = '';
            }
        },
        right() {
            this.$emit('rightCall');
        },
        cutRule () {
            this.$emit('cut');
        }
    },
};
</script>
<style scoped>
.header-box {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    z-index: 2;
    background-color: transparent;
}
.header-item {
    position: relative;
    min-height: 0.88rem;
    font-family: PingFangSC-Semibold;
    font-size: 0.38rem;
    color: #393939;
    font-weight: bold;
    line-height: 0.88rem;
    text-align: center;
    transition: background-color 0.5s ease-in;
}
.header-white .header-item {
    color: #fff;
}
.header-white .header-item .right {
    color: rgba(255, 255, 255, 0.8);
}
.active {
    background-color: #fff;
    position: fixed;
    z-index: 999;
}
.posFix {
    position: fixed;
    z-index: 999;
}
.header-white.active .header-item {
    color: #393939;
}
.header-white.active .header-item .right {
    color: #333;
}
.back-icon img {
    position: absolute;
    width: 0.4rem;
    height: 0.4rem;
    left: 0.4rem;
    top: 0.24rem;
}
.back-icon.back-icon-ar img {
    right: 0.4rem;
    left: auto;
    transform: rotate(180deg);
}
.right {
    position: absolute;
    line-height: 0.88rem;
    right: 0.3rem;
    top: 0;
    font-size: 0.28rem;
    color: #333;
    font-weight: normal;
}
.right-ar {
    left: 0.4rem;
    right: auto;
}
.right_img {
    height: 0.42rem;
    width: auto;
    vertical-align: middle;
}
.eid-ai-adha {
    background-color: #005F56;
}
.rule {
    position: absolute;
    top: .2rem;
    width: .48rem;
    height: .48rem;
    background: url("https://yaame-static.yaame.io/admin/723610fa08958f12d511b10814514ba1.png") no-repeat;
    background-size: contain;
}
</style>
