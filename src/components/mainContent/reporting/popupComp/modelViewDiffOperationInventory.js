import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Modal, Row } from "antd";
import { StringHelper } from "helpers";
import { hanldeExportAutoField } from "helpers/ExportHelper";
import React, { useMemo, useState } from "react";

const ModelViewDiffOperationInventory = ({ data, title, ...props }) => {
  const [open, setOpen] = useState(false);

  const handleViewDiff = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleExport = () => {
    let colType = {
      qty: "number",
      invQty: "number",
      amount: "number",
    };
    hanldeExportAutoField(data, "exportDiff" + title, null, null, colType);
  };

  const handleCount = (arr, key) => {
    let val = 0;
    for (let item of arr) {
      val += key !== "" ? parseFloat(item[key]) : 1;
    }
    return val;
  };

  const bodyContent = useMemo(() => {
    return (
      <>
        <span
          className="cursor cl-org pd-2 br-2 fs-8"
          style={{ border: "1px solid orange" }}
          onClick={() => handleViewDiff()}
        >
          <FontAwesomeIcon icon={faEye} />
        </span>

        <Modal
          open={open}
          title={`Diff ${title ? title : ""}`}
          onCancel={handleCancel}
          footer={[
            <Button
              key="export"
              onClick={handleExport}
              style={{ backgroundColor: "#000", color: "#fff" }}
            >
              Export
            </Button>,
            <Button key="back" onClick={handleCancel}>
              Close
            </Button>,
          ]}
          style={{
            top: 20,
          }}
          width={600}
        >
          <Row>
            <Col>
              <div
                className={data?.length > 0 && "mH-370"}
                style={{
                  maxHeight: "calc(100vh - 230px)",
                  overflowY: "auto",
                  position: "relative",
                }}
              >
                <table className="table">
                  <thead>
                    <tr>
                      <th>Store</th>
                      <th>Invoice code</th>
                      <th>Item</th>
                      <th>Unit</th>
                      <th className="text-right">Store qty</th>
                      <th className="text-right">Inv qty</th>
                      <th className="text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data
                      ?.sort((a, b) => (a.storeCode >= b.storeCode ? 1 : -1))
                      .map((item, index) => (
                        <tr key={index}>
                          <td className="fs-10">{item.storeCode}</td>
                          <td className="fs-10">{item.invoiceCode}</td>
                          <td className="fs-10">
                            {item.barcode} <br />
                            {item.itemName}
                          </td>
                          <td className="fs-10">{item.unit}</td>
                          <td className="text-right fs-10">
                            {StringHelper.formatValue(item.qty)}
                          </td>
                          <td className="text-right fs-10">
                            {StringHelper.formatValue(item.invQty)}
                          </td>
                          <td className="text-right fs-10">
                            {StringHelper.formatPrice(item.amount)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td>Total: </td>
                      <td></td>
                      <td>{handleCount(data, "")}</td>
                      <td></td>
                      <td className="text-right">
                        {StringHelper.formatValue(handleCount(data, "qty"))}
                      </td>
                      <td className="text-right">
                        {StringHelper.formatValue(handleCount(data, "invQty"))}
                      </td>
                      <td className="text-right">
                        {StringHelper.formatValue(handleCount(data, "amount"))}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </Col>
          </Row>
        </Modal>
      </>
    );
  }, [data, open]);
  return bodyContent;
};

export default ModelViewDiffOperationInventory;
