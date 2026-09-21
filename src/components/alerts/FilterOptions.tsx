import React from 'react';

import { Search } from '@styled-icons/fa-solid/Search'
import { SortAmountDown } from '@styled-icons/fa-solid/SortAmountDown'
import { SortAmountUp } from '@styled-icons/fa-solid/SortAmountUp'
import { Filter } from '@styled-icons/fa-solid/Filter'
import { Dropdown } from '@opentripplanner/building-blocks'

export interface EffectOption {
  name: string;
}

export interface FilterOptionsProps {
  effects?: EffectOption[];
  searchValue: string;
  selectedEffect?: string;
  showExpiredAlerts: boolean;
  showNonExpiredAlerts: boolean;
  sortDirection: 'asc' | 'desc';
  EffectIcon?: React.ComponentType<{ effect: string }>;
  onSearchChange: (value: string) => void;
  onEffectChange: (value: string) => void;
  onExpiredAlertsChange: (arg: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => void
  onNonExpiredAlertsChange: (arg: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => void
  onSortToggle: () => void;
}

export default class FilterOptions extends React.Component<FilterOptionsProps> {
  render() {
    const {
      effects = [], searchValue,
      selectedEffect = '', showExpiredAlerts,
      showNonExpiredAlerts,
      sortDirection,
      EffectIcon, onSearchChange,
      onEffectChange, onExpiredAlertsChange,
      onNonExpiredAlertsChange,
      onSortToggle,
    } = this.props;

    const selectedLabel = selectedEffect || 'All effects';

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

          <div className="filter-options__effect-group">
            <Dropdown
              className="filter-options__effect-dropdown"
              id="alert-effect-filter"
              label="Filter alerts by effect"
              listLabel="Alert effects"
              text={
                <span className="filter-options__effect-text">
                  <span className="filter-options__effect-icon">
                    <Filter />
                  </span>
                  <span>{selectedLabel}</span>
                </span>
              }
            >
              <li>
                <button
                  type="button"
                  className={`filter-options__effect-option${!selectedEffect ? ' filter-options__effect-option--selected' : ''}`}
                  onClick={() => onEffectChange('')}
                >
                  <span>All effects</span>
                </button>
              </li>
              {effects.map((effect) => (
                <li key={effect.name}>
                  <button
                    type="button"
                    className={`filter-options__effect-option${selectedEffect === effect.name ? ' filter-options__effect-option--selected' : ''}`}
                    onClick={() => onEffectChange(effect.name)}
                  >
                    {EffectIcon ? (
                      <span className="filter-options__effect-icon filter-options__effect-icon--menu">
                        <EffectIcon effect={effect.name} />
                      </span>
                    ) : null}
                    <span>{effect.name}</span>
                  </button>
                </li>
              ))}
            </Dropdown>
          </div>
        </div>

          <div className="filter-options__secondary-controls">
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

            <button
              type="button"
              className="filter-options__sort-button"
              onClick={onSortToggle}
              aria-label={`Sort alerts by start time ${sortDirection === 'asc' ? 'descending' : 'ascending'}`}
              title={`Sort by start time: ${sortDirection === 'asc' ? 'ascending' : 'descending'}`}
            >
              {sortDirection === 'asc' ? (
                <SortAmountUp className="filter-options__sort-icon" />
              ) : (
                <SortAmountDown className="filter-options__sort-icon" />
              )}
              <span>{sortDirection === 'asc' ? 'Oldest first' : 'Newest first'}</span>
            </button>
          </div>
        </div>
    );
  }
}
