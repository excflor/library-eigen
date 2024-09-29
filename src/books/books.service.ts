import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Book from './entities/book.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  async findAll(): Promise<{ books: Book[]; count: number }> {
    const [books, count] = await this.bookRepository.findAndCount({
      where: {
        available: true,
      },
    });

    return { books, count };
  }

  async findOne(bookCode: string): Promise<Book> {
    try {
      const book = await this.bookRepository.findOneOrFail({
        where: { code: bookCode },
      });
      return book;
    } catch (error) {
      throw new NotFoundException(`book with code ${bookCode} not found.`);
    }
  }

  async findAvailableBook(bookCode: string): Promise<Book> {
    const book = await this.bookRepository.findOne({
      where: {
        code: bookCode,
        available: true,
      },
    });

    if (!book) {
      throw new NotFoundException(
        `available book with code ${bookCode} not found.`,
      );
    }

    return book;
  }

  async updateByCode(
    bookCode: string,
    updateBookDto: UpdateBookDto,
  ): Promise<string> {
    const result = await this.bookRepository.update(
      { code: bookCode },
      updateBookDto,
    );

    if (result.affected === 0) {
      throw new BadRequestException(
        `update failed for book with code ${bookCode}.`,
      );
    }

    return 'update successful';
  }
}
