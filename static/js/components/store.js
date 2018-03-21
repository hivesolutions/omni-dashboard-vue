Vue.component("store", {
    template: `
        <div class=\"store\">
            <div class="line">
                <div class="column"></div>
                <div class="column">
                    <div class="trend">
                        <img src="/static/images/arrow_up.svg" class="up" />
                    </div>
                </div>
                <div class="column right">
                    <div class="refresh">
                        <img src="/static/images/refresh.svg" v-on:click="refresh()" />
                    </div>
                </div>
            </div>
            <div class="results results-main">
                <div class="left">
                    <div class="day">{{ store ? store.name : name }}</div>
                    <div class="weekday">{{ store.mainSales.weekday }}</div>
                </div>
                <div class="right">
                    <div class="money">{{ store.mainSales.ammount }}</div>
                </div>
            </div>
            <div class="results" v-for="sale in store.sales">
                <div class="left">
                    <div class="day">{{ sale.day }}</div>
                    <div class="weekday">{{ sale.weekday }}</div>
                </div>
                <div class="right">
                    <div class="money">{{ sale.ammount }}</div>
                </div>
            </div>
        </div>
    `,
    props: {
        store: {
            type: Object,
            default: {
                name: "Example Store",
                email: "example@store.com",
                mainSales: {
                    day: "16/03",
                    weekday: "Today's Sales",
                    ammount: "14,023.42 EUR"
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
