import React from 'react';
import './AlertsViewer.css';
import type { Alert, AlertsViewerProps } from './types';
import FilterOptions from './FilterOptions';
import AlertList from './AlertList';
import AlertBody from './AlertBody';

interface AlertsViewerState {
  searchValue: string;
  selectedAlert: Alert | null;
}

export default class AlertsViewer extends React.Component<AlertsViewerProps, AlertsViewerState> {
  constructor(props: AlertsViewerProps) {
    super(props);
    this.state = {
      searchValue: '',
      selectedAlert: null,
    };
  }

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
    const { searchValue } = this.state;

    return alerts.filter((alert) => {
      const matchesSearch = this.matchesSearchFilter(alert, searchValue);
      return matchesSearch;
    });
  };

  private handleAlertClick = (alert: Alert): void => {
    this.setState({ selectedAlert: alert });
  };

  render() {
    const { searchValue, selectedAlert } = this.state;
    const filteredAlerts = this.getFilteredAlerts();

    return (
      <div className="alerts-viewer">
        <FilterOptions
          searchValue={searchValue}
          onSearchChange={(value) => this.setState({ searchValue: value })}
        />
        <div className="alerts-viewer__container">
          <AlertList alerts={filteredAlerts} onAlertClick={this.handleAlertClick} />
          <AlertBody alert={selectedAlert} />
        </div>
      </div>
    );
  }
}

