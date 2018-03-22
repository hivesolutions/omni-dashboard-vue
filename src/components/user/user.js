import Vue from "vue";

export const User = Vue.component("user", {
    template: "<div class=\"user\">{{ user.name }} <{{ user.email }}></div>",
    props: {
        user: {
            type: Object,
            default: {
                name: "John Doe",
                email: "john@doe.com"
            }
        }
    }
});

export default User;
