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

.carousel > .carousel-container {
    position: relative;
    transition: left 0.35s cubic-bezier(0.645, 0.045, 0.355, 1);
}
</style>

<script>
import { nextTick } from "vue";

export const Carousel = {
    props: {
        modelValue: {
            type: Number,
            default: 0
        },
        width: {
            type: Number,
            default: undefined
        }
    },
    data: function() {
        return {
            count: 0,
            pageData: this.modelValue,
            widthData: this.width
        };
    },
    watch: {
        modelValue(val) {
            this.pageData = val;
            this.updateScroll();
        },
        pageData(val) {
            this.$emit("update:modelValue", val);
            this.updateScroll();
        },
        unitWidth(val) {
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
            this.$refs["carousel-container"].style.left = `${
                this.pageData * this.unitWidth * -1
            }px`;
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
