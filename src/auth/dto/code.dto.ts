import { MaxLength, MinLength } from 'class-validator';

export class CodeAuthDto {
  @MinLength(4)
  @MaxLength(4)
  code: string;
}