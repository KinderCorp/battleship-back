import {
  BaseGameConfiguration,
  GameBoard,
  GameConfiguration,
  GameMode,
  GamePlayer,
  GameState,
} from '@interfaces/engine.interface';
import { DEFAULT_BOARD_GAME } from '@shared/game-instance.const';
import GameInstanceValidatorsService from '@engine/game-instance-validators.service';

export default class GameInstanceService {
  private readonly gameMode!: GameMode;
  private _gameState!: GameState;
  private players: GamePlayer[] = [];
  private board: GameBoard = DEFAULT_BOARD_GAME;

  public constructor(
    {
      gameMode = GameMode.OneVersusOne,
      state: status = GameState.waitingToStart,
    }: BaseGameConfiguration,
    private readonly gameInstanceValidatorsService: GameInstanceValidatorsService,
  ) {
    this.gameMode = gameMode;
    this._gameState = status;
  }

  public get gameState(): GameState {
    return this._gameState;
  }
  public set gameState(value: GameState) {
    this._gameState = value;
  }

  public endGame() {
    this.gameState = GameState.finished;
  }

  public isGameSettingsValid() {
    this.gameInstanceValidatorsService.validatePlayers(this.players);
  }

  public startGame() {
    this.gameState = GameState.playing;
  }

  public startPlacingBoats(
    gameConfiguration: Omit<GameConfiguration, 'boats'>,
  ) {
    // TASK Check game configuration

    this.gameInstanceValidatorsService.validatePlayers(
      gameConfiguration.players,
    );

    this.gameState = GameState.placingBoats;
  }
}
