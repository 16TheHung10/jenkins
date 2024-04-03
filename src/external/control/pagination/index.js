import React from 'react';
import ReactPaginate from 'react-paginate';
import ControlComponent from 'external/ControlComponent';

class Paging extends ControlComponent {
  constructor(props) {
    super(props);
    this.page = this.props.page;
    this.itemCount = this.props.itemCount;
    this.handlePageClick = this.handlePageClick.bind(this);
    this.handlePageClickExport = this.handlePageClickExport.bind(this);
    this.calPageCount = this.calPageCount.bind(this);
    this.mode = this.props.mode || false;
    this.pageSize = this.props.pageSize || 30;
    this.pageSize2 = this.props.pageSize2 || 30;
    this.pageExport = 1;
  }

  componentWillReceiveProps(newProps) {
    if (this.props.page !== newProps.page || this.props.itemCount !== newProps.itemCount || this.props.pageSize !== newProps.pageSize || this.props.pageSize2 !== newProps.pageSize2) {
      this.itemCount = newProps.itemCount;
      this.page = newProps.page;
      this.pageSize = newProps.pageSize;

      this.refresh();
    }
  }

  calPageCount(itemCount) {
    // return Math.ceil(parseInt(itemCount, 10) / parseInt(process.env.REACT_APP_PAGE_SIZE, 10));
    return Math.ceil(parseInt(itemCount, 10) / parseInt(this.pageSize || this.pageSize2, 10));
  }

  handlePageClick(data) {
    let page = data.selected + 1;
    this.props.onClickPaging(page);
    this.props.onClickSearch();
  }

  handlePageClickExport() {
    // var eachPage = process.env.REACT_APP_PAGE_SIZE_2;
    var eachPage = this.pageSize2;

    if (this.props.listItemLength >= eachPage) {
      this.pageExport += 1;
    } else {
      this.pageExport = this.pageExport;
    }

    this.props.onClickPaging(this.pageExport);
    this.props.onClickSearch();
  }

  render() {
    let pageCount = this.calPageCount(this.itemCount);
    let forcePage = parseInt(this.page, 10) - 1;
    let { listItemLength } = this.props;
    // let eachPage = process.env.REACT_APP_PAGE_SIZE_2;
    let eachPage = this.pageSize2;
    if (pageCount > 1) {
      if (this.props.mode) {
        if (listItemLength >= eachPage) {
          return (
            <div className="text-center">
              <span className="btn btn-loadmore" onClick={this.handlePageClickExport}>
                Load more
              </span>
            </div>
          );
        } else {
          return null;
        }
      } else {
        return (
          <ReactPaginate
            forcePage={forcePage}
            pageCount={pageCount}
            pageRangeDisplayed={parseInt(process.env.REACT_APP_PAGE_RANGE_DISPLAY, 10)}
            onPageChange={this.handlePageClick}
            previousLabel={'previous'}
            nextLabel={'next'}
            breakLabel={'...'}
            containerClassName={'pagination'}
            subContainerClassName={'page pagination'}
            activeClassName={'active'}
          />
        );
      }
    } else {
      return null;
    }
  }
}

export default Paging;
