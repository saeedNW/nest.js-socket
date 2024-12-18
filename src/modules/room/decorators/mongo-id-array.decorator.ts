import {
	registerDecorator,
	ValidationOptions,
	ValidationArguments,
} from "class-validator";
import { isMongoId } from "class-validator";

/**
 * Custom decorator to validate if an array contains only valid MongoDB ObjectIds.
 * @param validationOptions Optional validation options.
 */
export function MongoIdArray(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		/** Registering the custom validator with the class-validator */
		registerDecorator({
			/** Custom name for the validator */
			name: "MongoIdArray",
			/** Target class */
			target: object.constructor,
			/** Property to validate */
			propertyName: propertyName,
			/** Additional validation options (optional) */
			options: validationOptions,
			validator: {
				/**
				 * Validation function to check if the value is an array and contains only valid MongoDB ObjectIds.
				 * @param value The value to validate.
				 * @param args Validation arguments.
				 * @returns {boolean} True if the value is an array of valid MongoDB ObjectIds, otherwise false.
				 */
				validate(value: any, args: ValidationArguments): boolean {
					/** Check if value is an array and if each element is a valid MongoDB ObjectId */
					return Array.isArray(value) && value.every((id) => isMongoId(id));
				},

				/**
				 * Default error message when validation fails.
				 * @param args Validation arguments.
				 * @returns {string} The error message to be shown.
				 */
				defaultMessage(args: ValidationArguments): string {
					return `${args.property} must be an array of valid MongoDB ObjectIds`;
				},
			},
		});
	};
}
