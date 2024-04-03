import { Col, Row, Tag, Typography, message } from 'antd'
import React, { useState } from 'react'
import SelectboxAndCheckbox from 'utils/selectboxAndCheckbox';
import ReActiveMemberOverview from '../chart/ReActiveMemberOverview';
import { fetchData } from 'helpers/FetchData';
import { FileSearchOutlined } from '@ant-design/icons';
import TableCustom from 'utils/tableCustom';
import { createDataTable, createListOption, cloneDeep } from 'helpers/FuncHelper';
import DateHelper from 'helpers/DateHelper';
const { Title } = Typography;

export default function ReActiveMember({ ...props }) {
  const [isLoading, setIsLoading] = useState(false);
  const [backAfterDays, setBackAfterDays] = useState('');
  const [phoneClean, setPhoneClean] = useState('');
  const [member, setMember] = useState('');
  const [dataTable, setDataTable] = useState([]);
  const [memberOpt, setMemberOpt] = useState([]);
  const [phoneOpt, setPhoneOpt] = useState([]);
  const [backAfterOpt, setBackAfterOpt] = useState([
    // { value: 1, label: '1 day', },
    // { value: 2, label: '2 days', },
    // { value: 3, label: '3 days', },
    { value: 7, label: '7 days', },
    { value: 14, label: '14 days', }
  ]);
  const [dataReActiveMember, setDataReActiveMember] = useState([
    {
      "title": "Re-active member back after 1 day(s)",
      "key": "1",
      "value": 7210.0
    },
    {
      "title": "Re-active member back after 2 day(s)",
      "key": "2",
      "value": 12504.0
    },
    {
      "title": "Re-active member back after 3 day(s)",
      "key": "3",
      "value": 17208.0
    },
    {
      "title": "Re-active member back after 7 day(s)",
      "key": "7",
      "value": 31801.0
    },
    {
      "title": "Re-active member back after 14 day(s)",
      "key": "14",
      "value": 48653.0
    }
  ]);

  const handleIsLoading = () => {
    setIsLoading(true);
    setDataTable([]);
  }

  const handleSearchTopMember = async () => {
    if (backAfterDays === '') {
      message.warning('Please choose date');
      return false;
    }

    const params = {
      // backDay: backAfterDays,
      top: 0,
      limit: 200
    }

    if (backAfterDays == '7') {
      params.fromDay = '7';
      params.toDay = '13';
    }
    else if (backAfterDays == '14') {
      params.fromDay = '14';
      params.toDay = '14';
    }

    try {
      handleIsLoading();
      const url = `/loyalty/member/reactive`;
      const response = await fetchData(url, 'GET', params, null, process.env.REACT_APP_ANALYTIC_REPORT_ROOT_URL);
      if (response?.status) {
        setDataTable(response?.data?.loyalty)
        const memberOpt = createListOption(response?.data?.loyalty, 'memberCode');
        const phoneOpt = createListOption(response?.data?.loyalty, 'phoneClean');
        setMemberOpt(memberOpt)
        setPhoneOpt(phoneOpt)
        if (response?.data?.loyalty.length == 0) {
          message.warning('Data not found');
        }
      }
      else {
        message.error(response?.message);
      }

    } catch (error) {
      console.error('Error fetching data: ', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleFilter = (arr) => {
    let old = cloneDeep(arr);
    let newArr = [];

    newArr = member !== '' ? old.filter(el => el.memberCode == member) : old;
    newArr = phoneClean !== '' ? newArr.filter(el => el.phoneClean == phoneClean) : newArr;

    return newArr;
  }

  const bodyContent = () => {
    const items = handleFilter(dataTable);

    const columns = [
      { field: 'memberCode', label: 'Member code', classHead: 'fs-10', classBody: 'fs-10' },
      { field: 'firstName', label: 'First name', classHead: 'fs-10', classBody: 'fs-10' },
      { field: 'lastName', label: 'Last name', classHead: 'fs-10', classBody: 'fs-10' },
      { field: 'phoneClean', label: 'Phone clean', classHead: 'fs-10', classBody: 'fs-10' },
      { field: 'IDNo', label: 'IDNo', classHead: 'fs-10', classBody: 'fs-10', notShow: true, colSpanHead: 0, colSpanBody: 0, },
      { field: 'email', label: 'Eemail', classHead: 'fs-10', classBody: 'fs-10', notShow: true, colSpanHead: 0, colSpanBody: 0, },
      { field: 'gender', label: 'Gender', classHead: 'fs-10', classBody: 'fs-10' },
      // { field: 'birthDate', label: 'Birthdate', classHead: 'fs-10', classBody: 'fs-10', notShow: true, colSpanHead: 0, colSpanBody: 0, },
      // { field: 'cityID', label: 'cityID', classHead: 'fs-10', classBody: 'fs-10', notShow: true, colSpanHead: 0, colSpanBody: 0, },
      // { field: 'districtID', label: 'districtID', classHead: 'fs-10', classBody: 'fs-10', notShow: true, colSpanHead: 0, colSpanBody: 0, },
      // { field: 'passport', label: 'Passport', classHead: 'fs-10', classBody: 'fs-10', notShow: true, colSpanHead: 0, colSpanBody: 0, },
      // { field: 'address', label: 'Address', classHead: 'fs-10', classBody: 'fs-10' },
      // { field: 'registerDate', label: 'RegisterDate', classHead: 'fs-10', classBody: 'fs-10', formatBody: val => DateHelper.displayDateTime24HM(val) },
      // { field: 'point', label: 'Point', classHead: 'fs-10', classBody: 'fs-10' },
      { field: 'lastPurchaseDate', label: 'Last date', classHead: 'fs-10', classBody: 'fs-10', formatBody: val => DateHelper.displayDateTime24HM(val) },
      { field: 'latestInvoiceCode', label: 'Last invoice code', classHead: 'fs-10', classBody: 'fs-10' },
      // { field: 'rewardPoint', label: 'Reward point', classHead: 'fs-10 text-right', classBody: 'fs-10 text-right', isSort: true, keySort: 'rewardPoint' },
      // { field: 'rewardTransactionPoint', label: 'Reward transaction point', classHead: 'fs-10 text-right', classBody: 'fs-10 text-right', isSort: true, keySort: 'rewardTransactionPoint' },
      { field: 'latestTransactionPoint', label: 'Last transaction point', classHead: 'fs-10 text-right', classBody: 'fs-10 text-right', isSort: true, keySort: 'transactionPoint' },
      // { field: 'usedPoint', label: 'Used point', classHead: 'fs-10 text-right', classBody: 'fs-10 text-right', isSort: true, keySort: 'usedPoint' },
    ];
    const data = createDataTable(items, columns);



    return (
      <>
        <Row gutter={16}>
          <Col xl={24}>
            <Title level={4}>Re-active member</Title>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xl={12}>
            <ReActiveMemberOverview data={props.data} />
          </Col>
          <Col xl={12}>
            <Row gutter={16}>
              <Col xl={16}>
                <label htmlFor="bookingStatus" className="w100pc">
                  History (days):
                  <SelectboxAndCheckbox data={backAfterOpt} funcCallback={(val) => setBackAfterDays(val)} keyField={'backAfterDays'} defaultValue={backAfterDays} isMode={''} />
                </label>
              </Col>
              <Col xl={6}>
                <label htmlFor="" className="w100pc op-0">&nbsp;</label>
                <Tag className="h-30 icon-search" onClick={handleSearchTopMember}>
                  <FileSearchOutlined /> <span className="icon-search-detail">Search</span>
                </Tag>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xl={12}>
                <label htmlFor="member" className="w100pc">
                  Member:
                  <SelectboxAndCheckbox data={memberOpt} funcCallback={(val) => setMember(val)} keyField={'member'} defaultValue={member} isMode={''} />
                </label>
              </Col>
              <Col xl={12}>
                <label htmlFor="phoneClean" className="w100pc">
                  Phone:
                  <SelectboxAndCheckbox data={phoneOpt} funcCallback={(val) => setPhoneClean(val)} keyField={'phoneClean'} defaultValue={phoneClean} isMode={''} />
                </label>
              </Col>

            </Row>
            <Row gutter={16} className='mrt-10'>
              <Col xl={24}>
                <TableCustom data={data} columns={columns} isLoading={isLoading} />
              </Col>
            </Row>
          </Col>
        </Row>
      </>
    )
  }

  return <>{bodyContent()}</>
}
