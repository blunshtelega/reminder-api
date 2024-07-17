import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  hashedPassword: string;
}

export default CreateUserDto