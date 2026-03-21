import { Lang } from '@core/types';

export type MapErrors<E extends string | number | symbol> = Record<
  E,
  (params?: Record<string, unknown>) => {
    message: Record<Lang, string>;
    params?: Record<string, unknown>;
    status: number;
  }
>;
