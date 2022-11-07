<template>
    <div
        class="stores"
        v-bind:class="{ visible: isVisible, loading: isLoading }"
        v-if="isVisible || isLoading"
    >
        <GlobalEvents
            v-on:key-up.left="previous"
            v-on:key-up.right="next"
            v-on:key-up.up="nextDimension"
            v-on:key-up.down="previousDimension"
        />
        <div class="loader" v-if="isLoading">
            <div class="ball-scale-multiple">
                <div />
                <div />
                <div />
            </div>
        </div>
        <div v-for="store in stores" v-bind:key="store.name">
            <Store v-bind:store="store" v-bind:key="store.name" ref="store" />
        </div>
        <div class="footer" v-if="isVisible && lastUpdate">
            <span>Updated</span>
            <span class="date">{{ lastUpdate }}</span>
            <br />
            <span class="username">{{ $root.username }}</span>
            <span>@</span>
            <span class="domain">{{ $root.domain }}</span>
        </div>
    </div>
</template>

<style></style>

<style scoped>
@import "~loaders.css/loaders.css";

.loader {
    display: inline-block;
    margin: 32px 0px 32px 0px;
}

.visible .loader {
    margin-top: 44px;
    position: absolute;
}

.loader > * > div {
    background-color: #ffb25f;
}

.stores {
    max-width: 340px;
}

.stores .footer {
    clear: both;
    font-size: 10px;
    font-weight: 600;
    line-height: 18px;
    margin-top: 8px;
    text-transform: uppercase;
}
</style>

<script>
import { nextTick } from "vue";
import { GlobalEvents } from "vue-global-events";

import Store from "../store/store.vue";
import { daysOfWeek, months } from "../../util";

export const SEQUENCE = [
    "net_price_vat",
    "net_number_sales",
    "net_average_sale",
    "number_entries",
    "conversion_rate"
];

