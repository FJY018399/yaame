<!--
 * @Author: Elk
 * @Date: 2024-05-21 18:13:05
 * @FilePath: /yaame-h5/src/pages/AbundantHarvest/components/record.vue
 * @Description: 
-->
<template>
	<popup class="popup" @cancel="popupShow()">
		<div class="record">
            <p class="title">{{ $t('history') }}</p>

            <img class="close-img" src="https://yaame-static.yaame.io/admin/a1e88520a770dec837c6121dff417941.png" alt="" @click="popupShow()">

            <div v-show="recordList && recordList.length" class="content">
                <div v-for="(item, index) in recordList" :key="index" class="content-item">
                    <p class="item-time">{{ formatDate(item.time, 'yyyy.MM.dd hh:mm:ss') }}</p>
                    <div class="item-list">
                        <div v-for="(ele, inx) in item.content" :key="inx" class="item">
                            <template v-if="ele.icon">
                                <div class="item-img-div">
                                    <img :src="ele.icon" alt="">
                                </div>
                                <div class="item-img-info">
                                    +{{ ele.count }}
                                </div>
                            </template>
                            <template v-else>
                                <div class="item-img-div">
                                    <img src="https://yaame-static.yaame.io/admin/f9148a1b8ab1c0835397e1137d35c822.png" alt="">
                                </div>
                                <div class="item-img-info">
                                    +{{ ele.count }}
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>

            <div class="content">
                <img class="empty-img" src="https://yaame-static.yaame.io/admin/208c7a4c712d51daa876ec1b0b1c6dac.png" alt="">
                <p class="empty-p">{{ $t('no_cultivation') }}</p>
            </div>
        </div>
	</popup>
</template>

<script setup>
import { formatDate } from "@/lib/utils";
import popup from "@/components/common/pop_up.vue";
import { ref } from "vue";
const emits = defineEmits(["close"]);
const props = defineProps({
    list: {
		type: Array,
		default: [],
	},
});
let recordList = ref(props.list);

const popupShow = () => {
    console.log(11);
    emits('close'); 
};
</script>

<style lang="less" scoped>
.popup {
	display: flex;
	justify-content: center;
	align-items: center;
	.record {
		width: 6.43rem;
		height: 10.48rem;
		background-size: contain;
		background-repeat: no-repeat;
		background-image: url(https://yaame-static.yaame.io/admin/463cc24ceb0c07fe7163e170302d77bb.png);
        position: relative;
        .close-img {
            position: absolute;
            left: 2.96rem;
            bottom: -0.7rem;
            width: 0.5rem;
            z-index: 9;
            height: 0.5rem;
        }
        .title {
            padding-top: 0.5rem;
            width: 6.43rem;
            font-weight: 600;
            font-size: 0.42rem;
            color: #854015;
            text-align: center;
        }
        .content {
            width: 5.11rem;
            height: 8rem;
            margin-left: 0.66rem;
            margin-top: 0.52rem;
            overflow: hidden scroll;
            position: relative;
            .content-item {
                width: 5.11rem;
                height: 1.28rem;
                margin-bottom: 0.28rem;
                .item-time {
                    width: 5.11rem;
                    font-weight: normal;
                    font-size: 0.2rem;
                    color: #BF8865;
                }
                .item-list {
                    display: flex;
                    overflow-y: scroll;
                    width: 5.11rem;
                    height: 0.88rem;
                    .item {
                        width: auto;
                        display: flex;
                        align-items: center;
                        height: 0.88rem;
                        font-weight: normal;
                        font-size: 0.24rem;
                        color: #854015;
                        margin-right: 0.3rem;
                        .item-img-div {
                            width: 0.88rem;
                            height: 0.88rem;
                            background: #FDCC89;
                            border: 0.01rem solid #FFE8D2;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            border-radius: 50%;
                            img {
                                width: 0.6rem;
                                height: 0.6rem;
                            }
                        }
                        .item-img-info {
                            font-weight: normal;
                            font-size: 0.24rem;
                            color: #854015;
                            margin-left: 0.08rem;
                        }
                    }
                }
            }
            .empty-img {
                width: 0.84rem;
                height: 1rem;
                position: absolute;
                left: 2.1rem;
                top: 3rem;
            }
            .empty-p {
                width: 5.11rem;
                position: absolute;
                left: 0;
                top: 4.2rem;
                font-size: 0.2rem;
                text-align: center;
                color: #BF8865;
            }
        }
	}
	
}
</style>
