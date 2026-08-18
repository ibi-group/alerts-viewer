import React from 'react';

import { Search } from '@styled-icons/fa-solid/Search'

export interface FilterOptionsProps {
  searchValue: string;
  showExpiredAlerts: boolean,
  showNonExpiredAlerts: boolean,
  onSearchChange: (value: string) => void;
  onExpiredAlertsChange: any;
  onNonExpiredAlertsChange: any;
}

export default class FilterOptions extends React.Component<FilterOptionsProps> {
  render() {
    const { searchValue, showExpiredAlerts, showNonExpiredAlerts, onSearchChange, onExpiredAlertsChange, onNonExpiredAlertsChange } = this.props;

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
              checked={showNonExpiredAlerts}
              onChange={(e) => {
                console.log(e.target.checked)
                onNonExpiredAlertsChange(e)
              }}
              type="checkbox"
            />
            <span>Non-expired alerts</span>
          </label>
          <label className="filter-options__period-effect-option">
            <input
              checked={showExpiredAlerts}
              onChange={(e) => {
                console.log(e.target.checked)
                onExpiredAlertsChange(e)
              }}
              type="checkbox"
            />
            <span>Expired alerts</span>
          </label>
        </div>
      </div>
    );
  }
}
