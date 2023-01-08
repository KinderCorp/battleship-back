import { draw, isEqual, uid } from 'radash';

import {
  BaseGameSettings,
  BoatDirection,
  Cell,
  GameArsenal,
  GameBoard,
  GameBoat,
  GameBoats,
  GameBoatSettings,
  GameMode,
  GamePlayer,
  GameSettings,
  GameState,
  GameWeapon,
  MaxNumberOfPlayers,
  PlayerBoards,
  PodiumRecap,
  ShootParameters,
  ShotRecap,
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
import Boat from '@boat/boat.entity';
import GameEngineError from '@shared/game-engine-error';
import GameInstanceValidatorsService from '@engine/game-instance-validators.service';

export default class GameInstanceService {
  private _gameState!: GameState;
  public readonly board: GameBoard = DEFAULT_BOARD_GAME;
  private gameArsenal: GameArsenal;
  public gameSettings: GameSettings;
  public fleets: GameBoats = {};
  private masterPlayerBoards!: PlayerBoards;
  public readonly gameMode!: GameMode;
  public turn!: Turn;
  private visiblePlayerBoards!: PlayerBoards;
  public players: GamePlayer[] = [];
  public readonly id!: string;
  public readonly maxNumberOfPlayers: MaxNumberOfPlayers;

  public constructor(
    {
      authorisedFleet,
      mode = GameMode.ONE_VERSUS_ONE,
      firstPlayer,
      weapons,
    }: BaseGameSettings,
    private readonly gameInstanceValidatorsService: GameInstanceValidatorsService,
  ) {
    this.gameMode = mode;
    this._gameState = GameState.WAITING_TO_RIVAL;
    this.maxNumberOfPlayers = this.getMaximumPlayers(mode);

    // TASK Check player validity before pushing to players
    this.players.push(firstPlayer);
    this.id = uid(GAME_INSTANCE_UID_LENGTH);

    this.gameSettings = {
      authorisedFleet: authorisedFleet,
      boardDimensions: 10,
      hasBoatsSafetyZone: false,
      mode: mode,
      timePerTurn: 60,
      weapons: weapons,
    };
  }

  public get gameState(): GameState {
    return this._gameState;
  }

  public set gameState(value: GameState) {
    this._gameState = value;
  }

  public addPlayer(player: GamePlayer) {
    this.players.push(player);
  }

  /**
   * Calculate boat emplacement from bowCells, direction and length of the boat
   * @param boat
   * @param storedBoat
   */
  public calculateBoatEmplacement(boat: GameBoatSettings, storedBoat: Boat) {
    this.gameInstanceValidatorsService.validateBoatBeam(boat, storedBoat);
    this.gameInstanceValidatorsService.validateBowCellsAreAlignedWithDirection(
      boat.direction,
      boat.bowCells,
    );

    const boatEmplacements: Cell[] = [...boat.bowCells];

    boat.bowCells.forEach(([xBowCell, yBowCell]: Cell) => {
      const sternCell: Cell = this.calculateSternCell(
        [xBowCell, yBowCell],
        boat.direction,
        storedBoat.lengthOverall,
      );

      this.gameInstanceValidatorsService.validateCellIsInBounds(
        sternCell,
        this.board,
      );

      const [xSternCell, ySternCell] = sternCell;

      switch (boat.direction) {
        case BoatDirection.NORTH:
          for (let i = 0; i < storedBoat.lengthOverall - 1; i++) {
            const newCell = ySternCell + i;
            boatEmplacements.push([xBowCell, newCell]);
          }
          break;

        case BoatDirection.EAST:
          for (let i = 0; i < storedBoat.lengthOverall - 1; i++) {
            const newCell = xSternCell + i;
            boatEmplacements.push([newCell, yBowCell]);
          }
          break;

        case BoatDirection.SOUTH:
          for (let i = 0; i < storedBoat.lengthOverall - 1; i++) {
            const newCell = ySternCell - i;
            boatEmplacements.push([xBowCell, newCell]);
          }
          break;

        case BoatDirection.WEST:
          for (let i = 0; i < storedBoat.lengthOverall - 1; i++) {
            const newCell = xSternCell - i;
            boatEmplacements.push([newCell, yBowCell]);
          }
          break;
      }
    });

    return boatEmplacements;
  }

  /**
   * Calculate the stern cell from the bow cell, the direction and the boat length
   *
   * We add a -1 modifier that corresponds to the bowCells positions
   *
   * @param Cell
   * @param direction
   * @param boatLength
   */
  public calculateSternCell(
    [xBowCell, yBowCell]: Cell,
    direction: BoatDirection,
    boatLength: Boat['lengthOverall'],
  ): Cell {
    switch (direction) {
      case BoatDirection.NORTH:
        return [xBowCell, yBowCell - (boatLength - 1)];

      case BoatDirection.EAST:
        return [xBowCell - (boatLength - 1), yBowCell];

      case BoatDirection.SOUTH:
        return [xBowCell, yBowCell + (boatLength - 1)];

      case BoatDirection.WEST:
        return [xBowCell + (boatLength - 1), yBowCell];
    }
  }

  public countDownAction(turn: Turn) {
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
    this.gameState = GameState.FINISHED;
  }

  private endTurn(turn: Turn) {
    turn.isTurnOf = turn.nextPlayer;
    turn.nextPlayer = this.getNextPlayer(turn.isTurnOf, this.players);
    turn.actionRemaining = 1;
  }

  private findStillInGamePlayerBoats(playerBoats: GameBoat[]) {
    return playerBoats.filter((boat) => !boat.isSunk);
  }

  public generateFleet(
    boats: GameBoatSettings[],
    boatsFromStore: Boat[],
  ): GameBoat[] {
    return boats.map((boat) => this.generateGameBoat(boat, boatsFromStore));
  }

  private generateGameArsenal(gameSettings: GameSettings) {
    const gameArsenal: GameArsenal = {};

    gameSettings.weapons.forEach((weapon) => {
      this.players.forEach((player) => {
        if (!gameArsenal[player.id]) {
          gameArsenal[player.id] = [];
        }

        gameArsenal[player.id].push({
          ammunitionRemaining: weapon.maxAmmunition,
          damageArea: weapon.damageArea,
          name: weapon.name,
        });
      });
    });

    return gameArsenal;
  }

  private generateGameBoat(
    boat: GameBoatSettings,
    boatsFromStore: Boat[],
  ): GameBoat {
    const storedBoat = boatsFromStore.find(
      (boatFromStore) => boat.name === boatFromStore.name,
    );
    if (!storedBoat) {
      const errorKey = 'INVALID_BOAT';

      throw new GameEngineError({
        code: GameEngineErrorCodes[errorKey],
        message: GameEngineErrorMessages[errorKey],
      });
    }

    const boatEmplacement = this.calculateBoatEmplacement(boat, storedBoat);

    return {
      emplacement: boatEmplacement,
      hit: [],
      isSunk: false,
      name: boat.name,
    };
  }

  private generateMasterPlayerBoards(boats: GameBoats) {
    const playerBoards: PlayerBoards = {};

    Object.entries(boats).forEach(([playerId, boats]: [string, GameBoat[]]) => {
      return (playerBoards[playerId] = boats
        .map((boat) => boat.emplacement)
        .flat(1));
    });

    return playerBoards;
  }

  private generateTurns(players: typeof this.players): Turn {
    const firstPlayer = draw(players);

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

  private getMaximumPlayers(gameMode: GameMode): MaxNumberOfPlayers {
    switch (gameMode) {
      case GameMode.ONE_VERSUS_ONE:
        return 2;

      default:
        throw new GameEngineError({
          code: GameEngineErrorCodes.INVALID_GAME_MODE,
          message: GameEngineErrorMessages.INVALID_GAME_MODE,
        });
    }
  }

  private getNextPlayer(player: GamePlayer, players: typeof this.players) {
    const nextPlayerIndex = players.indexOf(player) + 1;

    return players[nextPlayerIndex] ?? players[0];
  }

  public getPlayerByAnyId(
    playerAnyId: GamePlayer['id'] | GamePlayer['socketId'],
  ) {
    const player = this.players.find(
      (player) => player.id === playerAnyId || player.socketId === playerAnyId,
    );

    if (!player) {
      const errorKey = 'PLAYER_NOT_FOUND';

      throw new GameEngineError({
        code: GameEngineErrorCodes[errorKey],
        message: GameEngineErrorMessages[errorKey],
      });
    }

    return player;
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

  private getWeaponByName(
    weaponName: GameWeapon['name'],
    targetedPlayer: GamePlayer['id'],
  ) {
    const weapon = this.gameArsenal[targetedPlayer].find(
      (weapon) => weapon.name === weaponName,
    );

    if (!weapon) {
      const errorKey = 'WEAPON_NOT_FOUND';

      throw new GameEngineError({
        code: GameEngineErrorCodes[errorKey],
        message: GameEngineErrorMessages[errorKey],
      });
    }

    return weapon;
  }

  private hasPlayerFleetBeenSunk(playerFleet: GameBoat[]) {
    return playerFleet.every((boat) => boat.isSunk);
  }

  public isGameOver(): PodiumRecap | false {
    const isGameOver: PodiumRecap = {
      loser: [],
      winner: [],
    };

    Object.entries(this.fleets).forEach(([playerId, playerFleet]) => {
      const hasPlayerFleetBeenSunk = this.hasPlayerFleetBeenSunk(playerFleet);

      if (!hasPlayerFleetBeenSunk) {
        return;
      }

      const winner = this.players.find(
        (player) => player.id.toLowerCase() === playerId,
      );

      const losers = this.players.filter(
        (player) => player.id.toLowerCase() !== playerId,
      );

      isGameOver.winner.push(winner);
      isGameOver.loser.push(...losers);
    });

    if (!isGameOver.winner.length) {
      return false;
    }

    return isGameOver;
  }

  public removePlayer(player: GamePlayer) {
    const indexOfPlayer = this.players.indexOf(player);

    if (indexOfPlayer < 0) {
      const errorKey = 'PLAYER_NOT_FOUND';

      throw new GameEngineError({
        code: GameEngineErrorCodes[errorKey],
        message: GameEngineErrorMessages[errorKey],
      });
    }

    this.players.splice(1, 1);
  }

  /**
   * Make a shot with the specified weapon
   * @param targetedPlayer
   * @param weaponName
   * @param originCell The cell where the player touch
   */
  public shoot({ targetedPlayerId, weaponName, originCell }: ShootParameters) {
    if (this.gameState !== GameState.PLAYING) {
      const errorKey = 'GAME_NOT_STARTED';

      throw new GameEngineError({
        code: GameEngineErrorCodes[errorKey],
        message: GameEngineErrorMessages[errorKey],
      });
    }

    const weapon = this.getWeaponByName(weaponName, targetedPlayerId);
    const targetedPlayer = this.getPlayerByAnyId(targetedPlayerId);

    if (weapon.ammunitionRemaining === 0) {
      const errorKey = 'NO_AMMUNITION_REMAINING';

      throw new GameEngineError({
        code: GameEngineErrorCodes[errorKey],
        message: GameEngineErrorMessages[errorKey],
      });
    }

    this.gameInstanceValidatorsService.validateCellIsInBounds(
      originCell,
      this.board,
    );

    const shotRecap: ShotRecap = {
      hitCells: [],
      missCells: [],
      weapon: weapon,
    };

    const shotCells = this.getShotCells(weapon, originCell);
    shotCells.forEach((shotCell) => {
      const hasCellBeenHit = this.doesCellContainABoat(
        targetedPlayer,
        shotCell,
      );

      hasCellBeenHit
        ? shotRecap.hitCells.push(shotCell)
        : shotRecap.missCells.push(shotCell);
    });

    if (weapon.ammunitionRemaining > 0) {
      weapon.ammunitionRemaining -= 1;
    }

    return shotRecap;
  }

  /**
   * Sort 2 dimensions array of numbers by ascending order
   * @param cells
   * @param sortBy
   */
  private sortCells(cells: Cell[], sortBy: 'x' | 'y') {
    const cellIndex = sortBy === 'x' ? 0 : 1;

    cells.sort((cell1, cell2) => cell1[cellIndex] - cell2[cellIndex]);
  }

  // TASK Create dynamically gameBoard with board dimensions given in gameSettings
  public startGame() {
    this.gameInstanceValidatorsService.validateBoardDimensions(
      this.gameSettings.boardDimensions,
    );

    this.gameInstanceValidatorsService.validatePlayers(this.players);

    const boatsOfPlayers = Object.values(this.fleets);
    this.gameInstanceValidatorsService.validateBoatsOfPlayers(
      this.gameSettings.authorisedFleet,
      this.board,
      boatsOfPlayers,
    );

    this.masterPlayerBoards = this.generateMasterPlayerBoards(this.fleets);

    this.visiblePlayerBoards = this.generateVisiblePlayerBoards(this.players);

    this.gameArsenal = this.generateGameArsenal(this.gameSettings);

    this.turn = this.generateTurns(this.players);

    this.gameState = GameState.PLAYING;

    return this.turn;
  }

  public startPlacingBoats(gameSettings: GameSettings) {
    this.gameInstanceValidatorsService.validateBoardDimensions(
      gameSettings.boardDimensions,
    );

    this.gameInstanceValidatorsService.validatePlayers(this.players);

    this.gameState = GameState.PLACING_BOATS;
  }

  private updatePlayerBoatObject(
    targetedPlayer: GamePlayer,
    targetedCell: Cell,
  ) {
    const [xTargetedCell, yTargetedCell] = targetedCell;

    const playerFleet = this.fleets[targetedPlayer.id];

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

    if (isEqual(targetedBoat.hit, targetedBoat.emplacement)) {
      targetedBoat.isSunk = true;
    }
  }
}
