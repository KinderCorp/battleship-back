import { MessageBody, OnGatewayConnection , SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Socket, Server as SocketServer } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ cors: { origin: '*' } })
export class GameGateway implements OnGatewayConnection  {
  public logger = new Logger();

  @WebSocketServer()
  public socketServer: SocketServer;

  public handleConnection(socket: Socket) {
    this.logger.log(`Socket ${socket.id} connected`);
    this.socketServer.emit('connected', 'User bien reçu')
  }
  public handleDisconnect(socket: Socket) {
    this.logger.log(`Socket ${socket.id} disconnected`);
  }

  @SubscribeMessage('UserJoin')
  public onNewMessage(@MessageBody() body: string) {
    this.logger.log(body);
    this.socketServer.emit('UserReceived', 'User bien reçu')
  }
}
