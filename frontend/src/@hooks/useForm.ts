import { useState, useEffect } from 'react';

export const useForm = <T>(initialState: T, callback: CallableFunction, validation?: any) => {

    const [edited, setEdited] = useState(false);

    const [values, setValues] = useState<T>(initialState);

    const [validationErrors, setValidationErrors] = useState<{[key: string]: any}>({});

    const [customErrors, setCustomErrors] = useState<{[key: string]: any}>({});

    const [loading, setLoading] = useState<boolean>(false);

    const onChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        if(event.target.name.includes(".")){
            const keys = event.target.name.split(".");
            const nested = values as any
            const n = nested[keys[0]];
            setValues({...values, [keys[0]]: {
                ...n,
                [keys[1]]: event.target.value
            }});
        } else {
            setValues({...values, [event.target.name] : event.target.value});
        }
        if(!edited) setEdited(true);
    };

    const onSetValue = (v: Partial<typeof initialState | T>) => {
        setValues(state => ({...state, ...v}))
        if(!edited) setEdited(true);
    }

    const onSetCustomErrors = (v: any) => {
        setCustomErrors(state => ({...state, ...v}))
    }

    const onClear = (state?: T) => {
        if(!state) setValues(initialState);
        if(state) setValues(state);
        setEdited(false);
    }

    useEffect(() => {
        return () => {
            setLoading(false);
            setEdited(false);
        }
    }, [])

    const onSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault();

        if(loading) return;

        const ve = !validation ? {} : validation(values);

        const noErrors = ve === null ? true : Object.keys(ve).length === 0;

        if(noErrors) {
            setLoading(true);
            await callback();
            setLoading(false);
            setEdited(false);
        };

        setValidationErrors(ve);
    };

    return {
        values, setValues,
        validationErrors, setValidationErrors,
        customErrors, setCustomErrors, onSetCustomErrors,
        loading, setLoading,
        edited, setEdited,
        onSetValue,
        onChange, 
        onSubmit,
        onClear,
    }
}

export default useForm;