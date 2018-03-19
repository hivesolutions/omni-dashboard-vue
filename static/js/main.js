var app = null;

setTimeout(function () {
    app = new Vue({
        el: "#app",
        data: {
            message: "Hello Vue!",
            details: ""
        }
    });
});

setTimeout(function () {
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
