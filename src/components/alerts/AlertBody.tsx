import React from 'react';
import { format } from "date-fns";
import { ExternalLinkAlt } from '@styled-icons/fa-solid/ExternalLinkAlt'
import type { Alert } from './types';

export interface AlertBodyProps {
  alert: Alert | null;
}

export default class AlertBody extends React.Component<AlertBodyProps> {
  private renderEffectPeriods = (periods: { effect_start: string; effect_end?: string }[]) => {
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
          <h2 className="alert-body__title">{alert.header_text}</h2>
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

          {alert.affected_services && alert.affected_services.services.length > 0 && (
            <div className="alert-body__section">
              <h4 className="alert-body__section-title">Affected Services:</h4>
              <ul className="alert-body__services-list">
                {alert.affected_services.services
                  .filter((service, idx, arr) => arr.findIndex(s => s.route_id === service.route_id) === idx)
                  .map((service) => (
                    <li key={service.route_id} className="alert-body__service-item">
                      {service.route_id}
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {alert.images && alert.images.length > 0 && (
            <div className="alert-body__section">
              <h4 className="alert-body__section-title">Images</h4>
              <div className="alert-body__images">
                {alert.images.map((image, idx) => (
                  // TODO: find a way to use externalLink.tsx from otp-rr. move to otp-ui?
                  <a key={idx} href={image.url} target="_blank" rel="noopener noreferrer" className="alert-body__image-link">  
                    View image
                    <ExternalLinkAlt 
                      height="1.2rem"
                      title="(Opens new window)"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="alert-body__section">
            <h4 className="alert-body__section-title">Alert ID</h4>
            <p className="alert-body__text">{alert.alert_id}</p>
          </div>
        </div>
      </div>
    );
  }
}
