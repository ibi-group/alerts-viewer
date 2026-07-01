import React from 'react';
import type { Alert as AlertType } from './types';

export interface AlertListItemProps {
  alert: AlertType;
  EffectIcon?: React.ComponentType<{ effect: string }>;
  onClick?: (alert: AlertType) => void;
}

export default class AlertListItem extends React.Component<AlertListItemProps> {
  render() {
    const { alert, EffectIcon, onClick } = this.props;
    const title = alert.short_header_text || alert.header_text;

    return (
      <div 
        className={`alert-list-item alert-list-item--${alert.severity.toLowerCase()}`}
        onClick={() => onClick?.(alert)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onClick?.(alert);
          }
        }}
      >
        <div className="alert-list-item__header">
          <h4 className="alert-list-item__title">{title}</h4>
          {EffectIcon ? (
            <span className="alert-list-item__effect">
              <EffectIcon effect={alert.effect_name} />
            </span>
          ) : null}
        </div>
        {alert.cause_name && (
          <p className="alert-list-item__cause">{alert.cause_name}</p>
        )}
      </div>
    );
  }
}
