import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import CustomField from "../components/common/Table/Field/CustomField";
import CustomInputTestHook from "../components/common/Table/Field/CustomInputTestHooks";
import CustomSelectTestHook from "../components/common/Table/Field/CustomSelectHookTest";
import CustomDatePicker from "components/common/Table/Field/CustomDatePicker";
import CustomTimePicker from "components/common/Table/Field/CustomTimePicker";
import moment from "moment";
import { message } from "antd";
import { StringHelper } from "helpers";

const useHeaderActions = () => {
  const [fieldsState, setFieldsState] = useState(null);
  const [errors, setErrors] = useState(null);

  const handleChange = (value, key) => {
    setFieldsState({ ...fieldsState, [key]: value });
  };

  const handleChangRangeDatePicker = (valueString) => {
    if (valueString?.length > 0) {
      setFieldsState({
        ...fieldsState,
        startDate: valueString[0],
        endDate: valueString[1],
      });
      return;
    }
    setFieldsState({ ...fieldsState, startDate: valueString });
  };
  const handleChangRangeTimePicker = (valueString, index) => {
    const indexOfItem = fieldsState?.timePicker?.findIndex(
      (el) => el.index?.toString() === index.toString(),
    );

    if (indexOfItem === -1) {
      if (valueString?.length > 0) {
        const objTime = {
          startTime: valueString[0] || null,
          endTime: valueString[1] || null,
          index: index,
        };
        setFieldsState({
          ...fieldsState,
          timePicker: [...(fieldsState?.timePicker || []), objTime],
        });
        return;
      }
      setFieldsState({
        ...fieldsState,
        timePicker: [
          ...(fieldsState?.timePicker || []),
          { startTime: null, endTime: null, index: index },
        ],
      });
    } else {
      const objTime = {
        startTime: valueString?.[0] || null,
        endTime: valueString?.[1] || null,
        index,
      };
      const clone = [...(fieldsState?.timePicker || [])];
      clone.splice(indexOfItem, 1, objTime);

      setFieldsState({
        ...fieldsState,
        timePicker: [...clone],
      });
    }
  };

  const selectFieldRender = (data, valueKey, labelKey) => {
    return {
      data: data,
      valueKey: valueKey,
      labelKey: labelKey,
      value: fieldsState?.[valueKey],
      onChange: handleChange,
    };
  };

  const inputFieldRender = (valueKey) => {
    return {
      valueKey: valueKey,
      value: fieldsState?.[valueKey],
      onChange: handleChange,
    };
  };

  const datePickerRender = (props) => {
    return {
      onChange: props?.onChange || handleChangRangeDatePicker,
      value: fieldsState?.startDate
        ? [fieldsState?.startDate, fieldsState?.endDate]
        : [null, null],
      ...props,
    };
  };

  const timePickerRender = (props) => {
    return {
      onChange: props?.onChange || handleChangRangeTimePicker,
      value: fieldsState?.timePicker?.find((el) => +el.index === +props.index)
        ? fieldsState?.timePicker?.find((el) => +el.index === +props.index)
        : null,
      ...props,
    };
  };

  const clearFieldState = () => {
    setFieldsState(null);
  };

  const handleSetState = (data) => {
    setFieldsState({ ...data });
  };
  const handleSetStateAsync = (data) => {
    return new Promise((resolve, reject) => {
      setFieldsState((prevState) => {
        try {
          const newState = { ...prevState, ...data };
          resolve(newState);
          return newState;
        } catch (error) {
          reject(error);
        }
      });
    });
  };
  const isValidField = (fields) => {
    let res = true;
    for (let field of fields) {
      if (
        fieldsState?.[field] === undefined ||
        fieldsState?.[field] === null ||
        fieldsState?.[field] === "" ||
        fieldsState?.[field].length === 0
      ) {
        message.error(`${StringHelper.camelCaseToString(field)} is required`);
        res = false;
      }
    }
    return res;
  };
  // Render UI

  const renderInputField = (valueKey, label, type = "text", props) => {
    return (
      <CustomField
        label={label}
        fieldComponent={
          <CustomInputTestHook
            type={type}
            {...inputFieldRender(valueKey)}
            {...props}
          />
        }
      />
    );
  };

  const renderSelectField = (data, valueKey, labelKey, label, props) => {
    return (
      <CustomField
        label={label}
        fieldComponent={
          <CustomSelectTestHook
            showSearch
            filterOption={(input, option) => {
              return (option?.label?.toString().toLowerCase() ?? "").includes(
                input.toString().trim().toLowerCase(),
              );
            }}
            {...selectFieldRender(data, valueKey, labelKey)}
            {...props}
          />
        }
      />
    );
  };

  const renderDatePickerField = (props) => {
    return (
      <CustomField
        label={props?.label || "Date"}
        fieldComponent={<CustomDatePicker {...datePickerRender(props)} />}
      />
    );
  };
  const renderTimePickerField = (props) => {
    return (
      <CustomField
        label={props?.label || "Time"}
        fieldComponent={<CustomTimePicker {...timePickerRender(props)} />}
      />
    );
  };
  return {
    selectFieldRender,
    inputFieldRender,
    datePickerRender,
    renderTimePickerField,
    renderInputField,
    renderSelectField,
    renderDatePickerField,
    handleSetState,
    handleSetStateAsync,
    clearFieldState,
    fieldsState,
    error: errors,
    isValidField,
  };
};

export default useHeaderActions;
