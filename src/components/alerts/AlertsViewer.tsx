import React from 'react';
import './AlertsViewer.css';
import type { Alert, AlertsViewerProps } from './types';
import FilterOptions from './FilterOptions';
import AlertList from './AlertList';
import AlertBody from './AlertBody';

interface AlertsViewerState {
  alerts: Alert[];
  error: string | null;
  loading: boolean;
  searchValue: string;
  selectedAlert: Alert | null;
}

export default class AlertsViewer extends React.Component<AlertsViewerProps, AlertsViewerState> {
  constructor(props: AlertsViewerProps) {
    super(props);
    this.state = {
      alerts: this.props.alerts ?? [],
      error: null,
      loading: true,
      searchValue: '',
      selectedAlert: null
    };
  }

  componentDidMount() {
    if (this.props.alerts && this.props.alerts.length > 0) {
      this.setState({ loading: false });
      return;
    }

    if (!this.props.apiUrl) {
      this.setState({ error: 'No API URL provided', loading: false });
      return;
    }

    fetch(this.props.apiUrl)
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
    const { loading, searchValue, selectedAlert } = this.state;
    const filteredAlerts = this.getFilteredAlerts();
    return (
      <div className="alerts-viewer">
        <div className="alerts-viewer__title">
          <h1>Alerts</h1>
          {this.state.error && (
            <div className="alerts-viewer__error">{this.state.error}</div>
          )}
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

