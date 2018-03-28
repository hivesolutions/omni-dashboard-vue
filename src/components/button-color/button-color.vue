<template>
<div class="login-container" v-bind:class="{visible: isVisible}">
    
</div>
</template>

<style scoped>
</style>

<script>
import Vue from "vue";

export const ButtonColor = Vue.component("button-color", {
    data: function() {
        return {
            isLoading: false
        };
    },
    methods: {
    }
});

export default ButtonColor;
</script>
