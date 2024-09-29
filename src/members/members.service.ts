import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Member from './entities/member.entity';
import { Repository } from 'typeorm';
import { BooksService } from '../books/books.service';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    private bookService: BooksService,
  ) {}

  async borrowBook(
    memberCode: string,
    bookCode: string,
  ): Promise<{ message: string }> {
    const member = await this.memberRepository.findOne({
      where: { code: memberCode },
    });

    if (!member) {
      throw new NotFoundException(`member with code ${memberCode} not found.`);
    }

    const now = new Date();
    if (member.penalizedUntil && now < member.penalizedUntil) {
      throw new BadRequestException(
        'member is still penalized and cannot borrow books.',
      );
    }

    if (member.borrowed_books.length >= 2) {
      throw new BadRequestException(
        'maximum of 2 books can be borrowed by a member.',
      );
    }

    const book = await this.bookService.findAvailableBook(bookCode);

    if (!book) {
      throw new NotFoundException(
        `book with code ${bookCode} is not available.`,
      );
    }

    book.available = false;
    book.borrowed_at = now;
    await this.bookService.updateByCode(book.code, book);

    member.borrowed_books.push(book.code);
    await this.memberRepository.update(member.id, member);

    return { message: 'book has been successfully borrowed.' };
  }

  async returnBook(
    memberCode: string,
    bookCode: string,
  ): Promise<{ message: string }> {
    const member = await this.memberRepository.findOne({
      where: { code: memberCode },
    });

    if (!member) {
      throw new NotFoundException(`member with code ${memberCode} not found.`);
    }

    const book = await this.bookService.findOne(bookCode);
    if (!book) {
      throw new NotFoundException(`book with code ${bookCode} not found.`);
    }

    if (!member.borrowed_books.includes(bookCode)) {
      throw new BadRequestException('book not borrowed by this member.');
    }

    const borrowedAt = book.borrowed_at;
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - new Date(borrowedAt).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 7) {
      const penaltyDays = 3;
      const msInDay = 24 * 60 * 60 * 1000;
      const penaltyDuration = penaltyDays * msInDay;

      member.penalizedUntil = new Date(today.getTime() + penaltyDuration);
      await this.memberRepository.save(member);
    }

    book.available = true;
    book.borrowed_at = null;
    await this.bookService.updateByCode(bookCode, book);

    member.borrowed_books = member.borrowed_books.filter(
      (code) => code !== bookCode,
    );
    await this.memberRepository.save(member);

    return { message: 'book returned successfully.' };
  }

  async findAll(): Promise<Member[]> {
    const members = await this.memberRepository.find();
    return members;
  }

  async countBorrowedBooks(memberCode: string): Promise<number> {
    const member = await this.memberRepository.findOne({
      where: { code: memberCode },
    });

    if (!member) {
      throw new NotFoundException('member not found');
    }

    return member.borrowed_books.length;
  }
}
