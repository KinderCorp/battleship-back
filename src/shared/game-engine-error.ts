import { GameEngineErrorCodes } from '@interfaces/error.interface';

export default class GameEngineError extends Error {
  public code!: GameEngineErrorCodes;
  public message!: string;

  /**
   * @param code {GameEngineErrorCodes} An error code useful for internalization purposes.
   * @param message {String} A short, human-readable summary of the problem type.
   */
  public constructor({
    code,
    message,
  }: {
    code: GameEngineErrorCodes;
    message: string;
  }) {
    super(message);

    this.code = code;
    this.message = message;
  }
}
