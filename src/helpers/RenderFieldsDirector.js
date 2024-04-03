import React from "react";

class RenderFieldsDirector extends React.Component {
  constructor(Builder) {
    super();
    this.builder = new Builder();
    this.state = {
      fcCity: "",
      fcDistrict: "",
    };
  }

  handleChangeCity(value) {}

  fcManagementOverview() {
    if (this.builder) {
      return [
        // this.builder.selectFactory('multipleStore'),
        // this.builder.datePickerFactory('range', true, { name: 'testDate' }),
        this.builder.inputTextFactory("promotionName"),
        // this.builder.inputTextFactory('singleStore'),
        // this.builder.selectFactory('status'),
      ];
    }
  }
  fcManagementDetails({ selectedCity, selectedDistrict }) {
    if (this.builder) {
      return [
        this.builder.selectFactory("singleStore", true, {
          placeholder: "Select store",
        }),
        this.builder.datePickerFactory("range", true),
        this.builder.selectFactory("fcModel", true),
        this.builder.inputTextFactory("fcContactName", true),
        this.builder.inputTextFactory("fcMobile", true),
        this.builder.inputTextFactory("fcEmail", true),

        this.builder.selectFactory("fcCity", true),
        {
          ...this.builder.selectFactory("fcDistrict", true),
          options:
            this.builder
              .selectFactory("fcDistrict", true)
              .options.filter((el) => +el.province_code === +selectedCity)
              .map((el) => ({ value: el.code, label: el.name })) || [],
        },
        {
          ...this.builder.selectFactory("fcWard", true),
          options:
            this.builder
              .selectFactory("fcWard", true)
              .options.filter((el) => +el.district_code === +selectedDistrict)
              .map((el) => ({ value: el.code, label: el.name })) || [],
        },
        this.builder.inputTextFactory("fcAddress", true),
        this.builder.inputTextFactory("fcCompanyInfor", true),
        this.builder.inputTextFactory("fcTaxCode", true),
      ];
    }
  }
}
export default RenderFieldsDirector;
