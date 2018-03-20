var app = null;

setTimeout(() => {
    app = new Vue({
        el: "#app",
        data: {
            message: "Hello Vue!",
            details: "",
            stores: [{
                id: 0,
                name: "Store 1"
            }, {
                id: 1,
                name: "Store 2"
            }, {
                id: 2,
                name: "Store 3"
            }]
        }
    });
});

/*
setTimeout(() => {
    app.message = "Loading...";
    app.$http.get("https://cameria.bemisc.com/api/cameras.json",
        {
            params: {
                sid: "20212af06cecc"
            }
        }).then(response => {
            app.message = "Success";
            app.details = JSON.stringify(response);
        }, response => {
            app.message = "Error";
            app.details = JSON.stringify(response);
        });
}, 2000);
*/
