<template>
    <div>
        <div class="video" @click="play">
            <img v-show="show_btn" src="../../assets/img/cloud_party/icon_play.png" alt="">
            <video ref="video" :src="video" :autoplay="autoplay" preload="auto" muted webkit-playsinline="" playsinline="true" poster="" />
        </div>
    </div>
</template>

<script>

    export default {
        name: 'Video',
        props: {
            video: {
                type: String,
                require: true,
                default: ''
            },
            autoplay: {
                type: Boolean,
                require: true,
                default: true
            },
        },
        data() {
            return {
                show_btn: false,
            };
        },
        watch: {
            video: {
                handler: (new_url, old_url) => {
                    if (new_url !== old_url) {
                        const video = this.$refs.video;
                        video.load();
                        video.play();
                    }
                },
            }
        },
        mounted () {
            const video = this.$refs.video;
            video.addEventListener('ended', () => {
                this.show_btn = true;
            }, false);
        },
        methods: {
            play() {
                const video = this.$refs.video;
                this.show_btn = false;
                if (video.paused) {
                    video.play();
                }
            },
        }
    };
</script>


<style scoped>
    .video {
        object-fit: cover;
        width: 5.41rem;
        height: 5.41rem;
        background: #333;
        border-radius: .1rem;
        position: relative;
    }
    
    .video video {
        object-fit: cover;
        width: 5.41rem;
        height: 5.41rem;
        display: block;
        border-radius: .1rem;
    }
    
    .video img {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        margin: auto;
        width: 1.2rem;
        z-index: 99;
    }
    
    
</style>