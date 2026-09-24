import { useEffect, useState } from "react";
import { fetchFromAtis, formatFromAtis } from "./utils/atis";

import AlertList from "./AlertList";
import AlertItemBody from "./AlertItemBody";
import type { Alert } from "./types";

// TODO: urlconfig that defines how the url should be fetched
const AlertsViewer = ({ apiUrl: string }) => {
    const testAlerts = [{ id: 1, name: "first alert", body: "second" }, { id: 2, name: "second" }]
    const [alerts, setAlerts] = useState<Alert[]>(testAlerts)
    const [selectedAlertId, setSelectedAlertId] = useState<number | null>(null)

    useEffect(() => {
        async function fetchAlerts() {
            const fetchedAlerts = await fetchFromAtis(apiUrl)
            setAlerts(formatFromAtis(fetchedAlerts))
        }
        fetchAlerts()
    }, [])

    return (
        <div>
            <h1>Alerts!</h1>
            <AlertList alerts={testAlerts} onAlertClick={setSelectedAlertId} />
            <AlertItemBody selectedAlert={alerts.find(a => a.id === selectedAlertId)} />
        </div>
    );
};

export default AlertsViewer