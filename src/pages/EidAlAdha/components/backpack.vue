<!--
 * @Author: Elk
 * @Date: 2024-06-10 10:48:29
 * @FilePath: /yaame-h5/src/pages/EidAlAdha/components/backpack.vue
 * @Description: 
-->
<template>
	<Popup class="backpack">
		<div class="reward-container">
			<div class="popup-header">
				<span class="header-content">{{ $t("bag") }}</span>
			</div>

			<div
				v-show="ingredients_list && ingredients_list.length"
				class="reward-content"
			>
				<div
					v-for="(item, index) in ingredients_list"
					:key="index"
					:class="['reward-item', 'reward-item' + item.rarity]"
				>
					<div class="img-div">
						<img :src="item.icon" alt="" />
						<div class="img-num">{{ item.count }}</div>
					</div>
					<div class="item-name">{{ item.name }}</div>
				</div>
			</div>

			<div v-show="ingredients_list.length === 0" class="reward-empty">
                <div class="empty-core">
                    <img src="https://yaame-static.yaame.io/admin/b6fea5512d62aacfcb7e78a78a1b7fec.png" alt="">
                    <p>{{ $t("NotOnTheListYet") }}</p>
                </div>
			</div>

			<div class="close-btn" @click="close()">
			</div>
		</div>
	</Popup>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, computed } from "vue";
import { getLanguage } from "@/lib/device";
import { getBagApi } from "../api.js";
import Popup from "@/components/common/pop_up";
const root = getCurrentInstance();
const emits = defineEmits(["close"]);
let language = computed(() => {
	let locale = getLanguage() || "en";
	if (["zh-hk", "zh-tw", "zh-mo", "zh-cn", "zh_cn"].indexOf(locale) > -1) {
		let localEnum = {
			"zh-hk": "zh-tw",
			"zh-tw": "zh-tw",
			"zh-mo": "zh-tw",
			"zh-cn": "zh-cn",
			zh_cn: "zh-cn",
		};

		locale = localEnum[locale];
	}
	return locale;
});

let ingredients_list = ref([]);
const getBag = async () => {
    let res = await getBagApi();
    if (res.status === 1000) {
        ingredients_list.value = res.data.ingredients_list;
    }
};

const close = () => {
    emits("close");
};

onMounted(() => {
    getBag();
});
</script>

<style lang="less" scoped>
.backpack {
	display: flex;
	justify-content: center;
	align-items: center;
	.reward-container {
		width: 6.9rem;
		height: 7.94rem;
		background-size: contain;
		background-repeat: no-repeat;
		background-image: url(https://yaame-static.yaame.io/admin/eb902f6aa3fc920ee1dd9d68ce79b713.png);
		position: relative;
		padding-top: 0.3rem;

		.reward-content {
			width: 6.9rem;
			height: 6.2rem;
			overflow-y: scroll;
			margin-top: 0.34rem;
			margin-left: 0.44rem;
			display: flex;
			flex-wrap: wrap;
			.reward-item {
				width: 1.94rem;
				height: 2.7rem;
				margin-right: 0.10rem;
                background-color: #FEEAC0;
                border-radius: 0.12rem;
                margin-bottom: 0.1rem;
                padding-top: 0.07rem;
				&:nth-child(3n) {
					margin-right: 0;
				}
                &.reward-item1 {
                    .img-div {
                        background-image: url(https://yaame-static.yaame.io/admin/3fd4abe9f46e05f796c08fb73ac9efae.png);
                    }
                }
                &.reward-item2 {
                    
                    .img-div {
                        background-image: url(https://yaame-static.yaame.io/admin/eabfb391292b27e164deed2fce7e84d4.png);
                    }
                }
				.img-div {
					width: 1.84rem;
					height: 1.84rem;
                    margin-left: 0.05rem;
					background-size: contain;
                    background-repeat: no-repeat;
                    background-image: url(https://yaame-static.yaame.io/admin/0516a1ab286afdf037e38a01c409e56f.png);
					display: flex;
					justify-content: center;
					align-items: center;
					position: relative;
					img {
						width: 1.2rem;
						height: 1.2rem;
					}
					.img-num {
						position: absolute;
						left: 0.1rem;
						top: 0.1rem;
						width: 0.59rem;
						height: 0.29rem;
						background: linear-gradient(180deg, #ffd87d 0%, #ffb700 100%);
						box-shadow: inset 0px 0px 0.12rem 0px rgba(255, 255, 255, 0.5);
						border-radius: 0.15rem;
						text-align: center;
						line-height: 0.3rem;
						font-weight: 600;
						font-size: 0.18rem;
						color: #62330c;
					}
				}
				.item-name {
					width: 1.94rem;
					text-align: center;
					margin-top: 0.06rem;

                    font-weight: 600;
                    font-size: 0.18rem;
                    color: #62330C;
				}
			}
		}
		.reward-empty {
			width: 6.9rem;
			height: 6.64rem;
            // background-color: #fff;
			display: flex;
			justify-content: center;
			align-items: center;
			font-weight: 400;
			font-size: 0.26rem;
			color: #ffffff;
            .empty-core {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                align-items: center;
                img {
                    width: 0.89rem;
                    height: 1.06rem;
                }
                p {
                    width: 6.9rem;
                    margin-top: 0.4rem;
                    text-align: center;
                    color: #FFF89F;
                }
            }
		}
		.close-btn {
			width: 0.5rem;
			height: 0.5rem;
			background-size: contain;
			background-repeat: no-repeat;
			background-image: url(https://yaame-static.yaame.io/admin/40b31f437fb27d24313849c57e7a5f4f.png);
			position: absolute;
			left: 3.2rem;
			bottom: -0.9rem;
		}
	}
	.popup-header {
		width: 6.9rem;
		height: 0.5rem;
		text-align: center;
		.header-content {
			font-weight: 600;
			font-size: 0.36rem;
			color: #f1c58b;
			position: relative;
			&::after {
				content: "";
				display: block;
				width: 0.68rem;
				height: 0.32rem;
				background-size: contain;
				background-repeat: no-repeat;
				background-image: url(https://yaame-static.yaame.io/admin/e7a35ce40628ac621713453535c44dd0.png);
				position: absolute;
				left: -0.76rem;
				top: 0.04rem;
			}
			&::before {
				content: "";
				display: block;
				width: 0.68rem;
				height: 0.32rem;
				background-size: contain;
				background-repeat: no-repeat;
				background-image: url(https://yaame-static.yaame.io/admin/7bc494f79c70097eed327be7c26478b6.png);
				position: absolute;
				right: -0.76rem;
				top: 0.04rem;
			}
		}
	}
}
</style>
