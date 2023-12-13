export const convertDateAndTimeToEpoch = function (dateAndTimeString) {
    try {
        const dateObj = new Date(dateAndTimeString);
        return dateObj.getTime();
    } catch (e) {
        return null;
    }
}