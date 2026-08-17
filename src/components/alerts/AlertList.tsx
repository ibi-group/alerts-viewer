import React from 'react';
import { Redo } from '@styled-icons/fa-solid/Redo'
import type { Alert as AlertType } from './types';
import AlertListItem from './AlertListItem';

export interface AlertListProps {
  alerts: AlertType[];
  loading: boolean;
  EffectIcon?: React.ComponentType<{ effect: string }>;
  error?: string | null;
  onAlertClick?: (alert: AlertType) => void;
}

export default class AlertList extends React.Component<AlertListProps> {
  render() {
    const { alerts, loading, onAlertClick } = this.props;

    if (loading) {
      return (
        <div className="alert-list">
          <div
            aria-live="assertive"
            className='invisible-ally-container'
            role="alert"
          >
              Loading alerts
          </div>
          <div className="loading">
            <Redo className="spinner" />
          </div>
        </div>
      );
    }

    if (this.props.error) {
      return <div className="alerts-viewer__error">{this.props.error}</div>
    }

    if (alerts.length === 0) {
      return <div className="alert-list">No alerts found</div>;
    }

    return (
      <div className="alert-list">
        {alerts.map((alert) => (
          <AlertListItem 
            alert={alert}
            EffectIcon={this.props.EffectIcon}
            key={alert.alert_id} 
            onClick={onAlertClick}
          />
        ))}
      </div>
    );
  }
}
