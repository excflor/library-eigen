import { IsNotEmpty, IsString } from 'class-validator';

export class BorrowBookDto {
  @IsNotEmpty()
  @IsString()
  member_code: string;

  @IsNotEmpty()
  @IsString()
  book_code: string;
}

export class ReturnBookDto {
  @IsNotEmpty()
  @IsString()
  member_code: string;

  @IsNotEmpty()
  @IsString()
  book_code: string;
}
