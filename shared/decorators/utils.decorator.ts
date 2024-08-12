import { buildMessage, registerDecorator, ValidationOptions } from "class-validator";
import { isValidObjectId } from "mongoose";

export function isObjectId(value: unknown) {
    return typeof value === "string" && isValidObjectId(value);
}

export function IsObjectId(validationOptions?: ValidationOptions) {
    return function(object: Object, propertyName: string) {
        registerDecorator({
			name: "IsObjectId",
			target: object.constructor,
			propertyName,
			options: validationOptions,
			validator: {
				validate(value: any): boolean {
					return isObjectId(value);
				},
				defaultMessage: buildMessage(
					(eachPrefix) => `${eachPrefix}$property is invalid`,
					validationOptions,
				),
			},
		});
    }
}