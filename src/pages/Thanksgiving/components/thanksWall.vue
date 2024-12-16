<!-- 感恩墙弹框 -->
<template>
    <pop_up v-show="submitShow" :visible="submitShow" class="flex-container">
        <div class="submit-container">
            <!-- 头部标题 -->
            <div class="head">{{ $t("thanksgiving_wall_title") }}</div>
            <!-- 文案说明 -->
            <div class="submit-info">
                {{ $t('write_thank_on_wall') }}
            </div>
            <!-- 内容框 -->
            <div class="submit-textarea">
                <textarea
                    :placeholder="t('write_your_blessings')"
                    v-model="submitText"
                    :maxlength="dealCurrentMaxLen(submitText, 100)"
                ></textarea>

                <div class="refresh-btn" @click="refreshText">
                    <img
                        src="https://yaame-static.yaame.io/admin/52f9a937413de664e486aa444afb7d45.png"
                        alt=""
                    />
                    {{ $t("random") }}
                </div>

                <div class="text-length">
                    <span>{{ submitText.length }}</span
                    >/100
                </div>
            </div>

            <div class="submit-footer-info">{{ $t('choose_style_to_thank') }}</div>

            <div class="btn-list">
                <div class="btn" :style="{ opacity: submitText.length ? 1 : 0.6 }" @click="submitWish(0)">
                    <img
                        class="btn-img"
                        :src="btnImg.one.btn[language]"
                        alt=""
                    />
                    <img
                        class="btn-info-img"
                        :src="btnImg.one.info[language]"
                        alt=""
                    />
                </div>
                <div class="btn" :style="{ opacity: submitText.length ? 1 : 0.6 }" @click="submitWish(1)">
                    <img
                        class="btn-img"
                        :src="btnImg.two.btn[language]"
                        alt=""
                    />
                    <img
                        class="btn-info-img"
                        :src="btnImg.two.info[language]"
                        alt=""
                    />
                </div>
            </div>

            <img
                class="close-icon"
                src="https://yaame-static.yaame.io/admin/bcabf23a6123e17b13beb1c1fce817e1.png"
                @click="closeSubmit"
                alt=""
            />
        </div>
    </pop_up>
</template>
<script setup>
import pop_up from "@/components/common/pop_up.vue";
import { computed, getCurrentInstance, ref, watch } from "vue";
import { getLanguage, isIOS } from "@/lib/device";
import { Toast } from "vant";
import { postBlessingApi } from "@/pages/Thanksgiving/api";

