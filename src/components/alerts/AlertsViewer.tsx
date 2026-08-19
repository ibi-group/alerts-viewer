import React from 'react';
import './AlertsViewer.css';
import type { Alert, AlertsViewerProps } from './types';
import FilterOptions from './FilterOptions';
import AlertList from './AlertList';
import AlertBody from './AlertBody';

interface AlertsViewerState {
  searchValue: string;
  selectedAlert: Alert | null;
  showExpiredAlerts: boolean,
  showNonExpiredAlerts: boolean,
  alerts: Alert[];
  error: string | null;
  loading: boolean;
}

const today = () =>  Math.floor(Date.now() / 1000);

export default class AlertsViewer extends React.Component<AlertsViewerProps, AlertsViewerState> {
  constructor(props: AlertsViewerProps) {
    super(props);
    this.state = {
      searchValue: '',
      showExpiredAlerts: false,
      showNonExpiredAlerts: true,
      selectedAlert: null,
      alerts: this.props.alerts ?? [],
      error: null,
      loading: true
    };
  }

  componentDidMount() {
    if (this.props.alerts && this.props.alerts.length > 0) {
      this.setState({ loading: false });
      return;
    }    
    
    if (!this.props.alerts || this.props.alerts.length === 0) {
      if (!this.props.apiUrl) {
        this.setState({ error: 'No API URL provided', loading: false });
        return;
      }

      const now = today()
      // Alerts API only supports pastalerts from the past 31 days. If an alert was visible to the public in this window, it will be returned.
      const THIRTY_ONE_DAYS = 2678400
      const pastAlertsStartWindow = (now - THIRTY_ONE_DAYS)

      const pastAlertsDateTimeURL = `${this.props.apiUrl}&from_datetime=${pastAlertsStartWindow}&to_datetime=${now}`

      fetch(pastAlertsDateTimeURL)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
          }
          return response.json();
        })
        .then((data) => {
          this.setState({ alerts: data.alerts, error: null, loading: false });
        })
        .catch((err: Error) => {
          this.setState({ error: err.message, loading: false });
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

  private matchesPeriodEffectFilter = (alert: Alert, showExpiredAlerts: boolean, showNonExpiredAlerts: boolean): boolean => {
    // If both filters are true, return true. If both filters are false, return false.
    if (showExpiredAlerts === showNonExpiredAlerts) {
      return showExpiredAlerts;
    }

    const now = today()
    const effectPeriods = alert.effect_periods ?? [];

    if (showNonExpiredAlerts) {
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

    if (showExpiredAlerts) {
      return effectPeriods.length > 0 && effectPeriods.every((period) => {
      const start = Number(period.effect_start);
      const end = Number(period.effect_end);

      if (!period.effect_end || Number.isNaN(start) || Number.isNaN(end)) {
        return false;
      }

      return end < now && start < now;
    });
    }
    return true;
  };

  private getFilteredAlerts = (): Alert[] => {
    const { alerts, searchValue, showExpiredAlerts, showNonExpiredAlerts } = this.state;

    return alerts.filter((alert) => {
      const matchesSearch = this.matchesSearchFilter(alert, searchValue);
      const matchesPeriodEffect = this.matchesPeriodEffectFilter(alert, showExpiredAlerts, showNonExpiredAlerts);
      return matchesSearch && matchesPeriodEffect;
    });
  };

  private handleAlertClick = (alert: Alert): void => {
    this.setState({ selectedAlert: alert });
  };

  render() {
    const { searchValue, showExpiredAlerts, showNonExpiredAlerts, loading, selectedAlert } = this.state;

    const filteredAlerts = this.getFilteredAlerts();
    return (
      <div className="alerts-viewer">
        <div className="alerts-viewer__title">
          <h1>Alerts</h1>
        </div>
        <div className="alerts-viewer__content">
          <FilterOptions
            searchValue={searchValue}
            showExpiredAlerts={showExpiredAlerts}
            showNonExpiredAlerts={showNonExpiredAlerts}
            onSearchChange={(value) => this.setState({ searchValue: value })}
            onExpiredAlertsChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ showExpiredAlerts: e.target.checked})}
            onNonExpiredAlertsChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ showNonExpiredAlerts: e.target.checked})}
          />
          <div className="alerts-viewer__container">
            <AlertList
              alerts={filteredAlerts}
              // TODO: prop drilling?
              EffectIcon={this.props.EffectIcon}
              error={this.state.error}
              loading={loading} 
              onAlertClick={this.handleAlertClick} 
            />
            <AlertBody alert={selectedAlert} />
          </div>
        </div>
      </div>
    );
  }
}

