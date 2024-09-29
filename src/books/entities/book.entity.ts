import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'books' })
export class Book extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Unique identifier for the book',
    type: 'string',
  })
  id: string;

  @Column({ type: 'varchar', unique: true })
  @ApiProperty({ example: 'BK001', description: 'Unique code for the book' })
  code: string;

  @Column({ type: 'varchar' })
  @ApiProperty({ example: 'Harry Potter', description: 'Title of the book' })
  title: string;

  @Column({ type: 'varchar' })
  @ApiProperty({ example: 'J.K. Rowling', description: 'Author of the book' })
  author: string;

  @Column({ type: 'int' })
  @ApiProperty({ example: 10, description: 'Stock of the book available' })
  stock: number;

  @Column({ type: 'boolean', default: true })
  @ApiProperty({ example: true, description: 'Availability of the book' })
  available: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  @ApiProperty({
    example: '2024-09-30T10:00:00Z',
    description: 'Date when the book was borrowed',
  })
  borrowed_at: Date;
}

export default Book;
