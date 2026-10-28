<template>
    <div class="settings-container" v-bind:class="{ visible: isVisible }" v-on:click.self="hide">
        <div
            class="settings"
            tabindex="-1"
            ref="settings"
            v-on:keyup.stop
            v-on:keyup.esc="hide"
        >
            <div class="handle" />
            <div class="header">
                <div class="title">
                    <div class="caption">
                        Saved in this browser
                    </div>
                    <h2>Settings</h2>
                </div>
                <ButtonColor v-on:click="hide">
                    Done
                </ButtonColor>
            </div>
            <div class="setting">
                <div class="label">
                    <div class="name">
                        Year-on-year comparison
                    </div>
                    <div class="description">
                        The vs line under every row
                    </div>
                </div>
                <button
                    class="switch"
                    role="switch"
                    aria-label="Year-on-year comparison"
                    v-bind:aria-checked="String(settings.comparison)"
                    v-on:click="setSetting('comparison', !settings.comparison)"
                >
                    <span class="track"><span class="knob" /></span>
                </button>
            </div>
            <div class="setting setting-column">
                <div class="label">
                    <div class="name">
                        Number format
                    </div>
                    <div class="description">
                        Automatic follows {{ language }}
                    </div>
                </div>
                <div class="segments" role="group" aria-label="Number format">
                    <button
                        v-bind:aria-pressed="String(settings.format === format.name)"
                        v-for="format in formats"
                        v-bind:key="format.name"
                        v-on:click="setSetting('format', format.name)"
                    >
                        {{ format.label }}
                    </button>
                </div>
            </div>
            <div class="setting">
                <div class="label">
                    <div class="name">
                        Opens with
                    </div>
                </div>
                <div class="controls">
                    <div class="segments" role="group" aria-label="Period">
                        <button
                            v-bind:aria-pressed="String(settings.unit === unit.name)"
                            v-for="unit in units"
                            v-bind:key="unit.name"
                            v-on:click="setUnit(unit.name)"
                        >
                            {{ unit.label }}
                        </button>
                    </div>
                    <span class="select">
                        <select
                            aria-label="Measure"
                            v-bind:value="settings.dimension"
                            v-on:change="setDimension($event.target.value)"
                        >
                            <option
                                v-bind:value="measure.name"
                                v-for="measure in measures"
                                v-bind:key="measure.name"
                            >
                                {{ measure.label }}
                            </option>
                        </select>
                        <img src="~./assets/chevron.svg" />
                    </span>
                </div>
            </div>
            <div class="setting">
                <div class="label">
                    <div class="name">
                        History rows
                    </div>
                </div>
                <div class="stepper" role="group" aria-label="History rows">
                    <button
                        aria-label="Fewer rows"
                        v-bind:disabled="settings.span <= spanRange[0]"
                        v-on:click="setSetting('span', settings.span - 1)"
                    >
                        &minus;
                    </button>
                    <span class="value">{{ settings.span }}</span>
                    <button
                        aria-label="More rows"
                        v-bind:disabled="settings.span >= spanRange[1]"
                        v-on:click="setSetting('span', settings.span + 1)"
                    >
                        +
                    </button>
                </div>
            </div>
            <div class="setting setting-column">
                <div class="label">
                    <div class="name">
                        Refresh every
                    </div>
                </div>
                <div class="segments" role="group" aria-label="Refresh interval">
                    <button
                        v-bind:aria-pressed="String(settings.interval === interval)"
                        v-for="interval in intervals"
                        v-bind:key="interval"
                        v-on:click="setSetting('interval', interval)"
                    >
                        {{ interval }} min
                    </button>
                </div>
            </div>
            <div class="reset">
                <button v-on:click="reset">
                    Reset to defaults
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.settings-container {
    align-items: flex-end;
    display: none;
    height: 100%;
    justify-content: center;
    left: 0px;
    position: fixed;
    top: 0px;
    width: 100%;
    z-index: 20;
}

.settings-container.visible {
    display: flex;
}

.settings {
    animation: fade-into 0.35s ease-in-out;
    background-color: #fefefe;
    border-radius: 16px 16px 0px 0px;
    box-shadow: 0px -8px 24px rgba(10, 10, 10, 0.3);
    box-sizing: border-box;
    max-width: 420px;
    outline: none;
    padding: 10px 24px 20px 24px;
    text-align: left;
    user-select: none;
    width: 100%;
}

.settings button {
    background-color: transparent;
    border: none;
    color: #2d2d2d;
    cursor: pointer;
    font-family: inherit;
    font-weight: 600;
    padding: 0px 0px 0px 0px;
}

.settings > .handle {
    background-color: #d6d6d6;
    border-radius: 2px 2px 2px 2px;
    height: 4px;
    margin: 0px auto 12px auto;
    width: 36px;
}

.settings > .header {
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
}

.settings > .header > .button {
    min-width: 88px;
}

.settings .caption,
.settings .description {
    color: #6d6d6d;
    font-weight: 600;
}

.settings .caption {
    font-size: 10px;
    text-transform: uppercase;
}

.settings h2 {
    font-size: 18px;
    line-height: 18px;
    margin: 4px 0px 0px 0px;
}

.settings > .setting {
    align-items: center;
    border-bottom: 1px solid #ececec;
    display: flex;
    flex-wrap: wrap;
    gap: 8px 12px;
    justify-content: space-between;
    min-height: 60px;
}

