import { Exclude, Expose } from "class-transformer";
import { IsEmail, IsEmpty, IsNotEmpty, IsOptional } from "class-validator";

/**
 * Create User DTO
 */
@Exclude()
export class CreateUserDto {
    /** First Name */
    @Expose()
    firstName?: string;

    /** Last Name */
    @Expose()
    lastName?: string;

    /** User Name */
    @Expose()
    userName?: string;

    /** Phone Number */
    @Expose()
    phoneNumber?: string;

    /** Email */
    @Expose()
    @IsEmail()
    @IsOptional()
    email?: string;

    /** Password */
    @Expose()
    @IsNotEmpty()
    password: string;

}