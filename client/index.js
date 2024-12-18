import { auth } from "./modules/auth.module.js";
import { modalActivation } from "./modules/modal-activation.module.js";
import { sendRequest } from "./utils/request.utility.js";
import {
	updateProfileImage,
	updateUsername,
} from "./modules/user-setting.module.js";
import {
	createNewGroup,
	createNewPrivate,
} from "./modules/new-group.module.js";
import { socketManager } from "./modules/socket.module.js";

/**
 * Entry point for initializing the chat application.
 * Manages user authentication, event listeners, and socket connections.
 */
async function main() {
	/** Retrieve stored access token */
	let accessToken = sessionStorage.getItem("accessToken");
	let phone, username, currentUserId;

	/** If no access token exists, authenticate the user */
	if (!accessToken) {
		const authResult = await auth();

		/** Extract authentication data */
		phone = authResult.phone;
		currentUserId = authResult.currentUserId;
		username = authResult?.username || authResult.phone;
		accessToken = authResult.accessToken;
	} else {
		/** Fetch user data using the stored access token */
		const { data: userData } = await sendRequest(
			undefined,
			"http://localhost:3000/user",
			"GET",
			accessToken
		);

		/** Extract user details */
		phone = userData.phone;
		currentUserId = userData.id;
		username = userData?.username || userData.phone;
	}

	/** Activate modal functionality with the current access token */
	modalActivation(accessToken);

	/** Attach event listeners for user settings */
	document
		.querySelector("#usernameForm button")
		.addEventListener("click", updateUsername);

	document
		.querySelector("#imageUploadForm button")
		.addEventListener("click", updateProfileImage);

	/** Attach event listeners for creating groups and private chats */
	document
		.querySelector("#newGroupForm button")
		.addEventListener("click", createNewGroup);

	document
		.querySelector("#newPrivateChatForm button")
		.addEventListener("click", createNewPrivate);

	/** Initialize WebSocket manager with user session data */
	socketManager(accessToken, phone, currentUserId);
}

/** Invoke the main function to start the application */
main();