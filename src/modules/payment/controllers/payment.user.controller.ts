import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Param,
  Post,
  RawBodyRequest,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiDocs } from 'src/common/doc/common-docs';
import { GetUser } from 'src/modules/authentication/decorators/jwt-payload.decorator';
import { AccessTokenPayload } from 'src/modules/authentication/dto/forgot-password.dto';
import { JwtAuthGuard } from 'src/modules/authentication/guards/jwt-auth.guard';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { PaymentService } from '../services/payment.service';
import { WebhookService } from '../services/webhook.service';
import { PaymentProvider } from '../entities/payment.entity';
import Stripe from 'stripe';
import { sign } from 'crypto';
import { ConfigService } from '@nestjs/config';

@Controller('payment')
export class PaymentUserController {
  private readonly stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-08-27.basil',
  });
  private readonly webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
  constructor(
    private readonly _paymentService: PaymentService,
    private readonly webhookService: WebhookService,
    private readonly configService: ConfigService,
  ) {}

  @Post('/create')
  @ApiDocs({ operation: 'Initialize Payment' })
  @UseGuards(JwtAuthGuard)
  async createPayment(
    @Body() body: CreatePaymentDto,
    @GetUser() user: AccessTokenPayload,
  ) {
    try {
      body.userId = user.sub;
      const payment = await this._paymentService.createPayment(body);
      return {
        data: { payment, message: 'Payment initialized successfully' },
      };
    } catch (error) {
      throw error;
    } finally {
    }
  }

  @Post('/capture/:paymentId')
  @ApiDocs({ operation: 'Capture PayPal Payment' })
  @UseGuards(JwtAuthGuard)
  async capturePayment(
    @Param('paymentId') paymentId: string,
    @GetUser() user: AccessTokenPayload,
  ) {
    console.log(`capture method called with paymentId: ${paymentId}`);
    if (!paymentId) {
      throw new BadRequestException('Payment ID is required.');
    }

    const result = await this._paymentService.capturePayment(paymentId);
    console.log(`data from capture of paypal ${result}`);

    if (result.success) {
      await this.webhookService.handlePaymentCompletion(
        paymentId,
        PaymentProvider.PAYPAL,
      );
    }

    return {
      data: result,
      message: result.success
        ? 'Payment captured successfully.'
        : 'Payment capture failed.',
    };
  }

  @Post('stripe-weebhook')
  async stripeWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ): Promise<{ received: boolean }> {
    console.log('🟢 [Stripe Webhook] Incoming request');

    const rawBody = req.rawBody;

    if (!signature) throw new BadRequestException('Missing Stripe signature');
    if (!rawBody) throw new BadRequestException('Missing raw body');
    try {
      await this.webhookService.handleStripeWebhook(rawBody, signature);

      return { received: true };
    } catch (err) {
      throw new BadRequestException(
        `Invalid Stripe webhook signature: ${err.message}`,
      );
    }
  }
}
