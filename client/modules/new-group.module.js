import { sendRequest } from "../utils/request.utility.js";
import { createChatLists } from "./socket.module.js";

/**
 * Creates a new group chat by submitting form data to the server.
 * @param {string} phone - The user's phone number.
 * @param {string} username - The user's username.
 */
export async function createNewGroup(phone, username) {
	try {
		/** retrieve access token from session storage */
		const accessToken = sessionStorage.getItem("accessToken");
		if (!accessToken) throw new Error("Access token is missing.");

		/** extract new group form data */
		const form = document.querySelector("#newGroupForm");
		const formObject = extractFormData(form);

		/** Send new group request */
		const response = await sendRequest(
			formObject,
			"http://127.0.0.1:3000/room",
			"POST",
			accessToken
		);

		hideModal("newGroupModal");
		showAlert(response?.message || "Group created successfully.");

		createChatLists(phone, username);
	} catch (error) {
		console.error("Failed to create new group:", error);
		showAlert("Error creating group: " + error.message);
	}
}

/**
 * Creates a new private chat by submitting form data to the server.
 * @param {string} phone - The user's phone number.
 * @param {string} username - The user's username.
 */
export async function createNewPrivate(phone, username) {
	try {
		/** retrieve access token from session storage */
		const accessToken = sessionStorage.getItem("accessToken");
		if (!accessToken) throw new Error("Access token is missing.");

		/** extract new private chat form data */
		const form = document.querySelector("#newPrivateChatForm");
		const formObject = extractFormData(form, true);

		/** Send new private chat request */
		const response = await sendRequest(
			formObject,
			"http://127.0.0.1:3000/room",
			"POST",
			accessToken
		);

		hideModal("newPrivateModal");
		showAlert(response?.message || "Private chat created successfully.");

		createChatLists(phone, username);
	} catch (error) {
		console.error("Failed to create new private chat:", error);
		showAlert("Error creating private chat: " + error.message);
	}
}

/**
 * Handles form data and converts it into a structured object.
 * @param {HTMLFormElement} form - The form element to extract data from.
 * @param {boolean} isMultiValue - Indicates if a field supports multiple values (e.g., "users").
 */
function extractFormData(form, isMultiValue = false) {
	const formData = new FormData(form);
	const formObject = {};

	formData.forEach((value, key) => {
		if (isMultiValue && key === "users") {
			/** Handle fields that allow multiple values (e.g., users array) */
			formObject[key] = [value];
		} else if (formObject[key]) {
			/** Convert existing keys into arrays to handle duplicates */
			formObject[key] = [].concat(formObject[key], value);
		} else {
			formObject[key] = value;
		}
	});

	return formObject;
}

/**
 * Hides a Bootstrap modal by its ID.
 * @param {string} modalId - The ID of the modal to hide.
 */
function hideModal(modalId) {
	$(`#${modalId}`).modal("hide");
}

/**
 * Displays a response message to the user.
 * @param {string} message - The message to display.
 */
function showAlert(message) {
	alert(message);
}
