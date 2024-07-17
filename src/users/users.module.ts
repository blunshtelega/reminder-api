import { Module } from '@nestjs/common';
import UsersController from './users.controller';
import UsersService from './users.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [UsersController], // the set of controllers defined in this module which have to be instantiated
  providers: [UsersService], // the providers that will be instantiated by the Nest injector and that may be shared at least across this module
  imports: [
    PrismaModule,
  ], // the list of imported modules that export the providers which are required in this module
  exports: [
    UsersService,
  ], // the subset of providers that are provided by this module and should be available in other modules which import this module. You can use either the provider itself or just its token (provide value)
})

export class UsersModule {}