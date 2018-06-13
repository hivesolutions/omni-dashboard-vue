<template>
<div class="notice" v-if="isVisible">
    <button-color class="button-small button-transparent" v-if="$root.deferredPrompt"
                  v-on:click="promptInstall">Install App</button-color>
</div>
</template>

<style scoped>
.notice {
    position: fixed;
    bottom: 16px;
    right: 22px;
}

@media screen and (max-width: 760px) {
    .notice {
        position: absolute;
        bottom: 16px;
        left: 0px;
        width: 100%;
        text-align: center;
    }
}
</style>

<script>
import Vue from "vue";

import ButtonColor from "../button-color/button-color.vue";

export const Notice = Vue.component("notice", {
    components: {
        ButtonColor
    },
    data: function() {
        return {
            isVisible: true
        };
    },
    methods: {
        show: function() {
            this.isVisible = true;
        },
        hide: function() {
            this.isVisible = false;
        },
        promptInstall: function() {
            this.$root.promptInstall();
        }
    }
});

export default Notice;
</script>
