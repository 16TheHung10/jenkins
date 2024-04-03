import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Select, message } from 'antd';
import Block from 'components/common/block/Block';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import useGroupQuery from 'pages/digitalSignage/mediaGroup/hooks/useGroupQuery';
import useMediaOptionsQuery from 'pages/digitalSignage/mediaGroup/hooks/useMediaOptionsQuery';
import useTVTypesQuery from 'pages/digitalSignage/tv/hooks/useTVTypesQuery';
import React, { useMemo } from 'react';
const { RangePicker } = DatePicker;

const DigitalSignageTVFormGroupDetails = ({ form, addGroupMutation, tvData }) => {
  const groupsQuery = useGroupQuery({ searchParams: {} });
  const typeQuery = useTVTypesQuery();
  const mediaOptionsQuery = useMediaOptionsQuery();
  const selectedGroupsWatch = Form.useWatch('groupMedias', form);
  console.log({ selectedGroupsWatch });
  const groupOptions = useMemo(() => {
    return (
      Object.values(groupsQuery.data || {})
        ?.filter((el) => el.groupType === '006' || el.groupType === tvData.tvType)
        ?.map((item) => {
          return {
            value: item.groupCode,
            label: `${typeQuery.data?.find((el) => el.typeCode === item.groupType)?.typeName} - ${item.groupCode} - ${
              item.groupName
            }`,
          };
        }) || []
    );
  }, [groupsQuery.data, typeQuery.data]);
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={async (value) => {
        addGroupMutation.mutate(value);
      }}
    >
      <Block style={{ margin: 0 }}>
        <Form.Item
          style={{
            flex: 2,
          }}
          name={'defaultMedia'}
          label="Default Media"
          rules={[
            {
              required: true,
              message: 'Missing default media',
            },
          ]}
        >
          {/* <Slider range min={0} max={24} tooltip={{ open: true }} /> */}
          <Select
            placeholder="Select default media"
            options={mediaOptionsQuery.data || []}
            loading={mediaOptionsQuery.isLoading}
          />
        </Form.Item>
      </Block>
      <Block>
        <div id="group"></div>
        <Form.List
          name="groupMedias"
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
                      const container = document.getElementById('group');
                      container.scroll({ top: 0, behavior: 'smooth' });
                      add(null, 0);
                    }}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add group
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
                      name={[name, 'groupCode']}
                      rules={[
                        {
                          required: true,
                          message: 'Missing time media',
                        },
                      ]}
                    >
                      {/* <Slider range min={0} max={24} tooltip={{ open: true }} /> */}
                      <Select placeholder="Select group" loading={groupsQuery.isLoading} options={groupOptions} />
                    </Form.Item>
                  </div>

                  <MinusCircleOutlined onClick={() => remove(name)} />
                </div>
              ))}
            </>
          )}
        </Form.List>
      </Block>
      <BaseButton iconName="send" htmlType="submit" className="mt-15" loading={addGroupMutation.isLoading}>
        Update
      </BaseButton>
    </Form>
  );
};

export default DigitalSignageTVFormGroupDetails;
