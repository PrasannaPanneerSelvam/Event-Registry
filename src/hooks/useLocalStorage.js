import { useState } from "react";

const localStorageObject = window.localStorage ?? {
    getItem: () => {},
    setItem: () => {},
    removeItem: () => {},
}

export default function useLocalStorage () {
    const [localStorageState, setLocalStorageState] = useState({});

    const setItem = (key, value) => {
        try {
            const stringifiedValue = JSON.stringify(value);
            localStorageObject.setItem(key, stringifiedValue);
            setLocalStorageState({...localStorageState, key: value});
        } catch (e) {
            console.error("Error on setting item in local storage", key, value);
            throw new Error("LocalStorage_Set_Error");
        }
    }


    const getItem = (key) => {
        try {
            if (localStorageState.hasOwnProperty(key)) {
                return localStorageState[key];
            }

            const valueFromLocalStorage = localStorageObject.getItem(key);
            const parsedValue = JSON.parse(valueFromLocalStorage);

            setLocalStorageState({...localStorageState, key: parsedValue});
            return parsedValue;

        } catch (e) {
            console.error("Error on getting item from local storage", key, value);
        }
    }

    const removeItem = (key) => {
        try {
            localStorageObject.removeItem(key);
            
            delete localStorageState[key];
            setLocalStorageState({...localStorageState});
        } catch (e) {
            console.error("Error on removing item from local storage", key, value);
        }
    }


    return {getItem, setItem, removeItem};
}