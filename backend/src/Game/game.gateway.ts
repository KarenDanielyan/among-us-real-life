import {
  ConnectedSocket,
  MessageBody,
    OnGatewayConnection,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
  } from '@nestjs/websockets';
  import { Socket } from 'socket.io';
  import { Input } from './interfaces/input.interface';
  import { RoomService } from './services/room.service';
  import { Player } from './interfaces/player.interface';
  import { Room } from './interfaces/room.interface';
  import { UsersService } from '../Users/user.service';
  import { Status } from '../enums/status.enum';
  import { Server } from "socket.io";
import { log } from 'console';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Injectable } from '@nestjs/common';
import { createServer, ServerOptions } from 'http';

// import { log } from 'console';

@WebSocketGateway(4000,{
  transports:['polling','websocket'],
  cors: {
    origin:"*",
  },
  namespace: 'pong',
})

@Injectable()
  export class GameGateway{
    constructor(
      private readonly userService: UsersService,
      private readonly roomService: RoomService,
    ) {}
    @WebSocketServer()
    server: any;
    afterInit(server: Server){
    }
    async handleConnection(@ConnectedSocket() client: Socket): Promise<any> {
      try
      {
       // //console.log("dddddddddddddddd");
        //console.log('New connection',JSON.parse(client.handshake.auth.headers.USER).user.id);
        const user = await this.userService.findOneById(this.roomService.getUserFromSocket(client).id_42);
        ////console.log(user);
        
        if (!user) return client.disconnect();
        
        client.emit('info', { user });
      }
      catch {}
    }
  
    async handleDisconnect(@ConnectedSocket() client: Socket): Promise<any> {
      try {
        
        //console.log("disconected",JSON.parse(client.handshake.auth.headers.USER).user.id);
        
        if (!this.roomService.getUserFromSocket(client)) return;
  
        await this.roomService.removeSocket(client);
        // await this.userService.setStatus(client.data.user.id, Status.ONLINE);
      } catch {}
    }
  
    @SubscribeMessage('queue')
    joinQueue(@ConnectedSocket() client: Socket,@MessageBody() data:any): void {
      
      try {
        
        if (!data) return;
        ////console.log(client);
        ////console.log(data.data.id);
        
       ////console.log("opoooooooooooooooooooooooooooo", client);
        this.roomService.addQueue(client,data);
      } catch {}
    }
  
    @SubscribeMessage('room')
    joinRoom(@ConnectedSocket() client: Socket, code?: string): void {
      try {
        if (!this.roomService.getUserFromSocket(client)) return;
  
        let room: Room = this.roomService.getRoom(code);
        if (!room) room = this.roomService.createRoom(code);
        //console.log("room emit",room);
        
        this.roomService.joinRoom(client, room);
      } catch {}
    }

  @SubscribeMessage('chat')
  handleChat(@ConnectedSocket() client:Socket,message?:string,code?:string):void{
    try {
      if(!message || !code) return;
      const user = this.roomService.getUserFromSocket(client)
      if (!user) return;

      let room: Room = this.roomService.getRoom(code);
      if (!room) return;
      //console.log("room emit",room,{userid:user.id,username:user.displayname,mes:message});
      
      RoomService.emit(room,'chat',{userid:user.id,username:user.displayname,mes:message})
    } catch {}
  }

    @SubscribeMessage('ready')
    onReady(@ConnectedSocket() client: Socket, input: Input): void {
      try {
        const user = this.roomService.getUserFromSocket(client);
        if (!user) return;
  
        const player: Player = this.roomService.getPlayer(user.id);
        if (!player) return;
  
        this.roomService.ready(player, input);
      } catch {}
    }
  
    @SubscribeMessage('start')
    onStart(@ConnectedSocket() client: Socket): void {
      try {
        // //console.log("stratt");
        
        ////console.log("{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{start game}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}]\n",client.handshake.auth.headers);
       // //console.log("{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{end scope of game}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}]");
        
        const user = this.roomService.getUserFromSocket(client);
        if (!user) return;
        // //console.log("game has been started", user.id);
        
        const player: Player = this.roomService.getPlayer(user.id);
        // //console.log("havayi______------------------____",player,player.room);
        
        if (!player || !player.room) return;
        ////console.log("pplplplplll--------------------------------------------------------p");
        RoomService.emit(player.room,'playerinfo',player.room.players[0].user,player.room.players[1].user,player.room.options);
        this.roomService.startCalc(player.room);
      } catch {}
    }
  
    @SubscribeMessage('tray')
    updateTray(@ConnectedSocket() client: Socket, @MessageBody() tray: number): void {
      try {
        
        const user = this.roomService.getUserFromSocket(client);
        ////console.log("trraaaaayyyyyyyyyyyyyyyyyyyyyy",user);
        if (!user) return;
        
        const player: Player = this.roomService.getPlayer(user.id);
        if (!player) return;
        //console.log("trraaaaayyyyyyyyyyyyyyyyyyyyyy", tray);
  
        player.tray = tray * player.room.options.display.height;
        //console.log("hrightttttttttt->",player.room.options.display.height);
        //console.log(player.tray)
        var pos = player.room.players[0].user.id == this.roomService.getUserFromSocket(player.socket).id ? "left" : "right";
        RoomService.emit(player.room, 'tray', pos, this.roomService.getUserFromSocket(player.socket).id, tray);
      } catch {}
    }
  }
  