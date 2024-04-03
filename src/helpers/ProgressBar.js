import $ from 'jquery';
import DownloadModel from 'models/DownloadModel';
import AccountState from 'helpers/AccountState';
import { AlertHelper } from 'helpers';

let ProgressBar = {
  instance: null,
  isShow: false,
  downloadUrl: '',
  fileExtension: '',
  trackingUrl: '',
  interval: null,

  init() {
    var downloaded = localStorage.getItem('downloading') ? JSON.parse(localStorage.getItem('downloading')) : null;
    if (downloaded) {
      ProgressBar.start(downloaded['trackingUrl'], downloaded['downloadUrl'], downloaded['fileExtension']);
    }
  },

  start(trackingUrl, downloadUrl = '', fileExtension = '.zip') {
    ProgressBar.trackingUrl = trackingUrl;
    ProgressBar.downloadUrl = downloadUrl;
    ProgressBar.fileExtension = fileExtension;
    localStorage.setItem(
      'downloading',
      JSON.stringify({
        trackingUrl: trackingUrl,
        downloadUrl: downloadUrl,
        fileExtension: fileExtension,
      })
    );
    var isProcessing = false;
    var accessToken = AccountState.getInstance().getAccessToken();
    ProgressBar.showProgress(0);
    ProgressBar.interval = window.setInterval(function () {
      if (!isProcessing) {
        $.ajax({
          url: ProgressBar.trackingUrl,
          cache: false,
          dataType: 'json',
          headers: {
            Authorization: accessToken ? 'Bearer ' + accessToken : null,
          },
        })
          .done(function (response) {
            if (+response.status === 1) {
              var percent = parseInt(response.data.percent, 10);
              ProgressBar.resetValue(percent);
              isProcessing = false;
              if (percent >= 100) {
                window.clearInterval(ProgressBar.interval);
                ProgressBar.download();
                localStorage.setItem('downloading', null);
              }
            } else {
              window.clearInterval(ProgressBar.interval);
              ProgressBar.hide();
              AlertHelper.showAlert('Error! Can not download file.', 'error', false);
            }
          })
          .fail(function () {
            window.clearInterval(ProgressBar.interval);
            ProgressBar.hide();
            localStorage.setItem('downloading', null);
            AlertHelper.showAlert('Error! Can not download file.', 'error', false);
          });
      }
    }, 1000);
  },

  showProgress(value) {
    if (value === undefined) {
      value = 0;
    }

    if (ProgressBar.instance === null) {
      ProgressBar.instance = $(`<div class="load-wrapp">
							<div class="progress" style='min-width:400px;width:60%;margin: 0 auto;position: relative;top: 50%;margin-top: -10px;'>
								<div class="progress-bar progress-bar-info progress-bar-striped active" role="progressbar" aria-valuenow=${value}
								aria-valuemin="0" aria-valuemax="100" style="width:${value}%">
									<span class='status-progress'>${value}% Complete</span>
								</div>
                                
							</div>
                            <div style="text-align:center;margin-top: 10px;position: relative;top: 50%;">
                                <button name="cancelDownload" type="button" class="btn btn-primary" style="display:inline-block">Cancel</button>
                            </div>
						</div>`);

      $('body').append(ProgressBar.instance);
      ProgressBar.instance.find("[name='cancelDownload']").click(function () {
        localStorage.setItem('downloading', null);
        ProgressBar.hide();
        ProgressBar.resetValue(0);
        if (ProgressBar.interval != null) {
          window.clearInterval(ProgressBar.interval);
        }
      });
      ProgressBar.show();
    } else {
      ProgressBar.resetValue(value);
      ProgressBar.show();
    }
  },

  show() {
    if (!ProgressBar.isShow) {
      ProgressBar.instance.show();
      ProgressBar.isShow = true;
    }
  },

  hide() {
    ProgressBar.instance.hide();
    ProgressBar.isShow = false;
  },

  resetValue(value) {
    ProgressBar.instance.find('.progress-bar').css('width', value + '%');
    ProgressBar.instance.find('.progress-bar').attr('aria-valuenow', value);
    ProgressBar.instance.find('.status-progress').html(value + '% Complete');
  },

  download() {
    ProgressBar.hide();
    ProgressBar.resetValue(0);
    if (ProgressBar.downloadUrl && ProgressBar.fileExtension) {
      new DownloadModel().get(ProgressBar.downloadUrl, null, null, ProgressBar.fileExtension);
    }
  },
};

export default ProgressBar;
