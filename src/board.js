import { createApp } from "vue";

import components from "./components";

export const board = function() {
    const app = createApp({
        el: "#app",
        data: function() {
            return {
                sid: null,
                username: null,
                instance: null,
                isLoading: false,
                message: null
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
            }
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
            hideAll: function() {
                this.hideStores();
                this.hideLogin();
            },
            logout: function() {
                const result = confirm("Are you sure you want to logout?");
                if (!result) return;
                this.sid = null;
                this.username = null;
                this.instance = null;
                this.$refs.stores.reset();
                this.showLogin();
            },
            refresh: function() {
                this.hideLogin();
                this.$refs.stores.refresh();
            },
            changeUnit: function() {
                this.$refs.stores.changeUnit();
            },
            changeDimension: function() {
                this.$refs.stores.changeDimension();
            },
            loadData: function() {
                if (window.localStorage === undefined) {
                    return;
                }
                this.sid = window.localStorage.sid;
                this.username = window.localStorage.username;
                this.instance = window.localStorage.instance;
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
