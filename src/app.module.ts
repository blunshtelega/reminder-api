import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from './authentication/authentication.module'
import * as Joi from '@hapi/joi'
import CrossDomainMiddleware from './utils/middlewares/allowCrossDomain.middleware';
import { AuthenticationController } from './authentication/authentication.controller';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    // ! Нужна ли нам PRISMA здесь? Может она нам нужна глобально?
    // PrismaModule,
    AuthenticationModule,
    UsersModule,
    ConfigModule.forRoot({
      // ! Можно сделать глобальным, но нужно ли?
      // isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production').default('development'),
        PORT: Joi.number().port().default(3000),

        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),

        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
      })
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CrossDomainMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
