import styles from './Bar.module.scss';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { formatNumbersToString, formatDate } from '@utils/functions';

interface Props {
  data: any[];
  xkey: string;
  ykey: string;
  zkey?: string;
  height?: number;
  sync?: string;
  analysis?: boolean;
}

const CustomToolTips = ({ active, payload, xkey }: { active?: boolean, payload?: any[], xkey: string;}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const arr = Object.values(data);
    const arrKeys = Object.keys(data);

    return (
      <div className={styles.tooltip}>
        <p>{ xkey==="date" ? formatDate(arr[0] as number) : `${xkey}: ${arr[0]}`}</p>
        {arr.slice(1).map((val, idx) => (
          <p key={idx}>
            {arrKeys[idx + 1]}: {formatNumbersToString(val as number)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const BarChartComponent = ({ data, xkey, ykey, zkey, sync, height = 300, analysis = false }: Props) => {
  return (
    <div onClick={(e) => e.stopPropagation()} className={styles.container}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} syncId={sync}>
          <XAxis dataKey={xkey} minTickGap={50} fontSize={12} padding={{ right: 20 }} tickFormatter={xkey === "date" ? (time) => new Date(time).toDateString() : undefined} />
          <YAxis tickFormatter={(el) => formatNumbersToString(el)} domain={["auto", "auto"]} fontSize={12} />
          <Bar dataKey={ykey} fill={analysis ? "var(--green)" : "var(--primary)"} stackId="profit-loss" barSize={10}/>
          {zkey && <Bar dataKey={zkey} fill={analysis ? "var(--red)" : "var(--primary-light)"} stackId="profit-loss" barSize={10}/>}
          <Tooltip content={(props: any) => <CustomToolTips {...props} xkey={xkey} />} cursor={{fill:"var(--dark-shade)"}} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;