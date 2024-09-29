import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { BooksService } from './books.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import Book from './entities/book.entity';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all available books' })
  @ApiResponse({
    status: 200,
    description: 'List of available books and their count',
    type: 'object',
  })
  async findAll() {
    const result = await this.booksService.findAll();
    return {
      code: HttpStatus.OK,
      message: 'data has been loaded',
      data: {
        books: result.books,
        count: result.count,
      },
    };
  }

  @Get(':code')
  @ApiOperation({ summary: 'Get a book by code' })
  @ApiResponse({
    status: 200,
    description: 'Book details',
    type: Book,
  })
  async findOne(@Param('code') code: string) {
    const book = await this.booksService.findOne(code);
    return {
      code: HttpStatus.OK,
      message: 'data has been loaded',
      data: { book },
    };
  }

  @Get('available/:code')
  @ApiOperation({ summary: 'Check if a book is available' })
  @ApiResponse({
    status: 200,
    description: 'Available book details',
    type: Book,
  })
  async findAvailableBook(@Param('code') code: string) {
    const book = await this.booksService.findAvailableBook(code);
    return {
      code: HttpStatus.OK,
      message: 'data has been loaded',
      data: { book },
    };
  }
}
