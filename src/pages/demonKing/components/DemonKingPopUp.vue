<!--
 * @Author: Se7enElk
 * @Date: 2022-03-21 09:49:41
 * @LastEditors: Do not edit
 * @LastEditTime: 2022-03-21 09:59:42
 * @FilePath: /peanut_h5/src/pages/demonKing/components/DemonKingPopUp.vue
 * @Description: 
-->
<template>
    <popup class="flexBox">
        <div class="demonKingPopUp">
            <slot />
        </div>
    </popup>
</template>

<script>
    export default {
        name: 'DemonKingPopUp',
        components: {
            popup: () => import('../../../components/common/pop_up.vue'),
        },
        methods: {

            close() {
                this.$emit('close');
            },
        },
    };
</script>

<style scoped>
.flexBox{
    display: flex;
    align-items: center;
    justify-content: center;
}
.demonKingPopUp{
    width: 6.16rem;
    background: rgba(81,50,229,0.9);
    border-radius: 0.2rem;
    position: relative;
    padding: 0.7rem 0.36rem 0.4rem;
}
</style>