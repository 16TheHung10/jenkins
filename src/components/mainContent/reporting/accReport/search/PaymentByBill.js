import {
  FileExcelOutlined,
  FileSearchOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { Col, Row, Tag, message, Modal, Button } from "antd";
import { fetchData } from "helpers/FetchData";
import {
  createDataTable,
  decreaseDate,
  createListOption,
  cloneDeep,
} from "helpers/FuncHelper";
import DateHelper from "helpers/DateHelper";
import StringHelper from "helpers/StringHelper";
import moment from "moment";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import DatePickerComp from "utils/datePicker";
import TableCustomComp from "utils/tableCustom";
import SelectboxAndCheckbox from "utils/selectboxAndCheckbox";
import { handleExportAutoField } from "helpers/ExportHelper";
import { DataContext } from "context/DataContext";

export default function PaymentByBill() {
  const { data } = useContext(DataContext);
  const { stores } = data;
  const [storeOpt, setStoreOpt] = useState([]);

  const [isFilter, setIsFilter] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [dataTable, setDataTable] = useState([]);
  const [date, setDate] = useState(decreaseDate(1));

  // Option list
  const [itemsOpt, setItemsOpt] = useState([]);
  const [storeFilterOpt, setStoreFilterOpt] = useState([]);
  const [invoiceOpt, setInvoiceOpt] = useState([]);
  const [paymentOpt, setPaymentOpt] = useState([]);

  // value filter
  const [storeFilter, setStoreFilter] = useState("");
  const [storeCode, setStoreCode] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [invoiceCode, setInvoiceCode] = useState("");
  const [paymentCode, setPaymentCode] = useState("");

  const [dataList, setDataList] = useState([]);

  const [errorIndexes, setErrorIndexes] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [apiUrls, setApiUrls] = useState([]);
  const [errorMessages, setErrorMessages] = useState(
    Array(apiUrls.length).fill(null),
  );

  const [isLoadingpp, setIsloadingpp] = useState(false);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (!!stores) {
      let listStoreOpt = [];

      if (Object.keys(stores)?.length === 0) {
        let storeCode = JSON.parse(localStorage.getItem("profile"))?.storeCode;
        let storeName =
          storeCode +
          " - " +
          JSON.parse(localStorage.getItem("profile"))?.storeName;

        listStoreOpt = [{ value: storeCode, label: storeName }];
      } else {
        listStoreOpt = Object.values(stores)?.map((el) => ({
          value: el.storeCode,
          label: `${el.storeCode} - ${el.storeName}`,
          openedDate: el.openedDate,
        }));
      }

      setStoreOpt(listStoreOpt);
    }
  }, [stores]);

  useEffect(() => {
    const list = dataList;
    const flattenedArray = list?.flatMap((subArr) =>
      subArr?.map((obj) => ({ ...obj })),
    );

    setDataTable(flattenedArray);

    // const listItemOpt = createListOption(flattenedArray, 'code', 'name');
    // setItemsOpt(listItemOpt);

    // const storeOpt = createListOption(flattenedArray, 'storeCode', 'storeName') || [];
    // setStoreFilterOpt(storeOpt);

    const invoiceOpt = createListOption(flattenedArray, "invoiceCode") || [];
    setInvoiceOpt(invoiceOpt);

    const paymentOpt =
      createListOption(
        flattenedArray,
        "paymentMethodCode",
        "paymentMethodName",
      ) || [];
    setPaymentOpt(paymentOpt);
  }, [dataList]);

  useEffect(() => {
    // console.log({ errorIndexes: errorIndexes.length })
    if (errorIndexes.length === 0) {
      setShowModal(false);
    } else {
      setShowModal(true);
    }
  }, [errorIndexes]);

  const handleLoading = () => {
    setIsLoading(true);
    setDataTable([]);
    setDataList([]);
  };

  const handleIsFilter = () => {
    setIsFilter(!isFilter);
  };

  const handleExport = (arr) => {
    const results = cloneDeep(arr);
    // console.log(results)
    const typeCol = {
      amount: "number",
      billDiscount: "number",
      billGrossSales: "number",
      billReturnPaid: "number",
      invoiceType: "number",
    };
    // console.log(results)
    handleExportAutoField(results, "exportPaymentByBill", null, null, typeCol);
  };

  // Call api loop ---START
  const fetchDataList = async (listAllStore) => {
    handleLoading();

    try {
      const promiseList = listAllStore?.map((store, index) =>
        callApiLoop(store, index),
      );
      const results = await Promise.all(promiseList);
      const newDataList = [];
      const newErrorIndexes = [];
      await results.forEach((data, index) => {
        if (data !== null) {
          newDataList[index] = data;
        } else {
          newErrorIndexes.push(index);
        }
      });

      setDataList(newDataList);
      setErrorIndexes(newErrorIndexes);
    } catch (error) {
      console.error("Error promise data: ", error);
    } finally {
      setIsLoading(false);
      setIsSearch(false);
    }
  };

  const callApiLoop = async (store, index) => {
    try {
      let params = {
        date: DateHelper.displayDateFormatMinus(date),
        storeCode: store,
      };

      const url = `/sale/store/payment/movement`;
      const response = await fetchData(
        url,
        "GET",
        params,
        null,
        process.env.REACT_APP_ANALYTIC_REPORT_ROOT_URL,
      );

      if (response?.status) {
        return response.data.sale;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
      return null;
    }
  };

  const onSearch = () => {
    if (isSearch === true) {
      message.warning("Please wait");
      return false;
    }

    setIsSearch(true);

    // if (storeCode?.length > 0) {
    // let listAllStore = storeOpt?.map(el => el.value);
    let listAllStore =
      storeCode?.length > 0 ? storeCode : storeOpt?.map((el) => el.value);
    // let listAllStore = ['VN0137', 'VN0001', 'VN0002', 'VN0003'];
    setApiUrls(listAllStore);

    fetchDataList(listAllStore);
    // }
    // else {
    //     handleSearch();
    // }
  };

  const handleRetry = async () => {
    const apiIndexToRetry = errorIndexes;
    if (apiIndexToRetry !== undefined) {
      setIsloadingpp(true);
      setRetrying(true);
      let listAllStore = apiUrls.filter((el, index) =>
        errorIndexes.includes(index),
      );
      // let listAllStore = ['VN0004', 'VN0005'];
      const promiseList = listAllStore?.map((store, index) =>
        callApiLoop(store, index),
      );
      const results = await Promise.all(promiseList);
      const oldDataList = cloneDeep(dataList);
      const newDataList = [];
      const newErrorIndexes = [];

      await results.forEach((data, index) => {
        if (data !== null) {
          newDataList[index] = data;
        } else {
          newErrorIndexes.push(index);
        }
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsloadingpp(false);
      setRetrying(false);
      setShowModal(false);

      const mergedArray = [...oldDataList, ...newDataList];
      setDataList(mergedArray);
      setErrorIndexes(newErrorIndexes);
    }
  };
  // Call api loop ---END

  const handleSearch = async (currentPage, currentPageSize) => {
    if (storeCode === "") {
      message.error("Please choose store");
      return false;
    }

    let params = {
      date: DateHelper.displayDateFormatMinus(date),
      storeCode: storeCode.toString(),
    };

    if (currentPage && typeof currentPage == "number") {
      params.page = currentPage;
      setPage(currentPage);
    }

    if (!isNaN(currentPageSize)) {
      params.pageSize = currentPageSize;
      setPageSize(currentPageSize);
    }

    handleLoading();

    try {
      const url = `/sale/store/payment/movement`;
      const response = await fetchData(
        url,
        "GET",
        params,
        null,
        process.env.REACT_APP_ANALYTIC_REPORT_ROOT_URL,
      );

      if (response?.status) {
        setDataTable(response.data.sale);
        // const listItemOpt = createListOption(response.data.sale, 'code', 'name');
        // setItemsOpt(listItemOpt);

        // const storeOpt = createListOption(response.data.sale, 'storeCode', 'storeName');
        // setStoreFilterOpt(storeOpt);

        const invoiceOpt = createListOption(response.data.sale, "invoiceCode");
        setInvoiceOpt(invoiceOpt);

        const paymentOpt = createListOption(
          response.data.sale,
          "paymentMethodCode",
          "paymentMethodName",
        );
        setPaymentOpt(paymentOpt);

        if (response.data?.sale?.length === 0) {
          message.warning("Data not found");
        }
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setIsLoading(false);
      setIsSearch(false);
    }
  };

  const searchComp = () => {
    return (
      <>
        <Row gutter={16}>
          <Col xl={24}>
            <div className="section-block">
              <Row gutter={16}>
                <Col xl={24}>
                  <Row gutter={[16, 8]}>
                    <Col xl={6}>
                      <label htmlFor="storeCode" className="w100pc">
                        Store:
                        <SelectboxAndCheckbox
                          data={storeOpt}
                          funcCallback={(val) => setStoreCode(val)}
                          keyField={"storeCode"}
                          defaultValue={""}
                          isMode={"multiple"}
                        />
                      </label>
                    </Col>
                    <Col xl={6}>
                      <label htmlFor="date" className="w100pc">
                        Date:
                        <div>
                          <DatePickerComp
                            date={date}
                            minDate={decreaseDate(62)}
                            maxDate={decreaseDate(1)}
                            func={(val) => setDate(val)}
                            keyField={"date"}
                          />
                        </div>
                      </label>
                    </Col>
                  </Row>

                  <Row gutter={16} className="mrt-10">
                    <Col>
                      {/* <Tag className="h-30 icon-search" onClick={handleSearch}> */}
                      <Tag className="h-30 icon-search" onClick={onSearch}>
                        <FileSearchOutlined />{" "}
                        <span className="icon-search-detail">Search</span>
                      </Tag>
                      {dataTable?.length > 0 && (
                        <>
                          <Tag
                            icon={<FileExcelOutlined />}
                            className="h-30 icon-excel"
                            onClick={() => handleExport(dataTable)}
                          >
                            <span className="icon-excel-detail">Export</span>
                          </Tag>
                          <Tag
                            onClick={handleIsFilter}
                            className="h-30 icon-orange"
                          >
                            <FilterOutlined />
                          </Tag>
                        </>
                      )}
                    </Col>
                  </Row>

                  {isFilter && (
                    <Row gutter={16} className="mrt-5">
                      <Col xl={6}>
                        <label htmlFor="invoiceCode" className="w100pc">
                          Invoice:
                          <SelectboxAndCheckbox
                            data={invoiceOpt}
                            funcCallback={(val) => setInvoiceCode(val)}
                            keyField={"invoiceCode"}
                            defaultValue={""}
                            isMode={""}
                          />
                        </label>
                      </Col>
                      <Col xl={6}>
                        <label htmlFor="paymentCode" className="w100pc">
                          Payment:
                          <SelectboxAndCheckbox
                            data={paymentOpt}
                            funcCallback={(val) => setPaymentCode(val)}
                            keyField={"paymentCode"}
                            defaultValue={""}
                            isMode={""}
                          />
                        </label>
                      </Col>
                    </Row>
                  )}
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </>
    );
  };

  const handleFilter = (arr) => {
    let dataClone = cloneDeep(arr);
    let newList = [];
    // newList = storeFilter !== '' ? dataClone?.filter(el => el.storeCode === storeFilter) : dataClone;
    // newList = itemCode !== '' ? newList?.filter(el => el.code === itemCode) : newList;
    newList =
      paymentCode !== ""
        ? dataClone?.filter((el) => el.paymentMethodCode == paymentCode)
        : dataClone;
    newList =
      invoiceCode !== ""
        ? newList?.filter((el) => el.invoiceCode === invoiceCode)
        : newList;

    return newList;
  };

  const tableComp = useCallback(() => {
    const list = handleFilter(dataTable);

    const columns = [
      {
        field: "storeCode",
        label: "Store",
        classHead: "fs-10",
        classBody: "fs-10",
        colSpanHead: 2,
        rowSpanHead: 2,
        isSort: true,
        keySort: "storeCode",
      },
      {
        field: "storeName",
        label: "",
        classHead: "fs-10",
        classBody: "fs-10",
        colSpanHead: 0,
      },
      {
        field: "transactionID",
        label: "Transaction ID",
        classHead: "fs-10",
        classBody: "fs-10",
        rowSpanHead: 2,
        styleHead: { minWidth: 100 },
      },
      {
        field: "counterCode",
        label: "Counter code",
        classHead: "fs-10",
        classBody: "fs-10",
        rowSpanHead: 2,
        isSort: true,
        keySort: "counterCode",
      },

      {
        field: "",
        label: "Bill",
        classHead: "fs-10 border-none text-center",
        styleHead: {},
        colSpanHead: 3,
        classBody: "fs-10",
        styleBody: {},
        children: [
          {
            field: "billDiscount",
            label: "Discount",
            classHead: "fs-10 text-right",
            classBody: "fs-10 text-right",
            styleHead: {
              border: "none",
              borderTop: "1px solid cyan",
              minWidth: 70,
            },
            isSort: true,
            keySort: "billDiscount",
            formatBody: (val) => StringHelper.formatValue(val),
          },
          {
            field: "billGrossSales",
            label: "GrossSales",
            classHead: "fs-10 text-right",
            classBody: "fs-10 text-right",
            styleHead: {
              border: "none",
              borderTop: "1px solid cyan",
              minWidth: 70,
            },
            isSort: true,
            keySort: "billGrossSales",
            formatBody: (val) => StringHelper.formatValue(val),
          },
          {
            field: "billReturnPaid",
            label: "Return paid",
            classHead: "fs-10 text-right",
            classBody: "fs-10 text-right",
            styleHead: {
              border: "none",
              borderTop: "1px solid cyan",
              minWidth: 70,
            },
            isSort: true,
            keySort: "billReturnPaid",
            formatBody: (val) => StringHelper.formatValue(val),
          },
        ],
      },

      {
        field: "",
        label: "Invoice",
        classHead: "fs-10 border-none text-center",
        styleHead: {},
        colSpanHead: 3,
        classBody: "fs-10",
        styleBody: {},
        children: [
          {
            field: "invoiceCode",
            label: "Code",
            classHead: "fs-10",
            classBody: "fs-10",
            styleHead: {
              border: "none",
              borderTop: "1px solid orange",
              minWidth: 70,
            },
          },
          {
            field: "invoiceDate",
            label: "Date",
            classHead: "fs-10",
            classBody: "fs-10",
            styleHead: {
              border: "none",
              borderTop: "1px solid orange",
              minWidth: 70,
            },
            formatBody: (val) => DateHelper.displayDateTimeNo7(val),
          },
          {
            field: "invoiceType",
            label: "Type",
            classHead: "fs-10",
            classBody: "fs-10",
            styleHead: {
              border: "none",
              borderTop: "1px solid orange",
              minWidth: 70,
            },
          },
        ],
      },

      {
        field: "amount",
        label: "Amount",
        classHead: "fs-10 text-right",
        classBody: "fs-10 text-right",
        styleHead: { minWidth: 70 },
        rowSpanHead: 2,
        isSort: true,
        keySort: "amount",
        formatBody: (val) => StringHelper.formatValue(val),
      },

      {
        field: "customerCode",
        label: "Customer code",
        classHead: "fs-10",
        classBody: "fs-10",
        rowSpanHead: 2,
      },

      {
        field: "paymentMethodCode",
        label: "",
        colSpanHead: 0,
        colSpanBody: 0,
        notShow: true,
      },
      {
        field: "paymentMethodName",
        label: "Payment method name",
        rowSpanHead: 2,
        classHead: "fs-10",
        classBody: "fs-10",
        styleHead: {
          border: "none",
          borderTop: "1px solid cyan",
          minWidth: 70,
        },
      },
      // {
      //     field: '', label: 'Payment method', classHead: 'fs-10 border-none text-center', styleHead: {}, colSpanHead: 2, classBody: 'fs-10', styleBody: {}, children: [

      //     ]
      // },

      {
        field: "",
        label: "Account",
        classHead: "fs-10 border-none text-center",
        styleHead: {},
        colSpanHead: 2,
        classBody: "fs-10",
        styleBody: {},
        children: [
          {
            field: "accountHolder",
            label: "Holder",
            classHead: "fs-10",
            classBody: "fs-10",
            styleHead: {
              border: "none",
              borderTop: "1px solid orange",
              minWidth: 70,
            },
          },
          {
            field: "accountNumber",
            label: "Number",
            classHead: "fs-10",
            classBody: "fs-10",
            styleHead: {
              border: "none",
              borderTop: "1px solid orange",
              minWidth: 70,
            },
          },
        ],
      },
    ];

    const results = createDataTable(list, columns);

    return (
      <>
        <Row gutter={16} className="mrt-10">
          <Col xl={24}>
            <TableCustomComp
              data={results}
              columns={columns}
              isLoading={isLoading}
            />
          </Col>
        </Row>
      </>
    );
  }, [dataTable, isLoading, itemCode, paymentCode, invoiceCode]);

  // Call api loop ---START MODAL
  const renderModal = useCallback(() => {
    let strError = "";

    for (let index of errorIndexes) {
      strError += `${apiUrls[index]}, `;
    }

    return (
      <Modal
        title="API Error"
        open={showModal}
        onCancel={() => setShowModal(false)}
        onOk={() => handleRetry()}
        cancelButtonProps={{ danger: true }}
        okText="Retry"
        okButtonProps={{ loading: isLoadingpp && retrying }}
      >
        There was an error fetching data from API {strError}. Do you want to
        retry?
      </Modal>
    );
  }, [showModal, errorIndexes, isLoadingpp, retrying]);
  // Call api loop ---END MODAL

  return (
    <>
      {searchComp()}
      {tableComp()}
      {renderModal()}
    </>
  );
}
