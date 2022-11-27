import { BadRequestException, Injectable } from '@nestjs/common';
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { instanceToPlain } from 'class-transformer';

import { CreateDtoInterface, UpdateDtoInterface } from '@dto/dto.interface';
import ApiError from '@shared/api-error';
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

  public async findOne(options: FindOneOptions): Promise<Entity> {
    try {
      return await this.repository.findOneOrFail(options);
    } catch (error: unknown) {
      throw new BadRequestException(
        ApiError.ValidationError('No data was found with this parameters.'),
      );
    }
  }

  public async findOneById(id: string | number): Promise<Entity> {
    return this.repository.findOneBy({ id: id } as FindOptionsWhere<Entity>);
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
