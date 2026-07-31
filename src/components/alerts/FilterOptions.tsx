import React from 'react';

import { Search } from '@styled-icons/fa-solid/Search'

export type PeriodEffectFilter = 'non-expired' | 'expired' | null;

export interface FilterOptionsProps {
  searchValue: string;
  periodEffectFilter: PeriodEffectFilter;
  onSearchChange: (value: string) => void;
  onPeriodEffectFilterChange: (value: PeriodEffectFilter) => void;
}

export default class FilterOptions extends React.Component<FilterOptionsProps> {
  render() {
    const { searchValue, periodEffectFilter, onSearchChange, onPeriodEffectFilterChange } = this.props;

    return (
      <div className="filter-options">
        <div className="filter-options__search">
          <Search className="filter-options__search-icon" />
          <input
            className="filter-options__input"
            name='search'
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by route ID or name"
            type="text"
            value={searchValue}
          />
        </div>
        <div className="filter-options__period-effect-group">
          <label className="filter-options__period-effect-option">
            <input
              checked={periodEffectFilter === 'non-expired'}
              onChange={(e) => onPeriodEffectFilterChange(e.target.checked ? 'non-expired' : null)}
              type="checkbox"
            />
            <span>Non-expired alerts</span>
          </label>
          <label className="filter-options__period-effect-option">
            <input
              checked={periodEffectFilter === 'expired'}
              onChange={(e) => onPeriodEffectFilterChange(e.target.checked ? 'expired' : null)}
              type="checkbox"
            />
            <span>Expired alerts</span>
          </label>
        </div>
      </div>
    );
  }
}
