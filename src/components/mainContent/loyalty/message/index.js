import BaseComponent from "components/BaseComponent";
import cityJson from "data/json/city.json";
import districtJson from "data/json/district.json";
import wardJson from "data/json/ward.json";
import { DateHelper, PageHelper } from "helpers";
import CommonModel from "models/CommonModel";
import MessageNotifyModel from "models/MessageNotifyModel";
import React from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";

class MessageNotify extends BaseComponent {
  constructor(props) {
    super(props);

    this.isRender = true;
    this.items = [];
    this.page = 1;

    this.cityJson = cityJson;
    this.districtJson = districtJson;
    this.wardJson = wardJson;

    this.optStatus = [
      { label: "Done", value: 0 },
      { label: "Create", value: 1 },
      { label: "Processing", value: 2 },
      { label: "Cancel", value: 3 },
    ];

    this.handleLoadFieldSelected(props);
    this.data.groupTypes = {};
    this.isAutoload = true;
    this.handleSend = this.handleSend.bind(this);
    this.handleClickPaging = this.handleClickPaging.bind(this);
    this.handleLoadMessageResult = this.handleLoadMessageResult.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // if(this.data.groupType != nextProps.groupType || this.data.task != nextProps.task){
    if (this.data.groupType != nextProps.groupType) {
      this.handleLoadFieldSelected(nextProps);
      this.handleLoadMessageResult();
    }
  }

  handleLoadFieldSelected(props) {
    this.data.groupType = props.groupType;
    // this.data.task = props.task;
    let dateDefault = new Date();
    this.fieldSelected = this.assignFieldSelected({
      startDate: dateDefault,
      endDate: dateDefault,
      keyword: "",
      status: 1,
      // page: 1
    });
    PageHelper.updateFilters(this.fieldSelected, function (filters) {
      if (filters["startDate"]) {
        filters["startDate"] = new Date(filters["startDate"]);
      }
      if (filters["endDate"]) {
        filters["endDate"] = new Date(filters["endDate"]);
      }
      return true;
    });

    if (this.data.groupType) {
      this.fieldSelected.groupType = this.data.groupType;
    }
  }

  handleSearch() {
    if (this.fieldSelected.keyword && this.fieldSelected.keyword.length < 2) {
      this.showAlert("Please enter keyword less equal to 2 characters");
      return false;
    }

    if (
      this.fieldSelected.startDate === null ||
      this.fieldSelected.startDate === "" ||
      this.fieldSelected.endDate === null ||
      this.fieldSelected.endDate === ""
    ) {
      this.showAlert("Please enter start & end date to search");
      return false;
    }

    this.page = 1;
    this.handleLoadMessageResult();
    // PageHelper.pushHistoryState(this.fieldSelected);
  }

  componentDidMount() {
    this.handleUpdateState();
    this.handleLoadMessageResult();
  }

  handleUpdateState = async () => {
    let commonModel = new CommonModel();
    await commonModel.getData("messagegrouptype").then((response) => {
      if (response.status && response.data.groupTypes) {
        this.data.groupTypes = response.data.groupTypes;
        this.refresh();
      }
    });
  };

