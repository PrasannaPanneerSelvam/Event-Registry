import { useEffect, useMemo, useReducer } from "react";
import { doesHaveConflict, sortArrayCurried } from "./Utils/Array";

import styles from './eventsPad.module.css';
import { getEventRegistryContext } from "./context/EventRegistryContext";

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatTime(date_string) {

    const dateObj = new Date(date_string);

    const dateStr = (dateObj.getDate() + "").padStart(2, 0);
    const monthName = months[dateObj.getMonth()];
    const year = (dateObj.getFullYear() + "").slice(2);


    const time = date_string.split(" ")[1];
    return `${dateStr} ${monthName} ${year} ${time}`

}

function selectionStateHandler(state, { eventName, eventObject, sortFunction, allEvents }) {
    if (eventName === 'select') {
        return {
            ...state,
            selectedEvents: state.sortFunction([...state.selectedEvents, eventObject]),
            unselectedEvents: state.unselectedEvents.filter(elem => elem !== eventObject),
        }
    }

    if (eventName === 'deselect') {
        return {
            ...state,
            selectedEvents: state.selectedEvents.filter(elem => elem !== eventObject),
            unselectedEvents: state.sortFunction([...state.unselectedEvents, eventObject]),
        }
    }

    if (eventName === 'update_sort_function') {
        const newSortFunction = sortArrayCurried(sortFunction)
        return {
            ...state,
            sortFunction: newSortFunction,
            selectedEvents: newSortFunction(state.selectedEvents),
            unselectedEvents: newSortFunction(state.unselectedEvents),
        }
    }

    if (eventName === 'update_events') {
        return {
            ...state,
            selectedEvents: [],
            unselectedEvents: state.sortFunction(allEvents),
        }
    }

    throw new Error("Unknown event name : " + eventName);
}

function EventsPad() {

    const { apiResponses } = getEventRegistryContext();

    const [selectionState, dispatchSelectionState] = useReducer(selectionStateHandler, {}, () => {
        return {
            unselectedEvents: [],
            selectedEvents: [],
            sortFunction: (anyArray) => anyArray
        }
    });

    useEffect(() => {
        dispatchSelectionState({ eventName: 'update_events', allEvents: apiResponses.events })
    }, [apiResponses])


    const unselectedEventsWithConflicts = useMemo(() => {
        const selectedSlots = selectionState.selectedEvents.map((selectedEvent) => {
            return [selectedEvent.ui_meta_data.start_time, selectedEvent.ui_meta_data.end_time]
        })

        return selectionState.unselectedEvents.filter((unselectedEvent) => {
            const currSlot = [unselectedEvent.ui_meta_data.start_time, unselectedEvent.ui_meta_data.end_time]
            return doesHaveConflict(selectedSlots, currSlot);
        })

    }, [selectionState.selectedEvents, selectionState.unselectedEvents])

    return (
        <>
            <ul>
                <div onClick={
                    () => dispatchSelectionState({
                        eventName: 'update_sort_function', sortFunction: (a, b) => {
                            const time1 = a.ui_meta_data.start_time,
                                time2 = b.ui_meta_data.start_time;
                            return time1 === time2 ? 0 : time1 > time2 ? 1 : -1;
                        }
                    })
                }
                >Start time</div>
                <div onClick={
                    () => dispatchSelectionState({
                        eventName: 'update_sort_function', sortFunction: (a, b) => {
                            const time1 = a.ui_meta_data.end_time,
                                time2 = b.ui_meta_data.end_time;

                            return time1 === time2 ? 0 : time1 > time2 ? 1 : -1;
                        }
                    })
                }
                >End time</div>

                <div onClick={
                    () => dispatchSelectionState({
                        eventName: 'update_sort_function', sortFunction: (a, b) => {
                            const name1 = a.event_name,
                                name2 = b.event_name;

                            return name1 === name2 ? 0 : name1 > name2 ? 1 : -1;
                        }
                    })
                }
                >Alphabetical</div>
            </ul >

            <div className={styles.table}>
                <div className={styles.col}> {
                    selectionState.unselectedEvents.map(eachEvent => {
                        const hasNoConflict = unselectedEventsWithConflicts.find(elem => elem === eachEvent) == null;
                        const allowAddition = hasNoConflict && selectionState.selectedEvents.length < 3;

                        const classNames = [styles.item];
                        if (!allowAddition) {
                            classNames.push(styles.grayOut);
                        }

                        return (
                            <div className={classNames.join(" ")} key={eachEvent.id + eachEvent.event_name} onClick={
                                allowAddition
                                    ? () => dispatchSelectionState({ eventName: 'select', eventObject: eachEvent })
                                    : () => { }
                            }>{eachEvent.event_name} : {formatTime(eachEvent.start_time)} - {formatTime(eachEvent.end_time)}</div>
                        )
                    })
                }</div>
                <div className={styles.col}>{
                    selectionState.selectedEvents.map(eachEvent => {
                        return <div className={styles.item} key={eachEvent.id} onClick={
                            () => dispatchSelectionState({ eventName: 'deselect', eventObject: eachEvent })
                        }>{eachEvent.event_name} : {formatTime(eachEvent.start_time)} - {formatTime(eachEvent.end_time)}</div>
                    })
                }</div>
            </div>
        </>
    )
}

export default EventsPad