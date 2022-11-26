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
import {
  GameEngineErrorCodes,
  GameEngineErrorMessages,
} from '@interfaces/error.interface';
import { DEFAULT_BOARD_GAME } from '@shared/game-instance.const';
import GameEngineError from '@shared/game-engine-error';
import GameInstanceValidatorsService from '@engine/game-instance-validators.service';

export default class GameInstanceService {
  private readonly gameMode!: GameMode;
  private _gameState!: GameState;
  private players: GamePlayer[] = [];
  private board: GameBoard = DEFAULT_BOARD_GAME;
  private masterPlayerBoards!: PlayerBoards;
  private visiblePlayerBoards!: PlayerBoards;
  private gameConfiguration!: GameConfiguration;
  private playerBoats: typeof this.gameConfiguration.boats;

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

  public doesCellContainABoat(
    targetedPlayer: string,
    targetedCell: [number, number],
  ) {
    if (this.hasCellAlreadyBeenHit(targetedPlayer, targetedCell)) {
      throw new GameEngineError({
        code: GameEngineErrorCodes.cellAlreadyHit,
        message: GameEngineErrorMessages.cellAlreadyHit,
      });
    }

    this.visiblePlayerBoards[targetedPlayer].push(targetedCell);

    const [xTargetedCell, yTargetedCell] = targetedCell;

    const doesCellContainABoat = this.masterPlayerBoards[targetedPlayer].some(
      ([xMasterCell, yMasterCell]) =>
        xMasterCell === xTargetedCell && yMasterCell === yTargetedCell,
    );

    if (doesCellContainABoat) {
      // TASK Update boat object
    }

    return doesCellContainABoat;
  }

  public endGame() {
    this.gameState = GameState.finished;
  }

  public generateMasterPlayerBoards(boats: GameBoats) {
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

  public generateVisiblePlayerBoards(players: GamePlayer[]) {
    const playerBoards: PlayerBoards = {};

    players.forEach((player, index) => {
      const playerName = `${player.pseudo}${index}`;

      playerBoards[playerName] = [];
    });

    return playerBoards;
  }

  public hasCellAlreadyBeenHit(
    targetedPlayer: string,
    [xTargetedCell, yTargetedCell]: [number, number],
  ) {
    return this.visiblePlayerBoards[targetedPlayer].some(
      ([xVisibleCell, yVisibleCell]) =>
        xVisibleCell === xTargetedCell && yVisibleCell === yTargetedCell,
    );
  }

  public startGame(gameConfiguration: GameConfiguration) {
    // TASK Create dynamically gameBoard with board dimensions given in gameConfiguration
    const boatsOfPlayers = Object.values(gameConfiguration.boats);

    this.gameInstanceValidatorsService.validateBoatsOfPlayers(
      DEFAULT_BOARD_GAME,
      boatsOfPlayers,
    );

    this.masterPlayerBoards = this.generateMasterPlayerBoards(
      gameConfiguration.boats,
    );
    this.visiblePlayerBoards = this.generateVisiblePlayerBoards(
      gameConfiguration.players,
    );

    this.gameConfiguration = gameConfiguration;
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

  // TASK Find and update the boat object after it has been hit
  // TASK If hit array is deep equal to the emplacement array, then turn isSunk to true
  // public updatePlayerBoatObject() {}
}
