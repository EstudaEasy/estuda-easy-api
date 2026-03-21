import { Test } from '@nestjs/testing';
import {
  Equal,
  Not,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Between,
  IsNull,
  In,
  Like,
  ILike
} from 'typeorm';

import { FilterExpression, FilterOperator } from '@shared/types';

import { TypeOrmUtilsService } from '../typeorm-utils.service';

describe('TypeOrm -> Utils -> MapExpression', () => {
  let service: TypeOrmUtilsService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [TypeOrmUtilsService]
    }).compile();

    service = module.get<TypeOrmUtilsService>(TypeOrmUtilsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should return value directly if not a filter expression', () => {
    const result = service.mapExpression('John');

    expect(result).toBe('John');
  });

  it('should return null when expression is null', () => {
    const result = service.mapExpression(null);

    expect(result).toBeNull();
  });

  it('should return undefined when expression is undefined', () => {
    const result = service.mapExpression(undefined);

    expect(result).toBeUndefined();
  });

  it('should handle Date objects directly', () => {
    const date = new Date('2023-01-01');
    const result = service.mapExpression(date);

    expect(result).toBe(date);
  });

  it('should handle numbers directly', () => {
    const result = service.mapExpression(42);

    expect(result).toBe(42);
  });

  it('should handle booleans directly', () => {
    const result = service.mapExpression(true);

    expect(result).toBe(true);
  });

  it('should map EQUALS operator', () => {
    const expression: FilterExpression = {
      operator: FilterOperator.EQUALS,
      value: 'John'
    };

    const result = service.mapExpression(expression);

    expect(result).toEqual(Equal('John'));
  });

  it('should map NOT operator', () => {
    const expression: FilterExpression = {
      operator: FilterOperator.NOT,
      value: { operator: FilterOperator.EQUALS, value: 'John' }
    };

    const result = service.mapExpression(expression);

    expect(result).toEqual(Not(Equal('John')));
  });

  it('should map LESS_THAN operator', () => {
    const expression: FilterExpression = {
      operator: FilterOperator.LESS_THAN,
      value: 18
    };

    const result = service.mapExpression(expression);

    expect(result).toEqual(LessThan(18));
  });

  it('should map LESS_THAN_OR_EQUAL operator', () => {
    const expression: FilterExpression = {
      operator: FilterOperator.LESS_THAN_OR_EQUAL,
      value: 18
    };

    const result = service.mapExpression(expression);

    expect(result).toEqual(LessThanOrEqual(18));
  });

  it('should map GREATER_THAN operator', () => {
    const expression: FilterExpression = {
      operator: FilterOperator.GREATER_THAN,
      value: 18
    };

    const result = service.mapExpression(expression);

    expect(result).toEqual(MoreThan(18));
  });

  it('should map GREATER_THAN_OR_EQUAL operator', () => {
    const expression: FilterExpression = {
      operator: FilterOperator.GREATER_THAN_OR_EQUAL,
      value: 18
    };

    const result = service.mapExpression(expression);

    expect(result).toEqual(MoreThanOrEqual(18));
  });

  it('should map BETWEEN operator', () => {
    const expression: FilterExpression = {
      operator: FilterOperator.BETWEEN,
      value: [10, 20]
    };

    const result = service.mapExpression(expression);

    expect(result).toEqual(Between(10, 20));
  });

  it('should map IS_NULL operator', () => {
    const expression: FilterExpression = {
      operator: FilterOperator.IS_NULL,
      value: null
    };

    const result = service.mapExpression(expression);

    expect(result).toEqual(IsNull());
  });

  it('should map IN operator', () => {
    const expression: FilterExpression = {
      operator: FilterOperator.IN,
      value: ['A', 'B', 'C']
    };

    const result = service.mapExpression(expression);

    expect(result).toEqual(In(['A', 'B', 'C']));
  });

  it('should map LIKE operator', () => {
    const expression: FilterExpression = {
      operator: FilterOperator.LIKE,
      value: 'John'
    };

    const result = service.mapExpression(expression);

    expect(result).toEqual(Like('%John%'));
  });

  it('should map ILIKE operator', () => {
    const expression: FilterExpression = {
      operator: FilterOperator.ILIKE,
      value: 'John'
    };

    const result = service.mapExpression(expression);

    expect(result).toEqual(ILike('%John%'));
  });

  it('should map array of expressions', () => {
    const expressions = [
      { operator: FilterOperator.EQUALS, value: 'John' },
      { operator: FilterOperator.EQUALS, value: 'Jane' }
    ];

    const result = service.mapExpression(expressions);

    expect(result).toEqual([Equal('John'), Equal('Jane')]);
  });

  it('should map array of primitive values', () => {
    const values = ['John', 'Jane', 'Bob'];

    const result = service.mapExpression(values);

    expect(result).toEqual(['John', 'Jane', 'Bob']);
  });

  it('should map empty array', () => {
    const result = service.mapExpression([]);

    expect(result).toEqual([]);
  });

  it('should map nested filter expressions in BETWEEN', () => {
    const expression: FilterExpression = {
      operator: FilterOperator.BETWEEN,
      value: [
        { operator: FilterOperator.EQUALS, value: 10 },
        { operator: FilterOperator.EQUALS, value: 20 }
      ]
    };

    const result = service.mapExpression(expression);

    expect(result).toEqual(Between(Equal(10), Equal(20)));
  });

  it('should map nested NOT with complex expression', () => {
    const expression: FilterExpression = {
      operator: FilterOperator.NOT,
      value: { operator: FilterOperator.IN, value: ['A', 'B'] }
    };

    const result = service.mapExpression(expression);

    expect(result).toEqual(Not(In(['A', 'B'])));
  });

  it('should handle plain object (non-filter expression)', () => {
    const obj = { name: 'John', age: 25 };

    const result = service.mapExpression(obj);

    expect(result).toEqual({ name: 'John', age: 25 });
  });

  it('should handle object with filter expressions inside', () => {
    const obj = {
      name: { operator: FilterOperator.EQUALS, value: 'John' },
      age: 25
    };

    const result = service.mapExpression(obj);

    expect(result).toEqual({
      name: Equal('John'),
      age: 25
    });
  });
});
