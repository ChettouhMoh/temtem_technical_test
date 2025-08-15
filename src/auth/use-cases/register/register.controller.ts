import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterRequest } from './register.dto';
import { User } from '@auth/domain/user';
import { IUserRepository } from '@auth/ports/user.repository.interface';

@ApiTags('auth')
@Controller('auth/register')
export class Register {
  constructor(
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterRequest })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  async execute(@Body() request: RegisterRequest): Promise<void> {
    try {
      const user = User.createNew(request);
      await this.userRepository.save(user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
