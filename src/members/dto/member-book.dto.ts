import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BorrowBookDto {
  @ApiProperty({
    description: 'The code of the member borrowing the book',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  member_code: string;

  @ApiProperty({
    description: 'The code of the book being borrowed',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  book_code: string;
}

export class ReturnBookDto {
  @ApiProperty({
    description: 'The code of the member returning the book',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  member_code: string;

  @ApiProperty({
    description: 'The code of the book being returned',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  book_code: string;
}
