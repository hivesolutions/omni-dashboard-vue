<template>
<div class="notice" v-if="isVisible">
    <button-color v-if="$root.username" v-on:click="promptInstall">Install</button-color>
</div>
</template>

<style scoped>
.notice {
    margin-top: 22px;
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
