const stores = function() {
    new Vue({
        el: "#app",
        data: {},
        methods: {
            refresh: function() {
                this.remote();
            },
            remote: function() {
                const timestamp = parseInt(Date.parse(new Date().toUTCString()) / 1000)
                this.$http.get("https://ldj.frontdoorhd.com/omni/sale_snapshots/stats.json", {
                        params: {
                            date: timestamp,
                            has_global: "True",
                            output: "simple",
                            span: 7,
                            unit: "day"
                        }
                    })
                    .then(response => {
                        debugger;
                        /*this.message = "Success";
                        this.details = "Users loaded from remote data source";
                        this.users = response.data;*/
                    }, response => {
                        /* this.message = "Error";
                         this.details = JSON.stringify(response);
                         this.users = [];*/
                    });
            }
        }
    });
};
