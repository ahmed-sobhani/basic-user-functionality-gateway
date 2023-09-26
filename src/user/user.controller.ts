import { Body, Controller, DefaultValuePipe, Delete, Get, HttpException, HttpStatus, Inject, Param, ParseIntPipe, Patch, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CheckEmailUniqueDto, CheckPhoneNumberUniqueDto, CheckUserNameUniqueDto } from './dto/check.unique.dto';
import { CreateUserDto } from './dto/create.user.dto';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guard/jwt/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { filter, storage } from 'src/config/storage.config';

/**
 * User Controller (Endpoints API)
 */
@Controller('user')
export class UserController {
    /**
     * UserController Constructor
     * @param userServiceClient Inject User Microservice Instance
     */
    constructor(
        @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
    ) { }

    /**
     * Create User
     * @param body CreateUserDto Object 
     * @param response Express Response Object
     * @returns Created User
     */
    @Post('')
    @UsePipes(new ValidationPipe())
    public async createUser(@Body() body: CreateUserDto, @Res() response: Response): Promise<any> {
        try {
            let data = await this.userServiceClient.send('createUser', body).toPromise();
            response
                .status(data?.status)
                .send(data);
            return data
        } catch (err) {
            throw new HttpException(err, err?.status)
        }
    }

    /**
     * Check User Is Unique By Email
     * @param CheckEmailUniqueDto 
     */
    @Post('checkEmailUnique')
    @UsePipes(new ValidationPipe())
    public async checkEmailUnique(@Body() { email }: CheckEmailUniqueDto): Promise<any> {
        try {
            let data = await this.userServiceClient.send('checkEmailUnique', { email }).toPromise();
            return data
        } catch (err) {
            throw new HttpException(err, err?.status)
        }
    }

    /**
     * Check User Is Unique By Phone Number
     * @param CheckEmailUniqueDto 
     */
    @Post('checkPhoneNumberUnique')
    // @UsePipes(new ValidationPipe())
    public async checkPhoneNumberUnique(@Body() { phoneNumber }: CheckPhoneNumberUniqueDto): Promise<any> {
        try {
            let data = await this.userServiceClient.send('checkPhoneNumberUnique', { phoneNumber }).toPromise();
            return data
        } catch (err) {
            console.error("----------", err);
            throw new HttpException(err, err?.status)
        }
    }

    /**
     * Check User Is Unique By UserName
     * @param CheckEmailUniqueDto 
     */
    @Post('checkUserNameUnique')
    @UsePipes(new ValidationPipe())
    public async checkUserNameUnique(@Body() { userName }: CheckUserNameUniqueDto): Promise<any> {
        try {
            let data = await this.userServiceClient.send('checkUserNameUnique', { userName }).toPromise();
            return data
        } catch (err) {
            console.error(err);
            throw new HttpException(err, err?.status)
        }
    }

    /**
     * Get Users List
     * @param page Page Number
     * @param limit Page Size
     * @param response Express Response Object
     */
    @Get('')
    @UseGuards(JwtAuthGuard)
    public async getUsers(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
        @Res() response: Response
    ): Promise<any> {
        try {
            let data: any = await this.userServiceClient.send('findAllUsers', {
                filters: {},
                options: {
                    page, limit
                }
            }).toPromise();
            console.log("--------- data", data)
            response
                .status(data?.status)
                .send(data);
        } catch (err) {
            console.error(err);
            throw new HttpException(err, err?.status)
        }
    }

    /**
     * Update User Info
     * @param response Express Response Object
     * @param req Express Request Object
     * @param body User Info
     * @param id User Id
     * @param file User Avatar
     */
    @Patch('/:id')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file', { storage, fileFilter: filter }))
    public async updateUserProfile(
        @Res() response: Response,
        @Req() req,
        @Body() body,
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File
    ): Promise<any> {
        try {
            if (req?.user?.id != id)
                throw new HttpException("you dont have permission to update user's info", HttpStatus.FORBIDDEN)
            if (file && req.fileValidationError) {
                throw new HttpException("file type is not accepted", HttpStatus.FORBIDDEN)
            }
            let data: any = await this.userServiceClient.send('updateUserProfile', {
                id, body: { ...body, profile: { avatar: file?.filename } }
            }).toPromise();
            response
                .status(data?.status)
                .send(data);
        } catch (err) {
            console.error(err);
            throw new HttpException(err, err?.status)
        }
    }

    /**
     * Get Current User Profile
     * @param response Express Response Object
     * @param req Express request Object 
     */
    @Get('profile')
    @UseGuards(JwtAuthGuard)
    public async getUserProfile(
        @Res() response: Response,
        @Req() { user }
    ): Promise<any> {
        try {
            let data: any = await this.userServiceClient.send('getUserProfile', {
                id: user?.id
            }).toPromise();
            response
                .status(data?.status)
                .send(data);
        } catch (err) {
            console.error(err);
            throw new HttpException(err, err?.status)
        }
    }

    /**
     * Get User Info By Id
     * @param response Express Response Object
     * @param id User Id
     */
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    public async getUser(
        @Res() response: Response,
        @Param('id') id: string
    ): Promise<any> {
        try {
            let data: any = await this.userServiceClient.send('getUserProfile', {
                id
            }).toPromise();
            response
                .status(data?.status)
                .send(data);
        } catch (err) {
            console.error(err);
            throw new HttpException(err, err?.status)
        }
    }

    /**
     * Delete User 
     * @param id User Id 
     * @param response Express Response Object 
     */
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    public async deleteUser(
        @Param('id') id,
        @Res() response: Response
    ): Promise<any> {
        try {
            let data: any = await this.userServiceClient.send('removeUserById', {id}).toPromise();

            response
                .status(data?.status)
                .send(data);
        } catch (err) {
            console.error(err);
            throw new HttpException(err, err?.status)
        }
    }

}
