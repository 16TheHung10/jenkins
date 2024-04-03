//Plugin
import React from "react";
import $ from "jquery";

//Custom
import BaseComponent from "components/BaseComponent";
import { StringHelper } from "helpers";

export default class SupplierInput extends BaseComponent {
  constructor(props) {
    super(props);
    this.idComponent = this.props.idComponent || "";
    this.suppliers = props.suppliers || {};
    this.activeSuggestion = 0;
    this.filteredSuggestions = [];
    this.showSuggestions = false;
    this.keyword = "";

    this.isRender = true;
  }

  componentDidMount = () => {};

  componentWillReceiveProps = (newProps) => {
    if (newProps.suppliers != this.suppliers) {
      this.suppliers = newProps.suppliers;
    }
    this.refresh();
  };

  getSupplierSelected() {
    return this.keyword;
  }

  handleAddSupplier = () => {
    $("#" + this.idComponent)
      .find("input[name=keywordsupplier]")
      .select();
    this.refresh();
  };

  //Add to keyword
  handleSelectSupplier = (e) => {
    this.activeSuggestion = 0;
    this.filteredSuggestions = [];
    this.showSuggestions = false;
    this.keyword = $(e.currentTarget).attr("data-supplier");
    this.refresh();
  };

  handleChangeSupplier = (e) => {
    let keyword = e.target.value;
    let suggestions = this.suppliers;
    let filteredSuggestions = [];

    if (keyword !== "" && keyword.length > 1) {
      for (let i in suggestions) {
        if (
          StringHelper.searchLike(
            suggestions[i].supplierCode + " " + suggestions[i].supplierName,
            keyword,
          ) !== -1
        ) {
          filteredSuggestions.push(suggestions[i]);
        }
      }
    }
    this.activeSuggestion = 0;
    this.filteredSuggestions = filteredSuggestions;
    this.showSuggestions = true;
    this.keyword = e.target.value;

    this.fieldSelected.keyword = this.keyword;
    if (this.props.updateFilter) {
      this.props.updateFilter(this.keyword);
    }
    this.refresh();
  };

  handleKeydown = (e) => {
    const activeSuggestion = this.activeSuggestion;
    const filteredSuggestions = this.filteredSuggestions;

    var suggestionsHtmlObject = $("#" + this.idComponent).find(".suggestions");
    // User pressed the enter key
    if (e.keyCode === 13) {
      if (this.showSuggestions) {
        this.showSuggestions = false;
        this.keyword = filteredSuggestions[activeSuggestion].supplierCode;
        this.refresh();
        return false;
      } else {
        this.handleAddSupplier();
      }
    }
    // User pressed the up arrow
    else if (e.keyCode === 38) {
      if (activeSuggestion === 0) return;
      this.activeSuggestion = activeSuggestion - 1;

      if (suggestionsHtmlObject.length !== 0) {
        suggestionsHtmlObject.scrollTop(suggestionsHtmlObject.offset().top);
        suggestionsHtmlObject.scrollTop(
          suggestionsHtmlObject.find("li.suggestion-active:last").offset().top -
            suggestionsHtmlObject.height(),
        );
      }
      this.refresh();
    }
    // User pressed the down arrow
    else if (e.keyCode === 40) {
      if (activeSuggestion + 1 === filteredSuggestions.length) return;
      this.activeSuggestion = activeSuggestion + 1;
      if (suggestionsHtmlObject.length !== 0) {
        if (suggestionsHtmlObject.children("li.suggestion-active").length === 0)
          return;
        suggestionsHtmlObject.scrollTop(suggestionsHtmlObject.offset().top);
        suggestionsHtmlObject.scrollTop(
          suggestionsHtmlObject.find("li.suggestion-active:first").offset().top,
        );
      }
      this.refresh();
    }
  };

  renderComp = () => {
    const { activeSuggestion, filteredSuggestions, showSuggestions, keyword } =
      this;
    let suggestionsListComponent;
    if (showSuggestions && keyword) {
      if (filteredSuggestions.length) {
        suggestionsListComponent = (
          <ul className="suggestions">
            {filteredSuggestions.map((suggestion, index) => {
              let className;
              if (index === activeSuggestion) {
                className = "suggestion-active";
              }
              return (
                <li
                  className={className}
                  key={suggestion.supplierCode}
                  data-supplier={suggestion.supplierCode}
                  onClick={this.handleSelectSupplier}
                >
                  {suggestion.supplierCode} - {suggestion.supplierName}
                </li>
              );
            })}
          </ul>
        );
      } else {
        suggestionsListComponent = (
          <div className="no-suggestions">
            <em>Not items !</em>
          </div>
        );
      }
    }
    return (
      <div className="select-suggestions">
        <input
          type="text"
          name="keywordsupplier"
          placeholder="-- Supplier --"
          className="form-control"
          onChange={this.handleChangeSupplier}
          onKeyDown={this.handleKeydown}
          value={keyword}
          autoComplete="off"
        />
        {suggestionsListComponent}
      </div>
    );
  };
}
