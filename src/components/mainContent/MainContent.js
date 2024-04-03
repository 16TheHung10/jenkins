import BaseComponent from 'components/BaseComponent';
import ErrorBoundary from 'components/layouts/error/ErrorBoundary';
import { AppContext } from 'contexts/AppContext';
import { PageHelper, UrlHelper } from 'helpers';
import $ from 'jquery';
import React, { lazy } from 'react';

import BuildComponent from 'pages/buildComponent';
import ReportABCClassification from 'pages/reporting/ReportABCClassification';
import ReportItemMaster from 'pages/reporting/ReportItemMaster';
import ReportLoyalty from 'pages/reporting/ReportLoyalty';
import ReportLoyaltyStore from 'pages/reporting/ReportLoyaltyStore';
import SmsReport from 'pages/reporting/SmsReport';
import SupplierMaster from 'pages/reporting/SupplierMaster';
import VoucherReport from 'pages/reporting/VoucherReport';
import PageMktSaleByCategoryPage from 'pages/reporting/mktReport/PageMktSaleByCategory';
import PageMktSummaryByPaymentPage from 'pages/reporting/mktReport/PageMktSummaryByPayment';
import ReportCampaignPromotion from 'pages/reporting/mktReport/ReportCampaignPromotion';
import ReportCurrentInventoryMKT from 'pages/reporting/mktReport/ReportCurrentInventoryMKT';
import ReportMKTPromotionTrans from 'pages/reporting/mktReport/ReportMktPromotionTrans';
import ApiCallerCommon from '../../contexts/ApiCallerCommon';
import { DataProvider } from '../../contexts/DataContext';
import AppWrapper from '../layouts/wrapper/app/AppWrapper';
import Wiki from '../common/wiki/Wiki';
import { routerRef } from 'App';

