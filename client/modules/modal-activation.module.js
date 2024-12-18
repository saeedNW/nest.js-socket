import {
	createNewChatUsersList,
	createNewGroupUsersList,
} from "./users.module.js";

export function modalActivation(accessToken) {
	document.querySelector("#user-setting").addEventListener("click", () => {
		$("#userSettingModal").modal("show");
	});
	document.querySelector("#new-group-chat").addEventListener("click", () => {
		createNewGroupUsersList(accessToken);
		$("#newGroupModal").modal("show");
	});
	document.querySelector("#new-private-chat").addEventListener("click", () => {
		createNewChatUsersList(accessToken);
		$("#newPrivateModal").modal("show");
	});
}
