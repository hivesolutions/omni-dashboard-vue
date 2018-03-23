import stores from "./stores";
import "hive-js-util";

import "../index.html";

import "./assets/css/base.css";
import "./assets/css/layout.css";

export const globals = {};

export const start = function() {
    const element = document.getElementById("app");
    if (element.classList.contains("app-stores")) {
        globals.app = stores();
    }
};

export default start;
