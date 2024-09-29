import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { NotFoundException } from '@nestjs/common';

describe('BooksController', () => {
  let controller: BooksController;
  let service: BooksService;

  const mockBook = {
    id: '1',
    code: 'ABC123',
    title: 'Sample Book',
    available: true,
  };

  const mockBooksService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findAvailableBook: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: mockBooksService,
        },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    service = module.get<BooksService>(BooksService);
  });

  describe('findAll', () => {
    it('should return a list of books and count', async () => {
      const result = { books: [mockBook], count: 1 };
      mockBooksService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toEqual({
        code: 200,
        message: 'data has been loaded',
        data: {
          books: result.books,
          count: result.count,
        },
      });

      expect(mockBooksService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a book by code', async () => {
      mockBooksService.findOne.mockResolvedValue(mockBook);

      expect(await controller.findOne(mockBook.code)).toEqual({
        code: 200,
        message: 'data has been loaded',
        data: {
          book: mockBook,
        },
      });

      expect(mockBooksService.findOne).toHaveBeenCalledWith(mockBook.code);
    });

    it('should throw NotFoundException if book not found', async () => {
      mockBooksService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne(mockBook.code)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAvailableBook', () => {
    it('should return an available book by code', async () => {
      mockBooksService.findAvailableBook.mockResolvedValue(mockBook);

      expect(await controller.findAvailableBook(mockBook.code)).toEqual({
        code: 200,
        message: 'data has been loaded',
        data: {
          book: mockBook,
        },
      });

      expect(mockBooksService.findAvailableBook).toHaveBeenCalledWith(
        mockBook.code,
      );
    });

    it('should throw NotFoundException if available book not found', async () => {
      mockBooksService.findAvailableBook.mockRejectedValue(
        new NotFoundException(),
      );

      await expect(controller.findAvailableBook(mockBook.code)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
