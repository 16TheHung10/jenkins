import { yupResolver } from '@hookform/resolvers/yup';
import { DatePicker, Input, InputNumber, Radio, Switch, Tag, TimePicker, TreeSelect } from 'antd';
import { NumberHelper, StringHelper } from 'helpers';
import moment from 'moment';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Controller, get, useForm } from 'react-hook-form';
import * as yup from 'yup';
import SelectFormField from '../components/common/selects/SelectFormField';
import CustomSlider from '../components/common/slider/customSlider/CustomSlider';
import UploadFileComponent from '../components/common/upload/UploadFileComponent';
import TextEditor from 'components/common/editor/TextEditor';
import SelectStoreFormField from 'components/common/selects/SelectStoreFormField';
// import { get } from 'lodash';
const { RangePicker } = DatePicker;
// !Use this hook to render input field
const useFormFields = (props) => {
  const { fieldInputs, onSubmit, watches, additionalValidate, defaultValue, ...rest } = props;
  const [datePicker, setDatePicker] = useState('date');
  let returnValue = useRef();
  const [formValues, setFormValues] = useState(defaultValue);

  const schema = yup.object().shape(
    fieldInputs?.reduce(
      (acc, field) => {
        if (field?.rules) {
          acc[field.name] = field.rules;
        }
        return acc;
      },
      { ...(additionalValidate || {}) }
    )
  );

  const hookForm = useForm({
    defaultValues: formValues,
    resolver: yupResolver(schema),
    ...rest,
  });

  const { handleSubmit, control, formState, reset, getValues, watch, setValue } = hookForm;

  useEffect(() => {
    if (watches?.length > 0) {
      watches.forEach((el) => {
        watch(el);
      });
    }
  }, [watches]);
  const onSubmitHandler = handleSubmit(async (data, callBack) => {
    await onSubmit(data);
    setFormValues(data);
    return data;
  });
  const handleSetDatePicker = (value) => {
    setDatePicker(value);
  };
  const formatRangePickerValue = (value) => {
    if (!value) return null;
    const fieldValue = [
      moment(value[0]).startOf(datePicker),
      moment(value[1]).endOf(datePicker).diff(moment()) > 0 ? moment() : moment(value[1]).endOf(datePicker),
    ];
    return fieldValue;
  };
  const formInputs = () =>
    fieldInputs?.map((item) => {
      if (item) {
        const { name, label, type, options, labelClass, rules, maxTagCount, render, ...props } = item;
        switch (type) {
          case 'select':
            return (
              <Fragment key={name}>
                <label className={`label ${labelClass}`}>{label}</label>
                <Controller
                  control={control}
                  name={name}
                  render={({ field }) => {
                    return (
                      <SelectFormField
                        {...field}
                        className={`${formState.errors[name] ? 'field-error' : ''}`}
                        showSearch
                        allowClear
                        filterOption={(input, option) => {
                          if (props.filterOption) {
                            return props.filterOption(input, option);
                          }
                          const normalizeOptionValue = StringHelper.normalize(option.label);
                          const normalizeInputValue = StringHelper.normalize(input);
                          if (!normalizeOptionValue?.toLowerCase().includes(normalizeInputValue)) {
                            return (option?.label?.toString().toLowerCase() ?? '').includes(
                              input.toString().trim().toLowerCase()
                            );
                          }
                          return true;
                        }}
                        onChange={(e) => {
                          item.onChange && item.onChange(e);
                          field.onChange(e);
                        }}
                        options={options}
                        {...props}
                        style={{ width: '100%' }}
                      />
                    );
                  }}
                />
                <p className="error-text-12">{formState.errors[name]?.message}</p>
              </Fragment>
            );
          case 'select-tree':
            return (
              <Fragment key={name}>
                <label className={`label ${labelClass}`}>{label}</label>
                <Controller
                  control={control}
                  name={name}
                  render={({ field }) => {
                    return (
                      <TreeSelect
                        showSearch
                        style={{
                          width: '100%',
                        }}
                        dropdownStyle={{
                          maxHeight: 400,
                          overflow: 'auto',
                        }}
                        placeholder="Please select"
                        allowClear
                        treeDefaultExpandAll
                        {...props}
                      />
                    );
                  }}
                />
                <p className="error-text-12">{formState.errors[name]?.message}</p>
              </Fragment>
            );

          case 'number':
            return (
              <Fragment key={name}>
                <label className={`label ${labelClass}`}>{label}</label>
                <Controller
                  control={control}
                  name={name}
                  render={({ field }) => {
                    return (
                      <InputNumber
                        className={`${formState.errors[name] ? 'field-error' : ''}`}
                        {...field}
                        onBlur={(e) => {
                          if (Boolean(props.rounded)) {
                            setValue(
                              name,
                              NumberHelper.roundedValue(e.target.value?.replaceAll(',', ''), props.rounded || 5)
                            );
                          }
                        }}
                        {...props}
                        style={{ width: '100%' }}
                      />
                    );
                  }}
                />
                <p className="error-text-12">{formState.errors[name]?.message}</p>
              </Fragment>
            );
          case 'text':
            return (
              <Fragment key={name}>
                <label className={`label ${labelClass}`}>{label}</label>
                <Controller
                  control={control}
                  name={name}
                  render={({ field }) => (
                    <Input
                      className={`${formState.errors[name] ? 'field-error' : ''}`}
                      {...field}
                      {...props}
                      type={type}
                    />
                  )}
                />
                <p className="error-text-12">{formState.errors[name]?.message}</p>
              </Fragment>
            );
          case 'text-area':
            return (
              <Fragment key={name}>
                <label className={`label ${labelClass}`}>{label}</label>
                <Controller
                  control={control}
                  name={name}
                  render={({ field }) => (
                    <Input.TextArea
                      className={`${formState.errors[name] ? 'field-error' : ''}`}
                      {...field}
                      {...props}
                    />
                  )}
                />
                <p className="error-text-12">{formState.errors[name]?.message}</p>
              </Fragment>
            );
          case 'date-single':
            return (
              <div key={name} className="w-full">
                <label className={`label ${labelClass}`}>{label}</label>
                <Controller
                  control={control}
                  name={name}
                  render={({ field }) => (
                    <DatePicker
                      format="DD/MM/YYYY"
                      className={`${formState.errors[name] ? 'field-error' : ''} w-full`}
                      {...field}
                      {...props}
                    />
                  )}
                />
                <p className="error-text-12">{formState.errors[name]?.message}</p>
              </div>
            );
          case 'date-range':
            return (
              <div key={name} className="w-full">
                <label className={`label ${labelClass}`}>{label}</label>
                <Controller
                  control={control}
                  name={name}
                  render={({ field }) => (
                    <RangePicker
                      className={`${formState.errors[name] ? 'field-error' : ''} w-full`}
                      {...field}
                      {...props}
                    />
                  )}
                />
                <p className="error-text-12">{formState.errors[name]?.message}</p>
              </div>
            );
          case 'time-single':
            return (
              <div key={name} className="w-full">
                <label className={`label ${labelClass}`}>{label}</label>
                <Controller
                  control={control}
                  name={name}
                  render={({ field }) => (
                    <TimePicker
                      format="HH:mm"
                      className={`${formState.errors[name] ? 'field-error' : ''} w-full`}
                      {...field}
                      {...props}
                    />
                  )}
                />
                <p className="error-text-12">{formState.errors[name]?.message}</p>
              </div>
            );
          case 'time-range':
            return (
              <div key={name} className="w-full">
                <label className={`label ${labelClass}`}>{label}</label>
                <Controller
                  control={control}
                  name={name}
                  render={({ field }) => (
                    <TimePicker.RangePicker
                      format="HH:mm"
                      className={`${formState.errors[name] ? 'field-error' : ''} w-full`}
                      {...field}
                      {...props}
                    />
                  )}
                />
                <p className="error-text-12">{formState.errors[name]?.message}</p>
              </div>
            );
          case 'switch':
            return (
              <div key={name} className="" style={{ width: 'fit-content' }}>
                <label className={`label ${labelClass}`}>{label}</label>
                <Controller
                  control={control}
                  name={name}
                  render={({ field }) => (
                    <Switch className={`${formState.errors[name] ? 'field-error' : ''} w-full`} {...field} {...props} />
                  )}
                />
                <p className="error-text-12">{formState.errors[name]?.message}</p>
              </div>
            );
          default:
            return;
        }
      }
    });

  const formInputsWithSpan = () =>
    fieldInputs?.map((item) => {
      if (item) {
        const {
          name,
          label,
          type,
          options,
          labelClass,
          rules,
          maxTagCount,
          render,
          isSelectFuture = true,
          ...props
        } = item;
        if (props.defaultValue) {
        }
        switch (type) {
          case 'ck-editor':
            return {
              component: (
                <Fragment key={name}>
                  <label className={`label ${labelClass}`}>{label}</label>
                  <Controller
                    control={control}
                    name={name}
                    defaultValue={props.defaultValue}
                    render={({ field }) => {
                      return <TextEditor {...props} {...field} disabled={props.disabled} />;
                    }}
                  />
                  <p className="error-text-12">{formState.errors[name]?.message}</p>
                </Fragment>
              ),
              ...props,
            };
          case 'file':
            return {
              component: (
                <Fragment key={name}>
                  <label className={`label ${labelClass}`}>{label}</label>
                  <Controller
                    control={control}
                    name={name}
                    defaultValue={props.defaultValue}
                    render={({ field }) => {
                      const { ref, ...rest } = field;
                      return <UploadFileComponent {...props} {...rest} />;
                    }}
                  />
                  <p className="error-text-12">{formState.errors[name]?.message}</p>
                </Fragment>
              ),
              ...props,
            };
          case 'slider':
            return {
              component: (
                <Fragment key={name}>
                  <label className={`label ${labelClass}`}>{label}</label>
                  <Controller
                    control={control}
                    name={name}
                    defaultValue={props.defaultValue}
                    render={({ field }) => {
                      return <CustomSlider range {...props} {...field} />;
                    }}
                  />
                  <p className="error-text-12">{formState.errors[name]?.message}</p>
                </Fragment>
              ),
              ...props,
            };
          case 'select':
            return {
              component: (
                <Fragment key={name}>
                  <div className="flex gap-10 items-center">
                    <div className="flex-1" style={{ maxWidth: '100%' }}>
                      <label className={`label ${labelClass}`}>{label}</label>
                      <Controller
                        control={control}
                        name={name}
                        defaultValue={props.defaultValue}
                        render={({ field }) => {
                          return (
                            <SelectFormField
                              {...field}
                              className={`${formState.errors[name] ? 'field-error' : ''}`}
                              showSearch
                              allowClear
                              filterOption={(input, option) => {
                                if (props.filterOption) {
                                  return props.filterOption(input, option);
                                }
                                const normalizeOptionValue = StringHelper.normalize(option.label);
                                const normalizeInputValue = StringHelper.normalize(input);
                                if (!normalizeOptionValue?.toLowerCase().includes(normalizeInputValue)) {
                                  return (option?.label?.toString().toLowerCase() ?? '').includes(
                                    input.toString().trim().toLowerCase()
                                  );
                                }
                                return true;
                              }}
                              onChange={(e) => {
                                item.onChange && item.onChange(e);
                                field.onChange(e);
                              }}
                              options={options}
                              style={{ width: '100%' }}
                              {...props}
                            />
                          );
                        }}
                      />
                      <p className="error-text-12">{formState.errors[name]?.message}</p>
                    </div>
                    {render && render()}
                  </div>
                </Fragment>
              ),
              ...props,
            };
          case 'select-store':
            return {
              component: (
                <Fragment key={name}>
                  <div className="flex gap-10 items-center">
                    <div className="flex-1" style={{ maxWidth: '100%' }}>
                      <label className={`label ${labelClass}`}>
                        Store:{' '}
                        <Radio.Group
                          onChange={(e) => {
                            console.log({ e });
                          }}
                        >
                          <Radio value={'DIRECT'}>Direct</Radio>
                          <Radio value={'FRANCHISE'}>Franchise</Radio>
                        </Radio.Group>
                      </label>
                      <Controller
                        control={control}
                        name={name}
                        defaultValue={props.defaultValue}
                        render={({ field }) => {
                          return (
                            <SelectStoreFormField
                              {...field}
                              className={`${formState.errors[name] ? 'field-error' : ''}`}
                              showSearch
                              allowClear
                              filterOption={(input, option) => {
                                if (props.filterOption) {
                                  return props.filterOption(input, option);
                                }
                                const normalizeOptionValue = StringHelper.normalize(option.label);
                                const normalizeInputValue = StringHelper.normalize(input);
                                if (!normalizeOptionValue?.toLowerCase().includes(normalizeInputValue)) {
                                  return (option?.label?.toString().toLowerCase() ?? '').includes(
                                    input.toString().trim().toLowerCase()
                                  );
                                }
                                return true;
                              }}
                              onChange={(e) => {
                                item.onChange && item.onChange(e);
                                field.onChange(e);
                              }}
                              options={options}
                              style={{ width: '100%' }}
                              {...props}
                            />
                          );
                        }}
                      />
                      <p className="error-text-12">{formState.errors[name]?.message}</p>
                    </div>
                    {render && render()}
                  </div>
                </Fragment>
              ),
              ...props,
            };
          case 'select-tree':
            return {
              component: (
                <Fragment key={name}>
                  <label className={`label ${labelClass}`}>{label}</label>
                  <Controller
                    control={control}
                    name={name}
                    render={({ field }) => {
                      return (
                        <TreeSelect
                          {...field}
                          showSearch
                          treeNodeFilterProp="title"
                          style={{
                            width: '100%',
                          }}
                          dropdownStyle={{
                            maxHeight: 400,
                            overflow: 'auto',
                          }}
                          placeholder="Please select"
                          allowClear
                          treeDefaultExpandAll
                          {...props}
                        />
                      );
                    }}
                  />
                  <p className="error-text-12">{formState.errors[name]?.message}</p>
                </Fragment>
              ),
              ...props,
            };

          case 'number':
            return {
              component: (
                <Fragment key={name}>
                  <label className={`label ${labelClass}`}>{label}</label>
                  <Controller
                    control={control}
                    name={name}
                    render={({ field }) => {
                      return (
                        <InputNumber
                          className={`${formState.errors[name] ? 'field-error' : ''}`}
                          {...field}
                          onBlur={(e) => {
                            if (Boolean(props.rounded)) {
                              setValue(
                                name,
                                NumberHelper.roundedValue(e.target.value?.replaceAll(',', ''), props.rounded || 5)
                              );
                            }
                          }}
                          {...props}
                          style={{ width: '100%' }}
                        />
                      );
                    }}
                  />
                  <p className="error-text-12">{formState.errors[name]?.message}</p>
                </Fragment>
              ),
              ...props,
            };
          case 'text':
            return {
              component: (
                <Fragment key={name}>
                  <label className={`label ${labelClass}`}>{label}</label>
                  <Controller
                    control={control}
                    name={name}
                    render={({ field }) => {
                      return (
                        <Input
                          className={`${get(formState.errors, name) ? 'field-error' : ''}`}
                          {...field}
                          {...props}
                          type={type}
                          ref={field.ref}
                          onBlur={(e) => {
                            props.onBlur && props.onBlur(e);
                            field.onBlur(e);
                          }}
                        />
                      );
                    }}
                  />
                  <p className="error-text-12">{get(formState.errors, name)?.message}</p>
                </Fragment>
              ),
              ...props,
            };
          case 'text-area':
            return {
              component: (
                <Fragment key={name}>
                  <label className={`label ${labelClass}`}>{label}</label>
                  <Controller
                    control={control}
                    name={name}
                    render={({ field }) => (
                      <Input.TextArea
                        className={`${formState.errors[name] ? 'field-error' : ''}`}
                        {...field}
                        {...props}
                      />
                    )}
                  />
                  <p className="error-text-12">{formState.errors[name]?.message}</p>
                </Fragment>
              ),
              ...props,
            };
          case 'date-single':
            return {
              component: (
                <div key={name} className="w-full">
                  <label className={`label ${labelClass}`}>{label}</label>
                  <Controller
                    control={control}
                    name={name}
                    render={({ field }) => (
                      <DatePicker
                        format="DD/MM/YYYY"
                        className={`${formState.errors[name] ? 'field-error' : ''} w-full`}
                        {...field}
                        {...props}
                      />
                    )}
                  />
                  <p className="error-text-12">{formState.errors[name]?.message}</p>
                </div>
              ),
              ...props,
            };
          case 'date-range':
            return {
              component: (
                <div key={name} className="w-full">
                  <label className={`label ${labelClass}`}>{label}</label>
                  <Controller
                    control={control}
                    name={name}
                    render={({ field }) => {
                      return (
                        <RangePicker
                          className={`${formState.errors[name] ? 'field-error' : ''} w-full`}
                          format="DD/MM/YYYY"
                          {...field}
                          {...props}
                          onChange={(value) => {
                            // const formatedValue = isSelectFuture ? formatRangePickerValue(value) : value;
                            field.onChange(value);
                          }}
                          // ranges={
                          //   props.isFullOption
                          //     ? {
                          //         Today: () => {
                          //           return [moment(), moment()];
                          //         },
                          //         'This Week': () => {
                          //           return [moment().startOf('week'), moment().endOf('week')];
                          //         },
                          //         'This Month': () => {
                          //           return [
                          //             moment().startOf('month'),
                          //             moment().endOf('month').diff(moment()) > 0 ? moment() : moment().endOf('month'),
                          //           ];
                          //         },
                          //         // 'This Quarter': () => {
                          //         //   return [moment().startOf('quarter'), moment().endOf('quarter')];
                          //         // },
                          //         // 'This Year': () => {
                          //         //   return [moment().startOf('year'), moment().endOf('year')];
                          //         // },
                          //       }
                          //     : {}
                          // }
                          renderExtraFooter={(PanelMode) => {
                            return props.isFullOption ? (
                              <div className="p-10 flex gap-10">
                                <span style={{ minWidth: 'fit-content' }}>Select by: </span>
                                <div className="flex items-center gap-10 wrap">
                                  <Tag
                                    color="green"
                                    onClick={() => handleSetDatePicker('date')}
                                    className="cursor-pointer"
                                  >
                                    Date
                                  </Tag>
                                  <Tag
                                    color="green"
                                    onClick={() => handleSetDatePicker('month')}
                                    className="cursor-pointer"
                                  >
                                    Month
                                  </Tag>
                                  {/* <Tag
                                    color="green"
                                    onClick={() =>
                                      handleSetDatePicker('quarter')
                                    }
                                    className="cursor-pointer"
                                  >
                                    Quarter
                                  </Tag>
                                  <Tag
                                    color="green"
                                    onClick={() => handleSetDatePicker('year')}
                                    className="cursor-pointer"
                                  >
                                    Year
                                  </Tag> */}
                                </div>
                              </div>
                            ) : null;
                          }}
                          picker={datePicker}
                        />
                      );
                    }}
                  />
                  <p className="error-text-12">{formState.errors[name]?.message}</p>
                </div>
              ),
              ...props,
            };

          case 'time-single':
            return {
              component: (
                <div key={name} className="w-full">
                  <label className={`label ${labelClass}`}>{label}</label>
                  <Controller
                    control={control}
                    name={name}
                    render={({ field }) => (
                      <TimePicker
                        format="HH:mm"
                        className={`${formState.errors[name] ? 'field-error' : ''} w-full`}
                        {...field}
                        {...props}
                      />
                    )}
                  />
                  <p className="error-text-12">{formState.errors[name]?.message}</p>
                </div>
              ),
              ...props,
            };

          case 'time-range':
            return {
              component: (
                <div key={name} className="w-full">
                  <label className={`label ${labelClass}`}>{label}</label>
                  <Controller
                    control={control}
                    name={name}
                    render={({ field }) => (
                      <TimePicker.RangePicker
                        format="HH:mm"
                        className={`${formState.errors[name] ? 'field-error' : ''} w-full`}
                        {...field}
                        {...props}
                      />
                    )}
                  />
                  <p className="error-text-12">{formState.errors[name]?.message}</p>
                </div>
              ),
              ...props,
            };

          case 'switch':
            return {
              component: (
                <div key={name} className="" style={{ width: 'fit-content' }}>
                  <label className={`label ${labelClass}`}>{label}</label>
                  <Controller
                    control={control}
                    name={name}
                    render={({ field }) => (
                      <Switch
                        className={`${formState.errors[name] ? 'field-error' : ''} w-full`}
                        {...field}
                        {...props}
                      />
                    )}
                  />
                  <p className="error-text-12">{formState.errors[name]?.message}</p>
                </div>
              ),
              ...props,
            };
          default:
            return;
        }
      }
    });
  returnValue.current = {
    formInputs: formInputs(),
    formInputsWithSpan: formInputsWithSpan(),
    formValues,
    onSubmitHandler,
    reset,
    getValues,
    ...hookForm,
  };
  return {
    formInputs: formInputs(),
    formInputsWithSpan: formInputsWithSpan(),
    formValues,
    onSubmitHandler,
    reset,
    getValues,
    ...hookForm,
  };
};

export default useFormFields;
