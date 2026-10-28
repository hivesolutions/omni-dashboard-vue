<template>
    <div class="settings-container" v-bind:class="{ visible: isVisible }" v-on:click.self="hide">
        <div
            class="settings"
            role="dialog"
            aria-modal="true"
            tabindex="-1"
            v-bind:aria-label="$root.translate('settings')"
            ref="settings"
            v-on:keyup.stop
            v-on:keyup.esc="hide"
            v-on:keydown.tab="trapFocus"
        >
            <div class="handle" />
            <div class="header">
                <div class="title">
                    <div class="caption">
                        {{ $root.translate("savedInBrowser") }}
                    </div>
                    <h2>{{ $root.translate("settings") }}</h2>
                </div>
                <ButtonColor v-on:click="hide">
                    {{ $root.translate("done") }}
                </ButtonColor>
            </div>
            <div class="setting setting-language">
                <div class="label">
                    <div class="name">
                        {{ $root.translate("language") }}
                    </div>
                </div>
                <div class="segments" role="group" v-bind:aria-label="$root.translate('language')">
                    <button
                        v-bind:aria-pressed="String(settings.language === language.name)"
                        v-for="language in languages"
                        v-bind:key="language.name"
                        v-on:click="setSetting('language', language.name)"
                    >
                        {{ language.label }}
                    </button>
                </div>
            </div>
            <div class="setting">
                <div class="label">
                    <div class="name">
                        {{ $root.translate("comparison") }}
                    </div>
                    <div class="description">
                        {{ $root.translate("comparisonDescription") }}
                    </div>
                </div>
                <button
                    class="switch"
                    role="switch"
                    v-bind:aria-label="$root.translate('comparison')"
                    v-bind:aria-checked="String(settings.comparison)"
                    v-on:click="setSetting('comparison', !settings.comparison)"
                >
                    <span class="track"><span class="knob" /></span>
                </button>
            </div>
            <div class="setting setting-column">
                <div class="label">
                    <div class="name">
                        {{ $root.translate("numberFormat") }}
                    </div>
                    <div class="description">
                        {{ $root.translate("automaticFollows", { locale: locale }) }}
                    </div>
                </div>
                <div
                    class="segments"
                    role="group"
                    v-bind:aria-label="$root.translate('numberFormat')"
                >
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
            <div class="setting setting-opens">
                <div class="label">
                    <div class="name">
                        {{ $root.translate("opensWith") }}
                    </div>
                </div>
                <div class="controls">
                    <div
                        class="segments"
                        role="group"
                        v-bind:aria-label="$root.translate('period')"
                    >
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
                            v-bind:aria-label="$root.translate('measure')"
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
            <div class="setting setting-history">
                <div class="label">
                    <div class="name">
                        {{ $root.translate("historyRows") }}
                    </div>
                </div>
                <div
                    class="stepper"
                    role="group"
                    v-bind:aria-label="$root.translate('historyRows')"
                >
                    <button
                        v-bind:aria-label="$root.translate('fewerRows')"
                        v-bind:disabled="settings.span <= spanRange[0]"
                        v-on:click="setSetting('span', settings.span - 1)"
                    >
                        &minus;
                    </button>
                    <span class="value">{{ settings.span }}</span>
                    <button
                        v-bind:aria-label="$root.translate('moreRows')"
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
                        {{ $root.translate("refreshEvery") }}
                    </div>
                </div>
                <div
                    class="segments"
                    role="group"
                    v-bind:aria-label="$root.translate('refreshInterval')"
                >
                    <button
                        v-bind:aria-pressed="String(settings.interval === interval)"
                        v-for="interval in intervals"
                        v-bind:key="interval"
                        v-on:click="setSetting('interval', interval)"
                    >
                        {{ $root.translate("minutes", { count: interval }) }}
                    </button>
                </div>
            </div>
            <div class="reset">
                <button v-on:click="reset">
                    {{ $root.translate("resetDefaults") }}
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
    animation: slide-up 0.28s cubic-bezier(0.16, 1, 0.3, 1);
    background-color: #fefefe;
    border-radius: 16px 16px 0px 0px;
    box-shadow: 0px -8px 24px rgba(10, 10, 10, 0.3);
    box-sizing: border-box;
    max-height: 100%;
    max-width: 420px;
    outline: none;
    overflow-y: auto;
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
    flex-wrap: wrap;
    gap: 0px 8px;
    justify-content: space-between;
}

