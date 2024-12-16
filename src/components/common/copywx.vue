<template>
        <div class="copy-wx">
            <div class="inner">
                <div class="img-box">
                    <img src="./../../assets/img/img_gongzhonghao@3x.png">
                </div>
                <div class="btns">
                    <div class="cancel" @click="cancel">取消</div>
                    <div id="submit" class="submit" data-clipboard-target="#code">打开微信</div>
                </div>
                <div id="code">鹊桥</div>
            </div>
        </div>
    </template>

<script>
    import Clipboard from 'clipboard';
    import {
        openWechat
    } from './../../lib/utils.js';
    export default {
        mounted() {
            let clipboard = new Clipboard('.submit');

            clipboard.on('success', function(e) {
                openWechat();
                e.clearSelection();
            });
            clipboard.on('error', function(e) {
                openWechat();
            });
        },
        methods: {
            cancel() {
                this.$parent.show_modal = false;
            }
        }
    };
</script>

<style scoped>
    .copy-wx {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.6);
        z-index: 14;
    }
    
    .inner {
        width: 6.3rem;
        height: 4.38rem;
        background-color: #fff;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        margin: auto;
        -webkit-border-radius: 0.2rem;
        border-radius: 0.2rem;
    }
    
    .img-box {
        padding: 0.4rem 0.48rem;
    }
    
    .img-box img {
        width: 100%;
    }
    
    .btns {
        width: 98%;
        margin: 0 auto;
        height: 1rem;
        line-height: 1rem;
        font-size: 0.36rem;
        border-top: 0.02rem solid #efefef;
    }
    
    .btns div {
        float: left;
        width: 50%;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        text-align: center;
        color: #1E89F7;
    }
    
    .btns .cancel {
        border-right: 0.02rem solid #efefef;
        color: #8f8f8f;
    }
    
    #code {
        position: absolute;
        top: 0;
        left: 0;
        color: transparent;
        font-size: 0.24rem;
    }
</style>