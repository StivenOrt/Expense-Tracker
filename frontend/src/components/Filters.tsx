import { useState } from 'react';
import type { FormEvent } from 'react';
import type { ListFilters } from '../types';

interface FiltersProps {
  filters: ListFilters;
  onChange: (filters: ListFilters) => void;
}

export default function Filters({ filters, onChange }: FiltersProps) {
  const [category, setCategory] = useState(filters.category ?? '');
  const [startDate, setStartDate] = useState(filters.startDate ?? '');
  const [endDate, setEndDate] = useState(filters.endDate ?? '');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onChange({
      category: category.trim() || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
  };

  const handleClear = () => {
    setCategory('');
    setStartDate('');
    setEndDate('');
    onChange({});
  };

  return (
    <form className="filters" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Filter by category"
        value={category}
        onChange={(event) => setCategory(event.target.value)}
      />
      <label>
        From
        <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
      </label>
      <label>
        To
        <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
      </label>
      <button type="submit">Apply</button>
      <button type="button" className="secondary" onClick={handleClear}>
        Clear
      </button>
    </form>
  );
}
