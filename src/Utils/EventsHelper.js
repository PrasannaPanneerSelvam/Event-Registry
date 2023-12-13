import { convertDateAndTimeToEpoch } from "./TimeHelper";

function increaseOneMinuteInEpoch(inputTime) {
    const oneMinuteInMs = 1 * 60 * 1000;
    return inputTime + oneMinuteInMs;
}

export function addMetaDataForUI(eventsArray) {
    return eventsArray.map((eachEvent, idx) => {
        const startTimeInEpoch = increaseOneMinuteInEpoch(convertDateAndTimeToEpoch(eachEvent.start_time)),
            endTimeInEpoch = convertDateAndTimeToEpoch(eachEvent.end_time);

        return {
            ...eachEvent,
            ui_meta_data: {
                time_slot: [startTimeInEpoch, endTimeInEpoch],
                index_in_response: idx,
            }
        }
    });
}