  handleSend() {
    if (
      this.fieldSelected.dateSend === undefined ||
      this.fieldSelected.dateSend === ""
    ) {
      this.showAlert("Please enter date to message");
      return;
    } else {
      let currentTime = new Date();
      let sendTime = new Date(this.fieldSelected.dateSend);

      if (currentTime.getTime() > sendTime.getTime()) {
        this.showAlert(
          "Please enter a send time greater than the current time",
        );
        return;
      }
    }

    if (
      this.fieldSelected.title === undefined ||
      this.fieldSelected.title === ""
    ) {
      this.showAlert("Please enter title message");
      return;
    }

    if (
      this.fieldSelected.message === undefined ||
      this.fieldSelected.message === ""
    ) {
      this.showAlert("Please enter message");
      return;
    }

    // if(this.fieldSelected.groupType === undefined || this.fieldSelected.groupType === ""){
    // 	this.showAlert("Please enter group type");
    // 	return;
    // }

    if (window.confirm("Are you sure you want to send?")) {
      let model = new MessageNotifyModel();
      var inforSaved = {
        startDate: DateHelper.displayFormat(this.fieldSelected.dateSend),
        title: this.fieldSelected.title,
        message: this.fieldSelected.message,
        // groupType : this.fieldSelected.groupType
        groupType: "member",
        messageType: "message",
        city: parseInt(this.fieldSelected.city) || 0,
        district: parseInt(this.fieldSelected.district) || 0,
        ward: parseInt(this.fieldSelected.ward) || 0,
        cityName: this.fieldSelected.cityName || "",
        districtName: this.fieldSelected.districtName || "",
        wardName: this.fieldSelected.wardName || "",
      };

      model.pushMessageMember(inforSaved).then((response) => {
        if (response.status) {
          this.showAlert("Message was sent!", "success");
          this.handleSearch();
        } else {
          this.showAlert(response.message);
        }
      });

      // if(this.isTaskSync()){
      // 	model.pushMessageSyncTask(inforSaved).then(response => {
      //       if(response.status){
      //         this.showAlert("Message was sent!", 'success');
      //         this.handleSearch();
      //       } else {
      //         this.showAlert(response.message);
      //       }
      //     });
      // } else {
      //     model.pushMessage(inforSaved).then(response => {
      //       if(response.status){
      //         this.showAlert("Message was sent!", 'success');
      //         this.handleSearch();
      //       } else {
      //         this.showAlert(response.message);
      //       }
      //     });
      // }
    }
  }

  handleShowMessageDetail(id) {
    if (this.isGroupPos()) {
      super.targetLink("/pos-notify/" + id);
    } else {
      super.targetLink("/message-notify/" + id);
    }
  }

  handleLoadMessageResult = async () => {
    let model = new MessageNotifyModel();

    model
      .getMessagesMember({
        city: this.fieldSelected.citySearch || 0,
        district: this.fieldSelected.districtSearch || 0,
        ward: this.fieldSelected.wardSearch || 0,
        keyword: this.fieldSelected.keyword,
        startDate: DateHelper.displayDateFormat(this.fieldSelected.startDate),
        endDate: DateHelper.displayDateFormat(this.fieldSelected.endDate),
        // "groupType": this.fieldSelected.groupType,
        groupType: "member",
        status: this.fieldSelected.status,
        // "page": this.page
      })
      .then((response) => {
        if (
          response.status &&
          response.data &&
          response.data.messages &&
          response.data.messages.length > 0
        ) {
          this.items = response.data.messages;
          // this.itemCount = response.data.total;
        } else {
          this.items = [];
        }
        this.refresh();
      });
  };

  handleClickPaging(page) {
    this.page = page;
    PageHelper.pushHistoryState("page", page);
  }

  handleUpdateState() {
    this.handleLoadOrderResult();
  }

  // isTaskSync(){
  // 	return this.data.task && this.data.task == "sync";
  // }

  isGroupPos() {
    return this.fieldSelected.groupType == "pos";
  }

  handleChangeCity = (isSearch) => {
    let fields = this.fieldSelected;
    fields.district = "";
    fields.ward = "";

    this.refresh();
  };

  handleChangeDistrict = () => {
    let fields = this.fieldSelected;
    fields.ward = "";

    this.refresh();
  };

  handleChangeCitySearch = () => {
    let fields = this.fieldSelected;
    fields.districtSearch = "";
    fields.wardSearch = "";

    this.refresh();
  };

  handleChangeDistrictSearch = () => {
    let fields = this.fieldSelected;
    fields.wardSearch = "";

    this.refresh();
  };

