/**
 * Capitalizes the first letter of a string
 */
export const capitalize = (str: string): string => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Truncates a string to a maximum length and adds an ellipsis
 */
export const truncate = (str: string, length: number): string => {
  if (!str) return "";
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
};

/**
 * Generates a random ID (simple alphanumeric)
 */
export const generateId = (length: number = 8): string => {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
};

/**
 * Converts a string to a slug
 */
export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
};
