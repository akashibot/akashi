/**
 * From: https://github.com/dbotsfun/izumo/blob/main/src/lib/utils/graphql/validators/isSnowflake.ts
 */

import {
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
	registerDecorator,
} from "class-validator";
import { ImageSource } from "../types";

/**
 * Decorator that validates if a value is a valid ImageSource.
 *
 * @param validationOptions - The validation options.
 * @returns A decorator function.
 */
export function IsImageSource(validationOptions?: ValidationOptions) {
	// biome-ignore lint/complexity/noBannedTypes: xd
	return (object: Object, propertyName: string) => {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: IsImageSourceConstraint,
		});
	};
}

@ValidatorConstraint({ name: "IsImageSource" })
export class IsImageSourceConstraint implements ValidatorConstraintInterface {
	// biome-ignore lint/suspicious/noExplicitAny: xd
	validate(value: any) {
		return value satisfies ImageSource;
	}
}
