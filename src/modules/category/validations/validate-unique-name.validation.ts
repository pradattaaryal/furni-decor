import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';

@ValidatorConstraint({ name: 'CategoryNameValidation', async: true })
@Injectable()
export class CategoryNameValidation implements ValidatorConstraintInterface {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async validate(value: string): Promise<boolean> {
    if (!value) return false;
    
    const result = await this.categoryRepository._findOne({
      options: {
        where: { name: value },
        withDeleted: false,
      },
    });

    return !result; // Return true if no category found (unique)
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    return `${validationArguments.value} is not a unique category name!`;
  }
}

export function IsCategoryNameUnique(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: CategoryNameValidation,
    });
  };
}
