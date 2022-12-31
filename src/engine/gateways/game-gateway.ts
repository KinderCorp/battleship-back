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
import { uid } from 'radash';

import {
  BaseGameSettings,
  FinalTurnRecap,
  GameBoatSettings,
  GameMode,
  GamePlayer,
  GameState,
  PlayersWithSettings,
  Room,
  RoomData,
  ShootParameters,
  SocketEventsEmitting,
  SocketEventsListening,
  Turn,
  TurnRecap,
} from '@interfaces/engine.interface';
import GameEngine from '@engine/game-engine';
import { GameEngineErrorCodes } from '@interfaces/error.interface';
import GameEngineValidatorsService from '@engine/game-engine-validators.service';
import GameInstanceService from '@engine/game-instance.service';
import GameInstanceValidatorsService from '@engine/game-instance-validators.service';

@WebSocketGateway({ cors: { origin: '*' } })
export default class GameGateway implements OnGatewayConnection {
  public logger = new Logger();

  @WebSocketServer()
  public socketServer: SocketServer;

  public constructor(
    private gameEngine: GameEngine,
    private gameInstanceValidators: GameInstanceValidatorsService,
    private gameEngineValidators: GameEngineValidatorsService,
  ) {}

  private destroySession(instance: GameInstanceService) {
    this.socketServer
      .to(String(instance.id))
      .emit(SocketEventsEmitting.CLOSED_ROOM);

    this.socketServer.in(String(instance.id)).socketsLeave(String(instance.id));
    this.gameEngine.destroy(instance);
  }

  private getErrorEventName(
    errorCode: GameEngineErrorCodes,
    instance: GameInstanceService,
  ) {
    switch (errorCode) {
      case GameEngineErrorCodes.INVALID_BOAT:
        return SocketEventsEmitting.ERROR_INVALID_BOAT;

      case GameEngineErrorCodes.OUT_OF_BOUNDS:
        return SocketEventsEmitting.ERROR_OUT_OF_BOUNDS;

      case GameEngineErrorCodes.PLAYER_NOT_FOUND:
        return SocketEventsEmitting.ERROR_PLAYER_NOT_FOUND;

      case GameEngineErrorCodes.GAME_NOT_STARTED:
        return SocketEventsEmitting.ERROR_GAME_NOT_STARTED;

      case GameEngineErrorCodes.NO_AMMUNITION_REMAINING:
        return SocketEventsEmitting.ERROR_NO_AMMUNITION_REMAINING;

      case GameEngineErrorCodes.CELL_ALREADY_HIT:
        return SocketEventsEmitting.ERROR_CELL_ALREADY_HIT;

      case GameEngineErrorCodes.WEAPON_NOT_FOUND:
        return SocketEventsEmitting.ERROR_WEAPON_NOT_FOUND;

      case GameEngineErrorCodes.NO_ACTION_REMAINING:
        return SocketEventsEmitting.ERROR_NO_ACTION_REMAINING;

      case GameEngineErrorCodes.INVALID_BOARD_GAME_DIMENSIONS:
        return SocketEventsEmitting.ERROR_INVALID_BOARD_GAME_DIMENSIONS;

      case GameEngineErrorCodes.MISSING_PLAYER:
        return SocketEventsEmitting.ERROR_MISSING_PLAYER;

      case GameEngineErrorCodes.INVALID_NUMBER_OF_PLAYERS:
        return SocketEventsEmitting.ERROR_INVALID_NUMBER_OF_PLAYERS;

      default:
        this.destroySession(instance);
        return SocketEventsEmitting.ERROR_UNKNOWN_SERVER;
    }
  }

  // noinspection JSUnusedGlobalSymbols
  public handleConnection(socket: Socket) {
    this.socketServer
      .to(socket.id)
      .emit('connected', `Socket ${socket.id} connected`);
    this.logger.log(`Socket ${socket.id} connected`);
  }

