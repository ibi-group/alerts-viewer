import React from 'react';

import { Search } from '@styled-icons/fa-solid/Search'
import { SortAmountDownAlt } from '@styled-icons/fa-solid/SortAmountDownAlt'
import { SortAmountUpAlt } from '@styled-icons/fa-solid/SortAmountUpAlt'

export interface FilterOptionsProps {
  searchValue: string;
  showExpiredAlerts: boolean,
  showNonExpiredAlerts: boolean,
  sortDirection: 'asc' | 'desc';
  onSearchChange: (value: string) => void;
  onExpiredAlertsChange: (arg: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => void
  onNonExpiredAlertsChange: (arg: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => void
  onSortToggle: () => void;
}

export default class FilterOptions extends React.Component<FilterOptionsProps> {
  render() {
    const {
      searchValue,
      showExpiredAlerts,
      showNonExpiredAlerts,
      sortDirection,
      onSearchChange,
      onExpiredAlertsChange,
      onNonExpiredAlertsChange,
      onSortToggle,
    } = this.props;

    return (
      <div className="filter-options">
        <div className="filter-options__controls">
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

          <button
            type="button"
            className="filter-options__sort-button"
            onClick={onSortToggle}
            aria-label={`Sort alerts by start time ${sortDirection === 'asc' ? 'descending' : 'ascending'}`}
            title={`Sort by start time: ${sortDirection === 'asc' ? 'ascending' : 'descending'}`}
          >
            {sortDirection === 'asc' ? (
              <SortAmountUpAlt className="filter-options__sort-icon" />
            ) : (
              <SortAmountDownAlt className="filter-options__sort-icon" />
            )}
            <span>{sortDirection === 'asc' ? 'Oldest first' : 'Newest first'}</span>
          </button>
        </div>
        <div className="filter-options__period-effect-group">
          <label className="filter-options__period-effect-option">
            <input
              checked={showNonExpiredAlerts}
              onChange={(e) => onNonExpiredAlertsChange(e) }
              type="checkbox"
            />
            <span>Non-expired alerts</span>
          </label>
          <label className="filter-options__period-effect-option">
            <input
              checked={showExpiredAlerts}
              onChange={(e) => onExpiredAlertsChange(e) }
              type="checkbox"
            />
            <span>Expired alerts</span>
          </label>
        </div>
      </div>
    );
  }
}