const Iframe = lazy(() => import('pages/externalIFrame'));
const FCMaster = lazy(() => import('pages/fc/fcMaster'));
const StoreTargetKPI = lazy(() => import('pages/storeTargetKPI/search'));
const StoreTargetKPIImport = lazy(() => import('pages/storeTargetKPI/import'));
const FCMasterCreate = lazy(() => import('pages/fc/fcMasterCreate'));
const FCMasterImport = lazy(() => import('pages/fc/fcMasterImport/FCMasterImport'));
const FCMasterDetails = lazy(() => import('pages/fc/fcMasterUpdate'));
const LoyaltyNotifyPage = lazy(() => import('pages/loyalty/LoyaltyNotify'));
const LogisticsStoreOrderPage = lazy(() => import('pages/logistics/LogisticsStoreOrder'));
const LogisticsStoreOrderDetailPage = lazy(() => import('pages/logistics/LogisticsStoreOrderDetail'));
const LogisticsOrderSupplierPage = lazy(() => import('pages/logistics/LogisticsOrderSupplier'));
const LogisticsOrderSupplierDetailPage = lazy(() => import('pages/logistics/LogisticsOrderSupplierDetail'));
const StaffManagement = lazy(() => import('pages/staffManagement/StaffManagement'));
const StaffDetailPage = lazy(() => import('pages/staffManagement/StaffDetail'));
const PosDataPromotionManagement = lazy(() => import('pages/posData/PromotionManagement'));
const PosDataPromotionDetail = lazy(() => import('pages/posData/PromotionDetail'));
const StoreManagement = lazy(() => import('pages/store/StoreManagement'));
const StoreDetail = lazy(() => import('pages/store/StoreDetail'));
const SupplierManagement = lazy(() => import('pages/supplier/SupplierManagement'));
const SupplierDetail = lazy(() => import('pages/supplier/SupplierDetail'));
const ItemMasterHistoryChangePrice = lazy(() => import('pages/itemMaster/ItemMasterHistoryChangePrice'));
const ItemMasterImport = lazy(() => import('pages/itemMaster/ItemMasterImport'));
const ItemMasterDetail = lazy(() => import('pages/itemMaster/ItemMasterDetail'));
const ItemMasterDetailsV2 = lazy(() => import('pages/itemMaster/v2/details/ItemMasterDetailsV2'));
const ItemMaster = lazy(() => import('pages/itemMaster/ItemMaster'));
const ItemMasterByStore = lazy(() => import('pages/itemMaster/v2/store/ItemMasterByStore.jsx'));
const ItemMasterByStoreImport = lazy(() => import('pages/itemMaster/v2/import/store/ItemMasterV2ImportStore.jsx'));
const ItemMasterByStoreImportForOPOFC = lazy(() => import('pages/itemMaster/v2/import/ofc/ItemMasterV2ImportOFC'));
const ImportItemPrice = lazy(() => import('pages/itemMaster/v2/import/price/ItemMasterV2ImportPrice.jsx'));
const ImportItemOrder = lazy(() => import('pages/itemMaster/v2/import/order/ItemMasterV2ImportOrder.jsx'));
const ImportItemSold = lazy(() => import('pages/itemMaster/v2/import/sold/ItemMasterV2ImportSold.jsx'));
const ItemMasterHistoryChangeSellingPrice = lazy(() =>
  import('pages/itemMaster/v2/historyChangeSellingPrice/ItemMasterHistoryChangeSellingPrice.jsx')
);
const ItemMasterByFF = lazy(() => import('pages/itemMaster/v2/ff/ItemMasterByFF.jsx'));
const ImportAttributesItem = lazy(() => import('pages/itemMaster/ImportAttributesItem'));
const CreateIMNormal = lazy(() => import('pages/itemMaster/ItemMasterCreateNormal'));
const ChangePriceItem = lazy(() => import('pages/itemMaster/ItemMasterChangePrice'));
const UserDetail = lazy(() => import('pages/user/UserDetail'));
const UserManagement = lazy(() => import('pages/user/UserManagement'));
const EditMenuUser = lazy(() => import('pages/user/EditMenuUser'));
const Operation = lazy(() => import('pages/store/Operation/Operation'));
const StoreDetailV2 = lazy(() => import('pages/store/StoreDetailV2'));
const Dashboard = lazy(() => import('pages/dashboard/Dashboard'));
const OperationStoreDetails = lazy(() => import('pages/store/Operation/OperationStoreDetails'));
const OperationStoreCreate = lazy(() => import('pages/store/Operation/OperationStoreCreate'));
const SOHDashboard = lazy(() => import('pages/SOH/Dashboard/SOHDashboard'));
const PromotionTotalBill = lazy(() => import('pages/promotion/TotalBill/PromotionTotalBill'));
const PromotionTotalBillCreate = lazy(() => import('pages/promotion/TotalBill/PromotionTotalBillCreate'));
const PromotionTotalBillEdit = lazy(() => import('pages/promotion/TotalBill/PromotionTotalBillEdit'));
const ReportStoreSalesProcessAsync = lazy(() => import('pages/reporting/ReportStoreSalesProcessAsync'));
const Setting = lazy(() => import('pages/setting/Setting'));
const Permission = lazy(() => import('pages/setting/Permission'));
const ManageDevicePage = lazy(() => import('pages/manageDevice/ManageDevicePage'));
const MessageNotify = lazy(() => import('pages/messageNotify/MessageNotify'));
const StoreConfigPage = lazy(() => import('pages/storeConfig/StoreConfigPage'));
const PosLog = lazy(() => import('pages/messageLog/PosLog'));
const MonitorReportPage = lazy(() => import('pages/monitorReport/MonitorReportPage'));
const MessageNotifyDetail = lazy(() => import('pages/messageNotify/MessageNotifyDetail'));
const ReportSaleLogPage = lazy(() => import('pages/reporting/ReportSaleLogPage'));
const PromotionDiscountVoucherPage = lazy(() => import('pages/promotion/PromotionDiscountVoucher'));
const PromotionDiscountVoucherPageDetail = lazy(() => import('pages/promotion/PromotionDiscountVoucherDetail'));
const PromotionDiscountItemPage = lazy(() => import('pages/promotion/PromotionDiscountItem'));
const PromotionDetailPage = lazy(() => import('pages/promotion/PromotionDetail'));
const ReportPromotionPage = lazy(() => import('pages/promotion/ReportPromotion'));
const PromotionDiscountCouponPage = lazy(() => import('pages/promotion/PromotionDiscountCoupon'));
const PromotionDiscountCouponPageDetail = lazy(() => import('pages/promotion/PromotionDiscountCouponDetail'));
const PromotionDiscountBuyBillPage = lazy(() => import('pages/promotion/PromotionDiscountBuyBill'));
const PromotionDiscountBuyBillPageDetail = lazy(() => import('pages/promotion/PromotionDiscountBuyBillDetail'));
const PromotionBuyOneGetOnePage = lazy(() => import('pages/promotion/PromotionBuyOneGetOne'));
const PromotionBuyOneGetOnePageDetail = lazy(() => import('pages/promotion/PromotionBuyOneGetOneDetail'));
const PromotionPrimeTime = lazy(() => import('pages/promotion/PrimeTime/PrimeTimePromotion'));
const PromotionPrimeTimeCreate = lazy(() => import('pages/promotion/PrimeTime/PrimeTimeCreate'));
const PromotionPrimeTimeEdit = lazy(() => import('pages/promotion/PrimeTime/PrimeTimeEdit'));

