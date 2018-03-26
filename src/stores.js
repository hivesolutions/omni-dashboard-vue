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
            "login": Login,
            "stores": Stores,
            "overlay": Overlay
        },
        data: {
            sid: null,
            baseUrl: "https://ldj.frontdoorhd.com/api/",
            isLoading: false
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
            refresh: function() {
                this.hideLogin();
                this.$refs.stores.refresh();
            }
        }
    });

    app.refresh();

    return app;
};

export default stores;
