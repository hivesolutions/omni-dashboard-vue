import { createApp } from "vue";
import { API } from "omni-api-js";

import components from "./components";
import { defaultSettings, parseSettings, resolveLanguage, translate } from "./util";

export const board = function() {
    const app = createApp({
        el: "#app",
        data: function() {
            return {
                sid: null,
                username: null,
                instance: null,
                api: null,
                isLoading: false,
                message: null,
                settings: { ...defaultSettings }
            };
        },
        computed: {
            baseUrl: function() {
                return this.domain ? `https://${this.domain}/` : null;
            },
            domain: function() {
                return this.instance ? `${this.instance}.frontdoorhd.com` : null;
            },
            language: function() {
                return resolveLanguage(this.settings.language, navigator.language);
            }
        },
        watch: {
            sid: function(val) {
                if (window.localStorage === undefined) {
                    return;
                }
                if (val) {
                    window.localStorage.sid = val;
                } else {
                    delete window.localStorage.sid;
                }
            },
            username: function(val) {
                if (window.localStorage === undefined) {
                    return;
                }
                if (val) {
                    window.localStorage.username = val;
                } else {
                    delete window.localStorage.username;
                }
            },
            instance: function(val) {
                if (window.localStorage === undefined) {
                    return;
                }
                if (val) {
                    window.localStorage.instance = val;
                } else {
                    delete window.localStorage.instance;
                }
            },
            message: function(val) {
                this.$refs.message.setText(val);
                if (val) {
                    this.hideAll();
                }
            },
            settings: function(val) {
                if (window.localStorage === undefined) {
                    return;
                }
                window.localStorage.settings = JSON.stringify(val);
            },
            language: function(val) {
                document.documentElement.lang = val;
            }
        },
        created: function() {
            this.loadSettings();
            document.documentElement.lang = this.language;
        },
        mounted: function() {
            this.loadData();
            this.refresh();
        },
        methods: {
            showOverlay: function() {
                this.$refs.overlay.show();
            },
            hideOverlay: function() {
                this.$refs.overlay.hide();
            },
            showStores: function() {
                this.$refs.stores.show();
            },
            hideStores: function() {
                this.$refs.stores.hide();
            },
            showLogin: function() {
                this.$refs.login.show();
            },
            hideLogin: function() {
                this.$refs.login.hide();
            },
            showSettings: function() {
                this.$refs.settings.show();
            },
            hideSettings: function() {
                this.$refs.settings.hide();
            },
            hideAll: function() {
                this.hideStores();
                this.hideLogin();
                this.hideSettings();
            },
            logout: function() {
                const result = confirm(this.translate("logoutConfirm"));
                if (!result) return;
                this.sid = null;
                this.username = null;
                this.instance = null;
                this.api = null;
                this.$refs.stores.reset();
                this.showLogin();
            },
            refresh: function() {
                this.hideLogin();
                this.$refs.stores.refresh();
            },
            changeUnit: function(unit) {
                this.$refs.stores.changeUnit(unit);
            },
            changeDimension: function(dimension) {
                this.$refs.stores.changeDimension(dimension);
            },
            setSetting: function(name, value) {
                this.settings = { ...this.settings, [name]: value };
            },
            translate: function(key, values) {
                return translate(key, this.language, values);
            },
            loadData: function() {
                if (window.localStorage === undefined) {
                    return;
                }
                this.sid = window.localStorage.sid;
                this.username = window.localStorage.username;
                this.instance = window.localStorage.instance;
                if (this.sid && this.username) {
                    this.api = new API({
                        baseUrl: this.baseUrl,
                        username: this.username,
                        sessionId: this.sid
                    });
                }
            },
            loadSettings: function() {
                if (window.localStorage === undefined) {
                    return;
                }
                this.settings = parseSettings(window.localStorage.settings);
            }
        }
    });

    // makes use of the components (plugin) so that additional
    // vue elements may be used
    app.use(components);

    // mounts the application in the target DOM component
    // and returns the instance fo whoever wants to use it
    app.mount("#app");
    return app;
};

export default board;
