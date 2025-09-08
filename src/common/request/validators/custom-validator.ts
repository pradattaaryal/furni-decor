import { applyDecorators } from '@nestjs/common';
import { Transform, TransformFnParams } from 'class-transformer';
import {
  ArrayNotEmpty,
  ArrayUnique,
  ArrayUniqueIdentifier,
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsNumberOptions,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  isISO8601,
  registerDecorator,
} from 'class-validator';
import moment from 'moment';
// import { EVENT_SOURCE } from 'src/modules/events-register/constants/events-register.constant';
// import { QUESTIONS_TYPES_ENUM } from 'src/modules/questions/constants/questions.constants';
// import { EventQuestion } from 'src/modules/events-questions/dtos/events-questions.create.dto';

/**
 * Checks if given value is not empty (!== '', !== null, !== undefined).
 */
export const CustomIsNotEmpty = (
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return applyDecorators(IsNotEmpty(validationOptions));
};

/**
 * Checks if a given value is a real string.
 */
export const CustomIsString = (
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return applyDecorators(IsString(validationOptions));
};

/**
 * Checks if the string is a url.
 * If given value is not a string, then it returns false.
 */
export const CustomIsUrl = (
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return applyDecorators(IsUrl(undefined, validationOptions));
};

/**
 * Checks if a given value is a real email.
 */
export const CustomIsEmail = (
  options?: validator.IsEmailOptions,
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return applyDecorators(IsEmail(options, validationOptions));
};

/**
 * Checks if the string is a valid ISO 8601 date.
 * If given value is not a string, then it returns false.
 * Use the option strict = true for additional checks for a valid date, e.g. invalidates dates like 2019-02-29.
 */
export const CustomIsISO9601DateString = (
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return applyDecorators(IsISO8601(undefined, validationOptions));
};

export const CustomTransformStringToDate = (): PropertyDecorator => {
  return applyDecorators(
    Transform((params: TransformFnParams) => {
      if (isISO8601(params.value)) {
        return moment(params.value).toDate();
      }
      return null;
    }),
  );
};

/**
 * Checks if a value is a number.
 */
export const CustomIsNumber = (
  options?: IsNumberOptions,
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return applyDecorators(IsNumber(options, validationOptions));
};

/**
 * Objects / object arrays marked with this decorator will also be validated.
 */
export const CustomValidateNested = (
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return applyDecorators(ValidateNested(validationOptions));
};

/**
 * Checks if a given value is an array
 */
export const CustomIsArray = (
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return applyDecorators(IsArray(validationOptions));
};

/**
 * Checks if given array is not empty.
 * If null or undefined is given then this function returns false.
 */
export const CustomArrayNotEmpty = (
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return applyDecorators(ArrayNotEmpty(validationOptions));
};

/**
 * Checks if the string's length is not less than given number. Note: this function takes into account surrogate pairs.
 * If given value is not a string, then it returns false.
 */
export const CustomMinLength = (
  min: number,
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return applyDecorators(MinLength(min, validationOptions));
};

/**
 * Checks if the string's length is not more than given number. Note: this function takes into account surrogate pairs.
 * If given value is not a string, then it returns false.
 */
export const CustomMaxLength = (
  max: number,
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return applyDecorators(MaxLength(max, validationOptions));
};

/**
 * Checks if value is missing and if so, ignores all validators.
 */
export const CustomIsOptional = (
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return applyDecorators(IsOptional(validationOptions));
};

/**
 * Checks if a value is a boolean.
 */
export const CustomIsBoolean = (
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return applyDecorators(IsBoolean(validationOptions));
};

/**
 * Checks if the value is valid Object.
 * Returns false if the value is not an object.
 */
export const CustomIsObject = (
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return applyDecorators(IsObject(validationOptions));
};

/**
 * Checks if a given value is the member of the provided enum.
 */
export const CustomIsEnum = (
  entity: object,
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return applyDecorators(IsEnum(entity, validationOptions));
};

/**
 * Checks if string matches the pattern. Either matches('foo', /foo/i)
 * If given value is not a string, then it returns false.
 */
export const CustomMatches = (
  pattern: RegExp,
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return applyDecorators(Matches(pattern, validationOptions));
};

/**
 * Checks if the number is not less than given number. Note: this function takes into account surrogate pairs.
 * If given value is not a number, then it returns false.
 */
export const CustomMin = (
  min: number,
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return applyDecorators(Min(min, validationOptions));
};

/**
 * Checks if the number is not more than given number. Note: this function takes into account surrogate pairs.
 * If given value is not a number, then it returns false.
 */
export const CustomMax = (
  min: number,
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return applyDecorators(Max(min, validationOptions));
};

/**
 * Checks if all array's values are unique. Comparison for objects is reference-based.
 * If null or undefined is given then this function returns false.
 */
