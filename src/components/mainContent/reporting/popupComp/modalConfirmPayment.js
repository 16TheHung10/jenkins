import { Button, Col, Modal, Row, message } from "antd";
import { DateHelper, StringHelper } from "helpers";
import { decreaseDate } from "helpers/FuncHelper";
import ReportingModel from "models/ReportingModel";
import React, { useEffect, useMemo, useState } from "react";
import InputNumberComp from "utils/inputNumber";

const ModelConfirmPayment = (props) => {
  const [list, setList] = useState({});
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [storeCode, setStoreCode] = useState("");
  const [sumCico, setSumCico] = useState({});
  const [dateCico, setDateCico] = useState("");
  const [listSend, setListSend] = useState({});

  useEffect(() => {
    setList(props.objPaymentList);
  }, [props.objPaymentList]);

  useEffect(() => {
    setStoreCode(props.storeCode);
  }, [props.storeCode]);

  useEffect(() => {
    setSumCico(props.sumCico);
  }, [props.sumCico]);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    let arr = [];

    for (let key in list) {
      let obj = {
        key: key,
        value: list[key][storeCode + "Amount"] || list[key][storeCode],
      };
      arr.push(obj);
    }

    if (sumCico) {
      let obj = {
        key: "cicoMomo",
        value: sumCico.totalAmountChange || sumCico.totalAmount,
      };
      arr.push(obj);
    }

    if (sumCico) {
      let obj = {
        key: "cicoPayoo",
        value: sumCico.totalAmountPayooChange || sumCico.totalAmountPayoo,
      };
      arr.push(obj);
    }

    const now = new Date();
    const hours = now.getHours();

    if (hours >= 11) {
      message.error("Vui lòng xác nhận trước 11 giờ");
      return false;
    }

    setLoading(true);
    handlePaymentConfirm(arr);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handlePaymentConfirm = async (arr) => {
    const page = "payment/confirm";
    const params = {
      storeCode,
      date: DateHelper.displayDate(decreaseDate(1)),
      ListPaymentConfirm: arr,
    };

    let model = new ReportingModel();
    let result = await model.postReportInfo(page, "", params);

    if (result.status) {
      setLoading(false);
      setOpen(false);
      message.success(result.message);
    } else {
      setLoading(false);
      setOpen(false);
      message.error(result.message);
    }
  };

  const handleUpdateFilter = (val, key) => {
    let newSumCico = { ...sumCico };
    let newObj = { ...list };

    if (newObj[key]) {
      newObj[key][props.storeCode + "Amount"] = val;

      setList(newObj);
    } else {
      if (key === "cicoMomo") {
        newSumCico.totalAmountChange = val;
      }
      if (key === "cicoPayoo") {
        newSumCico.totalAmountPayooChange = val;
      }
      setSumCico(newSumCico);
    }
  };

  const handleConfirm = () => {
    handleOk();
  };

  const bodyContent = useMemo(() => {
    return (
      <>
        <Button type="primary" onClick={showModal}>
          Payment confirm
        </Button>

        <Modal
          open={open}
          title="Payment confirm"
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Close
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={handleOk}
            >
              Confirm
            </Button>,
          ]}
          style={{
            top: 20,
          }}
        >
          <Row>
            <Col>
              <h5>POS: {DateHelper.displayDate(decreaseDate(1))}</h5>
            </Col>
          </Row>

          {Object.keys(list).map((key, index) => (
            <Row key={index} className="mrb-10">
              <Col className="v-middle" sm={8}>
                <div className="d-inline-block fs-12">
                  {list[key].paymentName}
                </div>
              </Col>
              <Col className="v-middle" sm={8}>
                <div className="d-inline-block fs-12">
                  {StringHelper.formatPrice(list[key][storeCode])}
                </div>
              </Col>
              <Col className="v-middle" sm={8}>
                <InputNumberComp
                  value={list[key][storeCode]}
                  style={{ display: "inline-block" }}
                  keyField={key}
                  func={handleUpdateFilter}
                  maxValue={list[key][storeCode]}
                />
              </Col>
            </Row>
          ))}

          <Row>
            <Col>
              <h5>SERVICE CICO: {DateHelper.displayDate(dateCico)}</h5>
            </Col>
          </Row>

          <Row className="mrb-10">
            <Col className="v-middle" sm={8}>
              <div className="d-inline-block fs-12">MoMo</div>
            </Col>
            <Col className="v-middle" sm={8}>
              <div className="d-inline-block fs-12">
                {StringHelper.formatPrice(sumCico.totalAmount)}
              </div>
            </Col>
            <Col className="v-middle" sm={8}>
              <InputNumberComp
                value={sumCico.totalAmount}
                keyField={"cicoMomo"}
                func={handleUpdateFilter}
                maxValue={sumCico.totalAmount}
              />
            </Col>
          </Row>

          <Row className="mrb-10">
            <Col className="v-middle" sm={8}>
              <div className="d-inline-block fs-12">Payoo</div>
            </Col>
            <Col className="v-middle" sm={8}>
              <div className="d-inline-block fs-12">
                {StringHelper.formatPrice(sumCico.totalAmount)}
              </div>
            </Col>
            <Col className="v-middle" sm={8}>
              <InputNumberComp
                value={sumCico.totalAmount}
                keyField={"cicoPayoo"}
                func={handleUpdateFilter}
                maxValue={sumCico.totalAmount}
              />
            </Col>
          </Row>
        </Modal>
      </>
    );
  }, [open, loading, sumCico, list, storeCode]);

  return bodyContent;
};
export default React.memo(ModelConfirmPayment);
