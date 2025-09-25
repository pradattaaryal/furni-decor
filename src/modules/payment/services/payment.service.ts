// import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
// import { DataSource, EntityManager } from 'typeorm';
// import { CURRENCY_ENUM } from 'src/common/constants/currency.constant';
// import { AbstractPaymentService } from '../abstract/payment.abstract.service';
// import { PAYMENT_METHOD, PAYMENT_PAYPAL_PROVIDER, PAYMENT_STRIPE_PROVIDER, PaymentMetadata } from '../constants/payment.constant';
// import { STRIPE_UI_MODE } from '../stripe/constants/stripe.constant';
// import { PaymentEntity } from '../entities/payment.entity';
// import { PaymentCreateDto } from '../dtos/payment.create.dto';
// import { PaymentUpdateDto } from '../dtos/payment.update.dto';
// import { IPaymentProcessDto } from '../interfaces/payment.interface';
// import { ICreateOptions } from 'src/common/database/interfaces/createOption.interface';
// import { IUpdateOptions } from 'src/common/database/interfaces/updateOption.interface';
// import { IFindOneOptions } from 'src/common/database/interfaces/findOption.interface';
// import { PaymentRepository } from '../repositories/payment.repository';
// import { OrderRepository } from 'src/modules/order/repositories/order/order.repository';
// import { PaymentDomainService } from './payment-domain.service';

// @Injectable()
// export class PaymentService {
//   constructor(
//     @Inject(PAYMENT_PAYPAL_PROVIDER)
//     private readonly paypalpaymentProvider: AbstractPaymentService,
//     @Inject(PAYMENT_STRIPE_PROVIDER)
//     private readonly stripepaymentProvider: AbstractPaymentService,
//     private readonly paymentRepository: PaymentRepository,
//     private readonly orderRepository: OrderRepository,
//     private readonly paymentDomainService: PaymentDomainService,

//   ) {}

//   async createAndInitiatePayment(
//     createPaymentDto: PaymentCreateDto,
//     userId: string,
//     entityManager?: EntityManager,
//   ): Promise<{ payment: PaymentEntity; url: string }> {

//     const { paymentMethod, orderId } = createPaymentDto;

//     // Step 1: Validate order existence
//     const order = await this.orderRepository._findOne({
//       options: { where: { id: orderId } },
//       entityManager,
//     });

//     if (!order) {
//       throw new NotFoundException(`Order with ID ${orderId} not found`);
//     }

//     // Step 2: Select payment provider dynamically
//     const provider = this.getProviderByMethod(paymentMethod);

//     // Step 3: Create payment entry in DB
//     const payment = await this.paymentRepository._create(
//       { ...createPaymentDto },
//       { entityManager },
//     );
//     const metadata: PaymentMetadata = {
//       paymentId: payment.id.toString(),
//       userId: userId.toString(),
//       orderId: createPaymentDto.orderId.toString(),
//     };
//     // Step 4: Call provider to initiate payment
//     const session = await provider.payment({
//       amount: payment.amount * 100, // Stripe/PayPal expect smallest currency unit
//       currency: payment.currency,
//       metadata,
//     });

//     return { payment, url: session.url };
//   }



//   private getProviderByMethod(method: PAYMENT_METHOD): AbstractPaymentService {
//     switch (method) {
//       case PAYMENT_METHOD.STRIPE:
//         return this.stripepaymentProvider;
//       case PAYMENT_METHOD.PAYPAL:
//         return this.paypalpaymentProvider;
//       default:
//         throw new BadRequestException(`Unsupported payment method: ${method}`);
//     }
//   }



  
//   async update(
//     payment: PaymentEntity,
//     updatePaymentDto: PaymentUpdateDto,
//     options?: IUpdateOptions<PaymentEntity>,
//   ): Promise<PaymentEntity> {
//     Object.assign(payment, updatePaymentDto);
//     return await this.paymentRepository._update(payment, options);
//   }

//   async getById(
//     id: number,
//     options?: IFindOneOptions<PaymentEntity>,
//   ): Promise<PaymentEntity | null> {
//     return await this.paymentRepository._findOneById(id, options);
//   }

//   async getByOrderId(
//     orderId: number,
//     options?: IFindOneOptions<PaymentEntity>,
//   ): Promise<PaymentEntity | null> {
//     return await this.paymentRepository._findOne({
//       ...options,
//       options: {
//         where: { orderId },
//         ...options?.options,
//       },
//     });
//   }

//   // async processPayment(options: IPaymentProcessDto): Promise<any> {
//   //   return await this.paymentProvider.payment({
//   //     user: { 
//   //       id: options.userId,
//   //       email: options.userEmail,
//   //       userType: options.userType
//   //     },
//   //     pendingAmount: options.pendingAmount || 1000,
//   //     currency: options.currency || CURRENCY_ENUM.aud,
//   //     uiMode: STRIPE_UI_MODE.HOSTED,
//   //     productName: options.productName || 'Payment',
//   //     orderId: options.orderId,
//   //   });
//   // }

//   async cancelPayment(paymentId: number): Promise<PaymentEntity> {
//     return this.paymentDomainService.cancelPayment(paymentId);
//   }

//   async completePayment(
//     paymentId: number, 
//     transactionId: string
//   ): Promise<PaymentEntity> {
//     return this.paymentDomainService.completePaymentAndLink(paymentId, transactionId);
//   }
// }
