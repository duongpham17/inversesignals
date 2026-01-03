import { useContext } from 'react';
import { Context } from './UseContext';
import { timeseriesInterval } from '@redux/types/assets';
import Icon from '@components/icons/Style1';
import Between from '@components/flex/Between';
import Flex from '@components/flex/Flex';
import Button from '@components/buttons/Style1';
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight, MdAdd} from "react-icons/md";

const Controller = () => {

    const {onPage, page, timeseries, setTimeseries, onCreateIndices, loading, setAssetClass, assetClass} = useContext(Context);

    const pages = {
        setting_0: [5],
        setting_1: [1,2,3],
        setting_2: [2,3,4,5],
    };

    return (
        <Between>
            <Flex>
                { pages.setting_0.includes(page)&&
                    <Button color="primary" onClick={onCreateIndices} loading={loading}><MdAdd/> Indices </Button>
                } 
                { pages.setting_1.includes(page) &&
                    <Flex>
                        <Button onClick={() => setAssetClass("crypto")} color={assetClass === "crypto" ? "primary" : "dark"}>Crypto</Button>
                        <Button onClick={() => setAssetClass("stock")}  color={assetClass === "stock" ? "primary" : "dark"}>Stock</Button>
                    </Flex>
                }
                { pages.setting_2.includes(page) &&
                    timeseriesInterval.map(el => <Button key={el} color={timeseries === el ? "primary" : "dark"} onClick={() => setTimeseries(el)}>{el}</Button>)
                }
            </Flex>
            <Flex>
                <Icon onClick={() => onPage(-1)}><MdOutlineKeyboardArrowLeft/></Icon>
                <Icon onClick={() => onPage(1)}><MdOutlineKeyboardArrowRight/></Icon>
            </Flex>
        </Between>
    )
}

export default Controller