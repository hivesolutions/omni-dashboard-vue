import demo from "./demo";
import stores from "./stores";

const start = function() {
    const element = document.getElementById("app");
    if (element.classList.contains("demo")) {
        demo();
    }
    if (element.classList.contains("stores")) {
        stores();
    }
};
