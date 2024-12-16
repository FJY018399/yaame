<template>
    <div class="dot">
        <div :style="{ border: active ? '0.04rem solid #222222' : '0.04rem solid #999' }" class="outer">
            <div :style="{ backgroundColor: active ? '#222222' : '#999999' }" class="inner" />
            <div v-show="is_line" class="line" />
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            active: {
                type: Boolean,
                default: false
            },
            is_line: {
                type: Boolean,
                default: false
            }
        }
    };
</script>
<style scoped>
    .dot .outer {
        width: 0.36rem;
        height: 0.36rem;
        border-radius: 50%;
        background-color: #FFFFFF;
        border: 0.04rem solid #999999;
        display: flex;
        position: relative;
    }
    
    .dot .inner {
        width: 0.16rem;
        height: 0.16rem;
        background-color: #333;
        margin: auto;
        border-radius: 50%;
    }
    
    .dot .line {
        width: 0.03rem;
        height: 1rem;
        border: 1px dashed rgba(0, 0, 0, 0.15);
        position: absolute;
        top: 0.36rem;
        left: 50%;
        transform: translateX(-50%);
    }
</style>