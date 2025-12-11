export interface DailyRecord {
  date: string; // Format: YYYY-MM-DD
  weight: string;
  bodyFat: string;
}

export type Tab = 'input' | 'history';

export type HistoryPeriod = '7D' | '14D' | '1M' | '6M' | '1Y';

export type MetricType = 'weight' | 'bodyFat';

export interface ToastState {
  show: boolean;
  message: string;
}