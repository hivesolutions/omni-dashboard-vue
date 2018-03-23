<template>
<div class="store">
    <div class="line">
        <div class="column"></div>
        <div class="column">
            <div class="trend">
                <img src="~./assets/arrow_up.svg" class="up" />
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

<script>
import Vue from "vue";

import "./store.css";

import arrowUp from "./assets/arrow_up.svg"

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
                    currency: "EUR"
                },
                sales: [{
                    day: "xx/xx",
                    weekday: "Day",
                    amount: "xx,xxx.xx",
                    currency: "EUR"
                }],
                isMain: false
            },
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
