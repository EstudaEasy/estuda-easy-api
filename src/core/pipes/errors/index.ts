import fileValidation, { ErrorCode as FileValidationErrorCodes } from './file-validation.errors';

export { FileValidationErrorCodes };

export const pipeErrors = {
  ...fileValidation
};
