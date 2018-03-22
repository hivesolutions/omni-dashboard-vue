import stores from "./stores";

import "../index.html";

import "./assets/css/base.css";
import "./assets/css/layout.css";
import "./assets/css/stores.css";

export const globals = {};

export const start = function() {
    const element = document.getElementById("app");
    if (element.classList.contains("stores")) {
        globals.app = stores();
    }
};

export default start;
