//Plugin
import React from 'react';
import Select from 'react-select';

//Custom
import BaseComponent from 'components/BaseComponent';
import { fetchData } from 'helpers/FetchData';
import StringHelper from 'helpers/StringHelper';

import { createListOption, decreaseDate } from 'helpers/FuncHelper';
import ReportingModel from 'models/ReportingModel';

import GenderChart from 'components/mainContent/reporting/chartComp/GenderChart';
import MemberChart from 'components/mainContent/reporting/chartComp/MemberChart';
import TableLoyaltyReport from 'components/mainContent/reporting/tableComp/TableLoyaltyReport';

import { Col, Row, Tabs } from 'antd';

import ReActiveMember from 'components/mainContent/reporting/mktReport/search/ReActiveMember';
import GrossSaleChart from 'components/mainContent/reporting/chartComp/GrossSaleChart';
import StatisticCard from 'components/common/card/statisticCard/StatisticCard';
import Icons from 'images/icons';
const { TabPane } = Tabs;

export default class LoyaltyReport extends BaseComponent {
  constructor(props) {
    super(props);

    // this.autocompleteBarcodeRef = React.createRef();
    // this.idBCAutoCompleteComponent = "autoCompleteBarcode" + StringHelper.randomKey();

    //Default data

    // this.items = [];

    this.dataReport = [];
    this.sumAllMemember = 0;
    this.sumMememberYear = 0;
    this.sumYear = 0;
    this.sumCurrentMonth = 0;
    this.sumYearPartner = 0;
    this.sumCurrentMonthPartner = 0;
    this.allData = {};

    this.dataTopMonth = [];
    this.dataTrans = [];
    this.allDataGender = {};

    this.isChangeTab = false;
    this.dataRewardPoint = [];
    this.dataReActive = [];

    //Data Selected

    this.fieldSelected = this.assignFieldSelected(
      {
        date: decreaseDate(1),
        year: new Date().getFullYear(),
      },
      ['storeCode']
    );

    this.isRender = true;
  }

  componentDidMount() {
    this.handleDataChart();
    this.handleDataTopMonth();
    this.handleDataPartner();
  }

  handleDataChart = () => {
    this.sumAllMemember = 0;
    this.sumMememberYear = 0;
    this.dataReport = [];
    this.optYear = [];
    this.sumYear = 0;
    this.sumCurrentMonth = 0;
    this.allDataGender = {};
    let page = '/loyalty/summary/yearly/memberactive';

    let model = new ReportingModel();
    model.getAllReviewSale(page).then((res) => {
      if (res.status && res.data) {
        if (res.data.loyalty) {
          this.dataReport = res.data.loyalty || [];

          for (let i in this.dataReport) {
            let item = this.dataReport[i];
            item.basketValue = isNaN(parseFloat(item.totalSaleGrossSales) / parseFloat(item.totalNewMember))
              ? 0
              : parseFloat(item.totalSaleGrossSales) / parseFloat(item.totalNewMember);
          }

          this.sumYear = this.handleFilterYear(new Date().getFullYear(), res.data.loyalty);
          this.sumYearPartner = this.handleFilterYearPartner(new Date().getFullYear(), res.data.loyalty);
          this.sumCurrentMonth = this.handleFilterCurrentMonth(
            new Date().getFullYear(),
            new Date().getMonth() + 1,
            res.data.loyalty
          );
          this.sumCurrentMonthPartner = this.handleFilterCurrentMonthPartner(
            new Date().getFullYear(),
            new Date().getMonth() + 1,
            res.data.loyalty
          );

          let newObj = {};
          let gender = {};

          for (let k in res.data.loyalty) {
            let item = res.data.loyalty[k];
            this.sumAllMemember += parseFloat(item.totalNewMember);

            if (!newObj[item.yearKey]) {
              newObj[item.yearKey] = 0;
              gender[item.yearKey] = {};
              gender[item.yearKey].totalNewGenderMale = 0;
              gender[item.yearKey].totalNewGenderFemale = 0;
              gender[item.yearKey].totalNewGenderUndefined = 0;
            }

            newObj[item.yearKey] += parseFloat(item.totalNewMember);
            gender[item.yearKey].totalNewGenderMale += item.totalNewGenderMale;
            gender[item.yearKey].totalNewGenderFemale += item.totalNewGenderFemale;
            gender[item.yearKey].totalNewGenderUndefined += item.totalNewGenderUndefined;
          }
          this.optYear = createListOption(res.data.loyalty, 'yearKey');

          this.allDataGender = gender;

          this.refresh();
        }
      } else {
        this.showAlert('Member year: ' + res.message);
      }
    });
  };

