<template>
    <div v-show="value" class="loading">
        <Spinner class="loading-icon" type="fading-circle"></Spinner>
    </div>
</template>

<script>
    import Spinner from './../third/spinner/spinner.vue';
    
    /**
     * 页面loading组件
     */
    export default {
        name: 'Loading',
        components: {
            Spinner,
        },
        props: {
            value: {
                type: Boolean,
                require: true,
                default: true,
            },
        },
        methods: {
        }
    };
</script>

<style scoped>
.loading {
    position: fixed;
    background-color: #fff;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: 99999;
}
.loading-icon {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
</style>