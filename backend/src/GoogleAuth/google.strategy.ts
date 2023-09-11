import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';

import { Injectable } from '@nestjs/common';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({
            clientID: '472681490682-cofucv7fr3j0v654ti873v4flktohgdq.apps.googleusercontent.com',
            clientSecret:'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',
            callbackURL: 'http://localhost:7000/auth/google/callback',
            scope: ['email', 'profile'],
            /*
                 client_id: '472681490682-cofucv7fr3j0v654ti873v4flktohgdq.apps.googleusercontent.com',
        client_secret: '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',
        redirect_uri: 'http://localhost:7000/auth/google/redirect',
        grant_type: 'authorization_code',
            */
        });
    }
    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        const { name, emails, photos } = profile
        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos[0].value,
            accessToken
        }
        done(null, user);
    }
}