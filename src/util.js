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

export default daysOfWeek;
