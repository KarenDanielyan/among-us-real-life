import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { Socket } from 'socket.io';
import { GameService } from '../../GameHistory/GameHistory.service';
import { Input, Mode, Plan } from '../interfaces/input.interface';
import { Option } from '../interfaces/option.interface';
import { Player } from '../interfaces/player.interface';
import { Room, State } from '../interfaces/room.interface';
import { PongService } from './game.service';
import { CreateGameDto } from '../../GameHistory/CreateGameDto';
import { ConnectedSocket } from '@nestjs/websockets';
import { json } from 'node:stream/consumers';
import { UsersService } from '../../Users/user.service';


@Injectable()
export class RoomService {
  constructor(
    private readonly pong: PongService,
     private readonly gameHistoryService: GameService,
     private readonly userService: UsersService
  ) {}
  static options: Option = Object.freeze({
    display: { width: 1920, height: 1080 },
    ball: { speed: 10, radius: 5 },
    tray: { width: 20, height: 200, x: 50 },
    score: { y: 15, max: 5 },
    input: { plan: Plan.DEFAULT, mode: Mode.NONE },
  });

  queue: Array<Socket> = [];
  rooms: Map<string, Room> =  new Map();

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static emit(room: Room, event: string, ...args: any): void {
    ////console.log(room);
    
    for (const player of room.players) {
     // //console.log(player);
       
      player.socket.emit(event, ...args)};
  }

  async removeSocket(socket: Socket): Promise<any> {
    if (this.queue.indexOf(socket) != -1)
      return this.queue.splice(this.queue.indexOf(socket), 1);

    for (const room of this.rooms.values()) {
      if (room.spectators && room.spectators.indexOf(socket) != -1)
        return room.spectators.splice(room.spectators.indexOf(socket), 1);

      for (const player of room.players)
        if (player.socket.id == socket.id) {
          await this.stopGame(
            room,
            room.players.find((player1) => player1.user.id != player.user.id),
          );
          room.players.splice(room.players.indexOf(player), 1);
          break;
        }
      if (!room.players.length) return this.rooms.delete(room.code);
    }
  }

  addQueue(@ConnectedSocket() socket: Socket, data : any): void {
    //console.log("sock",socket);
    
    
    
    for (const socket1 of this.queue)
    {
      // console.log("==================================");
      // console.log( "dataaa=>" ,this.getUserFromSocket(socket1).id,data.data.id);
      // console.log("==================================");
      // console.log("|||||||||||||||||||||||||||||||||||||||||||||||||||");
      // console.log(this.getUserFromSocket(socket1).id == data.data.id);

      // console.log("|||||||||||||||||||||||||||||||||||||||||||||||||||");
      
        
      if (this.getUserFromSocket(socket1).id == data.data.id)
      {
        console.log("artenn kaaaaaaaaaaaaaaaaaa");
        return
      };
    }
    if (this.getPlayer(data.data.id))
    {
      console.log("finnnd");
      
      return
    };
    
    this.queue.push(socket);
    if (this.queue.length < 2) return;

    const room: Room = this.createRoom();
    while (this.queue.length && room.players.length < 2)
    {
      ////console.log(this.queue.length);
      ////console.log(room.players.length);
      this.joinRoom(this.queue.shift(), room);
      ////console.log("rooooooooooooooooooom",room);
      ////console.log(this.queue.length);
      ////console.log(room.players.length);
    }
      
  }

  createRoom(code: string = null): Room {
    ////console.log("afsfsgsg");
    
    while (!code) {
      const length = 10;
      const generated = Math.floor(
        Math.random() * Math.pow(16, length),
      ).toString(16);
      if (!this.rooms.has(generated)) code = generated;
    }

    const room: Room = {
      code,
      state: State.WAITING,
      players: [],
      options: JSON.parse(JSON.stringify(RoomService.options)),
      ball: { position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 } },
      speed: 0,
    };
    this.rooms.set(code, room);
   //console.log("roooom",this.rooms.values(),"\nroom size =>",this.rooms.size);
    
