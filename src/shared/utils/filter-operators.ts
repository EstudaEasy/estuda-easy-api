import { FilterExpression, FilterOperator } from '@shared/types';

export const Equals = <T>(value: T): FilterExpression<T> => ({
  operator: FilterOperator.EQUALS,
  value
});

export const Not = <T>(value: T | FilterExpression<T>): FilterExpression<T> => ({
  operator: FilterOperator.NOT,
  value
});

export const LessThan = <T>(value: T): FilterExpression<T> => ({
  operator: FilterOperator.LESS_THAN,
  value
});

export const LessThanOrEqual = <T>(value: T): FilterExpression<T> => ({
  operator: FilterOperator.LESS_THAN_OR_EQUAL,
  value
});

export const GreaterThan = <T>(value: T): FilterExpression<T> => ({
  operator: FilterOperator.GREATER_THAN,
  value
});

export const GreaterThanOrEqual = <T>(value: T): FilterExpression<T> => ({
  operator: FilterOperator.GREATER_THAN_OR_EQUAL,
  value
});

export const IsNull = (): FilterExpression<any> => ({
  operator: FilterOperator.IS_NULL,
  value: null
});

export const Between = <T>(min: T | FilterExpression<T>, max: T | FilterExpression<T>): FilterExpression<T> => ({
  operator: FilterOperator.BETWEEN,
  value: [min, max]
});

export const In = <T>(value: T[]): FilterExpression<T> => ({
  operator: FilterOperator.IN,
  value
});

export const Like = (value: string): FilterExpression<string> => ({
  operator: FilterOperator.LIKE,
  value
});

export const ILike = (value: string): FilterExpression<string> => ({
  operator: FilterOperator.ILIKE,
  value
});
