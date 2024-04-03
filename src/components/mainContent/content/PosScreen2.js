//Plugin
import React from 'react';

//Custom
import { Col, Row } from 'antd';
import BaseComponent from 'components/BaseComponent';
import Image from 'components/common/Image/Image';
import UploadImageComp from 'components/mainContent/uploadImage';
import { PageHelper, StringHelper } from 'helpers';
import ContentModel from 'models/ContentModel';

class PosScreen2 extends BaseComponent {
  constructor(props) {
    super(props);
    this.idComponent = 'PosScreen2' + StringHelper.randomKey();
    this.idComponentUploadImg = 'imgUpload' + StringHelper.randomKey();
    this.contentObj = JSON.parse(this.props.content.content) || {};
    this.fieldSelected = this.assignFieldSelected({
      welcome: this.contentObj.welcome && (this.contentObj.welcome.value || ''),
      videourl: this.contentObj.videourl && (this.contentObj.videourl.value || ''),
      logourl: this.contentObj.logourl && (this.contentObj.logourl.value || ''),
      bannerurl: this.contentObj.bannerurl && (this.contentObj.bannerurl.value || ''),
      appurl: this.contentObj.appurl && (this.contentObj.appurl.value || ''),
      fieldResponseImg: '',
    });

    this.isAutoload = PageHelper.updateFilters(this.fieldSelected, function (filters) {
      return true;
    });

    this.isRender = true;
  }

  componentWillReceiveProps = (newProps) => {
    // if (newProps.content !== this.content) {
    //     this.template = newProps.template;
    // }
  };

  handleSave = () => {
    const fields = this.fieldSelected;
    const type = this.props.type;

    let banner = {
      value: fields.bannerurl,
      type: 'image',
    };

    let qr = {
      value: fields.appurl,
      type: 'qrcode',
    };

    let logo = {
      value: fields.logourl,
      type: 'image',
    };

    let slogan = {
      value: fields.welcome,
      type: 'text',
    };

    let link = {
      value: fields.videourl,
      type: 'text',
    };

    let obj = {
      bannerurl: banner,
      welcome: slogan,
      appurl: qr,
      logourl: logo,
      videourl: link,
    };

    let params = {
      content: JSON.stringify(obj),
    };

    let model = new ContentModel();
    model.putList(type, params).then((res) => {
      if (res.status) {
        this.showAlert(res.message, 'success');
      } else {
        this.showAlert(res.message);
      }
    });
  };

  showPpUploadImage = (field) => {
    this.fieldSelected.fieldResponseImg = field;
    this.handleShowPp(this.idComponentUploadImg);
    this.refresh();
  };

  renderFields() {
    return (
      <div className="form-filter">
        {this.props.content.updatedBy ? (
          <div className="w-full mb-15" style={{ textDecoration: 'underline' }}>
            <span>Updated by: </span> <span className="font-bold m-0"> {this.props.content.updatedBy} </span>{' '}
            <span className="hint"> at {this.props.content.updatedDate}</span>
          </div>
        ) : null}
        <Row gutter={[15, 15]}>
          <Col span={8}>
            <div className="section-block">
              <div className="form-group">
                <label className="w100pc mb-15">
                  <span style={{ paddingRight: 10 }}>Logo image:</span>
                  <button
                    type="button"
                    className="btn btn-success btn-showpp"
                    onClick={() => this.showPpUploadImage('logourl')}
                  >
                    Change
                  </button>
                </label>

                <br />
                <a className="mt-15" href={this.fieldSelected.logourl || '#'} target="_blank">
                  <img
                    name="imgLogo"
                    src={this.fieldSelected.logourl || ''}
                    alt="Logo GS25"
                    style={{ maxWidth: '100%' }}
                  />
                </a>
              </div>
            </div>
          </Col>

          <Col span={16}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div className="section-block">
                  <div className="form-group">
                    <label className="w100pc">
                      <span style={{ paddingRight: 10 }}>Slogan:</span>
                    </label>

                    <textarea
                      type="text"
                      autoComplete="off"
                      name="welcome"
                      onChange={this.handleChangeField}
                      className="form-control"
                      style={{ minHeight: '50px', resize: 'auto' }}
                      value={this.fieldSelected.welcome}
                    ></textarea>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="section-block">
                  <div className="form-group">
                    <label className="w100pc">
                      <span style={{ paddingRight: 10 }}>QR image:</span>
                    </label>

                    <textarea
                      type="text"
                      autoComplete="off"
                      name="appurl"
                      onChange={this.handleChangeField}
                      className="form-control"
                      style={{ minHeight: '50px', resize: 'auto' }}
                      value={this.fieldSelected.appurl}
                    ></textarea>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="section-block h-full">
                  <div className="form-group">
                    <label className="w100pc">
                      <span style={{ paddingRight: 10 }}>Banner image: </span>
                      <button
                        type="button"
                        className="btn btn-success btn-showpp"
                        onClick={() => this.showPpUploadImage('bannerurl')}
                      >
                        Change
                      </button>
                    </label>
                    <br />
                    <a href={this.fieldSelected.bannerurl || '#'} target="_blank">
                      {this.fieldSelected.bannerurl ? (
                        <Image
                          name="imgBanner"
                          alt={'Banner image'}
                          src={this.fieldSelected.bannerurl || ''}
                          style={{ maxWidth: '100%', marginTop: 15 }}
                        />
                      ) : null}
                    </a>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="section-block">
                  <div className="form-group">
                    <label className="w100pc">
                      <span style={{ paddingRight: 10 }}>
                        Link video: (Please input full link Youtube. Example:
                        https://www.youtube.com/watch?v=5sX8GFpMgB0)
                      </span>
                    </label>

                    <textarea
                      type="text"
                      autoComplete="off"
                      name="videourl"
                      onChange={this.handleChangeField}
                      className="form-control"
                      style={{ minHeight: '50px', resize: 'auto' }}
                      value={this.fieldSelected.videourl}
                    ></textarea>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }

  hanldeResponseImage = (listImgChoose) => {
    this.handleChangeFieldCustom(this.fieldSelected.fieldResponseImg, listImgChoose[0]);
  };

  renderComp() {
    return (
      <>
        <section id={this.idComponent}>
          {this.renderFields()}

          <UploadImageComp idComponent={this.idComponentUploadImg} responseImage={this.hanldeResponseImage} />
        </section>
      </>
    );
  }
}

export default PosScreen2;
