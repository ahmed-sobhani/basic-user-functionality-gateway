import { Exclude, Expose } from "class-transformer";
import { IsEmail, IsNotEmpty } from "class-validator";

/**
 * Check Email Unique Dto
 */
@Exclude()
export class CheckEmailUniqueDto {
    /** Email */
    @Expose()
    @IsEmail()
    @IsNotEmpty()
    email?: string;
}

/**
 * Check Phone Number Unique Dto
 */
@Exclude()
export class CheckPhoneNumberUniqueDto {
    /** Phone Number */
    @Expose()
    @IsNotEmpty()
    phoneNumber?: string;
}

/**
 * Check User Name Unique Dto
 */
@Exclude()
export class CheckUserNameUniqueDto {
    /** UserName */
    @Expose()
    @IsNotEmpty()
    userName: string;
}