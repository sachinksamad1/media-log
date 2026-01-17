import type { Timestamp } from 'firebase-admin/firestore';

export const formatTimestamp = (date: unknown): string => {
  if (!date) return new Date().toISOString();

  // If using Firestore Timestamps
  if (
    typeof date === 'object' &&
    date !== null &&
    'toDate' in date &&
    typeof (date as Timestamp).toDate === 'function'
  ) {
    return (date as Timestamp).toDate().toISOString();
  }

  // If it's already a JS Date object or a string/number
  if (
    typeof date === 'string' ||
    typeof date === 'number' ||
    date instanceof Date
  ) {
    const d = new Date(date);
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  }

  return new Date().toISOString();
};
