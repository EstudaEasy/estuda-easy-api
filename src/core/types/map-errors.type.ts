import { Lang } from '@core/types';

export type ErrorOutput = {
  message: Record<Lang, string>;
  params?: Record<string, unknown>;
  status: number;
};

type ErrorFunction<P> = P extends undefined ? () => ErrorOutput : (params: P) => ErrorOutput;

export type ErrorsMap<E extends string, P extends Record<string, unknown> = Record<string, undefined>> = {
  [K in E]: ErrorFunction<K extends keyof P ? P[K] : undefined>;
};
