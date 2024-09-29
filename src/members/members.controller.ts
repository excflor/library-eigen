import { Controller, Get, Post, Body, Param, HttpStatus } from '@nestjs/common';
import { MembersService } from './members.service';
import { BorrowBookDto, ReturnBookDto } from './dto/member-book.dto';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post('borrow')
  async borrowBook(@Body() borrowBookDto: BorrowBookDto) {
    const result = await this.membersService.borrowBook(
      borrowBookDto.member_code,
      borrowBookDto.book_code,
    );

    return {
      code: HttpStatus.OK,
      message: result.message,
    };
  }

  @Post('return')
  async returnBook(@Body() returnBookDto: ReturnBookDto) {
    const result = await this.membersService.returnBook(
      returnBookDto.member_code,
      returnBookDto.book_code,
    );

    return {
      code: HttpStatus.OK,
      message: result.message,
    };
  }

  @Get()
  async findAll() {
    const members = await this.membersService.findAll();

    return {
      code: HttpStatus.OK,
      message: 'data has been loaded',
      data: {
        members,
      },
    };
  }

  @Get(':code/borrowed-books')
  async getBorrowedBooks(@Param('code') code: string) {
    const borrowedBooksCount =
      await this.membersService.countBorrowedBooks(code);

    return {
      code: HttpStatus.OK,
      message: 'data has been loaded',
      data: {
        count: borrowedBooksCount,
      },
    };
  }
}
