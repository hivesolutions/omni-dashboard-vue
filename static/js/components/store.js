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
                    day: "xx/xx",
                    weekday: "Week Day",
                    ammount: "xx,xxx.xx EUR"
                },
                sales: [{
                    day: "xx/xx",
                    weekday: "Day",
                    ammount: "xx,xxx.xx EUR"
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
