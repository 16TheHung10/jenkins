import React, { useContext, useEffect, useState, useRef, useCallback, useMemo, useImperativeHandle } from "react";
import CreatableSelect from "react-select/creatable";
import { Context } from "./index";

const CustomField = React.forwardRef((props, ref) => {
    const context = useContext(Context);
    const optList = context.dataOption.get;


    const [arrList, setArrList] = useState([]);
    const [arrListDefault, setArrListDefault] = useState([]);

    const itemsRef = useRef(null);

    useEffect(() => {
        let arr = [];
        let key = props.name;

        if (optList && optList[key]) {
            Object.keys(optList[key]).map((x) => {
                let obj = {
                    value: optList[key][x],
                    label: optList[key][x],
                };
                arr.push(obj);
            });
        }

        setArrList(arr);
        setArrListDefault(arr);
    }, [context.dataOption.get, context.isIdUpdate.get]);

    useImperativeHandle(ref, () => ({
        hanldeFocusSelect() {
            itemsRef.current.focus();
        },
    }));

    const handleChange = (newValue: any, actionMeta: any) => {
        if (actionMeta && actionMeta.action === "clear") setArrList(arrListDefault);

        if (newValue) {
            const obj = {
                value: newValue.value,
                label: newValue.label,
            };

            const arr = [...arrList];

            const index = arr.findIndex((x) => x.value === newValue.value);

            if (index === -1) {
                arr.push(obj);

                setArrList(arr);
            }

            let newObj = {...context.ipField.get};
            newObj[props.name] = newValue.value;
            context.ipField.set(newObj);
        } else {
            let newObj = {...context.ipField.get};
            newObj[props.name] = "";
            context.ipField.set(newObj);
        }
    };

    const bodyContent = useMemo(() => {
        return (
            <>
                <label>{props.name}:</label>

                <div className="form-group">
                    <CreatableSelect
                        ref={itemsRef}
                        name={props.name}
                        placeholder={"Enter " + props.name}
                        isClearable={true}
                        classNamePrefix="select"
                        options={arrList}
                        onChange={handleChange}
                        value={arrList.filter((x) => x.value === context.ipField.get[props.name])}
                    />
                </div>
            </>
        );
    },[arrList, context.ipField.get, context.isIdUpdate.get]);

    return bodyContent;
    
});
export default React.memo(CustomField);
