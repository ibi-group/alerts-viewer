import React from 'react';

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
          <input
            type="text"
            placeholder="Search by route ID or name..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="filter-options__input"
          />
        </div>
      </div>
    );
  }
}
