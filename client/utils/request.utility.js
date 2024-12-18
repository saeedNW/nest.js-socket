/**
 * Sends an HTTP request to a specified endpoint.
 * @param {Object|FormData} data - The request payload (JSON or FormData for uploads).
 * @param {string} url - The target endpoint URL.
 * @param {string} method - The HTTP method (GET, POST, PUT, PATCH, DELETE).
 * @param {string} [accessToken] - Optional access token for authorization.
 * @param {boolean} [uploader=false] - Whether the request involves file uploads.
 */
export async function sendRequest(
	data,
	url,
	method,
	accessToken = undefined,
	uploader = false
) {
	try {
		/** Normalize HTTP method to uppercase */
		method = method.toUpperCase();

		/** Prepare headers for the request */
		const headers = new Headers();

		if (!uploader) {
			/** For non-upload requests, set Content-Type as JSON */
			headers.append("Content-Type", "application/json");
		}

		/** Include Authorization header if accessToken is provided */
		if (accessToken) {
			headers.append("Authorization", accessToken);
		}

		/** Build request options object */
		const requestOptions = {
			method,
			headers,
			redirect: "manual",
			/** Include cookies in the request */
			credentials: "include",
		};

		/** Add request body for methods requiring payload */
		if (["POST", "PUT", "PATCH"].includes(method)) {
			requestOptions.body = uploader ? data : JSON.stringify(data);
		}

		/** Execute the fetch request */
		const response = await fetch(url, requestOptions);

		/** Parse the response body as JSON */
		const result = await response.json();

		/** Handle non-successful responses */
		if (!response.ok) {
			console.error("Request failed:", result);
			throw result.message || "An error occurred while processing the request.";
		}

		/** Return the parsed response */
		return result;
	} catch (error) {
		alert(error);
		throw error;
	}
}
