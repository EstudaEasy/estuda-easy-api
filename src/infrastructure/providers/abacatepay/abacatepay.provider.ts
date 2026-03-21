import { Injectable } from '@nestjs/common';

import { AbacatePayBillingProvider } from './billing/billing.provider';
import { AbacatePayCustomerProvider } from './customer/customer.provider';

@Injectable()
export class AbacatePayProvider {
  constructor(
    readonly billing: AbacatePayBillingProvider,
    readonly customer: AbacatePayCustomerProvider
  ) {}
}
