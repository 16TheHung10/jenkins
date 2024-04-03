import StringHelper from "helpers/StringHelper";
import $ from "jquery";

let ProgressBarTracking = {
  instance: null,
  isShow: false,
  percent: "",
  fileExtension: "",
  trackingUrl: "",
  interval: null,

  init() {
    // var downloaded = localStorage.getItem("downloadingTracking") ? JSON.parse(localStorage.getItem("downloadingTracking")) : null;
    // if (downloaded) {
    //     // this.start(downloaded['trackingUrl'], downloaded['percent'], downloaded['fileExtension']);
    // }
  },

  // start(trackingUrl, downloadUrl = "", fileExtension = '.zip') {
  start(percent, length, step) {
    // var isProcessing = false;
    let pc = percent;

    ProgressBarTracking.showProgress();
    ProgressBarTracking.resetValue(parseFloat((percent * step).toFixed(2)));
    // isProcessing = false;
    if (pc >= 100) {
      // window.clearInterval(ProgressBarTracking.interval);
      // localStorage.setItem("downloadingTracking", null);
      ProgressBarTracking.hide();
      ProgressBarTracking.resetValue(0);
    }

    pc += percent;
  },

  showProgress(value) {
    if (value === undefined) {
      value = 0;
    }

    if (ProgressBarTracking.instance === null) {
      ProgressBarTracking.instance = $(`<div class="load-wrapp">
							<div class="progress" style='min-width:400px;width:60%;margin: 0 auto;position: relative;top: 50%;margin-top: -10px;'>
								<div class="progress-bar progress-bar-info progress-bar-striped active" role="progressbar" aria-valuenow=${value}
								aria-valuemin="0" aria-valuemax="100" style="width:${value}%">
									<span class='status-progress'>${StringHelper.formatPercent(
                    value,
                  )}% Complete</span>
								</div>
                                
							</div>
                            <div style="text-align:center;margin-top: 10px;position: relative;top: 50%;">
                                <button name="cancelDownload" type="button" class="btn btn-primary" style="display:inline-block">Cancel</button>
                            </div>
						</div>`);

      $("body").append(ProgressBarTracking.instance);
      ProgressBarTracking.instance
        .find("[name='cancelDownload']")
        .click(function () {
          // localStorage.setItem("downloadingTracking", null);
          ProgressBarTracking.hide();
          ProgressBarTracking.resetValue(0);
          ProgressBarTracking.instance = null;
          // console.log(ProgressBarTracking.instance)
          // if (ProgressBarTracking.interval != null) {
          //     window.clearInterval(ProgressBarTracking.interval);
          // }
        });
      ProgressBarTracking.show();
    } else {
      ProgressBarTracking.resetValue(value);
      ProgressBarTracking.show();
    }
  },

  show() {
    if (!ProgressBarTracking.isShow) {
      ProgressBarTracking.instance.show();
      ProgressBarTracking.isShow = true;
    }
  },

  hide() {
    if (ProgressBarTracking.instance !== null) {
      ProgressBarTracking.instance.hide();
      ProgressBarTracking.isShow = false;
    }
  },

  resetValue(value) {
    ProgressBarTracking.instance
      .find(".progress-bar")
      .css("width", value + "%");
    ProgressBarTracking.instance
      .find(".progress-bar")
      .attr("aria-valuenow", value);
    ProgressBarTracking.instance
      .find(".status-progress")
      .html(value + "% Complete");
  },

  // download() {
  //     ProgressBarTracking.hide();
  //     ProgressBarTracking.resetValue(0);
  //     // if (ProgressBarTracking.downloadUrl && ProgressBarTracking.fileExtension) {
  //     //     new DownloadModel().get(ProgressBarTracking.downloadUrl, null, null, ProgressBarTracking.fileExtension);
  //     // }
  // }
};

export default ProgressBarTracking;
