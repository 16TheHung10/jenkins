import React, { useContext, useEffect, useMemo, useState } from 'react';
import { DeviceContext } from 'components/mainContent/manageDevice';
import DeviceModel from 'models/DeviceModel';
import Select from 'react-select';
import StoreApi from 'api/StoreApi';
import { ArrayHelper } from 'helpers';
import { message } from 'antd';
import Icons from 'images/icons';
import OnlineOfflineStatus from 'components/common/status/OnlineOfflineStatus';
import BaseButton from 'components/common/buttons/baseButton/BaseButton';

function ResultManageDevice(props) {
  const deviceContext = useContext(DeviceContext);
  const [allChecked, setAllChecked] = useState(false);
  const [listCheck, setListCheck] = useState([]);
  const [listShow, setListShow] = useState([]);
  const [listFacePay, setListFacePay] = useState([]);
  const [countersOnline, setCountersOnline] = useState([]);
  const optionListTerminal = deviceContext.resterminalsPartner.get;
  const [type, setType] = useState('');

  const handleUpdateDevice = (index, item) => {
    const data = deviceContext.resData.get;

    // const target = deviceContext.resData.get[index];
    const result = data.filter((x) => x.name.includes(item.name));
    const target = result.shift();

    deviceContext.device.set(target.name);
    deviceContext.ipAddress.set(target.code);
    deviceContext.storeCode.set(target.storeCode);
    deviceContext.ipSettle.set(target.settle);
    deviceContext.isIdUpdate.set(target.id);

    let list = [];
    if (target.terminals === null) {
      list.push({ codeName: '', codeValue: '' });
    } else {
      for (let item in target.terminals) {
        list.push({ codeName: item, codeValue: target.terminals[item] });
      }
    }

    deviceContext.terminals.set(list);

    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    document.getElementsByName('deviceInput')[0].focus();
  };
  const handleGetCounterOnline = async () => {
    const res = await StoreApi.getCountersOnline();

    if (res.status) {
      const object = ArrayHelper.convertArrayToObject(res.data.online_usrs, 'userId');
      setCountersOnline(object);
    } else {
      message.error(res.message);
    }
    return res;
  };
  useEffect(() => {
    handleGetCounterOnline();
  }, []);
  const handleDeleteItem = (index, item) => {
    let answer = window.confirm('Please help me confirm the action "DELETE"');
    if (answer === true) {
      const data = deviceContext.resData.get;

      const result = data.filter((x) => x.code.includes(item.code));
      const target = result.shift();

      const id = target.id;

      let model = new DeviceModel();

      async function fetchData(id) {
        await model.deleteDevice(id).then((res) => {
          if (res.status) {
            getListDevice();
          }
        });
      }

      fetchData(id);
    }
  };

  const getListDevice = async () => {
    let model = new DeviceModel();
    await model.getDevice().then((res) => {
      if (res.status) {
        deviceContext.resData.set(res.data.terminals);
      }
    });
  };

  const handleChangeCheck = (e) => {
    const { name } = e.target;
    let arrCheck = [];

    if (name === 'allOption') {
      setAllChecked(!allChecked);
      for (let i = 0; i < deviceContext.resData.get.length; i++) {
        document.getElementsByName('itemOption')[i].checked = allChecked === true ? false : true;
        arrCheck.push(document.getElementsByName('itemOption')[i].value);
      }

      setListCheck(arrCheck);
    }
  };

  const handleReturnList = (list) => {
    if (!Array.isArray(list) || list.length <= 0) return;

    let resultFilter = list;

    resultFilter =
      deviceContext.device.get !== ''
        ? list.filter((x) => x.name.toLowerCase().includes(deviceContext.device.get.toLowerCase()))
        : list;

    resultFilter =
      deviceContext.ipAddress.get !== ''
        ? resultFilter.filter((x) => x.code.toLowerCase().includes(deviceContext.ipAddress.get.toLowerCase()))
        : resultFilter;

    resultFilter =
      type !== ''
        ? resultFilter.filter((x) => (x.terminals ? Object.keys(x.terminals).some((el) => el === type) : false))
        : resultFilter;

    return resultFilter;
  };

  React.useEffect(() => {
    let list = handleReturnList(deviceContext.resData.get) || [];

    setListShow(list);
  }, [deviceContext.device.get, deviceContext.ipAddress.get, deviceContext.resData.get, type]);

  React.useEffect(() => {
    let lst = deviceContext.resFacePay.get || [];

    setListFacePay(lst);
  }, [deviceContext.resFacePay.get]);

  const handleCheckConnectFacePay = (key, id) => {
    if (key === 'facepay') {
      if (deviceContext.resFacePay.get && deviceContext.resFacePay.get.length > 0) {
        let target = deviceContext.resFacePay.get.find((element) => id === element.id);

        if (target) {
          if (target.status === 'Online' || target.status === 'Offline') {
            return target.status;
          }
        } else {
          return 'Unknow';
        }
      }
    } else {
      return '';
    }
  };

  const hanldeChangeInputSelect = (e, index) => {
    e && e.value ? setType(e.value) : setType('');

    let list = handleReturnList(listShow) || [];

    setListShow(list);
  };

  return (
    <section className="section-block mt-15 mb-15">
      <div className="row">
        <div className="col-md-3">
          <div className="form-group">
            <label className="w100pc">Filter E-payment:</label>

            <Select
              // ref={(ref) => (itemsStoreRef.current[0] = ref)}
              name="type"
              placeholder="Enter Type"
              isClearable
              classNamePrefix="select"
              value={optionListTerminal.filter((el) => el.value === type)}
              options={optionListTerminal}
              onChange={(e) => hanldeChangeInputSelect(e)}
            />
          </div>
        </div>
      </div>
      <div className="wrap-table htable " style={{ maxHeight: 'calc(100vh - 446px)' }}>
        <table
          className={'table table-hover d-block of-auto w-fit' + (listShow.length > 0 ? 'mH-250' : '')}
          style={{ maxHeight: 'calc(100vh - 257px)' }}
        >
          <thead>
            <tr>
              <th>STT</th>
              <th>Name</th>
              <th>Code</th>
              <th>Terminals</th>
              <th>StoreCode</th>
              <th>Settle</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {listShow.map((item, index) => (
              <tr key={index} onDoubleClick={() => handleUpdateDevice(index, item)} className="cursor_pointer">
                <td>{index + 1}</td>
                <td>
                  <div className="flex items-center-gap-10">
                    <span>
                      {countersOnline?.[item.name] ? (
                        <OnlineOfflineStatus type="online" />
                      ) : (
                        <OnlineOfflineStatus type="offline" />
                      )}
                    </span>
                    <span>{item.name}</span>
                  </div>
                </td>
                <td>{item.code}</td>
                <td>
                  {item.terminals !== null && Object.keys(item.terminals).length > 0
                    ? Object.keys(item.terminals).map((item2, index2) => (
                        <span
                          className={
                            'terminalsDevice ' +
                            (item2 === 'facepay' ? handleCheckConnectFacePay(item2, item.terminals[item2]) : '')
                          }
                          key={index2}
                        >
                          [ {item2} - {item.terminals[item2]}{' '}
                          {item2 === 'facepay' && ' - ' + handleCheckConnectFacePay(item2, item.terminals[item2])} ]
                        </span>
                      ))
                    : null}
                </td>
                <td>{item.storeCode}</td>
                <td>{item.settle}</td>
                <td>
                  <BaseButton
                    iconName={'delete'}
                    color="error"
                    onClick={() => handleDeleteItem(index, item)}
                  ></BaseButton>
                </td>
              </tr>
            )) ?? null}
          </tbody>
        </table>
        {listShow.length === 0 ? <div className="table-message">Item not found</div> : null}
      </div>
    </section>
  );
}

export default React.memo(ResultManageDevice);
