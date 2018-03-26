<template>
<div class="login container" v-bind:class="{ visible: isVisible }">
    <p>
        <img src="~./assets/superman.svg">
    </p>
    <h1>Login</h1>
    <p class="extra error" v-if="message">{{ message }}</p>
    <p class="extra">
        <input type="text" placeholder="Username" ref="username"
               v-model="username" v-on:keyup.enter="submit" />
    </p>
    <p class="extra">
        <input type="password" placeholder="Password" ref="password"
               v-model="password" v-on:keyup.enter="submit" />
    </p>
    <p class="extra buttons">
        <a href="#" class="button" v-on:click="submit">Signin</a>
    </p>
    <p class="extra forgot">
        <a href="#">Forgot your password?</a>
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
    margin-left: -160px;
    margin-top: -228px;
    display: none;
    width: 320px;
    min-width: 320px;
    max-width: 320px;
    box-sizing: border-box;
}

.container.login {
    padding: 20px 24px 20px 24px;
}

.login.visible {
    opacity: 1.0;
    display: block;
}

.login .error {
    color: #c9273f;
    font-weight: 600;
    font-size: 16;
}

.login > .buttons {
    margin-top: 32px;
}

.login > .forgot > a {
    font-size: 12px;
    letter-spacing: 0.2px;
    font-weight: 600;
    color: #31acd4;
}

input[type=text],
input[type=password] {
    border: none;
    height: 42px;
    width: 100%;
    font-family: -apple-system, "BlinkMacSystemFont", "Segoe UI", "Roboto", "Open Sans", "Helvetica", "Arial", sans-serif;
    font-size: 16px;
    line-height: 32px;
    border-bottom: 1px solid #2d9fc4;
    box-sizing: border-box;
    padding: 0px 2px 0px 2px;
    outline: none;
    font-weight: 600;
}
</style>

<script>
import Vue from "vue";

export const Login = Vue.component("login", {
    data: function() {
        return {
            isVisible: false,
            message: null,
            username: null,
            password: null
        };
    },
    methods: {
        show: function() {
            this.reset();
            this.isVisible = true;
            setTimeout(() => {
                this.$refs.username.focus();
            });
        },
        hide: function() {
            this.isVisible = false;
        },
        reset: function() {
            this.username = null;
            this.password = null;
            this.message = null;
        },
        submit: function() {
            this.$http.get(this.$root.baseUrl + "login.json", {
                params: {
                    username: this.username,
                    password: this.password
                }
            }).then(response => {
                this.$root.sid = response.data.session_id;
                this.$root.username = response.data.username;
                this.$root.refresh();
            }, response => {
                const message = response.data.exception.message;
                const finalMessage = message.slice(0, 1).toUpperCase() + message.slice(1);
                this.message = finalMessage;
            });
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
