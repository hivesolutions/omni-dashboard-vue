<template>
    <div class="overlay" v-bind:class="{ visible: isVisible }" />
</template>

<style scoped>
.overlay {
    background-color: rgba(0, 0, 0, 0);
    height: 100%;
    left: 0px;
    position: fixed;
    top: 0px;
    transition: background-color 0.35s cubic-bezier(0.645, 0.045, 0.355, 1),
        visibility 0.35s cubic-bezier(0.645, 0.045, 0.355, 1);
    visibility: hidden;
    width: 100%;
    z-index: 10;
}

.overlay.visible {
    background-color: rgba(30, 30, 30, 0.6);
    visibility: visible;
}
</style>

<script>
export const Overlay = {
    data: function() {
        return {
            isVisible: false
        };
    },
    methods: {
        show: function() {
            this.isVisible = true;
        },
        hide: function() {
            this.isVisible = false;
        }
    }
};

export default Overlay;
</script>
