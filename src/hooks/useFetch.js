import { useEffect, useState } from "react";

async function fetchData(url, {setData, setError, setIsPending, abortController} ) {
    try {
        const fetchResponse = await fetch(url, { signal: abortController.signal });
        const responseJson = await fetchResponse.json();
        setData(responseJson);
        return;
    } catch (e) {
        if (e.name === 'AbortError') {
            return;
        }
        
        setError(e);
        console.error("Error on getting data for url", url);
    } finally {
        setIsPending(false);
    }
}

function useFetch(url) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [canceller, setCanceller] = useState(() => { });

    useEffect(() => {
        const abortController = new AbortController();
        const cancellerFunction = abortController.abort.bind(abortController);

        setCanceller(cancellerFunction);
        setIsPending(true);

        fetchData(url, {setData, setError, setIsPending, abortController});

        return cancellerFunction;

    }, [url]);

    return [data, error, isPending, canceller]

}

export default useFetch;