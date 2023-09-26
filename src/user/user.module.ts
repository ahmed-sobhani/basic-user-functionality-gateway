import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';
import { configService } from 'src/config/config.service';
import { UserController } from './user.controller';

/**
 * User Module
 */
@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    {
      provide: 'USER_SERVICE',
      useFactory: () => {
        const userServiceOptions = configService.getUserService();
        return ClientProxyFactory.create(userServiceOptions);
      },
    },
  ],
})
export class UserModule {}
