import { ApiProperty } from '@nestjs/swagger';

export class RegisterRequest {
  @ApiProperty({
    example: 'john_doe',
    description: 'The username of the user (must be 3-20 characters)',
  })
  username: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user',
  })
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'The password for the user account',
  })
  password: string;
}
