<!-- 飘屏 -->
<template>
    <div class="floating">
        <vue-danmaku
            v-if="screenList?.length"
            class="barrage-container"
            ref="danmaku"
            v-model="screenList"
            randomChannel
            use-slot
            loop
            :top="10"
            :right="4"
            :speeds="60"
            :channels="2"
        >
            <template slot="dm" slot-scope="{ index, danmu }">
                <div :class="['screen-item', danmu.pay_status && 'screen-item--vip']">
                    <div v-if="danmu.pay_status === 0" class="avatar">
                        <img v-show="imageLoadedStatus[index]" :src="danmu.avatar" @load="handleImageLoad(index, danmu)"
                             alt=""
                        />
                        <img v-show="!imageLoadedStatus[index]" src="../../../assets/img/deficiency.png" alt="">
                    </div>
                    <div v-else class="avatar--vip">
                        <div
                            class="avatar-address"
                        />
                        <img v-show="imageLoadedStatus[index]" class="avatar-img" :src="danmu.avatar"
                             @load="handleImageLoad(index, danmu)" alt=""
                        />
                        <img v-show="!imageLoadedStatus[index]" class="avatar-img"
                             src="../../../assets/img/deficiency.png" alt=""
                        >
                    </div>
                    <p>
                        {{
                            danmu.blessing_content.replace(/\n/g, "") ||
                            "-"
                        }}
                    </p>
                </div>
            </template>
        </vue-danmaku>
    </div>
</template>
<script setup>
    import { ref, set, watch } from "vue";
    import vueDanmaku from "vue-danmaku";

    // 页面数据
    const props = defineProps({
        floatingList: {
            type: Object,
            required: () => {},
        }
    });

    // 飘屏数据
    let screenList = ref([]);

    // 存储当前加载状态
    const imageLoadedStatus = ref({});

    // 处理当前加载赋值
    const handleImageLoad = (index, danmu) => {
        set(imageLoadedStatus.value, index, true);
    }
    // 给定默认值
    screenList.value.forEach((_,index) => {
        set(imageLoadedStatus.value, index, false);
    })

    watch(() => props.floatingList, (value) => {
        if (value) {
            screenList.value = value.carousels;
        } else screenList.value = [];
    })
</script>
<style scoped lang="less">
.floating {

    .barrage-container {
        width: 7.5rem;
        height: 1.58rem;
        position: absolute;
        top: 4.8rem;
    }

    .screen-item {
        display: inline-block;
        height: 0.54rem;
        background: #FF8001;
        border-radius: 0.27rem;
        border: 0.02rem solid #ffefaa;
        opacity: 0.9;
        line-height: 0.54rem;
        padding: 0 0.17rem 0 0.5rem;
        font-weight: 400;
        font-size: 0.2rem;
        color: #ffffff;
        &--vip {
            background: linear-gradient( 180deg, #FF9641 0%, #FF3500 100%);
            border: 0.02rem solid #FFECAD;
            font-weight: 400;
            font-size: 0.2rem;
            color: #FFECAD;
        }
        .avatar {
            width: 0.62rem;
            height: 0.62rem;
            border: 0.02rem solid #ffefaa;
            overflow: hidden;
            position: absolute;
            left: -0.16rem;
            top: 0.02rem;
            border-radius: 50%;
            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
        }
        .avatar--vip {
            width: 0.62rem;
            height: 0.70rem;
            position: absolute;
            left: -0.2rem;
            top: -0.04rem;
            .avatar-address {
                width: 0.62rem;
                height: 0.70rem;
                position: absolute;
                z-index: 2;
                left: 0;
                top: 0;
                background: url("https://yaame-static.yaame.io/admin/dd9fed103eaddf31b8aac983de3c18db.png") no-repeat;
                background-size: contain;
            }
            .avatar-img {
                width: 0.58rem;
                height: 0.58rem;
                border-radius: 50%;
                position: absolute;
                top: 0.09rem;
                left: 0.02rem;
            }
        }
    }
}
</style>