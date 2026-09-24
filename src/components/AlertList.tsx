// TODO: Move to dedicated non-propieatry types file
type Alert = { id: number, name: string, body?: string }

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
              onAlertClick && onAlertClick(a.id);
            }}>
              {a.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AlertList