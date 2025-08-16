import { Module } from '@nestjs/common';
import { Register } from './use-cases/register/register.controller';
import { Login } from './use-cases/login/login.controller';

@Module({
  controllers: [Register, Login],
  providers: [],
})
export class AuthModule {}
