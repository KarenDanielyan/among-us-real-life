import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gamehistory } from './GameHistory.entity';
import { GameController } from './GameHistory.controller';
import { GameService } from './GameHistory.service';

@Module({
  imports: [TypeOrmModule.forFeature([Gamehistory])],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService]
})
export class GameHistoryModule {}
