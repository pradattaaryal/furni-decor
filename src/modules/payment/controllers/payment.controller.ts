import {
  BadRequestException,
  Body,
  Controller,
  Headers,
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

@Controller('payment')
export class PaymentController {
  private readonly stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-08-27.basil',
  });
  private readonly webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
  constructor(
    private readonly _paymentService: PaymentService,
    private readonly webhookService: WebhookService,
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

  // @Post('webhooks/stripe')
  // async stripeWebhook(
  //   @Headers('stripe-signature') signature: string,
  //   @Req() req: RawBodyRequest<Request>,
  // ): Promise<{ received: boolean }> {
  //   const payload = req.rawBody || req.body;
  //   await this.webhookService.handleStripeWebhook(payload, signature);
  //   return { received: true };
  // }

  @Post('xxx')
  async stripeWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ): Promise<{ received: boolean }> {
    console.log('🟢 [Stripe Webhook] Incoming request');

    const rawBody = req.rawBody; // this must be a Buffer
    console.log('Signature:', signature);
    console.log('Raw body type:', typeof rawBody);
    console.log('Raw body length:', rawBody?.length);
    console.log('Webhook secret:', this.webhookSecret);

    if (!signature) throw new BadRequestException('Missing Stripe signature');
    if (!rawBody) throw new BadRequestException('Missing raw body');

    try {
      const event = this.stripe.webhooks.constructEvent(
        rawBody, // must be Buffer or string of raw JSON
        signature,
        'whsec_00b0811384baf145ffad28a2513a7081ab6d3a23d396580a31ba11cbe41142b7',
      );

      console.log('✅ Stripe event received:', event.type);
      console.log('📦 Event data:', JSON.stringify(event.data.object, null, 2));

      // Optionally forward to webhookService
      //await this.webhookService.handleStripeWebhook(event);

      return { received: true };
    } catch (err) {
      console.error('🚨 Stripe verification failed:', err.message);
      throw new BadRequestException(
        `Invalid Stripe webhook signature: ${err.message}`,
      );
    }
  }

  @Post('webhooks/paypal')
  async paypalWebhook(
    @Headers('paypal-transmission-sig') signature: string,
    @Body() payload: any,
  ): Promise<{ received: boolean }> {
    await this.webhookService.handlePayPalWebhook(payload, signature);
    return { received: true };
  }
}
