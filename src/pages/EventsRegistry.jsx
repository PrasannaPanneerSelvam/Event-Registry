import { useEffect, useState, useReducer } from "react";

import { getEventRegistryContext } from "./../context/EventRegistryContext";

import EventBoard from "../components/EventBoard/EventBoard";
import SortOptions from "../components/ui/SortOptions/SortOptions";

import { getComparatorFunction, sortFunctionNames } from "../Utils/EventsSort";
import { useRegisterEvents } from "../services/register";


import { validateRegisteredEvents, filterOutRegisteredEventsFromAllEvents } from "./../validation/validateRegisteredEvents"
import { sortArrayCurried } from "../Utils/Array";

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



function EventsRegistry() {
    const { apiResponses, maxNoOfEventsAllowed, errorOnEventsFetch, waitingForEventApiReponses } = getEventRegistryContext();

    const [selectionState, dispatchSelectionState] = useReducer(selectionStateHandler, {
        unselectedEvents: [],
        selectedEvents: [],
        sortFunction: (anyArray) => anyArray,
    });

    const { registerEvent, isPending: isRegistrationPending, error: registrationError } = useRegisterEvents();


    const [sortByFunction, setSortByFunction] = useState(() => () => 0);

    const selectionCallback = (sortByFunctionName, reverse) => {
        setSortByFunction(() => getComparatorFunction(sortByFunctionName, reverse));
    }

    useEffect(() => {

        const availableEventsFromApi = apiResponses.availableEvents,
            registeredEventsFromApi = apiResponses.registeredEvents;

        if (apiResponses.availableEvents === null) return;


        const filteredRegisteredEvents = validateRegisteredEvents(availableEventsFromApi, registeredEventsFromApi),
            filteredAvailableEvents = filterOutRegisteredEventsFromAllEvents(availableEventsFromApi, filteredRegisteredEvents);


        dispatchSelectionState({
            actionName: 'update_events', eventsToBeSet: {
                selected: filteredRegisteredEvents,
                unselected: filteredAvailableEvents
            }
        })
    }, [apiResponses]);

    useEffect(() => {
        dispatchSelectionState({ actionName: 'update_sort_function', sortBy: sortByFunction ?? (() => 1) })
    }, [sortByFunction])

    if (waitingForEventApiReponses) {
        return <div>Loading data ...</div>
    }

    if (errorOnEventsFetch !== null) {
        return <div>Unable to fetch Events data!</div>
    }

    return (
        <>
            <SortOptions labels={sortFunctionNames} selectionCallback={selectionCallback} />
            <EventBoard
                maxNoOfEventsAllowed={maxNoOfEventsAllowed}
                selectionState={selectionState}
                selectAnEvent={
                    (eventObject) => dispatchSelectionState({ actionName: 'select', eventObject })
                }
                deselectAnEvent={
                    (eventObject) => dispatchSelectionState({ actionName: 'deselect', eventObject })
                }
            />
            <button onClick={() => {
                if (isRegistrationPending) return;
                registerEvent(selectionState.selectedEvents);
            }}
            >{isRegistrationPending ? "Submitting ..." :  "Submit" }</button>

            <div>{registrationError?.message}</div>
        </>
    )
}

export default EventsRegistry;