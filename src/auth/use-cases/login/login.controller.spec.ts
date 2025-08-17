import { Login } from './login.controller';
import { LoginRequest } from './login.dto';
import { BadRequestException } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';
import { IUserRepository } from '@auth/ports/user.repository.interface';
import type { Response } from 'express';

describe('Login Controller (Unit)', () => {
  let controller: Login;
  let userRepository: jest.Mocked<IUserRepository>;
  let response: jest.Mocked<Response>;

  beforeEach(() => {
    userRepository = createMock<IUserRepository>();
    response = {
      cookie: jest.fn(),
    } as unknown as jest.Mocked<Response>;

    controller = new Login(userRepository);

    jest.clearAllMocks();
  });

  const loginRequest: LoginRequest = {
    email: 'test@example.com',
    password: 'Password123!',
  };

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should login successfully and set cookies', async () => {
    // Arrange
    const mockUser = {
      id: 'user-uuid',
      role: 'Guest',
      verifyPassword: jest.fn().mockReturnValue(true),
    };
    userRepository.findByEmail.mockResolvedValue(mockUser as any);

    // Act
    await controller.execute(loginRequest, response);

    // Assert
    expect(userRepository.findByEmail).toHaveBeenCalledWith(loginRequest.email);
    expect(mockUser.verifyPassword).toHaveBeenCalledWith(loginRequest.password);
    expect(response.cookie).toHaveBeenCalledWith('userId', mockUser.id, {
      httpOnly: true,
    });
    expect(response.cookie).toHaveBeenCalledWith('role', mockUser.role, {
      httpOnly: true,
    });
  });

  it('should throw BadRequestException if user not found', async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    await expect(controller.execute(loginRequest, response)).rejects.toThrow(
      BadRequestException,
    );
    expect(response.cookie).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException if password is invalid', async () => {
    const mockUser = {
      id: 'user-uuid',
      role: 'Guest',
      verifyPassword: jest.fn().mockReturnValue(false),
    };
    userRepository.findByEmail.mockResolvedValue(mockUser as any);

    await expect(controller.execute(loginRequest, response)).rejects.toThrow(
      BadRequestException,
    );
    expect(response.cookie).not.toHaveBeenCalled();
  });
});
