import React from 'react';
import './AlertsViewer.css';
import type { Alert, AlertsViewerProps } from './types';
import FilterOptions from './FilterOptions';
import AlertList from './AlertList';

interface AlertsViewerState {
  searchValue: string;
  showExpiredAlerts: boolean;
  showNonExpiredAlerts: boolean;
}

export default class AlertsViewer extends React.Component<AlertsViewerProps, AlertsViewerState> {
  constructor(props: AlertsViewerProps) {
    super(props);
    this.state = {
      searchValue: '',
      showExpiredAlerts: true,
      showNonExpiredAlerts: true,
    };
  }

  private isAlertExpired = (alert: Alert): boolean => {
    return alert.effect_periods.some((period) => period.effect_end !== '');
  };

  private matchesSearchFilter = (alert: Alert, searchValue: string): boolean => {
    if (!searchValue.trim()) return true;
    const lowerSearchValue = searchValue.toLowerCase();
    return alert.affected_services?.services.some(
      (service) =>
        service.route_id.toLowerCase().includes(lowerSearchValue) ||
        service.route_name.toLowerCase().includes(lowerSearchValue)
    ) ?? false;
  };

  private getFilteredAlerts = (): Alert[] => {
    const { alerts = [] } = this.props;
    const { searchValue, showExpiredAlerts, showNonExpiredAlerts } = this.state;

    return alerts.filter((alert) => {
      const isExpired = this.isAlertExpired(alert);
      const matchesSearch = this.matchesSearchFilter(alert, searchValue);

      const matchesAlertStatus =
        (isExpired && showExpiredAlerts) || (!isExpired && showNonExpiredAlerts);

      return matchesSearch && matchesAlertStatus;
    });
  };

  render() {
    const { searchValue, showExpiredAlerts, showNonExpiredAlerts } = this.state;
    const filteredAlerts = this.getFilteredAlerts();

    return (
      <div className="alerts-viewer">
        <FilterOptions
          searchValue={searchValue}
          onSearchChange={(value) => this.setState({ searchValue: value })}
          showExpiredAlerts={showExpiredAlerts}
          onExpiredAlertsChange={(checked) => this.setState({ showExpiredAlerts: checked })}
          showNonExpiredAlerts={showNonExpiredAlerts}
          onNonExpiredAlertsChange={(checked) =>
            this.setState({ showNonExpiredAlerts: checked })
          }
        />
        <AlertList alerts={filteredAlerts} />
      </div>
    );
  }
}
