import React from 'react';
import type { Alert as AlertType } from './types';
import AlertListItem from './AlertListItem';

export interface AlertListProps {
  alerts: AlertType[];
  EffectIcon?: React.ComponentType<{ effect: string }>;
  onAlertClick?: (alert: AlertType) => void;
}

export default class AlertList extends React.Component<AlertListProps> {
  render() {
    const { alerts, onAlertClick } = this.props;

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
