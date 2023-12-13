const sortBasedOnStartTime = (event1, event2) => {
    const startTime1 = event1.ui_meta_data.time_slot[0],
        startTime2 = event2.ui_meta_data.time_slot[0];
    return startTime1 === startTime2 ? 0 : startTime1 > startTime2 ? 1 : -1;
}

const sortBasedOnEndTime = (event1, event2) => {
    const endTime1 = event1.ui_meta_data.time_slot[0],
        endTime2 = event2.ui_meta_data.time_slot[0];
    return endTime1 === endTime2 ? 0 : endTime1 > endTime2 ? 1 : -1;
}

const sortBasedOnEventName = (event1, event2) => {
    const eventName1 = event1.event_name,
        eventName2 = event2.event_name;

    return eventName1 === eventName2 ? 0 : eventName1 > eventName2 ? 1 : -1;
}

const sortBasedOnResponse = (event1, event2) => {
    const index1 = event1.ui_meta_data.index_in_response,
        index2 = event2.ui_meta_data.index_in_response;

    return index1 === index2 ? 0 : index1 > index2 ? 1 : -1;
}

const sortByMap = {
    'Start Time': sortBasedOnStartTime,
    'End Time': sortBasedOnEndTime,
    'Event Name': sortBasedOnEventName,
};

export const sortFunctionNames = Object.keys(sortByMap);

export const getComparatorFunction = (sortByFunctionName, reverse) => {
    const comparatorFunction = sortByMap[sortByFunctionName] ?? sortBasedOnResponse;

    if (!reverse) {
        return comparatorFunction;
    }

    const reverseComparator = (a, b) => {
        const actualResult = comparatorFunction(a, b);
        return actualResult === 0 ? 0 : actualResult === 1 ? -1 : 1;
    }

    return reverseComparator;
}