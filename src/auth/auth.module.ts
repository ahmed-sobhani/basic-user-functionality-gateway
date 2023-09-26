import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';
import { configService } from 'src/config/config.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './guard/google/google.strategy';
import { JwtAuthGuard } from './guard/jwt/jwt.guard';

/**
 * Authentication Module
 */
@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: 'USER_SERVICE',
      useFactory: () => {
        const userServiceOptions = configService.getUserService();
        return ClientProxyFactory.create(userServiceOptions);
      }
    },
    JwtAuthGuard, GoogleStrategy
  ],
  exports: [GoogleStrategy]
})
export class AuthModule { }
