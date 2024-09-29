import { Test, TestingModule } from '@nestjs/testing';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { BorrowBookDto, ReturnBookDto } from './dto/member-book.dto';

describe('MembersController', () => {
  let controller: MembersController;
  let service: MembersService;

  const mockMembersService = {
    borrowBook: jest
      .fn()
      .mockResolvedValue({ message: 'borrowed successfully' }),
    returnBook: jest
      .fn()
      .mockResolvedValue({ message: 'returned successfully' }),
    findAll: jest.fn().mockResolvedValue([
      { code: 'M001', name: 'John Doe', penalized: false },
      { code: 'M002', name: 'Jane Smith', penalized: true },
    ]),
    countBorrowedBooks: jest.fn().mockResolvedValue(1),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MembersController],
      providers: [
        {
          provide: MembersService,
          useValue: mockMembersService,
        },
      ],
    }).compile();

    controller = module.get<MembersController>(MembersController);
    service = module.get<MembersService>(MembersService);
  });

  describe('borrowBook', () => {
    it('should return success message when book is borrowed', async () => {
      const dto: BorrowBookDto = { member_code: 'M001', book_code: 'B001' };
      const result = await controller.borrowBook(dto);

      expect(result).toEqual({
        code: 200,
        message: 'borrowed successfully',
      });
      expect(service.borrowBook).toHaveBeenCalledWith(
        dto.member_code,
        dto.book_code,
      );
    });
  });

  describe('returnBook', () => {
    it('should return success message when book is returned', async () => {
      const dto: ReturnBookDto = { member_code: 'M001', book_code: 'B001' };
      const result = await controller.returnBook(dto);

      expect(result).toEqual({
        code: 200,
        message: 'returned successfully',
      });
      expect(service.returnBook).toHaveBeenCalledWith(
        dto.member_code,
        dto.book_code,
      );
    });
  });

  describe('findAll', () => {
    it('should return all members', async () => {
      const result = await controller.findAll();

      expect(result).toEqual({
        code: 200,
        message: 'data has been loaded',
        data: {
          members: [
            { code: 'M001', name: 'John Doe', penalized: false },
            { code: 'M002', name: 'Jane Smith', penalized: true },
          ],
        },
      });
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('getBorrowedBooks', () => {
    it('should return the count of borrowed books', async () => {
      const code = 'M001';
      const result = await controller.getBorrowedBooks(code);

      expect(result).toEqual({
        code: 200,
        message: 'data has been loaded',
        data: {
          count: 1,
        },
      });
      expect(service.countBorrowedBooks).toHaveBeenCalledWith(code);
    });
  });
});
