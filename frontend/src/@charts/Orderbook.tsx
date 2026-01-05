import styles from "./Orderbook.module.scss";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  Tooltip,
  ReferenceLine
} from "recharts";
import { formatNumbersToString } from "@utils/functions";

type TOrder = { price: number; size: number };

interface Props {
  price: number,
  buys: TOrder[];
  sells: TOrder[];
  height?: number;
};

const CustomToolTips = ({ active, payload }: {active?: any, payload: any}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className={styles.tooltip}>
        <p className={styles[data.side]}>${data.price} {formatNumbersToString(data.size)} {data.side.toUpperCase()}</p>
      </div>
    );
  }
  return null;
};

const OrderbookBars = ({ buys, sells, height = 300, price }: Props) => {
  // Normalize data for BarChart
  const data = [
    ...buys.map(b => ({ price: b.price, size: b.size, side: "buy" })),
    ...sells.map(s => ({ price: s.price, size: s.size, side: "sell"})),
  ].sort((a, b) => a.price - b.price);

  return (
    <div className={styles.container}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 70, bottom: 0, left: 5 }}>
          {/* Size axis */}
          <XAxis type="number" dataKey={"size"} domain={[0, "dataMax"]} fontSize={14} />

           {/* Current price line */}
          <ReferenceLine y={price} stroke="var(--primary)" strokeWidth={1} ifOverflow="extendDomain"
            label={{ value: (price), position: "right", fill: "var(--primary)", fontSize: 14 }}
          />

          {/* Price axis */}
          <YAxis type="number" dataKey="price" domain={["auto", "auto"]} tickFormatter={formatNumbersToString} fontSize={12} reversed={true} />

          {/* Size bars */}
          <Bar dataKey="size" width={10}>
            {data.map((entry, index) => <Cell key={`cell-${index}`} fill={ entry.side === "buy" ? "var(--green)" : "var(--red)" } /> )}
          </Bar>
          
          <Tooltip content={CustomToolTips}/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrderbookBars;