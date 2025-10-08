import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  Headers,
  RawBodyRequest,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { PaymentService } from '../services/payment.service';
import { WebhookService } from '../services/webhook.service';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { RefundPaymentDto } from '../dto/refund-payment.dto';
import { PaymentResponseDto } from '../dto/payment-response.dto';
import { GetUser } from 'src/modules/authentication/decorators/jwt-payload.decorator';
import { AccessTokenPayload } from 'src/modules/authentication/dto/forgot-password.dto';
import { JwtAuthGuard } from 'src/modules/authentication/guards/jwt-auth.guard';
import { ApiDocs } from 'src/common/doc/common-docs';
import { DataSource, QueryRunner } from 'typeorm';
import { PaymentEntity } from '../entities/payment.entity';
import { IResponse } from 'src/common/response/interfaces/response.interface';

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
