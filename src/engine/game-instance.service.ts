import * as radash from 'radash';

import {
  BaseGameConfiguration,
  Cell,
  GameArsenal,
  GameBoard,
  GameBoat,
  GameBoats,
  GameConfiguration,
  GameMode,
  GamePlayer,
  GameState,
  GameWeapon,
  PlayerBoards,
  Turn,
} from '@interfaces/engine.interface';
import {
  GameEngineErrorCodes,
  GameEngineErrorMessages,
} from '@interfaces/error.interface';
import { DEFAULT_BOARD_GAME } from '@shared/game-instance.const';
import GameEngineError from '@shared/game-engine-error';
import GameInstanceValidatorsService from '@engine/game-instance-validators.service';

export default class GameInstanceService {
  private _gameState!: GameState;
  private board: GameBoard = DEFAULT_BOARD_GAME;
  private gameArsenal: GameArsenal;
  private gameConfiguration!: GameConfiguration;
  private masterPlayerBoards!: PlayerBoards;
  private players: GamePlayer[] = [];
  private readonly gameMode!: GameMode;
  private visiblePlayerBoards!: PlayerBoards;
  private turn!: Turn;
  private temporaryPlayerPseudos!: string[];

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

  // TASK Use this function in the socket
  private countDownAction(turn: Turn) {
    this.gameInstanceValidatorsService.validateActionCanBeExecuted(turn);

    turn.actionRemaining -= 1;

    if (turn.actionRemaining < 1) {
      this.endTurn(turn);
    }
  }

