import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gamehistory } from './GameHistory.entity';
import { CreateGameDto } from './CreateGameDto';
import { UpdateScoresDto } from './UpdateScoresDto';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Gamehistory)
    private gameRepository: Repository<Gamehistory>
  ) {}

  async getGameById(id: number): Promise<Gamehistory> {
    return await this.gameRepository.findOne({ relations: ['user', 'user2'], where: { id: id } });
  }

  async findAllGamesByUserId(userid: number): Promise<Gamehistory[]> {
    return await this.gameRepository.find({ relations: ['user', 'user2'], where: { user: { id: userid } } });
  }

  async createGame(createGameDto: CreateGameDto): Promise<Gamehistory> {
    console.log("here");
    const game = new Gamehistory();
    game.user = createGameDto.user1;
    game.user2 = createGameDto.user2;
    game.user1point = createGameDto.user1Score;
    game.user2point = createGameDto.user2Score;
    return await this.gameRepository.save(game);
  }

  async updateGameScore(gameId: number, updateScoresDto: UpdateScoresDto): Promise<Gamehistory> {
    const game = await this.gameRepository.findOne({ where: { id: gameId } });
    if (!game) {
      throw new NotFoundException('Game not found');
    }

    game.user1point = updateScoresDto.user1Score;
    game.user2point = updateScoresDto.user2Score;

    return await this.gameRepository.save(game);
  }
}