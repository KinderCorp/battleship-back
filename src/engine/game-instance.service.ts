import * as radash from 'radash';

import {
  BaseGameConfiguration,
  Cell,
  EndGameRecap,
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
  DEFAULT_BOARD_GAME,
  GAME_INSTANCE_UID_LENGTH,
} from '@shared/game-instance.const';
import {
  GameEngineErrorCodes,
  GameEngineErrorMessages,
} from '@interfaces/error.interface';
import GameEngineError from '@shared/game-engine-error';
import GameInstanceValidatorsService from '@engine/game-instance-validators.service';

export default class GameInstanceService {
  private _gameState!: GameState;
  private board: GameBoard = DEFAULT_BOARD_GAME;
  private gameArsenal: GameArsenal;
  private gameConfiguration!: GameConfiguration;
  private masterPlayerBoards!: PlayerBoards;
  private readonly gameMode!: GameMode;
  private turn!: Turn;
  private visiblePlayerBoards!: PlayerBoards;
  public players: GamePlayer[] = [];
  public readonly id: string;

  public constructor(
    {
      gameMode = GameMode.OneVersusOne,
      firstPlayer,
      state = GameState.waitingToRival,
    }: BaseGameConfiguration,
    private readonly gameInstanceValidatorsService: GameInstanceValidatorsService,
  ) {
    this.gameMode = gameMode;
    this._gameState = state;
    // TASK Check player validity before pushing to players
    this.players.push(firstPlayer);
    this.id = radash.uid(GAME_INSTANCE_UID_LENGTH);
  }

  public get gameState(): GameState {
    return this._gameState;
  }
  public set gameState(value: GameState) {
    this._gameState = value;
  }

  private countDownAction(turn: Turn) {
    this.gameInstanceValidatorsService.validateActionCanBeExecuted(turn);

    turn.actionRemaining -= 1;

    if (turn.actionRemaining < 1) {
      this.endTurn(turn);
    }
  }

  private doesCellContainABoat(targetedPlayer: GamePlayer, targetedCell: Cell) {
    this.gameInstanceValidatorsService.validateCellHasNotBeenHit(
      this.visiblePlayerBoards[targetedPlayer.id],
      targetedCell,
    );

    this.visiblePlayerBoards[targetedPlayer.id].push(targetedCell);

    const [xTargetedCell, yTargetedCell] = targetedCell;

    const doesCellContainABoat = this.masterPlayerBoards[
      targetedPlayer.id
    ].some(
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
      this.gameConfiguration.players,
    );
    turn.actionRemaining = 1;
  }

  private findStillInGamePlayerBoats(playerBoats: GameBoat[]) {
    return playerBoats.filter((boat) => !boat.isSunk);
  }

  private generateGameArsenal(gameConfiguration: GameConfiguration) {
    const gameArsenal: GameArsenal = {};

    Object.entries(gameConfiguration.weapons).forEach(([playerId, weapons]) => {
      weapons.forEach((weapon) => {
        if (!gameArsenal[playerId]) {
          gameArsenal[playerId] = [];
        }

        gameArsenal[playerId].push({
          ammunitionRemaining: weapon.maxAmmunition,
          damageArea: weapon.damageArea,
          name: weapon.name,
        });
      });
    });

    return gameArsenal;
  }

  private generateMasterPlayerBoards(boats: GameBoats) {
    const playerBoards: PlayerBoards = {};

    Object.entries(boats).forEach(([playerId, boats]: [string, GameBoat[]]) => {
      const arrayOfBoatEmplacement = boats
        .map((boat) => boat.emplacement)
        .flat(1);

      playerBoards[playerId] = arrayOfBoatEmplacement;
    });

    return playerBoards;
  }

  private generateTurns(players: typeof this.gameConfiguration.players): Turn {
    const firstPlayer = radash.draw(players);

    return {
      actionRemaining: 1,
      isTurnOf: firstPlayer,
      nextPlayer: this.getNextPlayer(firstPlayer, players),
    };
  }

