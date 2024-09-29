import { Test, TestingModule } from '@nestjs/testing';
import { MembersService } from './members.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import Member from './entities/member.entity';
import { BooksService } from '../books/books.service';
import { NotFoundException } from '@nestjs/common';

describe('MembersService', () => {
  let service: MembersService;
  let memberRepository;
  let bookService;

  const mockMember = {
    id: 'uuid',
    code: 'member-code',
    name: 'Member Name',
    penalized: false,
    penalizedUntil: null,
    borrowed_books: [],
    save: jest.fn(),
  };

  const mockBook = {
    id: 'uuid',
    code: 'book-code',
    title: 'Book Title',
    author: 'Author Name',
    available: true,
    stock: 10,
    borrowed_at: null,
  };

  beforeEach(async () => {
    memberRepository = {
      findOne: jest.fn(),
      update: jest.fn(),
      save: jest.fn(),
      find: jest.fn().mockResolvedValue([mockMember]),
    };

    bookService = {
      findAvailableBook: jest.fn().mockResolvedValue(mockBook),
      updateByCode: jest.fn(),
      findOne: jest.fn().mockResolvedValue(mockBook),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembersService,
        {
          provide: getRepositoryToken(Member),
          useValue: memberRepository,
        },
        {
          provide: BooksService,
          useValue: bookService,
        },
      ],
    }).compile();

    service = module.get<MembersService>(MembersService);
  });

  it('should successfully borrow a book', async () => {
    memberRepository.findOne.mockResolvedValue(mockMember);

    const result = await service.borrowBook('member-code', 'book-code');

    expect(result).toEqual({ message: 'book has been successfully borrowed.' });
    expect(mockMember.borrowed_books).toContain('book-code');
    expect(bookService.updateByCode).toHaveBeenCalledWith(
      'book-code',
      expect.any(Object),
    );
  });

  it('should throw an error if member not found when borrowing', async () => {
    memberRepository.findOne.mockResolvedValue(null);

    await expect(
      service.borrowBook('invalid-code', 'book-code'),
    ).rejects.toThrow(NotFoundException);
  });

  it('should successfully return a book', async () => {
    memberRepository.findOne.mockResolvedValue(mockMember);
    bookService.findOne.mockResolvedValue({
      ...mockBook,
      borrowed_at: new Date(),
    });

    const result = await service.returnBook('member-code', 'book-code');

    expect(result).toEqual({ message: 'book returned successfully.' });
    expect(mockMember.borrowed_books).not.toContain('book-code');
    expect(bookService.updateByCode).toHaveBeenCalledWith(
      'book-code',
      expect.any(Object),
    );
  });

  it('should throw an error if member not found when returning', async () => {
    memberRepository.findOne.mockResolvedValue(null);

    await expect(
      service.returnBook('invalid-code', 'book-code'),
    ).rejects.toThrow(NotFoundException);
  });

  it('should return all members', async () => {
    const members = await service.findAll();

    expect(members).toEqual([mockMember]);
    expect(memberRepository.find).toHaveBeenCalled();
  });

  it('should count borrowed books for a member', async () => {
    memberRepository.findOne.mockResolvedValue(mockMember);

    const count = await service.countBorrowedBooks('member-code');

    expect(count).toBe(0);
  });

  it('should throw an error if member not found when counting borrowed books', async () => {
    memberRepository.findOne.mockResolvedValue(null);

    await expect(service.countBorrowedBooks('invalid-code')).rejects.toThrow(
      NotFoundException,
    );
  });
});