  handleStyleStatus = (number) => {
    switch (number) {
      case 0:
        return (
          <>
            <span className="label label-success">Done</span>
          </>
        );
      case 1:
        return (
          <>
            <span className="label label-info">Create</span>
          </>
        );
      case 2:
        return (
          <>
            <span className="label label-success">Processing</span>
          </>
        );
      case 3:
        return (
          <>
            <span className="label label-warning">Cancel</span>
          </>
        );
      default:
        return (
          <>
            <span className="label label-default">Unknown</span>
          </>
        );
    }
  };

  handleCancelMessage = async (id) => {
    if (id) {
      let params = { id: parseInt(id) };
      let model = new MessageNotifyModel();
      await model.cancelMessageMember(params).then((res) => {
        if (res.status) {
          this.showAlert(res.message, "success");
          this.handleLoadMessageResult();
        } else {
          this.showAlert(res.message);
        }
        this.refresh();
      });
    }
  };

  handleRenderNameArea = (type, id) => {
    switch (type) {
      case "city":
        let cityName = this.cityJson.filter((el) => el.code == id);
        return cityName.length > 0 ? cityName[0].name : "";
      case "district":
        let districtName =
          id && this.districtJson.filter((el) => el.code == id);
        return districtName.length > 0 ? districtName[0].name : "";
      case "ward":
        let wardName = this.wardJson.filter((el) => el.code == id);
        return wardName.length > 0 ? wardName[0].name : "";
      default:
        return "";
    }
  };

