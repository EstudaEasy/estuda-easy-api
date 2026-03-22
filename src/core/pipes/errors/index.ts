import fileValidation, {
  ErrorCode as FileValidationErrorCodes,
  ErrorParams as FileValidationErrorParams
} from './file-validation.errors';

export { FileValidationErrorCodes };

export type PipeErrorsParams = FileValidationErrorParams;

export const pipeErrors = {
  ...fileValidation
};
