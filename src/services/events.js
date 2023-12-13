
import { useEffect, useRef, useState } from "react";
// import ApiMockData from "../ApiMockData";

async function fetchWithAbortControl(url, abortController) {
    try {
        const response = await fetch(url, {signal: abortController.signal});
        const parsedResponseJson = await response.json();
        return parsedResponseJson;
    } catch (e) {
        if (e.name === 'AbortError') {
            console.log("Fetch call aborted");
            return null;
        }
        throw e;
    }
}


export async function fetchEvents (abortController) {
    // const data = ApiMockData;
    const data = await fetchWithAbortControl("https://run.mocky.io/v3/c2d36c00-6e42-425f-8ffe-94547a81cd02", abortController);
    return data;
}

export async function fetchRegisteredEvents (abortController) {
    const data = JSON.parse(localStorage.getItem("registered_events"));
    return data;
}


export function useHandleGetEvents () {
    const [eventsData, setEventsData] = useState(null)    
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(true);
    
    const canceller = useRef();

    useEffect(() => {
        async function fetchAllEvents () {
            canceller.current?.abort();
            canceller.current = new AbortController();
            
            setIsPending(true);

            let allEvents = null, registeredEvents = null;

            try {
                allEvents = await fetchEvents(canceller.current);
            } catch (e) {
                console.log("EE", e)
                if (e.name === 'AbortError') {
                    console.log("Fetch call aborted");
                    return;
                }
                setError(e);
                return;
            }

            canceller.current = new AbortController();          

            try {
                registeredEvents = await fetchRegisteredEvents(canceller.current);
            } catch (e) {
                if (e.name === 'AbortError') {
                    console.log("Fetch call aborted");
                    return;
                }
            }

            console.log("Done!", allEvents, registeredEvents)
            setEventsData({
                availableEvents: allEvents,
                registeredEvents
            })

            setIsPending(false);
        }

        fetchAllEvents();

        return () => canceller.current?.abort();
    }, [])


    return {
        eventsData,
        error,
        isPending,
        canceller: () => {
            canceller.current?.abort();
        }
    }
}