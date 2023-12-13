import { useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

export function useRegisterEvents() {

    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(null);

    const {setItem}  = useLocalStorage();

    const registerEvent = async (eventsArray) => {
        setIsPending(true);
        setError(null);
        try {
            setItem("registered_events", eventsArray);
        } catch (e) {
            setError(e);
        } finally {
            setIsPending(false);
        }
    }

    return {registerEvent, isPending, error}
}

