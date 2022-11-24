import { ErrorCodes } from '@interfaces/error.interface';

export default class ApiError {
  public code!: string;
  public message!: string;

  /**
   * @param code {ErrorCodes} An error code useful for internalization purposes.
   * @param message {String} A short, human-readable summary of the problem type.
   */
  public constructor({ code, message }: { code: ErrorCodes; message: string }) {
    this.code = code;
    this.message = message;
  }

  public static ValidationError(validationErrorMessage?: string): ApiError {
    return new ApiError({
      code: ErrorCodes.WRONG_PARAMS,
      message:
        validationErrorMessage ??
        'The parameters provided in the request are not valid.',
    });
  }
}
