import stores from "./stores";
import "hive-js-util";

import * as OfflinePluginRuntime from "offline-plugin/runtime";

import "typeface-open-sans";

import "./assets/css/base.css";
import "./assets/css/layout.css";

export const globals = {};

export const start = function() {
    startBody();
    startApp();
    install();
};

export const startBody = function() {
    const colors = document.body.dataset.gradients.split(",");
    const color = colors[Math.floor(Math.random() * colors.length)];
    document.body.classList.add(color);
};

export const startApp = function() {
    const element = document.getElementById("app");
    if (element.classList.contains("app-stores")) {
        globals.app = stores();
    }
};

export const install = function() {
    OfflinePluginRuntime.install();
};

if (typeof window !== "undefined") {
    window.globals = globals;
}

export default start;
