import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateBookTable1727614830899 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'books',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'code',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'author',
            type: 'varchar',
          },
          {
            name: 'stock',
            type: 'int',
          },
          {
            name: 'available',
            type: 'boolean',
            default: true,
          },
          {
            name: 'borrowed_at',
            type: 'timestamptz',
            isNullable: true, // Allows for null values when not borrowed
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('books');
  }
}