const PromotionMixABMatchCPageSearch = lazy(() => import('pages/promotion/mixABMatchC/search'));
const PromotionMixABMatchCCreate = lazy(() => import('pages/promotion/mixABMatchC/create'));
const PromotionMixABMatchCPageUpdate = lazy(() => import('pages/promotion/mixABMatchC/update'));
const PromotionMixABMatchCPageCopy = lazy(() => import('pages/promotion/mixABMatchC/copy'));

const PromotionMixAndMatchPage = lazy(() => import('pages/promotion/PromotionMixAndMatch'));
const PromotionMixAndMatchPageDetail = lazy(() => import('pages/promotion/PromotionMixAndMatchDetail'));
const PromotionDiscountComboPage = lazy(() => import('pages/promotion/PromotionDiscountComboItem'));
const PromotionDiscountComboPageDetail = lazy(() => import('pages/promotion/PromotionDiscountComboItemDetail'));
const PromotionDetailDiscountItemPage = lazy(() => import('pages/promotion/PromotionDiscountItemDetail'));
const PromotionDetailDiscountListPage = lazy(() => import('pages/promotion/PromotionDetailDiscountList'));
const PromotionCheckinSearchPage = lazy(() => import('pages/promotion/PromotionCheckinSearch'));
const PromotionCheckinPage = lazy(() => import('pages/promotion/PromotionCheckin'));
const CicoManagement = lazy(() => import('pages/cico/CicoPage'));
const CustomerService = lazy(() => import('pages/customerService/CustomerService'));
const PageNotFound = lazy(() => import('pages/common/PageNotFound'));
const PageMessage = lazy(() => import('pages/common/PageMessage'));
const PageCallback = lazy(() => import('pages/common/PageCallback'));
const UserManual = lazy(() => import('pages/userManual'));
const Payroll = lazy(() => import('pages/payroll/Payroll'));
const TransactionPayment = lazy(() => import('pages/transactionPayment/TransactionPayment'));
const ManagementScreen2 = lazy(() => import('pages/managementScreen2/ManagementScreen2'));
const SMS = lazy(() => import('pages/sms/SMS'));
const VoucherApp = lazy(() => import('pages/voucherApp/VoucherApp'));
const CheckVoucher = lazy(() => import('pages/checkVoucher'));
const FCManagement = lazy(() => import('pages/fcManagement/FranchiseManagement'));
const FCManagementCreate = lazy(() => import('pages/fcManagement/FranchiseManagementCreate'));
const FCManagementEdit = lazy(() => import('pages/fcManagement/FranchiseManagementEdit'));
const Loyalty = lazy(() => import('pages/loyalty/LoyaltyManagement'));
const LoyaltyDetailPage = lazy(() => import('pages/loyalty/LoyaltyDetail'));
const LoyaltyVoucherDetailPage = lazy(() => import('pages/loyalty/LoyaltyDetail'));
const LoyaltyMergePage = lazy(() => import('pages/loyalty/LoyaltyMemberMerge'));
const LoyaltyReportPage = lazy(() => import('pages/loyalty/LoyaltyReport'));
const LoyaltyMemberPage = lazy(() => import('pages/loyalty/LoyaltyMember'));
const LoyaltyTransLogPage = lazy(() => import('pages/loyalty/LoyaltyTransLog'));
const LoyaltyHighestPointPage = lazy(() => import('pages/loyalty/LoyaltyHighestPoint'));
const LoyaltyRedeemVoucher = lazy(() => import('pages/loyalty/LoyaltyRedeemVoucher'));
const PromotionPage = lazy(() => import('pages/promotion/Promotion'));
const PromotionDiscountListPage = lazy(() => import('pages/promotion/PromotionDiscountList'));
const ContentPage = lazy(() => import('pages/contentPage/ContentPage'));
const Login = lazy(() => import('pages/common/Login'));
const Voucher = lazy(() => import('pages/voucher/Voucher'));
const CheckInHistory = lazy(() => import('pages/CheckInHistory'));
const FeedbackManagement = lazy(() => import('pages/feedback'));
const Loggings = lazy(() => import('pages/logging'));
const BillManagementPage = lazy(() => import('pages/bill/BillManagement'));
const BillManagementCustomerPage = lazy(() => import('pages/bill/BillManagementCustomer'));
const RefundPage = lazy(() => import('pages/bill/Refund'));
const Campaign = lazy(() => import('pages/campaign'));
const CampaignCreate = lazy(() => import('pages/campaign/createCampaign'));
const CampaignEdit = lazy(() => import('pages/campaign/editCampaign'));

