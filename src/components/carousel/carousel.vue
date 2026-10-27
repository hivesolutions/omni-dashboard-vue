<template>
    <div
        class="carousel"
        v-bind:style="style"
        ref="carousel"
        v-on:pointerdown="onPointerDown"
        v-on:pointermove="onPointerMove"
        v-on:pointerup="onPointerUp"
        v-on:pointercancel="onPointerUp"
        v-on:click.capture="onClickCapture"
        v-on:dragstart.prevent
    >
        <div class="carousel-container" v-bind:style="containerStyle" ref="carousel-container">
            <slot />
        </div>
    </div>
</template>

<style scoped>
.carousel {
    max-width: 100%;
    overflow-x: hidden;
    touch-action: pan-y;
}

.carousel > .carousel-container {
    position: relative;
    transition: left 0.35s cubic-bezier(0.645, 0.045, 0.355, 1);
}
</style>

<script>
import { nextTick } from "vue";

import { dragOffset, dragPage } from "../../util";

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
            widthData: this.width,
            drag: null,
            dragged: false
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
        },
        onPointerDown: function(event) {
            // only the main button starts a drag, the flag of a previous
            // drag is reset so that the following clicks go through
            if (event.button !== 0) return;
            this.dragged = false;
            this.drag = {
                id: event.pointerId,
                x: event.clientX,
                y: event.clientY,
                lastX: event.clientX,
                lastTime: event.timeStamp,
                offset: 0.0,
                velocity: 0.0,
                active: false
            };
        },
        onPointerMove: function(event) {
            if (!this.drag || this.drag.id !== event.pointerId) return;
            const deltaX = event.clientX - this.drag.x;
            const deltaY = event.clientY - this.drag.y;

            // waits for a clear horizontal movement before dragging so
            // that taps and vertical scrolls are left untouched
            if (!this.drag.active) {
                if (Math.abs(deltaY) >= 8 && Math.abs(deltaY) > Math.abs(deltaX)) {
                    this.drag = null;
                    return;
                }
                if (Math.abs(deltaX) < 8) return;
                this.drag.active = true;
                this.$refs.carousel.setPointerCapture(event.pointerId);
                this.$refs["carousel-container"].style.transition = "none";
            }

            // updates the velocity of the drag and moves the container so
            // that it follows the pointer (resisting past the edges)
            const elapsed = event.timeStamp - this.drag.lastTime;
            if (elapsed > 0) this.drag.velocity = (event.clientX - this.drag.lastX) / elapsed;
            this.drag.lastX = event.clientX;
            this.drag.lastTime = event.timeStamp;
            this.drag.offset = dragOffset(deltaX, this.pageData, this.count);
            this.$refs["carousel-container"].style.left = `${
                this.pageData * this.unitWidth * -1 + this.drag.offset
            }px`;
        },
        onPointerUp: function(event) {
            if (!this.drag || this.drag.id !== event.pointerId) return;
            const drag = this.drag;
            this.drag = null;
            if (!drag.active) return;

            // a pause before the release means there's no flick, then
            // restores the transition and snaps to the target page
            const velocity = event.timeStamp - drag.lastTime > 100 ? 0.0 : drag.velocity;
            this.dragged = true;
            this.$refs["carousel-container"].style.transition = "";
            const page = dragPage(this.pageData, this.count, drag.offset, this.unitWidth, velocity);
            if (page === this.pageData) this.updateScroll();
            else this.pageData = page;
        },
        onClickCapture: function(event) {
            // the click that ends a drag is not a tap on the content
            if (!this.dragged) return;
            this.dragged = false;
            event.stopPropagation();
            event.preventDefault();
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