  handleDataPartner = () => {
    this.allData = {};

    let page = '/loyalty/summary/yearly/memberpartneractive';
    let model = new ReportingModel();
    model.getAllReviewSale(page).then((res) => {
      if (res.status && res.data) {
        if (res.data.loyalty) {
          let results = res.data.loyalty;
          let obj = {};

          for (let key in results) {
            let item = results[key];

            if (!obj[item.yearKey]) {
              obj[item.yearKey] = {};
            }

            if (!obj[item.yearKey][item.monthKey]) {
              obj[item.yearKey][item.monthKey] = {};
            }

            if (!obj[item.yearKey][item.monthKey][item.partnerSource]) {
              obj[item.yearKey][item.monthKey][item.partnerSource] = item.totalNewMember;
            }
          }

          this.allData = obj;

          this.refresh();
        }
      }
    });
  };

  handleDataTopMonth = () => {
    this.dataTopMonth = [];

    let page = '/loyalty/summary/monthly/highestpoint';

    let model = new ReportingModel();
    model.getAllReviewSale(page).then((res) => {
      if (res.status && res.data) {
        if (res.data.loyalty) {
          this.dataTopMonth = res.data.loyalty;
          this.refresh();
        }
      } else {
        this.showAlert('Top member month: ' + res.message);
      }
    });
  };

  handleDataRewardPoint = () => {
    this.dataRewardPoint = [];
    let page = '/loyalty/summary/monthly/highestrewardpoint';

    let model = new ReportingModel();
    model.getAllReviewSale(page).then((res) => {
      if (res.status && res.data) {
        if (res.data.loyalty) {
          this.dataRewardPoint = res.data.loyalty;
          this.refresh();
        }
      } else {
        this.showAlert('Top reward month: ' + res.message);
      }
    });
  };

  handleSearch = () => {
    this.handleDataChart();
    this.handleDataTopMonth();
    this.handleDataPartner();
    // this.items = [];

    // let page = "";
    // let params = {
    //     // storeCode: this.fieldSelected.storeCode,
    //     date: this.fieldSelected.date !== "" ? DateHelper.displayDateFormatMinus(this.fieldSelected.date) : ""
    // };

    // let model = new ReportingModel();

    // if (this.fieldSelected.storeCode === "") {
    //     page = "summary/monthly";
    // }
    // else {
    //     page = "summary/monthly/all";
    // }

    // await model.getInfoLoyalty(page,params).then(res=>{
    //     if (res.status && res.data) {
    //         if (res.data.loyalty) {
    //             this.items = res.data.loyalty;

    //         }
    //     }
    //     else {
    //         this.showAlert("System busy!");
    //     }
    // });

    // this.refresh();
  };

  handleFilter = (items) => {
    let list = items;
    if (this.fieldSelected) {
      if (this.fieldSelected.storeCode !== '') {
        list = items.filter((a, ia) => a.storeCode === this.fieldSelected.storeCode);
      }
    }
    return list;
  };

  // isFilterDetailValid = (objDetails) => {
  //     var isResult = this.fieldSelected.cat === '' && this.fieldSelected.barcode === '';
  //     if(this.fieldSelected){

  //         for(var k in objDetails){
  //             var item = objDetails[k];
  //             if((this.fieldSelected.cat === '' || item.categoryCode.indexOf(this.fieldSelected.cat) !== -1)
  //                 &&
  //                 (this.fieldSelected.barcode === '' || item.barcode.indexOf(this.fieldSelected.barcode) !== -1)
  //                 ){
  //                 isResult = true;
  //             }
  //         }
  //     }
  //     return isResult;
  // }

  handleFilterYear = (condition = '', lst = null) => {
    this.sumYear = 0;

    if (condition !== '') {
      if (lst !== null) {
        for (let i in lst) {
          let item = lst[i];

          if (item.yearKey == condition) {
            this.sumYear += parseFloat(item.totalNewMember);
          }
        }
        return this.sumYear;
      } else {
        for (let i in this.dataReport) {
          let item = this.dataReport[i];

          if (item.yearKey == condition) {
            this.sumYear += parseFloat(item.totalNewMember);
          }
        }
        this.refresh();
      }
    } else {
      this.sumYear = this.sumAllMemember;
      this.refresh();
    }
  };

  handleFilterYearPartner = (condition = '', lst = null) => {
    this.sumYearPartner = 0;

    if (condition !== '') {
      if (lst !== null) {
        for (let i in lst) {
          let item = lst[i];

          if (item.yearKey == condition) {
            this.sumYearPartner += parseFloat(item.totalNewMemberPartner);
          }
        }
        return this.sumYearPartner;
      } else {
        for (let i in this.dataReport) {
          let item = this.dataReport[i];

          if (item.yearKey == condition) {
            this.sumYearPartner += parseFloat(item.totalNewMemberPartner);
          }
        }
        this.refresh();
      }
    } else {
      this.sumYearPartner = this.sumAllMemember;
      this.refresh();
    }
  };

