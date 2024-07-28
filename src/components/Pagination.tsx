// components/Pagination.tsx

'use client';

import React from 'react';
import { Pagination } from 'react-bootstrap';

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (rows: number) => void;
}

const CustomPagination: React.FC<Props> = ({ currentPage, totalPages, onPageChange, rowsPerPage, setRowsPerPage }) => {
  const maxVisiblePages = 5;

  const getPageNumbers = () => {
    const pageNumbers = [];
    const half = Math.floor(maxVisiblePages / 2);

    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, currentPage + half);

    if (currentPage <= half) {
      end = Math.min(totalPages, maxVisiblePages);
    }

    if (currentPage + half >= totalPages) {
      start = Math.max(1, totalPages - maxVisiblePages + 1);
    }

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="d-flex justify-content-between align-items-center">
      <div>
        <label htmlFor="rowsPerPage">Rows per page: </label>
        <select
          id="rowsPerPage"
          value={rowsPerPage}
          onChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
          className="ml-2"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
      <Pagination>
        <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
        {currentPage > Math.ceil(maxVisiblePages / 2) + 1 && (
          <>
            <Pagination.Item onClick={() => handlePageChange(1)}>1</Pagination.Item>
            <Pagination.Ellipsis />
          </>
        )}
        {getPageNumbers().map((page) => (
          <Pagination.Item
            key={page}
            active={page === currentPage}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </Pagination.Item>
        ))}
        {currentPage < totalPages - Math.ceil(maxVisiblePages / 2) && (
          <>
            <Pagination.Ellipsis />
            <Pagination.Item onClick={() => handlePageChange(totalPages)}>{totalPages}</Pagination.Item>
          </>
        )}
        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
        <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
      </Pagination>
    </div>
  );
};

export default CustomPagination;
