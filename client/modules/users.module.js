import { sendRequest } from "../utils/request.utility.js";

/**
 * Fetches a list of all users from the server.
 * @param {string} accessToken - The access token for authentication.
 */
export async function getAllUsers(accessToken) {
	try {
		const response = await sendRequest(
			undefined,
			"http://127.0.0.1:3000/user/all",
			"GET",
			accessToken
		);

		return response?.data?.users || [];
	} catch (error) {
		console.error("Failed to fetch users list:", error);
		throw new Error("Unable to fetch users. Please try again.");
	}
}

/**
 * Populates a select element with a list of users.
 * @param {Array} usersList - The list of users to populate.
 * @param {string} selectElementId - The ID of the select element to populate.
 */
function populateUserSelect(usersList, selectElementId) {
	/** Select new group 'select' element */
	const selectElement = document.getElementById(selectElementId);

	/** Clear existing options */
	selectElement.innerHTML = "";

	/** Create and append new options to users selector */
	for (const user of usersList) {
		const optionElement = document.createElement("option");
		optionElement.value = user._id;
		optionElement.textContent = user?.username || user?.phone || "Unknown User";
		selectElement.appendChild(optionElement);
	}
}

/**
 * Creates and populates the group users list dropdown.
 * @param {string} accessToken - The access token for authentication.
 * @returns {Promise<void>}
 */
export async function createNewGroupUsersList(accessToken) {
	try {
		/** Retrieve system users */
		const usersList = await getAllUsers(accessToken);

		/** add new options to users selector */
		populateUserSelect(usersList, "groupUsersInput");
	} catch (error) {
		alert(error.message);
	}
}

/**
 * Creates and populates the private chat users list dropdown.
 * @param {string} accessToken - The access token for authentication.
 */
export async function createNewChatUsersList(accessToken) {
	try {
		/** Retrieve system users */
		const usersList = await getAllUsers(accessToken);

		/** add new options to users selector */
		populateUserSelect(usersList, "privateChatUsersInput");
	} catch (error) {
		alert(error.message);
	}
}
