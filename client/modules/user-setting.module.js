import { sendRequest } from "../utils/request.utility.js";

/**
 * Updates the username by submitting form data to the server.
 */
export async function updateUsername() {
	try {
		/** retrieve access token from session storage */
		const accessToken = sessionStorage.getItem("accessToken");
		if (!accessToken) throw new Error("Access token is missing.");

		/** extract username form data */
		const form = document.querySelector("#usernameForm");
		const formObject = extractFormData(form);

		/** Send update request */
		const response = await sendRequest(
			formObject,
			"http://127.0.0.1:3000/user/username",
			"PATCH",
			accessToken
		);

		hideModal("userSettingModal");
		showAlert(response?.message || "Username updated successfully.");
	} catch (error) {
		console.error("Failed to update username:", error);
		showAlert("Error updating username: " + error.message);
	}
}

/**
 * Updates the user's profile image by submitting form data to the server.
 */
export async function updateProfileImage() {
	try {
		/** retrieve access token from session storage */
		const accessToken = sessionStorage.getItem("accessToken");
		if (!accessToken) throw new Error("Access token is missing.");

		/** extract profile image form data */
		const form = document.querySelector("#imageUploadForm");
		const formData = new FormData(form);

		/** Send update request */
		const response = await sendRequest(
			formData,
			"http://127.0.0.1:3000/user/profile-image",
			"PATCH",
			accessToken,
			true
		);

		showAlert(response?.message || "Profile image updated successfully.");
	} catch (error) {
		console.error("Failed to update profile image:", error);
		showAlert("Error updating profile image: " + error.message);
	}
}

/**
 * Extracts form data and converts it into a structured object.
 * @param {HTMLFormElement} form - The form element to process.
 */
function extractFormData(form) {
	const formData = new FormData(form);
	const formObject = {};
	formData.forEach((value, key) => {
		formObject[key] = value;
	});
	return formObject;
}

/**
 * Handles hiding a Bootstrap modal by its ID.
 * @param {string} modalId - The ID of the modal to hide.
 */
function hideModal(modalId) {
	$(`#${modalId}`).modal("hide");
}

/**
 * Displays an alert with a given message.
 * @param {string} message - The message to display.
 */
function showAlert(message) {
	alert(message);
}
