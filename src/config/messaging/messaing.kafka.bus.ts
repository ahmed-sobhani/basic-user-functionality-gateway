import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
  UnauthorizedException
} from '@nestjs/common';
import { Bus, BusOptionsArgument } from './messaging.bus';
import { ExceptionStatus, IExceptionResponse, RequestContext } from '../dto';
import { KafkaClientProxy } from './kafka.client.proxy';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class KafkaBus implements Bus {
  constructor(private kafkaClientProxy: KafkaClientProxy,
    @Inject(REQUEST) private request: RequestContext) {}

  publish<TRequest>(pattern: string, message: TRequest): void {
    this.kafkaClientProxy.client.emit(pattern, message).subscribe();
  }

  async send<TRequest, TResult>(pattern: string, message?: TRequest, options?: BusOptionsArgument): Promise<TResult> {
    try {
      const batch = { value: message };
      this.resolveHeaders(batch, options);

      return await this.kafkaClientProxy.client.send<TResult>(pattern, batch).toPromise();
    } catch (e) {
      if (options?.sendNullOnException)
        return null;
      throw KafkaBus.handleException(e);
    }
  }

  private resolveHeaders(batch: any, options?: BusOptionsArgument): void {
    if (this.request['requestId']) {
      batch.headers = {
        'requestId': this.request['requestId']
      }
    }

    if (options?.headers) {
      batch.headers = {
        ...options.headers,
        ...batch.headers
      };
      return;
    }

    if (this.request.user?.id) {
      batch.headers = {
        'userId': this.request.user.id.toString(),
        ...batch.headers
      };
      return;
    }
  }

  private static handleException(exception: IExceptionResponse): any {
    switch (exception.status) {
      case ExceptionStatus.BAD_REQUEST:
        return new BadRequestException(exception.message);
      case ExceptionStatus.NOT_FOUND:
        return new NotFoundException();
      case ExceptionStatus.UNAUTHORIZED:
        return new UnauthorizedException(exception.message);
      case ExceptionStatus.FORBIDDEN:
        return new ForbiddenException(exception.message);
      default:
        return new Error(Array.isArray(exception.message)
          ? exception.message.join(';')
          : exception.message);
    }
  }
}
