<template>
    <div class="login-container" v-bind:class="{ visible: isVisible }">
        <div class="login container">
            <h1>Login</h1>
            <p class="extra error" v-if="message">
                {{ message }}
            </p>
            <p class="extra">
                <input
                    type="text"
                    placeholder="Username"
                    autocapitalize="none"
                    ref="username"
                    v-model="username"
                    v-on:keyup.enter="submit"
                />
            </p>
            <p class="extra">
                <input
                    type="password"
                    placeholder="Password"
                    autocapitalize="none"
                    ref="password"
                    v-model="password"
                    v-on:keyup.enter="submit"
                />
            </p>
            <p class="extra instance">
                <input
                    type="text"
                    placeholder="your-url"
                    autocapitalize="none"
                    ref="instance"
                    v-model="instance"
                    v-on:keyup.enter="submit"
                />
                <span>.frontdoorhd.com</span>
            </p>
            <p class="extra buttons">
                <button-color ref="button" v-on:click="submit">
                    Signin
                </button-color>
            </p>
            <p class="extra forgot">
                <a href="#">Forgot your password?</a>
            </p>
        </div>
    </div>
</template>

<style scoped>
.login-container {
    align-items: center;
    display: none;
    height: 100%;
    justify-content: center;
    left: 0px;
    position: fixed;
    text-align: center;
    top: 0px;
    width: 100%;
    z-index: 20;
}

.login-container.visible {
    display: flex;
}

.login {
    box-sizing: border-box;
    display: none;
    max-width: 320px;
    min-width: 320px;
    width: 320px;
}

.container.login {
    padding: 20px 24px 20px 24px;
}

.login-container.visible .login {
    display: block;
    opacity: 1;
}

.login h1 {
    font-size: 30px;
    line-height: 32px;
    margin-bottom: 24px;
}

.login .error {
    color: #c9273f;
    font-size: 14px;
    font-weight: 600;
}

.login .instance {
    text-align: left;
}

.login .instance > input {
    width: 128px;
}

.login .instance > span {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.4px;
    text-transform: uppercase;
    vertical-align: bottom;
}

.login > .buttons {
    margin-top: 32px;
}

.login > .forgot > a {
    color: #31acd4;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.2px;
}

input[type="text"],
input[type="password"] {
    border: none;
    border-bottom: 1px solid #2d9fc4;
    border-radius: 0px 0px 0px 0px;
    box-sizing: border-box;
    font-family: -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        "Roboto",
        "Open Sans",
        "Helvetica",
        "Arial",
        sans-serif;
    font-size: 16px;
    font-weight: 600;
    height: 30px;
    line-height: 16px;
    margin-top: 12px;
    outline: none;
    padding: 0px 2px 0px 2px;
    transition: border-color 0.1s linear;
    width: 100%;
}

input[type="text"]:focus,
input[type="password"]:focus {
    border-bottom-color: #2d2d2d;
}

input[type="text"]::placeholder,
input[type="password"]::placeholder {
    color: #6baec4;
    font-size: 12px;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition: color 0.1s linear;
}

input[type="text"]:focus::placeholder,
input[type="password"]:focus::placeholder {
    color: #8d8d8d;
}
</style>

<script>
import ButtonColor from "../button-color/button-color.vue";

export const Login = {
    components: {
        ButtonColor
    },
    data: function() {
        return {
            isVisible: false,
            message: null,
            username: null,
            password: null,
            instance: null
        };
    },
    computed: {
        baseUrl: function() {
            return this.domain ? `https://${this.domain}/api/` : null;
        },
        domain: function() {
            return this.instance ? `${this.instance}.frontdoorhd.com` : null;
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
        submit: async function() {
            if (!this.baseUrl) return;
            this.$refs.button.isLoading = true;
            const url = new URL(`${this.baseUrl}login.json`);
            const params = {
                username: this.username,
                password: this.password
            };
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
            const response = await fetch(url);
            const data = await response.json();
            if (response.ok) {
                this.$refs.button.isLoading = false;
                this.$root.sid = data.session_id;
                this.$root.username = data.username;
                this.$root.instance = this.instance;
                this.$root.refresh();
            } else {
                this.$refs.button.isLoading = false;
                const message = data.exception ? data.exception.message : "Unknown error";
                const finalMessage = message.slice(0, 1).toUpperCase() + message.slice(1);
                this.message = finalMessage;
            }
        }
    }
};

export default Login;
</script>
