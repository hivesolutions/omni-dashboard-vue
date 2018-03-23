<template>
<div class="store">
    <carousel>
        <slide v-for="store in stores" v-bind:key="store.name">
            <store v-bind:store="store"
                    v-bind:key="store.name"></store>
        </slide>
    </carousel>
    <div class="footer">Updated 20/03 17.32</div>
    <div class="selectors">
        <span v-for="store in stores" v-bind:key="store.name">&middot;</span>
    </div>
</div>
</template>

<script>
import Vue from "vue";

import daysOfWeek from "../../util";

export const Stores = Vue.component("stores", {

    data: function() {
        return {
            stores: []
        };
    },
    methods: {
        refresh: function() {
            this.remote();
        },
        remote: function() {
            // retrieves the current timestamp as it's going to be used
            // as the basis for the remote request
            const timestamp = parseInt(Date.parse(new Date().toUTCString()) / 1000);

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
               this.setStores(response.data);
            }, response => {
                /* this.message = "Error";
                this.details = JSON.stringify(response);
                this.users = []; */
            });
        },
        setStores: function(data) {
            // resets the list of stores currently associated to the
            // component as new ones are going to be used
            this.stores = [];

            // converts the received object into a sequence of tuples
            // containing both the object id and the name of the store
            let stores = Object.keys(data).map(k => [k, data[k]]);

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
                const netPriceVat = store.net_price_vat;

                // creates the string that is going to represent the current day
                // as a day and month literal
                const dayS = `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`;

                // builds the value of the main sale of the current store
                // this is considered to be a "special value"
                const mainSales = {
                    day: dayS,
                    weekday: "Today's Sales",
                    amount: netPriceVat[netPriceVat.length - 1].formatMoney(
                        2, ".", ","),
                    currency: "EUR"
                };

                // retrieves the appropiate values for the calculus and runs
                // the iteration for the building of the day sales
                const sales = [];
                netPriceVat.slice(0, netPriceVat.length - 1).reverse()
                    .forEach(value => {
                        date = new Date(date - 86400000);
                        // creates the string that is going to represent the current day
                        // as a day and month literal
                        const dayS = `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`;
                        const weekday = daysOfWeek[date.getDay()];
                        sales.push({
                            day: dayS,
                            weekday: weekday,
                            amount: value.formatMoney(2, ".", ","),
                            currency: "EUR"
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
        }
    }
});

export default Stores;
</script>