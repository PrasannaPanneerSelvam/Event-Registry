import { useEffect, useState } from "react";

export default function useDebounce (value, delay = 500) {

    const [debounceValue, setDebounceValue] = useState(value);

    useEffect(() => {
        const timeOutId = setTimeout(() => {
            setDebounceValue(value);
        }, delay);

        return () => clearTimeout(timeOutId);
    }, [value, delay])

    return debounceValue;
}