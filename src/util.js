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

export const locales = {
    en: {
        name: "English",
        locale: "en",
        daysOfWeek: daysOfWeek,
        months: months,
        texts: {
            login: "Login",
            username: "Username",
            password: "Password",
            instance: "Instance",
            yourUrl: "your-url",
            signIn: "Sign in",
            forgotPassword: "Forgot your password?",
            unknownError: "Unknown error",
            logoutConfirm: "Are you sure you want to logout?",
            errorTitle: "Oops there was an error",
            errorTurbulence:
                "Unfortunately the site is experiencing a bit of turbulence right now.",
            errorSoon: "But soon we'll be up and the sun will shine again.",
            refresh: "Refresh",
            errorLoading: "Error loading remote data",
            errorLoadingDetail: "Error loading remote data: {message}",
            updated: "Updated",
            today: "Today's {label}",
            month: "Month's {label}",
            fullDay: "{label}, full day",
            noData: "no data",
            notAvailable: "n/a",
            sales: "Sales",
            average: "Avg.",
            entries: "Entries",
            conversion: "Conv.",
            unitSales: "SAL",
            unitEntries: "ENT",
            savedInBrowser: "Saved in this browser",
            settings: "Settings",
            done: "Done",
            language: "Language",
            automatic: "Automatic",
            comparison: "Year-on-year comparison",
            comparisonDescription: "The vs line under every row",
            numberFormat: "Number format",
            automaticFollows: "Automatic follows {locale}",
            opensWith: "Opens with",
            period: "Period",
            periodDay: "Day",
            periodMonth: "Month",
            measure: "Measure",
            measureSales: "Sales (EUR)",
            measureNumberSales: "Number of sales",
            measureAverageSale: "Average sale",
            measureEntries: "Entries",
            measureConversion: "Conversion",
            historyRows: "History rows",
            fewerRows: "Fewer rows",
            moreRows: "More rows",
            refreshEvery: "Refresh every",
            refreshInterval: "Refresh interval",
            minutes: "{count} min",
            resetDefaults: "Reset to defaults"
        }
    },
    pt: {
        name: "Português",
        locale: "pt-PT",
        daysOfWeek: [
            "Domingo",
            "Segunda-feira",
            "Terça-feira",
            "Quarta-feira",
            "Quinta-feira",
            "Sexta-feira",
            "Sábado"
        ],
        months: [
            "Janeiro",
            "Fevereiro",
            "Março",
            "Abril",
            "Maio",
            "Junho",
            "Julho",
            "Agosto",
            "Setembro",
            "Outubro",
            "Novembro",
            "Dezembro"
        ],
        texts: {
            login: "Iniciar sessão",
            username: "Utilizador",
            password: "Palavra-passe",
            instance: "Instância",
            yourUrl: "o-seu-url",
            signIn: "Entrar",
            forgotPassword: "Esqueceu-se da palavra-passe?",
            unknownError: "Erro desconhecido",
            logoutConfirm: "Tem a certeza de que quer terminar a sessão?",
            errorTitle: "Ups, ocorreu um erro",
            errorTurbulence:
                "Infelizmente, o site está a passar por alguma turbulência neste momento.",
            errorSoon: "Mas em breve voltaremos e o sol voltará a brilhar.",
            refresh: "Atualizar",
            errorLoading: "Erro ao carregar os dados remotos",
            errorLoadingDetail: "Erro ao carregar os dados remotos: {message}",
            updated: "Atualizado",
            today: "{label} de hoje",
            month: "{label} do mês",
            fullDay: "{label}, dia completo",
            noData: "sem dados",
            notAvailable: "n/d",
            sales: "Vendas",
            average: "Média",
            entries: "Entradas",
            conversion: "Conv.",
            unitSales: "VEN",
            unitEntries: "ENT",
            savedInBrowser: "Guardado neste navegador",
            settings: "Definições",
            done: "Concluído",
            language: "Idioma",
            automatic: "Automático",
            comparison: "Comparação homóloga",
            comparisonDescription: "A linha vs por baixo de cada linha",
            numberFormat: "Formato dos números",
            automaticFollows: "Automático segue {locale}",
            opensWith: "Abre com",
            period: "Período",
            periodDay: "Dia",
            periodMonth: "Mês",
            measure: "Medida",
            measureSales: "Vendas (EUR)",
            measureNumberSales: "Número de vendas",
            measureAverageSale: "Venda média",
            measureEntries: "Entradas",
            measureConversion: "Conversão",
            historyRows: "Linhas do histórico",
            fewerRows: "Menos linhas",
            moreRows: "Mais linhas",
            refreshEvery: "Atualizar a cada",
            refreshInterval: "Intervalo de atualização",
            minutes: "{count} min",
            resetDefaults: "Repor predefinições"
        }
    }
};

