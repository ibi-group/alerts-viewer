import React from 'react';
import './AlertsViewer.css';
import type { Alert, AlertsViewerProps } from './types';
import FilterOptions, { type PeriodEffectFilter } from './FilterOptions';
import AlertList from './AlertList';
import AlertBody from './AlertBody';

interface AlertsViewerState {
  searchValue: string;
  periodEffectFilter: PeriodEffectFilter;
  selectedAlert: Alert | null;
  alerts: Alert[];
  error: string | null;
}

export default class AlertsViewer extends React.Component<AlertsViewerProps, AlertsViewerState> {
  constructor(props: AlertsViewerProps) {
    super(props);
    this.state = {
      searchValue: '',
      periodEffectFilter: null,
      selectedAlert: null,
      alerts: this.props.alerts ?? [],
      error: null,
    };
  }

  componentDidMount() {
    if (!this.props.alerts || this.props.alerts.length === 0) {
      if (!this.props.apiUrl) {
        this.setState({ error: 'No API URL provided' });
        return;
      }

      fetch(this.props.apiUrl)
        .then(async (response) => {
          const data = await response.json();
          if (!response.ok) {
            const message = data?.error?.message ? `Error: ${data.error.message}` : `Error: ${response.status} ${response.statusText}`;
            throw new Error(message);
          }
          return data;
        })
        .then((data) => {
          this.setState({ alerts: data.alerts, error: null });
        })
        .catch((err: Error) => {
          this.setState({ error: err.message });
        });
    }
  }

  private matchesSearchFilter = (alert: Alert, searchValue: string): boolean => {
    if (!searchValue.trim()) return true;
    const lowerSearchValue = searchValue.trim().toLowerCase();
    return alert.affected_services?.services.some(
      (service) =>
        service.route_id.toLowerCase().includes(lowerSearchValue) ||
        service.route_name.toLowerCase().includes(lowerSearchValue)
    ) ?? false;
  };

  private matchesPeriodEffectFilter = (alert: Alert, periodEffectFilter: PeriodEffectFilter): boolean => {
    if (!periodEffectFilter) {
      return true;
    }

    const now = Math.floor(Date.now() / 1000);
    const effectPeriods = alert.effect_periods ?? [];

    if (periodEffectFilter === 'non-expired') {
      return effectPeriods.some((period) => {
        const start = Number(period.effect_start);
        const end = Number(period.effect_end);

        if (Number.isNaN(start)) {
          return false;
        }

        if (period.effect_end) {
          return !Number.isNaN(end) && start <= now && now <= end;
        }

        return start <= now;
      });
    }

    return effectPeriods.length > 0 && effectPeriods.every((period) => {
      const start = Number(period.effect_start);
      const end = Number(period.effect_end);

      if (!period.effect_end || Number.isNaN(start) || Number.isNaN(end)) {
        return false;
      }

      return end < now && start < now;
    });
  };

  private getFilteredAlerts = (): Alert[] => {
    const { alerts, searchValue, periodEffectFilter } = this.state;

    return alerts.filter((alert) => {
      const matchesSearch = this.matchesSearchFilter(alert, searchValue);
      const matchesPeriodEffect = this.matchesPeriodEffectFilter(alert, periodEffectFilter);
      return matchesSearch && matchesPeriodEffect;
    });
  };

  private handleAlertClick = (alert: Alert): void => {
    this.setState({ selectedAlert: alert });
  };

  render() {
    const { searchValue, periodEffectFilter, selectedAlert } = this.state;
    const filteredAlerts = this.getFilteredAlerts();
    return (
      <div className="alerts-viewer">
        <div className="alerts-viewer__title">
          <h1>Alerts</h1>
        </div>
        <div className="alerts-viewer__content">
          <FilterOptions
            searchValue={searchValue}
            periodEffectFilter={periodEffectFilter}
            onSearchChange={(value) => this.setState({ searchValue: value })}
            onPeriodEffectFilterChange={(value) => this.setState({ periodEffectFilter: value })}
          />
          <div className="alerts-viewer__container">
            <AlertList
              alerts={filteredAlerts}
              // TODO: prop drilling?
              EffectIcon={this.props.EffectIcon}
              error={this.state.error}
              onAlertClick={this.handleAlertClick} 
            />
            <AlertBody alert={selectedAlert} />
          </div>
        </div>
      </div>
    );
  }
}

