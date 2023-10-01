import { Injectable } from '@nestjs/common';
import { CreateTableInput } from './dto/create-table.input';
import { UpdateTableInput } from './dto/update-table.input';

@Injectable()
export class TableService {
  create(createTableInput: CreateTableInput) {
    return 'This action adds a new table';
  }

  findAll() {
    return `This action returns all table`;
  }

  findOne(id: number) {
    return `This action returns a #${id} table`;
  }

  update(id: number, updateTableInput: UpdateTableInput) {
    return `This action updates a #${id} table`;
  }

  remove(id: number) {
    return `This action removes a #${id} table`;
  }
}
