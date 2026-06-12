import React from 'react';

import { Search } from '@styled-icons/fa-solid/Search'

export interface FilterOptionsProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export default class FilterOptions extends React.Component<FilterOptionsProps> {
  render() {
    const { searchValue, onSearchChange } = this.props;

    return (
      <div className="filter-options">
        <div className="filter-options__search">
          <Search className="filter-options__search-icon" />
          <input
            className="filter-options__input"
            name='search'
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by route ID or name..."
            type="text"
            value={searchValue}
          />
        </div>
      </div>
    );
  }
}
