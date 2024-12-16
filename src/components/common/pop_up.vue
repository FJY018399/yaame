<template>
    <div class="pop-fixed" @click.self="cancel">
        <slot />
    </div>
</template>
<script>
export default {
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        cancel() {
            this.$emit("cancel");
        },
    },
    watch: {
        visible(newVal) {
            if (newVal) {
                window.document.body.style.overflow = "hidden";
            } else {
                window.document.body.style.overflow = "";
            }
        },
    },
};
</script>
<style scoped>
.pop-fixed {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 999;
}
</style>
