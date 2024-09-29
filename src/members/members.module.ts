import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Member from './entities/member.entity';
import { BooksModule } from '../books/books.module';

@Module({
  imports: [TypeOrmModule.forFeature([Member]), BooksModule],
  controllers: [MembersController],
  providers: [MembersService],
})
export class MembersModule {}
