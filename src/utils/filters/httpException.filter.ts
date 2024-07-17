
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // ! DTO отрабатывает тоже тут
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { url } = request;
    const status = exception.getStatus();
    const { message } = exception;

    console.log('HttpExceptionFilter')
    
    const responseMessageDto = exception.getResponse()

    response
      .status(status)
      .json({
        success: false,
        statusCode: status,
        message: typeof responseMessageDto !== 'string' && responseMessageDto['message'] ? responseMessageDto['message'] : message,
        path: url,
      });
  }
};