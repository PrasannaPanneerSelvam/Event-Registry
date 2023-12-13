import { useEffect, useState, useReducer, useMemo } from "react";

import { useEventRegistryContext } from "../../context/EventRegistryContext";

import EventBoard from "../../components/EventBoard/EventBoard";
import SortOptions from "../../components/ui/SortOptions/SortOptions";
import PrimaryButton from "../../components/ui/PrimaryButton/PrimaryButton";

import { getComparatorFunction, sortFunctionNames } from "../../Utils/EventsSort";
import { useRegisterEvents } from "../../services/register";
import { validateRegisteredEvents, filterOutRegisteredEventsFromAllEvents } from "../../validation/validateRegisteredEvents"
import { sortArrayCurried } from "../../Utils/Array";

import styles from "./eventsRegistry.module.css"

function selectionStateHandler(state, { actionName, eventObject, eventsToBeSet, sortBy }) {
    if (actionName === 'select') {
        return {
            ...state,
            selectedEvents: state.sortFunction([...state.selectedEvents, eventObject]),
            unselectedEvents: state.unselectedEvents.filter(elem => elem.id !== eventObject.id),
        }
    }

    if (actionName === 'deselect') {
        return {
            ...state,
            selectedEvents: state.selectedEvents.filter(elem => elem.id !== eventObject.id),
            unselectedEvents: state.sortFunction([...state.unselectedEvents, eventObject]),
        }
    }

    if (actionName === 'update_events') {
        return {
            ...state,
            unselectedEvents: state.sortFunction(eventsToBeSet.unselected),
            selectedEvents: state.sortFunction(eventsToBeSet.selected),
        }
    }

    if (actionName === 'update_sort_function') {
        const newSortFunction = sortArrayCurried(sortBy);
        return {
            ...state,
            sortFunction: newSortFunction,
            selectedEvents: newSortFunction(state.selectedEvents),
            unselectedEvents: newSortFunction(state.unselectedEvents),
        }
    }

    throw new Error("Unknown event name : " + actionName);
}

function EventsRegistryContent ({selectionState, updateSortByFunction, selectAnEvent, deselectAnEvent}) {
    const { maxNoOfEventsAllowed } = useEventRegistryContext();
    const { registerEvent, isPending: isRegistrationPending, error: registrationError } = useRegisterEvents();

    const selectionCallback = (sortByFunctionName, reverse) => {
        updateSortByFunction(() => getComparatorFunction(sortByFunctionName, reverse));
    }

    return (
        <div className={styles.content}>
            <SortOptions labels={sortFunctionNames} selectionCallback={selectionCallback} />
            <EventBoard
                maxNoOfEventsAllowed={maxNoOfEventsAllowed}
                selectionState={selectionState}
                selectAnEvent={selectAnEvent}
                deselectAnEvent={deselectAnEvent}
            />
            <PrimaryButton
                onClick={() => {
                    if (isRegistrationPending) return;
                    registerEvent(selectionState.selectedEvents);
                }}
                text={isRegistrationPending ? "Submitting ..." :  "Submit" }
                customStyles={{
                    alignSelf: 'self-end',
                    fontSize: '1.25rem'
                }}
            />
            {registrationError && <div style={{color: "red", alignSelf: "center"}}>Error on registeration!</div>}
        </div>
    )
}

function EventsRegistry() {
    const { apiResponses, errorOnEventsFetch, waitingForEventApiReponses } = useEventRegistryContext();

    const [selectionState, dispatchSelectionState] = useReducer(selectionStateHandler, {
        unselectedEvents: [],
        selectedEvents: [],
        sortFunction: (anyArray) => anyArray,
    });


    const [sortByFunction, setSortByFunction] = useState(() => () => 0);

    useEffect(() => {
        if (waitingForEventApiReponses || errorOnEventsFetch !== null)
            return;

        const availableEventsFromApi = apiResponses.availableEvents,
            registeredEventsFromApi = apiResponses.registeredEvents;

        // if (apiResponses.availableEvents === null) return;

        const filteredRegisteredEvents = validateRegisteredEvents(availableEventsFromApi, registeredEventsFromApi),
            filteredAvailableEvents = filterOutRegisteredEventsFromAllEvents(availableEventsFromApi, filteredRegisteredEvents);

        dispatchSelectionState({
            actionName: 'update_events', eventsToBeSet: {
                selected: filteredRegisteredEvents,
                unselected: filteredAvailableEvents
            }
        })
    }, [apiResponses, waitingForEventApiReponses, errorOnEventsFetch]);

    useEffect(() => {
        dispatchSelectionState({ actionName: 'update_sort_function', sortBy: sortByFunction ?? (() => 1) })
    }, [sortByFunction])


    const [selectAnEvent, deselectAnEvent] = useMemo(() => {
        const selectAnEvent = (eventObject) => dispatchSelectionState({ actionName: 'select', eventObject });
        const deselectAnEvent = (eventObject) => dispatchSelectionState({ actionName: 'deselect', eventObject });

        return [selectAnEvent, deselectAnEvent]
    }, [])

    if (waitingForEventApiReponses) {
        return <h3>Loading data ...</h3>
    }

    if (errorOnEventsFetch !== null) {
        return <h3>Unable to fetch Events data!</h3>
    }

    return (
        <EventsRegistryContent
            selectionState={selectionState}
            updateSortByFunction={setSortByFunction}
            selectAnEvent={selectAnEvent}
            deselectAnEvent={deselectAnEvent}
        />
    )
}

export default EventsRegistry;