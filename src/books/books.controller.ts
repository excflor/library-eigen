import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
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
  async findOne(@Param('code') code: string) {
    const book = await this.booksService.findOne(code);
    return {
      code: HttpStatus.OK,
      message: 'data has been loaded',
      data: {
        book,
      },
    };
  }

  @Get('available/:code')
  async findAvailableBook(@Param('code') code: string) {
    const book = await this.booksService.findAvailableBook(code);
    return {
      code: HttpStatus.OK,
      message: 'data has been loaded',
      data: {
        book,
      },
    };
  }
}
