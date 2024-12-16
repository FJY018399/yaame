<template>
    <div class="main">
        <Header color="white">2024 New Year Party</Header>
        <img class="header-img" src="https://yaame-static.yaame.io/admin/27514778852268b2af50183ca2a9a441.png" alt="">

        <img class="header-btn bounceIn" @click="toPeakDuel" src="https://yaame-static.yaame.io/admin/e67f0c80a59894aec9e29b1d87f7b6a6.png" alt="">

        <img v-show="isShow" :style="{top: safeHeight + 0.88 + 'rem'}" class="top-img"  src="https://yaame-static.yaame.io/admin/e5f87ee778b06f73b1027d66115ef6cb.png" @click="toPeakDuel" alt="">

        <div class="letter-container">
            Untuk Pesta Tahun Baru 2024, tiga teratas di setiap papan
            peringkat, atau mereka yang telah mengisi ulang total 2000
            selama periode acara, akan mendapatkan undangan untuk
            menghadiri Pesta Tahun Baru Yaame 2024.
        </div>
        
        <div class="content-container">
            <p class="time">Time: 2024.02.03 16:00pm</p>
            <p class="address">Address: Henshin Rooftop Bar</p>
            Level 67-69, The Westin Jakarta Jalan H.R. Rasuna
            Said Kav. C-22A, RT.2/RW.5, Karet Kuningan,
            Setiabudi, South Jakarta City, Jakarta 12940
        </div>

        <p class="title">Lokasi Acara</p>

        <img class="address-img" src="https://yaame-static.yaame.io/admin/2952dac91e2c2ee4ea8cf4f650b2f3cb.png" alt="">
        <img class="address-img" src="https://yaame-static.yaame.io/admin/3e510d5891b62548cda0d67121e2c954.png" alt="">
        <img class="address-img" src="https://yaame-static.yaame.io/admin/aa9a3bc63f4daa2eed47f3c5889c6edd.png" alt="">

        <p style="margin-top: 0.12rem" class="info-p">Waktu Acara:2024-02-03  16:00:00</p>
        <p style="margin-top: 0.2rem" class="info-p">Yaame telah menyiapkan berbagai macam souvenir
            dan hadiah undian untuk semua yang hadir</p>

        <p class="title">Hadiah Event</p>
        <div class="gift-container">
            <div class="one">
                <img src="https://yaame-static.yaame.io/admin/39c2add0e3eb0353736f6f921e4c4993.png" alt="">
                <img src="https://yaame-static.yaame.io/admin/40682f5f2fd70208f2beb3d363ddd4a2.png" alt="">
                <img src="https://yaame-static.yaame.io/admin/69cee043a029b3ff9f31603da2f70389.png" alt="">
            </div>
            <div class="two">
                <img src="https://yaame-static.yaame.io/admin/67e3c3ddb278e5c15b783ca24f59a0bb.png" alt="">
                <img src="https://yaame-static.yaame.io/admin/86cbdf582c75f47503de738823bd8ee4.png" alt="">
            </div>
        </div>

        <p class="title">Alur Acara</p>

        <img class="bottom-img" src="https://yaame-static.yaame.io/admin/1c5a7f3ce6f47bba510ac8053c6090f4.png" alt="">
    </div>
</template>
<script setup>
    import Header from '@/components/common/header.vue';
    import { getSafeHeight } from '@/lib/device';
    import { onMounted, onUnmounted, ref } from 'vue';
    import { getScrollTop } from "@/lib/utils";

    let safeHeight = ref(0);

    let isShow = ref(false);
    const pageChange = () => {
        let value = getScrollTop();
        if (value > 220) {
            isShow.value = true;
        } else {
            isShow.value = false;
        }
    }

    const toPeakDuel = () => {
        if (window.location.origin.indexOf('test-yaame.yaame.net') > -1) {
            window.location.href = 'http://test-yaame.yaame.net/PeakDuel.html?is_full_screen=1';
        } else {
            window.location.href = 'https://yaame.yaame.net/PeakDuel.html?is_full_screen=1';
        }
    }
    onMounted(() => {
        safeHeight.value = ( getSafeHeight() * 2 ) / 100;
        window.addEventListener('scroll', pageChange);
    });
    onUnmounted(() => {
        window.removeEventListener('scroll', pageChange);
    });

