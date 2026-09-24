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

// TODO: TYPES
const formatData = (rawAtis: any) => {
    const { alerts } = rawAtis.data;
    // TODO FIX
    return alerts.map((a) => {
        return {
            id: a.alert_id,
            bodyTitle: a.header_text,
            listTitle: a.atis_title || a.short_header_text || a.header_text,
        };
    });
};

export {formatData, fetchFromTransitAlerts}
