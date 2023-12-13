import { addMetaDataForUI } from '../Utils/EventsHelper';
import { useHandleGetEvents } from '../services/events';
import { createContext, useContext, useEffect, useReducer } from 'react'

const EventRegistryContext = createContext();

const maxNoOfEventsAllowed = 3;

function updateApiReponses(state, { actionName, response, error }) {

    if (actionName === "api_response") {

        console.log("api_response", response)

        if (response.availableEvents === null) {
            return { ...state, isPending: false, error: "some" }
        }

        const updatedResponses = {
            availableEvents: addMetaDataForUI(response.availableEvents),
            registeredEvents: addMetaDataForUI(response.registeredEvents ?? []),
        }

        return { ...state, isPending: false, responses: updatedResponses }
    }

    if (actionName === "api_error") {
        return { ...state, isPending: false, error }
    }

    throw Error('Unknown action name : ' + actionName);
}


function EventRegistryContextComponent({ children }) {

    const [eventsApiState, dispatchApiResponses] = useReducer(updateApiReponses, {
        responses: { availableEvents: null, registeredEvents: null },
        error: null,
        isPending: true
    });

    const { eventsData, error: eventsFetchError, isPending: eventsFetchPendingState, canceller: eventFetchCanceller } = useHandleGetEvents();

    useEffect(() => {
        if (!eventsFetchPendingState) {
            console.log("Pending over", eventsFetchError);
            if (eventsFetchError !== null) {
                dispatchApiResponses({ actionName: "api_error", error: eventsFetchError });
            } else if (eventsData !== null) {
                console.log("Got data", JSON.parse(JSON.stringify(eventsData)));
                dispatchApiResponses({ actionName: "api_response", response: eventsData });
            }
        }

        return () => eventFetchCanceller();
    }, [eventsData, eventsFetchError, eventsFetchPendingState]);

    console.log("eventsFetchPendingState", eventsFetchPendingState)

    return (
        <EventRegistryContext.Provider value={{
            apiResponses: eventsApiState.responses,
            waitingForEventApiReponses: eventsFetchPendingState,
            errorOnEventsFetch: eventsFetchError,
            maxNoOfEventsAllowed,
        }}>
            {children}
        </EventRegistryContext.Provider>
    )
}

export default EventRegistryContextComponent;

export const getEventRegistryContext = () => {
    return useContext(EventRegistryContext);
}