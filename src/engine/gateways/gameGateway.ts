import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server as SocketServer } from 'socket.io';
import { Logger } from '@nestjs/common';

import {
  BaseGameSettings,
  GameBoat,
  GameMode,
  GamePlayer,
  GameSettings,
  GameState,
  Room,
  RoomData,
  ShootParameters,
  ShotRecap,
  SocketEventsEmitting,
  SocketEventsListening,
  Turn,
} from '@interfaces/engine.interface';
import GameEngine from '@engine/game-engine';
import { GameEngineErrorCodes } from '@interfaces/error.interface';
import GameInstanceService from '@engine/game-instance.service';
import GameInstanceValidatorsService from '@engine/game-instance-validators.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class GameGateway implements OnGatewayConnection {
  public logger = new Logger();

  @WebSocketServer()
  public socketServer: SocketServer;

  public constructor(
    private gameEngine: GameEngine,
    private gameInstanceValidators: GameInstanceValidatorsService,
  ) {}

  private destroySession(instance: GameInstanceService) {
    this.socketServer.in(String(instance.id)).socketsLeave(String(instance.id));
    this.gameEngine.destroy(instance);
  }

  public handleConnection(socket: Socket) {
    this.logger.log(`Socket ${socket.id} connected`);
    this.socketServer.emit('connected', `Socket ${socket.id} connected`);
  }

  public handleDisconnect(socket: Socket) {
    this.logger.log(`Socket ${socket.id} disconnected`);
  }

  /**
   * When a player click on "create game" button
   */
  @SubscribeMessage(SocketEventsListening.CREATE_GAME)
  public onCreateGame(
    @MessageBody() body: GamePlayer,
    @ConnectedSocket() socket: Socket,
  ): void {
    // TASK Add verification of the player object (use class-validator)
    // If player is valid, create a game instance service and store it in game engine "instances" (property of the class)
    // Otherwise, we send an error message

    const baseGameConfiguration: BaseGameSettings = {
      firstPlayer: body,
      gameMode: GameMode.ONE_VERSUS_ONE,
      state: GameState.WAITING_TO_START,
    };

    const instance = new GameInstanceService(
      baseGameConfiguration,
      this.gameInstanceValidators,
    );

    const room: Room = {
      instanceId: instance.id,
    };

    this.gameEngine.addInstance(instance);

    socket.join(String(instance.id));

    this.socketServer
      .to(socket.id)
      .emit(SocketEventsEmitting.GAME_CREATED, room);

    // FIXME NOT TESTED - IMPOSSIBLE TO MAKE THE FRONT WORK
  }

  /**
   * When a player join an existing game
   * @param body a GamePlayer and the game id to join
   * @param socket
   */
  @SubscribeMessage(SocketEventsListening.PLAYER_JOINING_GAME)
  public onPlayerJoiningGame(
    @MessageBody() body: RoomData<GamePlayer>,
    @ConnectedSocket() socket: Socket,
  ): void {
    const instance = this.gameEngine.get(body.instanceId);
    if (!instance) {
      this.socketServer
        .to(socket.id)
        .emit(SocketEventsEmitting.ERROR_GAME_NOT_FOUND);

      return;
    }

    if (
      instance.players.length === 2 &&
      instance.gameMode === GameMode.ONE_VERSUS_ONE
    ) {
      this.socketServer
        .to(String(body.instanceId))
        .emit(SocketEventsEmitting.ERROR_GAME_IS_FULL);

      return;
    }

    // TASK Add verification of the player object (use class-validator)

    instance.players.push(body.data);

    socket.join(body.instanceId);

    this.socketServer
      .to(String(body.instanceId))
      .emit(SocketEventsEmitting.PLAYER_JOINED);
    // After emitting user join event, we wait the game owner to click on "start placing boats" button
  }

  /**
   * When players can place their boats
   */
  @SubscribeMessage(SocketEventsListening.PLAYER_READY_TO_PLACE_BOATS)
  public onPlayersReadyToPlaceBoats(
    @MessageBody() body: RoomData<Omit<GameSettings, 'boats'>>,
    @ConnectedSocket() socket: Socket,
  ): void {
    const instance = this.gameEngine.get(body.instanceId);
    if (!instance) {
      this.socketServer
        .to(socket.id)
        .emit(SocketEventsEmitting.ERROR_GAME_NOT_FOUND);

      return;
    }

    try {
      instance.startPlacingBoats(body.data);

      this.socketServer
        .to(String(body.instanceId))
        .emit(SocketEventsEmitting.START_PLACING_BOATS);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      let eventName: SocketEventsEmitting;

      switch (error['code']) {
        case GameEngineErrorCodes.invalidBoardGameDimensions:
          eventName = SocketEventsEmitting.ERROR_INVALID_BOARD_GAME_DIMENSIONS;
          break;

        case GameEngineErrorCodes.missingPlayer:
          eventName = SocketEventsEmitting.ERROR_MISSING_PLAYER;
          break;

        case GameEngineErrorCodes.invalidNumberOfPlayers:
          eventName = SocketEventsEmitting.ERROR_INVALID_NUMBER_OF_PLAYERS;
          break;

        default:
          eventName = SocketEventsEmitting.ERROR_UNKNOWN_SERVER;
          this.destroySession(instance);
          break;
      }

      this.socketServer.to(String(body.instanceId)).emit(eventName, error);
    }
  }

  /**
   * When a player clicks on a cell to shoot
   * @param body contains the targetedPlayer, the weapon, and the origin cell (cell where the player has clicked)
   * @param socket
   * @Returns An error if the shot or the result of the shot isn't valid
   */
  @SubscribeMessage(SocketEventsListening.SHOOT)
  public onShoot(
    @MessageBody() body: RoomData<ShootParameters>,
    @ConnectedSocket() socket: Socket,
  ): void {
    const instance = this.gameEngine.get(body.instanceId);
    if (!instance) {
      this.socketServer
        .to(socket.id)
        .emit(SocketEventsEmitting.ERROR_GAME_NOT_FOUND);

      return;
    }

    try {
      const shotRecap = instance.shoot(body.data);

      const roomData: RoomData<ShotRecap> = {
        data: shotRecap,
        instanceId: instance.id,
      };

      this.socketServer
        .to(instance.id)
        .emit(SocketEventsEmitting.SHOT, roomData);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      let eventName: SocketEventsEmitting;

      switch (error['code']) {
        case GameEngineErrorCodes.gameNotStarted:
          eventName = SocketEventsEmitting.ERROR_GAME_NOT_STARTED;
          break;

        case GameEngineErrorCodes.noAmmunitionRemaining:
          eventName = SocketEventsEmitting.ERROR_NO_AMMUNITION_REMAINING;
          break;

        case GameEngineErrorCodes.outOfBounds:
          eventName = SocketEventsEmitting.ERROR_OUT_OF_BOUNDS;
          break;

        case GameEngineErrorCodes.cellAlreadyHit:
          eventName = SocketEventsEmitting.ERROR_CELL_ALREADY_HIT;
          break;

        case GameEngineErrorCodes.WEAPON_NOT_FOUND:
          eventName = SocketEventsEmitting.ERROR_WEAPON_NOT_FOUND;
          break;

        case GameEngineErrorCodes.PLAYER_NOT_FOUND:
          eventName = SocketEventsEmitting.ERROR_PLAYER_NOT_FOUND;
          break;

        default:
          eventName = SocketEventsEmitting.ERROR_UNKNOWN_SERVER;
          this.destroySession(instance);
          break;
      }

      this.socketServer.to(String(body.instanceId)).emit(eventName, error);
    }
  }

  /**
   * When all boats have been validated and players are ready, we start the game
   * We check that everything's okay to start the game
   */
  @SubscribeMessage(SocketEventsListening.START_GAME)
  public onStartGame(
    @MessageBody() body: Room,
    @ConnectedSocket() socket: Socket,
  ): void {
    const instance = this.gameEngine.get(body.instanceId);
    if (!instance) {
      this.socketServer
        .to(socket.id)
        .emit(SocketEventsEmitting.ERROR_GAME_NOT_FOUND);

      return;
    }

    try {
      // TASK Check with @MQ about what the front need
      const turn = instance.startGame();

      const roomData: RoomData<Turn> = {
        data: turn,
        instanceId: instance.id,
      };

      this.socketServer
        .to(String(body.instanceId))
        .emit(SocketEventsEmitting.GAME_STARTED, roomData);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      let eventName: SocketEventsEmitting;

      switch (error['code']) {
        case GameEngineErrorCodes.gameNotStarted:
          eventName = SocketEventsEmitting.ERROR_GAME_NOT_STARTED;
          break;

        case GameEngineErrorCodes.invalidBoardGameDimensions:
          eventName = SocketEventsEmitting.ERROR_INVALID_BOARD_GAME_DIMENSIONS;
          break;

        case GameEngineErrorCodes.missingPlayer:
          eventName = SocketEventsEmitting.ERROR_MISSING_PLAYER;
          break;

        case GameEngineErrorCodes.invalidNumberOfPlayers:
          eventName = SocketEventsEmitting.ERROR_INVALID_NUMBER_OF_PLAYERS;
          break;

        case GameEngineErrorCodes.outOfBounds:
          eventName = SocketEventsEmitting.ERROR_OUT_OF_BOUNDS;
          break;

        case GameEngineErrorCodes.invalidBoat:
          eventName = SocketEventsEmitting.ERROR_INVALID_BOAT;
          break;

        default:
          eventName = SocketEventsEmitting.ERROR_UNKNOWN_SERVER;
          this.destroySession(instance);
          break;
      }

      this.socketServer.to(String(body.instanceId)).emit(eventName, error);
    }
  }

  /**
   * When a player has placed all his boats
   * @Returns An error if boats are misplaced or send an ok message to continue
   */
  @SubscribeMessage(SocketEventsListening.VALIDATE_PLAYER_BOATS_PLACEMENT)
  public onValidatePlayerBoatsPlacement(
    @MessageBody() body: RoomData<GameBoat[]>,
    @ConnectedSocket() socket: Socket,
  ): void {
    // Create a function to validate boats of the player
    // If everything's okay, we send an ok message to notify the client that one player is ready to start
    // If the other player is already ready, we emit a different message (e.g. allPlayersHavePlacedTheirBoats)
    // Otherwise, we send an error message to inform the player that his boats are misplaced

    const instance = this.gameEngine.get(body.instanceId);
    if (!instance) {
      this.socketServer
        .to(socket.id)
        .emit(SocketEventsEmitting.ERROR_GAME_NOT_FOUND);

      return;
    }

    try {
      this.gameInstanceValidators.validateBoatsOfOnePlayer(
        instance.board,
        body.data,
      );

      instance.fleets[socket.id] = body.data;

      let eventName: SocketEventsEmitting;

      switch (Object.keys(instance.fleets).length) {
        case 1:
          eventName = SocketEventsEmitting.ONE_PLAYER_HAS_PLACED_HIS_BOATS;
          break;

        case 2:
          eventName = SocketEventsEmitting.ALL_PLAYERS_HAVE_PLACED_THEIR_BOATS;
          break;

        default:
          eventName = SocketEventsEmitting.ERROR_INVALID_NUMBER_OF_PLAYERS;
          break;
      }

      this.socketServer.to(String(body.instanceId)).emit(eventName);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      let eventName: SocketEventsEmitting;

      switch (error['code']) {
        case GameEngineErrorCodes.outOfBounds:
          eventName = SocketEventsEmitting.ERROR_OUT_OF_BOUNDS;
          break;

        case GameEngineErrorCodes.invalidBoat:
          eventName = SocketEventsEmitting.ERROR_INVALID_BOAT;
          break;

        default:
          eventName = SocketEventsEmitting.ERROR_UNKNOWN_SERVER;
          this.destroySession(instance);
          break;
      }

      this.socketServer.to(String(body.instanceId)).emit(eventName, error);
    }
  }
}

/**
 * Event orders
 *
 * 1a. [Front emit event] : CreateGame
 * 1b. [Back emit event] :  gameCreated | unableToCreateGame
 *
 * 2a. [Front emit event] : playerJoiningGame
 * 2b. [Back emit event] : UserJoined | GameNotFound / RoomComplete
 *
 * 3a. [Front emit event] : playersReadyToPlaceBoats
 * 3b. [Back emit event] : startPlacingBoats | ERROR - not defined yet
 *
 * 4a. [Front emit event] : validatePlayerBoatPlacement
 * 4b. [Back emit event] : onePlayerHasPlacedAllHisBoats | boatsAreMisplaced
 * 4c. [Front emit event] : validatePlayerBoatPlacement
 * 4d. [Back emit event] : allPlayersHavePlacedTheirBoats | boatsAreMisplaced
 *
 * 5a. [Front emit event] : StartGame
 * 5b. [Back emit event] : GameStarted | ERROR - not defined yet
 *
 * Xa. [Front emit event] : Shoot
 * Xb. [Back emit event] : Shot / EndGame | ERROR - not defined yet
 *
 * 7a. [Front emit event] : CloseRoom
 */