.settings > .setting.setting-column {
    display: block;
    padding: 12px 0px 12px 0px;
}

.settings > .setting.setting-column > .label {
    align-items: baseline;
    display: flex;
    justify-content: space-between;
}

.settings .name {
    font-size: 15px;
    font-weight: 600;
}

.settings .description {
    font-size: 11px;
    margin-top: 3px;
}

.settings .switch {
    align-items: center;
    display: flex;
    height: 44px;
    justify-content: flex-end;
    width: 48px;
}

.settings .switch > .track {
    background-color: #b4b4b4;
    border-radius: 13px 13px 13px 13px;
    box-sizing: border-box;
    display: flex;
    height: 26px;
    padding: 3px 3px 3px 3px;
    transition: background-color 0.15s linear;
    width: 44px;
}

.settings .switch[aria-checked="true"] > .track {
    background-color: #1c7591;
    justify-content: flex-end;
}

.settings .switch .knob {
    background-color: #ffffff;
    border-radius: 10px 10px 10px 10px;
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.3);
    height: 20px;
    width: 20px;
}

.settings .controls {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: flex-end;
}

.settings .segments {
    border: 1px solid #e2e2e2;
    border-radius: 22px 22px 22px 22px;
    display: flex;
    padding: 2px 2px 2px 2px;
}

.settings > .setting-column .segments {
    display: grid;
    grid-template-columns: repeat(4, minmax(0px, 1fr));
    margin-top: 10px;
}

.settings .segments > button {
    border-radius: 19px 19px 19px 19px;
    font-size: 12px;
    height: 38px;
    min-width: 52px;
    padding: 0px 8px 0px 8px;
    white-space: nowrap;
}

.settings > .setting-column .segments > button {
    min-width: 0px;
    padding: 0px 2px 0px 2px;
}

.settings .segments > button[aria-pressed="true"] {
    background-color: #2d2d2d;
    color: #ffffff;
}

.settings .select {
    display: inline-block;
    position: relative;
}

.settings .select > select {
    appearance: none;
    background-color: #ffffff;
    border: 1px solid #e2e2e2;
    border-radius: 22px 22px 22px 22px;
    color: #2d2d2d;
    cursor: pointer;
    font-family: inherit;
    font-size: 12px;
    font-weight: 600;
    height: 44px;
    padding: 0px 30px 0px 14px;
}

.settings .select > img {
    pointer-events: none;
    position: absolute;
    right: 12px;
    top: 14px;
}

.settings .stepper {
    align-items: center;
    display: flex;
    gap: 4px;
}

.settings .stepper > button {
    border: 1px solid #e2e2e2;
    border-radius: 20px 20px 20px 20px;
    font-size: 18px;
    height: 40px;
    line-height: 38px;
    width: 40px;
}

.settings .stepper > button:disabled {
    cursor: default;
    opacity: 0.35;
}

.settings .stepper > .value {
    font-size: 16px;
    font-weight: 600;
    min-width: 32px;
    text-align: center;
}

.settings > .reset {
    margin-top: 8px;
    text-align: center;
}

.settings > .reset > button {
    color: #4d4d4d;
    font-size: 11px;
    font-weight: 700;
    height: 44px;
    letter-spacing: 0.3px;
    padding: 0px 12px 0px 12px;
    text-transform: uppercase;
}
</style>

<script>
import ButtonColor from "../button-color/button-color.vue";
import { defaultSettings, dimensions, intervals, numberFormats, spanRange } from "../../util";

export const MEASURES = {
    net_price_vat: "Sales (EUR)",
    net_number_sales: "Number of sales",
    net_average_sale: "Average sale",
    number_entries: "Entries",
    conversion_rate: "Conversion"
};

export const Settings = {
    components: {
        ButtonColor
    },
    data: function() {
        return {
            isVisible: false,
            intervals: intervals,
            spanRange: spanRange,
            units: [
                { name: "day", label: "Day" },
                { name: "month", label: "Month" }
            ]
        };
    },
    computed: {
        settings: function() {
            return this.$root.settings;
        },
        formats: function() {
            return Object.keys(numberFormats).map(name => ({
                name: name,
                label: numberFormats[name]
                    ? (1234.56).formatMoney(2, numberFormats[name][0], numberFormats[name][1])
                    : "Automatic"
            }));
        },
        measures: function() {
            return dimensions.map(name => ({ name: name, label: MEASURES[name] }));
        },
        language: function() {
            return navigator.language;
        }
    },
    watch: {
        isVisible: function(val) {
            if (val) {
                this.$root.showOverlay();
            } else {
                this.$root.hideOverlay();
            }
        }
    },
    methods: {
        show: function() {
            this.isVisible = true;
            setTimeout(() => {
                this.$refs.settings.focus();
            });
        },
        hide: function() {
            this.isVisible = false;
        },
        setSetting: function(name, value) {
            this.$root.setSetting(name, value);
        },
        setUnit: function(unit) {
            // the period is also applied to the cards being shown, the
            // same way the trend arrow switches it for the session
            this.setSetting("unit", unit);
            this.$root.changeUnit(unit);
        },
        setDimension: function(dimension) {
            this.setSetting("dimension", dimension);
            this.$root.changeDimension(dimension);
        },
        reset: function() {
            this.$root.settings = { ...defaultSettings };
            this.$root.changeUnit(defaultSettings.unit);
            this.$root.changeDimension(defaultSettings.dimension);
        }
    }
};

export default Settings;
</script>
