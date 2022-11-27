import * as radash from 'radash';

import {
  BaseGameConfiguration,
  Cell,
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

// TASK Turn to private methods that can be private
export default class GameInstanceService {
  private readonly gameMode!: GameMode;
  private _gameState!: GameState;
  private players: GamePlayer[] = [];
  private board: GameBoard = DEFAULT_BOARD_GAME;
  private masterPlayerBoards!: PlayerBoards;
  private visiblePlayerBoards!: PlayerBoards;
  private gameConfiguration!: GameConfiguration;
  private boatsOfPlayers: typeof this.gameConfiguration.boats;

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

  public doesCellContainABoat(targetedPlayer: string, targetedCell: Cell) {
    this.gameInstanceValidatorsService.validateCellHasNotBeenHit(
      this.visiblePlayerBoards[targetedPlayer],
      targetedCell,
    );

    this.visiblePlayerBoards[targetedPlayer].push(targetedCell);

    const [xTargetedCell, yTargetedCell] = targetedCell;

    const doesCellContainABoat = this.masterPlayerBoards[targetedPlayer].some(
      ([xMasterCell, yMasterCell]) =>
        xMasterCell === xTargetedCell && yMasterCell === yTargetedCell,
    );

    if (doesCellContainABoat) {
      this.updatePlayerBoatObject(targetedPlayer, targetedCell);
    }

    return doesCellContainABoat;
  }

  public endGame() {
    this.gameState = GameState.finished;
  }

  private findStillInGamePlayerBoats(playerBoats: GameBoat[]) {
    return playerBoats.filter((boat) => !boat.isSunk);
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

  public startGame(gameConfiguration: GameConfiguration) {
    // TASK Create dynamically gameBoard with board dimensions given in gameConfiguration
    const boatsOfPlayers = Object.values(gameConfiguration.boats);

    this.gameInstanceValidatorsService.validateBoatsOfPlayers(
      this.board,
      boatsOfPlayers,
    );
    this.masterPlayerBoards = this.generateMasterPlayerBoards(
      gameConfiguration.boats,
    );
    this.visiblePlayerBoards = this.generateVisiblePlayerBoards(this.players);

    this.gameConfiguration = gameConfiguration;
    this.boatsOfPlayers = gameConfiguration.boats;
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

    this.players = gameConfiguration.players;

    this.gameState = GameState.placingBoats;
  }

  public updatePlayerBoatObject(
    targetedPlayer: keyof typeof this.boatsOfPlayers,
    targetedCell: Cell,
  ) {
    const [xTargetedCell, yTargetedCell] = targetedCell;

    const playerBoats = this.boatsOfPlayers[targetedPlayer];

    const stillInGameBoats = this.findStillInGamePlayerBoats(playerBoats);

    const targetedBoat = stillInGameBoats.find((boat) =>
      boat.emplacement.some(
        ([xMasterCell, yMasterCell]) =>
          xMasterCell === xTargetedCell && yMasterCell === yTargetedCell,
      ),
    );

    this.gameInstanceValidatorsService.validateCellHasNotBeenHit(
      targetedBoat.hit,
      targetedCell,
    );

    targetedBoat.hit.push(targetedCell);

    if (radash.isEqual(targetedBoat.hit, targetedBoat.emplacement)) {
      targetedBoat.isSunk = true;
    }
  }
}
