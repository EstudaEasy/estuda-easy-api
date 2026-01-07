import { Test } from '@nestjs/testing';
import { Equal, MoreThan } from 'typeorm';

import { DomainFilter, FilterOperator } from '@shared/types';

import { TypeOrmUtilsService } from '../typeorm-utils.service';

describe('TypeOrm -> Utils -> BuildWhere', () => {
  let service: TypeOrmUtilsService;

  type FilterType = DomainFilter<{
    name: string;
    age: number;
  }>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [TypeOrmUtilsService]
    }).compile();

    service = module.get<TypeOrmUtilsService>(TypeOrmUtilsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should return empty object when filter is undefined', () => {
    const result = service.buildWhere(undefined);

    expect(result).toEqual({});
  });

  it('should transform simple filter object', () => {
    const filter: FilterType = { name: 'John', age: 25 };

    const result = service.buildWhere(filter);

    expect(result).toEqual({ name: 'John', age: 25 });
  });

  it('should skip undefined and null values', () => {
    const filter: FilterType = { name: 'John', age: undefined };

    const result = service.buildWhere(filter);

    expect(result).toEqual({ name: 'John' });
  });

  it('should transform filter with expressions', () => {
    const filter: FilterType = {
      name: { operator: FilterOperator.EQUALS, value: 'John' },
      age: { operator: FilterOperator.GREATER_THAN, value: 18 }
    };

    const result = service.buildWhere(filter);

    expect(result).toEqual({ name: Equal('John'), age: MoreThan(18) });
  });

  it('should transform array of filters', () => {
    const filters: FilterType[] = [{ name: 'John' }, { age: 30 }];

    const result = service.buildWhere(filters);

    expect(result).toEqual([{ name: 'John' }, { age: 30 }]);
  });

  it('should transform array of filters with expressions', () => {
    const filters: FilterType[] = [
      { name: { operator: FilterOperator.EQUALS, value: 'John' } },
      { age: { operator: FilterOperator.GREATER_THAN, value: 18 } }
    ];

    const result = service.buildWhere(filters);

    expect(result).toEqual([{ name: Equal('John') }, { age: MoreThan(18) }]);
  });
});
