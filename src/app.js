import stores from "./stores";
import "hive-js-util";

import * as OfflinePluginRuntime from "offline-plugin/runtime";

import "typeface-open-sans";

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

console.info("vai fazer bind");
window.addEventListener("beforeinstallprompt", function(event) {
    globals.app.logout();
    event.preventDefault();
});

export default start;
