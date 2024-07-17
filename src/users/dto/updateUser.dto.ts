import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export default UpdateUserDto