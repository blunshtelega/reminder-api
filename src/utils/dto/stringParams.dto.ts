
import { IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class StringParamsDto {
  @IsString()
  @Transform(({ value }) => String(value))
  id: string;
}