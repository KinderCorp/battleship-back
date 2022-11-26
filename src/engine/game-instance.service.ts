import {
  BaseGameConfiguration,
  GameBoard,
  GameBoat,
  GameBoats,
  GameConfiguration,
  GameMode,
  GamePlayer,
  GameState,
  PlayerBoards,
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
      state = GameState.waitingToStart,
    }: BaseGameConfiguration,
    private readonly gameInstanceValidatorsService: GameInstanceValidatorsService,
  ) {
    this.gameMode = gameMode;
    this._gameState = state;
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

  public generatePlayerBoards(boats: GameBoats) {
    const playerBoards: PlayerBoards = {};

    Object.entries(boats).forEach(
      ([playerName, boats]: [string, GameBoat[]]) => {
        const arrayOfBoatEmplacement = boats
          .map((boat) => boat.emplacement)
          .flat(1);

        playerBoards[playerName] = arrayOfBoatEmplacement;
      },
    );

    return playerBoards;
  }

  public startGame(gameConfiguration: GameConfiguration) {
    // TASK Create dynamically gameBoard with board dimensions given in gameConfiguration
    const boatsOfPlayers = Object.values(gameConfiguration.boats);

    this.gameInstanceValidatorsService.validateBoatsOfPlayers(
      DEFAULT_BOARD_GAME,
      boatsOfPlayers,
    );

    this.gameState = GameState.playing;
  }

  public startPlacingBoats(
    gameConfiguration: Omit<GameConfiguration, 'boats'>,
  ) {
    this.gameInstanceValidatorsService.validateBoardDimensions(
      gameConfiguration.boardDimensions,
    );

    this.gameInstanceValidatorsService.validatePlayers(
      gameConfiguration.players,
    );

    this.gameState = GameState.placingBoats;
  }
}
