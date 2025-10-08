import {
  Body,
  Controller,
  Headers,
  Post,
  RawBodyRequest,
  Req,
  UseGuards
} from '@nestjs/common';
import { Request } from 'express';
import { ApiDocs } from 'src/common/doc/common-docs';
import { GetUser } from 'src/modules/authentication/decorators/jwt-payload.decorator';
import { AccessTokenPayload } from 'src/modules/authentication/dto/forgot-password.dto';
import { JwtAuthGuard } from 'src/modules/authentication/guards/jwt-auth.guard';
import { DataSource } from 'typeorm';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { PaymentService } from '../services/payment.service';
import { WebhookService } from '../services/webhook.service';

@Controller('payments')
export class PaymentController {
  private _dataSource: any;
  constructor(
    private readonly _paymentService: PaymentService,
    private readonly webhookService: WebhookService,
    private _connection: DataSource,
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

   
  @Post('webhooks/stripe')
  async stripeWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ): Promise<{ received: boolean }> {
    const payload = req.rawBody || req.body;
    await this.webhookService.handleStripeWebhook(payload, signature);
    return { received: true };
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
