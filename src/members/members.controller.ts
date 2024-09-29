import { Controller, Get, Post, Body, Param, HttpStatus } from '@nestjs/common';
import { MembersService } from './members.service';
import { BorrowBookDto, ReturnBookDto } from './dto/member-book.dto';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

@ApiTags('members')
@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post('borrow')
  @ApiOperation({ summary: 'Borrow a book' })
  @ApiResponse({
    status: 200,
    description: 'Book has been successfully borrowed.',
  })
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
  @ApiOperation({ summary: 'Return a borrowed book' })
  @ApiResponse({
    status: 200,
    description: 'Book returned successfully.',
  })
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
  @ApiOperation({ summary: 'Get all members' })
  @ApiResponse({
    status: 200,
    description: 'List of members.',
  })
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
  @ApiOperation({ summary: 'Get count of borrowed books for a member' })
  @ApiResponse({
    status: 200,
    description: 'Count of borrowed books.',
  })
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
