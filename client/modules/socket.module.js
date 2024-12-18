import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";
import {
	formatDate,
	clearContainer,
	createElementWithClass,
	createImageElement,
	isLink,
	createInputButton,
	createElementWithAttribute,
	createTextElement,
	scrollToBottom,
} from "../utils/socket.utility.js";
import { sendRequest } from "../utils/request.utility.js";

let socket, accessToken;

/**
 * Initializes and manages socket connection.
 *
 * @param {string} authorization - User's access token for authentication.
 * @param {string} phone - User's phone number.
 * @param {string} currentUserId - ID of the current user.
 */
export function socketManager(authorization, phone, currentUserId) {
	accessToken = authorization;

	socket = io("http://localhost:3000", {
		auth: { authorization },
	});

	socket.on("connect", () => console.log("Connected to server"));

	createChatLists(phone, currentUserId);

	socket.on("receive-message", ({ message }) => {
		/** Determined whether the chat is a group chat or a private chat */
		const isGroup =
			document
				.querySelector(".chat-about small")
				.textContent.trim()
				.toLowerCase() === "group";

		/** Create chat element */
		createMessageElement(message, currentUserId, isGroup);

		scrollToBottom("chat-history");
	});

	socket.on("error", (error) => {
		console.error("Server Error:", error);
		alert(`Error: ${error.message}`);
	});
}

/**
 * Retrieves and renders chat rooms and user statuses.
 *
 * @param {string} phone - User's phone number.
 * @param {string} currentUserId - Current user's ID.
 */
export function createChatLists(phone, currentUserId) {
	socket.emit("get-rooms");

	/** Listen for room list */
	socket.on("get-rooms", ({ rooms }) => {
		const chatList = document.getElementById("chat-list");
		clearContainer(chatList);

		for (const room of rooms) {
			if (room.type === "private") {
				createPrivateChatList(room, chatList, phone, currentUserId);
			} else {
				createGroupChatList(room, chatList, currentUserId);
			}
		}

		getOnlineUsers();
	});

	socket.emit("user-online-status");

	/** Update user statuses */
	socket.on("user-online-status", ({ userId, isOnline }) => {
		updateUserStatus(userId, isOnline);
	});
}

/**
 * Retrieves and updates online user statuses.
 */
function getOnlineUsers() {
	socket.emit("get-online-users");

	socket.on("get-online-users", ({ onlineUsers }) => {
		onlineUsers.forEach((userId) => updateUserStatus(userId, true));
	});
}

/**
 * Updates the user's online/offline status in the UI.
 *
 * @param {string} userId - The ID of the user.
 * @param {boolean} isOnline - The online status of the user.
 */
function updateUserStatus(userId, isOnline) {
	const status = isOnline ? "online" : "offline";
	const statusDiv = document.getElementById(`${userId}-div`);
	const statusIcon = document.getElementById(`${userId}-icon`);

	if (statusDiv) {
		statusIcon.className = `fa fa-circle ${status}`;
		statusDiv.lastChild.textContent = ` ${status}`;
	}

	const chatAboutStatus = document.getElementById(`${userId}-about-status`);
	if (chatAboutStatus) {
		chatAboutStatus.textContent = status;
	}
}

/**
 * Creates a private chat list item.
 *
 * @param {Object} item - Room information.
 * @param {HTMLElement} chatList - Chat list container.
 * @param {string} phone - User's phone number.
 * @param {string} currentUserId - Current user's ID.
 */
function createPrivateChatList(item, chatList, phone, currentUserId) {
	/** Extract the data of the user whom the current user is chatting with */
	const otherUser = item.users.find((user) => user.phone !== phone);

	/** Create a list element to present the chat room info */
	const listItem = createElementWithClass("li", "clearfix");
	listItem.setAttribute("data-endpoint", item.endpoint);

	/** Add click event listener to handle active class */
	listItem.onclick = () => handleListItemClick(listItem, currentUserId);

	/** Create other user's profile image lnk */
	const imgSrc = otherUser?.profileImage
		? `http://localhost:3000${otherUser.profileImage}`
		: "https://bootdey.com/img/Content/avatar/avatar1.png";

	/** Create profile image element */
	listItem.appendChild(createImageElement(imgSrc, "avatar"));

	/** Create chat room info element */
	const aboutDiv = createAboutElement(
		otherUser?.username || otherUser?.phone,
		otherUser._id
	);

	listItem.appendChild(aboutDiv);
	chatList.appendChild(listItem);
}

/**
 * Creates a group chat list item.
 *
 * @param {Object} item - Group room information.
 * @param {HTMLElement} chatList - Chat list container.
 * @param {string} currentUserId - Current user's ID.
 */
