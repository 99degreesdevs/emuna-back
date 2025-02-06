import { Module } from '@nestjs/common';
import { MessageWsService } from './message-ws.service';
import { MessageWsGateway } from './message-ws.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [MessageWsGateway, MessageWsService],
  imports: [ AuthModule, UsersModule ],
  exports: [MessageWsGateway]
})
export class MessageWsModule {}