  private doesCellContainABoat(
    targetedPlayer: keyof typeof this.gameConfiguration.boats,
    targetedCell: Cell,
  ) {
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

  private endTurn(turn: Turn) {
    turn.isTurnOf = turn.nextPlayer;
    turn.nextPlayer = this.getNextPlayer(
      turn.isTurnOf,
      this.temporaryPlayerPseudos,
    );
    turn.actionRemaining = 1;
  }

  private findStillInGamePlayerBoats(playerBoats: GameBoat[]) {
    return playerBoats.filter((boat) => !boat.isSunk);
  }

  private generateGameArsenal(gameConfiguration: GameConfiguration) {
    const gameArsenal: GameArsenal = {};

    Object.entries(gameConfiguration.weapons).forEach(
      ([playerName, weapons]) => {
        weapons.forEach((weapon) => {
          if (!gameArsenal[playerName]) {
            gameArsenal[playerName] = [];
          }

          gameArsenal[playerName].push({
            ammunitionRemaining: weapon.maxAmmunition,
            damageArea: weapon.damageArea,
            name: weapon.name,
          });
        });
      },
    );

    return gameArsenal;
  }

  private generateMasterPlayerBoards(boats: GameBoats) {
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

  private generateTemporaryPlayerPseudos(players: GamePlayer[]) {
    return players.map(
      (player, index) => `${player.pseudo.toLowerCase()}${index}`,
    );
  }

  private generateTurns(
    temporaryPlayerPseudos: typeof this.temporaryPlayerPseudos,
  ): Turn {
    const firstPlayer = radash.draw(temporaryPlayerPseudos);

    return {
      actionRemaining: 1,
      isTurnOf: firstPlayer,
      nextPlayer: this.getNextPlayer(firstPlayer, temporaryPlayerPseudos),
    };
  }

  private generateVisiblePlayerBoards(temporaryPlayerPseudos: string[]) {
    const playerBoards: PlayerBoards = {};

    temporaryPlayerPseudos.forEach((playerPseudo) => {
      playerBoards[playerPseudo] = [];
    });

    return playerBoards;
  }

  private getNextPlayer(
    actualTemporaryPlayerPseudo: string,
    temporaryPlayerPseudos: typeof this.temporaryPlayerPseudos,
  ) {
    const nextPlayerIndex =
      temporaryPlayerPseudos.indexOf(actualTemporaryPlayerPseudo) + 1;

    return temporaryPlayerPseudos[nextPlayerIndex] ?? temporaryPlayerPseudos[0];
  }

  private getShotCells(weapon: GameWeapon, originCell: Cell) {
    const [xOriginCell, yOriginCell] = originCell;
    const shotCells: Cell[] = [];

    Object.values(weapon.damageArea).forEach(([xShotCell, yShotCell]) => {
      if (xShotCell === undefined && yShotCell === undefined) {
        return;
      }

      shotCells.push([xOriginCell + xShotCell, yOriginCell + yShotCell]);
    });

    return shotCells;
  }

  /**
   * Make a shot with the specified weapon
   * @param targetedPlayer
   * @param weapon
   * @param originCell The cell where the player touch
   */
  public shoot(
    targetedPlayer: keyof typeof this.gameConfiguration.boats,
    weapon: GameWeapon,
    originCell: Cell,
  ) {
    if (this.gameState !== GameState.playing) {
      const errorKey = 'gameNotStarted';

      throw new GameEngineError({
        code: GameEngineErrorCodes[errorKey],
        message: GameEngineErrorMessages[errorKey],
      });
    }

    if (weapon.ammunitionRemaining === 0) {
      const errorKey = 'noAmmunitionRemaining';

      throw new GameEngineError({
        code: GameEngineErrorCodes[errorKey],
        message: GameEngineErrorMessages[errorKey],
      });
    }

    const [xOriginCell, yOriginCell] = originCell;
    const [xBoardPositions, yBoardPositions] = this.board;

    if (
      !xBoardPositions.includes(xOriginCell) ||
      !yBoardPositions.includes(yOriginCell)
    ) {
      const errorKey = 'outOfBounds';

      throw new GameEngineError({
        code: GameEngineErrorCodes[errorKey],
        message: GameEngineErrorMessages[errorKey],
      });
    }

    const shotCells = this.getShotCells(weapon, originCell);

    shotCells.forEach((shotCell) => {
      this.doesCellContainABoat(targetedPlayer, shotCell);
    });

    if (weapon.ammunitionRemaining > 0) {
      weapon.ammunitionRemaining -= 1;
    }
  }

  /**
   * Sort 2 dimensions array of numbers by ascending order
   * @param cells
   */
  private sortCells(cells: Cell[], sortBy: 'x' | 'y') {
    const cellIndex = sortBy === 'x' ? 0 : 1;

    cells.sort((cell1, cell2) => cell1[cellIndex] - cell2[cellIndex]);
  }

  public startGame(gameConfiguration: GameConfiguration) {
    // TASK Create dynamically gameBoard with board dimensions given in gameConfiguration
    const boatsOfPlayers = Object.values(gameConfiguration.boats);
    this.gameInstanceValidatorsService.validateBoatsOfPlayers(
      this.board,
      boatsOfPlayers,
    );

    this.gameConfiguration = gameConfiguration;

    this.temporaryPlayerPseudos = this.generateTemporaryPlayerPseudos(
      gameConfiguration.players,
    );

    this.masterPlayerBoards = this.generateMasterPlayerBoards(
      gameConfiguration.boats,
    );

    this.visiblePlayerBoards = this.generateVisiblePlayerBoards(
      this.temporaryPlayerPseudos,
    );

    this.gameArsenal = this.generateGameArsenal(gameConfiguration);

    this.turn = this.generateTurns(this.temporaryPlayerPseudos);

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

  private updatePlayerBoatObject(
    targetedPlayer: keyof typeof this.gameConfiguration.boats,
    targetedCell: Cell,
  ) {
    const [xTargetedCell, yTargetedCell] = targetedCell;

    const playerFleet = this.gameConfiguration.boats[targetedPlayer];

    const stillInGameBoats = this.findStillInGamePlayerBoats(playerFleet);

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

    [targetedBoat.hit, targetedBoat.emplacement].forEach((arrayOfCell) => {
      this.sortCells(arrayOfCell, 'y');
      this.sortCells(arrayOfCell, 'x');
    });

    if (radash.isEqual(targetedBoat.hit, targetedBoat.emplacement)) {
      targetedBoat.isSunk = true;
    }
  }
}
