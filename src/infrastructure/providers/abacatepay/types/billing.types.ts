import type {
  RESTGetListBillingsData,
  RESTPostCreateNewChargeBody,
  RESTPostCreateNewChargeData,
  PaymentFrequency,
  PaymentMethod
} from '@abacatepay/types/v1';

type PaymentMethodString = `${PaymentMethod}`;
type PaymentFrequencyString = `${PaymentFrequency}`;

export type BillingCreateInput = Omit<RESTPostCreateNewChargeBody, 'frequency' | 'methods'> & {
  frequency: PaymentFrequencyString;
  methods: PaymentMethodString[];
};
export type BillingCreateOutput = RESTPostCreateNewChargeData;
export type BillingListOutput = RESTGetListBillingsData;
