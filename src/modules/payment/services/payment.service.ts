import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentEntity } from '../entities/payment.entity';
import { PaymentFactoryService } from './payment-factory.service';
import { PaymentStatus } from '../constant/payment.constant';
import { ConfirmPaymentDto, CreatePaymentDto, PaymentIntentDto } from '../dto/payment.create.dto';
import { PaymentRepository } from '../repositories/payment.repository';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    private readonly paymentRepo: PaymentRepository,
    private paymentFactory: PaymentFactoryService,
  ) { }

  async createPayment(createPaymentDto: CreatePaymentDto): Promise<PaymentEntity> {
    const payment = this.paymentRepository.create({
      ...createPaymentDto,
      status: PaymentStatus.PENDING,
    });

    return this.paymentRepository.save(payment);
  }

  async createPaymentIntent(paymentIntentDto: PaymentIntentDto, options?: any) {
    const payment = await this.findPaymentById(paymentIntentDto.paymentId);

    if (payment.status !== PaymentStatus.PENDING) {
      throw new BadRequestException('Payment is not in pending status');
    }

    const provider = this.paymentFactory.getProvider(payment.provider);
    const intentResponse = await provider.createPaymentIntent(payment, options);

    // Update payment with provider payment intent ID
    payment.providerPaymentIntentId = intentResponse.paymentIntentId;
    await this.paymentRepository.save(payment);

    return {
      payment,
      ...intentResponse,
    };
  }

  async confirmPayment(confirmPaymentDto: ConfirmPaymentDto) {
    const payment = await this.findPaymentById(confirmPaymentDto.paymentId);

    if (!payment.providerPaymentIntentId) {
      throw new BadRequestException('Payment intent not found');
    }

    const provider = this.paymentFactory.getProvider(payment.provider);
    const confirmation = await provider.confirmPayment(
      payment.providerPaymentIntentId,
      confirmPaymentDto,
    );

    // Update payment status
    payment.status = confirmation.success ? PaymentStatus.COMPLETED : PaymentStatus.FAILED;
    payment.providerTransactionId = confirmation.transactionId;
    payment.metadata = {
      ...payment.metadata,
      confirmation: confirmation.metadata,
    };

    await this.paymentRepository.save(payment);

    return {
      payment,
      confirmation,
    };
  }

  async refundPayment(paymentId: string, amount?: number) {
    const payment = await this.findPaymentById(paymentId);

    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new BadRequestException('Only completed payments can be refunded');
    }

    const provider = this.paymentFactory.getProvider(payment.provider);
    const refundResponse = await provider.refundPayment(
      payment.providerTransactionId || payment.providerPaymentIntentId,
      amount,
    );

    if (refundResponse.success) {
      payment.status = PaymentStatus.REFUNDED;
      await this.paymentRepository.save(payment);
    }

    return {
      payment,
      refund: refundResponse,
    };
  }

  async getPaymentStatus(paymentId: string) {
    const payment = await this.findPaymentById(paymentId);

    if (payment.providerPaymentIntentId) {
      const provider = this.paymentFactory.getProvider(payment.provider);
      const providerStatus = await provider.getPaymentStatus(payment.providerPaymentIntentId);

      return {
        payment,
        providerStatus,
      };
    }

    return { payment };
  }

  async findPaymentById(id: string): Promise<PaymentEntity> {

    const paymentID = parseInt(id, 10)
    const payment = await this.paymentRepo._findOne({ options: { where: { id: paymentID } } });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return payment;
  }

  async getUserPayments(userId: string): Promise<PaymentEntity[]> {
    return this.paymentRepository.find({
      where: { userId },

    });
  }
}