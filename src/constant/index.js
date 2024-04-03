export const INPUT_SIZE = 'medium';
const CONSTANT = {
  FORMAT_DATE_PAYLOAD: 'YYYY-MM-DD',
  FORMAT_DATE_IN_USE: 'DD/MM/YYYY',
  FORMAT_DATE_IN_USE_FULL: 'DD/MM/YYYY HH:mm',
  WIKI: {
    DASHBOARD: {
      CURRENT_SALE: 'CURRENT_SALE',
      TOTAL_MEMBERS: 'TOTAL_MEMBERS',
      TOTAL_BILL: 'TOTAL_BILL',
      BASKET_AVG_VALUE: 'BASKET_AVG_VALUE',
      BASKET_AVG_QTY: 'BASKET_AVG_QTY',
      WAIT_RECEIVING: 'WAIT_RECEIVING',
      PO_LOCKED: 'PO_LOCKED',
      CURRENT_SALE_BY_CATE: 'CURRENT_SALE_BY_CATE',
      EXPORT_DETAIL: 'EXPORT_DETAIL',
      ADS_CATE_7_DAYS: 'ADS_CATE_7_DAYS',
      HISTORY_TOTAL_SALE: 'HISTORY_TOTAL_SALE',
      HISTORY_CUSTOMER: 'HISTORY_CUSTOMER',
      HISTORY_DAY_OPTIONS: 'HISTORY_DAY_OPTIONS',
    },
    VOUCHER: 'VOUCHER',
  },
  QUERY: {
    COMMON: {
      REGION: 'REGION',
    },
    PROMOTION: {
      MIX_AB_MATCH_C: ['MIX_AB_MATCH_C'],
      MIX_AB_MATCH_C_DETAILS: ['MIX_AB_MATCH_C/DETAILS'],
    },
    STORE: {
      ITEMS: ['store/items'],
      KPI: ['store/kpi'],
    },
    ITEM_MASTER: {
      ALL: ['item_master/all'],
      DETAILS: ['item_master/details'],
      BY_STORE_DETAILS: ['item_master/details/by_store'],
      ORDER_BY_STORE_DETAILS: ['item_master/details/order_by_store'],
      COMBINE: ['item_master/combine'],
      HISTORY_CHANGE_SELLING_PRICE: ['item_master/price/selling/history'],
    },
  },
};
export default CONSTANT;
