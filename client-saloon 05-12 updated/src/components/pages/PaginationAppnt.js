import React from 'react';

const PaginationAppnt = ({
  currentPage,
  totalPages,
  handlePageChange,
  handleFirstPageClick,
  handlePreviousPageClick,
  handleNextPageClick,
  handleLastPageClick,
  getDisplayedPages,
  filteredAppnts, // Assuming filteredItems is defined in your code
}) => {
  return (
    <div className="entries-div11">
      {/* <div>
        Showing {currentPage * itemsPerPage - itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredItems.length)} of {filteredItems.length} entries
      </div> */}
      <div>
        <button className="badges" onClick={handleFirstPageClick}>First</button>
        <button className="badges" onClick={handlePreviousPageClick}>Previous</button>
        {getDisplayedPages().map((pageNumber) => (
          <button
            key={pageNumber}
            className={`badges ${pageNumber === currentPage ? 'active' : ''}`}
            onClick={() => handlePageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}
        <button className="badges" onClick={handleNextPageClick}>Next</button>
        <button className="badges" onClick={handleLastPageClick}>Last</button>
      </div>
    </div>
  );
};

export default PaginationAppnt;