  renderComp() {
    let fields = this.fieldSelected;
    let types = this.data.groupTypes || {};
    let typeKeys = Object.keys(types);
    let typeOptions = [];
    typeOptions = typeKeys.map((key) => {
      return { value: key, label: types[key] };
    });

    // select city send notification -- START --
    let cityOpt =
      this.cityJson.map((el) => ({ value: el.code, label: el.name })) || [];

    let district = this.districtJson.filter(
      (el) => el.province_code == fields.city,
    );
    let districtOpt =
      district.map((el) => ({ value: el.code, label: el.name })) || [];

    let ward = this.wardJson.filter(
      (el) => el.district_code == fields.district,
    );
    let wardOpt = ward.map((el) => ({ value: el.code, label: el.name })) || [];
    // select city send notification -- END --
    // select city search -- START --
    let cityOptSearch =
      this.cityJson.map((el) => ({ value: el.code, label: el.name })) || [];

    let districtSearch = this.districtJson.filter(
      (el) => el.province_code == fields.citySearch,
    );
    let districtOptSearch =
      districtSearch.map((el) => ({ value: el.code, label: el.name })) || [];

    let wardSearch = this.wardJson.filter(
      (el) => el.district_code == fields.districtSearch,
    );
    let wardOptSearch =
      wardSearch.map((el) => ({ value: el.code, label: el.name })) || [];
    // select city search -- END --

    return (
      <section
        className="wrap-section section-block mt-15"
        id={this.idComponent}
      >
        <div className="row header-detail">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            {/* <button onClick={() => super.back('/loyalty')} type="button" className="btn btn-back" style={{ background: 'beige', marginTop: 10 }}>
              Back
            </button> */}
            <h2
              style={{
                margin: "10px",
                display: "inline-block",
                verticalAlign: "top",
              }}
            >
              Notify
            </h2>
          </div>
        </div>
        <div className="row">
          <div className="col-md-3">
            <div className="row">
              <div className="col-md-12">
                <div className="form-group">
                  <label className="w100pc">Date send message:</label>
                  <div className="row">
                    <div className="col-md-12">
                      <DatePicker
                        placeholderText="dd/MM/yyyy"
                        selected={this.fieldSelected.dateSend}
                        onChange={(value) =>
                          this.handleChangeFieldCustom("dateSend", value)
                        }
                        dateFormat="dd/MM/yyyy h:mm aa"
                        timeInputLabel="Time:"
                        showTimeInput
                        minDate={new Date()}
                        className="form-control"
                        isClearable={true}
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <div className="form-group">
                  <label htmlFor="city" className="w100pc">
                    City/District/Ward:
                  </label>
                  <Select
                    classNamePrefix="select"
                    maxMenuHeight={260}
                    placeholder="-- City --"
                    isClearable={true}
                    value={cityOpt.filter(
                      (option) => option.value == fields.city,
                    )}
                    options={cityOpt}
                    onChange={(e) =>
                      this.handleChangeFieldCustom(
                        "city",
                        e ? e.value : "",
                        this.handleChangeCity,
                      )
                    }
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <Select
                    classNamePrefix="select"
                    maxMenuHeight={260}
                    placeholder="-- District --"
                    isClearable={true}
                    value={districtOpt.filter(
                      (option) => option.value == fields.district,
                    )}
                    options={districtOpt}
                    onChange={(e) =>
                      this.handleChangeFieldCustom(
                        "district",
                        e ? e.value : "",
                        this.handleChangeDistrict,
                      )
                    }
                  />
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <Select
                    classNamePrefix="select"
                    maxMenuHeight={260}
                    placeholder="-- Ward --"
                    isClearable={true}
                    value={wardOpt.filter(
                      (option) => option.value == fields.ward,
                    )}
                    options={wardOpt}
                    onChange={(e) =>
                      this.handleChangeFieldCustom("ward", e ? e.value : "")
                    }
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <div className="form-group">
                  <label className="w100pc">Title message</label>
                  <textarea
                    type="text"
                    autoComplete="off"
                    name="title"
                    style={{ minHeight: "50px" }}
                    onChange={this.handleChangeField}
                    className="form-control"
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="form-group">
                  <label className="w100pc">New message</label>
                  <textarea
                    type="text"
                    autoComplete="off"
                    name="message"
                    style={{ minHeight: "50px" }}
                    onChange={this.handleChangeField}
                    className="form-control"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <div className="form-group">
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={this.handleSend}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-9">
            <div className="form-filter">
              <div className="row">
                {/* <div className="col-md-4">
			                		<div className='form-group'>  
					                    <label className='w100pc'>Group type</label>
					                    <Select
				                          classNamePrefix="select"
				                          maxMenuHeight={260}
				                          name="groupType"
				                          isDisabled={this.data.groupType ? true : false}
				                          value={typeOptions.filter(option => option.value === this.fieldSelected.groupType)}
				                          options={typeOptions}
								          isClearable={ true }
				                          onChange={(e) => this.handleChangeFieldCustom("groupType", e ? e.value : '')}/>
					                </div>
			                	</div> */}
                <div className="col-md-8">
                  <div className="form-group">
                    <label className="w100pc">Date:</label>
                    <div className="row ">
                      <div className="col-md-6">
                        <DatePicker
                          placeholderText="From"
                          selected={this.fieldSelected.startDate}
                          onChange={(value) =>
                            this.handleChangeFieldCustom("startDate", value)
                          }
                          dateFormat="dd/MM/yyyy"
                          className="form-control"
                          isClearable={
                            this.fieldSelected.startDate === "" ? false : true
                          }
                          autoComplete="off"
                        />
                      </div>
                      <div className="col-md-6">
                        <DatePicker
                          placeholderText="to"
                          selected={this.fieldSelected.endDate}
                          onChange={(value) =>
                            this.handleChangeFieldCustom("endDate", value)
                          }
                          dateFormat="dd/MM/yyyy"
                          className="form-control"
                          isClearable={
                            this.fieldSelected.endDate === "" ? false : true
                          }
                          autoComplete="off"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="w100pc">Keyword:</label>
                    <input
                      type="text"
                      autoComplete="off"
                      name="keyword"
                      value={this.fieldSelected.keyword || ""}
                      onChange={this.handleChangeField}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <Select
                      classNamePrefix="select"
                      maxMenuHeight={260}
                      isClearable={true}
                      placeholder="-- City --"
                      value={cityOptSearch.filter(
                        (option) => option.value == fields.citySearch,
                      )}
                      options={cityOptSearch}
                      onChange={(e) =>
                        this.handleChangeFieldCustom(
                          "citySearch",
                          e ? e.value : "0",
                          this.handleChangeCitySearch,
                        )
                      }
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <Select
                      classNamePrefix="select"
                      maxMenuHeight={260}
                      isClearable={true}
                      placeholder="-- District --"
                      value={districtOptSearch.filter(
                        (option) => option.value == fields.districtSearch,
                      )}
                      options={districtOptSearch}
                      onChange={(e) =>
                        this.handleChangeFieldCustom(
                          "districtSearch",
                          e ? e.value : "0",
                          this.handleChangeDistrictSearch,
                        )
                      }
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <Select
                      classNamePrefix="select"
                      maxMenuHeight={260}
                      placeholder="-- Ward --"
                      isClearable={true}
                      value={wardOptSearch.filter(
                        (option) => option.value == fields.wardSearch,
                      )}
                      options={wardOptSearch}
                      onChange={(e) =>
                        this.handleChangeFieldCustom(
                          "wardSearch",
                          e ? e.value : "0",
                        )
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-8">
                  <button
                    type="button"
                    onClick={() => this.handleSearch(true)}
                    className="btn btn-success"
                  >
                    Search
                  </button>
                </div>

                <div className="col-md-4">
                  <Select
                    classNamePrefix="select"
                    maxMenuHeight={260}
                    placeholder="-- Status --"
                    isClearable={true}
                    value={this.optStatus.filter(
                      (option) => option.value == fields.status,
                    )}
                    options={this.optStatus}
                    onChange={(e) =>
                      this.handleChangeFieldCustom("status", e ? e.value : "")
                    }
                  />
                </div>
              </div>
            </div>
            <div
              className="wrap-table"
              style={{ maxHeight: "calc(100vh - 295px)", overflow: "auto" }}
            >
              <table
                className="table table-hover detail-search-rcv"
                style={{ fontSize: 12 }}
              >
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Message</th>
                    <th className="rule-date">Created date</th>
                    <th className="rule-date">Date sent</th>
                    <th>City</th>
                    <th>District</th>
                    <th>Ward</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {this.items.map((item, i) => (
                    <tr
                      key={i}
                      // onDoubleClick={() =>this.handleShowMessageDetail(item.id)}
                    >
                      <td>{item.title}</td>
                      <td>{item.message}</td>
                      <td className="rule-date">
                        {DateHelper.displayDateTime(item.createdDate)}
                      </td>
                      <td className="rule-date">
                        {DateHelper.displayDateTime(item.startDate)}
                      </td>
                      <td>{this.handleRenderNameArea("city", item.city)}</td>
                      <td>
                        {this.handleRenderNameArea("district", item.district)}
                      </td>
                      <td>{this.handleRenderNameArea("ward", item.ward)}</td>
                      <td>{item.messageType}</td>
                      <td>{this.handleStyleStatus(item.status)}</td>
                      <td>
                        {item.status === 1 ? (
                          <button
                            type="button"
                            onClick={() => this.handleCancelMessage(item.id)}
                            className="btn btn-success"
                            style={{ backgroundColor: "black", fontSize: 12 }}
                          >
                            Cancel
                          </button>
                        ) : (
                          ""
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {this.items.length == 0 ? (
                <div className="table-message">Item not found</div>
              ) : (
                ""
              )}
            </div>
            {/* {this.items.length !== 0 ? <Paging page={this.page} onClickPaging={this.handleClickPaging} onClickSearch={this.handleLoadMessageResult} 
						itemCount={this.itemCount}/> : ''} */}
          </div>
        </div>
      </section>
    );
  }
}

export default MessageNotify;
