export type EffectPeriod = {
  effect_start: string;
  effect_end: string;
}

export type Service = {
  route_type: string;
  mode_name: string;
  route_id: string;
  route_name: string;
  direction_id?: string;
  direction_name?: string;
}

export type AffectedServices = {
  services: Service[];
  elevators: unknown[];
}

export type AlertImage = {
  url: string;
  media_type: string;
  sort_order: string;
}

export type Alert = {
  alert_id: number;
  effect_name: string;
  effect: string;
  cause_name?: string;
  cause?: string;
  header_text: string;
  short_header_text: string;
  url: string;
  description_text: string;
  severity: string;
  created_dt: string;
  last_modified_dt: string;
  tts_description_text: string | null;
  service_effect_text: string;
  timeframe_text: string;
  alert_lifecycle: string;
  effect_periods: EffectPeriod[];
  affected_services: AffectedServices;
  images?: AlertImage[];
  recurrence_text?: string;
  alternate_stops?: unknown[];
}

export interface AlertsViewerProps {
  alerts?: Alert[];
  apiUrl?: string;
  EffectIcon?: React.ComponentType<{ effect: string }>;
}
