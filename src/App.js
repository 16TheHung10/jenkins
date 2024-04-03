import { Col, Row } from 'antd';
import 'antd/dist/antd.css';
import SuspenLoading from 'components/common/loading/SuspenLoading';
import Header from 'components/layouts/header/Header';
import MainContent from 'components/mainContent/MainContent';
import ContextComposer from 'contexts/ContextComposer';
import Errors from 'pages/errors';
import React, { Suspense } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { QueryCache, QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import '../src/styles/antdOveride.css';
import '../src/styles/fade-transition.css';
import '../src/styles/smIcon.scss';
import '../src/styles/styleTab.scss';
import './App.css';
import './ModalDrawer.css';
import SidebarMenu from './components/layouts/sidebar/SidebarMenu';
import { AppContext } from './contexts/AppContext';
import AppWrapper from 'components/layouts/wrapper/app/AppWrapper';
import RenderRoute from 'components/layouts/renderRoute/RenderRoute';

export const routerRef = React.createRef();
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  renderRoute(pageName, content, isShowHeader = true, isShowSlideBar = true, preLoad = false) {
    return (
      <RenderRoute isShowSlideBar={isShowSlideBar} isShowHeader={isShowHeader} pageName={pageName} preLoad={preLoad}>
        {content}
      </RenderRoute>
    );
  }
  // ONLY MENU SPECIAL CONTENT
  renderPageContent(content) {
    return <>{content}</>;
  }
  render() {
    const cache = new QueryCache({ max: 10, ttl: 1000 * 60 * 5 });
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5,
          cache,
          refetchOnWindowFocus: false,
        },
      },
    });

    return (
      <Suspense fallback={<SuspenLoading />}>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <Router ref={routerRef}>
            <ContextComposer>
              {/* <AppWrapper> */}
              <Switch>
                <Route
                  exact
                  path="/external-iframe"
                  children={(props) => this.renderRoute('Iframe', <MainContent header="" page="Iframe" {...props} />)}
                />
                <Route
                  exact
                  path="/digital-signage/tv"
                  children={(props) =>
                    this.renderRoute('DigitalSignageTV', <MainContent header="" page="DigitalSignageTV" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/quick-tv-notify"
                  children={(props) => this.renderRoute('Quick Pos Notify', <MainContent page="TVNotify" {...props} />)}
                />
                <Route
                  exact
                  path="/monitorreport/tv"
                  children={(props) => this.renderRoute('IT TV Report', <MainContent page="TVITReport" {...props} />)}
                />
                <Route
                  exact
                  path="/digital-signage/daily-log"
                  children={(props) =>
                    this.renderRoute(
                      'DigitalSignageDailyLog',
                      <MainContent header="" page="DigitalSignageDailyLog" {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/digital-signage/media"
                  children={(props) =>
                    this.renderRoute(
                      'DigitalSignageMedia',
                      <MainContent header="" page="DigitalSignageMedia" {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/digital-signage/media-group"
                  children={(props) =>
                    this.renderRoute(
                      'DigitalSignageMediaGroup',
                      <MainContent header="" page="DigitalSignageMediaGroup" {...props} />
                    )
                  }
                />
                {/* <Route exact path="/report-mkt-info-trans" children={(props) => this.renderRoute('MKT promotion information', <MainContent header="" page="MKTPromotionTrans" {...props} />)} /> */}
                <Route
                  exact
                  path="/payment-method"
                  children={(props) =>
                    this.renderRoute('Payment', <MainContent header="" page="PaymentMethods" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/internal/fc-register"
                  children={(props) =>
                    this.renderRoute('FC Regsiter', <MainContent header="" page="InternalFCRegister" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/internal/site-development"
                  children={(props) =>
                    this.renderRoute('FC Regsiter', <MainContent header="" page="InternalMatBang" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/internal/quality-control"
                  children={(props) =>
                    this.renderRoute(
                      'Quality Control',
                      <MainContent header="" page="InternalQualityControl" {...props} />
                    )
                  }
                />
                {/* Ecommerce */}

                <Route
                  exact
                  path="/ecommerce/banners"
                  children={(props) =>
                    this.renderRoute('Ecommerce Banner', <MainContent header="" page="EcommerceBanners" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/ecommerce/orders/search"
                  children={(props) =>
                    this.renderRoute('Ecommerce Order', <MainContent header="" page="EcommerceOrders" {...props} />)
                  }
                />
                {/* <Route
      exact
      path="/ecommerce/orders/create"
      children={(props) => this.renderRoute('Ecommerce Order', <MainContent header="" page="EcommerceOrdersCreate" {...props} />)}
    /> */}
                <Route
                  exact
                  path="/ecommerce/orders/details/:id"
                  children={(props) =>
                    this.renderRoute(
                      'Ecommerce Order',
                      <MainContent header="" page="EcommerceOrdersUpdate" {...props} />
                    )
                  }
                />

                <Route
                  exact
                  path="/ecommerce/items/search"
                  children={(props) =>
                    this.renderRoute('Ecommerce Item', <MainContent header="" page="EcommerceItem" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/ecommerce/items/import"
                  children={(props) =>
                    this.renderRoute('Ecommerce Item', <MainContent header="" page="EcommerceItemImport" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/ecommerce/items/create"
                  children={(props) =>
                    this.renderRoute('Ecommerce Item', <MainContent header="" page="EcommerceItemCreate" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/ecommerce/items/details/:id"
                  children={(props) =>
                    this.renderRoute('Ecommerce Item', <MainContent header="" page="EcommerceItemUpdate" {...props} />)
                  }
                />

                <Route
                  exact
                  path="/ecommerce/groups/search"
                  children={(props) =>
                    this.renderRoute('Ecommerce Group', <MainContent header="" page="EcommerceGroup" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/ecommerce/groups/create"
                  children={(props) =>
                    this.renderRoute(
                      'Ecommerce Group',
                      <MainContent header="" page="EcommerceGroupCreate" {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/ecommerce/groups/details/:id"
                  children={(props) =>
                    this.renderRoute(
                      'Ecommerce Group',
                      <MainContent header="" page="EcommerceGroupUpdate" {...props} />
                    )
                  }
                />

                <Route
                  exact
                  path="/ecommerce/categories/search"
                  children={(props) =>
                    this.renderRoute(
                      'Ecommerce Category',
                      <MainContent header="" page="EcommerceCategory" {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/ecommerce/categories/create"
                  children={(props) =>
                    this.renderRoute(
                      'Ecommerce Category',
                      <MainContent header="" page="EcommerceCategoryCreate" {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/ecommerce/categories/details/:id"
                  children={(props) =>
                    this.renderRoute(
                      'Ecommerce Category',
                      <MainContent header="" page="EcommerceCategoryUpdate" {...props} />
                    )
                  }
                />
                {/* Ecommerce */}

                {/* MKT Report */}
                <Route
                  exact
                  path="/promotion-buy-one-get-one-v2"
                  children={(props) =>
                    this.renderRoute('Buy one get one', <MainContent header="" page="BuyOneGetOneV2" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/promotion-buy-one-get-one-v2/create"
                  children={(props) =>
                    this.renderRoute(
                      'Buy one get one',
                      <MainContent header="" page="BuyOneGetOneV2Create" {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/promotion-buy-one-get-one-v2/details/:id"
                  children={(props) =>
                    this.renderRoute(
                      'Buy one get one',
                      <MainContent header="" page="BuyOneGetOneV2Update" {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/build-component"
                  children={(props) =>
                    this.renderRoute(
                      'MKT promotion information',
                      <MainContent header="" page="BuildComponent" {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/report-mkt-info"
                  children={(props) =>
                    this.renderRoute(
                      'MKT promotion information',
                      <MainContent header="" page="MDPromotionTrans" {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/report-mkt-promotion"
                  children={(props) =>
                    this.renderRoute(
                      'MKT promotion information',
                      <MainContent header="" page="MKTPromotion" {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/report-mkt-current-inventory-by-store"
                  children={(props) =>
                    this.renderRoute(
                      'MKT Review Stock on hand',
                      <MainContent header="" page="CurrentInventoryMKT" {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/page-mkt-salebycategory"
                  children={(props) =>
                    this.renderRoute(
                      'Sale by category MKT',
                      <MainContent header="" page="PageMktSaleByCategory" {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/page-mkt-summarybypayment"
                  children={(props) =>
                    this.renderRoute(
                      'Summary payment MKT',
                      <MainContent header="" page="PageMktSummaryByPayment" {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/report-loyalty"
                  children={(props) =>
                    this.renderRoute('Report loyalty', <MainContent header="" page="ReportLoyalty" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/report-loyalty-store"
                  children={(props) =>
                    this.renderRoute('Report loyalty', <MainContent header="" page="ReportLoyaltyStore" {...props} />)
                  }
                />
                <Route
                  path="/report-campaign"
                  children={(props) =>
                    this.renderRoute(
                      'Campaign Promotion',
                      <MainContent header="" page="CampaignPromotion" {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/report-item-master"
                  children={(props) =>
                    this.renderRoute('Data Master', <MainContent header="" page="ReportItemMaster" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/supplier-master"
                  children={(props) =>
                    this.renderRoute('Data Master', <MainContent header="" page="SupplierMaster" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/report-abc-classification"
                  children={(props) =>
                    this.renderRoute('Data Master', <MainContent header="" page="ABCClassification" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/voucher-report"
                  children={(props) =>
                    this.renderRoute('Voucher report', <MainContent header="" page="VoucherReport" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/sms-report"
                  children={(props) =>
                    this.renderRoute('SMS report', <MainContent header="" page="SmsReport" {...props} />)
                  }
                />

                {/* End MKT Report */}

                {/* <Route exact path="/" children={(props) => this.renderRoute('', <MainContent page="DashboardSM" {...props} />)} /> */}

                {/* Report */}
                <Route
                  exact
                  path="/md-report-item-master"
                  children={(props) =>
                    this.renderRoute('Data Master MD', <MainContent header="" page="MdReportItemMaster" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/report-mkt-info-trans-md"
                  children={(props) =>
                    this.renderRoute('MKT promotion information', <MainContent page="MDPromotionTransMD" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/report-mkt-promotion-md"
                  children={(props) =>
                    this.renderRoute('MKT promotion information', <MainContent page="MKTPromotionMD" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/report-mkt-promotion-top-md"
                  children={(props) =>
                    this.renderRoute('MKT promotion top', <MainContent page="MKTPromotionTopMD" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/md-supplier-master"
                  children={(props) =>
                    this.renderRoute('Data Master MD', <MainContent header="" page="MdSupplierMaster" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/report-mkt-info-trans"
                  children={(props) =>
                    this.renderRoute(
                      'MKT promotion information',
                      <MainContent header="" page="MKTPromotionTrans" {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/report-mkt-promotion"
                  children={(props) =>
                    this.renderRoute(
                      'MKT promotion information',
                      <MainContent header="" page="MKTPromotion" {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/report-current-inventory-by-store"
                  children={(props) =>
                    this.renderRoute(
                      'Review Stock on hand',
                      <MainContent header="" page="CurrentInventory" {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/estimate-stock"
                  children={(props) =>
                    this.renderRoute(
                      'Review SOH/Estimate/Movement',
                      <MainContent header="" page="EstimateStock" {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/stock-movement"
                  children={(props) =>
                    this.renderRoute(
                      'Review SOH/Estimate/Movement',
                      <MainContent header="" page="StockMovement" {...props} />
                    )
                  }
                />

                <Route
                  exact
                  // path="/page-op-sale-detail"
                  path="/salesop-md"
                  children={(props) =>
                    this.renderRoute(
                      'MD report sale op',
                      <MainContent header="" page="PageOpSaleDetailMD" {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/page-op-disposal-md"
                  children={(props) =>
                    this.renderRoute('MD report disposal', <MainContent header="" page="PageOpDispocalMD" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/page-op-paymentbystore-md"
                  children={(props) =>
                    this.renderRoute(
                      'MD report payment by store',
                      <MainContent header="" page="PageOpPaymentByStoreMD" {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/page-op-salebycategory-md"
                  children={(props) =>
                    this.renderRoute(
                      'MD report sales by category',
                      <MainContent header="" page="PageOpSaleByCategoryMD" {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/page-op-summarybypayment-md"
                  children={(props) =>
                    this.renderRoute(
                      'MD report summary payment',
                      <MainContent header="" page="PageOpSummaryByPaymentMD" {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/page-op-detail-month-md"
                  children={(props) =>
                    this.renderRoute(
                      'MD report detail month',
                      <MainContent header="" page="PageOpDetailMonthMD" {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/orderschedule-md"
                  children={(props) =>
                    this.renderRoute('Order Schedule', <MainContent header="" page="OrderScheduleMD" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/page-op-combine-item-md"
                  children={(props) =>
                    this.renderRoute(
                      'MD report recipe by items sales',
                      <MainContent header="" page="ReportSaleCombineItemMD" {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/orderschedule"
                  children={(props) =>
                    this.renderRoute('Order Schedule', <MainContent header="" page="OrderSchedule" {...props} />)
                  }
                />
                {/* End Report */}

                {/* FC Master */}
                <Route
                  exact
                  path="/fc-master"
                  children={(props) => this.renderRoute('FC Master', <MainContent page="FCMaster" {...props} />)}
                />
                <Route
                  exact
                  path="/fc-master/create"
                  children={(props) => this.renderRoute('FC Master', <MainContent page="FCMasterCreate" {...props} />)}
                />
                <Route
                  exact
                  path="/fc-master/import"
                  children={(props) => this.renderRoute('FC Master', <MainContent page="FCMasterImport" {...props} />)}
                />
                <Route
                  exact
                  path="/fc-master/details/:id/:storeCode"
                  children={(props) => this.renderRoute('FC Master', <MainContent page="FCMasterDetails" {...props} />)}
                />
                {/* End FC Master */}

                {/* Bill */}
                <Route
                  exact
                  path="/request-cancel-bills"
                  children={(props) =>
                    this.renderRoute('Request Canceled bills', <MainContent page="RequestCancelBills" {...props} />)
                  }
                />
                {/* End Bill */}

                {/* Account */}
                <Route
                  exact
                  path="/request-cancel-accounts"
                  children={(props) =>
                    this.renderRoute(
                      'Request Canceled account',
                      <MainContent page="RequestCancelAccounts" {...props} />
                    )
                  }
                />
                {/* End Account */}

                {/* VOUCHER */}
                <Route
                  exact
                  path="/voucher"
                  children={(props) => this.renderRoute('Voucher', <MainContent page="Voucher" {...props} />)}
                />
                {/* END VOUCHER */}

                {/* IT OPERATION */}
                <Route
                  exact
                  path="/device-management"
                  children={(props) =>
                    this.renderRoute('Device Management', <MainContent page="DeviceManagement" {...props} />)
                  }
                />
                <Route
                  path="/setting/cache"
                  children={(props) => this.renderRoute('Setting', <MainContent page="Setting" {...props} />)}
                />
                <Route
                  exact
                  path="/report-sales-store-async"
                  children={(props) =>
                    this.renderRoute('Sales Store', <MainContent page="ReportStoreSalesProcessAsync" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/message-log/pos"
                  children={(props) => this.renderRoute('POS Log', <MainContent page="PosLog" {...props} />)}
                />
                <Route
                  exact
                  path="/monitorreport"
                  children={(props) =>
                    this.renderRoute('Monitor Report', <MainContent page="MonitorReport" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/quick-pos-notify"
                  children={(props) =>
                    this.renderRoute('Quick Pos Notify', <MainContent page="QuickPosNotify" {...props} />)
                  }
                />

                <Route
                  exact
                  path="/message-notify"
                  children={(props) =>
                    this.renderRoute('Message Notify', <MainContent page="MessageNotify" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/pos-notify"
                  children={(props) => this.renderRoute('POS Notify', <MainContent page="POSNotify" {...props} />)}
                />

                {/* END IT OPERATION */}

                {/* LOGISTIC */}
                <Route
                  exact
                  path="/logistics-storeorder"
                  children={(props) =>
                    this.renderRoute('Logistics store order', <MainContent page="LogisticsStoreOrder" {...props} />)
                  }
                />
                <Route
                  path="/logistics-storeorder/:poCode"
                  children={(props) =>
                    this.renderRoute(
                      'Logistics store order',
                      <MainContent page="LogisticsStoreOrderDetail" params={props.match.params} {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/logistics-ordersupplier"
                  children={(props) =>
                    this.renderRoute(
                      'Logistics order supplier',
                      <MainContent page="LogisticsOrderSupplier" {...props} />
                    )
                  }
                />
                <Route
                  path="/logistics-ordersupplier/:poCode"
                  children={(props) =>
                    this.renderRoute(
                      'Logistics order supplier',
                      <MainContent page="LogisticsOrderSupplierDetail" params={props.match.params} {...props} />
                    )
                  }
                />
                {/* END LOGISTIC */}

                {/* FEEDBACK */}
                <Route
                  exact
                  path="/feedback-management"
                  children={(props) =>
                    this.renderRoute('Feedback management', <MainContent page="FeedbackManagement" {...props} />)
                  }
                />
                {/* END FEEDBACK */}

                {/* MERCHANDISER */}
                {/* END MERCHANDISER */}

                <Route path="/error" exact component={Errors} />
                <Route
                  path="/login"
                  children={(props) => this.renderRoute('Login', <MainContent page="Login" {...props} />, false, false)}
                />

                <Route
                  exact
                  path="/"
                  children={(props) => this.renderRoute('Dashboard', <MainContent page="Dashboard" {...props} />)}
                />
                <Route
                  exact
                  path="/campaigns"
                  children={(props) => this.renderRoute('Campaign', <MainContent page="Campaign" {...props} />)}
                />
                <Route
                  exact
                  path="/campaigns/create"
                  children={(props) =>
                    this.renderRoute('Create Campaign', <MainContent page="CampaignCreate" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/campaigns/details/:id"
                  children={(props) =>
                    this.renderRoute('Create Campaign', <MainContent page="CampaignEdit" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/check-in-history"
                  children={(props) =>
                    this.renderRoute('Check in History', <MainContent page="CheckInHistory" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/check-in-history-iframe"
                  children={(props) =>
                    this.renderRoute(
                      'Check in History',
                      <MainContent page="CheckInHistory" isIframe {...props} />,
                      false,
                      false
                    )
                  }
                />

                <Route
                  exact
                  path="/user-manual"
                  children={(props) => this.renderRoute('User Manual', <MainContent page="UserManual" {...props} />)}
                />
                <Route
                  exact
                  path="/store-target-kpi"
                  children={(props) =>
                    this.renderRoute('Store target KPI', <MainContent page="StoreTargetKPI" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/store-target-kpi/import"
                  children={(props) =>
                    this.renderRoute('Store target KPI', <MainContent page="StoreTargetKPIImport" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/fc-management"
                  children={(props) =>
                    this.renderRoute('Franchise management', <MainContent page="FCManagement" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/trace-log"
                  children={(props) => this.renderRoute('trace log', <MainContent page="Loggings" {...props} />)}
                />
                <Route
                  exact
                  path="/fc-management/create"
                  children={(props) =>
                    this.renderRoute('Franchise management', <MainContent page="FCManagementCreate" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/fc-management/edit/:id"
                  children={(props) =>
                    this.renderRoute('Franchise management', <MainContent page="FCManagementEdit" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/voucher-payment"
                  children={(props) =>
                    this.renderRoute('Voucher payment', <MainContent page="CheckVoucher" {...props} />)
                  }
                />

                <Route
                  path="/message/:type"
                  children={(props) =>
                    this.renderRoute(
                      'Message',
                      <MainContent page="PageMessage" params={props.match.params} {...props} />,
                      false,
                      false
                    )
                  }
                />

                <Route
                  path="/callback/:type"
                  children={(props) =>
                    this.renderRoute(
                      'Callback',
                      <MainContent page="PageCallback" params={props.match.params} {...props} />,
                      false,
                      false
                    )
                  }
                />

                <Route
                  exact
                  path="/payroll"
                  children={(props) => this.renderRoute('Store Payroll', <MainContent page="Payroll" {...props} />)}
                />

                <Route
                  exact
                  path="/ho-payroll"
                  children={(props) => this.renderRoute('HO Payroll', <MainContent page="HOPayroll" {...props} />)}
                />

                <Route
                  path="/content/:type"
                  children={(props) =>
                    this.renderRoute(props.match.params.type, <MainContent page="ContentPage" {...props} />)
                  }
                />

                <Route
                  exact
                  path="/customer-service"
                  children={(props) =>
                    this.renderRoute('Customer Service', <MainContent page="CustomerService" {...props} />)
                  }
                />

                <Route
                  path="/transaction-payment"
                  children={(props) =>
                    this.renderRoute(
                      'Transaction Payment',
                      <MainContent page="TransactionPayment" params={props.match.params} {...props} />,
                      true,
                      true,
                      true
                    )
                  }
                />

                {/* !continue refactoring code */}
                <Route
                  path="/management-screen2"
                  children={(props) =>
                    this.renderRoute('Management Screen POS', <MainContent page="ManagementScreen2" {...props} />)
                  }
                />

                <Route
                  path="/sms"
                  children={(props) => this.renderRoute('SMS', <MainContent page="SMS" {...props} />)}
                />
                <Route
                  path="/voucher-app"
                  children={(props) => this.renderRoute('Voucher', <MainContent page="VoucherApp" {...props} />)}
                />

                {/* PROMOTION PAGE */}
                <Route
                  exact
                  path="/promotion"
                  children={(props) =>
                    this.renderRoute('Promotion Group Item', <MainContent page="Promotion" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/promotion/create"
                  children={(props) =>
                    this.renderRoute(
                      'Promotion Group Item',
                      <MainContent page="PromotionDetail" params={props.match.params} {...props} />
                    )
                  }
                />
                <Route
                  path="/promotion/:orderCode"
                  children={(props) =>
                    this.renderRoute(
                      'Promotion Group Item',
                      <MainContent page="PromotionDetail" params={props.match.params} {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/report-promotion"
                  children={(props) =>
                    this.renderRoute('Report Promotion', <MainContent page="ReportPromotion" {...props} />)
                  }
                />

                <Route
                  exact
                  path="/promotion-checkin"
                  children={(props) =>
                    this.renderRoute('Promotion Check In', <MainContent page="PromotionCheckinSearch" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/promotion-checkin/create"
                  children={(props) =>
                    this.renderRoute('Promotion Check In', <MainContent page="PromotionCheckin" {...props} />)
                  }
                />

                {/* <Route exact path="/promotion-gift" children={(props) => this.renderRoute("Promotion Gift", <MainContent page="PromotionGift" {...props} />)} /> */}
                <Route
                  exact
                  path="/promotion-buy-one-get-one"
                  children={(props) =>
                    this.renderRoute('Buy One Get One', <MainContent page="PromotionBuyOneGetOne" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/promotion-buy-one-get-one/create"
                  children={(props) =>
                    this.renderRoute(
                      'Buy One Get One',
                      <MainContent page="PromotionBuyOneGetOneDetail" params={props.match.params} {...props} />
                    )
                  }
                />
                {/* <Route
                exact
                path="/promotion-golden-hours"
                children={(props) =>
                  this.renderRoute(
                    'Prime Time',
                    <MainContent page="PromotionGoldenTime" {...props} />
                  )
                }
              /> */}
                <Route
                  exact
                  path="/promotion-prime-time"
                  children={(props) =>
                    this.renderRoute('Prime Time', <MainContent page="PromotionPrimeTime" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/promotion-prime-time/create"
                  children={(props) =>
                    this.renderRoute('Prime Time', <MainContent page="PromotionPrimeTimeCreate" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/promotion-prime-time/edit/:id"
                  children={(props) =>
                    this.renderRoute('Prime Time', <MainContent page="PromotionPrimeTimeEdit" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/soh/dashboard"
                  children={(props) =>
                    this.renderRoute('SOH Dashboard', <MainContent page="SOHDashboard" {...props} />)
                  }
                />
                {/* <Route
                exact
                path="/promotion-golden-hours/create"
                children={(props) =>
                  this.renderRoute(
                    'Prime Time',
                    <MainContent
                      page="PromotionGoldenTimeCreate"
                      params={props.match.params}
                      {...props}
                    />
                  )
                }
              />
              <Route
                exact
                path="/promotion-golden-hours/detail/:id"
                children={(props) =>
                  this.renderRoute(
                    'Prime Time',
                    <MainContent
                      page="PromotionGoldenTimeDetail"
                      params={props.match.params}
                      {...props}
                    />
                  )
                }
              /> */}
                <Route
                  exact
                  path="/promotion-buy-one-get-one/:orderCode"
                  children={(props) =>
                    this.renderRoute(
                      'Buy One Get One',
                      <MainContent page="PromotionBuyOneGetOneDetail" params={props.match.params} {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/promotion-buy-one-get-one/:orderCode/copy"
                  children={(props) =>
                    this.renderRoute(
                      'Buy One Get One',
                      <MainContent
                        page="PromotionBuyOneGetOneDetail"
                        params={props.match.params}
                        type="copy"
                        {...props}
                      />
                    )
                  }
                />

                <Route
                  exact
                  path="/promotion-mix-and-match"
                  children={(props) =>
                    this.renderRoute('Mix and Match', <MainContent page="PromotionMixAndMatch" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/promotion-mix-ab-match-c"
                  children={(props) =>
                    this.renderRoute('Mix and Match', <MainContent page="PromotionMixABMatchC" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/promotion-mix-ab-match-c/create"
                  children={(props) =>
                    this.renderRoute('Mix and Match', <MainContent page="PromotionMixABMatchCPageDetail" {...props} />)
                  }
                />

                <Route
                  exact
                  path="/promotion-mix-ab-match-c/details/:promotionCode"
                  children={(props) =>
                    this.renderRoute('Mix and Match', <MainContent page="PromotionMixABMatchCPageUpdate" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/promotion-mix-ab-match-c/copy/:promotionCode"
                  children={(props) =>
                    this.renderRoute('Mix and Match', <MainContent page="PromotionMixABMatchCPageCopy" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/promotion-mix-and-match/create"
                  children={(props) =>
                    this.renderRoute(
                      'Mix and Match',
                      <MainContent page="PromotionMixAndMatchDetail" params={props.match.params} {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/promotion-mix-and-match/:orderCode"
                  children={(props) =>
                    this.renderRoute(
                      'Mix and Match',
                      <MainContent page="PromotionMixAndMatchDetail" params={props.match.params} {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/promotion-mix-and-match/:orderCode/copy"
                  children={(props) =>
                    this.renderRoute(
                      'Mix and Match',
                      <MainContent
                        page="PromotionMixAndMatchDetail"
                        params={props.match.params}
                        type="copy"
                        {...props}
                      />
                    )
                  }
                />

                <Route
                  exact
                  path="/promotion-discount-combo"
                  children={(props) =>
                    this.renderRoute('Discount combo item', <MainContent page="PromotionDiscountCombo" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/promotion-discount-combo/create"
                  children={(props) =>
                    this.renderRoute(
                      'Discount combo item',
                      <MainContent page="PromotionDiscountComboDetail" params={props.match.params} {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/promotion-discount-combo/:orderCode"
                  children={(props) =>
                    this.renderRoute(
                      'Discount combo item',
                      <MainContent page="PromotionDiscountComboDetail" params={props.match.params} {...props} />
                    )
                  }
                />

                <Route
                  exact
                  path="/promotion-discount-item"
                  children={(props) =>
                    this.renderRoute('Discount by item', <MainContent page="PromotionDiscountItem" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/promotion-discount-item/create"
                  children={(props) =>
                    this.renderRoute(
                      'Discount by item',
                      <MainContent page="PromotionDetailDiscountItem" params={props.match.params} {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/promotion-discount-item/:orderCode"
                  children={(props) =>
                    this.renderRoute(
                      'Discount by item',
                      <MainContent page="PromotionDetailDiscountItem" params={props.match.params} {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/promotion-discount-item/:orderCode/copy"
                  children={(props) =>
                    this.renderRoute(
                      'Discount by item',
                      <MainContent
                        page="PromotionDetailDiscountItem"
                        params={props.match.params}
                        type="copy"
                        {...props}
                      />
                    )
                  }
                />

                {/* <Route exact path="/promotion-discount-list" children={(props) => this.renderRoute("Promotion discount list", <MainContent page="PromotionDiscountList" {...props} />)} />
                    <Route
                        exact
                        path="/promotion-discount-list/create"
                        children={(props) =>
                            this.renderRoute("Promotion discount list", <MainContent page="PromotionDetailDiscountList" params={props.match.params} {...props} />)
                        }
                    />
                    <Route
                        path="/promotion-discount-list/:orderCode"
                        children={(props) =>
                            this.renderRoute("Promotion discount bill", <MainContent page="PromotionDetailDiscountList" params={props.match.params} {...props} />)
                        }
                    /> */}

                <Route
                  exact
                  path="/promotion-discount-buy-bill"
                  children={(props) =>
                    this.renderRoute(
                      'Discount buy bill amount',
                      <MainContent page="PromotionDiscountBuyBill" {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/promotion-discount-buy-bill/create"
                  children={(props) =>
                    this.renderRoute(
                      'Discount buy bill amount',
                      <MainContent page="PromotionDiscountBuyBillDetail" params={props.match.params} {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/promotion-discount-buy-bill/:orderCode"
                  children={(props) =>
                    this.renderRoute(
                      'Discount buy bill amount',
                      <MainContent page="PromotionDiscountBuyBillDetail" params={props.match.params} {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/promotion-discount-buy-bill/:orderCode/copy"
                  children={(props) =>
                    this.renderRoute(
                      'Discount buy bill amount',
                      <MainContent
                        page="PromotionDiscountBuyBillDetail"
                        params={props.match.params}
                        type="copy"
                        {...props}
                      />
                    )
                  }
                />

                <Route
                  exact
                  path="/promotion-discount-voucher"
                  children={(props) =>
                    this.renderRoute('Discount voucher', <MainContent page="PromotionDiscountVoucher" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/promotion-discount-voucher/create"
                  children={(props) =>
                    this.renderRoute(
                      'Discount voucher',
                      <MainContent page="PromotionDiscountVoucherDetail" params={props.match.params} {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/promotion-discount-voucher/:orderCode"
                  children={(props) =>
                    this.renderRoute(
                      'Discount voucher',
                      <MainContent page="PromotionDiscountVoucherDetail" params={props.match.params} {...props} />
                    )
                  }
                />

                <Route
                  exact
                  path="/promotion-discount-coupon"
                  children={(props) =>
                    this.renderRoute('Discount coupon', <MainContent page="PromotionDiscountCoupon" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/promotion-discount-coupon/create"
                  children={(props) =>
                    this.renderRoute(
                      'Discount coupon',
                      <MainContent page="PromotionDiscountCouponDetail" params={props.match.params} {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/promotion-discount-coupon/:orderCode"
                  children={(props) =>
                    this.renderRoute(
                      'Discount coupon',
                      <MainContent page="PromotionDiscountCouponDetail" params={props.match.params} {...props} />
                    )
                  }
                />
                {/* PROMOTION PAGE END */}

                {/* PROMOTION TOTAL BILL */}
                <Route
                  exact
                  path="/promotion-total-bill"
                  children={(props) =>
                    this.renderRoute(
                      'Get item by total Bill',
                      <MainContent page="PromotionTotalBill" params={props.match.params} {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/promotion-total-bill/create"
                  children={(props) =>
                    this.renderRoute(
                      'Get item by total Bill',
                      <MainContent page="PromotionTotalBillCreate" params={props.match.params} {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/promotion-total-bill/edit/:id"
                  children={(props) =>
                    this.renderRoute(
                      'Get item by total Bill',
                      <MainContent page="PromotionTotalBillEdit" params={props.match.params} {...props} />
                    )
                  }
                />
                {/* END PROMOTION TOTAL BILL */}

                {/* LOYALTY PAGE */}
                <Route
                  exact
                  path="/loyalty/item-redeems/search"
                  children={(props) =>
                    this.renderRoute(
                      'Loyalty Item Redeems',
                      <MainContent header="" page="LoyaltyItemRedeems" {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/loyalty/item-redeems/create"
                  children={(props) =>
                    this.renderRoute(
                      'Loyalty Item Redeems',
                      <MainContent header="" page="LoyaltyItemRedeemsCreate" {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/loyalty/item-redeems/details/:id"
                  children={(props) =>
                    this.renderRoute(
                      'Loyalty Item Redeems',
                      <MainContent header="" page="LoyaltyItemRedeemsUpdate" {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/loyalty"
                  children={(props) => this.renderRoute('Loyalty', <MainContent page="Loyalty" {...props} />)}
                />
                {/* <Route
                  exact
                  path="/loyalty/create"
                  children={(props) =>
                    this.renderRoute(
                      'Loyalty',
                      <MainContent page="LoyaltyDetail" params={props.match.params} {...props} />
                    )
                  }
                /> */}
                <Route
                  exact
                  path="/loyalty/merge"
                  children={(props) =>
                    this.renderRoute(
                      'Loyalty',
                      <MainContent page="LoyaltyMerge" params={props.match.params} {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/loyalty/member"
                  children={(props) =>
                    this.renderRoute(
                      'Loyalty member',
                      <MainContent page="LoyaltyMember" params={props.match.params} {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/loyalty/transaction-log"
                  children={(props) =>
                    this.renderRoute(
                      'Loyalty transaction log',
                      <MainContent page="LoyaltyTransLog" params={props.match.params} {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/loyalty/highest-point"
                  children={(props) =>
                    this.renderRoute(
                      'Loyalty highest point',
                      <MainContent page="LoyaltyHighestPoint" params={props.match.params} {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/loyalty/redeem-voucher"
                  children={(props) =>
                    this.renderRoute(
                      'Loyalty Claim voucher',
                      <MainContent page="LoyaltyRedeemVoucher" params={props.match.params} {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/loyalty/reporting"
                  children={(props) =>
                    this.renderRoute(
                      'Loyalty',
                      <MainContent page="LoyaltyReport" params={props.match.params} {...props} />
                    )
                  }
                />
                <Route
                  path="/loyalty/:memberCode"
                  children={(props) =>
                    this.renderRoute(
                      'Loyalty',
                      <MainContent page="LoyaltyDetail" params={props.match.params} {...props} />
                    )
                  }
                />
                <Route
                  path="/loyalty-voucher/:memberCode"
                  children={(props) =>
                    this.renderRoute(
                      'Loyalty',
                      <MainContent page="LoyaltyVoucherDetail" params={props.match.params} {...props} />
                    )
                  }
                />

                <Route
                  exact
                  path="/loyalty-notify"
                  children={(props) => this.renderRoute('Loyalty', <MainContent page="LoyaltyNotify" {...props} />)}
                />

                {/* LOYALTY PAGE END */}

                {/* <Route
                        exact
                        path="/cico"
                        children={(props) => this.renderRoute("CICO Management", <MainContent page="CicoManagement" {...props} />)}
                    /> */}

                <Route
                  exact
                  path="/staff"
                  children={(props) => this.renderRoute('Staff', <MainContent page="StaffManagement" {...props} />)}
                />
                <Route
                  exact
                  path="/staff/create"
                  children={(props) => this.renderRoute('Create Staff', <MainContent page="CreateStaff" {...props} />)}
                />
                <Route
                  path="/staff/:storeCode/:staffCode/:status"
                  children={(props) =>
                    this.renderRoute(
                      'Staff Detail',
                      <MainContent page="DetailStaff" params={props.match.params} {...props} />
                    )
                  }
                />

                <Route
                  path="/paymentpromotion/:partners/update/:id"
                  children={(props) =>
                    this.renderRoute(
                      'Promotion Payment',
                      <MainContent page="PosDataPromotionDetail" params={props.match.params} {...props} />
                    )
                  }
                />
                <Route
                  path="/paymentpromotion/:partners/create"
                  children={(props) =>
                    this.renderRoute(
                      'Promotion',
                      <MainContent page="PosDataPromotionCreate" params={props.match.params} {...props} />
                    )
                  }
                />
                <Route
                  path="/paymentpromotion/:partners"
                  children={(props) =>
                    this.renderRoute(
                      'Promotion Payment',
                      <MainContent page="PosDataPromotionManagement" params={props.match.params} {...props} />
                    )
                  }
                />

                <Route
                  exact
                  path="/store"
                  children={(props) => this.renderRoute('Store', <MainContent page="StoreManagement" {...props} />)}
                />
                <Route
                  exact
                  path="/store/convert"
                  children={(props) =>
                    this.renderRoute(
                      'Store',
                      <MainContent page="StoreConvert" params={props.match.params} {...props} />
                    )
                  }
                />
                <Route
                  path="/store/create"
                  children={(props) =>
                    this.renderRoute('Store', <MainContent page="StoreCreate" params={props.match.params} {...props} />)
                  }
                />
                <Route
                  exact
                  path="/store/:storeCode"
                  children={(props) =>
                    this.renderRoute('Store', <MainContent page="StoreDetail" params={props.match.params} {...props} />)
                  }
                />

                <Route
                  exact
                  path="/supplier"
                  children={(props) =>
                    this.renderRoute('Supplier', <MainContent page="SupplierManagement" {...props} />)
                  }
                />
                <Route
                  path="/supplier/create"
                  children={(props) =>
                    this.renderRoute(
                      'Supplier',
                      <MainContent page="SupplierCreate" params={props.match.params} {...props} />
                    )
                  }
                />
                <Route
                  path="/supplier/:supplierCode/create"
                  children={(props) =>
                    this.renderRoute(
                      'Supplier',
                      <MainContent page="DistributorCreate" params={props.match.params} {...props} />
                    )
                  }
                />
                <Route
                  path="/supplier/:supplierCode"
                  children={(props) =>
                    this.renderRoute(
                      'Supplier',
                      <MainContent page="SupplierDetail" params={props.match.params} {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/report/ff-onsite"
                  children={(props) =>
                    this.renderRoute('Item Master By FF', <MainContent page="ItemMasterByFF" {...props} />)
                  }
                />
                {/* ITEM MASTER V2 */}
                <Route
                  exact
                  path="/item-master/v2"
                  children={(props) =>
                    this.renderRoute('Item Master V2', <MainContent page="ItemMaster" {...props} version="2" />)
                  }
                />
                <Route
                  exact
                  path="/item-master/v2/:itemCode"
                  children={(props) =>
                    this.renderRoute('Item Master By Store', <MainContent page="ItemMasterDetailV2" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/item-master/v2/store/import"
                  children={(props) =>
                    this.renderRoute('Item Master By Store', <MainContent page="ItemMasterByStoreImport" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/item-master/v2/store/ofc/import"
                  children={(props) =>
                    this.renderRoute(
                      'Item Master By Store',
                      <MainContent page="ItemMasterByStoreImportForOPOFC" {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/item-master/v2/price/import"
                  children={(props) =>
                    this.renderRoute('Import Item Price', <MainContent page="ImportItemPrice" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/item-master/v2/order/import"
                  children={(props) =>
                    this.renderRoute('Import Item Order', <MainContent page="ImportItemOrder" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/item-master/v2/sold/import"
                  children={(props) =>
                    this.renderRoute('Import Item Sold', <MainContent page="ImportItemSold" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/item-master/v2/price/selling/history"
                  children={(props) =>
                    this.renderRoute(
                      'Item Master History Change Selling Price',
                      <MainContent page="ItemMasterHistoryChangeSellingPrice" {...props} />
                    )
                  }
                />

                {/* END  MASTER V2 */}

                {/* ITEM MASTER */}
                <Route
                  exact
                  path="/item-master"
                  children={(props) => this.renderRoute('Item Master', <MainContent page="ItemMaster" {...props} />)}
                />

                <Route
                  exact
                  path="/item-master/create"
                  children={(props) =>
                    this.renderRoute(
                      'New Item FF',
                      <MainContent page="ItemMasterDetail" params={props.match.params} {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/item-master/create/normal"
                  children={(props) =>
                    this.renderRoute(
                      'New Item GM',
                      <MainContent page="CreateIMNormal" params={props.match.params} {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/item-master/import"
                  children={(props) =>
                    this.renderRoute(
                      'New List Item GM',
                      <MainContent page="ItemMasterImport" params={props.match.params} {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/item-master/import-attributes"
                  children={(props) =>
                    this.renderRoute(
                      'New List Item GM',
                      <MainContent page="ImportAttributesItem" params={props.match.params} {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/item-master/change-price"
                  children={(props) =>
                    this.renderRoute(
                      'Change Price Item',
                      <MainContent page="ChangePriceItem" params={props.match.params} {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/item-master/history-price"
                  children={(props) =>
                    this.renderRoute(
                      'History Price Item',
                      <MainContent page="ItemMasterHistoryChangePrice" params={props.match.params} {...props} />
                    )
                  }
                />
                <Route
                  path="/item-master/:code"
                  children={(props) =>
                    this.renderRoute(
                      'Item Detail',
                      <MainContent page="ItemMasterDetail" params={props.match.params} {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/user"
                  children={(props) =>
                    this.renderRoute(
                      'User management',
                      <MainContent page="UserManagement" params={props.match.params} {...props} />
                    )
                  }
                />

                <Route
                  exact
                  path="/user/menu-permission"
                  children={(props) =>
                    this.renderRoute(
                      'Menu permission',
                      <MainContent page="UserEditMenu" params={props.match.params} {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/user/create"
                  children={(props) =>
                    this.renderRoute('User', <MainContent page="User" params={props.match.params} {...props} />)
                  }
                />
                <Route
                  path="/user/:userID"
                  children={(props) =>
                    this.renderRoute('User', <MainContent page="User" params={props.match.params} {...props} />)
                  }
                />

                <Route
                  exact
                  path="/store-op"
                  children={(props) =>
                    this.renderRoute(
                      'Store Operation',
                      <MainContent page="StoreOperation" params={props.match.params} {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/store-op/detail/:id"
                  children={(props) =>
                    this.renderRoute(
                      'Store Operation',
                      <MainContent page="OperationStoreDetails" params={props.match.params} {...props} />
                    )
                  }
                />
                {/* SETTING */}
                <Route
                  exact
                  path="/report-sale-log"
                  children={(props) =>
                    this.renderRoute('Report Sale Log', <MainContent page="ReportSaleLog" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/setting/permission"
                  children={(props) => this.renderRoute('Permission', <MainContent page="Permission" {...props} />)}
                />

                <Route
                  exact
                  path="/store-config"
                  children={(props) => this.renderRoute('Store Config', <MainContent page="StoreConfig" {...props} />)}
                />

                <Route
                  exact
                  path="/bill-management"
                  children={(props) =>
                    this.renderRoute('Bill search', <MainContent page="BillManagement" {...props} />)
                  }
                />
                <Route
                  exact
                  path="/bill-management-customer"
                  children={(props) =>
                    this.renderRoute('Bill management', <MainContent page="BillManagementCustomer" {...props} />)
                  }
                />

                {/* <Route
                  exact
                  path="/refund-order"
                  children={(props) => this.renderRoute('Refund Order', <MainContent page="RefundOrder" {...props} />)}
                /> */}
                {/*END SETTING */}

                <Route
                  children={(props) =>
                    this.renderRoute('Page not found', <MainContent page="PageNotFound" {...props} />, false, false)
                  }
                />
              </Switch>
              {/* </AppWrapper> */}
            </ContextComposer>
          </Router>
        </QueryClientProvider>
      </Suspense>
    );
  }
}
App.contextType = AppContext;

export default App;
