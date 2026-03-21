import { Inject, Injectable } from '@nestjs/common';

import { ABACATEPAY_CLIENT } from '@adapters/abacatepay/abacatepay.constants';

import { BillingCreateInput, BillingCreateOutput, BillingListOutput } from '../types/billing.types';

import type { AbacatePayClient } from '@adapters/abacatepay/abacatepay.module';

@Injectable()
export class AbacatePayBillingProvider {
  constructor(
    @Inject(ABACATEPAY_CLIENT)
    private readonly client: AbacatePayClient
  ) {}

  async create(data: BillingCreateInput): Promise<BillingCreateOutput> {
    return await this.client.post<BillingCreateOutput>('/billing/create', { body: data });
  }

  async list(): Promise<BillingListOutput> {
    return await this.client.get<BillingListOutput>('/billing/list');
  }
}
