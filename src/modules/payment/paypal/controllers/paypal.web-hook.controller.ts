// import {
//   BadRequestException,
//   Controller,
//   Post,
//   Req,
//   SerializeOptions,
// } from '@nestjs/common';
// import { ALL_GROUP } from 'src/common/database/constant/serialization-group.constant';
// import { Request } from 'express';
// import { PayPalService } from '../services/paypal.service';

// @SerializeOptions({
//   groups: ALL_GROUP,
// })
// @Controller('paypal/webhook')
// export class PayPalWebHookController {
//   constructor(private readonly _paypalService: PayPalService) {}
//   @Post()
//   async webhook(@Req() req: Request) {
//     if (!req.body) {
//       throw new BadRequestException();
//     }
//     await this._paypalService.handleWebhookEvent(req.body);
//     return { data: 'acknowledged' };
//   }
// } 