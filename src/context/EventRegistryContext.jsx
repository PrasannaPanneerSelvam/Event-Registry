import { addMetaDataForUI } from '../Utils/EventsHelper';
import { useHandleGetEvents } from '../services/events';
import { createContext, useContext, useEffect, useReducer } from 'react'

const maxNoOfEventsAllowed = 3;

const EventRegistryContext = createContext();

function apiResponseHandler(state, { actionName, response, error }) {

    if (actionName === "api_response") {
        return {
            ...state
            , isPending: false
            , responses: {
                availableEvents: addMetaDataForUI(response.availableEvents),
                registeredEvents: addMetaDataForUI(response.registeredEvents ?? []),
            }
        }
    }

    if (actionName === "api_error") {
        return { ...state, isPending: false, error }
    }

    throw Error('Unknown action name : ' + actionName);
}

function EventRegistryContextComponent({ children }) {

    const [eventsApiState, dispatchApiResponses] = useReducer(apiResponseHandler, {
        responses: { availableEvents: null, registeredEvents: null },
        error: null,
        isPending: true
    });

    const { eventsData, error: eventsFetchError, isPending: eventsFetchPendingState, canceller: eventFetchCanceller } = useHandleGetEvents();

    useEffect(() => {
        if (eventsFetchPendingState === false) {
            const actionName = eventsFetchError !== null ? "api_error" : "api_response";
            dispatchApiResponses({ actionName, error: eventsFetchError, response: eventsData });
        }

        return () => eventFetchCanceller();
    }, [eventsData, eventsFetchError, eventsFetchPendingState, eventFetchCanceller]);

    return (
        <EventRegistryContext.Provider value={{
            apiResponses: eventsApiState.responses,
            waitingForEventApiReponses: eventsApiState.isPending,
            errorOnEventsFetch: eventsApiState.error,
            maxNoOfEventsAllowed,
        }}>
            {children}
        </EventRegistryContext.Provider>
    )
}

export default EventRegistryContextComponent;

export const useEventRegistryContext = () => {
    return useContext(EventRegistryContext);
}