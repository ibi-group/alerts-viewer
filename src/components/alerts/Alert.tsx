import React from 'react';
import type { Alert as AlertType } from './types';

export interface AlertProps {
  alert: AlertType;
}

export default class Alert extends React.Component<AlertProps> {
  render() {
    const { alert } = this.props;

    return (
      <div className={`alert alert--${alert.severity.toLowerCase()}`}>
        <div className="alert__header">
          <div className="alert__title-section">
            <h3 className="alert__title">{alert.header_text}</h3>
            <span className="alert__effect">{alert.effect_name}</span>
          </div>
        </div>
        <p className="alert__message">{alert.description_text}</p>
        <div className="alert__metadata">
          <span className="alert__severity">
            Severity: <strong>{alert.severity}</strong>
          </span>
          <span className="alert__lifecycle">
            Status: <strong>{alert.alert_lifecycle}</strong>
          </span>
        </div>
        {alert.affected_services?.services && alert.affected_services.services.length > 0 && (
          <div className="alert__services">
            <strong>Affected Services:</strong>
            <ul className="alert__services-list">
              {alert.affected_services.services.map((service, index) => (
                <li key={index}>
                  {service.mode_name} {service.route_name}
                  {service.direction_name && ` - ${service.direction_name}`}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
}
