import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateFeedbacks1645201408322 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'feedbacks',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'description',
            type: 'varchar',
          },
          {
            name: 'amount',
            type: 'numeric',
          },
          {
            name: 'user_from_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'user_to_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'is_dark',
            type: 'boolean',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'FKUserFromFeedback',
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            columnNames: ['user_from_id'],
            onDelete: 'SET NULL',
            onUpdate: 'SET NULL',
          },
          {
            name: 'FKUserToFeedback',
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            columnNames: ['user_to_id'],
            onDelete: 'SET NULL',
            onUpdate: 'SET NULL',
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('feedbacks');
  }
}
