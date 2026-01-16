import { useMemo, useContext } from 'react';
import { Context } from './UseContext';
import { useAppSelector } from '@redux/hooks/useRedux';
import { calculate_trade_metrics } from '@utils/forumlas';
import { formatNumbersToString } from '@utils/functions';
import Text from '@components/texts/Style2';
import Between from '@components/flex/Between';
import Flex from '@components/flex/Flex';
import Line from '@components/line/Style1';
import Icon from '@components/icons/Style1';
import Hover from '@components/hover/Style1';
import { MdStackedLineChart, MdHistory } from "react-icons/md";

const History = () => {

    const {page, onPage} = useContext(Context);

    const {trades} = useAppSelector(state => state.trades);

    const stats = useMemo(() => {
        if(!trades) return {total: 0, volume: 0};
        let [total, volume, profit_count, loss_count, profit, loss] = [0, 0, 0, 0, 0, 0];
        const closed_trades = trades.filter(el => el.close_klines);
        for(const x of closed_trades){
            if(x.close_klines.length === 0) continue;
            const pnl = calculate_trade_metrics(x.close_klines[1], x.open_klines[1], x.side, x.size, x.leverage).pnl;
            total+=pnl;
            volume+=(x.close_klines[1] * x.size);
            if(pnl > 0) {
                profit_count += 1;
                profit += pnl;
            } else {
                loss_count += 1;
                loss += pnl;
            }
        };
        return {
            total, 
            volume, 
            profit_count, 
            loss_count,
            winrate: (profit_count / closed_trades.length) * 100,
            avg_profit: profit/profit_count,
            avg_loss: loss/loss_count
        }
    }, [trades]);

    return (
        <>
            <Between>
                <Flex>
                    {page === 1 && <Hover message="History"><Icon onClick={() => onPage(1)}><MdHistory/></Icon></Hover>}
                    {page === 2 && <Hover message="Analysis"><Icon onClick={() => onPage(-1)}><MdStackedLineChart/></Icon></Hover>}
                    <Text size={17}>History [ {trades?.length} ]</Text>
                </Flex>
                <Flex>
                    <Hover message="Volume"><Text size={17}>${formatNumbersToString(stats.volume)}</Text></Hover>
                    <Hover message={`[ P:${stats.profit_count} $${stats.avg_profit?.toFixed(0)}, L:${stats.loss_count} $${stats.avg_loss?.toFixed(0)} ]`}><Text size={17}>{stats.winrate?.toFixed(2)} %</Text></Hover>
                    <Hover message="PNL"><Text size={17} color={stats.total > 0 ?"green" : "red"}>${formatNumbersToString(stats.total)}</Text></Hover>
                </Flex>
            </Between>
            <Line color='primary' />
        </>
    )
}

export default History;