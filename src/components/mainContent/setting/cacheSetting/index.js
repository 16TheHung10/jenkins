import BaseComponent from "components/BaseComponent";
import BaseButton from "components/common/buttons/baseButton/BaseButton";
import { DateHelper } from "helpers";
import SettingModel from "models/SettingModel";
import React from "react";

class CacheSetting extends BaseComponent {
  constructor(props) {
    super(props);
    this.isRender = true;
    let dateDefault = new Date();
    this.fieldSelected.date = dateDefault;
    this.listCache = [
      {
        title: "User cache",
        sub: "*menu",
        prefix: "setting",
      },
      //   {
      //     title: 'Internal order cache',
      //     sub: '',
      //     prefix: 'IO',
      //   },
      //   {
      //     title: 'Purchase order cache',
      //     sub: '',
      //     prefix: 'po',
      //   },
      //   {
      //     title: 'Internal transfer cache',
      //     sub: '',
      //     prefix: 'IT',
      //   },
      //   {
      //     title: 'Disposal cache',
      //     sub: '',
      //     prefix: 'dis',
      //   },
      //   {
      //     title: 'Return cache',
      //     sub: '',
      //     prefix: 're',
      //   },
      //   {
      //     title: 'Receiving order cache',
      //     sub: '',
      //     prefix: 'rcv',
      //   },
    ];
  }

  handleClearCache() {
    let settModel = new SettingModel();
    settModel.clearCache().then((response) => {
      this.showAlert(response.message, true);
    });
  }

  handleClearCacheByName(name) {
    let settModel = new SettingModel();
    settModel
      .clearCacheByName(
        name,
        DateHelper.displayDateFormat(this.fieldSelected.date),
      )
      .then((response) => {
        this.showAlert(response.message, true);
      });
  }

  renderComp() {
    var caches = this.listCache;
    return (
      <section className="section-block mt-15 app_container">
        <div className="form-filter">
          <div className="row">
            <div className="col-md-3">
              <div className="form-group">
                <label className="w100pc">Memory cache</label>
                <i>*user permission</i>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <BaseButton
                  iconName="delete"
                  onClick={() => this.handleClearCache()}
                >
                  Clear
                </BaseButton>
              </div>
            </div>
          </div>
          {caches.map((item, i) => (
            <div key={i} className="row">
              <div className="col-md-3">
                <div className="form-group">
                  <label className="w100pc">{this.listCache[i].title}</label>
                  <i>{this.listCache[i].sub}</i>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <BaseButton
                    iconName="delete"
                    onClick={() =>
                      this.handleClearCacheByName(caches[i].prefix)
                    }
                  >
                    Clear
                  </BaseButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }
}

export default CacheSetting;
