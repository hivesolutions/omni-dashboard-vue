Vue.component("store", {
    template: "<div class=\"store\">{{ store ? store.name : name }}</div>",
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
