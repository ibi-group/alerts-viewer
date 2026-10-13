// TODO: Move to dedicated non-propieatry types file
import type { Alert } from "./types"

type AlertListProps = {
  alerts: Alert[];
  onAlertClick: (id: number) => void;
}

const AlertListItem = ({ alert, onClick }: { alert: Alert; onClick: (id: number) => void }) => {
  const handleClick = () => {
    onClick(alert.id);
  }

  return (
    <div
      className="alert-list-item"
      key={alert.id}
      onClick={() => handleClick()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
      role="button"
      tabIndex={0}
    >
      {alert.listTitle}
    </div>
  )
}

const AlertList = ({ alerts, onAlertClick }: AlertListProps) => {
  return (
    <div className="alert-list">
      {alerts.map(alert => (
        <AlertListItem alert={alert} onClick={onAlertClick} />
      ))}
    </div>
  )
}

export default AlertList