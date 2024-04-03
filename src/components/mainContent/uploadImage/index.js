//Plugin
import React from 'react';

//Custom
import BaseComponent from 'components/BaseComponent';
import { PageHelper, StringHelper } from 'helpers';
import UploadImageModel from 'models/UploadImageModel';

class UploadImage extends BaseComponent {
  constructor(props) {
    super(props);
    this.idComponent = this.props.idComponent || 'imgUpload' + StringHelper.randomKey();

    this.fieldSelected = this.assignFieldSelected({
      imgUpload: '',
      imgType: '',
      listImg: [],
      listImgDelete: [],
    });

    this.isAutoload = PageHelper.updateFilters(this.fieldSelected, function (filters) {
      return true;
    });

    this.isRender = true;
  }

  componentDidMount() {
    this.hanldeUpdateState();
  }

  hanldeUpdateState = async () => {
    let model = new UploadImageModel();
    await model.get().then((res) => {
      if (res.status) {
        this.fieldSelected.listImg = res.data.urls;
      }
      this.refresh();
    });
  };

  randomNameImg = () => {
    const currentDate = new Date();
    const timestamp = currentDate.getTime();
    return timestamp;
  };

  resetField = () => {
    const fields = this.fieldSelected;
    fields.imgUpload = '';
    fields.imgType = '';
    fields.listImg = [];
    fields.listImgDelete = [];
  };

  handleGetTypeImage = (file) => {
    const fields = this.fieldSelected;
    file && (fields.imgType = file[0].type.split('/').pop());
    this.refresh();
  };

  handleUploadMedia = async () => {
    const fields = this.fieldSelected;
    let nameImg = this.randomNameImg();

    if (fields.imgUpload === '') {
      this.showAlert('Please choose file image');
      return;
    }

    let obj = {
      imgName: nameImg,
      source: '"' + fields.imgUpload + '"',
    };

    let model = new UploadImageModel();
    await model.post(obj).then((res) => {
      if (res.status) {
        this.resetField();
        this.hanldeUpdateState();
      }
    });
  };

  handleDeleteMedia = async () => {
    const fields = this.fieldSelected;

    if (fields.listImgDelete.length === 0) {
      this.showAlert('Please choose file image to DELETE');
      return;
    }

    // let nameImg = fields.listImgDelete[0].split('/').pop().split('.').shift();
    let nameImg = fields.listImgDelete[0].split('/').pop().split('jpg')[0].slice(0, -1);

    let obj = {
      imgName: nameImg,
    };

    let model = new UploadImageModel();
    await model.delete(obj).then((res) => {
      if (res.status) {
        this.resetField();
        this.hanldeUpdateState();
      }
    });
  };

  hanldeChooseImage = (e) => {
    const target = e.target;
    const fields = this.fieldSelected;
    const urlImg = target.value;

    // if (target.checked) {
    //     fields.listImgDelete.push(urlImg);
    // } else {
    //     let arr = [...fields.listImgDelete];
    //     let newArr = arr.filter( el => el !== urlImg );
    //     fields.listImgDelete = newArr;
    // }
    fields.listImgDelete = [];
    fields.listImgDelete.push(urlImg);

    this.props.responseImage && this.props.responseImage(fields.listImgDelete);
  };

  renderComp() {
    return (
      <section id={this.idComponent} className="popup-form">
        <div className="form-filter">
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label className="w100pc">
                  <span style={{ paddingRight: 10 }}>Upload image:</span>
                </label>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <input
                  type="file"
                  className="form-control form-control-file"
                  name="imgUpload"
                  onChange={(e) => {
                    this.handleUploadImage(e.target.files, 'imgUpload', null);
                    this.handleGetTypeImage(e.target.files);
                  }}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <button type="button" onClick={this.handleUploadMedia} className="btn btn-success" style={{ height: 38 }}>
                  Upload
                </button>
                <button type="button" onClick={this.handleDeleteMedia} className="btn btn-success" style={{ height: 38 }}>
                  Delete
                </button>
              </div>
            </div>
          </div>

          <div className="row">
            {this.fieldSelected.listImg.map((urlImg, index) => (
              <div key={index} className="col-md-3">
                <label
                  style={{
                    cursor: 'pointer',
                    display: 'block',
                    position: 'relative',
                    paddingTop: '100%',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      right: 0,
                      bottom: 0,
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    <img name="igUpload" src={urlImg} style={{ maxWidth: '100%' }} />
                  </span>
                  <input
                    type="radio"
                    value={urlImg}
                    name="imgOption"
                    className="imgOption"
                    onChange={(e) => this.hanldeChooseImage(e)}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                    }}
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
}

export default UploadImage;
