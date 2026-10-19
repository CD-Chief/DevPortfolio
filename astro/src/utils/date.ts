const fmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

// "2026-06-04" -> "4 Jun 2026"
export const formatDate = (isoDate: string) => fmt.format(new Date(`${isoDate}T00:00:00Z`));