    return room;
  }

  joinRoom(socket: Socket, room: Room): void {

    console.log("aaaaaaaaaaaaaa------------------------------a")
    if (room.state == State.WAITING) {
      const player: Player = {
        socket,
        user: this.getUserFromSocket(socket),
        room,
        input: null,
        tray: RoomService.options.display.height / 2,
        score: 0,
      };
      room.players.push(player);
      ////console.log("lengthhhhhh", room.players.length);
      ////console.log("___________----------------------_____________________------------------");
      ////console.log("finisheeeeedddd");
      if (room.players.length == 2) 
      {
        ////console.log("mtelaaaaaaaaaaaaa");
        room.state = State.STARTING
      };
    } 
    else {
      ////console.log("elsssseeeeeeee");
      ////console.log("elsssseeeeeeee");
      ////console.log("elsssseeeeeeee");
      ////console.log("elsssseeeeeeee");
      ////console.log("elsssseeeeeeee");
      
      if (!room.spectators) room.spectators = [];
      room.spectators.push(socket);

      socket.emit(
        'ready',
        room.options,
        room.players.map((player) => player.user),
      );
    }
    //const rm = JSON.stringify(room);
   // //console.log("00000000000000000000000000000000");
    
    ////console.log(await json.toString(room));
    ////console.log("rooooooooooooooooommmm",room,this.rooms.values());
    ////console.log(room.players[0].user.id);
    // console.log("000000000000000000000000000000000000000000000000000000000");
    
    // console.log(room.code,room.players[0].user.id,room.code,room.players[1].user.id)
    // console.log("000000000000000000000000000000000000000000000000000000000");

     socket.emit('room',room.code);
     
  }

  getPlayer(userId: number): Player {
    //////console.log("userid =>",userId);
    ////console.log("room size",this.rooms);
    
    for (const room of this.rooms.values())
      for (const player of room.players)
      {
        //////console.log("plplplpll",player);
       // //console.log("'''''''''''''''''''''''''''''''''''''''''''''''ddddddddddddddddddddddddddddddddddddd'''''''");
        
       // //console.log(player);
       // //console.log("'''''''''''''''''''''''''''''''''''''''''''''''ddddddddddddddddddddddddddddddddddddd'''''''");
        
        if (player.user.id == userId) return player;
      }
    return null;
  }

  getRoom(code: string): Room {
    return this.rooms.get(code);
  }

  ready(player: Player, input: Input): void {
    player.input = input;
    this.startGame(player.room);
  }

  startGame(room: Room): void {
     if (room.state != State.STARTING) return;
    for (const player of room.players) if (!player.input) return;
    room.state = State.COUNTDOWN;

    room.options.input.plan =
      room.players[Math.round(Math.random())].input.plan;
    room.options.input.mode =
      room.players[Math.round(Math.random())].input.mode;

    if (room.options.input.mode == Mode.SPEED) {
      room.options.ball.radius = 10;
      room.options.ball.speed = 4;
    } else if (room.options.input.mode == Mode.SMALL)
      room.options.tray.height = 100;

    RoomService.emit(
      room,
      'ready',
      room.options,
      room.players.map((player) => player.user),
    );
  }

  startCalc(room: Room): void {
    //if (room.state != State.COUNTDOWN) return;
    //console.log(";;;;;;;;;;;;;;;;;;;;;;;start calc ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;");
    

    this.pong.resetBall(room);
    room.state = State.INGAME;
  }

  @Interval(1000 / 40)
  loop(): void {

    for (const room of this.rooms.values())
    {
      if (room.state == State.INGAME) this.pong.update(room);
      if(room.state == State.END) return;
    }
  }

  async stopGame(room: Room, player: Player): Promise<void> {
    if (!player) return;
    if (room.state == State.END) return;
    room.state = State.END;

    if (room.players.length == 2) {
      const loser = room.players.find(
        (player1) => player1.user.id != player.user.id,
      ).user;
      const winner = player.user;
      const score = room.players.map((player) => player.score);

      const game = new CreateGameDto();
      game.user1 = room.players[0].user;
      game.user2 = room.players[1].user;
      game.user1Score = score[0];
      game.user2Score = score[1];
      const gg = {
        user1:game.user1,
        user2:game.user2,
        user1Score:game.user1Score,
        user2Score:game.user2Score
      }
      // await this.gameHistoryService.createGame(game);
      console.log("historyyyyyyyyyyyyyy");
      console.log(gg);
      this.gameHistoryService.createGame(gg)
      console.log(winner);
      console.log(loser);
      await this.userService.updateGameStats(winner, true)
      await this.userService.updateGameStats(loser, false)
      
    }
    RoomService.emit(room, 'stop', player.user);
    for (const player of room.players) {
        this.removeSocket(player.socket);
   }
  }

  getRoomForUser(userId: number): Room {
    const rooms = Array.from(this.rooms.values());
    const room = rooms.find(
      (room) => !!room.players.find((player) => player.user.id == userId),
    );
    if (!room) throw new HttpException('Room not found', HttpStatus.NOT_FOUND);

    return room;
  }

  getUserFromSocket(socket: Socket) {
    ////console.log(socket.handshake);
    
    return JSON.parse(socket.handshake.auth.headers.USER).user;
  }
}
