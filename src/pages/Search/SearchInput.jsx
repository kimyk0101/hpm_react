import { FiSearch } from "react-icons/fi";
import React from "react";

const SearchInput = ({ query, setQuery, onSearch }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery("");
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="input-clear-button"
          >
            ✕
          </button>
        )}
        <button type="submit" className="input-search-button">
          <FiSearch />
        </button>
      </div>
    </form>
  );
};

export default SearchInput;
