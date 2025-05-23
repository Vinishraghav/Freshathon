import { useState } from "react";

const DateFilter = ({ onDateFilterChange }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateRange, setDateRange] = useState("all");

  const handleDateRangeChange = (e) => {
    const range = e.target.value;
    setDateRange(range);
    
    // Calculate date range based on selection
    const today = new Date();
    let start = "";
    let end = "";
    
    switch (range) {
      case "today":
        start = today.toISOString().split("T")[0];
        end = start;
        break;
      case "tomorrow":
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        start = tomorrow.toISOString().split("T")[0];
        end = start;
        break;
      case "thisWeek":
        start = today.toISOString().split("T")[0];
        const thisWeekEnd = new Date(today);
        thisWeekEnd.setDate(today.getDate() + (7 - today.getDay()));
        end = thisWeekEnd.toISOString().split("T")[0];
        break;
      case "thisMonth":
        start = today.toISOString().split("T")[0];
        const thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        end = thisMonthEnd.toISOString().split("T")[0];
        break;
      case "custom":
        // Keep current custom dates
        break;
      default:
        // All events (no date filter)
        start = "";
        end = "";
    }
    
    setStartDate(start);
    setEndDate(end);
    
    // Notify parent component
    onDateFilterChange({ startDate: start, endDate: end });
  };

  const handleCustomDateChange = (type, value) => {
    if (type === "start") {
      setStartDate(value);
      // If end date is before start date, update end date
      if (endDate && value > endDate) {
        setEndDate(value);
      }
    } else {
      setEndDate(value);
      // If start date is after end date, update start date
      if (startDate && value < startDate) {
        setStartDate(value);
      }
    }
    
    // Set range to custom
    setDateRange("custom");
    
    // Notify parent component
    onDateFilterChange({
      startDate: type === "start" ? value : startDate,
      endDate: type === "end" ? value : endDate
    });
  };

  return (
    <div className="mb-4">
      <h5 className="mb-3">
        <i className="bi bi-calendar-range me-2"></i>
        Date Range
      </h5>
      
      <div className="mb-3">
        <select
          className="form-select"
          value={dateRange}
          onChange={handleDateRangeChange}
        >
          <option value="all">All Dates</option>
          <option value="today">Today</option>
          <option value="tomorrow">Tomorrow</option>
          <option value="thisWeek">This Week</option>
          <option value="thisMonth">This Month</option>
          <option value="custom">Custom Range</option>
        </select>
      </div>
      
      {dateRange === "custom" && (
        <div className="row g-2">
          <div className="col-6">
            <label htmlFor="startDate" className="form-label">From</label>
            <input
              type="date"
              className="form-control"
              id="startDate"
              value={startDate}
              onChange={(e) => handleCustomDateChange("start", e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div className="col-6">
            <label htmlFor="endDate" className="form-label">To</label>
            <input
              type="date"
              className="form-control"
              id="endDate"
              value={endDate}
              onChange={(e) => handleCustomDateChange("end", e.target.value)}
              min={startDate || new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DateFilter;
