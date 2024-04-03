import $ from "jquery";

let Loading = {
  instance: null,

  showLoading(isLoading = true) {
    if (Loading.instance === null) {
      if (isLoading) {
        return;
      }
      Loading.instance = $(`<div class="load-wrapp">
							<div class="load-3">
								<div class="line"></div>
								<div class="line"></div>
								<div class="line"></div>
							</div>
						</div>`);

      $("body").append(Loading.instance);
      isLoading = false;
    }
    isLoading ? Loading.instance.show() : Loading.instance.hide();
  },
};

export default Loading;
