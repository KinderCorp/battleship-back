import { draw, isEqual, uid } from 'radash';

import {
  BaseGameSettings,
  Cell,
  GameArsenal,
  GameBoard,
  GameBoat,
  GameBoats,
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
import GameEngineError from '@shared/game-engine-error';
import GameInstanceValidatorsService from '@engine/game-instance-validators.service';
import { WeaponName } from '@interfaces/weapon.interface';

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
    { gameMode = GameMode.ONE_VERSUS_ONE, firstPlayer }: BaseGameSettings,
    private readonly gameInstanceValidatorsService: GameInstanceValidatorsService,
  ) {
    this._gameState = GameState.WAITING_TO_RIVAL;
    this.maxNumberOfPlayers = this.getMaximumPlayers(gameMode);

    // TASK Check player validity before pushing to players
    this.players.push(firstPlayer);
    this.id = uid(GAME_INSTANCE_UID_LENGTH);

    // TASK Make this dynamically
    this.gameSettings = {
      boardDimensions: 10,
      gameMode: gameMode,
      hasBoatsSafetyZone: false,
      timePerTurn: 60,
      weapons: [
        {
          damageArea: {
            b: [],
            bl: [],
            br: [],
            l: [],
            o: [0, 0],
            r: [],
            t: [],
            tl: [],
            tr: [],
          },
          id: 1,
          maxAmmunition: -1,
          name: WeaponName.BOMB,
        },
      ],
    };
  }

  public get gameState(): GameState {
    return this._gameState;
  }

  public set gameState(value: GameState) {
    this._gameState = value;
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

    const [xOriginCell, yOriginCell] = originCell;
    const [xBoardPositions, yBoardPositions] = this.board;

    if (
      !xBoardPositions.includes(xOriginCell) ||
      !yBoardPositions.includes(yOriginCell)
    ) {
      const errorKey = 'OUT_OF_BOUNDS';

      throw new GameEngineError({
        code: GameEngineErrorCodes[errorKey],
        message: GameEngineErrorMessages[errorKey],
      });
    }

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
