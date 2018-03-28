<template>
<span class="button button-color"
      v-bind:class="{ loading: isLoading }"
      v-on:click="$emit('click')">
    <slot v-if="!isLoading"></slot>
    <div class="ball-scale-multiple" v-if="isLoading">
        <div></div>
        <div></div>
        <div></div>
    </div>
</span>
</template>

<style scoped>
.button > * {
    display: inline-block;
    vertical-align: middle;
}

.button > .ball-scale-multiple {
    -webkit-transform: scale(0.5) translateY(-30px);
    -ms-transform: scale(0.5) translateY(-30px);
     transform: scale(0.5) translateY(-30px);
}
</style>

<script>
import Vue from "vue";

export const ButtonColor = Vue.component("button-color", {
    data: function() {
        return {
            isLoading: false
        };
    }
});

export default ButtonColor;
</script>
