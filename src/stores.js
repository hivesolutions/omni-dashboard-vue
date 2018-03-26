import Vue from "vue";
import VueResource from "vue-resource";

import Login from "./components/login";
import Stores from "./components/stores";
import Overlay from "./components/overlay";

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
            baseUrl: "https://ldj.frontdoorhd.com/api/",
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
                this.showLogin();
            },
            refresh: function() {
                this.hideLogin();
                this.$refs.stores.refresh();
            },
            loadData: function() {
                this.sid = window.localStorage.sid;
                this.username = window.localStorage.username;
            }
        },
        watch: {
            sid: function(val) {
                window.localStorage.sid = val;
            },
            username: function(val) {
                window.localStorage.username = val;
            }
        }
    });

    return app;
};

export default stores;
