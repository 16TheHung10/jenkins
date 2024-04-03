//Plugin
import React from "react";
import BaseComponent from "components/BaseComponent";
import Select from "react-select";

class Sort extends BaseComponent {
  constructor(props) {
    super(props);
    this.isRender = true;
  }

  handleChange(name, value) {
    this.props.onChange(name, value, this.props.trigger);
  }

  renderComp() {
    let values = this.props.options;
    let optionSortBy = values.map((item) => {
      return { value: item.value, label: item.label };
    });
    let optionSortOrder = [
      { value: "asc", label: "Ascending" },
      { value: "desc", label: "Descending" },
    ];

    return (
      <div className="row wrap-sort">
        <div className="col-md-6">
          <Select
            name="sortBy"
            classNamePrefix="select"
            value={optionSortBy.filter(
              (option) => option.value == this.props.sortBy,
            )}
            placeholder="-Sort by-"
            options={optionSortBy}
            onChange={(e) => this.handleChange("sortBy", e.value)}
          />
        </div>
        <div className="col-md-6">
          <Select
            name="sortOrder"
            classNamePrefix="select"
            value={optionSortOrder.filter(
              (option) => option.value === this.props.sortOrder,
            )}
            placeholder="-Sort order-"
            options={optionSortOrder}
            onChange={(e) => this.handleChange("sortOrder", e.value)}
          />
        </div>
      </div>
    );
  }
}

export default Sort;
