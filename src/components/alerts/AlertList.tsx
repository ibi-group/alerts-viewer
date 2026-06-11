import React from 'react';
import type { Alert as AlertType } from './types';
import AlertListItem from './AlertListItem';

export interface AlertListProps {
  alerts: AlertType[];
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
            key={alert.alert_id} 
            alert={alert}
            onClick={onAlertClick}
          />
        ))}
      </div>
    );
  }
}
