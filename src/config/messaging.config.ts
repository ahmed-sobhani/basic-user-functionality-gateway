import { ClientsModuleAsyncOptions, KafkaOptions, Transport } from '@nestjs/microservices';
import { ClassProvider, Scope } from '@nestjs/common';
import { MESSAGE_BUS, MESSAGE_CLIENT } from './messaging/messaging.constants';
import { configService } from './config.service';
import { KafkaBus } from './messaging/messaing.kafka.bus';

export function createKafkaOptions(): KafkaOptions {
  const options: KafkaOptions = {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'gateway-client',
        brokers: configService.get<string>('KAFKA_BROKERS').split(','),
        connectionTimeout: 3000
      },
      consumer: {
        groupId: 'gateway-consumer',
        minBytes: Number(configService.get<string>('KAFKA_CONSUMER_MIN_BYTES')),
        maxBytes: Number(configService.get<string>('KAFKA_CONSUMER_MAX_BYTES')),
        maxWaitTimeInMs: Number(configService.get<string>('KAFKA_CONSUMER_MAX_WAIT_TIME_IN_MS'))
      },
      subscribe: {
        fromBeginning: true
      }
    }
  };

  if (configService.get<string>('KAFKA_SASL_AWS_MECHANISM_ENABLED') === 'true') {
    options.options.client.ssl = true;
    options.options.client.sasl = {
      mechanism: 'aws',
      authorizationIdentity: configService.get<string>('KAFKA_SASL_AWS_AUTHORIZATION_IDENTITY'),
      accessKeyId: configService.get<string>('KAFKA_SASL_AWS_ACCESS_KEY_ID'),
      secretAccessKey: configService.get<string>('KAFKA_SASL_AWS_SECRET_ACCESS_KEY'),
      sessionToken: configService.get<string>('KAFKA_SASL_AWS_SESSION_TOKEN')
    }
  }

  return options;
}

export const ClientsModuleAsyncProviderOptions: ClientsModuleAsyncOptions = [
  {
    name: MESSAGE_CLIENT,
    useFactory: createKafkaOptions
  }
]

export const busFactory: ClassProvider = {
  provide: MESSAGE_BUS,
  useClass: KafkaBus,
  scope: Scope.REQUEST
}
