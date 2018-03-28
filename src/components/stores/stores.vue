<template>
<div class="stores" v-bind:class="{ visible: isVisible, loading: isLoading }">
    <GlobalEvents @key-up.left="previous" @key-up.right="next"></GlobalEvents>
    <div class="loader" v-if="isLoading">
        <div class="ball-scale-multiple">
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>
    <carousel :perPage="1" :paginationSize="8" :paginationPadding="4" ref="carousel">
        <slide v-for="store in stores"
               v-bind:key="store.name">
            <store v-bind:store="store"
                   v-bind:key="store.name"
                   ref="store"></store>
        </slide>
    </carousel>
    <div class="footer" v-if="lastUpdate">
        <span>Updated</span>
        <span class="date">{{ lastUpdate }}</span>
        <br/>
        <span class="username">{{ this.$root.username }}</span>
        <span>@</span>
        <span class="domain">{{ this.$root.domain }}</span>
    </div>
</div>
</template>

<style>
.VueCarousel-pagination {
    margin-top: 10px;
}
</style>

<style scoped>
@import "~loaders.css/loaders.css";

.loader {
    margin: 32px 0px 32px 0px;
    display: inline-block;
}

.visible .loader {
    position: absolute;
    margin-top: 44px;
}

.loader > * > div {
    background-color: #ffb25f;
}

.stores .footer {
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    line-height: 18px;
    clear: both;
    margin-top: 38px;
}
</style>

<script>
import Vue from "vue";
import {
    Carousel,
    Slide
} from "vue-carousel";
import GlobalEvents from "vue-global-events";

import Store from "../store/store.vue";
import {daysOfWeek, months} from "../../util";

export const Stores = Vue.component("stores", {
    components: {
        GlobalEvents,
        Carousel,
        Slide,
        Store
    },
    data: function() {
        return {
            stores: [],
            message: null,
            lastUpdate: null,
            span: 7,
            unit: "day",
            isVisible: false,
            isLoading: true
        };
    },
    methods: {
        reset: function() {
            this.stores = [];
            this.message = null;
            this.lastUpdate = null;
            this.span = 7;
            this.unit = "day";
            this.isVisible = false;
            this.isLoading = true;
        },
        next: function() {
            this.$refs.carousel.advancePage();
        },
        previous: function() {
            this.$refs.carousel.advancePage("backward");
        },
        refresh: function() {
            this.remote();
        },
        changeUnit: function(unit) {
            this.unit = unit || (this.unit === "day" ? "month" : "day");
        },
        remote: function() {
            // in case we don't have a valid base URL the control flow is
            // returned immediately to the caller method
            if (!this.$root.baseUrl) {
                this.$root.showLogin();
                return;
            }

            // sets the current component as loading as a remote request
            // is going to be executed (as expected)
            this.isLoading = true;
            this.$root.isLoading = true;

            // retrieves the current timestamp as it's going to be used
            // as the basis for the remote request
            const timestamp = parseInt(Date.parse(new Date().toUTCString()) / 1000);

            // runs the remote query operation to retrive the complete
            // set of stores stats for the current environment
            this.$http.get(this.$root.baseUrl + "sale_snapshots/stats.json", {
                params: {
                    sid: this.$root.sid,
                    date: timestamp,
                    has_global: "True",
                    output: "simple",
                    span: this.span,
                    unit: this.unit
                }
            }).then(response => {
                this.isLoading = false;
                this.$root.isLoading = false;
                this.setStores(response.data);
            }, response => {
                this.isLoading = false;
                this.$root.isLoading = false;
                this.message = "Error loading remote data";
                this.$root.showLogin();
            });
        },
        setStores: function(data) {
            // sets the current panel as visible as the stores are being
            // set (so we have a valid panel)
            this.isVisible = true;

            // resets the list of stores currently associated to the
            // component as new ones are going to be used
            this.stores = [];

            // builds the string that is going to display the date of the
            // latest update of the stores list
            const lastUpdateDate = new Date();
            const lastUpdateDay = String(lastUpdateDate.getDate()).padStart(2, "0");
            const lastUpdateMonth = String(lastUpdateDate.getMonth() + 1).padStart(2, "0");
            const lastUpdateHours = String(lastUpdateDate.getHours()).padStart(2, "0");
            const lastUpdateMinutes = String(lastUpdateDate.getMinutes()).padStart(2, "0");
            this.lastUpdate = `${lastUpdateDay}/${lastUpdateMonth} ${lastUpdateHours}:${lastUpdateMinutes}`;

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
                    weekday: this.unit === "day" ? "Today's Sales" : "Month's Sales",
                    amount: netPriceVat[netPriceVat.length - 1].formatMoney(
                        2, ".", ","),
                    currency: "EUR",
                    direction: netPriceVat[netPriceVat.length - 1] > netPriceVat[netPriceVat.length - 2] ? "up" : "down"
                };

                // retrieves the appropiate values for the calculus and runs
                // the iteration for the building of the day sales
                const sales = [];
                netPriceVat.slice(0, netPriceVat.length - 1).reverse()
                    .forEach(value => {
                        // decrements the currently defined delta from the current date
                        // depending on the unit currently in use
                        if (this.unit === "day") {
                            date = new Date(date - 86400000);
                        } else {
                            date = new Date(date.getFullYear(), date.getMonth() - 1, 1);
                        }

                        // creates the string that is going to represent the current day
                        // as a day and month literal
                        const dayS = `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`;
                        const monthS = `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getFullYear()).slice(2, 4).padStart(2, "0")}`;
                        const weekday = daysOfWeek[date.getDay()];
                        const yearmonth = months[date.getMonth()];

                        // pushes the current sale per day structure to the list of sales
                        // note that although the name of the structure is a day it may
                        // represent other temporal units
                        sales.push({
                            day: this.unit === "day" ? dayS : monthS,
                            weekday: this.unit === "day" ? weekday : yearmonth,
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
    },
    watch: {
        span: function(val) {
            this.refresh();
        },
        unit: function(val) {
            this.refresh();
        }
    }
});

export default Stores;
</script>
