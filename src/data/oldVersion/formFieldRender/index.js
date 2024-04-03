import CheckInOverview from "./CheckIn/CheckInOverview";
import CustomerServiceOverview from "./CustomerService/CustomerServiceOverview";
import LogrecentOverview from "./Loyalty/LogRecent/LogrecentOverview";
import StoreOPCreateFormFields from "./StoreOPCreate";
import StoreOPOriginalCreateFormFields from "./StoreOPCreateOriginal";
import TotalBillAllDataRender from "./TotalBillMain";
import FeedBackOverview from "./Feedback/FeedBackOverview";
import CustomerServiceSMSLog from "./CustomerService/CustomerServiceSMSLog";
import LogginOverview from "./Logging/LogginOverview";
import CheckVoucherOverview from "./Voucher/CheckVoucherOverview";
import CampaignOverview from "./Campaign/CampaignOverview";
import StaffOverview from "./Staff/StaffOverview";
import ReportOverview from "./Report/ReportOverview";
import PromotionPaymentHistoryOverview from "./PromotionPayment/PromotionPaymentHistoryOverview";
import ItemMastereOverview from "./ItemMaster/ItemMastereOverview";
const FormField = {
  TotalBillMain: TotalBillAllDataRender,
  StoreOP: StoreOPCreateFormFields,
  StoreOPOriginal: StoreOPOriginalCreateFormFields,
  CheckInOverview: CheckInOverview,
  CustomerServiceOverview: CustomerServiceOverview,
  LogrecentOverview: LogrecentOverview,
  FeedBackOverview: FeedBackOverview,
  CustomerServiceSMSLog: CustomerServiceSMSLog,
  LogginOverview: LogginOverview,
  CheckVoucherOverview: CheckVoucherOverview,
  CampaignOverview: CampaignOverview,
  StaffOverview: StaffOverview,
  ReportOverview: ReportOverview,
  PromotionPaymentHistoryOverview: PromotionPaymentHistoryOverview,
  ItemMastereOverview: ItemMastereOverview,
};
export default FormField;
