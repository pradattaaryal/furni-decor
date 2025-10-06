import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from '../services/payment.service';
import {
  ConfirmPaymentDto,
  CreatePaymentDto,
  PaymentIntentDto,
} from '../dto/payment.create.dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.createPayment(createPaymentDto);
  }

  @Post('intent')
  async createPaymentIntent(@Body() paymentIntentDto: PaymentIntentDto) {
    return this.paymentService.createPaymentIntent(paymentIntentDto);
  }

  @Post('confirm')
  @HttpCode(HttpStatus.OK)
  async confirmPayment(@Body() confirmPaymentDto: ConfirmPaymentDto) {
    return this.paymentService.confirmPayment(confirmPaymentDto);
  }

  @Post(':id/refund')
  async refundPayment(
    @Param('id') paymentId: string,
    @Body('amount') amount?: number,
  ) {
    return this.paymentService.refundPayment(paymentId, amount);
  }

  @Get(':id')
  async getPayment(@Param('id') id: string) {
    return this.paymentService.findPaymentById(id);
  }

  @Get(':id/status')
  async getPaymentStatus(@Param('id') id: string) {
    return this.paymentService.getPaymentStatus(id);
  }

  @Get('user/:userId')
  async getUserPayments(@Param('userId') userId: string) {
    return this.paymentService.getUserPayments(userId);
  }
}
