import stores from "./stores";
import "hive-js-util";

import * as OfflinePluginRuntime from "offline-plugin/runtime";

import "./assets/css/base.css";
import "./assets/css/layout.css";

export const globals = {};

export const start = function() {
    const element = document.getElementById("app");
    if (element.classList.contains("app-stores")) {
        globals.app = stores();
    }
    install();
};

export const install = function() {
    OfflinePluginRuntime.install();
};

if (typeof window !== "undefined") {
    window.globals = globals;
}

export default start;
