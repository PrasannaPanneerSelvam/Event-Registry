import styles from "./primaryButton.module.css"

function PrimaryButton({ text, onClick = (() => { }), isDisabled = false, customStyles = {} }) {
    const classNames = [styles.primaryButton]

    if (isDisabled) {
        classNames.push(styles.disable);
    }

    return (
        <button
            className={classNames.join(" ")}
            style={customStyles}
            onClick={onClick}
        >{text}</button>
    )
}

export default PrimaryButton