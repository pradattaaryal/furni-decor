
// import {
//   Injectable,
//   Logger,
//   BadRequestException,
//   Inject,
// } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import * as paypal from '@paypal/checkout-server-sdk';
// import {
//   PaymentAdapterInterface,
//   PaymentResult,
// } from '../interfaces/payment-adapter.interface';
// import { PaymentEntity, PaymentStatus } from '../entities/payment.entity';
// import { CreatePaymentDto } from '../dto/create-payment.dto';
// import { CartEntity } from 'src/modules/cart/entities/cart.entity';
// import { OrderService } from 'src/modules/order/services/order.service';
// import { UserEntity } from 'src/modules/user/entities/user.entity';
// import { CreateOrderDto } from 'src/modules/order/dto/order.create.dto';

// // Factory provider for PayPal client (injected in module)
// export const PAYPAL_CLIENT = 'PAYPAL_CLIENT';

// @Injectable()
// export class PayPalAdapter implements PaymentAdapterInterface {
//   private readonly logger = new Logger(PayPalAdapter.name);

//   constructor(
//     private readonly configService: ConfigService,
//     private readonly orderService: OrderService,
//     @Inject(PAYPAL_CLIENT)
//     private readonly paypalClient: paypal.core.PayPalHttpClient,
//   ) {}

//   async createPayment(
//     user: UserEntity,
//     payment: PaymentEntity,
//     dto: CreatePaymentDto,
//     cart: CartEntity,
//   ): Promise<PaymentResult> {
//     try {
//       const orderData = new CreateOrderDto();
//       //orderData.billingAddress = dto.shippingaddress;
//       //orderData.shippingAddress = dto.shippingaddress;
//       const order = await this.orderService.createOrder(
//         user.id,
//         orderData,
//         payment.amount,
//       );
//       if (!order) {
//         throw new BadRequestException('Order creation failed');
//       }
//       // console.log(`/////////////////////////////////////////////////order Data//////////////////////////////
//       // //${JSON.stringify(orderData, null, 2)}
//       // // `);
//       // console.log(`/////////////////////////////////////////////////order Data//////////////////////////////
//       // //${JSON.stringify(order, null, 2)}
//       // // `);
//       // console.log(`/////////////////////////////////////////////////payment data//////////////////////////////
//       // // ${JSON.stringify(payment, null, 2)}
//       // // `);
//       // Create PayPal order
//       const request = new paypal.orders.OrdersCreateRequest();
//       request.prefer('return=representation');
//       request.requestBody({
//         intent: 'CAPTURE',
//         purchase_units: [
//           {
//             amount: {
//               currency_code: payment.currency || 'USD',
//               value: payment.amount.toFixed(2),
//             },
//             description: payment.description || 'Furni Decor order',
//             custom_id: String(order.id), // Link to your order
//           },
//         ],
//         application_context: {
//           brand_name: this.configService.get<string>(
//             'BRAND_NAME',
//             'Furni Decor',
//           ),
//           user_action: 'PAY_NOW',
//           return_url:
//             dto.returnUrl ||
//             this.configService.get<string>('PAYPAL_RETURN_URL'),
//           cancel_url:
//             dto.cancelUrl ||
//             this.configService.get<string>('PAYPAL_CANCEL_URL'),
//         },
//       });

//       const orderResponse = await this.paypalClient.execute(request);
//       const approveUrl = orderResponse.result.links.find(
//         (link) => link.rel === 'approve',
//       )?.href;
//       if (!approveUrl) {
//         throw new BadRequestException('PayPal approve URL not found');
//       }

//       return {
//         success: true,
//         paymentId: orderResponse.result.id,
//         transactionId: orderResponse.result.id,
//         cart,
//         status: this.mapPayPalStatus(orderResponse.result.status),
//         checkoutUrl: approveUrl,
//       };
//     } catch (error) {
//       this.logger.error(
//         'PayPal payment creation failed',
//         error.stack || error.message,
//       );
//       return {
//         success: false,
//         paymentId: '',
//         status: PaymentStatus.FAILED,
//         errorMessage:
//           error instanceof BadRequestException
//             ? error.message
//             : 'Payment creation failed. Please try again later.',
//       };
//     }
//   }

//   async capturePayment(paymentId: string): Promise<PaymentResult> {
//     try {
//       const request = new paypal.orders.OrdersCaptureRequest(paymentId);
//       request.requestBody({});

