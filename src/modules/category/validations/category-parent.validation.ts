import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';

@ValidatorConstraint({ name: 'CategoryIdValidation', async: true })
@Injectable()
export class CategoryIdValidation implements ValidatorConstraintInterface {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async validate(value: number): Promise<boolean> {
    if (!value) return true; // Allow null/undefined values
    
    const result = await this.categoryRepository._findOneById(value, {
      options: {
        withDeleted: false,
      },
    });

    return !!result;
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    return `${validationArguments.value} is not a valid Category Id!`;
  }
}

export function IsCategoryIdValid(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: CategoryIdValidation,
    });
  };
}
