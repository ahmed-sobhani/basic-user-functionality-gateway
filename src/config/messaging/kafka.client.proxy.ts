import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { MESSAGE_CLIENT } from './messaging.constants';
import { ClientKafka } from '@nestjs/microservices';
// import { MESSAGES } from '../../config/messages';

@Injectable()
export class KafkaClientProxy implements OnModuleInit {
  constructor(@Inject(MESSAGE_CLIENT) public client: ClientKafka) {}

  async onModuleInit(): Promise<void> {
    // const messagePatternsForSubscribeToResponseOf: string[] = Object.values(MESSAGES).filter(msg => msg.reply).map(msg => msg.pattern);

    // for (const pattern of messagePatternsForSubscribeToResponseOf)
    //   this.client.subscribeToResponseOf(pattern);

    await this.client.connect();
  }
}
