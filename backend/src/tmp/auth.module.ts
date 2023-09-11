import { Get, Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { GoogleStrategy } from "./utils/googleStrategy";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";

@Module({
    imports: [
      PassportModule,
      PassportModule.register({ defaultStrategy: 'google' }),
    ],
    providers: [
      GoogleStrategy,
      AuthService
    ],
  })
  export class AuthModule {}

/* @Module({
    controllers:[AuthController],
    providers:[GoogleStrategy],
})
export class AuthModule {
    
} */