  handleFilterCurrentMonth = (condition = '', condition2 = '', lst = null) => {
    this.sumCurrentMonth = 0;

    if (condition !== '') {
      if (lst !== null) {
        for (let i in lst) {
          let item = lst[i];

          if (item.yearKey == condition) {
            let abc = item.monthKey.toString().slice(-2);
            if (condition2 !== '' && condition2 == abc) {
              this.sumCurrentMonth += parseFloat(item.totalNewMember);
            }
          }
        }

        return this.sumCurrentMonth;
      } else {
        for (let i in this.dataReport) {
          let item = this.dataReport[i];

          if (item.yearKey == condition) {
            let abc = item.monthKey.toString().slice(-2);
            if (condition2 !== '' && condition2 == abc) {
              this.sumCurrentMonth += parseFloat(item.totalNewMember);
            }
          }
        }

        this.refresh();
      }
    } else {
      this.sumCurrentMonth = this.sumAllMemember;
      this.refresh();
    }
  };

  handleFilterCurrentMonthPartner = (condition = '', condition2 = '', lst = null) => {
    this.sumCurrentMonthPartner = 0;

    if (condition !== '') {
      if (lst !== null) {
        for (let i in lst) {
          let item = lst[i];

          if (item.yearKey == condition) {
            let abc = item.monthKey.toString().slice(-2);
            if (condition2 !== '' && condition2 == abc) {
              this.sumCurrentMonthPartner += parseFloat(item.totalNewMemberPartner);
            }
          }
        }

        return this.sumCurrentMonthPartner;
      } else {
        for (let i in this.dataReport) {
          let item = this.dataReport[i];

          if (item.yearKey == condition) {
            let abc = item.monthKey.toString().slice(-2);
            if (condition2 !== '' && condition2 == abc) {
              this.sumCurrentMonthPartner += parseFloat(item.totalNewMemberPartner);
            }
          }
        }

        this.refresh();
      }
    } else {
      this.sumCurrentMonthPartner = this.sumAllMemember;
      this.refresh();
    }
  };

  handleReturnNamePartner = (value) => {
    switch (value) {
      case 'skl':
        return 'Sơn Kim';
      default:
        return value;
    }
  };

  handleClickChangeTab = (e) => {
    if (this.isChangeTab) return false;
    this.isChangeTab = true;
    if (e == 3) {
      this.handleGetDataReactive();
    } else {
      this.handleDataRewardPoint();
    }
  };