</script>
<style scoped lang="less">
.main {
    width: 7.5rem;
    min-height: 100vh;
    font-size: 0.24rem;
    color: #fff;
    background-size: contain;
    background-repeat: no-repeat;
    position: relative;
    background-image: url(https://yaame-static.yaame.io/admin/a2ca262e6c7c9f944b945fb18ecf9ce1.png);
    padding-top: 6.6rem;
    padding-bottom: 0.5rem;
    .header-img {
        width: 7.11rem;
        height: 6.27rem;
        position: absolute;
        left: 0.2rem;
        top: 0.2rem;
    }
    .header-btn {
        width: 4.68rem;
        height: 1rem;
        position: absolute;
        left: 1.41rem;
        top: 5.1rem;
    }
    .top-img {
        width: 7.5rem;
        height: auto;
        position: fixed;
        left: 0;
        z-index: 3;
    }
    .letter-container {
        width: 7.5rem;
        height: 2.45rem;
        background-size: contain;
        background-repeat: no-repeat;
        background-image: url(https://yaame-static.yaame.io/admin/13cf728147788c89b8d5943f06be2c73.png);
        position: relative;
        z-index: 1;
        padding: 0.82rem 0.3rem 0.43rem;
        font-weight: 600;
        color: #B29677;
    }
    .content-container {
        margin-top: 0.38rem;
        margin-left: 0.16rem;
        width: 7.28rem;
        height: 5.48rem;
        background-size: contain;
        background-repeat: no-repeat;
        background-image: url(https://yaame-static.yaame.io/admin/e48cbbf0f407d4945088e8837e27a4bc.png);
        position: relative;
        padding: 2.26rem 0.5rem 0;
        color: #F9E299;
        .time, .address {
            width: 7.18rem;
            position: absolute;
            left: 0;
            top: 0.96rem;
            text-align: center;
            font-size: 0.26rem;
            font-weight: 400;
            color: #F9E299;
        }
        .address {
            top: 1.4rem;
        }
    }

    .title {
        width: 7.5rem;
        text-align: center;
        font-size: 0.3rem;
        font-weight: 600;
        color: #F9E299;
        margin-top: 0.6rem;
        margin-bottom: 0.18rem;
    }
    .address-img {
        width: 6.94rem;
        height: 2.45rem;
        margin-left: 0.28rem;
        margin-bottom: 0.16rem;
    }
    .info-p {
        width: 7.5rem;
        padding-left: 0.3rem;
        font-size: 0.26rem;
        font-weight: 600;
        color: #B29677;

    }
    .gift-container {
        width: 6.9rem;
        height: 4.55rem;
        margin-left: 0.3rem;
        .one {
            width: 6.9rem;
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.15rem;
            img {
                display: block;
                width: 2.2rem;
                height: 2.2rem;
            }
        }
        .two {
            width: 6.9rem;
            padding: 0 1.18rem;
            display: flex;
            justify-content: space-between;
            img {
                display: block;
                width: 2.2rem;
                height: 2.2rem;
            }
        }
    }
    .bottom-img {
        width: 6.95rem;
        height: 9.95rem;
        margin-left: 0.28rem;
        margin-top: 0.25rem;
    }
    .bounceIn {
        animation-name: zoomIn;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
        animation-direction: alternate;
        animation-delay: 0s;
        animation-duration: 4s;
    }
    @keyframes zoomIn {
        0% {
            transform: scale(1);
        }
        25% {
            transform: scale(1.1);
        }
        50% {
            transform: scale(1);
        }
        75% {
            transform: scale(1.1);
        }
    }
}
</style>