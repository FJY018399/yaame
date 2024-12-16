<template>
    <div class="my-tabs">
        <div class="tabs-bar">
            <div class="tabs-bar-nav">
                <div 
                    v-for="(tab,index) in tab_list"
                    :key="index"
                    :class="[tab_index == tab.index ? 'tabs-active' : '']"
                    class="tabs-tab" 
                    @click="changeTab(tab)">
                    {{ tab.name }}
                </div>
            </div>
        </div>
        <div class="tabs-content fadeInRight">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Tab',
        props: {
            tab_list: {
                type: Array,
                require: true,
                default: () => {
                    return [];
                }
            },
            tab_index: {
                type: Number,
                require: false,
                default: 0
            },
        },
        methods: {
            changeTab(tab) {
                this.$emit('changeTab', tab);
            }
        }
    };
</script>

<style scoped>
    .my-tabs {
        font-size: .34rem;
        color: #494949;
    }
    
    .tabs-bar {
        position: relative;
    }
    
    .tabs-bar-nav {
        display: flex;
        justify-content: center;
    }
    
    .tabs-tab {
        padding: .13rem 0;
        position: relative;
        width: 2.1rem;
        text-align: center;
        cursor: pointer;
    }
    
    .tabs-active::after {
        content: '';
        display: block;
        width: .28rem;
        height: 0.06rem;
        background-image: linear-gradient(-45deg, #FF4343 0%, #FF755E 100%);
        border-radius: 8px;
        position: absolute;
        bottom: 0;
        left: 50%;
        margin-left: -.15rem;
    }
    
    .tabs-active {
        font-weight: bold;
        font-size: 0.36rem;
    }
</style>