const RequestCancelBills = lazy(() => import('pages/bill/requestCancelBills'));
const RequestCancelAccounts = lazy(() => import('pages/customerService/requestCancelAccount'));
// Reporting
const ReportItemMasterMD = lazy(() => import('pages/reporting/ReportItemMasterMD'));
const SupplierMasterMD = lazy(() => import('pages/reporting/SupplierMasterMD'));
const ReportMDPromotionTrans = lazy(() => import('pages/reporting/ReportMDPromotionTrans'));
const ReportMktPromotion = lazy(() => import('pages/reporting/mktReport/ReportMktPromotion'));
const ReportCurrentInventory = lazy(() => import('pages/reporting/ReportCurrentInventory'));
const EstimateStock = lazy(() => import('pages/reporting/EstimateStock'));
const StockMovement = lazy(() => import('pages/reporting/StockMovement'));
const OrderSchedule = lazy(() => import('pages/orderSchedule/OrderSchedulePage'));
const PageOpSaleDetailMDPage = lazy(() => import('pages/reporting/PageOpSaleDetailMD'));
const PageOpDispocalMDPage = lazy(() => import('pages/reporting/PageOpDispocalMD'));
const PageOpSaleByCategoryMDPage = lazy(() => import('pages/reporting/PageOpSaleByCategoryMD'));
const PageOpPaymentByStoreMDPage = lazy(() => import('pages/reporting/PageOpPaymentByStoreMD'));
const PageOpSummaryByPaymentMDPage = lazy(() => import('pages/reporting/PageOpSummaryByPaymentMD'));
const PageOpDetailMonthMDPage = lazy(() => import('pages/reporting/PageOpDetailMonthMD'));
const PageOpSaleCombineItemMD = lazy(() => import('pages/reporting/PageOpSaleCombineItemMD'));

const DigitalSignageTV = lazy(() => import('pages/digitalSignage/tv'));
const DigitalSignageDailyLog = lazy(() => import('pages/digitalSignage/tvLog'));
const DigitalSignageMedia = lazy(() => import('pages/digitalSignage/media'));
const DigitalSignageMediaGroup = lazy(() => import('pages/digitalSignage/mediaGroup'));

const EcommerceItem = lazy(() => import('pages/ecommerce/item/search'));
const EcommerceItemImport = lazy(() => import('pages/ecommerce/item/import'));
const EcommerceItemCreate = lazy(() => import('pages/ecommerce/item/create'));
const EcommerceItemUpdate = lazy(() => import('pages/ecommerce/item/update'));

const EcommerceGroup = lazy(() => import('pages/ecommerce/group/search'));
const EcommerceGroupCreate = lazy(() => import('pages/ecommerce/group/create'));
const EcommerceGroupUpdate = lazy(() => import('pages/ecommerce/group/update'));

const LoyaltyItemRedeems = lazy(() => import('pages/loyalty/itemRedeem/search'));
const LoyaltyItemRedeemsCreate = lazy(() => import('pages/loyalty/itemRedeem/create'));
const LoyaltyItemRedeemsUpdate = lazy(() => import('pages/loyalty/itemRedeem/update'));

const EcommerceCategoriesSearch = lazy(() => import('pages/ecommerce/category/search/EcommerceCategoriesSearch'));
const EcommerceCategoryCreate = lazy(() => import('pages/ecommerce/category/create'));
const EcommerceCategoryUpdate = lazy(() => import('pages/ecommerce/category/update'));

const EcommerceOrders = lazy(() => import('pages/ecommerce/orders/search'));
const EcommerceBanners = lazy(() => import('pages/ecommerce/banner'));
const EcommerceOrdersUpdate = lazy(() => import('pages/ecommerce/orders/update'));
const InternalFCRegister = lazy(() => import('pages/internal/fcRegister'));
const InternalMatBang = lazy(() => import('pages/internal/matBang'));
const InternalQualityControl = lazy(() => import('pages/internal/qualityControl'));
const PaymentMethods = lazy(() => import('pages/payment'));
const ReportMDPromotionTransMD = lazy(() => import('pages/reporting/mdReport/ReportMDPromotionTrans'));
const ReportMktPromotionMD = lazy(() => import('pages/reporting/mdReport/ReportMktPromotion'));
const ReportMKTPromotionTopMD = lazy(() => import('pages/reporting/mdReport/ReportMktPromotionTop'));
const OrderScheduleMD = lazy(() => import('pages/reporting/mdReport/OrderSchedulePage'));
const TVNotify = lazy(() => import('pages/digitalSignage/tvNotify'));
const TVITReport = lazy(() => import('pages/digitalSignage/tvITReport'));

export const mainContentRef = React.createRef(null);
export const scrollToTop = () => {
  mainContentRef.current.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};
class MainContent extends BaseComponent {
  constructor(props) {
    super(props);
    this.isRender = true;
    PageHelper.getInstance().addFetch('page', this);
  }

