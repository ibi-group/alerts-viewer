import { format } from "date-fns";
import { ExternalLinkAlt } from '@styled-icons/fa-solid/ExternalLinkAlt'

import type { Alert, EffectPeriod } from "./types"

const EffectPeriods = ({ effectPeriods }: { effectPeriods: EffectPeriod[] | undefined }) => {
    if (!effectPeriods || effectPeriods.length === 0) {
      return null;
    }

    return (
      <div className="effect-periods">
        {effectPeriods.map((p, idx) => {
          const start = format(new Date(Number(p.effect_start) * 1000), 'MM/dd/yyyy h:mm a');
          const end = p.effect_end ? format(new Date(Number(p.effect_end) * 1000), 'MM/dd/yyyy h:mm a') : 'Until further notice';
          return (
            <p key={idx}>
              {start} — {end}
            </p>
          );
        })}
      </div>
    )
}

const BodySection = ({ title, content }: { title: string; content: string | string[] }) => {
  return (
    <div className="body-section">
      <h3>{title}</h3>
      {Array.isArray(content) ? (
        <ul>
          {content.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
        </ul>
      ) : (
        <p>{content}</p>
      )}
    </div>
  )
}

const ExternalLink = ({ url, text }: { url: string; text?: string }) => {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      {text}
      <span className="external-link-icon">
        <ExternalLinkAlt height="1.2rem" />
      </span>
    </a>
  )
}

const LinkSection = ({ title, linkText, links }: { title: string; linkText?: string; links: string[] }) => {
  return (
    <div className="body-section">
      <h3>{title}</h3>
        {links.map((link, index) => (
          <ExternalLink key={index} url={link} text={linkText} />
        ))}
    </div>
  )
}

const AlertItemBody = ({ selectedAlert: alert }: { selectedAlert: Alert | undefined }) => {
  if (!alert) {
    return (
      <div className="alert-item-body empty-body">
        <h2>No alert selected</h2>
        <p>Select an alert to see more details</p>
      </div>
    )
  }

  return (
    <div className="alert-item-body">
      <div className="body-header">
        <h2>{alert.bodyTitle}</h2>
        <EffectPeriods effectPeriods={alert.effectPeriods} />
      </div>
      <div className="body-content">
        <BodySection title="Effect" content={alert.effectName} />
        
        {alert.causeName && (
          <BodySection title="Cause" content={alert.causeName} />
        )}
        
        <BodySection title="Description" content={alert.description} />

        {alert.affectedServices && (
          <BodySection title="Affected Services" content={alert.affectedServices} />
        )}

        {alert.images && alert.images.length > 0 && (
          <LinkSection title="Detour Map" linkText="View Detour Map" links={alert.images} />
        )}

        {alert.lastModified && (
          <BodySection title="Last Modified" content={format(new Date(Number(alert.lastModified) * 1000), 'MM/dd/yyyy h:mm a')} />
        )}

        {alert.tags && alert.tags.length > 0 && (
          <BodySection title="Tags" content={alert.tags} />
        )}

        <BodySection title="Alert ID" content={alert.id.toString()} />

        {alert.url && (
          <ExternalLink url={alert.url} text="View More Details" />
        )}
      </div>
    </div>
  )
}

export default AlertItemBody