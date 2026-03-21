import type {
  RESTGetListCustomersData,
  RESTPostCreateCustomerBody,
  RESTPostCreateCustomerData
} from '@abacatepay/types/v1';

export type CustomerCreateInput = RESTPostCreateCustomerBody;
export type CustomerCreateOutput = RESTPostCreateCustomerData;
export type CustomerListOutput = RESTGetListCustomersData;
