<template>
	<!-- :head-height="50" :pull-distance="0" -->
	<van-pull-refresh
		v-model="isLoading"
		class="wl-refresh"
		@refresh="onRefresh"
		:pulling-text="pullingText"
		:loosing-text="loosingText"
        :loading-text="loadingText"
        :success-text="successText"
	>
		<!-- 下拉提示，通过 scale 实现一个缩放效果 -->
		<!-- <template #pulling="props">
            <loading :options="pullOptions" :height="40" :width="40" />
        </template> -->

		<!-- 释放提示 -->
		<!-- <template #loosing>
            <loading :options="loosingOptions" :height="40" :width="40" />
        </template> -->

		<!-- 加载提示 -->
		<!-- <template #loading>
            <loading :options="loadingOptions" :height="40" :width="40" />
        </template> -->
		<slot />
	</van-pull-refresh>
</template>

<script>
/**
 * 页面下拉刷新组件
 */

import Vue from "vue";
import { PullRefresh } from "vant";
// import Loading from '../lottie/loading.vue';
// import LoadingAnimationData from '../../assets/lottie/data.json';

Vue.use(PullRefresh);

export default {
	name: "Refresh",
	components: {
		// Loading,
	},
	props: {},
	data() {
		return {
			isLoading: false,
			// loadingOptions: { animationData: LoadingAnimationData },
			// pullOptions: { animationData: LoadingAnimationData, loop: false },
			// loosingOptions: { animationData: LoadingAnimationData, loop: false },
			// loosing_anim: {},
		};
	},
    computed: {
        pullingText() {
            if (this.$t) {
                return this.$t('pullingText');
            } else {
                return 'Pull down to refresh';
            }
        },
        loosingText() {
            if (this.$t) {
                return this.$t('loosingText');
            } else {
                return 'Loosen to refresh';
            }
        },
        loadingText() {
            if (this.$t) {
                return this.$t('loadingText');
            } else {
                return 'Loading';
            }
        },
        successText() {
            if (this.$t) {
                return this.$t('successText');
            } else {
                return 'Refresh success';
            }
        },
    },
	methods: {
		onRefresh() {
			this.$emit("onRefresh");
		},
		// handleAnimation: function (anim) {
		//     this.loosing_anim = anim;
		// },
	},
};
</script>

<style scoped></style>
