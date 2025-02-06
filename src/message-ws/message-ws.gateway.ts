import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessageWsService } from './message-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces';

@WebSocketGateway({ cors: true })
export class MessageWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Server;

  constructor(
    private readonly messageWsService: MessageWsService,
    private readonly jwtService: JwtService,
  ) { }

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(token);
      await this.messageWsService.registerClient(client, payload.userId);
    } catch (error) {
      client.disconnect();
      return;
    }

    this.wss.emit(
      'clients-updated',
      this.messageWsService.getConnectedClients(),
    );
  }

  handleDisconnect(client: Socket) {
    this.messageWsService.removeClient(client.id);
    this.wss.emit(
      'clients-updated',
      this.messageWsService.getConnectedClients(),
    );
  }

  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client: Socket, payload: NewMessageDto) {
    console.log(payload)
    //!emite solo al id del cual recibe el mensaje: como una retro.
    // client.emit( 'message-from-server', {
    //   fullName: client.id,
    //   message: payload.message
    // });

    //Emitir a todos menos al cliente inicial.
    client.broadcast.emit('message-from-server', {
      fullName: client.id,
      message: payload.message,
    });

    // emitir para todos hasta para el que emite se toma el this.wss
    this.wss.emit('message-from-server', {
      fullName: this.messageWsService.getUserEmail(client.id),
      message: payload.message,
    });
  }

  handlesMessageEmit(item: string, payload: any) {
    this.wss.emit(item, payload)
  }


}