export const dimensions = [
    "net_price_vat",
    "net_number_sales",
    "net_average_sale",
    "number_entries",
    "conversion_rate"
];

export const numberFormats = {
    auto: null,
    point: [".", ","],
    comma: [",", "."],
    space: [",", "\u00a0"]
};

export const languages = ["auto"].concat(Object.keys(locales));

export const intervals = [1, 5, 15, 30];

export const spanRange = [3, 14];

export const defaultSettings = {
    language: "auto",
    comparison: true,
    format: "auto",
    unit: "day",
    dimension: "net_price_vat",
    span: 7,
    interval: 5
};

export const translate = (key, language = "en", values = {}) => {
    const texts = localeOf(language).texts;
    let text = key;
    if (Object.keys(texts).includes(key)) text = texts[key];
    else if (Object.keys(locales.en.texts).includes(key)) text = locales.en.texts[key];

    // fills the placeholders (eg: {label}) with the given values, leaving
    // the ones without a value as they are so that they're easy to spot
    return text.replace(/\{(\w+)\}/g, (match, name) =>
        Object.keys(values).includes(name) ? String(values[name]) : match
    );
};

export const resolveLanguage = (language, locale) => {
    if (Object.keys(locales).includes(language)) return language;

    // the automatic language is the one of the browser when there's a
    // translation for it (eg: pt-BR uses pt), otherwise English
    const code = String(locale || "")
        .split(/[-_]/)[0]
        .toLowerCase();
    return Object.keys(locales).includes(code) ? code : "en";
};

export const languageLocale = (language, locale) =>
    Object.keys(locales).includes(language) ? locales[language].locale : locale;

export const dayName = (date, language = "en") => localeOf(language).daysOfWeek[date.getDay()];

export const monthName = (date, language = "en") => localeOf(language).months[date.getMonth()];

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

export const previousDate = (date, unit = "day") => {
    // steps by calendar day (not 24 hours) so that the days around the
    // daylight saving changes are neither repeated nor skipped
    if (unit === "day") return new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
    return new Date(date.getFullYear(), date.getMonth() - 1, 1);
};

