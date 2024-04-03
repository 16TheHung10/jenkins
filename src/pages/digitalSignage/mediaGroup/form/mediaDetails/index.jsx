import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Select, message } from 'antd';
import { DigitalSignageMediaApi } from 'api';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import { useQuery } from 'react-query';
import React from 'react';
import Block from 'components/common/block/Block';

const DigitalSignageGroupMediaFormDetails = ({ form, updateGroupMediaMutation, selectedGroup }) => {
  const handleGetMediaOptions = async () => {
    const res = await DigitalSignageMediaApi.getMedias();
    if (res.status) {
      return res.data.medias?.map((item) => ({ value: item.mediaCode, label: item.mediaName }));
    } else {
      message.error(res.message);
    }
  };
  const mediaOptionsQuery = useQuery({
    queryKey: ['medias'],
    queryFn: handleGetMediaOptions,
  });
  const videoWatch = Form.useWatch('medias', form);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(value) => {
        updateGroupMediaMutation.mutate(value);
      }}
      initialValues={{ mode: '' }}
    >
      {/* VIDEO */}
      <div className="section-block">
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
              {fields.length > 10 ? null : (
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
                    <Block
                      className="mr-10"
                      style={{
                        margin: 0,
                        marginBottom: '23px',
                        height: '32px',
                        padding: '6px',
                        borderRadius: '50%',
                        width: '32px',
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      {index + 1}
                    </Block>
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
      {/* END VIDEO */}
      <BaseButton loading={updateGroupMediaMutation.isLoading} iconName="send" htmlType="submit" className="mt-15">
        {selectedGroup ? 'Update Media' : 'Create'}
      </BaseButton>
    </Form>
  );
};

export default DigitalSignageGroupMediaFormDetails;
