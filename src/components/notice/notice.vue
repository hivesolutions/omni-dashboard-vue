<template>
    <div class="notice" v-if="isVisible">
        <ButtonColor class="button-small button-transparent">
            Install App
        </ButtonColor>
    </div>
</template>

<style scoped>
.notice {
    bottom: 16px;
    position: fixed;
    right: 22px;
}

@media screen and (max-width: 760px) {

    .notice {
        bottom: 16px;
        left: 0px;
        position: absolute;
        text-align: center;
        width: 100%;
    }
}
</style>

<script>
import ButtonColor from "../button-color/button-color.vue";

export const Notice = {
    components: {
        ButtonColor
    },
    data: function() {
        return {
            isVisible: true
        };
    },
    methods: {
        show: function() {
            this.isVisible = true;
        },
        hide: function() {
            this.isVisible = false;
        }
    }
};

export default Notice;
</script>
