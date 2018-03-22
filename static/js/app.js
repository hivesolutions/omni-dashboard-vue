import demo from "./demo";
import stores from "./stores";

export const globals = {};

export const start = function() {
    const element = document.getElementById("app");
    if (element.classList.contains("demo")) {
        globals.app = demo();
    }
    if (element.classList.contains("stores")) {
        globals.app = stores();
    }
};

export default start;
