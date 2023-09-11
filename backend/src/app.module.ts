import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShutdownService} from './signal.service'
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './Users/user.controller';
import { UsersService } from './Users/user.service';
import { ChatServer } from './chat.server';
import { ChannelsModule } from './Channels/Channel.module';
import { UsersModule } from './Users/users.module';
import { ChannelUsersModule } from './ChannelUsers/ChannelUsers.module';
import { ChannelAdminsModule } from './ChannelAdmins/ChannelAdmins.module';
import { UserRepository } from './Users/user.repository';
import { User } from './Users/user.entity';
import { AddUsersService } from './AddUser/addUser.service';
import { AddUsersController } from './AddUser/addUsers.controller';
import { FriendController } from './UserFriend/UserFriend.controller';
import { UserFriendService } from './UserFriend/UserFriend.service';
import { UserFriend } from './UserFriend/UserFriend.entity';
import { AuthController } from './auth/auth.controller';
import { ChannelsController } from './Channels/Channels.controller';
import { AuthService } from './auth/auth.service';
import { GoogleController } from './GoogleAuth/google.controller';
import { GoogleService } from './GoogleAuth/google.service';
import { Ft_AuthController } from './ft_auth/auth.controller';
import { Ft_AuthService } from './ft_auth/auth.service';
import { ChannelUsersController } from './ChannelUsers/ChannelUser.controller';
import { ChannelMessagesModule } from './ChannelMessages/ChannelMessage.module';
import { ChannelMessagesController } from './ChannelMessages/ChannelMessages.controller';
import { GameHistoryModule } from './GameHistory/GameHistory.module';
import { GameController } from './GameHistory/GameHistory.controller';
import { DirectMessagesModule } from './DirectMessages/DirectMessage.module';
import { DirectMessagesController } from './DirectMessages/DirectMessages.controller';
import { MuteListModule } from './MuteList/MuteList.module';
import { MailModule } from './EmailService/mailer.module';
import { UserPinsModule } from './TwoFactor/Userpins.module';
import { GameServer } from './Game/Game.server';
import { GameModule } from './Game/game.module';
import { ImageController } from './ImageService/image.controller';
import configg from './ormconfig';
import { ChatModule } from './chat/chat.module';
import { ChatGetway } from './chat/chat.getway';
import { RoomService } from './Game/services/room.service';
import { PongService } from './Game/services/game.service';
import { MuteChatsModule } from './MuteChats/MuteChats.module';
import { MuteChatsController } from './MuteChats/MuteChats.controller';


  @Module({
    imports: [
      ConfigModule.forRoot({isGlobal:true}),
      TypeOrmModule.forRoot(configg),
      ChannelUsersModule,
      ChannelAdminsModule,
      ChannelsModule,
      ChannelMessagesModule,
      DirectMessagesModule,
      MuteListModule,
      MuteChatsModule,
      UserPinsModule,
      GameHistoryModule,
      GameModule,
      MailModule,
      UsersModule,
      TypeOrmModule.forFeature([User, UserRepository,UserFriend]),
      ChatModule,
    ],

    controllers: [AppController,UsersController, AddUsersController,FriendController,AuthController, ChannelsController,
      ChannelUsersController, GoogleController,Ft_AuthController, ChannelMessagesController, GameController, DirectMessagesController, ImageController, MuteChatsController],
    providers: [AppService, ShutdownService,UsersService,AddUsersService,UserFriendService,AuthService, GoogleService,Ft_AuthService,GameServer,RoomService,PongService],
  })
  export class AppModule {
    constructor(){
      console.log("app module called");
      // console.log("============================");
      // console.log(configg);
      // console.log("============================");
    /*   // createPostgreSQLConnection();
     let  UID = "Your application uid"
     let SECRET = "Your secret token"
    // Create the client with your credentials
    let client = OAuth2.Client.new(UID, SECRET, site: "https://api.intra.42.fr")
    //   Get an access token
     let token = client.client_credentials.get_token */
      
    }
  }
