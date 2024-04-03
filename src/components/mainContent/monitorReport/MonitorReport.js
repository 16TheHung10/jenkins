//Plugin
import React from "react";
import Select from "react-select";
//Custom
import { Modal, message } from "antd";
import BaseComponent from "components/BaseComponent";
import { StringHelper } from "helpers";
import Icons from "images/icons";
import MonitorReportModel from "models/MonitorReportModel";
import Moment from "moment";
import CommonModel from "../../../models/CommonModel";

export default class MonitorReport extends BaseComponent {
  constructor(props) {
    super(props);
    this.idComponent =
      this.props.idComponent || "monitorReport" + StringHelper.randomKey();
    this.isRender = true;
    this.dataDevices = [];
    this.dataMonitorReportPosVersion = {};
    this.fieldSelected = this.assignFieldSelected({
      updatedDate: new Date(),
      filterReport: "",
    });
    this.modalTitle = "Version update history";
    this.selectedCounterFileHistory = null;
    this.isModalOpen = false;
    this.historyVersion = [];
    this.handleGetAllPosDevice();
    this.handleGetMonitorReportPosVersion();
  }

  componentDidMount() {}

  componentWillReceiveProps(newProps) {}
  handleGetAllPosDevice = async () => {
    let model = new CommonModel();
    await model.getData("counters").then((res) => {
      if (res.status) {
        this.dataDevices = res.data.counters;
        this.refresh();
      }
    });
  };
  getHistoryVersion = async (type, counterCode) => {
    const model = new MonitorReportModel();
    const res = await model.getVersioHistory(type, counterCode);
    if (res.status) {
      this.selectedCounterFileHistory = res.data.posVersion;
      this.handleOpenModal();
      this.modalTitle =
        "History update " +
        res.data.posVersion.type?.toUpperCase() +
        " - " +
        res.data.posVersion.counterCode;
      this.refresh();
    } else {
      message.error(res.message);
    }
  };
  handleGetMonitorReportPosVersion = async () => {
    let model = new MonitorReportModel();
    await model.getMonitorReportPosVersion().then((res) => {
      if (res.status) {
        this.dataMonitorReportPosVersion = res.data.posVersion;
        this.fieldSelected.updatedDate = res.data.posVersion.updatedDate;
        this.refresh();
      }
    });
  };

  compare(a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  }

