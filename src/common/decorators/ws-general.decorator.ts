import {
	applyDecorators,
	UseFilters,
	UsePipes,
	ValidationPipe,
} from "@nestjs/common";
import {
	WebSocketExceptionFilter,
	WsValidationExceptionFilter,
} from "../Filters/ws-exception.filter";

/**
 * Custom decorator to combine commonly used decorators for socket gateways,
 * improving code readability and maintainability in gateway files.
 */
export function WsGeneralDecorators() {
	return applyDecorators(
		/** Websocket custom exception handler filter for general errors */
		UseFilters(new WebSocketExceptionFilter()),
		/** Register validation pip */
		UsePipes(new ValidationPipe({ transform: true, whitelist: true })),
		/** Websocket custom exception handler filter for validation errors */
		UseFilters(new WsValidationExceptionFilter())
	);
}
