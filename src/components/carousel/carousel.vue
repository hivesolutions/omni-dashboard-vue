<template>
    <div class="carousel" v-bind:style="style">
        <slot />
    </div>
</template>

<style scoped>
.carousel {
    max-width: 100%;
}
</style>

<script>
export const Carousel = {
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

export default Carousel;
</script>
