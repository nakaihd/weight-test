import { DailyRecord } from '../types';

const STORAGE_KEY = 'pinkfit_records';

const getRecordsMap = (): Record<string, DailyRecord> => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return {};
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error("Failed to parse records", e);
    return {};
  }
};

export const saveRecord = (record: DailyRecord): void => {
  const records = getRecordsMap();
  records[record.date] = record;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
};

export const getRecord = (date: string): DailyRecord | null => {
  const records = getRecordsMap();
  return records[date] || null;
};

export const getAllRecords = (): DailyRecord[] => {
  const records = getRecordsMap();
  return Object.values(records).sort((a, b) => a.date.localeCompare(b.date));
};