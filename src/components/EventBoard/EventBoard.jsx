import { useMemo } from "react";

import EventCard from "../ui/EventCard/EventCard";
import { doesHaveConflict } from "../../Utils/Array";

import styles from "./eventBoard.module.css";

function EventBoard({ selectionState, maxNoOfEventsAllowed, selectAnEvent, deselectAnEvent }) {

  const unselectedEventsWithConflicts = useMemo(() => {
    const selectedSlots = selectionState.selectedEvents.map((selectedEvent) => selectedEvent.ui_meta_data.time_slot);

    return selectionState.unselectedEvents.filter((unselectedEvent) =>
      doesHaveConflict(selectedSlots, unselectedEvent.ui_meta_data.time_slot)
    );

  }, [selectionState.selectedEvents, selectionState.unselectedEvents])

  return (
    <div className={styles.table}>

      <h2 className={styles.tableHeader}>Available Events</h2>
      <div className={styles.divider}></div>
      <h2 className={styles.tableHeader}>Selected Events</h2>


      <div className={styles.column}>
        {
          selectionState.unselectedEvents.map(eachEvent => {
            const hasNoConflict = !unselectedEventsWithConflicts.some(elem => elem === eachEvent),
              allowAddition = hasNoConflict && selectionState.selectedEvents.length < maxNoOfEventsAllowed;

            return (
              <EventCard
                key={eachEvent.id + "-" + eachEvent.event_name + "-col1"}
                eventObject={eachEvent}
                isDisabled={!allowAddition}
                selectionAction={() => selectAnEvent(eachEvent)}
                primaryActionText="Select"
              />
            )
          })
        }</div>

      <div className={styles.divider}></div>
      <div className={styles.column}>{
        selectionState.selectedEvents.map(eachEvent => {
          return (
            <EventCard
              key={eachEvent.id + "-" + eachEvent.event_name + "-col2"}
              eventObject={eachEvent}
              selectionAction={() => deselectAnEvent(eachEvent)}
              primaryActionText="Remove"
              selectionColor="red"
            />
          );
        })
      }</div>

    </div>
  )
}

export default EventBoard