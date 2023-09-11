import {  MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    ConnectedSocket,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
let sockets = [];
@WebSocketGateway(5500,{
    cors:{
        origin:'*'
    }
})
export class GameServer {
    @WebSocketServer()
    server: Server;
    
    afterInit(server: Server){
    }
    handleConnection(client: Socket){
        //console.log('New connection gammeeee');
        const count = this.server.engine.clientsCount;
        //console.log("Connected clients: " + count);
        this.server.emit('participants',count);
        this.server.emit('online',client)
        //console.log("-----------------------");
        //console.log(client);
        //console.log("---------------------------");
        
        
        
    }
    handleDisconnect(client: Socket){
        //console.log('Disconnection');
        const count = this.server.engine.clientsCount;
        //console.log("Connected clients: " + count);
        this.server.emit('participants',count);
    }
    @SubscribeMessage('online')
    addUser(
        @MessageBody() userid: any,
        @ConnectedSocket() client: Socket,
        ) {
            //console.log("-----------------------------------------")
            //console.log("ONLINE", userid)
            //console.log("-----------------------------------------")

        sockets[userid] = client.id;
        client.emit("online", userid)
    }

    @SubscribeMessage('chat')
    handleChatMassage(
        @MessageBody() data: any,
        @ConnectedSocket() client: Socket,
        ) {
            //console.log("-----------------------------------------")            
        //console.log(data.data.id + ': ' + data.msg);     
        //console.log("-----------------------------------------")
        // socket.broadcast.emit('message', msg); // to all, but the sender
        // this.server.emit('message',data); // to all, including the sender
        this.server/*to(sockets[data.userid])*/.emit('chat',data); // to all, including the sender
        // client.emit('chat',data);
    }
    @SubscribeMessage('channels')
    handleChannelsMassage(
        @MessageBody() data: any,
        @ConnectedSocket() client: Socket,
        ) {
        //console.log('Channellog - Room: ' + data.room + ' | ' + data.username + ': ' + data.msg);     
        // socket.broadcast.emit('message', msg); // to all, but the sender
        // this.server.emit('message',data); // to all, including the sender
        this.server.to(data.room).emit('channels',data); // to all, including the sender
    }
    @SubscribeMessage('room')
    joinRoom(
        @MessageBody() room: string,
        @ConnectedSocket() client: Socket) {
        //console.log("Room: " + room);
        client.join(room);
    }
}