import Vue from "vue";
import VueResource from "vue-resource";

import {
    Login,
    Stores,
    Overlay
} from "./components";

export const stores = function() {
    Vue.use(VueResource);

    const app = new Vue({
        el: "#app",
        components: {
            Login,
            Stores,
            Overlay
        },
        data: {
            sid: null,
            username: null,
            instance: null,
            isLoading: false
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
            showLogin: function() {
                this.$refs.login.show();
            },
            hideLogin: function() {
                this.$refs.login.hide();
            },
            logout: function() {
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
            loadData: function() {
                this.sid = window.localStorage.sid;
                this.username = window.localStorage.username;
                this.instance = window.localStorage.instance;
            }
        },
        watch: {
            sid: function(val) {
                if (val) {
                    window.localStorage.sid = val;
                } else {
                    delete window.localStorage.sid;
                }
            },
            username: function(val) {
                if (val) {
                    window.localStorage.username = val;
                } else {
                    delete window.localStorage.username;
                }
            },
            instance: function(val) {
                if (val) {
                    window.localStorage.instance = val;
                } else {
                    delete window.localStorage.instance;
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

    return app;
};

export default stores;
