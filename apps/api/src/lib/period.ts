/** Dates are stored as plain `YYYY-MM-DD`; always build them from local time, not UTC. */
export function toDateString(d: Date): string {
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

export function currentMonth(): string {
  return toDateString(new Date()).slice(0, 7);
}

/** `start` is inclusive, `end` is exclusive (first day of the next month). */
export function monthRange(month: string) {
  const [year, m] = month.split('-').map(Number);
  return {
    start: toDateString(new Date(year, m - 1, 1)),
    end: toDateString(new Date(year, m, 1)),
    days: new Date(year, m, 0).getDate(),
  };
}
