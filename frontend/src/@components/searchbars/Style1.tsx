import styles from './Style1.module.scss';
import React, { useState } from 'react';
import { FaSearch } from "react-icons/fa";

interface Props {
  /** Called whenever input value changes */
  onChange?: (value: string) => void;
  /** Called when user submits search (presses Enter or clicks button) */
  onSubmit: (value: string) => void;
  /** Optional placeholder text */
  placeholder?: string;
  /** Optional initial value */
  defaultValue?: string;
}

const Style1: React.FC<Props> = ({
  onChange,
  onSubmit,
  placeholder = "Search...",
  defaultValue = "",
}) => {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onChange?.(newValue);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!value) return;
    onSubmit(value);
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <button type="submit" onClick={handleSubmit}> <FaSearch /> </button>
      <input type="text" placeholder={placeholder} value={value} onChange={handleChange} autoComplete="off" />
    </form>
  );
};

export default Style1;