  private generateVisiblePlayerBoards(players: GamePlayer[]) {
    const playerBoards: PlayerBoards = {};
    const playerIds = players.map((player) => player.id);

    playerIds.forEach((playerId) => {
      playerBoards[playerId] = [];
    });

    return playerBoards;
  }

  private getNextPlayer(
    player: GamePlayer,
    players: typeof this.gameConfiguration.players,
  ) {
    const nextPlayerIndex = players.indexOf(player) + 1;

    return players[nextPlayerIndex] ?? players[0];
  }

  private getShotCells(weapon: GameWeapon, originCell: Cell) {
    const [xOriginCell, yOriginCell] = originCell;
    const shotCells: Cell[] = [];

    Object.values(weapon.damageArea).forEach(([xShotCell, yShotCell]: Cell) => {
      if (
        xShotCell === undefined ||
        yShotCell === undefined ||
        xShotCell === null ||
        yShotCell === null
      ) {
        return;
      }

      shotCells.push([xOriginCell + xShotCell, yOriginCell + yShotCell]);
    });

    return shotCells;
  }

  private hasPlayerFleetBeenSunk(playerFleet: GameBoat[]) {
    return playerFleet.every((boat) => boat.isSunk);
  }

  private isGameOver(): EndGameRecap | false {
    const isGameOver: EndGameRecap = {
      loser: [],
      winner: [],
    };

    Object.entries(this.gameConfiguration.boats).forEach(
      ([playerId, playerFleet]) => {
        const hasPlayerFleetBeenSunk = this.hasPlayerFleetBeenSunk(playerFleet);

        if (!hasPlayerFleetBeenSunk) {
          return;
        }

        const winner = this.gameConfiguration.players.find(
          (player) => player.id.toLowerCase() === playerId,
        );

        const losers = this.gameConfiguration.players.filter(
          (player) => player.id.toLowerCase() !== playerId,
        );

        isGameOver.winner.push(winner);
        isGameOver.loser.push(...losers);
      },
    );

    if (!isGameOver.winner.length) {
      return false;
    }

    return isGameOver;
  }

  /**
   * Make a shot with the specified weapon
   * @param targetedPlayer
   * @param weapon
   * @param originCell The cell where the player touch
   */
  public shoot(
    targetedPlayer: GamePlayer,
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

  // TASK Create dynamically gameBoard with board dimensions given in gameConfiguration
  public startGame(gameConfiguration: GameConfiguration) {
    this.gameInstanceValidatorsService.validateBoardDimensions(
      gameConfiguration.boardDimensions,
    );

    this.gameInstanceValidatorsService.validatePlayers(
      gameConfiguration.players,
    );

    const boatsOfPlayers = Object.values(gameConfiguration.boats);
    this.gameInstanceValidatorsService.validateBoatsOfPlayers(
      this.board,
      boatsOfPlayers,
    );

    this.gameConfiguration = gameConfiguration;

    this.masterPlayerBoards = this.generateMasterPlayerBoards(
      gameConfiguration.boats,
    );

    this.visiblePlayerBoards = this.generateVisiblePlayerBoards(
      this.gameConfiguration.players,
    );

    this.gameArsenal = this.generateGameArsenal(gameConfiguration);

    this.turn = this.generateTurns(this.gameConfiguration.players);

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

  private updatePlayerBoatObject(
    targetedPlayer: GamePlayer,
    targetedCell: Cell,
  ) {
    const [xTargetedCell, yTargetedCell] = targetedCell;

    const playerFleet = this.gameConfiguration.boats[targetedPlayer.id];

    const stillInGameBoats = this.findStillInGamePlayerBoats(playerFleet);

    const targetedBoat = stillInGameBoats.find((boat) =>
      boat.emplacement.some(
        ([xMasterCell, yMasterCell]) =>
          xMasterCell === xTargetedCell && yMasterCell === yTargetedCell,
      ),
    );

    // Should never throw because we already check with the visible player board
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
