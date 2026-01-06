import { ValidationArguments } from 'class-validator';

import { IsPasswordConstraint } from '../is-password.validator';

describe('Middlewares -> Validators -> Validate Password', () => {
  const passwordValidator = new IsPasswordConstraint();
  const args = { constraints: [8, 20] } as ValidationArguments;

  it('should return true - is valid password', () => {
    const isValid = passwordValidator.validate('StrongPassw0rd!', args);
    expect(isValid).toStrictEqual(true);
  });

  describe('should return false', () => {
    it('password does not have uppercase letter', () => {
      const isValid = passwordValidator.validate('strongpassword1!', args);
      expect(isValid).toStrictEqual(false);
    });

    it('password does not have lowercase letter', () => {
      const isValid = passwordValidator.validate('STRONGPASSWORD1!', args);
      expect(isValid).toStrictEqual(false);
    });

    it('password does not have number', () => {
      const isValid = passwordValidator.validate('StrongPassword!', args);
      expect(isValid).toStrictEqual(false);
    });

    it('password does not have special character', () => {
      const isValid = passwordValidator.validate('StrongPassword1', args);
      expect(isValid).toStrictEqual(false);
    });

    it('password is too short', () => {
      const isValid = passwordValidator.validate('Short1!', args);
      expect(isValid).toStrictEqual(false);
    });

    it('password is too long', () => {
      const isValid = passwordValidator.validate('ThisIsAVeryLongPassword123!', args);
      expect(isValid).toStrictEqual(false);
    });
  });
});
