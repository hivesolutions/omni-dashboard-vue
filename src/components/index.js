import { ButtonColor } from "./button-color/button-color.vue";
import { Carousel } from "./carousel/carousel.vue";
import { Slide } from "./carousel/slide.vue";
import { Login } from "./login/login.vue";
import { Message } from "./message/message.vue";
import { Notice } from "./notice/notice.vue";
import { Overlay } from "./overlay/overlay.vue";
import { Store } from "./store/store.vue";
import { Stores } from "./stores/stores.vue";

export const install = app => {
    app.component("button-color", ButtonColor);
    app.component("carousel", Carousel);
    app.component("slide", Slide);
    app.component("login", Login);
    app.component("message", Message);
    app.component("notice", Notice);
    app.component("overlay", Overlay);
    app.component("store", Store);
    app.component("stores", Stores);
};

export default install;
