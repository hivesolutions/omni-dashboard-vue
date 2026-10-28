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
            v-on:key-up="selectPage"
        />
        <div class="loader" v-if="isLoading">
            <div class="ball-scale-multiple">
                <div />
                <div />
                <div />
            </div>
        </div>
        <Carousel v-if="isVisible" ref="carousel" v-model="page">
            <Slide v-bind:width="340" v-for="store in stores" v-bind:key="store.name">
                <Store v-bind:store="store" v-bind:key="store.name" ref="store" />
            </Slide>
        </Carousel>
        <Dots v-bind:count="stores.length" v-model="page" />
        <div class="footer" v-if="isVisible && lastUpdate">
            <span>{{ $root.translate("updated") }}&nbsp;</span>
            <span class="date">{{ lastUpdate }}</span>
            <br />
            <span class="username">{{ $root.username }}</span>
            <span>@</span>
            <span class="domain">{{ $root.domain }}</span>
        </div>
    </div>
</template>

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

import Carousel from "../carousel/carousel.vue";
import Dots from "../carousel/dots.vue";
import Slide from "../carousel/slide.vue";
import Store from "../store/store.vue";
import {
    comparison,
    dayLabel,
    dayName,
    dimensions,
    formatSeparators,
    keyPage,
    languageLocale,
    lastYear,
    measureValues,
    monthLabel,
    monthName,
    previousDate,
    totalStore,
    valueAt
} from "../../util";

