import { useContext } from 'react';
import { Context } from './UseContext';
import { timeseriesInterval } from '@redux/types/assets';
import Between from '@components/flex/Between';
import Flex from '@components/flex/Flex';
import Button from '@components/buttons/Style1';
import Options from '@components/options/Style1';
import { MdAdd} from "react-icons/md";

const Controller = () => {

    const {setPage, page, timeseries, setTimeseries, onCreateIndices, loading, setAssetClass, assetClass} = useContext(Context);

    const pages = {
        setting_0: ["indicies"],
        setting_1: ["assets","indicators","arrows","momentum", "streaks"],
        setting_2: ["assets", "indicators","arrows","streaks","candle","momentum"],
    };
    
    const options = ["assets", "indicators", "arrows", "streaks", "candle", "indicies", "momentum"];

    return (
        <Between>
            <Flex>
                { pages.setting_0.includes(page)&&
                    <Button color="primary" onClick={onCreateIndices} loading={loading}><MdAdd/> Indices </Button>
                } 
                { pages.setting_1.includes(page) &&
                    <Flex>
                        <Button onClick={() => setAssetClass("stock")}  color={assetClass === "stock" ? "primary" : "dark"}>Stock</Button>
                        <Button onClick={() => setAssetClass("crypto")} color={assetClass === "crypto" ? "primary" : "dark"}>Crypto</Button>
                    </Flex>
                }
                { pages.setting_2.includes(page) &&
                    timeseriesInterval.map(el => <Button key={el} color={timeseries === el ? "primary" : "dark"} onClick={() => setTimeseries(el)}>{el}</Button>)
                }
            </Flex>
            <Flex>
                <Options label1="" value={page} options={options} onClick={setPage}/>
            </Flex>
        </Between>
    )
}

export default Controller