import React from "react";
import ReactPaginate from "react-paginate";
import ControlComponent from "external/ControlComponent";
import Select from "react-select";

class SelectOption extends ControlComponent {
  constructor(props) {
    super(props);
    this.options = props.options;
    this.maxMenuHeight = props.maxMenuHeight;
    this.classNamePrefix = props.classNamePrefix;
    this.className = props.className;
    this.onChange = props.onChange;
    this.isClearable = props.isClearable;
  }

  componentWillReceiveProps(newProps) {
    if (this.props.options !== newProps.options) {
      this.options = newProps.options;
    }
  }

  addOptions(options, index = null) {
    this.options = options;
    this.optionValue =
      index && options && options[index] ? options[index].value : null;
    this.refresh();
  }

  onChangeTrigger(e) {
    this.optionValue = e ? e.value : null;
    let ret = this.onChange(e);
    this.refresh();
    return ret;
  }

  render() {
    return (
      <Select
        classNamePrefix={this.classNamePrefix}
        className={this.className}
        maxMenuHeight={this.maxMenuHeight}
        options={this.options}
        value={
          this.options
            ? this.options.filter((option) => option.value === this.optionValue)
            : null
        }
        isClearable={this.isClearable}
        onChange={(e) => this.onChangeTrigger(e)}
      />
    );
  }
}

export default SelectOption;
