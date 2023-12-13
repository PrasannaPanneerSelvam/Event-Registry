import fetchEvents from '../services/events';
import { createContext, useContext, useEffect, useReducer } from 'react'

const EventRegistryContext = createContext();

const maxNoOfEventsAllowed = 3;

function updateApiReponses(state, { apiName, response }) {
    if (apiName === "events") {
        return {...state, events: response}
    }

    throw Error('Unknown api name : ' + apiName);
}

function EventRegistryContextComponent({ children }) {
    
    const [apiResponses, dispatchApiResponses] = useReducer(updateApiReponses, {events: []})

    useEffect(() => {
        async function setApiData () {
            const data = await fetchEvents()
            dispatchApiResponses({apiName: "events", response: data});
        }

        setApiData();
    }, [])

    return (
        <EventRegistryContext.Provider value={{
            apiResponses,
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