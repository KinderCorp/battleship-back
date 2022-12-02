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

// Simulated interfaces for the example
interface Player {
  id: string;
  pseudo: string;
}
interface Game {
  id: string;
  players: Player[];
}

@WebSocketGateway({ cors: { origin: '*' } })
export class GameGateway implements OnGatewayConnection {
  public logger = new Logger();

  // Simulated table of all games instances
  public games: Game[] = [];

  @WebSocketServer()
  public socketServer: SocketServer;

  public handleConnection(socket: Socket) {
    this.logger.log(`Socket ${socket.id} connected`);
    this.socketServer.emit('connected', 'User bien reçu');
  }
  public handleDisconnect(socket: Socket) {
    this.logger.log(`Socket ${socket.id} disconnected`);
  }

  @SubscribeMessage('CreateGame')
  public onCreateGame(
    @MessageBody() body: Player,
    @ConnectedSocket() socket: Socket,
  ): void {
    // Simplified exemple of a new game instance/class
    const newGame: Game = {
      id: 'eb4eae0e-6e6a-43bf-be3f-6c82aca2990d',
      players: [],
    };

    // After verifications, we push the first player in the game's players table and save it
    newGame.players.push(body);
    this.games.push(newGame);

    // Then the first player join the new game room
    // Room's name will probably corresponds to the game.id (we can change it if you want)
    // "console.log(socket.rooms" to see all rooms in which the player (socket) is.
    socket.join(String(newGame.id));

    // And we return all of this by emiting only to game owner
    this.socketServer.to(socket.id).emit('GameCreated', newGame);
  }

  @SubscribeMessage('Shoot')
  public onShoot(
    @MessageBody() body: Game,
    @ConnectedSocket() socket: Socket,
  ): void {
    // Check if the game with this id (body) exists (maybe refacto this duplicate code from lines 39-43)
    const game = this.games.find((game) => game.id === body.id);
    if (!game) {
      // Throw an error and emit it
      this.socketServer.to(socket.id).emit('GameNotFound');
      return;
    }

    // Call the game engine and process to validate turn
    // But I haven’t thought about that yet

    // Emit the result to the game's room
    this.socketServer.to(game.id).emit('Shooted', game);
  }

  @SubscribeMessage('JoinGame')
  public onUserJoin(
    @MessageBody() body: any,
    @ConnectedSocket() socket: Socket,
  ): void {
    // Check if the game with this id (body) exists
    const game = this.games.find((game) => game.id === body.gameId);
    if (!game) {
      // Throw an error and emit it
      this.socketServer.to(socket.id).emit('GameNotFound');
      return;
    }

    // Call the game engine and process to add the second player with something like this:
    // const updatedGame = GameEngine.addRival(body.player);
    const updatedGame = {};

    // Emit the result to the game's room
    socket.join(body.gameId);
    this.socketServer.to(String(body.gameId)).emit('UserJoined', updatedGame);
  }
}
