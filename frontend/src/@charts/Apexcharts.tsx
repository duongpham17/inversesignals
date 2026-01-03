import styles from './Apexcharts.module.scss';
import { useMemo } from 'react';
import { IAssets } from '@redux/types/assets';
import { calculate_trade_metrics } from '@utils/forumlas';
import { formatNumbersToString, formatDate } from '@utils/functions';
import { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";

// Helper function to calculate EMA
const calculateEMA = (data: number[], period: number): number[] => {
  const k = 2 / (period + 1); // Smoothing factor
  const ema: number[] = [];
  let prevEMA = data[0]; // Initialize with the first data point
  data.forEach((price, index) => {
    if (index === 0) {
      ema.push(price); // First EMA is the same as the price
    } else {
      const currentEMA = price * k + prevEMA * (1 - k);
      ema.push(currentEMA);
      prevEMA = currentEMA;
    }
  });
  return ema;
};

export type TWap = { date: number; vwap: number };
export const calculate_vwap = (data: number[][]):TWap[] => {
  let cumulativePV = 0;  // Sum of (Typical Price * Volume)
  let cumulativeVolume = 0; // Sum of volume
  const result: TWap[] = [];
  for (const kline of data) {
    const [date, close, volume, , high, low] = kline;
    // Typical Price = (High + Low + Close) / 3
    const typicalPrice = (high + low + close) / 3;
    // Add to cumulative sums
    cumulativePV += typicalPrice * volume;
    cumulativeVolume += volume;
    // VWAP = cumulative PV / cumulative volume
    const vwap = cumulativePV / cumulativeVolume;
    result.push({ date, vwap });
  };
  return result;
};

interface Props {
  data: IAssets["dataset_1d"],
  height?: number,
  plain?:boolean,
  annotations?: {open: number, side: string, size: number, leverage: number}[]
};

const Candlesticks = ({data, height=200, plain=false, annotations=[]}: Props) => {

  // Prepare candlestick data
  const candlestick_data = data.map(([time, close, volume, open, high, low]) => ({
    x: time, 
    y: [open, high, low, close]
  }));
  // Define series
  const candleStickSeries = {
    type: 'candlestick',
    data: candlestick_data,
  };

  // Extract close prices for EMA calculation
  const closePrices = data.map(([, , , , close]) => close);
  // Map series
  const ema = {
    _50: {
      series: calculateEMA(closePrices, 50).map((value, index) => ({ x: data[index][0], y: value})),
      color: "var(--yellow)"
    },
    _20: {
      series: calculateEMA(closePrices, 20).map((value, index) => ({ x: data[index][0], y: value})),
      color: "var(--blue)",
    },
    _5: {
      series: calculateEMA(closePrices, 5).map((value, index) => ({ x: data[index][0], y: value})),
      color: "var(--green)"
    }
  }
  const EmaTemplate =( name: string, color: string, series: typeof ema._20.series) => {
    return {
      name,
      type: 'line',
      data: series,
      color: color, // Explicit color for the EMA 50 line
      stroke: {
        curve: 'smooth', // Make the line smooth
        width: 2,        // Line thickness
        colors: [color], // Ensure this overrides global settings
      },
    }
  };
  const emaSeries = {
    _50: EmaTemplate("Ema 50",  ema._50.color, ema._50.series),
    _20: EmaTemplate("EMA 20", ema._20.color, ema._20.series),
    _5: EmaTemplate("Ema 5",  ema._5.color, ema._5.series),
  };

  // Calculate VWAP
  const vwapSeries = calculate_vwap(data).map(point => ({ x: point.date, y: point.vwap }));

  const vwapLineSeries = {
    name: 'VWAP',
    type: 'line',
    data: vwapSeries,
    color: 'var(--primary-light)',
    stroke: {
      curve: 'smooth',
      width: 2,
      colors: ['var(--primary-light)'],
    },
  };

  const series = [candleStickSeries, emaSeries._20, emaSeries._50, emaSeries._5, vwapLineSeries];

  const current_price = useMemo(() => data?.slice(-1)[0]?.[1] ?? 0, [data]);

  const options: ApexOptions = {
    chart: {
      type: 'candlestick',
      height: height,
      toolbar: { show: false },
    },
    legend: {
      show: plain ? false : true
    },
    stroke: {
      width: [1.5, 1.5, 1.5, 1.5, 1.5], // Line widths for candlestick,EMA 20, EMA 50, and EMA 20, vwap
      curve: 'smooth',
    },
    tooltip: {
      enabled: true,
      shared: true, 
      followCursor: true,
      custom: ({ w, dataPointIndex }) => {
        const date  = formatDate(w.globals.seriesX[0][dataPointIndex]);
        const open  = w.globals.seriesCandleO[0][dataPointIndex];
        const high  = w.globals.seriesCandleH[0][dataPointIndex];
        const low   = w.globals.seriesCandleL[0][dataPointIndex];
        const close = w.globals.seriesCandleC[0][dataPointIndex];
        const ema20 = w.globals.series[1][dataPointIndex];
        const ema50 = w.globals.series[2][dataPointIndex];
        const ema5 = w.globals.series[3][dataPointIndex];
        const vwap = w.globals.series[4][dataPointIndex];
        return `
          <div style="background: var(--dark-shade); padding: 1rem">
            <p>${date}</p>
            <h3 style="color:var(--primary); padding: 0.5rem 0">$${formatNumbersToString(close)}</h3>
            <p style="color:var(--primary-light)">VWAP: $${formatNumbersToString(vwap)}</p>
            <p style="color:var(--blue)">EMA 50: ${formatNumbersToString(ema50)}</p>
            <p style="color:var(--yellow)">EMA 20: ${formatNumbersToString(ema20)}</p>
            <p style="color:var(--green)">EMA 5: ${formatNumbersToString(ema5)}</p>
            <p>OPEN: ${formatNumbersToString(open)}</p>
            <p>HIGH: ${formatNumbersToString(high)}</p>
            <p>LOW: ${formatNumbersToString(low)}</p>
          </div>
        `;
      }
    },
    grid: {
      show: false,
    },
    xaxis: {
      type: 'datetime',
      labels: {
        formatter: (val: number, timestamp?: number) => {
          return plain ? "" : new Date(timestamp!).toDateString();
        },
        style: {
          colors: 'var(--text-light)',
          fontSize: "0.8rem"
        },
      },
      axisBorder: {
        show: plain ? false : true,
      },
      axisTicks: {
        show: plain ? false : true,
      },
      crosshairs: {
        show: true,
        stroke: {
          width: 1,
          dashArray: 0,
        },
      },
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
      labels: {
        formatter: (val: number) => {
          return formatNumbersToString(val)
        },
        style: {
          colors: 'var(--text-light)',
          fontSize: "0.8rem"
        },
      },
      crosshairs: {
        show: true,
        stroke: {
          width: 1,
          dashArray: 0,
        },
      },
    },
    annotations: {
      yaxis: annotations.length === 0 ? [] : annotations.map(el => {
        const metrics = calculate_trade_metrics(current_price,el.open,el.side,el.size,el.leverage);
        const pnlColor = metrics.pnl > 0 ? "var(--green)" : "var(--red)";
        return {
          y: el.open,
          borderWidth: 0.5,
          strokeDashArray: 3,
          borderColor: pnlColor,
          label: {
            borderColor: pnlColor,
            style: {
              color: "#fff",
              background: pnlColor,
              padding: { left: 0, right: 10 },
            },
            text: `${el.side.charAt(0).toUpperCase()} ${el.size} @ ${el.open} $${metrics.pnl.toFixed(2)}`,
            offsetX: -50,
            offsetY: 8,
          }
        };
      })
    }
  };

  return (
    <div className={styles.container}>
      <ReactApexChart options={options} series={series} type="candlestick" height={height} />
    </div>
  );
}

export default Candlesticks;