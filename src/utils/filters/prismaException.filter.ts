import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

export const errorMappings: Record<string, { status: number; message: string }> = {
  P2000: { status: HttpStatus.BAD_REQUEST, message: "Input Data is too long" },
  P2001: { status: HttpStatus.NO_CONTENT, message: "Record does not exist" },
  P2002: { status: HttpStatus.CONFLICT, message: "Reference Data already exists" },
  P2025: { status: HttpStatus.BAD_REQUEST, message: "The value is invalid for the field's type" },
  P2023: { status: HttpStatus.BAD_REQUEST , message: 'Error creating UUID, invalid character: expected an optional prefix of `urn:uuid:` followed by [0-9a-fA-F-], found `а` at 3' }
};

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const { url } = request;

    const incomeMessage = exception.message;
    const errorCode = exception.code;
    const errorMapping = errorMappings[errorCode];

    console.log('PRISMA ERROR', errorMapping)

    if (errorMapping) {
      const { status, message } = errorMapping;

      response
        .status(status)
        .json({
          success: false,
          statusCode: status,
          message: incomeMessage.length ? incomeMessage : message,
          path: url,
        });
    } else {
      super.catch(exception, host);
    }
  }
};
