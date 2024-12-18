import { sendRequest } from "../utils/request.utility.js";

/**
 * Handles user authentication flow, including sending OTP, verifying it,
 * and prompting for a username if not already provided.
 */
export async function auth() {
	try {
		/** Prompt for the user's phone number */
		const phone = promptForInput(
			"Enter Your Phone number:",
			"Phone number is required."
		);

		/** Send OTP request */
		const sendOTPResponse = await sendRequest(
			{ phone },
			"http://127.0.0.1:3000/auth/send-otp",
			"POST"
		);
		alert(`Code: ${sendOTPResponse?.data?.code}`);

		/** Prompt for the OTP code */
		const code = promptForInput("Enter OTP code:", "OTP code is required.");

		/** Verify OTP */
		const checkOtpResponse = await sendRequest(
			{ code },
			"http://127.0.0.1:3000/auth/check-otp",
			"POST"
		);

		/** Extract access token and user details */
		const accessToken = `bearer ${checkOtpResponse?.data?.accessToken}`;
		const currentUserId = checkOtpResponse?.data?.id;
		const storedUsername = checkOtpResponse?.data?.username;

		/** Store access token in session storage */
		sessionStorage.setItem("accessToken", accessToken);

		/** Step 5: Prompt for username if not already set */
		const username = await ensureUsername(storedUsername, accessToken);

		/** Return authenticated user details */
		return { phone, username, accessToken, currentUserId };
	} catch (error) {
		handleAuthError(error);
		throw error;
	}
}

/**
 * Prompts the user for input with validation.
 *
 * @param {string} message - The prompt message displayed to the user.
 * @param {string} errorMessage - The error message if input is missing.
 */
function promptForInput(message, errorMessage) {
	const input = prompt(message);
	if (!input || input.trim() === "") {
		alert(errorMessage);
		throw new Error(errorMessage);
	}
	return input.trim();
}

/**
 * Ensures the username is set by prompting the user if it's not already provided.
 *
 * @param {string | undefined} storedUsername - The username returned from the server.
 * @param {string} accessToken - The user's access token for authentication.
 */
async function ensureUsername(storedUsername, accessToken) {
	let username = storedUsername;

	/** If no username is provided, prompt the user */
	if (!username) {
		username = prompt("Enter username:");

		/** Update username on the server if provided */
		if (username && username.trim() !== "") {
			await sendRequest(
				{ username: username.trim() },
				"http://127.0.0.1:3000/user/username",
				"PATCH",
				accessToken
			);
		}
	}

	return username;
}

/**
 * Handles errors that occur during the authentication process.
 *
 * @param {Error} error - The error object to handle.
 */
function handleAuthError(error) {
	console.error("Authentication Error:", error);
	document.body.innerHTML = ""; /** Clear the page content */
	alert(error.message || "Login failed.");
}
