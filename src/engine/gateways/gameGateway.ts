import { Logger, OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server as SocketServer } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class GameGateway implements OnModuleInit {
  public logger = new Logger();

  @WebSocketServer()
  public socketServer: SocketServer;

  public onModuleInit() {
    this.socketServer.on('connection', (socket) => {
      this.logger.log(`Socket ${socket.id} connected`);
    });
  }
}
