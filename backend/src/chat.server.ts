import { 
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    ConnectedSocket,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection
 } from '@nestjs/websockets';
import { UsersService } from './Users/user.service';
import { Server } from "socket.io";
import { Socket } from "socket.io";
import { RoomService } from './Game/services/room.service';

let sockets = [];
@WebSocketGateway(4001, { 
    cors: {
    origin:"*"
    }
})
export class ChatServer implements OnGatewayInit, OnGatewayConnection{
    @WebSocketServer()
    server: Server;
    constructor(
        // private readonly userService: UsersService,
        // private readonly roomService: RoomService,
      ) {}
    afterInit(server: Server){
      }
    handleConnection(client: Socket){
        console.log('New connection');
        const count = this.server.engine.clientsCount;
        console.log("Connected clients: " + count);
        this.server.emit('participants',count);
    }
    handleDisconnect(client: Socket){
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
            console.log("-----------------------------------------")            
        console.log(data.data.id + ': ' + data.msg);     
        console.log("-----------------------------------------")
        // socket.broadcast.emit('message', msg); // to all, but the sender
        // this.server.emit('message',data); // to all, including the sender
        //it need to recive the recipient user id
        this.server.to(data.userid).emit('chat',data); // to all, including the sender
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
    @SubscribeMessage('room')
    joinRoom(
        @MessageBody() room: string,
        @ConnectedSocket() client: Socket) {
        console.log("Room: " + room);
        client.join(room);
    }
}