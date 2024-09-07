
import { useState } from 'react';


const DateRange = ({range}) => {
  const [selectedRange, setSelectedRange] = useState('');

  const handleChange = (e) => {
    setSelectedRange(e.target.value);
    range(e.target.value);
  };

  return (
    <select
      id="date-range"
      value={selectedRange}
      onChange={handleChange}
      className="bg-gray-50 border border-gray-300 text-gray-900 mb-2 text-sm w-[150px] focus:outline-none block p-1"
    >
      <option disabled value="">
        Select Date Range
      </option>
      {['last 30 min', 'last 1 hour', 'last 6 hours', 'last 24 hours', 'All Problems'].map((item, index) => (
        <option key={index} value={item}>
          {item}
        </option>
      ))}
    </select>
  );
};

export default DateRange;
