import { Injectable } from '@nestjs/common';
import {
  Between,
  Equal,
  FindOperator,
  FindOptionsWhere,
  ILike,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not
} from 'typeorm';

import { DomainFilter, FilterExpression, FilterOperator } from '@shared/types';

@Injectable()
export class TypeOrmUtilsService {
  constructor() {}

  buildWhere<T>(filters?: DomainFilter<T> | DomainFilter<T>[]): FindOptionsWhere<T> | FindOptionsWhere<T>[] {
    if (!filters) {
      return {};
    }

    if (Array.isArray(filters)) {
      return filters.map((f) => this.buildWhere(f)) as FindOptionsWhere<T>[];
    }

    const where: FindOptionsWhere<T> = {};

    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null) {
        where[key] = this.mapExpression(value);
      }
    }

    return where;
  }

  mapExpression<T>(expression: T | FilterExpression<T>) {
    if (expression === null || expression === undefined) {
      return expression;
    }

    if (Array.isArray(expression)) {
      return expression.map((item) => this.mapExpression(item));
    }

    if (this.isFilterExpression(expression)) {
      return this.handleFilterExpression(expression);
    }

    if (typeof expression === 'object' && !(expression instanceof Date)) {
      return this.buildWhere(expression);
    }

    return expression;
  }

  private handleFilterExpression<T>(expression: FilterExpression<T>): FindOperator<T> {
    const { operator, value } = expression;

    switch (operator) {
      case FilterOperator.EQUALS:
        return Equal(value);

      case FilterOperator.NOT:
        return Not(this.mapExpression(value));

      case FilterOperator.LESS_THAN:
        return LessThan(value);

      case FilterOperator.LESS_THAN_OR_EQUAL:
        return LessThanOrEqual(value);

      case FilterOperator.GREATER_THAN:
        return MoreThan(value);

      case FilterOperator.GREATER_THAN_OR_EQUAL:
        return MoreThanOrEqual(value);

      case FilterOperator.BETWEEN: {
        const [min, max] = value;
        return Between(this.mapExpression(min), this.mapExpression(max));
      }

      case FilterOperator.IS_NULL:
        return IsNull();

      case FilterOperator.IN:
        return In(value);

      case FilterOperator.LIKE:
        return Like(`%${value}%`) as FindOperator<T>;

      case FilterOperator.ILIKE:
        return ILike(`%${value}%`) as FindOperator<T>;
    }
  }

  private isFilterExpression<T>(obj: T | FilterExpression<T>): obj is FilterExpression<T> {
    return obj && typeof obj === 'object' && 'operator' in obj && 'value' in obj;
  }
}
