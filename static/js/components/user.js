import Vue from "vue";

export default User = Vue.component("user", {
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
