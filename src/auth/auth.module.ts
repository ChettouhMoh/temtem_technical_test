import { Module } from '@nestjs/common';
import { Register } from './use-cases/register/register.controller';

@Module({
  controllers: [Register],
})
export class AuthModule {}
