import { Timestamp } from 'firebase-admin/firestore'; 

export const formatTimestamp = (date: any): string => {
  if (!date) return new Date().toISOString();

  // If using Firestore Timestamps
  if (typeof date.toDate === 'function') {
    return date.toDate().toISOString();
  }

  // If it's already a JS Date object or a string/number
  const d = new Date(date);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
};