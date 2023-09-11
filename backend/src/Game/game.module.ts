import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { GameGateway } from './game.gateway';
import { RoomService } from './services/room.service';
import { GameController } from './controllers/game.controller';
import { PongService } from './services/game.service';
import { UsersModule } from '../Users/users.module';
import { GameService } from '../GameHistory/GameHistory.service';
import { Gamehistory } from '../GameHistory/GameHistory.entity';
import { GameHistoryModule } from '../GameHistory/GameHistory.module';

@Module({
  imports: [ScheduleModule.forRoot(), UsersModule,GameHistoryModule,UsersModule],
  controllers: [GameController],
  providers: [GameGateway, RoomService, PongService]
})
export class GameModule {}