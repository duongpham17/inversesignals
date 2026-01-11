import styles from './Area.module.scss';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { formatDate, formatNumbersToString } from '@utils/functions';

interface Props {
  data: any[],
  xkey: string,
  ykey: string,
  zkey?: string,
  height?: number,
  sync?: string,
  fill?: boolean,
  analysis?:boolean,
};

const CustomToolTips = ({ active, payload, xkey }: {active?: any, payload: any, xkey: string}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const arr: any = Object.values(data); 
    const arrKeys: any = Object.keys(data);
    return (
      <div>
        <p>{ xkey==="date" ? formatDate(arr[0]) : `${xkey} ${arr[0]}`}</p>
        {arr[1] && <h3>{arrKeys[1]}{arrKeys[1]==="$"?"":":"} {formatNumbersToString(arr[1])}</h3>}
        {arr.slice(2).map((_: any, index: number) => <p key={index}>{arrKeys[index+2]}: {formatNumbersToString(arr[index+2]).toLocaleString()}</p>)}
      </div>
    );
  }
  return null;
};

const AreaChartComponent = ({ data, xkey, ykey, zkey, sync, height=300, fill=true, analysis=false}: Props) => {
  return (
    <div onClick={(e) => e.stopPropagation()} className={styles.container}>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} syncId={sync}>
          {xkey === "date" 
            ? <XAxis dataKey="date" tickFormatter={(time) => new Date(time).toDateString()} minTickGap={50} fontSize={12} padding={{right: 20}} />
            : <XAxis dataKey={xkey} minTickGap={50} fontSize={12} padding={{right: 20}} />
          }
          <YAxis dataKey={ykey} tickFormatter={(el) => formatNumbersToString(el)} domain={["auto", "auto"]} fontSize={12}/>
          <Area dataKey={ykey} opacity={0.8} strokeWidth={1.5} stroke={analysis ? "var(--green)" : "var(--primary"} fill={fill ? "var(--primary)" : "transparent"} />
          {zkey && <Area dataKey={zkey} strokeWidth={1.5} stroke={analysis ? "var(--red)" : "var(--primary-light"} fill={"transparent"}/>}
          <Tooltip content={(content) => CustomToolTips({...content, xkey})}/>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AreaChartComponent