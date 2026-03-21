import { Inject, Injectable } from '@nestjs/common';

import { ABACATEPAY_CLIENT } from '@adapters/abacatepay/abacatepay.constants';

import { CustomerCreateInput, CustomerCreateOutput, CustomerListOutput } from '../types/customer.types';

import type { AbacatePayClient } from '@adapters/abacatepay/abacatepay.module';

@Injectable()
export class AbacatePayCustomerProvider {
  constructor(
    @Inject(ABACATEPAY_CLIENT)
    private readonly client: AbacatePayClient
  ) {}

  async create(data: CustomerCreateInput): Promise<CustomerCreateOutput> {
    return await this.client.post<CustomerCreateOutput>('/customer/create', { body: data });
  }

  async list(): Promise<CustomerListOutput> {
    return await this.client.get<CustomerListOutput>('/customer/list');
  }
}
