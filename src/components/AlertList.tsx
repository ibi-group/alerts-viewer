// TODO: Move to dedicated non-propieatry types file
import type { Alert } from "./types"

type AlertListProps = {
  alerts: Alert[];
  onAlertClick?: (id: number) => void;
}

const AlertList = ({ alerts, onAlertClick }: AlertListProps) => {
  return (
    <div className="alert-list">
      <ul>
        {alerts.map(a => (
          <li key={a.id}>
            <a href="#" onClick={(e) => {
              e.preventDefault();
              if (onAlertClick) {
                onAlertClick(a.id);
              }
            }}>
              {a.listTitle}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AlertList