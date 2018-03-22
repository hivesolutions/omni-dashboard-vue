import Vue from "vue";
import VueResource from "vue-resource";
import {
    Carousel,
    Slide
} from "vue-carousel";
import _ from "hive-js-util"

import Store from "./components/store";
import daysOfWeek from "./util"

export const stores = function() {
    Vue.use(VueResource);

    const app = new Vue({
        el: "#app",
        components: {
            "carousel": Carousel,
            "slide": Slide,
            "store": Store
        },
        data: {
            stores: []
        },
        methods: {
            refresh: function() {
                this.remote();
            },
            remote: function() {
                const timestamp = parseInt(Date.parse(new Date().toUTCString()) / 1000)
                this.$http.get("https://ldj.frontdoorhd.com/api/sale_snapshots/stats.json", {
                    params: {
                        sid: "6ff41b73a1b92379aaa0aee14e835c70",
                        /* TODO this is hardcoded */
                        date: timestamp,
                        has_global: "True",
                        output: "simple",
                        span: 7,
                        unit: "day"
                    }
                }).then(response => {
                    this.stores = [];
                   
                    // converts the received object into a sequence of tuples
                    // containing both the object id and the name of the store
                    let stores = Object.keys(response.data).map(k => [k, response.data[k]]);

                    // sotes the complete set of stores according to their object
                    // identifier and then runs the reverse mapping
                    stores = stores.sort((a, b) => parseInt(a[0]) > parseInt(b[0]) ? 1 : -1);
                    stores = stores.map(v => v[1]);

                    // iteates over the complete set of stores
                    stores.forEach(store => {
                        // creates the initial date value to be used
                        let date = new Date();

                        // retrieves the value for the current store and the target
                        // price values to be used in this function
                        const net_price_vat = store.net_price_vat;

                        // builds the value of the main sale of the current store
                        // this is considered to be a "special value"
                        const mainSales = {
                            day: "19/03",
                            weekday: "Today's Sales",
                            ammount: net_price_vat[net_price_vat.length - 1].formatMoney(2, ".", ",", "EUR")
                        };

                        // retrieves the appropiate values for the calculus and runs
                        // the iteration for the building of the day sales
                        const sales = [];
                        net_price_vat.slice(0, net_price_vat.length - 1).reverse()
                            .forEach(value => {
                                date = new Date(date - 86400000);
                                const weekday = daysOfWeek[date.getDay()];
                                sales.push({
                                    day: "18/03",
                                    weekday: weekday,
                                    ammount: value.formatMoney(2, ".", ",", "EUR")
                                });
                            });

                        // adds the new stores values to the list of stores that
                        // are going to be presented in the screen
                        this.stores.push({
                            name: store.name,
                            mainSales: mainSales,
                            sales: sales
                        });
                    });
                }, response => {
                    /* this.message = "Error";
                    this.details = JSON.stringify(response);
                    this.users = [];*/
                });
            }
        }
    });

    app.refresh();

    return app;
};

export default stores;
