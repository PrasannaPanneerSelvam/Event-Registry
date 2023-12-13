import { findDiff, findIntersection } from "../Utils/Array";

export function validateRegisteredEvents (allEvents, registeredEvents) {
    return findIntersection(allEvents, registeredEvents, (event1, event2) => event1.id === event2.id);
}

export function filterOutRegisteredEventsFromAllEvents (allEvents, registeredEvents) {
    return findDiff(allEvents, registeredEvents, (event1, event2) => event1.id === event2.id);
}