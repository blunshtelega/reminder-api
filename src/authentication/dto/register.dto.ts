
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export default class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
