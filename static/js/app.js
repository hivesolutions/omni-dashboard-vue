import demo from "./demo";
import stores from "./stores";

export const start = function() {
    const element = document.getElementById("app");
    if (element.classList.contains("demo")) {
        demo();
    }
    if (element.classList.contains("stores")) {
        stores();
    }
};

export default start;
