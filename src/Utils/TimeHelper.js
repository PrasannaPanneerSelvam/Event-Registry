export const convertDateAndTimeToEpoch = function (dateAndTimeString) {
    try {
        const dateObj = new Date(dateAndTimeString);
        return dateObj.getTime();
    } catch (e) {
        return null;
    }
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const dateSuffixMap = {
    '1': 'st',
    '2': 'nd',
    '3': 'rd'
};

function formatAMPM(date) {
    const minutes = (date.getMinutes() + "").padStart(2, 0);

    let hours = date.getHours();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours %= 12;
    hours = hours !== 0 ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
}

export function formatTime(date_string) {

    const dateObj = new Date(date_string);

    const dateStr = (dateObj.getDate() + "").padStart(2, 0),
        monthName = months[dateObj.getMonth()],
        dateSuffix = dateSuffixMap[dateStr[1]] ?? 'th';

    return `${dateStr}${dateSuffix} ${monthName} ~ ${formatAMPM(dateObj)}`

}