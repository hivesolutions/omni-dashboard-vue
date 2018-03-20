const express = require("express");
const consolidate = require("consolidate");

// builds the initial application object to be used
// by the application for serving
const app = express();
const port = 8080;
const hostname = "0.0.0.0";

app.engine("tpl", consolidate.swig);

app.set("view engine", "tpl");
app.set("views", __dirname + '/views');

app.use("/static", express.static(__dirname + "/static"))

app.get("/", (req, res, next) => {
    res.sendfile("main.html.tpl");
});

app.get("/demo", (req, res, next) => {
    res.render("demo.html.tpl");
});

app.listen(port, hostname, () => {
    console.log("Listening on " + hostname + ":" + String(port));
});