.settings > .setting.setting-column > .label > .description {
    white-space: nowrap;
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
    flex: 1 1 auto;
    min-width: 0px;
    padding: 0px 6px 0px 6px;
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

@media screen and (max-width: 420px) {

    .settings > .setting.setting-opens {
        display: block;
        padding: 12px 0px 12px 0px;
    }

    .settings > .setting.setting-opens > .controls {
        margin-top: 10px;
    }

    .settings > .setting.setting-opens .select {
        flex: 1 1 auto;
    }

    .settings > .setting.setting-opens .select > select {
        width: 100%;
    }
}

@media screen and (max-width: 359px) {

    .settings > .setting.setting-language,
    .settings > .setting.setting-history {
        display: block;
        padding: 12px 0px 12px 0px;
    }

    .settings > .setting.setting-language > .segments,
    .settings > .setting.setting-history > .stepper {
        margin-top: 10px;
    }

    .settings > .setting.setting-language > .segments > button {
        flex: 1 1 auto;
        min-width: 0px;
        padding: 0px 6px 0px 6px;
    }
}
</style>

<script>
import ButtonColor from "../button-color/button-color.vue";
import {
    defaultSettings,
    dimensions,
    intervals,
    languageLocale,
    languages,
    locales,
    numberFormats,
    spanRange,
    wrapFocus
} from "../../util";

export const MEASURES = {
    net_price_vat: "measureSales",
    net_number_sales: "measureNumberSales",
    net_average_sale: "measureAverageSale",
    number_entries: "measureEntries",
    conversion_rate: "measureConversion"
};

export const Settings = {
    components: {
        ButtonColor
    },
    data: function() {
        return {
            isVisible: false,
            opener: null,
            intervals: intervals,
            spanRange: spanRange
        };
    },
    computed: {
        settings: function() {
            return this.$root.settings;
        },
        languages: function() {
            return languages.map(name => ({
                name: name,
                label: locales[name] ? locales[name].name : this.$root.translate("automatic")
            }));
        },
        formats: function() {
            return Object.keys(numberFormats).map(name => ({
                name: name,
                label: numberFormats[name]
                    ? (1234.56).formatMoney(2, numberFormats[name][0], numberFormats[name][1])
                    : this.$root.translate("automatic")
            }));
        },
        units: function() {
            return [
                { name: "day", label: this.$root.translate("periodDay") },
                { name: "month", label: this.$root.translate("periodMonth") }
            ];
        },
        measures: function() {
            return dimensions.map(name => ({
                name: name,
                label: this.$root.translate(MEASURES[name])
            }));
        },
        locale: function() {
            return languageLocale(this.settings.language, navigator.language);
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
            this.opener = document.activeElement;
            this.isVisible = true;
            setTimeout(() => {
                this.$refs.settings.focus();
            });
        },
        hide: function() {
            // gives the focus back to the control that opened the sheet,
            // so that keyboard users carry on from where they were
            if (this.isVisible && this.opener && this.opener.focus) this.opener.focus();
            this.isVisible = false;
            this.opener = null;
        },
        trapFocus: function(event) {
            // keeps the focus within the sheet while it's open, wrapping
            // around its first and last controls
            const elements = [
                ...this.$refs.settings.querySelectorAll("button, select, [tabindex='0']")
            ].filter(element => !element.disabled);
            const target = wrapFocus(elements, document.activeElement, event.shiftKey);
            if (!target) return;
            event.preventDefault();
            target.focus();
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
