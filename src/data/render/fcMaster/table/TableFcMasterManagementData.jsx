import moment from 'moment';
import { StringHelper } from 'helpers';
import { Link } from 'react-router-dom';
import Icons from 'images/icons';
import React from 'react';
import { Tag } from 'antd';
const TableFcMasterManagementData = {
  columns: (isImport) => {
    const cols = [
      {
        title: 'GS25Store',
        dataIndex: 'gS25Store',
        key: 'gS25Store',
        width: 80,
        render: (text) => text || ' - ',
        fixed: 'left',
      },
      {
        title: 'FC.Store',
        dataIndex: 'franchiseStore',
        key: 'franchiseStore',
        width: 60,
        render: (text) => text || ' - ',
        fixed: 'left',
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'Area',
        dataIndex: 'area',
        key: 'area',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'District',
        dataIndex: 'district',
        key: 'district',
        width: 50,
        render: (text) => text || ' - ',
      },
      {
        title: 'StartDay',
        dataIndex: 'startDay',
        key: 'startDay',
        width: 100,
        render: (text) => (text ? moment(text).format('DD/MM/YYYY') : ' - '),
      },
      {
        title: 'Open.FC',
        dataIndex: 'openFranchise',
        key: 'openFranchise',
        width: 80,
        render: (text) => (text ? moment(text).format('DD/MM/YYYY') : ' - '),
      },
      {
        title: 'Year Open',
        dataIndex: 'yearOpen',
        key: 'yearOpen',
        width: 50,
        render: (text) => text || ' - ',
      },
      {
        title: 'End Franchise',
        dataIndex: 'endFranchise',
        key: 'endFranchise',
        width: 80,
        render: (text) => (text ? moment(text).format('DD/MM/YYYY') : ' - '),
      },
      {
        title: 'Year End',
        dataIndex: 'yearEnd',
        key: 'yearEnd',
        width: 50,
        render: (text) => text || ' - ',
      },
      {
        title: 'Address Store',
        dataIndex: 'addressStore',
        key: 'addressStore',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'Company',
        dataIndex: 'company',
        key: 'company',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'TaxCode',
        dataIndex: 'taxCode',
        key: 'taxCode',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'Address Company',
        dataIndex: 'addressCompany',
        key: 'addressCompany',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'Represent',
        dataIndex: 'represent',
        key: 'represent',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'ContractPeriod',
        dataIndex: 'contractPeriod',
        key: 'contractPeriod',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'RemainPeriod',
        dataIndex: 'remainPeriod',
        key: 'remainPeriod',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'FC',
        dataIndex: 'fc',
        key: 'fc',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'ADS 3 month before Handover',
        dataIndex: 'adS3Month',
        width: 100,
        key: 'adS3Month',
        render: (text) => (text ? StringHelper.formatPrice(text) : ' - '),
      },
      {
        title: 'Acreage',
        dataIndex: 'acreage',
        key: 'acreage',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'RentalFee',
        dataIndex: 'rentalFee',
        key: 'rentalFee',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'Deposit',
        dataIndex: 'deposit',
        key: 'deposit',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'EnterFee',
        dataIndex: 'enterFee',
        key: 'enterFee',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'Electricity Support',
        dataIndex: 'electricitySupport',
        key: 'electricitySupport',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'Disposal Support',
        dataIndex: 'disposalSupport',
        key: 'disposalSupport',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'Operation Support',
        dataIndex: 'operationSupport',
        key: 'operationSupport',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'Accounting Support',
        dataIndex: 'accountingSupport',
        key: 'accountingSupport',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'Promotion Support',
        dataIndex: 'promotionSupport',
        key: 'promotionSupport',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'Sharing Othe Revenue',
        dataIndex: 'sharingOtherRevenue',
        key: 'sharingOtherRevenuewidth: 100,',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'Companyion Support',
        dataIndex: 'companyionSupport',
        key: 'companyionSupport',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'Remuneration Support',
        dataIndex: 'remunerationSupport',
        key: 'remunerationSupport',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'Special Support',
        dataIndex: 'specialSupport',
        key: 'specialSupport',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'Fix Support',
        dataIndex: 'fixSupport',
        key: 'fixSupport',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'Labor Support',
        dataIndex: 'laborSupport',
        key: 'laborSupport',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'ServiceFee Support',
        dataIndex: 'serviceFeeSupport',
        key: 'serviceFeeSupport',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'Note',
        dataIndex: 'note',
        key: 'note',
        width: 100,
        render: (text) => text || ' - ',
      },
      // {
      //   title: 'Status',
      //   dataIndex: 'status',
      //   key: 'status',
      //   width: 100,
      //   fixed: 'right',
      //   render: (text) => (text === 'Terminated' ? <Tag color="red">Terminated</Tag> : null),
      // },
    ];
    if (!isImport) {
      cols.push({
        title: '',
        dataIndex: '',
        key: '',
        fixed: 'right',
        width: 30,
        render: (text, record) => {
          return (
            <Link to={`fc-master/details/${record.taxCode}`}>
              <Icons.Search />
            </Link>
          );
        },
      });
    }
    return cols;
  },
  columnsSearch: (isImport) => {
    const cols = [
      {
        title: 'GS25Store',
        dataIndex: 'gS25Store',
        key: 'gS25Store',
        width: 80,
        render: (text) => text || ' - ',
        fixed: 'left',
      },
      {
        title: 'FC.Store',
        dataIndex: 'franchiseStore',
        key: 'franchiseStore',
        width: 60,
        render: (text) => text || ' - ',
        fixed: 'left',
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'Area',
        dataIndex: 'area',
        key: 'area',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'District',
        dataIndex: 'district',
        key: 'district',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'StartDay',
        dataIndex: 'startDay',
        key: 'startDay',
        width: 80,
        render: (text) => (text ? moment(text).format('DD/MM/YYYY') : ' - '),
      },
      {
        title: 'Open.FC',
        dataIndex: 'openFranchise',
        key: 'openFranchise',
        width: 80,
        render: (text) => (text ? moment(text).format('DD/MM/YYYY') : ' - '),
      },
      {
        title: 'Year Open',
        dataIndex: 'yearOpen',
        key: 'yearOpen',
        width: 50,
        render: (text) => text || ' - ',
      },
      {
        title: 'End Franchise',
        dataIndex: 'endFranchise',
        key: 'endFranchise',
        width: 80,
        render: (text) => (text ? moment(text).format('DD/MM/YYYY') : ' - '),
      },
      {
        title: 'Year End',
        dataIndex: 'yearEnd',
        key: 'yearEnd',
        width: 50,
        render: (text) => text || ' - ',
      },
      {
        title: 'Company',
        dataIndex: 'company',
        key: 'company',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'TaxCode',
        dataIndex: 'taxCode',
        key: 'taxCode',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'Represent',
        dataIndex: 'represent',
        key: 'represent',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'ContractPeriod',
        dataIndex: 'contractPeriod',
        key: 'contractPeriod',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'RemainPeriod',
        dataIndex: 'remainPeriod',
        key: 'remainPeriod',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        width: 50,
        render: (text) => text || ' - ',
      },
      {
        title: 'FC',
        dataIndex: 'fc',
        key: 'fc',
        width: 60,
        render: (text) => text || ' - ',
      },
      {
        title: 'ADS 3 month before Handover',
        dataIndex: 'adS3Month',
        width: 100,
        key: 'adS3Month',
        render: (text) => (text !== null && text !== undefined ? StringHelper.formatPrice(text) : ' - '),
      },
      {
        title: 'Acreage',
        dataIndex: 'acreage',
        key: 'acreage',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'RentalFee',
        dataIndex: 'rentalFee',
        key: 'rentalFee',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'Deposit',
        dataIndex: 'deposit',
        key: 'deposit',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'EnterFee',
        dataIndex: 'enterFee',
        key: 'enterFee',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'Electricity Support',
        dataIndex: 'electricitySupport',
        key: 'electricitySupport',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'Disposal Support',
        dataIndex: 'disposalSupport',
        key: 'disposalSupport',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'Operation Support',
        dataIndex: 'operationSupport',
        key: 'operationSupport',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'Accounting Support',
        dataIndex: 'accountingSupport',
        key: 'accountingSupport',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'Promotion Support',
        dataIndex: 'promotionSupport',
        key: 'promotionSupport',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'Sharing Othe Revenue',
        dataIndex: 'sharingOtherRevenue',
        key: 'sharingOtherRevenuewidth: 100,',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'Companyion Support',
        dataIndex: 'companyionSupport',
        key: 'companyionSupport',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'Special Support',
        dataIndex: 'specialSupport',
        key: 'specialSupport',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'Fix Support',
        dataIndex: 'fixSupport',
        key: 'fixSupport',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'Labor Support',
        dataIndex: 'laborSupport',
        key: 'laborSupport',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'ServiceFee Support',
        dataIndex: 'serviceFeeSupport',
        key: 'serviceFeeSupport',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'Note',
        dataIndex: 'note',
        key: 'note',
        width: 100,
        render: (text) => text || ' - ',
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: 90,
        fixed: 'right',
        render: (text) => (text === 'Terminated' ? <Tag color="red">Terminated</Tag> : null),
      },
    ];
    if (!isImport) {
      cols.push({
        title: '',
        dataIndex: '',
        key: '',
        fixed: 'right',
        width: 30,
        render: (text, record) => {
          return (
            <Link to={`fc-master/details/${record.taxCode}/${record.franchiseStore}`}>
              <Icons.Search />
            </Link>
          );
        },
        onCell: () => {
          return {
            style: {
              textAlign: 'center',
            },
          };
        },
      });
    }
    return cols;
  },
};

export default TableFcMasterManagementData;
