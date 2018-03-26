<template>
<div class="store">
    <div class="line">
        <div class="column"></div>
        <div class="column">
            <div class="trend">
                <img src="~./assets/arrow_up.svg" class="up" v-if="store.mainSales.direction === 'up'" />
                <img src="~./assets/arrow_down.svg" class="down" v-if="store.mainSales.direction === 'down'" />
            </div>
        </div>
        <div class="column right">
            <div class="refresh">
                <img src="~./assets/refresh.svg" v-on:click="refresh()" />
            </div>
        </div>
    </div>
    <div class="results results-main">
        <div class="left">
            <div class="day">{{ store ? store.name : name }}</div>
            <div class="weekday">{{ store.mainSales.weekday }}</div>
        </div>
        <div class="right">
            <div class="money">
                <span class="amount">{{ store.mainSales.amount }}</span>
                <span class="currency">{{ store.mainSales.currency }}</span>
            </div>
        </div>
    </div>
    <div class="results" v-for="sale in store.sales" v-bind:key="sale.key">
        <div class="left">
            <div class="day">{{ sale.day }}</div>
            <div class="weekday">{{ sale.weekday }}</div>
        </div>
        <div class="right">
            <div class="money">
                <span class="amount">{{ sale.amount }}</span>
                <span class="currency">{{ sale.currency }}</span>
            </div>
        </div>
    </div>
</div>
</template>

<style scoped>
.store {
    user-select: none;
    -o-user-select: none;
    -ms-user-select: none;
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    padding: 0px 24px 0px 24px;
}

.store .trend {
    align-items: center;
    border: 1px solid #e2e2e2;
    border-radius: 32px 32px 32px 32px;
    -o-border-radius: 32px 32px 32px 32px;
    -ms-border-radius: 32px 32px 32px 32px;
    -moz-border-radius: 32px 32px 32px 32px;
    -khtml-border-radius: 32px 32px 32px 32px;
    -webkit-border-radius: 32px 32px 32px 32px;
    box-shadow: 0px 0px 8px rgba(180, 180, 180, 0.4);
    -o-box-shadow: 0px 0px 8px rgba(180, 180, 180, 0.4);
    -ms-box-shadow: 0px 0px 8px rgba(180, 180, 180, 0.4);
    -moz-box-shadow: 0px 0px 8px rgba(180, 180, 180, 0.4);
    -khtml-box-shadow: 0px 0px 8px rgba(180, 180, 180, 0.4);
    -webkit-box-shadow: 0px 0px 8px rgba(180, 180, 180, 0.4);
    display: flex;
    height: 64px;
    justify-content: center;
    margin: 12px auto 12px auto;
    width: 64px;
}

.store .trend > img {
    filter: invert(0.5) sepia(1) saturate(50) hue-rotate(67deg);
    -o-filter: invert(0.5) sepia(1) saturate(50) hue-rotate(67deg);
    -ms-filter: invert(0.5) sepia(1) saturate(50) hue-rotate(67deg);
    -moz-filter: invert(0.5) sepia(1) saturate(50) hue-rotate(67deg);
    -khtml-filter: invert(0.5) sepia(1) saturate(50) hue-rotate(67deg);
    -webkit-filter: invert(0.5) sepia(1) saturate(50) hue-rotate(67deg);
    width: 38px;
}

.store .trend > img.up {
    filter: invert(0.5) sepia(1) saturate(50) hue-rotate(67deg);
    -o-filter: invert(0.5) sepia(1) saturate(50) hue-rotate(67deg);
    -ms-filter: invert(0.5) sepia(1) saturate(50) hue-rotate(67deg);
    -moz-filter: invert(0.5) sepia(1) saturate(50) hue-rotate(67deg);
    -khtml-filter: invert(0.5) sepia(1) saturate(50) hue-rotate(67deg);
    -webkit-filter: invert(0.5) sepia(1) saturate(50) hue-rotate(67deg);
}

.store .trend > img.down {
    filter: invert(0.5) sepia(1) saturate(50) hue-rotate(12deg);
    -o-filter: invert(0.5) sepia(1) saturate(50) hue-rotate(12deg);
    -ms-filter: invert(0.5) sepia(1) saturate(50) hue-rotate(12deg);
    -moz-filter: invert(0.5) sepia(1) saturate(50) hue-rotate(12deg);
    -khtml-filter: invert(0.5) sepia(1) saturate(50) hue-rotate(12deg);
    -webkit-filter: invert(0.5) sepia(1) saturate(50) hue-rotate(12deg);
}

.store .refresh > img {
    cursor: pointer;
}

.store .results {
    border-radius: 2px 2px 2px 2px;
    -o-border-radius: 2px 2px 2px 2px;
    -ms-border-radius: 2px 2px 2px 2px;
    -moz-border-radius: 2px 2px 2px 2px;
    -khtml-border-radius: 2px 2px 2px 2px;
    -webkit-border-radius: 2px 2px 2px 2px;
    font-size: 0px;
    font-weight: 600;
    margin: 6px 0px 6px 0px;
    padding: 6px 0px 6px 0px;
}

.store .results:after {
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
    line-height: 16px;
}

.store .results.results-main .money {
    font-size: 19px;
    line-height: 19px;
}

.store .results .money > .currency {
    font-size: 10px;
    letter-spacing: 0.1px;
}

.store .results.results-main .money > .currency {
    font-size: 11px;
    letter-spacing: 0.2px;
}
</style>

<script>
import Vue from "vue";

import "./assets/arrow_up.svg";

export const Store = Vue.component("store", {
    props: {
        store: {
            type: Object,
            default: {
                name: "Example Store",
                email: "example@store.com",
                mainSales: {
                    day: "xx/xx",
                    weekday: "Week Day",
                    amount: "xx,xxx.xx",
                    currency: "EUR",
                    direction: "up"
                },
                sales: [{
                    day: "xx/xx",
                    weekday: "Day",
                    amount: "xx,xxx.xx",
                    currency: "EUR"
                }],
                isMain: false
            }
        }
    },
    methods: {
        refresh: function() {
            this.$root.refresh();
        }
    }
});

export default Store;
</script>
