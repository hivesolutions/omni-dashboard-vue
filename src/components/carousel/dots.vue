<template>
    <div class="dots">
        <Dot
            v-bind:selected="isSelected(index - 1)"
            v-for="index in count"
            v-bind:key="index"
            v-on:select="() => onSelect(index - 1)"
        />
    </div>
</template>

<style scoped></style>

<script>
import Dot from "./dot.vue";

export const Dots = {
    components: {
        Dot
    },
    props: {
        modelValue: {
            type: Number
        },
        count: {
            type: Number
        }
    },
    data: function() {
        return {
            pageData: this.modelValue
        };
    },
    watch: {
        modelValue(val) {
            this.pageData = val;
        },
        pageData(val) {
            this.$emit("update:modelValue", val);
        }
    },
    methods: {
        isSelected(index) {
            return index === this.pageData;
        },
        onSelect(index) {
            this.pageData = index;
        }
    }
};

export default Dots;
</script>