  handleGetDataReactive = async () => {
    try {
      const url = '/loyalty/member/overview/reactive';

      const response = await fetchData(url, 'GET', null, null, process.env.REACT_APP_ANALYTIC_REPORT_ROOT_URL);

      if (response?.status) {
        const result = response.data?.loyalty;

        const list = result?.map((item) => ({
          ...item,
          title: item.title?.replace('Re-active member', ''),
        }));

        // const listOptInternalCode = createListOption(result, 'internalCode');

        // const uniqueDeliveryBy = new Set(result.map(item => item.deliveryBy));

        // const listOptDeliveryBy = Array.from(uniqueDeliveryBy).map(el => ({ value: el, label: el }));

        this.dataReActive = list;
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
    } finally {
      this.refresh();
    }
  };

  renderComp() {
    // let itemSort = this.items.sort(function(a, b) { return new Date(a.invoiceDate) - new Date(b.invoiceDate) }) || [];
    // let items = this.handleFilter(this.dataTrans);
    let dataTopMonth = this.dataTopMonth;
    let dataRewardPoint = this.dataRewardPoint;
    let dataReActive = this.dataReActive;

    let objAll = {};

    for (let a in this.allData) {
      let itemA = this.allData[a];

      for (let b in itemA) {
        let itemB = itemA[b];

        for (let c in itemB) {
          let itemC = itemB[c];

          if (!objAll[c]) {
            objAll[c] = 0;
          }
          objAll[c] += itemC;
        }
      }
    }

    let dataGender = Object.keys(this.allDataGender).length > 0 ? this.allDataGender[this.fieldSelected.year] : {};

    let arrGenderData = [];
    for (let a in dataGender) {
      let gen = dataGender[a];
      arrGenderData.push({
        type: a === 'totalNewGenderFemale' ? 'Female' : a === 'totalNewGenderMale' ? 'Male' : 'Underfined',
        value: gen,
      });
    }

    let dataTab = [
      {
        key: '1',
        label: 'Top transaction point',
        children: <TableLoyaltyReport dataTopMonth={dataTopMonth} type="trans" />,
      },
      {
        key: '2',
        label: 'Top bonus point',
        children: <TableLoyaltyReport dataTopMonth={dataRewardPoint} type="bonus" />,
      },
      {
        key: '3',
        label: 'Top re-active',
        children: <ReActiveMember data={dataReActive} />,
      },
    ];

    return (
      <div className="container-table">
        <div className="detail-tab row  mrt-10">
          <div className="col-md-12">
            <div
              style={{
                borderColor: 'rgb(0,154,255)',
                border: 'none',
                paddingTop: 5,
              }}
            >
              <div className="section-block mb-10">
                <Row gutter={[16, 16]}>
                  <Col span={24} xl={24} xxl={4}>
                    <div>
                      <label htmlFor="year" className="w100pc cl-black">
                        Year:
                      </label>
                      <Select
                        isClearable
                        classNamePrefix="select"
                        maxMenuHeight={260}
                        placeholder="-- All --"
                        value={this.optYear && this.optYear.filter((option) => option.value == this.fieldSelected.year)}
                        options={this.optYear}
                        onChange={(e) =>
                          this.handleChangeFieldCustom('year', e ? e.value : '', () =>
                            this.handleFilterYear(e ? e.value : '')
                          )
                        }
                      />
                    </div>
                  </Col>
                  <Col span={24} xl={24} xxl={20}>
                    <div className="flex" style={{ justifyContent: 'space-evenly' }}>
                      <StatisticCard
                        title="Active member in year"
                        value={StringHelper.formatValue(this.sumYear)}
                        icon={<Icons.User />}
                      />

                      <StatisticCard
                        title="Active partner in year"
                        value={StringHelper.formatValue(this.sumYearPartner)}
                        icon={<Icons.User />}
                        color="green"
                      />
                      <StatisticCard
                        title="Active member current month"
                        value={StringHelper.formatValue(this.sumCurrentMonth)}
                        icon={<Icons.User />}
                        color="orange"
                      />
                      <StatisticCard
                        title="Total member"
                        value={StringHelper.formatValue(this.sumAllMemember)}
                        icon={<Icons.User />}
                        color="red"
                      />
                    </div>
                  </Col>
                </Row>

                {this.fieldSelected.year !== '' ? (
                  <div className="row mt-15">
                    <div className="col-md-6">
                      <Tabs
                        defaultActiveKey="1"
                        items={[
                          {
                            key: '1',
                            label: 'Member',
                            children: <MemberChart data={this.dataReport} year={this.fieldSelected.year} />,
                          },
                          {
                            key: '2',
                            label: 'Gross sale',
                            children: <GrossSaleChart data={this.dataReport} year={this.fieldSelected.year} />,
                          },
                        ]}
                      />
                    </div>
                    <div className="col-md-4 pdt-10 text-center">
                      <h5 className=" fs-10">Gender member</h5>
                      <div className="d-inline-block" style={{ maxHeight: 250, maxWidth: 270 }}>
                        <GenderChart data={arrGenderData} />
                      </div>
                    </div>
                    <div className="col-md-2 pdt-10">
                      {Object.keys(this.allData).length > 0 && this.allData[this.fieldSelected.year] ? (
                        <div className="row">
                          <div className="col-md-12 text-center">
                            {/* <div className="bg-block"> */}
                            <h5 className="mrt-0 mrb-10 fs-10">Top active member partner </h5>
                            <div className="wrap-tb of-initial">
                              <table className="table d-inline-block of-auto ">
                                <tbody>
                                  <tr>
                                    <td className="fs-10 pd-5 bd-none rule-number fw-bold">Partner</td>
                                    <td className="fs-10 pd-5 bd-none rule-number fw-bold">Member</td>
                                  </tr>
                                  {Object.keys(objAll).length > 0
                                    ? Object.keys(objAll).map((el, inEl) => {
                                        return el !== 'gs25' ? (
                                          <tr key={inEl} style={{ border: 'none' }}>
                                            <td
                                              className="fs-10 pd-5 bd-none rule-number"
                                              style={{ background: 'ivory' }}
                                            >
                                              {this.handleReturnNamePartner(el)}
                                            </td>
                                            <td
                                              className="fs-10 pd-5 bd-none rule-number"
                                              style={{
                                                background: 'aliceblue',
                                              }}
                                            >
                                              {StringHelper.formatValue(objAll[el])}
                                            </td>
                                          </tr>
                                        ) : null;
                                      })
                                    : null}
                                </tbody>
                              </table>
                            </div>
                            {/* </div> */}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="section-block">
                <Row>
                  <Col xl={24}>
                    <Tabs defaultActiveKey="1" onChange={(e) => this.handleClickChangeTab(e)} items={dataTab} />
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
