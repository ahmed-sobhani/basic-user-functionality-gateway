import {
    Injectable,
    Inject,
    CanActivate,
    ExecutionContext,
    HttpException,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';

/**
 * JWT Auth Guard
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

    /**
     * JwtAuthGuard Constructor
     * @param reflector Inject Reflector 
     * @param userServiceClient Inject User Microservice Instance
     */
    constructor(
        private readonly reflector: Reflector,
        @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
    ) {
        super();
    }

    /**
     * Check User Authentication
     * @param context Http Request Context
     * @returns If Authenticate user, return TRUE, Else FALSE
     */
    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.get<string[]>('isPublic', context.getHandler());
        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        if (!request?.headers?.authorization || !request?.headers?.authorization?.split('Bearer ')[1]) return false

        const userTokenInfo = await firstValueFrom(
            this.userServiceClient.send('jwtTokenDecode', {
                token: request.headers.authorization.split('Bearer ')[1],
            }),
        );
        if (!userTokenInfo || !userTokenInfo.data) {
            throw new HttpException(
                {
                    data: null,
                    errors: userTokenInfo.error,
                },
                userTokenInfo.status,
            );
        }

        request.user = userTokenInfo?.data?.user;
        return true;
    }
}