// TODO: Move to dedicated non-propieatry types file
import type { Alert } from "./types"

type AlertListProps = {
  alerts: Alert[];
  EffectIcon: React.ComponentType<{ effect: string }> | undefined;
  onAlertClick: (id: number) => void;
}

const AlertListItem = ({ 
  alert,
  EffectIcon,
  onClick 
}: { 
  alert: Alert;
  EffectIcon: React.ComponentType<{ effect: string }> | undefined;
  onClick: (id: number) => void
}) => {

  const handleClick = () => {
    onClick(alert.id);
  }

  return (
    <div
      className="alert-list-item"
      onClick={() => handleClick()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
      role="button"
      tabIndex={0}
    >
      {EffectIcon && (
        <span>
          <EffectIcon effect={alert.effectName} />
        </span>
      )}
      <h4>{alert.listTitle}</h4>
    </div>
  )
}

const AlertList = ({ alerts, EffectIcon, onAlertClick }: AlertListProps) => {
  return (
    <div className="alert-list">
      {alerts.map(alert => (
        <AlertListItem alert={alert} key={alert.id} EffectIcon={EffectIcon} onClick={onAlertClick} />
      ))}
    </div>
  )
}

export default AlertList