function createGroupChatList(item, chatList, currentUserId) {
	/** Create a list element to present the chat room info */
	const listItem = createElementWithClass("li", "clearfix");
	listItem.setAttribute("data-endpoint", item.endpoint);

	/** Add click event listener to handle active class */
	listItem.onclick = () => handleListItemClick(listItem, currentUserId);

	/** Create profile image element */
	listItem.appendChild(
		createImageElement("./images/group-3-new.jpeg", "avatar")
	);

	/** Create chat room info element */
	const aboutDiv = createAboutElement(item?.name || "Group");

	listItem.appendChild(aboutDiv);
	chatList.appendChild(listItem);
}

/**
 * Creates a "chat about" element containing the user's name and status.
 *
 * @param {string} title - The title/name to display.
 * @param {string} userId - User ID for creating unique element IDs (optional).
 * @returns {HTMLElement} - The 'about' div element with user name and status.
 */
function createAboutElement(title, userId) {
	/** Container div with class 'about' */
	const aboutDiv = createElementWithClass("div", "about");

	/** Title (username or group name) */
	const nameSpan = createElementWithClass("span", "name");
	nameSpan.textContent = title;

	/** Status container */
	const statusDiv = createElementWithClass("div", "status");
	if (userId) {
		statusDiv.id = `${userId}-div`;

		/** Icon for user status */
		const statusIcon = createElementWithClass("i", "fa fa-circle offline");
		statusIcon.id = `${userId}-icon`;

		/** Append icon and status text */
		statusDiv.appendChild(statusIcon);
		statusDiv.appendChild(document.createTextNode(" offline"));
	} else {
		statusDiv.appendChild(document.createTextNode(" Group"));
	}

	/** Assemble the aboutDiv */
	aboutDiv.appendChild(nameSpan);
	aboutDiv.appendChild(statusDiv);

	return aboutDiv;
}

/**
 * Handles click events on a chat list item.
 *
 * @param {HTMLElement} clickedItem - The clicked chat list item.
 * @param {string} currentUserId - ID of the current user.
 */
function handleListItemClick(clickedItem, currentUserId) {
	/** Remove 'active' class from all list items */
	document
		.querySelectorAll("#chat-list li")
		.forEach((item) => item.classList.remove("active"));

	/** Add 'active' class to the clicked item */
	clickedItem.classList.add("active");

	/** Create chat's header info element */
	createChatInfoElement(clickedItem);

	/** Extract the endpoint data */
	const endpoint = clickedItem.getAttribute("data-endpoint");

	/** Determined whether the chat is a group chat or a private chat */
	const isGroup =
		clickedItem.querySelector(".status")?.textContent.trim().toLowerCase() ===
		"group";

	/** Join to the chat room socket */
	joinRoom(endpoint, currentUserId, isGroup);
}

/**
 * Joins a chat room and renders messages.
 *
 * @param {string} endpoint - The room endpoint.
 * @param {string} currentUserId - ID of the current user.
 * @param {boolean} isGroup - Whether the room is a group.
 */
function joinRoom(endpoint, currentUserId, isGroup) {
	socket.emit("joinRoom", { endpoint });

	socket.on("joinRoom", (data) => {
		createSendInput();
		clearContainer(document.getElementById("chat-history-list"));

		data.messages.forEach((message) => {
			createMessageElement(message, currentUserId, isGroup);
		});
	});
}

/**
 * Creates a message element in the chat.
 *
 * @param {Object} message - Message data.
 * @param {string} currentUserId - ID of the current user.
 * @param {boolean} isGroup - Whether the room is a group chat.
 */
function createMessageElement(message, currentUserId, isGroup) {
	/** Determine whether the message has been sent or received by current user */
	const sentMessage =
		message.sender._id.toString() === currentUserId.toString();

	/** Convert message send time to a more readable form */
	const messageDataTime = formatDate(message.timestamp);

	const liElement = createElementWithClass("li", "clearfix");

	const messageContent = isLink(message.content)
		? `<img class="image-message" src="${message.content}" alt="image">`
		: message.content;

	liElement.innerHTML = `
	<div class="message-data ${sentMessage ? "text-right" : ""}">
		${
			isGroup && !sentMessage && message?.sender?.profileImage
				? `
			<img
				src="http://localhost:3000${message.sender.profileImage}"
				alt="avatar"
			/>
		`
				: ""
		}
		<span class="message-data-time">${messageDataTime}</span>
	</div>
	<div class="message ${sentMessage ? "other-message float-right" : "my-message"}">
		${messageContent}
	</div>`;

	document.getElementById("chat-history-list").appendChild(liElement);

	scrollToBottom("chat-history");
}

