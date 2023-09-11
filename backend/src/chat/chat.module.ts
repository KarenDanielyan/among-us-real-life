import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { UsersModule } from '../Users/users.module';
import { GameService } from '../GameHistory/GameHistory.service';
import { Gamehistory } from '../GameHistory/GameHistory.entity';
import { GameHistoryModule } from '../GameHistory/GameHistory.module';
import { RoomService } from '../Game/services/room.service';
import { PongService } from '../Game/services/game.service';
import { GameController } from '../GameHistory/GameHistory.controller';
import { ChatGetway } from './chat.getway';

@Module({
  imports: [ScheduleModule.forRoot(), UsersModule,GameHistoryModule,UsersModule],
  controllers: [GameController],
  providers: [ChatGetway,RoomService, PongService]
})
export class ChatModule {}