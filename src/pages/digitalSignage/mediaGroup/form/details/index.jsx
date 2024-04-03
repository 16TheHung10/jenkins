import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, Select, TimePicker, message } from 'antd';
import Block from 'components/common/block/Block';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import CONSTANT from 'constant';
import { ArrayHelper } from 'helpers';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import useMediaOptionsQuery from 'pages/digitalSignage/mediaGroup/hooks/useMediaOptionsQuery';
import useTVTypesQuery from 'pages/digitalSignage/tv/hooks/useTVTypesQuery';
import SelectFormField from 'components/common/selects/SelectFormField';
import WarningNote from 'components/common/warningNote/WarningNote';

const DigitalSignageGroupFormDetails = ({ form, groupMutation, updateGroupMutation, selectedGroup }) => {
  const storeOptions = useMemo(() => {
    const cachedDataJson = localStorage.getItem('cachedData');
    if (cachedDataJson) {
      const stores = JSON.parse(cachedDataJson).data?.stores;
      return Object.keys(stores).map((storeCode) => {
        return { value: storeCode, label: `${storeCode} - ${stores[storeCode]?.storeName}` };
      });
    }
    return [];
  }, []);
  const mediaOptionsQuery = useMediaOptionsQuery();
  const tvTypesQuery = useTVTypesQuery();
  const typeOptions = useMemo(() => {
    return (
      tvTypesQuery.data?.map((item) => {
        return { value: item.typeCode, label: item.typeName };
      }) || []
    );
  }, [tvTypesQuery.data]);
  const [disabledHours, setDisabledHours] = useState([]);

  const timesWatched = Form.useWatch('times', form);
  const modeWatched = Form.useWatch('mode', form);
  const timesFormated = useMemo(() => {
    return timesWatched?.map((item) => {
      return item?.frame ? [moment(item.frame[0]).format('HH:mm'), moment(item.frame[1]).format('HH:mm')] : null;
    });
  }, [timesWatched]);
  const disabledHoursRange = (current) => {
    const res = [];
    for (let item of timesFormated || []) {
      if (item) {
        const start = moment(item[0], 'HH:mm').hours();
        const end = moment(item[1], 'HH:mm').hours();
        const range = ArrayHelper.fromRange(start, end);
        res.push(...range);
      }
    }
    setDisabledHours(res.sort((a, b) => a - b));
  };
  useEffect(() => {
    disabledHoursRange();
  }, [timesFormated]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(value) => {
        selectedGroup ? updateGroupMutation.mutate(value) : groupMutation.mutate(value);
      }}
      initialValues={{ mode: 'SCHEDULE' }}
    >
      <Block>
        <Form.Item
          className="w-full"
          name="groupName"
          label="Group name"
          rules={[{ type: 'string', required: true, message: 'Group name is required' }]}
        >
          <Input placeholder="Group name" />
        </Form.Item>
        <Form.Item
          className="w-full"
          name="groupType"
          label="Group type"
          rules={[{ type: 'string', required: true, message: 'Group type is required' }]}
        >
          <Select placeholder="Group type" options={typeOptions} />
        </Form.Item>

        <Form.Item
          className="w-full"
          name="stores"
          label={
            <div className="flex items-center">
              <span>Apply store</span>{' '}
              <WarningNote>
                <span>
                  Sẽ apply những TV với type là type của group này, những store không không có TV thỏa điều kiện sẽ
                  không được apply
                </span>
              </WarningNote>
            </div>
          }
          // rules={[{ type: 'array', required: true, message: 'Store is required' }]}
        >
          <SelectFormField placeholder="Apply store" options={storeOptions} mode="multiple" />
        </Form.Item>
      </Block>
      <Block>
        <Form.Item
          className="w-full"
          name="mode"
          label="Mode"
          rules={[{ type: 'string', required: true, message: 'Group mode is required' }]}
        >
          <Select
            placeholder="Mode"
            options={[
              { value: 'NORMAL', label: 'Schedule' },
              { value: 'REPEAT', label: 'Repeat' },
            ]}
          />
        </Form.Item>
      </Block>
      {/* VIDEO */}
      {selectedGroup ? null : (
        <div className="section-block mt-15">
          <div id="videos"></div>
          <Form.List
            name="medias"
            rules={[
              {
                validator: (_, value) => {
                  if (!value || value.length === 0) {
                    message.error('Please add at least one video');
                    return Promise.reject('Please add at least one video');
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            {(fields, { add, remove }) => (
              <>
                {fields.length > 4 ? null : (
                  <Form.Item style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                    <Button
                      style={{ width: '100%' }}
                      type="primary"
                      onClick={() => {
                        const container = document.getElementById('videos');
                        container.scroll({ top: 0, behavior: 'smooth' });
                        add(null, 0);
                      }}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add video
                    </Button>
                  </Form.Item>
                )}
                {fields.map(({ key, name, ...restField }, index) => (
                  <div
                    key={key}
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: 10,
                      marginBottom: 8,
                    }}
                  >
                    <div className="flex flex-1 gap-10 items-center">
                      <Form.Item
                        style={{
                          flex: 2,
                        }}
                        {...restField}
                        name={[name, 'mediaCode']}
                        rules={[
                          {
                            required: true,
                            message: 'Missing media',
                          },
                        ]}
                      >
                        {/* <Slider range min={0} max={24} tooltip={{ open: true }} /> */}
                        <Select
                          placeholder="Select video"
                          loading={mediaOptionsQuery.isLoading}
                          options={mediaOptionsQuery.data || []}
                        />
                      </Form.Item>
                    </div>

                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </div>
                ))}
              </>
            )}
          </Form.List>
        </div>
      )}

      {/* END VIDEO */}
      {/* APPLY DATE */}
      <div id="timeFrame"></div>
      <Block className="flex flex-col flex-1 gap-10 items-center flex-1">
        {modeWatched === 'REPEAT' ? null : (
          <Form.Item
            className="w-full"
            name="applyDates"
            label="Apply date"
            rules={[{ type: 'array', required: true, message: 'Apply date is required' }]}
          >
            <DatePicker.RangePicker
              format={CONSTANT.FORMAT_DATE_IN_USE}
              className="w-full"
              allowClear
              disabledDate={(current) => {
                return current && current < moment().startOf('date');
              }}
            />
          </Form.Item>
        )}

        <Form.List
          name="times"
          rules={[
            {
              validator: (_, value) => {
                if (!value || value.length === 0) {
                  message.error('Please add at least one time frame');
                  return Promise.reject('Please add at least one time frame');
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          {(fieldsTimeFrame, { add: addTimeFrame, remove: removeTimeFrame }) => (
            <>
              {fieldsTimeFrame.length > 4 ? null : (
                <Form.Item style={{ position: 'sticky', top: 0, zIndex: 10, width: '100%' }}>
                  <Button
                    style={{ width: '100%' }}
                    type="primary"
                    onClick={() => {
                      const container = document.getElementById('timeFrame');
                      container.scroll({ top: 0, behavior: 'smooth' });
                      addTimeFrame(null, 0);
                    }}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add time frame
                  </Button>
                </Form.Item>
              )}
              {/* {fieldsTimeFrame?.length > 1 && <p className="cl-red">Overlapping time periods will be combined</p>} */}
              {fieldsTimeFrame.map(({ key, name, ...restField }, index) => {
                return (
                  <div
                    key={key}
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: 10,
                      marginBottom: 8,
                      width: '100%',
                    }}
                  >
                    <div className="flex flex-1 gap-10 items-center">
                      <Form.Item
                        style={{
                          flex: 1,
                        }}
                        {...restField}
                        name={[name, 'frame']}
                        rules={[
                          {
                            required: true,
                            message: 'Missing time frame',
                          },
                        ]}
                      >
                        {/* <Slider range min={0} max={24} tooltip={{ open: true }} /> */}
                        <TimePicker.RangePicker
                          inputReadOnly
                          format="HH:mm"
                          className="w-full"
                          hideDisabledOptions
                          disabledTime={(current) => {
                            return {
                              disabledHours: () => disabledHours || [],
                              disabledMinutes: () => {
                                const minutes = [];
                                for (let i = 0; i < 60; i++) {
                                  if (i % 15 !== 0 && i !== 59) {
                                    minutes.push(i);
                                  }
                                }
                                return disabledHours?.length === 24 ? ArrayHelper.fromRange(0, 60) : minutes;
                              },
                            };
                          }}
                        />
                      </Form.Item>
                    </div>

                    <MinusCircleOutlined onClick={() => removeTimeFrame(name)} />
                  </div>
                );
              })}
            </>
          )}
        </Form.List>
      </Block>

      {/* END APPLY DATE */}
      <BaseButton
        loading={groupMutation.isLoading || updateGroupMutation.isLoading}
        iconName="send"
        htmlType="submit"
        className="mt-15"
      >
        {selectedGroup ? 'Update' : 'Create'}
      </BaseButton>
    </Form>
  );
};

export default DigitalSignageGroupFormDetails;
