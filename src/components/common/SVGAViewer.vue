<!--
 * @Author: Elk
 * @Date: 2023-06-03 19:00:38
 * @FilePath: /yaame-h5/src/components/common/SVGAViewer.vue
 * @Description: 
-->
<template>
	<div class="svga-viewer">
		<canvas id="canvas" class="animation-container" ref="animationContainer"></canvas>

        <img src="../../assets/img/common/profile_icon_close@2x.png" alt="" class="close-img" @click="close()">

        <div v-if="loading" class="loader"></div>
	</div>
</template>

<script>
import { Downloader, Parser, Player } from "svga.lite";
export default {
	data() {
		return {
			downloader: null,
			parser: null,
			player: null,

            loading: true,
		};
	},
	methods: {
		async loadSVGA() {
            if (this.downloader) {
                this.downloader.destroy();
                this.parser.destroy();
                this.player.destroy();
            }
            this.downloader = new Downloader();
            this.parser = new Parser();
            this.player = new Player('#canvas');
            const fileData = await this.downloader.get(this.svgaUrl);
            const svgaData = await this.parser.do(fileData);

            await this.player.mount(svgaData);
            this.player.$on('end', () => this.$emit('close'));
            this.player.$on('start', () => this.loading = false);

            this.player.set({ loop: 1 });
            this.player.start();
        },
        close() {
            this.$emit('close');
        },
	},
	watch: {
		svgaUrl(val) {
			if (val) {
                this.loadSVGA();
			}
		},
	},
	props: {
		svgaUrl: {
			type: String,
			required: true,
		},
	},
};
</script>

<style lang="less">
.svga-viewer {
	position: fixed;
    top: 0;
    left: 0;
	width: 100vw;
	height: 100vh;
    z-index: 9999;
    background-color: rgba(0, 0, 0, 0.6);
	.animation-container {
		width: 100%;
		height: 100%;
	}
    .close-img{
        position: absolute;
        top: 1.2rem;
        right: 0.6rem;
        width: 0.32rem;
        height: 0.32rem;
    }
}
.loader {
    position: absolute;
    width: 0.7rem;
    height: 0.7rem;
    left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

/* 创建加载图案的圆圈 */
.loader::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 4px solid #ccc;
    border-top-color: #000;
    animation: spin 1s linear infinite;
}

/* 创建加载图案的旋转动画 */
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>
