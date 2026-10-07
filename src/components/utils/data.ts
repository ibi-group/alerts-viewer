import type { Alert, RawAlert } from "../types";

const fetchFromTransitAlerts = async (url: string | undefined) => {
    const now = Math.floor(Date.now() / 1000);
    // Alerts API only supports pastalerts from the past 31 days.
    const THIRTY_ONE_DAYS_IN_SECONDS = 2_678_400;
    const pastAlertsStartWindow = now - THIRTY_ONE_DAYS_IN_SECONDS;

    const pastAlertsDateTimeURL =
        `${url}&from_datetime=${pastAlertsStartWindow}&to_datetime=${now}`;

    const result = await fetch(pastAlertsDateTimeURL);
    return await result.json();
};

const formatData = (data: RawAlert[]): Alert[] => {
    // TODO: add relevant fields
    return data.map((a: RawAlert) => {
        const routeNames: string[] = a.affected_services.services.map((s) => s.route_name);
        const routeIds: string[] = a.affected_services.services.map((s) => s.route_id);
        return {
            id: a.alert_id,
            bodyTitle: a.header_text,
            effectName: a.effect_name,
            effectPeriods: a.effect_periods,
            listTitle: a.atis_title || a.short_header_text || a.header_text,
            routeNames,
            routeIds,
        };
    });
};

export {formatData, fetchFromTransitAlerts}
