import Book from '../../books/entities/book.entity';
import Member from '../../members/entities/member.entity';
import { DataSource } from 'typeorm';
import { mockBooks, mockMembers } from './mock-data';

export async function seedData(dataSource: DataSource): Promise<void> {
  const memberRepository = dataSource.getRepository(Member);
  const bookRepository = dataSource.getRepository(Book);

  for (const member of mockMembers) {
    const _member = memberRepository.create({
      code: member.code,
      name: member.name,
    });

    await memberRepository.save(_member);
  }

  for (const book of mockBooks) {
    const _book = bookRepository.create({
      code: book.code,
      title: book.title,
      author: book.author,
      stock: book.stock,
    });

    await bookRepository.save(_book);
  }
}
