import { Injectable } from '@nestjs/common';
import { CreateLibraryInput } from './dto/create-library.input';
import { UpdateLibraryInput } from './dto/update-library.input';

@Injectable()
export class LibraryService {
  create(createLibraryInput: CreateLibraryInput) {
    return 'This action adds a new library';
  }

  findAll() {
    return `This action returns all library`;
  }

  findOne(id: number) {
    return `This action returns a #${id} library`;
  }

  update(id: number, updateLibraryInput: UpdateLibraryInput) {
    return `This action updates a #${id} library`;
  }

  remove(id: number) {
    return `This action removes a #${id} library`;
  }
}
