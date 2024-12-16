<template>
	<div class="main">
		<Header color="white">{{ $t('title') }}</Header>

        <img class="title-img" :src="titleImgList[language]" alt="">

        <!-- <video ref="video" class="video-container" controls poster preload="auto" src="https://yaame-static.yaame.io/imgs/80bd310b8f78422d947dfdc0d07b5276.mp4" type="video/mp4"></video> -->
        <!-- <video ref="video" class="video-container" controls poster preload="auto" src="https://yaame-static.yaame.io/admin/bec3e1fdea31c864944253601cc5bfbf.mp4" type="video/mp4"></video> -->
        <video ref="video" class="video-container" controls poster preload="auto" src="https://yaame-static.yaame.io/admin/d89b209149db7d4f414bc9fba42e2692.mp4" type="video/mp4"></video>

        <div class="play-btn" @click="playVideo">{{ $t('playVideo') }}</div>
        <div class="content">
            <p class="title-p">{{ $t('createRoom') }}</p>

            <img src="https://yaame-static.yaame.io/admin/08717f40cc47d4286a77c8af2756bd68.png" alt="">

            <p>{{ $t('createRoomMore') }}</p>

            <img src="https://yaame-static.yaame.io/admin/1d47018c27abbad5f8454bbacc38dd68.png" alt="">
            <p>{{ $t('clickKTVMode') }}</p>

            <img src="https://yaame-static.yaame.io/admin/03cd79cee2b1c30995ef6b60e166c00d.png" alt="">
            <p>{{ $t('clickSave') }}</p>

            <img src="https://yaame-static.yaame.io/admin/59245d252a80dcb7ab5e8949ac7472f3.png" alt="">
            <p>{{ $t('selectSong') }}</p>
        </div>
	</div>
</template>

<script setup>
import Header from "@/components/common/header.vue";
import { getLanguage } from "@/lib/device";
import { onMounted, ref, computed } from "vue";


let language = computed(() => {
    let locale = getLanguage() || "en";
    if (['zh-hk', 'zh-tw', 'zh-mo', 'zh-cn', 'zh_cn'].indexOf(locale) > -1) {
        let localEnum = {
            'zh-hk': 'zh-tw',
            'zh-tw': 'zh-tw',
            'zh-mo': 'zh-tw',
            'zh-cn': 'zh-cn',
            'zh_cn': 'zh-cn',
        };

        locale = localEnum[locale];
    }
    return locale;
});

const video = ref(null);
const playVideo = () => {
    if (video.value.paused) {
        video.value.play();
    } else {
        video.value.pause();
    }
};

let titleImgList = ref({
    'zh-cn': 'https://yaame-static.yaame.io/admin/586d367db355921ab93b158053e32943.png',
    'zh-tw': 'https://yaame-static.yaame.io/admin/45b5a148cec545c54395df6c0f1af25d.png',
    'en': 'https://yaame-static.yaame.io/admin/2625ea270c13738af37dcb4cf61f4d4c.png',
    'id': 'https://yaame-static.yaame.io/admin/554d34f95bbf80a0d5d64feb029712be.png',
    'ar': 'https://yaame-static.yaame.io/admin/b5467ed1e7928b4a658caf8788f47841.png',
})
</script>

<style scoped lang="less">
.main {
    width: 100vw;
    min-height: 100vh;
    background-size: contain;
    background-repeat: no-repeat;
    background-image: url('https://yaame-static.yaame.io/admin/e7f50cafefb30be938e93ff52b722bc2.png');
    padding-top: 8.27rem;
    position: relative;
    .title-img {
        width: 2.19rem;
        height: 0.66rem;
        position: absolute;
        left: 0.81rem;
        top: 3.18rem;
    }
    .play-btn {
        width: 2.18rem;
        height: 0.64rem;
        background-size: contain;
        background-repeat: no-repeat;
        background-image: url(https://yaame-static.yaame.io/admin/8fc5f21538d8ad18ba476287653e070a.png);

        text-align: center;
        line-height: 0.64rem;
        font-weight: 600;
        font-size: 0.24rem;
        color: #FFFFFF;
        position: absolute;
        left: 0.8rem;
        top: 4.26rem;
    }
    .video-container {
        width: 2.5rem;
        height: 5.26rem;
        border-radius: 0.3rem;
        border: 0.06rem solid rgba(255,255,255,0.6);
        position: absolute;
        left: 3.9rem;
        top: 1.68rem;
    }
    .content {
        width: 7.5rem;
        height: 19.66rem;
        background-size: 7.52rem 19.66rem;
        background-repeat: no-repeat;
        background-position-x: -0.01rem;
        background-image: url(https://yaame-static.yaame.io/admin/a672f52641961a83c4f87a12a60cd79f.png);
        padding: 0.6rem 0.57rem 0.8rem 0.57rem;

        font-weight: 600;
        font-size: 0.24rem;
        color: #D2CED8;
        .title-p {
            margin-top: 0;
            font-weight: 600;
            font-size: 0.3rem;
            text-align: left;
            margin-bottom: 0.46rem;
        }
        img {
            width: 6.58rem;
            height: auto;
        }
        p {
            text-align: center;
            margin-top: 0.28rem;
            margin-bottom: 0.36rem;
        }
    }
}
</style>
