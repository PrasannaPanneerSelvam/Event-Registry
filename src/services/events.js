
import ApiMockData from "../ApiMockData";
import { convertDateAndTimeToEpoch } from "../Utils/TimeHelper";

function increaseOneMinuteInEpoch (inputTime) {
    const oneMinuteInMs = 1 * 60 * 1000;
    return inputTime + oneMinuteInMs;
}

function addMetaDataForUI (eventsArray) {

    return eventsArray.map((eachEvent, idx) => {

        const uiData = {
            start_time: increaseOneMinuteInEpoch(convertDateAndTimeToEpoch(eachEvent.start_time)),
            end_time: convertDateAndTimeToEpoch(eachEvent.end_time),
            index_in_response: idx,
        }

        return {...eachEvent, ui_meta_data: uiData}
    })

}


export default async function fetchEvents () {
    const data = ApiMockData;

    return addMetaDataForUI(data);
}