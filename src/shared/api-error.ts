import { ApiErrorCodes } from '@interfaces/error.interface';

export default class ApiError {
  public code!: string;
  public message!: string;

  /**
   * @param code {ApiErrorCodes} An error code useful for internalization purposes.
   * @param message {String} A short, human-readable summary of the problem type.
   */
  public constructor({
    code,
    message,
  }: {
    code: ApiErrorCodes;
    message: string;
  }) {
    this.code = code;
    this.message = message;
  }

  public static InsertionFailed(entityName: string) {
    return new ApiError({
      code: ApiErrorCodes.insertionFailed,
      message: `Fail to insert ${entityName}`,
    });
  }

  public static ValidationError(validationErrorMessage?: string): ApiError {
    return new ApiError({
      code: ApiErrorCodes.wrongParams,
      message:
        validationErrorMessage ??
        'The parameters provided in the request are not valid.',
    });
  }
}