  componentDidMount() {
    $('.popup-form').css({
      'max-height': window.innerHeight - 62,
    });

    $(window).resize(function () {
      $('.popup-form').css({
        'max-height': window.innerHeight - 62,
      });
    });

    document.addEventListener('click', (e) => {
      var className = e.target.className + '';
      if (
        className.indexOf('allow-popup') === -1 &&
        !e.target.closest(
          '.popup-form, .select__option, .btn-showpp, .react-datepicker__day, .react-datepicker__close-icon'
        )
      ) {
        closeFn();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.which === 27) {
        closeFn();
      }
    });

    function closeFn() {
      $('.popup-form').hide();
      $('.context.menu').hide();
    }
  }

  renderPage(param) {
    switch (param) {
      case 'Iframe':
        return <Iframe />;
      case 'MKTPromotionTopMD':
        return <ReportMKTPromotionTopMD />;
      case 'MKTPromotionMD':
        return <ReportMktPromotionMD />;
      case 'MDPromotionTransMD':
        return <ReportMDPromotionTransMD />;
      case 'TVITReport':
        return <TVITReport />;
      case 'DigitalSignageDailyLog':
        return <DigitalSignageDailyLog />;
      case 'DigitalSignageTV':
        return <DigitalSignageTV />;
      case 'DigitalSignageMedia':
        return <DigitalSignageMedia />;
      case 'DigitalSignageMediaGroup':
        return <DigitalSignageMediaGroup />;
      case 'PaymentMethods':
        return <PaymentMethods />;
      case 'MKTPromotionTrans':
        return <ReportMKTPromotionTrans />;
      case 'InternalFCRegister':
        return <InternalFCRegister />;
      case 'InternalMatBang':
        return <InternalMatBang />;
      case 'InternalQualityControl':
        return <InternalQualityControl />;

      case 'LoyaltyItemRedeems':
        return <LoyaltyItemRedeems />;
      case 'LoyaltyItemRedeemsCreate':
        return <LoyaltyItemRedeemsCreate />;
      case 'LoyaltyItemRedeemsUpdate':
        return <LoyaltyItemRedeemsUpdate />;

      case 'EcommerceBanners':
        return <EcommerceBanners />;
      case 'EcommerceOrders':
        return <EcommerceOrders />;
      case 'EcommerceOrdersUpdate':
        return <EcommerceOrdersUpdate />;
      case 'EcommerceItem':
        return <EcommerceItem />;
      case 'EcommerceItemImport':
        return <EcommerceItemImport />;
      case 'EcommerceItemCreate':
        return <EcommerceItemCreate />;
      case 'EcommerceItemUpdate':
        return <EcommerceItemUpdate />;

      case 'EcommerceGroup':
        return <EcommerceGroup />;
      case 'EcommerceGroupCreate':
        return <EcommerceGroupCreate />;
      case 'EcommerceGroupUpdate':
        return <EcommerceGroupUpdate />;

      case 'EcommerceCategory':
        return <EcommerceCategoriesSearch />;
      case 'EcommerceCategoryCreate':
        return <EcommerceCategoryCreate />;
      case 'EcommerceCategoryUpdate':
        return <EcommerceCategoryUpdate />;

      case 'BuildComponent':
        return <BuildComponent />;
      // MKT Report
      case 'SmsReport':
        return <SmsReport />;
      case 'SupplierMaster':
        return <SupplierMaster />;
      case 'CurrentInventoryMKT':
        return <ReportCurrentInventoryMKT />;
      case 'PageMktSaleByCategory':
        return <PageMktSaleByCategoryPage />;
      case 'PageMktSummaryByPayment':
        return <PageMktSummaryByPaymentPage />;
      case 'ReportLoyalty':
        return <ReportLoyalty />;
      case 'ReportLoyaltyStore':
        return <ReportLoyaltyStore />;
      case 'CampaignPromotion':
        return <ReportCampaignPromotion />;
      case 'StoreTargetKPIImport':
        return <StoreTargetKPIImport />;
      case 'StoreTargetKPI':
        return <StoreTargetKPI />;
      case 'ABCClassification':
        return <ReportABCClassification />;
      case 'ReportItemMaster':
        return <ReportItemMaster />;
      case 'VoucherReport':
        return <VoucherReport />;
      // End MKT Report
      // Report
      case 'MdReportItemMaster':
        return <ReportItemMasterMD type="md" />;
      case 'MdSupplierMaster':
        return <SupplierMasterMD type="md" />;
      case 'MDPromotionTrans':
        return <ReportMDPromotionTrans />;
      case 'MKTPromotion':
        return <ReportMktPromotion />;
      case 'CurrentInventory':
        return <ReportCurrentInventory />;
      case 'EstimateStock':
        return <EstimateStock />;
      case 'StockMovement':
        return <StockMovement />;
      case 'PageOpSaleDetailMD':
        return <PageOpSaleDetailMDPage type="md" />;
      case 'PageOpDispocalMD':
        return <PageOpDispocalMDPage type="md" />;
      case 'PageOpSaleByCategoryMD':
        return <PageOpSaleByCategoryMDPage type="md" />;
      case 'PageOpPaymentByStoreMD':
        return <PageOpPaymentByStoreMDPage type="md" />;
      case 'PageOpSummaryByPaymentMD':
        return <PageOpSummaryByPaymentMDPage type="md" />;
      case 'PageOpDetailMonthMD':
        return <PageOpDetailMonthMDPage type="md" />;
      case 'ReportSaleCombineItemMD':
        return <PageOpSaleCombineItemMD type="md" />;

      case 'OrderSchedule':
        return <OrderSchedule />;
      // End Report
      case 'OrderScheduleMD':
        return <OrderScheduleMD />;
      // SETTING
      case 'FCMaster':
        return <FCMaster />;
      case 'FCMasterCreate':
        return <FCMasterCreate />;
      case 'FCMasterImport':
        return <FCMasterImport />;
      case 'FCMasterDetails':
        return <FCMasterDetails />;
      case 'RequestCancelBills':
        return <RequestCancelBills />;
      case 'RequestCancelAccounts':
        return <RequestCancelAccounts />;
      case 'CheckInHistory':
        return <CheckInHistory {...this.props} />;
      case 'Campaign':
        return <Campaign />;
      case 'CampaignCreate':
        return <CampaignCreate />;
      case 'CampaignEdit':
        return <CampaignEdit />;
      case 'Loggings':
        return <Loggings />;

      case 'POSNotify':
        return <MessageNotify groupType="pos" />;
      case 'QuickPosNotify':
        return <MessageNotifyDetail groupType="pos" task="quick" />;
      case 'TVNotify':
        return <TVNotify />;

      case 'MonitorReport':
        return <MonitorReportPage />;
      case 'PosLog':
        return <PosLog />;
      case 'ReportStoreSalesProcessAsync':
        return <ReportStoreSalesProcessAsync />;
      case 'StoreConfig':
        return <StoreConfigPage />;
      case 'MessageNotify':
        return <MessageNotify />;
      case 'FCManagement':
        return <FCManagement />;
      case 'FCManagementCreate':
        return <FCManagementCreate />;
      case 'FCManagementEdit':
        return <FCManagementEdit />;
      case 'ReportSaleLog':
        return <ReportSaleLogPage />;
      case 'Setting':
        return <Setting />;
      case 'Permission':
        return <Permission />;
      case 'DeviceManagement':
        return <ManageDevicePage />;
      // END SETTING
      case 'Voucher':
        return <Voucher />;
      case 'CheckVoucher':
        return <CheckVoucher />;
      case 'StoreOperation':
        return <Operation />;
      case 'OperationStoreDetails':
        return <OperationStoreDetails />;
      case 'OperationStoreCreate':
        return <OperationStoreCreate />;
      case 'ContentPage':
        // return <ContentPage type={this.props.type} template={this.props.template} content={this.props.content} />;
        return <ContentPage type={this.props.match.params.type} />;
      case 'StoreConvert':
        return <StoreDetailV2 />;
      case 'CustomerService':
        return <CustomerService {...this.props} />;
      case 'Login':
        return <Login />;
      case 'PageNotFound':
        return <PageNotFound />;
      case 'PageMessage':
        return <PageMessage type={this.props.match.params.type} />;
      case 'PageCallback':
        return <PageCallback type={this.props.match.params.type} {...this.props} />;
      case 'Payroll':
        return <Payroll />;
      case 'HOPayroll':
        return <Payroll type="ho" />;
      case 'TransactionPayment':
        return <TransactionPayment />;
      case 'ManagementScreen2':
        return <ManagementScreen2 />;
      case 'SMS':
        return <SMS />;
      case 'VoucherApp':
        return <VoucherApp />;
      case 'Promotion':
        return <PromotionPage type={this.props.type} />;
      case 'PromotionTotalBill':
        return <PromotionTotalBill />;
      case 'PromotionTotalBillCreate':
        return <PromotionTotalBillCreate />;
      case 'PromotionTotalBillEdit':
        return <PromotionTotalBillEdit />;
      case 'PromotionDiscountBuyBill':
        return <PromotionDiscountBuyBillPage type={this.props.type} />;
      case 'PromotionDiscountBuyBillDetail':
        return (
          <PromotionDiscountBuyBillPageDetail type={this.props.type} orderCode={this.props.match.params.orderCode} />
        );

      // case "PromotionDiscountList":
      //     return <PromotionDiscountListPage type={this.props.type} />;
      case 'PromotionDiscountVoucher':
        return <PromotionDiscountVoucherPage type={this.props.type} />;
      case 'PromotionDiscountVoucherDetail':
        return (
          <PromotionDiscountVoucherPageDetail type={this.props.type} orderCode={this.props.match.params.orderCode} />
        );

      case 'PromotionDiscountCoupon':
        return <PromotionDiscountCouponPage type={this.props.type} />;
      case 'PromotionDiscountCouponDetail':
        return (
          <PromotionDiscountCouponPageDetail type={this.props.type} orderCode={this.props.match.params.orderCode} />
        );

      case 'PromotionMixABMatchC':
        return <PromotionMixABMatchCPageSearch />;
      case 'PromotionMixABMatchCPageDetail':
        return <PromotionMixABMatchCCreate />;
      case 'PromotionMixABMatchCPageUpdate':
        return <PromotionMixABMatchCPageUpdate />;
      case 'PromotionMixABMatchCPageCopy':
        return <PromotionMixABMatchCPageCopy />;

      case 'PromotionMixAndMatch':
        return <PromotionMixAndMatchPage type={this.props.type} />;
      case 'PromotionMixAndMatchDetail':
        return <PromotionMixAndMatchPageDetail type={this.props.type} orderCode={this.props.match.params.orderCode} />;

      case 'PromotionDiscountCombo':
        return <PromotionDiscountComboPage type={this.props.type} />;
      case 'PromotionDiscountComboDetail':
        return (
          <PromotionDiscountComboPageDetail type={this.props.type} orderCode={this.props.match.params.orderCode} />
        );

      case 'PromotionDiscountItem':
        return <PromotionDiscountItemPage type={this.props.type} />;

      case 'PromotionDetail':
        return <PromotionDetailPage type={this.props.type} orderCode={this.props.match.params.orderCode} />;
      case 'ReportPromotion':
        return <ReportPromotionPage type={this.props.type} />;
      case 'PromotionCheckinSearch':
        return <PromotionCheckinSearchPage type={this.props.type} />;
      case 'PromotionCheckin':
        return <PromotionCheckinPage type={this.props.type} />;

      case 'PromotionBuyOneGetOne':
        return <PromotionBuyOneGetOnePage type={this.props.type} />;
      case 'PromotionBuyOneGetOneDetail':
        return <PromotionBuyOneGetOnePageDetail type={this.props.type} orderCode={this.props.match.params.orderCode} />;

      case 'PromotionPrimeTime':
        return <PromotionPrimeTime type={this.props.type} />;
      case 'PromotionPrimeTimeCreate':
        return <PromotionPrimeTimeCreate type={this.props.type} />;
      case 'PromotionPrimeTimeEdit':
        return <PromotionPrimeTimeEdit type={this.props.type} />;

      case 'SOHDashboard':
        return <SOHDashboard type={this.props.type} />;
      case 'PromotionDetailDiscountItem':
        return <PromotionDetailDiscountItemPage type={this.props.type} orderCode={this.props.match.params.orderCode} />;

      case 'PromotionDetailDiscountList':
        return <PromotionDetailDiscountListPage type={this.props.type} orderCode={this.props.match.params.orderCode} />;

      case 'Loyalty':
        return <Loyalty type={this.props.type} />;
      case 'LoyaltyDetail':
        return <LoyaltyDetailPage type={this.props.type} memberCode={this.props.match.params.memberCode} />;
      case 'LoyaltyVoucherDetail':
        return <LoyaltyVoucherDetailPage type={this.props.type} memberCode={this.props.match.params.memberCode} />;
      case 'LoyaltyMerge':
        return <LoyaltyMergePage type={this.props.type} />;
      case 'LoyaltyReport':
        return <LoyaltyReportPage type={this.props.type} />;
      case 'LoyaltyMember':
        return <LoyaltyMemberPage type={this.props.type} />;
      case 'LoyaltyTransLog':
        return <LoyaltyTransLogPage type={this.props.type} />;
      case 'LoyaltyHighestPoint':
        return <LoyaltyHighestPointPage type={this.props.type} />;
      case 'LoyaltyRedeemVoucher':
        return <LoyaltyRedeemVoucher type={this.props.type} />;
      case 'CicoManagement':
        return <CicoManagement />;
      case 'LoyaltyNotify':
        return <LoyaltyNotifyPage />;
      case 'LogisticsStoreOrder':
        return <LogisticsStoreOrderPage type={this.props.type} />;
      case 'LogisticsStoreOrderDetail':
        return <LogisticsStoreOrderDetailPage type={this.props.type} poCode={this.props.match.params.poCode} />;
      case 'LogisticsOrderSupplier':
        return <LogisticsOrderSupplierPage type={this.props.type} />;
      case 'LogisticsOrderSupplierDetail':
        return <LogisticsOrderSupplierDetailPage type={this.props.type} poCode={this.props.match.params.poCode} />;
      case 'StaffManagement':
        return <StaffManagement type={this.props.type} />;
      case 'CreateStaff':
        return <StaffDetailPage type={this.props.type} />;
      case 'DetailStaff':
        return (
          <StaffDetailPage
            type={this.props.type}
            staffCode={this.props.match.params.staffCode}
            status={this.props.match.params.status}
            storeCode={this.props.match.params.storeCode}
          />
        );
      case 'PosDataPromotionDetail':
        return (
          <PosDataPromotionDetail
            type={this.props.type}
            partners={this.props.match.params.partners}
            indexPromotion={this.props.match.params.id}
          />
        );
      case 'PosDataPromotionCreate':
        return <PosDataPromotionDetail type={this.props.type} partners={this.props.match.params.partners} />;
      case 'PosDataPromotionManagement':
        return <PosDataPromotionManagement type={this.props.type} partners={this.props.match.params.partners} />;
      case 'StoreManagement':
        return <StoreManagement type={this.props.type} />;
      case 'StoreCreate':
        return <StoreDetail type="Create" />;
      case 'StoreDetail':
        return <StoreDetail type="Update" storeCode={this.props.match.params.storeCode} />;
      case 'SupplierManagement':
        return <SupplierManagement type={this.props.type} />;
      case 'SupplierCreate':
        return <SupplierDetail type="Create" />;
      case 'SupplierDetail':
        return <SupplierDetail type="Update" supplierCode={this.props.match.params.supplierCode} />;
      case 'DistributorCreate':
        return <SupplierDetail type="CreateDistributor" distributorCode={this.props.match.params.supplierCode} />;
      case 'ItemMaster':
        return <ItemMaster type={this.props.type} version={this.props.version} />;
      case 'ItemMasterByStore':
        return <ItemMasterByStore />;
      case 'ItemMasterByStoreImport':
        return <ItemMasterByStoreImport />;
      case 'ItemMasterByStoreImportForOPOFC':
        return <ItemMasterByStoreImportForOPOFC />;
      case 'ImportItemOrder':
        return <ImportItemOrder />;
      case 'ImportItemSold':
        return <ImportItemSold />;
      case 'ImportItemPrice':
        return <ImportItemPrice />;
      case 'ItemMasterHistoryChangeSellingPrice':
        return <ItemMasterHistoryChangeSellingPrice />;
      case 'ItemMasterByFF':
        return <ItemMasterByFF />;
      case 'ItemMasterImport':
        return <ItemMasterImport type={this.props.type} />;
      case 'ImportAttributesItem':
        return <ImportAttributesItem type={this.props.type} />;
      case 'ItemMasterHistoryChangePrice':
        return <ItemMasterHistoryChangePrice type={this.props.type} />;
      case 'ItemMasterDetail':
        return <ItemMasterDetail type={this.props.type} code={this.props.match.params.code} />;
      case 'ItemMasterDetailV2':
        return <ItemMasterDetailsV2 type={this.props.type} code={this.props.match.params.code} />;
      case 'CreateIMNormal':
        return <CreateIMNormal type={this.props.type} code={this.props.match.params.code} />;

      case 'ChangePriceItem':
        return <ChangePriceItem type={this.props.type} />;
      case 'UserManual':
        return <UserManual />;
      case 'User':
        return <UserDetail userID={this.props.match.params.userID} />;
      case 'UserManagement':
        return <UserManagement />;
      case 'UserEditMenu':
        return <EditMenuUser />;
      case 'FeedbackManagement':
        return <FeedbackManagement />;
      case 'BillManagement':
        return <BillManagementPage />;
      case 'BillManagementCustomer':
        return <BillManagementCustomerPage />;
      case 'RefundOrder':
        return <RefundPage />;
      default:
        return <Dashboard />;
    }
  }

  renderComp() {
    const contextValue = this.context;
    const isCollapse = contextValue.state.isMenuCollapsed;
    const searchObject = UrlHelper.getSearchParamsObject();
    return (
      <div
        id="main-content"
        style={{
          marginTop: this.props.isIframe ? '-46px' : '',
          width:
            searchObject.iframeMode === 'true'
              ? '100%'
              : this.props.isIframe
              ? '100%'
              : isCollapse
              ? 'calc(100vw - 70px)'
              : 'calc(100vw - 256px)',
        }}
        ref={mainContentRef}
      >
        <div
          className="col-xs-12 col-sm-12 col-md-12 col-lg-12 flex flex-col h-full"
          style={{ padding: searchObject.iframeMode === 'true' ? '0' : 'auto' }}
        >
          <ErrorBoundary fallback={<div>Something went wrong</div>}>
            <AppWrapper>
              <DataProvider>
                <ApiCallerCommon />

                {this.renderPage(this.props.page)}
              </DataProvider>
            </AppWrapper>
          </ErrorBoundary>
        </div>
        <div id="notificationAlert" className="notification-alert"></div>
      </div>
    );
  }
}
MainContent.contextType = AppContext;

export default MainContent;
