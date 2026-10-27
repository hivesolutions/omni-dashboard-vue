const assert = require("assert");
require("hive-js-util");
const util = require("../src/util");

describe("Util", function() {
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
    });

    describe("#monthLabel()", function() {
        it("should format the month", () => {
            assert.strictEqual(util.monthLabel(new Date(2025, 8, 1)), "Sep 2025");
            assert.strictEqual(util.monthLabel(new Date(2025, 0, 31)), "Jan 2025");
            assert.strictEqual(util.monthLabel(new Date(2025, 11, 1)), "Dec 2025");
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
    });
});
