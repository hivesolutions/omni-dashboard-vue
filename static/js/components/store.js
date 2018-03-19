// TODO: put the code related with the store view !!! (mutiple store views should compose the panel)

Vue.component("store", {
    template: "<div class=\"store\">{{ name }}</div>",
    data: () => {
        return {
            name: "Store",
            sales: "12,000 EUR",
            isMain: false
        };
    }
});
