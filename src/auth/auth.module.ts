import { Module } from '@nestjs/common';
import { Register } from './use-cases/register/register.controller';
import { Login } from './use-cases/login/login.controller';
import { AuthServiceProvider } from './infra/auth.service';

@Module({
  controllers: [Register, Login],
  providers: [AuthServiceProvider],
  exports: [AuthServiceProvider],
})
export class AuthModule {}
