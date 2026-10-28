<template>
    <span
        class="button button-color"
        v-bind:class="{ loading: isLoading }"
        v-on:click="$emit('click')"
    >
        <slot v-if="!isLoading" />
        <div class="ball-scale-multiple" v-if="isLoading">
            <div />
            <div />
            <div />
        </div>
    </span>
</template>

<style scoped>
.button.button-color {
    background-color: #2d2d2d;
    border-radius: 22px 22px 22px 22px;
    box-sizing: border-box;
    font-size: 13px;
    font-weight: 700;
    height: 44px;
    letter-spacing: 0px;
    line-height: 44px;
    padding: 0px 24px 0px 24px;
    text-align: center;
    text-transform: none;
}

.button.button-color:hover {
    background-color: #4d4d4d;
}

.button.button-color:active {
    background-color: #1d1d1d;
}

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
export const ButtonColor = {
    data: function() {
        return {
            isLoading: false
        };
    }
};

export default ButtonColor;
</script>
