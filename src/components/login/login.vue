<template>
<div class="login-container" v-bind:class="{ visible: isVisible }">
    <div class="login container">
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
        <p class="extra instance">
            <input type="text" placeholder="your-url" ref="instance"
                   v-model="instance" v-on:keyup.enter="submit" />
            <span>.frontdoorhd.com</span>
        </p>
        <p class="extra buttons">
            <a href="#" class="button" v-on:click="submit">Signin</a>
        </p>
        <p class="extra forgot">
            <a href="#">Forgot your password?</a>
        </p>
    </div>
</div>
</template>

<style scoped>
.login-container {
    position: fixed;
    left: 0px;
    top: 0px;
    z-index: 20;
    width: 100%;
    height: 100%;
    display: none;
    align-items: center;
    text-align: center;
    justify-content: center;
}

.login-container.visible {
    display: flex;
}

.login {
    display: none;
    width: 320px;
    min-width: 320px;
    max-width: 320px;
    box-sizing: border-box;
}

.container.login {
    padding: 20px 24px 20px 24px;
}

.login-container.visible .login {
    opacity: 1.0;
    display: block;
}

.login h1 {
    font-size: 30px;
    line-height: 32px;
    margin-bottom: 24px;
}

.login .error {
    color: #c9273f;
    font-weight: 600;
    font-size: 16;
}

.login .instance {
    text-align: left;
}

.login .instance > input {
    width: 118px;
}

.login .instance > span {
    font-size: 13px;
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.4px;
    vertical-align: bottom;
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
    border-radius: 0px 0px 0px 0px;
    -o-border-radius: 0px 0px 0px 0px;
    -ms-border-radius: 0px 0px 0px 0px;
    -moz-border-radius: 0px 0px 0px 0px;
    -khtml-border-radius: 0px 0px 0px 0px;
    -webkit-border-radius: 0px 0px 0px 0px;
    transition: border-color 0.10s linear;
    -o-transition: border-color 0.10s linear;
    -ms-transition: border-color 0.10s linear;
    -moz-transition: border-color 0.10s linear;
    -khtml-transition: border-color 0.10s linear;
    -webkit-transition: border-color 0.10s linear;
}

input[type=text]:focus,
input[type=password]:focus {
    border-bottom-color: #2d2d2d;
}

input[type=text]::placeholder,
input[type=password]::placeholder {
    color: #6baec4;
    font-size: 12px;
    letter-spacing: 1.0px;
    text-transform: uppercase;
    transition: color 0.10s linear;
    -o-transition: color 0.10s linear;
    -ms-transition: color 0.10s linear;
    -moz-transition: color 0.10s linear;
    -khtml-transition: color 0.10s linear;
    -webkit-transition: color 0.10s linear;
}

input[type=text]:focus::placeholder,
input[type=password]:focus::placeholder {
    color: #8d8d8d;
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
            password: null,
            instance: null
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
            this.instance = null;
            this.message = null;
        },
        submit: function() {
            this.$http.get(this.baseUrl + "login.json", {
                params: {
                    username: this.username,
                    password: this.password
                }
            }).then(response => {
                this.$root.sid = response.data.session_id;
                this.$root.username = response.data.username;
                this.$root.instance = this.instance;
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
    },
    computed: {
        baseUrl: function() {
            return this.domain ? `https://${this.domain}/api/` : null;
        },
        domain: function() {
            return this.instance ? `${this.instance}.frontdoorhd.com` : null;
        }
    }
});

export default Login;
</script>