export const CustomArrayUnique = <T>(
  identifierOrOptions?: ArrayUniqueIdentifier<T> | ValidationOptions,
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return applyDecorators(
    ArrayUnique<T>(identifierOrOptions, validationOptions),
  );
};

/**
 * Checks if the date is in past. Validating the date make sure it is in past not the future date.
 * If it is in past it will return true else false.
 */
export const CustomIsPastDate = (
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isPastDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const incomingDate = new Date(value);
          const presentDate = new Date();
          return incomingDate < presentDate;
        },
      },
    });
  };
};

/**
 * Checks if the date is in future. Validating the date make sure it is in future not the past date.
 * If it is in future it will return true else false.
 */
export const CustomIsFutureDate = (
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isPastDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const incomingDate = new Date(value);
          const presentDate = new Date();
          return incomingDate > presentDate;
        },
      },
    });
  };
};

export const CustomPhotoPrimaryCheck = (
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'photoPrimaryCheck',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        ...validationOptions,
        message: `There should be one primary photo`,
      },
      validator: {
        validate(value?: any[]) {
          if (value && Array.isArray(value) && value.length > 0) {
            let primaryFound = false;
            for (const item of value) {
              if (item && item.isFeatured) {
                if (primaryFound) {
                  return false;
                }
                primaryFound = true;
              }
            }
            if (!primaryFound) {
              return false;
            }
          }
          return true;
        },
      },
    });
  };
};

/**
 *
 * Convert string to number for query
 */
export const CustomTransformStringToNumber = (): PropertyDecorator => {
  return applyDecorators(
    Transform(({ value }) => {
      if (
        !isNaN(Number(value)) &&
        value !== undefined &&
        value !== null &&
        value !== ''
      ) {
        return Number(value);
      }
      return null;
    }),
  );
};

/**
 *
 * Convert string to boolean for query
 */
export const CustomTransformStringToBoolean = (): PropertyDecorator => {
  return applyDecorators(
    Transform(({ value }) => {
      if (value === 'true' || value === true) {
        return true;
      }
      if (value === 'false' || value === false) {
        return false;
      }
      return undefined;
    }),
  );
};

/**
 *
 * Convert string to number array for query
 */
export const CustomTransformToListOfNumber = (): PropertyDecorator => {
  return applyDecorators(
    Transform(({ value }) => {
      return value
        .split(',')
        .map((i: string) => Number(i === '' ? NaN : i))
        .filter((i: string | null | any) => !isNaN(i))
        .filter(
          (i: number, index: number, array: number[]) =>
            array.indexOf(i) === index,
        );
    }),
  );
};

/**
 * Trim String
 */
export const CustomTransformStringTrim = (): PropertyDecorator => {
  return applyDecorators(
    Transform(({ value }) => {
      return value ? value.replace(/\s+/g, ' ').trim() : value;
    }),
  );
};

/**
 * check weather value is null or undefined
 * @param value any
 * @returns boolean
 */
export const isFalsy = (value: any): boolean => {
  if (value === null || value === undefined) {
    return true;
  }
  return false;
};

//Check if string is number of not
// export const CustomIsNan = (
//   validationOptions?: ValidationOptions,
// ): PropertyDecorator => {
//   return function (object: object, propertyName: string) {
//     registerDecorator({
//       name: 'isStringNumber',
//       target: object.constructor,
//       propertyName: propertyName,
//       options: validationOptions,
//       validator: {
//         validate(value: any) {
//           console.log('This is Value: ', value);
//           return !isNaN(value);
//         },
//       },
//     });
//   };
// };

/**
 * Custom validation decorator to check if maxPax is greater than minPax.
 * @param property - The related property name to compare against (minPax).
 * @param validationOptions - Optional validation options.
 * @returns Function - A function that registers the custom decorator.
 */
export function IsMaxGreaterThanMin(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          //This is for update since one comparing data will can be partial
          if (relatedValue == null) {
            return true;
          }
          return (
            typeof value === 'number' &&
            typeof relatedValue === 'number' &&
            value >= relatedValue
          );
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${args.property} must be greater than ${relatedPropertyName}`;
        },
      },
    });
  };
}

@ValidatorConstraint({ name: 'atLeastOne', async: false })
class AtLeastOneConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [property1, property2] = args.constraints;
    const object = args.object as any;
    return object[property1] !== undefined || object[property2] !== undefined;
  }

  defaultMessage(args: ValidationArguments) {
    const [property1, property2] = args.constraints;
    return `Either ${property1} or ${property2} must be provided.`;
  }
}

export function AtLeastOne(
  property1: string,
  property2: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property1, property2],
      validator: AtLeastOneConstraint,
    });
  };
}

/**
 * Custom constraint class that checks if a string contains special characters.
 */
@ValidatorConstraint({ async: false })
export class NoSpecialCharactersConstraint
  implements ValidatorConstraintInterface
{
  /**
   * Validates if the text contains only alphanumeric characters.
   * @param text - The string to validate.
   * @param args - Additional validation arguments.
   * @returns True if the text does not contain special characters, false otherwise.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(text: string, args: ValidationArguments): boolean {
    // Regex to check for special characters
    const regex = /^[a-zA-Z0-9]*$/;
    return regex.test(text);
  }

  /**
   * Default message to return if validation fails.
   * @param args - Additional validation arguments.
   * @returns The default error message.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(args: ValidationArguments): string {
    return 'Text ($value) contains special characters which are not allowed!';
  }
}

/**
 * Custom decorator to check if a string contains special characters.
 * @param validationOptions - Additional validation options.
 * @returns A function to register the custom validator.
 */
export function CustomNoSpecialCharacters(
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: NoSpecialCharactersConstraint,
    });
  };
}

export function DefaultValue(defaultValue: any) {
  return Transform(({ value }) =>
    value === undefined || value === null ? defaultValue : value,
  );
}

export function CustomIsNotEnum(
  excludedEnum: object,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'customIsNotEnum',
      target: object.constructor,
      propertyName,
      constraints: [excludedEnum],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [enumObject] = args.constraints;
          return !Object.values(enumObject).includes(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must not be one of the values: ${Object.values(args.constraints[0]).join(', ')}`;
        },
      },
    });
  };
}

