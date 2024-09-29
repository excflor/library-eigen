import Member from '../../members/entities/member.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { mockMembers } from './mock-data';

export default class MemberSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(Member);
    await repository.insert(mockMembers);

    const memberFactory = factoryManager.get(Member);
    await memberFactory.save();
  }
}