  // noinspection JSUnusedGlobalSymbols
  public handleDisconnect(socket: Socket) {
    this.logger.log(`Socket ${socket.id} disconnected`);
    const instance = this.gameEngine.getInstanceByPlayerSocketId(socket.id);
    if (!instance) {
      return;
    }

    const disconnectedPlayer = instance.getPlayerByAnyId(socket.id);

    instance.removePlayer(disconnectedPlayer);

    const roomData: RoomData<GamePlayer> = {
      data: disconnectedPlayer,
      instanceId: instance.id,
    };

    this.socketServer
      .to(String(instance.id))
      .emit(SocketEventsEmitting.PLAYER_DISCONNECTED, roomData);

    const sessionCanBeDestroyed =
      this.gameEngineValidators.validateSessionCanBeDestroyed(
        instance,
        disconnectedPlayer,
      );

    if (!sessionCanBeDestroyed) {
      return;
    }

    this.destroySession(instance);
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
    try {
      const playerCanCreateInstance =
        this.validatePlayerCanJoinInstance(socket);
      if (!playerCanCreateInstance) {
        return;
      }

      const baseGameSettings: BaseGameSettings = {
        firstPlayer: {
          id: body.id ?? uid(20),
          isHost: true,
          pseudo: body.pseudo,
          socketId: socket.id,
        },
        gameMode: GameMode.ONE_VERSUS_ONE,
      };

      const instance = new GameInstanceService(
        baseGameSettings,
        this.gameInstanceValidators,
      );

      this.gameEngine.addInstance(instance);

      socket.join(String(instance.id));

      const room: RoomData<PlayersWithSettings> = {
        data: {
          players: [baseGameSettings.firstPlayer],
          settings: instance.gameSettings,
        },
        instanceId: instance.id,
      };

      this.socketServer
        .to(socket.id)
        .emit(SocketEventsEmitting.GAME_CREATED, room);
    } catch (error) {
      this.logger.error(SocketEventsListening.CREATE_GAME, error);
    }
  }

  /**
   * Disconnect a player.
   * The function handleDisconnect handles the action following the disconnection event
   * @param body
   * @param socket
   */
  @SubscribeMessage(SocketEventsListening.LEAVE_ROOM)
  public onLeaveRoom(
    @MessageBody() body: Room,
    @ConnectedSocket() socket: Socket,
  ): void {
    try {
      socket.disconnect();
    } catch (error) {
      this.logger.error(SocketEventsListening.LEAVE_ROOM, error);
    }
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

    try {
      const socketsOfInstance = this.gameEngine.getInstanceSockets(instance);
      if (socketsOfInstance.includes(socket.id)) {
        this.socketServer
          .to(socket.id)
          .emit(SocketEventsEmitting.ERROR_PLAYER_ALREADY_JOINED);

        return;
      }

      if (
        instance.players.length === 2 &&
        instance.gameMode === GameMode.ONE_VERSUS_ONE
      ) {
        this.socketServer
          .to(String(socket.id))
          .emit(SocketEventsEmitting.ERROR_GAME_IS_FULL);

        return;
      }

      // TASK Add verification of the player object (use class-validator)

      const newPlayer: GamePlayer = {
        id: body.data.id ?? uid(20),
        isHost: false,
        pseudo: body.data.pseudo,
        socketId: socket.id,
      };

      instance.addPlayer(newPlayer);

      if (instance.players.length === instance.maxNumberOfPlayers) {
        instance.gameState = GameState.WAITING_TO_START;
      }

      socket.join(body.instanceId);

      const senderRoomData: RoomData<GamePlayer> = {
        data: newPlayer,
        instanceId: instance.id,
      };

      // Send to others players and not the sender that a player has joined
      socket.broadcast
        .to(String(instance.id))
        .emit(SocketEventsEmitting.PLAYER_JOINED, senderRoomData);

      // Send game information to the sender only
      const rivalRoomData: RoomData<PlayersWithSettings> = {
        data: {
          players: instance.players,
          settings: instance.gameSettings,
        },
        instanceId: instance.id,
      };

      this.socketServer
        .to(String(socket.id))
        .emit(SocketEventsEmitting.GAME_INFORMATION, rivalRoomData);
    } catch (error) {
      this.logger.error(SocketEventsListening.PLAYER_JOINING_GAME, error);
    }
  }

  /**
   * When players can place their boats
   * Only the admin player can send this event
   */
  @SubscribeMessage(SocketEventsListening.PLAYERS_READY_TO_PLACE_BOATS)
  public onPlayersReadyToPlaceBoats(@ConnectedSocket() socket: Socket): void {
    const instance = this.gameEngine.getInstanceByPlayerSocketId(socket.id);
    if (!instance) {
      this.socketServer
        .to(socket.id)
        .emit(SocketEventsEmitting.ERROR_GAME_NOT_FOUND);

      return;
    }

    const player = instance.getPlayerByAnyId(socket.id);
    if (!player.isHost) {
      this.socketServer
        .to(socket.id)
        .emit(SocketEventsEmitting.ERROR_PLAYER_IS_NOT_ADMIN);
      return;
    }

    try {
      instance.startPlacingBoats(instance.gameSettings);

      this.socketServer
        .to(String(instance.id))
        .emit(SocketEventsEmitting.START_PLACING_BOATS);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      this.logger.error(
        SocketEventsListening.PLAYERS_READY_TO_PLACE_BOATS,
        error,
      );

      const eventName = this.getErrorEventName(error['code'], instance);

      this.socketServer.to(String(instance.id)).emit(eventName, error);
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
      instance.countDownAction(instance.turn);

      const isGameOver = instance.isGameOver();

      const turnRecapData: TurnRecap = {
        isGameOver: !!isGameOver,
        shotRecap: shotRecap,
        turn: instance.turn,
      };

      let finalRecapData: null | FinalTurnRecap = null;

      if (isGameOver) {
        delete turnRecapData.turn;
        finalRecapData = { ...turnRecapData, podiumRecap: isGameOver };
      }

      const roomData: RoomData<TurnRecap | FinalTurnRecap> = {
        data: finalRecapData ?? turnRecapData,
        instanceId: instance.id,
      };

      const eventName = turnRecapData.isGameOver
        ? SocketEventsEmitting.END_GAME
        : SocketEventsEmitting.SHOT;

      this.socketServer.to(instance.id).emit(eventName, roomData);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      this.logger.error(SocketEventsListening.SHOOT, error);

      const eventName = this.getErrorEventName(error['code'], instance);

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
      this.logger.error(SocketEventsListening.START_GAME, error);

      const eventName = this.getErrorEventName(error['code'], instance);

      this.socketServer.to(String(body.instanceId)).emit(eventName, error);
    }
  }

