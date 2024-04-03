//Plugin
import $ from 'jquery';
import React from 'react';

//Custom
import { Col, Row, Table } from 'antd';
import BaseComponent from 'components/BaseComponent';
import { FileHelper, PageHelper, StringHelper } from 'helpers';
import SmsModel from 'models/SmsModel';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class ManagementScreen2 extends BaseComponent {
  constructor(props) {
    super(props);
    this.idComponent = 'managementScreen2' + StringHelper.randomKey();
    this.idImport = 'import' + StringHelper.randomKey();

    this.importData = [];

    this.fieldSelected = this.assignFieldSelected({
      content: '',
    });

    this.isAutoload = PageHelper.updateFilters(this.fieldSelected, function (filters) {
      if (filters['date']) {
        filters['date'] = new Date(filters['date']);
      }

      return true;
    });

    this.isRender = true;
  }

  finishUploadFile = (textFile) => {
    this.importData = textFile;
    this.refresh();
  };

  cancel = () => {
    this.importData = null;
    $('#' + this.idImport).val(this.importData);
  };

  isValidForSend() {
    return this.importData != null && this.importData.length != 0;
  }

  handleSendImport = () => {
    const fields = this.fieldSelected;

    let stockImport = [];
    if (!this.isValidForSend()) {
      this.showAlert('Please choose file CSV');
      return;
    }

    // stockImport = this.importData.map(item=>{
    //     let itemSplit = item.split(",");
    //     return itemSplit;
    // });

    let obj = {
      content: fields.content,
      // phone: stockImport,
      phone: this.importData,
    };

    var model = new SmsModel();
    model.importv2(obj).then((response) => {
      if (response.status) {
        this.showAlert('File was sent', 'success');
        this.cancel();
      } else {
        this.showAlert(response.message || 'Can not import file');
      }
    });
  };

  renderFields() {
    return (
      <div className="section-block mt-15 mb-15">
        <div className="form-filter">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <div className="form-group">
                    <label className="w100pc">
                      <span style={{ paddingRight: 10 }}>Content:</span>
                    </label>
                    <textarea type="text" autoComplete="off" name="content" onChange={this.handleChangeField} className="form-control" style={{ minHeight: '50px', resize: 'auto' }}></textarea>
                  </div>
                </Col>
                <Col span={24}>
                  <div className="form-group">
                    <label className="w100pc">
                      <span style={{ paddingRight: 10 }}>File csv:</span>
                      <a title="Download file csv" href="https://api.gs25.com.vn:8091/storemanagement/share/template/content/SMSTemplate.csv" target="_blank">
                        <FontAwesomeIcon icon={faQuestionCircle} />
                        Download File CSV
                      </a>
                    </label>
                    <input type="file" className="form-control form-control-file" id={this.idImport} onChange={(e) => FileHelper.uploadFiles(e, this.finishUploadFile)} accept=".csv" />
                  </div>
                  {this.importData?.length > 0 && (
                    <Table
                      pagination={{
                        pageSize: 5,
                        position: ['bottomCenter'],
                      }}
                      dataSource={this.importData?.map((item, index) => ({ phone: item, index }))}
                      columns={[
                        { title: 'STT', dataIndex: '', key: '', render: (text, record, index) => +record.index + 1 },
                        { title: 'Phone number', dataIndex: 'phone', key: 'phone', render: (text, record, index) => (text ? text : '-') },
                      ]}
                    />
                  )}
                </Col>
              </Row>
            </Col>
            <Col span={12}>
              <div className="cl-red bg-note">
                <strong>Lưu ý chức năng</strong>
                <br />
                1. Sử dụng content send SMS đến KH thông qua brand SMS GS25 VN.
                <br />
                2. Phải đăng ký content SMS cho nhà mạng trước khi gửi. (VNPAY SMS).
                <br />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }

  renderComp() {
    return <section id={this.idComponent}>{this.renderFields()}</section>;
  }
}

export default ManagementScreen2;