export const Stores = {
    components: {
        GlobalEvents,
        Store
    },
    data: function() {
        return {
            stores: [],
            lastUpdate: null,
            span: 7,
            unit: "day",
            dimension: "net_price_vat",
            isVisible: false,
            isLoading: true,
            data: null,
            page: 0,
            timeout: null,
            timeoutInterval: 300000,
            storesInfo: null
        };
    },
    watch: {
        span: function(val) {
            this.refresh();
        },
        unit: function(val) {
            this.refresh();
        },
        dimension: function(val) {
            this.refreshLight();
        }
    },
    methods: {
        reset: function() {
            this.timeout && clearTimeout(this.timeout);
            this.stores = [];
            this.lastUpdate = null;
            this.span = 7;
            this.unit = "day";
            this.dimension = "net_price_vat";
            this.isVisible = false;
            this.isLoading = true;
            this.data = null;
            this.timeout = null;
        },
        show: function() {
            this.isVisible = true;
        },
        hide: function() {
            this.isVisible = false;
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
        changeDimension: function(dimension) {
            if (dimension) {
                this.dimension = dimension;
            } else {
                this.nextDimension();
            }
        },
        nextDimension: function() {
            const currentIndex = SEQUENCE.indexOf(this.dimension);
            const targetIndex = currentIndex === SEQUENCE.length - 1 ? 0 : currentIndex + 1;
            this.dimension = SEQUENCE[targetIndex];
        },
        previousDimension: function() {
            const currentIndex = SEQUENCE.indexOf(this.dimension);
            const targetIndex = currentIndex === 0 ? SEQUENCE.length - 1 : currentIndex - 1;
            this.dimension = SEQUENCE[targetIndex];
        },
        remote: async function() {
            // in case we don't have a valid base URL the control flow is
            // returned immediately to the caller method
            if (!this.$root.baseUrl) {
                this.$root.showLogin();
                return;
            }

            // in case there's a timeout handler defined clears it to avoid
            // any possible duplicated execution
            if (this.timeout) {
                clearTimeout(this.timeout);
            }

            // sets the current component as loading as a remote request
            // is going to be executed (as expected)
            this.isLoading = true;
            this.$root.isLoading = true;

            // unsets any possible pending message in the current environment
            // so that no errors are visible to the end-user
            this.$root.message = null;

            // retrieves the current timestamp as it's going to be used
            // as the basis for the remote request
            const timestamp = parseInt(Date.parse(new Date().toUTCString()) / 1000);

            // allocates space for the response variable to be used in the storage
            // of the remote data information
            let response = null;

            // runs the remote query operation to retrieve the complete
            // set of stores stats for the current environment
            const url = new URL(`${this.$root.baseUrl}sale_snapshots/stats.json`);
            const params = {
                sid: this.$root.sid,
                date: timestamp,
                has_global: "True",
                output: "simple",
                span: this.span,
                unit: this.unit
            };
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
            response = await fetch(url);

            if (!response.ok) {
                // removes the loading indicators and the root flag that controls
                // the global loading state
                this.isLoading = false;
                this.$root.isLoading = false;

                // verifies if the error received may be related with authentication
                // and if that's the case shows the login window (to escape) otherwise
                // sets the root message indicating the error to the user
                const isAuth = response.status && parseInt(response.status / 100) === 4;
                if (isAuth) {
                    this.$root.showLogin();
                } else {
                    this.$root.message = "Error loading remote data";
                }
            }

            // updates the current store information taking into account
            // the analytics data that has just been received
            this.isLoading = false;
            this.$root.isLoading = false;
            this.$root.message = null;

            // in case the response is not valid returns the control flow
            // immediately, nothing to be done here
            if (!response.ok) return;

            // unpacks the data an updates the current stores information
            // as expected
            this.data = await response.json();
            await this.setStores(this.data);
            this.timeout = setTimeout(this.refresh, this.timeoutInterval);
        },
        refreshLight: async function() {
            await this.setStores(this.data);
        },
        setStores: async function(data) {
            // in case the provided data is not valid or not set returns
            // the control flow immediately (avoids invalid cases)
            if (!data) {
                return;
            }

            // "saves" the current page of the carousel in a local variable
            // to be used in the latter operation
            const page = this.page;

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

            // gathers the complete set of information about the stores
            // present at the back-end Omni instance
            const storesInfo = await this._getStoresInfo();

            // converts the received object into a sequence of tuples
            // containing both the object id and the name of the store
            let stores = Object.keys(data).map(k => [k, data[k]]);

            // stores the complete set of stores according to their object
            // identifier and then runs the reverse mapping
            stores = stores.sort((a, b) =>
                this._storeNumber(a[0], a[1]) > this._storeNumber(b[0], b[1]) ? 1 : -1
            );
            stores = stores.map(v => v[1]);
            stores = stores.filter(v =>
                [undefined, true].includes(
                    ((storesInfo[v.name] || { metadata: {} }).metadata || {}).dashboard
                )
            );

            // iterates over the complete set of stores to update the values
            // corresponding to the associated dimension
            stores.forEach(store => {
                // initializes a series of local variables that are going to
                // be used for the current store values
                let values;
                let currency;
                let label;
                let places;

                // creates the initial date value to be used in the printing
                // of the last update timestamp
                let date = new Date();

                // switches over the currently selected dimension to properly
                // update the complete set of variables of the update operation
                switch (this.dimension) {
                    case "net_price_vat":
                        values = store.net_price_vat;
                        currency = "EUR";
                        label = "Sales";
                        places = 2;
                        break;

                    case "net_number_sales":
                        values = store.net_number_sales;
                        currency = "SAL";
                        label = "Sales";
                        places = 0;
                        break;

                    case "net_average_sale":
                        values = store.net_price_vat.map(
                            (v, i) => v / (store.net_number_sales[i] || 1.0)
                        );
                        currency = "EUR";
                        label = "Avg.";
                        places = 2;
                        break;

                    case "number_entries":
                        values = store.number_entries;
                        currency = "ENT";
                        label = "Entries";
                        places = 0;
                        break;

                    case "conversion_rate":
                        values = store.net_number_sales.map((v, i) =>
                            store.number_entries[i] ? (v / store.number_entries[i]) * 100.0 : 0.0
                        );
                        currency = "%";
                        label = "Conv.";
                        places = 1;
                        break;
                }

                // creates the string that is going to represent the current day
                // as a day and month literal
                const dayS = `${String(date.getDate()).padStart(2, "0")}/${String(
                    date.getMonth() + 1
                ).padStart(2, "0")}`;

                // builds the value of the main sale of the current store
                // this is considered to be a "special value"
                const mainSales = {
                    day: dayS,
                    weekday: this.unit === "day" ? "Today's " + label : "Month's " + label,
                    amount: values[values.length - 1].formatMoney(places, ".", ","),
                    currency: currency,
                    direction: values[values.length - 1] > values[values.length - 2] ? "up" : "down"
                };

                // retrieves the appropriate values for the calculus and runs
                // the iteration for the building of the day sales
                const sales = [];
                values
                    .slice(0, values.length - 1)
                    .reverse()
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
                        const dayS = `${String(date.getDate()).padStart(2, "0")}/${String(
                            date.getMonth() + 1
                        ).padStart(2, "0")}`;
                        const monthS = `${String(date.getMonth() + 1).padStart(2, "0")}/${String(
                            date.getFullYear()
                        )
                            .slice(2, 4)
                            .padStart(2, "0")}`;
                        const weekday = daysOfWeek[date.getDay()];
                        const yearmonth = months[date.getMonth()];

                        // pushes the current sale per day structure to the list of sales
                        // note that although the name of the structure is a day it may
                        // represent other temporal units
                        sales.push({
                            day: this.unit === "day" ? dayS : monthS,
                            weekday: this.unit === "day" ? weekday : yearmonth,
                            amount: value.formatMoney(places, ".", ","),
                            currency: currency
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

            // sets the current panel as visible as the stores are being
            // set (so we have a valid panel) and restores the page that
            // is currently visible to the one at the start of the loading
            nextTick(() => {
                this.page = page;
                this.isVisible = true;
            });
        },
        _getStoresInfo: async function() {
            if (this.storesInfo !== null) return this.storesInfo;
            const url = new URL(`${this.$root.baseUrl}stores.json`);
            const params = { sid: this.$root.sid, number_records: -1 };
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
            const response = await fetch(url);
            if (!response.ok) throw new Error("Unexpected response");
            const storesData = await response.json();
            this.storesInfo = Object.fromEntries(storesData.map(v => [v.name, v]));
            return this.storesInfo;
        },
        _getStoreInfo: async function(name) {
            const storesInfo = await this._getStoresInfo();
            return storesInfo[name];
        },
        _storeNumber: function(objectId, store) {
            if (!store.name) return -1;
            const storeParts = store.name.split("-", 2);
            const storeNumber = parseInt(storeParts[0]);
            return isNaN(storeNumber) ? -1 : storeNumber;
        }
    }
};

export default Stores;
</script>
