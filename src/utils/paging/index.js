import React, { useEffect, useState } from "react";
import "./style.scss";

export default function Paging({ currentPage, totalPages, onPageChange }) {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  let startPage = Math.max(currentPage - 2, 1);
  let endPage = Math.min(currentPage + 2, totalPages);

  if (startPage === 1) {
    endPage = Math.min(5, totalPages);
  } else if (endPage === totalPages) {
    startPage = Math.max(endPage - 4, 1);
  } else if (endPage - startPage < 4) {
    startPage = Math.max(endPage - 4, 1);
  }

  const ellipsisStart = startPage > 1;
  const ellipsisEnd = endPage < totalPages;

  return (
    // <nav>

    <ul className="pagination-custom">
      <li className={currentPage === 1 ? "page-item disabled" : "page-item"}>
        <button
          disabled={currentPage === 1 ? true : false}
          className={"page-link"}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>
      </li>

      {startPage > 1 && (
        <li className="page-item">
          <button className="page-link" onClick={() => onPageChange(1)}>
            1
          </button>
        </li>
      )}

      {ellipsisStart && (
        <li className="page-item disabled">
          <span className="page-link">...</span>
        </li>
      )}

      {pageNumbers.slice(startPage - 1, endPage).map((pageNumber) => (
        <li
          key={pageNumber}
          className={
            pageNumber === currentPage ? "page-item active" : "page-item"
          }
        >
          <button
            className="page-link"
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        </li>
      ))}

      {ellipsisEnd && (
        <li className="page-item disabled">
          <span className="page-link">...</span>
        </li>
      )}

      {endPage < totalPages && (
        <li className="page-item">
          <button
            className="page-link"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </button>
        </li>
      )}

      <li
        className={
          currentPage === totalPages ? "page-item disabled" : "page-item"
        }
      >
        <button
          disabled={currentPage === totalPages ? true : false}
          className={"page-link"}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </li>
    </ul>
    // </nav>
  );
}
