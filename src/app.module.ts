import { Module } from '@nestjs/common';
import { ClientProxyFactory, ClientsModule } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configService } from './config/config.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { KafkaClientProxy } from './config/messaging/kafka.client.proxy';
import { ClientsModuleAsyncProviderOptions, busFactory } from './config/messaging.config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => configService.getMongoDBOptions(),
    }),
    UserModule,
    AuthModule,
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: './upload',
      }),
    }),
    ClientsModule.registerAsync(ClientsModuleAsyncProviderOptions),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    KafkaClientProxy,
    busFactory,
    {
      provide: 'USER_SERVICE',
      useFactory: () => {
        const userServiceOptions = configService.getUserService();
        return ClientProxyFactory.create(userServiceOptions);
      }
    }
  ],
})
export class AppModule { }
