import { HttpException, HttpStatus } from '@nestjs/common';

import { ErrorCodes } from '@interfaces/error.interface';

export default class ApiError extends HttpException {
  public code!: string;
  public detail?: string | object;
  public instance?: string;
  public title!: string;
  public type?: string;

  /**
   * Implementation of API Error RFC 7807
   * https://datatracker.ietf.org/doc/html/rfc7807#section-3.1
   * https://simonplend.com/send-awesome-structured-error-responses-with-express/
   * @param detail {String| Object | undefined} A human-readable explanation specific to this occurrence of the problem.
   * @param instance {String|undefined} An URI reference that identifies the specific occurrence of the problem.
   * @param status {Number} The HTTP status code.
   * @param title {String} A short, human-readable summary of the problem type.
   * @param code {ErrorCodes} An error code useful for internalization purposes.
   */
  public constructor({
    code,
    detail,
    instance,
    status = HttpStatus.BAD_REQUEST,
    title = 'An error occurred.',
  }: Partial<{
    code: ErrorCodes;
    detail: string | object;
    instance: string;
    status: HttpStatus;
    title: string;
  }>) {
    super({ code, detail, instance, title }, status);

    this.code = code;
    this.detail = detail;
    this.instance = instance;
    this.title = title;
  }

  public static ValidationError(validationErrorMessage: string): ApiError {
    return new ApiError({
      code: ErrorCodes.WRONG_PARAMS,
      detail: validationErrorMessage,
      title: 'The parameters provided in the request are not valid.',
    });
  }
}
