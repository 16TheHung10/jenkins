import React, { useEffect, useMemo, useState } from "react";
import { fetchData } from "helpers/FetchData";
import { Col, Row, Tag, message } from "antd";
import { createDataTable, cloneDeep } from "helpers/FuncHelper";
import DrawerComp from "utils/drawer";
import TableCustom from "utils/tableCustom";
import {
  ExpandAltOutlined,
  FileExcelOutlined,
  FolderViewOutlined,
  UserOutlined,
} from "@ant-design/icons";
import DateHelper from "helpers/DateHelper";
import StringHelper from "helpers/StringHelper";
import { handleExportAutoField } from "helpers/ExportHelper";

const TableGamePromotion = ({ ...props }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMember, setIsLoadingMember] = useState(true);

  const [isOpenDrawerInfo, setIsOpenDrawerInfo] = useState(false);
  const [isOpenDrawerMember, setIsOpenDrawerMember] = useState(false);
  const [isOpenDrawerItem, setIsOpenDrawerItem] = useState(false);

  const [campaignName, setCampaignName] = useState("Game Campaign");
  const [dataGame, setDataGame] = useState([]);
  const [dataMember, setDataMember] = useState([]);

  const [itemView, setItemView] = useState({});
  const [allItem, setAllItem] = useState([]);

  useEffect(() => {
    setAllItem(props.allItem);
  }, [props.allItem]);

  const handleFilter = (arr) => {
    let newList = [];
    const oldList = cloneDeep(arr);

    // newList = itemCode !== '' ? oldList.filter(el => el.barcode === itemCode) : oldList;
    // newList = itemType !== '' ? newList.filter(el => el.itemPromotionType === itemType) : newList;
    // newList = promotionCode !== '' ? newList.filter(el => el.promotionCode === promotionCode) : newList;
    // newList = promotionType !== '' ? newList.filter(el => el.promotionType === promotionType) : newList;
    // newList = couponCode !== '' ? newList.filter(el => el.couponCode == couponCode) : newList;
    // setData(newList)
    // return newList;
    return oldList;
  };

  const handleExport = (arr) => {
    const dataExport = cloneDeep(arr);
    for (let item of dataExport) {
      item.items = item.itemValid.items;
      item.maxQty = item.itemValid.maxQty;
      delete item.itemValid;
    }

    handleExportAutoField(dataExport, "exportGameListCampaign");
  };

  const handleExportCampaignDetail = (arr) => {
    const dataExport = cloneDeep(arr);
    handleExportAutoField(dataExport, "exportGameListCampaignDetail");
  };

  const handleExportMember = (arr) => {
    const dataExport = cloneDeep(arr);
    handleExportAutoField(dataExport, "exportMemberGameListCampaign");
  };

  const handleGetMember = async (item) => {
    try {
      // const queryString = new URLSearchParams(params).toString();
      const url = `/campaign/awardbymember/${item.campaignCode}`;
      const response = await fetchData(url, "GET");

      if (response?.status) {
        setDataMember(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setIsLoadingMember(false);
    }
  };

  const renderDrawer = () => {
    const columns = [
      {
        field: "awardIndex",
        label: "",
        colSpanHead: 0,
        colSpanBody: 0,
        notShow: true,
      },
      {
        field: "itemCode",
        label: "Item",
        classHead: "fs-10",
        classBody: "fs-10",
        colSpanHead: 2,
      },
      {
        field: "itemName",
        label: "",
        classHead: "fs-10",
        classBody: "fs-10",
        colSpanHead: 0,
      },
      {
        field: "qty",
        label: "Gift Qty",
        classHead: "fs-10 text-right",
        classBody: "fs-10 text-right",
      },
      {
        field: "stockQty",
        label: "Issues Qty",
        classHead: "fs-10 text-right",
        classBody: "fs-10 text-right",
      },
    ];
    const dataD = createDataTable(dataGame, columns);

    // ======================================
    const columnsM = [
      {
        field: "memberCode",
        label: "Gift",
        classHead: "fs-10",
        classBody: "fs-10",
      },
      { field: "name", label: "", classHead: "fs-10", classBody: "fs-10" },
      {
        field: "firstName",
        label: "First name",
        classHead: "fs-10",
        classBody: "fs-10",
      },
      {
        field: "lastName",
        label: "Last name",
        classHead: "fs-10",
        classBody: "fs-10",
      },
      {
        field: "createdDate",
        label: "Create date",
        classHead: "fs-10",
        classBody: "fs-10",
        formatBody: (val) => DateHelper.displayDateTime(val),
      },
      {
        field: "itemCode",
        label: "Item",
        classHead: "fs-10",
        classBody: "fs-10",
        colSpanHead: 2,
      },
      {
        field: "itemName",
        label: "",
        classHead: "fs-10",
        classBody: "fs-10",
        colSpanHead: 0,
      },
      {
        field: "phone",
        label: "Phone",
        classHead: "fs-10",
        classBody: "fs-10",
      },
      {
        field: "voucherCode",
        label: "Voucher code",
        classHead: "fs-10",
        classBody: "fs-10",
      },
    ];
    const dataM = createDataTable(dataMember, columnsM);

    return (
      <>
        <DrawerComp
          width={750}
          title={campaignName}
          isOpen={isOpenDrawerInfo}
          keyFilter={"isOpenDrawerInfo"}
          updateFilter={(val) => setIsOpenDrawerInfo(val)}
        >
          <Row className="mrt-10">
            <Col xl={24}>
              <TableCustom
                data={dataD}
                columns={columns}
                isLoading={isLoading}
                fullWidth={true}
                // totalNumItems={itemCountDrawer}
                // currentPageComp={pageDrawer}
                // updateListCheckbox={(val) => setListCheckedHotItem(val)}
                // onSearch={handleSearchListItem}
              >
                <Tag
                  icon={<FileExcelOutlined />}
                  className="h-30 icon-excel f-left"
                  onClick={() => handleExportCampaignDetail(dataD)}
                >
                  <span className="icon-excel-detail">Export</span>
                </Tag>
              </TableCustom>
            </Col>
          </Row>

          <Row className="mrt-10">
            <Col xl={24}>
              <TableCustom
                data={dataM}
                columns={columnsM}
                isLoading={isLoadingMember}
                fullWidth={true}
                // totalNumItems={itemCountDrawer}
                // currentPageComp={pageDrawer}
                // updateListCheckbox={(val) => setListCheckedHotItem(val)}
                // onSearch={handleSearchListItem}
              >
                <Tag
                  icon={<FileExcelOutlined />}
                  className="h-30 icon-excel f-left"
                  onClick={() => handleExportMember(dataM)}
                >
                  <span className="icon-excel-detail">Export</span>
                </Tag>
              </TableCustom>
            </Col>
          </Row>
        </DrawerComp>
      </>
    );

    // let data = [{ items: itemView?.itemValid?.items, maxQty: itemView?.itemValid?.maxQty }]

    // const columns = [
    //     { field: 'items', label: 'Item', classHead: 'fs-10', classBody: 'fs-10', formatBody: renderListItem },
    //     { field: 'maxQty', label: 'Max qty', classHead: 'fs-10 text-right', classBody: 'fs-10 text-right' },
    // ];
    // const dataD = createDataTable(data, columns);

    // return <>
    //     <DrawerComp
    //         title={itemView.campaignName}
    //         isOpen={isOpenDrawerItem} keyFilter={'isOpenDrawerItem'} updateFilter={(val) => setIsOpenDrawerItem(val)}
    //     >

    //         <Row className="mrt-10">
    //             <Col xl={24}>
    //                 <TableCustom
    //                     data={dataD}
    //                     columns={columns}
    //                     fullWidth={true}
    //                 >
    //                     <Tag
    //                         icon={<FileExcelOutlined />}
    //                         className="h-30 icon-excel f-left" onClick={() => handleExportItem(dataD)}>
    //                         <span className="icon-excel-detail">Export</span>
    //                     </Tag>
    //                 </TableCustom>
    //             </Col>
    //         </Row>
    //     </DrawerComp>
    // </>
  };

  const renderDrawerMember = () => {
    const columns = [
      {
        field: "memberCode",
        label: "Gift",
        classHead: "fs-10",
        classBody: "fs-10",
      },
      { field: "name", label: "", classHead: "fs-10", classBody: "fs-10" },
      {
        field: "firstName",
        label: "First name",
        classHead: "fs-10",
        classBody: "fs-10",
      },
      {
        field: "lastName",
        label: "Last name",
        classHead: "fs-10",
        classBody: "fs-10",
      },
      {
        field: "createdDate",
        label: "Create date",
        classHead: "fs-10",
        classBody: "fs-10",
        formatBody: (val) => DateHelper.displayDateTime(val),
      },
      {
        field: "itemCode",
        label: "Item",
        classHead: "fs-10",
        classBody: "fs-10",
        colSpanHead: 2,
      },
      {
        field: "itemName",
        label: "",
        classHead: "fs-10",
        classBody: "fs-10",
        colSpanHead: 0,
      },
      {
        field: "phone",
        label: "Phone",
        classHead: "fs-10",
        classBody: "fs-10",
      },
      {
        field: "voucherCode",
        label: "Voucher code",
        classHead: "fs-10",
        classBody: "fs-10",
      },
    ];
    const dataD = createDataTable(dataMember, columns);

    return (
      <>
        <DrawerComp
          width={700}
          title={campaignName}
          isOpen={isOpenDrawerMember}
          keyFilter={"isOpenDrawerMember"}
          updateFilter={(val) => setIsOpenDrawerMember(val)}
        >
          <Row className="mrt-10">
            <Col xl={24}>
              <TableCustom
                data={dataD}
                columns={columns}
                isLoading={isLoadingMember}
                fullWidth={true}
                // totalNumItems={itemCountDrawer}
                // currentPageComp={pageDrawer}
                // updateListCheckbox={(val) => setListCheckedHotItem(val)}
                // onSearch={handleSearchListItem}
              >
                <Tag
                  icon={<FileExcelOutlined />}
                  className="h-30 icon-excel f-left"
                  onClick={() => handleExportMember(dataD)}
                >
                  <span className="icon-excel-detail">Export</span>
                </Tag>
              </TableCustom>
            </Col>
          </Row>
        </DrawerComp>
      </>
    );
  };

  const renderListItem = (val, key, item) => {
    let listBarcode = item?.items.split(",");
    let newArr = [];
    if (listBarcode.length > 0) {
      newArr = allItem.filter((el) => listBarcode?.includes(el.itemCode));
    }

    return (
      <>
        {newArr?.map((el, index) => (
          <Tag
            key={index}
            color="blue"
          >{`${el.itemCode} - ${el.itemName}`}</Tag>
        ))}
      </>
    );
  };

  const handleExportItem = (arr) => {
    const dataExportItem = cloneDeep(arr);
    handleExportAutoField(dataExportItem, "exportPostListItem");
  };

  const renderDrawerItem = () => {
    let data = [
      {
        items: itemView?.itemValid?.items,
        maxQty: itemView?.itemValid?.maxQty,
      },
    ];

    const columns = [
      {
        field: "items",
        label: "Item",
        classHead: "fs-10",
        classBody: "fs-10",
        formatBody: renderListItem,
      },
      {
        field: "maxQty",
        label: "Max qty",
        classHead: "fs-10 text-right",
        classBody: "fs-10 text-right",
      },
    ];
    const dataD = createDataTable(data, columns);

    return (
      <>
        <DrawerComp
          title={itemView.campaignName}
          isOpen={isOpenDrawerItem}
          keyFilter={"isOpenDrawerItem"}
          updateFilter={(val) => setIsOpenDrawerItem(val)}
        >
          <Row className="mrt-10">
            <Col xl={24}>
              <TableCustom data={dataD} columns={columns} fullWidth={true}>
                <Tag
                  icon={<FileExcelOutlined />}
                  className="h-30 icon-excel f-left"
                  onClick={() => handleExportItem(dataD)}
                >
                  <span className="icon-excel-detail">Export</span>
                </Tag>
              </TableCustom>
            </Col>
          </Row>
        </DrawerComp>
      </>
    );
  };

  const renderStatus = (val, key, item) => {
    return (
      <>
        <Tag color={item.active === 1 ? "success" : "error"} className="cursor">
          {item.active === 1 ? "Active" : "Inactive"}
        </Tag>
      </>
    );
  };

  const handleClickOpenDrawer = (item) => {
    setIsOpenDrawerInfo(true);
    setCampaignName(item.campaignName);
    handleGetDataGameCampaign(item);

    setDataMember([]);
    setIsLoadingMember(true);
    handleGetMember(item);
  };

  const handleClickOpenDrawerMember = (item) => {
    setIsLoadingMember(true);
    setDataMember([]);

    setIsOpenDrawerMember(true);
    setCampaignName(item.campaignName);
    handleGetMember(item);
  };

  const handleGetDataGameCampaign = async (item) => {
    // campaign/itemaward/{campaignCode}
    try {
      // const queryString = new URLSearchParams(params).toString();
      const url = `/campaign/itemaward/${item.campaignCode}`;
      const response = await fetchData(url, "GET");

      if (response?.status) {
        setDataGame(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderAction = (val, key, item) => {
    return (
      <>
        <Tag
          color="warning"
          onClick={() => handleClickOpenDrawer(item)}
          className="cursor"
        >
          <FolderViewOutlined />
        </Tag>
        {/* <Tag color='warning' onClick={() => handleClickOpenDrawerMember(item)} className='cursor'><UserOutlined /></Tag> */}
      </>
    );
  };

  const renderApplyStore = (val, key, item) => {
    return (
      <>
        {item.appliedStore ? (
          <Tag color="blue">
            <ExpandAltOutlined />
          </Tag>
        ) : null}
      </>
    );
  };

  // const renderImage = (val, key, item) => {
  //     return <>
  //     </>
  // }

  const handleClickViewItem = (item) => {
    setIsOpenDrawerItem(true);
    setItemView(item);
  };

  const renderItem = (val, key, item) => {
    return (
      <>
        {Object.keys(item.itemValid)?.length > 0 ? (
          <Tag
            color="blue"
            className="cursor"
            onClick={() => handleClickViewItem(item)}
          >
            <ExpandAltOutlined />
          </Tag>
        ) : null}
      </>
    );
  };

  const bodyContent = useMemo(() => {
    const dataFilter = props.data?.filter((el) => el.campaignType === 2) ?? [];

    const columns = [
      // { field: 'appliedIncremental', label: 'appliedIncremental', classHead: 'fs-10', classBody: 'fs-10' },
      // { field: 'appliedStore', label: 'Apply store', classHead: 'fs-10', classBody: 'fs-10', formatBody: renderApplyStore },
      // { field: 'appliedTotalBill', label: 'Apply total bill', classHead: 'fs-10', classBody: 'fs-10' },
      {
        field: "campaignCode",
        label: "Campaign code",
        classHead: "fs-10",
        classBody: "fs-10",
        colSpanHead: 0,
        colSpanBody: 0,
        notShow: true,
      },
      {
        field: "campaignName",
        label: "Campaign",
        classHead: "fs-10",
        classBody: "fs-10",
        styleBody: { maxWidth: 200 },
        isTooltip: true,
      },
      {
        field: "campaignTitle",
        label: "Campaign title",
        classHead: "fs-10",
        classBody: "fs-10",
        colSpanHead: 0,
        colSpanBody: 0,
        notShow: true,
      },
      {
        field: "active",
        label: "Status",
        classHead: "fs-10",
        classBody: "fs-10",
        formatBody: renderStatus,
      },
      // { field: 'campaignType', label: 'Campaign type', colSpanHead: 0, colSpanBody: 0, notShow: true },
      {
        field: "startDateValid",
        label: "Start date",
        classHead: "fs-10",
        classBody: "fs-10",
        formatBody: (val) => DateHelper.displayDate(val),
      },
      {
        field: "endDateValid",
        label: "End date",
        classHead: "fs-10",
        classBody: "fs-10",
        formatBody: (val) => DateHelper.displayDate(val),
      },
      // { field: 'image', label: 'image', classHead: 'fs-10', classBody: 'fs-10', formatBody: renderImage },
      {
        field: "itemValid",
        label: "Item",
        classHead: "fs-10",
        classBody: "fs-10",
        formatBody: renderItem,
      }, //json
      {
        field: "minValueValid",
        label: "Bill value",
        classHead: "fs-10 text-right",
        classBody: "fs-10 text-right",
        formatBody: (val) => StringHelper.formatValue(val),
      },

      // { field: 'paymentValid', label: 'paymentValid', classHead: 'fs-10', classBody: 'fs-10' },
      // { field: 'priority', label: 'priority', classHead: 'fs-10', classBody: 'fs-10' },
      // { field: 'qtyBy', label: 'qtyBy', classHead: 'fs-10', classBody: 'fs-10' },
      // { field: 'qtyResult', label: 'qtyResult', classHead: 'fs-10', classBody: 'fs-10' },
      // { field: 'storeValid', label: 'storeValid', classHead: 'fs-10', classBody: 'fs-10' },
      // { field: 'value', label: 'value', classHead: 'fs-10', classBody: 'fs-10' },
      // { field: 'valueType', label: 'valueType', classHead: 'fs-10', classBody: 'fs-10' },
      {
        field: "action",
        label: "Action",
        classHead: "fs-10",
        classBody: "fs-10",
        formatBody: renderAction,
      },
    ];

    const dataTb = createDataTable(dataFilter, columns) ?? [];

    return (
      <>
        <TableCustom
          data={dataTb}
          columns={columns}
          isLoading={props.isLoading}
        >
          <Tag
            icon={<FileExcelOutlined />}
            className="h-30 icon-excel f-left"
            onClick={() => handleExport(dataTb)}
          >
            <span className="icon-excel-detail">Export</span>
          </Tag>
        </TableCustom>
        {renderDrawer()}
        {renderDrawerMember()}
        {renderDrawerItem()}
      </>
    );
  }, [
    props.data,
    props.isLoading,
    isOpenDrawerInfo,
    dataGame,
    isOpenDrawerMember,
    dataMember,
    isOpenDrawerItem,
    itemView,
  ]);

  return bodyContent;
};

export default TableGamePromotion;
