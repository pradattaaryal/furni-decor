import { CustomIsEnum, CustomIsNotEmpty, CustomIsNumber, CustomIsOptional, CustomIsString, CustomMin } from "src/common/request/validators/custom-validator";
import { PaymentProviderEnum } from "../constant/payment.constant";
 
export class CreatePaymentDto {
  @CustomIsNotEmpty()
  @CustomIsNumber()
  @CustomMin(0.01)
  amount: number;

  @CustomIsNotEmpty()
  @CustomIsString()
  currency: string;

  @CustomIsNotEmpty()
  @CustomIsEnum(PaymentProviderEnum)
  provider: PaymentProviderEnum;

  @CustomIsOptional()
  @CustomIsString()
  description?: string;

  @CustomIsOptional()
  @CustomIsString()
  userId?: string;

  @CustomIsOptional()
  @CustomIsString()
  orderId?: string;

  @CustomIsOptional()
  metadata?: any;
}

export class PaymentIntentDto {
  @CustomIsNotEmpty()
  @CustomIsString()
  paymentId: string;

  @CustomIsOptional()
  returnUrl?: string;

  @CustomIsOptional()
  cancelUrl?: string;
}
export class ConfirmPaymentDto {
  @CustomIsNotEmpty()
  @CustomIsString()
  paymentId: string;

  @CustomIsOptional()
  @CustomIsString()
  paymentMethodId?: string;

  @CustomIsOptional()
  @CustomIsString()
  paymentIntentId?: string;

  @CustomIsOptional()
  metadata?: any;
}