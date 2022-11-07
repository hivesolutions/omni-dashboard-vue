<template>
    <div class="slide" v-bind:style="style">
        <slot />
    </div>
</template>

<style scoped>
.slide {
    display: inline-block;
}
</style>

<script>
export const Slide = {
    props: {
        width: {
            type: Number,
            default: undefined
        }
    },
    computed: {
        style() {
            const base = {};
            if (this.width) base.width = `${this.width}px`;
            return base;
        }
    }
};

export default Slide;
</script>
