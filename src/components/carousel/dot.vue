<template>
    <div
        class="dot"
        v-bind:class="classes"
        tabindex="1"
        v-on:keypress="onKeypress"
        v-on:click="onClick"
    />
</template>

<style scoped>
.dot {
    background: #bbbbbb;
    border-radius: 8px 8px 8px 8px;
    cursor: pointer;
    display: inline-block;
    height: 8px;
    margin: 0px 4px 0px 4px;
    width: 8px;
}

.dot.selected {
    background-color: #4d4d4d;
}
</style>

<script>
export const Dot = {
    props: {
        selected: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        classes() {
            const base = { selected: this.selected };
            return base;
        }
    },
    methods: {
        onKeypress(event) {
            if (!event.key === "Enter") return;
            this.$emit("select", event);
        },
        onClick(event) {
            this.$emit("select", event);
        }
    }
};

export default Dot;
</script>
