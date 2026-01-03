import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@redux/hooks/useRedux';
import { search, TBinanceSearchResults } from 'exchanges/binance';
import Assets from '@redux/actions/admin_assets';
import SearchBar from '@components/searchbars/Style1';
import Button from '@components/buttons/Style1';
import Container from '@components/containers/Style1';

const Binance = () => {

    const dispatch = useAppDispatch();

    const { names } = useAppSelector(state => state.admin_assets);
    const tickers = names ? names.map(el => el.ticker) : [];

    const [savedData, setSavedData] = useState<TBinanceSearchResults[] | []>([]);
    const [results, setResults] = useState<TBinanceSearchResults[] | []>([]);
    const [keywords, setKeywords] = useState<string>("");
    const [error, setError] = useState<number>(-1);

    const onSubmit = async() => {
        if(!savedData.length) {
            const savedData = await search();
            setSavedData(savedData);
            setResults(savedData.filter((el: any) => el.symbol.includes(keywords.toUpperCase())).slice(0, 10));
        } else {
            setResults(savedData.filter(el => el.symbol.includes(keywords.toUpperCase())).slice(0, 10));
        }
    };

    const onSave = async (name: string, index: number) => {
        try{
            await dispatch(Assets.create({
                name: name, 
                ticker: name, 
                api: "binance", 
                class: "crypto",
                keywords: "technology crypto uncertainty",
                xtype: "candle",
                xlabel: "close_time, close, volume, open, high, low, open_time, quote_asset_volume",
            }));
        } catch(err: any){
            setError(index);
        }
    };
    
    return (
        <div>
            <SearchBar onChange={(value) => setKeywords(value)} onSubmit={onSubmit} placeholder='Search crypto ticker / usdt pairs'/>
            {results.map((el,index) =>
                <Button key={el.symbol} onClick={() => onSave(el.baseAsset, index)} color={tickers.includes(el.baseAsset) ? "primary" : "dark"}>
                    {el.symbol} {error===index&&"EXIST"}
                </Button>
            )}
        </div>
    )
}

const Search = () => {
    return (
        <>  
            <Container>
                <Binance/>
            </Container>
        </>
    )
};

export default Search