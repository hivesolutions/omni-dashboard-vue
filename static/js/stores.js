import Vue from "vue";
import VueResource from "vue-resource"
import {Carousel, Slide} from "vue-carousel"

import Store from "./components/store"

Vue.use(VueResource);

export const stores = function() {
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
                    console.info(response.data);
                    this.stores = [];
                    for (const key in response.data) {
                        const value = response.data[key];
                        const net_price_vat = value.net_price_vat;
                        this.stores.push({
                            name: value.name,
                            mainSales: {
                                day: "16/03",
                                weekday: "Today's Sales",
                                ammount: String(net_price_vat[net_price_vat.length - 1]) +
                                    " EUR"
                            },
                            sales: [{
                                day: "18/03",
                                weekday: "Saturday",
                                ammount: "2,453.34 EUR"
                            }, {
                                day: "17/03",
                                weekday: "Friday",
                                ammount: "7,445.41 EUR"
                            }, {
                                day: "16/03",
                                weekday: "Thursday",
                                ammount: "12,231.23 EUR"
                            }, {
                                day: "15/03",
                                weekday: "Wednesday",
                                ammount: "12,947.32 EUR"
                            }, {
                                day: "14/03",
                                weekday: "Tuesday",
                                ammount: "13,234.45 EUR"
                            }, {
                                day: "13/03",
                                weekday: "Monday",
                                ammount: "7,760.23 EUR"
                            }]
                        });
                    }
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
