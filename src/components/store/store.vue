<template>
    <div class="store">
        <div class="line">
            <div class="column left">
                <div class="logout">
                    <img src="~./assets/logout.svg" v-on:click="logout" />
                </div>
            </div>
            <div class="column">
                <div class="trend">
                    <img
                        src="~./assets/arrow_up.svg"
                        class="up"
                        v-if="store.mainSales.direction === 'up'"
                        v-on:click="changeUnit"
                    />
                    <img
                        src="~./assets/arrow_down.svg"
                        class="down"
                        v-if="store.mainSales.direction === 'down'"
                        v-on:click="changeUnit"
                    />
                </div>
            </div>
            <div class="column right">
                <button
                    class="copy"
                    v-bind:aria-label="$root.translate('copyImage')"
                    v-bind:title="$root.translate('copyImage')"
                    v-on:click="copyImage"
                >
                    <img src="~./assets/check.svg" v-if="$root.copyState === 'done'" />
                    <img src="~./assets/error.svg" v-else-if="$root.copyState === 'error'" />
                    <img src="~./assets/copy.svg" v-else />
                </button>
                <button
                    class="settings"
                    v-bind:aria-label="$root.translate('settings')"
                    v-on:click="showSettings"
                >
                    <img src="~./assets/settings.svg" />
                </button>
                <div class="refresh">
                    <img src="~./assets/refresh.svg" v-on:click="refresh" />
                </div>
            </div>
        </div>
        <div class="results results-main">
            <div class="left">
                <div class="day">
                    {{ store ? store.name : name }}
                </div>
                <div class="weekday">
                    {{ store.mainSales.weekday }}
                </div>
            </div>
            <div class="right">
                <div class="money">
                    <span class="money-inner" v-on:click="changeDimension">
                        <span class="amount">{{ store.mainSales.amount }}&nbsp;</span>
                        <span class="currency">{{ store.mainSales.currency }}</span>
                    </span>
                </div>
            </div>
            <div class="comparison" v-if="$root.settings.comparison">
                <span class="label">vs {{ store.mainSales.comparison.label }}</span>
                <span class="value">
                    <span class="amount">{{ store.mainSales.comparison.amount }}</span>
                    <span class="change" v-bind:class="store.mainSales.comparison.direction">
                        {{ store.mainSales.comparison.change }}
                    </span>
                </span>
            </div>
        </div>
        <div class="results" v-for="sale in store.sales" v-bind:key="sale.key">
            <div class="left">
                <div class="day">
                    {{ sale.day }}
                </div>
                <div class="weekday">
                    {{ sale.weekday }}
                </div>
            </div>
            <div class="right">
                <div class="money">
                    <span class="money-inner" v-on:click="changeDimension">
                        <span class="amount">{{ sale.amount }}&nbsp;</span>
                        <span class="currency">{{ sale.currency }}</span>
                    </span>
                </div>
            </div>
            <div class="comparison" v-if="$root.settings.comparison">
                <span class="label">vs {{ sale.comparison.label }}</span>
                <span class="value">
                    <span class="amount">{{ sale.comparison.amount }}</span>
                    <span class="change" v-bind:class="sale.comparison.direction">
                        {{ sale.comparison.change }}
                    </span>
                </span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.store {
    padding: 0px 24px 0px 24px;
    user-select: none;
}

.store .trend {
    align-items: center;
    border: 1px solid #e2e2e2;
    border-radius: 32px 32px 32px 32px;
    box-shadow: 0px 0px 8px rgba(180, 180, 180, 0.4);
    display: flex;
    height: 64px;
    justify-content: center;
    margin: 12px auto 12px auto;
    transition: opacity 0.15s cubic-bezier(0.645, 0.045, 0.355, 1);
    width: 64px;
}

.loading .store .trend {
    opacity: 0;
}

.store .trend > img {
    cursor: pointer;
    width: 38px;
}