const props = defineProps({
    thankfulStatus: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits();

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

// 控制弹窗
let submitShow = ref(false);
let submitText = ref("");
watch(
    () => props.thankfulStatus,
    (value) => {
        submitShow.value = value;
    }
);
const closeSubmit = () => {
    submitText.value = "";
    emit('call-parent-method');
};

let refreshTextList = [
    "happy_thanksgiving",
    "wish_all_beauty",
    "i_love_yaame",
    "wish_health",
    "wonderful_2024",
    "happy_everyday",
    "wish_happiness",
    "thank_meeting",
    "thankful_lucky",
    "wish_yaame_better",
    "wish_health_happiness",
    "wish_dreams_come_true",
];
const refreshText = () => {
    let key = refreshTextList[random(0, refreshTextList.length - 1)];
    submitText.value = t(key);
};
// 随机函数
const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

// 计算苹果回车换行多出字符问题
const dealCurrentMaxLen = (str, maxLen) => {
    if (isIOS()) {
        let reg = /\n/g;
        let lineNum = str.match(reg);
        return lineNum ? lineNum.length + maxLen : maxLen;
    } else {
        return maxLen;
    }
};

// 按钮多语言
const btnImg = ref({
    one: {
        btn: {
            "zh-cn":
                "https://yaame-static.yaame.io/admin/02bb8da28b86cf291f2cac240a46ccba.png",
            "zh-tw":
                "https://yaame-static.yaame.io/admin/02bb8da28b86cf291f2cac240a46ccba.png",
            en: "https://yaame-static.yaame.io/admin/814000632af7041174bae312244c46a2.png",
            id: "https://yaame-static.yaame.io/admin/7eae0ab709d0877b4adea2742a2b3988.png",
            ar: "https://yaame-static.yaame.io/admin/29fe1c9682180ecb013ec17e46963e6e.png",
        },
        info: {
            "zh-cn":
                "https://yaame-static.yaame.io/admin/7206e7da550d1132f3a9dcede200051f.png",
            "zh-tw":
                "https://yaame-static.yaame.io/admin/91711bb17c004014ecdb5f33796d5938.png",
            en: "https://yaame-static.yaame.io/admin/b064267bf3103df979407ab527d8b822.png",
            id: "https://yaame-static.yaame.io/admin/4177942dff8d4262cbecf92c0a8f1187.png",
            ar: "https://yaame-static.yaame.io/admin/baa1e733e1b64ef412e1c4d7e9aaa820.png",
        },
    },
    two: {
        btn: {
            "zh-cn":
                "https://yaame-static.yaame.io/admin/64a89f71060bf0a790939680c7d6bc7c.png",
            "zh-tw":
                "https://yaame-static.yaame.io/admin/64a89f71060bf0a790939680c7d6bc7c.png",
            en: "https://yaame-static.yaame.io/admin/be46b2f70ad40dcd05fca80fbb961bc4.png",
            id: "https://yaame-static.yaame.io/admin/ba05832853318e1db76dc5bd5a5bc2f1.png",
            ar: "https://yaame-static.yaame.io/admin/ad9b15f2af961352b37c427b8971d5fd.png",
        },
        info: {
            "zh-cn":
                "https://yaame-static.yaame.io/admin/93847a8fd53e5c4b8882e26052af674f.png",
            "zh-tw":
                "https://yaame-static.yaame.io/admin/07b85a7d866a361fdc22e9375795f6de.png",
            en: "https://yaame-static.yaame.io/admin/6926d1842b7bc924b7712057d672cecb.png",
            id: "https://yaame-static.yaame.io/admin/caecfbfccc3845f18c1142ce1871a183.png",
            ar: "https://yaame-static.yaame.io/admin/83097ce9d66d44db310395f5d1a7db36.png",
        },
    },
});

// 发送祝福
const submitWish = async (val) => {
    if (!submitText.value) {
        Toast(t('text_cannot_be_empty'))
        return;
    }
    // 提交
    let res = await postBlessingApi({
        blessing_content: submitText.value,
        pay_status: val,
    });
    if (res.status === 6600) {
        Toast(res.desc);
        window.location.href = "wlyaame://mine/shop/diamond?popup=1";
        return;
    }
    if (res.status !== 1000) {
        Toast(res.desc);
        return;
    }
    Toast(t("message_sent"));
    closeSubmit();
};
</script>
<style scoped lang="less">
.flex-container {
    display: flex;
    justify-content: center;
    align-items: center;
    .submit-container {
        width: 6.81rem;
        height: 9.7rem;
        background-image: url(https://yaame-static.yaame.io/admin/1de6db8e20f45677a27ee75932a1dd3e.png);
        background-size: contain;
        background-repeat: no-repeat;
        padding: 1.99rem 0.5rem 0;
        position: relative;
        .head {
            position: absolute;
            top: 1.09rem;
            left: 50%;
            transform: translateX(-50%);
            height: 0.32rem;
            font-weight: 600;
            font-size: 0.34rem;
            color: #770402;
            line-height: 0.32rem;
            text-align: center;
            white-space: nowrap;
        }
        .submit-info {
            width: 5.85rem;
            height: 1.13rem;
            font-weight: 600;
            font-size: 0.28rem;
            color: #fff;
            line-height: 1.2;
        }
        .submit-textarea {
            position: relative;
            width: 5.85rem;
            height: 3rem;
            background: #ee8810;
            border-radius: 0.18rem;
            border: 0.04rem solid #ffe8ac;
            textarea {
                width: 5.85rem;
                height: 2rem;
                border: none;
                font-weight: 600;
                font-size: 0.28rem;
                background-color: transparent;
                padding: 0.3rem;
                color: #fff;
                &::placeholder {
                    color: #ffffff;
                    white-space: nowrap;
                    opacity: 0.7;
                }
            }
            .refresh-btn {
                height: 0.36rem;
                font-weight: 600;
                font-size: 0.28rem;
                color: #ffffff;
                line-height: 0.36rem;
                position: absolute;
                left: 0.18rem;
                bottom: 0.15rem;
                img {
                    width: 0.36rem;
                    height: 0.36rem;
                    margin-right: 0.08rem;
                }
            }
            .text-length {
                position: absolute;
                right: 0.18rem;
                bottom: 0.15rem;
                font-size: 0.28rem;
                color: rgba(255, 255, 255, 0.6);
                span {
                    color: #fff;
                }
            }
        }
        .submit-footer-info {
            margin-top: 0.25rem;
            margin-bottom: 0.43rem;
            font-weight: 500;
            font-size: 0.24rem;
            color: #fff;
            text-align: center;
        }
        .btn-list {
            display: flex;
            justify-content: space-between;
            .btn {
                width: 2.48rem;
                height: 1.04rem;
                position: relative;
                transition-duration: .2s;
                .btn-img {
                    width: 2.48rem;
                    height: 1.04rem;
                }
                .btn-info-img {
                    width: 2.3rem;
                    height: 0.75rem;
                    position: absolute;
                    left: 0.1rem;
                    top: 1.1rem;
                }
            }
        }
        .close-icon {
            position: absolute;
            width: 0.5rem;
            height: 0.5rem;
            left: 3.17rem;
            bottom: -1.1rem;
        }
    }
}
</style>
