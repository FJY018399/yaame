<template>
    <div :style="{width: width}" class="triangle">
        <span :style="{width: width}" />
        <span :style="{width: width}" />
    </div>
</template>
<script>
    export default {
        props: {
            width: {
                type: String,
                default: '0.15rem'
            },
            color: {
                type: String,
                default: '#000'
            }
        }
    };
</script>
<style scoped>
    .triangle {
        display: inline-block;
        position: relative;
        vertical-align: middle;
    }
    
    .triangle span {
        width: 0.2rem;
        height: 0.04rem;
        background-color: #333;
        position: absolute;
        right: 0;
        top: 0;
    }
    
    .triangle span:first-child {
        transform: rotate(45deg);
        transform-origin: top right;
    }
    
    .triangle span:last-child {
        transform: rotate(-45deg);
        transform-origin: top right;
    }
</style>