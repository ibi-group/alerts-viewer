import { format } from "date-fns";
import type { Alert, EffectPeriod } from "./types"
import { B } from "@styled-icons/fa-solid";

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

const BodySection = ({ title, content }: { title: string; content: string }) => {
  return (
    <div className="body-section">
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  )
}

const AlertItemBody = ({ selectedAlert: alert }: { selectedAlert: Alert | undefined }) => {
  if (!alert) {
    return <div>No alert selected</div>
  }

  return (
    <div className="alert-item-body">
      <div className="body-header">
        <h2>{alert.bodyTitle}</h2>
        <EffectPeriods effectPeriods={alert.effectPeriods} />
      </div>
      <div className="body-content">
        <BodySection title="Effect" content={alert.effectName} />
        
        {alert.causeName && <BodySection title="Cause" content={alert.causeName} />}
        
        <BodySection title="Description" content={alert.description} />

        {alert.lastModified && (
          <BodySection title="Last Modified" content={format(new Date(Number(alert.lastModified)), 'MM/dd/yyyy h:mm a')} />
        )}

        {alert.tags && alert.tags.length > 0 && (
          <BodySection title="Tags" content={alert.tags.join(", ")} />
        )}

        <BodySection title="Alert ID" content={alert.id.toString()} />
      </div>
    </div>
  )
}

export default AlertItemBody