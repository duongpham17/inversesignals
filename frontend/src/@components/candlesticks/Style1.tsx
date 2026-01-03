import styles from './Style1.module.scss';
import { formatDate } from '@utils/functions';

interface Props {
  data: [number, number, number, number, number], // [open, close, high, low, date]
  label?: string,
  height?: number;   // pixel height of the chart
}

const Candle = ({ data, label, height = 50}: Props) => {
  const [open, close, high, low] = data;
  const scale = (price: number) => ((high - price) / (high - low)) * height;
  const bullish = close >= open;
  return (
    <div className={styles.container}>
      <div className={styles.candle}>
        <div className={styles.wick} style={{ top: `${scale(high)}px`, height: `${scale(low) - scale(high)}px` }} />
        <div className={styles.body} style={{ background: bullish ? 'var(--green)' : 'var(--red)', top: `${scale(Math.max(open, close))}px`, height: `${Math.abs(scale(open) - scale(close))}px`}} />
      </div>
      <div className={styles.information}>
        <h4>{label}</h4>
        <p>{formatDate(data[4])}</p>
        <p>Open: {(data[0])}</p>
        <p>Close: {(data[1])}</p>
        <p>High: {(data[2])}</p>
        <p>Low: {(data[3])}</p>
      </div>
    </div>
  );
};

export default Candle;