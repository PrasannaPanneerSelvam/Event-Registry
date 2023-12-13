import { useEffect, useState } from 'react'

import styles from './filterOptions.module.css'

function FilterLabel({ text, onClick, isSelected, isAscending }) {
  const classNames = [styles.label];
  if (isSelected) {
    classNames.push(styles.active);
  }

  return (
    <div
      className={classNames.join(" ")}
      onClick={() => onClick(text)}
    >{text} {isAscending ? '↓' : '↑'}</div>
  );
}

function FilterOptions({ labels, selectionCallback }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [reverseSort, setReverseSort] = useState(false);

  useEffect(() => {
    selectionCallback(selectedItem, reverseSort)
  }, [selectedItem, reverseSort])

  return (
    <div className={styles['label-list']}>
      <span>Sort by</span>
      {labels.map((label) => (
        <FilterLabel
          key={label + '-filter'}
          text={label}
          onClick={(labelText) => {
            if (labelText === selectedItem) {
              return setReverseSort(prev => !prev);
            }
            setSelectedItem(labelText);
            setReverseSort(false);
          }}

          isAscending={label === selectedItem ? reverseSort : false}
          isSelected={label === selectedItem}
        />
      ))
      }

      <div className={styles.label} onClick={() => {
        setSelectedItem(null);
        setReverseSort(false);
      }}>X</div>
    </div>
  )


}

export default FilterOptions