/**
 * Creates the message input section with a send icon, an upload icon,
 * and a text input field, then appends them to the parent container.
 */
function createSendInput() {
	/** Get the parent container and clear existing content */
	const parentContainer = document.getElementById("send-input-div");
	parentContainer.innerHTML = "";

	/** Create the "Send" button with icon */
	const sendButton = createInputButton("fa-send", "send-input-btn");

	/** Create the "Upload" button with icon */
	const uploadButton = createInputButton("fa-upload", "send-image-btn");

	/** Create the text input field */
	const inputElement = createElementWithClass("input", "form-control");
	inputElement.type = "text";
	inputElement.placeholder = "Enter text here...";

	/** Attach event listener to the send button */
	sendButton.addEventListener("click", (event) =>
		sendMessageHandler(event, inputElement)
	);

	/** Attach event listener to the upload button */
	uploadButton.addEventListener("click", uploadFileHandler);

	/** Append all elements to the parent container */
	parentContainer.appendChild(sendButton);
	parentContainer.appendChild(uploadButton);
	parentContainer.appendChild(inputElement);
}

/**
 * Creates and updates the chat information element based on the clicked item.
 *
 * @param {HTMLElement} clickedItem - The DOM element representing the clicked chat item.
 */
function createChatInfoElement(clickedItem) {
	/** Extract data from the clicked item */
	const imgSrc = clickedItem.querySelector("img")?.getAttribute("src");
	const name = clickedItem.querySelector(".name")?.textContent.trim();
	const status = clickedItem.querySelector(".status")?.textContent.trim();
	const statusElementId = clickedItem
		.querySelector(".status")
		?.getAttribute("id");

	/** Create the parent container */
	const colDiv = createElementWithClass("div", "col-lg-6");

	/** Create the avatar with an anchor element */
	const anchor = createElementWithAttribute("a", {
		href: "javascript:void(0);",
	});

	/** Create user's avatar image element */
	const avatarImg = createImageElement(
		imgSrc || "https://bootdey.com/img/Content/avatar/avatar1.png",
		"avatar"
	);

	/** Append image to anchor */
	anchor.appendChild(avatarImg);

	/** Create the chat information container */
	const chatAboutDivChild = createElementWithClass("div", "chat-about");

	/** Add user name */
	const nameElement = createTextElement("h6", name || "Unknown User", "m-b-0");

	/** Add status with optional ID */
	const statusElement = createTextElement("small", status || "offline");
	if (statusElementId) {
		const chatId = statusElementId.split("-")[0];
		statusElement.setAttribute("id", `${chatId}-about-status`);
	}

	/** Append name and status to the chat info container */
	chatAboutDivChild.appendChild(nameElement);
	chatAboutDivChild.appendChild(statusElement);

	/** Append anchor and chat info container to the parent */
	colDiv.appendChild(anchor);
	colDiv.appendChild(chatAboutDivChild);

	const chatAboutDiv = document.getElementById("chat-about");
	clearContainer(chatAboutDiv);
	chatAboutDiv.appendChild(colDiv);
}

/**
 * Handles the click event for the send message button.
 *
 * @param {Event} event - The click event object.
 * @param {HTMLElement} inputElement - The input element for message text.
 */
function sendMessageHandler(event, inputElement) {
	/** `Prevent any default behavior (e.g., form submission) */
	event.preventDefault();

	/** Get the value from the input field */
	const message = inputElement.value.trim();

	/** Emit the message if it is not empty */
	if (message) {
		socket.emit("send-message", { content: message });
		inputElement.value = ""; // Clear the input field
	}
}

/**
 * Handles the click event for the upload file button.
 */
function uploadFileHandler() {
	/** Create a file input element dynamically */
	const fileInput = createElementWithAttribute("input", {
		type: "file",
		accept: "image/*",
	});

	/** Listen for file selection */
	fileInput.addEventListener("change", async () => {
		const file = fileInput.files[0];

		if (file) {
			try {
				/** Upload the file to the API */
				const formData = new FormData();
				formData.append("image", file);

				/** Send update request */
				const response = await sendRequest(
					formData,
					"http://127.0.0.1:3000/message/image-uploader",
					"POST",
					accessToken,
					true
				);

				socket.emit("send-message", { content: response.data.imageURL });
			} catch (error) {
				console.error("Error uploading file:", error);
			}
		}
	});

	/** Trigger the file input click to open the file dialog */
	fileInput.click();
}
