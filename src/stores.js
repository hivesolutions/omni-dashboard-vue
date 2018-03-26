import Vue from "vue";
import VueResource from "vue-resource";

import Stores from "./components/stores";
import Overlay from "./components/overlay";

export const stores = function() {
    Vue.use(VueResource);

    const app = new Vue({
        el: "#app",
        components: {
            "stores": Stores,
            "overlay": Overlay
        },
        data: {
            baseUrl: "https://ldj.frontdoorhd.com/api/",
            isLoading: false
        },
        methods: {
            showLogin: function() {
            },
            hideLogin: function() {
            },
            refresh: function() {
                this.$refs.stores.refresh();
            }
        }
    });

    app.refresh();

    return app;
};

export default stores;
