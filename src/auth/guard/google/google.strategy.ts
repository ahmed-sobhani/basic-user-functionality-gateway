import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';

import { Inject, Injectable } from '@nestjs/common';
import { configService } from 'src/config/config.service';
import { ClientProxy } from '@nestjs/microservices';
import { Provider } from 'src/auth/providers';
/** Call Env Variables */
config();

/**
 * Goole Authentication Strategy
 */
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  /**
   * GoogleStrategy Constructor
   * @param userServiceClient User Microservice Instance
   */
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {
    super({
      clientID: configService.getGoogleClientId(),
      clientSecret: configService.getGoogleSecret(),
      callbackURL: configService.getGoogleRedirect(),
      scope: ['email', 'profile'],
    });
  }

  /**
   * Validate Sign In/Up with Goole
   * @param accessToken Google Access Token
   * @param refreshToken Google Refresh Token
   * @param profile User Info
   * @param done Done Call Back Function
   */
  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    try {
      const validate = await this.userServiceClient.send('validateAuthByGoogle', {
        profile,
        provider: Provider.GOOGLE
      }).toPromise();
      if (validate?.data) {
        done(null, validate?.data);
      } else {
        done(validate?.error, false);
      }
    }
    catch (err) {
      // console.log(err)
      done(err, false);
    }
  }
}