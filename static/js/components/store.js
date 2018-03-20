Vue.component("store", {
    template: `
        <div class=\"store\">
            <h2 class="title">{{ store ? store.name : name }}</h2>
            <div class="results results-main">
                <div class="left">
                    <div>Global</div>
                    <div>Today's Sales</div>
                </div>
                <div class="right">4348.94 EUR</div>
            </div>
            <div class="results">
                <div class="left">
                    <div>19/03</div>
                    <div>Monday</div>
                </div>
                <div class="right">12348.94 EUR</div>
            </div>
            <div class="results">
                <div class="left">
                    <div>18/03</div>
                    <div>Tuesday</div>
                </div>
                <div class="right">10348.94 EUR</div>
            </div>
            <div class="results">
                <div class="left">
                    <div>18/03</div>
                    <div>Tuesday</div>
                </div>
                <div class="right">10348.94 EUR</div>
            </div>
            <div class="results">
                <div class="left">
                    <div>18/03</div>
                    <div>Tuesday</div>
                </div>
                <div class="right">10348.94 EUR</div>
            </div>
            <div class="results">
                <div class="left">
                    <div>18/03</div>
                    <div>Tuesday</div>
                </div>
                <div class="right">10348.94 EUR</div>
            </div>
        </div>
    `,
    props: {
        store: {
            type: Object,
            default: {
                name: "Example Store",
                email: "example@store.com",
                sales: "12,000 EUR",
                isMain: false
            }
        }
    }
});
