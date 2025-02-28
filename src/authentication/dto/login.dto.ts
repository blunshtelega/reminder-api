import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export default class LogInDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
