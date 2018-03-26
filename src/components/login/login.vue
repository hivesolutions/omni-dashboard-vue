<template>
<div class="login container" v-bind:class="{ visible: isVisible }">
    <p>
        <img src="images/einstein.svg">
    </p>
    <h1>Temporarily down for maintenance</h1>
    <p>
        Unfortunately the site is down for a bit of maintenance right now.<br>
        But soon we'll be up and the sun will shine again.
    </p>
    <p class="extra">
        <a href="" class="button">Reload</a>
    </p>
</div>
</template>

<style scoped>
.login {
    position: fixed;
    z-index: 20;
    left: 50%;
    top: 50%;
    width: 420px;
    margin-left: -245px;
    margin-top: -120px;
    display: none;
}

.login.visible {
    opacity: 1.0;
    display: block;
}
</style>

<script>
import Vue from "vue";

export const Login = Vue.component("login", {
    data: function() {
        return {
            isVisible: false
        };
    },
    methods: {
        show: function() {
            this.isVisible = true;
        },
        hide: function() {
            this.isVisible = false;
        }
    },
    watch: {
        isVisible: function(val) {
            if (val) {
                this.$root.showOverlay();
            } else {
                this.$root.hideOverlay();
            }
        }
    }
});

export default Login;
</script>
