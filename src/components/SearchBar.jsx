import { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      term: searchTerm.trim(),
      category: searchCategory,
      location: searchLocation.trim()
    });
  };

  const handleReset = () => {
    setSearchTerm("");
    setSearchCategory("");
    setSearchLocation("");
    onSearch({ term: "", category: "", location: "" });
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title mb-3">
          <i className="bi bi-search me-2"></i>
          Search Events
        </h5>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-text-left"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by title or description"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="col-md-3">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-tag"></i>
                </span>
                <select
                  className="form-select"
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  <option value="Technology">Technology</option>
                  <option value="Business">Business</option>
                  <option value="Education">Education</option>
                  <option value="Arts">Arts</option>
                  <option value="Music">Music</option>
                  <option value="Sports">Sports</option>
                  <option value="Food">Food</option>
                  <option value="Health">Health</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="col-md-3">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-geo-alt"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Location"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
              </div>
            </div>
            
            <div className="col-md-2 d-flex">
              <button type="submit" className="btn btn-primary me-2 flex-grow-1">
                Search
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleReset}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
