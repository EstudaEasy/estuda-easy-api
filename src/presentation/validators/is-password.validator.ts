import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';

const name = 'isPassword';

@ValidatorConstraint({ name, async: false })
export class IsPasswordConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments): boolean {
    if (!value) return false;

    const [min, max] = args.constraints;
    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const hasLength = value.length >= min && value.length <= max;

    return hasUppercase && hasLowercase && hasNumber && hasSpecialChar && hasLength;
  }

  defaultMessage(args: ValidationArguments): string {
    const [min, max] = args.constraints;
    return `${args.property} must be between ${min} and ${max} characters and include at least one uppercase letter, one lowercase letter, one number, and one special character`;
  }
}

export function IsPassword(min: number = 8, max: number = 20, validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name,
      propertyName,
      target: object.constructor,
      constraints: [min, max],
      options: validationOptions,
      validator: IsPasswordConstraint
    });
  };
}
