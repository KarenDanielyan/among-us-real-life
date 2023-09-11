import { 
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    ConnectedSocket,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection
 } from '@nestjs/websockets';
import { UsersService } from '../Users/user.service';
import { Server } from "socket.io";
import { Socket } from "socket.io";
import { RoomService } from '../Game/services/room.service';
import { Player } from '../Game/interfaces/player.interface';
import { Input } from '../Game/interfaces/input.interface';
import { Room } from '../Game/interfaces/room.interface';
import { Injectable } from '@nestjs/common';

let sockets = [];
@WebSocketGateway(4001, { 
    transports:['polling','websocket'],
  cors: {
    origin:"*",
  },
  namespace: 'ping',
})

@Injectable()
export class ChatGetway {
    @WebSocketServer()
    server: Server;
    constructor(
        
        private readonly userService: UsersService,
        private readonly roomService: RoomService,
      ) {}
    afterInit(server: Server){
      }
      async handleConnection(@ConnectedSocket() client: Socket): Promise<any> {
        try
        {
           // console.log("dddddddddddddddd");
          //console.log('New connection',JSON.parse(client.handshake.auth.headers.USER).user.id);
          const user = await this.userService.findOneById(this.roomService.getUserFromSocket(client).id_42);
          ////console.log(user);
          console.log("dddddddddddddddddddddddddddddddddddd");
          console.log(user.id);
          
          console.log("dddddddddddddddddddddddddddddddddddd");

          
          if (!user) return client.disconnect();
          
          client.emit('info', { user });
        }
        catch {}
      }
    // handleConnections(client: Socket){
    //     console.log('New connection');
    //     const count = this.server.engine.clientsCount;
    //     console.log("Connected clients: " + count);
    //     this.server.emit('participants',count);
    // }
    handleDisconnects(client: Socket){
        console.log('Disconnection');
        const count = this.server.engine.clientsCount;
        console.log("Connected clients: " + count);
        this.server.emit('participants',count);
    }
    @SubscribeMessage('online')
    addUser(
        @MessageBody() userid: any,
        @ConnectedSocket() client: Socket,
        ) {
            console.log("-----------------------------------------")
            console.log("ONLINE", userid)
            console.log("-----------------------------------------")
        sockets[userid] = client.id;
        client.emit("online", userid)
    }

    @SubscribeMessage('chat')
    handleChatMassage(
        @MessageBody() data: any,
        @ConnectedSocket() client: Socket,
        ) {
          //console.log(data.data.id + ': ' + data.msg);     
          // socket.broadcast.emit('message', msg); // to all, but the sender
          // this.server.emit('message',data); // to all, including the sender
          //it need to recive the recipient user id
          // console.log("-----------------------------------------")
          //   console.log(`chat/${data.userid.id}`);
          //   console.log(data);
            
          // console.log("-----------------------------------------")
       
          //this.server.emit(`chat/${data.values.id1}`,data);
          this.server.emit(`chat/${data.values.id2}`,data);
          console.log(data.values.id2,data.values.id1);
          
          console.log("//////////////////////////////////////////////////////////////////////ffffffff/////////////////////////////////");
           // to all, including the sender
        // client.emit('chat',data);
    }
    @SubscribeMessage('channels')
    handleChannelsMassage(
        @MessageBody() data: any,
        @ConnectedSocket() client: Socket,
        ) {
        console.log('Channellog - Room: ' + data.room + ' | ' + data.username + ': ' + data.msg);     
        // socket.broadcast.emit('message', msg); // to all, but the sender
        // this.server.emit('message',data); // to all, including the sender
        this.server.to(data.room).emit('channels',data); // to all, including the sender
    }
    @SubscribeMessage('rooms')
    joinRooms(
        @MessageBody() room: string,
        @ConnectedSocket() client: Socket) {
        console.log("Room: " + room);
        client.join(room);
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
      joinQueue(@ConnectedSocket() client: Socket,@MessageBody() data:any,code?:string): void {
        
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