import React from 'react';
import './AlertsViewer.css';
import type { Alert, AlertsViewerProps } from './types';
import FilterOptions from './FilterOptions';
import AlertList from './AlertList';
import AlertBody from './AlertBody';

interface AlertsViewerState {
  searchValue: string;
  selectedAlert: Alert | null;
  selectedEffect: string;
  showExpiredAlerts: boolean,
  showNonExpiredAlerts: boolean,
  alerts: Alert[];
  error: string | null;
  loading: boolean;
}

// Returns the current time in seconds
const today = () =>  Math.floor(Date.now() / 1000);

export default class AlertsViewer extends React.Component<AlertsViewerProps, AlertsViewerState> {
  constructor(props: AlertsViewerProps) {
    super(props);
    this.state = {
      searchValue: '',
      selectedEffect: '',
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

      const NOW_SECONDS = today()
      // Alerts API only supports pastalerts from the past 31 days. If an alert was visible to the public in this window, it will be returned.
      const DEFAULT_PAST_ALERTS_TIMEFRAME_SECONDS = 2678400
      const pastAlertsTimeframe = this.props.config?.pastAlertsTimeframe ?? DEFAULT_PAST_ALERTS_TIMEFRAME_SECONDS
      const pastAlertsStartWindow = (NOW_SECONDS - pastAlertsTimeframe)

      const pastAlertsDateTimeURL = `${this.props.apiUrl}&from_datetime=${pastAlertsStartWindow}&to_datetime=${NOW_SECONDS}`;

      fetch(pastAlertsDateTimeURL)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
          }
          return response.json();
        })
        .then((data) => {
          const alerts = this.filterAlertsByEffectTimeframe(data.alerts, NOW_SECONDS);
          this.setState({ alerts, error: null, loading: false });
        })
        .catch((err: Error) => {
          this.setState({ error: err.message, loading: false });
        });
    }
  }

  private filterAlertsByEffectTimeframe = (alerts: Alert[], NOW_SECONDS: number): Alert[] => {
    if (!this.props.config?.customEffectTimeframeFilter) {
      return alerts;
    }

    const configuredEffects = this.props.config.effects ?? [];

    return alerts.filter((alert) => {
      const alertEffect = (alert.effect_name || alert.effect).toLowerCase();
      const configuredEffect = configuredEffects.find((effect) => effect.name.toLowerCase() === alertEffect);

      if (configuredEffect?.timeframe === undefined) {
        return true;
      }

      const timeframeStart = NOW_SECONDS - configuredEffect.timeframe;
      return (alert.effect_periods ?? []).some((period) => {
        const effectStart = Number(period.effect_start);
        const effectEnd = period.effect_end ? Number(period.effect_end) : NOW_SECONDS;

        if (Number.isNaN(effectStart) || Number.isNaN(effectEnd)) {
          return false;
        }

        return effectEnd >= timeframeStart && effectStart <= NOW_SECONDS;
      });
    });
  };

  private matchesSearchFilter = (alert: Alert, searchValue: string): boolean => {
    if (!searchValue.trim()) return true;
    const lowerSearchValue = searchValue.trim().toLowerCase();
    return alert.affected_services?.services.some(
      (service) =>
        service?.route_id?.toString().toLowerCase().includes(lowerSearchValue) ||
        service?.route_name?.toString().toLowerCase().includes(lowerSearchValue)
    ) ?? false;
  };

  private matchesPeriodEffectFilter = (alert: Alert, showExpiredAlerts: boolean, showNonExpiredAlerts: boolean): boolean => {
    // If both filters are true, return true. If both filters are false, return false.
    if (showExpiredAlerts === showNonExpiredAlerts) {
      return showExpiredAlerts;
    }

    const NOW_SECONDS = today()
    const effectPeriods = alert.effect_periods ?? [];

    if (showNonExpiredAlerts) {
      return effectPeriods.some((period) => {
        const start = Number(period.effect_start);
        const end = Number(period.effect_end);

        if (Number.isNaN(start)) {
          return false;
        }

        if (period.effect_end) {
          return !Number.isNaN(end) && start <= NOW_SECONDS && NOW_SECONDS <= end;
        }

        return start <= NOW_SECONDS;
      });
    }

    if (showExpiredAlerts) {
      return effectPeriods.length > 0 && effectPeriods.every((period) => {
      const start = Number(period.effect_start);
      const end = Number(period.effect_end);

      if (!period.effect_end || Number.isNaN(start) || Number.isNaN(end)) {
        return false;
      }

      return end < NOW_SECONDS && start < NOW_SECONDS;
    });
    }
    return true;
  };

  private getFilteredAlerts = (): Alert[] => {
    const { alerts, searchValue, selectedEffect, showExpiredAlerts, showNonExpiredAlerts } = this.state;

    return alerts.filter((alert) => {
      const matchesSearch = this.matchesSearchFilter(alert, searchValue);
      const matchesPeriodEffect = this.matchesPeriodEffectFilter(alert, showExpiredAlerts, showNonExpiredAlerts);
      const matchesSelectedEffect = !selectedEffect || alert.effect_name?.toLowerCase() === selectedEffect.toLowerCase() || alert.effect?.toLowerCase() === selectedEffect.toLowerCase();
      return matchesSearch && matchesPeriodEffect && matchesSelectedEffect;
    });
  };

  private handleAlertClick = (alert: Alert): void => {
    this.setState({ selectedAlert: alert });
  };

  private getEffectOptions = (): { name: string }[] => {
    const effectNames = (this.state.alerts ?? [])
      .map((alert) => alert.effect_name || alert.effect)
      .filter(Boolean);

    return Array.from(new Set(effectNames)).map((name) => ({ name }));
  };

  render() {
    const { searchValue, selectedEffect, showExpiredAlerts, showNonExpiredAlerts, loading, selectedAlert } = this.state;
    const effects = this.props.config?.effects ?? this.getEffectOptions();

    const filteredAlerts = this.getFilteredAlerts();
    return (
      <div className="alerts-viewer">
        <div className="alerts-viewer__title">
          <h1>Alerts</h1>
        </div>
        <div className="alerts-viewer__content">
          <FilterOptions
            effects={effects}
            searchValue={searchValue}
            selectedEffect={selectedEffect}
            showExpiredAlerts={showExpiredAlerts}
            showNonExpiredAlerts={showNonExpiredAlerts}
            EffectIcon={this.props.EffectIcon}
            onSearchChange={(value) => this.setState({ searchValue: value })}
            onEffectChange={(value) => this.setState({ selectedEffect: value })}
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

