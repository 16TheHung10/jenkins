import $ from "jquery";

let AlertHelper = {
  isClickOutsite: false,

  showAlert(
    message,
    typemessage = "error",
    autoHide = true,
    clickOutsite = true,
  ) {
    let type = "alert-success";
    let timeOut;
    if (typemessage === "error") type = "alert-danger";
    if (typemessage === "success") type = "alert-success";

    $(".alert").hide();

    let elm =
      `<div class="alert ` +
      type +
      `" role="alert">
			<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>` +
      message +
      `</div>`;

    $(".wrap-alert").append(elm);

    if (autoHide) {
      window.clearTimeout(timeOut);
      timeOut = window.setTimeout(function () {
        $(".alert")
          .fadeTo(0, 0)
          .slideUp(0, function () {
            $(this).remove();
          });
      }, 4000);
    }

    if (clickOutsite && !AlertHelper.isClickOutsite) {
      AlertHelper.isClickOutsite = true;
      $(document).delegate("body", "click", function (e) {
        if (!e.target.closest(".alert") && !e.target.closest(".btn")) {
          $(".alert")
            .fadeTo(0, 0)
            .slideUp(0, function () {
              $(this).remove();
            });
          window.clearTimeout(timeOut);
        }
      });
    }
  },
};

export default AlertHelper;
