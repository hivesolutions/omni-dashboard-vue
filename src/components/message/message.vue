<template>
<div class="message" v-if="isVisible">
    <p>
        <img src="~./assets/superman.svg" />
    </p>
    <h1>Oops there was an error</h1>
    <p class="text">
        Unfortunately the site is experiencing a bit of turbulence right now.<br/>
        But soon we'll be up and the sun will shine again.<br/>
        <span class="error-message">{{ text }}</span>
    </p>
    <button-color v-on:click="refresh">Refresh</button-color>
</div>
</template>

<style scoped>
.message {
    box-sizing: border-box;
    min-width: 320px;
}

.visible .message {
    display: none;
}

.message > h1 {
    margin: 0px 0px 0px 0px;
}

.message > .text {
    font-size: 14px;
    margin: 24px 24px 24px 24px;
}

.message > .text > .error-message {
    color: #c9273f;
    font-weight: 600;
    margin-top: 12px;
    display: inline-block;
}

.message img {
    max-height: 128px;
    max-width: 128px;
}
</style>

<script>
import Vue from "vue";

export const Message = Vue.component("message", {
    data: function() {
        return {
            text: null,
            isVisible: false
        };
    },
    methods: {
        setText: function(text) {
            this.text = text;
            this.isVisible = Boolean(text);
        },
        show: function() {
            this.isVisible = true;
        },
        hide: function() {
            this.isVisible = false;
        },
        refresh: function() {
            this.$root.refresh();
        }
    }
});

export default Message;
</script>
