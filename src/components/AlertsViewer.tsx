import { useEffect, useState } from "react";
import { fetchFromTransitAlerts, formatData } from "./utils/data";
import "./AlertsViewer.css";

import AlertList from "./AlertList";
import AlertItemBody from "./AlertItemBody";
import InputOptions from "./InputOptions";
import type { Alert, AlertsViewerProps } from "./types";

// TODO: urlconfig that defines how the url should be fetched 
const AlertsViewer = (props: AlertsViewerProps) => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [selectedAlertId, setSelectedAlertId] = useState<number | null>(null)

    useEffect(() => {
        async function fetchAlerts() {
            if (!props.apiUrl) { // if no apiUrl is provided, use the alerts passed in props
                setAlerts(formatData(props.alerts || []));
                return;
            }
            const fetchedAlerts = await fetchFromTransitAlerts(props.apiUrl)
            setAlerts(formatData(fetchedAlerts.data))
        }
        fetchAlerts()
    }, [props.alerts, props.apiUrl])

    return (
        <div className="alerts-viewer">
            <h1>Alerts!</h1>
            <InputOptions />
            <div className="alert-content">
                <AlertList alerts={alerts} onAlertClick={setSelectedAlertId} />
                <AlertItemBody selectedAlert={alerts.find(a => a.id === selectedAlertId)} />
            </div>
        </div>
    );
};

export default AlertsViewer