export const measureValues = (store, dimension, language = "en") => {
    switch (dimension) {
        case "net_price_vat":
            return {
                values: store.net_price_vat,
                currency: "EUR",
                label: translate("sales", language),
                places: 2
            };

        case "net_number_sales":
            return {
                values: store.net_number_sales,
                currency: translate("unitSales", language),
                label: translate("sales", language),
                places: 0
            };

        case "net_average_sale":
            return {
                values: store.net_price_vat.map((v, i) => v / (store.net_number_sales[i] || 1.0)),
                currency: "EUR",
                label: translate("average", language),
                places: 2
            };

        case "number_entries":
            return {
                values: store.number_entries,
                currency: translate("unitEntries", language),
                label: translate("entries", language),
                places: 0
            };

        case "conversion_rate":
            return {
                values: store.net_number_sales.map((v, i) =>
                    store.number_entries[i] ? (v / store.number_entries[i]) * 100.0 : 0.0
                ),
                currency: "%",
                label: translate("conversion", language),
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

export const dayLabel = (date, language = "en") =>
    `${dayName(date, language).slice(0, 3)} ${String(date.getDate()).padStart(2, "0")}/${String(
        date.getMonth() + 1
    ).padStart(2, "0")}/${String(date.getFullYear()).slice(2, 4).padStart(2, "0")}`;

export const monthLabel = (date, language = "en") =>
    `${monthName(date, language).slice(0, 3)} ${date.getFullYear()}`;

export const delta = (current, previous, points = false, decimal = ".", language = "en") => {
    if (previous === null || previous === undefined || (!points && previous === 0)) {
        return { change: translate("notAvailable", language), direction: null };
    }
    const value = points ? current - previous : ((current - previous) / Math.abs(previous)) * 100.0;
    const rounded = Math.round(Math.abs(value) * 10) / 10;
    const direction = rounded === 0 ? null : value > 0 ? "up" : "down";
    const sign = direction === "up" ? "+" : direction === "down" ? "-" : "";
    return {
        change: `${sign}${rounded.toFixed(1).replace(".", decimal)}${points ? " pp" : "%"}`,
        direction: direction
    };
};

export const comparison = (
    current,
    previous,
    label,
    places,
    points = false,
    decimal = ".",
    thousands = ",",
    language = "en"
) => {
    const { change, direction } = delta(current, previous, points, decimal, language);
    return {
        label: label,
        amount:
            previous === null || previous === undefined
                ? translate("noData", language)
                : previous.formatMoney(places, decimal, thousands),
        change: change,
        direction: direction
    };
};

export const dragOffset = (offset, page, count) => {
    // dragging past the first or the last page is damped so that
    // the panel resists and springs back on release
    if ((page <= 0 && offset > 0) || (page >= count - 1 && offset < 0)) return offset * 0.35;
    return offset;
};

export const dragPage = (page, count, offset, width, velocity = 0.0) => {
    let target = page;
    if (Math.abs(velocity) >= 0.3) target = velocity < 0 ? page + 1 : page - 1;
    else if (Math.abs(offset) >= width * 0.25) target = offset < 0 ? page + 1 : page - 1;
    return Math.max(Math.min(target, count - 1), 0);
};

export const keyPage = (key, count) => {
    if (!/^[1-9]$/.test(key)) return null;
    const page = parseInt(key) - 1;
    return page < count ? page : null;
};

export const formatSeparators = (format, locale) => {
    if (Object.keys(numberFormats).includes(format) && numberFormats[format]) {
        return numberFormats[format];
    }

    // the automatic format uses the separators of the browser's language,
    // with latin digits as the amounts are always printed with them
    let parts;
    try {
        parts = new Intl.NumberFormat(locale, { numberingSystem: "latn" }).formatToParts(1234567.8);
    } catch (err) {
        return numberFormats.point;
    }
    const decimal = parts.find(part => part.type === "decimal");
    const group = parts.find(part => part.type === "group");
    return [decimal ? decimal.value : ".", group ? group.value : ","];
};

export const parseSettings = value => {
    const settings = { ...defaultSettings };

    // the stored value may be missing or corrupted, in which case the
    // defaults are used, as they are for any invalid individual setting
    let stored;
    try {
        stored = JSON.parse(value);
    } catch (err) {
        return settings;
    }
    if (!stored || typeof stored !== "object" || Array.isArray(stored)) return settings;

    if (languages.includes(stored.language)) settings.language = stored.language;
    if (typeof stored.comparison === "boolean") settings.comparison = stored.comparison;
    if (Object.keys(numberFormats).includes(stored.format)) settings.format = stored.format;
    if (["day", "month"].includes(stored.unit)) settings.unit = stored.unit;
    if (dimensions.includes(stored.dimension)) settings.dimension = stored.dimension;
    if (
        Number.isInteger(stored.span) &&
        stored.span >= spanRange[0] &&
        stored.span <= spanRange[1]
    ) {
        settings.span = stored.span;
    }
    if (intervals.includes(stored.interval)) settings.interval = stored.interval;
    return settings;
};

const localeOf = language =>
    Object.keys(locales).includes(language) ? locales[language] : locales.en;

export default daysOfWeek;
