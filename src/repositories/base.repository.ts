import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { HttpStatus, Injectable } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';

import { CreateDtoInterface, UpdateDtoInterface } from 'src/dto/dto.interface';
import ApiError from '@shared/api-error';
import { ErrorCodes } from '@interfaces/error.interface';
import { IdentifierInterface } from '@interfaces/entity.interface';

@Injectable()
export default class BaseRepository<Entity extends IdentifierInterface> {
  protected constructor(protected readonly repository: Repository<Entity>) {}

  public async delete(id: string | number): Promise<void> {
    await this.repository.delete({ id: id } as FindOptionsWhere<Entity>);
  }

  public async find(options: FindManyOptions): Promise<Entity[]> {
    return await this.repository.find(options);
  }

  public async findById(id: string | number): Promise<Entity> {
    return this.repository.findOneBy({ id: id } as FindOptionsWhere<Entity>);
  }

  public async findOne(options: FindOneOptions): Promise<Entity> {
    try {
      return await this.repository.findOneOrFail(options);
    } catch (error: unknown) {
      throw new ApiError({
        code: ErrorCodes.WRONG_PARAMS,
        detail: error as object,
        status: HttpStatus.NOT_FOUND,
        title: 'No data was found with this parameters.',
      });
    }
  }

  public async insert(dto: CreateDtoInterface): Promise<Entity> {
    const newData = instanceToPlain(dto) as DeepPartial<Entity>;
    const newEntity = this.repository.create(newData);

    return await this.repository.save<Entity>(newEntity);
  }

  public async update(
    object: IdentifierInterface,
    dto: UpdateDtoInterface,
  ): Promise<Entity> {
    const newData = {
      ...object,
      ...instanceToPlain(dto),
    } as DeepPartial<Entity>;
    const newEntity = this.repository.create(newData);
    return await this.repository.save<Entity>(newEntity);
  }
}
