import styles from './Style2.module.scss';

interface Props {
  color?: "dark",
  label1?: string | number, 
  label2?: React.ReactNode, 
  value?: string | undefined, 
  options: {name: string, des: string}[],
  onClick: ((name: string) => void); 
};

const Style2 = ({label1, label2, options, value, onClick}:Props) => {

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onClick(e.target.value);
  };
    
  return (
    <div className={styles.container}>

        <div className={styles.labels}>
          <p>{label1}</p>
          {label2}
        </div>

        <select key={label1} onChange={handleChange} value={value}>
            { options.map((el, index) => 
                <option key={el.name+index} value={el.name}>
                    {el.name} [ {el.des} ]
                </option>
            )}
        </select>

    </div>
  )
}

export default Style2