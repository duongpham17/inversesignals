import styles from './EmaVwap.module.scss';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { ema, vwap } from '@utils/forumlas';
import { formatNumbersToString, formatDate } from '@utils/functions';

interface Props {
  data: number[][],
  label?: string,
  height?: number,
  sync?: string,
};

const CustomToolTips = ({ active, payload, label }: {active?: any, payload: any, label: string}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className={styles.tooltip}>
        <p>{formatDate(data.date)}</p>
        <h3 className={styles.close}>{label || "$"} {formatNumbersToString(data.close)}</h3>
        <p className={styles.vwap}><span>VWAP</span> <span>{formatNumbersToString(data.vwap)}</span></p>
        <p className={styles.ema5}><span>EMA 5</span> <span>{formatNumbersToString(data.ema5)}</span></p>
        <p className={styles.ema100}><span>EMA 100</span><span>{formatNumbersToString(data.ema100)}</span></p>
        <p className={styles.ema200}><span>EMA 200</span> <span>{formatNumbersToString(data.ema100)}</span></p>
        { data.open === data.high ? <div></div> :
          <div>
            <p><span>OPEN </span><span>{formatNumbersToString(data.open)}</span></p>
            <p><span>HIGH</span> <span>{formatNumbersToString(data.high)}</span></p>
            <p><span>LOW</span> <span>{formatNumbersToString(data.low)}</span></p>
          </div>
        }
      </div>
    );
  }
  return null;
};

const EmaChartComponent = ({ data, label="", sync, height=300}: Props) => {

    const dataForEma = data.map(el => ({date: el[0], price: el[1]}));
    const dataForVwap = vwap(data);

    const EmaData = () => {
        const ema5 = ema(dataForEma, 5);
        const ema100 = ema(dataForEma, 100);
        const ema200 = ema(dataForEma, 200);
        const newData = [];
        for(const index in data){
            newData.push({
                date: data[index][0],
                close: data[index][1],
                open: data[index][3],
                high: data[index][4],
                low: data[index][5],
                ema5: ema5[index].ema,
                ema100: ema100[index].ema,
                ema200: ema200[index].ema,
                vwap: dataForVwap[index].vwap
            })
        };
        return newData;
    };

    return (
      <div onClick={(e) => e.stopPropagation()} className={styles.container}>
        <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={EmaData()} syncId={sync}>
            <XAxis dataKey="date" tickFormatter={(time) => new Date(time).toDateString()} minTickGap={50} fontSize={12} padding={{right: 20}} />
            <YAxis dataKey={"close"} tickFormatter={(el) => formatNumbersToString(el)} domain={["auto", "auto"]} fontSize={12}/>
            <Area dataKey={"close"} opacity={1} strokeWidth={1.5} stroke={"var(--primary"} fill={"transparent"} />
            <Area dataKey={"ema5"} opacity={1} strokeWidth={1.5} stroke={"var(--green"} fill={"transparent"} />
            <Area dataKey={"ema100"} opacity={1} strokeWidth={1.5} stroke={"var(--blue"} fill={"transparent"} />
            <Area dataKey={"ema200"} opacity={1} strokeWidth={1.5} stroke={"var(--yellow"} fill={"transparent"} />
            <Area dataKey={"vwap"} opacity={1} strokeWidth={1.5} stroke={"var(--primary-light"} fill={"transparent"} />
            <Tooltip content={content => CustomToolTips({...content, label})}/>
            </AreaChart>
        </ResponsiveContainer>
      </div>
    );
}

export default EmaChartComponent