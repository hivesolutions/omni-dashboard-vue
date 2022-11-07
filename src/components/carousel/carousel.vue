<template>
    <div class="carousel" v-bind:style="style" ref="carousel">
        <div class="carousel-container" v-bind:style="containerStyle" ref="carousel-container">
            <slot />
        </div>
    </div>
</template>

<style scoped>
.carousel {
    max-width: 100%;
    overflow-x: hidden;
}
</style>

<script>
import { nextTick } from "vue";

export const Carousel = {
    props: {
        width: {
            type: Number,
            default: undefined
        },
        page: {
            type: Number,
            default: 0
        }
    },
    data: function() {
        return {
            count: 0,
            pageData: this.page,
            widthData: this.width
        };
    },
    watch: {
        pageData: function(val) {
            this.updateScroll();
        },
        unitWidth: function(val) {
            this.updateScroll();
        }
    },
    computed: {
        unitWidth() {
            if (this.widthData) return this.widthData;
            return undefined;
        },
        containerStyle() {
            const base = {};
            if (this.unitWidth) base.width = `${this.unitWidth * this.count}px`;
            return base;
        },
        style() {
            const base = {};
            if (this.unitWidth) base.width = `${this.unitWidth}px`;
            return base;
        }
    },
    methods: {
        updateScroll: function() {
            this.$refs.carousel.scrollLeft = this.pageData * this.unitWidth;
            console.info(this.pageData * this.unitWidth);
        },
        nextPage: function() {
            this.pageData = Math.min(this.pageData + 1, this.count - 1);
        },
        previousPage: function() {
            this.pageData = Math.max(this.pageData - 1, 0);
        }
    },
    mounted: function() {
        this.count = this.$refs["carousel-container"].children.length;
        if (this.$refs["carousel-container"].children.length > 0) {
            this.widthData = this.$refs["carousel-container"].children[0].offsetWidth;
        }
        nextTick(() => this.updateScroll());
    }
};

export default Carousel;
</script>
