import {
	Catch,
	ArgumentsHost,
	WsExceptionFilter,
	BadRequestException,
} from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { Socket } from "socket.io";

/**
 * WebSocketExceptionFilter
 *
 * This filter handles exceptions of type `WsException` in WebSocket contexts.
 * When an exception is caught, it emits an error event back to the client
 * with a structured error response.
 */
@Catch(WsException)
export class WebSocketExceptionFilter implements WsExceptionFilter {
	/**
	 * Catches `WsException` and sends a structured error response to the client.
	 *
	 * @param {WsException} exception - The WebSocket exception being caught.
	 * @param {ArgumentsHost} host - The arguments host containing execution context.
	 */
	catch(exception: WsException, host: ArgumentsHost): void {
		/** Retrieve the WebSocket client instance */
		const client = host.switchToWs().getClient<Socket>();

		/** Extract the error details from the exception */
		const error = exception.getError();

		/** Determine the error message: prioritize string messages or fallback to a default message */
		const message =
			typeof error === "string"
				? error
				: (error as { message?: string })?.message || "Unknown socket error";

		/** Extract the status code or default to 500 */
		const statusCode = (error as { statusCode?: number })?.statusCode || 500;

		/** Emit the structured error response to the client */
		client.emit("error", {
			statusCode,
			success: false,
			message,
			timestamp: new Date().toISOString(),
		});

		client.disconnect(true);
	}
}

/**
 * Custom WebSocket Exception Filter to handle validation errors.
 * It catches exceptions thrown by WebSocket event handlers and sends a structured error response
 * back to the client via the `error` event.
 */
@Catch(BadRequestException)
export class WsValidationExceptionFilter implements WsExceptionFilter {
	/**
	 * Handles the exception and emits an error message to the WebSocket client.
	 *
	 * @param exception The exception thrown (e.g., WsException, BadRequestException).
	 * @param host Provides access to the WebSocket client and other contextual information.
	 */
	catch(exception: any, host: ArgumentsHost) {
		/** Retrieve the WebSocket client (Socket.IO client in this case) */
		const client: Socket = host.switchToWs().getClient();

		/** Extract message from the exception */
		const message = exception.getResponse
			? (exception.getResponse() as { message?: [string] })?.message ||
				"Validation error"
			: exception?.message || "Validation error";

		/** Emit an 'error' event to the client with the structured error message and details */
		client.emit("error", {
			statusCode: 422,
			success: false,
			message,
			timestamp: new Date().toISOString(),
		});
	}
}
