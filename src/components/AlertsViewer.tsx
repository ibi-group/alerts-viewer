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
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

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
        return alerts
        .filter(alert => {
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
            const now = Math.floor(Date.now() / 1000);
            const isActive = effectPeriods.some(period => {
                if (!period.effect_start) return false;

                const start = Number(period.effect_start);
                if (now < start) return false;

                if (!period.effect_end) return true;

                const end = Number(period.effect_end);
                return now <= end;
            });
            const isExpired = effectPeriods.some(period => {
                if (!period.effect_end) return false;

                const end = Number(period.effect_end);
                return now > end;
            });
            const statusMatches =
                (showActiveAlerts && isActive) ||
                (showExpiredAlerts && isExpired);

            return effectMatches && searchMatches && statusMatches;
        })
        .sort((a,b) => {
            const difference = Number(a.effectPeriods[0].effect_start) - Number(b.effectPeriods[0].effect_start);
            return sortDirection === 'asc' ? difference : -difference;
        });
    };

    return (
        // TODO:add loading/error state
        <div className="alerts-viewer container">
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
                sortDirection={sortDirection}
                setSortDirection={setSortDirection}
            />
            <div className="alert-content">
                <AlertList alerts={filterAlerts()} EffectIcon={props.EffectIcon} onAlertClick={setSelectedAlertId} />
                <AlertItemBody selectedAlert={alerts.find(a => a.id === selectedAlertId)} />
            </div>
        </div>
    );
};

export default AlertsViewer