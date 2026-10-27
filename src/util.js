export const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];

export const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

export const fetchParams = async (urlString, params, raiseE = true) => {
    const url = new URL(urlString);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    const response = await fetch(url);
    if (raiseE && !response.ok) {
        const error = Error("Problem with request");
        error.response = response;
        throw error;
    }
    return response;
};

export const lastYear = date => {
    const target = new Date(date.getTime());
    target.setFullYear(date.getFullYear() - 1);

    // the 29th of February has no match in the previous year and
    // rolls over to the 1st of March, so it's moved back to the 28th
    if (target.getMonth() !== date.getMonth()) target.setDate(0);

    return target;
};

export const measureValues = (store, dimension) => {
    switch (dimension) {
        case "net_price_vat":
            return {
                values: store.net_price_vat,
                currency: "EUR",
                label: "Sales",
                places: 2
            };

        case "net_number_sales":
            return {
                values: store.net_number_sales,
                currency: "SAL",
                label: "Sales",
                places: 0
            };

        case "net_average_sale":
            return {
                values: store.net_price_vat.map((v, i) => v / (store.net_number_sales[i] || 1.0)),
                currency: "EUR",
                label: "Avg.",
                places: 2
            };

        case "number_entries":
            return {
                values: store.number_entries,
                currency: "ENT",
                label: "Entries",
                places: 0
            };

        case "conversion_rate":
            return {
                values: store.net_number_sales.map((v, i) =>
                    store.number_entries[i] ? (v / store.number_entries[i]) * 100.0 : 0.0
                ),
                currency: "%",
                label: "Conv.",
                places: 1
            };
    }
};

export const totalStore = store => ({
    net_price_vat: [store.net_price_vat.reduce((a, b) => a + b, 0.0)],
    net_number_sales: [store.net_number_sales.reduce((a, b) => a + b, 0.0)],
    number_entries: [store.number_entries.reduce((a, b) => a + b, 0.0)]
});

export const valueAt = (values, end, date, unit = "day") => {
    if (!values) return null;
    let offset;
    if (unit === "day") {
        const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());
        const dateDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        offset = Math.round((endDay - dateDay) / 86400000);
    } else {
        offset = (end.getFullYear() - date.getFullYear()) * 12 + end.getMonth() - date.getMonth();
    }
    const value = values[values.length - 1 - offset];
    return value === undefined ? null : value;
};

export const dayLabel = date =>
    `${daysOfWeek[date.getDay()].slice(0, 3)} ${String(date.getDate()).padStart(2, "0")}/${String(
        date.getMonth() + 1
    ).padStart(2, "0")}/${String(date.getFullYear()).slice(2, 4).padStart(2, "0")}`;

export const monthLabel = date => `${months[date.getMonth()].slice(0, 3)} ${date.getFullYear()}`;

export const delta = (current, previous, points = false) => {
    if (previous === null || previous === undefined || (!points && previous === 0)) {
        return { change: "n/a", direction: null };
    }
    const value = points ? current - previous : ((current - previous) / Math.abs(previous)) * 100.0;
    const rounded = Math.round(Math.abs(value) * 10) / 10;
    const direction = rounded === 0 ? null : value > 0 ? "up" : "down";
    const sign = direction === "up" ? "+" : direction === "down" ? "-" : "";
    return {
        change: `${sign}${rounded.toFixed(1)}${points ? " pp" : "%"}`,
        direction: direction
    };
};

export const comparison = (current, previous, label, places, points = false) => {
    const { change, direction } = delta(current, previous, points);
    return {
        label: label,
        amount:
            previous === null || previous === undefined
                ? "no data"
                : previous.formatMoney(places, ".", ","),
        change: change,
        direction: direction
    };
};

export default daysOfWeek;
