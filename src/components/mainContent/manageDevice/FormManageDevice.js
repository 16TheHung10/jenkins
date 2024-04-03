import React, { useContext, useMemo, useRef } from 'react';

import Terminals from 'components/mainContent/manageDevice/Terminals';
import DeviceInput from 'components/mainContent/manageDevice/DeviceInput';
import AddressInput from 'components/mainContent/manageDevice/AddressInput';
import SettleInput from 'components/mainContent/manageDevice/SettleInput';
import StoreInput from 'components/mainContent/manageDevice/StoreInput';
import { AlertHelper } from 'helpers';
import DeviceModel from 'models/DeviceModel';

import { DeviceContext } from 'components/mainContent/manageDevice';
import { arrayToObject } from 'helpers/ConvertType';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';

function FormManageDevice(props) {
  const deviceContext = useContext(DeviceContext);

  const refTerminal = useRef();
  const refStore = useRef();

  const isIdUpdate = deviceContext.isIdUpdate.get;

  const showAlert = (msg, type = 'error') => {
    AlertHelper.showAlert(msg, type);
  };

  const resetForm = () => {
    deviceContext.device.set('');
    deviceContext.ipAddress.set('');
    deviceContext.ipSettle.set('');
    deviceContext.storeCode.set('');
    deviceContext.terminals.set([{ codeName: '', codeValue: '' }]);

    deviceContext.isIdUpdate.set('');
  };

  const handleAddDevice = () => {
    if (deviceContext.device.get === '') {
      showAlert('Please input device');
      document.getElementsByName('deviceInput')[0].focus();
      return;
    }

    if (deviceContext.ipAddress.get === '') {
      showAlert('Please input IP address');
      document.getElementsByName('ipAddressInput')[0].focus();
      return;
    }

    const list = deviceContext.terminals.get;

    for (let i = 0; i < list.length; i++) {
      if (list[i].codeValue !== '' && list[i].codeName === '') {
        refTerminal.current.hanldeFocusSelect(i);
        showAlert('Please add code to terminals');
        return;
      }

      if (list[i].codeName !== '' && list[i].codeValue === '') {
        document.getElementsByName('codeValue')[i].focus();
        showAlert('Please add value to terminals');
        return;
      }
    }

    const newList = arrayToObject(list, 'codeName', 'codeValue') || '';

    const params = {
      Code: deviceContext.ipAddress.get,
      Name: deviceContext.device.get,
      Settle: deviceContext.ipSettle.get,
      StoreCode: deviceContext.storeCode.get,
      Terminals: newList,
    };

    isIdUpdate === '' ? addDevice(params) : updateDevice(isIdUpdate, params);
  };

  const addDevice = async (params) => {
    let answer = window.confirm('Please help me confirm the action "ADD"');
    if (answer === true) {
      let model = new DeviceModel();
      await model.insertDevice(params).then((res) => {
        if (res.status) {
          showAlert(res.message, 'success');
          getListDevice();
          resetForm();
        } else {
          showAlert(res.message);
        }
      });
    }
  };

  const updateDevice = async (id, params) => {
    let answer = window.confirm('Please help me confirm the action "UPDATE"');

    if (answer === true) {
      let model = new DeviceModel();
      await model.updateDevice(id, params).then((res) => {
        if (res.status) {
          showAlert(res.message, 'success');
          getListDevice();
          resetForm();
        } else {
          showAlert(res.message);
        }
      });
    }
  };

  const handleCancel = () => {
    resetForm();
  };

  const getListDevice = async () => {
    let model = new DeviceModel();
    await model.getDevice().then((res) => {
      if (res.status) {
        deviceContext.resData.set(res.data.terminals);
      }
    });
  };

  const bodyContent = useMemo(() => {
    return (
      <div className="section-block mt-15">
        <div className="form-filter">
          <div className="row">
            <div className="col-md-12">
              <div className="row">
                <div className="col-md-3">
                  <DeviceInput />
                </div>
                <div className="col-md-3">
                  <AddressInput />
                </div>
                <div className="col-md-3">
                  <SettleInput />
                </div>
                <div className="col-md-3">
                  <label htmlFor=""></label>
                  <div className="form-group flex items-start gap-10 m-0">
                    <BaseButton onClick={handleAddDevice}>{isIdUpdate === '' ? 'Add' : 'Update'}</BaseButton>
                    {isIdUpdate !== '' && (
                      <BaseButton iconName="clear" onClick={handleCancel} className="btn btn-success">
                        Cancel
                      </BaseButton>
                    )}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <StoreInput ref={refStore} />
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <Terminals ref={refTerminal} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }, [
    deviceContext.device.get,
    deviceContext.ipAddress.get,
    deviceContext.ipSettle.get,
    deviceContext.terminals.get,
    deviceContext.isIdUpdate.get,
    deviceContext.storeCode.get,
  ]);

  return bodyContent;
}

export default React.memo(FormManageDevice);
