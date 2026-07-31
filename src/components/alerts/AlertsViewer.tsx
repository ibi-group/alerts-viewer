import React from 'react';
import './AlertsViewer.css';
import type { Alert, AlertsViewerProps } from './types';
import FilterOptions from './FilterOptions';
import AlertList from './AlertList';
import AlertBody from './AlertBody';

interface AlertsViewerState {
  searchValue: string;
  selectedAlert: Alert | null;
  alerts: Alert[];
  error: string | null;
}

export default class AlertsViewer extends React.Component<AlertsViewerProps, AlertsViewerState> {
  constructor(props: AlertsViewerProps) {
    super(props);
    this.state = {
      searchValue: '',
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
    const lowerSearchValue = searchValue.toLowerCase();
    return alert.affected_services?.services.some(
      (service) =>
        service.route_id.toLowerCase().includes(lowerSearchValue) ||
        service.route_name.toLowerCase().includes(lowerSearchValue)
    ) ?? false;
  };

  private getFilteredAlerts = (): Alert[] => {
    const { alerts, searchValue } = this.state;

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
        <div className="alerts-viewer__title">
          <h1>Alerts</h1>
        </div>
        <div className="alerts-viewer__content">
          <FilterOptions
            searchValue={searchValue}
            onSearchChange={(value) => this.setState({ searchValue: value })}
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

