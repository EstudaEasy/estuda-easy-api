import { FilterOperator } from './filter-operator.type';

interface ComparisonExpression<T> {
  operator:
    | FilterOperator.EQUALS
    | FilterOperator.LESS_THAN
    | FilterOperator.LESS_THAN_OR_EQUAL
    | FilterOperator.GREATER_THAN
    | FilterOperator.GREATER_THAN_OR_EQUAL;
  value: T;
}

interface NotExpression<T> {
  operator: FilterOperator.NOT;
  value: T | FilterExpression<T>;
}

interface BetweenExpression<T> {
  operator: FilterOperator.BETWEEN;
  value: [T | FilterExpression<T>, T | FilterExpression<T>];
}

interface InExpression<T> {
  operator: FilterOperator.IN;
  value: T[];
}

interface IsNullExpression {
  operator: FilterOperator.IS_NULL;
  value: null;
}

interface StringExpression {
  operator: FilterOperator.LIKE | FilterOperator.ILIKE;
  value: string;
}

export type FilterExpression<T = any> =
  | ComparisonExpression<T>
  | NotExpression<T>
  | BetweenExpression<T>
  | InExpression<T>
  | IsNullExpression
  | (T extends string ? StringExpression : never);

export type DomainFilterProperty<T> = [T] extends [Date]
  ? T | FilterExpression<T>
  : [T] extends [string]
    ? T | FilterExpression<T>
    : [T] extends [number]
      ? T | FilterExpression<T>
      : [T] extends [boolean]
        ? T | FilterExpression<T>
        : T extends Array<infer U>
          ? DomainFilterProperty<NonNullable<U>>
          : T extends object
            ? DomainFilter<T> | DomainFilter<T>[] | FilterExpression<T> | T
            : T | FilterExpression<T>;

export type DomainFilter<T> = {
  [K in keyof T]?: DomainFilterProperty<NonNullable<T[K]>>;
};
