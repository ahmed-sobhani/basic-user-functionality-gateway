import { Exclude, Expose } from "class-transformer"
import { IsNotEmpty } from "class-validator"

/**
 * Login Types
 */
export enum LoginType {
    EMAIL = "email",
    PHONE = "phone",
    USERNAME = "username",
    ALL = "all",
}

/**
 * Login Input DTO
 */
@Exclude()
export class LoginDto {
    /** User: Email or Phone or UserName  */
    @Expose()
    @IsNotEmpty()
    user: string

    /** Password */
    @Expose()
    @IsNotEmpty()
    password: string

    /** Type of User Sign In  */
    @Expose()
    @IsNotEmpty()
    type: LoginType = LoginType.ALL


}