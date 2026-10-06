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
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedAlertId, setSelectedAlertId] = useState<number>(0)
    const [selectedEffect, setSelectedEffect] = useState<string>("")

    useEffect(() => {
        async function fetchAlerts() {
            if (!props.apiUrl) { // if no apiUrl is provided, use the alerts passed in props
                setAlerts(formatData(props.alerts || []));
                return;
            }
            setLoading(true);
            // TODO: handle errors
            const fetchedAlerts = await fetchFromTransitAlerts(props.apiUrl)
            setAlerts(formatData(fetchedAlerts.alerts))
            setLoading(false);
        }
        fetchAlerts()
    }, [props.alerts, props.apiUrl])

    // TODO: filter by route id/name. add boolean filters.
    const filterAlerts = () => {
        return alerts.filter(alert => alert.bodyTitle.includes(searchTerm));
    };

    return (
        // TODO:add loading/error state
        <div className="alerts-viewer">
            <h1>Alerts!</h1>
            <InputOptions
                effects={props.config?.effects}
                EffectIcon={props.EffectIcon}
                searchTerm={searchTerm}
                selectedEffect={selectedEffect}
                setSearchTerm={setSearchTerm}
                setSelectedEffect={setSelectedEffect}
            />
            <div className="alert-content">
                <AlertList alerts={filterAlerts()} onAlertClick={setSelectedAlertId} />
                <AlertItemBody selectedAlert={alerts.find(a => a.id === selectedAlertId)} />
            </div>
        </div>
    );
};

export default AlertsViewer