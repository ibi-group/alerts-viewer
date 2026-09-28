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
    const [error, setError] = useState<string | null>(null);
    const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedAlertId, setSelectedAlertId] = useState<number | null>(null)

    useEffect(() => {
        async function fetchAlerts() {
            if (!props.apiUrl) { // if no apiUrl is provided, use the alerts passed in props
                setAlerts(formatData(props.alerts || []));
                return;
            }
            setLoading(true);
            // TODO: handle errors
            const fetchedAlerts = await fetchFromTransitAlerts(props.apiUrl)
            setAlerts(formatData(fetchedAlerts.data))
            setFilteredAlerts(formatData(fetchedAlerts.data))
            setLoading(false);
        }
        fetchAlerts()
    }, [props.alerts, props.apiUrl])

    // TODO: filter by route id/name. add boolean filters.
    const filterAlerts = (searchTerm: string) => {
        if (!searchTerm) {
            setFilteredAlerts(alerts);
        } else {
            setFilteredAlerts(alerts.filter(alert => alert.bodyTitle.includes(searchTerm)));
        }
    };

    return (
        <div className="alerts-viewer">
            <h1>Alerts!</h1>
            <InputOptions filter={filterAlerts} />
            <div className="alert-content">
                <AlertList alerts={filteredAlerts} onAlertClick={setSelectedAlertId} />
                <AlertItemBody selectedAlert={filteredAlerts.find(a => a.id === selectedAlertId)} />
            </div>
        </div>
    );
};

export default AlertsViewer