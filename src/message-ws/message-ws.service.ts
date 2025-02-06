import { Inject, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Users } from 'src/users/entities'; 

interface ConnectedClients {
  [id: string]: {
    socket: string;
    email: string;
    fullName: string;
  };
} 

@Injectable()
export class MessageWsService {
  private connectedClients: ConnectedClients = {};

  constructor(
    @Inject('USERS_REPOSITORY')
    private readonly usersRepository: typeof Users,
  ) {}

  async registerClient(client: Socket, userId: string) {
    const user = await this.usersRepository.findByPk(userId);

    if (!user) throw new Error('User not found'); 

    this.connectedClients[client.id] = {
      socket: client.id,
      email: user.email,
      fullName: user.name
    };

    console.table(this.connectedClients)
  }

  removeClient(clientId: string) {
    delete this.connectedClients[clientId];
    console.table(this.connectedClients)
  }

  getConnectedClients(): any {
    return Object.keys(this.connectedClients);
    return this.connectedClients;
  }

  getUserEmail(socketId: string) {
    return this.connectedClients[socketId].email;
  }
}
