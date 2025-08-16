import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Res,
} from '@nestjs/common';
import { LoginRequest } from './login.dto';
import { IUserRepository } from '@auth/ports/user.repository.interface';
import type { Response } from 'express';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth/login')
export class Login {
  constructor(
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginRequest })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully and auth-session cookie is set.',
  })
  @ApiResponse({ status: 400, description: 'Invalid credentials.' })
  async execute(
    @Body() body: LoginRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const user = await this.userRepository.findByEmail(body.email);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const result = user.verifyPassword(body.password);
    if (!result) {
      throw new BadRequestException('Invalid credentials');
    }

    // set cookie to the client
    res.cookie('userId', user.id, { httpOnly: true });
    res.cookie('role', user.role, { httpOnly: true });
  }
}
