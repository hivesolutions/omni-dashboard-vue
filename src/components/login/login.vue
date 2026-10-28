<template>
    <div class="login-container" v-bind:class="{ visible: isVisible }">
        <div class="login container">
            <div class="icon">
                <img src="~./assets/lock.svg" />
            </div>
            <div class="caption">
                Omni Dashboard
            </div>
            <h1>{{ title || $root.translate("login") }}</h1>
            <p class="extra error" v-if="message">
                {{ message }}
            </p>
            <p class="extra">
                <label>
                    <span class="label">{{ $root.translate("username") }}</span>
                    <input
                        type="text"
                        autocapitalize="none"
                        ref="username"
                        v-model="username"
                        v-on:keyup.enter="submit"
                    />
                </label>
            </p>
            <p class="extra">
                <label>
                    <span class="label">{{ $root.translate("password") }}</span>
                    <input
                        type="password"
                        autocapitalize="none"
                        ref="password"
                        v-model="password"
                        v-on:keyup.enter="submit"
                    />
                </label>
            </p>
            <p class="extra instance">
                <label>
                    <span class="label">{{ $root.translate("instance") }}</span>
                    <span class="field">
                        <input
                            type="text"
                            v-bind:placeholder="$root.translate('yourUrl')"
                            autocapitalize="none"
                            ref="instance"
                            v-model="instance"
                            v-on:keyup.enter="submit"
                        />
                        <span class="domain">.frontdoorhd.com</span>
                    </span>
                </label>
            </p>
            <p class="extra buttons">
                <ButtonColor ref="button" v-on:click="submit">
                    {{ $root.translate("signIn") }}
                </ButtonColor>
            </p>
            <p class="extra forgot">
                <a href="#">{{ $root.translate("forgotPassword") }}</a>
            </p>
        </div>
    </div>
</template>

<style scoped>
.login-container {
    box-sizing: border-box;
    display: none;
    height: 100%;
    justify-content: center;
    left: 0px;
    overflow-y: auto;
    padding: 12px 0px 12px 0px;
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
    max-width: 340px;
    min-width: 300px;
    text-align: left;
    width: 100%;
}

.container.login {
    padding: 24px 24px 12px 24px;
}

.login-container.visible .login {
    display: block;
    margin: auto auto auto auto;
    opacity: 1;
}

.login > .icon {
    align-items: center;
    border: 1px solid #e2e2e2;
    border-radius: 32px 32px 32px 32px;
    box-shadow: 0px 0px 8px rgba(180, 180, 180, 0.4);
    display: flex;
    height: 64px;
    justify-content: center;
    margin: 12px auto 20px auto;
    width: 64px;
}

.login > .caption,
.login .label {
    color: #6d6d6d;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
}

.login h1 {
    font-size: 18px;
    font-weight: 600;
    line-height: 18px;
    margin: 4px 0px 0px 0px;
}

.login .error {
    color: #c9273f;
    font-size: 13px;
    font-weight: 600;
}

.login .instance > label > .field {
    align-items: center;
    border: 1px solid #e2e2e2;
    border-radius: 22px 22px 22px 22px;
    box-sizing: border-box;
    display: flex;
    height: 44px;
    margin-top: 6px;
    padding: 0px 16px 0px 16px;
    transition: border-color 0.1s linear;
}

.login .instance > label > .field:focus-within {
    border-color: #2d2d2d;
}

.login .instance > label > .field > input {
    border: none;
    flex: 1;
    height: 40px;
    margin-top: 0px;
    min-width: 0px;
    padding: 0px 0px 0px 0px;
}

.login .instance > label > .field > .domain {
    color: #4d4d4d;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.4px;
    text-transform: uppercase;
}

.login > .buttons {
    margin-top: 24px;
}

.login > .buttons > .button {
    box-sizing: border-box;
    width: 100%;
}

.login > .forgot {
    margin-top: 6px;
    text-align: center;
}

.login > .forgot > a {
    color: #4d4d4d;
    display: inline-block;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.3px;
    line-height: 44px;
    padding: 0px 12px 0px 12px;
    text-transform: uppercase;
}

input[type="text"],
input[type="password"] {
    border: 1px solid #e2e2e2;
    border-radius: 22px 22px 22px 22px;
    box-sizing: border-box;
    color: #2d2d2d;
    font-family: -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        "Roboto",
        "Open Sans",
        "Helvetica",
        "Arial",
        sans-serif;
    font-size: 15px;
    font-weight: 600;
    height: 44px;
    line-height: 16px;
    margin-top: 6px;
    outline: none;
    padding: 0px 16px 0px 16px;
    transition: border-color 0.1s linear;
    width: 100%;
}

input[type="text"]:focus,
input[type="password"]:focus {
    border-color: #2d2d2d;
}

input[type="text"]::placeholder,
input[type="password"]::placeholder {
    color: #767676;
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
import { API } from "omni-api-js";

import ButtonColor from "../button-color/button-color.vue";

export const Login = {
    components: {
        ButtonColor
    },
    props: {
        title: {
            type: String,
            default: null
        }
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
            return this.domain ? `https://${this.domain}/` : null;
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
            try {
                const api = new API({
                    baseUrl: this.baseUrl,
                    username: this.username,
                    password: this.password
                });
                await api.login();
                this.$root.api = api;
                this.$root.sid = api.sessionId;
                this.$root.username = this.username;
                this.$root.instance = this.instance;
                this.$root.refresh();
            } catch (err) {
                const message = err.message ? err.message : this.$root.translate("unknownError");
                const finalMessage = message.slice(0, 1).toUpperCase() + message.slice(1);
                this.message = finalMessage;
            } finally {
                this.$refs.button.isLoading = false;
            }
        }
    }
};

export default Login;
</script>
