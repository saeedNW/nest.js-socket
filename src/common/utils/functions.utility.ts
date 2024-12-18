/**
 * Checks if a string is a valid URL.
 *
 * @param {string} str - The string to check.
 * @returns {boolean} - True if the string is a link.
 */
export function isLink(str: string): boolean {
	return /https?:\/\//.test(str);
}