export const IsCountryIdPresent = (
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsCountryIdPresent',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value?: number, args?: any): boolean {
          const object = args.object as any;
          const countryId = object.countryId;

          // If stateId is provided and countryId is missing, return false to trigger validation error
          if (value && !countryId) {
            return false;
          }
          return true;
        },
        defaultMessage(args?: any): string {
          return 'If you want to add a state, you must provide a countryId.';
        },
      },
    });
  };
};

//Checks if start date is smaller than end date
export function CustomIsStartBeforeEnd(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'CustomIsStartBeforeEnd',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const object = args.object as { startDate: Date; endDate: Date };
          const { startDate, endDate } = object;

          if (startDate && endDate) {
            return startDate < endDate;
          }

          return false;
        },
        defaultMessage(args: ValidationArguments) {
          return 'Start date must be earlier than end date.';
        },
      },
    });
  };
}

export function CustomIsStartBeforeBookingCloseAt(
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'CustomIsStartBeforeBookingCloseAt',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const object = args.object as {
            startDate: Date;
            bookingCloseAt: Date;
          };
          const { startDate, bookingCloseAt } = object;

          if (startDate && bookingCloseAt) {
            return startDate > bookingCloseAt;
          }

          return false;
        },
        defaultMessage(args: ValidationArguments) {
          return 'Booking must be closed before event starts';
        },
      },
    });
  };
}

// Custom decorator to validate email
export function CustomEmailValidator(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'CustomEmailValidator',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          // Check if the value is a string and matches the basic email pattern
          if (typeof value !== 'string') {
            return false;
          }

          // Regex for basic email structure (username, domain, and TLD)
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

          // Check if the email matches the regex
          if (!emailRegex.test(value)) {
            return false;
          }

          // Split the email into username and domain parts
          const [username, domain] = value.split('@');
          const domainParts = domain.split('.');

          // Ensure that domain has only one TLD part (e.g., gmail.com and not gmail.com.com)
          // Top level domain (TLD)
          if (domainParts.length > 3 || domainParts[1] === domainParts[2]) {
            return false;
          }

          return true; // Valid email
        },
        defaultMessage(args: ValidationArguments) {
          return 'Invalid email address';
        },
      },
    });
  };
}

export function IsAtLeastFeaturedImage(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsFeaturedValid',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any[], args: ValidationArguments) {
          if (!value || !Array.isArray(value)) return false;

          const featuredItems = value.filter(
            (item) => item.isFeatured === true,
          );

          // There should be exactly one item with isFeatured = true, and at least one should be true
          return featuredItems.length === 1 && value.length > 0;
        },
        defaultMessage(args: ValidationArguments) {
          return 'There should be one images with feature true and only one.';
        },
      },
    });
  };
}

export const IsStateAndCityIdPresent = (
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'CountryIdIsPresent',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value?: number, args?: any): boolean {
          const object = args.object as any;
          const stateId = object.stateId;
          const cityId = object.cityId;

          // If countryId is provided and stateId + cityId is missing, return false to trigger validation error
          if (value && !(stateId && cityId)) {
            return false;
          }
          return true;
        },
        defaultMessage(args?: any): string {
          return 'If you want to update country, you must provide new stateId and cityId.';
        },
      },
    });
  };
};

export const IsCityIdPresent = (
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'StateIdIsPresent',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value?: number, args?: any): boolean {
          const object = args.object as any;
          const cityId = object.cityId;

          // If countryId is provided and stateId + cityId is missing, return false to trigger validation error
          if (value && !cityId) {
            return false;
          }
          return true;
        },
        defaultMessage(args?: any): string {
          return 'If you want to update state, you must provide a cityId.';
        },
      },
    });
  };
};

 
 