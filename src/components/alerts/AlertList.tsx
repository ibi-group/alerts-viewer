// TODO: Move to dedicated non-propieatry types file
type Alert = { id: string, name: string, body?: string }

type AlertListProps = {
  alerts: Alert[];
  onAlertClick?: (id: string) => void;
}

const AlertList = ({ alerts, onAlertClick }: AlertListProps) => {
  return <ul>{alerts.map(a => <li>{a.name}</li>)}</ul>
}

export default AlertList