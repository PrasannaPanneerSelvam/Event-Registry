
import { formatTime } from "../../../Utils/TimeHelper";
import styles from './eventCard.module.css';


function EventCard({ eventObject, selectionAction, isDisabled = false, primaryActionText = "Click", selectionColor = "green" }) {

  const classNames = [styles.card];
  if (isDisabled) {
    classNames.push(styles.grayOut);
  }

  return (
    <div className={classNames.join(" ")}>
      <h3 className="primary-text">{eventObject.event_name}</h3>
      <h5 className="primary-sub-text">{eventObject.event_category}</h5>
      {/* <div>{formatTime(eventObject.start_time)} - {formatTime(eventObject.end_time)}</div> */}

      <span>Starts at : {formatTime(eventObject.start_time)}</span>
      <span>Ends at : {formatTime(eventObject.end_time)}</span>
      <button className={styles.primaryCta} style={{
        backgroundColor: selectionColor
      }} onClick={() => { if (!isDisabled) selectionAction(); }}>{primaryActionText}</button>
    </div>

  )
}

export default EventCard