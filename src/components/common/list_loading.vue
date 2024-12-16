<!--
 * @Author: Elk
 * @Date: 2023-01-05 15:04:17
 * @FilePath: /yaame-h5/src/components/common/list_loading.vue
 * @Description: 
-->
<template>
    <div class="list-loading">
        <p>{{ text }}</p>
        <div class="point-list">
            <span class="point point1"></span>
            <span class="point point2"></span>
            <span class="point point3"></span>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            text: {
                type: String,
                default: 'loading'
            }
        }
    };
</script>
<style scoped>
    @keyframes point {
        100% {
            transform: scale(0);
            -webkit-transform: scale(0);
        }
    }
    
    .list-loading {
        margin-top: 1rem;
        font-size: 0.3rem;
        color: #999;
        line-height: 1rem;
        display: flex;
        justify-content: center;
    }
    
    .point-list {
        display: flex;
        justify-content: center;
        margin-top: 0.45rem;
    }
    
    .point-list .point {
        display: block;
        width: .1rem;
        height: .1rem;
        margin-left: .26rem;
        border-radius: 100%;
        background-color: #999;
        animation: point 1.5s infinite;
    }
    
    .point-list .point2 {
        animation-delay: 0.25s;
    }
    
    .point-list .point3 {
        animation-delay: 0.5s;
    }
</style>