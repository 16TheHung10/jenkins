import { DatePicker, Form, Input } from 'antd';
import Block from 'components/common/block/Block';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';
import CONSTANT from 'constant';
import React, { useCallback, useRef, useState } from 'react';

const TVNotifyActions = ({ onSetSocketAction, onOpenFormUpdateApp, selectedTVs }) => {
  const [isSyncData, setIsSyncData] = useState(false);
  const messageRef = useRef();
  const handleClickButton = (tvs, type) => {
    const message = messageRef.current?.resizableTextArea?.textArea?.value;
    if (type === 'sync_log') {
      setIsSyncData(true);
    } else {
      setIsSyncData(false);
      onSetSocketAction(tvs, type, message || {});
    }
  };

  return (
    <>
      <Block style={{ paddingBottom: 20 }}>
        <label htmlFor="message">Message</label>
        <Input.TextArea
          ref={messageRef}
          name="message"
          showCount
          maxLength={1000}
          placeholder="Enter message"
          rows={10}
        />
      </Block>
      <Block className="flex gap-10 wrap">
        <BaseButton iconName="check" onClick={() => handleClickButton(selectedTVs, 'online')}>
          Check online
        </BaseButton>
        <BaseButton iconName="check" onClick={() => handleClickButton(selectedTVs, 'version')}>
          Check version
        </BaseButton>
        <BaseButton iconName="update" onClick={() => handleClickButton(selectedTVs, 'update_data')}>
          Update data
        </BaseButton>
        <BaseButton iconName="reload" color="error" onClick={() => handleClickButton(selectedTVs, 'restart')}>
          Restart tv
        </BaseButton>
        <BaseButton iconName="sync" color="green" onClick={() => handleClickButton(selectedTVs, 'sync_log')}>
          Sync data
        </BaseButton>
        <BaseButton iconName="upload" color="green" htmlType="button" onClick={onOpenFormUpdateApp}>
          Update APK
        </BaseButton>

        {/* <BaseButton iconName="gear" color="error" onClick={() => handleClickButton(record.tvCode, 'setup')}>
            Back to Setup
          </BaseButton> */}
      </Block>
      {isSyncData && (
        <Block>
          <Form
            layout="vertical"
            onFinish={(value) => {
              onSetSocketAction(selectedTVs, 'sync_log', { syncDate: value.syncDate || null });
            }}
          >
            <Form.Item name="syncDate" rules={[{ required: true, message: 'Please input sync date' }]}>
              <DatePicker format={CONSTANT.FORMAT_DATE_IN_USE} allowClear className="w-full" />
            </Form.Item>
            <Form.Item>
              <BaseButton color="green" iconName="send" htmlType="submit">
                Submit sync data
              </BaseButton>
            </Form.Item>
          </Form>
        </Block>
      )}
    </>
  );
};

export default TVNotifyActions;
