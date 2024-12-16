<template>
	<div>
		<div class="rank-container">
            <div class="rank-container-board"></div>

			<div class="top-container">
				<div
					v-for="(item, index) in topList"
					:class="['top-item', 'top-item-' + index]"
				>
					<div class="avatar" @click="toDetails(item)">
                        <img v-if="item.avatar" class="user-avatar" :src="item.avatar" alt="">
                        <img v-else class="user-avatar" src="https://yaame-static.yaame.io/admin/631c6ecc4a7f164e472fb32fd054c1ef.png" alt="">
					</div>

					<p class="user-name no-wrap" @click="toDetails(item)">{{ item.nick_name }}</p>
					<p v-if="!item.scheme_user_url" class="user-name no-wrap">ID: ******</p>
					<p v-else class="user-name no-wrap">ID: {{ item.yaame_id }}</p>
					<p class="user-value no-wrap">
						<img
							src="https://yaame-static.yaame.io/admin/4492982b4976bd984a52e2db65e7dcf8.png"
							alt=""
						/>
						{{ item.score }}
					</p>
				</div>
			</div>
			<div class="list-container">
				<div v-for="(item, index) in list" :key="index" class="list-item">
					<div class="sort">{{ index + 4 }}</div>
					<div class="item-avatar"  @click="toDetails(item)">
						<img v-if="item.avatar" :src="item.avatar" alt="" />
                        <img v-else src="https://yaame-static.yaame.io/admin/631c6ecc4a7f164e472fb32fd054c1ef.png" alt="">
					</div>
					<div class="item-info">
						<p class="no-wrap" @click="toDetails(item)">{{ item.nick_name }}</p>
						<p v-if="!item.scheme_user_url">ID: ******</p>
						<p v-else>ID: {{ item.yaame_id }}</p>
					</div>
					<div class="item-value">
						<img
							src="https://yaame-static.yaame.io/admin/4492982b4976bd984a52e2db65e7dcf8.png"
							alt=""
						/>
						{{ item.score }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { getRankApi } from '../api';
import { onMounted, ref } from 'vue';

let props = defineProps(['setRankMyList']);
let topList = ref([]);
let list = ref([]);
let diamond = ref([]);
const getDefaultUser = () => {
    return {
        avatar: 'https://static.yaame.io/admin/e4a419c9d7d94db41ea41e3f810a3759.png',
        nick_name: '',
        score: '-',
        yaame_id: '-'
    };
};
const getRank = async () => {
    const res = await getRankApi();
    if (res.status === 1000) {
        if (res.data.rank && res.data.rank.length >= 3) {
            topList.value = res.data.rank.slice(0, 3);
            list.value = res.data.rank.slice(3);
        } else {
            topList.value = res.data.rank;
            list.value = [];

            while (topList.value.length < 3) {
                topList.value.push(getDefaultUser());
            }
        
        }
        diamond.value = res.data.rank_rewards;
        diamond.value.splice(4);
        // 底部进度数据
        props.setRankMyList(res.data.my_rank_info);
    }
};

const toDetails = (item) => {
    if (item.is_mystery === 1) {
        return
    }
	if (item.scheme_user_url) {
		location.href = item.scheme_user_url;
	}
};

defineExpose({
    getRank
})

onMounted(() => {
    getRank();
});
</script>

<style lang="less" scoped>
.rank-container {
    position: relative;
    padding-bottom: .4rem;
	width: 7.13rem;
	min-height: 8.8rem;
	height: auto;
	background-repeat: no-repeat;
	background-size: contain;
	background-image: url(https://yaame-static.yaame.io/admin/047df7cb48dab2beca8b693501511ec8.png);
	margin-left: 0.18rem;
	margin-top: 0.35rem;

	padding-top: 4.23rem;
	position: relative;
    .rank-container-board {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        background: #834A14;
        box-shadow: inset 0 .02rem .04rem 0 rgba(255,255,255,0.7);

        border: 0.02rem solid #FDCC1F;
        border-radius: .2rem;
        z-index: -1;
    }
	.top-bg {
		width: 6.87rem;
		height: 2.82rem;
		position: absolute;
		left: 0.13rem;
		top: 2.19rem;
	}
	.top-container {
		width: 7.12rem;
		height: 4rem;
		position: absolute;
		left: 0;
		top: 0.5rem;
        padding: 0.24rem 0.21rem 0 0.21rem;
        display: flex;
        justify-content: space-between;
		.top-item {
			width: 2.1rem;
			height: 2.86rem;
			position: relative;
			z-index: 1;
            background-size: contain;
            background-repeat: no-repeat;
			&.top-item-0 {
                position: absolute;
                left: 2.51rem;
				top: 0;
                background-image: url(https://yaame-static.yaame.io/admin/2787a798335904b8df42aac26276e56a.png);
			}
			&.top-item-1 {
				top: 0.38rem;
                background-image: url(https://yaame-static.yaame.io/admin/1ac9df06b1c577051d24b6b6f7cfdcab.png);
			}
			&.top-item-2 {
				top: 0.38rem;
                background-image: url(https://yaame-static.yaame.io/admin/1ac9df06b1c577051d24b6b6f7cfdcab.png);
			}
			.avatar {
				width: 2.1rem;
				height: 1.63rem;
				position: relative;
				.user-avatar {
					width: 0.92rem;
					height: 0.92rem;
					display: block;
					border-radius: 50%;
					position: absolute;
					left: 0.59rem;
					top: 0.4rem;
				}
			}
			.user-name {
				text-align: center;
				padding: 0 0.3rem;
				width: 2.1rem;
				font-weight: normal;
				font-size: 0.22rem;
				color: #6F1E0B;
                font-weight: bold;
			}
			.user-value {
				text-align: center;
				padding: 0 0.1rem;
				width: 2.1rem;
				font-weight: normal;
				font-size: 0.2rem;
				color: #6F1E0B;
                font-weight: bold;
				img {
					width: 0.26rem;
					height: 0.24rem;
					vertical-align: middle;
				}
			}
		}
	}
	.list-item {
		width: 6.85rem;
		height: 1.41rem;
		margin-left: 0.14rem;
        margin-bottom: .14rem;
		// background-size: contain;
		// background-repeat: no-repeat;
		// background-image: url(https://yaame-static.yaame.io/admin/0a0cb21a02a6dca018ea4dec616b6b26.png);
        background: #AB6C30;
        border-radius: 0.2rem;
		display: flex;
		align-items: center;
		.sort {
			width: 1.14rem;
			text-align: center;
			font-weight: 500;
			font-size: 0.3rem;
			color: #ffffff;
		}
		.item-avatar {
			width: 0.99rem;
			height: 0.98rem;
			// background-size: contain;
			// background-repeat: no-repeat;
			// background-image: url(https://yaame-static.yaame.io/admin/77b09d42db53e5ae5cf548ae1b6db639.png);

            border: 0.02rem solid #FDCC1F;
            border-radius: 50%;
			display: flex;
			justify-content: center;
			align-items: center;
			img {
				width: 0.92rem;
				height: 0.92rem;
                display: block;
                border-radius: 50%;
			}
		}
		.item-info {
			width: 2.97rem;
			padding: 0.17rem;
			font-weight: 500;
			font-size: 0.24rem;
			color: #ffffff;
		}
		.item-value {
			font-weight: 600;
			font-size: 0.26rem;
			color: #ffe491;
			img {
				width: 0.26rem;
				height: 0.24rem;
				vertical-align: middle;
			}
		}
	}
}
</style>
