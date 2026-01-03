import { useMemo, useContext, useState, Fragment } from 'react';
import { Context } from './UseContext';
import { useAppSelector } from '@redux/hooks/useRedux';
import { percentage_change } from '@utils/forumlas';
import { formatDate, formatNumbersToString } from '@utils/functions';
import { IoIosArrowRoundUp } from "react-icons/io";
import Wrap from '@components/flex/Wrap';
import Flex from '@components/flex/Flex';
import Container from '@components/containers/Style2';
import Text from '@components/texts/Style2';
import Hover from '@components/hover/Style1';
import Button from '@components/buttons/Style1';
import Between from '@components/flex/Between';
import Loader from '@components/loaders/Style1';

const ArrowsHeatmap = () => {

    const {datasetTimeseries, assetClass} = useContext(Context);

    const {assets} = useAppSelector(state => state.assets);

    const roi_list =  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const [roi, setRoi] = useState<number>(2);

    const total = (data: {name: string, roi: number}[]) => {
        return data.reduce((a, c) => a + c.roi, 0);
    };

    const data = useMemo(() => {
        if(!assets) return null;
        const crypto = assets.filter(el => el.class === assetClass);
        const dataObject: {[date: string]: {name: string, roi: number, volume: number}[]} = {};
        for(const asset of crypto){
            for(const x of asset[datasetTimeseries()]){
                const date = x[0];
                const item = {name: asset.name, roi: Number(percentage_change(x[1], x[3]).toFixed(2)), volume: x[2] * x[1]};
                const isDated = dataObject[date];
                if(!isDated) dataObject[date] = [];
                dataObject[date].push(item);
            }   
        };
        return Object.entries(dataObject)
            .map(el => ({timestamp: el[0], asset: el[1]}))
            .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
            .map(el => ({date: el.timestamp, asset: el.asset.sort((a, b) => b.roi - a.roi)}));
    }, [assets, datasetTimeseries, assetClass]);

    const degree = (r: number) => {
        // neutral zone
        if (r > -1 && r < 1) return "90deg";
        // strong positive
        if (r > roi) return "0deg";
        // mild positive
        if (r >= 0) return "45deg";
        // strong negative
        if (r <= -roi) return "180deg";
        // mild negative
        return "135deg";
    };

    if(!data) return <Loader/>

    return (
        <>
            <Wrap>
                {roi_list.map(el => 
                    <Button key={el} color={roi === el ? "primary" : "dark"} onClick={() => setRoi(el)}>{el}%</Button>
                )}
            </Wrap>
            {data.slice(0, 50).map((el) => {   
                const totalRoi = Number(total(el.asset).toFixed(2));
                const totalVolume = el.asset.reduce((acc, cur) => acc + cur.volume, 0);
                const sides = el.asset.reduce((a, c) => { if (c.roi > 0) a.profit++; else a.loss++; return a}, { profit: 0, loss: 0 });
                return (
                    <Container key={el.date}>
                        <Between>
                            <Text size={20}>{formatDate(Number(el.date))}</Text>
                            <Flex>
                                <Hover message="Total Volume"><Text size={20}>${formatNumbersToString(totalVolume)}</Text></Hover>
                                <Hover message="Total Roi"><Text size={20} color={totalRoi > 0 ? "green" : "red"}>{totalRoi}%</Text></Hover>
                            </Flex>
                        </Between>
                        <Between>
                        <Wrap>
                            <Hover message="Profit"><Text color="green" size={20}>{sides.profit}</Text></Hover>
                            <Hover message="Loss"><Text size={20} color="red">{sides.loss}</Text></Hover>
                        </Wrap>
                        <Wrap>
                            {el.asset.map((x, i) => 
                                <Hover key={i} message={`${x.name.toUpperCase()} ${x.roi}%`}>
                                    <IoIosArrowRoundUp size={30} color={x.roi > 0 ? "var(--green)" : "var(--red)"} style={{rotate: degree(x.roi)}} />
                                </Hover>
                            )}
                        </Wrap>
                        </Between>
                    </Container>
                )
            })}
        </>
    )
}

export default ArrowsHeatmap