import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/User'; 
import { Ft_AuthController } from './auth.controller';
import { Ft_AuthService } from './auth.service';


@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [Ft_AuthController],
  providers: [

    {
      provide: 'AUTH_SERVICE',
      useClass: Ft_AuthService,
    },
  ],
})
export class Ft_AuthModule {}
