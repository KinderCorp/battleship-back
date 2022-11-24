import { Logger, OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server as SocketServer } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class GameGateway implements OnModuleInit {
  public logger = new Logger();

  @WebSocketServer()
  public server: Server;

  public onModuleInit() {
    this.server.on('connection', (socket) => {
      this.logger.log(`Socket ${socket.id} connected`);
    });
  }
}