//       const capture = await this.paypalClient.execute(request);
//       const captureDetails =
//         capture.result.purchase_units[0].payments.captures[0];

//       return {
//         success: capture.result.status === 'COMPLETED',
//         paymentId: capture.result.id,
//         transactionId: captureDetails.id,
//         status: this.mapPayPalStatus(capture.result.status),
//       };
//     } catch (error) {
//       this.logger.error(
//         `PayPal capture failed for ${paymentId}`,
//         error.stack || error.message,
//       );
//       return {
//         success: false,
//         paymentId: '',
//         status: PaymentStatus.FAILED,
//         errorMessage: 'Payment capture failed. Please try again later.',
//       };
//     }
//   }

//   private mapPayPalStatus(status: string): PaymentStatus {
//     const map: Record<string, PaymentStatus> = {
//       CREATED: PaymentStatus.PENDING,
//       APPROVED: PaymentStatus.PROCESSING,
//       COMPLETED: PaymentStatus.COMPLETED,
//       CANCELLED: PaymentStatus.CANCELLED,
//       FAILED: PaymentStatus.FAILED,
//     };
//     return map[status] || PaymentStatus.FAILED;
//   }
//   verifyWebhook(payload: any, signature: string) {
//     // Note: Proper PayPal webhook verification requires multiple headers and webhookId
//     // For now, return true as a permissive fallback; production should verify against PayPal API
//     return true;
//   }
// }

// import { Injectable, Logger, BadRequestException } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import {
//   PaymentAdapterInterface,
//   PaymentResult,
//   RefundResult,
// } from '../interfaces/payment-adapter.interface';
// import { PaymentEntity, PaymentStatus } from '../entities/payment.entity';
// import { CreatePaymentDto } from '../dto/create-payment.dto';
// import { CartEntity } from 'src/modules/cart/entities/cart.entity';
// import { OrderService } from 'src/modules/order/services/order.service';
// import { UserEntity } from 'src/modules/user/entities/user.entity';

// @Injectable()
// export class PayPalAdapter implements PaymentAdapterInterface {
//   private readonly logger = new Logger(PayPalAdapter.name);
//   private readonly useMock: boolean;
//   private readonly apiBase: string;
//   private readonly clientId?: string;
//   private readonly clientSecret?: string;

//   constructor(
//     private readonly configService: ConfigService,
//     private readonly _orderService: OrderService,
//   ) {
//     this.logger.log('PayPal adapter initialized');
//     this.useMock = this.configService.get<boolean>('PAYPAL_MOCK') ?? false;
//     this.apiBase =
//       this.configService.get<string>('PAYPAL_API_BASE') ||
//       'https://api-m.sandbox.paypal.com';
//     this.clientId = this.configService.get<string>('PAYPAL_CLIENT_ID');
//     this.clientSecret = this.configService.get<string>('PAYPAL_CLIENT_SECRET');
//   }

//   async createPayment(
//     user: UserEntity,

//     payment: PaymentEntity,
//     dto: CreatePaymentDto,
//     cart: CartEntity,
//   ): Promise<PaymentResult> {
//     try {
//       const { amount, currency = 'USD' } = payment;
//       const userId = cart.userId;

//       const order = await this._orderService.createOrder(
//         userId,
//         dto.shippingaddress,
//       );
//       if (!order) throw new BadRequestException('Order creation failed');

//       if (this.useMock) {
//         const mockId = `PAYPAL-${Date.now()}`;
//         const mockApproveUrl = `https://www.sandbox.paypal.com/checkoutnow?token=${mockId}`;
//         return {
//           success: true,
//           paymentId: mockId,
//           transactionId: mockId,
//           cart,
//           status: this.mapPayPalStatus('CREATED'),
//           checkoutUrl: mockApproveUrl,
//         };
//       }

//       const createOrder = await this.createOrderLive({
//         amount,
//         currency,
//         returnUrl: dto.returnUrl,
//         cancelUrl: dto.cancelUrl,
//         cart,
//         userId,
//         orderId: order.id,
//         description: payment.description,
//       });

//       const approveUrl = this.extractLink(createOrder, 'approve');
//       if (!approveUrl) {
//         throw new BadRequestException('PayPal approve URL not found');
//       }

//       return {
//         success: true,
//         paymentId: createOrder.id,
//         transactionId: createOrder.id,
//         cart,
//         status: this.mapPayPalStatus(createOrder.status),
//         checkoutUrl: approveUrl,
//       };
//     } catch (error) {
//       this.logger.error(
//         'PayPal payment creation failed',
//         error.stack || error.message,
//       );

