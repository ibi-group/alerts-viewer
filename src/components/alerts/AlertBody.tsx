import React from 'react';
import { format } from "date-fns";
import type { Alert } from './types';

export interface AlertBodyProps {
  alert: Alert | null;
}

export default class AlertBody extends React.Component<AlertBodyProps> {
  private renderEffectPeriods = (periods: { effect_start: string; effect_end: string }[]) => {
    if (!periods || periods.length === 0) {
      return null;
    }

    return (
      <div className="alert-body__subtitle">
        {periods.map((p, idx) => {
          const start = format(new Date(Number(p.effect_start) * 1000), 'MM/dd/yyyy h:mm a');
          const end = p.effect_end ? format(new Date(Number(p.effect_end) * 1000), 'MM/dd/yyyy h:mm a') : 'Until further notice';
          return (
            <p key={idx} className="alert-body__period">
              {start} — {end}
            </p>
          );
        })}
      </div>
    );
  };
  render() {
    const { alert } = this.props;

    if (!alert) {
      return <div className="alert-body alert-body--empty">No alert selected</div>;
    }

    return (
      <div className="alert-body">
        <div className="alert-body__header">
          <h3 className="alert-body__title">{alert.header_text}</h3>
          {this.renderEffectPeriods(alert.effect_periods)}
        </div>

        <div className="alert-body__content">
          <div className="alert-body__section">
            <h4 className="alert-body__section-title">Effect</h4>
            <p className="alert-body__text">{alert.effect_name}</p>
          </div>

          {alert.cause_name && (
            <div className="alert-body__section">
              <h4 className="alert-body__section-title">Cause</h4>
              <p className="alert-body__text">{alert.cause_name}</p>
            </div>
          )}

          <div className="alert-body__section">
            <h4 className="alert-body__section-title">Description</h4>
            <p className="alert-body__text">{alert.description_text}</p>
          </div>

          {alert.service_effect_text && (
            <div className="alert-body__section">
              <h4 className="alert-body__section-title">Service Effect</h4>
              <p className="alert-body__text">{alert.service_effect_text}</p>
            </div>
          )}

          {alert.timeframe_text && (
            <div className="alert-body__section">
              <h4 className="alert-body__section-title">Timeframe</h4>
              <p className="alert-body__text">{alert.timeframe_text}</p>
            </div>
          )}

          {alert.affected_services && alert.affected_services.services.length > 0 && (
            <div className="alert-body__section">
              <h4 className="alert-body__section-title">Affected Services</h4>
              <ul className="alert-body__services-list">
                {alert.affected_services.services.map((service, idx) => (
                  <li key={idx} className="alert-body__service-item">
                    <span className="alert-body__service-route">{service.route_id}</span>
                    <span className="alert-body__service-name">{service.route_name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {alert.url && (
            <div className="alert-body__section">
              <a href={alert.url} target="_blank" rel="noopener noreferrer" className="alert-body__link">
                View More Details
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }
}
