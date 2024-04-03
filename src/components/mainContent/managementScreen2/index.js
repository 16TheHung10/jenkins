//Plugin
import React from 'react';

//Custom
import BaseComponent from 'components/BaseComponent';
import Image from 'components/common/Image/Image';
import UploadImageComp from 'components/mainContent/uploadImage';
import { PageHelper, StringHelper } from 'helpers';

class ManagementScreen2 extends BaseComponent {
  constructor(props) {
    super(props);
    this.idComponent = 'managementScreen2' + StringHelper.randomKey();
    this.idComponentUploadImg = 'imgUpload' + StringHelper.randomKey();

    this.fieldSelected = this.assignFieldSelected({
      imageLogo: '',
      imageQR: '',
      imageBanner: '',
      txtSlogan: '',
    });

    this.isAutoload = PageHelper.updateFilters(this.fieldSelected, function (filters) {
      if (filters['date']) {
        filters['date'] = new Date(filters['date']);
      }

      return true;
    });

    this.isRender = true;
  }

  // componentDidMount() {
  //     this.hanldeUpdateState();
  // }

  randomNameImg = () => {
    const currentDate = new Date();
    const timestamp = currentDate.getTime();
    return timestamp;
  };

  // hanldeUpdateState = async () => {
  //     let model = new Screen2Model();
  //     await model.getData().then((res) => {
  //         if (res.status) {

  //         }
  //     });

  //     this.refresh();
  // };

  handleSave = () => {
    const fields = this.fieldSelected;

    let obj = {};

    // var model = new TransactionPaymentModel();
  };

  renderFields() {
    return (
      <div className="form-filter">
        <div className="row">
          <div className="col-md-4">
            <div className="form-group">
              <label className="w100pc">
                <span style={{ paddingRight: 10 }}>Slogan:</span>
              </label>

              <textarea
                type="text"
                autoComplete="off"
                name="txtSlogan"
                onChange={this.handleChangeField}
                className="form-control"
                style={{ minHeight: '50px', resize: 'auto' }}
              ></textarea>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-4">
            <div className="form-group">
              <label className="w100pc">
                <span style={{ paddingRight: 10 }}>Logo image:</span>
              </label>

              <input
                type="file"
                className="form-control form-control-file"
                name="imageLogo"
                onChange={(e) => this.handleUploadImage(e.target.files, 'imageLogo', 'imgLogo')}
              />

              <br />
              <a href={'#'} target="_blank">
                <img name="imgLogo" src={''} style={{ maxWidth: '100%' }} />
              </a>
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label className="w100pc">
                <span style={{ paddingRight: 10 }}>QR image:</span>
              </label>

              <input
                type="file"
                className="form-control form-control-file"
                name="imageQR"
                onChange={(e) => this.handleUploadImage(e.target.files, 'imageQR', 'imgQR')}
              />

              <br />
              <a href={'#'} target="_blank">
                <img name="imgQR" src={''} style={{ maxWidth: '100%' }} />
              </a>
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group">
              <label className="w100pc">
                <span style={{ paddingRight: 10 }}>Banner image:</span>
              </label>

              <input
                type="file"
                className="form-control form-control-file"
                name="imageBanner"
                onChange={(e) => this.handleUploadImage(e.target.files, 'imageBanner', 'imgBanner')}
              />

              <br />
              <a href={'#'} target="_blank">
                <Image name="imgBanner" src={''} style={{ maxWidth: '100%' }} />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  showPpUploadImage = () => {
    this.handleShowPp(this.idComponentUploadImg);
  };

  renderControlItems = () => {
    return (
      <div className="floating-btn">
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <button onClick={this.showPpUploadImage} type="button" className="btn btn-success btn-showpp">
              UPLOAD IMAGE
            </button>
          </div>
        </div>
      </div>
    );
  };

  hanldeResponseImage = (listImgChoose) => {};

  renderComp() {
    return (
      // <section id={this.idComponent}>
      <section>
        {/* {this.renderFields()} */}
        {/* {this.renderControlItems()} */}
        <button onClick={this.showPpUploadImage} type="button" className="btn btn-success btn-showpp">
          1. UPLOAD IMAGE
        </button>
        <UploadImageComp idComponent={this.idComponentUploadImg} responseImage={this.hanldeResponseImage} />
      </section>
    );
  }
}

export default ManagementScreen2;
