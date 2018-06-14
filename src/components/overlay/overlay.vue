<template>
<div class="overlay" v-bind:class="{ visible: isVisible }"></div>
</template>

<style scoped>
.overlay {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 10;
    visibility: hidden;
    left: 0px;
    top: 0px;
    background-color: rgba(0, 0, 0, 0);
    transition: background-color 0.35s cubic-bezier(0.645, 0.045, 0.355, 1),
        visibility 0.35s cubic-bezier(0.645, 0.045, 0.355, 1);
    -o-transition: background-color 0.35s cubic-bezier(0.645, 0.045, 0.355, 1),
        visibility 0.35s cubic-bezier(0.645, 0.045, 0.355, 1);
    -ms-transition: background-color 0.35s cubic-bezier(0.645, 0.045, 0.355, 1),
        visibility 0.35s cubic-bezier(0.645, 0.045, 0.355, 1);
    -moz-transition: background-color 0.35s cubic-bezier(0.645, 0.045, 0.355, 1),
        visibility 0.35s cubic-bezier(0.645, 0.045, 0.355, 1);
    -khtml-transition: background-color 0.35s
            cubic-bezier(0.645, 0.045, 0.355, 1),
        visibility 0.35s cubic-bezier(0.645, 0.045, 0.355, 1);
    -webkit-transition: background-color 0.35s
            cubic-bezier(0.645, 0.045, 0.355, 1),
        visibility 0.35s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.overlay.visible {
    visibility: visible;
    background-color: rgba(30, 30, 30, 0.6);
}
</style>

<script>
import Vue from "vue";

export const Overlay = Vue.component("overlay", {
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
});

export default Overlay;
</script>
