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
                        <img src="/static/images/refresh.svg" />
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
                    day: "Global",
                    weekday: "Today's Sales",
                    ammount: "14,000 EUR"
                },
                sales: [{
                    day: "18/03",
                    weekday: "Tuesday",
                    ammount: "12,000 EUR"
                }, {
                    day: "18/03",
                    weekday: "Monday",
                    ammount: "12,000 EUR"
                }, {
                    day: "18/03",
                    weekday: "Tuesday",
                    ammount: "12,000 EUR"
                }, {
                    day: "18/03",
                    weekday: "Tuesday",
                    ammount: "12,000 EUR"
                }, {
                    day: "18/03",
                    weekday: "Tuesday",
                    ammount: "12,000 EUR"
                }, {
                    day: "18/03",
                    weekday: "Tuesday",
                    ammount: "12,000 EUR"
                }],
                isMain: false
            }
        }
    }
});
