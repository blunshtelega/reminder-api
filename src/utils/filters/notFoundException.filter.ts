
import { ExceptionFilter, Catch, ArgumentsHost, NotFoundException, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(NotFoundException)
export class NotFoundFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    const { url } = request;
    const status = exception.getStatus();
    const { message } = exception;

    response
      .status(status)
      .json({
        success: false,
        statusCode: status,
        message,
        path: url,
      });
  }
};