.store .logout,
.store .copy,
.store .settings,
.store .refresh {
    transition: opacity 0.15s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.store .copy,
.store .settings,
.store .refresh {
    display: inline-block;
}

.store .copy,
.store .settings {
    background-color: transparent;
    border: none;
    cursor: pointer;
    font-size: 0px;
    margin-right: 12px;
    padding: 0px 0px 0px 0px;
    vertical-align: middle;
}

.loading .store .logout,
.loading .store .copy,
.loading .store .settings,
.loading .store .refresh {
    opacity: 0;
}

.store .logout > img,
.store .copy > img,
.store .settings > img,
.store .refresh > img {
    cursor: pointer;
    vertical-align: middle;
}

.store .logout > img:hover,
.store .copy > img:hover,
.store .settings > img:hover,
.store .refresh > img:hover {
    filter: invert(0.5) sepia(1) hue-rotate(12deg);
}

.store .results {
    border-radius: 2px 2px 2px 2px;
    font-size: 0px;
    font-weight: 600;
    margin: 2px 0px 2px 0px;
    padding: 6px 0px 6px 0px;
}

.store .results.results-main {
    margin: 6px 0px 6px 0px;
}

.store .results.results-main + .results {
    margin-top: 6px;
}

.store .results:last-child {
    margin-bottom: 6px;
}

.store .results::after {
    clear: both;
    content: "";
    display: block;
}

.store .results > * {
    display: inline-block;
    font-size: 14px;
    vertical-align: bottom;
    width: 50%;
}

.store .results > .left {
    text-align: left;
}

.store .results > .right {
    text-align: right;
}

.store .results .day {
    color: #6d6d6d;
    font-size: 10px;
    text-transform: uppercase;
}

.store .results .weekday {
    font-size: 15px;
    line-height: 15px;
}

.store .results.results-main .weekday {
    font-size: 18px;
    line-height: 18px;
}

.store .results .money {
    font-size: 16px;
    height: 16px;
    line-height: 16px;
}

.store .results.results-main .money {
    font-size: 19px;
    height: 19px;
    line-height: 19px;
}

.store .results .money > .money-inner {
    cursor: pointer;
}

.store .results .money > .money-inner > .currency {
    font-size: 10px;
    letter-spacing: 0.1px;
}

.store .results.results-main .money > .money-inner > .currency {
    font-size: 11px;
    letter-spacing: 0.2px;
}

.store .results > .comparison {
    color: #6d6d6d;
    display: flex;
    font-size: 11px;
    justify-content: space-between;
    line-height: 16px;
    margin-top: 6px;
    width: 100%;
}

.store .results.results-main > .comparison {
    margin-top: 8px;
}

.store .results > .comparison > .value {
    white-space: nowrap;
}

.store .results > .comparison .change {
    font-weight: 700;
    margin-left: 8px;
}

.store .results > .comparison .change.up {
    color: #3a7a00;
}

.store .results > .comparison .change.down {
    color: #b84400;
}

.store .results > .comparison .change.up::before,
.store .results > .comparison .change.down::before {
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    content: "";
    display: inline-block;
    margin-right: 3px;
    vertical-align: 1px;
}

.store .results > .comparison .change.up::before {
    border-bottom: 7px solid currentcolor;
}

.store .results > .comparison .change.down::before {
    border-top: 7px solid currentcolor;
}
</style>

<script>
export const Store = {
    props: {
        store: {
            type: Object,
            default: function() {
                return {
                    name: "Example Store",
                    email: "example@store.com",
                    mainSales: {
                        day: "xx/xx",
                        weekday: "Week Day",
                        amount: "xx,xxx.xx",
                        currency: "EUR",
                        comparison: {
                            label: "Day xx/xx/xx",
                            amount: "xx,xxx.xx",
                            change: "+x.x%",
                            direction: "up"
                        },
                        direction: "up"
                    },
                    sales: [
                        {
                            day: "xx/xx",
                            weekday: "Day",
                            amount: "xx,xxx.xx",
                            currency: "EUR",
                            comparison: {
                                label: "Day xx/xx/xx",
                                amount: "xx,xxx.xx",
                                change: "+x.x%",
                                direction: "up"
                            }
                        }
                    ],
                    isMain: false
                };
            }
        }
    },
    methods: {
        logout: function() {
            this.$root.logout();
        },
        refresh: function() {
            this.$root.refresh();
        },
        showSettings: function() {
            this.$root.showSettings();
        },
        copyImage: function() {
            this.$root.copyImage();
        },
        changeUnit: function(mode) {
            this.$root.changeUnit();
        },
        changeDimension: function(mode) {
            this.$root.changeDimension();
        }
    }
};

export default Store;
</script>
