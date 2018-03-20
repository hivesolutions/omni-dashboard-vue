const express = require("express");
const mustacheExpress = require('mustache-express');

// builds the initial application object to be used
// by the application for serving
const app = express();
const port = 8080;
const hostname = "0.0.0.0";

app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views");

app.use("/static", express.static(__dirname + "/static"))

app.get("/", (req, res, next) => {
    res.sendfile("main.html")
});

app.listen(port, hostname, () => {
    console.log("Listening on " + hostname + ":" + String(port));
});
