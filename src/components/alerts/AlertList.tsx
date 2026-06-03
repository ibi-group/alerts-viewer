import React from 'react';
import type { Alert as AlertType } from './types';
import Alert from './Alert';

export interface AlertListProps {
  alerts: AlertType[];
}

export default class AlertList extends React.Component<AlertListProps> {
  render() {
    const { alerts } = this.props;

    if (alerts.length === 0) {
      return <div className="alert-list__empty">No alerts found</div>;
    }

    return (
      <div className="alert-list">
        {alerts.map((alert) => (
          <Alert key={alert.alert_id} alert={alert} />
        ))}
      </div>
    );
  }
}