  /**
   * When a player has placed all his boats
   * @Returns An error if boats are misplaced or send an ok message to continue
   */
  @SubscribeMessage(SocketEventsListening.VALIDATE_PLAYER_BOATS_PLACEMENT)
  public onValidatePlayerBoatsPlacement(
    @MessageBody() body: RoomData<GameBoatSettings[]>,
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
      this.gameInstanceValidators.validateBoatNames(body.data);

      const storedBoats = this.gameEngine.getStoredBoatsForInstance(body.data);
      console.log(storedBoats);
      const playerFleet = instance.generateFleet(body.data, storedBoats);

      this.gameInstanceValidators.validateFleetOfOnePlayer(
        instance.gameSettings.authorisedFleet,
        instance.board,
        playerFleet,
      );

      const newPlayerReady = instance.players.find(
        (player) => player.socketId === socket.id,
      );
      if (!newPlayerReady) {
        this.socketServer
          .to(socket.id)
          .emit(SocketEventsEmitting.ERROR_PLAYER_NOT_FOUND);
      }

      instance.fleets[newPlayerReady.id] = playerFleet;

      const roomData: RoomData<GamePlayer> = {
        data: newPlayerReady,
        instanceId: instance.id,
      };

      const eventName =
        Object.keys(instance.fleets).length < instance.maxNumberOfPlayers
          ? SocketEventsEmitting.ONE_PLAYER_HAS_PLACED_HIS_BOATS
          : SocketEventsEmitting.ALL_PLAYERS_HAVE_PLACED_THEIR_BOATS;

      this.socketServer.to(String(roomData)).emit(eventName);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      this.logger.error(
        SocketEventsListening.VALIDATE_PLAYER_BOATS_PLACEMENT,
        error,
      );

      const eventName = error['code']
        ? this.getErrorEventName(error['code'], instance)
        : SocketEventsEmitting.ERROR_NOT_HANDLED;

      this.socketServer.to(String(body.instanceId)).emit(eventName, error);
    }
  }

  private validatePlayerCanJoinInstance(socket: Socket) {
    const existingInstance = this.gameEngine.getInstanceByPlayerSocketId(
      socket.id,
    );

    if (!existingInstance) {
      return true;
    }

    const roomData: RoomData<PlayersWithSettings> = {
      data: {
        players: existingInstance.players,
        settings: existingInstance.gameSettings,
      },
      instanceId: existingInstance.id,
    };

    this.socketServer
      .to(socket.id)
      .emit(SocketEventsEmitting.GAME_ALREADY_CREATED, roomData);

    return false;
  }
}

/**
 * Event orders
 *
 * 1a. [Front emit event] : CreateGame
 * 1b. [Back emit event] :  gameCreated | unableToCreateGame
 *
 * 2a. [Front emit event] : playerJoiningGame
 * 2b. [Back emit event] : playerJoined | GameNotFound / RoomComplete
 *
 * 3a. [Front emit event] : playersReadyToPlaceBoats
 * 3b. [Back emit event] : startPlacingBoats | gameNotFound
 *
 * 4a. [Front emit event] : validatePlayerBoatPlacement
 * 4b. [Back emit event] : onePlayerHasPlacedAllHisBoats | multiple errors
 * 4c. [Front emit event] : validatePlayerBoatPlacement
 * 4d. [Back emit event] : allPlayersHavePlacedTheirBoats | multiple errors
 *
 * 5a. [Front emit event] : StartGame
 * 5b. [Back emit event] : GameStarted | multiple errors
 *
 * Xa. [Front emit event] : Shoot
 * Xb. [Back emit event] : Shot / EndGame | multiple errors
 *
 * 7a. [Front emit event] : CloseRoom
 */
