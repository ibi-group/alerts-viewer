import React from 'react';

export interface FilterOptionsProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  showExpiredAlerts: boolean;
  onExpiredAlertsChange: (checked: boolean) => void;
  showNonExpiredAlerts: boolean;
  onNonExpiredAlertsChange: (checked: boolean) => void;
}

export default class FilterOptions extends React.Component<FilterOptionsProps> {
  render() {
    const {
      searchValue,
      onSearchChange,
      showExpiredAlerts,
      onExpiredAlertsChange,
      showNonExpiredAlerts,
      onNonExpiredAlertsChange,
    } = this.props;

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
        <div className="filter-options__checkboxes">
          <label className="filter-options__checkbox-label">
            <input
              type="checkbox"
              checked={showExpiredAlerts}
              onChange={(e) => onExpiredAlertsChange(e.target.checked)}
              className="filter-options__checkbox"
            />
            Expired Alerts
          </label>
          <label className="filter-options__checkbox-label">
            <input
              type="checkbox"
              checked={showNonExpiredAlerts}
              onChange={(e) => onNonExpiredAlertsChange(e.target.checked)}
              className="filter-options__checkbox"
            />
            Non-Expired Alerts
          </label>
        </div>
      </div>
    );
  }
}
