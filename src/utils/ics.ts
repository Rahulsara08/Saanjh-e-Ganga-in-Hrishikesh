export interface ICSEventParams {
  title: string;
  description: string;
  location: string;
  startDate: string; // ISO or date string
  endDate?: string;
}

function formatDateToICS(isoStr: string): string {
  const d = new Date(isoStr);
  const pad = (n: number) => (n < 10 ? '0' + n : '' + n);
  return (
    d.getUTCFullYear() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    'T' +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    'Z'
  );
}

export function generateICS(params: ICSEventParams): void {
  const startICS = formatDateToICS(params.startDate);
  const endICS = params.endDate
    ? formatDateToICS(params.endDate)
    : formatDateToICS(new Date(new Date(params.startDate).getTime() + 3 * 3600000).toISOString());

  const cleanDescription = (params.description || '').replace(/\n/g, '\\n');
  const cleanLocation = (params.location || '').replace(/\n/g, ', ');

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Meher & Kabir Wedding//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@meherandkabir.wedding`,
    `DTSTAMP:${formatDateToICS(new Date().toISOString())}`,
    `DTSTART:${startICS}`,
    `DTEND:${endICS}`,
    `SUMMARY:${params.title}`,
    `DESCRIPTION:${cleanDescription}`,
    `LOCATION:${cleanLocation}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${params.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
