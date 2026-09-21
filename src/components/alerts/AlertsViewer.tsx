import { useEffect, useState } from "react";
import { fetchFromAtis, formatFromAtis } from "../utils/atis";

import AlertList from "./AlertList";

// TODO: urlconfig that defines how the url should be fetched
const AlertsViewer = ({apiUrl: string}) => {
       const testAlerts = [{id:1,name:"first alert",body:"second"},{id:2,name:"second"}]
       const [alerts, setAlerts] = useState([])

       useEffect(async ()=>{
        const fetchedAlerts = await fetchFromAtis(apiUrl)
        setAlerts(formatFromAtis(fetchedAlerts))
       },[])

       return (
        <div>
            <h1>Alerts!</h1>
            <AlertList alerts={alerts} />
        </div>
    );
};

export default AlertsViewer