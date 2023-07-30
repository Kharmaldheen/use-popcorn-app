import React, { useEffect, useRef } from "react";
// import { useState } from "react";
// import { useKEY } from "../../useKey";

const Search = ({ query, setQuery }) => {
  const inputEl = useRef(null);

  useKEY("Enter", function () {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery("");
  });

  return (
    <input
      className="search"
      ref={inputEl}
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
};

export default Search;
