<template>
    <canvas id="open-pag" class="open-pag"></canvas>
</template>

<script setup>
import { onMounted } from "vue";
import { PAGInit } from "libpag";
const initPAG = async (key) => {
	const PAG = await PAGInit();
    let pagFile;

    const buffer = await fetch(key).then((response) =>
        response.arrayBuffer()
    );
    pagFile = await PAG.PAGFile.load(buffer);

	const canvas = document.getElementById("open-pag");
	canvas.width = pagFile.width();
	canvas.height = pagFile.height();

	const pagView = await PAG.PAGView.init(pagFile, canvas);
	pagView.setRepeatCount(1);

	await pagView.play();
};

onMounted(() => {
    initPAG('https://yaame-static.yaame.io/admin/6bc271ccf69aac315a92859fabc1b409.pag'); 
});
</script>

<style scoped lang="less">

.open-pag {
    width: 7.5rem;
    height: 100vh;
}
</style>
