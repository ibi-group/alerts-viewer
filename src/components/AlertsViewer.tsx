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
    const [now, setNow] = useState<number>(0)

    useEffect(() => {
        const updateNow = () => setNow(Math.floor(Date.now() / 1000));
        updateNow();

        const intervalId = window.setInterval(updateNow, 60_000);
        return () => window.clearInterval(intervalId);
    }, [])

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

            const effectPeriods = alert.effectPeriods ?? [];
            const isActive = effectPeriods.some(period => {
                if (!period.effect_start.trim()) return false;

                const start = Number(period.effect_start);
                if (!Number.isFinite(start) || now < start) return false;

                if (!period.effect_end?.trim()) return true;

                const end = Number(period.effect_end);
                return Number.isFinite(end) && now <= end;
            });
            const isExpired = effectPeriods.some(period => {
                if (!period.effect_end?.trim()) return false;

                const end = Number(period.effect_end);
                return Number.isFinite(end) && now > end;
            });
            const statusMatches =
                (showActiveAlerts && isActive) ||
                (showExpiredAlerts && isExpired);

            return effectMatches && searchMatches && statusMatches;
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