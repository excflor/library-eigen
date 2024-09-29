import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'members', orderBy: { created_at: 'ASC' } })
export class Member {
  @ApiProperty({
    description: 'Unique identifier for the member',
    type: 'string',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Code for the member',
    type: 'string',
  })
  @Column({ type: 'varchar' })
  code: string;

  @ApiProperty({
    description: 'Name of the member',
    type: 'string',
    maxLength: 300,
  })
  @Column({ type: 'varchar', length: 300 })
  name: string;

  @ApiProperty({
    description: 'Penalty until date for the member (nullable)',
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  @Column({ type: 'timestamptz', nullable: true })
  penalizedUntil: Date;

  @ApiProperty({
    description: 'Date when the member was created',
    type: 'string',
    format: 'date-time',
  })
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ApiProperty({
    description: 'Date when the member was last updated',
    type: 'string',
    format: 'date-time',
  })
  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @ApiProperty({
    description: 'Array of borrowed book codes',
    type: 'array',
    items: { type: 'string' },
    default: [],
  })
  @Column('text', { array: true, default: [] })
  borrowed_books: string[];
}

export default Member;
