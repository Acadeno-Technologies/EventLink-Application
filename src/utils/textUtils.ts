/**
 * Utility functions for smart casing and text formatting
 */

/**
 * Converts text to Title Case (capitalizes the first letter of each word).
 * Handles word boundaries like spaces, hyphens, underscores, slashes, periods, and parentheses.
 * e.g., "ai automation workshop" -> "Ai Automation Workshop"
 * e.g., "john doe" -> "John Doe"
 * e.g., "kozhikode, kerala" -> "Kozhikode, Kerala"
 */
export const toTitleCase = (val: string): string => {
  if (!val) return '';
  return val.replace(/(^|[\s\-_/.,()[\]{}'"])([a-z])/g, (_, boundary, char) => boundary + char.toUpperCase());
};

/**
 * Converts text to Sentence Case (capitalizes the first letter of each sentence).
 * Ideal for short descriptions, agendas, notes, and paragraphs.
 * e.g., "welcome to the event. please bring your laptop." -> "Welcome to the event. Please bring your laptop."
 */
export const toSentenceCase = (val: string): string => {
  if (!val) return '';
  return val.replace(/(^\s*|[.!?\n]\s+)([a-z])/g, (_, boundary, char) => boundary + char.toUpperCase());
};

/**
 * Converts a 12-hour formatted time ("10:00 AM", "1:00 PM") to 24-hour "HH:mm" for <input type="time">
 */
export const format12to24 = (time12?: string): string => {
  if (!time12) return '10:00';
  const match = time12.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return time12.includes(':') ? time12.slice(0, 5) : '10:00';

  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const modifier = (match[3] || '').toUpperCase();

  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  return `${hours.toString().padStart(2, '0')}:${minutes}`;
};

/**
 * Converts a 24-hour time string ("13:00", "09:30") to a standard 12-hour AM/PM string ("01:00 PM", "09:30 AM")
 */
export const format24to12 = (time24?: string): string => {
  if (!time24) return '10:00 AM';
  const parts = time24.split(':');
  if (parts.length < 2) return time24;

  let hours = parseInt(parts[0], 10);
  const minutes = parts[1].slice(0, 2);
  const modifier = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12;

  return `${hours.toString().padStart(2, '0')}:${minutes} ${modifier}`;
};

