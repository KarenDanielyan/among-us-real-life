import { Controller, Get, Post, Delete, Param, Body, Put, Res } from '@nestjs/common';
import { Gamehistory } from './GameHistory.entity';
import { CreateGameDto } from './CreateGameDto';
import { UpdateScoresDto } from './UpdateScoresDto';
import { GameService } from './GameHistory.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get(':id')
  async getGameById(@Param('id') id: number, @Res() res): Promise<Gamehistory> {
    return res.send(await this.gameService.getGameById(id));
  }

  @Post('create')
  async createGame(@Body() createGameDto: CreateGameDto, @Res() res): Promise<Gamehistory> {
    return res.send(await this.gameService.createGame(createGameDto));
  }

  @Put(':id/scores')
  async updateGameScore(
    @Param('id') gameId: number,
    @Body() updateScoresDto: UpdateScoresDto,
    @Res() res) {
    return res.send(await this.gameService.updateGameScore(gameId, updateScoresDto));
  }

  @Get('user/:userId')
  async findAllGamesByUserId(@Param('userId') userId: number, @Res() res) {
    return res.send(await this.gameService.findAllGamesByUserId(userId));
}
}