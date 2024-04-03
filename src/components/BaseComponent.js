import React from 'react';
import { Redirect } from 'react-router';
import $ from 'jquery';
import { StringHelper, PageHelper, AlertHelper, CacheHelper } from 'helpers';
import AccountState from 'helpers/AccountState';
class BaseComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.data = {};
    this.fieldSelected = {};
    this.isRender = false;
    this.redirectUrl = '';
    this.handleChangeField = this.handleChangeField.bind(this);
    this.handleChangeFieldCustom = this.handleChangeFieldCustom.bind(this);
    this.handleChecked = this.handleChecked.bind(this);
    this.refresh = this.refresh.bind(this);
    this.targetLink = this.targetLink.bind(this);
    this.targetHome = this.targetHome.bind(this);
    this.handleBlurItemQty = this.handleBlurItemQty.bind(this);
    this.handleNextTabIndex = this.handleNextTabIndex.bind(this);
    this.handleUploadImage = this.handleUploadImage.bind(this);
    this.handleSortItemsClient = this.handleSortItemsClient.bind(this);
    this.handleEnterField = this.handleEnterField.bind(this);

    this.items = [];

    let storeCode = this.getAccountState().getProfile('storeCode');
    let storeName = this.getAccountState().getProfile('storeName');
    if (storeCode) {
      this.fieldSelected.store = storeCode;
      this.fieldSelected.storeCode = storeCode;
    } else {
      this.fieldSelected.store = '';
      this.fieldSelected.storeCode = '';
    }

    if (storeName) {
      this.data.storeName = storeName;
    }
    if (storeCode) {
      this.data.storeCode = storeCode;
    }
  }

  handleEnterField(e, func) {
    if (e.charCode === 13) {
      func();
    }
  }

  handleSortItemsClient(value, fields) {
    let sortOrder = fields.sortOrder;
    let sortBy = fields.sortBy;
    if (sortOrder && sortBy) {
      if (sortOrder == 'asc') {
        this.items.sort((a, b) => (a[sortBy] >= b[sortBy] ? 1 : -1));
        if (this.dataShow !== undefined) this.dataShow.sort((a, b) => (a[sortBy] >= b[sortBy] ? 1 : -1));
      } else {
        this.items.sort((a, b) => (a[sortBy] <= b[sortBy] ? 1 : -1));
        if (this.dataShow !== undefined) this.dataShow.sort((a, b) => (a[sortBy] <= b[sortBy] ? 1 : -1));
      }
    }
  }

  componentDidMount() {
    this.handleSetHeightTable();

    window.addEventListener('resize', this.handleSetHeightTable);
  }

  componentWillUpdate() {
    this.handleSetHeightTable();
    window.addEventListener('resize', this.handleSetHeightTable);
  }

  handleSetHeightTable = () => {
    let hNavBar = 0,
      hTopMenu = 0,
      hHeaderDetail = 0,
      hFormFilter = 0,
      hActionDetail = 0,
      hTable = 0,
      hPagination = 0;
    if (window.innerWidth <= 1366) return;
    setTimeout(() => {
      hNavBar = $('.navbar-fixed-top').length ? (hNavBar = $('.navbar-fixed-top').outerHeight()) : hNavBar;
      hTopMenu = $('.top-menu').length ? (hTopMenu = $('.top-menu').outerHeight()) : hTopMenu;
      hHeaderDetail = $('.header-detail').length ? (hHeaderDetail = $('.header-detail').outerHeight()) : hHeaderDetail;
      hFormFilter = $('.form-filter').length ? (hFormFilter = $('.form-filter').outerHeight()) : hFormFilter;
      hActionDetail = $('.action-detail').length ? (hActionDetail = $('.action-detail').outerHeight()) : hActionDetail;
      hPagination = $('.pagination').length ? (hPagination = $('.pagination').outerHeight()) : hPagination;

      hTable = window.innerHeight - hNavBar - hTopMenu - hHeaderDetail - hFormFilter - hActionDetail - hPagination - 10;

      if ($('.wrap-table.htable').length) {
        // $('.wrap-table.htable').addClass('htableFix');
        // $('.wrap-table.htable').height(hTable);
      }
    }, 250);
  };

  handleChangeField(e, func = undefined) {
    this.fieldSelected[e.target.name] = e.target.value;
    if (func !== undefined) {
      func(e.target.value, this.fieldSelected);
    }
    this.refresh();
  }

  handleChecked(e, func = undefined) {
    this.fieldSelected[e.target.name] = e.target.checked;
    if (func !== undefined) {
      func(e.target.value, this.fieldSelected);
    }
    this.refresh();
  }

  handleMultiChecked(e, func = undefined) {
    if (this.fieldSelected[e.target.name] === undefined || this.fieldSelected[e.target.name] === null) {
      this.fieldSelected[e.target.name] = [];
    }
    if (e.target.checked) {
      if (!this.fieldSelected[e.target.name].includes(e.target.value)) {
        this.fieldSelected[e.target.name].push(e.target.value);
      }
    } else {
      if (this.fieldSelected[e.target.name].includes(e.target.value)) {
        this.fieldSelected[e.target.name].splice(this.fieldSelected[e.target.name].indexOf(e.target.value), 1);
      }
    }
    if (func !== undefined) {
      func(e.target.value, this.fieldSelected);
    }
    this.refresh();
  }

  handleChangeFieldCustom(name, value, func = undefined, func2 = undefined) {
    this.fieldSelected[name] = value;
    if (func !== undefined) {
      func(value, this.fieldSelected);
    }
    if (func2 !== undefined) {
      func2(value, this.fieldSelected);
    }
    this.refresh();
  }

  handleNextTabIndex(e, isClick = false) {
    if (e.charCode === 13) {
      let fieldName = e.target.name;
      let tabIndex = e.target.tabIndex;
      let parent = $(e.target).closest('section');
      let objFocus = $(parent)
        .find("[name='" + fieldName + "']:visible")
        .filter(function () {
          return parseInt($(this).attr('tabindex')) > tabIndex;
        })
        .first();
      let tabIndexNext = parseInt($(objFocus).attr('tabindex'));
      if (isNaN(tabIndexNext) || tabIndexNext == tabIndex) {
        objFocus = $(parent)
          .find("[name='" + fieldName + "']:visible")
          .first();
      }
      objFocus.focus().select();
      if (isClick) {
        $(objFocus).trigger('click');
      }
    }
  }

  handleBlurItemQty(ref, func) {
    var value = StringHelper.escapeQty(ref.target.value);

    if (value >= 0) {
      var max = $(ref.target).attr('max');
      max = max !== undefined && max !== '' ? StringHelper.escapeNumber(max) : 99999;
      if (value > max) {
        AlertHelper.showAlert('Qty is less than ' + max, 'error', true, false);
        ref.target.focus();
        $(ref.target).val(0);
        return 0;
      }
      var step = StringHelper.escapeNumber($(ref.target).attr('step') || 1);
      let oldVal = $(ref.target).attr('oldVal');
      if (value % step !== 0) {
        AlertHelper.showAlert('Qty is invalid', 'error', true, false);
        $(ref.target).val(oldVal || 0);
        return 0;
      } else {
        $(ref.target).attr('oldVal', value);
      }
      if (func !== undefined) {
        func();
      }
    }
    return $(ref.target).val();
  }

  handleBlurItemQtyDecimal(ref, func) {
    var value = StringHelper.escapeQtyDecimal(ref.target.value);

    if (value >= 0) {
      var max = $(ref.target).attr('max');
      max = max !== undefined && max !== '' ? StringHelper.escapeQtyDecimal(max) : 99999;
      if (value > max) {
        AlertHelper.showAlert('Qty is less than ' + max, 'error', true, false);
        ref.target.focus();
        $(ref.target).val(0);
        return 0;
      }
      var step = StringHelper.escapeQtyDecimal($(ref.target).attr('step') || 1);
      let oldVal = $(ref.target).attr('oldVal');
      $(ref.target).attr('oldVal', value);
      if (func !== undefined) {
        func();
      }
    }
    return $(ref.target).val();
  }

  refresh() {
    this.isRender = true;
    if (this.state.countRender === undefined) {
      this.setState({
        countRender: 0,
      });
    } else {
      this.setState({ countRender: this.state.countRender + 1 });
    }
  }

  targetLink(url, historyUrl = '') {
    PageHelper.logHistory(historyUrl ? historyUrl : url);
    let page = PageHelper.getInstance().getValue('page');
    if (page) {
      page.redirect(url);
    } else {
      this.redirect(url);
    }
  }

  targetHome() {
    let page = PageHelper.getInstance().getValue('page');
    if (page) {
      page.redirect('/');
    } else {
      this.redirect('/');
    }
  }

  redirect(url) {
    this.redirectUrl = url;
    this.refresh();
  }

  setRedirectUrl(url) {
    this.redirectUrl = url;
  }

  showAlert(msg, type = 'error', time, click) {
    AlertHelper.showAlert(msg, type, time, click);
  }

  getActionMenu() {
    return PageHelper.getInstance().getValue('action');
  }

  back(url) {
    var backUrl = PageHelper.getInstance().getHistory(window.location.pathname);

    if (backUrl === undefined) {
      backUrl = url;
    }

    this.targetLink(backUrl || url);
  }

  getAccountState() {
    return AccountState.getInstance();
  }

  assignFieldSelected(object, fieldKeys = []) {
    let selects = {};
    for (var i = 0; i < fieldKeys.length; i++) {
      selects[fieldKeys[i]] = this.fieldSelected[fieldKeys[i]];
    }
    return Object.assign(selects, object);
  }

  renderComp() {
    return null;
  }

  render() {
    if (this.redirectUrl !== '') {
      let url = this.redirectUrl;
      this.redirectUrl = '';
      return <Redirect to={url} />;
    }

    if (this.isRender) {
      return this.renderComp();
    }
    return (
      <div className="loading-base">
        Loading{' '}
        <div className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  handleRightClick = (id) => {
    $(id ? '#' + id : document).on('contextmenu', '.rightclick', function (e) {
      e.preventDefault();
      if ($('.context.menu').attr('id')) {
        $('.context.menu#' + id)
          .show()
          .css({
            top: e.clientY + 'px',
            left: e.clientX + 'px',
          });
      } else {
        $('.context.menu')
          .show()
          .css({
            top: e.clientY + 'px',
            left: e.clientX + 'px',
          });
      }

      CacheHelper.getInstance().setValue('currentTarget', e.currentTarget);
      $('.rightclick').removeClass('active');
      $(e.currentTarget).addClass('active');
    });
  };

  getCurrentTarget() {
    return CacheHelper.getInstance().addFetch('currentTarget');
  }

  handleShowPp = (id, isObject = false) => {
    $('.popup-form').hide();
    if (isObject) {
      $(id).show();
    } else {
      $('#' + id).show();
    }
  };

  handleFocus = (e) => {
    $(e.target).select();
    $(e.target).attr('oldVal', e.target.value);
  };

  handleHotKey = (funcHotKey) => {
    let isCtrlHold = false;
    let isShiftHold = false;

    document.onkeyup = function (e) {
      if (e.which === 17) isCtrlHold = false;
      if (e.which === 16) isShiftHold = false;
    };

    document.onkeydown = function (e) {
      if (e.which === 17) isCtrlHold = true;
      if (e.which === 16) isShiftHold = true;

      if (Object.keys(funcHotKey).length !== 0) {
        if (isCtrlHold && e.which === 48) {
          e.preventDefault();
          if (funcHotKey.ppShowProductInfor !== undefined) {
            funcHotKey.ppShowProductInfor();
          }
        }

        if (isCtrlHold && e.which === 49) {
          e.preventDefault();
          if (funcHotKey.ppAddItem !== undefined) {
            funcHotKey.ppAddItem();
          }
        }

        if (isCtrlHold && e.which === 50) {
          e.preventDefault();
          if (funcHotKey.ppFilter !== undefined) {
            funcHotKey.ppFilter();
          }
        }

        if (isShiftHold && e.which === 13) {
          e.preventDefault();
          if (funcHotKey.addItem !== undefined) {
            funcHotKey.addItem();
          }
        }

        if (isCtrlHold && e.which === 13) {
          e.preventDefault();
          if (funcHotKey.addAll !== undefined) {
            funcHotKey.addAll();
          }
        }
      }
    };
  };

  handleUploadImage(files, nameBinary, nameDemo = null) {
    if (
      !(files !== undefined && files[0] !== undefined && (/^image/.test(files[0].type) || /^png/.test(files[0].type)))
    ) {
      this.showAlert('File upload is invalid');
      return;
    }

    if (files[0].size / 1024 > 200) {
      this.showAlert('Max file size < 200KB');
      return;
    }
    var imageDemo = nameDemo !== null ? $('#' + this.idComponent).find("[name='" + nameDemo + "']") : null;
    var reader = new FileReader();
    reader.readAsDataURL(files[0]);
    var fields = this.fieldSelected;
    reader.onloadend = function () {
      fields[nameBinary] = StringHelper.base64Smooth(this.result);
      if (imageDemo) {
        $(imageDemo).attr('src', this.result);
      }
      files = null;
    };
  }

  handleChangeFieldsCustom = (key, e, func = undefined) => {
    let arr = [];
    if (e) {
      e.forEach((element) => {
        arr.push(element.value);
      });
    }

    this.fieldSelected[key] = arr;

    if (func !== undefined) {
      func();
    }
    this.refresh();
  };

  handleBlurIpNumber = (ref, func) => {
    var value = StringHelper.escapeQty(ref.target.value);

    if (value >= 0) {
      var max = $(ref.target).attr('max');
      max = max !== undefined && max !== '' ? StringHelper.escapeNumber(max) : 99999;
      if (value > max) {
        AlertHelper.showAlert('Number is less than ' + max, 'error', true, false);
        ref.target.focus();
        $(ref.target).val(0);
        return 0;
      }
      var step = StringHelper.escapeNumber($(ref.target).attr('step') || 1);
      let oldVal = $(ref.target).attr('oldVal');
      if (value % step !== 0) {
        AlertHelper.showAlert('Number is invalid', 'error', true, false);
        $(ref.target).val(oldVal || 0);
        return 0;
      } else {
        $(ref.target).attr('oldVal', value);
      }
      if (func !== undefined) {
        func();
      }
    }
    return $(ref.target).val();
  };

  handleTabContent = (element) => {
    var i;
    var x = document.getElementsByClassName('detail-tab');
    for (i = 0; i < x.length; i++) {
      x[i].style.display = 'none';
    }
    document.getElementById(element).style.display = 'block';
  };

  onMenuOpen = () => {
    setTimeout(() => {
      const selectedEl = document.getElementsByClassName('MyDropdown__option--is-selected')[0];
      if (selectedEl) {
        selectedEl.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'start',
        });
      }
    }, 15);
  };

  on = (elSelector, eventName, selector, fn) => {
    var element = document.querySelector(elSelector);

    element.addEventListener(eventName, function (event) {
      var possibleTargets = element.querySelectorAll(selector);
      var target = event.target;

      for (var i = 0, l = possibleTargets.length; i < l; i++) {
        var el = target;
        var p = possibleTargets[i];

        while (el && el !== element) {
          if (el === p) {
            return fn.call(p, event);
          }

          el = el.parentNode;
        }
      }
    });
  };
}

export default BaseComponent;
