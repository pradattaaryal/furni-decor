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
import Stripe from 'stripe';
import { sign } from 'crypto';
import { ConfigService } from '@nestjs/config';

@Controller('payment')
export class PaymentController {
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
    const key = this.configService
      .get<string>('auth.AUTH_JWT_ACCESS_TOKEN_SECRET_KEY')
      ?.trim();
    try {
      console.log(`value fromm varieable${key}`);
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
    if (!paymentId) {
      throw new BadRequestException('Payment ID is required.');
    }

    const result = await this._paymentService.capturePayment(paymentId);
    return {
      data: result,
      message: result.success
        ? 'Payment captured successfully.'
        : 'Payment capture failed.',
    };
  }

  @Post('xxx')
  async stripeWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ): Promise<{ received: boolean }> {
    console.log('🟢 [Stripe Webhook] Incoming request');

    const rawBody = req.rawBody; // this must be a Buffer

    if (!signature) throw new BadRequestException('Missing Stripe signature');
    if (!rawBody) throw new BadRequestException('Missing raw body');

    try {
      // const event = this.stripe.webhooks.constructEvent(
      //   rawBody,
      //   signature,
      //   'whsec_Ac6tAqU9fgS2JRBWNC7aQ8sXVfGksC0G',
      // );
      // console.log(event.type);
      await this.webhookService.handleStripeWebhook(rawBody, signature);

      return { received: true };
    } catch (err) {
      console.error('🚨 Stripe verification failed:', err.message);
      throw new BadRequestException(
        `Invalid Stripe webhook signature: ${err.message}`,
      );
    }
  }

  // @Post('yyy')
  // async paypalWebhook(
  //   @Headers('paypal-transmission-sig') signature: string,
  //   @Body() payload: any,
  // ): Promise<{ received: boolean }> {
  //   await this.webhookService.handlePayPalWebhook(payload, signature);
  //   return { received: true };
  // }
}
