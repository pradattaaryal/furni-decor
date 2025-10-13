export interface IBillingAddressEntity {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  country: string;
  state: string;
  streetAddress1: string;
  streetAddress2?: string;
  zipCode: string;
  default: boolean;
}