  getUpdatedDate(keyword, object) {
    for (const [key, value] of Object.entries(object)) {
      if (keyword == `${key}`) {
        return `${value}`;
      }
    }
  }
  handleOpenModal = () => {
    this.isModalOpen = true;
    this.refresh();
  };
  handleCloseModal = () => {
    this.isModalOpen = false;
    this.refresh();
  };
  renderComp() {
    let dataDevices = Object.values(this.dataDevices || {}).sort(this.compare);
    let contentMonitorReport;
    let fields = this.fieldSelected;
    let dataReportPosVersion = [];
    if (this.dataMonitorReportPosVersion.content && this.dataDevices) {
      dataReportPosVersion = [];
      contentMonitorReport = JSON.parse(
        this.dataMonitorReportPosVersion.content,
      );
      for (let i = 0; i < dataDevices.length; i++) {
        for (let j = 0; j < dataDevices[i]?.length; j++) {
          let updateDate =
            this.getUpdatedDate(
              dataDevices[i][j].counterCode,
              contentMonitorReport.pos,
            ) != undefined
              ? Moment(
                  this.getUpdatedDate(
                    dataDevices[i][j].counterCode,
                    contentMonitorReport.pos,
                  ),
                ).format("DD/MM/YYYY HH:mm:ss")
              : "";
          let item = {
            PosName: dataDevices[i][j].counterCode,
            UpdateDate: updateDate,
            PosVersion: contentMonitorReport.posVersion.oldVersion?.find(
              (el) => el === dataDevices[i][j].counterCode,
            )
              ? {
                  value: "Async version",
                  type: contentMonitorReport.posVersion?.type,
                }
              : { value: "" },
            PosSyncVersion:
              contentMonitorReport.posSyncVersion.oldVersion?.find(
                (el) => el === dataDevices[i][j].counterCode,
              )
                ? {
                    value: "Async version",
                    type: contentMonitorReport.posSyncVersion?.type,
                  }
                : { value: "" },
            UpdatetorMessage:
              contentMonitorReport.updatorMessageVersion.oldVersion?.find(
                (el) => el === dataDevices[i][j].counterCode,
              )
                ? {
                    value: "Async version",
                    type: contentMonitorReport.updatorMessageVersion?.type,
                  }
                : { value: "" },
            ItemMasterDataVersion:
              contentMonitorReport.itemMasterDataVersion.oldVersion?.find(
                (el) => el === dataDevices[i][j].counterCode,
              )
                ? "Async version"
                : "",
            PartnerPromotionDataVersion:
              contentMonitorReport.partnerPromotionDataVersion.oldVersion?.find(
                (el) => el === dataDevices[i][j].counterCode,
              )
                ? "Async version"
                : "",
            PosPromotionDataVersion:
              contentMonitorReport.posPromotionDataVersion.oldVersion?.find(
                (el) => el === dataDevices[i][j].counterCode,
              )
                ? "Async version"
                : "",
          };
          dataReportPosVersion.push(item);
        }
      }
    }
    let filterReportOptions = [
      { value: 0, label: "Missing Request Log Today" },
      { value: 1, label: "Missing Pos Version" },
      { value: 2, label: "Missing Pos Sync Version" },
      { value: 3, label: "Missing Updator Message" },
      { value: 4, label: "Missing Item Master Version" },
      { value: 5, label: "Missing Partner Promotion Version" },
      { value: 6, label: "Missing Pos Promotion Version" },
    ];
    switch (fields.filterReport) {
      case 0:
        dataReportPosVersion = dataReportPosVersion.filter((item) => {
          return item.UpdateDate == "";
        });
        break;
      case 1:
        dataReportPosVersion = dataReportPosVersion.filter((item) => {
          return item.PosVersion.value == "Async version";
        });
        break;
      case 2:
        dataReportPosVersion = dataReportPosVersion.filter((item) => {
          return item.PosSyncVersion.value == "Async version";
        });
        break;
      case 3:
        dataReportPosVersion = dataReportPosVersion.filter((item) => {
          return item.UpdatetorMessage.value == "Async version";
        });
        break;
      case 4:
        dataReportPosVersion = dataReportPosVersion.filter((item) => {
          return item.ItemMasterDataVersion == "Async version";
        });
        break;
      case 5:
        dataReportPosVersion = dataReportPosVersion.filter((item) => {
          return item.PartnerPromotionDataVersion == "Async version";
        });
        break;
      case 6:
        dataReportPosVersion = dataReportPosVersion.filter((item) => {
          return item.PosPromotionDataVersion == "Async version";
        });
        break;
      case "":
        break;
    }
    return (
      <section id={this.idComponent}>
        <div className="section-block mt-15  mb-15">
          <div className="row ">
            <div className="col-md-12">
              <h2
                style={{
                  marginTop: 10,
                  marginBottom: 10,
                  display: "inline-block",
                  verticalAlign: "middle",
                }}
              >
                {this.dataMonitorReportPosVersion.title}
                {
                  <span
                    htmlFor="updatedDate"
                    className="w100pc"
                    style={{ fontSize: 14, fontWeight: "normal" }}
                  >
                    {" "}
                    Updated Date:{" "}
                    <span>
                      {Moment(fields.updatedDate).format("DD/MM/YYYY HH:mm:ss")}
                    </span>
                  </span>
                }
              </h2>
            </div>
          </div>
          <div className="form-filter">
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="filterReport" className="w100pc">
                        {" "}
                        Filter By:
                      </label>
                      <Select
                        isClearable
                        classNamePrefix="select"
                        maxMenuHeight={260}
                        placeholder="-- All --"
                        value={filterReportOptions.filter(
                          (option) => option.value === fields.filterReport,
                        )}
                        options={filterReportOptions}
                        onChange={(e) =>
                          this.handleChangeFieldCustom(
                            "filterReport",
                            e ? e.value : "",
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="section-block">
          {" "}
          <div
            className="wrap-table htable"
            style={{ maxHeight: "calc(100vh - 270px)" }}
          >
            <table className="table table-hover">
              <thead>
                <tr>
                  <th
                    rowSpan={2}
                    style={{ backgroundColor: "var(--primary-color)" }}
                  ></th>
                  <th
                    rowSpan={2}
                    style={{ backgroundColor: "var(--primary-color)" }}
                  >
                    Counter
                  </th>
                  <th
                    rowSpan={2}
                    style={{ backgroundColor: "var(--primary-color)" }}
                  >
                    Request Date
                  </th>

                  <th
                    colSpan={3}
                    style={{ backgroundColor: "var(--primary-color)" }}
                    className="text-center"
                  >
                    {" "}
                    Software update
                  </th>

                  <th
                    colSpan={3}
                    style={{ backgroundColor: "var(--primary-color)" }}
                    className="text-center"
                  >
                    Data synchronization
                  </th>
                </tr>
                <tr>
                  <th
                    style={{ backgroundColor: "var(--primary-color)" }}
                    className="text-center"
                  >
                    <div className="flex items-center gap-10">
                      <span> POS Version</span>
                      <Icons.EyeOpen
                        className="cursor-pointer hover_scale"
                        onClick={() => {
                          const data = [];
                          for (let key of Object.keys(
                            contentMonitorReport?.posVersion?.metaSoft || {},
                          )) {
                            data.push(
                              `${key} - ${contentMonitorReport?.posVersion?.metaSoft[key]}`,
                            );
                          }
                          this.selectedCounterFileHistory = {
                            content:
                              data?.length > 0 ? JSON.stringify(data) : "",
                          };
                          this.handleOpenModal();
                          this.modalTitle = "File Deployed of POS";
                          this.refresh();
                        }}
                      />
                    </div>
                  </th>
                  <th
                    style={{ backgroundColor: "var(--primary-color)" }}
                    className="text-center"
                  >
                    <div className="flex items-center gap-10">
                      <span>POS Sync</span>
                      <Icons.EyeOpen
                        className="cursor-pointer hover_scale"
                        onClick={() => {
                          const data = [];
                          for (let key of Object.keys(
                            contentMonitorReport?.posSyncVersion?.metaSoft ||
                              {},
                          )) {
                            data.push(
                              `${key} - ${contentMonitorReport?.posSyncVersion?.metaSoft[key]}`,
                            );
                          }
                          this.selectedCounterFileHistory = {
                            content:
                              data?.length > 0 ? JSON.stringify(data) : "",
                          };
                          this.handleOpenModal();
                          this.modalTitle = "File Deployed of POS Sync";
                          this.refresh();
                        }}
                      />
                    </div>
                  </th>
                  <th
                    style={{
                      backgroundColor: "var(--primary-color)",
                      borderRight: "1px solid",
                    }}
                    className="text-center"
                  >
                    <div className="flex items-center gap-10">
                      <span>Updator Message</span>
                      <Icons.EyeOpen
                        className="cursor-pointer hover_scale"
                        onClick={() => {
                          const data = [];
                          for (let key of Object.keys(
                            contentMonitorReport?.updatorMessageVersion
                              ?.metaSoft || {},
                          )) {
                            data.push(
                              `${key} - ${contentMonitorReport?.updatorMessageVersion?.metaSoft[key]}`,
                            );
                          }
                          this.selectedCounterFileHistory = {
                            content:
                              data?.length > 0 ? JSON.stringify(data) : "",
                          };
                          this.handleOpenModal();
                          this.modalTitle = "File Deployed of updator message";
                          this.refresh();
                        }}
                      />
                    </div>
                  </th>
                  <th
                    style={{ backgroundColor: "var(--primary-color)" }}
                    className="text-center"
                  >
                    Item Master
                  </th>
                  <th
                    style={{ backgroundColor: "var(--primary-color)" }}
                    className="text-center"
                  >
                    Partner Promotion
                  </th>
                  <th
                    style={{ backgroundColor: "var(--primary-color)" }}
                    className="text-center"
                  >
                    Pos Promotion
                  </th>
                </tr>
              </thead>
              <tbody>
                {dataReportPosVersion.map((device, i) => {
                  return (
                    <tr key={i} style={{ backgroundColor: "unset" }}>
                      <td></td>
                      <td>{device.PosName}</td>
                      <td>{device.UpdateDate}</td>
                      <td style={{ color: "Red" }} className="text-center">
                        {device.PosVersion.value ? (
                          <div className="flex items-center gap-10">
                            <p className="m-0 cursor-pointer">
                              {device.PosVersion.value}
                            </p>
                            <Icons.EyeOpen
                              className="cursor-pointer hover_scale"
                              onClick={() =>
                                this.getHistoryVersion(
                                  device.PosVersion.type,
                                  device.PosName,
                                )
                              }
                            />
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td style={{ color: "Red" }} className="text-center">
                        {device.PosSyncVersion.value ? (
                          <div className="flex items-center gap-10">
                            <p className="m-0 cursor-pointer">
                              {device.PosSyncVersion.value}
                            </p>
                            <Icons.EyeOpen
                              className="cursor-pointer hover_scale"
                              onClick={() =>
                                this.getHistoryVersion(
                                  device.PosSyncVersion.type,
                                  device.PosName,
                                )
                              }
                            />
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td style={{ color: "Red" }} className="text-center">
                        {device.UpdatetorMessage.value ? (
                          <div className="flex items-center gap-10">
                            <p className="m-0 cursor-pointer">
                              {device.UpdatetorMessage.value}
                            </p>
                            <Icons.EyeOpen
                              className="cursor-pointer hover_scale"
                              onClick={() =>
                                this.getHistoryVersion(
                                  device.UpdatetorMessage.type,
                                  device.PosName,
                                )
                              }
                            />
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td style={{ color: "Red" }} className="text-center">
                        {device.ItemMasterDataVersion}
                      </td>
                      <td style={{ color: "Red" }} className="text-center">
                        {device.PartnerPromotionDataVersion}
                      </td>
                      <td style={{ color: "Red" }} className="text-center">
                        {device.PosPromotionDataVersion}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {dataReportPosVersion.length === 0 ? (
              <div className="table-message">Item not found</div>
            ) : (
              ""
            )}
          </div>
        </div>
        <Modal
          title={this.modalTitle || "Version update history"}
          open={this.isModalOpen}
          onCancel={this.handleCloseModal}
          footer={false}
        >
          <div className="" style={{ maxHeight: "500px", overflow: "auto" }}>
            {this.selectedCounterFileHistory?.content
              ? JSON.parse(this.selectedCounterFileHistory.content).map(
                  (item, index) => {
                    return (
                      <div key={item}>
                        <p>{item}</p>
                        <hr />
                      </div>
                    );
                  },
                )
              : null}
          </div>
        </Modal>
      </section>
    );
  }
}
