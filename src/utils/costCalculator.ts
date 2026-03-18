const WORK_HOURS_PER_YEAR = 2080;

/** Hourly rate from annual salary */
export function hourlyRate(salary: number): number {
  return salary / WORK_HOURS_PER_YEAR;
}

/** Cost per second for a given salary */
export function perSecondRate(salary: number): number {
  return hourlyRate(salary) / 3600;
}

/** Combined per-second rate for multiple salaries */
export function combinedPerSecondRate(salaries: number[]): number {
  return salaries.reduce((sum, s) => sum + perSecondRate(s), 0);
}

/** Per-minute cost */
export function perMinuteRate(salaries: number[]): number {
  return combinedPerSecondRate(salaries) * 60;
}

/** Format a number as USD */
export function formatCurrency(amount: number): string {
  if (amount >= 1000) {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `$${amount.toFixed(2)}`;
}

/** Format elapsed seconds as mm:ss */
export function formatTime(totalSeconds: number): string {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = Math.floor(totalSeconds % 60);
  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/** "Could have been an email" threshold */
export const EMAIL_THRESHOLD = 500;

/** Coffee cost for comparison */
export const COFFEE_COST = 5.5;

export interface MeetingRecord {
  id: string;
  name: string;
  cost: number;
  duration: number; // seconds
  attendeeCount: number;
  date: string;
}

const STORAGE_KEY = 'meeting-cost-history';

export function loadHistory(): MeetingRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveToHistory(record: MeetingRecord): void {
  const history = loadHistory();
  history.unshift(record);
  // Keep last 50
  if (history.length > 50) history.length = 50;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
