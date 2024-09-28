import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  async create(@Body() createMemberDto: CreateMemberDto) {
    await this.membersService.create(createMemberDto);
    const response = {
      code: HttpStatus.CREATED,
      message: 'data has been created',
    };

    return response;
  }

  @Get()
  async findAll() {
    const members = await this.membersService.findAll();
    const response = {
      code: HttpStatus.OK,
      message: 'data has been loaded',
      data: members,
    };

    return response;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.membersService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMemberDto: UpdateMemberDto,
  ) {
    return this.membersService.update(id, updateMemberDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.membersService.remove(id);
  }
}
