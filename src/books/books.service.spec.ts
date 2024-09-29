import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import Book from './entities/book.entity';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { UpdateBookDto } from './dto/update-book.dto';

describe('BooksService', () => {
  let service: BooksService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let repository: Repository<Book>;

  const mockBookRepository = {
    findAndCount: jest.fn(),
    findOneOrFail: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  const mockBook = {
    id: '1',
    code: 'ABC123',
    title: 'Sample Book',
    available: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(Book),
          useValue: mockBookRepository,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    repository = module.get<Repository<Book>>(getRepositoryToken(Book));
  });

  describe('findAll', () => {
    it('should return a list of available books and count', async () => {
      const result = [[mockBook], 1];
      mockBookRepository.findAndCount.mockResolvedValue(result);

      expect(await service.findAll()).toEqual({
        books: [mockBook],
        count: 1,
      });
      expect(mockBookRepository.findAndCount).toHaveBeenCalledWith({
        where: {
          available: true,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a book by code', async () => {
      mockBookRepository.findOneOrFail.mockResolvedValue(mockBook);

      expect(await service.findOne(mockBook.code)).toEqual(mockBook);
    });

    it('should throw NotFoundException if book not found', async () => {
      mockBookRepository.findOneOrFail.mockRejectedValue(new Error());

      await expect(service.findOne(mockBook.code)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAvailableBook', () => {
    it('should return an available book by code', async () => {
      mockBookRepository.findOne.mockResolvedValue(mockBook);

      expect(await service.findAvailableBook(mockBook.code)).toEqual(mockBook);
    });

    it('should throw NotFoundException if available book not found', async () => {
      mockBookRepository.findOne.mockResolvedValue(null);

      await expect(service.findAvailableBook(mockBook.code)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateByCode', () => {
    it('should update a book and return success message', async () => {
      const updateBookDto: UpdateBookDto = { available: false };
      mockBookRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.updateByCode(mockBook.code, updateBookDto);
      expect(result).toBe('update successful');
      expect(mockBookRepository.update).toHaveBeenCalledWith(
        { code: mockBook.code },
        updateBookDto,
      );
    });

    it('should throw BadRequestException if update fails', async () => {
      const updateBookDto: UpdateBookDto = { available: false };
      mockBookRepository.update.mockResolvedValue({ affected: 0 });

      await expect(
        service.updateByCode(mockBook.code, updateBookDto),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
