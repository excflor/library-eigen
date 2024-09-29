import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'books' })
export class Book extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  code: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  author: string;

  @Column({ type: 'int' })
  stock: number;

  @Column({ type: 'boolean', default: true })
  available: boolean;

  @Column({ type: 'timestamptz' })
  borrowed_at: Date;
}

export default Book;
