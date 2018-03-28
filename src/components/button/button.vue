<template>
<div class="login-container" v-bind:class="{visible: isVisible}">
    
</div>
</template>

<style scoped>
</style>

<script>
import Vue from "vue";

export const Button = Vue.component("button", {
    data: function() {
        return {
            isLoading: false
        };
    },
    methods: {
    }
});

export default Button;
</script>
