import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-linkedin-oauth2';
import { config } from 'dotenv';

import { Inject, Injectable } from '@nestjs/common';
import { configService } from 'src/config/config.service';
import { ClientProxy } from '@nestjs/microservices';
import { Provider } from 'src/auth/providers';
/** Call Env Variables */
config();

/**
 * Linkedin Authentication Strategy
 */
@Injectable()
export class LinkedInStrategy extends PassportStrategy(Strategy, 'linkedin') {

  /**
   * LinkedInStrategy Constructor
   * @param userServiceClient User Microservice Instance
   */
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {
    super({
      clientID: configService.getLinkedInClientId(),
      clientSecret: configService.getLinkedInSecret(),
      callbackURL: configService.getLinkedInRedirect(),
      scope: ['r_emailaddress', 'r_liteprofile'],
    });
  }

  /**
   * Validate Sign In/Up with Linkedin
   * @param accessToken Linkedin Access Token
   * @param refreshToken Linkedin Refresh Token
   * @param profile User Info
   * @param done Done Call Back Function
   */
  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    try {
      const validate = await this.userServiceClient.send('validateAuthByLinkedin', {
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