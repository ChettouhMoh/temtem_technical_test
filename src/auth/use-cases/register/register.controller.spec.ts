import { Register } from './register.controller';
import { RegisterRequest } from './register.dto';
import { BadRequestException } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';
import { IUserRepository } from '@auth/ports/user.repository.interface';
import { User } from '@auth/domain/user';

jest.mock('@auth/domain/user'); // mock the domain class

describe('Register Controller (Unit)', () => {
  let controller: Register;
  let userRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    userRepository = createMock<IUserRepository>();
    controller = new Register(userRepository);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('execute', () => {
    const registerRequest: RegisterRequest = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password123!',
    };

    it('should register a new user successfully', async () => {
      // Arrange
      const mockUser = { id: 'some-uuid' } as User;
      (User.createNew as jest.Mock).mockReturnValue(mockUser);
      userRepository.save.mockResolvedValue(undefined);

      // Act
      await controller.execute(registerRequest);

      // Assert
      expect(User.createNew).toHaveBeenCalledWith(registerRequest);
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
    });

    it('should throw BadRequestException if user creation fails', async () => {
      // Arrange
      const errorMessage = 'Invalid user data';
      (User.createNew as jest.Mock).mockImplementation(() => {
        throw new Error(errorMessage);
      });

      // Act & Assert
      await expect(controller.execute(registerRequest)).rejects.toThrow(
        BadRequestException,
      );
      expect(userRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if saving the user fails', async () => {
      // Arrange
      const mockUser = { id: 'some-uuid' } as User;
      const errorMessage = 'Database error';
      (User.createNew as jest.Mock).mockReturnValue(mockUser);
      userRepository.save.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(controller.execute(registerRequest)).rejects.toThrow(
        BadRequestException,
      );
      expect(User.createNew).toHaveBeenCalledWith(registerRequest);
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
    });
  });
});