export const Stores = {
    components: {
        GlobalEvents,
        Carousel,
        Dots,
        Slide,
        Store
    },
    data: function() {
        return {
            stores: [],
            lastUpdate: null,
            unit: this.$root.settings.unit,
            dimension: this.$root.settings.dimension,
            isVisible: false,
            isLoading: true,
            data: null,
            dataLy: null,
            dataLyMtd: null,
            page: 0,
            timeout: null,
            storesInfo: null
        };
    },
    computed: {
        span: function() {
            return this.$root.settings.span;
        },
        timeoutInterval: function() {
            return this.$root.settings.interval * 60000;
        },
        separators: function() {
            return formatSeparators(
                this.$root.settings.format,
                languageLocale(this.$root.settings.language, navigator.language)
            );
        },
        language: function() {
            return this.$root.language;
        }
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
        },
        timeoutInterval: function(val) {
            this.refresh();
        },
        separators: function(val) {
            this.refreshLight();
        },
        language: function(val) {
            this.refreshLight();
        }
    },
    methods: {
        reset: function() {
            this.timeout && clearTimeout(this.timeout);
            this.stores = [];
            this.lastUpdate = null;
            this.unit = this.$root.settings.unit;
            this.dimension = this.$root.settings.dimension;
            this.isVisible = false;
            this.isLoading = true;
            this.data = null;
            this.dataLy = null;
            this.dataLyMtd = null;
            this.timeout = null;
        },
        show: function() {
            this.isVisible = true;
        },
        hide: function() {
            this.isVisible = false;
        },
        next: function() {
            this.$refs.carousel.nextPage();
        },
        previous: function() {
            this.$refs.carousel.previousPage();
        },
        selectPage: function(event) {
            // ignores the keys typed in inputs (eg: login) and the ones
            // with modifiers, that are left for the browser shortcuts
            if (["INPUT", "TEXTAREA"].includes(event.target.tagName)) return;
            if (event.ctrlKey || event.altKey || event.metaKey) return;
            const page = keyPage(event.key, this.stores.length);
            if (page === null) return;
            this.page = page;
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
            const currentIndex = dimensions.indexOf(this.dimension);
            const targetIndex = currentIndex === dimensions.length - 1 ? 0 : currentIndex + 1;
            this.dimension = dimensions[targetIndex];
        },
        previousDimension: function() {
            const currentIndex = dimensions.indexOf(this.dimension);
            const targetIndex = currentIndex === 0 ? dimensions.length - 1 : currentIndex - 1;
            this.dimension = dimensions[targetIndex];
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
            // as the basis for the remote request, together with the one
            // for the same date of the previous year (comparison basis)
            const date = new Date();
            const dateLy = lastYear(date);
            const timestamp = parseInt(Date.parse(date.toUTCString()) / 1000);
            const timestampLy = parseInt(Date.parse(dateLy.toUTCString()) / 1000);

            // starts the remote query operations to retrieve the stores
            // stats of the previous year, the period is one unit longer so
            // that dates can be aligned across leap days and for the month
            // unit the month to date of the previous year is also retrieved
            const statsLy = Promise.all([
                this._getStatsLy(timestampLy, this.span + 1, this.unit),
                this.unit === "month"
                    ? this._getStatsLy(timestampLy, dateLy.getDate(), "day")
                    : null
            ]);

            // runs the remote query operation to retrieve the complete
            // set of stores stats for the current environment
            try {
                this.data = await this.$root.api.statsSaleSnapshot({
                    params: {
                        date: timestamp,
                        has_global: "True",
                        output: "simple",
                        span: this.span,
                        unit: this.unit
                    }
                });
            } catch (err) {
                // removes the loading indicators and the root flag that controls
                // the global loading state
                this.isLoading = false;
                this.$root.isLoading = false;

                // in case there's no response element in the error then redirects
                // the user agent immediately to the login panel
                if (!err.response) {
                    this.$root.message = this.$root.translate("errorLoading");
                    return;
                }

                // unpacks the response object from the error so that it can
                // be used for error handling purposes
                const response = err.response;

                // verifies if the error received may be related with authentication
                // and if that's the case shows the login window (to escape) otherwise
                // sets the root message indicating the error to the user
                const isAuth = response.status && parseInt(response.status / 100) === 4;
                if (isAuth) {
                    this.$root.showLogin();
                } else {
                    this.$root.message = err.message
                        ? this.$root.translate("errorLoadingDetail", { message: err.message })
                        : this.$root.translate("errorLoading");
                }
                return;
            }

            // waits for the stats of the previous year to be retrieved, as
            // their failure is not critical they are just going to be unset
            [this.dataLy, this.dataLyMtd] = await statsLy;

            // updates the current store information taking into account
            // the analytics data that has just been received
            this.isLoading = false;
            this.$root.isLoading = false;
            this.$root.message = null;

            // unpacks the data an updates the current stores information
            // as expected, setting a timeout for the automatic update
            // of the sale snapshot information
            await this.setStores(this.data, this.dataLy, this.dataLyMtd);
            this.timeout = setTimeout(this.refresh, this.timeoutInterval);
        },
        refreshLight: async function() {
            await this.setStores(this.data, this.dataLy, this.dataLyMtd);
        },
        setStores: async function(data, dataLy, dataLyMtd) {
            // in case the provided data is not valid or not set returns
            // the control flow immediately (avoids invalid cases)
            if (!data) {
                return;
            }

            // "saves" the current page of the carousel in a local variable
            // to be used in the latter operation
            const page = this.page;

            // retrieves the decimal and thousands separators of the number
            // format that is currently selected in the settings
            const [decimal, thousands] = this.separators;

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
            // identifier, then filters the stores that are not marked as non
            // dashboard stores (metadata's `dashboard` value is set to `false`)
            stores = stores.sort((a, b) =>
                this._storeNumber(a[0], a[1]) > this._storeNumber(b[0], b[1]) ? 1 : -1
            );
            stores = stores.filter(v =>
                [undefined, true].includes(
                    ((storesInfo[v[1].name] || { metadata: {} }).metadata || {}).dashboard
                )
            );

            // iterates over the complete set of stores to update the values
            // corresponding to the associated dimension
            stores.forEach(([objectId, store]) => {
                // creates the initial date value to be used in the printing
                // of the last update timestamp, together with the same date
                // of the previous year (end of the previous year values)
                let date = new Date();
                const dateLy = lastYear(date);

                // retrieves the values and the presentation details for the
                // currently selected dimension, both for the current store and
                // for the same store in the previous year (if available)
                const { values, currency, label, places } = measureValues(
                    store,
                    this.dimension,
                    this.language
                );
                const storeLy = dataLy && dataLy[objectId];
                const valuesLy = storeLy ? measureValues(storeLy, this.dimension).values : null;
                const points = this.dimension === "conversion_rate";

                // retrieves the previous year's value to be compared against the
                // main value, for the day unit it's the same complete day and for
                // the month unit it's the same month up to the same day
                let mainLy;
                let mainLyLabel;
                if (this.unit === "day") {
                    mainLy = valueAt(valuesLy, dateLy, dateLy, this.unit);
                    mainLyLabel = this.$root.translate("fullDay", {
                        label: dayLabel(dateLy, this.language)
                    });
                } else {
                    const storeLyMtd = dataLyMtd && dataLyMtd[objectId];
                    mainLy = storeLyMtd
                        ? measureValues(totalStore(storeLyMtd), this.dimension).values[0]
                        : null;
                    mainLyLabel = `1-${dateLy.getDate()} ${monthLabel(dateLy, this.language)}`;
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
                    weekday: this.$root.translate(this.unit === "day" ? "today" : "month", {
                        label: label
                    }),
                    amount: values[values.length - 1].formatMoney(places, decimal, thousands),
                    currency: currency,
                    comparison: comparison(
                        values[values.length - 1],
                        mainLy,
                        mainLyLabel,
                        places,
                        points,
                        decimal,
                        thousands,
                        this.language
                    ),
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
                        date = previousDate(date, this.unit);

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
                        const weekday = dayName(date, this.language);
                        const yearmonth = monthName(date, this.language);

                        // computes the same date of the previous year and retrieves
                        // the value for it to be used in the year-on-year comparison
                        const dateRowLy = lastYear(date);
                        const valueLy = valueAt(valuesLy, dateLy, dateRowLy, this.unit);

                        // pushes the current sale per day structure to the list of sales
                        // note that although the name of the structure is a day it may
                        // represent other temporal units
                        sales.push({
                            day: this.unit === "day" ? dayS : monthS,
                            weekday: this.unit === "day" ? weekday : yearmonth,
                            amount: value.formatMoney(places, decimal, thousands),
                            currency: currency,
                            comparison: comparison(
                                value,
                                valueLy,
                                this.unit === "day"
                                    ? dayLabel(dateRowLy, this.language)
                                    : monthLabel(dateRowLy, this.language),
                                places,
                                points,
                                decimal,
                                thousands,
                                this.language
                            )
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
            const stores = await this.$root.api.listStores({
                params: {
                    number_records: -1
                }
            });
            this.storesInfo = Object.fromEntries(stores.map(v => [v.name, v]));
            return this.storesInfo;
        },
        _getStatsLy: async function(date, span, unit) {
            try {
                return await this.$root.api.statsSaleSnapshot({
                    params: {
                        date: date,
                        has_global: "True",
                        output: "simple",
                        span: span,
                        unit: unit
                    }
                });
            } catch (err) {
                return null;
            }
        },
        _getStoreInfo: async function(name) {
            const storesInfo = await this._getStoresInfo();
            return storesInfo[name];
        },
        _storeNumber: function(objectId, store) {
            if (!store.name) return -1;
            if (store.name === "global") return -2;
            const storeParts = store.name.split("-", 2);
            const storeNumber = parseInt(storeParts[0]);
            return isNaN(storeNumber) ? -1 : storeNumber;
        }
    }
};

export default Stores;
</script>
