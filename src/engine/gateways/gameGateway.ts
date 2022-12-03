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
  BaseGameConfiguration,
  GameBoat,
  GameConfiguration,
  GameMode,
  GamePlayer,
  GameState,
  Room,
  RoomData,
} from '@interfaces/engine.interface';
import GameEngine from '@engine/game-engine';
import GameInstanceService from '@engine/game-instance.service';
import GameInstanceValidatorsService from '@engine/game-instance-validators.service';

interface Game {
  id: string;
  players: GamePlayer[];
}

@WebSocketGateway({ cors: { origin: '*' } })
export class GameGateway implements OnGatewayConnection {
  public logger = new Logger();
  public games: Game[] = [];

  @WebSocketServer()
  public socketServer: SocketServer;

  public constructor(
    private gameEngine: GameEngine,
    private gameInstanceValidators: GameInstanceValidatorsService,
  ) {}

  public handleConnection(socket: Socket) {
    this.logger.log(`Socket ${socket.id} connected`);
    this.socketServer.emit('connected', 'User bien reçu');
  }
  public handleDisconnect(socket: Socket) {
    this.logger.log(`Socket ${socket.id} disconnected`);
  }

  /**
   * When a player click on "create game" button
   */
  @SubscribeMessage('CreateGame')
  public onCreateGame(
    @MessageBody() body: GamePlayer,
    @ConnectedSocket() socket: Socket,
  ): void {
    // TASK Add verification of the player object (use class-validator)
    // If player is valid, create a game instance service and store it in game engine "instances" (property of the class)
    // Otherwise, we send an error message

    const baseGameConfiguration: BaseGameConfiguration = {
      firstPlayer: body,
      gameMode: GameMode.OneVersusOne,
      state: GameState.waitingToStart,
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
    this.socketServer.to(socket.id).emit('GameCreated', room);

    // NOT TESTED - IMPOSSIBLE TO MAKE THE FRONT WORK
    // NOT TESTED - IMPOSSIBLE TO MAKE THE FRONT WORK
    // NOT TESTED - IMPOSSIBLE TO MAKE THE FRONT WORK
    // NOT TESTED - IMPOSSIBLE TO MAKE THE FRONT WORK
    // NOT TESTED - IMPOSSIBLE TO MAKE THE FRONT WORK
    // NOT TESTED - IMPOSSIBLE TO MAKE THE FRONT WORK
    // NOT TESTED - IMPOSSIBLE TO MAKE THE FRONT WORK
  }

  /**
   * When players can place their boats
   */
  @SubscribeMessage('playersReadyToPlaceTheirBoats')
  public onGameConfiguration(
    @MessageBody() body: RoomData<Omit<GameConfiguration, 'boats'>>,
  ): void {
    // TODO: Call all game configurations functions from the game engine service

    // gameInstance.startPlacingBoats()
    // If everything's okay, players can place their boats
    // Otherwise, we send an error

    this.socketServer
      .to(String(body.instanceId))
      .emit('startPlacingBoats', body);
  }

  /**
   * When a player join an existing game
   * @param body a GamePlayer and the game id to join
   */
  @SubscribeMessage('playerJoiningGame')
  public onPlayerJoin(
    @MessageBody() body: RoomData<GamePlayer>,
    @ConnectedSocket() socket: Socket,
  ): void {
    const game = this.games.find((game) => game.id === body.instanceId);
    if (!game) {
      this.socketServer.to(socket.id).emit('GameNotFound');
      return;
    }

    // Check players length. If length === 2, send an error
    // validate player before pushing it to players list
    // instance.players.push(new player);
    // If it's a guest player, use his socket id as temporary id

    socket.join(body.instanceId);
    this.socketServer.to(String(body.instanceId)).emit('UserJoined', game);
    // After emitting user join event, we wait the game owner to click on "start placing boats" button
  }

  /**
   * When a player has placed all his boats
   * @Returns An error if boats are misplaced or send an ok message to continue
   */
  @SubscribeMessage('validatePlayerBoatPlacement')
  public onSettingBoat(
    @MessageBody() body: RoomData<GameBoat[][]>,
    @ConnectedSocket() socket: Socket,
  ): void {
    // Create a function to validate boats of the player
    // If everything's okay, we send an ok message to notify the client that one player is ready to start
    // If the other player is already ready, we emit a different message (e.g. allPlayersHavePlacedTheirBoats)
    // Otherwise, we send an error message to inform the player that his boats are misplaced

    this.socketServer.to(socket.id).emit('boatsAreMisplaced');
    this.socketServer
      .to(String(body.instanceId))
      .emit('onePlayerHasPlacedAllHisBoats', body);
    this.socketServer
      .to(String(body.instanceId))
      .emit('allPlayersHavePlacedTheirBoats', body);
  }

  /**
   * When a player clicks on a cell to shoot
   * @param body contains the targetedPlayer, the weapon, and the origin cell (cell where the player has clicked)
   * @Returns An error if shot isn't valid or the result of the shot
   */
  @SubscribeMessage('Shoot')
  public onShoot(
    @MessageBody() body: Game,
    @ConnectedSocket() socket: Socket,
  ): void {
    const game = this.games.find((game) => game.id === body.id);
    if (!game) {
      this.socketServer.to(socket.id).emit('GameNotFound');
      return;
    }

    // TODO: Call the shoot game instance fn and process to validate turn

    this.socketServer.to(game.id).emit('Shooted', game);
  }

  /**
   * When all boats has been validated and players are ready, we start the game
   * We check that everything's okay to start the game
   */
  @SubscribeMessage('StartGame')
  public onStartingGame(
    @MessageBody() body: RoomData<GameConfiguration>,
  ): void {
    // TODO: Call all starting game functions from the game engine service

    // We check that everything's okay to start the game
    // If everything's okay, we return the first player and we wait his action (shoot event)
    // Otherwise, we return an error message

    this.socketServer.to(String(body.instanceId)).emit('GameStarted', body);
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
 * Xb. [Back emit event] : Shooted / EndGame | ERROR - not defined yet
 *
 * 7a. [Front emit event] : CloseRoom
 */
