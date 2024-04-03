//Plugin
import React from "react";
import Select from "react-select";

//Custom
import BaseComponent from "components/BaseComponent";
import Paging from "external/control/pagination";
import { PageHelper } from "helpers";
import SupplierModel from "models/SupplierModel";
import BaseButton from "components/common/buttons/baseButton/BaseButton";

export default class ListSupplier extends BaseComponent {
  constructor(props) {
    super(props);
    this.data.suppliers = [];
    this.fieldSelected = this.assignFieldSelected({
      supplierCode: "",
      supplierName: "",
      supplierStatus: "",
      pageNumber: 1,
      pageSize: 30,
    });
    this.isAutoload = PageHelper.updateFilters(
      this.fieldSelected,
      function (filters) {
        return true;
      },
    );
    this.isRender = true;
  }

  componentDidMount = () => {
    this.handleGetSupplier();
  };

  handleSearch = () => {
    let fields = this.fieldSelected;
    fields.pageNumber = 1;

    PageHelper.pushHistoryState(this.fieldSelected);

    this.handleGetSupplier();

    this.refresh();
  };
  handleClickPaging = (page) => {
    let fields = this.fieldSelected;
    fields.pageNumber = page;
    this.refresh();
  };
  handleGetSupplier = async () => {
    let supplierModel = new SupplierModel();
    let params = {
      supplierCode: this.fieldSelected.supplierCode,
      supplierName: this.fieldSelected.supplierName,
      supplierStatus: this.fieldSelected.supplierStatus,
      pageNumber: this.fieldSelected.pageNumber,
      pageSize: this.fieldSelected.pageSize,
    };
    await supplierModel.getListSupplier(params).then((response) => {
      if (response.status) {
        this.data.suppliers = response.data.suppliers;
        this.itemCount = response.data.total;
        this.isRender = true;
        this.refresh();
      }
    });
  };

  handleToDetail = (supplierCode) => {
    this.targetLink("/supplier/" + supplierCode);
  };

  renderComp = () => {
    const fields = this.fieldSelected;
    let suppliers = this.data.suppliers || [];
    let statusOption = [
      { value: "0", label: "Open" },
      { value: "1", label: "Close" },
    ];
    return (
      <div className="form-filter mini_app_container pb-0">
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div className="section-block">
              <div className="row">
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="supplierCode">Supplier Code: </label>
                    <input
                      type="text"
                      autoComplete="off"
                      name="supplierCode"
                      value={fields.supplierCode || ""}
                      onChange={this.handleChangeField}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="supplierName">Name: </label>
                    <input
                      type="text"
                      autoComplete="off"
                      name="supplierName"
                      value={fields.supplierName || ""}
                      onChange={this.handleChangeField}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="supplierStatus" className="w100pc">
                      {" "}
                      Status:
                    </label>
                    <Select
                      isClearable
                      classNamePrefix="select"
                      maxMenuHeight={260}
                      placeholder="-- All --"
                      value={statusOption.filter(
                        (option) => option.value == fields.supplierStatus,
                      )}
                      options={statusOption}
                      onChange={(e) =>
                        this.handleChangeFieldCustom(
                          "supplierStatus",
                          e ? e.value : "",
                        )
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-9">
                  <BaseButton iconName="search" onClick={this.handleSearch}>
                    Search
                  </BaseButton>
                </div>
              </div>
              <div className="row" style={{ paddingTop: "10px" }}>
                <div className="col-md-12 ">
                  <div
                    className="wrap-table htable "
                    style={{ maxHeight: "calc(100vh - 290px)" }}
                  >
                    <table
                      className="table table-hover detail-search-rcv "
                      style={{ fontSize: 11 }}
                    >
                      <thead>
                        <tr>
                          <th className="w10"></th>
                          <th>Supplier Code</th>
                          <th>Internal Code</th>
                          <th>Name</th>
                          <th>Trading Name</th>
                          <th>TaxCode</th>
                          <th>Status</th>
                          <th>Phone</th>
                          <th>Email</th>
                          <th>MOV</th>
                        </tr>
                      </thead>
                      <tbody>
                        {suppliers.map((supplier, i) => (
                          <tr
                            key={i}
                            onDoubleClick={() =>
                              this.handleToDetail(supplier.supplierCode)
                            }
                          >
                            <td>
                              <input
                                key={supplier.supplierCode}
                                type="radio"
                                // disabled={item.cancel || item.approved}
                                name="itemOption"
                                value={supplier.supplierCode}
                              />
                            </td>
                            <td>{supplier.supplierCode}</td>
                            <td>{supplier.supplierInternalCode}</td>
                            <td>{supplier.supplierName}</td>
                            <td>{supplier.tradingName}</td>
                            <td>{supplier.taxCode}</td>
                            <td>{supplier.status !== 1 ? "Open" : "Close"}</td>
                            <td>{supplier.phone}</td>
                            <td>{supplier.email}</td>
                            <td>{supplier.mov}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {suppliers.length === 0 ? (
                      <div className="table-message">Item not found</div>
                    ) : (
                      ""
                    )}
                  </div>
                  {suppliers.length !== 0 ? (
                    <div style={{ textAlign: "center" }}>
                      <Paging
                        page={this.fieldSelected.pageNumber}
                        onClickPaging={this.handleClickPaging}
                        onClickSearch={this.handleGetSupplier}
                        itemCount={this.itemCount}
                        listItemLength={suppliers.length}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
}
