
import { useEffect, useRef, useState } from "react";
// import ApiMockData from "../ApiMockData";

// Errors should be handled by the caller function
async function fetchWithAbortControl(url, abortController) {
    const response = await fetch(url, { signal: abortController.signal });
    const parsedResponseJson = await response.json();
    return parsedResponseJson;
}


export async function fetchEvents(abortController) {
    // const data = ApiMockData;
    const data = await fetchWithAbortControl("https://run.mocky.io/v3/c2d36c00-6e42-425f-8ffe-94547a81cd02", abortController);
    return data;
}

export async function fetchRegisteredEvents() {
    const data = JSON.parse(localStorage.getItem("registered_events"));
    return data;
}

export function useHandleGetEvents() {
    const [eventsData, setEventsData] = useState(null)
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(true);

    const canceller = useRef();

    useEffect(() => {
        async function fetchAllEvents() {
            canceller.current?.abort();
            canceller.current = new AbortController();

            setIsPending(true);

            let availableEvents = null, registeredEvents = null;

            try {
                availableEvents = await fetchEvents(canceller.current);
            } catch (e) {
                if (e.name === 'AbortError') {
                    console.log("Fetch call aborted while fetching available events");
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
                    console.log("Fetch call aborted while fetching registered events");
                    return;
                }
            }

            setEventsData({
                availableEvents,
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