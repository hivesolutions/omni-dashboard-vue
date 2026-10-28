const assert = require("assert");
require("hive-js-util");
const util = require("../src/util");

describe("Util", function() {
    describe("#locales", function() {
        it("should have the same texts in every language", () => {
            const keys = Object.keys(util.locales.en.texts).sort();
            Object.keys(util.locales).forEach(language => {
                assert.deepStrictEqual(Object.keys(util.locales[language].texts).sort(), keys);
            });
        });
        it("should have the same placeholders in every language", () => {
            const placeholders = text => (text.match(/\{\w+\}/g) || []).sort();
            Object.keys(util.locales).forEach(language => {
                Object.keys(util.locales.en.texts).forEach(key => {
                    assert.deepStrictEqual(
                        placeholders(util.locales[language].texts[key]),
                        placeholders(util.locales.en.texts[key]),
                        `${language}.${key}`
                    );
                });
            });
        });
        it("should have distinct short day and month names", () => {
            Object.keys(util.locales).forEach(language => {
                const { daysOfWeek, months } = util.locales[language];
                assert.strictEqual(daysOfWeek.length, 7);
                assert.strictEqual(months.length, 12);
                assert.strictEqual(new Set(daysOfWeek.map(v => v.slice(0, 3))).size, 7);
                assert.strictEqual(new Set(months.map(v => v.slice(0, 3))).size, 12);
            });
        });
        it("should offer the automatic language and every locale", () => {
            assert.deepStrictEqual(util.languages, ["auto", "en", "pt"]);
            assert.strictEqual(util.locales.en.locale, "en");
            assert.strictEqual(util.locales.pt.locale, "pt-PT");
        });
    });

    describe("#translate()", function() {
        it("should return the text in the language", () => {
            assert.strictEqual(util.translate("refresh", "en"), "Refresh");
            assert.strictEqual(util.translate("refresh", "pt"), "Atualizar");
            assert.strictEqual(util.translate("settings", "pt"), "Definições");
        });
        it("should use English by default", () => {
            assert.strictEqual(util.translate("refresh"), "Refresh");
        });
        it("should fill the placeholders", () => {
            assert.strictEqual(util.translate("today", "en", { label: "Sales" }), "Today's Sales");
            assert.strictEqual(
                util.translate("today", "pt", { label: "Vendas" }),
                "Vendas de hoje"
            );
            assert.strictEqual(util.translate("minutes", "pt", { count: 15 }), "15 min");
            assert.strictEqual(util.translate("minutes", "en", { count: 0 }), "0 min");
        });
        it("should keep the placeholders without values", () => {
            assert.strictEqual(util.translate("fullDay", "pt"), "{label}, dia completo");
            assert.strictEqual(
                util.translate("today", "en", { other: "Sales" }),
                "Today's {label}"
            );
        });
        it("should insert the values as they are", () => {
            assert.strictEqual(
                util.translate("errorLoadingDetail", "en", { message: "$& 50% {label}" }),
                "Error loading remote data: $& 50% {label}"
            );
        });
        it("should fall back to English for unknown languages", () => {
            assert.strictEqual(util.translate("refresh", "fr"), "Refresh");
            assert.strictEqual(util.translate("refresh", undefined), "Refresh");
            assert.strictEqual(util.translate("refresh", "toString"), "Refresh");
        });
        it("should fall back to English for missing texts", () => {
            const text = util.locales.pt.texts.updated;
            delete util.locales.pt.texts.updated;
            try {
                assert.strictEqual(util.translate("updated", "pt"), "Updated");
            } finally {
                util.locales.pt.texts.updated = text;
            }
            assert.strictEqual(util.translate("updated", "pt"), "Atualizado");
        });
        it("should return the key for unknown texts", () => {
            assert.strictEqual(util.translate("unknown", "pt"), "unknown");
            assert.strictEqual(util.translate("toString", "pt"), "toString");
            assert.strictEqual(util.translate("constructor", "en"), "constructor");
        });
    });

    describe("#resolveLanguage()", function() {
        it("should keep a chosen language", () => {
            assert.strictEqual(util.resolveLanguage("en", "pt-PT"), "en");
            assert.strictEqual(util.resolveLanguage("pt", "en-US"), "pt");
        });
        it("should use Portuguese for Portuguese browsers", () => {
            assert.strictEqual(util.resolveLanguage("auto", "pt-PT"), "pt");
            assert.strictEqual(util.resolveLanguage("auto", "pt-BR"), "pt");
            assert.strictEqual(util.resolveLanguage("auto", "pt"), "pt");
            assert.strictEqual(util.resolveLanguage("auto", "PT-pt"), "pt");
            assert.strictEqual(util.resolveLanguage("auto", "pt_PT"), "pt");
        });
        it("should use English for other browsers", () => {
            assert.strictEqual(util.resolveLanguage("auto", "en-US"), "en");
            assert.strictEqual(util.resolveLanguage("auto", "de-DE"), "en");
            assert.strictEqual(util.resolveLanguage("auto", "ptx"), "en");
            assert.strictEqual(util.resolveLanguage("auto", ""), "en");
            assert.strictEqual(util.resolveLanguage("auto", undefined), "en");
            assert.strictEqual(util.resolveLanguage("auto", null), "en");
        });
        it("should treat unknown languages as automatic", () => {
            assert.strictEqual(util.resolveLanguage("fr", "pt-PT"), "pt");
            assert.strictEqual(util.resolveLanguage(undefined, "en-US"), "en");
            assert.strictEqual(util.resolveLanguage("toString", "de-DE"), "en");
        });
    });

    describe("#languageLocale()", function() {
        it("should return the locale of a chosen language", () => {
            assert.strictEqual(util.languageLocale("pt", "en-US"), "pt-PT");
            assert.strictEqual(util.languageLocale("en", "pt-PT"), "en");
        });
        it("should keep the browser's locale for the automatic language", () => {
            assert.strictEqual(util.languageLocale("auto", "de-DE"), "de-DE");
            assert.strictEqual(util.languageLocale("auto", undefined), undefined);
            assert.strictEqual(util.languageLocale("toString", "fr-FR"), "fr-FR");
        });
    });

    describe("#dayName()", function() {
        it("should return the name of the day in the language", () => {
            assert.strictEqual(util.dayName(new Date(2026, 9, 28)), "Wednesday");
            assert.strictEqual(util.dayName(new Date(2026, 9, 28), "pt"), "Quarta-feira");
            assert.strictEqual(util.dayName(new Date(2026, 9, 31), "pt"), "Sábado");
            assert.strictEqual(util.dayName(new Date(2026, 10, 1), "pt"), "Domingo");
            assert.strictEqual(util.dayName(new Date(2026, 9, 28), "fr"), "Wednesday");
        });
    });

    describe("#monthName()", function() {
        it("should return the name of the month in the language", () => {
            assert.strictEqual(util.monthName(new Date(2026, 9, 28)), "October");
            assert.strictEqual(util.monthName(new Date(2026, 9, 28), "pt"), "Outubro");
            assert.strictEqual(util.monthName(new Date(2026, 2, 1), "pt"), "Março");
            assert.strictEqual(util.monthName(new Date(2026, 11, 31), "pt"), "Dezembro");
            assert.strictEqual(util.monthName(new Date(2026, 9, 28), "fr"), "October");
        });
    });

    describe("#lastYear()", function() {
        it("should return the same date of the previous year", () => {
            const result = util.lastYear(new Date(2026, 9, 27, 14, 35, 10));
            assert.strictEqual(result.getFullYear(), 2025);
            assert.strictEqual(result.getMonth(), 9);
            assert.strictEqual(result.getDate(), 27);
            assert.strictEqual(result.getHours(), 14);
            assert.strictEqual(result.getMinutes(), 35);
            assert.strictEqual(result.getSeconds(), 10);
        });
        it("should map the 29th of February to the 28th", () => {
            let result = util.lastYear(new Date(2028, 1, 29, 10, 0));
            assert.strictEqual(result.getFullYear(), 2027);
            assert.strictEqual(result.getMonth(), 1);
            assert.strictEqual(result.getDate(), 28);
            assert.strictEqual(result.getHours(), 10);

            result = util.lastYear(new Date(2028, 1, 28));
            assert.strictEqual(result.getMonth(), 1);
            assert.strictEqual(result.getDate(), 28);

            result = util.lastYear(new Date(2028, 2, 1));
            assert.strictEqual(result.getMonth(), 2);
            assert.strictEqual(result.getDate(), 1);
        });
        it("should keep the 29th of February into a leap year", () => {
            const result = util.lastYear(new Date(2029, 2, 1));
            assert.strictEqual(result.getFullYear(), 2028);
            assert.strictEqual(result.getMonth(), 2);
            assert.strictEqual(result.getDate(), 1);
        });
        it("should handle the year boundaries", () => {
            let result = util.lastYear(new Date(2026, 0, 1));
            assert.strictEqual(result.getFullYear(), 2025);
            assert.strictEqual(result.getMonth(), 0);
            assert.strictEqual(result.getDate(), 1);

            result = util.lastYear(new Date(2026, 11, 31));
            assert.strictEqual(result.getFullYear(), 2025);
            assert.strictEqual(result.getMonth(), 11);
            assert.strictEqual(result.getDate(), 31);
        });
        it("should not change the provided date", () => {
            const date = new Date(2028, 1, 29);
            util.lastYear(date);
            assert.strictEqual(date.getFullYear(), 2028);
            assert.strictEqual(date.getMonth(), 1);
            assert.strictEqual(date.getDate(), 29);
        });
    });

    describe("#previousDate()", function() {
        it("should return the previous day", () => {
            const result = util.previousDate(new Date(2026, 9, 27, 14, 35));
            assert.strictEqual(result.getFullYear(), 2026);
            assert.strictEqual(result.getMonth(), 9);
            assert.strictEqual(result.getDate(), 26);
            assert.strictEqual(util.previousDate(new Date(2026, 9, 27), "day").getDate(), 26);
        });
        it("should return the previous day across months and years", () => {
            let result = util.previousDate(new Date(2028, 2, 1));
            assert.strictEqual(result.getMonth(), 1);
            assert.strictEqual(result.getDate(), 29);

            result = util.previousDate(new Date(2027, 2, 1));
            assert.strictEqual(result.getMonth(), 1);
            assert.strictEqual(result.getDate(), 28);

            result = util.previousDate(new Date(2026, 0, 1));
            assert.strictEqual(result.getFullYear(), 2025);
            assert.strictEqual(result.getMonth(), 11);
            assert.strictEqual(result.getDate(), 31);
        });
        it("should step every day across daylight saving changes", () => {
            const timezone = process.env.TZ;
            process.env.TZ = "Europe/Lisbon";
            try {
                const days = (date, count) => {
                    const result = [];
                    for (let i = 0; i < count; i++) {
                        date = util.previousDate(date);
                        result.push(date.getDate());
                    }
                    return result;
                };
                assert.deepStrictEqual(days(new Date(2026, 9, 27, 23, 25), 4), [26, 25, 24, 23]);
                assert.deepStrictEqual(days(new Date(2026, 9, 26, 0, 30), 3), [25, 24, 23]);
                assert.deepStrictEqual(days(new Date(2026, 2, 30, 0, 30), 3), [29, 28, 27]);
                assert.deepStrictEqual(days(new Date(2026, 2, 30, 23, 30), 3), [29, 28, 27]);
            } finally {
                if (timezone === undefined) delete process.env.TZ;
                else process.env.TZ = timezone;
            }
        });
        it("should return the start of the previous month", () => {
            let result = util.previousDate(new Date(2026, 9, 27, 14, 35), "month");
            assert.strictEqual(result.getFullYear(), 2026);
            assert.strictEqual(result.getMonth(), 8);
            assert.strictEqual(result.getDate(), 1);

            result = util.previousDate(new Date(2026, 2, 31), "month");
            assert.strictEqual(result.getMonth(), 1);
            assert.strictEqual(result.getDate(), 1);
        });
        it("should return the start of the previous month across years", () => {
            const result = util.previousDate(new Date(2026, 0, 15), "month");
            assert.strictEqual(result.getFullYear(), 2025);
            assert.strictEqual(result.getMonth(), 11);
            assert.strictEqual(result.getDate(), 1);
        });
        it("should not change the provided date", () => {
            const date = new Date(2026, 9, 27, 14, 35);
            util.previousDate(date);
            util.previousDate(date, "month");
            assert.strictEqual(date.getDate(), 27);
            assert.strictEqual(date.getMonth(), 9);
        });
    });

    describe("#measureValues()", function() {
        const store = {
            net_price_vat: [100.0, 50.0, 0.0],
            net_number_sales: [4, 0, 0],
            number_entries: [20, 10, 0]
        };

        it("should return the sales values", () => {
            const result = util.measureValues(store, "net_price_vat");
            assert.deepStrictEqual(result, {
                values: [100.0, 50.0, 0.0],
                currency: "EUR",
                label: "Sales",
                places: 2
            });
        });
        it("should return the number of sales", () => {
            const result = util.measureValues(store, "net_number_sales");
            assert.deepStrictEqual(result, {
                values: [4, 0, 0],
                currency: "SAL",
                label: "Sales",
                places: 0
            });
        });
        it("should compute the average sale", () => {
            const result = util.measureValues(store, "net_average_sale");
            assert.deepStrictEqual(result, {
                values: [25.0, 50.0, 0.0],
                currency: "EUR",
                label: "Avg.",
                places: 2
            });
        });
        it("should return the number of entries", () => {
            const result = util.measureValues(store, "number_entries");
            assert.deepStrictEqual(result, {
                values: [20, 10, 0],
                currency: "ENT",
                label: "Entries",
                places: 0
            });
        });
        it("should compute the conversion rate", () => {
            const result = util.measureValues(store, "conversion_rate");
            assert.deepStrictEqual(result, {
                values: [20.0, 0.0, 0.0],
                currency: "%",
                label: "Conv.",
                places: 1
            });
        });
        it("should use the labels and units of the language", () => {
            const labels = dimension => {
                const { currency, label } = util.measureValues(store, dimension, "pt");
                return `${label} ${currency}`;
            };
            assert.strictEqual(labels("net_price_vat"), "Vendas EUR");
            assert.strictEqual(labels("net_number_sales"), "Vendas VEN");
            assert.strictEqual(labels("net_average_sale"), "Média EUR");
            assert.strictEqual(labels("number_entries"), "Entradas ENT");
            assert.strictEqual(labels("conversion_rate"), "Conv. %");
        });
    });

    describe("#totalStore()", function() {
        it("should sum the values of the store", () => {
            const result = util.totalStore({
                name: "1-Store",
                net_price_vat: [100.0, 50.5, 0.0],
                net_number_sales: [4, 1, 0],
                number_entries: [20, 10, 0]
            });
            assert.deepStrictEqual(result, {
                net_price_vat: [150.5],
                net_number_sales: [5],
                number_entries: [30]
            });
        });
        it("should sum empty values to zero", () => {
            const result = util.totalStore({
                net_price_vat: [],
                net_number_sales: [],
                number_entries: []
            });
            assert.deepStrictEqual(result, {
                net_price_vat: [0.0],
                net_number_sales: [0.0],
                number_entries: [0.0]
            });
        });
        it("should derive the measures from the totals", () => {
            const store = {
                net_price_vat: [100.0, 300.0],
                net_number_sales: [1, 3],
                number_entries: [10, 10]
            };
            const total = util.totalStore(store);
            assert.deepStrictEqual(util.measureValues(total, "net_average_sale").values, [100.0]);
            assert.deepStrictEqual(util.measureValues(total, "conversion_rate").values, [20.0]);
        });
    });

    describe("#valueAt()", function() {
        const values = [10, 20, 30, 40];

        it("should return the value for the day", () => {
            const end = new Date(2025, 9, 27, 14, 35);
            assert.strictEqual(util.valueAt(values, end, new Date(2025, 9, 27, 9, 0)), 40);
            assert.strictEqual(util.valueAt(values, end, new Date(2025, 9, 26, 23, 59)), 30);
            assert.strictEqual(util.valueAt(values, end, new Date(2025, 9, 24, 0, 0)), 10);
            assert.strictEqual(util.valueAt(values, end, new Date(2025, 9, 27), "day"), 40);
        });
        it("should return null for days out of range", () => {
            const end = new Date(2025, 9, 27);
            assert.strictEqual(util.valueAt(values, end, new Date(2025, 9, 23)), null);
            assert.strictEqual(util.valueAt(values, end, new Date(2025, 9, 28)), null);
            assert.strictEqual(util.valueAt([], end, end), null);
        });
        it("should return null for missing values", () => {
            const end = new Date(2025, 9, 27);
            assert.strictEqual(util.valueAt(null, end, end), null);
            assert.strictEqual(util.valueAt(undefined, end, end), null);
            assert.strictEqual(util.valueAt([10, null], end, end), null);
        });
        it("should keep zero values", () => {
            const end = new Date(2025, 9, 27);
            assert.strictEqual(util.valueAt([0, 0], end, end), 0);
        });
        it("should align the days across a leap day", () => {
            const end = util.lastYear(new Date(2028, 2, 2));
            const days = [24, 25, 26, 27, 28].map(v => new Date(2027, 1, v));
            const valuesLy = [24, 25, 26, 27, 28, 1, 2];
            assert.strictEqual(util.valueAt(valuesLy, end, util.lastYear(new Date(2028, 2, 2))), 2);
            assert.strictEqual(util.valueAt(valuesLy, end, util.lastYear(new Date(2028, 2, 1))), 1);
            assert.strictEqual(
                util.valueAt(valuesLy, end, util.lastYear(new Date(2028, 1, 29))),
                28
            );
            assert.strictEqual(
                util.valueAt(valuesLy, end, util.lastYear(new Date(2028, 1, 28))),
                28
            );
            assert.strictEqual(
                util.valueAt(valuesLy, end, util.lastYear(new Date(2028, 1, 25))),
                25
            );
            assert.deepStrictEqual(
                days.map(v => util.valueAt(valuesLy, end, v)),
                [24, 25, 26, 27, 28]
            );
        });
        it("should count the days across daylight saving changes", () => {
            const timezone = process.env.TZ;
            process.env.TZ = "Europe/Lisbon";
            try {
                let end = new Date(2025, 9, 27, 0, 30);
                assert.strictEqual(util.valueAt(values, end, new Date(2025, 9, 25, 23, 30)), 20);
                assert.strictEqual(util.valueAt(values, end, new Date(2025, 9, 24, 0, 30)), 10);

                end = new Date(2025, 2, 31, 0, 30);
                assert.strictEqual(util.valueAt(values, end, new Date(2025, 2, 29, 23, 30)), 20);
                assert.strictEqual(util.valueAt(values, end, new Date(2025, 2, 28, 0, 30)), 10);
            } finally {
                if (timezone === undefined) delete process.env.TZ;
                else process.env.TZ = timezone;
            }
        });
        it("should return the value for the month", () => {
            const end = new Date(2025, 9, 27);
            assert.strictEqual(util.valueAt(values, end, new Date(2025, 9, 1), "month"), 40);
            assert.strictEqual(util.valueAt(values, end, new Date(2025, 8, 30), "month"), 30);
            assert.strictEqual(util.valueAt(values, end, new Date(2025, 6, 1), "month"), 10);
            assert.strictEqual(util.valueAt(values, end, new Date(2025, 5, 1), "month"), null);
            assert.strictEqual(util.valueAt(values, end, new Date(2025, 10, 1), "month"), null);
        });
        it("should return the value for the month across years", () => {
            const end = new Date(2026, 1, 15);
            assert.strictEqual(util.valueAt(values, end, new Date(2026, 0, 1), "month"), 30);
            assert.strictEqual(util.valueAt(values, end, new Date(2025, 11, 1), "month"), 20);
            assert.strictEqual(util.valueAt(values, end, new Date(2025, 10, 1), "month"), 10);
        });
    });

    describe("#dayLabel()", function() {
        it("should format the day", () => {
            assert.strictEqual(util.dayLabel(new Date(2025, 9, 26)), "Sun 26/10/25");
            assert.strictEqual(util.dayLabel(new Date(2025, 9, 27, 23, 59)), "Mon 27/10/25");
        });
        it("should pad the day, month and year", () => {
            assert.strictEqual(util.dayLabel(new Date(2025, 1, 1)), "Sat 01/02/25");
            assert.strictEqual(util.dayLabel(new Date(2005, 0, 9)), "Sun 09/01/05");
        });
        it("should format the day in the language", () => {
            assert.strictEqual(util.dayLabel(new Date(2025, 9, 26), "pt"), "Dom 26/10/25");
            assert.strictEqual(util.dayLabel(new Date(2025, 9, 28), "pt"), "Ter 28/10/25");
            assert.strictEqual(util.dayLabel(new Date(2025, 10, 1), "pt"), "Sáb 01/11/25");
        });
    });

    describe("#monthLabel()", function() {
        it("should format the month", () => {
            assert.strictEqual(util.monthLabel(new Date(2025, 8, 1)), "Sep 2025");
            assert.strictEqual(util.monthLabel(new Date(2025, 0, 31)), "Jan 2025");
            assert.strictEqual(util.monthLabel(new Date(2025, 11, 1)), "Dec 2025");
        });
        it("should format the month in the language", () => {
            assert.strictEqual(util.monthLabel(new Date(2025, 8, 1), "pt"), "Set 2025");
            assert.strictEqual(util.monthLabel(new Date(2025, 2, 1), "pt"), "Mar 2025");
            assert.strictEqual(util.monthLabel(new Date(2025, 11, 1), "pt"), "Dez 2025");
        });
    });

    describe("#delta()", function() {
        it("should compute the percentage change", () => {
            assert.deepStrictEqual(util.delta(2964.1, 2488.3), {
                change: "+19.1%",
                direction: "up"
            });
            assert.deepStrictEqual(util.delta(1842.5, 2310.4), {
                change: "-20.3%",
                direction: "down"
            });
            assert.deepStrictEqual(util.delta(300.0, 100.0), {
                change: "+200.0%",
                direction: "up"
            });
            assert.deepStrictEqual(util.delta(0.0, 100.0), {
                change: "-100.0%",
                direction: "down"
            });
        });
        it("should round the change to one decimal place", () => {
            assert.deepStrictEqual(util.delta(110.0, 100.0), { change: "+10.0%", direction: "up" });
            assert.deepStrictEqual(util.delta(100.06, 100.0), { change: "+0.1%", direction: "up" });
            assert.deepStrictEqual(util.delta(99.94, 100.0), {
                change: "-0.1%",
                direction: "down"
            });
        });
        it("should be neutral when the change rounds to zero", () => {
            assert.deepStrictEqual(util.delta(100.0, 100.0), { change: "0.0%", direction: null });
            assert.deepStrictEqual(util.delta(100.04, 100.0), { change: "0.0%", direction: null });
            assert.deepStrictEqual(util.delta(99.96, 100.0), { change: "0.0%", direction: null });
        });
        it("should not compute the change without previous values", () => {
            assert.deepStrictEqual(util.delta(100.0, null), { change: "n/a", direction: null });
            assert.deepStrictEqual(util.delta(100.0, undefined), {
                change: "n/a",
                direction: null
            });
            assert.deepStrictEqual(util.delta(100.0, 0.0), { change: "n/a", direction: null });
            assert.deepStrictEqual(util.delta(0.0, 0.0), { change: "n/a", direction: null });
        });
        it("should compute the change against negative previous values", () => {
            assert.deepStrictEqual(util.delta(100.0, -50.0), {
                change: "+300.0%",
                direction: "up"
            });
            assert.deepStrictEqual(util.delta(-100.0, -50.0), {
                change: "-100.0%",
                direction: "down"
            });
            assert.deepStrictEqual(util.delta(-25.0, -50.0), {
                change: "+50.0%",
                direction: "up"
            });
        });
        it("should compute the change in percentage points", () => {
            assert.deepStrictEqual(util.delta(18.4, 21.0, true), {
                change: "-2.6 pp",
                direction: "down"
            });
            assert.deepStrictEqual(util.delta(22.7, 19.9, true), {
                change: "+2.8 pp",
                direction: "up"
            });
            assert.deepStrictEqual(util.delta(20.0, 20.0, true), {
                change: "0.0 pp",
                direction: null
            });
        });
        it("should compute the percentage points from zero", () => {
            assert.deepStrictEqual(util.delta(15.0, 0.0, true), {
                change: "+15.0 pp",
                direction: "up"
            });
            assert.deepStrictEqual(util.delta(0.0, 0.0, true), {
                change: "0.0 pp",
                direction: null
            });
            assert.deepStrictEqual(util.delta(15.0, null, true), {
                change: "n/a",
                direction: null
            });
        });
        it("should use the language when there's no change", () => {
            assert.deepStrictEqual(util.delta(100.0, null, false, ",", "pt"), {
                change: "n/d",
                direction: null
            });
            assert.deepStrictEqual(util.delta(100.0, 0.0, false, ".", "en"), {
                change: "n/a",
                direction: null
            });
            assert.deepStrictEqual(util.delta(2964.1, 2488.3, false, ",", "pt"), {
                change: "+19,1%",
                direction: "up"
            });
        });
        it("should use the decimal separator", () => {
            assert.deepStrictEqual(util.delta(2964.1, 2488.3, false, ","), {
                change: "+19,1%",
                direction: "up"
            });
            assert.deepStrictEqual(util.delta(18.4, 21.0, true, ","), {
                change: "-2,6 pp",
                direction: "down"
            });
            assert.deepStrictEqual(util.delta(3000.0, 100.0, false, ","), {
                change: "+2900,0%",
                direction: "up"
            });
            assert.deepStrictEqual(util.delta(100.0, null, false, ","), {
                change: "n/a",
                direction: null
            });
        });
    });

    describe("#comparison()", function() {
        it("should build the comparison", () => {
            assert.deepStrictEqual(util.comparison(2964.1, 2488.3, "Sun 26/10/25", 2), {
                label: "Sun 26/10/25",
                amount: "2,488.30",
                change: "+19.1%",
                direction: "up"
            });
            assert.deepStrictEqual(util.comparison(58420.35, 54980.1, "1-27 Oct 2025", 2), {
                label: "1-27 Oct 2025",
                amount: "54,980.10",
                change: "+6.3%",
                direction: "up"
            });
        });
        it("should format the amount with the places", () => {
            assert.strictEqual(util.comparison(12, 10, "Sep 2025", 0).amount, "10");
            assert.strictEqual(util.comparison(12, 1234, "Sep 2025", 0).amount, "1,234");
            assert.strictEqual(util.comparison(12, 10.25, "Sep 2025", 1).amount, "10.3");
        });
        it("should build the comparison in percentage points", () => {
            assert.deepStrictEqual(util.comparison(18.4, 21.0, "Mon 27/10/25", 1, true), {
                label: "Mon 27/10/25",
                amount: "21.0",
                change: "-2.6 pp",
                direction: "down"
            });
        });
        it("should build the comparison without previous values", () => {
            assert.deepStrictEqual(util.comparison(100.0, null, "Wed 22/10/25", 2), {
                label: "Wed 22/10/25",
                amount: "no data",
                change: "n/a",
                direction: null
            });
            assert.deepStrictEqual(util.comparison(100.0, undefined, "Wed 22/10/25", 2), {
                label: "Wed 22/10/25",
                amount: "no data",
                change: "n/a",
                direction: null
            });
        });
        it("should build the comparison with zero previous values", () => {
            assert.deepStrictEqual(util.comparison(100.0, 0.0, "Wed 22/10/25", 2), {
                label: "Wed 22/10/25",
                amount: "0.00",
                change: "n/a",
                direction: null
            });
        });
        it("should format the amount and change with the separators", () => {
            assert.deepStrictEqual(
                util.comparison(2964.1, 2488.3, "Sun 26/10/25", 2, false, ",", "."),
                {
                    label: "Sun 26/10/25",
                    amount: "2.488,30",
                    change: "+19,1%",
                    direction: "up"
                }
            );
            assert.deepStrictEqual(
                util.comparison(58420.35, 1254980.1, "1-27 Oct 2025", 2, false, ",", "\u00a0"),
                {
                    label: "1-27 Oct 2025",
                    amount: "1\u00a0254\u00a0980,10",
                    change: "-95,3%",
                    direction: "down"
                }
            );
            assert.deepStrictEqual(util.comparison(18.4, 21.0, "Mon 27/10/25", 1, true, ",", "."), {
                label: "Mon 27/10/25",
                amount: "21,0",
                change: "-2,6 pp",
                direction: "down"
            });
            assert.strictEqual(
                util.comparison(12, 1234, "Sep 2025", 0, false, ",", ".").amount,
                "1.234"
            );
            assert.strictEqual(
                util.comparison(100.0, null, "Wed 22/10/25", 2, false, ",", ".").amount,
                "no data"
            );
        });
        it("should build the comparison in the language", () => {
            assert.deepStrictEqual(
                util.comparison(100.0, null, "Qua 22/10/25", 2, false, ",", "\u00a0", "pt"),
                {
                    label: "Qua 22/10/25",
                    amount: "sem dados",
                    change: "n/d",
                    direction: null
                }
            );
            assert.deepStrictEqual(
                util.comparison(2964.1, 2488.3, "Dom 26/10/25", 2, false, ",", "\u00a0", "pt"),
                {
                    label: "Dom 26/10/25",
                    amount: "2\u00a0488,30",
                    change: "+19,1%",
                    direction: "up"
                }
            );
        });
    });

    describe("#dragOffset()", function() {
        it("should follow the drag between pages", () => {
            assert.strictEqual(util.dragOffset(-120, 1, 5), -120);
            assert.strictEqual(util.dragOffset(80, 1, 5), 80);
            assert.strictEqual(util.dragOffset(80, 4, 5), 80);
            assert.strictEqual(util.dragOffset(-80, 0, 5), -80);
            assert.strictEqual(util.dragOffset(0, 0, 5), 0);
        });
        it("should damp the drag past the first and last pages", () => {
            assert.strictEqual(util.dragOffset(100, 0, 5), 35);
            assert.strictEqual(util.dragOffset(-100, 4, 5), -35);
        });
        it("should damp the drag both ways with a single page", () => {
            assert.strictEqual(util.dragOffset(100, 0, 1), 35);
            assert.strictEqual(util.dragOffset(-100, 0, 1), -35);
        });
        it("should damp the drag without pages", () => {
            assert.strictEqual(util.dragOffset(100, 0, 0), 35);
            assert.strictEqual(util.dragOffset(-100, 0, 0), -35);
        });
    });

    describe("#dragPage()", function() {
        it("should move one page after a quarter of the width", () => {
            assert.strictEqual(util.dragPage(1, 5, -85, 340), 2);
            assert.strictEqual(util.dragPage(1, 5, 85, 340), 0);
            assert.strictEqual(util.dragPage(1, 5, -300, 340), 2);
            assert.strictEqual(util.dragPage(1, 5, 700, 340), 0);
        });
        it("should stay on the page for short drags", () => {
            assert.strictEqual(util.dragPage(1, 5, -84, 340), 1);
            assert.strictEqual(util.dragPage(1, 5, 84, 340), 1);
            assert.strictEqual(util.dragPage(1, 5, 0, 340), 1);
            assert.strictEqual(util.dragPage(1, 5, -20, 340, 0.29), 1);
        });
        it("should move one page on a quick flick", () => {
            assert.strictEqual(util.dragPage(1, 5, -20, 340, -0.3), 2);
            assert.strictEqual(util.dragPage(1, 5, 20, 340, 0.3), 0);
            assert.strictEqual(util.dragPage(1, 5, 0, 340, -1.5), 2);
        });
        it("should follow the flick over the dragged distance", () => {
            assert.strictEqual(util.dragPage(1, 5, -200, 340, 0.6), 0);
            assert.strictEqual(util.dragPage(1, 5, 200, 340, -0.6), 2);
        });
        it("should keep the page within the bounds", () => {
            assert.strictEqual(util.dragPage(0, 5, 200, 340), 0);
            assert.strictEqual(util.dragPage(4, 5, -200, 340), 4);
            assert.strictEqual(util.dragPage(0, 5, 0, 340, 1.0), 0);
            assert.strictEqual(util.dragPage(4, 5, 0, 340, -1.0), 4);
            assert.strictEqual(util.dragPage(0, 1, -200, 340), 0);
            assert.strictEqual(util.dragPage(0, 0, -200, 340), 0);
        });
        it("should stay on the page without a width", () => {
            assert.strictEqual(util.dragPage(1, 5, -200, undefined), 1);
            assert.strictEqual(util.dragPage(1, 5, -200, undefined, -0.5), 2);
        });
    });

    describe("#keyPage()", function() {
        it("should map the number keys to the pages", () => {
            assert.strictEqual(util.keyPage("1", 5), 0);
            assert.strictEqual(util.keyPage("3", 5), 2);
            assert.strictEqual(util.keyPage("5", 5), 4);
            assert.strictEqual(util.keyPage("9", 9), 8);
        });
        it("should ignore the number keys beyond the pages", () => {
            assert.strictEqual(util.keyPage("6", 5), null);
            assert.strictEqual(util.keyPage("9", 5), null);
            assert.strictEqual(util.keyPage("1", 0), null);
        });
        it("should ignore the zero and other keys", () => {
            assert.strictEqual(util.keyPage("0", 5), null);
            assert.strictEqual(util.keyPage("a", 5), null);
            assert.strictEqual(util.keyPage("ArrowLeft", 5), null);
            assert.strictEqual(util.keyPage("12", 15), null);
            assert.strictEqual(util.keyPage("", 5), null);
            assert.strictEqual(util.keyPage(undefined, 5), null);
        });
    });

    describe("#formatSeparators()", function() {
        it("should return the separators of the presets", () => {
            assert.deepStrictEqual(util.formatSeparators("point", "de-DE"), [".", ","]);
            assert.deepStrictEqual(util.formatSeparators("comma", "en-US"), [",", "."]);
            assert.deepStrictEqual(util.formatSeparators("space", "en-US"), [",", "\u00a0"]);
        });
        it("should use the separators of the language for the automatic format", () => {
            assert.deepStrictEqual(util.formatSeparators("auto", "en-US"), [".", ","]);
            assert.deepStrictEqual(util.formatSeparators("auto", "en-GB"), [".", ","]);
            assert.deepStrictEqual(util.formatSeparators("auto", "de-DE"), [",", "."]);
            assert.deepStrictEqual(util.formatSeparators("auto", "pt-PT"), [",", "\u00a0"]);
            assert.deepStrictEqual(util.formatSeparators("auto", "fr-FR"), [",", "\u202f"]);
            assert.deepStrictEqual(util.formatSeparators("auto", "es-ES"), [",", "."]);
        });
        it("should use latin separators for languages with other digits", () => {
            assert.deepStrictEqual(util.formatSeparators("auto", "ar-EG"), [".", ","]);
            assert.deepStrictEqual(util.formatSeparators("auto", "hi-IN"), [".", ","]);
        });
        it("should fall back to the point format for invalid languages", () => {
            assert.deepStrictEqual(util.formatSeparators("auto", "not a language"), [".", ","]);
            assert.deepStrictEqual(util.formatSeparators("auto", ""), [".", ","]);
        });
        it("should fall back when the language has no separators", () => {
            const formatToParts = Intl.NumberFormat.prototype.formatToParts;
            Intl.NumberFormat.prototype.formatToParts = () => [
                { type: "integer", value: "1234567" }
            ];
            try {
                assert.deepStrictEqual(util.formatSeparators("auto", "de-DE"), [".", ","]);
            } finally {
                Intl.NumberFormat.prototype.formatToParts = formatToParts;
            }
            assert.deepStrictEqual(util.formatSeparators("auto", "de-DE"), [",", "."]);
        });
        it("should treat unknown formats as automatic", () => {
            assert.deepStrictEqual(util.formatSeparators("unknown", "de-DE"), [",", "."]);
            assert.deepStrictEqual(util.formatSeparators(undefined, "de-DE"), [",", "."]);
            assert.deepStrictEqual(util.formatSeparators("toString", "de-DE"), [",", "."]);
            assert.deepStrictEqual(util.formatSeparators("constructor", "en-US"), [".", ","]);
        });
    });

    describe("#parseSettings()", function() {
        it("should return the defaults when nothing is stored", () => {
            assert.deepStrictEqual(util.parseSettings(undefined), util.defaultSettings);
            assert.deepStrictEqual(util.parseSettings(null), util.defaultSettings);
            assert.deepStrictEqual(util.parseSettings(""), util.defaultSettings);
        });
        it("should keep the default settings valid", () => {
            assert.deepStrictEqual(util.defaultSettings, {
                language: "auto",
                comparison: true,
                format: "auto",
                unit: "day",
                dimension: "net_price_vat",
                span: 7,
                interval: 5
            });
            assert.deepStrictEqual(
                util.parseSettings(JSON.stringify(util.defaultSettings)),
                util.defaultSettings
            );
        });
        it("should return a copy of the defaults", () => {
            const settings = util.parseSettings(undefined);
            assert.notStrictEqual(settings, util.defaultSettings);
            settings.span = 14;
            assert.strictEqual(util.defaultSettings.span, 7);
        });
        it("should parse the stored settings", () => {
            const settings = {
                language: "pt",
                comparison: false,
                format: "space",
                unit: "month",
                dimension: "conversion_rate",
                span: 14,
                interval: 30
            };
            assert.deepStrictEqual(util.parseSettings(JSON.stringify(settings)), settings);
            assert.deepStrictEqual(util.parseSettings(JSON.stringify({ span: 3, interval: 1 })), {
                ...util.defaultSettings,
                span: 3,
                interval: 1
            });
        });
        it("should return the defaults for corrupted values", () => {
            assert.deepStrictEqual(util.parseSettings("{"), util.defaultSettings);
            assert.deepStrictEqual(util.parseSettings("undefined"), util.defaultSettings);
            assert.deepStrictEqual(util.parseSettings("null"), util.defaultSettings);
            assert.deepStrictEqual(util.parseSettings("12"), util.defaultSettings);
            assert.deepStrictEqual(util.parseSettings('"month"'), util.defaultSettings);
            assert.deepStrictEqual(util.parseSettings("true"), util.defaultSettings);
            assert.deepStrictEqual(util.parseSettings('["month"]'), util.defaultSettings);
        });
        it("should replace invalid settings with their defaults", () => {
            const settings = util.parseSettings(
                JSON.stringify({
                    comparison: "false",
                    format: "toString",
                    unit: "week",
                    dimension: "net_price",
                    span: 7.5,
                    interval: "5"
                })
            );
            assert.deepStrictEqual(settings, util.defaultSettings);
            assert.deepStrictEqual(
                util.parseSettings(JSON.stringify({ comparison: 0, span: "7", interval: 60 })),
                util.defaultSettings
            );
        });
        it("should parse the language", () => {
            assert.strictEqual(
                util.parseSettings(JSON.stringify({ language: "pt" })).language,
                "pt"
            );
            assert.strictEqual(
                util.parseSettings(JSON.stringify({ language: "en" })).language,
                "en"
            );
            assert.strictEqual(
                util.parseSettings(JSON.stringify({ language: "fr" })).language,
                "auto"
            );
            assert.strictEqual(
                util.parseSettings(JSON.stringify({ language: "PT" })).language,
                "auto"
            );
            assert.strictEqual(
                util.parseSettings(JSON.stringify({ language: 1 })).language,
                "auto"
            );
        });
        it("should keep the history rows within their range", () => {
            assert.strictEqual(util.parseSettings(JSON.stringify({ span: 2 })).span, 7);
            assert.strictEqual(util.parseSettings(JSON.stringify({ span: 3 })).span, 3);
            assert.strictEqual(util.parseSettings(JSON.stringify({ span: 14 })).span, 14);
            assert.strictEqual(util.parseSettings(JSON.stringify({ span: 15 })).span, 7);
            assert.strictEqual(util.parseSettings(JSON.stringify({ span: -7 })).span, 7);
            assert.strictEqual(util.parseSettings(JSON.stringify({ span: null })).span, 7);
        });
        it("should ignore unknown settings", () => {
            assert.deepStrictEqual(
                util.parseSettings(JSON.stringify({ unit: "month", theme: "dark" })),
                { ...util.defaultSettings, unit: "month" }
            );
        });
    });

    describe("#imageName()", function() {
        it("should name the image after the store and the day", () => {
            assert.strictEqual(
                util.imageName("global", new Date(2026, 9, 28, 23, 59)),
                "omni-global-2026-10-28.png"
            );
            assert.strictEqual(
                util.imageName("3-Downtown", new Date(2026, 0, 5)),
                "omni-3-downtown-2026-01-05.png"
            );
        });
        it("should turn the store name into a plain slug", () => {
            const date = new Date(2026, 9, 28);
            assert.strictEqual(util.imageName("São João", date), "omni-sao-joao-2026-10-28.png");
            assert.strictEqual(
                util.imageName("  Baixa / Chiado!  ", date),
                "omni-baixa-chiado-2026-10-28.png"
            );
            assert.strictEqual(
                util.imageName("Loja_Nº 12", date),
                "omni-loja-no-12-2026-10-28.png"
            );
            assert.strictEqual(util.imageName("1ª Loja", date), "omni-1a-loja-2026-10-28.png");
            assert.strictEqual(util.imageName("Ｂａｉｘａ", date), "omni-baixa-2026-10-28.png");
        });
        it("should use a generic name for stores without one", () => {
            const date = new Date(2026, 9, 28);
            assert.strictEqual(util.imageName("", date), "omni-store-2026-10-28.png");
            assert.strictEqual(util.imageName(undefined, date), "omni-store-2026-10-28.png");
            assert.strictEqual(util.imageName(null, date), "omni-store-2026-10-28.png");
            assert.strictEqual(util.imageName("---", date), "omni-store-2026-10-28.png");
        });
    });

    describe("#canCopyImage()", function() {
        const navigator = { clipboard: { write: () => Promise.resolve() } };

        it("should copy when the clipboard takes images", () => {
            const ClipboardItem = function() {};
            assert.strictEqual(util.canCopyImage(navigator, ClipboardItem), true);
            ClipboardItem.supports = type => type === "image/png";
            assert.strictEqual(util.canCopyImage(navigator, ClipboardItem), true);
        });
        it("should not copy when the clipboard doesn't take images", () => {
            const ClipboardItem = function() {};
            ClipboardItem.supports = type => type === "text/plain";
            assert.strictEqual(util.canCopyImage(navigator, ClipboardItem), false);
        });
        it("should not copy without the clipboard", () => {
            const ClipboardItem = function() {};
            assert.strictEqual(util.canCopyImage(navigator, undefined), false);
            assert.strictEqual(util.canCopyImage({}, ClipboardItem), false);
            assert.strictEqual(util.canCopyImage({ clipboard: {} }, ClipboardItem), false);
            assert.strictEqual(util.canCopyImage(undefined, ClipboardItem), false);
        });
    });

    describe("#canShareFile()", function() {
        const file = { name: "omni-global-2026-10-28.png", type: "image/png" };

        it("should share when the browser can share the file", () => {
            let shared = null;
            const navigator = {
                share: () => Promise.resolve(),
                canShare: data => {
                    shared = data;
                    return true;
                }
            };
            assert.strictEqual(util.canShareFile(navigator, file), true);
            assert.deepStrictEqual(shared, { files: [file] });
        });
        it("should not share when the browser can't share the file", () => {
            const navigator = { share: () => Promise.resolve(), canShare: () => false };
            assert.strictEqual(util.canShareFile(navigator, file), false);
        });
        it("should not share when checking the file fails", () => {
            const navigator = {
                share: () => Promise.resolve(),
                canShare: () => {
                    throw new TypeError("Invalid data");
                }
            };
            assert.strictEqual(util.canShareFile(navigator, file), false);
        });
        it("should not share without the share sheet", () => {
            assert.strictEqual(util.canShareFile({ canShare: () => true }, file), false);
            assert.strictEqual(util.canShareFile({ share: () => Promise.resolve() }, file), false);
            assert.strictEqual(util.canShareFile({}, file), false);
            assert.strictEqual(util.canShareFile(undefined, file), false);
        });
    });

    describe("#wrapFocus()", function() {
        const elements = ["switch", "format", "measure", "reset"];

        it("should wrap to the first element after the last one", () => {
            assert.strictEqual(util.wrapFocus(elements, "reset"), "switch");
            assert.strictEqual(util.wrapFocus(elements, "reset", false), "switch");
        });
        it("should wrap to the last element before the first one", () => {
            assert.strictEqual(util.wrapFocus(elements, "switch", true), "reset");
        });
        it("should let the focus move between the elements", () => {
            assert.strictEqual(util.wrapFocus(elements, "switch"), null);
            assert.strictEqual(util.wrapFocus(elements, "format"), null);
            assert.strictEqual(util.wrapFocus(elements, "measure", true), null);
            assert.strictEqual(util.wrapFocus(elements, "reset", true), null);
        });
        it("should bring back the focus from outside the elements", () => {
            assert.strictEqual(util.wrapFocus(elements, "sheet"), "switch");
            assert.strictEqual(util.wrapFocus(elements, "sheet", true), "reset");
            assert.strictEqual(util.wrapFocus(elements, null), "switch");
        });
        it("should keep a single element focused", () => {
            assert.strictEqual(util.wrapFocus(["done"], "done"), "done");
            assert.strictEqual(util.wrapFocus(["done"], "done", true), "done");
        });
        it("should do nothing without elements", () => {
            assert.strictEqual(util.wrapFocus([], "sheet"), null);
            assert.strictEqual(util.wrapFocus([], null, true), null);
        });
    });
});
