import { ApiErrorCodes, ApiErrorMessages } from '@interfaces/error.interface';

export default class ApiError {
  public code!: string;
  public message?: unknown;
  public title!: string;

  /**
   * @param code {ApiErrorCodes} An error code useful for internalization purposes.
   * @param message {String} A short, developer-readable error.
   * @param title {String} A short, human-readable summary of the problem type.
   */
  public constructor({
    code,
    message,
    title,
  }: {
    code: ApiErrorCodes;
    message?: unknown;
    title: string;
  }) {
    this.code = code;
    this.message = message;
    this.title = title;
  }

  public static NotFoundEntity(entityName: string, message: unknown) {
    return new ApiError({
      code: ApiErrorCodes.NOT_FOUND_ENTITY,
      message,
      title: `${ApiErrorMessages.NOT_FOUND_ENTITY} : ${entityName}`,
    });
  }

  public static InsertionFailed(entityName: string, message: unknown) {
    return new ApiError({
      code: ApiErrorCodes.INSERTION_FAILED,
      message,
      title: `${ApiErrorMessages.INSERTION_FAILED} ${entityName}`,
    });
  }

  public static ValidationError(
    message: unknown,
    validationErrorMessage?: string,
  ): ApiError {
    return new ApiError({
      code: ApiErrorCodes.WRONG_PARAMS,
      message,
      title:
        validationErrorMessage ??
        'The parameters provided in the request are not valid.',
    });
  }
}
