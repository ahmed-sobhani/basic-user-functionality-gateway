import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter } from "@nestjs/common"
import express from "express"

/**
 * General Validation Exception Handling
 */
@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter<BadRequestException> {
    /**
     * Handle Exception
     * @param exception Exception Object
     * @param host Http Host 
     */
    public catch(exception, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse() as express.Response
        response
            .status(400)
            .json({
                status: 400,
                error: {
                    message: exception?.response?.message?.join(', '),
                },
                data: null,
            })
    }
}