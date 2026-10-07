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
    const [showExpiredAlerts, setShowExpiredAlerts] = useState<boolean>(false)
    const [showActiveAlerts, setShowActiveAlerts] = useState<boolean>(true)

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

    // TODO: add boolean filters.
    const filterAlerts = () => {
        return alerts.filter(alert => {
            const effectMatches = selectedEffect ? alert.effectName === selectedEffect : true;
            
            const normalizedSearchTerm = searchTerm.trim().toLowerCase();
            const routes = [...(alert.routeNames ?? []), ...(alert.routeIds ?? [])];
            const searchMatches = normalizedSearchTerm
                ? routes.some(route =>
                    typeof route === "string" &&
                    route.toLowerCase().includes(normalizedSearchTerm)
                )
                : true;

            return effectMatches && searchMatches;
        });
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
                showExpiredAlerts={showExpiredAlerts}
                showActiveAlerts={showActiveAlerts}
                setShowExpiredAlerts={setShowExpiredAlerts}
                setShowActiveAlerts={setShowActiveAlerts}
            />
            <div className="alert-content">
                <AlertList alerts={filterAlerts()} onAlertClick={setSelectedAlertId} />
                <AlertItemBody selectedAlert={alerts.find(a => a.id === selectedAlertId)} />
            </div>
        </div>
    );
};

export default AlertsViewer