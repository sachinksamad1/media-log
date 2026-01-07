export function formatTimestamp(date: any): string {
    if (!date) return "";
    let dateObj: Date;

    // Handle Firestore Timestamp (has toDate method)
    if (typeof date.toDate === 'function') {
        dateObj = date.toDate();
    }
    // Handle serialized Firestore Timestamp (raw object with _seconds)
    else if (date && typeof date._seconds === 'number') {
         dateObj = new Date(date._seconds * 1000 + (date._nanoseconds || 0) / 1000000);
    }
    // Handle standard Date object
    else if (date instanceof Date) {
        dateObj = date;
    }
    // Handle string or number
    else {
        dateObj = new Date(date);
    }

    // Format to a human-readable string nicely
    // Example: "January 7, 2026 at 10:40:17 PM UTC+5:30"
    return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    });
}
