import type { Alert } from "./types"

const AlertItemBody = ({ selectedAlert }: { selectedAlert: Alert | undefined }) => {
  if (!selectedAlert) {
    return <div>No alert selected</div>
  }

  return (
    <div className="alert-item-body">
      <h2>{selectedAlert.bodyTitle}</h2>
      <p>{selectedAlert.effectName}</p>
    </div>
  )
}

export default AlertItemBody