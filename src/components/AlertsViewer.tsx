import { useEffect, useState } from "react";
import { fetchFromTransitAlerts, formatData } from "./utils/data";
import "./AlertsViewer.css";

import AlertList from "./AlertList";
import AlertItemBody from "./AlertItemBody";
import type { Alert, AlertsViewerProps } from "./types";

// TODO: urlconfig that defines how the url should be fetched 
const AlertsViewer = (props: AlertsViewerProps) => {
    //const { apiUrl } = props;
    //const testAlerts = [{ id: 1, name: "first alert", body: "second" }, { id: 2, name: "second" }]
    const [alerts, setAlerts] = useState<Alert[]>(props.alerts || []);
    const [selectedAlertId, setSelectedAlertId] = useState<number | null>(null)

    useEffect(() => {
        async function fetchAlerts() {
            const fetchedAlerts = await fetchFromTransitAlerts(props.apiUrl)
            setAlerts(formatData(fetchedAlerts))
        }
        fetchAlerts()
    }, [props.apiUrl])

    return (
        <div className="alerts-viewer">
            <h1>Alerts!</h1>
            <div className="content">
                <AlertList alerts={alerts} onAlertClick={setSelectedAlertId} />
                <AlertItemBody selectedAlert={alerts.find(a => a.alert_id === selectedAlertId)} />
            </div>
        </div>
    );
};

export default AlertsViewer