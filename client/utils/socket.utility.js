/**
 * Formats a date string into a readable format.
 *
 * @param {string} dateString - The timestamp to format.
 * @returns {string} - Formatted date string.
 */
export function formatDate(dateString) {
	const date = new Date(dateString);
	const now = new Date();
	const options = { hour: "2-digit", minute: "2-digit" };

	if (date.toDateString() === now.toDateString())
		return `${date.toLocaleTimeString([], options)}, Today`;

	const yesterday = new Date();
	yesterday.setDate(now.getDate() - 1);
	if (date.toDateString() === yesterday.toDateString())
		return `${date.toLocaleTimeString([], options)}, Yesterday`;

	return `${date.toLocaleTimeString([], options)}, ${date.toDateString()}`;
}

/**
 * Clears all children of a container.
 *
 * @param {HTMLElement} container - The container to clear.
 */
export function clearContainer(container) {
	container.innerHTML = "";
}

/**
 * Creates an element with a specific class.
 *
 * @param {string} tag - HTML tag name.
 * @param {string} className - Class name.
 * @returns {HTMLElement} - Created element.
 */
export function createElementWithClass(tag, className) {
	const element = document.createElement(tag);
	element.className = className;
	return element;
}

/**
 * Creates an image element.
 *
 * @param {string} src - Image source URL.
 * @param {string} alt - Alternative text.
 * @returns {HTMLElement} - Image element.
 */
export function createImageElement(src, alt) {
	const img = document.createElement("img");
	img.src = src;
	img.alt = alt;
	return img;
}

/**
 * Checks if a string is a valid URL.
 *
 * @param {string} str - The string to check.
 * @returns {boolean} - True if the string is a link.
 */
export function isLink(str) {
	return /https?:\/\//.test(str);
}

/**
 * Utility function to create an input button with a specified Font Awesome icon.
 *
 * @param {string} iconClass - The Font Awesome class for the icon (e.g., "fa-send", "fa-upload").
 * @param {string|undefined} iconClass - The input button optional id
 */
export function createInputButton(iconClass, id = undefined) {
	/** Create the wrapper div */
	const inputButtonDiv = createElementWithClass("div", "input-group-prepend");
	if (id) inputButtonDiv.id = id;

	/** Create the span element for the icon */
	const iconSpan = createElementWithClass("span", "input-group-text");

	/** Create the Font Awesome icon */
	const icon = createElementWithClass("i", `fa ${iconClass}`);

	/** Append the icon to the span and the span to the wrapper div */
	iconSpan.appendChild(icon);
	inputButtonDiv.appendChild(iconSpan);

	return inputButtonDiv;
}

/**
 * Utility function to create an HTML element with specified attributes.
 *
 * @param {string} tag - The type of element to create (e.g., "div", "a", "img").
 * @param {Object} attributes - Key-value pairs of attributes and their values.
 * @returns {HTMLElement} The created element with the specified attributes.
 */
export function createElementWithAttribute(tag, attributes) {
	const element = document.createElement(tag);
	for (const [key, value] of Object.entries(attributes)) {
		element.setAttribute(key, value);
	}
	return element;
}

/**
 * Utility function to create a text element with a specified tag, text content, and optional class.
 *
 * @param {string} tag - The type of element to create (e.g., "h6", "small").
 * @param {string} textContent - The text content for the element.
 * @param {string} [className] - Optional class name(s) to apply to the element.
 * @returns {HTMLElement} The created text element.
 */
export function createTextElement(tag, textContent, className = "") {
	const element = createElementWithClass(tag, className);
	element.textContent = textContent;
	return element;
}

export function scrollToBottom(elementId) {
	const chatHistory = document.getElementById(elementId);
	chatHistory.scrollTop = chatHistory.scrollHeight;
}
