import {useState} from 'react';

interface Props<T> {
    initialState?: T,
}

const useOpen = <T>({initialState}: Props<T>) => {

    const [open, setOpen] = useState(false);

    const [values, setValues] = useState<T | null>(initialState || null);

    const [array, setArray] = useState<any[]>([initialState]);

    const onOpen = () => setOpen(!open);

    const onOpenValue = (value:T, change=false) => {
        if((value === values) && !change) return setValues(null);
        setValues(value);
    };

    const onOpenArray = (value: string) => {
        setArray(state => state.includes(value) 
            ? state.filter(el => el !== value) 
            : [...state, value]);
    };

    const onArrayClear = () => {
        setArray([]);
    };

    return {
        setOpen,
        onOpen,
        open,
        values,
        onOpenValue,
        setValues,
        array,
        setArray,
        onOpenArray,
        onArrayClear,
    }
};

export default useOpen;