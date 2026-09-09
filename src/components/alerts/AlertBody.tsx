import React from 'react';
import { format } from "date-fns";
import { ExternalLinkAlt } from '@styled-icons/fa-solid/ExternalLinkAlt'
import type { Alert } from './types';

export interface AlertBodyProps {
  alert: Alert | null;
}

const newWindowString = "(Opens new window)"

const OpensNewWindowIcon = () => (
  <ExternalLinkAlt 
    height="1.2rem"
    title={newWindowString}
    aria-label={newWindowString}
  />
)

const AlertSection = ({title, text}: {title: string, text: string}) => (
  <div className="alert-body__section">
    <h3 className="alert-body__section-title">{title}</h3>
    <p className="alert-body__text">{text}</p>
  </div>
)

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
          <AlertSection title="Effect" text={alert.effect_name}/>

          {alert.cause_name && (
            <AlertSection title="Cause" text={alert.cause_name}/>
          )}

          <AlertSection title="Description" text={alert.description_text}/>

          {alert.affected_services && alert.affected_services.services.length > 0 && (
            <div className="alert-body__section">
              <h3 className="alert-body__section-title">Affected Services:</h3>
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
              <h3 className="alert-body__section-title">Detour Map</h3>
              <div className="alert-body__images">
                {alert.images.map((image, idx) => (
                  // TODO: find a way to use externalLink.tsx from otp-rr. move to otp-ui?
                  <a key={idx} href={image.url} target="_blank" rel="noopener noreferrer" className="alert-body__image-link">  
                    View Map
                    <OpensNewWindowIcon />
                  </a>
                ))}
              </div>
            </div>
          )}


          {alert.tags && alert.tags.length > 0 && (
            <AlertSection title="Tags" text={alert.tags.join(', ')}/>
          )}
        </div>
          <AlertSection title="Alert ID" text={`${alert.alert_id}`}/>
          {alert.url && (
            <div className="alert-body__section">
              <a href={alert.url} target="_blank" rel="noopener noreferrer" className="alert-body__link">
                View More Details
                <OpensNewWindowIcon />
              </a>
            </div>
          )}
      </div>
    );
  }
}
