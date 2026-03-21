import { REST } from '@abacatepay/rest';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ABACATEPAY_CLIENT } from '@adapters/abacatepay/abacatepay.constants';
import { AbacatePayConfig } from '@config/abacatepay/config';
import { AbacatePayProvider } from '@providers/abacatepay/abacatepay.provider';
import { AbacatePayBillingProvider } from '@providers/abacatepay/billing/billing.provider';
import { AbacatePayCustomerProvider } from '@providers/abacatepay/customer/customer.provider';

export type AbacatePayClient = REST;

@Module({
  providers: [
    {
      provide: ABACATEPAY_CLIENT,
      useFactory: (configService: ConfigService) => {
        const config = configService.getOrThrow<AbacatePayConfig>('abacatepay');
        return new REST({ secret: config.apiKey, version: 1 });
      },
      inject: [ConfigService]
    },
    AbacatePayBillingProvider,
    AbacatePayCustomerProvider,
    AbacatePayProvider
  ],
  exports: [ABACATEPAY_CLIENT, AbacatePayProvider]
})
export class AbacatePayModule {}
