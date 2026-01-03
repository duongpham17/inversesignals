import styles from './Style2.module.scss';
import React, { useState } from 'react';
import { FaSearch } from "react-icons/fa";

interface Props {
  data: string[]
  placeholder?: string;
  children: (items: string[]) => React.ReactNode;
}

const Style2 = ({ data, children, placeholder="Search" }: Props) => {
  const [value, setValue] = useState("");
  const [items, setItems] = useState(data);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if(!newValue) {
        setItems(data);
        setValue(newValue);
        return;
    };
    setItems(state => state.filter(el => el.includes(newValue)))
    setValue(newValue);
  };

  return (
    <div className={styles.container}>
      <div className={styles.search}>
        <button> <FaSearch /> </button>
        <input type="text" placeholder={placeholder} value={value} onChange={onChange} autoComplete="off" />
      </div>
      {children(items)}
    </div>
  );
};

export default Style2;
