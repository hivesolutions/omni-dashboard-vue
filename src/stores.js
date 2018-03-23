import Vue from "vue";
import VueResource from "vue-resource";
import _ from "hive-js-util"

import Stores from "./components/stores";

export const stores = function() {
    Vue.use(VueResource);

    const app = new Vue({
        el: "#app",
        components: {
            "stores": Stores
        },
        methods: {
            refresh: function() {
                this.$refs.stores.refresh();
            }
        }
    });

    app.refresh();

    return app;
};

export default stores;
