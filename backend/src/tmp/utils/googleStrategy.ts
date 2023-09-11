import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy,Profile } from "passport-google-oauth20";
import { VerifyCallback } from "passport-oauth2";
import { AuthService } from "../auth.service";

export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private readonly authService: AuthService) {
      super({
        clientID: "313268611879-9nm02b6gb6r657fvl686cvtbuhmdf1vk.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: 'http://localhost:7000/auth/google/redirect',
        scope: ['email', 'profile'],
      });
    }
  
    async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<any> {
      const { name, emails, photos } = profile;
      const user = {
        firstName: name.givenName,
        lastName: name.familyName,
        email: emails[0].value,
        photo: photos[0].value,
        accessToken,
      };
      const result = await this.authService.validateOAuthLogin(user);
      done(null, result);
    }
  }
/* @Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) 
{
    constructor()
    {
        super({
            clientID:'313268611879-9nm02b6gb6r657fvl686cvtbuhmdf1vk.apps.googleusercontent.com',
            clientSecret:'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',
            callBackUrl:'http://localhost:7000/auth/google/redirect',
            scope:['profile','email']
        });
    }
    async validate(accessToken:string,reffreshToken:string,profile : Profile)
    {
        console.log(accessToken);
        console.log(reffreshToken);
        console.log(profile);
        
    }
} */