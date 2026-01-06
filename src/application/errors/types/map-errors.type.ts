import { Lang } from '@core/types';

export type MapErrors<E extends string | number | symbol> = Record<
  E,
  {
    message: Record<Lang, string>;
    status: number;
  }
>;
