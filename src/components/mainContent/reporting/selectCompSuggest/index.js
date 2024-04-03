//Plugin
import React from "react";
import $ from "jquery";

//Custom
import BaseComponent from "components/BaseComponent";
import StringHelper from "helpers/StringHelper";

class AutocompleteBarcode extends BaseComponent {
  constructor(props) {
    super(props);
    this.idComponent = this.props.idComponent || "";
    this.barCodes = this.props.barCodes || {};
    this.activeSuggestion = 0;
    this.filteredSuggestions = [];
    this.showSuggestions = false;
    this.keyword = "";
    this.isRender = true;
  }

  componentWillReceiveProps = (newProps) => {
    if (newProps.barCodes != this.barCodes) {
      this.barCodes = newProps.barCodes;
      this.filteredSuggestions = [];
    }
  };

  getBarcodeSelected() {
    return this.keyword;
  }

  setNewValue(val) {
    this.keyword = val;
    this.refresh();
  }

  // handleAddBarcode = () => {
  // 	$("#" + this.idComponent).find('input[name=keywordbarcode]').select();
  // 	this.props.AddBarcode(this.keyword);
  // 	this.refresh();
  // }

  //Find suggestion
  handleChangeBarcode = (e) => {
    let suggestions = this.barCodes;
    let filteredSuggestions = [];
    let keyword = e.target.value;
    if (keyword !== "" && keyword.length > 1) {
      for (let i in suggestions) {
        if (
          StringHelper.searchLike(
            suggestions[i].itemCode + " " + suggestions[i].itemName,
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
    if (this.props.updateFilter && keyword === "") {
      this.props.updateFilter(this.keyword, this.props.keyCode);
    }
    // if (this.keyword === "") {
    // 	this.props.updateFilter(this.keyword, true);
    // }
    this.refresh();
  };

  //Add to keyword
  handleSelectBarcode = (e) => {
    this.activeSuggestion = 0;
    this.filteredSuggestions = [];
    this.showSuggestions = false;
    this.keyword = $(e.currentTarget).attr("data-itemcode");
    // if (this.props.updateFilter) {
    // 	this.props.updateFilter(this.keyword, true);
    // }
    if (this.props.updateFilter) {
      this.props.updateFilter(this.keyword, this.props.keyCode);
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
        this.keyword =
          filteredSuggestions &&
          filteredSuggestions[activeSuggestion] &&
          filteredSuggestions[activeSuggestion].itemCode
            ? filteredSuggestions[activeSuggestion].itemCode
            : "";
        this.refresh();
        return false;
      } else {
        // this.handleAddBarcode();
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
                  key={suggestion.itemCode}
                  data-itemcode={suggestion.itemCode}
                  onClick={this.handleSelectBarcode}
                >
                  {suggestion.itemCode} - {suggestion.itemName}
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
          name="keywordbarcode"
          className="form-control"
          onChange={this.handleChangeBarcode}
          // onKeyDown={ this.handleKeydown }
          value={keyword}
          autoComplete="off"
          style={{
            fontSize: 12,
            padding: "6px 12px",
            height: 30,
            borderRadius: 2,
          }}
        />
        {suggestionsListComponent}
      </div>
    );
  };
}

export default AutocompleteBarcode;
