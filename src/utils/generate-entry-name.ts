function pad(n: number, len = 2) {
  return String(n).padStart(len, "0");
}

/** e.g. "2026-10-09" */
export function generateEntryNameFromDate(date: Date = new Date()): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** e.g. "14-30-05" */
export function generateEntryNameFromTime(date: Date = new Date()): string {
  return `${pad(date.getHours())}-${pad(date.getMinutes())}-${pad(date.getSeconds())}`;
}

/** e.g. "2026-10-09_14-30-05" */
export function generateEntryNameFromDateTime(date: Date = new Date()): string {
  return `${generateEntryNameFromDate(date)}_${generateEntryNameFromTime(date)}`;
}