//       return {
//         success: false,
//         paymentId: '',
//         status: PaymentStatus.FAILED,
//         errorMessage:
//           error instanceof BadRequestException
//             ? error.message
//             : 'Payment creation failed. Please try again later.',
//       };
//     }
//   }

//   async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
//     try {
//       // Mock for now, replace with PayPal API call
//       const simulatedStatus = 'COMPLETED';
//       return this.mapPayPalStatus(simulatedStatus);
//     } catch (error) {
//       this.logger.error(
//         `Failed to get PayPal payment status for ${paymentId}`,
//         error,
//       );
//       throw new BadRequestException('Unable to retrieve payment status');
//     }
//   }

//   async refundPayment(
//     paymentId: string,
//     amount?: number,
//   ): Promise<RefundResult> {
//     try {
//       // Mock refund, replace with PayPal refund API call
//       const refundId = `REFUND-${Date.now()}`;
//       return {
//         success: true,
//         refundId,
//         amount: amount || 0,
//         status: 'COMPLETED',
//       };
//     } catch (error) {
//       this.logger.error(`PayPal refund failed for ${paymentId}`, error);
//       return {
//         success: false,
//         refundId: '',
//         amount: 0,
//         status: 'failed',
//         errorMessage: error.message,
//       };
//     }
//   }

//   async cancelPayment(paymentId: string): Promise<boolean> {
//     try {
//       // Replace with PayPal cancel API
//       return true;
//     } catch (error) {
//       this.logger.error(`PayPal cancel failed for ${paymentId}`, error);
//       return false;
//     }
//   }

//   private mapPayPalStatus(status: string): PaymentStatus {
//     const map: Record<string, PaymentStatus> = {
//       CREATED: PaymentStatus.PENDING,
//       APPROVED: PaymentStatus.PROCESSING,
//       COMPLETED: PaymentStatus.COMPLETED,
//       CANCELLED: PaymentStatus.CANCELLED,
//       FAILED: PaymentStatus.FAILED,
//     };

//     return map[status] || PaymentStatus.FAILED;
//   }

//   private async getAccessToken(): Promise<string> {
//     if (!this.clientId || !this.clientSecret) {
//       throw new BadRequestException('PayPal credentials not configured');
//     }
//     const basic = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString(
//       'base64',
//     );
//     const res = await fetch(`${this.apiBase}/v1/oauth2/token`, {
//       method: 'POST',
//       headers: {
//         Authorization: `Basic ${basic}`,
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       body: 'grant_type=client_credentials',
//     });
//     if (!res.ok) {
//       const text = await res.text();
//       this.logger.error(`PayPal token error: ${res.status} ${text}`);
//       throw new BadRequestException('Failed to authenticate with PayPal');
//     }
//     const data = (await res.json()) as { access_token: string };
//     return data.access_token;
//   }

//   private async createOrderLive(params: {
//     amount: number;
//     currency: string;
//     returnUrl?: string;
//     cancelUrl?: string;
//     description?: string;
//     cart: CartEntity;
//     userId: number;
//     orderId: number;
//   }): Promise<any> {
//     const token = await this.getAccessToken();
//     const body = {
//       intent: 'CAPTURE',
//       purchase_units: [
//         {
//           amount: {
//             currency_code: params.currency || 'USD',
//             value: params.amount.toFixed(2),
//           },
//           description: params.description || 'Furni Decor order',
//           custom_id: String(params.orderId),
//         },
//       ],
//       application_context: {
//         brand_name: 'Furni Decor',
//         user_action: 'PAY_NOW',
//         return_url: params.returnUrl || 'https://example.com/payment/success',
//         cancel_url: params.cancelUrl || 'https://example.com/payment/cancel',
//       },
//     };

//     const res = await fetch(`${this.apiBase}/v2/checkout/orders`, {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(body),
//     });
//     const text = await res.text();
//     if (!res.ok) {
//       this.logger.error(`PayPal create order error: ${res.status} ${text}`);
//       throw new BadRequestException('Failed to create PayPal order');
//     }
//     return JSON.parse(text);
//   }

//   private extractLink(order: any, rel: string): string | undefined {
//     if (!order?.links) return undefined;
//     const link = order.links.find((l: any) => l.rel === rel);
//     return link?.href;
//   }
// }
