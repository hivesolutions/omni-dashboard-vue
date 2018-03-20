Vue.component("store", {
    template: `
        <div class=\"store\">
            <h1 class="title">{{ store ? store.name : name }}</h1>
            <div class="results results-main">
                <div class="left">
                    <div>{{ store.mainSales.day }}</div>
                    <div class="weekday">{{ store.mainSales.weekday }}</div>
                </div>
                <div class="right">
                    <div class="money">{{ store.mainSales.ammount }}</div>
                </div>
            </div>
            <div class="results" v-for="sale in store.sales">
                <div class="left">
                    <div>{{ sale.day }}</div>
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
                sales: [
                    {
                        day: "18/03",
                        weekday: "Tuesday",
                        ammount: "12,000 EUR"
                    },
                    {
                        day: "18/03",
                        weekday: "Monday",
                        ammount: "12,000 EUR"
                    },
                    {
                        day: "18/03",
                        weekday: "Tuesday",
                        ammount: "12,000 EUR"
                    },
                    {
                        day: "18/03",
                        weekday: "Tuesday",
                        ammount: "12,000 EUR"
                    }
                ],
                isMain: false
            }
        }
    }
});
