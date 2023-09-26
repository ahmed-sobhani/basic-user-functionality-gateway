import { Body, Controller, Get, HttpException, Inject, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LoginDto, LoginType } from './dto/login.dto';
import { Response } from 'express';
import { CreateUserDto } from 'src/user/dto/create.user.dto';
import { AuthGuard } from '@nestjs/passport';

/**
 * Authentication Controller (Endpoints APIs)
 */
@Controller('auth')
export class AuthController {
    /**
     * AuthController Constructor
     * @param userServiceClient Inject User Microservice Instance
     */
    constructor(
        @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
    ) { }

    /**
     * User Register API
     * @param body User Info Type: CreateUserDto
     * @param response Express Response Object 
     */
    @Post('register')
    public async register(
        @Body() body: CreateUserDto,
        @Res() response: Response): Promise<any> {
        try {
            let data = await this.userServiceClient.send('register', body).toPromise();;
            response
                .status(data?.status)
                .send(data);
        } catch (err) {
            console.error("----------- err", err)

            throw new HttpException(err, err?.status)
        }
    }

    /**
     * User Login API
     * @param body User Info, Type: LoginDto
     * @param response Express Response Object 
     */
    @Post('login')
    public async login(
        @Body() body: LoginDto,
        @Res() response: Response): Promise<any> {
        try {
            let data: any = null;
            switch (body.type) {
                case LoginType.EMAIL:
                    data = await this.userServiceClient.send('loginByEmail', {
                        password: body.password,
                        email: body.user
                    }).toPromise();
                    break;
                case LoginType.USERNAME:
                    data = await this.userServiceClient.send('loginByUserName', {
                        password: body.password,
                        userName: body.user
                    }).toPromise();
                    break;
                case LoginType.PHONE:
                    data = await this.userServiceClient.send('loginByPhone', {
                        password: body.password,
                        phoneNumber: body.user
                    }).toPromise();
                    break;
                default:
                    data = await this.userServiceClient.send('loginByUnique', {
                        password: body.password,
                        user: body.user
                    }).toPromise();
                    break;
            }
            response
                .status(data?.status)
                .send(data);
        } catch (err) {
            console.error("----------- err", err)
            throw new HttpException(err, err?.status)
        }
    }

    /**
     * Google Sign In/Up Endpoint
     */
    @Get('google')
    @UseGuards(AuthGuard('google'))
    googleLogin() {
        // initiates the Google OAuth2 login flow
    }

    /**
     * Google Sign In/Up Auth Response
     * @param req Http Request Object
     * @param response Express Response Object 
     * @returns If Logged in, Status 200, User Info and JWT Token
     */
    @Get('google/redirect')
    @UseGuards(AuthGuard('google'))
    googleLoginCallback(@Req() req,
    @Res() response: Response) {
        // handles the Google OAuth2 callback
        console.log("google user: ", req?.user)
        response
                .status(200)
                .send(req?.user);
        return req?.user
        // redirect to frontend pages
    }
}
