import { ConflictException, Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Member from './entities/member.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
  ) {}

  async create(createMemberDto: CreateMemberDto): Promise<Member> {
    const newMember = this.memberRepository.create(createMemberDto);

    try {
      const createdMember = await this.memberRepository.save(newMember);
      if (!createdMember) {
        throw new ConflictException('member could not be created');
      }

      return createdMember;
    } catch (error) {
      throw new ConflictException(
        'an error occurred while creating the member: ' + error.message,
      );
    }
  }

  async findAll(): Promise<Member[]> {
    const members = this.memberRepository.find({
      order: {
        created_at: 'DESC',
      },
    });

    return members;
  }

  async findOne(id: string) {
    return `This action returns a #${id} member`;
  }

  async update(id: string, updateMemberDto: UpdateMemberDto) {
    return `This action updates a #${id} member`;
  }

  async remove(id: string) {
    return `This action removes a #${id} member`;
  }
}
