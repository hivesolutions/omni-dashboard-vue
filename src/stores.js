import Vue from "vue";
import VueResource from "vue-resource";
import {
    Carousel,
    Slide
} from "vue-carousel";
import _ from "hive-js-util"

import Store from "./components/store";
import Stores from "./components/stores";

export const stores = function() {
    Vue.use(VueResource);

    const app = new Vue({
        el: "#app",
        components: {
            "carousel": Carousel,
            "slide": Slide,
            "store": Store,
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
